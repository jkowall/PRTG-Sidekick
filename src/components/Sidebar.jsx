import { Shield, Activity, AlertTriangle, MessageSquare, BarChart3, CheckCircle2, Clock, Lock, Settings, Sun, Moon, Sparkles } from 'lucide-react'
import { useDemo } from '../demoContext'

const introItems = [
  { id: 'overview', label: 'What is NEO?' },
]

const agentItems = [
  { id: 'coverage', label: 'Coverage Agent' },
  { id: 'signal', label: 'Signal Agent' },
  { id: 'resolution', label: 'Resolution Agent' },
]

const platformItems = [
  { id: 'nlquery', label: 'NL Query' },
  { id: 'impact', label: 'Impact Dashboard' },
  { id: 'approvals', label: 'Approval Queue' },
  { id: 'timeline', label: 'Resolution Timeline' },
  { id: 'dataflow', label: 'Data Flow' },
]

function renderItemIcon(id, className = '') {
  switch (id) {
    case 'overview':
      return <Sparkles size={16} className={className} />
    case 'coverage':
      return <Shield size={16} className={className} />
    case 'signal':
      return <Activity size={16} className={className} />
    case 'resolution':
      return <AlertTriangle size={16} className={className} />
    case 'nlquery':
      return <MessageSquare size={16} className={className} />
    case 'impact':
      return <BarChart3 size={16} className={className} />
    case 'approvals':
      return <CheckCircle2 size={16} className={className} />
    case 'timeline':
      return <Clock size={16} className={className} />
    case 'dataflow':
      return <Lock size={16} className={className} />
    default:
      return <Shield size={16} className={className} />
  }
}

export default function Sidebar({ activeModule, onModuleChange, theme, onThemeToggle, onOpenSettings }) {
  const { state, derived } = useDemo()

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-sp-border-subtle bg-sp-bg-raised lg:flex lg:flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-sp-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-sp-up-bg flex items-center justify-center">
            <span className="text-sp-up font-bold text-[14px]">S</span>
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-medium text-sp-text-brand tracking-tight">PRTG Sidekick</div>
            <div className="text-[10px] text-sp-text-tertiary tracking-[0.06em] uppercase">NEO Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 mb-3 text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">
          Intro
        </div>
        {introItems.map(({ id, label }) => {
          const isActive = activeModule === id
          return (
            <button
              key={id}
              onClick={() => onModuleChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-sp-accent-soft text-sp-accent'
                  : 'text-sp-text-secondary hover:bg-sp-bg-surface-hover hover:text-sp-text-base'
              }`}
            >
              {renderItemIcon(id)}
              <span className="flex-1 text-left">{label}</span>
            </button>
          )
        })}

        <div className="px-2 mb-3 text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">
          Agent Modules
        </div>
        {agentItems.map(({ id, label }) => {
          const isActive = activeModule === id
          return (
            <button
              key={id}
              onClick={() => onModuleChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-sp-accent-soft text-sp-accent'
                  : 'text-sp-text-secondary hover:bg-sp-bg-surface-hover hover:text-sp-text-base'
              }`}
            >
              {renderItemIcon(id)}
              <span className="flex-1 text-left">{label}</span>
            </button>
          )
        })}

        <div className="px-2 mt-4 mb-3 text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">
          NEO Platform
        </div>
        {platformItems.map(({ id, label }) => {
          const isActive = activeModule === id
          return (
            <button
              key={id}
              onClick={() => onModuleChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-sp-accent-soft text-sp-accent'
                  : 'text-sp-text-secondary hover:bg-sp-bg-surface-hover hover:text-sp-text-base'
              }`}
            >
              {renderItemIcon(id)}
              <span className="flex-1 text-left">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sp-border-subtle space-y-3">
        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[13px] font-medium text-sp-text-secondary hover:bg-sp-bg-surface-hover hover:text-sp-text-base transition-colors duration-200 cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span className="flex-1 text-left">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          <div className={`w-8 h-[18px] rounded-full relative transition-colors duration-200 ${
            theme === 'dark' ? 'bg-sp-bg-surface-active' : 'bg-sp-accent'
          }`}>
            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all duration-200 ${
              theme === 'dark' ? 'left-[2px]' : 'left-[14px]'
            }`} />
          </div>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[13px] font-medium text-sp-text-secondary hover:bg-sp-bg-surface-hover hover:text-sp-text-base transition-colors duration-200 cursor-pointer"
        >
          <Settings size={14} />
          Settings
        </button>
        <div className="flex items-center gap-2 px-3">
          <div className="w-2 h-2 rounded-full bg-sp-up animate-pulse" />
          <span className="text-[12px] text-sp-text-secondary">NEO Engine Active</span>
        </div>
        <div className="px-3 text-[10px] text-sp-text-tertiary">
          {state.servers.length} servers connected
        </div>
        <div className="px-3 text-[10px] text-sp-text-tertiary">
          {derived.scale.sensors.toLocaleString()} sensors in {derived.scale.instances} instances
        </div>
      </div>
    </aside>
  )
}
