import React from 'react'
import { sounds } from '../lib/sound'
import { Volume2, X, Sparkles, Coins, Zap, Trophy, ShieldAlert, Skull, Bot } from 'lucide-react'
import confetti from 'canvas-confetti'

interface GamerSoundboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const GamerSoundboardModal: React.FC<GamerSoundboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  const soundButtons = [
    {
      name: 'Moeda do Mario',
      desc: '+Minutos de Game',
      icon: Coins,
      color: 'from-amber-500 to-yellow-600',
      action: () => {
        sounds.playReward()
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } })
      },
    },
    {
      name: 'Cogumelo 1-Up',
      desc: 'Vida Extra & Bônus',
      icon: Sparkles,
      color: 'from-emerald-500 to-green-600',
      action: () => {
        sounds.play1Up()
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } })
      },
    },
    {
      name: 'Estrela Ninja',
      desc: 'Star Power da Roleta',
      icon: Zap,
      color: 'from-purple-500 to-indigo-600',
      action: () => {
        sounds.playStarPower()
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } })
      },
    },
    {
      name: 'Voz do Pet Pixel',
      desc: 'Mascote Companheiro',
      icon: Bot,
      color: 'from-cyan-500 to-blue-600',
      action: () => sounds.playPetReaction(),
    },
    {
      name: 'Aviso 5 Minutos',
      desc: 'Hora de Salvar o Game',
      icon: ShieldAlert,
      color: 'from-orange-500 to-amber-600',
      action: () => sounds.playWarningBeep(),
    },
    {
      name: 'Game Over Clássico',
      desc: 'Fim de Jogo Arcade',
      icon: Skull,
      color: 'from-rose-500 to-red-700',
      action: () => sounds.playGameOver(),
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-surface border border-surface-border rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gamer-purple/20 text-gamer-purple-light">
              <Volume2 className="w-5 h-5 text-gamer-purple-light" />
            </div>
            <div>
              <h3 className="font-gamer font-bold text-sm text-white">
                SOUNDBOARD RETRÔ 8-BIT 🎮
              </h3>
              <p className="text-[10px] text-slate-400">Toque para ouvir os efeitos sonoros do Mario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {soundButtons.map((btn) => {
            const Icon = btn.icon
            return (
              <button
                key={btn.name}
                onClick={btn.action}
                className={`p-3 rounded-2xl bg-gradient-to-tr ${btn.color} text-white shadow-lg active:scale-95 transition-all text-left flex flex-col justify-between h-24 border border-white/20`}
              >
                <Icon className="w-6 h-6 drop-shadow" />
                <div>
                  <p className="font-gamer font-bold text-xs leading-tight drop-shadow">
                    {btn.name}
                  </p>
                  <span className="text-[9px] text-white/80 font-medium">
                    {btn.desc}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
        >
          Fechar Soundboard
        </button>
      </div>
    </div>
  )
}
