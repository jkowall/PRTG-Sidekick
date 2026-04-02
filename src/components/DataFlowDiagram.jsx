import { useState } from 'react'
import { Shield, Lock, Server, Cloud, Cpu, ArrowRight, Eye, EyeOff, Database, Activity, Wifi, Globe, CheckCircle2, AlertTriangle, Layers, KeyRound, Gauge, RotateCcw } from 'lucide-react'

const architectureLayers = [
  {
    id: 'onprem',
    label: 'Customer Premises',
    subtitle: 'Your network — data stays here',
    icon: Server,
    color: 'text-sp-up',
    bg: 'bg-sp-up-bg',
    borderColor: 'border-sp-up/30',
    components: [
      { name: 'PRTG Server', icon: Activity, description: 'Sensor data, alerts, dashboards, device config', detail: 'All raw monitoring data remains on-premises' },
      { name: 'Sidekick App', icon: Cpu, description: 'NEO agents: Coverage, Signal, Resolution', detail: 'Runs locally, processes PRTG API data' },
      { name: 'Local API', icon: Database, description: 'PRTG REST API — standard security model', detail: 'Authenticated via username + passhash' },
    ],
    securityNotes: [
      'Raw sensor data never leaves your network',
      'PRTG credentials stored locally only',
      'Standard PRTG API security and access model',
    ],
  },
  {
    id: 'transit',
    label: 'Anonymized Transit',
    subtitle: 'What leaves your network',
    icon: EyeOff,
    color: 'text-sp-warning',
    bg: 'bg-sp-warning-bg',
    borderColor: 'border-sp-warning/30',
    components: [
      { name: 'Query Anonymization', icon: EyeOff, description: 'Strips IPs, hostnames, credentials before transit', detail: 'Only structural patterns and metrics sent to LLM' },
      { name: 'Encrypted Channel', icon: Lock, description: 'TLS 1.3 end-to-end encryption', detail: 'No plaintext data in transit at any point' },
    ],
    securityNotes: [
      'Device names replaced with generic identifiers',
      'IP addresses and credentials stripped completely',
      'Only anonymized patterns and aggregated metrics transit',
    ],
    example: {
      label: 'Example: What the LLM sees',
      before: '"sw-core-01 (10.0.1.1) has 6 VLANs, no STP sensor. Last incident INC-2024-0847 at 14:32 UTC."',
      after: '"Device-A (core switch class) has 6 VLANs, no spanning tree monitoring. 3 related incidents in 90 days."',
    },
  },
  {
    id: 'proxy',
    label: 'Paessler Infrastructure',
    subtitle: 'LLM Proxy — managed by Paessler',
    icon: Shield,
    color: 'text-sp-accent',
    bg: 'bg-sp-accent-soft',
    borderColor: 'border-sp-accent/30',
    components: [
      { name: 'LLM Proxy', icon: Shield, description: 'Routes anonymized queries to LLM providers', detail: 'Centralized key management — no BYOK needed' },
      { name: 'Rate Limiting', icon: Gauge, description: 'Per-customer throttling and fair usage', detail: 'Prevents abuse and controls costs' },
      { name: 'Cost Metering', icon: Layers, description: 'Usage tracking per customer / license tier', detail: 'Transparent token usage and billing' },
      { name: 'Model Routing', icon: RotateCcw, description: 'Provider-agnostic model selection', detail: 'Swap providers without customer code changes' },
      { name: 'Key Management', icon: KeyRound, description: 'Paessler-managed API keys to LLM providers', detail: 'Customers never handle provider API keys' },
    ],
    securityNotes: [
      'No customer data stored — inference only',
      'Paessler manages all LLM provider API keys',
      'License enforcement ensures authorized access',
      'Provider can be swapped without customer impact',
    ],
  },
  {
    id: 'llm',
    label: 'LLM Providers',
    subtitle: 'EU / US / Regional — inference only',
    icon: Cloud,
    color: 'text-sp-accent-tertiary',
    bg: 'bg-sp-unknown-bg',
    borderColor: 'border-sp-accent-tertiary/30',
    components: [
      { name: 'Azure OpenAI', icon: Cloud, description: 'EU region available (Frankfurt)', detail: 'Data residency within EU boundaries' },
      { name: 'Anthropic Claude', icon: Cloud, description: 'Primary model for NEO agents', detail: 'No training on customer data' },
      { name: 'Google Gemini', icon: Cloud, description: 'Alternative provider option', detail: 'Regional deployment options' },
    ],
    securityNotes: [
      'Inference only — no model training on customer data',
      'No customer data stored by providers',
      'EU-hosted options available for data residency',
      'No vendor lock-in — Paessler proxy enables swapping',
    ],
  },
]

const dataFlowSteps = [
  { from: 'PRTG Server', to: 'Sidekick', data: 'Sensor data, alerts, device tree', encryption: 'Local API (HTTPS)', stays: true },
  { from: 'Sidekick', to: 'Anonymization', data: 'Agent queries (coverage gaps, thresholds)', encryption: 'In-process', stays: true },
  { from: 'Anonymization', to: 'LLM Proxy', data: 'Anonymized structural patterns only', encryption: 'TLS 1.3', stays: false },
  { from: 'LLM Proxy', to: 'LLM Provider', data: 'Anonymized prompt + context', encryption: 'TLS 1.3', stays: false },
  { from: 'LLM Provider', to: 'LLM Proxy', data: 'AI analysis / recommendations', encryption: 'TLS 1.3', stays: false },
  { from: 'LLM Proxy', to: 'Sidekick', data: 'Structured recommendations', encryption: 'TLS 1.3', stays: false },
  { from: 'Sidekick', to: 'Engineer', data: 'Human-readable insights + actions', encryption: 'Local', stays: true },
]

export default function DataFlowDiagram() {
  const [expandedLayer, setExpandedLayer] = useState('onprem')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <Shield size={20} className="text-sp-up" />
            Data Flow &amp; Privacy Architecture
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            How on-premises PRTG data flows to cloud LLM providers — with anonymization at every boundary
          </p>
        </div>
      </div>

      {/* Key Principle Banner */}
      <div className="bg-sp-up-bg border border-sp-up/20 rounded-[8px] p-4 mb-5">
        <div className="flex items-center gap-3">
          <Lock size={20} className="text-sp-up shrink-0" />
          <div>
            <div className="text-[13px] font-medium text-sp-text-brand">Core Principle: Raw data never leaves your premises</div>
            <p className="text-[12px] text-sp-text-secondary mt-0.5">
              Only anonymized, structural patterns transit to LLM providers. Device names, IPs, and credentials are stripped before any data leaves your network.
              Paessler manages all LLM provider keys — no Bring Your Own Key.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Architecture Layers */}
        <div className="col-span-3 space-y-3">
          {/* Visual Flow */}
          <div className="flex items-center gap-2 mb-2">
            {architectureLayers.map((layer, i) => {
              const Icon = layer.icon
              return (
                <div key={layer.id} className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => setExpandedLayer(layer.id)}
                    className={`flex-1 rounded-[8px] border p-3 text-center transition-all duration-200 cursor-pointer ${
                      expandedLayer === layer.id ? `${layer.bg} ${layer.borderColor}` : 'bg-sp-bg-raised border-sp-border-subtle hover:border-sp-border-strong'
                    }`}
                  >
                    <Icon size={18} className={`mx-auto mb-1 ${layer.color}`} />
                    <div className="text-[11px] font-medium text-sp-text-brand leading-tight">{layer.label}</div>
                  </button>
                  {i < architectureLayers.length - 1 && (
                    <ArrowRight size={16} className="text-sp-text-tertiary shrink-0" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Expanded Layer Detail */}
          {architectureLayers.map(layer => {
            if (expandedLayer !== layer.id) return null
            const LayerIcon = layer.icon
            return (
              <div key={layer.id} className={`rounded-[12px] border ${layer.borderColor} ${layer.bg} p-5`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-[8px] ${layer.bg} border ${layer.borderColor} flex items-center justify-center`}>
                    <LayerIcon size={20} className={layer.color} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-medium text-sp-text-brand">{layer.label}</h2>
                    <p className="text-[12px] text-sp-text-secondary">{layer.subtitle}</p>
                  </div>
                </div>

                {/* Components */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {layer.components.map((comp, i) => {
                    const CompIcon = comp.icon
                    return (
                      <div key={i} className="bg-sp-bg-raised/60 rounded-[8px] p-3 border border-sp-border-subtle/50">
                        <div className="flex items-center gap-2 mb-1">
                          <CompIcon size={14} className={layer.color} />
                          <span className="text-[13px] font-medium text-sp-text-brand">{comp.name}</span>
                        </div>
                        <p className="text-[11px] text-sp-text-secondary leading-[15px]">{comp.description}</p>
                        <p className="text-[10px] text-sp-text-tertiary mt-1 italic">{comp.detail}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Security Notes */}
                <div className="bg-sp-bg-raised/60 rounded-[8px] p-3 border border-sp-border-subtle/50">
                  <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-2 flex items-center gap-1.5">
                    <Lock size={10} />
                    Security Controls
                  </div>
                  <ul className="space-y-1">
                    {layer.securityNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-sp-text-base">
                        <CheckCircle2 size={11} className={`${layer.color} shrink-0 mt-0.5`} />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Anonymization example */}
                {layer.example && (
                  <div className="mt-3 bg-sp-bg-raised/60 rounded-[8px] p-3 border border-sp-border-subtle/50">
                    <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-2 flex items-center gap-1.5">
                      <EyeOff size={10} />
                      {layer.example.label}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-[10px] text-sp-down font-bold mb-0.5">Before anonymization (never sent):</div>
                        <div className="text-[11px] text-sp-text-secondary font-mono bg-sp-bg-surface rounded-[4px] px-2 py-1.5 leading-[16px]">
                          {layer.example.before}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-sp-up font-bold mb-0.5">After anonymization (what the LLM sees):</div>
                        <div className="text-[11px] text-sp-text-secondary font-mono bg-sp-bg-surface rounded-[4px] px-2 py-1.5 leading-[16px]">
                          {layer.example.after}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Data Flow Steps */}
        <div className="col-span-2 space-y-4">
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3 flex items-center gap-2">
              <ArrowRight size={14} className="text-sp-accent" />
              Data Flow — Step by Step
            </h2>
            <div className="space-y-0">
              {dataFlowSteps.map((step, i) => (
                <div key={i} className="relative flex gap-3 pb-3">
                  {/* Step number */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    step.stays ? 'bg-sp-up-bg text-sp-up' : 'bg-sp-warning-bg text-sp-warning'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] font-medium text-sp-text-brand">{step.from}</span>
                      <ArrowRight size={10} className="text-sp-text-tertiary" />
                      <span className="text-[12px] font-medium text-sp-text-brand">{step.to}</span>
                    </div>
                    <p className="text-[11px] text-sp-text-secondary">{step.data}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-sp-text-tertiary">{step.encryption}</span>
                      {step.stays ? (
                        <span className="text-[9px] px-1 py-0.5 rounded-[3px] bg-sp-up-bg text-sp-up font-bold">ON-PREM</span>
                      ) : (
                        <span className="text-[9px] px-1 py-0.5 rounded-[3px] bg-sp-warning-bg text-sp-warning font-bold">ENCRYPTED TRANSIT</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Residency */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3 flex items-center gap-2">
              <Globe size={14} className="text-sp-accent-tertiary" />
              Data Residency
            </h2>
            <div className="space-y-2.5">
              {[
                { label: 'Raw sensor data', location: 'Customer premises only', icon: Lock, color: 'text-sp-up' },
                { label: 'Device identifiers', location: 'Never leaves premises', icon: EyeOff, color: 'text-sp-up' },
                { label: 'LLM queries', location: 'Anonymized, EU providers available', icon: Globe, color: 'text-sp-warning' },
                { label: 'LLM responses', location: 'Transient — not stored by providers', icon: Cloud, color: 'text-sp-accent' },
                { label: 'Paessler proxy logs', location: 'EU (Frankfurt) — usage metering only', icon: Shield, color: 'text-sp-accent' },
              ].map(({ label, location, icon: Icon, color }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Icon size={13} className={`${color} shrink-0 mt-0.5`} />
                  <div>
                    <div className="text-[12px] font-medium text-sp-text-brand">{label}</div>
                    <div className="text-[11px] text-sp-text-secondary">{location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise FAQ */}
          <div className="bg-sp-accent-soft rounded-[12px] border border-sp-accent/20 p-4">
            <h2 className="text-[12px] font-bold text-sp-accent mb-2">Enterprise FAQ</h2>
            <div className="space-y-2">
              {[
                { q: 'Can I use my own API keys?', a: 'No — Paessler manages all provider keys through the proxy. This ensures cost control and security.' },
                { q: 'Is my data used to train models?', a: 'No. All provider agreements prohibit training on customer data. Inference only.' },
                { q: 'Can I keep data in the EU?', a: 'Yes. Azure OpenAI Frankfurt region is available. Select EU in Settings → LLM Provider.' },
              ].map(({ q, a }, i) => (
                <div key={i}>
                  <div className="text-[11px] font-medium text-sp-text-brand">{q}</div>
                  <div className="text-[11px] text-sp-text-secondary leading-[15px]">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
