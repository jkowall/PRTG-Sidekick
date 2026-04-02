import { useState } from 'react'
import { Clock, Zap, ArrowRight, User, Bot, AlertTriangle, CheckCircle2, Eye, Search, Wrench, FileText, MessageSquare, Pause, BarChart3, Brain } from 'lucide-react'

const manualSteps = [
  { time: '0:00', duration: '5 min', label: 'Alert storm triggers', description: 'Multiple alerts fire across db-prod-02. Engineer receives PagerDuty notification.', icon: AlertTriangle, iconColor: 'text-sp-down', iconBg: 'bg-sp-down-bg' },
  { time: '0:05', duration: '15 min', label: 'Engineer scans dashboards', description: 'Opens PRTG, checks multiple sensor pages, reviews device status. Tries to correlate which sensor failed first.', icon: Eye, iconColor: 'text-sp-warning', iconBg: 'bg-sp-warning-bg' },
  { time: '0:20', duration: '20 min', label: 'Checks logs across systems', description: 'RDPs into db-prod-02, checks Windows Event Viewer, SQL Server logs, backup job history. Cross-references timestamps manually.', icon: Search, iconColor: 'text-sp-warning', iconBg: 'bg-sp-warning-bg' },
  { time: '0:40', duration: '15 min', label: 'Guesses root cause', description: 'Suspects backup job based on timing, but also considers memory pressure and possible network issue. No structured analysis to confirm.', icon: Brain, iconColor: 'text-sp-unusual', iconBg: 'bg-sp-unusual-bg' },
  { time: '0:55', duration: '20 min', label: 'Tests fixes manually', description: 'Pauses backup job, waits for I/O to settle, monitors recovery. Has to manually check each sensor to confirm.', icon: Wrench, iconColor: 'text-sp-unusual', iconBg: 'bg-sp-unusual-bg' },
  { time: '1:15', duration: '15 min', label: 'Documents after the fact', description: 'Writes incident report, updates ticket, notifies team. Knowledge stays in one person\'s head.', icon: FileText, iconColor: 'text-sp-text-secondary', iconBg: 'bg-sp-bg-surface-hover' },
]

const neoSteps = [
  { time: '0:00', duration: '30 sec', label: 'Signal Agent identifies root cause', description: 'NEO correlates all sensor failures, identifies disk I/O spike at 14:31 as the origin. Ranks storage I/O saturation at 87% confidence.', icon: Zap, iconColor: 'text-sp-up', iconBg: 'bg-sp-up-bg' },
  { time: '0:01', duration: '1 min', label: 'NEO explains impact and scope', description: 'Conversational summary: "4 sensors affected on db-prod-02. Root cause is unthrottled backup job causing storage I/O saturation. Started at 14:30 UTC."', icon: MessageSquare, iconColor: 'text-sp-up', iconBg: 'bg-sp-up-bg' },
  { time: '0:02', duration: '1 min', label: 'Resolution Agent suggests fix', description: 'Recommends: (1) Pause backup job, (2) Reschedule outside business hours, (3) Enable VSS snapshots. Confidence: 87%.', icon: Brain, iconColor: 'text-sp-up', iconBg: 'bg-sp-up-bg' },
  { time: '0:03', duration: '30 sec', label: 'Engineer reviews and approves', description: 'Reviews NEO analysis in Approval Queue. One click to approve "Pause Backup Job" action. Executed in 0.4s.', icon: CheckCircle2, iconColor: 'text-sp-accent', iconBg: 'bg-sp-accent-soft' },
  { time: '0:04', duration: '2 min', label: 'System recovers & documents', description: 'NEO monitors recovery, confirms all 4 sensors return to normal. Auto-generates incident report with root cause, evidence chain, and prevention steps.', icon: FileText, iconColor: 'text-sp-up', iconBg: 'bg-sp-up-bg' },
]

const comparisonMetrics = [
  { label: 'Total Resolution Time', manual: '1h 30m', neo: '5 min', improvement: '94%', color: 'text-sp-up' },
  { label: 'Time to Root Cause', manual: '40 min', neo: '30 sec', improvement: '99%', color: 'text-sp-up' },
  { label: 'Manual Steps Required', manual: '12+', neo: '1 click', improvement: '92%', color: 'text-sp-up' },
  { label: 'Systems Accessed', manual: '5 (PRTG, RDP, Event Viewer, SQL, Backup)', neo: '0 (NEO handles it)', improvement: '100%', color: 'text-sp-up' },
  { label: 'Documentation', manual: 'Manual, after the fact', neo: 'Auto-generated, real-time', improvement: '', color: 'text-sp-accent' },
  { label: 'Knowledge Retained', manual: 'In one person\'s head', neo: 'In system, reusable', improvement: '', color: 'text-sp-accent' },
]

export default function ResolutionTimeline() {
  const [activeView, setActiveView] = useState('side-by-side')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <Clock size={20} className="text-sp-up" />
            Resolution Timeline
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            Side-by-side: manual incident resolution vs NEO-assisted — same incident, different outcomes
          </p>
        </div>
      </div>

      {/* Incident Context */}
      <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-sp-down-bg flex items-center justify-center border border-sp-down/20">
            <Zap size={20} className="text-sp-down" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-sp-text-brand">INC-2024-0847</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-sp-down-bg text-sp-down font-bold border border-sp-down/20">Critical</span>
            </div>
            <div className="text-[12px] text-sp-text-secondary mt-0.5">
              Storage I/O saturation on db-prod-02 — 4 sensors affected — caused by unthrottled backup job
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-sp-down" />
                <span className="text-[18px] font-bold text-sp-down">1h 30m</span>
              </div>
              <div className="text-[10px] text-sp-text-tertiary">Manual</div>
            </div>
            <ArrowRight size={20} className="text-sp-text-tertiary" />
            <div className="text-center">
              <div className="flex items-center gap-1.5">
                <Bot size={14} className="text-sp-up" />
                <span className="text-[18px] font-bold text-sp-up">5 min</span>
              </div>
              <div className="text-[10px] text-sp-text-tertiary">With NEO</div>
            </div>
            <div className="bg-sp-up-bg rounded-[8px] px-3 py-2 border border-sp-up/20">
              <div className="text-[20px] font-bold text-sp-up">94%</div>
              <div className="text-[10px] text-sp-text-tertiary">Faster</div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Timelines */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Manual Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-sp-down" />
            <h2 className="text-[14px] font-medium text-sp-text-brand">Today — Manual Process</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-sp-down-bg text-sp-down font-bold">1h 30m</span>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-sp-down/30" />

            <div className="space-y-0">
              {manualSteps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="relative flex gap-3 pb-4">
                    <div className={`w-[30px] h-[30px] rounded-full ${step.iconBg} flex items-center justify-center shrink-0 z-10 border-2 border-sp-bg-base`}>
                      <Icon size={13} className={step.iconColor} />
                    </div>
                    <div className="flex-1 bg-sp-bg-raised rounded-[8px] border border-sp-border-subtle p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium text-sp-text-brand">{step.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-sp-text-tertiary font-mono">{step.time}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-sp-down-bg text-sp-down font-bold">{step.duration}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-sp-text-secondary leading-[16px]">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* NEO Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bot size={16} className="text-sp-up" />
            <h2 className="text-[14px] font-medium text-sp-text-brand">With NEO — AI-Assisted</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-sp-up-bg text-sp-up font-bold">5 min</span>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-sp-up/30" />

            <div className="space-y-0">
              {neoSteps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="relative flex gap-3 pb-4">
                    <div className={`w-[30px] h-[30px] rounded-full ${step.iconBg} flex items-center justify-center shrink-0 z-10 border-2 border-sp-bg-base`}>
                      <Icon size={13} className={step.iconColor} />
                    </div>
                    <div className={`flex-1 rounded-[8px] border p-3 ${
                      step.iconColor === 'text-sp-up' ? 'bg-sp-up-bg border-sp-up/20' : 'bg-sp-accent-soft border-sp-accent/20'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium text-sp-text-brand">{step.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-sp-text-tertiary font-mono">{step.time}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-sp-up-bg text-sp-up font-bold">{step.duration}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-sp-text-secondary leading-[16px]">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-5">
        <h2 className="text-[14px] font-medium text-sp-text-brand mb-4 flex items-center gap-2">
          <BarChart3 size={14} className="text-sp-accent" />
          Impact Comparison
        </h2>
        <div className="overflow-hidden rounded-[8px] border border-sp-border-subtle">
          <table className="w-full">
            <thead>
              <tr className="bg-sp-bg-surface">
                <th className="px-4 py-2.5 text-left text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Metric</th>
                <th className="px-4 py-2.5 text-center text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">
                  <span className="flex items-center gap-1.5 justify-center"><User size={11} />Manual</span>
                </th>
                <th className="px-4 py-2.5 text-center text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">
                  <span className="flex items-center gap-1.5 justify-center"><Bot size={11} />With NEO</span>
                </th>
                <th className="px-4 py-2.5 text-center text-[11px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map((metric, i) => (
                <tr key={i} className="border-t border-sp-border-subtle/50">
                  <td className="px-4 py-2.5 text-[13px] font-medium text-sp-text-brand">{metric.label}</td>
                  <td className="px-4 py-2.5 text-center text-[13px] text-sp-down font-mono">{metric.manual}</td>
                  <td className="px-4 py-2.5 text-center text-[13px] text-sp-up font-mono font-medium">{metric.neo}</td>
                  <td className="px-4 py-2.5 text-center">
                    {metric.improvement ? (
                      <span className={`text-[12px] font-bold ${metric.color}`}>{metric.improvement}</span>
                    ) : (
                      <span className={`text-[11px] ${metric.color}`}>{metric.neo}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
