import React, { useState } from 'react'
import { X, UserPlus, Sparkles } from 'lucide-react'

interface AddProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, dailyMax: number) => void
}

export const AddProfileModal: React.FC<AddProfileModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('')
  const [dailyMax, setDailyMax] = useState<number | ''>(90)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const finalDailyMax = typeof dailyMax === 'number' && dailyMax > 0 ? dailyMax : 90
    onAdd(name.trim(), finalDailyMax)
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-sm bg-surface border border-surface-border rounded-3xl shadow-2xl overflow-hidden my-auto relative">
        <div className="p-4 border-b border-surface-border bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gamer-purple/20 text-gamer-purple-light">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-gamer font-bold text-base text-white">
              ADICIONAR FILHO(A)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Nome do Filho(a)
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pedro, Laura..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gamer-purple"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Limite Diário Máximo (Minutos)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[60, 90, 120].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDailyMax(m)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    dailyMax === m
                      ? 'bg-gamer-purple text-white border-purple-400 shadow-glow-purple'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
            <input
              type="number"
              min="15"
              max="300"
              value={dailyMax}
              onChange={(e) => {
                const val = e.target.value
                if (val === '') {
                  setDailyMax('')
                } else {
                  const parsed = parseInt(val, 10)
                  setDailyMax(isNaN(parsed) ? '' : Math.max(1, parsed))
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gamer-purple font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl text-xs font-bold bg-gamer-purple hover:bg-purple-600 text-white shadow-glow-purple flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Cadastrar Perfil</span>
          </button>
        </form>
      </div>
    </div>
  )
}
