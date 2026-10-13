import React, { useState } from 'react'
import { TaskCategory } from '../types'
import { X, Plus, Minus, Sparkles, Check, BookmarkPlus } from 'lucide-react'

interface CustomMinutesModalProps {
  isOpen: boolean
  onClose: () => void
  profileName: string
  onSubmitCustom: (minutes: number, title: string) => void
  onCreateTemplate: (template: { title: string; minutes_reward: number; category: TaskCategory; icon: string; active: boolean }) => void
}

export const CustomMinutesModal: React.FC<CustomMinutesModalProps> = ({
  isOpen,
  onClose,
  profileName,
  onSubmitCustom,
  onCreateTemplate,
}) => {
  const [mode, setMode] = useState<'adjust' | 'create_task'>('adjust')
  
  // Custom adjust state
  const [minutes, setMinutes] = useState<number>(15)
  const [isDeduction, setIsDeduction] = useState<boolean>(false)
  const [reason, setReason] = useState<string>('')

  // Create task template state
  const [templateTitle, setTemplateTitle] = useState('')
  const [templateMinutes, setTemplateMinutes] = useState(10)
  const [templateCategory, setTemplateCategory] = useState<TaskCategory>('rotina')
  const [templateIcon, setTemplateIcon] = useState('Sparkles')

  if (!isOpen) return null

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalMinutes = isDeduction ? -Math.abs(minutes) : Math.abs(minutes)
    const finalTitle = reason.trim() || (isDeduction ? 'Ajuste Manual (-)' : 'Bônus Manual (+)')
    onSubmitCustom(finalMinutes, finalTitle)
    onClose()
  }

  const handleCreateTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateTitle.trim()) return

    onCreateTemplate({
      title: templateTitle.trim(),
      minutes_reward: templateCategory === 'penalidade' ? -Math.abs(templateMinutes) : Math.abs(templateMinutes),
      category: templateCategory,
      icon: templateIcon,
      active: true
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-surface-border rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header Tabs */}
        <div className="p-4 border-b border-surface-border bg-slate-900/90 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('adjust')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'adjust'
                  ? 'bg-gamer-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lançamento Rápido
            </button>
            <button
              onClick={() => setMode('create_task')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'create_task'
                  ? 'bg-gamer-green text-slate-900 shadow-glow-green font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Nova Missão Fixa
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'adjust' ? (
          /* Custom Immediate Adjustment Form */
          <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Tipo de Lançamento para {profileName}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeduction(false)}
                  className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    !isDeduction
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-glow-green'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Crédito (+ Bônus)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeduction(true)}
                  className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isDeduction
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-glow-rose'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Minus className="w-4 h-4 text-rose-400" />
                  <span>Débito (- Penalidade)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Quantidade de Minutos
              </label>
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {[5, 10, 15, 30, 45].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinutes(m)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      minutes === m
                        ? isDeduction
                          ? 'bg-rose-600 text-white border-rose-400'
                          : 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max="240"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gamer-purple font-mono"
                placeholder="Ou digite o valor..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Motivo / Descrição (opcional)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={isDeduction ? 'Ex: Reclamou para almoçar' : 'Ex: Ajudou a vovó com sacolas'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gamer-purple"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                isDeduction
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-glow-rose'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-glow-green'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                Confirmar Lançamento ({isDeduction ? `-${minutes}` : `+${minutes}`} min)
              </span>
            </button>
          </form>
        ) : (
          /* Create Permanent Task Template */
          <form onSubmit={handleCreateTemplateSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Nome da Nova Missão
              </label>
              <input
                type="text"
                required
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="Ex: Passear com o cachorro"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gamer-green"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Minutos
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={templateMinutes}
                  onChange={(e) => setTemplateMinutes(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gamer-green font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Categoria
                </label>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value as TaskCategory)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gamer-green capitalize"
                >
                  <option value="rotina">Rotina</option>
                  <option value="casa">Casa</option>
                  <option value="escola">Escola / Foco</option>
                  <option value="penalidade">Penalidade</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Ícone
              </label>
              <div className="grid grid-cols-6 gap-2">
                {['Sparkles', 'Dog', 'Utensils', 'BookOpen', 'Trophy', 'AlertTriangle'].map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setTemplateIcon(ico)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center ${
                      templateIcon === ico
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {ico === 'Sparkles' && '✨'}
                    {ico === 'Dog' && '🐕'}
                    {ico === 'Utensils' && '🍽️'}
                    {ico === 'BookOpen' && '📖'}
                    {ico === 'Trophy' && '🏆'}
                    {ico === 'AlertTriangle' && '⚠️'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl text-xs font-bold bg-gamer-green hover:bg-emerald-400 text-slate-950 shadow-glow-green flex items-center justify-center gap-2 transition-all"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Salvar Missão na Grade</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
