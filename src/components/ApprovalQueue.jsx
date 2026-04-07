import { useState } from 'react'
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Pause,
  Plus,
  Shield,
  XCircle,
  Zap,
} from 'lucide-react'
import { useDemo } from '../demoContext'

const agentIcons = {
  Coverage: { Icon: Shield, color: 'text-sp-up', bg: 'bg-sp-up-bg' },
  Signal: { Icon: Activity, color: 'text-sp-accent', bg: 'bg-sp-accent-soft' },
  Resolution: { Icon: Zap, color: 'text-sp-accent-tertiary', bg: 'bg-sp-unknown-bg' },
}

const actionIcons = {
  'Add Sensor': Plus,
  'Update Thresholds': Activity,
  'Pause Backup Job': Pause,
}

const statusStyles = {
  approved: { text: 'text-sp-up', bg: 'bg-sp-up-bg', label: 'Approved' },
  rejected: { text: 'text-sp-down', bg: 'bg-sp-down-bg', label: 'Rejected' },
}

export default function ApprovalQueue() {
  const { state, data, actions } = useDemo()
  const [expanded, setExpanded] = useState({})

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-medium text-sp-text-brand">
            <CheckCircle2 size={20} className="text-sp-up" />
            Approval Queue
          </h1>
          <p className="mt-1 text-[13px] text-sp-text-alt">
            Human-in-the-loop execution. Every meaningful NEO action routes through this queue.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-warning">{state.approvalsPending.length}</div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Pending</div>
          </div>
          <div className="h-10 w-px bg-sp-border-subtle" />
          <div className="text-right">
            <div className="text-[24px] font-bold text-sp-up">{state.approvalHistory.filter((item) => item.status === 'approved').length}</div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-sp-text-tertiary">Approved</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="space-y-3 xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-medium text-sp-text-brand">Pending Actions</h2>
          </div>

          {!state.approvalsPending.length && (
            <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-8 text-center">
              <CheckCircle2 size={32} className="mx-auto mb-3 text-sp-up" />
              <div className="text-[14px] font-medium text-sp-text-brand">All caught up</div>
              <p className="mt-1 text-[12px] text-sp-text-secondary">There are no pending actions in the current demo scenario.</p>
            </div>
          )}

          {state.approvalsPending.map((item) => {
            const meta = agentIcons[item.agent]
            const ActionIcon = actionIcons[item.action] || Plus
            const isExpanded = expanded[item.id]

            return (
              <div key={item.id} className="rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised">
                <button
                  type="button"
                  onClick={() => setExpanded((current) => ({ ...current, [item.id]: !current[item.id] }))}
                  className="flex w-full cursor-pointer items-center gap-3 p-4 text-left"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${meta.bg}`}>
                    <meta.Icon size={16} className={meta.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${data.priorityStyles[item.priority]}`}>{item.priority}</span>
                      <span className="text-[10px] text-sp-text-tertiary">{item.agent} Agent</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[13px] font-medium text-sp-text-brand">
                      <ActionIcon size={12} className="text-sp-text-secondary" />
                      {item.action}: {item.target}
                    </div>
                    <div className="mt-0.5 text-[11px] text-sp-text-secondary">on {item.device} - {item.impact}</div>
                  </div>
                  <ChevronRight size={14} className={`text-sp-text-tertiary transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="border-t border-sp-border-subtle/50 px-4 pb-4 pt-3">
                    <div className="mb-3 rounded-[6px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">NEO Rationale</div>
                      <p className="text-[12px] leading-[17px] text-sp-text-base">{item.reason}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => actions.approveAction(item.id)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-[6px] bg-sp-up px-4 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                      >
                        <CheckCircle2 size={13} />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => actions.rejectAction(item.id)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-[6px] bg-sp-down px-4 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <h2 className="mb-3 text-[14px] font-medium text-sp-text-brand">Execution Effects</h2>
            <div className="space-y-2 text-[12px] text-sp-text-secondary">
              <div className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                Coverage approvals update the device tree, recommendation status, and gap-closure metrics.
              </div>
              <div className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                Signal approvals switch the DMZ chart to the AI baseline and increase live ROI.
              </div>
              <div className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                Resolution approvals close the incident and complete the NEO timeline.
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised p-4">
            <h2 className="mb-3 text-[14px] font-medium text-sp-text-brand">Audit Trail</h2>
            <div className="space-y-2">
              {state.approvalHistory.slice(0, 7).map((item) => {
                const style = statusStyles[item.status]
                return (
                  <div key={item.id} className="rounded-[8px] border border-sp-border-subtle/50 bg-sp-bg-surface p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[12px] font-medium text-sp-text-brand">{item.action}</span>
                      <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${style.bg} ${style.text}`}>{style.label}</span>
                    </div>
                    <div className="text-[11px] leading-[16px] text-sp-text-secondary">
                      {item.target} on {item.device}
                    </div>
                    <div className="mt-1 text-[10px] text-sp-text-tertiary">
                      {item.by} - {item.at} - {item.duration}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
