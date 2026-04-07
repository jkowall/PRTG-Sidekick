import { useMemo, useState } from 'react'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import { useDemo } from '../demoContext'

const moduleLabels = {
  coverage: 'Coverage Agent',
  signal: 'Signal Agent',
  resolution: 'Resolution Agent',
  nlquery: 'NL Query',
  impact: 'Impact Dashboard',
  approvals: 'Approval Queue',
  timeline: 'Resolution Timeline',
  dataflow: 'Data Flow',
}

export default function ChatPanel({ activeModule }) {
  const { state, derived, actions } = useDemo()
  const [input, setInput] = useState('')

  const messages = useMemo(() => {
    return [...derived.chatSeedsFor(activeModule), ...(state.chatState[activeModule] || [])]
  }, [activeModule, derived, state.chatState])

  const handleSend = () => {
    if (!input.trim()) {
      return
    }

    actions.sendChatMessage(activeModule, input)
    setInput('')
  }

  return (
    <aside className="hidden w-[360px] shrink-0 border-l border-sp-border-subtle bg-sp-bg-raised xl:flex xl:flex-col">
      <div className="border-b border-sp-border-subtle px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sp-up-bg">
            <Bot size={15} className="text-sp-up" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-medium text-sp-text-brand">NEO Assistant</div>
            <div className="text-[10px] text-sp-up">Live context: {moduleLabels[activeModule]}</div>
          </div>
        </div>

        <div className="mt-3 rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">
            <Sparkles size={10} className="text-sp-accent" />
            Session Snapshot
          </div>
          <div className="space-y-1 text-[11px] text-sp-text-secondary">
            <div>{state.approvalsPending.length} pending approvals</div>
            <div>{derived.impact.executedActions} live demo actions executed</div>
            <div>{derived.scale.sensors.toLocaleString()} sensors modeled</div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={`${msg.role}-${index}`} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                msg.role === 'assistant' ? 'bg-sp-up-bg' : 'bg-sp-accent-soft'
              }`}
            >
              {msg.role === 'assistant' ? <Bot size={12} className="text-sp-up" /> : <User size={12} className="text-sp-accent" />}
            </div>
            <div
              className={`max-w-[86%] rounded-[8px] px-3 py-2.5 text-[13px] leading-[20px] ${
                msg.role === 'assistant'
                  ? 'rounded-tl-[2px] border border-sp-border-subtle bg-sp-bg-surface text-sp-text-base'
                  : 'chat-user-bubble rounded-tr-[2px] text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-sp-border-subtle p-3">
        <div className="chat-input-border flex items-center gap-2 rounded-[6px] bg-sp-bg-surface px-3 py-2 transition-colors duration-200">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSend()}
            placeholder={`Ask ${moduleLabels[activeModule]}...`}
            className="flex-1 bg-transparent text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none"
          />
          <button
            onClick={handleSend}
            className="chat-send-btn flex h-7 w-7 items-center justify-center rounded-[4px] transition-opacity duration-200 hover:opacity-90 active:opacity-80"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
        <div className="mt-2 text-center text-[10px] text-sp-text-tertiary">
          Contextual, state-aware responses for the active module
        </div>
      </div>
    </aside>
  )
}
