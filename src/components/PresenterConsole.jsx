import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lock,
  MessageSquare,
  Minus,
  RefreshCcw,
  Settings2,
  Shield,
  Siren,
  Sparkles,
} from 'lucide-react'
import { demoScenarioOptions, deploymentScaleOptions } from '../demoData'
import { useDemo } from '../demoContext'

const STORAGE_KEY = 'prtg-sidekick-presenter-console-minimized'

const moduleLabels = {
  overview: 'Start Here',
  coverage: 'Coverage Agent',
  signal: 'Signal Agent',
  resolution: 'Resolution Agent',
  nlquery: 'NL Query',
  impact: 'Impact Dashboard',
  approvals: 'Approval Queue',
  timeline: 'Resolution Timeline',
  dataflow: 'Data Flow',
}

const moduleIcons = {
  overview: Sparkles,
  coverage: Shield,
  signal: Activity,
  resolution: AlertTriangle,
  nlquery: MessageSquare,
  impact: BarChart3,
  approvals: CheckCircle2,
  timeline: Clock,
  dataflow: Lock,
}

export default function PresenterConsole() {
  const { state, derived, actions } = useDemo()
  const [minimized, setMinimized] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, minimized ? 'true' : 'false')
    }
  }, [minimized])

  const currentStep = derived.storyGuide.currentStep || derived.storyGuide.steps[0]
  const nextStep = derived.storyGuide.nextStep
  const latestEvent = state.recentEvents[0]
  const nextApproval = state.approvalsPending[0] || null
  const ActiveStepIcon = currentStep ? (moduleIcons[currentStep.module] || Sparkles) : Sparkles

  const snapshot = useMemo(
    () => `${derived.scenario.label} · ${derived.scale.label} · ${derived.dataFlowSummary.providerLabel}`,
    [derived.dataFlowSummary.providerLabel, derived.scale.label, derived.scenario.label],
  )

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 hidden cursor-pointer items-center gap-2 rounded-full border border-sp-border-subtle bg-sp-bg-raised px-4 py-2 text-[12px] font-medium text-sp-text-base shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-colors hover:border-sp-border-strong lg:flex xl:right-[376px]"
      >
        <Sparkles size={14} className="text-sp-accent" />
        Presenter Console
      </button>
    )
  }

  return (
    <aside className="fixed bottom-4 right-4 z-50 hidden w-[340px] overflow-hidden rounded-[16px] border border-sp-border-subtle bg-sp-bg-raised shadow-[0_18px_48px_rgba(0,0,0,0.30)] lg:block xl:right-[376px]">
      <div className="border-b border-sp-border-subtle bg-[linear-gradient(135deg,rgba(227,40,98,0.10),rgba(15,103,255,0.08),rgba(255,255,255,0))] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-sp-accent">
              <Sparkles size={11} />
              Presenter Console
            </div>
            <div className="mt-1 text-[13px] font-medium text-sp-text-base">{snapshot}</div>
            <div className="mt-1 text-[11px] text-sp-text-secondary">
              Live guide for running the demo without returning to the overview page.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMinimized(true)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface text-sp-text-secondary transition-colors hover:text-sp-text-base"
            aria-label="Minimize presenter console"
          >
            <Minus size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-152px)] space-y-4 overflow-y-auto p-4">
        <div className="rounded-[10px] border border-sp-border-subtle/60 bg-sp-bg-surface p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-sp-bg-raised">
              <ActiveStepIcon size={15} className="text-sp-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">
                {currentStep ? `Step ${currentStep.index}` : 'Current Step'}
              </div>
              <div className="text-[12px] font-medium text-sp-text-base">
                {currentStep ? currentStep.moduleLabel : moduleLabels[state.currentModule]}
              </div>
            </div>
          </div>
          {currentStep && (
            <p className="text-[11px] leading-[17px] text-sp-text-secondary">
              {currentStep.proof}
            </p>
          )}
          {nextStep && (
            <button
              type="button"
              onClick={() => actions.setCurrentModule(nextStep.module)}
              className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-[8px] border border-sp-accent/20 bg-sp-accent-soft px-3 py-2 text-left text-[12px] font-medium text-sp-accent transition-colors hover:border-sp-accent/40"
            >
              <span>Next: {nextStep.moduleLabel}</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        <div className="rounded-[10px] border border-sp-border-subtle/60 bg-sp-bg-surface p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Navigation Outline</div>
          <div className="mt-2 space-y-2">
            {derived.storyGuide.steps.map((step) => (
              <button
                key={step.module}
                type="button"
                onClick={() => actions.setCurrentModule(step.module)}
                className={`w-full cursor-pointer rounded-[8px] border px-3 py-2 text-left transition-colors ${
                  step.active
                    ? 'border-sp-accent/30 bg-sp-accent-soft'
                    : 'border-sp-border-subtle bg-sp-bg-raised hover:border-sp-border-strong'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Step {step.index}</div>
                <div className="mt-1 text-[12px] font-medium text-sp-text-base">{step.moduleLabel}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[10px] border border-sp-border-subtle/60 bg-sp-bg-surface p-3">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">
            <Settings2 size={11} />
            Demo Setup
          </div>
          <div className="grid gap-3">
            <label className="min-w-0">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Scenario</div>
              <select
                value={state.scenarioId}
                onChange={(event) => actions.setScenario(event.target.value)}
                className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
              >
                {demoScenarioOptions.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="min-w-0">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Fleet Scale</div>
                <select
                  value={state.deploymentScale}
                  onChange={(event) => actions.setScale(event.target.value)}
                  className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
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
                  className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
                >
                  <option value="operator">Operator Mode</option>
                  <option value="executive">Executive Mode</option>
                </select>
              </label>
            </div>

            <label className="min-w-0">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">LLM Route</div>
              <select
                value={state.selectedLLM}
                onChange={(event) => actions.setLLMProvider(event.target.value)}
                className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
              >
                <option value="paessler">Paessler AI</option>
                <option value="local">Local LLM</option>
              </select>
            </label>
          </div>

          <div className="mt-3 rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-raised p-3 text-[11px] leading-[17px] text-sp-text-secondary">
            {derived.scale.instances} instances, {derived.scale.sensors.toLocaleString()} sensors, route {derived.dataFlowSummary.providerLabel}.
          </div>
        </div>

        <div className="rounded-[10px] border border-sp-border-subtle/60 bg-sp-bg-surface p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Quick Actions</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {nextApproval && (
              <button
                type="button"
                onClick={() => actions.approveAction(nextApproval.id)}
                className="flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-sp-up px-3 py-2 text-[12px] font-medium text-white transition-opacity hover:opacity-90"
              >
                <CheckCircle2 size={12} />
                Approve Next
              </button>
            )}
            <button
              type="button"
              onClick={actions.injectIncident}
              className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-sp-warning/20 bg-sp-warning-bg/80 px-3 py-2 text-[12px] font-medium text-sp-warning transition-colors hover:border-sp-warning/40 hover:bg-sp-warning-bg"
            >
              <Siren size={12} />
              Inject Incident
            </button>
            <button
              type="button"
              onClick={actions.resetDemo}
              className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-2 text-[12px] font-medium text-sp-text-secondary transition-colors hover:text-sp-text-base"
            >
              <RefreshCcw size={12} />
              Reset
            </button>
          </div>
          {nextApproval && (
            <div className="mt-3 rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-raised p-3 text-[11px] leading-[17px] text-sp-text-secondary">
              Next approval: <span className="font-medium text-sp-text-base">{nextApproval.action}</span> on {nextApproval.device}.
            </div>
          )}
        </div>

        <div className="rounded-[10px] border border-sp-border-subtle/60 bg-sp-bg-surface p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Live Snapshot</div>
          <div className="mt-2 space-y-1 text-[11px] text-sp-text-secondary">
            <div>Active screen: {moduleLabels[state.currentModule]}</div>
            <div>{state.approvalsPending.length} pending approvals</div>
            <div>{derived.impact.executedActions} executed actions</div>
          </div>
          <div className="mt-3 rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-raised p-3 text-[11px] leading-[17px] text-sp-text-secondary">
            {latestEvent ? latestEvent.text : 'No recent event recorded yet.'}
          </div>
        </div>
      </div>
    </aside>
  )
}
