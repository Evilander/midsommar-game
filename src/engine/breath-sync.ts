// ─── Breath Sync ─── The game breathes with you. ───
// "Hold to breathe" isn't just a title screen mechanic. It's a biometric loop.
//
// During tense scenes, the player can hold Space to "breathe."
// The game detects their natural rhythm and syncs the entire interface:
// - Text pulsing matches their inhale/exhale
// - Particle drift syncs to their pace
// - Background color breathing matches their cycle
// - The commune's "we breathe together" becomes literal
//
// This creates an uncanny sense that the game is INSIDE your body.

// ═══════════════════════════════════════════════════
// BREATH STATE
// ═══════════════════════════════════════════════════

export interface BreathState {
  /** Is the player currently holding (inhaling)? */
  isHolding: boolean
  /** Current phase in the breath cycle (0 = start of inhale, 0.5 = start of exhale, 1 = cycle complete) */
  phase: number
  /** Detected breaths per minute */
  bpm: number
  /** How consistent the player's rhythm is (0 = erratic, 1 = metronomic) */
  coherence: number
  /** How many breath cycles completed in this session */
  cycleCount: number
  /** Duration of one full cycle in ms */
  cycleDurationMs: number
}

const DEFAULT_STATE: BreathState = {
  isHolding: false,
  phase: 0,
  bpm: 12, // average adult resting breathing rate
  coherence: 0,
  cycleCount: 0,
  cycleDurationMs: 5000, // 12 BPM = 5s per cycle
}

// ═══════════════════════════════════════════════════
// BREATH DETECTOR — learns your rhythm
// ═══════════════════════════════════════════════════

// Stores hold durations to detect pattern
const holdDurations: number[] = []
const gapDurations: number[] = []

let holdStartMs = 0
let releaseMs = 0
let currentState: BreathState = { ...DEFAULT_STATE }
let listeners: Array<(state: BreathState) => void> = []

function notifyListeners(): void {
  for (const listener of listeners) {
    listener(currentState)
  }
}

/** Subscribe to breath state changes */
export function onBreathChange(listener: (state: BreathState) => void): () => void {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

/** Get current breath state */
export function getBreathState(): BreathState {
  return currentState
}

/** Player starts holding (inhale) */
export function breathIn(): void {
  const now = performance.now()

  // Record gap duration (exhale phase) if we have a previous release
  if (releaseMs > 0) {
    const gap = now - releaseMs
    if (gap < 10000 && gap > 500) { // reasonable exhale range
      gapDurations.push(gap)
      if (gapDurations.length > 8) gapDurations.shift()
    }
  }

  holdStartMs = now
  currentState = {
    ...currentState,
    isHolding: true,
    phase: 0,
  }
  notifyListeners()
}

/** Player releases (exhale) */
export function breathOut(): void {
  const now = performance.now()

  if (holdStartMs > 0) {
    const holdDuration = now - holdStartMs
    if (holdDuration > 300 && holdDuration < 10000) { // reasonable inhale range
      holdDurations.push(holdDuration)
      if (holdDurations.length > 8) holdDurations.shift()
    }
  }

  releaseMs = now
  currentState.cycleCount++

  // Recalculate rhythm
  recalculateRhythm()

  currentState = {
    ...currentState,
    isHolding: false,
    phase: 0.5, // start of exhale
  }
  notifyListeners()
}

function recalculateRhythm(): void {
  if (holdDurations.length < 2) return

  // Average hold duration (inhale)
  const avgHold = holdDurations.reduce((a, b) => a + b, 0) / holdDurations.length

  // Average gap duration (exhale) — use hold duration as fallback
  const avgGap = gapDurations.length > 0
    ? gapDurations.reduce((a, b) => a + b, 0) / gapDurations.length
    : avgHold * 1.2 // natural exhale is slightly longer

  const cycleDurationMs = avgHold + avgGap
  const bpm = 60000 / cycleDurationMs

  // Coherence: how consistent are the hold durations?
  const holdVariance = holdDurations.reduce((sum, d) => {
    return sum + Math.pow(d - avgHold, 2)
  }, 0) / holdDurations.length
  const holdStdDev = Math.sqrt(holdVariance)
  const coherence = Math.max(0, Math.min(1, 1 - (holdStdDev / avgHold)))

  currentState.bpm = Math.round(bpm * 10) / 10
  currentState.coherence = Math.round(coherence * 100) / 100
  currentState.cycleDurationMs = Math.round(cycleDurationMs)
}

/** Reset breath tracking for new scene */
export function resetBreathTracking(): void {
  holdDurations.length = 0
  gapDurations.length = 0
  holdStartMs = 0
  releaseMs = 0
  currentState = { ...DEFAULT_STATE }
}

// ═══════════════════════════════════════════════════
// CSS VARIABLE BRIDGE — sync UI to breathing
// ═══════════════════════════════════════════════════

let animationFrame = 0

/** Start pumping breath-sync CSS variables to the document */
export function startBreathSync(): void {
  stopBreathSync()

  const tick = () => {
    const now = performance.now()
    const state = currentState

    let phase: number

    if (state.isHolding && holdStartMs > 0) {
      // During inhale: phase goes from 0 to 0.5 over the expected hold duration
      const expectedHold = state.cycleDurationMs * 0.45
      const elapsed = now - holdStartMs
      phase = Math.min(0.5, (elapsed / expectedHold) * 0.5)
    } else if (releaseMs > 0) {
      // During exhale: phase goes from 0.5 to 1 over the expected gap
      const expectedGap = state.cycleDurationMs * 0.55
      const elapsed = now - releaseMs
      phase = 0.5 + Math.min(0.5, (elapsed / expectedGap) * 0.5)
    } else {
      phase = 0
    }

    // Sine wave for smooth breathing animation (0 at start, 1 at peak, 0 at end)
    const breathWave = Math.sin(phase * Math.PI)

    const root = document.documentElement
    root.style.setProperty('--breath-phase', phase.toFixed(3))
    root.style.setProperty('--breath-wave', breathWave.toFixed(3))
    root.style.setProperty('--breath-coherence', state.coherence.toFixed(2))
    root.style.setProperty('--breath-active', state.cycleCount > 0 ? '1' : '0')

    animationFrame = requestAnimationFrame(tick)
  }

  animationFrame = requestAnimationFrame(tick)
}

/** Stop the CSS sync loop */
export function stopBreathSync(): void {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }
}
