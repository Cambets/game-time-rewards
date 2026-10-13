# 🎮 GameTime Rewards - Gerenciador Gamer de Tempo de Videogame

Um Web App responsivo (mobile-first / PWA) projetado especificamente para pais gerenciarem o tempo de videogame dos filhos através de tarefas, rotinas cumpridas e regras claras de convivência.

---

## ⚡ Principais Funcionalidades

1. **Cabeçalho & Alternador Rápido de Autor:**
   - Botão rápido no topo: `[ Pai ]` ou `[ Mãe ]`. Todo crédito ou penalidade fica auditado e carimbado com o nome de quem registrou.
   - Alternador rápido entre filhos cadastrados (ex: *Lucas* e *Sofia*).

2. **Hero Card de Saldo Gamer:**
   - Destaque em tipografia gamer do tempo acumulado atual (ex: `45 MIN`).
   - Barra de progresso comparando com o teto diário (ex: `45 / 90 min`).
   - Botão de resgate rápido com confirmação: `🎮 INICIAR JOGO (-30 MIN)` e opções de 15m, 30m, 45m, 60m.

3. **Cronômetro de Sessão Ativa ao Vivo:**
   - Ao iniciar o jogo, um cronômetro regressivo entra em contagem regressiva em destaque na tela.
   - Alarme sonoro 8-bit sintetizado quando o tempo se esgota.
   - Botão de tolerância extra (`+5m`) e pausa.

4. **Grade de Missões Rápidas (1 Toque no Celular):**
   - **Rotina & Higiene:** Arrumar a Cama (+10m), Banho sem enrolar (+10m), Escovar Dentes (+5m), Dormir no Horário (+15m).
   - **Casa:** Guardar Brinquedos (+10m), Ajudar na Mesa (+10m), Alimentar Pet (+10m), Organizar Quarto (+15m).
   - **Estudos & Foco:** Dever de Casa / Leitura (+15m), Mochila Organizada (+10m), Nota 10 / Elogio (+30m).
   - **Alertas / Penalidades (Destaque Vermelho):** Desobediência / Birra (-15m), Enrolar / Reclamar (-10m), Briga com Irmão (-20m), Não Desligar na Hora (-30m).

5. **Feedback Imediato & Gamificação:**
   - Efeitos sonoros 8-bit sintetizados via Web Audio API (sem dependência de arquivos externos).
   - Vibração tátil (Haptics) para celulares.
   - Chuva de confetes coloridos nas conquistas.

6. **Auditoria & Histórico com Desfazer:**
   - Registros detalhados com data, hora, motivo e autor (Pai ou Mãe).
   - Botão de **Desfazer** para reverter cliques acidentais.

7. **Supabase Realtime + Modo Local Offline:**
   - Funciona imediatamente em **Modo Local (LocalStorage)** para demonstração e uso sem configuração prévia.
   - Sincronização em tempo real via **Supabase Realtime** configurável com 1 clique direto na interface ou via `.env`.

---

## 🚀 Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

Acesse em seu navegador ou no celular: `http://localhost:5173`.

---

## 🗄️ Estrutura do Banco de Dados no Supabase

Basta colar o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql) no **SQL Editor** do seu painel do Supabase. O script cria:

1. `profiles`:
   - `id` (uuid, primary key)
   - `name` (text)
   - `current_balance_minutes` (integer, default 0)
   - `daily_max_minutes` (integer, default 90)
   - `updated_at` (timestamptz)

2. `task_templates`:
   - `id` (uuid, primary key)
   - `title` (text)
   - `minutes_reward` (integer)
   - `icon` (text)
   - `category` (rotina, escola, casa, penalidade, resgate)
   - `active` (boolean, default true)

3. `balance_logs`:
   - `id` (uuid, primary key)
   - `profile_id` (uuid, fk profiles)
   - `task_title` (text)
   - `minutes_applied` (integer)
   - `recorded_by` (text: 'Pai' ou 'Mãe')
   - `created_at` (timestamptz, default now())

E ativa o **Supabase Realtime** nas tabelas para atualização instantânea entre celulares.
