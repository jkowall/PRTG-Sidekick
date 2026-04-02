import { useState } from 'react'
import { X, Sun, Moon, Server, Plus, Trash2, Cpu, Cloud, Check, ExternalLink, TestTube, Wifi, WifiOff } from 'lucide-react'

const defaultServers = [
  { id: 1, name: 'Production', url: 'https://prtg.corp.example.com', status: 'connected', version: 'v24.3.102', sensors: 1247 },
  { id: 2, name: 'DR Site', url: 'https://prtg-dr.corp.example.com', status: 'connected', version: 'v24.3.98', sensors: 312 },
]

const llmProviders = [
  {
    id: 'paessler',
    name: 'Paessler AI',
    description: 'Managed LLM hosted by Paessler, powered by Claude. Data stays within Paessler infrastructure. Recommended for production use.',
    icon: Cloud,
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
    description: 'Run inference on your own hardware using Ollama or vLLM. No data leaves your network. Requires compatible GPU.',
    icon: Cpu,
    badge: 'Self-hosted',
    badgeStyle: 'bg-sp-accent-soft text-sp-accent',
    config: [
      { key: 'endpoint', label: 'Endpoint URL', type: 'text', placeholder: 'http://localhost:11434' },
      { key: 'model', label: 'Model', type: 'select', options: ['llama3.1-70b', 'mistral-large', 'codestral', 'qwen2.5-72b'] },
      { key: 'contextWindow', label: 'Context Window', type: 'select', options: ['32K tokens', '64K tokens', '128K tokens'] },
    ],
  },
]

export default function SettingsModal({ isOpen, onClose, theme, onThemeChange }) {
  const [activeTab, setActiveTab] = useState('servers')
  const [servers, setServers] = useState(defaultServers)
  const [selectedLLM, setSelectedLLM] = useState('paessler')
  const [llmConfig, setLlmConfig] = useState({})
  const [testingServer, setTestingServer] = useState(null)
  const [addingServer, setAddingServer] = useState(false)
  const [newServer, setNewServer] = useState({ name: '', url: '', username: '', passhash: '' })

  if (!isOpen) return null

  const tabs = [
    { id: 'servers', label: 'PRTG Servers' },
    { id: 'llm', label: 'LLM Provider' },
    { id: 'appearance', label: 'Appearance' },
  ]

  const handleTestConnection = (serverId) => {
    setTestingServer(serverId)
    setTimeout(() => setTestingServer(null), 1500)
  }

  const handleAddServer = () => {
    if (!newServer.name || !newServer.url) return
    setServers(prev => [...prev, {
      id: Date.now(),
      name: newServer.name,
      url: newServer.url,
      status: 'pending',
      version: '—',
      sensors: 0,
    }])
    setNewServer({ name: '', url: '', username: '', passhash: '' })
    setAddingServer(false)
  }

  const handleRemoveServer = (id) => {
    setServers(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-sp-bg-raised border border-sp-border-subtle rounded-[12px] w-[680px] max-h-[80vh] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sp-border-subtle">
          <h2 className="text-[16px] font-medium text-sp-text-brand">Settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[4px] flex items-center justify-center text-sp-text-tertiary hover:bg-sp-bg-surface-hover hover:text-sp-text-base transition-colors duration-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sp-border-subtle px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-[13px] font-medium transition-colors duration-200 cursor-pointer border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-sp-accent border-sp-accent'
                  : 'text-sp-text-secondary border-transparent hover:text-sp-text-base'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">

          {/* === PRTG Servers Tab === */}
          {activeTab === 'servers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-medium text-sp-text-brand">Connected PRTG Instances</h3>
                  <p className="text-[12px] text-sp-text-alt mt-0.5">NEO aggregates data across all connected servers for cross-instance analysis.</p>
                </div>
                <button
                  onClick={() => setAddingServer(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-sp-accent text-white text-[12px] font-bold tracking-[0.02em] hover:bg-sp-accent-hover transition-colors duration-200 cursor-pointer"
                >
                  <Plus size={12} /> Add Server
                </button>
              </div>

              {/* Server list */}
              {servers.map(server => (
                <div key={server.id} className="bg-sp-bg-surface rounded-[8px] border border-sp-border-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
                        server.status === 'connected' ? 'bg-sp-up-bg' : 'bg-sp-warning-bg'
                      }`}>
                        {server.status === 'connected'
                          ? <Wifi size={14} className="text-sp-up" />
                          : <WifiOff size={14} className="text-sp-warning" />}
                      </div>
                      <div>
                        <div className="text-[14px] font-medium text-sp-text-brand">{server.name}</div>
                        <div className="text-[12px] text-sp-text-secondary font-mono">{server.url}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[12px] text-sp-text-alt">{server.version}</div>
                        <div className="text-[10px] text-sp-text-tertiary">{server.sensors.toLocaleString()} sensors</div>
                      </div>
                      <button
                        onClick={() => handleTestConnection(server.id)}
                        className={`text-[11px] px-2 py-1 rounded-[4px] font-medium transition-all duration-200 cursor-pointer ${
                          testingServer === server.id
                            ? 'bg-sp-up-bg text-sp-up'
                            : 'bg-sp-bg-surface-hover text-sp-text-secondary hover:text-sp-accent'
                        }`}
                      >
                        {testingServer === server.id ? <><Check size={10} className="inline mr-1" />OK</> : <><TestTube size={10} className="inline mr-1" />Test</>}
                      </button>
                      <button
                        onClick={() => handleRemoveServer(server.id)}
                        className="text-sp-text-disabled hover:text-sp-down transition-colors duration-200 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add server form */}
              {addingServer && (
                <div className="bg-sp-bg-surface rounded-[8px] border border-sp-accent/30 p-4 space-y-3">
                  <div className="text-[13px] font-medium text-sp-text-brand">New PRTG Connection</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Display Name</label>
                      <input
                        value={newServer.name}
                        onChange={e => setNewServer(s => ({ ...s, name: e.target.value }))}
                        placeholder="e.g. Staging"
                        className="mt-1 w-full bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-1.5 text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none focus:border-sp-accent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Server URL</label>
                      <input
                        value={newServer.url}
                        onChange={e => setNewServer(s => ({ ...s, url: e.target.value }))}
                        placeholder="https://prtg.example.com"
                        className="mt-1 w-full bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-1.5 text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none focus:border-sp-accent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Username</label>
                      <input
                        value={newServer.username}
                        onChange={e => setNewServer(s => ({ ...s, username: e.target.value }))}
                        placeholder="prtgadmin"
                        className="mt-1 w-full bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-1.5 text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none focus:border-sp-accent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">Passhash</label>
                      <input
                        type="password"
                        value={newServer.passhash}
                        onChange={e => setNewServer(s => ({ ...s, passhash: e.target.value }))}
                        placeholder="••••••••"
                        className="mt-1 w-full bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-1.5 text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none focus:border-sp-accent transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setAddingServer(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[12px] font-bold text-sp-text-secondary hover:text-sp-text-base transition-colors duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddServer}
                      className="px-4 py-1.5 rounded-[4px] bg-sp-accent text-white text-[12px] font-bold tracking-[0.02em] hover:bg-sp-accent-hover transition-colors duration-200 cursor-pointer"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === LLM Provider Tab === */}
          {activeTab === 'llm' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[14px] font-medium text-sp-text-brand">LLM Provider</h3>
                <p className="text-[12px] text-sp-text-alt mt-0.5">Choose how NEO processes natural language queries and generates analysis.</p>
              </div>

              {llmProviders.map(provider => {
                const ProvIcon = provider.icon
                const isSelected = selectedLLM === provider.id

                return (
                  <div key={provider.id}>
                    <button
                      onClick={() => setSelectedLLM(provider.id)}
                      className={`w-full bg-sp-bg-surface rounded-[8px] border p-4 text-left transition-all duration-200 cursor-pointer ${
                        isSelected ? 'border-sp-accent/50 ring-1 ring-sp-accent/20' : 'border-sp-border-subtle hover:border-sp-border-strong'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-sp-accent-soft' : 'bg-sp-bg-surface-hover'
                        }`}>
                          <ProvIcon size={18} className={isSelected ? 'text-sp-accent' : 'text-sp-text-secondary'} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-medium text-sp-text-brand">{provider.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold ${provider.badgeStyle}`}>
                              {provider.badge}
                            </span>
                            {isSelected && (
                              <div className="ml-auto w-5 h-5 rounded-full bg-sp-accent flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-[12px] text-sp-text-alt mt-1 leading-[16px]">{provider.description}</p>
                        </div>
                      </div>
                    </button>

                    {/* Config fields when selected */}
                    {isSelected && (
                      <div className="mt-2 bg-sp-bg-surface rounded-[8px] border border-sp-border-subtle p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          {provider.config.map(field => (
                            <div key={field.key}>
                              <label className="text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]">
                                {field.label}
                              </label>
                              {field.type === 'select' ? (
                                <select
                                  value={llmConfig[`${provider.id}_${field.key}`] || ''}
                                  onChange={e => setLlmConfig(c => ({ ...c, [`${provider.id}_${field.key}`]: e.target.value }))}
                                  className="mt-1 w-full bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-1.5 text-[13px] text-sp-text-base outline-none focus:border-sp-accent transition-colors duration-200"
                                >
                                  <option value="">Select...</option>
                                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  value={llmConfig[`${provider.id}_${field.key}`] || ''}
                                  onChange={e => setLlmConfig(c => ({ ...c, [`${provider.id}_${field.key}`]: e.target.value }))}
                                  placeholder={field.placeholder}
                                  className="mt-1 w-full bg-sp-bg-raised border border-sp-border-subtle rounded-[4px] px-3 py-1.5 text-[13px] text-sp-text-base placeholder:text-sp-text-disabled outline-none focus:border-sp-accent transition-colors duration-200"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-sp-accent text-white text-[12px] font-bold tracking-[0.02em] hover:bg-sp-accent-hover transition-colors duration-200 cursor-pointer">
                          <TestTube size={12} />
                          Test Connection
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* === Appearance Tab === */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[14px] font-medium text-sp-text-brand">Theme</h3>
                <p className="text-[12px] text-sp-text-alt mt-0.5">Switch between light and dark appearance. Uses the Paessler Spectrum design system tokens.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`flex-1 rounded-[8px] border p-4 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer ${
                    theme === 'dark' ? 'border-sp-accent/50 ring-1 ring-sp-accent/20' : 'border-sp-border-subtle hover:border-sp-border-strong'
                  }`}
                >
                  <div className="w-full h-20 rounded-[6px] bg-[#0a0e17] border border-[#253044] flex items-end p-2 gap-1.5">
                    <div className="w-6 h-full rounded-[3px] bg-[#0f1520]" />
                    <div className="flex-1 h-full rounded-[3px] bg-[#141b29]" />
                    <div className="w-8 h-full rounded-[3px] bg-[#0f1520]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon size={14} className={theme === 'dark' ? 'text-sp-accent' : 'text-sp-text-tertiary'} />
                    <span className={`text-[13px] font-medium ${theme === 'dark' ? 'text-sp-accent' : 'text-sp-text-secondary'}`}>Dark</span>
                  </div>
                </button>
                <button
                  onClick={() => onThemeChange('light')}
                  className={`flex-1 rounded-[8px] border p-4 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer ${
                    theme === 'light' ? 'border-sp-accent/50 ring-1 ring-sp-accent/20' : 'border-sp-border-subtle hover:border-sp-border-strong'
                  }`}
                >
                  <div className="w-full h-20 rounded-[6px] bg-[#F9F9FA] border border-[#E5E6E9] flex items-end p-2 gap-1.5">
                    <div className="w-6 h-full rounded-[3px] bg-[#FFFFFF] border border-[#F1F1F3]" />
                    <div className="flex-1 h-full rounded-[3px] bg-[#FFFFFF] border border-[#F1F1F3]" />
                    <div className="w-8 h-full rounded-[3px] bg-[#FFFFFF] border border-[#F1F1F3]" />
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
