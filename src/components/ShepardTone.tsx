// ─── Shepard Tone ─── Endlessly rising pitch for timed/pressure scenes ───
// Uses 6 stacked sine oscillators in octave spacing with amplitude envelopes
// that create the auditory illusion of infinite ascending pitch.
// Activates only during deadline choices and high-pressure scenes.

import { useEffect, useRef } from 'react'

const NUM_VOICES = 6
const BASE_FREQ = 55 // A1
const RISE_SPEED = 0.15 // semitones per second — slow enough to feel subliminal

interface ShepardNodes {
  ctx: AudioContext
  master: GainNode
  voices: Array<{
    osc: OscillatorNode
    gain: GainNode
  }>
}

function bellCurveGain(position: number): number {
  // position 0..1 across the audible range
  // peak at 0.4 (low-mid), taper at extremes
  const x = (position - 0.4) * 3
  return Math.exp(-x * x)
}

export function ShepardTone({
  active,
  intensity = 0.5,
  volume = 0.5,
}: {
  active: boolean
  intensity?: number // 0-1, controls speed and volume
  volume?: number
}) {
  const nodesRef = useRef<ShepardNodes | null>(null)
  const frameRef = useRef<number>(0)
  const phaseRef = useRef(0) // current phase in semitones above base

  useEffect(() => {
    if (!active) {
      if (nodesRef.current) {
        const { master, ctx } = nodesRef.current
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
        const nodes = nodesRef.current
        setTimeout(() => {
          nodes.voices.forEach(v => { try { v.osc.stop() } catch {} })
          nodes.ctx.close()
        }, 2500)
        nodesRef.current = null
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = 0
      }
      return
    }

    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const voices: ShepardNodes['voices'] = []
    for (let i = 0; i < NUM_VOICES; i++) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = BASE_FREQ * Math.pow(2, i)

      const gain = ctx.createGain()
      gain.gain.value = 0
      osc.connect(gain)
      gain.connect(master)
      osc.start()

      voices.push({ osc, gain })
    }

    // Fade in
    master.gain.linearRampToValueAtTime(0.08 * intensity * volume, ctx.currentTime + 3)

    nodesRef.current = { ctx, master, voices }

    // Animation loop — continuously shift frequencies
    let lastTime = performance.now()
    const animate = () => {
      if (!nodesRef.current) return
      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now

      phaseRef.current += RISE_SPEED * intensity * dt

      // Wrap phase — when it crosses 12 semitones (one octave), reset
      if (phaseRef.current >= 12) phaseRef.current -= 12

      const { voices: v, ctx: c } = nodesRef.current
      const t = c.currentTime

      for (let i = 0; i < NUM_VOICES; i++) {
        // Each voice is spaced 12 semitones (1 octave) apart
        const semitones = phaseRef.current + i * 12
        const freq = BASE_FREQ * Math.pow(2, semitones / 12)

        // Wrap into audible range (55 Hz to ~3520 Hz = 6 octaves)
        const maxSemitones = NUM_VOICES * 12
        const position = (semitones % maxSemitones) / maxSemitones
        const envelope = bellCurveGain(position)

        v[i].osc.frequency.linearRampToValueAtTime(freq, t + 0.05)
        v[i].gain.gain.linearRampToValueAtTime(envelope * 0.15 * intensity, t + 0.05)
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [active, intensity, volume])

  // Update volume when props change (without recreating)
  useEffect(() => {
    if (!nodesRef.current || !active) return
    nodesRef.current.master.gain.linearRampToValueAtTime(
      0.08 * intensity * volume,
      nodesRef.current.ctx.currentTime + 1,
    )
  }, [intensity, volume, active])

  return null
}
