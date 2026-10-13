// Web Audio API NES 8-bit Mario sound synthesizer, Game Over, Star Power & Wheel sounds

class SoundManager {
  private audioCtx: AudioContext | null = null
  private alarmInterval: number | null = null

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  // 🪙 SUPER MARIO COIN SOUND (+ Minutos / Recompensa)
  playReward() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(987.77, now) // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.075) // E6

      gain.gain.setValueAtTime(0.22, now)
      gain.gain.setValueAtTime(0.22, now + 0.075)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.45)

      this.vibrate([40, 30, 60])
    } catch (e) {
      console.warn('Audio playReward error:', e)
    }
  }

  // 🍄 SUPER MARIO 1-UP MUSHROOM (Bônus Especiais / Nível UP)
  play1Up() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const notes = [
        { f: 659.25, d: 0.08 }, // E5
        { f: 783.99, d: 0.08 }, // G5
        { f: 1318.51, d: 0.08 }, // E6
        { f: 1046.50, d: 0.08 }, // C6
        { f: 1174.66, d: 0.08 }, // D6
        { f: 1567.98, d: 0.18 }, // G6
      ]

      let currentOffset = now
      notes.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'square'
        osc.frequency.setValueAtTime(note.f, currentOffset)

        gain.gain.setValueAtTime(0.18, currentOffset)
        gain.gain.exponentialRampToValueAtTime(0.001, currentOffset + note.d)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(currentOffset)
        osc.stop(currentOffset + note.d)

        currentOffset += note.d + 0.02
      })

      this.vibrate([40, 20, 40, 20, 80])
    } catch (e) {
      console.warn('Audio play1Up error:', e)
    }
  }

  // ⭐ SUPER MARIO STAR POWER (Estrela da Invencibilidade / Roleta Bônus Épico!)
  playStarPower() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      // Notas icônicas aceleradas da Estrela do Mario
      const starNotes = [
        392.00, 392.00, 392.00, 293.66, 392.00, 293.66, 392.00, 293.66, 
        440.00, 440.00, 440.00, 329.63, 440.00, 329.63, 440.00, 329.63,
        493.88, 523.25, 587.33, 659.25, 783.99
      ]

      starNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'square'
        const start = now + idx * 0.065
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.15, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + 0.06)
      })

      this.vibrate([30, 20, 30, 20, 30, 20, 80])
    } catch (e) {
      console.warn('Audio playStarPower error:', e)
    }
  }

  // 🎡 TICK DE ROLETA (Clique de giro mecânico)
  playWheelTick() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1400, now)
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.03)

      if (navigator.vibrate) navigator.vibrate(15)
    } catch {
      // Ignored
    }
  }

  // 🤖 PIXEL PET COMPANION REACTION (Sons fofos ao tocar no mascote)
  playPetReaction() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const freqs = [
        [587.33, 880],
        [659.25, 987.77],
        [783.99, 1174.66],
        [523.25, 659.25, 783.99, 1046.50]
      ]
      const chosen = freqs[Math.floor(Math.random() * freqs.length)]

      chosen.forEach((f, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        const start = now + idx * 0.06
        osc.frequency.setValueAtTime(f, start)

        gain.gain.setValueAtTime(0.18, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + 0.08)
      })

      this.vibrate([30, 20, 30])
    } catch {
      // Ignored
    }
  }

  // 💀 SUPER MARIO MISS / LOST LIFE SOUND (- Minutos / Penalidade)
  playPenalty() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const deathNotes = [
        { f: 493.88, start: 0.00, dur: 0.08 }, // B4
        { f: 698.46, start: 0.10, dur: 0.08 }, // F5
        { f: 0,      start: 0.19, dur: 0.03 }, // Pausa sutil
        { f: 698.46, start: 0.23, dur: 0.08 }, // F5
        { f: 659.25, start: 0.33, dur: 0.08 }, // E5
        { f: 587.33, start: 0.43, dur: 0.08 }, // D5
        { f: 523.25, start: 0.53, dur: 0.22 }, // C5 final sustentada
      ]

      deathNotes.forEach((item) => {
        if (item.f === 0) return

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'square'
        const start = now + item.start
        osc.frequency.setValueAtTime(item.f, start)

        gain.gain.setValueAtTime(0.18, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + item.dur)
      })

      this.vibrate([100, 50, 100, 50, 150])
    } catch (e) {
      console.warn('Audio playPenalty error:', e)
    }
  }

  // 🌟 GENTLE TRY AGAIN (Incentivo fofo e sem punição para erros do Gael)
  playGentleTryAgain() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.15)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.18)

      this.vibrate([25])
    } catch {
      // Ignored
    }
  }

  // 🎮 SUPER MARIO POWER-UP (Iniciar Sessão de Jogo)
  playRedeem() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const mushroomNotes = [
        330, 392, 659, 523, 587, 784, 659, 784, 988, 784, 880, 1046
      ]

      mushroomNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        const start = now + idx * 0.04
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.16, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + 0.05)
      })

      this.vibrate([60, 40, 80, 40, 120])
    } catch (e) {
      console.warn('Audio playRedeem error:', e)
    }
  }

  // 🚫 ARCADE GAME OVER TUNE (Tempo Esgotado / Bloqueio do Gael)
  playGameOver() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const gameOverNotes = [
        { f: 392.00, start: 0.00, dur: 0.22 }, // G4
        { f: 329.63, start: 0.24, dur: 0.22 }, // E4
        { f: 293.66, start: 0.48, dur: 0.22 }, // D4
        { f: 261.63, start: 0.72, dur: 0.45 }, // C4
        { f: 196.00, start: 1.20, dur: 0.65 }, // G3
      ]

      gameOverNotes.forEach((item) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sawtooth'
        const start = now + item.start
        osc.frequency.setValueAtTime(item.f, start)

        gain.gain.setValueAtTime(0.24, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + item.dur)
      })

      this.vibrate([200, 100, 200, 100, 400])
    } catch (e) {
      console.warn('Audio playGameOver error:', e)
    }
  }

  // ⚠️ 5-MINUTE WARNING CHIME ("Atenção: Salve seu jogo!")
  playWarningBeep() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const notes = [
        { f: 1046.50, start: 0.00, dur: 0.12 }, // C6
        { f: 1318.51, start: 0.15, dur: 0.20 }, // E6
      ]

      notes.forEach((item) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        const start = now + item.start
        osc.frequency.setValueAtTime(item.f, start)

        gain.gain.setValueAtTime(0.25, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + item.dur)
      })

      this.vibrate([100, 80, 100])
    } catch (e) {
      console.warn('Audio playWarningBeep error:', e)
    }
  }

  // 🏆 TRIUMPHANT LEVEL UP FANFARE
  playLevelUp() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const notes = [
        { f: 523.25, start: 0.00, dur: 0.10 }, // C5
        { f: 659.25, start: 0.10, dur: 0.10 }, // E5
        { f: 783.99, start: 0.20, dur: 0.10 }, // G5
        { f: 1046.50, start: 0.30, dur: 0.35 }, // C6
      ]

      notes.forEach((item) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        const start = now + item.start
        osc.frequency.setValueAtTime(item.f, start)

        gain.gain.setValueAtTime(0.22, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + item.dur)
      })

      this.vibrate([50, 30, 50, 30, 120])
    } catch (e) {
      console.warn('Audio playLevelUp error:', e)
    }
  }

  // Play a single arcade beep pulse
  private playBeepPulse(freq: number, duration: number) {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'square'
      const now = ctx.currentTime

      osc.frequency.setValueAtTime(freq, now)
      gain.gain.setValueAtTime(0.28, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + duration)
    } catch (e) {
      console.warn('Beep error:', e)
    }
  }

  // Start continuous, repeating siren/alarm when time is up!
  startAlarm() {
    this.stopAlarm()

    this.playBeepPulse(880, 0.25)
    this.vibrate([300, 150, 300, 150, 500])

    let toggle = false
    this.alarmInterval = window.setInterval(() => {
      toggle = !toggle
      const freq = toggle ? 960 : 680
      this.playBeepPulse(freq, 0.28)
      this.vibrate([200, 100, 200])
    }, 450)
  }

  // Stop continuous alarm
  stopAlarm() {
    if (this.alarmInterval !== null) {
      clearInterval(this.alarmInterval)
      this.alarmInterval = null
    }
  }

  isAlarmPlaying(): boolean {
    return this.alarmInterval !== null
  }

  private vibrate(pattern: number[]) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // Ignored
      }
    }
  }

  async requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'default') {
          await Notification.requestPermission()
        }
      } catch {
        // Ignored
      }
    }
  }

  notifyTimeUp(kidName = 'Gael') {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(`🚨 GAME OVER! TEMPO DO ${kidName.toUpperCase()} ESGOTADO!`, {
          body: `O tempo de videogame acabou. Desligue o console e venha recarregar as energias!`,
          icon: '/gamepad.svg',
          requireInteraction: true,
        })
      } catch {
        // Ignored
      }
    }
  }
}

export const sounds = new SoundManager()
