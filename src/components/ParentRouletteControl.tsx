import React from 'react'
import { Profile, ParentAuthor } from '../types'
import { Gift, Sparkles, Lock, Unlock, Ticket, Plus, Ban } from 'lucide-react'
import { sounds } from '../lib/sound'

interface ParentRouletteControlProps {
  profile: Profile
  currentAuthor: ParentAuthor
  onGrantSpins: (count: number) => void
  onLockSpins?: () => void
}

export const ParentRouletteControl: React.FC<ParentRouletteControlProps> = ({
  profile,
  currentAuthor,
  onGrantSpins,
  onLockSpins,
}) => {
  const spins = profile.roulette_spins || 0
  const isUnlocked = spins > 0

  return (
    <div className={`p-4 rounded-3xl border transition-all shadow-xl relative overflow-hidden ${
      isUnlocked
        ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border-amber-500/60 shadow-glow-amber'
        : 'bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border-slate-800'
    }`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border transition-all ${
            isUnlocked
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <Gift className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-gamer font-bold text-sm text-white tracking-wide">
                ROLETA DA SORTE DO GAEL 🎰
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isUnlocked
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isUnlocked ? 'LIBERADA' : 'BLOQUEADA'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Você decide quando o Gael pode girar a roleta para ganhar minutos bônus.
            </p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs">
          {isUnlocked ? (
            <>
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Giros disponíveis agora:</span>
              <span className="font-gamer font-bold text-emerald-400 text-sm">
                {spins} {spins === 1 ? 'GIRO' : 'GIROS'}
              </span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-rose-400" />
              <span className="text-slate-400 font-medium">
                Gael está com a roleta travada até você liberar.
              </span>
            </>
          )}
        </div>

        {isUnlocked && onLockSpins && (
          <button
            onClick={onLockSpins}
            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center gap-1 transition-colors"
            title="Travar roleta e zerar giros do Gael"
          >
            <Ban className="w-3 h-3" />
            <span>Travar</span>
          </button>
        )}
      </div>

      {/* Action Buttons to Grant Spins */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onGrantSpins(1)}
          className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-gamer font-bold text-xs shadow-glow-amber active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>LIBERAR 1 GIRO 🎟️</span>
        </button>

        <button
          onClick={() => onGrantSpins(3)}
          className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-gamer font-bold text-xs shadow-glow-purple active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>BÔNUS: 3 GIROS 🎁</span>
        </button>
      </div>
    </div>
  )
}
