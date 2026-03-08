// ─── Completion Tracker ─── How much of Harga have you seen? ───
// Tracks scene visits across all playthroughs. Drives replayability.

import { ALL_SCENES } from '../scenes'

const COMPLETION_KEY = 'midsommar_completion'

interface CompletionRecord {
  visitedScenes: string[]
  totalPlaythroughs: number
  fastestPlaythroughMs: number | null
}

function emptyRecord(): CompletionRecord {
  return {
    visitedScenes: [],
    totalPlaythroughs: 0,
    fastestPlaythroughMs: null,
  }
}

function loadRecord(): CompletionRecord {
  try {
    const raw = localStorage.getItem(COMPLETION_KEY)
    if (!raw) return emptyRecord()
    return { ...emptyRecord(), ...JSON.parse(raw) }
  } catch {
    return emptyRecord()
  }
}

function persist(record: CompletionRecord): void {
  try {
    localStorage.setItem(COMPLETION_KEY, JSON.stringify(record))
  } catch { /* silent */ }
}

/** Record that a scene was visited */
export function recordSceneVisit(sceneId: string): void {
  const record = loadRecord()
  if (!record.visitedScenes.includes(sceneId)) {
    record.visitedScenes.push(sceneId)
    persist(record)
  }
}

/** Record playthrough completion */
export function recordPlaythroughComplete(): void {
  const record = loadRecord()
  record.totalPlaythroughs += 1
  persist(record)
}

/** Get completion stats */
export function getCompletionStats(): {
  scenesVisited: number
  totalScenes: number
  percentage: number
  playthroughs: number
} {
  const record = loadRecord()
  const totalScenes = ALL_SCENES.length
  const scenesVisited = record.visitedScenes.length
  return {
    scenesVisited,
    totalScenes,
    percentage: totalScenes > 0 ? Math.round((scenesVisited / totalScenes) * 100) : 0,
    playthroughs: record.totalPlaythroughs,
  }
}
