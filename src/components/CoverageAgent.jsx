import { useState } from 'react'
import { AlertTriangle, Brain, Check, ChevronDown, ChevronRight, ExternalLink, HardDrive, History, Link2, Monitor, Plus, Router, Server, Shield, TrendingUp, Wifi } from 'lucide-react'
import { useDemo } from '../demoContext'

function renderTypeIcon(type, className) {
  switch (type) {
    case 'probe':
      return <Monitor size={14} className={className} />
    case 'group':
      return <HardDrive size={14} className={className} />
    case 'switch':
    case 'firewall':
      return <Router size={14} className={className} />
    case 'server':
      return <Server size={14} className={className} />
    case 'ap':
      return <Wifi size={14} className={className} />
    default:
      return <Server size={14} className={className} />
  }
}

function renderInsightIcon(insight, className) {
  switch (insight) {
    case 'peerComparison':
      return <Link2 size={10} className={className} />
    case 'incidentCorrelation':
      return <History size={10} className={className} />
    case 'behavioralAnomaly':
      return <TrendingUp size={10} className={className} />
    case 'fleetPattern':
      return <Brain size={10} className={className} />
    case 'failurePrediction':
      return <AlertTriangle size={10} className={className} />
    default:
      return <Brain size={10} className={className} />
  }
}

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(node.expanded ?? false)
  const hasChildren = Boolean(node.children?.length)
  const hasMissing = node.missing > 0

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-2 rounded-[4px] px-2 py-1.5 transition-colors duration-200 hover:bg-sp-bg-surface-hover ${
          hasMissing ? 'bg-sp-warning-bg/70' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && setExpanded((current) => !current)}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={14} className="shrink-0 text-sp-text-tertiary" /> : <ChevronRight size={14} className="shrink-0 text-sp-text-tertiary" />
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        {renderTypeIcon(node.type, hasMissing ? 'text-sp-warning' : 'text-sp-text-secondary')}
        <span className={`text-[13px] ${hasMissing ? 'font-medium text-sp-warning' : 'text-sp-text-base'}`}>{node.name}</span>
        {node.ip && <span className="ml-auto text-[11px] font-mono text-sp-text-tertiary">{node.ip}</span>}
        {typeof node.sensors === 'number' && <span className="text-[11px] text-sp-text-tertiary">{node.sensors}s</span>}
        {hasMissing && <span className="rounded-[4px] bg-sp-warning-bg px-1.5 py-0.5 text-[10px] font-bold text-sp-warning">+{node.missing}</span>}
      </div>

      {expanded && hasChildren && node.children.map((child) => <TreeNode key={child.id} node={child} depth={depth + 1} />)}
    </div>
  )
}

export default function CoverageAgent() {
  const { state, derived, data, actions } = useDemo()
  const isExecutive = state.viewMode === 'executive'

  const deployedCount = derived.coverageCards.filter((item) => item.status === 'deployed').length
  const pendingCount = derived.coverageCards.filter((item) => item.status === 'pending').length
  const openCount = derived.coverageCards.filter((item) => item.status === 'open').length

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
            <Shield size={20} className="text-sp-up" />
            Coverage Agent
          </h1>
          <p className="mt-1 text-[13px] text-sp-text-alt">
            AI-discovered monitoring gaps from incident history, fleet benchmarks, and behavioral analysis.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-warning">{openCount}</div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Open Gaps</div>
          </div>
          <div className="h-10 w-px bg-sp-border-subtle" />
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-accent">{pendingCount}</div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Queued</div>
          </div>
          <div className="h-10 w-px bg-sp-border-subtle" />
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-up">{deployedCount}</div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Deployed</div>
          </div>
        </div>
      </div>

      {isExecutive && (
        <div className="mb-5 rounded-[12px] border border-sp-accent/20 bg-sp-accent-soft p-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-sp-accent">Executive View</div>
          <p className="mt-1 text-[13px] leading-[19px] text-sp-text-base">
            Coverage Agent is surfacing five high-value monitoring blind spots. Queueing and approving those recommendations immediately updates live impact, audit history, and the device inventory story.
          </p>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-5">
        {!isExecutive && (
          <div className="space-y-4 xl:col-span-2">
            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[14px] font-medium text-sp-text-brand">Live Device Tree</h2>
                <span className="text-[10px] text-sp-text-tertiary">{derived.scale.sensors.toLocaleString()} modeled sensors</span>
              </div>
              <div className="space-y-0.5">
                {derived.deviceTree.map((node) => (
                  <TreeNode key={node.id} node={node} />
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
              <h2 className="mb-3 flex items-center gap-2 text-[14px] font-medium text-sp-text-brand">
                <Brain size={14} className="text-sp-accent-tertiary" />
                How NEO Finds Gaps
              </h2>
              <div className="space-y-2">
                {Object.entries(data.insightTags).map(([key, tag]) => {
                  const count = derived.coverageCards.filter((item) => item.insight === key).length
                  if (!count) {
                    return null
                  }
                  return (
                    <div key={key} className="flex items-center gap-2 text-[12px]">
                      <div className={`flex items-center gap-1.5 rounded-[4px] px-2 py-1 ${tag.style}`}>
                        {renderInsightIcon(key)}
                        <span className="font-medium">{tag.label}</span>
                      </div>
                      <span className="text-sp-text-tertiary">{count} recommendation{count > 1 ? 's' : ''}</span>
                    </div>
                  )
                })}
              </div>
              <p className="mt-3 text-[11px] leading-[16px] text-sp-text-tertiary">
                Cross-instance telemetry, incident patterns, and anonymized fleet benchmarks are all feeding the same approval-driven demo state.
              </p>
            </div>
          </div>
        )}

        <div className={`space-y-3 ${isExecutive ? 'xl:col-span-5' : 'xl:col-span-3'}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[14px] font-medium text-sp-text-brand">AI-Discovered Gaps</h2>
            <button
              type="button"
              onClick={actions.queueAllCoverageRecommendations}
              disabled={!openCount}
              className="cursor-pointer rounded-[6px] bg-sp-accent px-4 py-1.5 text-[12px] font-bold tracking-[0.02em] text-white transition-colors hover:bg-sp-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Queue All for Approval
            </button>
          </div>

          {derived.coverageCards.map((sensor) => {
            const tag = data.insightTags[sensor.insight]

            return (
              <div
                key={sensor.id}
                className={`rounded-[10px] border p-4 transition-colors ${
                  sensor.status === 'deployed'
                    ? 'border-sp-up/30 bg-sp-up-bg'
                    : sensor.status === 'pending'
                      ? 'border-sp-accent/30 bg-sp-accent-soft'
                      : 'border-sp-border-subtle bg-sp-bg-raised hover:border-sp-border-strong'
                }`}
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${data.priorityStyles[sensor.priority]}`}>{sensor.priority}</span>
                  <span className={`flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium ${tag.style}`}>
                    {renderInsightIcon(sensor.insight, '')}
                    {tag.label}
                  </span>
                  <span className="text-[12px] text-sp-text-secondary">{sensor.device}</span>

                  <div className="ml-auto">
                    {sensor.status === 'deployed' ? (
                      <div className="flex items-center gap-1.5 rounded-[4px] bg-sp-up px-3 py-1.5 text-[12px] font-bold text-white">
                        <Check size={13} />
                        Deployed
                      </div>
                    ) : sensor.status === 'pending' ? (
                      <div className="rounded-[4px] border border-sp-accent/20 bg-sp-accent px-3 py-1.5 text-[12px] font-bold text-white">
                        Pending Approval
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => actions.queueCoverageRecommendation(sensor.id)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-sp-bg-surface px-3 py-1.5 text-[12px] font-bold text-sp-text-secondary transition-colors hover:bg-sp-accent hover:text-white"
                      >
                        <Plus size={13} />
                        Queue for Approval
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[14px] font-medium text-sp-text-brand">{sensor.sensor}</div>
                <div className="mt-2 rounded-[6px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                  <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">
                    <Brain size={10} />
                    NEO Analysis
                  </div>
                  <p className="text-[12px] leading-[17px] text-sp-text-alt">{sensor.rationale}</p>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {sensor.deepLinks.map((link) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => actions.recordEvent('coverage', `Opened "${link}" for ${sensor.sensor} on ${sensor.device}.`)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-[4px] border border-sp-border-subtle/50 bg-sp-bg-surface px-2 py-1 text-[11px] text-sp-text-alt transition-colors hover:border-sp-accent/30 hover:text-sp-accent"
                    >
                      <ExternalLink size={9} />
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
