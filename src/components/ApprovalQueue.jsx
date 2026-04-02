import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, Shield, Activity, Zap, ChevronRight, ChevronDown, AlertTriangle, Filter, Plus, BellOff, Pause, Eye } from 'lucide-react'

const pendingActions = [
  {
    id: 'ACT-001',
    agent: 'Coverage',
    agentIcon: Shield,
    agentColor: 'text-sp-up',
    agentBg: 'bg-sp-up-bg',
    action: 'Deploy Sensor',
    target: 'SNMP Custom — STP Topology Change Counter',
    device: 'sw-core-01',
    priority: 'Critical',
    reason: 'Fleet pattern analysis: environments with >3 VLANs and no STP monitoring experience 4.2x more outages. Your core switch handles 6 VLANs.',
    requestedAt: '2 min ago',
    impact: 'Prevents broadcast storm blind spots',
  },
  {
    id: 'ACT-002',
    agent: 'Coverage',
    agentIcon: Shield,
    agentColor: 'text-sp-up',
    agentBg: 'bg-sp-up-bg',
    action: 'Deploy Sensor',
    target: 'WMI Custom — SQL Replication Lag (sec)',
    device: 'db-prod-01',
    priority: 'High',
    reason: 'Failure prediction: without replication lag monitoring, a split-brain scenario between db-prod-01 and db-prod-02 would go undetected.',
    requestedAt: '5 min ago',
    impact: 'Detects database split-brain risk',
  },
  {
    id: 'ACT-003',
    agent: 'Signal',
    agentIcon: Activity,
    agentColor: 'text-sp-accent',
    agentBg: 'bg-sp-accent-soft',
    action: 'Update Thresholds',
    target: 'DMZ Ping Sensors (14 sensors)',
    device: 'fw-dmz-01 group',
    priority: 'High',
    reason: 'Dynamic baseline analysis: switching from static 20ms to baseline + 2σ would eliminate 89% of false alerts (131 of 147 this week).',
    requestedAt: '8 min ago',
    impact: 'Eliminates 131 false alerts per week',
  },
  {
    id: 'ACT-004',
    agent: 'Resolution',
    agentIcon: Zap,
    agentColor: 'text-sp-accent-tertiary',
    agentBg: 'bg-sp-unknown-bg',
    action: 'Pause Backup Job',
    target: 'Scheduled backup — db-prod-02',
    device: 'db-prod-02',
    priority: 'Critical',
    reason: 'Root cause analysis (87% confidence): unthrottled backup job is causing storage I/O saturation. Pausing will restore normal operations.',
    requestedAt: '12 min ago',
    impact: 'Resolves active incident INC-2024-0847',
  },
]

const auditHistory = [
  { id: 'ACT-098', action: 'Deploy Sensor', target: 'Windows Event Log — Backup Events', device: 'db-prod-02', agent: 'Coverage', status: 'approved', by: 'jkowall', at: 'Today 14:22', duration: '1.2s' },
  { id: 'ACT-097', action: 'Update Threshold', target: 'Ping — fw-edge-01', device: 'fw-edge-01', agent: 'Signal', status: 'approved', by: 'jkowall', at: 'Today 13:45', duration: '0.8s' },
  { id: 'ACT-096', action: 'Acknowledge Sensors', target: '4 sensors on db-prod-02', device: 'db-prod-02', agent: 'Resolution', status: 'approved', by: 'mturner', at: 'Today 12:10', duration: '0.4s' },
  { id: 'ACT-095', action: 'Deploy Sensor', target: 'SNMP Traffic — Gi0/1', device: 'sw-core-01', agent: 'Coverage', status: 'rejected', by: 'jkowall', at: 'Yesterday 16:30', duration: '—', note: 'Port is being decommissioned next week' },
  { id: 'ACT-094', action: 'Update Threshold', target: 'CPU Load — app-prod-01', device: 'app-prod-01', agent: 'Signal', status: 'approved', by: 'jkowall', at: 'Yesterday 14:15', duration: '0.6s' },
  { id: 'ACT-093', action: 'Pause Sensor', target: 'WMI Process — handle leak check', device: 'app-prod-01', agent: 'Resolution', status: 'approved', by: 'mturner', at: 'Yesterday 11:00', duration: '0.3s' },
]

const priorityStyles = {
  Critical: 'bg-sp-down-bg text-sp-down',
  High: 'bg-sp-unusual-bg text-sp-unusual',
  Medium: 'bg-sp-accent-soft text-sp-accent',
}

const statusStyles = {
  approved: { bg: 'bg-sp-up-bg', text: 'text-sp-up', icon: CheckCircle2, label: 'Approved' },
  rejected: { bg: 'bg-sp-down-bg', text: 'text-sp-down', icon: XCircle, label: 'Rejected' },
}

const actionIcons = {
  'Deploy Sensor': Plus,
  'Update Thresholds': BellOff,
  'Update Threshold': BellOff,
  'Pause Backup Job': Pause,
  'Acknowledge Sensors': CheckCircle2,
  'Pause Sensor': Pause,
}

export default function ApprovalQueue() {
  const [queue, setQueue] = useState(pendingActions)
  const [history, setHistory] = useState(auditHistory)
  const [expanded, setExpanded] = useState({ 'ACT-001': true })
  const [processing, setProcessing] = useState(null)

  const handleApprove = (id) => {
    setProcessing(id)
    setTimeout(() => {
      const item = queue.find(a => a.id === id)
      setQueue(prev => prev.filter(a => a.id !== id))
      setHistory(prev => [{
        id: item.id,
        action: item.action,
        target: item.target,
        device: item.device,
        agent: item.agent,
        status: 'approved',
        by: 'jkowall',
        at: 'Just now',
        duration: `${(Math.random() * 2 + 0.3).toFixed(1)}s`,
      }, ...prev])
      setProcessing(null)
    }, 1000)
  }

  const handleReject = (id) => {
    const item = queue.find(a => a.id === id)
    setQueue(prev => prev.filter(a => a.id !== id))
    setHistory(prev => [{
      id: item.id,
      action: item.action,
      target: item.target,
      device: item.device,
      agent: item.agent,
      status: 'rejected',
      by: 'jkowall',
      at: 'Just now',
      duration: '—',
    }, ...prev])
  }

  const handleApproveAll = () => {
    queue.forEach((item, i) => {
      setTimeout(() => {
        setProcessing(item.id)
        setTimeout(() => {
          setQueue(prev => prev.filter(a => a.id !== item.id))
          setHistory(prev => [{
            id: item.id,
            action: item.action,
            target: item.target,
            device: item.device,
            agent: item.agent,
            status: 'approved',
            by: 'jkowall',
            at: 'Just now',
            duration: `${(Math.random() * 2 + 0.3).toFixed(1)}s`,
          }, ...prev])
          setProcessing(null)
        }, 500)
      }, i * 700)
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <CheckCircle2 size={20} className="text-sp-up" />
            Approval Queue
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            Human-in-the-loop — review and approve all NEO agent actions before execution
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-warning">{queue.length}</div>
            <div className="text-[10px] text-sp-text-tertiary uppercase tracking-[0.06em]">Pending</div>
          </div>
          <div className="w-px h-10 bg-sp-border-subtle" />
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-up">{history.filter(h => h.status === 'approved').length}</div>
            <div className="text-[10px] text-sp-text-tertiary uppercase tracking-[0.06em]">Approved</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Pending Approvals */}
        <div className="col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-medium text-sp-text-brand">Pending Actions</h2>
            {queue.length > 0 && (
              <button
                onClick={handleApproveAll}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] bg-sp-accent text-white text-[12px] font-bold tracking-[0.02em] hover:bg-sp-accent-hover active:bg-sp-accent-active transition-colors duration-200 cursor-pointer"
              >
                <CheckCircle2 size={13} />
                Approve All ({queue.length})
              </button>
            )}
          </div>

          {queue.length === 0 && (
            <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-8 text-center">
              <CheckCircle2 size={32} className="text-sp-up mx-auto mb-3" />
              <div className="text-[14px] font-medium text-sp-text-brand">All caught up</div>
              <p className="text-[12px] text-sp-text-secondary mt-1">No pending actions from NEO agents.</p>
            </div>
          )}

          {queue.map((item) => {
            const isExpanded = expanded[item.id]
            const isProcessing = processing === item.id
            const AgentIcon = item.agentIcon
            const ActionIcon = actionIcons[item.action] || Plus

            return (
              <div
                key={item.id}
                className={`bg-sp-bg-raised rounded-[8px] border transition-all duration-200 ${
                  isProcessing ? 'border-sp-up/30 bg-sp-up-bg animate-pulse' : 'border-sp-border-subtle'
                }`}
              >
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="w-full flex items-center gap-3 p-4 cursor-pointer text-left"
                >
                  <div className={`w-8 h-8 rounded-[8px] ${item.agentBg} flex items-center justify-center shrink-0`}>
                    <AgentIcon size={16} className={item.agentColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold ${priorityStyles[item.priority]}`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] text-sp-text-tertiary">{item.agent} Agent</span>
                      <span className="text-[10px] text-sp-text-disabled">•</span>
                      <span className="text-[10px] text-sp-text-tertiary">{item.requestedAt}</span>
                    </div>
                    <div className="text-[13px] font-medium text-sp-text-brand mt-0.5 flex items-center gap-2">
                      <ActionIcon size={12} className="text-sp-text-secondary" />
                      {item.action}: {item.target}
                    </div>
                    <div className="text-[11px] text-sp-text-secondary mt-0.5">on {item.device} — {item.impact}</div>
                  </div>
                  <ChevronRight size={14} className={`text-sp-text-tertiary transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-sp-border-subtle/50">
                    <div className="pt-3">
                      {/* Reason */}
                      <div className="bg-sp-bg-surface rounded-[6px] p-3 border border-sp-border-subtle/50 mb-3">
                        <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-1">NEO Rationale</div>
                        <p className="text-[12px] text-sp-text-base leading-[17px]">{item.reason}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-sp-up text-white text-[12px] font-bold hover:opacity-90 transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          {isProcessing ? 'Executing...' : 'Approve & Execute'}
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-sp-bg-surface text-sp-text-secondary text-[12px] font-bold border border-sp-border-subtle hover:text-sp-down hover:border-sp-down/30 transition-all duration-200 cursor-pointer"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] text-sp-text-tertiary text-[12px] hover:text-sp-text-base transition-colors duration-200 cursor-pointer">
                          <Eye size={14} />
                          View in Agent
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Audit Trail */}
        <div className="col-span-2 space-y-4">
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-medium text-sp-text-brand">Audit Trail</h2>
              <span className="text-[10px] text-sp-text-tertiary">{history.length} actions</span>
            </div>
            <div className="space-y-1.5">
              {history.map((entry) => {
                const status = statusStyles[entry.status]
                const StatusIcon = status.icon
                return (
                  <div key={entry.id} className="flex items-start gap-2.5 py-2 border-b border-sp-border-subtle/50 last:border-0">
                    <div className={`w-5 h-5 rounded-full ${status.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <StatusIcon size={11} className={status.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-medium text-sp-text-brand truncate">{entry.action}</span>
                        <span className={`text-[9px] px-1 py-0.5 rounded-[3px] font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-sp-text-secondary truncate">{entry.target}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-sp-text-tertiary">{entry.at}</span>
                        <span className="text-[10px] text-sp-text-disabled">•</span>
                        <span className="text-[10px] text-sp-text-tertiary">by {entry.by}</span>
                        {entry.duration !== '—' && (
                          <>
                            <span className="text-[10px] text-sp-text-disabled">•</span>
                            <span className="text-[10px] text-sp-text-tertiary">{entry.duration}</span>
                          </>
                        )}
                      </div>
                      {entry.note && (
                        <div className="text-[10px] text-sp-unusual mt-0.5 italic">Note: {entry.note}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3">Approval Stats</h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-sp-text-secondary">Approval rate</span>
                <span className="text-[13px] font-bold text-sp-up">83%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-sp-text-secondary">Avg. review time</span>
                <span className="text-[13px] font-bold text-sp-text-base">3.2 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-sp-text-secondary">Avg. execution time</span>
                <span className="text-[13px] font-bold text-sp-text-base">0.8s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-sp-text-secondary">Actions this week</span>
                <span className="text-[13px] font-bold text-sp-accent">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-sp-text-secondary">Rejected this week</span>
                <span className="text-[13px] font-bold text-sp-down">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
