import React from 'react'
import { BellRing, BellOff, Plus, Gamepad2, Volume2 } from 'lucide-react'

interface AlarmModalProps {
  isOpen: boolean
  kidName: string
  onDismiss: () => void
  onAddTolerance: (minutes: number) => void
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  kidName,
  onDismiss,
  onAddTolerance,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 rounded-3xl p-6 shadow-glow-rose text-center space-y-5 animate-scale-up">
        {/* Pulsing Alarm Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-rose-600/30 border border-rose-500 flex items-center justify-center animate-bounce">
          <BellRing className="w-10 h-10 text-rose-400 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
        </div>

        {/* Warning Titles */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-500/50 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            Alarme Ativo
          </div>
          <h2 className="font-gamer font-bold text-2xl md:text-3xl text-white tracking-wide">
            TEMPO DO {kidName.toUpperCase()} ESGOTADO!
          </h2>
          <p className="text-sm text-rose-200/90 font-medium max-w-xs mx-auto">
            O cronômetro chegou ao fim. Hora de salvar o progresso e desligar o videogame agora!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {/* Dismiss Alarm Button */}
          <button
            onClick={onDismiss}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-gamer font-bold text-base shadow-glow-rose flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
          >
            <BellOff className="w-5 h-5" />
            <span>DESLIGAR ALARME & CONCLUIR</span>
          </button>

          {/* Tolerance Button */}
          <button
            onClick={() => onAddTolerance(5)}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Dar +5 Minutos de Tolerância para Salvar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
