import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { getCycleCount } from '../engine/ghost'
import type { RuntimeBridge } from './runtimeBridge'

const HOLD_DURATION_MS = 3000

function TitleFlower({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 140 140" role="presentation" aria-hidden="true">
      <g fill="currentColor" opacity="0.85">
        <ellipse cx="70" cy="24" rx="11" ry="23" />
        <ellipse cx="104" cy="44" rx="11" ry="23" transform="rotate(56 104 44)" />
        <ellipse cx="112" cy="83" rx="11" ry="23" transform="rotate(113 112 83)" />
        <ellipse cx="70" cy="108" rx="11" ry="23" transform="rotate(180 70 108)" />
        <ellipse cx="28" cy="83" rx="11" ry="23" transform="rotate(247 28 83)" />
        <ellipse cx="36" cy="44" rx="11" ry="23" transform="rotate(304 36 44)" />
      </g>
      <circle cx="70" cy="70" r="16" fill="var(--accent)" opacity="0.68" />
    </svg>
  )
}

export function TitleScreen({
  onStart,
  hasSaveData,
  onContinue,
  registerBridge,
}: {
  onStart: () => void
  hasSaveData?: boolean
  onContinue?: () => void
  registerBridge?: (bridge: RuntimeBridge | null) => void
}) {
  const [holdMs, setHoldMs] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const cycles = getCycleCount()

  const holdRef = useRef(0)
  const holdingRef = useRef(false)
  const completedRef = useRef(false)
  const frameRef = useRef(0)
  const previousRef = useRef(0)

  const progress = Math.min(1, holdMs / HOLD_DURATION_MS)

  const completeHold = () => {
    if (completedRef.current) return
    completedRef.current = true
    holdingRef.current = false
    setIsHolding(false)
    window.cancelAnimationFrame(frameRef.current)
    onStart()
  }

  const updateHold = (deltaMs: number) => {
    if (!holdingRef.current || completedRef.current) return

    const next = Math.min(HOLD_DURATION_MS, holdRef.current + deltaMs)
    holdRef.current = next
    setHoldMs(next)

    if (next >= HOLD_DURATION_MS) {
      completeHold()
    }
  }

  const endHold = () => {
    if (completedRef.current) return
    if (holdRef.current >= HOLD_DURATION_MS * 0.98) {
      completeHold()
      return
    }
    holdingRef.current = false
    setIsHolding(false)
    holdRef.current = 0
    setHoldMs(0)
    window.cancelAnimationFrame(frameRef.current)
  }

  const beginHold = () => {
    if (completedRef.current || holdingRef.current) return

    holdingRef.current = true
    setIsHolding(true)
    previousRef.current = performance.now()

    const tick = (timestamp: number) => {
      if (!holdingRef.current) return
      const delta = timestamp - previousRef.current
      previousRef.current = timestamp
      updateHold(delta)
      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (!registerBridge) return

    registerBridge({
      advanceTime: (ms: number) => updateHold(ms),
      snapshot: () =>
        JSON.stringify({
          mode: 'title',
          holdMs: holdRef.current,
          progress: holdRef.current / HOLD_DURATION_MS,
          holding: holdingRef.current,
        }),
    })

    return () => registerBridge(null)
  }, [registerBridge])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      beginHold()
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      endHold()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => () => window.cancelAnimationFrame(frameRef.current), [])

  return (
    <motion.section
      className="title-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <div className="title-screen__grain" aria-hidden="true" />

      <div className="title-screen__content">
        <motion.h1
          className="title-screen__title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          MIDSOMMAR
        </motion.h1>

        {cycles > 0 && (
          <motion.span
            className="title-screen__ghost-whisper"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0.25, 0] }}
            transition={{ duration: 4, times: [0, 0.2, 0.7, 1], delay: 1.8 }}
            aria-hidden="true"
          >
            again
          </motion.span>
        )}

        <motion.div
          className="title-screen__hold-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            className={`title-screen__breath-button${isHolding ? ' is-holding' : ''}`}
            onMouseDown={beginHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={beginHold}
            onTouchEnd={endHold}
            onTouchCancel={endHold}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter') beginHold()
            }}
            onKeyUp={(event) => {
              if (event.key === ' ' || event.key === 'Enter') endHold()
            }}
            aria-label="Hold to breathe"
          >
            <span className="title-screen__breath-copy">HOLD TO BREATHE</span>
            <span className="title-screen__progress" style={{ '--hold-progress': progress } as CSSProperties} />

            <AnimatePresence initial={false}>
              <motion.span
                key={isHolding ? 'holding' : 'idle'}
                className="title-screen__flowers"
                initial={{ opacity: 0.35, scale: 0.92 }}
                animate={{
                  opacity: isHolding ? 0.78 : 0.35,
                  scale: 0.94 + progress * 0.22,
                }}
                exit={{ opacity: 0.3 }}
                transition={{ duration: 0.5 }}
                aria-hidden="true"
              >
                <TitleFlower className="title-screen__flower title-screen__flower--a" />
                <TitleFlower className="title-screen__flower title-screen__flower--b" />
                <TitleFlower className="title-screen__flower title-screen__flower--c" />
                <TitleFlower className="title-screen__flower title-screen__flower--d" />
              </motion.span>
            </AnimatePresence>
          </button>

          {hasSaveData && onContinue && (
            <motion.button
              type="button"
              className="title-screen__continue-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              onClick={onContinue}
            >
              Continue
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
