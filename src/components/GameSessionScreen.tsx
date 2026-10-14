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

  // Calculate circular progress percentage
  const totalSeconds = Math.max(1, session.totalMinutes * 60)
  const progressPercent = Math.min(100, Math.max(0, (secondsLeft / totalSeconds) * 100))

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-5 select-none transition-colors duration-700 overflow-y-auto ${
        isLastMinute
          ? 'bg-gradient-to-b from-rose-950 via-[#0c0d14] to-rose-950 animate-pulse'
          : isLast10Minutes
          ? 'bg-gradient-to-b from-amber-950/80 via-[#0c0d14] to-[#0c0d14]'
          : 'bg-gradient-to-b from-purple-950/50 via-[#0c0d14] to-[#0c0d14]'
      }`}
    >
      {/* Top Bar (Stitch Screen 3) */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pt-1">
        <button
          onClick={onRequestEarlyExit}
          className="p-2 rounded-xl bg-[#131522] hover:bg-[#181b2c] text-slate-300 text-xs font-bold border border-[#23273e] flex items-center gap-1.5 transition-colors"
          title="Encerrar sessão com PIN"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Sair (PIN)</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-[#161828] px-3 py-1 rounded-full border border-amber-500/40">
          <img src="/images/badge-star.png" alt="Star" className="w-4 h-4 object-contain" />
          <span>SESSÃO GAEL</span>
        </div>
      </div>

      {/* Center Hero: Circular Screen Timer (Stitch) */}
      <div className="max-w-md mx-auto w-full text-center space-y-4 my-auto py-2">
        {/* Active Console Chip */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10e599]/15 border border-[#10e599]/30 text-[#10e599] font-gamer font-bold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#10e599] animate-ping" />
            <span>SESSÃO DE JOGO ATIVA • CONECTADO</span>
          </div>
          <p className="text-xs font-gamer text-slate-400">
            🎮 Nintendo Switch / Games
          </p>
        </div>

        {/* Circular Ring Timer */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="84"
              className="stroke-[#181b2c]"
              strokeWidth="11"
              fill="transparent"
            />
            {/* Glowing countdown ring */}
            <circle
              cx="100"
              cy="100"
              r="84"
              className={`transition-all duration-1000 ease-linear ${
                isLastMinute
                  ? 'stroke-rose-500'
                  : isLast10Minutes
                  ? 'stroke-amber-400'
                  : 'stroke-[#10e599]'
              }`}
              strokeWidth="11"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 84}
              strokeDashoffset={2 * Math.PI * 84 * (1 - progressPercent / 100)}
              style={{
                filter: isLastMinute
                  ? 'drop-shadow(0 0 12px rgba(244, 63, 94, 0.8))'
                  : isLast10Minutes
                  ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))'
                  : 'drop-shadow(0 0 12px rgba(16, 229, 153, 0.8))',
              }}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] font-gamer font-bold tracking-widest text-slate-400 uppercase">
              TEMPO RESTANTE
            </span>
            <div
              className={`font-gamer font-black text-5xl md:text-6xl tracking-tight font-mono transition-colors drop-shadow-lg ${
                isLastMinute
                  ? 'text-rose-400 animate-pulse'
                  : isLast10Minutes
                  ? 'text-amber-400'
                  : 'text-white'
              }`}
            >
              {formattedTime}
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isLastMinute
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-bounce'
                : isLast10Minutes
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-[#10e599]/20 text-[#10e599] border border-[#10e599]/30'
            }`}>
              {isLastMinute ? '⚠️ Salve o jogo agora!' : isLast10Minutes ? '⏰ 10 minutos finais' : '🎮 Modo Seguro Ativo'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 max-w-xs mx-auto pt-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`w-full py-3.5 px-4 rounded-2xl font-gamer font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 ${
              isPaused
                ? 'bg-[#10e599] text-[#081a14] border-emerald-300 shadow-glow-mint'
                : 'bg-[#131522] hover:bg-[#181b2c] text-slate-200 border-[#23273e]'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? '▶️ RETOMAR TEMPO' : '⏸️ PAUSAR TEMPO'}</span>
          </button>

          {/* Friendly Tip Box (Stitch Advice Card) */}
          <div className="p-3.5 rounded-2xl bg-[#131522]/90 border border-[#23273e] text-left flex items-start gap-3 shadow-md">
            <span className="text-xl">💡</span>
            <div>
              <h5 className="font-gamer font-bold text-xs text-amber-300">
                Aviso Amigável para o Gael:
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                Te avisaremos com um som quando faltarem 5 minutos para você encontrar um ponto seguro e salvar sua partida!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="max-w-md mx-auto w-full text-center pb-1">
        <button
          onClick={onRequestEarlyExit}
          className="text-xs text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1 mx-auto"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Ajustes Parentais (Controle de Tempo)</span>
        </button>
      </div>
    </div>
  )
}
