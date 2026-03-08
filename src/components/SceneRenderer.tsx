import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { recordReadingBehavior } from '../engine/commune-intelligence'
import type { Choice, SceneNode, StressState, VisualEffect } from '../engine/types'
import { DeadlineChoicePanel } from './DeadlineChoicePanel'
import { DestabilizedText } from './DestabilizedText'
import { GhostEcho } from './GhostEcho'
import { HesitationWhisper } from './HesitationWhisper'
import { PerceptionCompositor } from './PerceptionCompositor'
import type { RuntimeBridge } from './runtimeBridge'

const DEFAULT_AUTO_ADVANCE_MS = 1700
const EASE_LINEAR = cubicBezier(0, 0, 1, 1)
const EASE_BREATHE = cubicBezier(0.42, 0, 0.58, 1)
const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)
const EASE_RITUAL = cubicBezier(0.16, 1, 0.3, 1)

const BACKGROUND_MAP: Record<string, string> = {
  road_sweden:
    'linear-gradient(145deg, rgba(209,230,193,0.95) 0%, rgba(151,184,150,0.92) 30%, rgba(207,226,244,0.96) 70%, rgba(252,246,233,0.98) 100%)',
  harga_gate:
    'radial-gradient(circle at top, rgba(244,222,168,0.68), transparent 45%), linear-gradient(150deg, rgba(254,250,243,1) 0%, rgba(247,238,216,0.92) 55%, rgba(235,214,173,0.82) 100%)',
  harga_meadow:
    'linear-gradient(155deg, rgba(239,245,202,0.96) 0%, rgba(192,216,126,0.92) 38%, rgba(246,232,183,0.92) 72%, rgba(254,250,243,0.95) 100%)',
  harga_feast:
    'radial-gradient(circle at top, rgba(245,214,143,0.48), transparent 40%), linear-gradient(135deg, rgba(255,249,236,1) 0%, rgba(237,209,144,0.88) 48%, rgba(214,165,89,0.66) 100%)',
  harga_perimeter:
    'linear-gradient(150deg, rgba(225,234,214,0.96) 0%, rgba(169,187,155,0.9) 48%, rgba(196,209,198,0.88) 100%)',
  harga_sleeping_quarters:
    'linear-gradient(135deg, rgba(252,246,235,0.98) 0%, rgba(237,219,191,0.92) 44%, rgba(215,184,145,0.84) 100%)',
  sleeping_quarters_night:
    'radial-gradient(circle at top right, rgba(255,204,112,0.32), transparent 40%), linear-gradient(135deg, rgba(254,247,223,0.98) 0%, rgba(244,212,140,0.82) 40%, rgba(168,123,75,0.78) 100%)',
  dream_meadow:
    'radial-gradient(circle at 20% 10%, rgba(255,214,153,0.4), transparent 38%), linear-gradient(140deg, rgba(255,248,225,0.96) 0%, rgba(237,198,169,0.9) 30%, rgba(243,218,133,0.9) 65%, rgba(195,233,170,0.82) 100%)',
  default: 'linear-gradient(135deg, rgba(254,250,243,1) 0%, rgba(249,243,231,1) 100%)',
}

function getBackground(background?: string) {
  return BACKGROUND_MAP[background ?? 'default'] ?? BACKGROUND_MAP.default
}

function getTransition(scene: SceneNode) {
  switch (scene.transitionType) {
    case 'cut':
      return {
        initial: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0.98, transition: { duration: 0.08 } },
        transition: { duration: 0.12, ease: EASE_LINEAR },
      }
    case 'dissolve':
      return {
        initial: { opacity: 0, scale: 1.008, filter: 'blur(14px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 0.996, filter: 'blur(12px)' },
        transition: { duration: 1.55, ease: EASE_SOFT },
      }
    case 'breathe':
      return {
        initial: { opacity: 0, scale: 0.996, filter: 'blur(12px)' },
        animate: {
          opacity: [0.88, 1, 0.94, 1],
          scale: [0.998, 1, 1.002, 1],
          filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
        },
        exit: { opacity: 0, scale: 0.997, filter: 'blur(12px)' },
        transition: { duration: 3.4, times: [0, 0.3, 0.7, 1], ease: EASE_BREATHE },
      }
    case 'ritual':
      return {
        initial: { opacity: 0, scale: 1.02, filter: 'blur(10px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 0.985, filter: 'blur(14px)' },
        transition: { duration: 2.2, ease: EASE_RITUAL },
      }
    case 'fade':
    default:
      return {
        initial: { opacity: 0, y: 22, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -12, filter: 'blur(8px)' },
        transition: { duration: 1.25, ease: EASE_SOFT },
      }
  }
}

export function SceneRenderer({
  scene,
  resolvedText,
  typingDelay,
  chorusLevel,
  choices,
  effects,
  stress,
  distortionLevel,
  onChoose,
  onAdvance,
  registerBridge,
}: {
  scene: SceneNode
  resolvedText: string
  typingDelay: number
  chorusLevel: number
  choices: Choice[]
  effects: VisualEffect[]
  stress?: StressState
  distortionLevel?: number
  onChoose: (choiceId: string) => void
  onAdvance: () => void
  registerBridge?: (bridge: RuntimeBridge | null) => void
}) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const elapsedRef = useRef(0)
  const autoAdvancedRef = useRef(false)
  const didFastForwardRef = useRef(false)
  const readingRecordedRef = useRef(false)

  const pauseAfterMs = scene.pauseAfterMs ?? 900
  const typingDurationMs = typingDelay === 0 ? 0 : resolvedText.length * typingDelay
  const revealChoicesAtMs = typingDurationMs + pauseAfterMs
  const autoAdvanceAtMs =
    choices.length === 0 && scene.next
      ? revealChoicesAtMs + (scene.autoAdvanceMs ?? DEFAULT_AUTO_ADVANCE_MS)
      : Number.POSITIVE_INFINITY

  const deadline = Number.isFinite(autoAdvanceAtMs)
    ? autoAdvanceAtMs
    : choices.length > 0
      ? revealChoicesAtMs
      : typingDurationMs

  useEffect(() => {
    // Record reading behavior from previous scene before resetting
    if (readingRecordedRef.current === false && elapsedRef.current > 0) {
      recordReadingBehavior(didFastForwardRef.current)
    }
    elapsedRef.current = 0
    autoAdvancedRef.current = false
    didFastForwardRef.current = false
    readingRecordedRef.current = false
    setElapsedMs(0)
  }, [scene.id, resolvedText, typingDelay, pauseAfterMs])

  const advanceElapsed = useCallback((ms: number) => {
    setElapsedMs((current) => {
      const next = Math.max(0, current + ms)
      elapsedRef.current = next
      return next
    })
  }, [])

  useEffect(() => {
    if (deadline === 0 || elapsedMs >= deadline) return

    let frameId = 0
    let previous = performance.now()

    const tick = (now: number) => {
      const delta = now - previous
      previous = now
      advanceElapsed(delta)
      if (elapsedRef.current < deadline) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [advanceElapsed, deadline, elapsedMs])

  useEffect(() => {
    if (!Number.isFinite(autoAdvanceAtMs) || autoAdvancedRef.current || elapsedMs < autoAdvanceAtMs) {
      return
    }

    autoAdvancedRef.current = true
    onAdvance()
  }, [autoAdvanceAtMs, elapsedMs, onAdvance])

  const typedCharacters = useMemo(() => {
    if (typingDelay === 0) return resolvedText.length
    return Math.max(0, Math.min(resolvedText.length, Math.floor(elapsedMs / typingDelay)))
  }, [elapsedMs, resolvedText.length, typingDelay])

  const textComplete = typedCharacters >= resolvedText.length
  const choicesVisible = choices.length > 0 && elapsedMs >= revealChoicesAtMs

  // Record reading completion when text finishes naturally (not from fast-forward)
  useEffect(() => {
    if (textComplete && !readingRecordedRef.current && !didFastForwardRef.current) {
      readingRecordedRef.current = true
      recordReadingBehavior(false)
    }
  }, [textComplete])
  const displayedText = resolvedText.slice(0, typedCharacters)
  const transition = getTransition(scene)
  const background = getBackground(scene.background)

  const fastForward = useCallback(() => {
    if (!textComplete) {
      didFastForwardRef.current = true
      elapsedRef.current = typingDurationMs
      setElapsedMs(typingDurationMs)
      return
    }

    if (!choicesVisible && choices.length > 0) {
      elapsedRef.current = revealChoicesAtMs
      setElapsedMs(revealChoicesAtMs)
      return
    }

    if (Number.isFinite(autoAdvanceAtMs)) {
      elapsedRef.current = autoAdvanceAtMs
      setElapsedMs(autoAdvanceAtMs)
    }
  }, [autoAdvanceAtMs, choices.length, choicesVisible, revealChoicesAtMs, textComplete, typingDurationMs])

  useEffect(() => {
    if (!registerBridge) return

    registerBridge({
      advanceTime: advanceElapsed,
      snapshot: () =>
        JSON.stringify({
          mode: 'scene',
          scene: scene.id,
          chapter: scene.chapter,
          background: scene.background ?? 'default',
          typedCharacters,
          textComplete,
          choicesVisible,
          choices: choicesVisible
            ? choices.map((choice) => ({ id: choice.id, text: choice.text }))
            : [],
          chorusLevel,
        }),
    })

    return () => registerBridge(null)
  }, [
    advanceElapsed,
    choices,
    choicesVisible,
    chorusLevel,
    registerBridge,
    scene.background,
    scene.chapter,
    scene.id,
    textComplete,
    typedCharacters,
  ])

  return (
    <section
      className={[
        'scene-renderer',
        scene.background?.includes('night') ? 'is-night' : '',
        scene.background?.includes('dream') ? 'is-dream' : '',
        scene.transitionType === 'ritual' ? 'is-ritual' : '',
      ].filter(Boolean).join(' ')}
      aria-label={`Day ${scene.day} ${scene.chapter}`}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`background-${scene.id}`}
          className="scene-renderer__backdrop"
          style={{ background }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: EASE_SOFT }}
        />
      </AnimatePresence>

      <div className="scene-renderer__wash" />

      <div className="scene-renderer__frame">
        <PerceptionCompositor effects={effects} chorusLevel={chorusLevel}>
          <AnimatePresence initial={false} mode="wait">
            <motion.article
              key={scene.id}
              className="scene-renderer__scene"
              initial={transition.initial}
              animate={transition.animate}
              exit={transition.exit}
              transition={transition.transition}
            >
              <button
                type="button"
                className="scene-renderer__text-shell"
                onClick={fastForward}
                aria-label="Advance text"
              >
                <span className="scene-renderer__kicker">Day {scene.day}</span>
                <span className="scene-renderer__chapter">{scene.chapter.replace(/_/g, ' ')}</span>
                <span className="scene-renderer__text">
                  <DestabilizedText
                    text={displayedText}
                    distortionLevel={distortionLevel ?? 0}
                  />
                  {!textComplete ? <span className="scene-renderer__cursor" aria-hidden="true" /> : null}
                </span>
              </button>

              <GhostEcho sceneId={scene.id} />

              <DeadlineChoicePanel
                sceneId={scene.id}
                choices={choicesVisible ? choices : []}
                chorusLevel={chorusLevel}
                pressure={scene.pressure}
                pulse={stress?.pulse ?? 0}
                onChoose={onChoose}
              />

              <HesitationWhisper
                choicesVisible={choicesVisible}
                chorusLevel={chorusLevel}
              />
            </motion.article>
          </AnimatePresence>
        </PerceptionCompositor>
      </div>
    </section>
  )
}
