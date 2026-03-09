// ─── DeadlineChoicePanel ─── Timed choices. Silence equals compliance. ───

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { adaptiveTimerMultiplier } from '../engine/commune-intelligence'
import { playGameSound, preloadGameSounds } from '../engine/game-sounds'
import { getPreviousChoiceId } from '../engine/ghost'
import { beginIntentTrace, recordIntentHover } from '../engine/intent-harvest'
import type { Choice, PressureConfig } from '../engine/types'
import { effectiveTimerMs, pulseToBPM } from '../engine/stress'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

type Alignment = 'commune' | 'resistance' | 'neutral'

/** Detect whether the commune "wants" the player to pick this choice */
function detectAlignment(choice: Choice, pressure?: PressureConfig): Alignment {
  // Strongest signal: this is the commune's auto-pick under time pressure
  if (pressure?.defaultChoice === choice.id) return 'commune'

  // Has a chorus voice variant — the commune speaks through it
  if (choice.chorusText) return 'commune'

  const fx = choice.effects
  // Effects that serve the commune
  if (fx.chorus && fx.chorus > 0) return 'commune'
  if (fx.perception?.belonging && fx.perception.belonging > 5) return 'commune'
  if (fx.perception?.autonomy && fx.perception.autonomy < -5) return 'commune'

  // Effects that resist the commune
  if (fx.perception?.autonomy && fx.perception.autonomy > 5) return 'resistance'
  if (fx.chorus && fx.chorus < 0) return 'resistance'
  if (fx.perception?.belonging && fx.perception.belonging < -5) return 'resistance'

  return 'neutral'
}

export function DeadlineChoicePanel({
  sceneId,
  choices,
  chorusLevel,
  pressure,
  pulse,
  onChoose,
}: {
  sceneId: string
  choices: Choice[]
  chorusLevel: number
  pressure?: PressureConfig
  pulse: number
  onChoose: (choiceId: string) => void
}) {
  const chorusActive = chorusLevel >= 3
  const [timeRemaining, setTimeRemaining] = useState(1)
  const [expired, setExpired] = useState(false)
  const startRef = useRef(0)
  const durationRef = useRef(0)
  const frameRef = useRef(0)
  const expiredRef = useRef(false)
  const lastTimerSecondRef = useRef<number | null>(null)
  const expireSoundPlayedRef = useRef(false)

  // Ghost memory: what did the player choose here last cycle?
  const ghostChoiceId = useMemo(
    () => choices.length > 0 ? getPreviousChoiceId(sceneId) : null,
    [sceneId, choices.length],
  )

  // Intent Harvest: begin tracking hover patterns when choices appear
  const hoverStartRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    if (choices.length > 0) {
      beginIntentTrace(sceneId, choices)
      void preloadGameSounds([
        'choice_click',
        'choice_hover',
        'choice_commune',
        'choice_resistance',
        'timer_tick',
        'timer_urgent',
        'timer_expire',
      ])
    }
  }, [sceneId, choices])

  useEffect(() => {
    if (!pressure || choices.length === 0) return

    expiredRef.current = false
    lastTimerSecondRef.current = null
    expireSoundPlayedRef.current = false
    setExpired(false)
    const adaptedTimerMs = Math.round(pressure.timerMs * adaptiveTimerMultiplier())
    const duration = effectiveTimerMs(adaptedTimerMs, pulse, pressure.timerShrinkWithPulse ?? false)
    durationRef.current = duration
    startRef.current = performance.now()

    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const remaining = Math.max(0, 1 - elapsed / duration)
      setTimeRemaining(remaining)

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true
        setExpired(true)
        // Track timer expiry for communion stats
        import('../engine/communion-tracker').then(m => m.recordTimerExpiry())
        onChoose(pressure.defaultChoice)
        return
      }

      if (remaining > 0) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [choices, pressure, pulse, onChoose])

  const handleChoose = useCallback(
    (choiceId: string) => {
      if (expired) return
      cancelAnimationFrame(frameRef.current)
      void playGameSound('choice_click')
      onChoose(choiceId)
    },
    [expired, onChoose],
  )

  useEffect(() => {
    if (!pressure || durationRef.current <= 0 || expired) return

    const remainingSeconds = Math.ceil((timeRemaining * durationRef.current) / 1000)
    if (remainingSeconds <= 0) return

    const previousSecond = lastTimerSecondRef.current
    if (previousSecond === null) {
      lastTimerSecondRef.current = remainingSeconds
      return
    }

    if (remainingSeconds < previousSecond) {
      lastTimerSecondRef.current = remainingSeconds
      void playGameSound(timeRemaining <= 0.25 ? 'timer_urgent' : 'timer_tick')
    }
  }, [expired, pressure, timeRemaining])

  useEffect(() => {
    if (!expired || expireSoundPlayedRef.current) return

    expireSoundPlayedRef.current = true
    void playGameSound('timer_expire')
  }, [expired])

  // ─── Cursor Influence ─── The commune watches where you deliberate ───
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useLayoutEffect(() => {
    if (choices.length === 0 || chorusLevel < 1) return

    const panel = panelRef.current
    if (!panel) return

    const handleMouseMove = (e: MouseEvent) => {
      buttonRefs.current.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        // Normalize: 0 = far away, 1 = directly over button
        const maxDist = 200
        const proximity = Math.max(0, 1 - dist / maxDist)
        // Scale effect by chorus level (subtle at 1, strong at 5)
        const intensity = proximity * Math.min(1, chorusLevel / 4)
        btn.style.setProperty('--cursor-proximity', intensity.toFixed(3))

        // Cursor friction: resistance choices shift away from approaching cursor
        if (chorusLevel >= 3 && btn.dataset.alignment === 'resistance' && dist > 0) {
          // Normalize direction vector, scale by proximity and chorus
          const frictionScale = proximity * Math.min(1, (chorusLevel - 2) / 3) * 4
          const ndx = (dx / dist) * frictionScale * -1
          const ndy = (dy / dist) * frictionScale * -1
          btn.style.setProperty('--friction-x', `${ndx.toFixed(2)}px`)
          btn.style.setProperty('--friction-y', `${ndy.toFixed(2)}px`)
        } else {
          btn.style.setProperty('--friction-x', '0px')
          btn.style.setProperty('--friction-y', '0px')
        }
      })
    }

    // Listen on document for mouse moves anywhere near the panel
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [choices.length, chorusLevel])

  const handleHoverStart = useCallback((choice: Choice, alignment: Alignment) => {
    hoverStartRef.current.set(choice.id, performance.now())

    if (alignment === 'commune') {
      void playGameSound('choice_commune')
      return
    }

    if (alignment === 'resistance') {
      void playGameSound('choice_resistance')
      return
    }

    void playGameSound('choice_hover')
  }, [])

  if (choices.length === 0) return null

  const urgencyClass = timeRemaining < 0.25 ? ' deadline-choice--urgent' : ''
  const heartbeatBpm = pressure?.timerStyle === 'heartbeat' ? pulseToBPM(pulse) : 0
  const heartbeatDuration = heartbeatBpm > 0 ? 60 / heartbeatBpm : 0

  return (
    <AnimatePresence>
      {choices.length > 0 ? (
        <motion.div
          ref={panelRef}
          key={choices.map((c) => c.id).join(':')}
          className={`deadline-choice${urgencyClass}`}
          data-chorus={chorusLevel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: EASE_SOFT }}
        >
          {pressure?.timerStyle === 'visible' && (
            <div className="deadline-choice__timer-track">
              <motion.div
                className="deadline-choice__timer-fill"
                style={{
                  width: `${timeRemaining * 100}%`,
                  backgroundColor: timeRemaining > 0.5
                    ? 'var(--accent)'
                    : timeRemaining > 0.25
                      ? '#d4a340'
                      : 'var(--blood)',
                }}
              />
            </div>
          )}

          {choices.map((choice, i) => {
            const alignment = chorusLevel >= 2
              ? detectAlignment(choice, pressure)
              : 'neutral'
            const alignmentClass = alignment === 'commune'
              ? ' choice-button--commune'
              : alignment === 'resistance'
                ? ' choice-button--resistance'
                : ''
            const ghostClass = ghostChoiceId === choice.id
              ? ' choice-button--ghost'
              : ''

            return (
              <motion.button
                key={choice.id}
                ref={(el: HTMLButtonElement | null) => {
                  if (el) buttonRefs.current.set(choice.id, el)
                  else buttonRefs.current.delete(choice.id)
                }}
                type="button"
                className={`choice-button${chorusActive ? ' choice-button--chorus' : ''}${alignmentClass}${ghostClass}`}
                data-alignment={alignment}
                initial={{ opacity: 0, x: -12 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: pressure?.timerStyle === 'heartbeat' && heartbeatDuration > 0
                    ? [1, 1.03, 1]
                    : 1,
                }}
                transition={
                  pressure?.timerStyle === 'heartbeat' && heartbeatDuration > 0
                    ? {
                        opacity: { duration: 0.4, delay: i * 0.12 },
                        x: { duration: 0.4, delay: i * 0.12 },
                        scale: {
                          duration: heartbeatDuration,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }
                    : { duration: 0.4, delay: i * 0.12, ease: EASE_SOFT }
                }
                onClick={() => handleChoose(choice.id)}
                onMouseEnter={() => handleHoverStart(choice, alignment)}
                onMouseLeave={() => {
                  const start = hoverStartRef.current.get(choice.id)
                  if (start) {
                    recordIntentHover(choice.id, performance.now() - start)
                    hoverStartRef.current.delete(choice.id)
                  }
                }}
                disabled={expired}
                style={
                  urgencyClass
                    ? { animation: `timerShake 0.15s ease-in-out infinite alternate` }
                    : undefined
                }
              >
                {choice.text}
              </motion.button>
            )
          })}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
