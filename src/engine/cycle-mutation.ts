// ─── Cycle Mutation ─── The game remembers. The game changes. ───
// On New Game+ (cycle 2+), reality shifts. Dialogue changes. Choices vanish.
// The commune adapts to your resistance. The safe paths crumble.
// By cycle 4, the game speaks directly to the player.

import { getCycleCount } from './ghost'

export interface CycleMutations {
  cycle: number
  textAppends: Map<string, string>
  removedChoices: Map<string, string[]>
  stressBaseline: { pulse: number; exposure: number }
  timerMultiplier: number
}

const EMPTY_MUTATIONS: CycleMutations = {
  cycle: 0,
  textAppends: new Map(),
  removedChoices: new Map(),
  stressBaseline: { pulse: 0, exposure: 0 },
  timerMultiplier: 1,
}

let cachedMutations: CycleMutations | null = null
let cachedCycle = -1

export function getCycleMutations(): CycleMutations {
  const cycle = getCycleCount()
  if (cachedMutations && cachedCycle === cycle) return cachedMutations

  cachedCycle = cycle
  cachedMutations = buildMutations(cycle)
  return cachedMutations
}

function buildMutations(cycle: number): CycleMutations {
  if (cycle < 1) return EMPTY_MUTATIONS

  const textAppends = new Map<string, string>()
  const removedChoices = new Map<string, string[]>()

  // ─── Cycle 1 (first replay): Déjà vu ───
  // Subtle. The commune acknowledges you've been here before.
  if (cycle >= 1) {
    textAppends.set('arrival_gate',
      'Something about the arch feels practiced, like a stage you built and forgot.')

    textAppends.set('prologue_apartment',
      'The apartment has a quality of rehearsal. You have stood here before, in the dark, waiting for the phone to ring.')

    textAppends.set('arrival_welcome',
      'Karin\'s smile lands on you like a hand on a bruise. She knows your name before you give it.')

    textAppends.set('day2_morning',
      'The sunlight hurts the same way. You know it will not set.')

    textAppends.set('day2_cliff_edge',
      'You already know what happens next. Your body knows. It remembers the sound.')
  }

  // ─── Cycle 2: The commune adjusts ───
  // Pelle becomes knowing. Some choices disappear.
  if (cycle >= 2) {
    textAppends.set('arrival_pelle_walk',
      'Pelle walks slower this time. He glances at you as though waiting for you to remember something you haven\'t said yet.')

    textAppends.set('arrival_feast_intro',
      'The tables are set for exactly the right number. As though they knew how many would come.')

    textAppends.set('day2_attestupa',
      'The crowd is silent before the elder reaches the edge. Their grief is already in position, like actors who know their cue.')

    // Remove the "explore alone" choice on Day 1 — the commune won't let you wander
    removedChoices.set('arrival_feast_intro', ['explore_alone'])

    // Pelle's walk becomes non-optional
    textAppends.set('prologue_car',
      'The road looks different from how you remember it. Shorter. Like it was waiting for you.')
  }

  // ─── Cycle 3: Direct address ───
  // The game fractures. The fourth wall cracks.
  if (cycle >= 3) {
    textAppends.set('prologue_apartment',
      'You could stop. You could close the tab and never come back. But you won\'t. You never do.')

    textAppends.set('prologue_discovery',
      'You know what the email says. You have read it before. Your sister is already gone. She has always been gone.')

    textAppends.set('day2_cliff_edge',
      'You came back to watch them fall again. What does that say about you?')

    textAppends.set('arrival_breathe',
      'Breathe with them. You always do, eventually. Every cycle, a little sooner.')

    textAppends.set('day3_blood_eagle',
      'By now you should know: nothing you choose here prevents this. The commune always gets what it needs.')

    // Remove resistance choices on Day 3
    removedChoices.set('day3_simon_missing', ['search_for_simon'])

    // Christian becomes hostile
    textAppends.set('prologue_phone_christian',
      'His voice has an edge this time. As though he remembers what you did to him. What you will do.')
  }

  // ─── Cycle 4+: Full dissolution ───
  // The game no longer pretends.
  if (cycle >= 4) {
    textAppends.set('prologue_apartment',
      'Why do you keep coming back? The ending doesn\'t change. You don\'t change. The flowers are already in position.')

    textAppends.set('arrival_gate',
      'Welcome back. We\'ve been expecting you. We\'re always expecting you.')

    textAppends.set('prologue_departure',
      'You pack the same bag. You say the same things. You think this time will be different. It won\'t.')

    textAppends.set('day2_morning',
      'The sun is a performance. You are the audience. You have always been the audience.')

    textAppends.set('day2_pelle_held',
      'Pelle holds your face. His thumbs are warm. He has done this before. You have let him. You will let him again.')

    // Remove more escape options
    removedChoices.set('day2_try_leave', ['insist_leaving'])
  }

  return {
    cycle,
    textAppends,
    removedChoices,
    stressBaseline: {
      pulse: Math.min(20, cycle * 5),
      exposure: Math.min(15, cycle * 4),
    },
    timerMultiplier: Math.max(0.6, 1 - cycle * 0.1),
  }
}

export function getMutatedText(sceneId: string, baseText: string): string {
  const mutations = getCycleMutations()
  const append = mutations.textAppends.get(sceneId)
  if (!append) return baseText
  return `${baseText}\n\n${append}`
}

export function filterMutatedChoices(sceneId: string, choiceIds: string[]): string[] {
  const mutations = getCycleMutations()
  const removed = mutations.removedChoices.get(sceneId)
  if (!removed || removed.length === 0) return choiceIds
  return choiceIds.filter(id => !removed.includes(id))
}

export function getMutatedTimerMs(baseMs: number): number {
  const mutations = getCycleMutations()
  return Math.round(baseMs * mutations.timerMultiplier)
}

export function getMutatedStressBaseline(): { pulse: number; exposure: number } {
  return getCycleMutations().stressBaseline
}
