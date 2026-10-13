import React, { useState } from 'react'
import { Profile } from '../types'
import {
  Gamepad2,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Play,
  SlidersHorizontal,
  PlusCircle,
  Flame,
  CheckCircle2
} from 'lucide-react'

interface BalanceHeroCardProps {
  profile: Profile
  onQuickRedeem: (minutes: number, title?: string) => void
  onOpenCustomAdjust: () => void
  onStartSessionTimer: (minutes: number) => void
}

export const BalanceHeroCard: React.FC<BalanceHeroCardProps> = ({
  profile,
  onQuickRedeem,
  onOpenCustomAdjust,
  onStartSessionTimer,
}) => {
  const [showRedeemConfirm, setShowRedeemConfirm] = useState(false)
  const [selectedRedeemMinutes, setSelectedRedeemMinutes] = useState(30)

  const balance = profile.current_balance_minutes
  const dailyMax = profile.daily_max_minutes || 90
  const progressPercent = Math.min(100, Math.round((balance / dailyMax) * 100))

  // Determine badge and color based on balance
  const canPlay = balance >= 15
  const isCapped = balance >= dailyMax

  const handleConfirmRedeem = () => {
    onQuickRedeem(selectedRedeemMinutes, `🎮 Sessão de Jogo (-${selectedRedeemMinutes}m)`)
    onStartSessionTimer(selectedRedeemMinutes)
    setShowRedeemConfirm(false)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl gamer-card border border-surface-border/70 p-5 shadow-2xl transition-all">
      {/* Background ambient neon glow lights */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-gamer-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-gamer-green/15 rounded-full blur-3xl pointer-events-none" />

      {/* Profile Header & Daily Cap */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gamer-purple animate-ping" />
            Saldo Atual de {profile.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-gamer-cyan" />
          <span>Teto: {dailyMax} min/dia</span>
        </div>
      </div>

      {/* Main Big Balance Display */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="font-gamer font-bold text-5xl md:text-6xl text-white tracking-tight drop-shadow-md">
              {balance}
            </span>
            <span className="font-gamer text-xl md:text-2xl font-bold text-gamer-green">
              MIN
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400">
            {balance > 0 ? (
              <span className="text-gamer-green-light font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-gamer-green" />
                Tempo acumulado pronto para resgate
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Sem tempo disponível. Cumpra missões!
              </span>
            )}
          </p>
        </div>

        {/* Level / Gaming badge */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-purple-300 text-xs font-bold shadow-sm">
            <Flame className="w-3.5 h-3.5 text-gamer-amber" />
            <span>Nível {Math.max(1, Math.floor(balance / 20) + 1)}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {progressPercent}% do limite diário
          </p>
        </div>
      </div>

      {/* Progress Bar vs Daily Max */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span>Progresso diário</span>
          <span className={isCapped ? 'text-gamer-green font-bold' : 'text-slate-300'}>
            {balance} / {dailyMax} min {isCapped && '🏆 (Limite Alcançado)'}
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCapped
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-gamer-green shadow-glow-green'
                : balance > 30
                ? 'bg-gradient-to-r from-gamer-purple via-indigo-500 to-gamer-cyan shadow-glow-purple'
                : 'bg-gradient-to-r from-gamer-amber to-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action Buttons: Quick Redeem Game & Adjust */}
      {!showRedeemConfirm ? (
        <div className="grid grid-cols-1 xs:grid-cols-4 gap-2 pt-1">
          {/* Big Quick Game Redeem Button */}
          <button
            onClick={() => {
              setSelectedRedeemMinutes(Math.min(30, balance > 0 ? balance : 15))
              setShowRedeemConfirm(true)
            }}
            disabled={!canPlay}
            className={`xs:col-span-3 py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all ${
              canPlay
                ? 'bg-gradient-to-r from-gamer-purple via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple border border-purple-400/40 active:scale-[0.98]'
                : 'bg-slate-800/70 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            <Gamepad2 className="w-5 h-5 text-purple-200" />
            <span className="font-gamer tracking-wide">
              {canPlay ? '🎮 INICIAR JOGO (-30 MIN)' : 'MÍNIMO 15 MIN PARA JOGAR'}
            </span>
          </button>

          {/* Quick Adjust Button */}
          <button
            onClick={onOpenCustomAdjust}
            className="xs:col-span-1 py-3 px-3 rounded-2xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            title="Ajuste manual de minutos"
          >
            <SlidersHorizontal className="w-4 h-4 text-gamer-cyan" />
            <span className="xs:hidden">Ajustar Saldo</span>
          </button>
        </div>
      ) : (
        /* Inline Quick Redeem Confirmation & Slider Dialog */
        <div className="bg-slate-900/95 p-3.5 rounded-2xl border border-purple-500/50 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              Confirmar Sessão de Jogo
            </span>
            <span className="text-xs font-mono font-bold text-white bg-purple-950/80 px-2.5 py-0.5 rounded-lg border border-purple-700/50">
              -{selectedRedeemMinutes} min
            </span>
          </div>

          {/* Presets: 15m, 30m, 45m, 60m */}
          <div className="grid grid-cols-4 gap-1.5">
            {[15, 30, 45, 60].map((mins) => {
              const isAllowed = balance >= mins
              const isSelected = selectedRedeemMinutes === mins
              return (
                <button
                  key={mins}
                  disabled={!isAllowed}
                  onClick={() => setSelectedRedeemMinutes(mins)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-gamer-purple text-white border-purple-300 shadow-glow-purple'
                      : isAllowed
                      ? 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-800/30 text-slate-600 border-slate-800/50 cursor-not-allowed'
                  }`}
                >
                  {mins} min
                </button>
              )
            })}
          </div>

          {/* Confirm & Cancel Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowRedeemConfirm(false)}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-400 bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmRedeem}
              disabled={balance < selectedRedeemMinutes}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-glow-green border border-emerald-400/40 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Confirmar & Iniciar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
