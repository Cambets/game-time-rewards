import React, { useEffect, useState, useRef } from 'react'
import { ActiveGameSession } from '../types'
import { Timer, Pause, Play, Plus, X, Volume2, BellRing, BellOff } from 'lucide-react'
import { sounds } from '../lib/sound'

interface ActiveTimerCardProps {
  session: ActiveGameSession
  onStop: () => void
  onAddMinutes: (mins: number) => void
  onTimeUp: () => void
}

export const ActiveTimerCard: React.FC<ActiveTimerCardProps> = ({
  session,
  onStop,
  onAddMinutes,
  onTimeUp,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const fromEndTime = Math.max(0, Math.floor((session.endTime - Date.now()) / 1000))
    return fromEndTime || session.remainingSeconds
  })
  const [isPaused, setIsPaused] = useState(false)
  const alarmTriggeredRef = useRef(false)

  // Keep countdown aligned with real wall clock endTime
  useEffect(() => {
    const fromEndTime = Math.max(0, Math.floor((session.endTime - Date.now()) / 1000))
    setSecondsLeft(fromEndTime)
    if (fromEndTime > 0) {
      alarmTriggeredRef.current = false
      sounds.stopAlarm()
    }
  }, [session.endTime])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((session.endTime - now) / 1000))
      setSecondsLeft(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        if (!alarmTriggeredRef.current) {
          alarmTriggeredRef.current = true
          sounds.startAlarm()
          sounds.notifyTimeUp('Gael')
          onTimeUp()
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, session.endTime, onTimeUp])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isTimeUp = secondsLeft === 0

  const handleStop = () => {
    sounds.stopAlarm()
    onStop()
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-xl transition-all ${
        isTimeUp
          ? 'bg-rose-950 border-rose-500 shadow-glow-rose animate-pulse'
          : 'bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-gamer-purple/60 shadow-glow-purple'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl ${
              isTimeUp ? 'bg-rose-500 text-white animate-bounce' : 'bg-gamer-purple/20 text-gamer-purple-light'
            }`}
          >
            {isTimeUp ? (
              <BellRing className="w-5 h-5 text-white" />
            ) : (
              <Timer className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            )}
          </div>
          <div>
            <h4 className="font-gamer font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
              <span>SESSÃO DE JOGO:</span>
              <span className="text-gamer-green-light">GAEL</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              {isTimeUp ? '🚨 ALARME DISPARADO! HORA DE DESLIGAR!' : 'Cronômetro ativo sincronizado'}
            </p>
          </div>
        </div>

        <button
          onClick={handleStop}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Encerrar sessão"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        {/* Countdown */}
        <div className="flex items-baseline gap-2">
          <span
            className={`font-gamer font-bold text-3xl md:text-4xl tracking-wider font-mono ${
              isTimeUp ? 'text-white drop-shadow-md' : 'text-emerald-400 drop-shadow-md'
            }`}
          >
            {formattedTime}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            {isTimeUp ? '🚨 ESGOTADO' : isPaused ? '(Pausado)' : 'restantes'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {isTimeUp ? (
            <button
              onClick={handleStop}
              className="py-2 px-3 rounded-xl text-xs font-gamer font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose flex items-center gap-1.5"
            >
              <BellOff className="w-4 h-4" />
              <span>Desligar Alarme</span>
            </button>
          ) : (
            <>
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
                onClick={handleStop}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 transition-colors"
              >
                Parar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
