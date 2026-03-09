// ─── Sound Effects Engine ─── Local file playback with Web Audio API ───
// All sound effects are pre-generated .mp3 files in /audio/sfx/.
// No runtime API calls. No IndexedDB caching. Just load and play.

const DEFAULT_VOLUME = 0.2
const DEFAULT_QUEUE_DELAY_MS = 140
const DEFAULT_COOLDOWN_MS = 180

export interface SoundEffectPlayOptions {
  volume?: number
  queueDelayMs?: number
  cooldownMs?: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export class SoundEffectsManager {
  private audioContext: AudioContext | null = null
  private outputGain: GainNode | null = null
  private bufferCache = new Map<string, Promise<AudioBuffer | null>>()
  private activeSources = new Set<AudioBufferSourceNode>()
  private recentPlays = new Map<string, number>()
  private queueTail: Promise<void> = Promise.resolve()
  private lastQueueStart = 0
  private masterVolume = 1

  setMasterVolume(volume: number): void {
    this.masterVolume = clamp(volume, 0, 1)
    if (!this.audioContext || !this.outputGain) return

    const now = this.audioContext.currentTime
    this.outputGain.gain.cancelScheduledValues(now)
    this.outputGain.gain.setValueAtTime(this.outputGain.gain.value, now)
    this.outputGain.gain.linearRampToValueAtTime(this.masterVolume, now + 0.08)
  }

  async play(soundId: string, options?: SoundEffectPlayOptions): Promise<void> {
    if (typeof window === 'undefined' || !soundId.trim()) return

    const cooldownMs = options?.cooldownMs ?? DEFAULT_COOLDOWN_MS
    const now = performance.now()
    const lastPlayedAt = this.recentPlays.get(soundId) ?? -Infinity

    if (now - lastPlayedAt < cooldownMs) return

    this.recentPlays.set(soundId, now)
    this.queueTail = this.queueTail
      .then(() => this.startPlayback(soundId, options))
      .catch(() => undefined)

    return this.queueTail
  }

  async preload(ids: string[]): Promise<void> {
    if (typeof window === 'undefined') return
    await Promise.all(ids.map(id => this.getAudioBuffer(id)))
  }

  private async startPlayback(soundId: string, options?: SoundEffectPlayOptions): Promise<void> {
    const buffer = await this.getAudioBuffer(soundId)
    if (!buffer) return

    const context = await this.ensureAudioContext()
    if (!context || !this.outputGain) return

    const queueDelayMs = options?.queueDelayMs ?? DEFAULT_QUEUE_DELAY_MS
    const waitMs = Math.max(0, this.lastQueueStart + queueDelayMs - performance.now())
    if (waitMs > 0) {
      await sleep(waitMs)
    }
    this.lastQueueStart = performance.now()

    const source = context.createBufferSource()
    source.buffer = buffer

    const gainNode = context.createGain()
    const overlapFactor = Math.pow(0.84, this.activeSources.size)
    const targetGain = clamp((options?.volume ?? DEFAULT_VOLUME) * overlapFactor, 0, 1)
    const startAt = context.currentTime + 0.01
    const attackEnd = startAt + Math.min(0.08, Math.max(buffer.duration * 0.2, 0.025))
    const releaseStart = Math.max(attackEnd, startAt + Math.max(0, buffer.duration - 0.18))

    gainNode.gain.setValueAtTime(0.0001, context.currentTime)
    gainNode.gain.linearRampToValueAtTime(targetGain, attackEnd)
    gainNode.gain.setValueAtTime(targetGain, releaseStart)
    gainNode.gain.linearRampToValueAtTime(0.0001, startAt + buffer.duration)

    source.connect(gainNode)
    gainNode.connect(this.outputGain)

    this.activeSources.add(source)
    source.onended = () => {
      this.activeSources.delete(source)
      source.disconnect()
      gainNode.disconnect()
    }

    source.start(startAt)
  }

  private async ensureAudioContext(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null

    if (!this.audioContext) {
      const AudioContextCtor = window.AudioContext
        ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextCtor) return null

      this.audioContext = new AudioContextCtor()
      this.outputGain = this.audioContext.createGain()
      this.outputGain.gain.value = this.masterVolume
      this.outputGain.connect(this.audioContext.destination)
    }

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch {
        return null
      }
    }

    return this.audioContext
  }

  private getAudioBuffer(soundId: string): Promise<AudioBuffer | null> {
    const existing = this.bufferCache.get(soundId)
    if (existing) return existing

    const pending = this.loadBuffer(soundId)
    this.bufferCache.set(soundId, pending)

    return pending.catch(() => {
      this.bufferCache.delete(soundId)
      return null
    })
  }

  private async loadBuffer(soundId: string): Promise<AudioBuffer | null> {
    const context = await this.ensureAudioContext()
    if (!context) return null

    try {
      const response = await fetch(`/audio/sfx/${soundId}.mp3`)
      if (!response.ok) return null

      const arrayBuffer = await response.arrayBuffer()
      return await context.decodeAudioData(arrayBuffer)
    } catch {
      return null
    }
  }
}

export const soundEffectsManager = new SoundEffectsManager()

export function setSoundEffectsMasterVolume(volume: number): void {
  soundEffectsManager.setMasterVolume(volume)
}

export function playSoundEffect(soundId: string, options?: SoundEffectPlayOptions): Promise<void> {
  return soundEffectsManager.play(soundId, options)
}

export function preloadSoundEffects(ids: string[]): Promise<void> {
  return soundEffectsManager.preload(ids)
}

