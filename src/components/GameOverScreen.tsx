import React, { useEffect, useState } from 'react'
import { Skull, Lock, Sparkles, Volume2, ArrowRight, ShieldCheck, Gamepad2, BatteryWarning } from 'lucide-react'
import { sounds } from '../lib/sound'
import { PinModal } from './PinModal'

interface GameOverScreenProps {
  onUnlockSuccess: () => void
  onGoToMissions: () => void
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  onUnlockSuccess,
  onGoToMissions,
}) => {
  const [showPinModal, setShowPinModal] = useState(false)

  useEffect(() => {
    // Play authentic 8-bit NES Game Over tune
    sounds.playGameOver()
    sounds.notifyTimeUp('Gael')

    // Continuous alert chime if desired
    const timer = setTimeout(() => {
      sounds.startAlarm()
    }, 2500)

    return () => {
      clearTimeout(timer)
      sounds.stopAlarm()
    }
  }, [])

  const handleParentUnlock = () => {
    sounds.stopAlarm()
    setShowPinModal(false)
    onUnlockSuccess()
  }

  const handleMissionsClick = () => {
    sounds.stopAlarm()
    onGoToMissions()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white select-none animate-fade-in overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-500/50 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <BatteryWarning className="w-4 h-4 animate-pulse" />
          <span>Bateria Esgotada</span>
        </div>

        {/* Parent Unlock Action */}
        <button
          onClick={() => setShowPinModal(true)}
          className="py-1.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          title="Desbloquear com senha dos pais"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Desbloqueio Pais</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto w-full text-center space-y-6 my-auto py-8">
        {/* Animated Skull/Gamer Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center animate-bounce shadow-glow-rose">
          <Skull className="w-14 h-14 text-rose-400" />
          <div className="absolute inset-0 rounded-3xl bg-rose-500/20 animate-ping pointer-events-none" />
        </div>

        <div className="space-y-2">
          <h1 className="font-gamer font-bold text-3xl xs:text-4xl md:text-5xl text-white tracking-wider drop-shadow-lg">
            🚫 GAME OVER, GAEL!
          </h1>
          <p className="text-sm md:text-base text-rose-200/90 font-medium max-w-sm mx-auto leading-relaxed">
            Seu tempo de videogame acabou por hoje! Desligue o console e venha recarregar suas energias na vida real!
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-3 pt-4 max-w-sm mx-auto">
          {/* Mission Board Redirect */}
          <button
            onClick={handleMissionsClick}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-gamer-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-gamer font-bold text-sm shadow-glow-purple flex items-center justify-center gap-2.5 active:scale-95 transition-all border border-purple-400/40"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>VER MISSÕES PARA RECARREGAR TEMPO 🚀</span>
          </button>

          {/* Parents PIN unlock button */}
          <button
            onClick={() => setShowPinModal(true)}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center justify-center gap-2 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Papai / Mamãe: Liberar mais tempo com PIN</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center pb-2">
        <p className="text-xs text-slate-500 font-mono">
          Tela bloqueada até autorização dos pais.
        </p>
      </div>

      {/* Parent PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handleParentUnlock}
        title="Desbloquear Game Over 🔒"
        subtitle="Digite o PIN dos Pais para fechar o bloqueio ou conceder bônus"
      />
    </div>
  )
}
