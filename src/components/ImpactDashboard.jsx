import { useState } from 'react'
import { Activity, BarChart3, Brain, Clock, Shield, TrendingUp, Zap } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDemo } from '../demoContext'

function useChartColors() {
  const root = typeof document !== 'undefined' ? document.documentElement : null
  const theme = root?.getAttribute('data-theme') || 'dark'

  return {
    grid: theme === 'light' ? '#E5E6E9' : '#253044',
    axis: theme === 'light' ? '#A4A6AF' : '#5c6a82',
  }
}

const periods = ['Last 2 Weeks', 'Last 4 Weeks', 'Last 6 Weeks', 'Last 3 Months', 'Year to Date']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-[4px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
      <div className="mb-1 text-[10px] text-sp-text-tertiary">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-[12px]">
          <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-sp-text-secondary">{entry.name}:</span>
          <span className="font-medium text-sp-text-base">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ImpactDashboard() {
  const { state, derived, data } = useDemo()
  const [period, setPeriod] = useState('Last 6 Weeks')
  const chartColors = useChartColors()
  const totalHours = derived.weeklyData.reduce((accumulator, item) => accumulator + item.hoursSaved, 0).toFixed(1)
  const isExecutive = state.viewMode === 'executive'

  const topMetrics = [
    { label: 'Hours Saved', value: derived.impact.hoursSaved, unit: 'hrs', description: 'live session + historical base', icon: Clock, color: 'text-sp-up', bg: 'bg-sp-up-bg' },
    { label: 'Alerts Eliminated', value: derived.impact.alertsEliminated.toLocaleString(), unit: '', description: 'noise removed by AI tuning', icon: Activity, color: 'text-sp-accent', bg: 'bg-sp-accent-soft' },
    { label: 'Coverage Gaps Closed', value: derived.impact.gapsClosed, unit: '', description: 'live approvals included', icon: Shield, color: 'text-sp-warning', bg: 'bg-sp-warning-bg' },
    { label: 'MTTR', value: derived.impact.mttrMinutes, unit: 'min', description: 'updated by resolution workflow', icon: Zap, color: 'text-sp-accent-tertiary', bg: 'bg-sp-unknown-bg' },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
            <BarChart3 size={20} className="text-sp-up" />
            NEO Impact Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-sp-text-alt">
            ROI, capacity, and governance metrics now update from live demo actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-sp-text-secondary">Period:</span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-[6px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-1.5 text-[12px] font-medium text-sp-text-brand outline-none focus:border-sp-accent"
          >
            {periods.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isExecutive && (
        <div className="mb-5 rounded-[12px] border border-sp-accent/20 bg-sp-accent-soft p-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-sp-accent">Executive View</div>
          <p className="mt-1 text-[13px] leading-[19px] text-sp-text-base">
            This view is built for the PR story. Approve actions in Coverage, Signal, and Resolution to prove that NEO creates measurable operational value, not just good-looking analysis.
          </p>
        </div>
      )}

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${metric.bg}`}>
                  <Icon size={18} className={metric.color} />
                </div>
                <span className={`text-[11px] font-bold ${metric.color}`}>Live</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-[28px] font-bold ${metric.color}`}>{metric.value}</span>
                {metric.unit && <span className="text-[14px] text-sp-text-secondary">{metric.unit}</span>}
              </div>
              <div className="mt-1 text-[11px] text-sp-text-tertiary">{metric.description}</div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-3">
          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-medium text-sp-text-brand">Hours Saved by NEO</h2>
                <p className="mt-0.5 text-[12px] text-sp-text-secondary">The last week updates when you execute live demo actions.</p>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-bold text-sp-up">{totalHours}h</div>
                <div className="text-[10px] text-sp-text-tertiary">aggregate over current window</div>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={derived.weeklyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="hoursSavedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: chartColors.axis }} tickLine={false} axisLine={{ stroke: chartColors.grid }} />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.axis }} tickLine={false} axisLine={false} unit="h" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="hoursSaved" stroke="#22c55e" strokeWidth={2} fill="url(#hoursSavedGrad)" name="Hours Saved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-5">
            <div className="mb-4">
              <h2 className="text-[14px] font-medium text-sp-text-brand">Alert Volume Reduction</h2>
              <p className="mt-0.5 text-[12px] text-sp-text-secondary">Signal approvals immediately change the most recent week.</p>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={derived.weeklyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: chartColors.axis }} tickLine={false} axisLine={{ stroke: chartColors.grid }} />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.axis }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="alertsReduced" fill="#0F67FF" radius={[4, 4, 0, 0]} name="Alerts Reduced" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <h2 className="mb-1 flex items-center gap-2 text-[14px] font-medium text-sp-text-brand">
              <TrendingUp size={14} className="text-sp-accent" />
              Team Capacity Shift
            </h2>
            <p className="mb-3 text-[11px] text-sp-text-secondary">Same visual, but now framed as a scenario-aware demo outcome.</p>
            {data.capacityData.map((row) => (
              <div key={row.label} className="mb-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-sp-text-brand">{row.label}</span>
                </div>
                <div className="flex h-6 overflow-hidden rounded-[4px]">
                  <div className="flex items-center justify-center bg-sp-down text-[9px] font-bold text-white" style={{ width: `${row.reactive}%` }}>
                    {row.reactive}%
                  </div>
                  <div className="flex items-center justify-center bg-sp-warning text-[9px] font-bold text-white" style={{ width: `${row.monitoring}%` }}>
                    {row.monitoring >= 8 ? `${row.monitoring}%` : ''}
                  </div>
                  <div className="flex items-center justify-center bg-sp-up text-[9px] font-bold text-white" style={{ width: `${row.strategic}%` }}>
                    {row.strategic}%
                  </div>
                  {row.freed && (
                    <div className="flex items-center justify-center bg-sp-accent text-[9px] font-bold text-white" style={{ width: `${row.freed}%` }}>
                      {row.freed}% freed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <h2 className="mb-3 flex items-center gap-2 text-[14px] font-medium text-sp-text-brand">
              <Brain size={14} className="text-sp-accent-tertiary" />
              Impact by Agent
            </h2>
            <div className="space-y-3">
              {derived.agentBreakdown.map((agent) => (
                <div key={agent.agent} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-sp-text-brand">{agent.agent}</span>
                    <span className="text-[14px] font-bold text-sp-up">{agent.hoursSaved}h</span>
                  </div>
                  <div className="mb-2 h-1.5 w-full rounded-full bg-sp-bg-surface-hover">
                    <div className={`h-full rounded-full ${agent.color}`} style={{ width: `${Math.min(agent.hoursSaved / 70, 1) * 100}%` }} />
                  </div>
                  <p className="text-[11px] leading-[15px] text-sp-text-secondary">{agent.impact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-accent/20 bg-sp-accent-soft p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-sp-accent" />
              <span className="text-[12px] font-bold text-sp-accent">Executive Summary</span>
            </div>
            <p className="text-[12px] leading-[18px] text-sp-text-base">
              NEO is currently demonstrating <strong>{derived.impact.hoursSaved} hours saved</strong>, <strong>{derived.impact.alertsEliminated.toLocaleString()} alerts eliminated</strong>, and an <strong>{derived.impact.mttrMinutes} minute MTTR</strong>.
              Because the metrics are tied to live approvals, the demo now proves operational leverage rather than just describing it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
