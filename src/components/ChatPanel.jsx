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
                ? 'bg-sp-bg-surface text-sp-text-base rounded-tl-[2px]'
                : 'bg-sp-accent-soft text-sp-text-base rounded-tr-[2px]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-sp-border-subtle">
        <div className="flex items-center gap-2 bg-sp-bg-surface rounded-[6px] px-3 py-2 border border-sp-border-subtle focus-within:border-sp-accent transition-colors duration-200">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask NEO about your network..."
            className="flex-1 bg-transparent text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none"
          />
          <button
            onClick={handleSend}
            className="w-7 h-7 rounded-[4px] bg-sp-accent flex items-center justify-center hover:bg-sp-accent-hover active:bg-sp-accent-active transition-colors duration-200 cursor-pointer"
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
