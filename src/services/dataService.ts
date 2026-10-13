import { getSupabaseClient, getStoredSupabaseConfig } from '../lib/supabase'
import { Profile, TaskTemplate, BalanceLog, ActiveGameSession } from '../types'

const LOCAL_STORAGE_KEY_PROFILES = 'gametime_local_profiles_v2'
const LOCAL_STORAGE_KEY_TEMPLATES = 'gametime_local_templates_v2'
const LOCAL_STORAGE_KEY_LOGS = 'gametime_local_logs_v2'
const LOCAL_STORAGE_KEY_SESSION = 'gametime_local_session_v2'

// Initial seed data: Only Gael
const INITIAL_PROFILES: Profile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Gael',
    current_balance_minutes: 45,
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
  { id: 't14', title: 'Não Desligar na Hora', minutes_reward: -30, icon: 'Skull', category: 'penalidade', active: true },
  { id: 't15', title: 'Falar Mal / Gritar', minutes_reward: -15, icon: 'Flame', category: 'penalidade', active: true },

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
    recorded_by: 'Mamãe',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'l2',
    profile_id: '11111111-1111-1111-1111-111111111111',
    task_title: 'Dever de Casa / Leitura',
    minutes_applied: 15,
    recorded_by: 'Papai',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'l3',
    profile_id: '11111111-1111-1111-1111-111111111111',
    task_title: 'Guardar Brinquedos',
    minutes_applied: 10,
    recorded_by: 'Mamãe',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
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
        console.warn('Supabase getProfiles failed, using local:', err)
      }
    }

    return getLocalData<Profile[]>(LOCAL_STORAGE_KEY_PROFILES, INITIAL_PROFILES)
  },

  async updateProfileBalance(profileId: string, deltaMinutes: number): Promise<Profile> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data: current, error: fetchErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single()

        if (!fetchErr && current) {
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

  async undoBalanceLog(logId: string): Promise<void> {
    const logs = await this.getBalanceLogs()
    const target = logs.find(l => l.id === logId)
    if (!target) return

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

  // 4. ACTIVE GAME SESSION SYNC (Papai e Mamãe veem o mesmo cronômetro em tempo real)
  async getActiveSession(profileId: string): Promise<ActiveGameSession | null> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('active_sessions')
          .select('*')
          .eq('profile_id', profileId)
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!error && data) {
          const now = Date.now()
          const remainingSecs = Math.max(0, Math.floor((data.end_time - now) / 1000))
          return {
            id: data.id,
            profileId: data.profile_id,
            profileName: data.profile_name,
            startTime: Number(data.start_time),
            endTime: Number(data.end_time),
            totalMinutes: data.total_minutes,
            remainingSeconds: remainingSecs,
            isActive: data.is_active
          }
        }
      } catch (err) {
        console.warn('Supabase getActiveSession failed:', err)
      }
    }

    const localSession = getLocalData<ActiveGameSession | null>(LOCAL_STORAGE_KEY_SESSION, null)
    if (localSession && localSession.isActive && localSession.profileId === profileId) {
      const remainingSecs = Math.max(0, Math.floor((localSession.endTime - Date.now()) / 1000))
      return { ...localSession, remainingSeconds: remainingSecs }
    }
    return null
  },

  async startActiveSession(sessionData: Omit<ActiveGameSession, 'id'>): Promise<ActiveGameSession> {
    const newSession: ActiveGameSession = {
      ...sessionData,
      id: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        // Deactivate old sessions first
        await supabase
          .from('active_sessions')
          .update({ is_active: false })
          .eq('profile_id', newSession.profileId)

        // Insert new active session
        await supabase
          .from('active_sessions')
          .insert({
            id: newSession.id,
            profile_id: newSession.profileId,
            profile_name: newSession.profileName,
            start_time: newSession.startTime,
            end_time: newSession.endTime,
            total_minutes: newSession.totalMinutes,
            is_active: true,
            updated_at: new Date().toISOString()
          })
      } catch (err) {
        console.warn('Supabase startActiveSession failed:', err)
      }
    }

    setLocalData(LOCAL_STORAGE_KEY_SESSION, newSession)
    return newSession
  },

  async stopActiveSession(profileId: string): Promise<void> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        await supabase
          .from('active_sessions')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('profile_id', profileId)
      } catch (err) {
        console.warn('Supabase stopActiveSession failed:', err)
      }
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION)
  },

  async addToleranceToSession(profileId: string, additionalMinutes: number): Promise<void> {
    const current = await this.getActiveSession(profileId)
    if (!current) return

    const newEndTime = current.endTime + additionalMinutes * 60 * 1000
    const newTotal = current.totalMinutes + additionalMinutes

    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        await supabase
          .from('active_sessions')
          .update({
            end_time: newEndTime,
            total_minutes: newTotal,
            updated_at: new Date().toISOString()
          })
          .eq('profile_id', profileId)
          .eq('is_active', true)
      } catch (err) {
        console.warn('Supabase addToleranceToSession failed:', err)
      }
    }

    const updated = {
      ...current,
      endTime: newEndTime,
      totalMinutes: newTotal,
      remainingSeconds: Math.max(0, Math.floor((newEndTime - Date.now()) / 1000))
    }
    setLocalData(LOCAL_STORAGE_KEY_SESSION, updated)
  },

  // Setup Realtime Subscription
  subscribeToChanges(onUpdate: () => void): () => void {
    const supabase = getSupabaseClient()
    if (!supabase) return () => {}

    try {
      const channel = supabase
        .channel('gametime_realtime_v2')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => onUpdate())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'balance_logs' }, () => onUpdate())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'task_templates' }, () => onUpdate())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'active_sessions' }, () => onUpdate())
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (e) {
      console.warn('Realtime subscription failed:', e)
      return () => {}
    }
  },

  resetDemoData(): void {
    setLocalData(LOCAL_STORAGE_KEY_PROFILES, INITIAL_PROFILES)
    setLocalData(LOCAL_STORAGE_KEY_TEMPLATES, INITIAL_TEMPLATES)
    setLocalData(LOCAL_STORAGE_KEY_LOGS, INITIAL_LOGS)
    localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION)
  }
}
