import { Activity, AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Lock, MessageSquare, Shield, Sparkles } from 'lucide-react'

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
    summary: 'Expands monitoring coverage by identifying blind spots before they become outages.',
    outcome: 'Lower monitoring risk and fewer avoidable surprises.',
    color: 'text-sp-up',
    bg: 'bg-sp-up-bg',
  },
  {
    icon: Activity,
    title: 'Signal Quality',
    summary: 'Reduces alert fatigue by tuning thresholds around real behavior instead of static guesswork.',
    outcome: 'Higher operator focus and better response efficiency.',
    color: 'text-sp-accent',
    bg: 'bg-sp-accent-soft',
  },
  {
    icon: AlertTriangle,
    title: 'Resolution',
    summary: 'Compresses incident response by ranking likely root causes and guiding the next operational action.',
    outcome: 'Lower mean time to resolution and more consistent incident handling.',
    color: 'text-sp-down',
    bg: 'bg-sp-down-bg',
  },
  {
    icon: MessageSquare,
    title: 'Access to Insight',
    summary: 'Lets teams ask direct operational questions in plain English across distributed monitoring environments.',
    outcome: 'Faster executive visibility and quicker answers without specialist query work.',
    color: 'text-sp-accent-secondary',
    bg: 'bg-sp-bg-surface',
  },
]

const executiveStory = [
  { icon: Shield, label: 'Start with the operating problem', text: 'Frame the challenge as scale, noise, and response speed rather than as a collection of UI features.' },
  { icon: CheckCircle2, label: 'Show control, not automation theater', text: 'Use the Approval Queue to demonstrate that NEO accelerates decisions without removing accountability.' },
  { icon: BarChart3, label: 'Land on measurable impact', text: 'Close with Impact Dashboard to connect the story to reclaimed capacity, reduced alert load, and faster resolution.' },
  { icon: Lock, label: 'Address trust and deployment fit', text: 'Use Data Flow to answer the security, privacy, and model-routing questions that matter to enterprise buyers.' },
]

const talkingPoints = [
  '“NEO is an operating layer for monitoring teams, not just an AI assistant embedded in a dashboard.”',
  '“The value is not only better insight. The value is faster action with governance, evidence, and measurable operating impact.”',
  '“This creates leverage for understaffed IT teams without forcing them to trade off privacy, approval control, or deployment flexibility.”',
]

export default function NeoOverview() {
  return (
    <div>
      <div className="mb-6 rounded-[16px] border border-sp-border-subtle bg-[linear-gradient(135deg,rgba(227,40,98,0.14),rgba(15,103,255,0.10),rgba(255,255,255,0))] p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-[760px]">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-sp-accent">
              <Sparkles size={12} />
              Executive Overview
            </div>
            <div className="mt-2 inline-flex rounded-full border border-sp-border-subtle bg-sp-bg-raised px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-secondary">
              Executive-level overview
            </div>
            <h1 className="mt-2 text-[28px] font-medium leading-[32px] text-sp-text-brand">
              NEO helps IT teams operate more efficiently without giving up control.
            </h1>
            <p className="mt-3 max-w-[700px] text-[14px] leading-[22px] text-sp-text-base">
              PRTG Sidekick uses specialized AI agents to improve monitoring coverage, reduce alert noise, accelerate incident response, and expose network insight in plain English, all within an approval-driven and privacy-conscious operating model.
            </p>
            <p className="mt-2 max-w-[640px] text-[12px] leading-[18px] text-sp-text-secondary">
              This page is intended as an executive-level overview of what NEO is, why it matters, and how the platform creates operational and business value.
            </p>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Executive framing</div>
            <div className="mt-2 max-w-[280px] text-[13px] leading-[19px] text-sp-text-base">
              The story is simple: fewer blind spots, less noise, faster recovery, and clearer ROI from the monitoring stack already in place.
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
            <h2 className="text-[14px] font-medium text-sp-text-brand">Business Value Areas</h2>
            <p className="mt-1 text-[12px] text-sp-text-secondary">
              NEO is best understood as a set of operational outcomes rather than a set of isolated features.
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
            <h2 className="text-[14px] font-medium text-sp-text-brand">Suggested Executive Story</h2>
            <div className="mt-4 space-y-3">
              {executiveStory.map((step, index) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sp-bg-surface">
                      <step.icon size={14} className="text-sp-accent" />
                    </div>
                    {index < executiveStory.length - 1 && <div className="mt-2 h-8 w-px bg-sp-border-subtle" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-[12px] font-medium text-sp-text-brand">{step.label}</div>
                    <p className="mt-1 text-[11px] leading-[17px] text-sp-text-secondary">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand">Talk Track</h2>
            <div className="mt-3 space-y-2">
              {talkingPoints.map((prompt) => (
                <div key={prompt} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3 text-[12px] leading-[18px] text-sp-text-base">
                  {prompt}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium text-sp-text-brand">
              Use this page to frame the platform before you drop into a live workflow
              <ArrowRight size={13} className="text-sp-accent" />
            </div>
            <p className="mt-2 text-[11px] leading-[17px] text-sp-text-secondary">
              The goal is to establish why NEO matters at the operating-model level, then use Coverage, Signal, Resolution, and Impact to prove the claim.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
