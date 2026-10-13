// Web Audio API 8-bit retro gamer sound generator & haptics

class SoundManager {
  private audioCtx: AudioContext | null = null

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  // Play coin / power-up sound (+ minutes)
  playReward() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'triangle'
      const now = ctx.currentTime
      
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.1) // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2) // D6

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.35)

      this.vibrate([40, 30, 60])
    } catch (e) {
      console.warn('Audio play error:', e)
    }
  }

  // Play warning / penalty buzzer (- minutes)
  playPenalty() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      const now = ctx.currentTime

      osc.frequency.setValueAtTime(220, now) // A3
      osc.frequency.linearRampToValueAtTime(130, now + 0.25) // C3

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.3)

      this.vibrate([100, 50, 100])
    } catch (e) {
      console.warn('Audio play error:', e)
    }
  }

  // Play start game session sound
  playRedeem() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        const start = now + index * 0.08
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.15, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + 0.18)
      })

      this.vibrate([60, 40, 80, 40, 120])
    } catch (e) {
      console.warn('Audio play error:', e)
    }
  }

  // Play timer alarm
  playTimerAlert() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'square'
        const start = now + i * 0.2
        osc.frequency.setValueAtTime(800, start)

        gain.gain.setValueAtTime(0.2, start)
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + 0.15)
      }

      this.vibrate([200, 100, 200, 100, 200])
    } catch (e) {
      console.warn('Audio play error:', e)
    }
  }

  // Vibrate mobile device if supported
  private vibrate(pattern: number[]) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // Ignored
      }
    }
  }
}

export const sounds = new SoundManager()
