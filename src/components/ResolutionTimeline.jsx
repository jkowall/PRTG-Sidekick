import { ArrowRight, Bot, Clock, User, Zap } from 'lucide-react'
import { useDemo } from '../demoContext'

export default function ResolutionTimeline() {
  const { state, data } = useDemo()
  const manualDuration = '1h 30m'
  const neoDuration = state.incidentResolved ? '5 min' : 'Pending approval'
  const currentIncident = data.incident

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
          <Clock size={20} className="text-sp-up" />
          Resolution Timeline
        </h1>
        <p className="mt-1 text-[13px] text-sp-text-alt">
          Same incident, two workflows. The NEO lane now completes when the remediation approval is executed.
        </p>
      </div>

      <div className="mb-5 rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-sp-down-bg border border-sp-down/20">
              <Zap size={20} className="text-sp-down" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-sp-text-brand">{currentIncident.id}</span>
                <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${state.incidentResolved ? 'bg-sp-up text-white' : 'bg-sp-down text-white'}`}>
                  {state.incidentResolved ? 'Resolved' : currentIncident.severity}
                </span>
                {state.incidentFresh && !state.incidentResolved && (
                  <span className="rounded-[4px] bg-sp-warning-bg px-1.5 py-0.5 text-[10px] font-bold text-sp-warning">Injected now</span>
                )}
              </div>
              <div className="text-[12px] text-sp-text-secondary">{currentIncident.summary}</div>
              <div className="mt-1 text-[11px] text-sp-text-tertiary">Started {currentIncident.started}</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-sp-down" />
                <span className="text-[18px] font-bold text-sp-down">{manualDuration}</span>
              </div>
              <div className="text-[10px] text-sp-text-tertiary">Manual</div>
            </div>
            <ArrowRight size={20} className="text-sp-text-tertiary" />
            <div className="text-center">
              <div className="flex items-center gap-1.5">
                <Bot size={14} className="text-sp-up" />
                <span className="text-[18px] font-bold text-sp-up">{neoDuration}</span>
              </div>
              <div className="text-[10px] text-sp-text-tertiary">With NEO</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-5 xl:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <User size={16} className="text-sp-down" />
            <h2 className="text-[14px] font-medium text-sp-text-brand">Manual Process</h2>
          </div>
          <div className="space-y-3">
            {data.manualSteps.map((step) => (
              <div key={`${step.time}-${step.label}`} className="rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-sp-text-brand">{step.label}</span>
                  <span className="rounded-[4px] bg-sp-down-bg px-1.5 py-0.5 text-[10px] font-bold text-sp-down">{step.duration}</span>
                </div>
                <div className="text-[10px] font-mono text-sp-text-tertiary">{step.time}</div>
                <p className="mt-1 text-[11px] leading-[16px] text-sp-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Bot size={16} className="text-sp-up" />
            <h2 className="text-[14px] font-medium text-sp-text-brand">NEO-Assisted Process</h2>
          </div>
          <div className="space-y-3">
            {data.neoSteps.map((step, index) => {
              const isBlocked = !state.incidentResolved && index >= 3
              return (
                <div
                  key={`${step.time}-${step.label}`}
                  className={`rounded-[8px] border p-3 ${
                    isBlocked ? 'border-sp-border-subtle bg-sp-bg-raised opacity-65' : 'border-sp-up/20 bg-sp-up-bg'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-sp-text-brand">{step.label}</span>
                    <span className="rounded-[4px] bg-sp-up-bg px-1.5 py-0.5 text-[10px] font-bold text-sp-up">{step.duration}</span>
                  </div>
                  <div className="text-[10px] font-mono text-sp-text-tertiary">{step.time}</div>
                  <p className="mt-1 text-[11px] leading-[16px] text-sp-text-secondary">
                    {isBlocked ? 'Approve the resolution action to complete this step in the live demo.' : step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-5">
        <h2 className="mb-4 text-[14px] font-medium text-sp-text-brand">Impact Comparison</h2>
        <div className="overflow-hidden rounded-[8px] border border-sp-border-subtle">
          <table className="w-full">
            <thead>
              <tr className="bg-sp-bg-surface">
                <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Metric</th>
                <th className="px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Manual</th>
                <th className="px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">With NEO</th>
                <th className="px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {data.comparisonMetrics.map((metric) => (
                <tr key={metric.label} className="border-t border-sp-border-subtle/50">
                  <td className="px-4 py-2.5 text-[13px] font-medium text-sp-text-brand">{metric.label}</td>
                  <td className="px-4 py-2.5 text-center text-[13px] text-sp-down">{metric.manual}</td>
                  <td className="px-4 py-2.5 text-center text-[13px] font-medium text-sp-up">
                    {metric.label === 'Total Resolution Time' && !state.incidentResolved ? 'Pending approval' : metric.neo}
                  </td>
                  <td className="px-4 py-2.5 text-center text-[12px] font-bold text-sp-up">{metric.improvement || metric.neo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
