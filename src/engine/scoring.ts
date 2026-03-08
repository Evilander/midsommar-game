// ─── Scoring ─── Not every Dani is the same Dani ───
// "This is not a score. It is a diagnosis."
//
// Three scores calculated at end of playthrough:
// - Clarity: How much did she see through the commune? (clues found, resistance, attentiveness)
// - Surrender: How deeply did she submit? (belonging, compliance, chorus acceptance)
// - Survival: How intact is her sense of self? (autonomy preserved, stress managed)
//
// These aren't "good/bad" — they describe WHO this Dani became.

import type { GameState } from './types'
import { getProfile } from './commune-intelligence'

export interface PlaythroughScore {
  clarity: number    // 0-100
  surrender: number  // 0-100
  survival: number   // 0-100
  title: string      // a name for this Dani
  description: string
}

/** Calculate a multi-dimensional score for this playthrough */
export function calculateScore(state: GameState): PlaythroughScore {
  const profile = getProfile()

  // Clarity: seeing through the commune
  const clueScore = Math.min(40, state.clues.length * 8)
  const resistanceScore = profile.resistanceChoiceCount * 3
  const attentiveScore = profile.attentiveness * 20
  const clarity = Math.min(100, Math.round(clueScore + resistanceScore + attentiveScore))

  // Surrender: how deeply she was absorbed
  const belongingScore = state.perception.belonging * 0.35
  const complianceScore = profile.compliance * 30
  const chorusScore = state.chorusLevel * 8
  const trustScore = state.perception.trust * 0.15
  const surrender = Math.min(100, Math.round(belongingScore + complianceScore + chorusScore + trustScore))

  // Survival: sense of self preserved
  const autonomyScore = state.perception.autonomy * 0.5
  const lowGriefBonus = state.perception.grief < 40 ? 15 : 0
  const resistBonus = profile.resistanceChoiceCount > profile.communeChoiceCount ? 15 : 0
  const survival = Math.min(100, Math.round(autonomyScore + lowGriefBonus + resistBonus))

  // Title and description based on dominant score
  const { title, description } = getDaniTitle(clarity, surrender, survival, state)

  return { clarity, surrender, survival, title, description }
}

function getDaniTitle(
  clarity: number,
  surrender: number,
  survival: number,
  state: GameState,
): { title: string; description: string } {
  // Special endings override
  if (state.flags.entered_temple) {
    if (surrender > 70) {
      return {
        title: 'The Willing Ninth',
        description: 'She walked into the fire because it felt like home.',
      }
    }
    return {
      title: 'The Sacrifice',
      description: 'She stepped inside. Whether it was choice or surrender, only she knows.',
    }
  }

  if (state.flags.dropped_torch) {
    if (clarity > 60) {
      return {
        title: 'The Witness',
        description: 'She saw everything and chose to walk away carrying it.',
      }
    }
    return {
      title: 'The Escapee',
      description: 'Eighteen kilometers of silence. The flowers are still in her hair.',
    }
  }

  // The Fire ending — the "standard" conclusion
  if (surrender > 75 && clarity < 30) {
    return {
      title: 'The May Queen',
      description: 'She became what they needed. She does not remember what she was before.',
    }
  }

  if (clarity > 70 && surrender < 30) {
    return {
      title: 'The Investigator',
      description: 'She saw the blood beneath the flowers. She lit the fire anyway.',
    }
  }

  if (survival > 60 && surrender < 40) {
    return {
      title: 'The Survivor',
      description: 'She kept saying "I" when they wanted her to say "we."',
    }
  }

  if (surrender > 50 && clarity > 50) {
    return {
      title: 'The Complicit',
      description: 'She saw what they were doing. She let it happen. Maybe she wanted it.',
    }
  }

  if (survival < 30) {
    return {
      title: 'The Broken',
      description: 'Nine days in the sun. She does not know who she is anymore.',
    }
  }

  return {
    title: 'Dani',
    description: 'She made it through nine days. The flowers remember everything she forgot.',
  }
}
