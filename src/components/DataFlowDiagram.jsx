import { CheckCircle2, Cloud, Construction, Cpu, EyeOff, Lock, Server, Shield } from 'lucide-react'
import { useDemo } from '../demoContext'

export default function DataFlowDiagram() {
  const { state, derived } = useDemo()
  const isLocal = state.selectedLLM === 'local'

  const layers = [
    {
      id: 'onprem',
      label: 'Customer Premises',
      subtitle: 'PRTG + Sidekick stay on-prem',
      icon: Server,
      notes: [
        'Raw monitoring data stays on customer infrastructure',
        'PRTG credentials remain local',
        'Sidekick orchestrates approvals and agent workflows',
      ],
      accent: 'text-sp-up',
      bg: 'bg-sp-up-bg',
      border: 'border-sp-up/30',
    },
    {
      id: 'transit',
      label: isLocal ? 'No External Transit' : 'Anonymized Transit',
      subtitle: isLocal ? 'Prompts stay local' : 'Only anonymized patterns leave the premises',
      icon: EyeOff,
      notes: isLocal
        ? ['Prompt construction happens locally', 'No provider API keys are used', 'No cloud egress in this mode']
        : ['Device names and IPs are stripped before transit', 'Only structural patterns and aggregated metrics are sent', 'TLS 1.3 protects all traffic'],
      accent: 'text-sp-warning',
      bg: 'bg-sp-warning-bg',
      border: 'border-sp-warning/30',
    },
    {
      id: 'provider',
      label: isLocal ? 'Local Inference' : 'Paessler AI + LLM Provider',
      subtitle: isLocal ? 'Ollama / vLLM on customer hardware' : 'Proposed routed architecture',
      icon: isLocal ? Cpu : Cloud,
      notes: isLocal
        ? ['Suitable for private-network demos', 'No vendor lock-in or external dependencies', 'Operator controls the model choice directly']
        : ['Paessler account authentication gates access', 'Provider routing remains abstracted behind the proxy', 'This cloud path is proposed, not built yet'],
      accent: isLocal ? 'text-sp-accent' : 'text-sp-accent-tertiary',
      bg: isLocal ? 'bg-sp-accent-soft' : 'bg-sp-unknown-bg',
      border: isLocal ? 'border-sp-accent/30' : 'border-sp-accent-tertiary/30',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
          <Shield size={20} className="text-sp-up" />
          Data Flow &amp; Privacy Architecture
        </h1>
        <p className="mt-1 text-[13px] text-sp-text-alt">
          This view is now tied to the selected provider, so the presenter can switch between a cloud story and a local-inference story in real time.
        </p>
      </div>

      <div className="mb-3 rounded-[8px] border border-sp-up/20 bg-sp-up-bg p-4">
        <div className="flex items-center gap-3">
          <Lock size={20} className="shrink-0 text-sp-up" />
          <div>
            <div className="text-[13px] font-medium text-sp-text-brand">Core Principle: raw data never leaves customer premises</div>
            <p className="mt-0.5 text-[12px] text-sp-text-secondary">
              The live demo is currently using <strong>{derived.dataFlowSummary.providerLabel}</strong>. In this mode, the transit story is <strong>{derived.dataFlowSummary.transitLabel}</strong>.
            </p>
          </div>
        </div>
      </div>

      {!isLocal && (
        <div className="mb-5 rounded-[8px] border border-sp-warning/20 bg-sp-warning-bg p-4">
          <div className="flex items-center gap-3">
            <Construction size={20} className="shrink-0 text-sp-warning" />
            <div>
              <div className="text-[13px] font-medium text-sp-text-brand">Proposed Cloud Architecture</div>
              <p className="mt-0.5 text-[12px] text-sp-text-secondary">
                The Paessler proxy, authentication layer, and rate limiting remain proposed demo architecture. The local-inference path is the fully self-contained alternative.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {layers.map((layer) => {
          const Icon = layer.icon
          return (
            <div key={layer.id} className={`rounded-[12px] border p-5 ${layer.bg} ${layer.border}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${layer.bg} border ${layer.border}`}>
                  <Icon size={18} className={layer.accent} />
                </div>
                <div>
                  <div className="text-[15px] font-medium text-sp-text-brand">{layer.label}</div>
                  <div className="text-[12px] text-sp-text-secondary">{layer.subtitle}</div>
                </div>
              </div>
              <div className="space-y-2">
                {layer.notes.map((note) => (
                  <div key={note} className="flex items-start gap-2 text-[12px] text-sp-text-base">
                    <CheckCircle2 size={11} className={`${layer.accent} mt-0.5 shrink-0`} />
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
