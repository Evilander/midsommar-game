import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { breathIn, breathOut, onBreathChange, startBreathSync, stopBreathSync } from './engine/breath-sync'
import { adaptiveTextSpeedMultiplier, recordChoiceBehavior, type ChoiceAlignment } from './engine/commune-intelligence'
import { finalizeIntent } from './engine/intent-harvest'
import { resolveChoices, resolveText, resolveTypingDelay, resolveVisualEffects } from './engine/director'
import { getHesitationLevel, getTabTitle, getHiddenTitle, getReturnTitle, markChoicesVisible, recordDecisionTime, timeOfDayStressModifier } from './engine/fourthwall'
import { derivePsychedelicLevel } from './engine/psychedelic'
import { setSoundEffectsMasterVolume } from './engine/sound-effects'
import { computeStress, textDistortionLevel } from './engine/stress'
import { initSoundtrack, playSoundtrackForScene, resumeSoundtrack, setSoundtrackEnabled, setSoundtrackVolume } from './engine/soundtrack'
import { AmbientSoundbed } from './components/AmbientSoundbed'
import { ChapterCard } from './components/ChapterCard'
import { ClueJournal } from './components/ClueJournal'
import { HeartbeatEngine } from './components/HeartbeatEngine'
import { ParticleLayer } from './components/ParticleLayer'
import { SceneRenderer } from './components/SceneRenderer'
import { SettingsOverlay } from './components/SettingsOverlay'
import { TitleScreen } from './components/TitleScreen'
import { ContentWarning } from './components/ContentWarning'
import { ExplorationRenderer } from './components/ExplorationRenderer'
import { WitnessOverlay } from './components/WitnessOverlay'
import { AchievementToast } from './components/AchievementToast'
import { ChoiceRegretFlash } from './components/ChoiceRegretFlash'
import { DreadMeter } from './components/DreadMeter'
import { ShepardTone } from './components/ShepardTone'
import { TransitionStinger } from './components/TransitionStinger'
import { recordChoice, recordSceneVisit, recordSessionStart } from './engine/communion-tracker'

// Phase-specific components — lazy loaded, fetched during transition animations
const EndingScreen = lazy(() => import('./components/EndingScreen').then(m => ({ default: m.EndingScreen })))
const JourneySummary = lazy(() => import('./components/JourneySummary').then(m => ({ default: m.JourneySummary })))
const MayQueenDance = lazy(() => import('./components/MayQueenDance').then(m => ({ default: m.MayQueenDance })))
const CreditsScreen = lazy(() => import('./components/CreditsScreen').then(m => ({ default: m.CreditsScreen })))
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

type AppPhase = 'warning' | 'title' | 'chapter_card' | 'playing' | 'ending' | 'journey' | 'credits'

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
  const [phase, setPhase] = useState<AppPhase>('warning')
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [pendingDay, setPendingDay] = useState<number | null>(null)
  const [lastDay, setLastDay] = useState(1)
  const [breathCoherence, setBreathCoherence] = useState(0)
  const [rejectedChoiceTexts, setRejectedChoiceTexts] = useState<string[]>([])
  const [hasDeadlineActive, setHasDeadlineActive] = useState(false)
  const bridgeRef = useRef<RuntimeBridge | null>(null)

  const gameState = useGameStore((state) => state)
  const rawMakeChoice = useGameStore((state) => state.makeChoice)
  const rawAdvanceScene = useGameStore((state) => state.advanceScene)
  const resetGame = useGameStore((state) => state.resetGame)
  const restoreSave = useGameStore((state) => state.restoreSave)

  const currentScene = getCurrentScene(gameState)

  const resolvedText = useMemo(() => resolveText(currentScene, gameState), [currentScene, gameState])
  const choices = useMemo(() => resolveChoices(currentScene, gameState), [currentScene, gameState])

  // Derived state — must be declared before callbacks that use them
  const typingDelay = useMemo(() => {
    const base = resolveTypingDelay(currentScene, gameState)
    let adjusted: number
    switch (settings.textSpeed) {
      case 'instant': adjusted = 0; break
      case 'fast': adjusted = Math.round(base * 0.5); break
      case 'slow': adjusted = Math.round(base * 1.5); break
      default: adjusted = base
    }
    if (adjusted > 0) {
      adjusted = Math.round(adjusted * adaptiveTextSpeedMultiplier())
    }
    return adjusted
  }, [currentScene, gameState, settings.textSpeed])
  const effects = useMemo(() => resolveVisualEffects(currentScene, gameState), [currentScene, gameState])
  const stress = useMemo(() => {
    const base = computeStress(currentScene, gameState)
    const todMod = timeOfDayStressModifier()
    let { pulse, exposure, dissociation } = base

    // Real-world time stress — anxiety is worse at 3 AM
    if (todMod > 0) {
      pulse = Math.min(100, pulse + todMod)
      dissociation = Math.min(100, dissociation + Math.floor(todMod / 2))
    }

    // Breath coherence reward — controlled breathing reduces physiological arousal
    if (breathCoherence > 0.5) {
      const reduction = (breathCoherence - 0.5) * 20
      pulse = Math.max(0, pulse - reduction)
    }

    // Hesitation pressure — the commune notices when you can't decide
    const hesitation = getHesitationLevel()
    if (hesitation > 0) {
      exposure = Math.min(100, exposure + hesitation * 8)
    }

    return { ...base, pulse, exposure, dissociation }
  }, [currentScene, gameState, breathCoherence])
  const distortion = useMemo(
    () => settings.enableDistortion ? textDistortionLevel(stress) : 0,
    [stress, settings.enableDistortion],
  )
  const psychedelicLevel = useMemo(
    () => settings.enableScreenEffects
      ? derivePsychedelicLevel(
          gameState.perception.intoxication,
          stress.dissociation,
          gameState.perception.sleep,
          gameState.perception.grief,
        )
      : 0,
    [gameState.perception.intoxication, stress.dissociation, gameState.perception.sleep, gameState.perception.grief, settings.enableScreenEffects],
  )

  const sceneMode = currentScene.mode ?? 'narrative'
  const particlePreset = getParticlePreset(currentScene.background)

  // Check for scene transitions after any state-changing action
  const checkSceneTransition = useCallback(() => {
    const newState = useGameStore.getState()
    const newScene = getCurrentScene(newState)
    const id = newScene.id
    if (id === 'ending_fire' || id === 'ending_walk' || id === 'ending_sacrifice' || id === 'ending_surrender') {
      setPhase('ending')
      return
    }
    if (newScene.day !== lastDay) {
      // Show chapter card only when entering a genuinely new chapter —
      // not when day changes within a multi-day chapter (e.g. Day 5-7)
      const prevChapter = [...CHAPTERS].reverse().find(c => c.day <= lastDay)
      const nextChapter = [...CHAPTERS].reverse().find(c => c.day <= newScene.day)
      if (nextChapter && nextChapter.id !== prevChapter?.id) {
        setPendingDay(newScene.day)
        setPhase('chapter_card')
      } else {
        setLastDay(newScene.day)
      }
    }
  }, [lastDay])

  // Wrap makeChoice to record Fourth Wall decision timing + commune intelligence + intent harvest
  const makeChoice = useCallback((choiceId: string) => {
    const decisionMs = recordDecisionTime()

    const choice = choices.find(c => c.id === choiceId)
    let alignment: ChoiceAlignment = 'neutral'
    if (choice) {
      const fx = choice.effects
      if (currentScene.pressure?.defaultChoice === choiceId || choice.chorusText) {
        alignment = 'commune'
      } else if (fx.perception?.belonging && fx.perception.belonging > 5) {
        alignment = 'commune'
      } else if (fx.perception?.autonomy && fx.perception.autonomy > 5) {
        alignment = 'resistance'
      } else if (fx.chorus && fx.chorus < 0) {
        alignment = 'resistance'
      }
    }
    recordChoiceBehavior(decisionMs, alignment)
    finalizeIntent(choiceId, gameState.chorusLevel, stress)

    // Track rejected choices for regret flash
    const rejected = choices.filter(c => c.id !== choiceId).map(c => c.text)
    setRejectedChoiceTexts(rejected)

    // Communion tracking — record choice stats
    const belongingDelta = choice?.effects?.perception?.belonging ?? 0
    const autonomyDelta = choice?.effects?.perception?.autonomy ?? 0
    recordChoice(belongingDelta, autonomyDelta)

    rawMakeChoice(choiceId)
    checkSceneTransition()
  }, [rawMakeChoice, choices, currentScene.pressure, checkSceneTransition, gameState.chorusLevel, stress])

  const advanceScene = useCallback(() => {
    recordSceneVisit()
    rawAdvanceScene()
    checkSceneTransition()
  }, [rawAdvanceScene, checkSceneTransition])

  const handleChapterComplete = useCallback(() => {
    if (pendingDay !== null) setLastDay(pendingDay)
    setPendingDay(null)
    setPhase('playing')
  }, [pendingDay])

  const handleStart = useCallback((fromSave: boolean) => {
    if (fromSave) {
      const restored = restoreSave()
      if (restored) {
        const state = useGameStore.getState()
        const scene = getCurrentScene(state)
        setLastDay(state.day)
        // Detect if save is on an ending scene — restore to the correct phase
        if (scene.id.startsWith('ending_')) {
          setPhase('ending')
        } else {
          setPhase('playing')
        }
        return
      }
    }
    recordSessionStart()
    resetGame()
    setLastDay(0)
    setPhase('chapter_card')
    setPendingDay(0)
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

  // Keyboard shortcuts: Escape = settings, Tab = clue journal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (phase !== 'playing') return
      if (e.key === 'Escape') {
        setSettingsOpen((prev) => !prev)
        setJournalOpen(false)
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        setJournalOpen((prev) => !prev)
        setSettingsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase])

  const chapterInfo = pendingDay !== null
    ? [...CHAPTERS].reverse().find((c) => c.day <= pendingDay) ?? null
    : null

  // Wire progressive saturation and font size to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-day', String(currentScene.day ?? 1))
    document.documentElement.setAttribute('data-chorus', String(gameState.chorusLevel))

    // Pulse level for background stress animation
    const pulseLevel = stress.pulse < 30 ? 'low' : stress.pulse < 55 ? 'medium' : stress.pulse < 80 ? 'high' : 'critical'
    document.documentElement.setAttribute('data-pulse-level', pulseLevel)
    document.documentElement.style.setProperty('--pulse-intensity', String(Math.min(0.15, stress.pulse / 600)))

    // Track deadline state for Shepard tone
    setHasDeadlineActive(!!currentScene.pressure)
  }, [currentScene.day, gameState.chorusLevel, stress.pulse, currentScene.pressure])

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', settings.fontSize)
  }, [settings.fontSize])

  // Fourth Wall: tab title changes based on game state
  useEffect(() => {
    document.title = getTabTitle(phase, currentScene, gameState)
  }, [phase, currentScene, gameState])

  // Fourth Wall: visibility awareness — commune notices when you look away
  useEffect(() => {
    let returnTimer: ReturnType<typeof setTimeout> | undefined

    const handleVisibility = () => {
      if (returnTimer) clearTimeout(returnTimer)

      if (document.hidden) {
        const hiddenTitle = getHiddenTitle(currentScene, gameState)
        if (hiddenTitle) document.title = hiddenTitle
      } else {
        document.title = getReturnTitle(gameState)
        returnTimer = setTimeout(() => {
          document.title = getTabTitle(phase, currentScene, gameState)
        }, 2000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      if (returnTimer) clearTimeout(returnTimer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [phase, currentScene, gameState])

  // Fourth Wall: record when choices become visible (for decision timing)
  useEffect(() => {
    if (choices.length > 0 && phase === 'playing') {
      markChoicesVisible()
    }
  }, [choices.length, phase, currentScene.id])

  // Breath Sync: activate during gameplay, detect hold-space for breathing
  useEffect(() => {
    if (phase !== 'playing') {
      stopBreathSync()
      return
    }
    startBreathSync()

    // Subscribe to breath state — coherence feeds into stress reduction
    const unsubBreath = onBreathChange((state) => {
      setBreathCoherence((prev) => {
        if (Math.abs(state.coherence - prev) > 0.08) return state.coherence
        return prev
      })
    })

    let isBreathing = false

    const handleKeyDown = (e: KeyboardEvent) => {
      // Space for breathing (only when choices aren't visible — don't interfere with selection)
      if (e.key === ' ' && !e.repeat && !isBreathing) {
        isBreathing = true
        breathIn()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && isBreathing) {
        isBreathing = false
        breathOut()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      stopBreathSync()
      unsubBreath()
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [phase])

  // Soundtrack: enable on mount
  useEffect(() => {
    const tracks = initSoundtrack()
    if (tracks.length > 0) {
      setSoundtrackEnabled(true)
    }
  }, [])

  useEffect(() => {
    setSoundtrackVolume(settings.soundtrackVolume * settings.masterVolume)
  }, [settings.soundtrackVolume, settings.masterVolume])

  useEffect(() => {
    setSoundEffectsMasterVolume(settings.masterVolume)
  }, [settings.masterVolume])

  useEffect(() => {
    // Soundtrack plays during title screen AND gameplay
    if (phase === 'title' || phase === 'warning') {
      playSoundtrackForScene('title', {
        chorusLevel: 0, intoxication: 0, pulse: 0, day: 0, isRitual: false,
      })
      return
    }
    if (phase !== 'playing') return
    playSoundtrackForScene(currentScene.id, {
      chorusLevel: gameState.chorusLevel,
      intoxication: gameState.perception.intoxication,
      pulse: stress.pulse,
      day: gameState.day,
      isRitual: sceneMode === 'ritual' || sceneMode === 'rhythm',
    })
  }, [currentScene.id, gameState.chorusLevel, gameState.perception.intoxication, stress.pulse, gameState.day, sceneMode, phase])

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
      <WitnessOverlay exposure={phase === 'playing' && settings.enableScreenEffects ? stress.exposure : 0} />
      <AchievementToast gameState={gameState} enabled={phase === 'playing'} />
      <ChoiceRegretFlash
        rejectedChoices={rejectedChoiceTexts}
        chorusLevel={gameState.chorusLevel}
        enabled={phase === 'playing' && settings.enableScreenEffects}
      />
      <ShepardTone
        active={phase === 'playing' && hasDeadlineActive && stress.pulse > 40}
        intensity={Math.min(1, stress.pulse / 80)}
        volume={settings.masterVolume * 0.6}
      />
      <TransitionStinger
        sceneId={currentScene.id}
        enabled={phase === 'playing' && settings.enableScreenEffects}
      />
      <DreadMeter
        belonging={gameState.perception.belonging}
        autonomy={gameState.perception.autonomy}
        grief={gameState.perception.grief}
        chorusLevel={gameState.chorusLevel}
        pulse={stress.pulse}
        day={currentScene.day ?? 0}
        enabled={phase === 'playing'}
      />
      <ParticleLayer
        preset={phase === 'playing' ? particlePreset : 'none'}
        intensity={stress.dissociation > 40 ? 0.8 : 0.35}
        enabled={phase === 'playing'}
      />

      {/* HUD buttons */}
      {phase === 'playing' && (
        <div className="app-hud">
          {gameState.clues.length > 0 && (
            <button
              type="button"
              className="app-hud__btn"
              onClick={() => setJournalOpen(true)}
              aria-label="Evidence journal"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M8 7h8M8 11h6" />
              </svg>
            </button>
          )}
          <button
            type="button"
            className="app-hud__btn"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </button>
        </div>
      )}

      <SettingsOverlay
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onChange={handleSettingsChange}
      />

      <ClueJournal
        clues={gameState.clues}
        chorusLevel={gameState.chorusLevel}
        open={journalOpen}
        onClose={() => setJournalOpen(false)}
      />

      {/* Main content phases */}
      <AnimatePresence initial={false} mode="wait">
        {phase === 'warning' && (
          <ContentWarning
            key="warning"
            onAccept={() => { resumeSoundtrack(); setPhase('title') }}
          />
        )}

        {phase === 'title' && (
          <TitleScreen
            key="title"
            onStart={() => { resumeSoundtrack(); handleStart(false) }}
            hasSaveData={hasSave()}
            onContinue={() => { resumeSoundtrack(); handleStart(true) }}
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
              <Suspense fallback={null}>
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
              </Suspense>
            ) : sceneMode === 'exploration' ? (
              <ExplorationRenderer
                scene={currentScene}
                gameState={gameState}
                stress={stress}
                chorusLevel={gameState.chorusLevel}
                onClueFound={(clue) => {
                  useGameStore.setState((state) => ({
                    clues: [...state.clues, clue],
                  }))
                }}
                onHotspotScene={(sceneId) => {
                  useGameStore.getState().loadScene(sceneId)
                }}
                onAdvance={advanceScene}
                registerBridge={(bridge) => { bridgeRef.current = bridge }}
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
                psychedelicLevel={psychedelicLevel}
                onChoose={makeChoice}
                onAdvance={advanceScene}
                registerBridge={(bridge) => { bridgeRef.current = bridge }}
              />
            )}
          </motion.div>
        )}

        {phase === 'ending' && (
          <Suspense fallback={null}>
            <EndingScreen
              key="ending"
              gameState={gameState}
              onContinue={() => setPhase('journey')}
            />
          </Suspense>
        )}

        {phase === 'journey' && (
          <Suspense fallback={null}>
            <JourneySummary
              key="journey"
              gameState={gameState}
              onNewGame={() => { resetGame(); setPhase('title') }}
              onCredits={() => setPhase('credits')}
            />
          </Suspense>
        )}

        {phase === 'credits' && (
          <Suspense fallback={null}>
            <CreditsScreen
              key="credits"
              onReturn={() => { resetGame(); setPhase('title') }}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
