import React, { useState } from 'react'
import { TaskTemplate, TaskCategory } from '../types'
import { DynamicIcon } from './DynamicIcon'
import { Plus, ShieldAlert, Sparkles, BookOpen, Home, CheckCircle2, AlertOctagon } from 'lucide-react'

interface QuickMissionsGridProps {
  tasks: TaskTemplate[]
  onExecuteTask: (task: TaskTemplate) => void
  onOpenCreateTask: () => void
  disabled?: boolean
}

type FilterCategory = 'all' | 'rotina' | 'casa' | 'escola' | 'penalidade'

export const QuickMissionsGrid: React.FC<QuickMissionsGridProps> = ({
  tasks,
  onExecuteTask,
  onOpenCreateTask,
  disabled = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')

  const filterTabs: { id: FilterCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todas', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'rotina', label: 'Rotina & Banho', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'casa', label: 'Casa', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'escola', label: 'Estudos', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'penalidade', label: '⚠️ Alertas', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> },
  ]

  // Filter tasks, excluding 'resgate' which is featured on the hero card
  const filteredTasks = tasks.filter((t) => {
    if (t.category === 'resgate') return false
    if (activeCategory === 'all') return true
    return t.category === activeCategory
  })

  // Group or sort tasks: rewards first, penalties at bottom or by category
  const rewardTasks = filteredTasks.filter((t) => t.minutes_reward > 0)
  const penaltyTasks = filteredTasks.filter((t) => t.minutes_reward < 0)

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-gamer font-bold text-base text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-4 rounded bg-gamer-green" />
            MISSÕES & AÇÕES (1 TOQUE)
          </h3>
          <p className="text-xs text-slate-400">
            Toque para creditar recompensa ou aplicar penalidade imediatamente
          </p>
        </div>
        <button
          onClick={onOpenCreateTask}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Nova Missão Personalizada"
        >
          <Plus className="w-3.5 h-3.5 text-gamer-green" />
          <span className="text-[11px] pr-1">Criar</span>
        </button>
      </div>

      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {filterTabs.map((tab) => {
          const isSelected = activeCategory === tab.id
          const isPenaltyTab = tab.id === 'penalidade'

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? isPenaltyTab
                    ? 'bg-rose-950/80 text-rose-200 border-rose-500 shadow-glow-rose'
                    : 'bg-gamer-purple/20 text-gamer-purple-light border-gamer-purple shadow-glow-purple'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Rewards Grid */}
      {rewardTasks.length > 0 && (
        <div className="space-y-1.5">
          {activeCategory === 'all' && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Missões Cumpridas (+ Minutos)
            </span>
          )}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
            {rewardTasks.map((task) => {
              return (
                <button
                  key={task.id}
                  disabled={disabled}
                  onClick={() => onExecuteTask(task)}
                  className="group relative text-left p-3.5 rounded-2xl gamer-card hover:bg-slate-800/80 border border-slate-800 hover:border-gamer-green/60 shadow-md gamer-card-interactive flex items-center justify-between gap-3 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-emerald-950/60 text-emerald-400 border border-slate-700/80 group-hover:border-emerald-500/40 shadow-sm shrink-0 transition-colors">
                      <DynamicIcon name={task.icon} className="w-5 h-5 text-gamer-green group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs md:text-sm text-slate-100 group-hover:text-white leading-snug">
                        {task.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {task.category}
                      </span>
                    </div>
                  </div>

                  {/* Reward Badge */}
                  <div className="shrink-0 px-2.5 py-1 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono shadow-sm group-hover:shadow-glow-green transition-shadow">
                    +{task.minutes_reward}m
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Penalties Grid */}
      {penaltyTasks.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {activeCategory === 'all' && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <AlertOctagon className="w-3 h-3" />
              Alertas & Penalidades (- Minutos)
            </span>
          )}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
            {penaltyTasks.map((task) => {
              return (
                <button
                  key={task.id}
                  disabled={disabled}
                  onClick={() => onExecuteTask(task)}
                  className="group relative text-left p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-900/50 hover:border-rose-500/70 hover:bg-rose-950/60 shadow-md gamer-card-interactive flex items-center justify-between gap-3 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/60 group-hover:border-rose-500/60 shadow-sm shrink-0 transition-colors">
                      <DynamicIcon name={task.icon} className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs md:text-sm text-rose-100 group-hover:text-white leading-snug">
                        {task.title}
                      </h4>
                      <span className="text-[10px] text-rose-400/80 font-medium">
                        Penalidade
                      </span>
                    </div>
                  </div>

                  {/* Penalty Badge */}
                  <div className="shrink-0 px-2.5 py-1 rounded-xl bg-rose-950/90 text-rose-300 border border-rose-500/50 text-xs font-bold font-mono shadow-sm group-hover:shadow-glow-rose transition-shadow">
                    {task.minutes_reward}m
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
