// ─── Achievements ─── Milestones in grief ───
// Silent tracking, revealed at journey's end. No pop-ups — just the weight of what you did.

import type { GameState } from './types'

export interface Achievement {
  id: string
  title: string
  description: string
  hidden: boolean       // hidden achievements only reveal once unlocked
  condition: (state: GameState) => boolean
}

const ACHIEVEMENTS: Achievement[] = [
  // ── Endings ──
  {
    id: 'ending_fire',
    title: 'May Queen',
    description: 'Lit the temple.',
    hidden: false,
    condition: (s) => !!s.flags.lit_the_fire,
  },
  {
    id: 'ending_walk',
    title: 'Eighteen Kilometers',
    description: 'Walked away from Harga.',
    hidden: false,
    condition: (s) => !!s.flags.dropped_torch,
  },
  {
    id: 'ending_sacrifice',
    title: 'The Ninth Place',
    description: 'Walked into the fire.',
    hidden: false,
    condition: (s) => !!s.flags.entered_temple,
  },

  // ── Choices ──
  {
    id: 'drank_tea',
    title: 'Down the Rabbit Hole',
    description: 'Drank the mushroom tea.',
    hidden: false,
    condition: (s) => !!s.flags.drank_tea,
  },
  {
    id: 'refused_tea',
    title: 'Clear Eyes',
    description: 'Refused the tea.',
    hidden: false,
    condition: (s) => !!s.flags.refused_tea,
  },
  {
    id: 'witnessed_attestupa',
    title: 'Witness',
    description: 'Watched the attestupa.',
    hidden: false,
    condition: (s) => !!s.flags.witnessed_attestupa,
  },
  {
    id: 'crowned',
    title: 'Crowned in Flowers',
    description: 'Won the May Queen dance.',
    hidden: false,
    condition: (s) => !!s.flags.fought_for_crown,
  },
  {
    id: 'surrendered_dance',
    title: 'Let Go',
    description: 'Surrendered to the rhythm.',
    hidden: false,
    condition: (s) => !!s.flags.surrendered_to_dance,
  },

  // ── Exploration ──
  {
    id: 'found_blood_book',
    title: 'The Rubi Radr',
    description: 'Found the blood book.',
    hidden: true,
    condition: (s) => !!s.flags.found_blood_book,
  },
  {
    id: 'explored_ruins',
    title: 'Curious',
    description: 'Explored the ruins.',
    hidden: true,
    condition: (s) => !!s.flags.explored_ruins,
  },

  // ── Perception milestones ──
  {
    id: 'full_belonging',
    title: 'One of Us',
    description: 'Belonging reached maximum.',
    hidden: false,
    condition: (s) => s.perception.belonging >= 95,
  },
  {
    id: 'full_autonomy',
    title: 'I Am Dani',
    description: 'Maintained full autonomy.',
    hidden: false,
    condition: (s) => s.perception.autonomy >= 80,
  },
  {
    id: 'max_chorus',
    title: 'We Are',
    description: 'The Chorus reached its peak.',
    hidden: true,
    condition: (s) => s.chorusLevel >= 5,
  },
  {
    id: 'high_grief',
    title: 'The Weight',
    description: 'Carried grief through all nine days.',
    hidden: false,
    condition: (s) => s.perception.grief >= 75 && s.day >= 9,
  },

  // ── Meta / Hidden ──
  {
    id: 'tried_to_leave',
    title: 'Flight Risk',
    description: 'Tried to leave alone.',
    hidden: true,
    condition: (s) => !!s.flags.tried_to_leave_alone,
  },
  {
    id: 'confronted_mark',
    title: 'Said Something',
    description: 'Confronted Mark.',
    hidden: true,
    condition: (s) => !!s.flags.confronted_mark,
  },
  {
    id: 'chose_christian',
    title: 'The Outsider',
    description: 'Chose Christian as the ninth.',
    hidden: true,
    condition: (s) => !!s.flags.chose_christian,
  },
  {
    id: 'spared_christian',
    title: 'Mercy',
    description: 'Spared Christian.',
    hidden: true,
    condition: (s) => !!s.flags.spared_christian,
  },
]

// ═══════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════

const ACH_KEY = 'midsommar_achievements'

export function loadUnlockedIds(): string[] {
  try {
    const raw = localStorage.getItem(ACH_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

function persistUnlocked(ids: string[]): void {
  try {
    localStorage.setItem(ACH_KEY, JSON.stringify(ids))
  } catch { /* silent */ }
}

/** Check state against all achievements, unlock any new ones. Returns newly unlocked. */
export function evaluateAchievements(state: GameState): Achievement[] {
  const unlocked = new Set(loadUnlockedIds())
  const newlyUnlocked: Achievement[] = []

  for (const ach of ACHIEVEMENTS) {
    if (unlocked.has(ach.id)) continue
    if (ach.condition(state)) {
      unlocked.add(ach.id)
      newlyUnlocked.push(ach)
    }
  }

  if (newlyUnlocked.length > 0) {
    persistUnlocked([...unlocked])
  }

  return newlyUnlocked
}

/** Get all achievements with unlock status */
export function getAllAchievements(): Array<Achievement & { unlocked: boolean }> {
  const unlocked = new Set(loadUnlockedIds())
  return ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: unlocked.has(ach.id),
  }))
}

export function getUnlockedCount(): number {
  return loadUnlockedIds().length
}

export function getTotalCount(): number {
  return ACHIEVEMENTS.length
}
