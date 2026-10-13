import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'penalty' | 'info'
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        const isPenalty = toast.type === 'penalty'

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-2xl border backdrop-blur-md animate-scale-up ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/50 text-white shadow-emerald-950/40'
                : isPenalty
                ? 'bg-slate-900/95 border-rose-500/50 text-white shadow-rose-950/40'
                : 'bg-slate-900/95 border-purple-500/50 text-white shadow-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-lg ${
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isPenalty
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isPenalty ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-slate-400 mt-0.5">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
