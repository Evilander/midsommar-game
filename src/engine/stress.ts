// ─── StressDirector ─── Computes anxiety state from game context ───
// "Midsommar anxiety is not jump scares, it is losing the right to hesitate."

import type { GameState, SceneNode, StressState } from './types'

// Compute the effective stress state for the current frame.
// Scene modifiers override, then game state modulates on top.
export function computeStress(scene: SceneNode, state: GameState): StressState {
  const base = state.stress

  // Scene-level overrides (e.g., attestupa forces high exposure)
  const mods = scene.stressModifiers ?? {}

  let pulse = mods.pulse ?? base.pulse
  let exposure = mods.exposure ?? base.exposure
  let mask = mods.mask ?? base.mask
  let dissociation = mods.dissociation ?? base.dissociation

  // Pulse rises with grief, intoxication, low autonomy, and during pressured scenes
  const griefContribution = state.perception.grief > 60 ? (state.perception.grief - 60) * 0.3 : 0
  const autonomyPressure = state.perception.autonomy < 40 ? (40 - state.perception.autonomy) * 0.4 : 0
  const intoxPressure = state.perception.intoxication > 30 ? state.perception.intoxication * 0.2 : 0

  pulse = clamp(pulse + griefContribution + autonomyPressure + intoxPressure, 0, 100)

  // Timed scenes spike pulse
  if (scene.pressure) {
    pulse = clamp(pulse + 20, 0, 100)
  }

  // Exposure rises with belonging and commune context
  const communeWatching = state.perception.belonging > 30 ? state.perception.belonging * 0.4 : 0
  exposure = clamp(exposure + communeWatching, 0, 100)

  // Mask: high when autonomy is low but player is resisting (autonomy vs belonging gap)
  const resistance = Math.max(0, state.perception.autonomy - state.perception.belonging)
  const compliance = Math.max(0, state.perception.belonging - state.perception.autonomy)
  mask = clamp(compliance > 20 ? compliance * 0.6 : resistance * 0.3, 0, 100)

  // Dissociation: intoxication + sleep deprivation + extreme grief
  const sleepDebt = Math.max(0, 50 - state.perception.sleep) * 0.3
  dissociation = clamp(
    state.perception.intoxication * 0.5 + sleepDebt + (state.perception.grief > 80 ? 15 : 0),
    0,
    100,
  )

  return { pulse, exposure, mask, dissociation }
}

// Convert pulse (0-100) to heartbeat BPM for audio
export function pulseToBPM(pulse: number): number {
  // Resting: 60 BPM, max anxiety: 140 BPM
  return 60 + (pulse / 100) * 80
}

// Compute effective timer duration — high pulse shortens timers
export function effectiveTimerMs(baseMs: number, pulse: number, shrinkWithPulse: boolean): number {
  if (!shrinkWithPulse) return baseMs
  // At pulse 0: full time. At pulse 100: 40% of time.
  const factor = 1 - (pulse / 100) * 0.6
  return Math.max(2000, Math.round(baseMs * factor)) // minimum 2 seconds
}

// Determine text distortion level from stress
export function textDistortionLevel(stress: StressState): number {
  // 0 = clear, 1 = mild shimmer, 2 = word swaps, 3 = full gaslighting
  if (stress.dissociation > 70 || (stress.pulse > 80 && stress.mask > 60)) return 3
  if (stress.dissociation > 40 || stress.pulse > 60) return 2
  if (stress.dissociation > 15 || stress.pulse > 40) return 1
  return 0
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}
