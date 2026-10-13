import { createClient, SupabaseClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check URL parameters or hash for instant one-click pairing between spouses
const checkUrlForPairing = () => {
  if (typeof window === 'undefined') return

  try {
    const urlObj = new URL(window.location.href)
    let urlParam = urlObj.searchParams.get('sb_url')
    let keyParam = urlObj.searchParams.get('sb_key')
    const roleParam = urlObj.searchParams.get('role')

    // Also check hash #sb_url=...&sb_key=...
    if (!urlParam && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      urlParam = hashParams.get('sb_url')
      keyParam = hashParams.get('sb_key')
    }

    if (urlParam && keyParam) {
      saveSupabaseConfig(decodeURIComponent(urlParam), decodeURIComponent(keyParam))
      if (roleParam === 'mamae') {
        localStorage.setItem('gametime_author', 'Mamãe')
      } else if (roleParam === 'papai') {
        localStorage.setItem('gametime_author', 'Papai')
      }
      
      // Clean URL from browser bar without page reload
      const cleanUrl = window.location.origin + window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
    }
  } catch (e) {
    console.warn('Erro ao processar link de pareamento:', e)
  }
}

// Run pairing check immediately
checkUrlForPairing()

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

export const generateShareLink = (targetRole: 'Mamãe' | 'Papai'): string => {
  const { url, key, isConfigured } = getStoredSupabaseConfig()
  const base = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'http://localhost:5173'
  
  if (!isConfigured) {
    return base
  }

  const roleSlug = targetRole === 'Mamãe' ? 'mamae' : 'papai'
  return `${base}?sb_url=${encodeURIComponent(url)}&sb_key=${encodeURIComponent(key)}&role=${roleSlug}`
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
