import { getSupabaseClient, getStoredSupabaseConfig } from '../lib/supabase'
import { Profile, TaskTemplate, BalanceLog } from '../types'

const LOCAL_STORAGE_KEY_PROFILES = 'gametime_local_profiles_v1'
const LOCAL_STORAGE_KEY_TEMPLATES = 'gametime_local_templates_v1'
const LOCAL_STORAGE_KEY_LOGS = 'gametime_local_logs_v1'

// Initial seed data for local storage mode
const INITIAL_PROFILES: Profile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Lucas (Filho)',
    current_balance_minutes: 45,
    daily_max_minutes: 90,
    updated_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Sofia (Filha)',
    current_balance_minutes: 30,
    daily_max_minutes: 90,
    updated_at: new Date().toISOString()
  }
]

const INITIAL_TEMPLATES: TaskTemplate[] = [
  // Rotina & Casa
  { id: 't1', title: 'Arrumar a Cama', minutes_reward: 10, icon: 'Bed', category: 'rotina', active: true },
  { id: 't2', title: 'Banho sem enrolar', minutes_reward: 10, icon: 'ShowerHead', category: 'rotina', active: true },
  { id: 't3', title: 'Escovar os Dentes', minutes_reward: 5, icon: 'Sparkles', category: 'rotina', active: true },
  { id: 't4', title: 'Dormir no Horário', minutes_reward: 15, icon: 'Moon', category: 'rotina', active: true },
  
  { id: 't5', title: 'Guardar Brinquedos', minutes_reward: 10, icon: 'Boxes', category: 'casa', active: true },
  { id: 't6', title: 'Ajudar na Mesa', minutes_reward: 10, icon: 'Utensils', category: 'casa', active: true },
  { id: 't7', title: 'Alimentar o Pet', minutes_reward: 10, icon: 'Dog', category: 'casa', active: true },
  { id: 't8', title: 'Organizar o Quarto', minutes_reward: 15, icon: 'Home', category: 'casa', active: true },

  // Foco & Estudos
  { id: 't9', title: 'Dever de Casa / Leitura', minutes_reward: 15, icon: 'BookOpen', category: 'escola', active: true },
  { id: 't10', title: 'Mochila Organizada', minutes_reward: 10, icon: 'Backpack', category: 'escola', active: true },
  { id: 't11', title: 'Nota 10 / Elogio na Escola', minutes_reward: 30, icon: 'Trophy', category: 'escola', active: true },

  // Alertas / Penalidades
  { id: 't12', title: 'Desobediência / Birra', minutes_reward: -15, icon: 'AlertTriangle', category: 'penalidade', active: true },
  { id: 't13', title: 'Enrolar / Reclamar', minutes_reward: -10, icon: 'ClockAlert', category: 'penalidade', active: true },
  { id: 't14', title: 'Briga com Irmão(ã)', minutes_reward: -20, icon: 'Flame', category: 'penalidade', active: true },
  { id: 't15', title: 'Não Desligar na Hora', minutes_reward: -30, icon: 'Skull', category: 'penalidade', active: true },

  // Resgate / Jogo
  { id: 't16', title: '🎮 Sessão Rápida (-15m)', minutes_reward: -15, icon: 'Zap', category: 'resgate', active: true },
  { id: 't17', title: '🎮 Iniciar Jogo (-30m)', minutes_reward: -30, icon: 'Gamepad2', category: 'resgate', active: true },
  { id: 't18', title: '🎮 Sessão Longa (-60m)', minutes_reward: -60, icon: 'Flame', category: 'resgate', active: true },
]

const INITIAL_LOGS: BalanceLog[] = [
  {
    id: 'l1',
    profile_id: '11111111-1111-1111-1111-111111111111',
    task_title: 'Arrumar a Cama',
    minutes_applied: 10,
    recorded_by: 'Mãe',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 'l2',
    profile_id: '11111111-1111-1111-1111-111111111111',
    task_title: 'Dever de Casa / Leitura',
    minutes_applied: 15,
    recorded_by: 'Pai',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'l3',
    profile_id: '11111111-1111-1111-1111-111111111111',
    task_title: 'Guardar Brinquedos',
    minutes_applied: 10,
    recorded_by: 'Mãe',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'l4',
    profile_id: '11111111-1111-1111-1111-111111111111',
    task_title: 'Banho sem enrolar',
    minutes_applied: 10,
    recorded_by: 'Pai',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
]

// Local Storage helpers
const getLocalData = <T>(key: string, defaultVal: T): T => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultVal
    return JSON.parse(raw) as T
  } catch {
    return defaultVal
  }
}

const setLocalData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('LocalStorage write error:', e)
  }
}

export const dataService = {
  // Check if active provider is Supabase or Local
  isSupabaseActive(): boolean {
    const supabase = getSupabaseClient()
    return Boolean(supabase)
  },

  getConnectionStatus(): 'supabase' | 'local' {
    const { isConfigured } = getStoredSupabaseConfig()
    return isConfigured ? 'supabase' : 'local'
  },

  // 1. PROFILES
  async getProfiles(): Promise<Profile[]> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('name', { ascending: true })

        if (!error && data && data.length > 0) {
          return data as Profile[]
        }
      } catch (err) {
        console.warn('Supabase getProfiles failed, falling back to local:', err)
      }
    }

    return getLocalData<Profile[]>(LOCAL_STORAGE_KEY_PROFILES, INITIAL_PROFILES)
  },

  async updateProfileBalance(profileId: string, deltaMinutes: number): Promise<Profile> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        // Fetch current profile to calculate new balance
        const { data: current, error: fetchErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single()

        if (!fetchErr && current) {
          // Prevent negative balance: minimum 0 minutes
          const newBalance = Math.max(0, (current.current_balance_minutes || 0) + deltaMinutes)
          
          const { data: updated, error: updateErr } = await supabase
            .from('profiles')
            .update({
              current_balance_minutes: newBalance,
              updated_at: new Date().toISOString()
            })
            .eq('id', profileId)
            .select()
            .single()

          if (!updateErr && updated) {
            return updated as Profile
          }
        }
      } catch (err) {
        console.warn('Supabase updateProfileBalance failed, using local update:', err)
      }
    }

    // Local Storage Fallback
    const profiles = getLocalData<Profile[]>(LOCAL_STORAGE_KEY_PROFILES, INITIAL_PROFILES)
    let updatedProfile: Profile | null = null

    const updatedList = profiles.map(p => {
      if (p.id === profileId) {
        const newBalance = Math.max(0, p.current_balance_minutes + deltaMinutes)
        updatedProfile = {
          ...p,
          current_balance_minutes: newBalance,
          updated_at: new Date().toISOString()
        }
        return updatedProfile
      }
      return p
    })

    setLocalData(LOCAL_STORAGE_KEY_PROFILES, updatedList)
    return updatedProfile || profiles[0]
  },

  async updateDailyMax(profileId: string, dailyMaxMinutes: number): Promise<void> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ daily_max_minutes: dailyMaxMinutes, updated_at: new Date().toISOString() })
          .eq('id', profileId)
      } catch (err) {
        console.warn('Supabase updateDailyMax failed:', err)
      }
    }

    const profiles = getLocalData<Profile[]>(LOCAL_STORAGE_KEY_PROFILES, INITIAL_PROFILES)
    const updated = profiles.map(p => p.id === profileId ? { ...p, daily_max_minutes: dailyMaxMinutes } : p)
    setLocalData(LOCAL_STORAGE_KEY_PROFILES, updated)
  },

  async createProfile(name: string, dailyMax = 90): Promise<Profile> {
    const newProfile: Profile = {
      id: crypto.randomUUID ? crypto.randomUUID() : `profile-${Date.now()}`,
      name,
      current_balance_minutes: 0,
      daily_max_minutes: dailyMax,
      updated_at: new Date().toISOString()
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()

        if (!error && data) {
          return data as Profile
        }
      } catch (err) {
        console.warn('Supabase createProfile failed, saving local:', err)
      }
    }

    const profiles = getLocalData<Profile[]>(LOCAL_STORAGE_KEY_PROFILES, INITIAL_PROFILES)
    profiles.push(newProfile)
    setLocalData(LOCAL_STORAGE_KEY_PROFILES, profiles)
    return newProfile
  },

  // 2. TASK TEMPLATES
  async getTaskTemplates(): Promise<TaskTemplate[]> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('task_templates')
          .select('*')
          .eq('active', true)
          .order('minutes_reward', { ascending: false })

        if (!error && data && data.length > 0) {
          return data as TaskTemplate[]
        }
      } catch (err) {
        console.warn('Supabase getTaskTemplates failed, using local:', err)
      }
    }

    return getLocalData<TaskTemplate[]>(LOCAL_STORAGE_KEY_TEMPLATES, INITIAL_TEMPLATES)
  },

  async addTaskTemplate(template: Omit<TaskTemplate, 'id'>): Promise<TaskTemplate> {
    const newTemplate: TaskTemplate = {
      ...template,
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('task_templates')
          .insert(newTemplate)
          .select()
          .single()

        if (!error && data) {
          return data as TaskTemplate
        }
      } catch (err) {
        console.warn('Supabase addTaskTemplate failed:', err)
      }
    }

    const templates = getLocalData<TaskTemplate[]>(LOCAL_STORAGE_KEY_TEMPLATES, INITIAL_TEMPLATES)
    templates.push(newTemplate)
    setLocalData(LOCAL_STORAGE_KEY_TEMPLATES, templates)
    return newTemplate
  },

  async deleteTaskTemplate(id: string): Promise<void> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        await supabase.from('task_templates').delete().eq('id', id)
      } catch (err) {
        console.warn('Supabase deleteTaskTemplate failed:', err)
      }
    }

    const templates = getLocalData<TaskTemplate[]>(LOCAL_STORAGE_KEY_TEMPLATES, INITIAL_TEMPLATES)
    const filtered = templates.filter(t => t.id !== id)
    setLocalData(LOCAL_STORAGE_KEY_TEMPLATES, filtered)
  },

  // 3. BALANCE LOGS
  async getBalanceLogs(profileId?: string, limit = 50): Promise<BalanceLog[]> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        let query = supabase
          .from('balance_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (profileId) {
          query = query.eq('profile_id', profileId)
        }

        const { data, error } = await query
        if (!error && data) {
          return data as BalanceLog[]
        }
      } catch (err) {
        console.warn('Supabase getBalanceLogs failed, using local:', err)
      }
    }

    const logs = getLocalData<BalanceLog[]>(LOCAL_STORAGE_KEY_LOGS, INITIAL_LOGS)
    if (profileId) {
      return logs.filter(l => l.profile_id === profileId).slice(0, limit)
    }
    return logs.slice(0, limit)
  },

  async addBalanceLog(logData: Omit<BalanceLog, 'id' | 'created_at'>): Promise<BalanceLog> {
    const newLog: BalanceLog = {
      ...logData,
      id: crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}`,
      created_at: new Date().toISOString()
    }

    // Simultaneously update profile balance and insert log
    await this.updateProfileBalance(newLog.profile_id, newLog.minutes_applied)

    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('balance_logs')
          .insert(newLog)
          .select()
          .single()

        if (!error && data) {
          return data as BalanceLog
        }
      } catch (err) {
        console.warn('Supabase addBalanceLog failed, saving locally:', err)
      }
    }

    const logs = getLocalData<BalanceLog[]>(LOCAL_STORAGE_KEY_LOGS, INITIAL_LOGS)
    logs.unshift(newLog)
    setLocalData(LOCAL_STORAGE_KEY_LOGS, logs)
    return newLog
  },

  // Undo a recent transaction (e.g. if parent misclicked)
  async undoBalanceLog(logId: string): Promise<void> {
    const logs = await this.getBalanceLogs()
    const target = logs.find(l => l.id === logId)
    if (!target) return

    // Reverse the balance impact: invert minutes_applied
    await this.updateProfileBalance(target.profile_id, -target.minutes_applied)

    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        await supabase.from('balance_logs').delete().eq('id', logId)
      } catch (err) {
        console.warn('Supabase undoBalanceLog failed:', err)
      }
    }

    const currentLogs = getLocalData<BalanceLog[]>(LOCAL_STORAGE_KEY_LOGS, INITIAL_LOGS)
    const filtered = currentLogs.filter(l => l.id !== logId)
    setLocalData(LOCAL_STORAGE_KEY_LOGS, filtered)
  },

  // Setup Supabase Realtime Subscription if configured
  subscribeToChanges(onUpdate: () => void): () => void {
    const supabase = getSupabaseClient()
    if (!supabase) return () => {}

    try {
      const channel = supabase
        .channel('gametime_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          onUpdate()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'balance_logs' }, () => {
          onUpdate()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'task_templates' }, () => {
          onUpdate()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (e) {
      console.warn('Realtime subscription failed:', e)
      return () => {}
    }
  },

  // Reset to demo initial data
  resetDemoData(): void {
    setLocalData(LOCAL_STORAGE_KEY_PROFILES, INITIAL_PROFILES)
    setLocalData(LOCAL_STORAGE_KEY_TEMPLATES, INITIAL_TEMPLATES)
    setLocalData(LOCAL_STORAGE_KEY_LOGS, INITIAL_LOGS)
  }
}
