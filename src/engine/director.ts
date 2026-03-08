// ─── The Director ─── Resolves scenes, applies The Chorus, manages state ───

import type {
  GameState,
  SceneNode,
  Choice,
  VariantCondition,
  PerceptionAxis,
  RelationshipState,
} from './types'

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
    case 'chorus':
      return inRange(state.chorusLevel, condition.min, condition.max)
    case 'flag':
      return (state.flags[condition.flag] ?? false) === condition.value
    case 'relationship':
      return inRange(state.relationships[condition.target], condition.min, condition.max)
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
  if (!scene.variants || scene.variants.length === 0) return scene.text

  // Find the first matching variant (ordered by specificity in the scene data)
  for (const variant of scene.variants) {
    if (evaluateCondition(variant.condition, state)) {
      return variant.text
    }
  }
  return scene.text
}

// ═══════════════════════════════════════════════════
// THE CHORUS — rewrites choices as autonomy drops
// ═══════════════════════════════════════════════════

export function resolveChoices(scene: SceneNode, state: GameState): Choice[] {
  if (!scene.choices) return []

  return scene.choices
    .filter(c => !c.condition || evaluateCondition(c.condition, state))
    .map(choice => ({
      ...choice,
      // The Chorus: when autonomy is low and chorus level is high,
      // shift to collective voice
      text: shouldUseChorus(state) && choice.chorusText
        ? choice.chorusText
        : choice.text
    }))
}

function shouldUseChorus(state: GameState): boolean {
  // The Chorus activates gradually:
  // chorus level 3+ AND autonomy below 50
  return state.chorusLevel >= 3 && state.perception.autonomy < 50
}

// ═══════════════════════════════════════════════════
// CHORUS LEVEL CALCULATION
// ═══════════════════════════════════════════════════

export function calculateChorusLevel(state: GameState): number {
  const { belonging, autonomy, grief } = state.perception

  // Chorus grows when belonging is high and autonomy is low
  // Grief accelerates it (vulnerability)
  let level = 0
  if (belonging > 20) level = 1
  if (belonging > 40 && autonomy < 70) level = 2
  if (belonging > 55 && autonomy < 55) level = 3
  if (belonging > 70 && autonomy < 40) level = 4
  if (belonging > 85 && autonomy < 25 && grief > 60) level = 5

  return level
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

  // Apply chorus delta
  if (effects.chorus) {
    newState.chorusLevel = Math.max(0, Math.min(5, state.chorusLevel + effects.chorus))
  }

  // Recalculate chorus level based on new perception
  newState.chorusLevel = Math.max(
    newState.chorusLevel,
    calculateChorusLevel(newState)
  )

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
    slow: 60,
    normal: 35,
    fast: 20,
    instant: 0,
  }[scene.typingSpeed ?? 'normal']

  // Intoxication slows perception
  if (state.perception.intoxication > 50) return base * 1.5
  // High grief adds weight to words
  if (state.perception.grief > 70) return base * 1.2

  return base
}
