export type ParentAuthor = 'Papai' | 'Mamãe'

export type TaskCategory = 'rotina' | 'escola' | 'casa' | 'penalidade' | 'resgate'

export interface Profile {
  id: string
  name: string
  current_balance_minutes: number
  daily_max_minutes: number
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
