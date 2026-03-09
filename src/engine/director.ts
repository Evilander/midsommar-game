// ─── The Director ─── Resolves scenes, applies The Chorus, manages state ───

import type {
  GameState,
  SceneNode,
  Choice,
  VariantCondition,
  PerceptionAxis,
  RelationshipState,
} from './types'
import { getCycleCount, hasPreviousChoice, hasSeenEnding } from './ghost'
import { resolveMemoryBloom } from './memory-bloom'
import { getMutatedText, filterMutatedChoices } from './cycle-mutation'

// ═══════════════════════════════════════════════════
// CONDITION EVALUATION
// ═══════════════════════════════════════════════════

export function evaluateCondition(condition: VariantCondition, state: GameState): boolean {
  switch (condition.type) {
    case 'always':
      return true
    case 'belonging':
      return inRange(state.perception.belonging, condition.min, condition.max)
    case 'grief':
      return inRange(state.perception.grief, condition.min, condition.max)
    case 'intoxication':
      return inRange(state.perception.intoxication, condition.min, condition.max)
    case 'autonomy':
      return inRange(state.perception.autonomy, condition.min, condition.max)
    case 'cycle':
      return inRange(getCycleCount(), condition.min, condition.max)
    case 'clue':
      return state.clues.some((clue) => clue.id === condition.clueId)
    case 'chorus':
      return inRange(state.chorusLevel, condition.min, condition.max)
    case 'flag':
      return (state.flags[condition.flag] ?? false) === condition.value
    case 'previousChoice':
      return hasPreviousChoice(condition.sceneId, condition.choiceId)
    case 'relationship':
      return inRange(state.relationships[condition.target], condition.min, condition.max)
    case 'seenEnding':
      return hasSeenEnding(condition.ending)
    default: {
      const _exhaustiveCheck: never = condition
      return _exhaustiveCheck
    }
  }
}

function inRange(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return false
  if (max !== undefined && value > max) return false
  return true
}

// ═══════════════════════════════════════════════════
// TEXT RESOLUTION — picks the best variant
// ═══════════════════════════════════════════════════

export function resolveText(scene: SceneNode, state: GameState): string {
  let resolved = scene.text

  if (scene.variants && scene.variants.length > 0) {
    // Find the first matching variant (ordered by specificity in the scene data)
    for (const variant of scene.variants) {
      if (evaluateCondition(variant.condition, state)) {
        resolved = variant.text
        break
      }
    }
  }

  if (!scene.echoes || scene.echoes.length === 0) {
    const bloom = resolveMemoryBloom(scene.id, scene.memoryBloom)
    const withBloom = bloom ? `${resolved}\n\n${bloom}` : resolved
    return getMutatedText(scene.id, withBloom)
  }

  const echoes = scene.echoes
    .filter((echo) => evaluateCondition(echo.condition, state))
    .map((echo) => echo.text.trim())
    .filter(Boolean)

  if (echoes.length === 0) {
    const bloom = resolveMemoryBloom(scene.id, scene.memoryBloom)
    const withBloom = bloom ? `${resolved}\n\n${bloom}` : resolved
    return getMutatedText(scene.id, withBloom)
  }

  const withEchoes = `${resolved}\n\n${echoes.join('\n\n')}`
  const bloom = resolveMemoryBloom(scene.id, scene.memoryBloom)
  const withBloom = bloom ? `${withEchoes}\n\n${bloom}` : withEchoes
  return getMutatedText(scene.id, withBloom)
}

// ═══════════════════════════════════════════════════
// THE CHORUS — rewrites choices as autonomy drops
// ═══════════════════════════════════════════════════

export function resolveChoices(scene: SceneNode, state: GameState): Choice[] {
  if (!scene.choices) return []

  // Filter by condition first
  const available = scene.choices
    .filter(c => !c.condition || evaluateCondition(c.condition, state))

  // Cycle mutations may remove choices on replay
  const survivingIds = filterMutatedChoices(
    scene.id,
    available.map(c => c.id),
  )

  return available
    .filter(c => survivingIds.includes(c.id))
    .map(choice => ({
      ...choice,
      text: shouldUseChorus(state) && choice.chorusText
        ? choice.chorusText
        : choice.text
    }))
}

function shouldUseChorus(state: GameState): boolean {
  if (state.chorusLevel < 3) return false
  // Activation threshold loosens as chorus deepens —
  // at level 3 you can still resist with high autonomy,
  // at level 5 the collective voice is almost inescapable
  const autonomyThreshold = 80 - (state.chorusLevel - 2) * 15
  // Level 3: autonomy < 65  — choices start shifting
  // Level 4: autonomy < 50  — hard to resist
  // Level 5: autonomy < 35  — the commune speaks through you
  return state.perception.autonomy < autonomyThreshold
}

// ═══════════════════════════════════════════════════
// CHORUS LEVEL CALCULATION
// ═══════════════════════════════════════════════════

export function calculateChorusLevel(state: GameState): number {
  const { belonging, autonomy, grief, intoxication, trust, sleep } = state.perception

  // Primary pathway: belonging vs autonomy tension
  let level = 0
  if (belonging > 20) level = 1
  if (belonging > 40 && autonomy < 70) level = 2
  if (belonging > 55 && autonomy < 55) level = 3
  if (belonging > 70 && autonomy < 40) level = 4
  if (belonging > 85 && autonomy < 25) level = 5

  // Grief pathway: deep loss makes you susceptible to collective comfort
  if (grief > 70 && belonging > 30) level = Math.max(level, 2)
  if (grief > 80 && autonomy < 50) level = Math.max(level, 3)

  // Intoxication pathway: drugs dissolve the boundary between self and group
  if (intoxication > 50 && belonging > 40) level = Math.max(level, 2)
  if (intoxication > 70 && autonomy < 60) level = Math.max(level, 3)

  // Trust pathway: deep trust in the commune bypasses resistance
  if (trust > 70 && belonging > 50) level = Math.max(level, 3)

  // Sleep deprivation pathway: exhaustion erodes the will to resist
  if (sleep < 30 && belonging > 40) level = Math.max(level, 2)
  if (sleep < 20 && autonomy < 50) level = Math.max(level, 3)

  // Combined overwhelm: when enough factors stack, the chorus surges
  const overwhelmFactors =
    (belonging > 50 ? 1 : 0) +
    (autonomy < 40 ? 1 : 0) +
    (grief > 60 ? 1 : 0) +
    (intoxication > 40 ? 1 : 0) +
    (sleep < 40 ? 1 : 0) +
    (trust > 60 ? 1 : 0)

  if (overwhelmFactors >= 4) level = Math.max(level, 4)
  if (overwhelmFactors >= 5 && belonging > 60) level = Math.max(level, 5)

  return Math.min(5, level)
}

// ═══════════════════════════════════════════════════
// STATE TRANSITIONS
// ═══════════════════════════════════════════════════

export function applyChoice(state: GameState, choice: Choice): GameState {
  const effects = choice.effects
  const newState = { ...state }

  // Apply perception changes
  if (effects.perception) {
    newState.perception = applyPerceptionDelta(state.perception, effects.perception)
  }

  // Apply relationship changes
  if (effects.relationships) {
    newState.relationships = applyRelationshipDelta(state.relationships, effects.relationships)
  }

  // Apply flags
  if (effects.flags) {
    newState.flags = { ...state.flags, ...effects.flags }
  }

  // Apply inventory
  if (effects.inventory) {
    let inv = [...state.inventory]
    if (effects.inventory.add) inv.push(...effects.inventory.add)
    if (effects.inventory.remove) inv = inv.filter(i => !effects.inventory!.remove!.includes(i))
    newState.inventory = inv
  }

  // Apply chorus delta — authored resistance can pull below the calculated floor.
  // The calculated level only RAISES chorus (natural growth from assimilation),
  // never overwrites an explicit reduction from player choice.
  if (effects.chorus) {
    newState.chorusLevel = Math.max(0, Math.min(5, state.chorusLevel + effects.chorus))
  }

  // Natural chorus growth: only escalate, never undo player resistance
  const naturalLevel = calculateChorusLevel(newState)
  if (naturalLevel > newState.chorusLevel && !effects.chorus) {
    newState.chorusLevel = naturalLevel
  } else if (!effects.chorus) {
    newState.chorusLevel = Math.max(newState.chorusLevel, naturalLevel)
  }

  // Track history
  newState.history = [...state.history, state.scene]
  newState.scene = choice.next

  return newState
}

function applyPerceptionDelta(
  current: PerceptionAxis,
  delta: Partial<PerceptionAxis>
): PerceptionAxis {
  const merged = { ...current }
  for (const [key, value] of Object.entries(delta)) {
    const k = key as keyof PerceptionAxis
    merged[k] = clamp(current[k] + (value as number), 0, 100)
  }
  return merged
}

function applyRelationshipDelta(
  current: RelationshipState,
  delta: Partial<RelationshipState>
): RelationshipState {
  const merged = { ...current }
  for (const [key, value] of Object.entries(delta)) {
    const k = key as keyof RelationshipState
    merged[k] = clamp(current[k] + (value as number), -100, 100)
  }
  return merged
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

// ═══════════════════════════════════════════════════
// VISUAL EFFECT RESOLUTION
// ═══════════════════════════════════════════════════

export function resolveVisualEffects(scene: SceneNode, state: GameState) {
  if (!scene.visualEffects) return []
  return scene.visualEffects.filter(
    e => !e.condition || evaluateCondition(e.condition, state)
  )
}

// ═══════════════════════════════════════════════════
// PERCEPTION-BASED TYPING SPEED
// ═══════════════════════════════════════════════════

export function resolveTypingDelay(scene: SceneNode, state: GameState): number {
  const base = {
    slow: 42,
    normal: 24,
    fast: 14,
    instant: 0,
  }[scene.typingSpeed ?? 'normal']

  // Intoxication slows perception
  if (state.perception.intoxication > 50) return base * 1.5
  // High grief adds weight to words
  if (state.perception.grief > 70) return base * 1.2

  return base
}
