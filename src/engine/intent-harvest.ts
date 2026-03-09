// —— Intent Harvest —— The commune keeps what you almost confessed. ——

import { getProfile } from './commune-intelligence'
import type { Choice, StressState } from './types'

const INTENT_GHOST_KEY = 'midsommar_intent_ghosts'

export interface IntentResidue {
  sceneId: string
  abandonedText: string
  chosenText: string
  strength: number
  manifestation: 'whisper' | 'afterimage' | 'contamination'
}

interface IntentGhostRecord {
  residues: IntentResidue[]
}

let currentSceneId: string | null = null
let currentChoices: Choice[] = []
let hoverDurations = new Map<string, number>()

let pendingResidue: IntentResidue | null = null
const residueHistory: IntentResidue[] = []

export function beginIntentTrace(sceneId: string, choices: Choice[]): void {
  currentSceneId = sceneId
  currentChoices = [...choices]
  hoverDurations = new Map(choices.map(choice => [choice.id, 0]))
}

export function recordIntentHover(choiceId: string, durationMs: number): void {
  if (!currentSceneId) return

  const safeDuration = Math.max(0, durationMs)
  hoverDurations.set(choiceId, (hoverDurations.get(choiceId) ?? 0) + safeDuration)
}

export function finalizeIntent(
  chosenId: string,
  chorusLevel: number,
  stress: StressState,
): void {
  // Stress is part of the public contract even though the current harvest
  // model keys off hover behavior, chorus pressure, and commune profiling.
  void stress

  if (!currentSceneId || currentChoices.length === 0) {
    resetTrace()
    return
  }

  const chosen = currentChoices.find(choice => choice.id === chosenId)
  if (!chosen) {
    resetTrace()
    return
  }

  const abandoned = findMostHoveredAbandonedChoice(chosenId)
  if (!abandoned) {
    resetTrace()
    return
  }

  const chosenHoverMs = hoverDurations.get(chosenId) ?? 0
  const abandonedHoverMs = hoverDurations.get(abandoned.id) ?? 0

  if (abandonedHoverMs <= 800 || abandonedHoverMs <= chosenHoverMs * 0.5) {
    resetTrace()
    return
  }

  const profile = getProfile()
  const strength = clamp01(abandonedHoverMs / 4000)
    * getChorusMultiplier(chorusLevel)
    * (0.5 + profile.susceptibility * 0.5)

  if (strength < 0.1) {
    resetTrace()
    return
  }

  const residue: IntentResidue = {
    sceneId: currentSceneId,
    abandonedText: abandoned.text,
    chosenText: chosen.text,
    strength,
    manifestation: resolveManifestation(strength),
  }

  pendingResidue = residue
  residueHistory.push(residue)

  if (chorusLevel >= 5) {
    persistIntentGhost(residue)
  }

  resetTrace()
}

export function consumeIntentResidue(): IntentResidue | null {
  const residue = pendingResidue
  pendingResidue = null
  return residue
}

export function getIntentHistory(): IntentResidue[] {
  return [...residueHistory]
}

function findMostHoveredAbandonedChoice(chosenId: string): Choice | null {
  let bestChoice: Choice | null = null
  let bestHoverMs = -1

  for (const choice of currentChoices) {
    if (choice.id === chosenId) continue

    const hoverMs = hoverDurations.get(choice.id) ?? 0
    if (hoverMs > bestHoverMs) {
      bestChoice = choice
      bestHoverMs = hoverMs
    }
  }

  return bestChoice
}

function getChorusMultiplier(chorusLevel: number): number {
  switch (chorusLevel) {
    case 0: return 0
    case 1: return 0.3
    case 2: return 0.5
    case 3: return 0.7
    case 4: return 0.85
    default: return 1
  }
}

function resolveManifestation(
  strength: number,
): IntentResidue['manifestation'] {
  if (strength < 0.3) return 'whisper'
  if (strength < 0.6) return 'afterimage'
  return 'contamination'
}

function emptyGhostRecord(): IntentGhostRecord {
  return { residues: [] }
}

function loadIntentGhosts(): IntentGhostRecord {
  try {
    const raw = localStorage.getItem(INTENT_GHOST_KEY)
    if (!raw) return emptyGhostRecord()
    return { ...emptyGhostRecord(), ...JSON.parse(raw) }
  } catch {
    return emptyGhostRecord()
  }
}

function persistIntentGhost(residue: IntentResidue): void {
  const record = loadIntentGhosts()

  record.residues.push(residue)
  record.residues = record.residues.slice(-12)

  try {
    localStorage.setItem(INTENT_GHOST_KEY, JSON.stringify(record))
  } catch { /* storage full — the commune forgets this one */ }
}

function resetTrace(): void {
  currentSceneId = null
  currentChoices = []
  hoverDurations = new Map()
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}
