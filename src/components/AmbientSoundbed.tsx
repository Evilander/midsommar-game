import { useEffect, useRef } from 'react'
import { Howler } from 'howler'

type AmbientPreset = {
  base: number
  overtone: number
  lfo: number
  depth: number
  gain: number
}

type AmbientNodes = {
  ctx: AudioContext
  output: GainNode
  low: OscillatorNode
  high: OscillatorNode
  lfo: OscillatorNode
  lfoGain: GainNode
}

type HowlerInternals = typeof Howler & {
  ctx?: AudioContext
  masterGain?: AudioNode
}

const AMBIENT_PRESETS: Record<string, AmbientPreset> = {
  car_wind_loop: { base: 87.31, overtone: 174.61, lfo: 0.08, depth: 0.003, gain: 0.012 },
  meadow_birds: { base: 220, overtone: 659.25, lfo: 0.12, depth: 0.004, gain: 0.01 },
  meadow_birds_chorus: { base: 196, overtone: 587.33, lfo: 0.1, depth: 0.005, gain: 0.012 },
  chorus_hum: { base: 146.83, overtone: 293.66, lfo: 0.06, depth: 0.004, gain: 0.014 },
  feast_ambient: { base: 174.61, overtone: 523.25, lfo: 0.11, depth: 0.004, gain: 0.011 },
  evening_birds: { base: 164.81, overtone: 493.88, lfo: 0.09, depth: 0.003, gain: 0.01 },
  wind_distant: { base: 98, overtone: 196, lfo: 0.05, depth: 0.004, gain: 0.013 },
  night_singing: { base: 130.81, overtone: 261.63, lfo: 0.05, depth: 0.004, gain: 0.014 },
  night_singing_soft: { base: 110, overtone: 220, lfo: 0.04, depth: 0.003, gain: 0.011 },
  night_singing_distant: { base: 123.47, overtone: 246.94, lfo: 0.04, depth: 0.003, gain: 0.009 },
  silence_wind: { base: 103.83, overtone: 207.65, lfo: 0.03, depth: 0.002, gain: 0.007 },
  dream_drone: { base: 155.56, overtone: 466.16, lfo: 0.03, depth: 0.006, gain: 0.015 },
  default: { base: 196, overtone: 392, lfo: 0.08, depth: 0.003, gain: 0.01 },
}

function stopNodes(nodes: AmbientNodes | null) {
  if (!nodes) return

  const stopAt = nodes.ctx.currentTime + 1.2
  nodes.output.gain.cancelScheduledValues(nodes.ctx.currentTime)
  nodes.output.gain.setValueAtTime(nodes.output.gain.value, nodes.ctx.currentTime)
  nodes.output.gain.linearRampToValueAtTime(0, stopAt)

  window.setTimeout(() => {
    nodes.low.stop()
    nodes.high.stop()
    nodes.lfo.stop()
    nodes.output.disconnect()
    nodes.lfoGain.disconnect()
  }, 1300)
}

export function AmbientSoundbed({
  ambientSound,
  enabled,
  volume = 0.7,
}: {
  ambientSound?: string
  enabled: boolean
  volume?: number
}) {
  const nodesRef = useRef<AmbientNodes | null>(null)

  useEffect(() => {
    Howler.volume(0.65 * volume)
  }, [volume])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      stopNodes(nodesRef.current)
      nodesRef.current = null
      return
    }

    const internals = Howler as HowlerInternals
    const ctx = internals.ctx
    if (!ctx) return

    ctx.resume().catch(() => undefined)

    stopNodes(nodesRef.current)
    nodesRef.current = null

    const preset = AMBIENT_PRESETS[ambientSound ?? 'default'] ?? AMBIENT_PRESETS.default
    const output = ctx.createGain()
    output.gain.value = 0

    const low = ctx.createOscillator()
    low.type = 'sine'
    low.frequency.value = preset.base

    const high = ctx.createOscillator()
    high.type = 'triangle'
    high.frequency.value = preset.overtone

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = preset.lfo

    const lfoGain = ctx.createGain()
    lfoGain.gain.value = preset.depth

    const lowGain = ctx.createGain()
    lowGain.gain.value = preset.gain

    const highGain = ctx.createGain()
    highGain.gain.value = preset.gain * 0.28

    low.connect(lowGain)
    high.connect(highGain)
    lowGain.connect(output)
    highGain.connect(output)
    lfo.connect(lfoGain)
    lfoGain.connect(output.gain)
    output.connect(internals.masterGain ?? ctx.destination)

    low.start()
    high.start()
    lfo.start()
    output.gain.linearRampToValueAtTime(preset.gain * 0.8, ctx.currentTime + 2.4)

    nodesRef.current = { ctx, output, low, high, lfo, lfoGain }

    return () => {
      stopNodes(nodesRef.current)
      nodesRef.current = null
    }
  }, [ambientSound, enabled])

  return null
}
