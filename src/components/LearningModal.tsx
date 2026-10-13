import React, { useState, useEffect } from 'react'
import { LearningChallenge } from '../types'
import {
  generateLessonRound,
  speakText,
} from '../services/learningService'
import { sounds } from '../lib/sound'
import confetti from 'canvas-confetti'
import {
  Volume2,
  X,
  Sparkles,
  Trophy,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  Flame,
  Star,
  RotateCcw,
} from 'lucide-react'

interface LearningModalProps {
  isOpen: boolean
  onClose: () => void
  onRewardEarned: (minutes: number, xp: number, lessonTitle: string) => void
}

export const LearningModal: React.FC<LearningModalProps> = ({
  isOpen,
  onClose,
  onRewardEarned,
}) => {
  const [challenges, setChallenges] = useState<LearningChallenge[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [wrongOptions, setWrongOptions] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [wigglingOption, setWigglingOption] = useState<string | null>(null)

  // Inicia uma nova rodada com 5 desafios
  const startNewRound = () => {
    const round = generateLessonRound(5)
    setChallenges(round)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsCorrect(null)
    setWrongOptions([])
    setIsComplete(false)
    setWigglingOption(null)
  }

  useEffect(() => {
    if (isOpen) {
      startNewRound()
    }
  }, [isOpen])

  const currentChallenge = challenges[currentIndex]

  // Falar automaticamente ao carregar nova questão
  useEffect(() => {
    if (isOpen && currentChallenge && !isComplete) {
      const timer = setTimeout(() => {
        speakText(currentChallenge.audio_prompt)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, isOpen, isComplete])

  if (!isOpen) return null

  const handleSpeak = () => {
    if (currentChallenge) {
      speakText(currentChallenge.audio_prompt)
    }
  }

  const handleSelectOption = (option: string) => {
    if (isCorrect || !currentChallenge) return

    setSelectedOption(option)

    if (option === currentChallenge.correct_answer) {
      // Acerto!
      setIsCorrect(true)
      sounds.playReward()
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#8b5cf6', '#10b981', '#f59e0b', '#38bdf8'],
      })

      // Mensagem falada de incentivo
      const praises = [
        'Muito bem, Gael!',
        'Incrível! Você acertou!',
        'Parabéns, campeão!',
        'Que orgulho!',
      ]
      const randomPraise = praises[Math.floor(Math.random() * praises.length)]
      setTimeout(() => {
        speakText(randomPraise)
      }, 200)

      // Próxima questão ou tela de vitória após 1.4s
      setTimeout(() => {
        if (currentIndex + 1 < challenges.length) {
          setCurrentIndex((prev) => prev + 1)
          setSelectedOption(null)
          setIsCorrect(null)
          setWrongOptions([])
        } else {
          // Concluiu as 5 questões da trilha!
          setIsComplete(true)
          sounds.play1Up()
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#ec4899', '#f59e0b', '#10b981', '#8b5cf6'],
          })
          onRewardEarned(10, 50, 'Academia do Conhecimento Nível 1')
        }
      }, 1400)
    } else {
      // Erro suave e encorajador (sem punição ou som chato)
      setWrongOptions((prev) => [...prev, option])
      setWigglingOption(option)
      sounds.playGentleTryAgain()

      setTimeout(() => {
        setWigglingOption(null)
      }, 500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-sm bg-surface border-2 border-gamer-purple/60 rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-up relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-gamer-purple/20 text-gamer-purple-light border border-gamer-purple/40">
              <BookOpen className="w-5 h-5 text-gamer-purple-light" />
            </div>
            <div>
              <h3 className="font-gamer font-bold text-sm text-white tracking-wide">
                MODO APRENDER 📖
              </h3>
              <p className="text-[10px] text-emerald-400 font-bold font-mono">
                +10 Minutos de Jogo ao Concluir!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- TELA DE VITÓRIA / CONCLUSÃO --- */}
        {isComplete ? (
          <div className="py-6 space-y-5 text-center my-auto animate-scale-up">
            <div className="relative mx-auto w-24 h-24 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-glow-amber animate-bounce">
              <Trophy className="w-14 h-14 text-amber-400" />
              <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                ⭐ MISSÃO EDUCATIVA CUMPRIDA! ⭐
              </span>
              <h2 className="font-gamer font-bold text-2xl text-white">
                MUITO BEM, GAEL! 🏆
              </h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Você completou os desafios de leitura como um verdadeiro campeão!
              </p>
            </div>

            {/* Badges de Recompensa */}
            <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto">
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 shadow-glow-green text-center">
                <span className="text-2xl block mb-0.5">🎮</span>
                <span className="font-gamer font-bold text-base text-emerald-300">
                  +10 MIN
                </span>
                <span className="text-[9px] text-slate-400 block font-semibold">
                  Bateria Carregada!
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/50 shadow-glow-purple text-center">
                <span className="text-2xl block mb-0.5">⭐</span>
                <span className="font-gamer font-bold text-base text-purple-300">
                  +50 XP
                </span>
                <span className="text-[9px] text-slate-400 block font-semibold">
                  Nível de Conhecimento
                </span>
              </div>
            </div>

            {/* Botões Finais */}
            <div className="space-y-2 pt-2 max-w-xs mx-auto">
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-gamer font-bold text-sm shadow-glow-green active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-5 h-5 fill-current" />
                <span>APROVEITAR MEUS MINUTOS! 🚀</span>
              </button>

              <button
                onClick={startNewRound}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Fazer Outra Rodada (+ Mais Tempo)</span>
              </button>
            </div>
          </div>
        ) : currentChallenge ? (
          /* --- TELA DA QUESTÃO ATIVA --- */
          <div className="space-y-4 my-auto flex-1 flex flex-col justify-between">
            {/* Barra de Progresso com bolinhas */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Desafio {currentIndex + 1} de {challenges.length}</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  Gael Aprendiz
                </span>
              </div>
              <div className="flex gap-1.5">
                {challenges.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      idx < currentIndex
                        ? 'bg-emerald-400 shadow-glow-green'
                        : idx === currentIndex
                        ? 'bg-gamer-purple animate-pulse'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card Principal da Pergunta */}
            <div className="gamer-card rounded-3xl p-4 border border-surface-border text-center space-y-3 relative overflow-hidden shadow-lg">
              {/* Badge do Tipo de Desafio */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold tracking-wider uppercase">
                {currentChallenge.type === 'word_match' && 'QUAL É A PALAVRA? 🔍'}
                {currentChallenge.type === 'missing_letter' && 'COMPLETE A LETRA! ✏️'}
                {currentChallenge.type === 'initial_sound' && 'QUAL COMEÇA COM ESSA LETRA? 🔤'}
              </div>

              {/* Ilustração Gigante em Destaque */}
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-slate-900 via-purple-950/40 to-slate-900 border-2 border-gamer-purple/50 flex items-center justify-center text-6xl shadow-inner shadow-glow-purple">
                <span>{currentChallenge.image_emoji_or_url}</span>
              </div>

              {/* Letras / Texto Exibido */}
              {currentChallenge.type === 'missing_letter' ? (
                <div className="py-1">
                  <span className="font-gamer font-extrabold text-3xl md:text-4xl text-amber-300 tracking-widest bg-slate-950 px-4 py-1.5 rounded-2xl border border-slate-800 inline-block">
                    {currentChallenge.display_text}
                  </span>
                </div>
              ) : currentChallenge.type === 'initial_sound' ? (
                <div className="py-1">
                  <p className="font-bold text-base text-white">
                    {currentChallenge.display_text}
                  </p>
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-300">
                  Toque na palavra certa deste desenho:
                </p>
              )}

              {/* Botão de Ouvir Voz Alta */}
              <div>
                <button
                  onClick={handleSpeak}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                  title="Ouvir a pergunta em voz alta"
                >
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Ouvir com Som 🔊</span>
                </button>
              </div>
            </div>

            {/* Mensagem de Feedback Rápido */}
            {isCorrect && (
              <div className="p-2 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-scale-up">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Incrível, Gael! Você acertou! ⭐</span>
              </div>
            )}

            {/* Botões de Opções Grandes para Dedinhos de 5 Anos */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {currentChallenge.options.map((option: string) => {
                const isSelected = selectedOption === option
                const isOptionCorrect = isCorrect && isSelected
                const isWrong = wrongOptions.includes(option)
                const isWiggling = wigglingOption === option

                return (
                  <button
                    key={option}
                    disabled={isCorrect !== null}
                    onClick={() => handleSelectOption(option)}
                    className={`py-3.5 px-4 rounded-2xl font-gamer font-bold text-lg md:text-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border ${
                      isOptionCorrect
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 shadow-glow-green scale-105'
                        : isWrong
                        ? 'bg-slate-900/60 text-slate-500 border-slate-800 opacity-60'
                        : 'bg-slate-900/95 hover:bg-slate-800 text-white border-slate-700/80 hover:border-gamer-purple'
                    } ${isWiggling ? 'animate-bounce text-amber-300 border-amber-400' : ''}`}
                  >
                    <span>{option}</span>
                    {isOptionCorrect && <Sparkles className="w-5 h-5 text-slate-950" />}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
