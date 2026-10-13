import React from 'react'
import { AppMode } from '../types'
import { Gamepad2, ShieldCheck, Lock, Sparkles } from 'lucide-react'

interface ModeSwitchHeaderProps {
  currentMode: AppMode
  onSelectKidMode: () => void
  onRequestParentMode: () => void
  pendingCount?: number
}

export const ModeSwitchHeader: React.FC<ModeSwitchHeaderProps> = ({
  currentMode,
  onSelectKidMode,
  onRequestParentMode,
  pendingCount = 0,
}) => {
  return (
    <div className="w-full bg-slate-950/80 border-b border-slate-800/80 px-4 py-2 backdrop-blur-md">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Toggle Mode Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 w-full justify-between">
          <button
            onClick={onSelectKidMode}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              currentMode === 'kid'
                ? 'bg-gradient-to-r from-gamer-purple to-indigo-600 text-white shadow-glow-purple border border-purple-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>Sou o Gael 🎮</span>
          </button>

          <button
            onClick={onRequestParentMode}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
              currentMode === 'parent'
                ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Área dos Pais 🔒</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-2" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
