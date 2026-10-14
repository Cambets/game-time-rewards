import React, { useState } from 'react'
import { getStoredSupabaseConfig, saveSupabaseConfig, resetSupabaseClient } from '../lib/supabase'
import { dataService } from '../services/dataService'
import { Database, Check, Copy, RefreshCw, X, ExternalLink, ShieldCheck, Zap } from 'lucide-react'

interface SupabaseModalProps {
  isOpen: boolean
  onClose: () => void
  onRefresh: () => void
}

const SUPABASE_SCHEMA_SQL = `-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  current_balance_minutes integer not null default 0,
  daily_max_minutes integer not null default 90,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TASK TEMPLATES TABLE
create table if not exists public.task_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  minutes_reward integer not null,
  icon text not null default 'Gamepad2',
  category text not null check (category in ('rotina', 'escola', 'casa', 'penalidade', 'resgate')),
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BALANCE LOGS TABLE
create table if not exists public.balance_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  task_title text not null,
  minutes_applied integer not null,
  recorded_by text not null check (recorded_by in ('Papai', 'Mamãe')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ACTIVE SESSIONS TABLE (Cronômetro sincronizado)
create table if not exists public.active_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  profile_name text not null,
  start_time bigint not null,
  end_time bigint not null,
  total_minutes integer not null,
  is_active boolean not null default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS & Realtime
alter table public.profiles enable row level security;
alter table public.task_templates enable row level security;
alter table public.balance_logs enable row level security;
alter table public.active_sessions enable row level security;

create policy "Allow all profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all task_templates" on public.task_templates for all using (true) with check (true);
create policy "Allow all balance_logs" on public.balance_logs for all using (true) with check (true);
create policy "Allow all active_sessions" on public.active_sessions for all using (true) with check (true);

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.balance_logs;
alter publication supabase_realtime add table public.task_templates;
alter publication supabase_realtime add table public.active_sessions;

-- Seed inicial para o Gael
insert into public.profiles (name, current_balance_minutes, daily_max_minutes)
values ('Gael', 45, 90) on conflict do nothing;`

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const currentConfig = getStoredSupabaseConfig()
  const [url, setUrl] = useState(currentConfig.url)
  const [key, setKey] = useState(currentConfig.key)
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = () => {
    saveSupabaseConfig(url, key)
    resetSupabaseClient()
    setStatusMessage('Configurações salvas! Reconectando...')
    setTimeout(() => {
      onRefresh()
      setStatusMessage(null)
      onClose()
    }, 800)
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isConnected = dataService.isSupabaseActive()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-surface border border-surface-border rounded-3xl shadow-2xl max-h-[90vh] my-auto relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-surface-border bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gamer font-bold text-base text-white">
                CONEXÃO SUPABASE & REALTIME
              </h3>
              <p className="text-xs text-slate-400">
                Sincronização em tempo real entre o celular do Pai e da Mãe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Status Banner */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              isConnected
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-emerald-400 shadow-glow-green animate-pulse' : 'bg-amber-400'
                }`}
              />
              <div>
                <p className="text-xs font-bold">
                  {isConnected
                    ? 'Conectado ao Supabase (Sincronizado)'
                    : 'Modo Local Ativo (LocalStorage)'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isConnected
                    ? 'Todas as alterações são replicadas instantaneamente para outros aparelhos.'
                    : 'O app funciona 100% offline salvando no seu celular.'}
                </p>
              </div>
            </div>
          </div>

          {/* Credentials Inputs */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gamer-purple" />
              Credenciais do seu Projeto Supabase
            </h4>
            
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gamer-purple font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Anon Public Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gamer-purple font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gamer-purple hover:bg-purple-600 text-white shadow-glow-purple transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar & Conectar</span>
              </button>

              <button
                onClick={() => {
                  saveSupabaseConfig('', '')
                  setUrl('')
                  setKey('')
                  resetSupabaseClient()
                  onRefresh()
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
                title="Limpar e usar modo local"
              >
                Usar Local
              </button>
            </div>

            {statusMessage && (
              <p className="text-xs text-emerald-400 text-center font-medium">{statusMessage}</p>
            )}
          </div>

          {/* SQL Script Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Script SQL para criar as tabelas no Supabase:
              </span>
              <button
                onClick={handleCopySql}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-36">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>

          {/* Reset Demo Data button */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-500">Testando ou reiniciando o app?</span>
            <button
              onClick={() => {
                if (confirm('Restaurar dados iniciais de demonstração?')) {
                  dataService.resetDemoData()
                  onRefresh()
                  onClose()
                }
              }}
              className="text-xs text-slate-400 hover:text-amber-400 underline font-medium"
            >
              Restaurar Dados Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
