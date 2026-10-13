-- =========================================================
-- GameTime Rewards - Supabase Database Schema & Seed Data
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  current_balance_minutes integer not null default 0,
  daily_max_minutes integer not null default 90,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TASK TEMPLATES TABLE
create table if not exists public.task_templates (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  minutes_reward integer not null, -- positivo para ganho, negativo para penalidade/uso
  icon text not null default 'Gamepad2',
  category text not null check (category in ('rotina', 'escola', 'casa', 'penalidade', 'resgate')),
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BALANCE LOGS TABLE
create table if not exists public.balance_logs (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  task_title text not null,
  minutes_applied integer not null,
  recorded_by text not null check (recorded_by in ('Pai', 'Mãe')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create helpful indexes
create index if not exists idx_balance_logs_profile_id on public.balance_logs(profile_id);
create index if not exists idx_balance_logs_created_at on public.balance_logs(created_at desc);
create index if not exists idx_task_templates_category on public.task_templates(category);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.task_templates enable row level security;
alter table public.balance_logs enable row level security;

-- Policies for anon & authenticated access (Parent dashboard quick mode)
create policy "Allow all operations for profiles" on public.profiles
  for all using (true) with check (true);

create policy "Allow all operations for task_templates" on public.task_templates
  for all using (true) with check (true);

create policy "Allow all operations for balance_logs" on public.balance_logs
  for all using (true) with check (true);

-- Enable Supabase Realtime for instant multi-device sync
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.balance_logs;
alter publication supabase_realtime add table public.task_templates;

-- =========================================================
-- SEED DATA
-- =========================================================

-- Profiles
insert into public.profiles (id, name, current_balance_minutes, daily_max_minutes)
values 
  ('11111111-1111-1111-1111-111111111111', 'Lucas (Filho)', 45, 90),
  ('22222222-2222-2222-2222-222222222222', 'Sofia (Filha)', 30, 90)
on conflict (id) do nothing;

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
  ('Briga com Irmão(ã)', -20, 'Flame', 'penalidade', true),
  ('Não Desligar na Hora', -30, 'Skull', 'penalidade', true),

  -- Resgate / Jogo
  ('🎮 Iniciar Jogo (Sessão Rápida)', -15, 'Zap', 'resgate', true),
  ('🎮 Iniciar Jogo (Sessão Padrão)', -30, 'Gamepad2', 'resgate', true),
  ('🎮 Iniciar Jogo (Sessão Longa)', -60, 'Flame', 'resgate', true);
