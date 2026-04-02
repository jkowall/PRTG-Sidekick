import { useState } from 'react'
import { ChevronRight, ChevronDown, Server, Monitor, Router, HardDrive, Wifi, Plus, Check, Shield, Brain, Link2, TrendingUp, History, AlertTriangle, ExternalLink } from 'lucide-react'

const deviceTree = [
  {
    id: 'probe-local',
    name: 'Local Probe',
    type: 'probe',
    expanded: true,
    children: [
      {
        id: 'grp-core',
        name: 'Core Infrastructure',
        type: 'group',
        expanded: true,
        children: [
          { id: 'sw-core-01', name: 'sw-core-01', type: 'switch', ip: '10.0.1.1', sensors: 12, missing: 1 },
          { id: 'sw-core-02', name: 'sw-core-02', type: 'switch', ip: '10.0.1.2', sensors: 14, missing: 0 },
          { id: 'fw-edge-01', name: 'fw-edge-01', type: 'firewall', ip: '10.0.1.10', sensors: 8, missing: 1 },
        ],
      },
      {
        id: 'grp-servers',
        name: 'Production Servers',
        type: 'group',
        expanded: true,
        children: [
          { id: 'db-prod-01', name: 'db-prod-01', type: 'server', ip: '10.0.10.5', sensors: 18, missing: 1 },
          { id: 'db-prod-02', name: 'db-prod-02', type: 'server', ip: '10.0.10.6', sensors: 16, missing: 1 },
          { id: 'web-prod-01', name: 'web-prod-01', type: 'server', ip: '10.0.10.20', sensors: 9, missing: 0 },
          { id: 'app-prod-01', name: 'app-prod-01', type: 'server', ip: '10.0.10.30', sensors: 11, missing: 1 },
        ],
      },
      {
        id: 'grp-wifi',
        name: 'Wireless Infrastructure',
        type: 'group',
        expanded: false,
        children: [
          { id: 'ap-floor1', name: 'ap-floor1-01', type: 'ap', ip: '10.0.20.1', sensors: 4, missing: 0 },
          { id: 'ap-floor2', name: 'ap-floor2-01', type: 'ap', ip: '10.0.20.2', sensors: 4, missing: 0 },
        ],
      },
    ],
  },
]

// NEO insight tags that explain *how* the AI discovered the gap
const insightTags = {
  peerComparison: { label: 'Peer Comparison', icon: Link2, style: 'bg-sp-accent-soft text-sp-accent' },
  incidentCorrelation: { label: 'Incident Correlation', icon: History, style: 'bg-sp-unusual-bg text-sp-unusual' },
  behavioralAnomaly: { label: 'Behavioral Anomaly', icon: TrendingUp, style: 'bg-sp-warning-bg text-sp-warning' },
  fleetPattern: { label: 'Fleet Pattern', icon: Brain, style: 'bg-sp-unknown-bg text-sp-accent-tertiary' },
  failurePrediction: { label: 'Failure Prediction', icon: AlertTriangle, style: 'bg-sp-down-bg text-sp-down' },
}

const missingSensors = [
  {
    id: 1,
    device: 'db-prod-02',
    sensor: 'Windows Event Log — Backup Job Events',
    priority: 'Critical',
    insight: 'incidentCorrelation',
    rationale: 'NEO correlated 3 incidents in the past 90 days on this host with unmonitored backup job windows. INC-2024-0847 (storage I/O saturation) was caused by an un-throttled backup that went undetected for 28 minutes. An event log sensor filtering for Event ID 18210/18264 would have caught the runaway job within one scan interval.',
    deepLinks: [
      { label: 'View INC-2024-0847 timeline', icon: History },
      { label: 'Backup event correlation analysis', icon: Brain },
    ],
  },
  {
    id: 2,
    device: 'sw-core-01',
    sensor: 'SNMP Custom — STP Topology Change Counter',
    priority: 'Critical',
    insight: 'fleetPattern',
    rationale: 'NEO analyzed 2,400 PRTG installations and found that environments with >3 VLANs and no STP monitoring experience 4.2x more unplanned outages from broadcast storms. Your core switch handles 6 VLANs but has no visibility into spanning tree reconvergence events. A topology change counter would detect loops before they cascade.',
    deepLinks: [
      { label: 'Fleet benchmark: your setup vs. peers', icon: Link2 },
      { label: 'STP sensor configuration guide', icon: ExternalLink },
    ],
  },
  {
    id: 3,
    device: 'app-prod-01',
    sensor: 'WMI Process — Thread Pool Exhaustion Monitor',
    priority: 'High',
    insight: 'behavioralAnomaly',
    rationale: 'CPU and memory on app-prod-01 have been nominal, but NEO detected a pattern of increasing handle counts every Tuesday at 09:00 UTC that reset after the weekly IIS recycle. The trend suggests a slow resource leak that will breach limits in ~3 weeks. A process-level thread/handle sensor would track this before it causes an outage.',
    deepLinks: [
      { label: 'Handle count trend analysis (8 weeks)', icon: TrendingUp },
      { label: 'Predicted exhaustion timeline', icon: AlertTriangle },
    ],
  },
  {
    id: 4,
    device: 'fw-edge-01',
    sensor: 'SNMP Custom — VPN Tunnel Availability',
    priority: 'High',
    insight: 'peerComparison',
    rationale: 'Your firewall has 4 site-to-site VPN tunnels, but only ping monitors the remote endpoints. NEO compared with similarly configured PRTG environments and found 92% monitor tunnel state via SNMP. Last month, tunnel-02 to your DR site flapped 14 times — visible only in the firewall logs, not in PRTG. You\'d have no warning if DR replication drops.',
    deepLinks: [
      { label: 'Tunnel flap log analysis (30d)', icon: History },
      { label: 'Peer comparison: firewall monitoring', icon: Link2 },
    ],
  },
  {
    id: 5,
    device: 'db-prod-01',
    sensor: 'WMI Custom — SQL Replication Lag (sec)',
    priority: 'High',
    insight: 'failurePrediction',
    rationale: 'db-prod-01 replicates to db-prod-02, but there\'s no sensor measuring replication latency. NEO detected that during the INC-2024-0847 incident, queries failed over to db-prod-01 and replication lag likely spiked — but there\'s no data to confirm. Without this sensor, a split-brain scenario between the two database servers would go undetected.',
    deepLinks: [
      { label: 'Replication topology map', icon: Link2 },
      { label: 'Split-brain risk assessment', icon: Brain },
    ],
  },
]

const priorityStyles = {
  Critical: 'bg-sp-down-bg text-sp-down',
  High: 'bg-sp-unusual-bg text-sp-unusual',
  Medium: 'bg-sp-accent-soft text-sp-accent',
}

const iconForType = (type) => {
  switch (type) {
    case 'probe': return Monitor
    case 'group': return HardDrive
    case 'switch':
    case 'firewall': return Router
    case 'server': return Server
    case 'ap': return Wifi
    default: return Server
  }
}

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(node.expanded ?? false)
  const Icon = iconForType(node.type)
  const hasChildren = node.children && node.children.length > 0
  const hasMissing = node.missing > 0

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-[4px] cursor-pointer hover:bg-sp-bg-surface-hover transition-colors duration-200 ${
          hasMissing ? 'bg-sp-warning-bg' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={14} className="text-sp-text-tertiary shrink-0" /> : <ChevronRight size={14} className="text-sp-text-tertiary shrink-0" />
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        <Icon size={14} className={hasMissing ? 'text-sp-warning' : 'text-sp-text-secondary'} />
        <span className={`text-[13px] ${hasMissing ? 'text-sp-warning font-medium' : 'text-sp-text-base'}`}>
          {node.name}
        </span>
        {node.ip && <span className="text-[11px] text-sp-text-tertiary ml-auto font-mono">{node.ip}</span>}
        {node.sensors !== undefined && (
          <span className="text-[11px] text-sp-text-tertiary ml-1">{node.sensors}s</span>
        )}
        {hasMissing && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-sp-warning-bg text-sp-warning font-bold">
            +{node.missing}
          </span>
        )}
      </div>
      {expanded && hasChildren && node.children.map(child => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function CoverageAgent() {
  const [deployed, setDeployed] = useState({})
  const [deploying, setDeploying] = useState(null)

  const handleDeploy = (id) => {
    setDeploying(id)
    setTimeout(() => {
      setDeployed(prev => ({ ...prev, [id]: true }))
      setDeploying(null)
    }, 1200)
  }

  const handleDeployAll = () => {
    const remaining = missingSensors.filter(s => !deployed[s.id])
    remaining.forEach((s, i) => {
      setTimeout(() => {
        setDeploying(s.id)
        setTimeout(() => {
          setDeployed(prev => ({ ...prev, [s.id]: true }))
          setDeploying(null)
        }, 600)
      }, i * 800)
    })
  }

  const allDeployed = missingSensors.every(s => deployed[s.id])
  const deployedCount = missingSensors.filter(s => deployed[s.id]).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <Shield size={20} className="text-sp-up" />
            Coverage Agent
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            AI-discovered monitoring gaps from incident correlation, fleet benchmarks, and behavioral analysis
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-warning">{5 - deployedCount}</div>
            <div className="text-[10px] text-sp-text-tertiary uppercase tracking-[0.06em]">Gaps Found</div>
          </div>
          <div className="w-px h-10 bg-sp-border-subtle" />
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-up">{deployedCount}</div>
            <div className="text-[10px] text-sp-text-tertiary uppercase tracking-[0.06em]">Deployed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Device Tree */}
        <div className="col-span-2 space-y-4">
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-medium text-sp-text-brand">Device Tree</h2>
              <span className="text-[10px] text-sp-text-tertiary">11 devices monitored</span>
            </div>
            <div className="space-y-0.5">
              {deviceTree.map(node => (
                <TreeNode key={node.id} node={node} />
              ))}
            </div>
          </div>

          {/* How NEO Found These */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3 flex items-center gap-2">
              <Brain size={14} className="text-sp-accent-tertiary" />
              How NEO Finds Gaps
            </h2>
            <div className="space-y-2">
              {Object.entries(insightTags).map(([key, tag]) => {
                const TagIcon = tag.icon
                const count = missingSensors.filter(s => s.insight === key).length
                if (count === 0) return null
                return (
                  <div key={key} className="flex items-center gap-2 text-[12px]">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] ${tag.style}`}>
                      <TagIcon size={10} />
                      <span className="font-medium">{tag.label}</span>
                    </div>
                    <span className="text-sp-text-tertiary">{count} recommendation{count > 1 ? 's' : ''}</span>
                  </div>
                )
              })}
            </div>
            <p className="text-[11px] text-sp-text-tertiary mt-3 leading-[16px]">
              NEO cross-references your incident history, sensor telemetry, and anonymized fleet data from 2,400+ PRTG installations to surface gaps you wouldn't find manually.
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-medium text-sp-text-brand">AI-Discovered Gaps</h2>
            {!allDeployed && (
              <button
                onClick={handleDeployAll}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] bg-sp-accent text-white text-[12px] font-bold tracking-[0.02em] hover:bg-sp-accent-hover active:bg-sp-accent-active transition-colors duration-200 cursor-pointer"
              >
                <Plus size={13} />
                Approve &amp; Deploy All
              </button>
            )}
          </div>

          {missingSensors.map((sensor) => {
            const isDeployed = deployed[sensor.id]
            const isDeploying = deploying === sensor.id
            const tag = insightTags[sensor.insight]
            const TagIcon = tag.icon

            return (
              <div
                key={sensor.id}
                className={`bg-sp-bg-raised rounded-[8px] border p-4 transition-all duration-200 ${
                  isDeployed
                    ? 'border-sp-up/30'
                    : 'border-sp-border-subtle hover:border-sp-border-strong'
                }`}
              >
                {/* Tags row + deploy action */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold ${priorityStyles[sensor.priority]}`}>
                    {sensor.priority}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-medium flex items-center gap-1 ${tag.style}`}>
                    <TagIcon size={9} />
                    {tag.label}
                  </span>
                  <span className="text-[12px] text-sp-text-secondary">{sensor.device}</span>
                  <div className="ml-auto shrink-0">
                    {isDeployed ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-sp-up-bg text-sp-up text-[12px] font-bold">
                        <Check size={13} />
                        Deployed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeploy(sensor.id)}
                        disabled={isDeploying}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[12px] font-bold tracking-[0.02em] transition-all duration-200 cursor-pointer ${
                          isDeploying
                            ? 'bg-sp-up-bg text-sp-up animate-pulse'
                            : 'bg-sp-bg-surface text-sp-text-secondary hover:bg-sp-accent hover:text-white active:bg-sp-accent-active'
                        }`}
                      >
                        {isDeploying ? 'Deploying...' : <><Plus size={13} /> Deploy</>}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sensor name */}
                <div className="text-[14px] font-medium text-sp-text-brand">{sensor.sensor}</div>

                {/* NEO rationale */}
                <div className="mt-2 bg-sp-bg-surface rounded-[6px] p-2.5 border border-sp-border-subtle/50">
                  <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-1 flex items-center gap-1">
                    <Brain size={9} />
                    NEO Analysis
                  </div>
                  <p className="text-[12px] text-sp-text-alt leading-[17px]">
                    {sensor.rationale}
                  </p>
                </div>

                {/* Deep links */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {sensor.deepLinks.map((link, i) => {
                    const DLIcon = link.icon
                    return (
                      <button
                        key={i}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-[4px] text-[11px] text-sp-text-alt bg-sp-bg-surface border border-sp-border-subtle/50 hover:text-sp-accent hover:border-sp-accent/30 transition-all duration-200 cursor-pointer"
                      >
                        <DLIcon size={10} />
                        {link.label}
                        <ExternalLink size={8} className="opacity-40" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
