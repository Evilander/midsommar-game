// ─── Psychedelic Level ─── How deep is the trip? ───

export type PsychedelicLevel = 0 | 1 | 2 | 3

/**
 * Derives trip intensity from intoxication + dissociation,
 * intensified by sleep deprivation and extreme grief.
 *
 * Primary: intoxication (70%) + dissociation (30%).
 * Modifiers: sleep debt amplifies visuals, grief above 80
 * triggers distortion even at low intoxication (emotional hallucination).
 *
 * 0 = sober, 1 = onset, 2 = peak, 3 = overwhelming
 */
export function derivePsychedelicLevel(
  intoxication: number,
  dissociation: number,
  sleep = 100,
  grief = 0,
): PsychedelicLevel {
  let combined = intoxication * 0.7 + dissociation * 0.3

  // Sleep deprivation amplifies the trip — exhaustion and psilocybin compound
  if (sleep < 30) {
    combined += (30 - sleep) * 0.3
  }

  // Extreme grief triggers visual disturbance even at low doses —
  // Dani's grief hallucinations in the film aren't just from the mushrooms
  if (grief > 80 && intoxication > 10) {
    combined += (grief - 80) * 0.15
  }

  if (combined < 20) return 0
  if (combined < 45) return 1
  if (combined < 70) return 2
  return 3
}
