import React, { useState } from 'react'
import { Sparkles, MessageSquare, Volume2, Heart } from 'lucide-react'
import { sounds } from '../lib/sound'

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
  const [currentPhrase, setCurrentPhrase] = useState(
    '🎮 Olá Gael! Toque em mim para conversar!'
  )
  const [isWiggling, setIsWiggling] = useState(false)
  const [showBubble, setShowBubble] = useState(true)

  const handleTap = () => {
    sounds.playPetReaction()
    setIsWiggling(true)
    setShowBubble(true)

    // Random new phrase
    const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]
    setCurrentPhrase(randomPhrase)

    setTimeout(() => {
      setIsWiggling(false)
    }, 600)
  }

  return (
    <div className="fixed bottom-20 right-3 z-30 flex flex-col items-end pointer-events-auto select-none">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="mb-2 max-w-[200px] bg-slate-900/95 border-2 border-gamer-purple rounded-2xl p-2.5 shadow-2xl animate-fade-in relative text-right">
          <p className="text-[11px] font-bold text-white leading-snug">
            {currentPhrase}
          </p>
          <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gamer-purple" />
        </div>
      )}

      {/* Interactive Pet Character (Robo-Pet Pixel) */}
      <button
        onClick={handleTap}
        className={`relative p-3 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-700 border-2 border-gamer-purple-light shadow-glow-purple active:scale-90 transition-all duration-200 group ${
          isWiggling ? 'scale-110 -rotate-12' : 'hover:scale-105'
        }`}
        title="Toque no Mascote do Gael!"
      >
        <span className="text-3xl filter drop-shadow">🤖</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gamer-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gamer-green"></span>
        </span>
      </button>
    </div>
  )
}
