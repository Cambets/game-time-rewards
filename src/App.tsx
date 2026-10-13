import React, { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { Header } from './components/Header'
import { ModeSwitchHeader } from './components/ModeSwitchHeader'
import { GaelDashboard } from './components/GaelDashboard'
import { GameSessionScreen } from './components/GameSessionScreen'
import { GameOverScreen } from './components/GameOverScreen'
import { PendingApprovalsBanner } from './components/PendingApprovalsBanner'
import { PinModal } from './components/PinModal'
import { BalanceHeroCard } from './components/BalanceHeroCard'
import { ActiveTimerCard } from './components/ActiveTimerCard'
import { QuickMissionsGrid } from './components/QuickMissionsGrid'
import { HistoryDrawer } from './components/HistoryDrawer'
import { CustomMinutesModal } from './components/CustomMinutesModal'
import { SupabaseModal } from './components/SupabaseModal'
import { ShareModal } from './components/ShareModal'
import { AlarmModal } from './components/AlarmModal'
import { ToastContainer, ToastMessage } from './components/Toast'
import { dataService } from './services/dataService'
import { sounds } from './lib/sound'
import {
  Profile,
  TaskTemplate,
  BalanceLog,
  ParentAuthor,
  ActiveGameSession,
  TaskCategory,
  AppMode,
  PendingTask,
  KidAvatar
} from './types'
import { History, Share2, Gamepad2, Lock } from 'lucide-react'

export function App() {
  // Current Mode: 'kid' (QG do Gael) or 'parent' (Área dos Pais)
  const [appMode, setAppMode] = useState<AppMode>(() => {
    return (localStorage.getItem('gametime_app_mode') as AppMode) || 'kid'
  })

  // Author state (for parents)
  const [currentAuthor, setCurrentAuthor] = useState<ParentAuthor>(() => {
    return (localStorage.getItem('gametime_author') as ParentAuthor) || 'Papai'
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
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false)

  // Modals & Screen States
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)
  const [isCustomAdjustOpen, setIsCustomAdjustOpen] = useState<boolean>(false)
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState<boolean>(false)

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
        dataService.getTaskTemplates(),
      ])

      setProfiles(profilesData)
      const gaelProfile = profilesData.find((p) => p.name === 'Gael') || profilesData[0]
      setActiveProfile(gaelProfile || null)
      setTaskTemplates(templatesData)

      if (gaelProfile) {
        const [logsData, sessionData, pendingData] = await Promise.all([
          dataService.getBalanceLogs(gaelProfile.id),
          dataService.getActiveSession(gaelProfile.id),
          dataService.getPendingTasks(gaelProfile.id),
        ])
        setLogs(logsData)
        setActiveSession(sessionData)
        setPendingTasks(pendingData)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      addToast('Erro ao carregar dados', 'Verifique a conexão', 'penalty')
    } finally {
      setLoading(false)
    }
  }, [])

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

  // Request browser notification permission
  useEffect(() => {
    sounds.requestNotificationPermission()
  }, [])

  // Mode change
  const handleSwitchToKidMode = () => {
    setAppMode('kid')
    localStorage.setItem('gametime_app_mode', 'kid')
    addToast('Bem-vindo ao seu QG, Gael! 🎮', undefined, 'info')
  }

  const handleRequestParentMode = () => {
    if (appMode === 'parent') return
    setIsPinModalOpen(true)
  }

  const handlePinSuccess = () => {
    setIsPinModalOpen(false)
    setAppMode('parent')
    localStorage.setItem('gametime_app_mode', 'parent')
    sounds.play1Up()
    addToast('Área dos Pais Desbloqueada 🔒', 'Acesso administrativo liberado.', 'success')
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
        colors: ['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b', '#ec4899'],
      })
    } catch {
      // Ignored
    }
  }

  // Gael marks task as done (Kid Mode action)
  const handleMarkTaskDone = async (task: TaskTemplate) => {
    if (!activeProfile) return

    try {
      const created = await dataService.createPendingTask({
        profile_id: activeProfile.id,
        template_id: task.id,
        task_title: task.title,
        minutes_reward: task.minutes_reward,
      })
      setPendingTasks((prev) => [created, ...prev])

      addToast(
        `Missão "${task.title}" marcada! 🚀`,
        'Avisamos o Papai e a Mamãe para aprovarem seus minutos!',
        'success'
      )
    } catch (e) {
      console.error('Failed to mark task done:', e)
    }
  }

  // Parent approves Gael's completed task
  const handleApproveTask = async (task: PendingTask) => {
    if (soundEnabled) {
      sounds.playReward()
      triggerConfetti()
    }

    try {
      await dataService.approvePendingTask(task.id, currentAuthor)
      setPendingTasks((prev) => prev.filter((p) => p.id !== task.id))
      addToast(
        `Missão "${task.task_title}" aprovada! (+${task.minutes_reward}m)`,
        `Creditado por ${currentAuthor} para o Gael!`,
        'success'
      )
      loadData()
    } catch (e) {
      console.error('Approve failed:', e)
      addToast('Erro ao aprovar missão', undefined, 'penalty')
    }
  }

  // Parent rejects task
  const handleRejectTask = async (task: PendingTask) => {
    try {
      await dataService.rejectPendingTask(task.id)
      setPendingTasks((prev) => prev.filter((p) => p.id !== task.id))
      addToast('Missão descartada', undefined, 'info')
    } catch (e) {
      console.error('Reject failed:', e)
    }
  }

  // Gael changes avatar
  const handleChangeAvatar = async (avatar: KidAvatar) => {
    if (!activeProfile) return
    setActiveProfile((prev) => prev ? { ...prev, avatar_id: avatar } : null)
    await dataService.updateAvatar(activeProfile.id, avatar)
    addToast('Avatar atualizado!', undefined, 'success')
  }

  // Execute a 1-touch task from grid (Parent Mode action)
  const handleExecuteTask = async (task: TaskTemplate) => {
    if (!activeProfile) return

    const isReward = task.minutes_reward > 0
    if (soundEnabled) {
      if (isReward) {
        if (task.minutes_reward >= 30) {
          sounds.play1Up()
        } else {
          sounds.playReward()
        }
        triggerConfetti()
      } else {
        sounds.playPenalty()
      }
    }

    try {
      const newBalance = Math.max(0, activeProfile.current_balance_minutes + task.minutes_reward)
      setActiveProfile((prev) => (prev ? { ...prev, current_balance_minutes: newBalance } : null))

      const newLog = await dataService.addBalanceLog({
        profile_id: activeProfile.id,
        task_title: task.title,
        minutes_applied: task.minutes_reward,
        recorded_by: currentAuthor,
      })

      setLogs((prev) => [newLog, ...prev])

      addToast(
        isReward ? `+${task.minutes_reward}m por "${task.title}"!` : `${task.minutes_reward}m penalidade aplicada`,
        `Registrado por ${currentAuthor} para o Gael`,
        isReward ? 'success' : 'penalty'
      )
    } catch (err) {
      console.error('Failed to log task:', err)
      addToast('Erro ao salvar registro', undefined, 'penalty')
      loadData()
    }
  }

  // Start active game session timer
  const handleStartSessionTimer = async (minutes: number) => {
    if (!activeProfile) return

    const now = Date.now()
    const endTime = now + minutes * 60 * 1000

    try {
      const session = await dataService.startActiveSession({
        profileId: activeProfile.id,
        profileName: activeProfile.name,
        startTime: now,
        endTime,
        totalMinutes: minutes,
        remainingSeconds: minutes * 60,
        isActive: true,
      })

      setActiveSession(session)
      setIsAlarmModalOpen(false)
      setIsGameOver(false)
      sounds.stopAlarm()
      addToast(`Cronômetro de ${minutes}m iniciado!`, 'Alarme tocará quando o tempo do Gael acabar.', 'info')
      loadData()
    } catch (e) {
      console.error('Failed to start session timer:', e)
    }
  }

  // Stop session timer
  const handleStopSessionTimer = async () => {
    sounds.stopAlarm()
    setIsAlarmModalOpen(false)
    setIsGameOver(false)
    if (activeProfile) {
      await dataService.stopActiveSession(activeProfile.id)
    }
    setActiveSession(null)
    addToast('Sessão de jogo do Gael finalizada', undefined, 'info')
    loadData()
  }

  // Add minutes tolerance
  const handleAddMinutesToSession = async (addedMins: number) => {
    if (!activeProfile || !activeSession) return
    sounds.stopAlarm()
    setIsAlarmModalOpen(false)
    setIsGameOver(false)

    await dataService.addToleranceToSession(activeProfile.id, addedMins)
    const updated = await dataService.getActiveSession(activeProfile.id)
    setActiveSession(updated)
    addToast(`+${addedMins} min de tolerância adicionados`, 'Gael pode salvar a partida!', 'info')
  }

  // Time is expired in Session Screen -> Trigger Game Over screen!
  const handleSessionTimeExpired = () => {
    setIsGameOver(true)
  }

  // Custom manual adjust
  const handleCustomAdjust = async (minutes: number, title: string) => {
    if (!activeProfile) return

    const isReward = minutes > 0
    if (soundEnabled) {
      if (isReward) {
        if (minutes >= 30) {
          sounds.play1Up()
        } else {
          sounds.playReward()
        }
        triggerConfetti()
      } else {
        sounds.playPenalty()
      }
    }

    try {
      const newBalance = Math.max(0, activeProfile.current_balance_minutes + minutes)
      setActiveProfile((prev) => (prev ? { ...prev, current_balance_minutes: newBalance } : null))

      const newLog = await dataService.addBalanceLog({
        profile_id: activeProfile.id,
        task_title: title,
        minutes_applied: minutes,
        recorded_by: currentAuthor,
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

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col antialiased selection:bg-purple-600 selection:text-white pb-20">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Mode Switch Header (Sou o Gael 🎮 vs Área dos Pais 🔒) */}
      <ModeSwitchHeader
        currentMode={appMode}
        onSelectKidMode={handleSwitchToKidMode}
        onRequestParentMode={handleRequestParentMode}
        pendingCount={pendingTasks.length}
      />

      {/* Parent Header (visible only in Parent Mode) */}
      {appMode === 'parent' && (
        <Header
          currentAuthor={currentAuthor}
          onSelectAuthor={handleSelectAuthor}
          activeProfile={activeProfile}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenSettings={() => setIsSupabaseModalOpen(true)}
          onOpenShare={() => setIsShareModalOpen(true)}
          supabaseConnected={supabaseConnected}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-4">
        {loading && !activeProfile ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Gamepad2 className="w-10 h-10 text-gamer-purple animate-bounce" />
            <p className="font-gamer text-sm tracking-wider">CARREGANDO GAMETIME DO GAEL...</p>
          </div>
        ) : activeProfile ? (
          <>
            {/* =========================================
                MODO JOGADOR: QG DO GAEL (KID MODE)
               ========================================= */}
            {appMode === 'kid' ? (
              <GaelDashboard
                profile={activeProfile}
                tasks={taskTemplates}
                pendingTasks={pendingTasks}
                onStartGameSession={handleStartSessionTimer}
                onMarkTaskDone={handleMarkTaskDone}
                onChangeAvatar={handleChangeAvatar}
              />
            ) : (
              /* =========================================
                 MODO ADMINISTRATIVO: ÁREA DOS PAIS
                 ========================================= */
              <>
                {/* Pending Tasks Banner (Gael marcou como feito) */}
                <PendingApprovalsBanner
                  pendingTasks={pendingTasks}
                  onApprove={handleApproveTask}
                  onReject={handleRejectTask}
                />

                {/* Active Game Session Countdown Card (if running) */}
                {activeSession && (
                  <ActiveTimerCard
                    session={activeSession}
                    onStop={handleStopSessionTimer}
                    onAddMinutes={handleAddMinutesToSession}
                    onTimeUp={() => setIsAlarmModalOpen(true)}
                  />
                )}

                {/* Hero Balance Card */}
                <BalanceHeroCard
                  profile={activeProfile}
                  onQuickRedeem={handleStartSessionTimer}
                  onOpenCustomAdjust={() => setIsCustomAdjustOpen(true)}
                  onStartSessionTimer={handleStartSessionTimer}
                />

                {/* Quick Missions 1-Touch Grid */}
                <QuickMissionsGrid
                  tasks={taskTemplates}
                  onExecuteTask={handleExecuteTask}
                  onOpenCreateTask={() => setIsCustomAdjustOpen(true)}
                />

                {/* History Quick Bar */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all flex items-center justify-between text-xs font-semibold shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-gamer-purple-light" />
                      <span>Ver Histórico de Lançamentos</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {logs.length} registros
                      </span>
                    </div>
                    <span className="text-gamer-purple-light font-bold">Abrir &rarr;</span>
                  </button>
                </div>
              </>
            )}
          </>
        ) : null}
      </main>

      {/* Floating Bottom Bar in Parent Mode */}
      {appMode === 'parent' && activeProfile && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 z-20">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Registrando como:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-lg text-xs ${
                  currentAuthor === 'Papai'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                    : 'bg-pink-950 text-pink-300 border border-pink-800/40'
                }`}
              >
                {currentAuthor === 'Papai' ? '🧔 Papai' : '👩 Mamãe'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-pink-950/70 hover:bg-pink-900/70 text-pink-300 text-xs font-bold border border-pink-700/40 flex items-center gap-1 transition-colors"
                title="Compartilhar com a esposa"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Esposa</span>
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-gamer-cyan" />
                <span>Histórico</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TELAS CHEIAS IMERSIVAS: SESSÃO & GAME OVER
         ========================================= */}

      {/* Immersive Arcade Session Screen (When active game session is running in Kid Mode) */}
      {activeSession && appMode === 'kid' && !isGameOver && (
        <GameSessionScreen
          session={activeSession}
          onTimeExpired={handleSessionTimeExpired}
          onRequestEarlyExit={() => setIsPinModalOpen(true)}
        />
      )}

      {/* Fullscreen Game Over Screen (When time reaches 00:00:00) */}
      {isGameOver && (
        <GameOverScreen
          onUnlockSuccess={() => {
            setIsGameOver(false)
            handleStopSessionTimer()
          }}
          onGoToMissions={() => {
            setIsGameOver(false)
            handleStopSessionTimer()
            setAppMode('kid')
          }}
        />
      )}

      {/* PIN Security Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Parent Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={logs}
        profileName="Gael"
        onUndoLog={handleUndoLog}
      />

      <CustomMinutesModal
        isOpen={isCustomAdjustOpen}
        onClose={() => setIsCustomAdjustOpen(false)}
        profileName="Gael"
        onSubmitCustom={handleCustomAdjust}
        onCreateTemplate={handleCreateTemplate}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefresh={loadData}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentAuthor={currentAuthor}
      />

      <AlarmModal
        isOpen={isAlarmModalOpen}
        kidName="Gael"
        onDismiss={handleStopSessionTimer}
        onAddTolerance={handleAddMinutesToSession}
      />
    </div>
  )
}
