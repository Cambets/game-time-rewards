import React, { useState } from 'react'
import { Lock, X, Delete, ShieldAlert } from 'lucide-react'
import { dataService } from '../services/dataService'

interface PinModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
  subtitle?: string
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Área dos Pais 🔒',
  subtitle = 'Digite o PIN de 4 dígitos para acessar',
}) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (!isOpen) return null

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit
      setPin(nextPin)
      setError(false)

      if (nextPin.length === 4) {
        if (dataService.verifyParentPin(nextPin)) {
          setTimeout(() => {
            setPin('')
            onSuccess()
          }, 150)
        } else {
          setError(true)
          if (navigator.vibrate) navigator.vibrate([100, 50, 100])
          setTimeout(() => {
            setPin('')
          }, 800)
        }
      }
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setError(false)
  }

  const handleClear = () => {
    setPin('')
    setError(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xs bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up text-center">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-8" />
          <div className="p-3 rounded-2xl bg-gamer-purple/20 text-gamer-purple-light border border-gamer-purple/40">
            <Lock className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="font-gamer font-bold text-lg text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>

        {/* PIN Dots Display */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 scale-110 animate-bounce'
                    : isFilled
                    ? 'bg-gamer-purple-light scale-110 shadow-glow-purple'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              />
            )
          })}
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-bold animate-pulse flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            PIN incorreto! Tente novamente.
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:bg-gamer-purple/30 text-white font-gamer font-bold text-lg border border-slate-800 hover:border-slate-700 active:scale-95 transition-all shadow-sm"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="py-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 text-xs font-bold transition-all"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:bg-gamer-purple/30 text-white font-gamer font-bold text-lg border border-slate-800 hover:border-slate-700 active:scale-95 transition-all shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="py-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 flex items-center justify-center transition-all"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] text-slate-500 font-mono">
          PIN padrão inicial: 1010
        </p>
      </div>
    </div>
  )
}
