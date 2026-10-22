import React from 'react'
import { AppMode } from '../types'
import { Gamepad2, ShieldCheck, Lock, Sparkles } from 'lucide-react'

interface ModeSwitchHeaderProps {
  currentMode: AppMode
  onSelectKidMode: () => void
  onRequestParentMode: () => void
  pendingCount?: number
  avatarImage?: string
  avatarEmoji?: string
  onOpenProfileSelect?: () => void
  currentAuthor?: 'Papai' | 'Mamãe'
  childName?: string
}

export const ModeSwitchHeader: React.FC<ModeSwitchHeaderProps> = ({
  currentMode,
  onSelectKidMode,
  onRequestParentMode,
  pendingCount = 0,
  avatarImage,
  avatarEmoji,
  onOpenProfileSelect,
  currentAuthor = 'Papai',
  childName = 'Gael',
}) => {
  return (
    <div className="w-full bg-[#0c0d14]/90 border-b border-[#23273e] px-4 py-2 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-md mx-auto space-y-1.5">
        {/* Brand bar */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <div className="relative">
              {avatarEmoji ? (
                <div className="w-7 h-7 rounded-full border border-purple-400/60 shadow-glow-purple bg-[#131522] flex items-center justify-center text-sm">
                  {avatarEmoji}
                </div>
              ) : (
                <img
                  src={avatarImage || '/images/gael-astronaut-avatar.png'}
                  alt="Gael Avatar"
                  className="w-7 h-7 rounded-full border border-purple-400/60 shadow-glow-purple object-cover"
                />
              )}
              <span className="w-2 h-2 rounded-full bg-[#10e599] absolute -bottom-0.5 -right-0.5 border border-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="font-gamer font-extrabold text-xs tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-[#10e599]">
                GAEL'S QUEST
              </h1>
            </div>
          </div>

          {/* Active Profile Pill / Switcher */}
          {onOpenProfileSelect ? (
            <button
              onClick={onOpenProfileSelect}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-white bg-[#131522] hover:bg-[#1b1e33] px-2.5 py-1 rounded-full border border-[#23273e] hover:border-purple-500/50 transition-all active:scale-95 group"
              title="Trocar quem está usando o app"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10e599]" />
              <span>
                {currentMode === 'kid' ? `${childName} 🚀` : currentAuthor === 'Papai' ? 'Papai 🧔' : 'Mamãe 👩'}
              </span>
              <span className="text-[9px] text-[#10e599] group-hover:underline font-mono">Trocar 🔄</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 bg-[#131522] px-2.5 py-0.5 rounded-full border border-[#23273e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10e599] animate-ping" />
              <span className="text-[#10e599]">NEO-ARCADE</span>
            </div>
          )}
        </div>

        {/* Toggle Mode Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131522] rounded-2xl border border-[#23273e] w-full justify-between shadow-inner">
          <button
            onClick={onSelectKidMode}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-gamer font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              currentMode === 'kid'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple border border-purple-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-[#10e599]" />
            <span>Sou o {childName} 🎮</span>
          </button>

          <button
            onClick={onRequestParentMode}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-gamer font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 relative ${
              currentMode === 'parent'
                ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Área dos Pais 🔒</span>
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute top-1 right-2" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
