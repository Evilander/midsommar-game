// ─── Ghost Memory ─── The commune remembers. So does she. ───
// Stores echoes of previous playthroughs in localStorage.
// On subsequent cycles, fragments of past choices bleed through.

const GHOST_KEY = 'midsommar_ghost'

export interface GhostEcho {
  sceneId: string
  choiceId: string
  choiceText: string
  day: number
  cycle: number
}

export interface GhostRecord {
  cycles: number
  echoes: GhostEcho[]
  endings: string[]
}

function emptyRecord(): GhostRecord {
  return { cycles: 0, echoes: [], endings: [] }
}

export function loadGhostRecord(): GhostRecord {
  try {
    const raw = localStorage.getItem(GHOST_KEY)
    if (!raw) return emptyRecord()
    return { ...emptyRecord(), ...JSON.parse(raw) }
  } catch {
    return emptyRecord()
  }
}

function persist(record: GhostRecord): void {
  try {
    localStorage.setItem(GHOST_KEY, JSON.stringify(record))
  } catch { /* storage full — degrade silently */ }
}

/** Record a choice for the current (in-progress) cycle */
export function recordGhostEcho(
  sceneId: string,
  choiceId: string,
  choiceText: string,
  day: number,
): void {
  const record = loadGhostRecord()
  const cycle = record.cycles + 1

  // Replace existing echo for same scene in current cycle
  record.echoes = record.echoes.filter(
    e => !(e.sceneId === sceneId && e.cycle === cycle),
  )
  record.echoes.push({ sceneId, choiceId, choiceText, day, cycle })

  // Prune: keep last 3 cycles worth of echoes
  const floor = Math.max(1, cycle - 2)
  record.echoes = record.echoes.filter(e => e.cycle >= floor)

  persist(record)
}

/** Mark the current cycle as complete (player reached an ending) */
export function completeCycle(ending: string): void {
  const record = loadGhostRecord()
  record.cycles += 1
  if (!record.endings.includes(ending)) {
    record.endings.push(ending)
  }
  persist(record)
}

/** Get echoes from PREVIOUS cycles for a given scene (not current playthrough) */
export function getSceneEchoes(sceneId: string): GhostEcho[] {
  const record = loadGhostRecord()
  return record.echoes.filter(
    e => e.sceneId === sceneId && e.cycle <= record.cycles,
  )
}

/** Get the choice ID the player picked in a previous cycle for this scene */
export function getPreviousChoiceId(sceneId: string): string | null {
  const echoes = getSceneEchoes(sceneId)
  if (echoes.length === 0) return null
  return echoes.sort((a, b) => b.cycle - a.cycle)[0].choiceId
}

export function getCycleCount(): number {
  return loadGhostRecord().cycles
}

export function getSeenEndings(): string[] {
  return loadGhostRecord().endings
}
