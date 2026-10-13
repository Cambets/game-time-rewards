import React, { useState } from 'react'
import { Sparkles, MessageSquare, Heart, Cookie, RefreshCw } from 'lucide-react'
import { sounds } from '../lib/sound'
import { PetType } from '../types'

interface PetInfo {
  id: PetType
  name: string
  emoji: string
  soundChime: string
}

const PETS: PetInfo[] = [
  { id: 'robot', name: 'Robo-Pet', emoji: '🤖', soundChime: 'beep-boop!' },
  { id: 'dragon', name: 'Dragãozinho Pixel', emoji: '🐲', soundChime: 'rawr fofinho!' },
  { id: 'dog', name: 'Cãozinho Gamer', emoji: '🐶', soundChime: 'au au gamer!' },
  { id: 'cat', name: 'Gatinho 8-Bit', emoji: '🐱', soundChime: 'miau 8-bit!' },
]

const PHRASES = [
  '🎮 Bora detonar nas missões hoje, Gael!',
  '💧 Lembrete gamer: Beba água e descanse os olhos!',
  '⭐ Papai e Mamãe estão muito orgulhosos de você!',
  '🚀 Pro-player de verdade arruma a cama primeiro!',
  '🔥 Você é um jogador lendário!',
  '🏆 Cumpra suas missões para encher a bateria de jogo!',
  '👾 Estou jogando no controle 2 junto com você!',
  '⚡ Quase na hora de subir de nível!',
]

export const PixelPetCompanion: React.FC = () => {
  const [petIndex, setPetIndex] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState(
    '🎮 Olá Gael! Toque em mim para brincar ou dar carinho!'
  )
  const [isWiggling, setIsWiggling] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([])

  const currentPet = PETS[petIndex]

  const handleTap = () => {
    sounds.playPetReaction()
    setIsWiggling(true)
    setShowBubble(true)

    const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]
    setCurrentPhrase(randomPhrase)

    setTimeout(() => {
      setIsWiggling(false)
    }, 600)
  }

  const handlePetLove = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playReward()
    setIsWiggling(true)

    // Spawn floating heart
    const newHeart = { id: Date.now(), left: Math.floor(Math.random() * 40) - 20 }
    setHearts((prev) => [...prev, newHeart])
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id))
    }, 1200)

    setCurrentPhrase(`❤️ O ${currentPet.name} adorou o seu carinho! Obrigado, Gael!`)
    setTimeout(() => setIsWiggling(false), 500)
  }

  const handleNextPet = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playPetReaction()
    const nextIdx = (petIndex + 1) % PETS.length
    setPetIndex(nextIdx)
    setCurrentPhrase(`✨ Agora sou seu ${PETS[nextIdx].name}!`)
  }

  return (
    <div className="fixed bottom-20 right-3 z-30 flex flex-col items-end pointer-events-auto select-none">
      {/* Floating Hearts Animation */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute text-xl pointer-events-none animate-bounce"
          style={{
            top: '-30px',
            right: `${20 + h.left}px`,
            transition: 'all 1s ease-out',
          }}
        >
          💖
        </span>
      ))}

      {/* Speech Bubble */}
      {showBubble && (
        <div className="mb-2 max-w-[210px] bg-slate-900/95 border-2 border-gamer-purple rounded-2xl p-2.5 shadow-2xl animate-fade-in relative text-right">
          <p className="text-[11px] font-bold text-white leading-snug">
            {currentPhrase}
          </p>
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
            <button
              onClick={handleNextPet}
              className="text-[9px] text-purple-300 hover:text-white flex items-center gap-1 font-semibold"
              title="Trocar Mascote"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Trocar</span>
            </button>
            <button
              onClick={handlePetLove}
              className="text-[9px] text-pink-400 hover:text-pink-300 font-bold flex items-center gap-0.5"
            >
              <Heart className="w-2.5 h-2.5 fill-current" />
              <span>Carinho</span>
            </button>
          </div>
          <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gamer-purple" />
        </div>
      )}

      {/* Interactive Pet Character */}
      <button
        onClick={handleTap}
        className={`relative p-3 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-700 border-2 border-gamer-purple-light shadow-glow-purple active:scale-90 transition-all duration-200 group ${
          isWiggling ? 'scale-110 -rotate-12' : 'hover:scale-105'
        }`}
        title={`Mascote do Gael: ${currentPet.name}`}
      >
        <span className="text-3xl filter drop-shadow">{currentPet.emoji}</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gamer-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gamer-green"></span>
        </span>
      </button>
    </div>
  )
}
