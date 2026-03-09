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
  targetGain: number
}

type HowlerInternals = typeof Howler & {
  ctx?: AudioContext
  masterGain?: AudioNode
}

const AMBIENT_PRESETS: Record<string, AmbientPreset> = {
  // ─── Existing presets ───
  car_wind_loop:        { base: 87.31,  overtone: 174.61, lfo: 0.08, depth: 0.003, gain: 0.012 },
  meadow_birds:         { base: 220,    overtone: 659.25, lfo: 0.12, depth: 0.004, gain: 0.01 },
  meadow_birds_chorus:  { base: 196,    overtone: 587.33, lfo: 0.1,  depth: 0.005, gain: 0.012 },
  chorus_hum:           { base: 146.83, overtone: 293.66, lfo: 0.06, depth: 0.004, gain: 0.014 },
  feast_ambient:        { base: 174.61, overtone: 523.25, lfo: 0.11, depth: 0.004, gain: 0.011 },
  evening_birds:        { base: 164.81, overtone: 493.88, lfo: 0.09, depth: 0.003, gain: 0.01 },
  wind_distant:         { base: 98,     overtone: 196,    lfo: 0.05, depth: 0.004, gain: 0.013 },
  night_singing:        { base: 130.81, overtone: 261.63, lfo: 0.05, depth: 0.004, gain: 0.014 },
  night_singing_soft:   { base: 110,    overtone: 220,    lfo: 0.04, depth: 0.003, gain: 0.011 },
  night_singing_distant:{ base: 123.47, overtone: 246.94, lfo: 0.04, depth: 0.003, gain: 0.009 },
  silence_wind:         { base: 103.83, overtone: 207.65, lfo: 0.03, depth: 0.002, gain: 0.007 },
  dream_drone:          { base: 155.56, overtone: 466.16, lfo: 0.03, depth: 0.006, gain: 0.015 },

  // ─── Trip ambients — psychedelic synthesis ───
  trip_ambient:         { base: 82.41,  overtone: 493.88, lfo: 0.04, depth: 0.008, gain: 0.014 },  // E2 + B4, wide shimmer
  trip_ambient_distant: { base: 65.41,  overtone: 987.77, lfo: 0.02, depth: 0.006, gain: 0.009 },  // C2 + B5, ethereal
  trip_choral:          { base: 146.83, overtone: 440,    lfo: 0.06, depth: 0.007, gain: 0.013 },  // D3 + A4, open 5th

  // ─── Chant/ritual ambients ───
  communal_chant:       { base: 146.83, overtone: 440,    lfo: 0.08, depth: 0.005, gain: 0.013 },  // D3 + A4, rhythmic drone
  communal_wail:        { base: 196,    overtone: 784,    lfo: 0.07, depth: 0.006, gain: 0.014 },  // G3 + G5, intense octave
  coronation_chant:     { base: 164.81, overtone: 493.88, lfo: 0.09, depth: 0.005, gain: 0.013 },  // E3 + B4, triumphant
  ritual_chant:         { base: 110,    overtone: 329.63, lfo: 0.06, depth: 0.005, gain: 0.013 },  // A2 + E4, deep ritual
  preparation_chant:    { base: 116.54, overtone: 349.23, lfo: 0.1,  depth: 0.005, gain: 0.012 },  // Bb2 + F4, building
  final_chant:          { base: 130.81, overtone: 392,    lfo: 0.05, depth: 0.007, gain: 0.015 },  // C3 + G4, climactic
  night_deep_chant:     { base: 82.41,  overtone: 246.94, lfo: 0.04, depth: 0.005, gain: 0.012 },  // E2 + B3, deep night

  // ─── Fire/intense ambients ───
  fire_chorus:          { base: 174.61, overtone: 698.46, lfo: 0.14, depth: 0.006, gain: 0.015 },  // F3 + F5, blazing
  fire_solo:            { base: 220,    overtone: 659.25, lfo: 0.07, depth: 0.004, gain: 0.011 },  // A3 + E5, solitary

  // ─── Dance/procession ambients ───
  dance_music:          { base: 220,    overtone: 659.25, lfo: 0.18, depth: 0.005, gain: 0.012 },  // A3 + E5, rhythmic
  dance_music_slow:     { base: 174.61, overtone: 523.25, lfo: 0.1,  depth: 0.004, gain: 0.01 },   // F3 + C5, gentle
  distant_procession:   { base: 98,     overtone: 293.66, lfo: 0.04, depth: 0.003, gain: 0.008 },  // G2 + D4, far away

  // ─── Morning ambients ───
  morning_birds:        { base: 587.33, overtone: 880,    lfo: 0.15, depth: 0.003, gain: 0.008 },  // D5 + A5, bright dawn
  morning_chant:        { base: 196,    overtone: 587.33, lfo: 0.06, depth: 0.004, gain: 0.011 },  // G3 + D5, morning ritual
  morning_distant:      { base: 110,    overtone: 329.63, lfo: 0.03, depth: 0.003, gain: 0.007 },  // A2 + E4, distant

  // ─── Wind/atmosphere ───
  wind_hollow:          { base: 61.74,  overtone: 185,    lfo: 0.03, depth: 0.004, gain: 0.01 },   // B1 + F#3, hollow
  wind_low:             { base: 55,     overtone: 82.41,  lfo: 0.02, depth: 0.003, gain: 0.009 },  // A1 + E2, sub-bass wind
  wind_road:            { base: 58.27,  overtone: 174.61, lfo: 0.06, depth: 0.003, gain: 0.011 },  // Bb1 + F3, road wind

  // ─── Tension/silence ───
  panic_breathe:        { base: 55,     overtone: 110,    lfo: 0.25, depth: 0.008, gain: 0.013 },  // A1 + A2, hyperventilation
  silence_heavy:        { base: 65.41,  overtone: 98,     lfo: 0.02, depth: 0.002, gain: 0.006 },  // C2 + G2, oppressive
  tense_ambient:        { base: 155.56, overtone: 466.16, lfo: 0.12, depth: 0.005, gain: 0.011 },  // D#3 + A#4, uneasy

  default:              { base: 196,    overtone: 392,    lfo: 0.08, depth: 0.003, gain: 0.01 },
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
  const volumeRef = useRef(volume)

  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  useEffect(() => {
    const nodes = nodesRef.current
    if (!nodes || !enabled) return

    nodes.output.gain.cancelScheduledValues(nodes.ctx.currentTime)
    nodes.output.gain.setValueAtTime(nodes.output.gain.value, nodes.ctx.currentTime)
    nodes.output.gain.linearRampToValueAtTime(nodes.targetGain * volume, nodes.ctx.currentTime + 0.25)
  }, [enabled, volume])

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
    const targetGain = preset.gain * 0.8
    output.gain.linearRampToValueAtTime(targetGain * volumeRef.current, ctx.currentTime + 2.4)

    nodesRef.current = { ctx, output, low, high, lfo, lfoGain, targetGain }

    return () => {
      stopNodes(nodesRef.current)
      nodesRef.current = null
    }
  }, [ambientSound, enabled])

  return null
}
