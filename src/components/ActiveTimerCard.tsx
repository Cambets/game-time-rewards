import React, { useEffect, useState } from 'react'
import { ActiveGameSession } from '../types'
import { Timer, Pause, Play, Plus, X, Volume2, Flame } from 'lucide-react'
import { sounds } from '../lib/sound'

interface ActiveTimerCardProps {
  session: ActiveGameSession
  onStop: () => void
  onAddMinutes: (mins: number) => void
}

export const ActiveTimerCard: React.FC<ActiveTimerCardProps> = ({
  session,
  onStop,
  onAddMinutes,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(session.remainingSeconds)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    setSecondsLeft(session.remainingSeconds)
  }, [session.remainingSeconds])

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          sounds.playTimerAlert()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, secondsLeft])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isTimeUp = secondsLeft === 0

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-xl transition-all ${
        isTimeUp
          ? 'bg-rose-950/80 border-rose-500 shadow-glow-rose animate-pulse'
          : 'bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-gamer-purple/60 shadow-glow-purple'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isTimeUp ? 'bg-rose-500/20 text-rose-400' : 'bg-gamer-purple/20 text-gamer-purple-light'
            }`}
          >
            <Timer className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h4 className="font-gamer font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
              <span>SESSÃO EM ANDAMENTO:</span>
              <span className="text-gamer-green-light">{session.profileName}</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              {isTimeUp ? '🚨 TEMPO ESGOTADO! HORA DE DESLIGAR!' : 'Cronômetro ativo de videogame'}
            </p>
          </div>
        </div>

        <button
          onClick={onStop}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Encerrar sessão"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        {/* Big Countdown Timer */}
        <div className="flex items-baseline gap-2">
          <span
            className={`font-gamer font-bold text-3xl md:text-4xl tracking-wider font-mono ${
              isTimeUp ? 'text-rose-400' : 'text-emerald-400 drop-shadow-md'
            }`}
          >
            {formattedTime}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            {isPaused ? '(Pausado)' : 'restantes'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAddMinutes(5)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Adicionar mais 5 minutos de tolerância"
          >
            <Plus className="w-3.5 h-3.5 text-gamer-green" />
            <span>+5m</span>
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title={isPaused ? 'Continuar' : 'Pausar'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={onStop}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}
