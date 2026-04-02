import { useState, useEffect } from 'react'
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

function App() {
  const [activeModule, setActiveModule] = useState('coverage')
  const [theme, setTheme] = useState('dark')
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
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

  const ActiveComponent = modules[activeModule]

  return (
    <div className="flex h-screen bg-sp-bg-base text-sp-text-base overflow-hidden">
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        theme={theme}
        onThemeToggle={toggleTheme}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto p-6">
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
