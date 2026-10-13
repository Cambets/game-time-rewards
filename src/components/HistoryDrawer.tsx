import React from 'react'
import { BalanceLog } from '../types'
import { History, RotateCcw, Clock, ArrowUpRight, ArrowDownLeft, X, ShieldAlert } from 'lucide-react'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  logs: BalanceLog[]
  profileName: string
  onUndoLog: (logId: string) => void
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  profileName,
  onUndoLog,
}) => {
  if (!isOpen) return null

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-surface border border-surface-border rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gamer-purple/20 text-gamer-purple-light border border-gamer-purple/40">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gamer font-bold text-base text-white">
                HISTÓRICO & AUDITORIA
              </h3>
              <p className="text-xs text-slate-400">
                Registros de {profileName} (quem adicionou e quando)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of logs */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-800/60">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Nenhum registro ainda hoje.</p>
              <p className="text-xs mt-1">Cumpra missões para gerar logs no banco.</p>
            </div>
          ) : (
            logs.map((log) => {
              const isPositive = log.minutes_applied > 0
              return (
                <div
                  key={log.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border shrink-0 ${
                        isPositive
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-950/50 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-slate-200 leading-tight">
                        {log.task_title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                            log.recorded_by === 'Pai'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                              : 'bg-pink-950 text-pink-300 border border-pink-800/40'
                          }`}
                        >
                          {log.recorded_by === 'Pai' ? '🧔 Pai' : '👩 Mãe'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDate(log.created_at)} {formatTime(log.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`font-mono text-xs md:text-sm font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? `+${log.minutes_applied}` : log.minutes_applied} min
                    </span>

                    {/* Undo button */}
                    <button
                      onClick={() => onUndoLog(log.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Desfazer lançamento"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-surface-border text-center">
          <p className="text-[11px] text-slate-400">
            Total de {logs.length} ações registradas no banco de dados.
          </p>
        </div>
      </div>
    </div>
  )
}
