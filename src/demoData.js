export const demoScenarioOptions = [
  {
    id: 'incident-response',
    label: 'SQL Incident',
    description: 'Shows NEO handling an active database incident with approvals and evidence.',
  },
  {
    id: 'coverage-review',
    label: 'Coverage Review',
    description: 'Focuses on missing sensor recommendations and approval-driven rollout.',
  },
  {
    id: 'noise-reduction',
    label: 'Noise Reduction',
    description: 'Highlights Signal Agent threshold tuning and impact on alert fatigue.',
  },
]

export const deploymentScaleOptions = [
  { id: 'regional', label: 'Regional Fleet', instances: 2, sensors: 1559, multiplier: 1 },
  { id: 'enterprise', label: 'Enterprise Fleet', instances: 5, sensors: 4820, multiplier: 2.2 },
  { id: 'global', label: 'Global Fleet', instances: 12, sensors: 12840, multiplier: 4.8 },
]

export const defaultServers = [
  { id: 1, name: 'Production', url: 'https://prtg.corp.example.com', status: 'connected', version: 'v24.3.102', sensors: 1247 },
  { id: 2, name: 'DR Site', url: 'https://prtg-dr.corp.example.com', status: 'connected', version: 'v24.3.98', sensors: 312 },
]

export const llmProviders = [
  {
    id: 'paessler',
    name: 'Paessler AI',
    description: 'Managed Claude-based routing through the proposed Paessler proxy.',
    badge: 'Recommended',
    badgeStyle: 'bg-sp-up-bg text-sp-up',
    config: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'pk_live_...' },
      { key: 'region', label: 'Region', type: 'select', options: ['EU (Frankfurt)', 'US (Virginia)', 'APAC (Sydney)'] },
    ],
  },
  {
    id: 'local',
    name: 'Local LLM',
    description: 'Self-hosted inference with zero external data transit.',
    badge: 'Self-hosted',
    badgeStyle: 'bg-sp-accent-soft text-sp-accent',
    config: [
      { key: 'endpoint', label: 'Endpoint URL', type: 'text', placeholder: 'http://localhost:11434' },
      { key: 'model', label: 'Model', type: 'select', options: ['llama3.1-70b', 'mistral-large', 'codestral', 'qwen2.5-72b'] },
      { key: 'contextWindow', label: 'Context Window', type: 'select', options: ['32K tokens', '64K tokens', '128K tokens'] },
    ],
  },
]

export const insightTags = {
  peerComparison: { label: 'Peer Comparison', style: 'bg-sp-accent-soft text-sp-accent' },
  incidentCorrelation: { label: 'Incident Correlation', style: 'bg-sp-unusual-bg text-sp-unusual' },
  behavioralAnomaly: { label: 'Behavioral Anomaly', style: 'bg-sp-warning-bg text-sp-warning' },
  fleetPattern: { label: 'Fleet Pattern', style: 'bg-sp-unknown-bg text-sp-accent-tertiary' },
  failurePrediction: { label: 'Failure Prediction', style: 'bg-sp-down-bg text-sp-down' },
}

export const priorityStyles = {
  Critical: 'bg-sp-down-bg text-sp-down',
  High: 'bg-sp-unusual-bg text-sp-unusual',
  Medium: 'bg-sp-accent-soft text-sp-accent',
}

export const deviceTree = [
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

export const coverageRecommendations = [
  {
    id: 'cov-1',
    device: 'db-prod-02',
    deviceId: 'db-prod-02',
    sensor: 'Windows Event Log - Backup Job Events',
    priority: 'Critical',
    insight: 'incidentCorrelation',
    rationale: 'NEO correlated 3 incidents in the past 90 days on this host with unmonitored backup job windows. INC-2024-0847 was caused by an un-throttled backup that went undetected for 28 minutes.',
    deepLinks: ['View INC-2024-0847 timeline', 'Backup event correlation analysis'],
  },
  {
    id: 'cov-2',
    device: 'sw-core-01',
    deviceId: 'sw-core-01',
    sensor: 'SNMP Custom - STP Topology Change Counter',
    priority: 'Critical',
    insight: 'fleetPattern',
    rationale: 'NEO analyzed 2,400 PRTG installations and found that environments with more than 3 VLANs and no STP monitoring experience 4.2x more unplanned outages from broadcast storms.',
    deepLinks: ['Fleet benchmark: your setup vs peers', 'STP sensor configuration guide'],
  },
  {
    id: 'cov-3',
    device: 'app-prod-01',
    deviceId: 'app-prod-01',
    sensor: 'WMI Process - Thread Pool Exhaustion Monitor',
    priority: 'High',
    insight: 'behavioralAnomaly',
    rationale: 'CPU and memory are nominal, but NEO detected a pattern of increasing handle counts every Tuesday at 09:00 UTC that reset only after the weekly IIS recycle.',
    deepLinks: ['Handle count trend analysis', 'Predicted exhaustion timeline'],
  },
  {
    id: 'cov-4',
    device: 'fw-edge-01',
    deviceId: 'fw-edge-01',
    sensor: 'SNMP Custom - VPN Tunnel Availability',
    priority: 'High',
    insight: 'peerComparison',
    rationale: 'Your firewall has 4 site-to-site VPN tunnels, but only pings the remote endpoints. Similar environments monitor tunnel state directly, which would have caught recent DR tunnel flaps.',
    deepLinks: ['Tunnel flap log analysis', 'Peer comparison: firewall monitoring'],
  },
  {
    id: 'cov-5',
    device: 'db-prod-01',
    deviceId: 'db-prod-01',
    sensor: 'WMI Custom - SQL Replication Lag (sec)',
    priority: 'High',
    insight: 'failurePrediction',
    rationale: 'db-prod-01 replicates to db-prod-02, but no sensor measures replication latency. During failover events, split-brain risk would be invisible.',
    deepLinks: ['Replication topology map', 'Split-brain risk assessment'],
  },
]

export const pendingApprovalTemplates = {
  'cov-2': {
    id: 'ACT-001',
    agent: 'Coverage',
    action: 'Add Sensor',
    target: 'SNMP Custom - STP Topology Change Counter',
    device: 'sw-core-01',
    priority: 'Critical',
    reason: 'Fleet pattern analysis shows the core switch is blind to spanning-tree reconvergence events.',
    impact: 'Prevents broadcast storm blind spots',
    sourceType: 'coverage',
    sourceId: 'cov-2',
  },
  'cov-5': {
    id: 'ACT-002',
    agent: 'Coverage',
    action: 'Add Sensor',
    target: 'WMI Custom - SQL Replication Lag (sec)',
    device: 'db-prod-01',
    priority: 'High',
    reason: 'Failure prediction flagged missing replication visibility between primary and secondary databases.',
    impact: 'Detects database split-brain risk',
    sourceType: 'coverage',
    sourceId: 'cov-5',
  },
  signal: {
    id: 'ACT-003',
    agent: 'Signal',
    action: 'Update Thresholds',
    target: 'DMZ Ping Sensors (14 sensors)',
    device: 'fw-dmz-01 group',
    priority: 'High',
    reason: 'Dynamic baseline analysis shows baseline + 2 sigma eliminates 131 false alerts per week.',
    impact: 'Eliminates 131 false alerts per week',
    sourceType: 'signal',
    sourceId: 'dmz-thresholds',
  },
  resolution: {
    id: 'ACT-004',
    agent: 'Resolution',
    action: 'Pause Backup Job',
    target: 'Scheduled backup - db-prod-02',
    device: 'db-prod-02',
    priority: 'Critical',
    reason: 'Root cause analysis ranks unthrottled backup I/O saturation at 87% confidence.',
    impact: 'Resolves active incident INC-2024-0847',
    sourceType: 'resolution',
    sourceId: 'inc-2024-0847',
  },
}

const coverageImpactByInsight = {
  incidentCorrelation: 'Adds early warning for backup-related incidents',
  fleetPattern: 'Prevents broadcast storm blind spots',
  behavioralAnomaly: 'Tracks resource leaks before they trigger outages',
  peerComparison: 'Restores visibility into VPN tunnel health',
  failurePrediction: 'Detects database split-brain risk',
}

export const approvalHistorySeed = [
  { id: 'ACT-098', action: 'Add Sensor', target: 'Windows Event Log - Backup Events', device: 'db-prod-02', agent: 'Coverage', status: 'approved', by: 'jkowall', at: 'Today 14:22', duration: '1.2s' },
  { id: 'ACT-097', action: 'Update Threshold', target: 'Ping - fw-edge-01', device: 'fw-edge-01', agent: 'Signal', status: 'approved', by: 'jkowall', at: 'Today 13:45', duration: '0.8s' },
  { id: 'ACT-096', action: 'Acknowledge Sensors', target: '4 sensors on db-prod-02', device: 'db-prod-02', agent: 'Resolution', status: 'approved', by: 'mturner', at: 'Today 12:10', duration: '0.4s' },
]

export function buildCoverageApprovalTemplate(recommendation) {
  return {
    id: `ACT-COV-${recommendation.id.toUpperCase()}`,
    agent: 'Coverage',
    action: 'Add Sensor',
    target: recommendation.sensor,
    device: recommendation.device,
    priority: recommendation.priority,
    reason: recommendation.rationale,
    impact: coverageImpactByInsight[recommendation.insight] || 'Closes a monitoring blind spot',
    sourceType: 'coverage',
    sourceId: recommendation.id,
  }
}

export const signalSummary = {
  sensorStats: [
    { label: 'Total Sensors Analyzed', value: 23, color: 'text-sp-accent' },
    { label: 'Excessive Alerts (7d)', value: 147, color: 'text-sp-down' },
    { label: 'Reduction with AI Tuning', value: '89%', color: 'text-sp-up' },
    { label: 'False Positive Rate', value: '73%', color: 'text-sp-unusual' },
  ],
  staticAlerts: 147,
  dynamicAlerts: 16,
  baselineLabel: 'Baseline + 2 sigma',
}

export function buildSignalChartData() {
  const spikes = new Set([8, 13, 22, 31, 44, 47, 58, 65])
  const data = []

  for (let i = 0; i < 72; i += 1) {
    const baseLatency = 12 + Math.sin(i / 6) * 2.8 + Math.cos(i / 10) * 1.4
    const normalDrift = Math.sin(i * 1.7) * 0.8
    const spike = spikes.has(i) ? 12 + (i % 3) * 4 : 0
    const latency = Math.max(2, baseLatency + normalDrift + spike)

    data.push({
      hour: `${Math.floor(i / 24)}d ${String(i % 24).padStart(2, '0')}:00`,
      latency: Number(latency.toFixed(1)),
      baseline: Number(baseLatency.toFixed(1)),
      staticThreshold: 20,
      dynamicWarning: Number((baseLatency + 8).toFixed(1)),
      dynamicError: Number((baseLatency + 16).toFixed(1)),
    })
  }

  return data
}

export const incident = {
  id: 'INC-2024-0847',
  severity: 'Critical',
  started: '14:32 UTC',
  duration: '28 min',
  affectedDevice: 'db-prod-02',
  ip: '10.0.10.6',
  summary: 'Storage I/O saturation on db-prod-02 caused by an unthrottled backup job.',
  downSensors: [
    { name: 'SQL Server Response Time', status: 'Down', value: 'Timeout (>30s)', since: '14:32' },
    { name: 'WMI Disk I/O (D:)', status: 'Down', value: 'Queue: 142', since: '14:31' },
    { name: 'SNMP CPU Load', status: 'Warning', value: '94%', since: '14:33' },
    { name: 'WMI Memory', status: 'Warning', value: '91% used', since: '14:34' },
  ],
}

export const hypotheses = [
  {
    id: 1,
    rank: 1,
    title: 'Storage I/O Saturation',
    confidence: 87,
    status: 'leading',
    summary: 'Disk queue length on volume D spiked to 142 one minute before downstream failures began. Timing aligns with a scheduled backup start at 14:30 UTC.',
    evidence: [
      { text: 'Disk queue length spiked to 142 at 14:31 (baseline under 5)', type: 'metric' },
      { text: 'Write latency exceeded 200ms during the backup window', type: 'metric' },
      { text: 'All downstream failures followed the I/O spike within 180 seconds', type: 'timeline' },
    ],
    guidance: [
      'Pause or throttle the backup job immediately',
      'Move the backup schedule outside business hours',
      'Validate VSS snapshot support for SQL backups',
    ],
  },
  {
    id: 2,
    rank: 2,
    title: 'Memory Pressure from Query Cache',
    confidence: 45,
    status: 'secondary',
    summary: 'Memory usage climbed from 72% to 91% in 3 minutes, but this appears to be a downstream effect of the storage backlog rather than the primary cause.',
    evidence: [
      { text: 'Memory usage climbed from 72% to 91% in 3 minutes', type: 'metric' },
      { text: 'Memory spike trails the I/O spike by 90 seconds', type: 'timeline' },
    ],
    guidance: [
      'Review SQL Server max memory after the disk backlog clears',
      'Check for long-running queries with large memory grants',
    ],
  },
  {
    id: 3,
    rank: 3,
    title: 'Network Connectivity Issue',
    confidence: 8,
    status: 'ruled-out',
    summary: 'Ping remains stable at 1ms with no packet loss and adjacent devices are healthy. Connectivity can be ruled out.',
    evidence: [
      { text: 'Ping to db-prod-02 remained stable at 1ms', type: 'metric' },
      { text: 'No packet loss on the management interface', type: 'metric' },
    ],
    guidance: ['No network action required'],
  },
]

export const relatedInsights = [
  {
    title: 'Pattern detected: recurring backup-related degradation',
    description: 'NEO found 3 similar incidents in the past 90 days, all correlating with the same 14:30 UTC backup window.',
    linkLabel: 'View incident history',
  },
  {
    title: 'Coverage gap: no dedicated backup monitoring',
    description: 'db-prod-02 has no sensor tracking backup job status or duration.',
    linkLabel: 'Open in Coverage Agent',
  },
  {
    title: 'Correlated device: db-prod-01 showing elevated latency',
    description: 'The primary database server is experiencing 2x normal query latency, likely due to redirected workload.',
    linkLabel: 'View db-prod-01 sensors',
  },
]

export const manualSteps = [
  { time: '0:00', duration: '5 min', label: 'Alert storm triggers', description: 'Multiple alerts fire across db-prod-02 and the engineer gets paged.' },
  { time: '0:05', duration: '15 min', label: 'Engineer scans dashboards', description: 'PRTG and device status are reviewed manually to infer the first failing signal.' },
  { time: '0:20', duration: '20 min', label: 'Checks logs across systems', description: 'Windows Event Viewer, SQL logs, and backup logs are checked one by one.' },
  { time: '0:40', duration: '15 min', label: 'Guesses root cause', description: 'Backup is suspected, but memory pressure and networking still need to be ruled out.' },
  { time: '0:55', duration: '20 min', label: 'Tests fixes manually', description: 'The backup job is paused and each sensor is rechecked individually.' },
  { time: '1:15', duration: '15 min', label: 'Documents after the fact', description: 'The incident report is written after recovery, with little reusable context.' },
]

export const neoSteps = [
  { time: '0:00', duration: '30 sec', label: 'Signal Agent identifies origin', description: 'NEO correlates sensor failures and ranks the D volume I/O spike as the origin point.' },
  { time: '0:01', duration: '1 min', label: 'NEO explains scope', description: 'The operator gets a concise explanation of impact, confidence, and affected sensors.' },
  { time: '0:02', duration: '1 min', label: 'Resolution Agent suggests fix', description: 'The backup job is flagged for pause, with follow-on prevention steps attached.' },
  { time: '0:03', duration: '30 sec', label: 'Engineer approves action', description: 'The operator approves the queued action in the Approval Queue.' },
  { time: '0:04', duration: '2 min', label: 'System recovers and documents', description: 'NEO confirms recovery and produces a reusable evidence chain for the incident record.' },
]

export const comparisonMetrics = [
  { label: 'Total Resolution Time', manual: '1h 30m', neo: '5 min', improvement: '94%' },
  { label: 'Time to Root Cause', manual: '40 min', neo: '30 sec', improvement: '99%' },
  { label: 'Manual Steps Required', manual: '12+', neo: '1 click', improvement: '92%' },
  { label: 'Systems Accessed', manual: '5', neo: '0', improvement: '100%' },
  { label: 'Documentation', manual: 'Manual, after the fact', neo: 'Auto-generated', improvement: '' },
]

export const weeklyImpactData = [
  { week: 'W9', hoursSaved: 4.2, alertsReduced: 23, sensorsDeployed: 2, incidentsResolved: 1 },
  { week: 'W10', hoursSaved: 6.8, alertsReduced: 41, sensorsDeployed: 3, incidentsResolved: 2 },
  { week: 'W11', hoursSaved: 8.1, alertsReduced: 58, sensorsDeployed: 5, incidentsResolved: 1 },
  { week: 'W12', hoursSaved: 11.4, alertsReduced: 89, sensorsDeployed: 4, incidentsResolved: 3 },
  { week: 'W13', hoursSaved: 14.2, alertsReduced: 112, sensorsDeployed: 7, incidentsResolved: 2 },
  { week: 'W14', hoursSaved: 16.8, alertsReduced: 134, sensorsDeployed: 5, incidentsResolved: 4 },
]

export const impactBase = {
  hoursSaved: 61.5,
  alertsEliminated: 457,
  gapsClosed: 26,
  mttrMinutes: 8,
}

export const capacityData = [
  { label: 'Before NEO', reactive: 50, monitoring: 10, strategic: 40 },
  { label: 'With NEO', reactive: 8, monitoring: 7, strategic: 45, freed: 40 },
]

export const queryCatalog = [
  {
    id: 'downtime',
    label: 'Which devices have been down the most this month?',
    aliases: ['downtime', 'down the most', 'most incidents', 'outage'],
    result: {
      type: 'table',
      summary: 'I found 4 devices with downtime events this month. db-prod-02 leads with 3 incidents totaling 2h 14m, all related to the backup window.',
      data: [
        { device: 'db-prod-02', ip: '10.0.10.6', incidents: 3, totalDowntime: '2h 14m', lastDown: 'Mar 28, 14:32', trend: 'worsening' },
        { device: 'fw-edge-01', ip: '10.0.1.10', incidents: 2, totalDowntime: '0h 47m', lastDown: 'Mar 25, 03:12', trend: 'stable' },
        { device: 'ap-floor2-01', ip: '10.0.20.2', incidents: 1, totalDowntime: '0h 12m', lastDown: 'Mar 22, 11:45', trend: 'improving' },
        { device: 'sw-core-01', ip: '10.0.1.1', incidents: 1, totalDowntime: '0h 03m', lastDown: 'Mar 15, 09:01', trend: 'stable' },
      ],
    },
  },
  {
    id: 'warning-count',
    label: 'How many sensors are in warning state right now?',
    aliases: ['warning state', 'warning sensors', 'how many warnings'],
    result: {
      type: 'stats',
      summary: '17 sensors are currently in warning state across 2 PRTG instances. Most warnings sit in Core Infrastructure and Production Servers.',
      stats: [
        { label: 'Warning Sensors', value: '17', color: 'text-sp-warning', bg: 'bg-sp-warning-bg' },
        { label: 'Down Sensors', value: '4', color: 'text-sp-down', bg: 'bg-sp-down-bg' },
        { label: 'Up Sensors', value: '1,226', color: 'text-sp-up', bg: 'bg-sp-up-bg' },
        { label: 'Paused Sensors', value: '38', color: 'text-sp-paused', bg: 'bg-sp-paused-bg' },
      ],
      breakdown: [
        { group: 'Core Infrastructure', count: 7, type: 'Ping, SNMP Traffic' },
        { group: 'Production Servers', count: 5, type: 'WMI Disk, CPU Load' },
        { group: 'Wireless Infrastructure', count: 3, type: 'SNMP Custom' },
        { group: 'DR Site', count: 2, type: 'Ping' },
      ],
    },
  },
  {
    id: 'change-review',
    label: 'What changed in the last 24 hours?',
    aliases: ['changed', 'last 24 hours', 'recent changes'],
    result: {
      type: 'timeline',
      summary: 'I found 5 relevant changes in the last 24 hours: one approved threshold rollout, two new sensors, one backup schedule shift, and one firmware update on sw-core-01.',
      events: [
        { time: '09:18', label: 'Signal Agent threshold plan approved', detail: 'DMZ ping sensors moved from static 20ms to baseline + 2 sigma.' },
        { time: '10:02', label: 'Backup window shifted', detail: 'db-prod-02 backup moved from 14:30 UTC to 23:00 UTC.' },
        { time: '10:31', label: 'Coverage sensor deployed', detail: 'Windows Event Log backup monitor added on db-prod-02.' },
        { time: '11:07', label: 'Coverage sensor deployed', detail: 'STP topology change counter added on sw-core-01.' },
        { time: '13:43', label: 'Firmware update completed', detail: 'sw-core-01 updated to 17.12.4 with no packet loss detected.' },
      ],
    },
  },
  {
    id: 'db-compare',
    label: 'Compare CPU usage across all database servers',
    aliases: ['compare cpu', 'database servers', 'db servers'],
    result: {
      type: 'compare',
      summary: 'db-prod-02 shows the most volatility, with CPU peaking at 94% during the backup window. db-prod-01 is stable but sees a correlated load increase during failover.',
      rows: [
        { device: 'db-prod-01', baseline: '38%', peak: '61%', comment: 'Stable baseline, absorbs failover traffic.' },
        { device: 'db-prod-02', baseline: '42%', peak: '94%', comment: 'Volatile during backup window and incident conditions.' },
      ],
    },
  },
  {
    id: 'bandwidth',
    label: 'Show me bandwidth usage for the server group',
    aliases: ['bandwidth', 'server group', 'traffic'],
    result: {
      type: 'text',
      summary: 'Server group bandwidth peaks at 1.8 Gbps during the nightly backup and drops below 450 Mbps for the rest of the business day. The busiest path is db-prod-02 to backup storage, followed by web-prod-01 to the load balancer.',
    },
  },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function buildScenarioPendingActions(scenarioId) {
  if (scenarioId === 'coverage-review') {
    return [clone(pendingApprovalTemplates['cov-2']), clone(pendingApprovalTemplates['cov-5'])]
  }
  if (scenarioId === 'noise-reduction') {
    return [clone(pendingApprovalTemplates.signal)]
  }
  return [
    clone(pendingApprovalTemplates['cov-2']),
    clone(pendingApprovalTemplates['cov-5']),
    clone(pendingApprovalTemplates.signal),
    clone(pendingApprovalTemplates.resolution),
  ]
}

function buildCoverageStatuses(scenarioId) {
  const statuses = {}
  coverageRecommendations.forEach((item) => {
    statuses[item.id] = 'open'
  })

  if (scenarioId === 'coverage-review') {
    statuses['cov-2'] = 'pending'
    statuses['cov-5'] = 'pending'
  }

  if (scenarioId === 'incident-response') {
    statuses['cov-2'] = 'pending'
    statuses['cov-5'] = 'pending'
  }

  return statuses
}

export function createInitialDemoState(scenarioId = 'incident-response') {
  return {
    currentModule: 'coverage',
    scenarioId,
    viewMode: 'operator',
    deploymentScale: 'regional',
    signalMode: scenarioId === 'noise-reduction' ? 'after' : 'before',
    thresholdsApplied: scenarioId === 'noise-reduction',
    incidentActive: scenarioId === 'incident-response',
    incidentResolved: false,
    incidentResolutionMinutes: 5,
    coverageStatuses: buildCoverageStatuses(scenarioId),
    approvalsPending: buildScenarioPendingActions(scenarioId),
    approvalHistory: clone(approvalHistorySeed),
    recentEvents: [
      { id: 'evt-1', module: 'coverage', text: 'Coverage Agent found 5 monitoring gaps across core, firewall, app, and database infrastructure.' },
      { id: 'evt-2', module: 'signal', text: 'Signal Agent identified 147 noisy alerts in the DMZ ping estate.' },
      { id: 'evt-3', module: 'resolution', text: 'Resolution Agent correlated the active SQL incident to the 14:30 UTC backup window.' },
    ],
    queryState: {
      activeResult: null,
      history: [],
    },
    chatState: {},
    servers: clone(defaultServers),
    selectedLLM: 'paessler',
    llmConfig: {
      paessler_region: 'EU (Frankfurt)',
      local_endpoint: 'http://localhost:11434',
      local_model: 'llama3.1-70b',
      local_contextWindow: '64K tokens',
    },
  }
}
