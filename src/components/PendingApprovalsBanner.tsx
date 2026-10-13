import React, { useState } from 'react'
import { PendingTask } from '../types'
import { BellRing, Check, X, Sparkles, Heart, ThumbsUp, Flame } from 'lucide-react'

interface PendingApprovalsBannerProps {
  pendingTasks: PendingTask[]
  onApprove: (task: PendingTask, praise?: string) => void
  onReject: (task: PendingTask) => void
}

const PRAISES = [
  '👏 Mandou bem, campeão!',
  '❤️ Orgulho do Papai e da Mamãe!',
  '🔥 Jogou muito na vida real!',
  '⭐ Nota 10 pelo capricho!',
]

export const PendingApprovalsBanner: React.FC<PendingApprovalsBannerProps> = ({
  pendingTasks,
  onApprove,
  onReject,
}) => {
  const [selectedPraise, setSelectedPraise] = useState<Record<string, string>>({})

  if (pendingTasks.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border border-gamer-purple/60 rounded-3xl p-4 shadow-xl space-y-3 animate-scale-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gamer-purple/20 text-gamer-purple-light animate-bounce">
            <BellRing className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-gamer font-bold text-xs text-white flex items-center gap-1.5">
              <span>MISSÕES CONCLUÍDAS PELO GAEL!</span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] px-1.5 py-0.2 rounded-md font-mono">
                {pendingTasks.length} para aprovar
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              O Gael marcou que cumpriu as seguintes tarefas. Aprove para liberar os minutos:
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {task.task_title}
                </p>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  Recompensa: +{task.minutes_reward} min
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onApprove(task, selectedPraise[task.id] || PRAISES[0])}
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-glow-green active:scale-95 transition-all"
                  title="Aprovar e creditar minutos"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aprovar</span>
                </button>
                <button
                  onClick={() => onReject(task)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                  title="Recusar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Praise Selector */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/60">
              <span className="text-[9px] text-slate-500 shrink-0 font-medium">Elogio:</span>
              {PRAISES.map((praise) => {
                const isSelected = (selectedPraise[task.id] || PRAISES[0]) === praise
                return (
                  <button
                    key={praise}
                    onClick={() => setSelectedPraise((prev) => ({ ...prev, [task.id]: praise }))}
                    className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all border ${
                      isSelected
                        ? 'bg-purple-900/60 text-purple-200 border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {praise}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
