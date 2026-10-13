import React, { useState } from 'react'
import { Trophy, Award, X, Sparkles, CheckCircle2, Lock } from 'lucide-react'
import { sounds } from '../lib/sound'

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  userXp: number
  totalMinutes: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  isUnlocked: boolean
  rarity: 'Comum' | 'Rara' | 'Épica' | 'Lendária'
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  userXp,
  totalMinutes,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null)

  if (!isOpen) return null

  const achievements: Achievement[] = [
    {
      id: 'a1',
      title: 'Primeiro Passo Gamer',
      description: 'Começou a jornada de missões no GameTime!',
      icon: '🎮',
      isUnlocked: true,
      rarity: 'Comum',
    },
    {
      id: 'a2',
      title: 'Cama Lendária',
      description: 'Cumpriu a missão de arrumar a cama e ganhou tempo!',
      icon: '🛏️',
      isUnlocked: true,
      rarity: 'Rara',
    },
    {
      id: 'a3',
      title: 'Gênio da Leitura',
      description: 'Fez o dever de casa e leitura com foco total!',
      icon: '📚',
      isUnlocked: userXp >= 100,
      rarity: 'Rara',
    },
    {
      id: 'a4',
      title: 'Mestre da Espuma',
      description: 'Tomou banho sem enrolar e sem reclamar!',
      icon: '🧼',
      isUnlocked: true,
      rarity: 'Comum',
    },
    {
      id: 'a5',
      title: 'Ninja do Desligamento',
      description: 'Desligou o console exatamente na hora que o alarme tocou!',
      icon: '⚡',
      isUnlocked: userXp >= 150,
      rarity: 'Épica',
    },
    {
      id: 'a6',
      title: 'Bateria Turbinada',
      description: 'Acumulou mais de 60 minutos de videogame por mérito!',
      icon: '🔋',
      isUnlocked: totalMinutes >= 60,
      rarity: 'Épica',
    },
    {
      id: 'a7',
      title: 'Mestre dos Jogos (Nível 5)',
      description: 'Alcançou mais de 250 pontos de XP no jogo da vida!',
      icon: '🌟',
      isUnlocked: userXp >= 250,
      rarity: 'Lendária',
    },
    {
      id: 'a8',
      title: 'Filho Campeão',
      description: 'Orgulho do Papai e da Mamãe!',
      icon: '👑',
      isUnlocked: userXp >= 200,
      rarity: 'Lendária',
    },
  ]

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length

  const handleSelect = (ach: Achievement) => {
    setSelectedBadge(ach)
    if (ach.isUnlocked) {
      sounds.playReward()
    } else {
      sounds.playPenalty()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-surface-border rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gamer font-bold text-base text-white">
                MURAL DE TROFÉUS DO GAEL
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {unlockedCount} de {achievements.length} Troféus Desbloqueados 🏆
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-2.5 overflow-y-auto p-1 flex-1">
          {achievements.map((ach) => (
            <button
              key={ach.id}
              onClick={() => handleSelect(ach)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                ach.isUnlocked
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-md hover:border-amber-400'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl filter drop-shadow">{ach.icon}</span>
                {ach.isUnlocked ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-green" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              <div>
                <h4 className="font-bold text-xs text-white leading-tight">
                  {ach.title}
                </h4>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                    ach.rarity === 'Lendária'
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                      : ach.rarity === 'Épica'
                      ? 'bg-purple-950 text-purple-300 border border-purple-600/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ach.rarity}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Details Footer */}
        {selectedBadge && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 animate-fade-in text-center space-y-1">
            <p className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <span>{selectedBadge.icon}</span>
              <span>{selectedBadge.title}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {selectedBadge.description}
            </p>
            <span
              className={`text-[10px] font-bold inline-block px-2 py-0.5 rounded-full ${
                selectedBadge.isUnlocked
                  ? 'bg-emerald-950 text-emerald-300'
                  : 'bg-rose-950 text-rose-300'
              }`}
            >
              {selectedBadge.isUnlocked ? '✅ Conquistado!' : '🔒 Bloqueado (Cumpra missões para liberar)'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
