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
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-5 bg-gradient-to-b from-[#131522] via-[#0c0d14] to-[#0c0d14] text-white select-none animate-fade-in overflow-y-auto">
      {/* Top Header (Stitch Screen 2) */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-gamer font-bold uppercase tracking-wider">
          <BatteryWarning className="w-3.5 h-3.5 text-rose-400" />
          <span>GAME OVER • TEMPO ESGOTADO</span>
        </div>

        {/* Parent Unlock Action */}
        <button
          onClick={() => setShowPinModal(true)}
          className="py-1.5 px-3 rounded-xl bg-[#131522] hover:bg-[#181b2c] text-slate-300 text-xs font-bold border border-[#23273e] flex items-center gap-1.5 transition-colors"
          title="Desbloquear com senha dos pais"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Zona dos Pais 🔒</span>
        </button>
      </div>

      {/* Main Content Area: Misión Cumplida */}
      <div className="max-w-md mx-auto w-full text-center space-y-4 my-auto py-4">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-gamer font-black text-3xl xs:text-4xl text-white tracking-wide drop-shadow-lg">
            MISSÃO CUMPRIDA! 🏆
          </h1>
          <p className="text-sm text-[#10e599] font-gamer font-bold flex items-center justify-center gap-1.5">
            <span>Grande aventura hoje, Gael! 🚀</span>
          </p>
        </div>

        {/* Recharge Card (Stitch Moon Container) */}
        <div className="gamer-card rounded-3xl p-5 border border-[#23273e] max-w-sm mx-auto space-y-3 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-900 to-purple-900 mx-auto flex items-center justify-center text-3xl border border-indigo-400/40 shadow-glow-purple">
            🌙
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-gamer font-bold text-amber-300 uppercase tracking-wider block">
              BATERIA EM MODO RECARGA
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Seus olhos e seu supercérebro precisam descansar para subir de nível amanhã!
            </p>
          </div>
        </div>

        {/* Daily Stats Summary (Stitch 3 Columns) */}
        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
          <div className="p-3 rounded-2xl bg-[#131522] border border-[#23273e]">
            <span className="text-lg block font-mono">⏱️</span>
            <span className="font-gamer font-bold text-base text-white block">45m</span>
            <span className="text-[9px] text-slate-400 uppercase font-medium">Jogados</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#131522] border border-[#23273e]">
            <span className="text-lg block font-mono">🎯</span>
            <span className="font-gamer font-bold text-base text-[#10e599] block">100%</span>
            <span className="text-[9px] text-slate-400 uppercase font-medium">Missões</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#131522] border border-[#23273e]">
            <span className="text-lg block font-mono">⭐</span>
            <span className="font-gamer font-bold text-base text-amber-300 block">+45m</span>
            <span className="text-[9px] text-slate-400 uppercase font-medium">Ganhos</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 max-w-sm mx-auto">
          {/* Mission Board Redirect */}
          <button
            onClick={handleMissionsClick}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#131522] hover:bg-[#181b2c] text-white font-gamer font-bold text-xs tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all border border-[#23273e] hover:border-purple-500/50"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>VER MISSÕES DE AMANHÃ 🚀</span>
          </button>

          {/* Parents PIN unlock button */}
          <button
            onClick={() => setShowPinModal(true)}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-slate-400 text-xs font-bold border border-slate-800 flex items-center justify-center gap-2 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Zona do Papai e Mamãe 🔒</span>
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
