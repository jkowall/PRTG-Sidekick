/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import {
  buildCoverageApprovalTemplate,
  capacityData,
  comparisonMetrics,
  coverageRecommendations,
  createInitialDemoState,
  demoScenarioOptions,
  deploymentScaleOptions,
  deviceTree,
  hypotheses,
  incident,
  insightTags,
  llmProviders,
  manualSteps,
  neoSteps,
  pendingApprovalTemplates,
  priorityStyles,
  queryCatalog,
  relatedInsights,
  signalSummary,
  weeklyImpactData,
  impactBase,
} from './demoData'

const DemoContext = createContext(null)
const STORAGE_KEY = 'prtg-sidekick-demo-state-v2'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function findScale(id) {
  return deploymentScaleOptions.find((item) => item.id === id) || deploymentScaleOptions[0]
}

function findScenario(id) {
  return demoScenarioOptions.find((item) => item.id === id) || demoScenarioOptions[0]
}

function createActionFromTemplate(template, requestedAt = 'Just now') {
  return {
    ...clone(template),
    requestedAt,
  }
}

function createCoverageAction(recommendationId) {
  const template = pendingApprovalTemplates[recommendationId]
  if (template) {
    return createActionFromTemplate(template)
  }

  const recommendation = coverageRecommendations.find((item) => item.id === recommendationId)
  return recommendation ? createActionFromTemplate(buildCoverageApprovalTemplate(recommendation)) : null
}

function buildChatSeeds(state, activeModule, scale) {
  const openCoverage = Object.values(state.coverageStatuses).filter((status) => status === 'open').length
  const pendingApprovals = state.approvalsPending.length

  const base = {
    coverage: [
      { role: 'assistant', text: `Coverage Agent is tracking ${openCoverage} open monitoring gaps in the ${findScenario(state.scenarioId).label} scenario.` },
      { role: 'assistant', text: 'Queue any recommendation for approval and the rest of the demo will update automatically.' },
    ],
    signal: [
      { role: 'assistant', text: `Signal Agent is modeling ${signalSummary.staticAlerts} noisy alerts across the DMZ sensor group.` },
      { role: 'assistant', text: state.thresholdsApplied ? 'AI thresholds are currently applied. Switch to the static view to show the before state.' : 'A tuning plan is ready to submit into the approval workflow.' },
    ],
    resolution: [
      { role: 'assistant', text: state.incidentActive ? `Resolution Agent is working incident ${incident.id} on ${incident.affectedDevice}.` : 'Resolution Agent is idle until you inject an incident from the presenter controls.' },
      { role: 'assistant', text: state.incidentResolved ? 'The backup action has already been approved and the incident is marked resolved.' : 'Ask for the leading hypothesis or queue the remediation action directly.' },
    ],
    nlquery: [
      { role: 'assistant', text: `Natural Language Query is connected to ${scale.instances} PRTG instances and ${scale.sensors.toLocaleString()} sensors.` },
      { role: 'assistant', text: 'Try asking about downtime, changes, warnings, database load, or bandwidth.' },
    ],
    approvals: [
      { role: 'assistant', text: `${pendingApprovals} action${pendingApprovals === 1 ? '' : 's'} are waiting for human approval.` },
      { role: 'assistant', text: 'Approvals are the backbone of the demo. Executing one should ripple into Coverage, Signal, Resolution, and Impact.' },
    ],
    impact: [
      { role: 'assistant', text: 'Impact Dashboard is now driven by live demo actions, not static numbers.' },
      { role: 'assistant', text: 'Approve actions from the queue to show ROI growth during the presentation.' },
    ],
    timeline: [
      { role: 'assistant', text: 'Resolution Timeline compares the manual incident path against the NEO-assisted path.' },
      { role: 'assistant', text: state.incidentResolved ? 'The NEO path is complete because the remediation action has already been approved.' : 'Approve the resolution action to complete the NEO side of the story.' },
    ],
    dataflow: [
      { role: 'assistant', text: `Data Flow is currently configured for ${state.selectedLLM === 'local' ? 'local inference with zero cloud transit' : 'Paessler-managed cloud routing'}.` },
      { role: 'assistant', text: 'Switch providers in the presenter controls or settings to change the architecture story on the fly.' },
    ],
  }

  return base[activeModule] || []
}

function matchQuery(text) {
  const normalized = text.trim().toLowerCase()

  return queryCatalog.find((item) => {
    if (item.label.toLowerCase() === normalized) {
      return true
    }

    return item.aliases.some((alias) => normalized.includes(alias))
  })
}

function appendEvent(state, module, text) {
  return {
    ...state,
    recentEvents: [
      { id: `evt-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, module, text },
      ...state.recentEvents,
    ].slice(0, 8),
  }
}

function updateCoverageStatusesForApproval(state, sourceId, nextStatus) {
  return {
    ...state,
    coverageStatuses: {
      ...state.coverageStatuses,
      [sourceId]: nextStatus,
    },
  }
}

function updateServers(state, updater) {
  return {
    ...state,
    servers: typeof updater === 'function' ? updater(state.servers) : updater,
  }
}

function reducerLikeApply(state, action) {
  if (action.type === 'queueCoverage') {
    if (state.coverageStatuses[action.sourceId] !== 'open') {
      return state
    }

    const pendingAction = createCoverageAction(action.sourceId)
    if (!pendingAction) {
      return state
    }

    return appendEvent(
      {
        ...updateCoverageStatusesForApproval(state, action.sourceId, 'pending'),
        approvalsPending: [...state.approvalsPending, pendingAction],
      },
      'coverage',
      `Queued ${pendingAction.target} for approval on ${pendingAction.device}.`,
    )
  }

  if (action.type === 'queueSignal') {
    if (state.approvalsPending.some((item) => item.sourceType === 'signal') || state.thresholdsApplied) {
      return state
    }

    return appendEvent(
      {
        ...state,
        approvalsPending: [...state.approvalsPending, createActionFromTemplate(pendingApprovalTemplates.signal)],
      },
      'signal',
      'Queued the AI threshold rollout for the DMZ ping estate.',
    )
  }

  if (action.type === 'queueResolution') {
    if (state.approvalsPending.some((item) => item.sourceType === 'resolution') || state.incidentResolved) {
      return state
    }

    return appendEvent(
      {
        ...state,
        incidentActive: true,
        approvalsPending: [...state.approvalsPending, createActionFromTemplate(pendingApprovalTemplates.resolution)],
      },
      'resolution',
      `Queued remediation for ${incident.id}: pause the backup job on ${incident.affectedDevice}.`,
    )
  }

  if (action.type === 'approve') {
    const target = state.approvalsPending.find((item) => item.id === action.id)
    if (!target) {
      return state
    }

    let next = {
      ...state,
      approvalsPending: state.approvalsPending.filter((item) => item.id !== action.id),
      approvalHistory: [
        {
          id: target.id,
          action: target.action,
          target: target.target,
          device: target.device,
          agent: target.agent,
          status: 'approved',
          by: 'jkowall',
          at: 'Just now',
          duration: `${(Math.random() * 1.7 + 0.3).toFixed(1)}s`,
        },
        ...state.approvalHistory,
      ],
    }

    if (target.sourceType === 'coverage') {
      next = updateCoverageStatusesForApproval(next, target.sourceId, 'deployed')
      next = appendEvent(next, 'coverage', `Approved and deployed ${target.target} on ${target.device}.`)
    }

    if (target.sourceType === 'signal') {
      next = appendEvent(
        {
          ...next,
          thresholdsApplied: true,
          signalMode: 'after',
        },
        'signal',
        'Approved the DMZ dynamic threshold rollout. Noise reduction is now reflected in Impact.',
      )
    }

    if (target.sourceType === 'resolution') {
      next = appendEvent(
        {
          ...next,
          incidentActive: true,
          incidentResolved: true,
        },
        'resolution',
        `Approved the backup pause action. ${incident.id} is now marked resolved in the demo state.`,
      )
    }

    return next
  }

  if (action.type === 'reject') {
    const target = state.approvalsPending.find((item) => item.id === action.id)
    if (!target) {
      return state
    }

    let next = {
      ...state,
      approvalsPending: state.approvalsPending.filter((item) => item.id !== action.id),
      approvalHistory: [
        {
          id: target.id,
          action: target.action,
          target: target.target,
          device: target.device,
          agent: target.agent,
          status: 'rejected',
          by: 'jkowall',
          at: 'Just now',
          duration: '-',
        },
        ...state.approvalHistory,
      ],
    }

    if (target.sourceType === 'coverage') {
      next = updateCoverageStatusesForApproval(next, target.sourceId, 'open')
    }

    return appendEvent(next, 'approvals', `Rejected ${target.action.toLowerCase()} for ${target.device}.`)
  }

  if (action.type === 'setScenario') {
    const replacement = createInitialDemoState(action.scenarioId)
    return {
      ...replacement,
      currentModule: state.currentModule,
      viewMode: state.viewMode,
      deploymentScale: state.deploymentScale,
      servers: state.servers,
      selectedLLM: state.selectedLLM,
      llmConfig: state.llmConfig,
    }
  }

  if (action.type === 'resetDemo') {
    return {
      ...createInitialDemoState(state.scenarioId),
      currentModule: state.currentModule,
      viewMode: state.viewMode,
      deploymentScale: state.deploymentScale,
      servers: state.servers,
      selectedLLM: state.selectedLLM,
      llmConfig: state.llmConfig,
    }
  }

  if (action.type === 'setSignalMode') {
    return {
      ...state,
      signalMode: action.mode,
    }
  }

  if (action.type === 'setViewMode') {
    return {
      ...state,
      viewMode: action.mode,
    }
  }

  if (action.type === 'setCurrentModule') {
    return {
      ...state,
      currentModule: action.module,
    }
  }

  if (action.type === 'setScale') {
    return {
      ...state,
      deploymentScale: action.scale,
    }
  }

  if (action.type === 'setLLM') {
    return appendEvent(
      {
        ...state,
        selectedLLM: action.provider,
      },
      'dataflow',
      `Switched demo architecture to ${action.provider === 'local' ? 'Local LLM' : 'Paessler AI'}.`,
    )
  }

  if (action.type === 'addServer') {
    if (!action.server.name || !action.server.url) {
      return state
    }

    return appendEvent(
      updateServers(state, (servers) => [
        ...servers,
        {
          id: Date.now(),
          name: action.server.name,
          url: action.server.url,
          status: 'pending',
          version: '-',
          sensors: 0,
        },
      ]),
      'dataflow',
      `Added demo connection for ${action.server.name}.`,
    )
  }

  if (action.type === 'removeServer') {
    return updateServers(state, (servers) => servers.filter((server) => server.id !== action.id))
  }

  if (action.type === 'testServer') {
    return updateServers(state, (servers) =>
      servers.map((server) => (server.id === action.id ? { ...server, status: 'connected' } : server)),
    )
  }

  if (action.type === 'updateLLMConfig') {
    return {
      ...state,
      llmConfig: {
        ...state.llmConfig,
        [action.key]: action.value,
      },
    }
  }

  if (action.type === 'setQueryResult') {
    return {
      ...state,
      queryState: {
        activeResult: action.result,
        history: [{ text: action.text, time: new Date().toLocaleTimeString() }, ...state.queryState.history].slice(0, 10),
      },
    }
  }

  if (action.type === 'addChatMessage') {
    const nextModuleMessages = [...(state.chatState[action.module] || []), action.message]
    return {
      ...state,
      chatState: {
        ...state.chatState,
        [action.module]: nextModuleMessages,
      },
    }
  }

  if (action.type === 'injectIncident') {
    let next = {
      ...state,
      incidentActive: true,
      incidentResolved: false,
    }

    if (!state.approvalsPending.some((item) => item.sourceType === 'resolution')) {
      next = {
        ...next,
        approvalsPending: [...next.approvalsPending, createActionFromTemplate(pendingApprovalTemplates.resolution, 'Now')],
      }
    }

    return appendEvent(next, 'resolution', `Injected ${incident.id} into the current scenario.`)
  }

  if (action.type === 'recordEvent') {
    return appendEvent(state, action.module, action.text)
  }

  return state
}

function loadInitialState() {
  if (typeof window === 'undefined') {
    return createInitialDemoState()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialDemoState()
    }

    return {
      ...createInitialDemoState(),
      ...JSON.parse(raw),
    }
  } catch {
    return createInitialDemoState()
  }
}

function buildImpact(state) {
  const deployedCount = Object.values(state.coverageStatuses).filter((status) => status === 'deployed').length
  const signalApproved = state.thresholdsApplied ? 1 : 0
  const incidentsResolved = state.incidentResolved ? 1 : 0
  const scale = findScale(state.deploymentScale)

  const hoursSaved = impactBase.hoursSaved + deployedCount * 0.9 + signalApproved * 7.6 + incidentsResolved * 3.4
  const alertsEliminated = impactBase.alertsEliminated + signalApproved * 131
  const gapsClosed = impactBase.gapsClosed + deployedCount
  const mttrMinutes = state.incidentResolved ? Math.max(5, impactBase.mttrMinutes - 3) : impactBase.mttrMinutes

  return {
    hoursSaved: Number((hoursSaved * scale.multiplier).toFixed(1)),
    alertsEliminated: Math.round(alertsEliminated * scale.multiplier),
    gapsClosed: Math.round(gapsClosed * Math.max(scale.multiplier / 1.8, 1)),
    mttrMinutes,
    executedActions: deployedCount + signalApproved + incidentsResolved,
  }
}

function buildAgentBreakdown(state, impact) {
  const deployedCount = Object.values(state.coverageStatuses).filter((status) => status === 'deployed').length
  const signalHours = state.thresholdsApplied ? 28.7 + 7.6 : 28.7
  const coverageHours = 18.2 + deployedCount * 0.9
  const resolutionHours = 14.6 + (state.incidentResolved ? 3.4 : 0)

  return [
    { agent: 'Coverage Agent', hoursSaved: Number(coverageHours.toFixed(1)), actions: deployedCount, impact: 'Live approvals deploy missing sensors and close blind spots.', color: 'bg-sp-up' },
    { agent: 'Signal Agent', hoursSaved: Number(signalHours.toFixed(1)), actions: state.thresholdsApplied ? 1 : 0, impact: 'Threshold tuning removes alert fatigue from the DMZ estate.', color: 'bg-sp-accent' },
    { agent: 'Resolution Agent', hoursSaved: Number(resolutionHours.toFixed(1)), actions: state.incidentResolved ? 1 : 0, impact: 'Resolution actions compress MTTR and preserve evidence.', color: 'bg-sp-accent-tertiary' },
    { agent: 'Total Live Demo', hoursSaved: impact.hoursSaved, actions: impact.executedActions, impact: 'End-to-end automation demonstrated in the current session.', color: 'bg-sp-warning' },
  ]
}

function buildWeeklyData(state) {
  const last = weeklyImpactData[weeklyImpactData.length - 1]
  const deployedCount = Object.values(state.coverageStatuses).filter((status) => status === 'deployed').length

  return weeklyImpactData.map((week, index) => {
    if (index !== weeklyImpactData.length - 1) {
      return week
    }

    return {
      ...last,
      hoursSaved: Number((last.hoursSaved + deployedCount * 0.9 + (state.thresholdsApplied ? 7.6 : 0) + (state.incidentResolved ? 3.4 : 0)).toFixed(1)),
      alertsReduced: last.alertsReduced + (state.thresholdsApplied ? 131 : 0),
      sensorsDeployed: last.sensorsDeployed + deployedCount,
      incidentsResolved: last.incidentsResolved + (state.incidentResolved ? 1 : 0),
    }
  })
}

function buildDeviceTree(state) {
  const countsByDevice = {}
  coverageRecommendations.forEach((item) => {
    if (state.coverageStatuses[item.id] === 'deployed') {
      countsByDevice[item.deviceId] = (countsByDevice[item.deviceId] || 0) + 1
    }
  })

  const missingByDevice = {}
  coverageRecommendations.forEach((item) => {
    if (state.coverageStatuses[item.id] !== 'deployed') {
      missingByDevice[item.deviceId] = (missingByDevice[item.deviceId] || 0) + 1
    }
  })

  return clone(deviceTree).map((root) => ({
    ...root,
    children: root.children.map((group) => ({
      ...group,
      children: group.children.map((device) => ({
        ...device,
        sensors: device.sensors + (countsByDevice[device.id] || 0),
        missing: missingByDevice[device.id] || 0,
      })),
    })),
  }))
}

function buildCoverageCards(state) {
  return coverageRecommendations.map((item) => ({
    ...item,
    status: state.coverageStatuses[item.id] || 'open',
  }))
}

function buildDataFlowSummary(state) {
  return {
    providerLabel: state.selectedLLM === 'local' ? 'Local LLM' : 'Paessler AI',
    transitLabel: state.selectedLLM === 'local' ? 'No cloud transit' : 'Anonymized cloud routing',
  }
}

function buildSignalView(state, scale) {
  const scenarioConfig = {
    'incident-response': {
      title: 'Backup Path Latency - db-prod-02',
      subtitle: 'Focused on the storage path that triggered INC-2024-0847.',
      focus: 'Incident scenario: Signal Agent is centered on the backup window and related storage jitter.',
      staticAlerts: 96,
      dynamicAlerts: 14,
      analyzedSensors: 12,
      routeNote: state.selectedLLM === 'local' ? 'Local model baselining for incident reconstruction.' : 'Paessler AI baselining with cloud-routed correlation.',
    },
    'coverage-review': {
      title: 'Core Uplink Latency - sw-core-01',
      subtitle: 'Used to show why baseline-driven monitoring matters before adding more sensors.',
      focus: 'Coverage review scenario: Signal Agent is emphasizing core uplink volatility and blind spots.',
      staticAlerts: 58,
      dynamicAlerts: 9,
      analyzedSensors: 8,
      routeNote: state.selectedLLM === 'local' ? 'Local model analyzing switch-path variability.' : 'Paessler AI analyzing core uplink variability.',
    },
    'noise-reduction': {
      title: 'Ping Latency - DMZ Segment (fw-dmz-01)',
      subtitle: 'Best demo for showing alert fatigue reduction from dynamic baselines.',
      focus: 'Noise reduction scenario: this is the full DMZ sensor group with the highest false-positive rate.',
      staticAlerts: 147,
      dynamicAlerts: 16,
      analyzedSensors: 23,
      routeNote: state.selectedLLM === 'local' ? 'Local model calculating dynamic thresholds with zero cloud transit.' : 'Paessler AI calculating dynamic thresholds through the routed architecture.',
    },
  }

  const config = scenarioConfig[state.scenarioId] || scenarioConfig['noise-reduction']
  const sensorMultiplier = Math.max(1, Math.round(scale.multiplier))
  const analyzedSensors = Math.round(config.analyzedSensors * scale.multiplier)
  const staticAlerts = Math.round(config.staticAlerts * scale.multiplier)
  const dynamicAlerts = Math.max(4, Math.round(config.dynamicAlerts * sensorMultiplier))
  const reduction = Math.max(70, Math.round((1 - dynamicAlerts / staticAlerts) * 100))

  return {
    ...config,
    analyzedSensors,
    staticAlerts,
    dynamicAlerts,
    sensorStats: [
      { label: 'Sensors Analyzed', value: analyzedSensors, color: 'text-sp-accent' },
      { label: 'Excessive Alerts (7d)', value: staticAlerts, color: 'text-sp-down' },
      { label: 'Reduction with AI Tuning', value: `${reduction}%`, color: 'text-sp-up' },
      { label: 'Inference Route', value: state.selectedLLM === 'local' ? 'Local' : 'Cloud', color: 'text-sp-unusual' },
    ],
  }
}

function createChatResponse(state, module, text) {
  const normalized = text.trim().toLowerCase()

  if (!normalized) {
    return 'Ask a question or use the suggested actions in the active module.'
  }

  if (module === 'coverage') {
    if (normalized.includes('queue') || normalized.includes('approve')) {
      const nextRecommendation = coverageRecommendations.find((item) => state.coverageStatuses[item.id] === 'open')
      if (!nextRecommendation) {
        return 'All current coverage recommendations have already been queued or deployed.'
      }
      return `Queue ${nextRecommendation.sensor} on ${nextRecommendation.device} from the Coverage view.`
    }
    return `Coverage Agent currently has ${Object.values(state.coverageStatuses).filter((status) => status === 'open').length} open gaps and ${state.approvalsPending.filter((item) => item.sourceType === 'coverage').length} queued actions.`
  }

  if (module === 'signal') {
    if (normalized.includes('threshold')) {
      return state.thresholdsApplied ? 'Dynamic thresholds are already applied. Use the toggle to show the before/after state.' : 'Submit the threshold plan to approval to demonstrate the noise-reduction payoff.'
    }
    return 'Signal Agent is focused on the DMZ ping sensors because that group has the highest false-positive rate.'
  }

  if (module === 'resolution') {
    if (normalized.includes('root cause') || normalized.includes('cause')) {
      return 'Storage I/O saturation remains the leading hypothesis at 87% confidence, driven by the 14:30 UTC backup window.'
    }
    if (normalized.includes('fix') || normalized.includes('resolve')) {
      return state.incidentResolved ? 'The remediation action has already been approved and the incident is marked resolved.' : 'Queue or approve the backup pause action to complete the resolution flow.'
    }
    return state.incidentActive ? `Resolution Agent is tracking ${incident.id} on ${incident.affectedDevice}.` : 'There is no active incident. Use Inject Incident to start one.'
  }

  if (module === 'nlquery') {
    const match = matchQuery(text)
    return match ? `That query is supported. Use the NL Query panel to return the ${match.result.type} result.` : 'This query falls back to a generic narrative today. The NL Query panel will still log and display it.'
  }

  if (module === 'approvals') {
    return `${state.approvalsPending.length} approvals remain pending. Each approval updates the relevant module and the Impact Dashboard.`
  }

  if (module === 'impact') {
    const impact = buildImpact(state)
    return `Live demo ROI is ${impact.hoursSaved} hours saved, ${impact.alertsEliminated.toLocaleString()} alerts eliminated, and ${impact.gapsClosed} gaps closed.`
  }

  if (module === 'dataflow') {
    return state.selectedLLM === 'local'
      ? 'The architecture is currently in Local LLM mode, so no anonymized prompt leaves the customer premises.'
      : 'The architecture is currently in Paessler AI mode, so anonymized prompts route through the proposed Paessler proxy.'
  }

  return 'The active demo state is synchronized across modules. Actions taken in one view should ripple through the rest of the experience.'
}

export function DemoProvider({ children }) {
  const [state, setState] = useState(loadInitialState)

  const dispatch = (action) => {
    setState((current) => {
      const next = reducerLikeApply(current, action)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  const scale = findScale(state.deploymentScale)
  const impact = buildImpact(state)

  const value = useMemo(() => {
    const derived = {
      scenario: findScenario(state.scenarioId),
      scale,
      impact,
      weeklyData: buildWeeklyData(state),
      deviceTree: buildDeviceTree(state),
      coverageCards: buildCoverageCards(state),
      agentBreakdown: buildAgentBreakdown(state, impact),
      dataFlowSummary: buildDataFlowSummary(state),
      signalView: buildSignalView(state, scale),
      chatSeedsFor: (module) => buildChatSeeds(state, module, scale),
    }

    return {
      state,
      derived,
      data: {
        capacityData,
        comparisonMetrics,
        hypotheses,
        incident,
        insightTags,
        llmProviders,
        manualSteps,
        neoSteps,
        priorityStyles,
        queryCatalog,
        relatedInsights,
        signalSummary,
      },
      actions: {
        queueCoverageRecommendation: (id) => dispatch({ type: 'queueCoverage', sourceId: id }),
        queueAllCoverageRecommendations: () => {
          coverageRecommendations
            .filter((item) => state.coverageStatuses[item.id] === 'open')
            .forEach((item) => dispatch({ type: 'queueCoverage', sourceId: item.id }))
        },
        queueSignalPlan: () => dispatch({ type: 'queueSignal' }),
        queueResolutionPlan: () => dispatch({ type: 'queueResolution' }),
        approveAction: (id) => dispatch({ type: 'approve', id }),
        rejectAction: (id) => dispatch({ type: 'reject', id }),
        setScenario: (scenarioId) => dispatch({ type: 'setScenario', scenarioId }),
        resetDemo: () => dispatch({ type: 'resetDemo' }),
        setSignalMode: (mode) => dispatch({ type: 'setSignalMode', mode }),
        setViewMode: (mode) => dispatch({ type: 'setViewMode', mode }),
        setCurrentModule: (module) => dispatch({ type: 'setCurrentModule', module }),
        setScale: (scaleId) => dispatch({ type: 'setScale', scale: scaleId }),
        setLLMProvider: (provider) => dispatch({ type: 'setLLM', provider }),
        injectIncident: () => dispatch({ type: 'injectIncident' }),
        addServer: (server) => dispatch({ type: 'addServer', server }),
        removeServer: (id) => dispatch({ type: 'removeServer', id }),
        testServer: (id) => dispatch({ type: 'testServer', id }),
        updateLLMConfig: (key, value) => dispatch({ type: 'updateLLMConfig', key, value }),
        submitQuery: (text) => {
          const match = matchQuery(text)
          const result = match
            ? match.result
            : {
                type: 'text',
                summary: `NEO analyzed "${text}" against ${scale.instances} instances and ${scale.sensors.toLocaleString()} sensors. In the demo, unsupported prompts fall back to this narrative response while still preserving the request history.`,
              }

          dispatch({ type: 'setQueryResult', text, result: { ...result, text } })
          return result
        },
        sendChatMessage: (module, text) => {
          dispatch({ type: 'addChatMessage', module, message: { role: 'user', text } })
          const reply = createChatResponse(state, module, text)
          dispatch({ type: 'addChatMessage', module, message: { role: 'assistant', text: reply } })
        },
        recordEvent: (module, text) => dispatch({ type: 'recordEvent', module, text }),
      },
    }
  }, [impact, scale, state])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider')
  }
  return context
}
