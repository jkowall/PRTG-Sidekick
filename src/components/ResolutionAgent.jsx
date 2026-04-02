import { useState } from 'react'
import { AlertTriangle, Clock, Server, HardDrive, Cpu, ChevronRight, Zap, TrendingUp, ExternalLink, BookOpen, BarChart3, History, Lightbulb, ArrowRight, FileText, Link2 } from 'lucide-react'

const incident = {
  id: 'INC-2024-0847',
  severity: 'Critical',
  started: '14:32 UTC',
  duration: '28 min',
  affectedDevice: 'db-prod-02',
  ip: '10.0.10.6',
  downSensors: [
    { name: 'SQL Server Response Time', status: 'Down', value: 'Timeout (>30s)', since: '14:32' },
    { name: 'WMI Disk I/O (D:)', status: 'Down', value: 'Queue: 142', since: '14:31' },
    { name: 'SNMP CPU Load', status: 'Warning', value: '94%', since: '14:33' },
    { name: 'WMI Memory', status: 'Warning', value: '91% used', since: '14:34' },
  ],
}

const hypotheses = [
  {
    id: 1, rank: 1,
    title: 'Storage I/O Saturation',
    confidence: 87,
    icon: HardDrive,
    iconBg: 'bg-sp-down-bg', iconText: 'text-sp-down', barBg: 'bg-sp-down', confText: 'text-sp-down',
    borderActive: 'border-sp-down/30',
    summary: 'The disk queue length on volume D: spiked to 142 at 14:31 UTC, one minute before all downstream sensors began failing. This strongly correlates with a scheduled backup job that started at 14:30 without I/O throttling.',
    evidence: [
      { text: 'Disk queue length spiked to 142 at 14:31 (normal baseline: <5)', type: 'metric' },
      { text: 'D: volume write latency >200ms (30-day baseline: 3ms)', type: 'metric' },
      { text: 'Correlates with scheduled backup job starting at 14:30', type: 'correlation' },
      { text: 'All downstream failures began 60–180s after I/O spike', type: 'timeline' },
    ],
    guidance: [
      'Consider pausing or throttling the backup job to restore I/O capacity',
      'Review backup schedule — moving it outside business hours would prevent recurrence',
      'Check if VSS snapshots are configured; they reduce I/O contention for SQL backups',
    ],
    deepLinks: [
      { label: 'View Disk I/O Sensor History (7d)', icon: BarChart3 },
      { label: 'View Backup Job Schedule Log', icon: History },
      { label: 'Similar Incidents (3 found in past 90d)', icon: FileText },
      { label: 'KB: SQL Server Backup I/O Best Practices', icon: BookOpen },
    ],
  },
  {
    id: 2, rank: 2,
    title: 'Memory Pressure from Query Cache',
    confidence: 45,
    icon: Cpu,
    iconBg: 'bg-sp-unusual-bg', iconText: 'text-sp-unusual', barBg: 'bg-sp-unusual', confText: 'text-sp-unusual',
    borderActive: 'border-sp-unusual/30',
    summary: 'Memory usage climbed from 72% to 91% in 3 minutes, with SQL Server buffer pool showing increased page faults. However, the timing suggests this is a secondary effect of the I/O saturation rather than an independent root cause.',
    evidence: [
      { text: 'Memory usage climbed from 72% to 91% in 3 minutes', type: 'metric' },
      { text: 'SQL Server buffer pool shows increased page faults', type: 'metric' },
      { text: 'Memory spike follows I/O spike by ~90s — likely secondary effect', type: 'correlation' },
    ],
    guidance: [
      'If memory remains high after I/O resolves, review SQL Server max memory settings',
      'Check for long-running queries that may be holding large memory grants',
    ],
    deepLinks: [
      { label: 'View Memory Sensor History (24h)', icon: BarChart3 },
      { label: 'SQL Server Memory Configuration', icon: BookOpen },
    ],
  },
  {
    id: 3, rank: 3,
    title: 'Network Connectivity Issue',
    confidence: 8,
    icon: Server,
    iconBg: 'bg-sp-accent-soft', iconText: 'text-sp-accent', barBg: 'bg-sp-accent', confText: 'text-sp-accent',
    borderActive: 'border-sp-accent/30',
    summary: 'Network connectivity to db-prod-02 remains healthy. Ping is stable at 1ms with no packet loss, and other devices on the same switch are unaffected. This can be ruled out as a contributing factor.',
    evidence: [
      { text: 'Ping to db-prod-02 remains stable at 1ms', type: 'metric' },
      { text: 'No packet loss detected on management interface', type: 'metric' },
      { text: 'Other devices on same switch are healthy', type: 'correlation' },
    ],
    guidance: [
      'No network action needed — connectivity is confirmed healthy',
    ],
    deepLinks: [
      { label: 'View Ping Sensor History (24h)', icon: BarChart3 },
    ],
  },
]

const relatedInsights = [
  {
    title: 'Pattern Detected: Recurring backup-related degradation',
    description: 'NEO found 3 similar incidents in the past 90 days, all correlating with the same 14:30 UTC backup window. Average recovery time: 22 minutes.',
    icon: History,
    linkLabel: 'View Incident History',
  },
  {
    title: 'Coverage Gap: No dedicated backup monitoring',
    description: 'db-prod-02 has no sensor tracking backup job status or duration. Adding a Windows Event Log sensor for backup events would provide early warning.',
    icon: Lightbulb,
    linkLabel: 'Open in Coverage Agent',
  },
  {
    title: 'Correlated Device: db-prod-01 showing elevated latency',
    description: 'The primary database server is experiencing 2x normal query latency, likely due to increased load from db-prod-02 failover queries.',
    icon: Link2,
    linkLabel: 'View db-prod-01 Sensors',
  },
]

const evidenceTypeIcon = {
  metric: BarChart3,
  correlation: Link2,
  timeline: History,
}

export default function ResolutionAgent() {
  const [expanded, setExpanded] = useState({ 1: true })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-sp-text-brand flex items-center gap-2">
            <AlertTriangle size={20} className="text-sp-up" />
            Resolution Agent
          </h1>
          <p className="text-[13px] text-sp-text-alt mt-1">
            AI-driven root cause analysis with guided investigation and remediation advice
          </p>
        </div>
      </div>

      {/* Active Incident Banner */}
      <div className="bg-sp-down-bg border border-sp-down/30 rounded-[8px] p-4 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-sp-down-bg flex items-center justify-center border border-sp-down/20">
              <Zap size={20} className="text-sp-down" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-sp-text-brand">{incident.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-sp-down-bg text-sp-down font-bold border border-sp-down/20">
                  {incident.severity}
                </span>
              </div>
              <div className="text-[12px] text-sp-text-secondary mt-0.5">
                {incident.affectedDevice} ({incident.ip}) — Started {incident.started}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="flex items-center gap-1 text-sp-down">
                <Clock size={12} />
                <span className="text-[14px] font-bold">{incident.duration}</span>
              </div>
              <div className="text-[10px] text-sp-text-tertiary">Duration</div>
            </div>
            <div>
              <div className="text-[14px] font-bold text-sp-down">{incident.downSensors.length}</div>
              <div className="text-[10px] text-sp-text-tertiary">Affected Sensors</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Left column: Affected Sensors + Related Insights */}
        <div className="col-span-2 space-y-4">
          {/* Affected Sensors */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3">Affected Sensors</h2>
            <div className="space-y-2">
              {incident.downSensors.map((sensor, i) => {
                const isDown = sensor.status === 'Down'
                return (
                  <div key={i} className={`rounded-[8px] border p-3 ${
                    isDown ? 'border-sp-down/30 bg-sp-down-bg' : 'border-sp-warning/30 bg-sp-warning-bg'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-sp-text-brand">{sensor.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold ${
                        isDown ? 'bg-sp-down-bg text-sp-down border border-sp-down/20' : 'bg-sp-warning-bg text-sp-warning border border-sp-warning/20'
                      }`}>
                        {sensor.status}
                      </span>
                    </div>
                    <div className="text-[12px] text-sp-text-secondary font-mono">
                      {sensor.value} — since {sensor.since}
                    </div>
                    <button className="mt-2 flex items-center gap-1 text-[11px] text-sp-accent hover:text-sp-accent-hover transition-colors duration-200 cursor-pointer">
                      <BarChart3 size={10} />
                      View sensor history
                      <ExternalLink size={9} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Related Insights */}
          <div className="bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4">
            <h2 className="text-[14px] font-medium text-sp-text-brand mb-3 flex items-center gap-2">
              <Lightbulb size={14} className="text-sp-warning" />
              NEO Insights
            </h2>
            <div className="space-y-3">
              {relatedInsights.map((insight, i) => {
                const Icon = insight.icon
                return (
                  <div key={i} className="bg-sp-bg-surface rounded-[8px] p-3 border border-sp-border-subtle/50">
                    <div className="flex items-start gap-2 mb-1.5">
                      <Icon size={13} className="text-sp-accent shrink-0 mt-0.5" />
                      <span className="text-[12px] font-medium text-sp-text-brand leading-[16px]">{insight.title}</span>
                    </div>
                    <p className="text-[11px] text-sp-text-secondary leading-[16px] ml-5">
                      {insight.description}
                    </p>
                    <button className="mt-2 ml-5 flex items-center gap-1 text-[11px] text-sp-accent hover:text-sp-accent-hover transition-colors duration-200 cursor-pointer">
                      {insight.linkLabel}
                      <ArrowRight size={10} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: Root Cause Hypotheses */}
        <div className="col-span-3 space-y-3">
          <h2 className="text-[14px] font-medium text-sp-text-brand">Root Cause Analysis</h2>

          {hypotheses.map((hyp) => {
            const Icon = hyp.icon
            const isExpanded = expanded[hyp.id]

            return (
              <div
                key={hyp.id}
                className={`bg-sp-bg-raised rounded-[8px] border transition-all duration-200 ${
                  hyp.rank === 1 ? hyp.borderActive : 'border-sp-border-subtle'
                }`}
              >
                {/* Collapse header */}
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [hyp.id]: !prev[hyp.id] }))}
                  className="w-full flex items-center gap-3 p-4 cursor-pointer text-left"
                >
                  <div className={`w-8 h-8 rounded-[8px] ${hyp.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={hyp.iconText} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-sp-text-tertiary">#{hyp.rank}</span>
                      <span className="text-[14px] font-medium text-sp-text-brand">{hyp.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 h-2 rounded-full bg-sp-bg-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full ${hyp.barBg} transition-all duration-500`}
                        style={{ width: `${hyp.confidence}%` }}
                      />
                    </div>
                    <span className={`text-[12px] font-bold ${hyp.confText} w-8`}>{hyp.confidence}%</span>
                  </div>
                  <ChevronRight size={14} className={`text-sp-text-tertiary transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-sp-border-subtle/50">
                    <div className="pt-3">
                      {/* AI Summary */}
                      <div className="bg-sp-bg-surface rounded-[8px] p-3 mb-4 border border-sp-border-subtle/50">
                        <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-1.5 flex items-center gap-1.5">
                          <BookOpen size={10} />
                          NEO Analysis
                        </div>
                        <p className="text-[12px] text-sp-text-base leading-[18px]">
                          {hyp.summary}
                        </p>
                      </div>

                      {/* Evidence */}
                      <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-2">
                        Supporting Evidence
                      </div>
                      <ul className="space-y-1.5 mb-4">
                        {hyp.evidence.map((e, i) => {
                          const EvidenceIcon = evidenceTypeIcon[e.type] || TrendingUp
                          return (
                            <li key={i} className="flex items-start gap-2 text-[12px] text-sp-text-secondary">
                              <EvidenceIcon size={11} className={`${hyp.iconText} shrink-0 mt-0.5`} />
                              <span className="flex-1">{e.text}</span>
                              <span className="text-[9px] text-sp-text-disabled uppercase shrink-0">{e.type}</span>
                            </li>
                          )
                        })}
                      </ul>

                      {/* Guidance — advisory only */}
                      <div className="bg-sp-bg-surface rounded-[8px] p-3 mb-3 border border-sp-border-subtle/50">
                        <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-2 flex items-center gap-1.5">
                          <Lightbulb size={10} className="text-sp-warning" />
                          Recommended Next Steps
                        </div>
                        <ul className="space-y-2">
                          {hyp.guidance.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-[12px] text-sp-text-base leading-[16px]">
                              <span className="text-[10px] font-bold text-sp-accent bg-sp-accent-soft rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deep Links */}
                      <div className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em] mb-2">
                        Investigate Further
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {hyp.deepLinks.map((link, i) => {
                          const LinkIcon = link.icon
                          return (
                            <button
                              key={i}
                              className="flex items-center gap-2 px-3 py-2 rounded-[6px] bg-sp-bg-surface border border-sp-border-subtle/50 text-[11px] text-sp-text-alt hover:text-sp-accent hover:border-sp-accent/30 hover:bg-sp-accent-soft transition-all duration-200 cursor-pointer text-left"
                            >
                              <LinkIcon size={12} className="shrink-0" />
                              <span className="flex-1 leading-[14px]">{link.label}</span>
                              <ExternalLink size={9} className="shrink-0 opacity-50" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
