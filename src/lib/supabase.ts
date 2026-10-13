import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Retrieve credentials from Vite env or LocalStorage fallback (allows config directly in app)
const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const getStoredSupabaseConfig = () => {
  const customUrl = localStorage.getItem('gametime_supabase_url') || envUrl
  const customKey = localStorage.getItem('gametime_supabase_key') || envAnonKey
  return {
    url: customUrl.trim(),
    key: customKey.trim(),
    isConfigured: Boolean(customUrl && customKey && !customUrl.includes('placeholder'))
  }
}

export const saveSupabaseConfig = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('gametime_supabase_url', url.trim())
    localStorage.setItem('gametime_supabase_key', key.trim())
  } else {
    localStorage.removeItem('gametime_supabase_url')
    localStorage.removeItem('gametime_supabase_key')
  }
}

let supabaseInstance: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getStoredSupabaseConfig()
  
  if (!isConfigured) {
    return null
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
    } catch (err) {
      console.warn('Falha ao inicializar cliente Supabase:', err)
      return null
    }
  }

  return supabaseInstance
}

export const resetSupabaseClient = () => {
  supabaseInstance = null
}
