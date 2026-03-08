import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { resolveChoices, resolveText, resolveTypingDelay, resolveVisualEffects } from './engine/director'
import { getTabTitle, getHiddenTitle, getReturnTitle, markChoicesVisible, recordDecisionTime, timeOfDayStressModifier } from './engine/fourthwall'
import { computeStress, textDistortionLevel } from './engine/stress'
import { AmbientSoundbed } from './components/AmbientSoundbed'
import { ChapterCard } from './components/ChapterCard'
import { CreditsScreen } from './components/CreditsScreen'
import { EndingScreen } from './components/EndingScreen'
import { HeartbeatEngine } from './components/HeartbeatEngine'
import { JourneySummary } from './components/JourneySummary'
import { MayQueenDance } from './components/MayQueenDance'
import { ParticleLayer } from './components/ParticleLayer'
import { SceneRenderer } from './components/SceneRenderer'
import { SettingsOverlay } from './components/SettingsOverlay'
import { TitleScreen } from './components/TitleScreen'
import { WitnessOverlay } from './components/WitnessOverlay'
import type { RuntimeBridge } from './components/runtimeBridge'
import {
  getCurrentScene,
  hasSave,
  loadSettings,
  saveSettings,
  useGameStore,
  type GameSettings,
} from './stores/gameStore'
import { CHAPTERS } from './scenes'

declare global {
  interface Window {
    render_game_to_text?: () => string
    advanceTime?: (ms: number) => void
  }
}

type AppPhase = 'title' | 'chapter_card' | 'playing' | 'ending' | 'journey' | 'credits'

type ParticlePreset = 'flowers' | 'embers' | 'pollen' | 'snow' | 'none'

function getParticlePreset(background?: string): ParticlePreset {
  if (!background) return 'pollen'
  if (background.includes('fire') || background.includes('temple')) return 'embers'
  if (background.includes('meadow') || background.includes('feast')) return 'flowers'
  if (background.includes('night') || background.includes('sleeping')) return 'none'
  if (background.includes('road') || background.includes('car')) return 'snow'
  return 'pollen'
}

function App() {
  const [phase, setPhase] = useState<AppPhase>('title')
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pendingDay, setPendingDay] = useState<number | null>(null)
  const [lastDay, setLastDay] = useState(1)
  const bridgeRef = useRef<RuntimeBridge | null>(null)

  const gameState = useGameStore((state) => state)
  const rawMakeChoice = useGameStore((state) => state.makeChoice)
  const advanceScene = useGameStore((state) => state.advanceScene)
  const resetGame = useGameStore((state) => state.resetGame)
  const restoreSave = useGameStore((state) => state.restoreSave)

  // Wrap makeChoice to record Fourth Wall decision timing
  const makeChoice = useCallback((choiceId: string) => {
    recordDecisionTime()
    rawMakeChoice(choiceId)
  }, [rawMakeChoice])

  const currentScene = getCurrentScene(gameState)

  const resolvedText = useMemo(() => resolveText(currentScene, gameState), [currentScene, gameState])
  const choices = useMemo(() => resolveChoices(currentScene, gameState), [currentScene, gameState])
  const typingDelay = useMemo(() => {
    const base = resolveTypingDelay(currentScene, gameState)
    // Apply user's textSpeed setting
    switch (settings.textSpeed) {
      case 'instant': return 0
      case 'fast': return Math.round(base * 0.5)
      case 'slow': return Math.round(base * 1.5)
      default: return base
    }
  }, [currentScene, gameState, settings.textSpeed])
  const effects = useMemo(() => resolveVisualEffects(currentScene, gameState), [currentScene, gameState])
  const stress = useMemo(() => {
    const base = computeStress(currentScene, gameState)
    // Fourth Wall: playing late at night amplifies anxiety
    const todMod = timeOfDayStressModifier()
    if (todMod > 0) {
      return {
        ...base,
        pulse: Math.min(100, base.pulse + todMod),
        dissociation: Math.min(100, base.dissociation + Math.floor(todMod / 2)),
      }
    }
    return base
  }, [currentScene, gameState])
  const distortion = useMemo(() => textDistortionLevel(stress), [stress])

  const sceneMode = currentScene.mode ?? 'narrative'
  const particlePreset = getParticlePreset(currentScene.background)

  // Detect day changes for chapter cards
  useEffect(() => {
    if (phase !== 'playing') return
    if (currentScene.day !== lastDay) {
      setPendingDay(currentScene.day)
      setPhase('chapter_card')
    }
  }, [currentScene.day, lastDay, phase])

  // Check for ending scenes
  useEffect(() => {
    if (phase !== 'playing') return
    const id = currentScene.id
    if (id === 'ending_fire' || id === 'ending_walk' || id === 'ending_sacrifice') {
      setPhase('ending')
    }
  }, [currentScene.id, phase])

  const handleChapterComplete = useCallback(() => {
    if (pendingDay !== null) setLastDay(pendingDay)
    setPendingDay(null)
    setPhase('playing')
  }, [pendingDay])

  const handleStart = useCallback((fromSave: boolean) => {
    if (fromSave) {
      const restored = restoreSave()
      if (restored) {
        setLastDay(useGameStore.getState().day)
        setPhase('playing')
        return
      }
    }
    resetGame()
    setLastDay(1)
    setPhase('chapter_card')
    setPendingDay(1)
  }, [resetGame, restoreSave])

  const handleSettingsChange = useCallback((next: GameSettings) => {
    setSettings(next)
    saveSettings(next)
  }, [])

  // Runtime bridge for testing
  useEffect(() => {
    window.render_game_to_text = () =>
      bridgeRef.current?.snapshot() ??
      JSON.stringify({ mode: phase, scene: currentScene.id })

    window.advanceTime = (ms: number) => {
      bridgeRef.current?.advanceTime(ms)
    }

    return () => {
      delete window.render_game_to_text
      delete window.advanceTime
    }
  }, [currentScene.id, phase])

  // Settings keyboard shortcut (Escape)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'playing') {
        setSettingsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase])

  const chapterInfo = pendingDay !== null
    ? CHAPTERS.find((c) => c.day === pendingDay)
    : null

  // Wire progressive saturation to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-day', String(currentScene.day ?? 1))
  }, [currentScene.day])

  // Fourth Wall: tab title changes based on game state
  useEffect(() => {
    document.title = getTabTitle(phase, currentScene, gameState)
  }, [phase, currentScene, gameState])

  // Fourth Wall: visibility awareness — commune notices when you look away
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const hiddenTitle = getHiddenTitle(currentScene, gameState)
        if (hiddenTitle) document.title = hiddenTitle
      } else {
        // Brief return acknowledgment, then restore normal title
        document.title = getReturnTitle(gameState)
        const timer = setTimeout(() => {
          document.title = getTabTitle(phase, currentScene, gameState)
        }, 2000)
        return () => clearTimeout(timer)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [phase, currentScene, gameState])

  // Fourth Wall: record when choices become visible (for decision timing)
  useEffect(() => {
    if (choices.length > 0 && phase === 'playing') {
      markChoicesVisible()
    }
  }, [choices.length, phase, currentScene.id])

  return (
    <main className="app-shell">
      {/* Ambient systems */}
      <AmbientSoundbed
        ambientSound={phase === 'playing' ? currentScene.ambientSound : undefined}
        enabled={phase === 'playing'}
        volume={settings.masterVolume}
      />
      <HeartbeatEngine
        pulse={stress.pulse}
        enabled={phase === 'playing' && stress.pulse > 30}
        volume={settings.masterVolume}
      />
      <WitnessOverlay exposure={phase === 'playing' ? stress.exposure : 0} />
      <ParticleLayer
        preset={phase === 'playing' ? particlePreset : 'none'}
        intensity={stress.dissociation > 40 ? 0.8 : 0.35}
        enabled={phase === 'playing'}
      />

      {/* Settings gear */}
      {phase === 'playing' && (
        <button
          type="button"
          className="app-settings-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
        </button>
      )}

      <SettingsOverlay
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onChange={handleSettingsChange}
      />

      {/* Main content phases */}
      <AnimatePresence initial={false} mode="wait">
        {phase === 'title' && (
          <TitleScreen
            key="title"
            onStart={() => handleStart(false)}
            hasSaveData={hasSave()}
            onContinue={() => handleStart(true)}
            registerBridge={(bridge) => { bridgeRef.current = bridge }}
          />
        )}

        {phase === 'chapter_card' && chapterInfo && (
          <ChapterCard
            key={`chapter-${pendingDay}`}
            day={chapterInfo.day}
            title={chapterInfo.title}
            subtitle={chapterInfo.subtitle}
            onComplete={handleChapterComplete}
          />
        )}

        {phase === 'playing' && (
          <motion.div
            key="game"
            className="app-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sceneMode === 'rhythm' ? (
              <MayQueenDance
                onComplete={(result) => {
                  const flagUpdate: Record<string, boolean> = {}
                  if (result.surrendered) {
                    flagUpdate.surrendered_to_dance = true
                  } else {
                    flagUpdate.fought_for_crown = true
                  }
                  useGameStore.setState((state) => ({
                    flags: { ...state.flags, ...flagUpdate },
                  }))
                  advanceScene()
                }}
                onStatsDelta={(delta) => {
                  useGameStore.setState((state) => ({
                    perception: {
                      ...state.perception,
                      belonging: Math.min(100, Math.max(0, state.perception.belonging + delta.belonging)),
                      autonomy: Math.min(100, Math.max(0, state.perception.autonomy + delta.autonomy)),
                    },
                  }))
                }}
              />
            ) : (
              <SceneRenderer
                scene={currentScene}
                resolvedText={resolvedText}
                typingDelay={typingDelay}
                chorusLevel={gameState.chorusLevel}
                choices={choices}
                effects={effects}
                stress={stress}
                distortionLevel={distortion}
                onChoose={makeChoice}
                onAdvance={advanceScene}
                registerBridge={(bridge) => { bridgeRef.current = bridge }}
              />
            )}
          </motion.div>
        )}

        {phase === 'ending' && (
          <EndingScreen
            key="ending"
            gameState={gameState}
            onContinue={() => setPhase('journey')}
          />
        )}

        {phase === 'journey' && (
          <JourneySummary
            key="journey"
            gameState={gameState}
            onNewGame={() => { resetGame(); setPhase('title') }}
            onCredits={() => setPhase('credits')}
          />
        )}

        {phase === 'credits' && (
          <CreditsScreen
            key="credits"
            onReturn={() => { resetGame(); setPhase('title') }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
