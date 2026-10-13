import React, { useState, useEffect, useRef } from 'react'
import { Heart, RefreshCw, Move, Sparkles } from 'lucide-react'
import { sounds } from '../lib/sound'
import { PetType } from '../types'

interface PetInfo {
  id: PetType
  name: string
  emoji: string
}

const PETS: PetInfo[] = [
  { id: 'robot', name: 'Robô Cyber', emoji: '🤖' },
  { id: 'dragon', name: 'Dragãozinho', emoji: '🐲' },
  { id: 'dog', name: 'Cãozinho Amigo', emoji: '🐶' },
  { id: 'cat', name: 'Gatinho Fofo', emoji: '🐱' },
]

// Frases bem curtas, doces e fáceis para uma criança de 5 anos
const PHRASES = [
  'Oi Gael! Eu te amo! ❤️',
  'Você é meu amigão! 🌟',
  'Já bebeu aguinha hoje? 💧',
  'Sua caminha tá arrumada? 🛏️',
  'Que sorrisão lindo, Gael! 😄',
  'Já escovou os dentinhos? 🪥',
  'Parabéns, meu campeão! 🏆',
  'Eu adoro brincar com você! 🎮',
  'Guarda os brinquedos pra gente jogar! 🧸',
  'O Papai e a Mamãe te amam muito! 💖',
  'Você é muito inteligente! 🧠✨',
  'Você é o meu super-herói! 🚀',
]

export const PixelPetCompanion: React.FC = () => {
  const [petIndex, setPetIndex] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState('Oi Gael! Toca em mim ou me arrasta! 🎮')
  const [isWiggling, setIsWiggling] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([])

  // Posicionamento arrastável (Draggable)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const isInitialized = useRef(false)

  const dragRef = useRef<{
    startX: number
    startY: number
    initialX: number
    initialY: number
    hasMoved: boolean
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  })

  // Inicializa posição inicial perto do canto inferior direito
  useEffect(() => {
    if (!isInitialized.current && typeof window !== 'undefined') {
      const defaultX = Math.max(16, window.innerWidth - 95)
      const defaultY = Math.max(100, window.innerHeight - 170)
      setPosition({ x: defaultX, y: defaultY })
      isInitialized.current = true
    }
  }, [])

  const currentPet = PETS[petIndex]

  // Limites da tela para não sumir
  const clampPosition = (x: number, y: number) => {
    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 100
    return {
      x: Math.max(10, Math.min(maxX, x)),
      y: Math.max(70, Math.min(maxY, y)),
    }
  }

  // --- CONTROLE DE TOQUE (CELULAR) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false,
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragRef.current.startX
    const deltaY = touch.clientY - dragRef.current.startY

    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      dragRef.current.hasMoved = true
      setIsDragging(true)
      const next = clampPosition(
        dragRef.current.initialX + deltaX,
        dragRef.current.initialY + deltaY
      )
      setPosition(next)
    }
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      setTimeout(() => setIsDragging(false), 50)
    }
    if (!dragRef.current.hasMoved) {
      handleTap()
    }
  }

  // --- CONTROLE DE MOUSE (COMPUTADOR) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false,
    }

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragRef.current.startX
      const deltaY = moveEvent.clientY - dragRef.current.startY

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        dragRef.current.hasMoved = true
        setIsDragging(true)
        const next = clampPosition(
          dragRef.current.initialX + deltaX,
          dragRef.current.initialY + deltaY
        )
        setPosition(next)
      }
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      if (isDragging) {
        setTimeout(() => setIsDragging(false), 50)
      }
      if (!dragRef.current.hasMoved) {
        handleTap()
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // Ação ao clicar / tocar no pet
  const handleTap = () => {
    sounds.playPetReaction()
    setIsWiggling(true)
    setShowBubble(true)

    const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]
    setCurrentPhrase(randomPhrase)

    setTimeout(() => {
      setIsWiggling(false)
    }, 500)
  }

  // Carinho no pet
  const handlePetLove = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    sounds.playReward()
    setIsWiggling(true)

    const newHeart = { id: Date.now(), left: Math.floor(Math.random() * 30) - 15 }
    setHearts((prev) => [...prev, newHeart])
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id))
    }, 1200)

    setCurrentPhrase(`❤️ O ${currentPet.name} amou seu carinho! Obrigado, Gael!`)
    setTimeout(() => setIsWiggling(false), 500)
  }

  // Trocar o bichinho
  const handleNextPet = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    sounds.playPetReaction()
    const nextIdx = (petIndex + 1) % PETS.length
    setPetIndex(nextIdx)
    setCurrentPhrase(`✨ Agora eu sou o seu ${PETS[nextIdx].name}!`)
  }

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }}
      className="fixed z-40 flex flex-col items-end select-none pointer-events-auto"
    >
      {/* Floating Hearts Animation */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute -top-8 text-2xl pointer-events-none animate-bounce"
          style={{ right: `${25 + h.left}px` }}
        >
          💖
        </span>
      ))}

      {/* Speech Bubble (Balão de Fala adaptativo) */}
      {showBubble && (
        <div className="mb-2 max-w-[200px] bg-slate-900/95 border-2 border-gamer-purple rounded-2xl p-2.5 shadow-2xl animate-fade-in relative text-right backdrop-blur-sm">
          <p className="text-xs font-bold text-white leading-snug">
            {currentPhrase}
          </p>
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
            <button
              onClick={handleNextPet}
              onTouchEnd={handleNextPet}
              className="text-[9px] text-purple-300 hover:text-white flex items-center gap-1 font-bold active:scale-95 transition-all"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Trocar</span>
            </button>
            <button
              onClick={handlePetLove}
              onTouchEnd={handlePetLove}
              className="text-[9px] text-pink-400 hover:text-pink-300 font-bold flex items-center gap-0.5 active:scale-95 transition-all"
            >
              <Heart className="w-2.5 h-2.5 fill-current" />
              <span>Carinho ❤️</span>
            </button>
          </div>
          <div className="absolute -bottom-2 right-5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gamer-purple" />
        </div>
      )}

      {/* Pet Personagem Interativo com indicador de arrasto */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className={`relative p-3 rounded-2xl bg-gradient-to-tr from-purple-900 via-indigo-800 to-gamer-purple border-2 shadow-2xl transition-all duration-150 cursor-grab active:cursor-grabbing ${
          isDragging
            ? 'scale-125 border-emerald-400 shadow-glow-green rotate-6'
            : isWiggling
            ? 'scale-115 -rotate-12 border-pink-400 shadow-glow-pink'
            : 'border-gamer-purple-light hover:scale-105 shadow-glow-purple'
        }`}
        title={`Arraste o ${currentPet.name} para onde quiser na tela!`}
      >
        <span className="text-3xl filter drop-shadow block leading-none pointer-events-none">
          {currentPet.emoji}
        </span>

        {/* Status dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gamer-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gamer-green"></span>
        </span>

        {/* Drag tag */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950/90 text-purple-300 border border-purple-500/40 text-[8px] font-bold px-1.5 py-0.2 rounded-md whitespace-nowrap flex items-center gap-0.5 pointer-events-none shadow-sm">
          <Move className="w-2 h-2 text-gamer-green" />
          <span>Arraste</span>
        </span>
      </div>
    </div>
  )
}
