-- =========================================================
-- GameTime Rewards - Supabase Database Schema & Seed Data
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  current_balance_minutes integer not null default 0,
  daily_max_minutes integer not null default 90,
  avatar_id text not null default 'warrior',
  xp integer not null default 120,
  roulette_spins integer not null default 0,
  last_praise text,
  last_praise_author text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TASK TEMPLATES TABLE
create table if not exists public.task_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  minutes_reward integer not null, -- positivo para ganho, negativo para penalidade/uso
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
  recorded_by text not null check (recorded_by in ('Pai', 'Mãe', 'Papai', 'Mamãe')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ACTIVE SESSIONS TABLE (Cronômetro em tempo real sincronizado)
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

-- 5. PENDING TASKS TABLE (Missões que o Gael marcou como feitas e aguardam aprovação dos Pais)
create table if not exists public.pending_tasks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  template_id text not null,
  task_title text not null,
  minutes_reward integer not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. LEARNING CHALLENGES TABLE (Modo Aprender / Academia do Conhecimento)
create table if not exists public.learning_challenges (
  id text primary key,
  type text not null check (type in ('word_match', 'missing_letter', 'initial_sound')),
  target_word text not null,
  display_text text,
  missing_letter text,
  image_emoji_or_url text not null,
  options jsonb not null,
  correct_answer text not null,
  audio_prompt text not null,
  reward_minutes integer not null default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create helpful indexes
create index if not exists idx_balance_logs_profile_id on public.balance_logs(profile_id);
create index if not exists idx_balance_logs_created_at on public.balance_logs(created_at desc);
create index if not exists idx_task_templates_category on public.task_templates(category);
create index if not exists idx_pending_tasks_profile on public.pending_tasks(profile_id, status);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.task_templates enable row level security;
alter table public.balance_logs enable row level security;
alter table public.active_sessions enable row level security;
alter table public.pending_tasks enable row level security;
alter table public.learning_challenges enable row level security;

-- Policies for access
create policy "Allow all operations for profiles" on public.profiles
  for all using (true) with check (true);

create policy "Allow all operations for task_templates" on public.task_templates
  for all using (true) with check (true);

create policy "Allow all operations for balance_logs" on public.balance_logs
  for all using (true) with check (true);

create policy "Allow all operations for active_sessions" on public.active_sessions
  for all using (true) with check (true);

create policy "Allow all operations for pending_tasks" on public.pending_tasks
  for all using (true) with check (true);

create policy "Allow all operations for learning_challenges" on public.learning_challenges
  for all using (true) with check (true);

-- Enable Supabase Realtime for instant multi-device sync
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.balance_logs;
alter publication supabase_realtime add table public.task_templates;
alter publication supabase_realtime add table public.active_sessions;
alter publication supabase_realtime add table public.pending_tasks;
alter publication supabase_realtime add table public.learning_challenges;

-- =========================================================
-- SEED DATA (Gael)
-- =========================================================

insert into public.profiles (id, name, current_balance_minutes, daily_max_minutes, avatar_id, xp)
values 
  ('11111111-1111-1111-1111-111111111111', 'Gael', 0, 90, 'warrior', 0)
on conflict (id) do update set current_balance_minutes = 0, xp = 0;

-- Task Templates
insert into public.task_templates (title, minutes_reward, icon, category, active)
values
  -- Rotina
  ('Arrumar a Cama', 10, 'Bed', 'rotina', true),
  ('Banho sem enrolar', 10, 'ShowerHead', 'rotina', true),
  ('Escovar os Dentes', 5, 'Sparkles', 'rotina', true),
  ('Dormir no Horário', 15, 'Moon', 'rotina', true),
  
  -- Casa
  ('Guardar Brinquedos', 10, 'Boxes', 'casa', true),
  ('Ajudar na Mesa', 10, 'Utensils', 'casa', true),
  ('Alimentar o Pet', 10, 'Dog', 'casa', true),
  ('Organizar o Quarto', 15, 'Home', 'casa', true),

  -- Foco & Estudos
  ('Dever de Casa / Leitura', 15, 'BookOpen', 'escola', true),
  ('Mochila Organizada', 10, 'Backpack', 'escola', true),
  ('Nota 10 / Elogio na Escola', 30, 'Trophy', 'escola', true),

  -- Alertas / Penalidades
  ('Desobediência / Birra', -15, 'AlertTriangle', 'penalidade', true),
  ('Enrolar / Reclamar', -10, 'ClockAlert', 'penalidade', true),
  ('Não Desligar na Hora', -30, 'Skull', 'penalidade', true),
  ('Falar Mal / Gritar', -15, 'Flame', 'penalidade', true),

  -- Resgate / Jogo
  ('🎮 Iniciar Jogo (Sessão Rápida)', -15, 'Zap', 'resgate', true),
  ('🎮 Iniciar Jogo (Sessão Padrão)', -30, 'Gamepad2', 'resgate', true),
  ('🎮 Iniciar Jogo (Sessão Longa)', -60, 'Flame', 'resgate', true);
