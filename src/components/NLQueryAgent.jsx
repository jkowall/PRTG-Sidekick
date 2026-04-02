import { useState } from 'react'
import { MessageSquare, Search, ArrowRight, Server, Activity, AlertTriangle, Clock, Database, Wifi, ChevronRight, Sparkles } from 'lucide-react'

const sampleQueries = [
  { text: 'Which devices have been down the most this month?', category: 'Status' },
  { text: 'Show me bandwidth usage for the server group', category: 'Performance' },
  { text: 'How many sensors are in warning state right now?', category: 'Status' },
  { text: 'What changed in the last 24 hours?', category: 'Changes' },
  { text: 'Compare CPU usage across all database servers', category: 'Performance' },
  { text: 'Which probes have the highest latency?', category: 'Performance' },
]

const queryResults = {
  'Which devices have been down the most this month?': {
    type: 'table',
    summary: 'I found 4 devices with downtime events this month. db-prod-02 leads with 3 incidents totaling 2h 14m, all related to storage I/O during backup windows.',
    data: [
      { device: 'db-prod-02', ip: '10.0.10.6', incidents: 3, totalDowntime: '2h 14m', lastDown: 'Mar 28, 14:32', trend: 'worsening' },
      { device: 'fw-edge-01', ip: '10.0.1.10', incidents: 2, totalDowntime: '0h 47m', lastDown: 'Mar 25, 03:12', trend: 'stable' },
      { device: 'ap-floor2-01', ip: '10.0.20.2', incidents: 1, totalDowntime: '0h 12m', lastDown: 'Mar 22, 11:45', trend: 'improving' },
      { device: 'sw-core-01', ip: '10.0.1.1', incidents: 1, totalDowntime: '0h 03m', lastDown: 'Mar 15, 09:01', trend: 'stable' },
    ],
  },
  'How many sensors are in warning state right now?': {
    type: 'stats',
    summary: '17 sensors are currently in warning state across 2 PRTG instances. The majority (12) are on the Production server, concentrated in the Core Infrastructure group.',
    stats: [
      { label: 'Warning Sensors', value: '17', icon: AlertTriangle, color: 'text-sp-warning', bg: 'bg-sp-warning-bg' },
      { label: 'Down Sensors', value: '4', icon: Activity, color: 'text-sp-down', bg: 'bg-sp-down-bg' },
      { label: 'Up Sensors', value: '1,226', icon: Activity, color: 'text-sp-up', bg: 'bg-sp-up-bg' },
      { label: 'Paused Sensors', value: '38', icon: Clock, color: 'text-sp-paused', bg: 'bg-sp-paused-bg' },
    ],
    breakdown: [
      { group: 'Core Infrastructure', count: 7, type: 'Ping, SNMP Traffic' },
      { group: 'Production Servers', count: 5, type: 'WMI Disk, CPU Load' },
      { group: 'Wireless Infrastructure', count: 3, type: 'SNMP Custom' },
      { group: 'DR Site', count: 2, type: 'Ping' },
    ],
  },
}

const trendColors = {
  worsening: 'text-sp-down',
  stable: 'text-sp-text-secondary',
  improving: 'text-sp-up',
}

export default function NLQueryAgent() {
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState([])

  const handleQuery = (q) => {
    const queryText = q || query
    if (!queryText.trim()) return
    setIsProcessing(true)
    setQuery('')

    setTimeout(() => {
      const result = queryResults[queryText] || {
        type: 'text',
        summary: `I analyzed your PRTG data for "${queryText}". In a production environment, NEO would query your live PRTG API, correlate data across all connected instances, and return structured results with actionable insights.`,
      }
      setActiveQuery({ text: queryText, result })
      setHistory(prev => [{ text: queryText, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)])
      setIsProcessing(false)
    }, 1200)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <MessageSquare size={20} className="text-sp-up" />
            Natural Language Query
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            Ask anything about your network in plain English — NEO translates to PRTG API calls
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[18px] font-bold text-sp-accent">2</div>
            <div className="text-[10px] text-sp-text-tertiary uppercase tracking-[0.06em]">Instances</div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-bold text-sp-up">1,559</div>
            <div className="text-[10px] text-sp-text-tertiary uppercase tracking-[0.06em]">Sensors</div>
          </div>
        </div>
      </div>

      {/* Query Input */}
      <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-5 mb-5">
        <div className="flex items-center gap-3 bg-sp-bg-surface rounded-[8px] px-4 py-3 border border-sp-border-subtle focus-within:border-sp-accent transition-colors duration-200">
          <Search size={18} className="text-sp-text-tertiary shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuery()}
            placeholder="Ask about your network... e.g. 'Which devices have been down the most this month?'"
            className="flex-1 bg-transparent text-[14px] text-sp-text-base placeholder:text-sp-text-disabled outline-none"
          />
          <button
            onClick={() => handleQuery()}
            disabled={!query.trim() || isProcessing}
            className="px-4 py-1.5 rounded-[6px] bg-sp-accent text-white text-[13px] font-bold hover:bg-sp-accent-hover active:bg-sp-accent-active transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Analyzing...' : 'Ask NEO'}
          </button>
        </div>

        {/* Sample queries */}
        <div className="mt-3 flex flex-wrap gap-2">
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => { setQuery(sq.text); handleQuery(sq.text) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-sp-bg-surface border border-sp-border-subtle text-[12px] text-sp-text-alt hover:text-sp-accent hover:border-sp-accent/30 transition-all duration-200 cursor-pointer"
            >
              <Sparkles size={10} className="text-sp-accent-tertiary" />
              {sq.text}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Results */}
        <div className="col-span-3">
          {isProcessing && (
            <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-8 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-sp-accent-soft flex items-center justify-center mb-3 animate-pulse">
                <Sparkles size={20} className="text-sp-accent" />
              </div>
              <div className="text-[14px] text-sp-text-brand font-medium">NEO is analyzing your PRTG data...</div>
              <div className="text-[12px] text-sp-text-secondary mt-1">Querying 2 instances, 1,559 sensors</div>
            </div>
          )}

          {!isProcessing && activeQuery && (
            <div className="space-y-4">
              {/* Query echo */}
              <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-sp-accent-soft flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-sp-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-1">NEO Response</div>
                    <p className="text-[13px] text-sp-text-base leading-[20px]">{activeQuery.result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Table result */}
              {activeQuery.result.type === 'table' && (
                <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle overflow-hidden">
                  <div className="px-4 py-3 border-b border-sp-border-subtle">
                    <div className="text-[12px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Query Results</div>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sp-border-subtle">
                        <th className="px-4 py-2 text-left text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Device</th>
                        <th className="px-4 py-2 text-left text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">IP</th>
                        <th className="px-4 py-2 text-center text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Incidents</th>
                        <th className="px-4 py-2 text-right text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Total Downtime</th>
                        <th className="px-4 py-2 text-right text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Last Down</th>
                        <th className="px-4 py-2 text-right text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeQuery.result.data.map((row, i) => (
                        <tr key={i} className="border-b border-sp-border-subtle/50 hover:bg-sp-bg-surface-hover transition-colors duration-200">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Server size={12} className="text-sp-text-secondary" />
                              <span className="text-[13px] font-medium text-sp-text-brand">{row.device}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-[12px] text-sp-text-secondary font-mono">{row.ip}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-[13px] font-bold ${row.incidents >= 3 ? 'text-sp-down' : row.incidents >= 2 ? 'text-sp-warning' : 'text-sp-text-base'}`}>
                              {row.incidents}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right text-[13px] text-sp-text-base font-mono">{row.totalDowntime}</td>
                          <td className="px-4 py-2.5 text-right text-[12px] text-sp-text-secondary">{row.lastDown}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`text-[11px] font-bold capitalize ${trendColors[row.trend]}`}>{row.trend}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Stats result */}
              {activeQuery.result.type === 'stats' && (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    {activeQuery.result.stats.map((stat, i) => {
                      const Icon = stat.icon
                      return (
                        <div key={i} className={`rounded-[8px] border border-sp-border-subtle p-3 ${stat.bg}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={14} className={stat.color} />
                            <span className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">{stat.label}</span>
                          </div>
                          <div className={`text-[24px] font-bold ${stat.color}`}>{stat.value}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
                    <div className="text-[12px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-3">Breakdown by Group</div>
                    <div className="space-y-2">
                      {activeQuery.result.breakdown.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-sp-border-subtle/50 last:border-0">
                          <div>
                            <div className="text-[13px] font-medium text-sp-text-brand">{item.group}</div>
                            <div className="text-[11px] text-sp-text-secondary">{item.type}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-sp-bg-surface overflow-hidden">
                              <div className="h-full rounded-full bg-sp-warning" style={{ width: `${(item.count / 17) * 100}%` }} />
                            </div>
                            <span className="text-[13px] font-bold text-sp-warning w-6 text-right">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {!isProcessing && !activeQuery && (
            <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-sp-accent-soft flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-sp-accent" />
              </div>
              <div className="text-[16px] font-medium text-sp-text-brand mb-1">Ask anything about your network</div>
              <p className="text-[13px] text-sp-text-secondary max-w-md">
                NEO translates your natural language questions into PRTG API queries, correlates data across all connected instances, and presents structured, actionable results.
              </p>
            </div>
          )}
        </div>

        {/* Query History + Capabilities */}
        <div className="col-span-2 space-y-4">
          {/* Capabilities */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3">What You Can Ask</h2>
            <div className="space-y-2.5">
              {[
                { icon: Server, label: 'Device Status', desc: 'Which devices are down, what changed, health summaries' },
                { icon: Activity, label: 'Performance Data', desc: 'CPU, memory, bandwidth trends and comparisons' },
                { icon: AlertTriangle, label: 'Alert Analysis', desc: 'Noisy sensors, alert history, threshold questions' },
                { icon: Database, label: 'Inventory Queries', desc: 'Sensor counts, device lists, group structure' },
                { icon: Wifi, label: 'Cross-Instance', desc: 'Compare across Production and DR site data' },
                { icon: Clock, label: 'Historical', desc: 'Uptime reports, SLA calculations, trend analysis' },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-[4px] bg-sp-accent-soft flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={12} className="text-sp-accent" />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-sp-text-brand">{label}</div>
                    <div className="text-[11px] text-sp-text-secondary leading-[15px]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Query History */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3">Recent Queries</h2>
            {history.length === 0 ? (
              <p className="text-[12px] text-sp-text-tertiary">No queries yet. Try one of the suggestions above.</p>
            ) : (
              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(h.text); handleQuery(h.text) }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-[6px] text-left hover:bg-sp-bg-surface-hover transition-colors duration-200 cursor-pointer"
                  >
                    <ChevronRight size={10} className="text-sp-text-tertiary shrink-0" />
                    <span className="flex-1 text-[12px] text-sp-text-alt truncate">{h.text}</span>
                    <span className="text-[10px] text-sp-text-disabled shrink-0">{h.time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
