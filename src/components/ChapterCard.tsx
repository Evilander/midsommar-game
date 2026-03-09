// ─── ChapterCard ─── Full-screen day/chapter transition ───
// "Every day in Hårga feels like the first day of something you didn't agree to."

import { cubicBezier, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { playGameSound, preloadGameSounds } from '../engine/game-sounds'

const EASE_RITUAL = cubicBezier(0.16, 1, 0.3, 1)

// Day-specific epigraphs — one line that sets the tone
const DAY_EPIGRAPHS: Record<number, string> = {
  1: 'The sun is long here.',
  2: 'It does no good to die kicking and screaming.',
  3: 'One fewer place at the table.',
  4: 'He was never enough.',
  5: 'The crown weighs what it should.',
  6: 'The dance does not lie.',
  7: 'The May Queen decides the ninth.',
  8: 'Everything beautiful is also everything terrible.',
  9: 'The fire catches.',
}

export function ChapterCard({
  day,
  title,
  subtitle,
  onComplete,
}: {
  day: number
  title: string
  subtitle?: string
  onComplete: () => void
}) {
  const [phase, setPhase] = useState<'entering' | 'holding' | 'exiting'>('entering')

  useEffect(() => {
    void preloadGameSounds(['chapter_transition'])
    void playGameSound('chapter_transition')

    const holdTimer = setTimeout(() => setPhase('holding'), 800)
    const exitTimer = setTimeout(() => setPhase('exiting'), 3500)
    const completeTimer = setTimeout(onComplete, 4800)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const epigraph = subtitle ?? DAY_EPIGRAPHS[day] ?? ''

  return (
    <motion.div
      className="chapter-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
      transition={{ duration: phase === 'entering' ? 1.2 : 1.3, ease: EASE_RITUAL }}
    >
      <motion.div
        className="chapter-card__content"
        initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
        animate={{
          y: phase === 'exiting' ? -20 : 0,
          opacity: phase === 'entering' ? 0 : phase === 'exiting' ? 0 : 1,
          filter: phase === 'holding' ? 'blur(0px)' : 'blur(8px)',
        }}
        transition={{ duration: 1.5, ease: EASE_RITUAL }}
      >
        <span className="chapter-card__day">Day {day}</span>
        <h1 className="chapter-card__title">{title}</h1>
        {epigraph && (
          <motion.p
            className="chapter-card__epigraph"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'holding' ? 0.6 : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {epigraph}
          </motion.p>
        )}
      </motion.div>

      {/* Decorative line */}
      <motion.div
        className="chapter-card__line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: phase === 'holding' ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE_RITUAL }}
      />
    </motion.div>
  )
}
