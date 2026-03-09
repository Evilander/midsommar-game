// ─── The Fourth Wall Bleed ─── The game watches you watching it. ───
// Tab titles, visibility awareness, time-of-day, decision timing.
// The commune's surveillance extends beyond the narrative.

import type { GameState, SceneNode } from './types'
import { getPreviousChoiceId } from './ghost'

// ═══════════════════════════════════════════════════
// TAB TITLE — the first thing you see when you look away
// ═══════════════════════════════════════════════════

export function getTabTitle(
  phase: string,
  scene: SceneNode | null,
  state: GameState,
): string {
  if (phase === 'title') return 'MIDSOMMAR'
  if (phase === 'credits') return 'MIDSOMMAR'
  if (phase === 'journey') return 'Your Dani'

  if (phase === 'ending') {
    if (state.flags.entered_temple) return 'She steps inside'
    if (state.flags.dropped_torch) return 'The road is long'
    if (state.flags.surrendered_to_inaction) return 'Someone else decides'
    return 'The fire catches'
  }

  if (!scene) return 'MIDSOMMAR'

  if (scene.id === 'day8_temple_threshold') return 'Do Not Look Away'
  if (scene.id === 'day8_vigil') return 'The flowers are bruising'
  if (scene.id === 'day9_threshold') return 'Choose'
  if (scene.pressure && state.chorusLevel >= 3) return 'Choose Quickly'

  // High chorus: the commune speaks through the chrome
  if (state.chorusLevel >= 4) return 'We Are Here'
  if (state.chorusLevel >= 3) return 'MIDSOMMAR — Together'

  // Night scenes
  if (scene.background?.includes('night')) return 'It never gets dark here'

  // Default: day marker
  return `Day ${scene.day} — MIDSOMMAR`
}

/** When the player alt-tabs during critical moments */
export function getHiddenTitle(scene: SceneNode | null, state: GameState): string | null {
  if (!scene) return null

  if (scene.id === 'day9_threshold') {
    const previousChoice = getPreviousChoiceId(scene.id)
    if (previousChoice === 'light_fire') return 'You already know what happens'
    if (previousChoice === 'drop_torch') return 'The road is still there'
    if (previousChoice === 'enter_temple') return 'You stepped inside once before'
    return 'Do not leave me alone with this'
  }

  if (scene.id === 'day8_temple_threshold') {
    return 'The temple stays open without you'
  }

  // Pressured choices — the commune notices you looking away
  if (scene.pressure) {
    if (state.day >= 8) return 'They can hear you hesitating'
    return 'She noticed you left'
  }

  // High exposure — they are always watching
  if (state.clues.length >= 5 && state.day >= 7) return 'You know too much to look away'
  if ((scene.stressModifiers?.exposure ?? 0) > 30) return 'They are still watching'
  if (state.perception.belonging > 60) return 'We miss you'

  // High chorus
  if (state.chorusLevel >= 4) return 'Come back to us'

  return null
}

/** Brief flash when the player returns */
export function getReturnTitle(state: GameState): string {
  if (state.flags.surrendered_to_inaction) return 'It was easier not to choose.'
  if (state.day >= 8 && state.clues.length >= 5) return 'You brought the evidence back with you.'
  if (state.chorusLevel >= 3) return 'You came back. Good.'
  return 'MIDSOMMAR'
}

// ═══════════════════════════════════════════════════
// TIME-OF-DAY AWARENESS — the midnight sun knows when you sleep
// ═══════════════════════════════════════════════════

type TimeSlot = 'late_night' | 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'night'

export function getTimeSlot(): TimeSlot {
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 5) return 'late_night'
  if (hour >= 5 && hour < 8) return 'early_morning'
  if (hour >= 8 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

export function isPlayingLate(): boolean {
  const slot = getTimeSlot()
  return slot === 'late_night' || slot === 'night'
}

/** Stress modifier based on real time — anxiety is worse at 3 AM */
export function timeOfDayStressModifier(): number {
  const slot = getTimeSlot()
  switch (slot) {
    case 'late_night': return 16
    case 'night': return 11
    case 'early_morning': return 6
    default: return 0
  }
}

// ═══════════════════════════════════════════════════
// DECISION TIMING — how you choose reveals who you are
// ═══════════════════════════════════════════════════

const decisionLog: number[] = []
let choiceVisibleAt = 0

/** Call when choices first become visible */
export function markChoicesVisible(): void {
  choiceVisibleAt = performance.now()
}

/** Call when a choice is made. Returns the decision time in ms. */
export function recordDecisionTime(): number {
  if (choiceVisibleAt === 0) return 0
  const elapsed = performance.now() - choiceVisibleAt
  decisionLog.push(elapsed)
  if (decisionLog.length > 15) decisionLog.shift()
  choiceVisibleAt = 0
  return elapsed
}

/** Average decision time across recent choices */
export function getAvgDecisionMs(): number {
  if (decisionLog.length === 0) return 3000
  return decisionLog.reduce((a, b) => a + b, 0) / decisionLog.length
}

/**
 * Hesitation level: 0 = decisive, 1 = deliberate, 2 = paralyzed.
 * This subtly modulates the stress engine — hesitant players feel more pressure.
 */
export function getHesitationLevel(): number {
  const avg = getAvgDecisionMs()
  if (avg > 10000) return 2
  if (avg > 5000) return 1
  return 0
}
