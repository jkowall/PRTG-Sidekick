import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import CoverageAgent from './components/CoverageAgent'
import SignalAgent from './components/SignalAgent'
import ResolutionAgent from './components/ResolutionAgent'
import NLQueryAgent from './components/NLQueryAgent'
import ImpactDashboard from './components/ImpactDashboard'
import ApprovalQueue from './components/ApprovalQueue'
import ResolutionTimeline from './components/ResolutionTimeline'
import DataFlowDiagram from './components/DataFlowDiagram'
import ChatPanel from './components/ChatPanel'
import SettingsModal from './components/SettingsModal'
import DemoControlBar from './components/DemoControlBar'
import { useDemo } from './demoContext'

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

function App() {
  const { state, actions } = useDemo()
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    return window.localStorage.getItem('prtg-sidekick-theme') || 'dark'
  })
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('prtg-sidekick-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const modules = {
    coverage: CoverageAgent,
    signal: SignalAgent,
    resolution: ResolutionAgent,
    nlquery: NLQueryAgent,
    impact: ImpactDashboard,
    approvals: ApprovalQueue,
    timeline: ResolutionTimeline,
    dataflow: DataFlowDiagram,
  }

  const activeModule = state.currentModule
  const ActiveComponent = modules[activeModule]

  return (
    <div className="flex min-h-screen bg-sp-bg-base text-sp-text-base lg:h-screen lg:overflow-hidden">
      <Sidebar
        activeModule={activeModule}
        onModuleChange={actions.setCurrentModule}
        theme={theme}
        onThemeToggle={toggleTheme}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-4 lg:hidden">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.06em] text-sp-text-tertiary">
            Module
          </label>
          <select
            value={activeModule}
            onChange={(event) => actions.setCurrentModule(event.target.value)}
            className="w-full rounded-[8px] border border-sp-border-subtle bg-sp-bg-raised px-3 py-2 text-[13px] text-sp-text-base outline-none focus:border-sp-accent"
          >
            {Object.entries(moduleLabels).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <DemoControlBar />
        <div key={activeModule} className="module-enter">
          <ActiveComponent />
        </div>
      </main>

      <ChatPanel activeModule={activeModule} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  )
}

export default App
