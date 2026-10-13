import React, { useState } from 'react'
import { Profile, TaskTemplate, PendingTask, KidAvatar } from '../types'
import { DynamicIcon } from './DynamicIcon'
import { LuckyWheelModal } from './LuckyWheelModal'
import { AchievementsModal } from './AchievementsModal'
import { PixelPetCompanion } from './PixelPetCompanion'
import {
  Gamepad2,
  Trophy,
  Flame,
  Play,
  Sparkles,
  CheckCircle2,
  Clock,
  Swords,
  Bot,
  Wand2,
  Car,
  Rocket,
  Shield,
  Zap,
  Gift
} from 'lucide-react'
import { sounds } from '../lib/sound'
import confetti from 'canvas-confetti'

interface GaelDashboardProps {
  profile: Profile
  tasks: TaskTemplate[]
  pendingTasks: PendingTask[]
  onStartGameSession: (minutes: number) => void
  onMarkTaskDone: (task: TaskTemplate) => void
  onChangeAvatar: (avatar: KidAvatar) => void
  onWinRoulettePrize: (minutes: number, xp: number, prizeTitle: string) => void
}

const AVATARS: { id: KidAvatar; name: string; emoji: string; color: string }[] = [
  { id: 'warrior', name: 'Guerreiro Gamer', emoji: '⚔️', color: 'from-amber-500 to-orange-600' },
  { id: 'robot', name: 'Robô Cyber', emoji: '🤖', color: 'from-cyan-500 to-blue-600' },
  { id: 'mage', name: 'Mago Pixel', emoji: '🧙', color: 'from-purple-500 to-pink-600' },
  { id: 'racer', name: 'Piloto Speed', emoji: '🏎️', color: 'from-emerald-500 to-teal-600' },
  { id: 'astronaut', name: 'Cosmo Gamer', emoji: '🚀', color: 'from-indigo-500 to-purple-700' },
]

export const GaelDashboard: React.FC<GaelDashboardProps> = ({
  profile,
  tasks,
  pendingTasks,
  onStartGameSession,
  onMarkTaskDone,
  onChangeAvatar,
  onWinRoulettePrize,
}) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [showStartModal, setShowStartModal] = useState(false)
  const [showLuckyWheel, setShowLuckyWheel] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [chosenMinutes, setChosenMinutes] = useState<number>(30)

  const balance = profile.current_balance_minutes
  const currentAvatarId = (profile.avatar_id as KidAvatar) || 'warrior'
  const currentAvatar = AVATARS.find((a) => a.id === currentAvatarId) || AVATARS[0]

  // XP & Level calculations
  const totalXp = profile.xp || 140
  const level = Math.floor(totalXp / 50) + 1
  const xpCurrentLevel = totalXp % 50
  const xpNextLevel = 50
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / xpNextLevel) * 100))

  const rankTitles = [
    'Recruta Gamer',
    'Aventureiro 8-Bit',
    'Cavaleiro do Console',
    'Mestre dos Jogos',
    'Lenda dos Games',
  ]
  const currentRank = rankTitles[Math.min(level - 1, rankTitles.length - 1)]

  // Only rewards are visible to Gael in Kid Mode
  const rewardTasks = tasks.filter((t) => t.category !== 'resgate' && t.minutes_reward > 0)

  const handleTaskClick = (task: TaskTemplate) => {
    sounds.playReward()
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#8b5cf6', '#10b981', '#f59e0b'],
    })
    onMarkTaskDone(task)
  }

  const handleStartGame = () => {
    sounds.playRedeem()
    setShowStartModal(false)
    onStartGameSession(chosenMinutes)
  }

  return (
    <div className="space-y-4 pb-24 animate-fade-in relative">
      {/* 1. Header do Jogador (Gael Profile, Avatar, XP) */}
      <div className="gamer-card rounded-3xl p-4 border border-surface-border/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gamer-purple/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3">
          {/* Avatar Icon */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAvatarPicker(true)}
              className={`relative p-3 rounded-2xl bg-gradient-to-tr ${currentAvatar.color} text-white shadow-lg border border-white/20 active:scale-95 transition-all group`}
              title="Trocar Avatar do Gael"
            >
              <span className="text-3xl leading-none block">{currentAvatar.emoji}</span>
              <span className="absolute -bottom-1 -right-1 text-[9px] bg-slate-950 px-1 rounded-md text-emerald-400 font-bold border border-slate-700">
                Mudar
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-gamer font-bold text-xl text-white tracking-wider">
                  QG DO GAEL
                </h2>
                <span className="px-2 py-0.5 rounded-lg bg-gamer-purple/30 text-gamer-purple-light text-[10px] font-bold border border-gamer-purple/50">
                  Nível {level}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {currentRank}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>Progresso para Nível {level + 1}</span>
            <span className="text-gamer-green-light font-mono">
              {xpCurrentLevel} / {xpNextLevel} XP
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gamer-purple to-gamer-green transition-all duration-500 shadow-glow-green"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Interactive Mini-Features: Roleta da Sorte & Troféus */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Roleta da Sorte Button */}
        <button
          onClick={() => setShowLuckyWheel(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border border-amber-500/50 hover:border-amber-400 shadow-glow-amber text-left flex items-center gap-2.5 active:scale-95 transition-all group"
        >
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:rotate-45 transition-transform">
            <Gift className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-gamer font-bold text-xs text-amber-300 leading-tight">
              ROLETA DA SORTE 🎰
            </h4>
            <span className="text-[10px] text-slate-400">Girar e Ganhar!</span>
          </div>
        </button>

        {/* Mural de Troféus Button */}
        <button
          onClick={() => setShowAchievements(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/50 hover:border-purple-400 shadow-glow-purple text-left flex items-center gap-2.5 active:scale-95 transition-all group"
        >
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-gamer font-bold text-xs text-purple-300 leading-tight">
              MEUS TROFÉUS 🏆
            </h4>
            <span className="text-[10px] text-slate-400">Mural Gamer</span>
          </div>
        </button>
      </div>

      {/* 2. Mostrador Gigante de Minutos (Bateria de Game) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900 to-indigo-950/60 border-2 border-gamer-purple/50 p-6 text-center shadow-glow-purple">
        <div className="space-y-1">
          <span className="text-xs font-gamer uppercase tracking-widest text-slate-400 font-bold flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-gamer-green animate-pulse" />
            Bateria de Jogo Disponível
          </span>

          <div className="flex items-center justify-center gap-2 py-2">
            <span className="font-gamer font-bold text-6xl md:text-7xl text-white tracking-tight drop-shadow-md">
              {balance}
            </span>
            <span className="font-gamer text-2xl font-bold text-gamer-green">
              MIN
            </span>
          </div>

          <p className="text-xs font-medium text-slate-300 max-w-xs mx-auto">
            {balance > 0
              ? '🎮 Seu tempo está liberado! Você pode jogar agora ou cumprir missões para acumular mais!'
              : '⚡ Sua bateria de jogo acabou! Cumpra missões abaixo para recarregar seus minutos.'}
          </p>
        </div>

        {/* 3. BOTÃO CENTRAL: COMEÇAR A JOGAR AGORA */}
        <div className="pt-4">
          <button
            onClick={() => {
              setChosenMinutes(Math.min(30, balance))
              setShowStartModal(true)
            }}
            disabled={balance <= 0}
            className={`w-full py-4 px-6 rounded-2xl font-gamer font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-2xl transition-all ${
              balance > 0
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-gamer-green hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-glow-green active:scale-95 border border-emerald-300'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span>
              {balance > 0 ? '▶️ COMEÇAR A JOGAR AGORA' : 'BATERIA VAZIA - FAÇA MISSÕES'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Lista Visual de Missões Disponíveis ("Missões para Ganhar Mais Tempo") */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-gamer font-bold text-base text-white tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-4 rounded bg-gamer-green" />
              MISSÕES PARA GANHAR TEMPO 🚀
            </h3>
            <p className="text-xs text-slate-400">
              Cumpra as tarefas na vida real e toque no botão para avisar o Papai e a Mamãe!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {rewardTasks.map((task) => {
            const isPending = pendingTasks.some((p) => p.template_id === task.id)

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-amber-950/40 border-amber-500/50 shadow-md'
                    : 'gamer-card border-slate-800 hover:border-gamer-purple/60 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl border ${
                        isPending
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-emerald-400 border-slate-700'
                      }`}
                    >
                      <DynamicIcon name={task.icon} className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          +{task.minutes_reward} Minutos de Game!
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isPending ? (
                      <span className="px-3 py-2 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/60 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Aguardando Pais...</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTaskClick(task)}
                        className="py-2.5 px-3.5 rounded-xl bg-gamer-purple hover:bg-purple-600 text-white font-bold text-xs shadow-glow-purple active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span>Marcar como Feito! 🚀</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Pixel Pet Companion */}
      <PixelPetCompanion />

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-surface border border-surface-border rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="font-gamer font-bold text-lg text-white text-center">
              ESCOLHA SEU AVATAR, GAEL!
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    onChangeAvatar(av.id)
                    sounds.playReward()
                    setShowAvatarPicker(false)
                  }}
                  className={`p-3 rounded-2xl flex items-center gap-3 border transition-all ${
                    currentAvatarId === av.id
                      ? 'bg-gamer-purple/20 border-gamer-purple text-white shadow-glow-purple'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-3xl">{av.emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm text-white">{av.name}</p>
                    <span className="text-[10px] text-slate-400">Gamer Nível {level}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Escolher Tempo da Sessão */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
              <Gamepad2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-gamer font-bold text-lg text-white">
                HORA DE JOGAR, GAEL!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Quanto tempo você quer jogar nesta sessão?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[15, 30, 45, balance].map((m, idx) => {
                if (idx === 3 && [15, 30, 45].includes(balance)) return null
                const isPossible = balance >= m
                const isSelected = chosenMinutes === m

                return (
                  <button
                    key={`${m}-${idx}`}
                    disabled={!isPossible}
                    onClick={() => setChosenMinutes(m)}
                    className={`p-3 rounded-2xl font-bold text-xs border transition-all ${
                      isSelected
                        ? 'bg-gamer-green text-slate-950 border-emerald-400 shadow-glow-green font-extrabold'
                        : isPossible
                        ? 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {idx === 3 ? `Tudo (${m}m)` : `${m} Minutos`}
                  </button>
                )
              })}
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleStartGame}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-gamer font-bold text-sm shadow-glow-green active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>INICIAR CRONÔMETRO ({chosenMinutes} MIN)</span>
              </button>
              <button
                onClick={() => setShowStartModal(false)}
                className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={showLuckyWheel}
        onClose={() => setShowLuckyWheel(false)}
        onWinPrize={onWinRoulettePrize}
      />

      {/* Achievements Showcase Modal */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        userXp={totalXp}
        totalMinutes={balance}
      />
    </div>
  )
}
