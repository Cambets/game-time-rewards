import { LearningChallenge } from '../types'
export type { LearningChallenge }

// Voz falada nativa em Português do Brasil (pt-BR)
export const speakText = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  try {
    window.speechSynthesis.cancel() // cancela qualquer áudio anterior
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.82 // Leitura um pouquinho mais pausada para uma criança de 5 anos
    utterance.pitch = 1.15 // Tom acolhedor e alegre

    // Procura por vozes em português se disponíveis no navegador
    const voices = window.speechSynthesis.getVoices()
    const ptVoice = voices.find((v) => v.lang.startsWith('pt'))
    if (ptVoice) {
      utterance.voice = ptVoice
    }

    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.warn('Speech synthesis error:', err)
  }
}

// Banco inicial com 21 desafios infantis perfeitos para 5 anos
export const INITIAL_LEARNING_CHALLENGES: LearningChallenge[] = [
  // 1. "Qual é a Palavra?" (Associação Imagem + Palavra)
  {
    id: 'lc-1',
    type: 'word_match',
    target_word: 'GATO',
    image_emoji_or_url: '🐱',
    options: ['GATO', 'BOLA', 'PATO'],
    correct_answer: 'GATO',
    audio_prompt: 'Gato! Qual dessas palavras é Gato?',
    reward_minutes: 5,
  },
  {
    id: 'lc-2',
    type: 'word_match',
    target_word: 'BOLA',
    image_emoji_or_url: '⚽',
    options: ['CASA', 'BOLA', 'MESA'],
    correct_answer: 'BOLA',
    audio_prompt: 'Bola! Qual dessas palavras é Bola?',
    reward_minutes: 5,
  },
  {
    id: 'lc-3',
    type: 'word_match',
    target_word: 'SOL',
    image_emoji_or_url: '☀️',
    options: ['SOL', 'LUA', 'CÃO'],
    correct_answer: 'SOL',
    audio_prompt: 'Sol! Qual dessas palavras é Sol?',
    reward_minutes: 5,
  },
  {
    id: 'lc-4',
    type: 'word_match',
    target_word: 'CASA',
    image_emoji_or_url: '🏠',
    options: ['BOCA', 'BOLA', 'CASA'],
    correct_answer: 'CASA',
    audio_prompt: 'Casa! Qual dessas palavras é Casa?',
    reward_minutes: 5,
  },
  {
    id: 'lc-5',
    type: 'word_match',
    target_word: 'CARRO',
    image_emoji_or_url: '🚗',
    options: ['CARRO', 'NAVIO', 'TREM'],
    correct_answer: 'CARRO',
    audio_prompt: 'Carro! Qual dessas palavras é Carro?',
    reward_minutes: 5,
  },
  {
    id: 'lc-6',
    type: 'word_match',
    target_word: 'MAÇÃ',
    image_emoji_or_url: '🍎',
    options: ['MAÇÃ', 'UVA', 'PÊRA'],
    correct_answer: 'MAÇÃ',
    audio_prompt: 'Maçã! Qual dessas palavras é Maçã?',
    reward_minutes: 5,
  },
  {
    id: 'lc-7',
    type: 'word_match',
    target_word: 'SAPO',
    image_emoji_or_url: '🐸',
    options: ['SAPO', 'PATO', 'GATO'],
    correct_answer: 'SAPO',
    audio_prompt: 'Sapo! Qual dessas palavras é Sapo?',
    reward_minutes: 5,
  },
  {
    id: 'lc-8',
    type: 'word_match',
    target_word: 'PATO',
    image_emoji_or_url: '🦆',
    options: ['PATO', 'RATO', 'GATO'],
    correct_answer: 'PATO',
    audio_prompt: 'Pato! Qual dessas palavras é Pato?',
    reward_minutes: 5,
  },
  {
    id: 'lc-9',
    type: 'word_match',
    target_word: 'LUA',
    image_emoji_or_url: '🌙',
    options: ['LUA', 'SOL', 'RUA'],
    correct_answer: 'LUA',
    audio_prompt: 'Lua! Qual dessas palavras é Lua?',
    reward_minutes: 5,
  },

  // 2. "Complete a Letra"
  {
    id: 'lc-10',
    type: 'missing_letter',
    target_word: 'BOLA',
    display_text: 'B O _ A',
    missing_letter: 'L',
    image_emoji_or_url: '⚽',
    options: ['L', 'T', 'M'],
    correct_answer: 'L',
    audio_prompt: 'Bola! Qual letra falta em B, O, espaço, A?',
    reward_minutes: 5,
  },
  {
    id: 'lc-11',
    type: 'missing_letter',
    target_word: 'GATO',
    display_text: 'G A _ O',
    missing_letter: 'T',
    image_emoji_or_url: '🐱',
    options: ['T', 'P', 'R'],
    correct_answer: 'T',
    audio_prompt: 'Gato! Qual letra falta em G, A, espaço, O?',
    reward_minutes: 5,
  },
  {
    id: 'lc-12',
    type: 'missing_letter',
    target_word: 'CASA',
    display_text: 'C A _ A',
    missing_letter: 'S',
    image_emoji_or_url: '🏠',
    options: ['S', 'L', 'M'],
    correct_answer: 'S',
    audio_prompt: 'Casa! Qual letra falta em C, A, espaço, A?',
    reward_minutes: 5,
  },
  {
    id: 'lc-13',
    type: 'missing_letter',
    target_word: 'SOL',
    display_text: 'S _ L',
    missing_letter: 'O',
    image_emoji_or_url: '☀️',
    options: ['O', 'A', 'U'],
    correct_answer: 'O',
    audio_prompt: 'Sol! Qual letra falta no meio da palavra Sol?',
    reward_minutes: 5,
  },
  {
    id: 'lc-14',
    type: 'missing_letter',
    target_word: 'PATO',
    display_text: 'P A _ O',
    missing_letter: 'T',
    image_emoji_or_url: '🦆',
    options: ['T', 'V', 'D'],
    correct_answer: 'T',
    audio_prompt: 'Pato! Qual letra falta em P, A, espaço, O?',
    reward_minutes: 5,
  },
  {
    id: 'lc-15',
    type: 'missing_letter',
    target_word: 'SAPO',
    display_text: 'S A _ O',
    missing_letter: 'P',
    image_emoji_or_url: '🐸',
    options: ['P', 'B', 'M'],
    correct_answer: 'P',
    audio_prompt: 'Sapo! Qual letra falta em S, A, espaço, O?',
    reward_minutes: 5,
  },

  // 3. "Caça à Letra Inicial"
  {
    id: 'lc-16',
    type: 'initial_sound',
    target_word: 'M',
    display_text: 'Qual palavra começa com a letra M?',
    image_emoji_or_url: '🔤',
    options: ['🍎 MAÇÃ', '🍌 BANANA', '🍇 UVA'],
    correct_answer: '🍎 MAÇÃ',
    audio_prompt: 'Qual fruta começa com a letra M?',
    reward_minutes: 5,
  },
  {
    id: 'lc-17',
    type: 'initial_sound',
    target_word: 'B',
    display_text: 'Qual começa com a letra B?',
    image_emoji_or_url: '🔤',
    options: ['⚽ BOLA', '🐱 GATO', '☀️ SOL'],
    correct_answer: '⚽ BOLA',
    audio_prompt: 'Qual dessas palavras começa com a letra B?',
    reward_minutes: 5,
  },
  {
    id: 'lc-18',
    type: 'initial_sound',
    target_word: 'C',
    display_text: 'Qual começa com a letra C?',
    image_emoji_or_url: '🔤',
    options: ['🏠 CASA', '🐸 SAPO', '🦆 PATO'],
    correct_answer: '🏠 CASA',
    audio_prompt: 'Qual dessas palavras começa com a letra C?',
    reward_minutes: 5,
  },
  {
    id: 'lc-19',
    type: 'initial_sound',
    target_word: 'G',
    display_text: 'Qual começa com a letra G?',
    image_emoji_or_url: '🔤',
    options: ['🐱 GATO', '🍎 MAÇÃ', '🌙 LUA'],
    correct_answer: '🐱 GATO',
    audio_prompt: 'Qual dessas palavras começa com a letra G?',
    reward_minutes: 5,
  },
  {
    id: 'lc-20',
    type: 'initial_sound',
    target_word: 'S',
    display_text: 'Qual começa com a letra S?',
    image_emoji_or_url: '🔤',
    options: ['☀️ SOL', '🚗 CARRO', '🍌 BANANA'],
    correct_answer: '☀️ SOL',
    audio_prompt: 'Qual dessas palavras começa com a letra S?',
    reward_minutes: 5,
  },
  {
    id: 'lc-21',
    type: 'initial_sound',
    target_word: 'P',
    display_text: 'Qual começa com a letra P?',
    image_emoji_or_url: '🔤',
    options: ['🦆 PATO', '⚽ BOLA', '🏠 CASA'],
    correct_answer: '🦆 PATO',
    audio_prompt: 'Qual dessas palavras começa com a letra P?',
    reward_minutes: 5,
  },
]

// Algoritmo Fisher-Yates para embaralhar itens de forma justa
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Gera uma sessão de 5 desafios variados com ordem das opções 100% aleatórias
export const generateLessonRound = (count = 5): LearningChallenge[] => {
  const shuffledChallenges = shuffle(INITIAL_LEARNING_CHALLENGES)
  const selected = shuffledChallenges.slice(0, count)

  return selected.map((challenge) => ({
    ...challenge,
    options: shuffle(challenge.options),
  }))
}
