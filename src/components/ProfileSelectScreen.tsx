import React, { useState } from 'react'
import { AppUserRole } from '../types'
import { dataService } from '../services/dataService'
import { sounds } from '../lib/sound'
import {
  Gamepad2,
  Lock,
  Sparkles,
  Check,
  ChevronLeft,
  X,
  ShieldCheck,
  Delete,
  Smartphone
} from 'lucide-react'

interface ProfileSelectScreenProps {
  isOpen: boolean
  onClose?: () => void
  canClose?: boolean
  onSelectRole: (role: AppUserRole, remember: boolean) => void
  currentRole?: AppUserRole | null
}

export const ProfileSelectScreen: React.FC<ProfileSelectScreenProps> = ({
  isOpen,
  onClose,
  canClose = false,
  onSelectRole,
  currentRole,
}) => {
  const [rememberDevice, setRememberDevice] = useState<boolean>(true)
  const [selectedParent, setSelectedParent] = useState<'papai' | 'mamae' | null>(null)
  const [pin, setPin] = useState<string>('')
  const [pinError, setPinError] = useState<boolean>(false)

  if (!isOpen) return null

  // Handle Gael Selection (no PIN required)
  const handleSelectGael = () => {
    sounds.play1Up()
    onSelectRole('gael', rememberDevice)
  }

  // Handle Parent Selection (starts PIN flow)
  const handleStartParentAuth = (role: 'papai' | 'mamae') => {
    sounds.playReward()
    setSelectedParent(role)
    setPin('')
    setPinError(false)
  }

  // Handle PIN Numpad
  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit
      setPin(nextPin)
      setPinError(false)

      if (nextPin.length === 4) {
        if (dataService.verifyParentPin(nextPin)) {
          sounds.play1Up()
          setTimeout(() => {
            if (selectedParent) {
              onSelectRole(selectedParent, rememberDevice)
            }
          }, 150)
        } else {
          setPinError(true)
          sounds.playPenalty()
          if (navigator.vibrate) navigator.vibrate([100, 50, 100])
          setTimeout(() => {
            setPin('')
          }, 800)
        }
      }
    }
  }

  const handleDeleteDigit = () => {
    setPin((prev) => prev.slice(0, -1))
    setPinError(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto select-none">
      <div className="w-full max-w-md bg-[#131522] border border-[#23273e] rounded-3xl p-6 shadow-[0_12px_48px_rgba(0,0,0,0.8)] space-y-6 my-auto relative overflow-hidden animate-scale-up">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#10e599]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with optional close button */}
        <div className="flex items-center justify-between relative z-10">
          {selectedParent ? (
            <button
              onClick={() => {
                setSelectedParent(null)
                setPin('')
                setPinError(false)
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors py-1 px-2 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar aos Perfis</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>SISTEMA FAMILIAR NEON</span>
            </div>
          )}

          {canClose && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fechar e manter perfil atual"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* SCREEN 1: PROFILE SELECTION CARDS */}
        {!selectedParent ? (
          <div className="space-y-5 relative z-10">
            <div className="text-center space-y-1">
              <h2 className="font-gamer font-black text-2xl text-white tracking-wide">
                QUEM ESTÁ USANDO AGORA?
              </h2>
              <p className="text-xs text-slate-400">
                Selecione o perfil para abrir o aplicativo neste aparelho
              </p>
            </div>

            {/* Profile Cards Grid */}
            <div className="space-y-3">
              {/* Card 1: Gael */}
              <button
                onClick={handleSelectGael}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group active:scale-[0.98] ${
                  currentRole === 'gael'
                    ? 'bg-gradient-to-r from-purple-950/80 to-[#181b2c] border-purple-500 shadow-glow-purple'
                    : 'bg-[#181b2c] border-[#252a42] hover:border-purple-500/60 hover:bg-[#1e2238]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-400/80 shadow-glow-purple bg-[#131522] group-hover:scale-105 transition-transform">
                      <img
                        src="/images/gael-astronaut-avatar.png"
                        alt="Gael Astronauta"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="w-3 h-3 rounded-full bg-[#10e599] absolute -bottom-0.5 -right-0.5 border-2 border-[#131522] animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-gamer font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                        GAEL 🚀
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#10e599]/15 text-[#10e599] text-[9px] font-bold font-mono border border-[#10e599]/30">
                        5 ANOS
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      QG Gamer, Missões e Modo Aprender
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <span className="px-3 py-1.5 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white text-xs font-bold font-gamer tracking-wide shadow-md">
                    ENTRAR 🎮
                  </span>
                </div>
              </button>

              {/* Card 2: Papai */}
              <button
                onClick={() => handleStartParentAuth('papai')}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group active:scale-[0.98] ${
                  currentRole === 'papai'
                    ? 'bg-gradient-to-r from-blue-950/80 to-[#181b2c] border-blue-500 shadow-sm'
                    : 'bg-[#181b2c] border-[#252a42] hover:border-blue-500/60 hover:bg-[#1e2238]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl border border-blue-500/50 bg-blue-950/60 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    🧔
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-gamer font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                        PAPAI
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 text-[9px] font-bold font-mono border border-blue-800/40 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>PIN 1010</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Aprovar tarefas, roleta e minutos
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-blue-600 text-slate-200 group-hover:text-white text-xs font-bold transition-colors">
                    Acessar 🔒
                  </span>
                </div>
              </button>

              {/* Card 3: Mamãe */}
              <button
                onClick={() => handleStartParentAuth('mamae')}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group active:scale-[0.98] ${
                  currentRole === 'mamae'
                    ? 'bg-gradient-to-r from-pink-950/80 to-[#181b2c] border-pink-500 shadow-sm'
                    : 'bg-[#181b2c] border-[#252a42] hover:border-pink-500/60 hover:bg-[#1e2238]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl border border-pink-500/50 bg-pink-950/60 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    👩
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-gamer font-bold text-base text-white group-hover:text-pink-300 transition-colors">
                        MAMÃE
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-pink-950 text-pink-300 text-[9px] font-bold font-mono border border-pink-800/40 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>PIN 1010</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Aprovar tarefas, roleta e elogios
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-pink-600 text-slate-200 group-hover:text-white text-xs font-bold transition-colors">
                    Acessar 🔒
                  </span>
                </div>
              </button>
            </div>

            {/* Remember Device Switch */}
            <div className="pt-2">
              <label
                onClick={() => setRememberDevice(!rememberDevice)}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#10e599]" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      Lembrar neste aparelho
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Entra direto neste perfil sempre que abrir o app
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                    rememberDevice
                      ? 'bg-[#10e599] border-[#10e599] text-slate-950 font-bold'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                >
                  {rememberDevice && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </label>
            </div>
          </div>
        ) : (
          /* SCREEN 2: PARENT PIN AUTHENTICATION */
          <div className="space-y-5 text-center relative z-10 animate-fade-in">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-700 flex items-center justify-center text-4xl shadow-lg">
              {selectedParent === 'papai' ? '🧔' : '👩'}
            </div>

            <div>
              <h3 className="font-gamer font-bold text-xl text-white">
                ACESSO DE {selectedParent === 'papai' ? 'PAPAI' : 'MAMÃE'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Digite o PIN de 4 dígitos para gerenciar o Gael
              </p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center items-center gap-3.5 py-1">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = index < pin.length
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      pinError
                        ? 'bg-rose-500 scale-110 animate-bounce'
                        : isFilled
                        ? 'bg-[#10e599] scale-110 shadow-glow-mint'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                )
              })}
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-bold animate-pulse">
                PIN Incorreto! (Dica padrão: 1010)
              </p>
            )}

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className="h-12 rounded-2xl bg-[#181b2c] hover:bg-[#22273e] border border-[#252a42] text-white font-gamer font-bold text-lg active:scale-95 transition-all shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => setPin('')}
                className="h-12 rounded-2xl bg-[#181b2c] hover:bg-slate-800 text-slate-400 text-xs font-bold active:scale-95 transition-all"
              >
                Limpar
              </button>
              <button
                onClick={() => handleDigit('0')}
                className="h-12 rounded-2xl bg-[#181b2c] hover:bg-[#22273e] border border-[#252a42] text-white font-gamer font-bold text-lg active:scale-95 transition-all shadow-sm"
              >
                0
              </button>
              <button
                onClick={handleDeleteDigit}
                className="h-12 rounded-2xl bg-[#181b2c] hover:bg-slate-800 text-slate-400 flex items-center justify-center active:scale-95 transition-all"
                title="Apagar"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
