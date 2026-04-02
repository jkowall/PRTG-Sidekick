import { useState } from 'react'
import { Activity, Bell, BellOff, TrendingDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

// Generate realistic ping data with noise patterns
function generateData() {
  const data = []
  const hours = 72
  for (let i = 0; i < hours; i++) {
    const baseLatency = 12 + Math.sin(i / 6) * 3
    const noise = Math.random() * 2 - 1
    const spike = Math.random() > 0.92 ? 15 + Math.random() * 20 : 0
    const latency = Math.max(1, baseLatency + noise + spike)

    data.push({
      hour: `${String(Math.floor(i / 24)).padStart(1, '')}d ${String(i % 24).padStart(2, '0')}:00`,
      latency: parseFloat(latency.toFixed(1)),
      baseline: parseFloat(baseLatency.toFixed(1)),
      staticThreshold: 20,
      dynamicWarning: parseFloat((baseLatency + 8).toFixed(1)),
      dynamicError: parseFloat((baseLatency + 16).toFixed(1)),
    })
  }
  return data
}

const chartData = generateData()
const staticAlerts = chartData.filter(d => d.latency > 20).length
const dynamicAlerts = chartData.filter(d => d.latency > d.dynamicWarning).length

const sensorStats = [
  { label: 'Total Sensors Analyzed', value: '23', color: 'text-sp-accent' },
  { label: 'Excessive Alerts (7d)', value: '147', color: 'text-sp-down' },
  { label: 'Reduction with AI Tuning', value: '89%', color: 'text-sp-up' },
  { label: 'False Positive Rate', value: '73%', color: 'text-sp-unusual' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
      <div className="text-[10px] text-sp-text-tertiary mb-1">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="text-[12px] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-sp-text-secondary">{entry.name}:</span>
          <span className="text-sp-text-base font-medium">{entry.value}ms</span>
        </div>
      ))}
    </div>
  )
}

// Read current theme's CSS variable values for chart rendering
function useChartColors() {
  const root = typeof document !== 'undefined' ? document.documentElement : null
  const theme = root?.getAttribute('data-theme') || 'dark'
  return {
    grid: theme === 'light' ? '#E5E6E9' : '#253044',
    axis: theme === 'light' ? '#A4A6AF' : '#5c6a82',
  }
}

export default function SignalAgent() {
  const [mode, setMode] = useState('before')
  const chartColors = useChartColors()

  const isBefore = mode === 'before'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <Activity size={20} className="text-sp-up" />
            Signal Agent
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            Reduces alert noise through AI-driven baseline threshold tuning
          </p>
        </div>
        <div className="flex items-center gap-4">
          {sensorStats.map(({ label, value, color }) => (
            <div key={label} className="text-right">
              <div className={`text-[18px] font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-sp-text-tertiary uppercase tracking-[0.06em] max-w-20 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart panel */}
      <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[14px] font-medium text-sp-text-brand">Ping Latency — DMZ Segment (fw-dmz-01)</h2>
            <p className="text-[12px] text-sp-text-secondary mt-0.5">72-hour window — ICMP Round Trip Time</p>
          </div>
          {/* Toggle */}
          <div className="flex items-center bg-sp-bg-surface rounded-[4px] p-0.5 border border-sp-border-subtle">
            <button
              onClick={() => setMode('before')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[12px] font-bold tracking-[0.02em] transition-all duration-200 cursor-pointer ${
                isBefore
                  ? 'bg-sp-down-bg text-sp-down'
                  : 'text-sp-text-secondary hover:text-sp-text-base'
              }`}
            >
              <Bell size={12} />
              Before (Static)
            </button>
            <button
              onClick={() => setMode('after')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[12px] font-bold tracking-[0.02em] transition-all duration-200 cursor-pointer ${
                !isBefore
                  ? 'bg-sp-up-bg text-sp-up'
                  : 'text-sp-text-secondary hover:text-sp-text-base'
              }`}
            >
              <BellOff size={12} />
              After (AI Baseline)
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isBefore ? '#ef4444' : '#2678FF'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isBefore ? '#ef4444' : '#2678FF'} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: chartColors.axis }}
                tickLine={false}
                axisLine={{ stroke: '#253044' }}
                interval={11}
              />
              <YAxis
                tick={{ fontSize: 10, fill: chartColors.axis }}
                tickLine={false}
                axisLine={false}
                domain={[0, 45]}
                unit="ms"
              />
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
                stroke={isBefore ? '#ef4444' : '#2678FF'}
                strokeWidth={1.5}
                fill="url(#latencyGrad)"
                name="Latency"
              />

              {isBefore ? (
                <ReferenceLine
                  y={20}
                  stroke="#eab308"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  label={{ value: 'Static Threshold: 20ms', position: 'right', fontSize: 10, fill: '#eab308' }}
                />
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="dynamicWarning"
                    stroke="#eab308"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    fill="none"
                    name="Dynamic Warning"
                  />
                  <Area
                    type="monotone"
                    dataKey="dynamicError"
                    stroke="#ef4444"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    fill="none"
                    name="Dynamic Error"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Comparison Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-[8px] border p-4 transition-all duration-200 ${
          isBefore ? 'bg-sp-down-bg border-sp-down/30' : 'bg-sp-bg-raised border-sp-border-subtle opacity-60'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Bell size={14} className="text-sp-down" />
            <span className="text-[12px] font-bold text-sp-text-brand">Static Threshold (Before)</span>
          </div>
          <div className="text-[30px] font-bold text-sp-down">{staticAlerts}</div>
          <div className="text-[12px] text-sp-text-secondary mt-1">Alerts triggered in 72h window</div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-sp-text-secondary">Threshold</span>
              <span className="text-sp-text-base">Fixed 20ms</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-sp-text-secondary">False positive rate</span>
              <span className="text-sp-unusual">~73%</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-sp-text-secondary">Alert fatigue risk</span>
              <span className="text-sp-down font-bold">HIGH</span>
            </div>
          </div>
        </div>

        <div className={`rounded-[8px] border p-4 transition-all duration-200 ${
          !isBefore ? 'bg-sp-up-bg border-sp-up/30' : 'bg-sp-bg-raised border-sp-border-subtle opacity-60'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-sp-up" />
            <span className="text-[12px] font-bold text-sp-text-brand">AI Baseline (After)</span>
          </div>
          <div className="text-[30px] font-bold text-sp-up">{dynamicAlerts}</div>
          <div className="text-[12px] text-sp-text-secondary mt-1">Alerts triggered in 72h window</div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-sp-text-secondary">Threshold</span>
              <span className="text-sp-text-base">Baseline + 2σ (dynamic)</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-sp-text-secondary">False positive rate</span>
              <span className="text-sp-up">~8%</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-sp-text-secondary">Alert fatigue risk</span>
              <span className="text-sp-up font-bold">LOW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
