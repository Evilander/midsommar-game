// ─── The Commune's Intelligence ─── It learns how you think. ───
// "A good cult doesn't argue with you. It becomes the shape of your longing."
//
// This system builds a behavioral profile from how the player interacts —
// not what they choose, but HOW they choose. Hesitation, speed, patterns.
// The commune uses this profile to adapt its manipulation in real-time.

const PROFILE_KEY = 'midsommar_commune_profile'

// ═══════════════════════════════════════════════════
// BEHAVIORAL PROFILE — the commune's understanding of you
// ═══════════════════════════════════════════════════

export interface CommuneProfile {
  // Timing patterns
  avgDecisionMs: number           // average time to make a choice
  fastDecisionCount: number       // choices made in < 2s (impulsive)
  slowDecisionCount: number       // choices made in > 8s (deliberate)
  longestHesitationMs: number     // the choice that took the longest

  // Alignment tracking
  communeChoiceCount: number      // times player picked commune-aligned
  resistanceChoiceCount: number   // times player picked resistance
  neutralChoiceCount: number      // times player picked neutral

  // Reading behavior
  fastForwardCount: number        // times player skipped text
  fullReadCount: number           // times player read to completion

  // Session behavior
  totalChoicesMade: number
  scenesWherePlayerPaused: number // scenes where player waited > 15s before choosing

  // Derived scores (0-1)
  compliance: number              // how easily led
  impulsiveness: number           // how quickly they choose
  attentiveness: number           // how carefully they read
  susceptibility: number          // combined manipulation vulnerability score
}

function emptyProfile(): CommuneProfile {
  return {
    avgDecisionMs: 4000,
    fastDecisionCount: 0,
    slowDecisionCount: 0,
    longestHesitationMs: 0,
    communeChoiceCount: 0,
    resistanceChoiceCount: 0,
    neutralChoiceCount: 0,
    fastForwardCount: 0,
    fullReadCount: 0,
    totalChoicesMade: 0,
    scenesWherePlayerPaused: 0,
    compliance: 0.5,
    impulsiveness: 0.5,
    attentiveness: 0.5,
    susceptibility: 0.5,
  }
}

function loadProfile(): CommuneProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return emptyProfile()
    return { ...emptyProfile(), ...JSON.parse(raw) }
  } catch {
    return emptyProfile()
  }
}

function persistProfile(profile: CommuneProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch { /* silent */ }
}

function recalculateScores(p: CommuneProfile): CommuneProfile {
  const total = p.totalChoicesMade || 1

  // Compliance: ratio of commune choices to total
  p.compliance = (p.communeChoiceCount + p.neutralChoiceCount * 0.3) / total
  p.compliance = Math.min(1, Math.max(0, p.compliance))

  // Impulsiveness: ratio of fast decisions
  p.impulsiveness = p.fastDecisionCount / total
  p.impulsiveness = Math.min(1, Math.max(0, p.impulsiveness))

  // Attentiveness: ratio of full reads vs skips
  const readTotal = p.fullReadCount + p.fastForwardCount || 1
  p.attentiveness = p.fullReadCount / readTotal
  p.attentiveness = Math.min(1, Math.max(0, p.attentiveness))

  // Susceptibility: combined score — high compliance + high impulsiveness + low attentiveness
  p.susceptibility = (
    p.compliance * 0.4 +
    p.impulsiveness * 0.3 +
    (1 - p.attentiveness) * 0.3
  )
  p.susceptibility = Math.min(1, Math.max(0, p.susceptibility))

  return p
}

// ═══════════════════════════════════════════════════
// RECORDING — feed the commune's understanding
// ═══════════════════════════════════════════════════

export type ChoiceAlignment = 'commune' | 'resistance' | 'neutral'

/** Record a choice and its timing */
export function recordChoiceBehavior(
  decisionMs: number,
  alignment: ChoiceAlignment,
): void {
  const profile = loadProfile()

  profile.totalChoicesMade++

  // Timing
  const prev = profile.avgDecisionMs
  profile.avgDecisionMs = prev + (decisionMs - prev) / profile.totalChoicesMade
  if (decisionMs < 2000) profile.fastDecisionCount++
  if (decisionMs > 8000) profile.slowDecisionCount++
  if (decisionMs > profile.longestHesitationMs) profile.longestHesitationMs = decisionMs
  if (decisionMs > 15000) profile.scenesWherePlayerPaused++

  // Alignment
  switch (alignment) {
    case 'commune': profile.communeChoiceCount++; break
    case 'resistance': profile.resistanceChoiceCount++; break
    case 'neutral': profile.neutralChoiceCount++; break
  }

  persistProfile(recalculateScores(profile))
}

/** Record text reading behavior */
export function recordReadingBehavior(didFastForward: boolean): void {
  const profile = loadProfile()
  if (didFastForward) {
    profile.fastForwardCount++
  } else {
    profile.fullReadCount++
  }
  persistProfile(recalculateScores(profile))
}

// ═══════════════════════════════════════════════════
// ADAPTATION — the commune weaponizes what it learns
// ═══════════════════════════════════════════════════

export function getProfile(): CommuneProfile {
  return loadProfile()
}

/**
 * Timer pressure adjustment — the commune learns your pace.
 * Impulsive players get shorter timers (to force mistakes).
 * Deliberate players get slightly longer timers (to build false trust before snatching it away).
 */
export function adaptiveTimerMultiplier(): number {
  const p = loadProfile()
  if (p.totalChoicesMade < 3) return 1 // need baseline data

  if (p.impulsiveness > 0.6) {
    // Player is impulsive — shorten timers to weaponize their speed
    return 0.8 - (p.impulsiveness - 0.6) * 0.5
  }
  if (p.impulsiveness < 0.2) {
    // Player is deliberate — give just enough rope
    return 1.1
  }
  return 1
}

/**
 * Text pacing modifier — commune adjusts how it presents information.
 * Attentive readers get more subtle manipulation (slower reveals).
 * Skimmers get more direct emotional pressure (shorter, punchier text).
 */
export function adaptiveTextSpeedMultiplier(): number {
  const p = loadProfile()
  if (p.totalChoicesMade < 3) return 1

  if (p.attentiveness > 0.7) {
    // Careful reader — slow down, let the dread seep
    return 1.15
  }
  if (p.attentiveness < 0.3) {
    // Skimmer — get to the emotional payload faster
    return 0.85
  }
  return 1
}

/**
 * Chorus aggression — how hard the commune pushes.
 * High susceptibility = the commune gets bolder faster.
 * Low susceptibility = the commune takes a subtler approach.
 */
export function chorusAggressionLevel(): number {
  const p = loadProfile()
  if (p.totalChoicesMade < 5) return 0

  // 0 = standard chorus behavior
  // 1 = aggressive (earlier activation, stronger effects)
  // -1 = subtle (the commune tries a different approach)
  if (p.susceptibility > 0.65) return 1
  if (p.susceptibility < 0.35) return -1
  return 0
}

/**
 * Pressure scene threshold — when does the commune start using timed choices?
 * Compliant players see fewer timed scenes (they comply anyway).
 * Resistant players face more pressure (the commune escalates).
 */
export function shouldIntensifyPressure(): boolean {
  const p = loadProfile()
  if (p.totalChoicesMade < 5) return false

  // Resistant players get more pressure
  return p.resistanceChoiceCount > p.communeChoiceCount * 1.5
}

/**
 * Hesitation exploitation — when the player hesitates on a specific choice,
 * the commune knows that choice matters to them.
 * Returns true if the commune should "notice" the hesitation.
 */
export function isPlayerHesitating(currentDecisionMs: number): boolean {
  const p = loadProfile()
  return currentDecisionMs > p.avgDecisionMs * 2 && currentDecisionMs > 5000
}

/**
 * Get a commune manipulation hint — what kind of text variant
 * would be most effective against this player?
 */
export function getManipulationStyle(): 'emotional' | 'logical' | 'social' | 'spiritual' {
  const p = loadProfile()

  // Impulsive + compliant = respond to emotional appeals
  if (p.impulsiveness > 0.5 && p.compliance > 0.5) return 'emotional'

  // Deliberate + resistant = need logical framing
  if (p.impulsiveness < 0.3 && p.compliance < 0.4) return 'logical'

  // Attentive + compliant = respond to spiritual framing
  if (p.attentiveness > 0.6 && p.compliance > 0.5) return 'spiritual'

  // Everyone else = social pressure
  return 'social'
}
