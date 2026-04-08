import { useState } from 'react'
import { ChevronDown, RefreshCcw, Settings2, Siren, Sparkles } from 'lucide-react'
import { demoScenarioOptions, deploymentScaleOptions } from '../demoData'
import { useDemo } from '../demoContext'

function SummaryChip({ label, value, tone = '' }) {
  return (
    <div className={`rounded-full border border-sp-border-subtle bg-sp-bg-surface px-2.5 py-1 text-[11px] ${tone}`}>
      <span className="text-sp-text-tertiary">{label}</span>
      <span className="ml-1 font-medium text-sp-text-base">{value}</span>
    </div>
  )
}

export default function DemoControlBar() {
  const { state, derived, actions } = useDemo()
  const [expanded, setExpanded] = useState(false)
  const latestEvent = state.recentEvents[0]

  return (
    <div className="mb-4 rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised shadow-[0_6px_22px_rgba(0,0,0,0.12)]">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <div className="min-w-[180px] flex-1">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-sp-accent">
            <Sparkles size={12} />
            Demo Setup
          </div>
          <div className="mt-1 text-[12px] text-sp-text-secondary">
            {latestEvent ? latestEvent.text : 'Scenario controls and live demo state.'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SummaryChip label="Scenario" value={derived.scenario.label} />
          <SummaryChip label="Scale" value={derived.scale.label} />
          <SummaryChip label="Route" value={derived.dataFlowSummary.providerLabel} />
          <SummaryChip label="Pending" value={state.approvalsPending.length} tone={state.approvalsPending.length ? 'text-sp-warning' : ''} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={actions.injectIncident}
            className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-sp-warning/30 bg-sp-warning-bg px-3 py-2 text-[12px] font-bold text-sp-warning transition-colors hover:border-sp-warning/50"
          >
            <Siren size={13} />
            Inject New Incident
          </button>
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-2 text-[12px] font-bold text-sp-text-secondary transition-colors hover:text-sp-text-base"
          >
            <Settings2 size={13} />
            Configure
            <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-sp-border-subtle px-4 py-4">
          <div className="grid gap-3 lg:grid-cols-4">
            <label className="min-w-0">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Scenario</div>
              <select
                value={state.scenarioId}
                onChange={(event) => actions.setScenario(event.target.value)}
                className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
              >
                {demoScenarioOptions.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="min-w-0">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Fleet Scale</div>
              <select
                value={state.deploymentScale}
                onChange={(event) => actions.setScale(event.target.value)}
                className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
              >
                {deploymentScaleOptions.map((scale) => (
                  <option key={scale.id} value={scale.id}>
                    {scale.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="min-w-0">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Audience</div>
              <select
                value={state.viewMode}
                onChange={(event) => actions.setViewMode(event.target.value)}
                className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
              >
                <option value="operator">Operator Mode</option>
                <option value="executive">Executive Mode</option>
              </select>
            </label>

            <label className="min-w-0">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">LLM Route</div>
              <select
                value={state.selectedLLM}
                onChange={(event) => actions.setLLMProvider(event.target.value)}
                className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
              >
                <option value="paessler">Paessler AI</option>
                <option value="local">Local LLM</option>
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-sp-text-secondary">
              {derived.scale.instances} instances, {derived.scale.sensors.toLocaleString()} sensors, {derived.impact.executedActions} executed actions.
            </div>
            <button
              type="button"
              onClick={actions.resetDemo}
              className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-2 text-[12px] font-bold text-sp-text-secondary transition-colors hover:text-sp-text-base"
            >
              <RefreshCcw size={13} />
              Reset Demo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
