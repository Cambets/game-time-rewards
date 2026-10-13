import React, { useState } from 'react'
import { Sparkles, Trophy, X, Zap, Gift, RotateCcw, Lock, Ticket } from 'lucide-react'
import { sounds } from '../lib/sound'
import confetti from 'canvas-confetti'

interface LuckyWheelModalProps {
  isOpen: boolean
  onClose: () => void
  spinsAvailable: number
  onWinPrize: (minutes: number, xp: number, prizeTitle: string) => void
}

interface Sector {
  label: string
  minutes: number
  xp: number
  color: string
  icon: string
}

const SECTORS: Sector[] = [
  { label: '+5 MIN', minutes: 5, xp: 20, color: '#10b981', icon: '⚡' },
  { label: '+10 MIN', minutes: 10, xp: 40, color: '#8b5cf6', icon: '🎮' },
  { label: '+50 XP!', minutes: 0, xp: 50, color: '#06b6d4', icon: '⭐' },
  { label: '+15 MIN BÔNUS!', minutes: 15, xp: 60, color: '#f59e0b', icon: '👑' },
  { label: '+5 MIN', minutes: 5, xp: 20, color: '#ec4899', icon: '🚀' },
  { label: '+20 MIN JACKPOT!', minutes: 20, xp: 100, color: '#a855f7', icon: '🏆' },
]

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  spinsAvailable,
  onWinPrize,
}) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonSector, setWonSector] = useState<Sector | null>(null)

  if (!isOpen) return null

  const canSpin = spinsAvailable > 0 && !isSpinning

  const handleSpin = () => {
    if (!canSpin) return

    setIsSpinning(true)
    setWonSector(null)

    // Pick random sector
    const winningIndex = Math.floor(Math.random() * SECTORS.length)
    const sectorAngle = 360 / SECTORS.length

    // Target angle (multiple full 360 spins + landing sector)
    const baseSpins = 360 * 5 // 5 full spins
    const targetAngle = baseSpins + (360 - (winningIndex * sectorAngle + sectorAngle / 2))

    setRotation(targetAngle)

    // Play tick intervals
    let tickCount = 0
    const tickInterval = setInterval(() => {
      sounds.playWheelTick()
      tickCount++
      if (tickCount > 25) clearInterval(tickInterval)
    }, 120)

    // Finish spinning after 3.2s
    setTimeout(() => {
      clearInterval(tickInterval)
      setIsSpinning(false)
      const prize = SECTORS[winningIndex]
      setWonSector(prize)

      // Celebration
      sounds.playStarPower()
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4'],
      })

      onWinPrize(prize.minutes, prize.xp, prize.label)
    }, 3200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up text-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-8" />
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🎰</span>
            <h3 className="font-gamer font-bold text-lg text-white">
              ROLETA DA SORTE DO GAEL
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSpinning}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status: Spins available or locked by parents */}
        <div className="flex justify-center">
          {spinsAvailable > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono animate-pulse">
              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
              <span>{spinsAvailable} Giro(s) Liberado(s) pelo Papai/Mamãe! 🎟️</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Roleta Bloqueada pelos Pais</span>
            </div>
          )}
        </div>

        {spinsAvailable <= 0 && !wonSector && (
          <p className="text-xs text-amber-300/90 font-medium px-2 leading-relaxed bg-amber-950/30 p-2 rounded-xl border border-amber-500/30">
            Cumpra suas missões em casa! O Papai ou a Mamãe liberam giros extras para você quando você for um bom filho!
          </p>
        )}

        {/* Wheel Graphic */}
        <div className="relative mx-auto w-56 h-56 my-3 flex items-center justify-center">
          {/* Wheel Pointer Triangle */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-md" />

          {/* Rotating Wheel Container */}
          <div
            className={`w-full h-full rounded-full border-4 shadow-2xl relative overflow-hidden transition-transform duration-[3200ms] cubic-bezier(0.15, 0.9, 0.2, 1) ${
              spinsAvailable > 0 ? 'border-amber-400/90' : 'border-slate-700 opacity-60'
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              background: 'conic-gradient(#10b981 0deg 60deg, #8b5cf6 60deg 120deg, #06b6d4 120deg 180deg, #f59e0b 180deg 240deg, #ec4899 240deg 300deg, #a855f7 300deg 360deg)',
            }}
          >
            {/* Sector Labels */}
            {SECTORS.map((s, idx) => {
              const angle = idx * 60 + 30
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-start justify-center pt-3 pointer-events-none"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span className="font-gamer font-extrabold text-[11px] text-white drop-shadow-md tracking-wider">
                    {s.icon} {s.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Center Hub */}
          <div className="absolute z-10 w-16 h-16 rounded-full bg-slate-950 border-4 border-amber-400 flex items-center justify-center shadow-lg">
            <span className="font-gamer font-bold text-xs text-amber-400 tracking-wider">
              {spinsAvailable > 0 ? 'GAEL' : '🔒'}
            </span>
          </div>
        </div>

        {/* Won Prize Announcement */}
        {wonSector && (
          <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/60 animate-scale-up space-y-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              PARABÉNS, GAEL! VOCÊ GANHOU:
            </span>
            <p className="font-gamer font-extrabold text-xl text-white">
              {wonSector.icon} {wonSector.label}
            </p>
            {wonSector.minutes > 0 && (
              <p className="text-xs text-emerald-400 font-bold">
                +{wonSector.minutes} Minutos adicionados à sua bateria!
              </p>
            )}
          </div>
        )}

        {/* Spin Action */}
        <div className="pt-2">
          {spinsAvailable > 0 ? (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 rounded-2xl font-gamer font-bold text-base shadow-glow-amber transition-all flex items-center justify-center gap-2 ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-95'
              }`}
            >
              <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'GIRANDO A ROLETA...' : 'GIRAR A ROLETA! 🎰 (1 Giro)'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Peça ao Papai ou Mamãe para Liberar um Giro 🎟️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
