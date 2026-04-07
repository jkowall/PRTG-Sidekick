import { useMemo } from 'react'
import { Activity, Bell, BellOff, TrendingDown, Wand2 } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { buildSignalChartData } from '../demoData'
import { useDemo } from '../demoContext'

function useChartColors() {
  const root = typeof document !== 'undefined' ? document.documentElement : null
  const theme = root?.getAttribute('data-theme') || 'dark'

  return {
    grid: theme === 'light' ? '#E5E6E9' : '#253044',
    axis: theme === 'light' ? '#A4A6AF' : '#5c6a82',
  }
}

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
          <span className="font-medium text-sp-text-base">{entry.value}ms</span>
        </div>
      ))}
    </div>
  )
}

export default function SignalAgent() {
  const { state, derived, actions } = useDemo()
  const chartColors = useChartColors()
  const chartData = useMemo(() => buildSignalChartData(), [])
  const isBefore = state.signalMode === 'before'
  const isExecutive = state.viewMode === 'executive'
  const signalView = derived.signalView

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
            <Activity size={20} className="text-sp-up" />
            Signal Agent
          </h1>
          <p className="mt-1 text-[13px] text-sp-text-alt">
            Alert-noise reduction with dynamic baselines and approval-driven rollout.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {signalView.sensorStats.map((item) => (
            <div key={item.label} className="text-right">
              <div className={`text-[18px] font-bold ${item.color}`}>{item.value}</div>
              <div className="max-w-20 text-[10px] uppercase leading-tight tracking-[0.06em] text-sp-text-tertiary">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {isExecutive && (
        <div className="mb-5 rounded-[12px] border border-sp-accent/20 bg-sp-accent-soft p-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-sp-accent">Executive View</div>
          <p className="mt-1 text-[13px] leading-[19px] text-sp-text-base">
            {signalView.focus}
          </p>
        </div>
      )}

      <div className="mb-5 rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-medium text-sp-text-brand">{signalView.title}</h2>
            <p className="mt-0.5 text-[12px] text-sp-text-secondary">{signalView.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-[4px] border border-sp-border-subtle bg-sp-bg-surface p-0.5">
              <button
                type="button"
                onClick={() => actions.setSignalMode('before')}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-[12px] font-bold transition-colors ${
                  isBefore ? 'bg-sp-down-bg text-sp-down' : 'text-sp-text-secondary hover:text-sp-text-base'
                }`}
              >
                <Bell size={12} />
                Before
              </button>
              <button
                type="button"
                onClick={() => actions.setSignalMode('after')}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-[12px] font-bold transition-colors ${
                  !isBefore ? 'bg-sp-up-bg text-sp-up' : 'text-sp-text-secondary hover:text-sp-text-base'
                }`}
              >
                <BellOff size={12} />
                After
              </button>
            </div>

            <button
              type="button"
              onClick={actions.queueSignalPlan}
              disabled={state.thresholdsApplied || state.approvalsPending.some((item) => item.sourceType === 'signal')}
              className="flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-sp-accent px-4 py-1.5 text-[12px] font-bold tracking-[0.02em] text-white transition-colors hover:bg-sp-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Wand2 size={12} />
              {state.thresholdsApplied ? 'Thresholds Applied' : 'Submit Tuning Plan'}
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-sp-bg-surface px-2.5 py-1 text-sp-text-secondary">
            Scenario: <span className="font-medium text-sp-text-base">{derived.scenario.label}</span>
          </span>
          <span className="rounded-full bg-sp-bg-surface px-2.5 py-1 text-sp-text-secondary">
            Scale: <span className="font-medium text-sp-text-base">{derived.scale.label}</span>
          </span>
          <span className="rounded-full bg-sp-bg-surface px-2.5 py-1 text-sp-text-secondary">
            {signalView.routeNote}
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isBefore ? '#ef4444' : '#0F67FF'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isBefore ? '#ef4444' : '#0F67FF'} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: chartColors.axis }} tickLine={false} axisLine={{ stroke: chartColors.grid }} interval={11} />
              <YAxis tick={{ fontSize: 10, fill: chartColors.axis }} tickLine={false} axisLine={false} domain={[0, 45]} unit="ms" />
              <Tooltip content={<CustomTooltip />} />

              {!isBefore && (
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="#22c55e"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#baselineGrad)"
                  name="Baseline"
                />
              )}

              <Area
                type="monotone"
                dataKey="latency"
                stroke={isBefore ? '#ef4444' : '#0F67FF'}
                strokeWidth={1.5}
                fill="url(#latencyGrad)"
                name="Latency"
              />

              <Area
                type="monotone"
                dataKey={isBefore ? 'staticThreshold' : 'dynamicWarning'}
                stroke={isBefore ? '#eab308' : '#eab308'}
                strokeDasharray="5 4"
                strokeWidth={1.2}
                fill="none"
                name={isBefore ? 'Static Threshold' : 'Dynamic Warning'}
              />

              {!isBefore && (
                <Area type="monotone" dataKey="dynamicError" stroke="#ef4444" strokeDasharray="5 4" strokeWidth={1.2} fill="none" name="Dynamic Error" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={`rounded-[8px] border p-4 ${isBefore ? 'border-sp-down/30 bg-sp-down-bg' : 'border-sp-border-subtle bg-sp-bg-raised opacity-70'}`}>
          <div className="mb-2 flex items-center gap-2">
            <Bell size={14} className="text-sp-down" />
            <span className="text-[12px] font-bold text-sp-text-brand">Static Threshold</span>
          </div>
          <div className="text-[30px] font-bold text-sp-down">{signalView.staticAlerts}</div>
          <div className="mt-1 text-[12px] text-sp-text-secondary">Alerts triggered in the same 72-hour window.</div>
          <div className="mt-3 space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-sp-text-secondary">Threshold</span>
              <span className="text-sp-text-base">Fixed 20ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sp-text-secondary">False positive rate</span>
              <span className="text-sp-unusual">~73%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sp-text-secondary">Alert fatigue risk</span>
              <span className="font-bold text-sp-down">HIGH</span>
            </div>
          </div>
        </div>

        <div className={`rounded-[8px] border p-4 ${!isBefore ? 'border-sp-up/30 bg-sp-up-bg' : 'border-sp-border-subtle bg-sp-bg-raised opacity-70'}`}>
          <div className="mb-2 flex items-center gap-2">
            <TrendingDown size={14} className="text-sp-up" />
            <span className="text-[12px] font-bold text-sp-text-brand">AI Baseline</span>
          </div>
          <div className="text-[30px] font-bold text-sp-up">{signalView.dynamicAlerts}</div>
          <div className="mt-1 text-[12px] text-sp-text-secondary">Alerts after the dynamic baseline rollout.</div>
          <div className="mt-3 space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-sp-text-secondary">Threshold</span>
              <span className="text-sp-text-base">Baseline + 2 sigma</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sp-text-secondary">False positive rate</span>
              <span className="text-sp-up">~8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sp-text-secondary">Alert fatigue risk</span>
              <span className="font-bold text-sp-up">LOW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
