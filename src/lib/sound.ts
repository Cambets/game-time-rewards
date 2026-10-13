// Web Audio API NES 8-bit Mario sound synthesizer & alarm system

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
  // O som lendário de pegar moeda no NES: B5 (987.77Hz) seguido rapidamente de E6 (1318.51Hz)
  playReward() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime

      // Canal 1: Onda Quadrada (Square Wave) típica do chip NES 2A03
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'square'

      // Nota 1: B5 (987.77 Hz) toca por ~0.075s
      osc.frequency.setValueAtTime(987.77, now)
      // Nota 2: E6 (1318.51 Hz) sobe imediatamente e ressoa por ~0.35s
      osc.frequency.setValueAtTime(1318.51, now + 0.075)

      // Envelope de Volume NES
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
  // Notas clássicas: E5, G5, E6, C6, D6, G6
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

  // 💀 SUPER MARIO MISS / LOST LIFE SOUND (- Minutos / Penalidade)
  // O clássico jingle do NES quando o Mario perde uma vida / cai no buraco:
  // Notas: B4 -> F5 -> F5 -> F5 -> E5 -> D5 -> C5
  playPenalty() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime

      // Sequência exata de notas da perda de vida do Super Mario Bros
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

  // 🎮 SUPER MARIO POWER-UP (Iniciar Sessão de Jogo)
  // Jingle do cogumelo do Mario ao crescer
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
        new Notification(`🚨 TEMPO DE VIDEOGAME ESGOTADO!`, {
          body: `O tempo de jogo do ${kidName} acabou. Hora de salvar e desligar o console!`,
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
