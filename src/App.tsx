import React, { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { Header } from './components/Header'
import { BalanceHeroCard } from './components/BalanceHeroCard'
import { ActiveTimerCard } from './components/ActiveTimerCard'
import { QuickMissionsGrid } from './components/QuickMissionsGrid'
import { HistoryDrawer } from './components/HistoryDrawer'
import { CustomMinutesModal } from './components/CustomMinutesModal'
import { SupabaseModal } from './components/SupabaseModal'
import { AddProfileModal } from './components/AddProfileModal'
import { ToastContainer, ToastMessage } from './components/Toast'
import { dataService } from './services/dataService'
import { sounds } from './lib/sound'
import { Profile, TaskTemplate, BalanceLog, ParentAuthor, ActiveGameSession, TaskCategory } from './types'
import { History, ShieldAlert, Sparkles, Gamepad2, Award } from 'lucide-react'

export function App() {
  // Author state
  const [currentAuthor, setCurrentAuthor] = useState<ParentAuthor>(() => {
    return (localStorage.getItem('gametime_author') as ParentAuthor) || 'Pai'
  })

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('gametime_sound') !== 'false'
  })

  // Core Data
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null)
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([])
  const [logs, setLogs] = useState<BalanceLog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false)

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)
  const [isCustomAdjustOpen, setIsCustomAdjustOpen] = useState<boolean>(false)
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false)
  const [isAddProfileOpen, setIsAddProfileOpen] = useState<boolean>(false)

  // Active Game Session Timer
  const [activeSession, setActiveSession] = useState<ActiveGameSession | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (title: string, description?: string, type: 'success' | 'penalty' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, title, description, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3800)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setSupabaseConnected(dataService.isSupabaseActive())

      const [profilesData, templatesData] = await Promise.all([
        dataService.getProfiles(),
        dataService.getTaskTemplates()
      ])

      setProfiles(profilesData)
      const selected = activeProfile 
        ? profilesData.find(p => p.id === activeProfile.id) || profilesData[0] 
        : profilesData[0]
      setActiveProfile(selected || null)

      setTaskTemplates(templatesData)

      if (selected) {
        const logsData = await dataService.getBalanceLogs(selected.id)
        setLogs(logsData)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      addToast('Erro ao carregar dados', 'Verifique a conexão', 'penalty')
    } finally {
      setLoading(false)
    }
  }, [activeProfile?.id])

  // Initial load & realtime subscribe
  useEffect(() => {
    loadData()
    const unsubscribe = dataService.subscribeToChanges(() => {
      loadData()
    })
    return () => {
      unsubscribe()
    }
  }, [loadData])

  // Switch profile
  const handleSelectProfile = async (profile: Profile) => {
    setActiveProfile(profile)
    const logsData = await dataService.getBalanceLogs(profile.id)
    setLogs(logsData)
  }

  // Author change
  const handleSelectAuthor = (author: ParentAuthor) => {
    setCurrentAuthor(author)
    localStorage.setItem('gametime_author', author)
    addToast(`Registrando agora como: ${author}`, undefined, 'info')
  }

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    localStorage.setItem('gametime_sound', String(next))
    if (next) sounds.playReward()
  }

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b', '#ec4899']
      })
    } catch {
      // Ignored
    }
  }

  // Execute a 1-touch task from grid
  const handleExecuteTask = async (task: TaskTemplate) => {
    if (!activeProfile) return

    const isReward = task.minutes_reward > 0
    if (soundEnabled) {
      if (isReward) {
        sounds.playReward()
        triggerConfetti()
      } else {
        sounds.playPenalty()
      }
    }

    try {
      // Optimistic profile update
      const newBalance = Math.max(0, activeProfile.current_balance_minutes + task.minutes_reward)
      setActiveProfile((prev) => prev ? { ...prev, current_balance_minutes: newBalance } : null)
      setProfiles((prev) =>
        prev.map((p) => p.id === activeProfile.id ? { ...p, current_balance_minutes: newBalance } : p)
      )

      // Add to balance_logs in database/service
      const newLog = await dataService.addBalanceLog({
        profile_id: activeProfile.id,
        task_title: task.title,
        minutes_applied: task.minutes_reward,
        recorded_by: currentAuthor
      })

      setLogs((prev) => [newLog, ...prev])

      addToast(
        isReward ? `+${task.minutes_reward}m por "${task.title}"!` : `${task.minutes_reward}m penalidade aplicada`,
        `Registrado por ${currentAuthor} para ${activeProfile.name}`,
        isReward ? 'success' : 'penalty'
      )
    } catch (err) {
      console.error('Failed to log task:', err)
      addToast('Erro ao salvar registro', undefined, 'penalty')
      loadData()
    }
  }

  // Quick redeem gaming session (e.g. -30 min)
  const handleQuickRedeem = async (minutes: number, title?: string) => {
    if (!activeProfile) return

    if (soundEnabled) {
      sounds.playRedeem()
    }

    const deductMinutes = -Math.abs(minutes)
    const taskTitle = title || `🎮 Sessão de Jogo (-${minutes}m)`

    try {
      const newBalance = Math.max(0, activeProfile.current_balance_minutes + deductMinutes)
      setActiveProfile((prev) => prev ? { ...prev, current_balance_minutes: newBalance } : null)
      setProfiles((prev) =>
        prev.map((p) => p.id === activeProfile.id ? { ...p, current_balance_minutes: newBalance } : p)
      )

      const newLog = await dataService.addBalanceLog({
        profile_id: activeProfile.id,
        task_title: taskTitle,
        minutes_applied: deductMinutes,
        recorded_by: currentAuthor
      })

      setLogs((prev) => [newLog, ...prev])

      addToast(
        `🎮 Jogo liberado! -${minutes} min debitados`,
        `Registrado por ${currentAuthor}. Bom jogo, ${activeProfile.name}!`,
        'success'
      )
    } catch (err) {
      console.error('Failed to redeem:', err)
      addToast('Erro ao abater tempo', undefined, 'penalty')
      loadData()
    }
  }

  // Start active game session timer
  const handleStartSessionTimer = (minutes: number) => {
    if (!activeProfile) return
    setActiveSession({
      id: `session-${Date.now()}`,
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      startTime: Date.now(),
      totalMinutes: minutes,
      remainingSeconds: minutes * 60,
      isActive: true
    })
  }

  const handleStopSessionTimer = () => {
    setActiveSession(null)
    addToast('Sessão de jogo finalizada', undefined, 'info')
  }

  const handleAddMinutesToSession = (addedMins: number) => {
    if (!activeSession) return
    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            remainingSeconds: prev.remainingSeconds + addedMins * 60,
            totalMinutes: prev.totalMinutes + addedMins
          }
        : null
    )
    addToast(`+${addedMins} min de tolerância adicionados`, undefined, 'info')
  }

  // Custom manual adjust
  const handleCustomAdjust = async (minutes: number, title: string) => {
    if (!activeProfile) return

    const isReward = minutes > 0
    if (soundEnabled) {
      if (isReward) {
        sounds.playReward()
        triggerConfetti()
      } else {
        sounds.playPenalty()
      }
    }

    try {
      const newBalance = Math.max(0, activeProfile.current_balance_minutes + minutes)
      setActiveProfile((prev) => prev ? { ...prev, current_balance_minutes: newBalance } : null)
      setProfiles((prev) =>
        prev.map((p) => p.id === activeProfile.id ? { ...p, current_balance_minutes: newBalance } : p)
      )

      const newLog = await dataService.addBalanceLog({
        profile_id: activeProfile.id,
        task_title: title,
        minutes_applied: minutes,
        recorded_by: currentAuthor
      })

      setLogs((prev) => [newLog, ...prev])

      addToast(
        `${isReward ? `+${minutes}` : minutes}m: ${title}`,
        `Registrado por ${currentAuthor}`,
        isReward ? 'success' : 'penalty'
      )
    } catch (err) {
      console.error('Custom adjust failed:', err)
      loadData()
    }
  }

  // Create new task template
  const handleCreateTemplate = async (templateData: {
    title: string
    minutes_reward: number
    category: TaskCategory
    icon: string
    active: boolean
  }) => {
    try {
      const created = await dataService.addTaskTemplate(templateData)
      setTaskTemplates((prev) => [...prev, created])
      addToast(`Missão "${created.title}" criada!`, undefined, 'success')
      if (soundEnabled) sounds.playReward()
    } catch (err) {
      console.error('Create template failed:', err)
      addToast('Erro ao criar missão', undefined, 'penalty')
    }
  }

  // Undo transaction
  const handleUndoLog = async (logId: string) => {
    try {
      await dataService.undoBalanceLog(logId)
      if (soundEnabled) sounds.playReward()
      addToast('Lançamento desfeito com sucesso!', undefined, 'info')
      loadData()
    } catch (err) {
      console.error('Undo failed:', err)
      addToast('Erro ao desfazer lançamento', undefined, 'penalty')
    }
  }

  // Add child profile
  const handleAddProfile = async (name: string, dailyMax: number) => {
    try {
      const created = await dataService.createProfile(name, dailyMax)
      setProfiles((prev) => [...prev, created])
      setActiveProfile(created)
      addToast(`Perfil de ${created.name} criado!`, undefined, 'success')
      if (soundEnabled) sounds.playReward()
    } catch (err) {
      console.error('Add profile failed:', err)
      addToast('Erro ao criar perfil', undefined, 'penalty')
    }
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col antialiased selection:bg-purple-600 selection:text-white pb-20">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header with Author and Child Selector */}
      <Header
        currentAuthor={currentAuthor}
        onSelectAuthor={handleSelectAuthor}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onAddProfile={() => setIsAddProfileOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSupabaseModalOpen(true)}
        supabaseConnected={supabaseConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-4">
        {loading && !activeProfile ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Gamepad2 className="w-10 h-10 text-gamer-purple animate-bounce" />
            <p className="font-gamer text-sm tracking-wider">CARREGANDO GAMETIME...</p>
          </div>
        ) : activeProfile ? (
          <>
            {/* Active Game Session Countdown Card (if running) */}
            {activeSession && (
              <ActiveTimerCard
                session={activeSession}
                onStop={handleStopSessionTimer}
                onAddMinutes={handleAddMinutesToSession}
              />
            )}

            {/* Hero Balance Card */}
            <BalanceHeroCard
              profile={activeProfile}
              onQuickRedeem={handleQuickRedeem}
              onOpenCustomAdjust={() => setIsCustomAdjustOpen(true)}
              onStartSessionTimer={handleStartSessionTimer}
            />

            {/* Quick Missions 1-Touch Grid */}
            <QuickMissionsGrid
              tasks={taskTemplates}
              onExecuteTask={handleExecuteTask}
              onOpenCreateTask={() => setIsCustomAdjustOpen(true)}
            />

            {/* History Preview Quick Bar */}
            <div className="pt-2">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all flex items-center justify-between text-xs font-semibold shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-gamer-purple-light" />
                  <span>Ver Histórico & Auditoria</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                    {logs.length} registros
                  </span>
                </div>
                <span className="text-gamer-purple-light font-bold">Abrir &rarr;</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 space-y-3">
            <p className="text-slate-400">Nenhum perfil cadastrado.</p>
            <button
              onClick={() => setIsAddProfileOpen(true)}
              className="px-4 py-2 rounded-xl bg-gamer-purple text-white font-bold text-xs"
            >
              Criar Perfil
            </button>
          </div>
        )}
      </main>

      {/* Floating Bottom Quick Bar on Mobile */}
      {activeProfile && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 z-20">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Registrando como:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-lg text-xs ${
                  currentAuthor === 'Pai'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                    : 'bg-pink-950 text-pink-300 border border-pink-800/40'
                }`}
              >
                {currentAuthor === 'Pai' ? '🧔 Pai' : '👩 Mãe'}
              </span>
            </div>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-gamer-cyan" />
              <span>Histórico</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={logs}
        profileName={activeProfile?.name || 'Filho'}
        onUndoLog={handleUndoLog}
      />

      <CustomMinutesModal
        isOpen={isCustomAdjustOpen}
        onClose={() => setIsCustomAdjustOpen(false)}
        profileName={activeProfile?.name || 'Filho'}
        onSubmitCustom={handleCustomAdjust}
        onCreateTemplate={handleCreateTemplate}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefresh={loadData}
      />

      <AddProfileModal
        isOpen={isAddProfileOpen}
        onClose={() => setIsAddProfileOpen(false)}
        onAdd={handleAddProfile}
      />
    </div>
  )
}
