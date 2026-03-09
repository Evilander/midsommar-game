import { getCycleCount } from './ghost'
import type { MemoryBloomConfig } from './types'

const MEMORY_BLOOM_KEY = 'midsommar_memory_bloom'

interface MemoryBloomSceneRecord {
  firstRememberedCycle: number
  lastRenderedCycle: number
  renders: number
}

interface MemoryBloomArchive {
  scenes: Record<string, MemoryBloomSceneRecord>
}

function emptyArchive(): MemoryBloomArchive {
  return { scenes: {} }
}

function loadArchive(): MemoryBloomArchive {
  if (typeof window === 'undefined') return emptyArchive()

  try {
    const raw = window.localStorage.getItem(MEMORY_BLOOM_KEY)
    if (!raw) return emptyArchive()
    return { ...emptyArchive(), ...JSON.parse(raw) }
  } catch {
    return emptyArchive()
  }
}

function persistArchive(archive: MemoryBloomArchive): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(MEMORY_BLOOM_KEY, JSON.stringify(archive))
  } catch {
    // LocalStorage is best effort. If it fails, bloom text still resolves from cycle count.
  }
}

function getBloomStage(config: MemoryBloomConfig, cycles: number, renders: number): number {
  const threshold = config.thresholdCycle ?? 1
  const unlockedDepth = Math.max(0, cycles - threshold)
  const revisitDepth = Math.max(0, renders - 1)
  return Math.min(config.lines.length - 1, unlockedDepth + revisitDepth)
}

export function resolveMemoryBloom(sceneId: string, config: MemoryBloomConfig | undefined): string | null {
  if (!config || config.lines.length === 0) return null

  const cycles = getCycleCount()
  const threshold = config.thresholdCycle ?? 1
  if (cycles < threshold) return null

  const archive = loadArchive()
  const current = archive.scenes[sceneId]
  const nextRecord: MemoryBloomSceneRecord = current
    ? {
        firstRememberedCycle: current.firstRememberedCycle,
        lastRenderedCycle: cycles,
        renders: current.lastRenderedCycle === cycles ? current.renders : current.renders + 1,
      }
    : {
        firstRememberedCycle: cycles,
        lastRenderedCycle: cycles,
        renders: 1,
      }

  if (
    !current ||
    current.lastRenderedCycle !== nextRecord.lastRenderedCycle ||
    current.renders !== nextRecord.renders
  ) {
    archive.scenes[sceneId] = nextRecord
    persistArchive(archive)
  }

  const stage = getBloomStage(config, cycles, nextRecord.renders)
  return config.lines[stage]?.trim() || null
}
