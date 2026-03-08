import { create } from 'zustand'

import { recordSceneVisit } from '../engine/completion'
import { applyChoice, resolveChoices } from '../engine/director'
import { recordGhostEcho } from '../engine/ghost'
import { INITIAL_STATE, INITIAL_STRESS, type GameState, type SceneNode } from '../engine/types'
import { ALL_SCENES } from '../scenes'

// ═══════════════════════════════════════════════════
// SCENE REGISTRY
// ═══════════════════════════════════════════════════

export const SCENE_REGISTRY = ALL_SCENES.reduce<Record<string, SceneNode>>((registry, scene) => {
  registry[scene.id] = scene
  return registry
}, {})

export function getSceneById(sceneId: string): SceneNode | undefined {
  return SCENE_REGISTRY[sceneId]
}

// ═══════════════════════════════════════════════════
// SAVE / LOAD — localStorage persistence
// ═══════════════════════════════════════════════════

const SAVE_KEY = 'midsommar_save'
const SETTINGS_KEY = 'midsommar_settings'

function extractGameState(store: GameStoreState): GameState {
  return {
    day: store.day,
    chapter: store.chapter,
    scene: store.scene,
    perception: store.perception,
    relationships: store.relationships,
    stress: store.stress,
    flags: store.flags,
    inventory: store.inventory,
    clues: store.clues,
    history: store.history,
    chorusLevel: store.chorusLevel,
    endings: store.endings,
  }
}

export function saveGame(): boolean {
  try {
    const state = useGameStore.getState()
    const snapshot = extractGameState(state)
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot))
    return true
  } catch {
    return false
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as GameState
    if (!getSceneById(saved.scene)) return null
    return saved
  } catch {
    return null
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY)
}

// ═══════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════

export interface GameSettings {
  masterVolume: number     // 0-1
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant'
  reduceMotion: boolean
}

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.7,
  textSpeed: 'normal',
  reduceMotion: false,
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// ═══════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════

function cloneInitialState(): GameState {
  return {
    ...INITIAL_STATE,
    perception: { ...INITIAL_STATE.perception },
    relationships: { ...INITIAL_STATE.relationships },
    stress: { ...INITIAL_STRESS },
    flags: { ...INITIAL_STATE.flags },
    inventory: [...INITIAL_STATE.inventory],
    clues: [],
    history: [...INITIAL_STATE.history],
    endings: [...INITIAL_STATE.endings],
  }
}

function syncSceneMetadata(state: GameState, scene: SceneNode): GameState {
  return {
    ...state,
    day: scene.day,
    chapter: scene.chapter,
    scene: scene.id,
  }
}

export interface GameStoreState extends GameState {
  makeChoice: (choiceId: string) => void
  advanceScene: () => void
  loadScene: (sceneId: string) => void
  resetGame: () => void
  restoreSave: () => boolean
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...cloneInitialState(),

  makeChoice: (choiceId) => {
    const state = get()
    const currentScene = getSceneById(state.scene)
    if (!currentScene) return

    const choice = resolveChoices(currentScene, state).find((option) => option.id === choiceId)
    if (!choice) return

    // Ghost memory — record this choice for future cycles
    recordGhostEcho(state.scene, choiceId, choice.text, state.day)

    const nextState = applyChoice(state, choice)
    const nextScene = getSceneById(nextState.scene)

    // Completion tracking
    if (nextScene) recordSceneVisit(nextScene.id)

    set(nextScene ? syncSceneMetadata(nextState, nextScene) : nextState)
  },

  advanceScene: () => {
    set((state) => {
      const currentScene = getSceneById(state.scene)
      if (!currentScene?.next) return state

      const nextScene = getSceneById(currentScene.next)
      if (!nextScene) {
        const chapterEnding = `${currentScene.chapter}_complete`
        return state.endings.includes(chapterEnding)
          ? state
          : { endings: [...state.endings, chapterEnding] }
      }

      recordSceneVisit(nextScene.id)

      return {
        day: nextScene.day,
        chapter: nextScene.chapter,
        scene: nextScene.id,
        history: [...state.history, state.scene],
      }
    })
  },

  loadScene: (sceneId) => {
    set((state) => {
      const nextScene = getSceneById(sceneId)
      if (!nextScene || nextScene.id === state.scene) return state

      return {
        day: nextScene.day,
        chapter: nextScene.chapter,
        scene: nextScene.id,
        history: [...state.history, state.scene],
      }
    })
  },

  resetGame: () => {
    deleteSave()
    set(cloneInitialState())
  },

  restoreSave: () => {
    const saved = loadGame()
    if (!saved) return false
    set(saved)
    return true
  },
}))

// Auto-save on every state change (debounced)
let saveTimeout: ReturnType<typeof setTimeout> | null = null
useGameStore.subscribe(() => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(saveGame, 500)
})

export function getCurrentScene(state: Pick<GameState, 'scene'>) {
  return getSceneById(state.scene) ?? getSceneById(INITIAL_STATE.scene)!
}
