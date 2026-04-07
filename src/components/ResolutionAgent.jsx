import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lightbulb,
  PlayCircle,
  Zap,
} from 'lucide-react'
import { useDemo } from '../demoContext'

const confidenceStyles = {
  leading: { border: 'border-sp-down/30', bg: 'bg-sp-down-bg', text: 'text-sp-down' },
  secondary: { border: 'border-sp-unusual/30', bg: 'bg-sp-unusual-bg', text: 'text-sp-unusual' },
  'ruled-out': { border: 'border-sp-accent/30', bg: 'bg-sp-accent-soft', text: 'text-sp-accent' },
}

export default function ResolutionAgent() {
  const { state, data, actions } = useDemo()
  const [expanded, setExpanded] = useState({ 1: true })
  const isExecutive = state.viewMode === 'executive'
  const hasPendingResolution = state.approvalsPending.some((item) => item.sourceType === 'resolution')

  const handleInsightLink = (linkLabel) => {
    if (linkLabel.includes('Coverage')) {
      actions.setCurrentModule('coverage')
      actions.recordEvent('resolution', 'Jumped from Resolution Agent to Coverage Agent to review the backup monitoring gap.')
      return
    }

    if (linkLabel.includes('History')) {
      actions.setCurrentModule('timeline')
      actions.recordEvent('resolution', 'Jumped from Resolution Agent to the Resolution Timeline.')
      return
    }

    if (linkLabel.includes('db-prod-01')) {
      actions.setCurrentModule('coverage')
      actions.recordEvent('resolution', 'Jumped from Resolution Agent to Coverage Agent to inspect db-prod-01 visibility.')
      return
    }

    actions.recordEvent('resolution', `Opened "${linkLabel}" from Resolution insights.`)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
            <AlertTriangle size={20} className="text-sp-up" />
            Resolution Agent
          </h1>
          <p className="mt-1 text-[13px] text-sp-text-alt">
            Root-cause analysis with confidence-ranked hypotheses, evidence, and approval-driven remediation.
          </p>
        </div>

        <button
          type="button"
          onClick={actions.queueResolutionPlan}
          disabled={hasPendingResolution || state.incidentResolved}
          className="flex cursor-pointer items-center gap-2 rounded-[6px] bg-sp-accent px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-sp-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlayCircle size={13} />
          {state.incidentResolved ? 'Incident Resolved' : hasPendingResolution ? 'Action Queued' : 'Queue Remediation'}
        </button>
      </div>

      <div className={`mb-5 rounded-[10px] border p-4 ${state.incidentResolved ? 'border-sp-up/30 bg-sp-up-bg' : 'border-sp-down/30 bg-sp-down-bg'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${state.incidentResolved ? 'bg-sp-up-bg border border-sp-up/20' : 'bg-sp-down-bg border border-sp-down/20'}`}>
              <Zap size={20} className={state.incidentResolved ? 'text-sp-up' : 'text-sp-down'} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-sp-text-brand">{data.incident.id}</span>
                <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${state.incidentResolved ? 'bg-sp-up text-white' : 'bg-sp-down text-white'}`}>
                  {state.incidentResolved ? 'Resolved' : data.incident.severity}
                </span>
              </div>
              <div className="mt-0.5 text-[12px] text-sp-text-secondary">
                {data.incident.affectedDevice} ({data.incident.ip}) - Started {data.incident.started}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-right">
            <div>
              <div className={`flex items-center gap-1 ${state.incidentResolved ? 'text-sp-up' : 'text-sp-down'}`}>
                <Clock size={12} />
                <span className="text-[14px] font-bold">{state.incidentResolved ? '5 min' : data.incident.duration}</span>
              </div>
              <div className="text-[10px] text-sp-text-tertiary">Resolution Window</div>
            </div>
            <div>
              <div className={`text-[14px] font-bold ${state.incidentResolved ? 'text-sp-up' : 'text-sp-down'}`}>{data.incident.downSensors.length}</div>
              <div className="text-[10px] text-sp-text-tertiary">Affected Sensors</div>
            </div>
          </div>
        </div>

        {isExecutive && (
          <p className="mt-3 text-[13px] leading-[18px] text-sp-text-base">
            This scenario is designed to show that NEO does not stop at diagnosis. It moves from evidence to an approved operational action and then reflects the result in the rest of the platform.
          </p>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        {!isExecutive && (
          <div className="space-y-4 xl:col-span-2">
            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
              <h2 className="mb-3 text-[14px] font-medium text-sp-text-brand">Affected Sensors</h2>
              <div className="space-y-2">
                {data.incident.downSensors.map((sensor) => {
                  const isDown = sensor.status === 'Down'
                  return (
                    <div key={sensor.name} className={`rounded-[8px] border p-3 ${isDown ? 'border-sp-down/30 bg-sp-down-bg' : 'border-sp-warning/30 bg-sp-warning-bg'}`}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[13px] font-medium text-sp-text-brand">{sensor.name}</span>
                        <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${isDown ? 'bg-sp-down text-white' : 'bg-sp-warning text-white'}`}>{sensor.status}</span>
                      </div>
                      <div className="text-[12px] font-mono text-sp-text-secondary">
                        {sensor.value} - since {sensor.since}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
              <h2 className="mb-3 flex items-center gap-2 text-[14px] font-medium text-sp-text-brand">
                <Lightbulb size={14} className="text-sp-warning" />
                NEO Insights
              </h2>
              <div className="space-y-3">
                {data.relatedInsights.map((insight) => (
                  <div key={insight.title} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                    <div className="text-[12px] font-medium text-sp-text-brand">{insight.title}</div>
                    <p className="mt-1 text-[11px] leading-[16px] text-sp-text-secondary">{insight.description}</p>
                    <button
                      type="button"
                      onClick={() => handleInsightLink(insight.linkLabel)}
                      className="mt-2 flex cursor-pointer items-center gap-1 text-[11px] text-sp-accent transition-colors hover:text-sp-accent-hover"
                    >
                      {insight.linkLabel}
                      <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={`space-y-3 ${isExecutive ? 'xl:col-span-5' : 'xl:col-span-3'}`}>
          <h2 className="text-[14px] font-medium text-sp-text-brand">Root Cause Analysis</h2>

          {data.hypotheses.map((hypothesis) => {
            const isOpen = expanded[hypothesis.id]
            const style = confidenceStyles[hypothesis.status]

            return (
              <div key={hypothesis.id} className={`rounded-[8px] border bg-sp-bg-raised ${style.border}`}>
                <button
                  type="button"
                  onClick={() => setExpanded((current) => ({ ...current, [hypothesis.id]: !current[hypothesis.id] }))}
                  className="flex w-full cursor-pointer items-center gap-3 p-4 text-left"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${style.bg}`}>
                    <Brain size={16} className={style.text} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-sp-text-tertiary">#{hypothesis.rank}</span>
                      <span className="text-[14px] font-medium text-sp-text-brand">{hypothesis.title}</span>
                    </div>
                    <div className="mt-0.5 text-[12px] text-sp-text-secondary">{hypothesis.summary}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[18px] font-bold ${style.text}`}>{hypothesis.confidence}%</div>
                    <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Confidence</div>
                  </div>
                  <ChevronRight size={14} className={`text-sp-text-tertiary transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-sp-border-subtle/50 px-4 pb-4 pt-3">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">
                          <BarChart3 size={10} />
                          Evidence Chain
                        </div>
                        <div className="space-y-2">
                          {hypothesis.evidence.map((evidence) => (
                            <div key={evidence.text} className="rounded-[6px] border border-sp-border-subtle/50 bg-sp-bg-surface p-2.5 text-[12px] text-sp-text-base">
                              {evidence.text}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">
                          <CheckCircle2 size={10} />
                          Recommended Next Steps
                        </div>
                        <div className="space-y-2">
                          {hypothesis.guidance.map((step) => (
                            <div key={step} className="rounded-[6px] border border-sp-border-subtle/50 bg-sp-bg-surface p-2.5 text-[12px] text-sp-text-base">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
