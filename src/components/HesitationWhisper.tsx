// ─── HesitationWhisper ─── The commune notices when you can't decide ───
// "Hesitation is the wound through which they enter."

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { isPlayerHesitating } from '../engine/commune-intelligence'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

// Whispers the commune makes when it detects hesitation
const WHISPERS_LOW_CHORUS = [
  'Take your time.',
  'There is no wrong choice here.',
  'We understand.',
  'It is alright.',
]

const WHISPERS_HIGH_CHORUS = [
  'We can choose for you.',
  'Let us help.',
  'You are thinking too hard.',
  'Trust the family.',
  'We know what you need.',
  'Stop struggling.',
  'It is easier this way.',
]

export function HesitationWhisper({
  choicesVisible,
  chorusLevel,
}: {
  choicesVisible: boolean
  chorusLevel: number
}) {
  const [whisper, setWhisper] = useState<string | null>(null)
  const [startTime] = useState(() => performance.now())

  useEffect(() => {
    if (!choicesVisible) {
      setWhisper(null)
      return
    }

    // Check every second whether the player is hesitating
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime
      if (isPlayerHesitating(elapsed)) {
        const pool = chorusLevel >= 3 ? WHISPERS_HIGH_CHORUS : WHISPERS_LOW_CHORUS
        setWhisper(pool[Math.floor(Math.random() * pool.length)])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [choicesVisible, chorusLevel, startTime])

  return (
    <AnimatePresence>
      {whisper && (
        <motion.div
          key={whisper}
          className="hesitation-whisper"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: chorusLevel >= 3 ? 0.55 : 0.3, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 1.2, ease: EASE_SOFT }}
        >
          <span className="hesitation-whisper__text">{whisper}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
