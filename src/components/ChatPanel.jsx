import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

const initialMessages = {
  coverage: [
    { role: 'assistant', text: "I've analyzed your monitoring environment and identified 5 devices with missing sensor coverage. The most critical gap is on your core switch — no bandwidth sensors are deployed on uplink interfaces." },
    { role: 'user', text: 'Which sensors should I add first?' },
    { role: 'assistant', text: 'I recommend starting with SNMP Traffic sensors on sw-core-01 ports Gi0/1 and Gi0/2. These are your primary uplinks carrying 78% of inter-VLAN traffic, but have zero bandwidth monitoring. Want me to show the deployment plan?' },
  ],
  signal: [
    { role: 'assistant', text: "I've detected 23 sensors generating excessive alerts. The Ping sensors on your DMZ segment are the noisiest — 147 alerts this week, mostly from a 20ms static threshold that doesn't account for your baseline latency pattern." },
    { role: 'user', text: 'What threshold would you recommend?' },
    { role: 'assistant', text: 'Based on 30-day baseline analysis, your DMZ ping times average 12ms with a standard deviation of 4ms. I recommend a dynamic threshold of baseline + 2σ (≈20ms warning, ≈28ms error). This would have eliminated 89% of false alerts. Toggle the view to see the comparison.' },
  ],
  resolution: [
    { role: 'assistant', text: "Active incident detected: 4 sensors down on db-prod-02 starting at 14:32 UTC. Correlated events suggest this is a storage subsystem issue rather than individual sensor failures." },
    { role: 'user', text: 'What is the root cause?' },
    { role: 'assistant', text: "My analysis ranks storage I/O saturation as the most likely cause (87% confidence). The disk queue length spiked to 142 at 14:31, one minute before the cascade. This correlates with a scheduled backup job that wasn't throttled. I recommend pausing the backup job and acknowledging the sensors." },
  ],
  nlquery: [
    { role: 'assistant', text: "I can answer questions about your PRTG environment in plain English. Try asking about device status, performance trends, alert history, or sensor inventory across all connected instances." },
    { role: 'user', text: 'How does the natural language query work?' },
    { role: 'assistant', text: "I translate your questions into PRTG API calls, query all connected instances, correlate the data, and present structured results. For example, 'Which devices had the most downtime this month?' becomes API calls to pull sensor status history, aggregate downtime per device, and rank by total duration." },
  ],
  impact: [
    { role: 'assistant', text: "Your NEO Impact Dashboard shows 61.5 hours saved this month — equivalent to 1.5 FTEs of capacity reclaimed. The biggest contributor is Signal Agent, which eliminated 89% of alert noise." },
    { role: 'user', text: 'Can I export this for a board presentation?' },
    { role: 'assistant', text: "The Executive Summary card at the bottom right is designed for exactly that. In production, you'll be able to export a one-page PDF with key metrics, trend charts, and the capacity shift visualization for stakeholder presentations." },
  ],
  approvals: [
    { role: 'assistant', text: "You have 4 pending actions from NEO agents awaiting your approval. 2 are sensor deployments from Coverage Agent, 1 threshold update from Signal Agent, and 1 remediation action from Resolution Agent." },
    { role: 'user', text: 'Why does NEO need my approval?' },
    { role: 'assistant', text: "NEO follows a human-in-the-loop model — it analyzes and recommends, but you decide what to execute. This ensures you maintain control over your monitoring environment. Every action includes NEO's rationale so you can make an informed decision." },
  ],
  timeline: [
    { role: 'assistant', text: "The Resolution Timeline shows how NEO compressed incident INC-2024-0847 from 1h 30m (manual) to 5 minutes. The biggest time savings come from instant root cause identification — what took 40 minutes manually, NEO does in 30 seconds." },
    { role: 'user', text: 'Is this a real incident?' },
    { role: 'assistant', text: "This demonstrates a realistic scenario based on the INC-2024-0847 pattern — a storage I/O saturation event caused by an unthrottled backup. In production, NEO would populate this with your actual incident data and resolution timelines." },
  ],
  dataflow: [
    { role: 'assistant', text: "The Data Flow diagram shows the proposed architecture for how on-premises PRTG data would flow to cloud LLM providers. Important: this infrastructure doesn't exist yet — it needs to be built. You'd need to authenticate with your Paessler account before any cloud AI services are available." },
    { role: 'user', text: 'What about authentication?' },
    { role: 'assistant', text: "Customers would need to authenticate with a Paessler account to access the LLM proxy. SSO integration with your corporate identity provider is being added in the coming months. No anonymous or unauthenticated access to cloud AI services." },
    { role: 'user', text: 'What exactly gets sent to the LLM?' },
    { role: 'assistant', text: "Device names, IPs, and credentials are stripped before anything leaves your network. The LLM receives anonymized patterns like 'Device-A (core switch class) has 6 VLANs, no spanning tree monitoring' — never 'sw-core-01 at 10.0.1.1'. All API keys are managed by Paessler, not customers." },
  ],
}

export default function ChatPanel({ activeModule }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(initialMessages)

  const currentMessages = messages[activeModule] || []

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => ({
      ...prev,
      [activeModule]: [...(prev[activeModule] || []), { role: 'user', text: input }],
    }))
    setInput('')
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeModule]: [
          ...(prev[activeModule] || []),
          { role: 'assistant', text: "I'm analyzing your request. In a production environment, NEO would process this query against your live PRTG data and provide actionable recommendations." },
        ],
      }))
    }, 800)
  }

  return (
    <aside className="w-[380px] bg-sp-bg-raised border-l border-sp-border-subtle flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-sp-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-sp-up-bg flex items-center justify-center">
            <Bot size={14} className="text-sp-up" />
          </div>
          <div>
            <div className="text-[14px] font-medium text-sp-text-brand">NEO Assistant</div>
            <div className="text-[10px] text-sp-up">Online — Natural Language Query</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === 'assistant' ? 'bg-sp-up-bg' : 'bg-sp-accent-soft'
            }`}>
              {msg.role === 'assistant'
                ? <Bot size={12} className="text-sp-up" />
                : <User size={12} className="text-sp-accent" />}
            </div>
            <div className={`max-w-[85%] px-3 py-2.5 rounded-[8px] text-[13px] leading-[20px] ${
              msg.role === 'assistant'
                ? 'text-sp-text-base rounded-tl-[2px]'
                : 'chat-user-bubble text-white rounded-tr-[2px]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-sp-border-subtle">
        <div className="flex items-center gap-2 bg-sp-bg-surface rounded-[6px] px-3 py-2 chat-input-border transition-colors duration-200">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask NEO about your network..."
            className="flex-1 bg-transparent text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none"
          />
          <button
            onClick={handleSend}
            className="w-7 h-7 rounded-[4px] chat-send-btn flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity duration-200 cursor-pointer"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
        <div className="text-[10px] text-sp-text-tertiary mt-2 text-center">
          Powered by PRTG NEO Engine
        </div>
      </div>
    </aside>
  )
}
