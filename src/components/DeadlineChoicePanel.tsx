// ─── DeadlineChoicePanel ─── Timed choices. Silence equals compliance. ───

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getPreviousChoiceId } from '../engine/ghost'
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

  // Ghost memory: what did the player choose here last cycle?
  const ghostChoiceId = useMemo(
    () => choices.length > 0 ? getPreviousChoiceId(sceneId) : null,
    [sceneId, choices.length],
  )

  useEffect(() => {
    setExpired(false)
    expiredRef.current = false
    setTimeRemaining(1)

    if (!pressure || choices.length === 0) return

    const duration = effectiveTimerMs(pressure.timerMs, pulse, pressure.timerShrinkWithPulse ?? false)
    durationRef.current = duration
    startRef.current = performance.now()

    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const remaining = Math.max(0, 1 - elapsed / duration)
      setTimeRemaining(remaining)

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true
        setExpired(true)
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
      onChoose(choiceId)
    },
    [expired, onChoose],
  )

  if (choices.length === 0) return null

  const urgencyClass = timeRemaining < 0.25 ? ' deadline-choice--urgent' : ''
  const heartbeatBpm = pressure?.timerStyle === 'heartbeat' ? pulseToBPM(pulse) : 0
  const heartbeatDuration = heartbeatBpm > 0 ? 60 / heartbeatBpm : 0

  return (
    <AnimatePresence>
      {choices.length > 0 ? (
        <motion.div
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
