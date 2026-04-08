import { Activity, AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Lock, MessageSquare, Shield, Sparkles } from 'lucide-react'
import { useDemo } from '../demoContext'

const outcomes = [
  {
    title: 'Increase operational leverage',
    body: 'NEO helps the same operations team cover more infrastructure, reduce manual triage, and move faster during incidents.',
    tone: 'border-sp-accent/20 bg-sp-accent-soft',
  },
  {
    title: 'Keep governance intact',
    body: 'Recommendations are visible, explainable, and approval-driven, so AI accelerates decisions without bypassing operator control.',
    tone: 'border-sp-warning/30 bg-sp-warning-bg',
  },
  {
    title: 'Protect privacy and architecture choice',
    body: 'Raw monitoring data stays on-premises, and the model layer can route through Paessler AI or a local LLM without changing the operating model.',
    tone: 'border-sp-up/30 bg-sp-up-bg',
  },
]

const valueAreas = [
  {
    icon: Shield,
    title: 'Coverage',
    summary: 'Find the blind spots that make outages harder to prevent.',
    outcome: 'Lower monitoring risk and fewer avoidable surprises.',
    color: 'text-sp-up',
    bg: 'bg-sp-up-bg',
  },
  {
    icon: Activity,
    title: 'Signal Quality',
    summary: 'Reduce alert fatigue with thresholds based on real behavior.',
    outcome: 'Higher operator focus and better response efficiency.',
    color: 'text-sp-accent',
    bg: 'bg-sp-accent-soft',
  },
  {
    icon: AlertTriangle,
    title: 'Resolution',
    summary: 'Move from symptoms to ranked root cause hypotheses and next actions.',
    outcome: 'Lower mean time to resolution and more consistent incident handling.',
    color: 'text-sp-down',
    bg: 'bg-sp-down-bg',
  },
  {
    icon: MessageSquare,
    title: 'Access to Insight',
    summary: 'Give operators and leaders direct answers in plain English.',
    outcome: 'Faster visibility without specialist query work.',
    color: 'text-sp-accent-secondary',
    bg: 'bg-sp-bg-surface',
  },
]

const narrativePrompts = {
  'incident-response': [
    'Start with the outage so every later screen feels necessary instead of optional.',
    'Use Coverage to explain why the team lacked early warning, then use Approvals to show that AI recommendations still stop at a human checkpoint.',
    'Finish on Impact so the audience leaves with MTTR reduction and operational leverage, not just a root-cause screenshot.',
  ],
  'coverage-review': [
    'Start with blind spots in the device tree, not with generic AI framing.',
    'Use Signal as supporting context: more coverage only helps if the team can trust the alerts that come with it.',
    'Finish on Impact to translate better instrumentation into risk reduction and reclaimed team capacity.',
  ],
  'noise-reduction': [
    'Start with the before and after so the pain is obvious immediately.',
    'Use Approvals to make clear that threshold tuning is governed, not automatic.',
    'Finish on Coverage or Impact to show where the saved attention goes once the noise is gone.',
  ],
}

const moduleIcons = {
  overview: Sparkles,
  coverage: Shield,
  signal: Activity,
  resolution: AlertTriangle,
  approvals: CheckCircle2,
  impact: BarChart3,
  dataflow: Lock,
}

export default function NeoOverview() {
  const { derived, actions } = useDemo()
  const storyGuide = derived.storyGuide
  const prompts = narrativePrompts[storyGuide.scenario.id] || narrativePrompts['incident-response']

  return (
    <div>
      <div className="mb-6 rounded-[16px] border border-sp-border-subtle bg-[linear-gradient(135deg,rgba(227,40,98,0.14),rgba(15,103,255,0.10),rgba(255,255,255,0))] p-6">
        <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 max-w-[760px]">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-sp-accent">
              <Sparkles size={12} />
              Start Here
            </div>
            <div className="mt-2 inline-flex rounded-full border border-sp-border-subtle bg-sp-bg-raised px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-secondary">
              {storyGuide.eyebrow}
            </div>
            <h1 className="mt-2 text-[28px] font-medium leading-[32px] text-sp-text-brand">
              {storyGuide.headline}
            </h1>
            <p className="mt-3 max-w-[700px] text-[14px] leading-[22px] text-sp-text-base">
              {storyGuide.summary}
            </p>
            <p className="mt-2 max-w-[640px] text-[12px] leading-[18px] text-sp-text-secondary">
              Active scenario: <strong>{storyGuide.scenario.label}</strong> across <strong>{storyGuide.scaleLabel}</strong>.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 lg:w-[320px] lg:shrink-0">
            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Narrative Outcome</div>
              <div className="mt-2 text-[13px] leading-[19px] text-sp-text-base">
                {storyGuide.outcome}
              </div>
              {storyGuide.nextStep && (
                <button
                  type="button"
                  onClick={() => actions.setCurrentModule(storyGuide.nextStep.module)}
                  className="mt-3 flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-sp-accent/20 bg-sp-accent-soft px-3 py-2 text-[12px] font-medium text-sp-accent transition-colors hover:border-sp-accent/40"
                >
                  Open {storyGuide.nextStep.moduleLabel}
                  <ArrowRight size={13} />
                </button>
              )}
            </div>

            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Run The Demo</div>
              <p className="mt-2 text-[12px] leading-[18px] text-sp-text-secondary">
                Use the floating <strong>Presenter Console</strong> to change the scenario, move through the screen sequence, and trigger live actions without returning to this page.
              </p>
              {storyGuide.nextStep && (
                <button
                  type="button"
                  onClick={() => actions.setCurrentModule(storyGuide.nextStep.module)}
                  className="mt-3 flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface px-3 py-2 text-[12px] font-medium text-sp-text-base transition-colors hover:border-sp-border-strong"
                >
                  Go to {storyGuide.nextStep.moduleLabel}
                  <ArrowRight size={13} className="text-sp-accent" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        {outcomes.map((item) => (
          <div key={item.title} className={`rounded-[12px] border p-4 ${item.tone}`}>
            <div className="text-[13px] font-medium text-sp-text-brand">{item.title}</div>
            <p className="mt-2 text-[12px] leading-[18px] text-sp-text-secondary">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-3">
          <div>
            <h2 className="text-[14px] font-medium text-sp-text-brand">Recommended Demo Flow</h2>
            <p className="mt-1 text-[12px] text-sp-text-secondary">
              The scenario is only clear when it is tied to the screens that prove it. Use this sequence as the main narrative spine.
            </p>
          </div>

          <div className="space-y-3">
            {storyGuide.steps.map((step) => {
              const Icon = moduleIcons[step.module] || Sparkles

              return (
                <button
                  key={step.module}
                  type="button"
                  onClick={() => actions.setCurrentModule(step.module)}
                  className={`flex w-full cursor-pointer gap-3 rounded-[12px] border p-4 text-left transition-colors ${
                    step.active
                      ? 'border-sp-accent/30 bg-sp-accent-soft'
                      : 'border-sp-border-subtle bg-sp-bg-raised hover:border-sp-border-strong'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-sp-bg-surface">
                    <Icon size={17} className="text-sp-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Step {step.index}</span>
                      <span className="text-[13px] font-medium text-sp-text-brand">{step.moduleLabel}</span>
                    </div>
                    <div className="mt-1 text-[12px] font-medium text-sp-text-base">{step.title}</div>
                    <p className="mt-1 text-[12px] leading-[18px] text-sp-text-secondary">{step.proof}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div>
            <h2 className="text-[14px] font-medium text-sp-text-brand">What The Platform Proves</h2>
            <p className="mt-1 text-[12px] text-sp-text-secondary">
              These themes stay constant even when you switch scenarios.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {valueAreas.map((area) => (
              <div key={area.title} className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${area.bg}`}>
                    <area.icon size={17} className={area.color} />
                  </div>
                  <div className="text-[14px] font-medium text-sp-text-brand">{area.title}</div>
                </div>
                <p className="mt-3 text-[12px] leading-[18px] text-sp-text-secondary">{area.summary}</p>
                <div className="mt-3 rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3 text-[12px] leading-[18px] text-sp-text-base">
                  {area.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand">Presenter Guidance</h2>
            <div className="mt-3 space-y-2">
              {prompts.map((prompt) => (
                <div key={prompt} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3 text-[12px] leading-[18px] text-sp-text-base">
                  {prompt}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand">Other Demo Stories</h2>
            <div className="mt-3 space-y-3">
              {storyGuide.alternatives.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => actions.setScenario(scenario.id)}
                  className={`w-full cursor-pointer rounded-[10px] border p-3 text-left transition-colors ${
                    scenario.active
                      ? 'border-sp-accent/30 bg-sp-accent-soft'
                      : 'border-sp-border-subtle bg-sp-bg-surface hover:border-sp-border-strong'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[13px] font-medium text-sp-text-brand">{scenario.label}</div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">{scenario.bestFor}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-[17px] text-sp-text-secondary">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium text-sp-text-brand">
              Use this page to reset the audience before you enter a live module
              <ArrowRight size={13} className="text-sp-accent" />
            </div>
            <p className="mt-2 text-[11px] leading-[17px] text-sp-text-secondary">
              Scenario switching now works best as a narrative reset: choose the story first, then follow the recommended screen path rather than touring modules in a fixed order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
