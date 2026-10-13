export type ParentAuthor = 'Papai' | 'Mamãe'

export type AppMode = 'kid' | 'parent'

export type KidAvatar = 'warrior' | 'robot' | 'mage' | 'racer' | 'astronaut'

export type PetType = 'robot' | 'dragon' | 'dog' | 'cat'

export type TaskCategory = 'rotina' | 'escola' | 'casa' | 'penalidade' | 'resgate'

export interface Profile {
  id: string
  name: string
  current_balance_minutes: number
  daily_max_minutes: number
  avatar_id?: KidAvatar
  xp?: number
  roulette_spins?: number // Giros disponíveis da Roleta concedidos pelos Pais
  last_praise?: string
  last_praise_author?: ParentAuthor
  avatar_url?: string
  updated_at: string
}

export interface TaskTemplate {
  id: string
  title: string
  minutes_reward: number // positivo para ganho (+10), negativo para penalidade/uso (-15)
  icon: string
  category: TaskCategory
  active: boolean
  created_at?: string
}

export interface BalanceLog {
  id: string
  profile_id: string
  task_title: string
  minutes_applied: number
  recorded_by: ParentAuthor
  created_at: string
}

export interface PendingTask {
  id: string
  profile_id: string
  template_id: string
  task_title: string
  minutes_reward: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface ActiveGameSession {
  id: string
  profileId: string
  profileName: string
  startTime: number // epoch ms
  endTime: number // epoch ms para sincronização exata entre aparelhos
  totalMinutes: number
  remainingSeconds: number
  isActive: boolean
}

export type LearningChallengeType = 'word_match' | 'missing_letter' | 'initial_sound'

export interface LearningChallenge {
  id: string
  type: LearningChallengeType
  target_word: string
  display_text?: string
  missing_letter?: string
  image_emoji_or_url: string
  options: string[]
  correct_answer: string
  audio_prompt: string
  reward_minutes?: number
}

