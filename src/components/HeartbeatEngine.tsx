// ─── HeartbeatEngine ─── Synthetic heartbeat tied to pulse state ───
// "The sound should feel healthy and sincere. That is why it is scary."

import { useEffect, useRef } from 'react'
import { pulseToBPM } from '../engine/stress'

interface HeartbeatNodes {
  ctx: AudioContext
  masterGain: GainNode
  // We'll create oscillators per-beat since they're short bursts
}

export function HeartbeatEngine({
  pulse,
  enabled,
  volume = 0.7,
}: {
  pulse: number
  enabled: boolean
  volume?: number
}) {
  const nodesRef = useRef<HeartbeatNodes | null>(null)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const enabledRef = useRef(enabled)
  const pulseRef = useRef(pulse)

  enabledRef.current = enabled
  pulseRef.current = pulse

  useEffect(() => {
    if (!enabled) {
      // Fade out
      if (nodesRef.current) {
        nodesRef.current.masterGain.gain.linearRampToValueAtTime(0, nodesRef.current.ctx.currentTime + 0.5)
      }
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Create or resume audio context
    if (!nodesRef.current) {
      const ctx = new AudioContext()
      const masterGain = ctx.createGain()
      masterGain.gain.value = 0
      masterGain.connect(ctx.destination)
      nodesRef.current = { ctx, masterGain }
    }

    const { ctx, masterGain } = nodesRef.current

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Fade in
    masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1)

    const playBeat = () => {
      if (!enabledRef.current || !nodesRef.current) return

      const now = ctx.currentTime
      const p = pulseRef.current

      // Lub (first heart sound)
      const lub = ctx.createOscillator()
      const lubGain = ctx.createGain()
      lub.type = 'sine'
      lub.frequency.value = 40
      lubGain.gain.setValueAtTime(0.3, now)
      lubGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      lub.connect(lubGain)
      lubGain.connect(masterGain)
      lub.start(now)
      lub.stop(now + 0.1)

      // Dub (second heart sound, slightly higher, delayed)
      const dub = ctx.createOscillator()
      const dubGain = ctx.createGain()
      dub.type = 'sine'
      dub.frequency.value = 55
      dubGain.gain.setValueAtTime(0, now)
      dubGain.gain.setValueAtTime(0.2, now + 0.15)
      dubGain.gain.exponentialRampToValueAtTime(0.001, now + 0.21)
      dub.connect(dubGain)
      dubGain.connect(masterGain)
      dub.start(now + 0.14)
      dub.stop(now + 0.25)

      // At high pulse: sub-bass rumble
      if (p > 70) {
        const sub = ctx.createOscillator()
        const subGain = ctx.createGain()
        sub.type = 'sine'
        sub.frequency.value = 25
        const subLevel = ((p - 70) / 30) * 0.08
        subGain.gain.setValueAtTime(subLevel, now)
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        sub.connect(subGain)
        subGain.connect(masterGain)
        sub.start(now)
        sub.stop(now + 0.35)
      }

      // At very high pulse: filtered noise (blood rushing)
      if (p > 85) {
        const bufferSize = ctx.sampleRate * 0.2
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.5
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer

        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 200
        filter.Q.value = 1

        const noiseGain = ctx.createGain()
        const noiseLevel = ((p - 85) / 15) * 0.04
        noiseGain.gain.setValueAtTime(noiseLevel, now)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

        noise.connect(filter)
        filter.connect(noiseGain)
        noiseGain.connect(masterGain)
        noise.start(now)
        noise.stop(now + 0.25)
      }

      const bpm = pulseToBPM(pulseRef.current)
      const intervalMs = (60 / bpm) * 1000
      intervalRef.current = setTimeout(playBeat, intervalMs)
    }

    playBeat()

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!nodesRef.current || !enabled) return
    const targetGain = (0.1 + (pulse / 100) * 0.3) * volume
    nodesRef.current.masterGain.gain.linearRampToValueAtTime(
      targetGain,
      nodesRef.current.ctx.currentTime + 0.5,
    )
  }, [pulse, enabled, volume])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
      if (nodesRef.current) {
        nodesRef.current.masterGain.gain.linearRampToValueAtTime(0, nodesRef.current.ctx.currentTime + 0.3)
        setTimeout(() => {
          nodesRef.current?.ctx.close()
          nodesRef.current = null
        }, 500)
      }
    }
  }, [])

  return null // audio-only component
}
