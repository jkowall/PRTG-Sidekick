import { useState } from 'react'
import { BarChart3, TrendingUp, Clock, Shield, Activity, Zap, Users, ArrowUpRight, ArrowDownRight, CheckCircle2, Brain } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const weeklyData = [
  { week: 'W9', hoursSaved: 4.2, alertsReduced: 23, sensorsDeployed: 2, incidentsResolved: 1 },
  { week: 'W10', hoursSaved: 6.8, alertsReduced: 41, sensorsDeployed: 3, incidentsResolved: 2 },
  { week: 'W11', hoursSaved: 8.1, alertsReduced: 58, sensorsDeployed: 5, incidentsResolved: 1 },
  { week: 'W12', hoursSaved: 11.4, alertsReduced: 89, sensorsDeployed: 4, incidentsResolved: 3 },
  { week: 'W13', hoursSaved: 14.2, alertsReduced: 112, sensorsDeployed: 7, incidentsResolved: 2 },
  { week: 'W14', hoursSaved: 16.8, alertsReduced: 134, sensorsDeployed: 5, incidentsResolved: 4 },
]

const capacityData = [
  { label: 'Before NEO', reactive: 50, monitoring: 10, strategic: 40 },
  { label: 'With NEO', reactive: 8, monitoring: 7, strategic: 45, freed: 40 },
]

const topMetrics = [
  {
    label: 'Hours Saved This Month',
    value: '61.5',
    unit: 'hrs',
    change: '+38%',
    trend: 'up',
    icon: Clock,
    color: 'text-sp-up',
    bg: 'bg-sp-up-bg',
    description: 'vs. previous month',
  },
  {
    label: 'Alerts Eliminated',
    value: '457',
    unit: '',
    change: '-89%',
    trend: 'down',
    icon: Activity,
    color: 'text-sp-accent',
    bg: 'bg-sp-accent-soft',
    description: 'noise reduction',
  },
  {
    label: 'Coverage Gaps Closed',
    value: '26',
    unit: '',
    change: '+12',
    trend: 'up',
    icon: Shield,
    color: 'text-sp-warning',
    bg: 'bg-sp-warning-bg',
    description: 'sensors deployed',
  },
  {
    label: 'Mean Time to Resolution',
    value: '8',
    unit: 'min',
    change: '-82%',
    trend: 'down',
    icon: Zap,
    color: 'text-sp-accent-tertiary',
    bg: 'bg-sp-unknown-bg',
    description: 'from 45min avg',
  },
]

const agentBreakdown = [
  { agent: 'Coverage Agent', hoursSaved: 18.2, actions: 26, impact: 'Deployed 26 missing sensors across 14 devices', color: 'bg-sp-up' },
  { agent: 'Signal Agent', hoursSaved: 28.7, actions: 457, impact: 'Reduced alert volume by 89% through dynamic baselines', color: 'bg-sp-accent' },
  { agent: 'Resolution Agent', hoursSaved: 14.6, actions: 13, impact: 'Resolved 13 incidents with avg 8min time-to-resolution', color: 'bg-sp-accent-tertiary' },
]

function useChartColors() {
  const root = typeof document !== 'undefined' ? document.documentElement : null
  const theme = root?.getAttribute('data-theme') || 'dark'
  return {
    grid: theme === 'light' ? '#E5E6E9' : '#253044',
    axis: theme === 'light' ? '#A4A6AF' : '#5c6a82',
  }
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
      <div className="text-[10px] text-sp-text-tertiary mb-1">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="text-[12px] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-sp-text-secondary">{entry.name}:</span>
          <span className="text-sp-text-base font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ImpactDashboard() {
  const chartColors = useChartColors()

  const totalHours = weeklyData.reduce((acc, w) => acc + w.hoursSaved, 0).toFixed(1)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <BarChart3 size={20} className="text-sp-up" />
            NEO Impact Dashboard
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            Measurable ROI from AI-driven monitoring — capacity reclaimed without hiring
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-sp-bg-surface border border-sp-border-subtle">
          <span className="text-[12px] text-sp-text-secondary">Period:</span>
          <span className="text-[12px] font-medium text-sp-text-brand">Last 6 Weeks</span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {topMetrics.map((metric) => {
          const Icon = metric.icon
          const isPositive = metric.trend === 'up'
          return (
            <div key={metric.label} className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-[8px] ${metric.bg} flex items-center justify-center`}>
                  <Icon size={18} className={metric.color} />
                </div>
                <div className={`flex items-center gap-1 text-[12px] font-bold ${metric.color}`}>
                  {metric.label === 'Alerts Eliminated' || metric.label === 'Mean Time to Resolution' ? (
                    <ArrowDownRight size={14} className="text-sp-up" />
                  ) : (
                    <ArrowUpRight size={14} />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-[28px] font-bold ${metric.color}`}>{metric.value}</span>
                {metric.unit && <span className="text-[14px] text-sp-text-secondary">{metric.unit}</span>}
              </div>
              <div className="text-[11px] text-sp-text-tertiary mt-1">{metric.description}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Trend Chart */}
        <div className="col-span-3 space-y-5">
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-medium text-sp-text-brand">Hours Saved by NEO — Weekly Trend</h2>
                <p className="text-[12px] text-sp-text-secondary mt-0.5">Cumulative time reclaimed from automated monitoring tasks</p>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-bold text-sp-up">{totalHours}h</div>
                <div className="text-[10px] text-sp-text-tertiary">total over 6 weeks</div>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
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

          {/* Alert Reduction Chart */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-medium text-sp-text-brand">Alert Volume Reduction — Weekly</h2>
                <p className="text-[12px] text-sp-text-secondary mt-0.5">Noisy alerts eliminated by Signal Agent</p>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
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

        {/* Right Column */}
        <div className="col-span-2 space-y-4">
          {/* Capacity Shift */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-1 flex items-center gap-2">
              <Users size={14} className="text-sp-accent" />
              Team Capacity Shift
            </h2>
            <p className="text-[11px] text-sp-text-secondary mb-3">How NEO reclaims time from reactive work</p>

            {capacityData.map((row, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-medium text-sp-text-brand">{row.label}</span>
                </div>
                <div className="flex h-6 rounded-[4px] overflow-hidden">
                  <div className="bg-sp-down flex items-center justify-center" style={{ width: `${row.reactive}%` }}>
                    <span className="text-[9px] text-white font-bold">{row.reactive}%</span>
                  </div>
                  <div className="bg-sp-warning flex items-center justify-center" style={{ width: `${row.monitoring}%` }}>
                    {row.monitoring >= 8 && <span className="text-[9px] text-white font-bold">{row.monitoring}%</span>}
                  </div>
                  <div className="bg-sp-up flex items-center justify-center" style={{ width: `${row.strategic}%` }}>
                    <span className="text-[9px] text-white font-bold">{row.strategic}%</span>
                  </div>
                  {row.freed && (
                    <div className="bg-sp-accent flex items-center justify-center" style={{ width: `${row.freed}%` }}>
                      <span className="text-[9px] text-white font-bold">{row.freed}% freed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { color: 'bg-sp-down', label: 'Reactive' },
                { color: 'bg-sp-warning', label: 'Monitoring' },
                { color: 'bg-sp-up', label: 'Strategic' },
                { color: 'bg-sp-accent', label: 'Freed by NEO' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-[2px] ${color}`} />
                  <span className="text-[10px] text-sp-text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Breakdown */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3 flex items-center gap-2">
              <Brain size={14} className="text-sp-accent-tertiary" />
              Impact by Agent
            </h2>
            <div className="space-y-3">
              {agentBreakdown.map((agent, i) => (
                <div key={i} className="bg-sp-bg-surface rounded-[8px] p-3 border border-sp-border-subtle/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-sp-text-brand">{agent.agent}</span>
                    <span className="text-[14px] font-bold text-sp-up">{agent.hoursSaved}h</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-sp-bg-surface-hover mb-2">
                    <div className={`h-full rounded-full ${agent.color}`} style={{ width: `${(agent.hoursSaved / 30) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-sp-text-secondary leading-[15px]">{agent.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Board Summary */}
          <div className="bg-sp-accent-soft rounded-[12px] border border-sp-accent/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-sp-accent" />
              <span className="text-[12px] font-bold text-sp-accent">Executive Summary</span>
            </div>
            <p className="text-[12px] text-sp-text-base leading-[18px]">
              NEO has reclaimed <strong>61.5 hours</strong> of team capacity this month — equivalent to <strong>1.5 FTEs</strong> — by automating alert triage, sensor deployment, and incident analysis. Alert noise is down 89%, mean resolution time dropped from 45 to 8 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
