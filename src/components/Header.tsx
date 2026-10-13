import React from 'react'
import { ParentAuthor, Profile } from '../types'
import { Gamepad2, Volume2, VolumeX, Database, Share2, Sparkles } from 'lucide-react'

interface HeaderProps {
  currentAuthor: ParentAuthor
  onSelectAuthor: (author: ParentAuthor) => void
  activeProfile: Profile | null
  soundEnabled: boolean
  onToggleSound: () => void
  onOpenSettings: () => void
  onOpenShare: () => void
  supabaseConnected: boolean
}

export const Header: React.FC<HeaderProps> = ({
  currentAuthor,
  onSelectAuthor,
  activeProfile,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenShare,
  supabaseConnected,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-border/60 pb-3 pt-3 px-4 shadow-lg">
      <div className="max-w-md mx-auto space-y-3">
        {/* Top Bar: Brand, Status & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-gradient-to-tr from-gamer-purple-dark to-slate-800 border border-gamer-purple/40 shadow-glow-purple">
              <Gamepad2 className="w-5 h-5 text-gamer-purple-light" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gamer-green animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-gamer font-bold text-lg text-white tracking-wider flex items-center gap-1">
                  GAMETIME<span className="text-gamer-purple-light">REWARDS</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Missões & Tempo de Jogo do Gael
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Share with Spouse Button */}
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-950/60 text-pink-300 border border-pink-500/40 hover:bg-pink-900/60 transition-colors"
              title="Compartilhar com Mamãe/Papai"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xs:inline">Esposa</span>
            </button>

            {/* Supabase Status Pill */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                supabaseConnected
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-slate-800/80 text-amber-400 border-amber-500/30 hover:bg-slate-700/80'
              }`}
              title="Configurações & Banco de Dados Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xs:inline">
                {supabaseConnected ? 'Ao Vivo' : 'Local'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-slate-800 text-purple-400 border-purple-500/30 hover:bg-slate-700'
                  : 'bg-slate-800/60 text-slate-500 border-slate-700 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Som Ativado' : 'Som Mudo'}
              aria-label="Alternar som"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Author Switcher: "Quem está registrando? [ Papai ] [ Mamãe ]" */}
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
          <span className="text-xs font-semibold text-slate-400 pl-2 select-none">
            Quem está registrando?
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSelectAuthor('Papai')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                currentAuthor === 'Papai'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🧔</span>
              <span>Papai</span>
            </button>
            <button
              onClick={() => onSelectAuthor('Mamãe')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                currentAuthor === 'Mamãe'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/40 border border-pink-400/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>👩</span>
              <span>Mamãe</span>
            </button>
          </div>
        </div>

        {/* Dedicated Child Header: GAEL */}
        {activeProfile && (
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-gradient-to-r from-gamer-purple/15 to-slate-900 border border-gamer-purple/30 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gamer-green shadow-glow-green" />
              <span className="font-gamer font-bold text-sm text-white tracking-wide">
                Gael
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                (Filho)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Saldo atual:</span>
              <span className="font-gamer font-bold text-xs text-gamer-green bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-lg font-mono">
                {activeProfile.current_balance_minutes} MIN
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
