import React, { useEffect, useState, useRef } from 'react'
import { ActiveGameSession } from '../types'
import { Timer, AlertTriangle, Bell, Pause, Play, Lock, Gamepad2, Volume2, Shield } from 'lucide-react'
import { sounds } from '../lib/sound'

interface GameSessionScreenProps {
  session: ActiveGameSession
  onTimeExpired: () => void
  onRequestEarlyExit: () => void
}

export const GameSessionScreen: React.FC<GameSessionScreenProps> = ({
  session,
  onTimeExpired,
  onRequestEarlyExit,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    return Math.max(0, Math.floor((session.endTime - Date.now()) / 1000))
  })
  const [isPaused, setIsPaused] = useState(false)
  const warning5mFired = useRef(false)
  const warning1mFired = useRef(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((session.endTime - Date.now()) / 1000))
      setSecondsLeft(remaining)

      // 5-minute warning sound
      if (remaining <= 300 && remaining > 0 && !warning5mFired.current) {
        warning5mFired.current = true
        sounds.playWarningBeep()
        if (navigator.vibrate) navigator.vibrate([100, 80, 100])
      }

      // 1-minute warning pulse
      if (remaining <= 60 && remaining > 0 && !warning1mFired.current) {
        warning1mFired.current = true
        sounds.playWarningBeep()
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      }

      // 00:00:00 -> Game Over
      if (remaining <= 0) {
        clearInterval(interval)
        onTimeExpired()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, session.endTime, onTimeExpired])

  // Formatting hh:mm:ss
  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Color dynamic based on remaining time
  const isLastMinute = secondsLeft <= 60
  const isLast10Minutes = secondsLeft <= 600 && !isLastMinute
  const isSafeZone = secondsLeft > 600

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 select-none transition-colors duration-700 ${
        isLastMinute
          ? 'bg-gradient-to-b from-rose-950 via-slate-950 to-rose-950 animate-pulse'
          : isLast10Minutes
          ? 'bg-gradient-to-b from-amber-950/90 via-slate-950 to-slate-950'
          : 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950'
      }`}
    >
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl border ${
              isLastMinute
                ? 'bg-rose-500 text-white border-rose-400 animate-bounce'
                : isLast10Minutes
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-gamer font-bold text-sm text-white tracking-wider">
              SESSÃO DE JOGO: GAEL
            </h3>
            <span className="text-[10px] text-slate-400">Modo Arcade Ativo</span>
          </div>
        </div>

        {/* Early exit with parents PIN */}
        <button
          onClick={onRequestEarlyExit}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Encerrar sessão (Requer PIN dos pais)"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Sair</span>
        </button>
      </div>

      {/* Center Hero Countdown */}
      <div className="max-w-md mx-auto w-full text-center space-y-6 my-auto">
        {/* Status Alert Badge */}
        <div>
          {isLastMinute ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600 text-white font-gamer font-bold text-xs uppercase tracking-wider shadow-glow-rose animate-bounce">
              <AlertTriangle className="w-4 h-4" />
              <span>ÚLTIMO MINUTO! SALVE AGORA!</span>
            </div>
          ) : isLast10Minutes ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-gamer font-bold text-xs uppercase tracking-wider animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>10 Minutos Restantes: Prepare-se para salvar!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-gamer font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Tempo de Game em Andamento</span>
            </div>
          )}
        </div>

        {/* GIGANTIC ARCADE TIMER */}
        <div className="py-4">
          <div
            className={`font-gamer font-bold text-6xl xs:text-7xl md:text-8xl tracking-wider font-mono drop-shadow-2xl transition-colors ${
              isLastMinute
                ? 'text-rose-400 animate-pulse'
                : isLast10Minutes
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {formattedTime}
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-2">
            Horas : Minutos : Segundos
          </p>
        </div>

        {/* Helpful Tips for Gael */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-xs mx-auto text-center space-y-1">
          <p className="text-xs font-semibold text-slate-200">
            {isLastMinute
              ? '🚨 Salve seu jogo agora para não perder o progresso!'
              : isLast10Minutes
              ? '⏰ Chegando perto do fim da fase ou da partida!'
              : '🎮 Aproveite seu momento de diversão!'}
          </p>
          <p className="text-[10px] text-slate-400">
            O alarme sonoro tocará automaticamente quando o tempo terminar.
          </p>
        </div>
      </div>

      {/* Bottom info */}
      <div className="max-w-md mx-auto w-full text-center">
        <p className="text-[11px] text-slate-500 font-medium">
          GameTime Rewards • Modo Tela Bloqueada com Alarme
        </p>
      </div>
    </div>
  )
}
