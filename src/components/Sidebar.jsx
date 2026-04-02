import { Shield, Activity, AlertTriangle, Settings, Sun, Moon } from 'lucide-react'

const navItems = [
  { id: 'coverage', label: 'Coverage Agent', icon: Shield, tier: '1' },
  { id: 'signal', label: 'Signal Agent', icon: Activity, tier: '1' },
  { id: 'resolution', label: 'Resolution Agent', icon: AlertTriangle, tier: '2' },
]

export default function Sidebar({ activeModule, onModuleChange, theme, onThemeToggle, onOpenSettings }) {
  return (
    <aside className="w-[260px] bg-sp-bg-raised border-r border-sp-border-subtle flex flex-col shrink-0">
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
          <button
            onClick={onThemeToggle}
            className="w-7 h-7 rounded-[4px] flex items-center justify-center text-sp-text-tertiary hover:bg-sp-bg-surface-hover hover:text-sp-text-base transition-colors duration-200 cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-2 mb-3 text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">
          Agent Modules
        </div>
        {navItems.map(({ id, label, icon: Icon, tier }) => {
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
              <Icon size={16} />
              <span className="flex-1 text-left">{label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold ${
                tier === '1' ? 'bg-sp-accent-soft text-sp-accent' : 'bg-sp-unknown-bg text-sp-accent-tertiary'
              }`}>
                T{tier}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sp-border-subtle space-y-3">
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
        <div className="text-[10px] text-sp-text-tertiary px-3">2 servers connected</div>
      </div>
    </aside>
  )
}
