// ─── Communion Tracker ─── The commune counts everything. ───
// Persistent cross-playthrough statistics stored in localStorage.
// Feeds the title screen's "watched" counter and DreadMeter's communion ratio.

const TRACKER_KEY = 'midsommar_communion'

export interface CommunionStats {
  totalScenes: number
  totalChoices: number
  soulsSurrendered: number
  soulsResisted: number
  timersExpired: number
  fastestEndingDay: number | null
  uniqueEndings: string[]
  sessionsStarted: number
}

function emptyStats(): CommunionStats {
  return {
    totalScenes: 0,
    totalChoices: 0,
    soulsSurrendered: 0,
    soulsResisted: 0,
    timersExpired: 0,
    fastestEndingDay: null,
    uniqueEndings: [],
    sessionsStarted: 0,
  }
}

function load(): CommunionStats {
  try {
    const raw = localStorage.getItem(TRACKER_KEY)
    if (!raw) return emptyStats()
    return { ...emptyStats(), ...JSON.parse(raw) }
  } catch {
    return emptyStats()
  }
}

function persist(stats: CommunionStats): void {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(stats))
  } catch { /* best effort */ }
}

export function getCommunionStats(): CommunionStats {
  return load()
}

export function recordSceneVisit(): void {
  const stats = load()
  stats.totalScenes++
  persist(stats)
}

export function recordChoice(belongingDelta: number, autonomyDelta: number): void {
  const stats = load()
  stats.totalChoices++
  if (belongingDelta >= 10) stats.soulsSurrendered++
  if (autonomyDelta >= 10) stats.soulsResisted++
  persist(stats)
}

export function recordTimerExpiry(): void {
  const stats = load()
  stats.timersExpired++
  persist(stats)
}

export function recordEnding(endingId: string, day: number): void {
  const stats = load()
  if (!stats.uniqueEndings.includes(endingId)) {
    stats.uniqueEndings.push(endingId)
  }
  if (stats.fastestEndingDay === null || day < stats.fastestEndingDay) {
    stats.fastestEndingDay = day
  }
  persist(stats)
}

export function recordSessionStart(): void {
  const stats = load()
  stats.sessionsStarted++
  persist(stats)
}

export function getCommunionLine(): string | null {
  const stats = load()
  if (stats.totalChoices === 0) return null

  if (stats.totalChoices < 10) {
    return `The commune has watched you make ${stats.totalChoices} decisions.`
  }
  if (stats.soulsSurrendered > stats.soulsResisted * 2) {
    return `${stats.soulsSurrendered} souls surrendered. The commune is pleased.`
  }
  if (stats.soulsResisted > stats.soulsSurrendered * 2) {
    return `${stats.soulsResisted} moments of resistance. The commune is patient.`
  }
  if (stats.timersExpired > 5) {
    return `${stats.timersExpired} times the commune decided for you. You let them.`
  }
  return `The commune has observed ${stats.totalChoices} decisions across ${stats.sessionsStarted} visits.`
}

export function getCommunionRatio(): { surrendered: number; resisted: number } {
  const stats = load()
  return { surrendered: stats.soulsSurrendered, resisted: stats.soulsResisted }
}
