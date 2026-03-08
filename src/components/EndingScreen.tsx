// ─── EndingScreen ─── The last image before the exhale ───

import { cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { completeCycle, getCycleCount, getSeenEndings } from '../engine/ghost'
import type { GameState } from '../engine/types'

const EASE_RITUAL = cubicBezier(0.16, 1, 0.3, 1)

type EndingType = 'fire' | 'walk' | 'sacrifice'

interface EndingData {
  lines: string[]
  background: string
  accentColor: string
}

const ENDINGS: Record<EndingType, EndingData> = {
  fire: {
    lines: [
      'The fire catches.',
      'Nine days of grief, released.',
      'The May Queen smiles.',
      'She is home.',
    ],
    background: 'radial-gradient(ellipse at center, rgba(255,200,80,0.3) 0%, rgba(139,37,0,0.15) 50%, rgba(254,250,243,1) 100%)',
    accentColor: '#c4a35a',
  },
  walk: {
    lines: [
      'The road is long.',
      'Eighteen kilometers of silence.',
      'The flowers are still in her hair.',
      'She chose it.',
    ],
    background: 'linear-gradient(180deg, rgba(196,209,220,0.6) 0%, rgba(212,229,247,0.4) 40%, rgba(254,250,243,1) 100%)',
    accentColor: '#8a9aab',
  },
  sacrifice: {
    lines: [
      'She steps inside.',
      'The ninth place was always hers.',
      'The flowers catch.',
      'It does not hurt.',
    ],
    background: 'radial-gradient(ellipse at center, rgba(196,163,90,0.25) 0%, rgba(139,37,0,0.08) 60%, rgba(60,42,22,0.9) 100%)',
    accentColor: '#c4a35a',
  },
}

function detectEnding(state: GameState): EndingType {
  if (state.flags.entered_temple) return 'sacrifice'
  if (state.flags.dropped_torch) return 'walk'
  return 'fire'
}

export function EndingScreen({
  gameState,
  onContinue,
}: {
  gameState: GameState
  onContinue: () => void
}) {
  const ending = detectEnding(gameState)
  const endingConfig = ENDINGS[ending]
  const [visibleLines, setVisibleLines] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const recordedRef = useRef(false)

  // Record this cycle's completion for the ghost system
  useEffect(() => {
    if (recordedRef.current) return
    recordedRef.current = true
    completeCycle(ending)
  }, [ending])

  const cycleCount = getCycleCount()
  const seenEndings = getSeenEndings()

  // Build the lines to display, adding cycle-aware text on subsequent playthroughs
  const displayLines = [...endingConfig.lines]
  if (cycleCount >= 2 && seenEndings.length >= 3) {
    displayLines.push('Every ending is hers.')
  } else if (cycleCount >= 2) {
    displayLines.push('She has always been here.')
  } else if (cycleCount === 1) {
    displayLines.push('She has been here before.')
  }

  useEffect(() => {
    setVisibleLines(0)
    setCanSkip(false)

    const timers: ReturnType<typeof setTimeout>[] = []

    displayLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 1800 * (i + 1)))
    })

    timers.push(setTimeout(() => setCanSkip(true), 3000))

    return () => timers.forEach(clearTimeout)
  }, [displayLines.length])

  const handleContinue = useCallback(() => {
    if (canSkip) onContinue()
  }, [canSkip, onContinue])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (canSkip && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        onContinue()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [canSkip, onContinue])

  return (
    <motion.section
      className={`ending-screen ending-screen--${ending}`}
      style={{ background: endingConfig.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: EASE_RITUAL }}
      onClick={handleContinue}
    >
      <div className="ending-screen__content">
        {displayLines.map((line, i) => {
          const isLast = i === displayLines.length - 1
          const isGhostLine = i >= endingConfig.lines.length
          return (
            <motion.p
              key={i}
              className={`ending-screen__line${isGhostLine ? ' ending-screen__line--ghost' : ''}`}
              style={{ color: isLast ? endingConfig.accentColor : undefined }}
              initial={{ opacity: 0, y: 12 }}
              animate={i < visibleLines ? { opacity: isGhostLine ? 0.4 : isLast ? 1 : 0.7, y: 0 } : {}}
              transition={{ duration: isGhostLine ? 2.5 : 1.5, ease: EASE_RITUAL }}
            >
              {line}
            </motion.p>
          )
        })}
      </div>

      <motion.button
        type="button"
        className="ending-screen__continue"
        initial={{ opacity: 0 }}
        animate={{ opacity: canSkip ? 0.4 : 0 }}
        transition={{ duration: 1 }}
        onClick={onContinue}
      >
        Continue
      </motion.button>
    </motion.section>
  )
}
