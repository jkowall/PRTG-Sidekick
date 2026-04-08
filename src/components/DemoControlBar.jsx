import { useMemo, useState } from 'react'
import { ChevronDown, RefreshCcw, Settings2, Siren, Sparkles } from 'lucide-react'
import { demoScenarioOptions, deploymentScaleOptions } from '../demoData'
import { useDemo } from '../demoContext'

export default function DemoControlBar() {
  const { state, derived, actions } = useDemo()
  const [pinnedOpen, setPinnedOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const latestEvent = state.recentEvents[0]
  const storyGuide = derived.storyGuide
  const isOpen = pinnedOpen || hovered

  const summaryText = useMemo(
    () => `${derived.scenario.label} · ${derived.scale.label} · ${derived.dataFlowSummary.providerLabel}`,
    [derived.dataFlowSummary.providerLabel, derived.scale.label, derived.scenario.label],
  )

  const handleToggle = () => {
    if (isOpen) {
      setPinnedOpen(false)
      setHovered(false)
      return
    }

    setPinnedOpen(true)
  }

  return (
    <div className="relative z-20 mb-2 flex justify-end">
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-sp-border-subtle/80 bg-sp-bg-raised px-3 py-1.5 text-[11px] font-bold text-sp-text-secondary shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition-colors hover:border-sp-border-subtle hover:bg-sp-bg-surface hover:text-sp-text-base"
        >
          <Settings2 size={12} />
          Demo
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-[min(92vw,760px)] rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-3 shadow-[0_18px_48px_rgba(0,0,0,0.24)] ring-1 ring-black/5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-sp-text-tertiary">
                  <Sparkles size={11} />
                  Demo Setup
                </div>
                <div className="mt-1 text-[12px] font-medium text-sp-text-base">{summaryText}</div>
                <div className="mt-1 text-[11px] text-sp-text-secondary">
                  {state.approvalsPending.length} pending approvals, {derived.impact.executedActions} executed actions
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={actions.injectIncident}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-sp-warning/20 bg-sp-warning-bg/80 px-2.5 py-1.5 text-[11px] font-bold text-sp-warning transition-colors hover:border-sp-warning/40 hover:bg-sp-warning-bg"
                >
                  <Siren size={12} />
                  Inject Incident
                </button>
                <button
                  type="button"
                  onClick={actions.resetDemo}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-sp-border-subtle bg-sp-bg-surface px-2.5 py-1.5 text-[11px] font-bold text-sp-text-secondary transition-colors hover:text-sp-text-base"
                >
                  <RefreshCcw size={12} />
                  Reset
                </button>
              </div>
            </div>

            <div className="mb-3 rounded-[8px] border border-sp-border-subtle/60 bg-sp-bg-surface px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Latest Event</div>
              <div className="mt-1 text-[12px] text-sp-text-secondary">
                {latestEvent ? latestEvent.text : 'Scenario controls and live demo state.'}
              </div>
            </div>

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

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr,1.8fr]">
              <div className="rounded-[10px] border border-sp-border-subtle/60 bg-sp-bg-surface px-3 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">{storyGuide.eyebrow}</div>
                <div className="mt-1 text-[13px] font-medium text-sp-text-base">{storyGuide.scenario.label}</div>
                <p className="mt-1 text-[11px] leading-[17px] text-sp-text-secondary">
                  {storyGuide.summary}
                </p>
                <div className="mt-2 rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-raised px-2.5 py-2 text-[11px] leading-[16px] text-sp-text-base">
                  {storyGuide.outcome}
                </div>
              </div>

              <div className="rounded-[10px] border border-sp-border-subtle/60 bg-sp-bg-surface px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Recommended Screen Flow</div>
                    <div className="mt-1 text-[11px] text-sp-text-secondary">{storyGuide.presenterNote}</div>
                  </div>
                  <div className="text-right text-[10px] text-sp-text-tertiary">
                    {derived.scale.instances} instances
                    <br />
                    {derived.scale.sensors.toLocaleString()} sensors
                  </div>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {storyGuide.steps.map((step) => (
                    <button
                      key={step.module}
                      type="button"
                      onClick={() => actions.setCurrentModule(step.module)}
                      className={`cursor-pointer rounded-[8px] border px-3 py-2 text-left transition-colors ${
                        step.active
                          ? 'border-sp-accent/30 bg-sp-accent-soft'
                          : 'border-sp-border-subtle bg-sp-bg-raised hover:border-sp-border-strong'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Step {step.index}</div>
                      <div className="mt-1 text-[12px] font-medium text-sp-text-base">{step.moduleLabel}</div>
                      <p className="mt-1 text-[11px] leading-[16px] text-sp-text-secondary">{step.proof}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
