import { useState } from 'react'
import { Activity, Clock, MessageSquare, Search, Server, Sparkles } from 'lucide-react'
import { useDemo } from '../demoContext'

const trendColors = {
  worsening: 'text-sp-down',
  stable: 'text-sp-text-secondary',
  improving: 'text-sp-up',
}

export default function NLQueryAgent() {
  const { state, derived, data, actions } = useDemo()
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleQuery = (nextQuery) => {
    const queryText = nextQuery || query
    if (!queryText.trim()) {
      return
    }

    setIsProcessing(true)
    setQuery('')

    window.setTimeout(() => {
      actions.submitQuery(queryText)
      setIsProcessing(false)
    }, 550)
  }

  const activeResult = state.queryState.activeResult
  const isExecutive = state.viewMode === 'executive'

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
            <MessageSquare size={20} className="text-sp-up" />
            Natural Language Query
          </h1>
          <p className="mt-1 text-[13px] text-sp-text-alt">
            A broader query library now makes the demo feel conversational instead of canned.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[18px] font-bold text-sp-accent">{derived.scale.instances}</div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Instances</div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-bold text-sp-up">{derived.scale.sensors.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Sensors</div>
          </div>
        </div>
      </div>

      {isExecutive && (
        <div className="mb-5 rounded-[12px] border border-sp-accent/20 bg-sp-accent-soft p-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-sp-accent">Executive View</div>
          <p className="mt-1 text-[13px] leading-[19px] text-sp-text-base">
            The goal here is to show that NEO can answer business and operational questions with structured outputs, not just free-form chat.
          </p>
        </div>
      )}

      <div className="mb-5 rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-5">
        <div className="flex items-center gap-3 rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-4 py-3 transition-colors duration-200 focus-within:border-sp-accent">
          <Search size={18} className="shrink-0 text-sp-text-tertiary" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleQuery()}
            placeholder="Ask about downtime, warnings, changes, CPU comparisons, or bandwidth..."
            className="flex-1 bg-transparent text-[14px] text-sp-text-base placeholder:text-sp-text-disabled outline-none"
          />
          <button
            type="button"
            onClick={() => handleQuery()}
            disabled={!query.trim() || isProcessing}
            className="cursor-pointer rounded-[6px] bg-sp-accent px-4 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-sp-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isProcessing ? 'Analyzing...' : 'Ask NEO'}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {data.queryCatalog.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleQuery(item.label)}
              className="flex cursor-pointer items-center gap-1.5 rounded-[6px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-1.5 text-[12px] text-sp-text-alt transition-colors hover:border-sp-accent/30 hover:text-sp-accent"
            >
              <Sparkles size={10} className="text-sp-accent-tertiary" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-3">
          {isProcessing && (
            <div className="flex flex-col items-center justify-center rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-8">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sp-accent-soft animate-pulse">
                <Sparkles size={20} className="text-sp-accent" />
              </div>
              <div className="text-[14px] font-medium text-sp-text-brand">NEO is analyzing your PRTG data...</div>
              <div className="mt-1 text-[12px] text-sp-text-secondary">
                Querying {derived.scale.instances} instances and {derived.scale.sensors.toLocaleString()} sensors
              </div>
            </div>
          )}

          {!isProcessing && activeResult && (
            <div className="space-y-4">
              <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sp-accent-soft">
                    <Sparkles size={14} className="text-sp-accent" />
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">NEO Response</div>
                    <p className="text-[13px] leading-[20px] text-sp-text-base">{activeResult.summary}</p>
                  </div>
                </div>
              </div>

              {activeResult.type === 'table' && (
                <div className="overflow-hidden rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sp-border-subtle">
                        <th className="px-4 py-2 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Device</th>
                        <th className="px-4 py-2 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">IP</th>
                        <th className="px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Incidents</th>
                        <th className="px-4 py-2 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Downtime</th>
                        <th className="px-4 py-2 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Last Down</th>
                        <th className="px-4 py-2 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeResult.data.map((row) => (
                        <tr key={row.device} className="border-b border-sp-border-subtle/50">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Server size={12} className="text-sp-text-secondary" />
                              <span className="text-[13px] font-medium text-sp-text-brand">{row.device}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-[12px] font-mono text-sp-text-secondary">{row.ip}</td>
                          <td className="px-4 py-2.5 text-center text-[13px] font-bold text-sp-text-base">{row.incidents}</td>
                          <td className="px-4 py-2.5 text-right text-[13px] text-sp-text-base">{row.totalDowntime}</td>
                          <td className="px-4 py-2.5 text-right text-[12px] text-sp-text-secondary">{row.lastDown}</td>
                          <td className={`px-4 py-2.5 text-right text-[11px] font-bold capitalize ${trendColors[row.trend]}`}>{row.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeResult.type === 'stats' && (
                <>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {activeResult.stats.map((stat) => (
                      <div key={stat.label} className={`rounded-[8px] border border-sp-border-subtle p-3 ${stat.bg}`}>
                        <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">{stat.label}</div>
                        <div className={`mt-1 text-[24px] font-bold ${stat.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
                    <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Breakdown by Group</div>
                    <div className="space-y-2">
                      {activeResult.breakdown.map((item) => (
                        <div key={item.group} className="flex items-center justify-between border-b border-sp-border-subtle/50 py-2 last:border-0">
                          <div>
                            <div className="text-[13px] font-medium text-sp-text-brand">{item.group}</div>
                            <div className="text-[11px] text-sp-text-secondary">{item.type}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-sp-bg-surface">
                              <div className="h-full rounded-full bg-sp-warning" style={{ width: `${(item.count / 17) * 100}%` }} />
                            </div>
                            <span className="w-6 text-right text-[13px] font-bold text-sp-warning">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeResult.type === 'timeline' && (
                <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
                  <div className="space-y-3">
                    {activeResult.events.map((event) => (
                      <div key={`${event.time}-${event.label}`} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-sp-text-brand">{event.label}</span>
                          <span className="text-[11px] font-mono text-sp-text-tertiary">{event.time}</span>
                        </div>
                        <p className="mt-1 text-[12px] leading-[17px] text-sp-text-secondary">{event.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeResult.type === 'compare' && (
                <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
                  <div className="space-y-2">
                    {activeResult.rows.map((row) => (
                      <div key={row.device} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                        <div className="text-[13px] font-medium text-sp-text-brand">{row.device}</div>
                        <div className="mt-1 flex gap-4 text-[12px] text-sp-text-secondary">
                          <span>Baseline: {row.baseline}</span>
                          <span>Peak: {row.peak}</span>
                        </div>
                        <p className="mt-1 text-[12px] leading-[17px] text-sp-text-secondary">{row.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeResult.type === 'text' && (
                <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4 text-[13px] leading-[20px] text-sp-text-base">
                  {activeResult.summary}
                </div>
              )}
            </div>
          )}

          {!isProcessing && !activeResult && (
            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-6 text-[13px] text-sp-text-secondary">
              Run one of the suggested queries to show structured answers with different output types.
            </div>
          )}
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Recent Questions</div>
            <div className="space-y-2">
              {state.queryState.history.length ? (
                state.queryState.history.map((item) => (
                  <div key={`${item.text}-${item.time}`} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                    <div className="text-[12px] font-medium text-sp-text-brand">{item.text}</div>
                    <div className="mt-1 text-[10px] text-sp-text-tertiary">{item.time}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3 text-[12px] text-sp-text-secondary">
                  Your last ten queries will appear here.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Why This Matters in the Demo</div>
            <div className="space-y-2 text-[12px] text-sp-text-secondary">
              <div className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                Structured answers prove NEO can move from natural language to operationally useful outputs.
              </div>
              <div className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                The query history persists with the rest of the demo state, so the conversation feels cumulative.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
