// ─── HesitationWhisper ─── The commune notices when you can't decide ───
// "Hesitation is the wound through which they enter."

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { isPlayerHesitating } from '../engine/commune-intelligence'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

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

function HesitationWhisperInner({ chorusLevel }: { chorusLevel: number }) {
  const [whisper, setWhisper] = useState<string | null>(null)
  const startTimeRef = useRef(0)

  const pickWhisper = useCallback(() => {
    const pool = chorusLevel >= 3 ? WHISPERS_HIGH_CHORUS : WHISPERS_LOW_CHORUS
    setWhisper(pool[Math.floor(Math.random() * pool.length)])
  }, [chorusLevel])

  useEffect(() => {
    startTimeRef.current = performance.now()

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current
      if (isPlayerHesitating(elapsed)) {
        pickWhisper()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [pickWhisper])

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

/** Mounts/unmounts based on choicesVisible — remounting resets all state cleanly */
export function HesitationWhisper({
  choicesVisible,
  chorusLevel,
}: {
  choicesVisible: boolean
  chorusLevel: number
}) {
  if (!choicesVisible) return null
  return <HesitationWhisperInner chorusLevel={chorusLevel} />
}
