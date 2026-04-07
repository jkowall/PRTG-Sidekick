import { useState } from 'react'
import { Check, Cpu, Moon, Plus, Sun, TestTube, Trash2, Wifi, WifiOff, X } from 'lucide-react'
import { useDemo } from '../demoContext'

export default function SettingsModal({ isOpen, onClose, theme, onThemeChange }) {
  const { state, data, actions } = useDemo()
  const [activeTab, setActiveTab] = useState('servers')
  const [addingServer, setAddingServer] = useState(false)
  const [newServer, setNewServer] = useState({ name: '', url: '' })

  if (!isOpen) {
    return null
  }

  const tabs = [
    { id: 'servers', label: 'PRTG Servers' },
    { id: 'llm', label: 'LLM Provider' },
    { id: 'appearance', label: 'Appearance' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[80vh] w-[720px] overflow-hidden rounded-[12px] border border-sp-border-subtle bg-sp-bg-raised shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-sp-border-subtle px-6 py-4">
          <h2 className="text-[16px] font-medium text-sp-text-brand">Settings</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[4px] text-sp-text-tertiary transition-colors hover:bg-sp-bg-surface-hover hover:text-sp-text-base"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex border-b border-sp-border-subtle px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-[13px] font-medium transition-colors ${
                activeTab === tab.id ? 'border-sp-accent text-sp-accent' : 'border-transparent text-sp-text-secondary hover:text-sp-text-base'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-h-[calc(80vh-120px)] overflow-y-auto p-6">
          {activeTab === 'servers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-medium text-sp-text-brand">Connected PRTG Instances</h3>
                  <p className="mt-0.5 text-[12px] text-sp-text-alt">Server connections are persisted with the rest of the demo configuration.</p>
                </div>
                <button
                  onClick={() => setAddingServer(true)}
                  className="flex items-center gap-1.5 rounded-[4px] bg-sp-accent px-3 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-sp-accent-hover"
                >
                  <Plus size={12} />
                  Add Server
                </button>
              </div>

              {state.servers.map((server) => (
                <div key={server.id} className="rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${server.status === 'connected' ? 'bg-sp-up-bg' : 'bg-sp-warning-bg'}`}>
                        {server.status === 'connected' ? <Wifi size={14} className="text-sp-up" /> : <WifiOff size={14} className="text-sp-warning" />}
                      </div>
                      <div>
                        <div className="text-[14px] font-medium text-sp-text-brand">{server.name}</div>
                        <div className="text-[12px] font-mono text-sp-text-secondary">{server.url}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[12px] text-sp-text-alt">{server.version}</div>
                        <div className="text-[10px] text-sp-text-tertiary">{server.sensors.toLocaleString()} sensors</div>
                      </div>
                      <button
                        onClick={() => actions.testServer(server.id)}
                        className="rounded-[4px] bg-sp-bg-surface-hover px-2 py-1 text-[11px] font-medium text-sp-text-secondary transition-colors hover:text-sp-accent"
                      >
                        <TestTube size={10} className="mr-1 inline" />
                        Test
                      </button>
                      <button onClick={() => actions.removeServer(server.id)} className="text-sp-text-disabled transition-colors hover:text-sp-down">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {addingServer && (
                <div className="space-y-3 rounded-[8px] border border-sp-accent/30 bg-sp-bg-surface p-4">
                  <div className="text-[13px] font-medium text-sp-text-brand">New PRTG Connection</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Display Name</label>
                      <input
                        value={newServer.name}
                        onChange={(event) => setNewServer((current) => ({ ...current, name: event.target.value }))}
                        placeholder="e.g. Staging"
                        className="mt-1 w-full rounded-[4px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-1.5 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">Server URL</label>
                      <input
                        value={newServer.url}
                        onChange={(event) => setNewServer((current) => ({ ...current, url: event.target.value }))}
                        placeholder="https://prtg.example.com"
                        className="mt-1 w-full rounded-[4px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-1.5 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setAddingServer(false)} className="px-3 py-1.5 text-[12px] font-bold text-sp-text-secondary transition-colors hover:text-sp-text-base">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        actions.addServer(newServer)
                        setNewServer({ name: '', url: '' })
                        setAddingServer(false)
                      }}
                      className="rounded-[4px] bg-sp-accent px-4 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-sp-accent-hover"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'llm' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[14px] font-medium text-sp-text-brand">LLM Provider</h3>
                <p className="mt-0.5 text-[12px] text-sp-text-alt">Provider selection now updates the presenter controls, settings, and the Data Flow view together.</p>
              </div>

              {data.llmProviders.map((provider) => {
                const isSelected = state.selectedLLM === provider.id
                return (
                  <div key={provider.id}>
                    <button
                      onClick={() => actions.setLLMProvider(provider.id)}
                      className={`w-full rounded-[8px] border p-4 text-left transition-all ${
                        isSelected ? 'border-sp-accent/50 ring-1 ring-sp-accent/20' : 'border-sp-border-subtle hover:border-sp-border-strong'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${isSelected ? 'bg-sp-accent-soft' : 'bg-sp-bg-surface-hover'}`}>
                          {provider.id === 'local' ? <Cpu size={18} className={isSelected ? 'text-sp-accent' : 'text-sp-text-secondary'} /> : <Check size={18} className={isSelected ? 'text-sp-accent' : 'text-sp-text-secondary'} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-medium text-sp-text-brand">{provider.name}</span>
                            <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${provider.badgeStyle}`}>{provider.badge}</span>
                          </div>
                          <p className="mt-1 text-[12px] leading-[16px] text-sp-text-alt">{provider.description}</p>
                        </div>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="mt-2 space-y-3 rounded-[8px] border border-sp-border-subtle bg-sp-bg-surface p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          {provider.config.map((field) => {
                            const configKey = `${provider.id}_${field.key}`
                            return (
                              <div key={field.key}>
                                <label className="text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">{field.label}</label>
                                {field.type === 'select' ? (
                                  <select
                                    value={state.llmConfig[configKey] || ''}
                                    onChange={(event) => actions.updateLLMConfig(configKey, event.target.value)}
                                    className="mt-1 w-full rounded-[4px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-1.5 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
                                  >
                                    <option value="">Select...</option>
                                    {field.options.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type}
                                    value={state.llmConfig[configKey] || ''}
                                    onChange={(event) => actions.updateLLMConfig(configKey, event.target.value)}
                                    placeholder={field.placeholder}
                                    className="mt-1 w-full rounded-[4px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-1.5 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <button className="rounded-[4px] bg-sp-accent px-3 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-sp-accent-hover">
                          <TestTube size={12} className="mr-1 inline" />
                          Validate Provider Path
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[14px] font-medium text-sp-text-brand">Theme</h3>
                <p className="mt-0.5 text-[12px] text-sp-text-alt">Theme is persisted separately so the demo opens in the same appearance next time.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`flex flex-1 flex-col items-center gap-3 rounded-[8px] border p-4 transition-all ${
                    theme === 'dark' ? 'border-sp-accent/50 ring-1 ring-sp-accent/20' : 'border-sp-border-subtle hover:border-sp-border-strong'
                  }`}
                >
                  <div className="flex h-20 w-full items-end gap-1.5 rounded-[6px] border border-[#253044] bg-[#0a0e17] p-2">
                    <div className="h-full w-6 rounded-[3px] bg-[#0f1520]" />
                    <div className="h-full flex-1 rounded-[3px] bg-[#141b29]" />
                    <div className="h-full w-8 rounded-[3px] bg-[#0f1520]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon size={14} className={theme === 'dark' ? 'text-sp-accent' : 'text-sp-text-tertiary'} />
                    <span className={`text-[13px] font-medium ${theme === 'dark' ? 'text-sp-accent' : 'text-sp-text-secondary'}`}>Dark</span>
                  </div>
                </button>
                <button
                  onClick={() => onThemeChange('light')}
                  className={`flex flex-1 flex-col items-center gap-3 rounded-[8px] border p-4 transition-all ${
                    theme === 'light' ? 'border-sp-accent/50 ring-1 ring-sp-accent/20' : 'border-sp-border-subtle hover:border-sp-border-strong'
                  }`}
                >
                  <div className="flex h-20 w-full items-end gap-1.5 rounded-[6px] border border-[#E5E6E9] bg-[#F9F9FA] p-2">
                    <div className="h-full w-6 rounded-[3px] border border-[#F1F1F3] bg-[#FFFFFF]" />
                    <div className="h-full flex-1 rounded-[3px] border border-[#F1F1F3] bg-[#FFFFFF]" />
                    <div className="h-full w-8 rounded-[3px] border border-[#F1F1F3] bg-[#FFFFFF]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun size={14} className={theme === 'light' ? 'text-sp-accent' : 'text-sp-text-tertiary'} />
                    <span className={`text-[13px] font-medium ${theme === 'light' ? 'text-sp-accent' : 'text-sp-text-secondary'}`}>Light</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
