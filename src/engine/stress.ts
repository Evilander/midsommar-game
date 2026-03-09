// ─── StressDirector ─── Computes anxiety state from game context ───
// "Midsommar anxiety is not jump scares, it is losing the right to hesitate."

import type { GameState, SceneNode, StressState } from './types'
import { getMutatedStressBaseline, getMutatedTimerMs } from './cycle-mutation'

const HIGH_VALUE_CLUES = new Set([
  'clue_mark_wallet',
  'clue_mark_note',
  'clue_mark_thread',
  'clue_mark_drag_route',
  'clue_josh_notebook',
  'clue_josh_camera',
  'clue_fools_skin',
  'clue_temple_outsider_frames',
  'clue_temple_bear_shell',
  'clue_temple_ingemar_ribbon',
])

function getEvidenceBurden(state: GameState): number {
  return state.clues.reduce((burden, clue) => {
    if (!HIGH_VALUE_CLUES.has(clue.id)) return burden
    const ritualWeight = clue.subject === 'ritual' ? 1.3 : 1
    return burden + ritualWeight
  }, 0)
}

// Compute the effective stress state for the current frame.
// Scene modifiers override, then game state modulates on top.
export function computeStress(scene: SceneNode, state: GameState): StressState {
  const base = state.stress

  // Scene-level overrides (e.g., attestupa forces high exposure)
  const mods = scene.stressModifiers ?? {}

  const cycleStress = getMutatedStressBaseline()
  let pulse = (mods.pulse ?? base.pulse) + cycleStress.pulse
  let exposure = (mods.exposure ?? base.exposure) + cycleStress.exposure
  let mask = mods.mask ?? base.mask
  let dissociation = mods.dissociation ?? base.dissociation
  const evidenceBurden = getEvidenceBurden(state)

  // Pulse rises with grief, intoxication, low autonomy, and during pressured scenes
  const griefContribution = state.perception.grief > 60 ? (state.perception.grief - 60) * 0.3 : 0
  const autonomyPressure = state.perception.autonomy < 40 ? (40 - state.perception.autonomy) * 0.4 : 0
  const intoxPressure = state.perception.intoxication > 30 ? state.perception.intoxication * 0.2 : 0
  const cluePressure = evidenceBurden * (state.day >= 8 ? 4.6 : state.day >= 4 ? 2.4 : 1.2)
  const endgamePressure = scene.id.startsWith('day8_') || scene.id.startsWith('day9_') || scene.id.startsWith('ending_')
    ? 12
    : 0

  pulse = clamp(pulse + griefContribution + autonomyPressure + intoxPressure + cluePressure + endgamePressure, 0, 100)

  // Timed scenes spike pulse
  if (scene.pressure) {
    pulse = clamp(pulse + 24, 0, 100)
  }

  // Exposure rises with belonging and commune context
  const communeWatching = state.perception.belonging > 30 ? state.perception.belonging * 0.4 : 0
  const evidenceExposure = evidenceBurden * (state.day >= 8 ? 5 : 2)
  exposure = clamp(exposure + communeWatching + evidenceExposure + (endgamePressure > 0 ? 8 : 0), 0, 100)

  // Mask: high when autonomy is low but player is resisting (autonomy vs belonging gap)
  const resistance = Math.max(0, state.perception.autonomy - state.perception.belonging)
  const compliance = Math.max(0, state.perception.belonging - state.perception.autonomy)
  const endgameMask = endgamePressure > 0 ? 10 : 0
  mask = clamp((compliance > 20 ? compliance * 0.6 : resistance * 0.3) + endgameMask, 0, 100)

  // Dissociation: intoxication + sleep deprivation + extreme grief
  const sleepDebt = Math.max(0, 50 - state.perception.sleep) * 0.3
  dissociation = clamp(
    state.perception.intoxication * 0.5
      + sleepDebt
      + (state.perception.grief > 80 ? 15 : 0)
      + evidenceBurden * (state.day >= 8 ? 3.4 : 1.1)
      + (scene.pressure ? 6 : 0),
    0,
    100,
  )

  return { pulse, exposure, mask, dissociation }
}

// Convert pulse (0-100) to heartbeat BPM for audio
export function pulseToBPM(pulse: number): number {
  const normalized = clamp(pulse / 100, 0, 1)
  // Slow rise at the low end, then a sharp panic spike near the top.
  return Math.round(56 + normalized * 54 + Math.pow(normalized, 2.3) * 58)
}

// Compute effective timer duration — high pulse shortens timers
export function effectiveTimerMs(baseMs: number, pulse: number, shrinkWithPulse: boolean): number {
  // Cycle mutation: timers get shorter on replay — the commune gives you less time to decide
  const mutatedBase = getMutatedTimerMs(baseMs)
  if (!shrinkWithPulse) return mutatedBase
  const normalized = clamp(pulse / 100, 0, 1)
  const factor = 1 - normalized * 0.52 - Math.pow(normalized, 2) * 0.2
  return Math.max(1500, Math.round(mutatedBase * factor))
}

// Determine text distortion level from stress
export function textDistortionLevel(stress: StressState): number {
  // 0 = clear, 1 = mild shimmer, 2 = word swaps, 3 = full gaslighting
  if (stress.dissociation > 62 || stress.exposure > 92 || (stress.pulse > 76 && stress.mask > 58)) return 3
  if (stress.dissociation > 34 || stress.pulse > 56 || stress.exposure > 76) return 2
  if (stress.dissociation > 12 || stress.pulse > 36 || stress.exposure > 58) return 1
  return 0
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}
