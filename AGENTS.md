# PRTG Sidekick — Agent Architecture

> See also: [CLAUDE.md](./CLAUDE.md) for project setup, tech stack, design system tokens, component patterns, and build commands.

## NEO Agent Framework
NEO (Network Expert Operator) is the agentic AI layer built into PRTG Sidekick. Each agent specializes in a distinct monitoring workflow and operates with human-in-the-loop approval for all actions.

## Tier 1 Agents (Priority)

### Coverage Agent
- **Purpose**: Identify monitoring gaps by analyzing the device tree against peer benchmarks, incident history, and behavioral anomalies
- **Discovery Methods**: Peer Comparison (fleet of 2,400+ PRTG installs), Incident Correlation, Behavioral Anomaly Detection, Failure Prediction
- **Actions**: Recommend missing sensors, deploy sensors (with approval)
- **Component**: `src/components/CoverageAgent.jsx`

### Signal Agent
- **Purpose**: Reduce alert noise through AI-driven threshold tuning
- **Approach**: Compute dynamic baselines (mean + 2 sigma) from historical sensor data, compare against static thresholds
- **Output**: Before/after alert comparison, false positive reduction metrics
- **Component**: `src/components/SignalAgent.jsx`

## Tier 2 Agents

### Resolution Agent
- **Purpose**: AI-driven root cause analysis for active incidents
- **Approach**: Rank hypotheses by confidence, provide supporting evidence (metrics, correlations, timeline), suggest remediation steps
- **Output**: Ranked root causes with evidence chains and guided next steps
- **Component**: `src/components/ResolutionAgent.jsx`

### Natural Language Query
- **Purpose**: Allow users to ask questions about their network in plain English
- **Approach**: Translate natural language to PRTG API queries, correlate across instances, return structured results
- **Component**: `src/components/NLQueryAgent.jsx`

## Platform Views

### Impact Dashboard
- **Purpose**: Track ROI and capacity reclaimed by NEO across all agents
- **Metrics**: Hours saved, alerts reduced, sensors deployed, incidents auto-resolved
- **Component**: `src/components/ImpactDashboard.jsx`

### Approval Queue
- **Purpose**: Human-in-the-loop approval workflow for all agent-recommended actions
- **Features**: Pending approvals, action history, audit trail with timestamps
- **Component**: `src/components/ApprovalQueue.jsx`

### Resolution Timeline
- **Purpose**: Visualize incident resolution flow — before (manual) vs after (NEO-assisted)
- **Shows**: Side-by-side timeline comparison demonstrating time savings
- **Component**: `src/components/ResolutionTimeline.jsx`

### Data Flow
- **Purpose**: Visualize how on-premises PRTG data flows to cloud LLM providers through Paessler's anonymization proxy
- **Shows**: Architecture diagram with data residency boundaries and security controls
- **Component**: `src/components/DataFlowDiagram.jsx`

## Data Flow Architecture
```
Customer Premises          Paessler Infrastructure         LLM Providers
┌─────────────────┐       ┌──────────────────────┐       ┌──────────────┐
│ PRTG Server     │       │ LLM Proxy            │       │ Azure OpenAI │
│ - Sensor data   │──────>│ - Anonymization       │──────>│ Anthropic    │
│ - Alerts        │       │ - Model routing       │       │ Google       │
│ - Config        │       │ - Rate limiting       │       └──────────────┘
│                 │       │ - Cost metering       │
│ Sidekick App    │<──────│ - Key management      │
│ - NEO Agents    │       │ - License enforcement  │
└─────────────────┘       └──────────────────────┘

Key: Raw data stays on-prem. Only anonymized queries transit to LLM providers.
```

## LLM Provider Options
1. **Paessler AI (Recommended)**: Managed Claude-based service, data stays in Paessler infrastructure
2. **Local LLM**: Self-hosted via Ollama/vLLM, no data leaves network

## Design Principles
- Human-in-the-loop: All agent actions require user approval before execution
- Transparency: Every recommendation includes rationale and evidence
- Privacy: Raw monitoring data never leaves customer premises
- No vendor lock-in: LLM proxy enables provider swapping without code changes
