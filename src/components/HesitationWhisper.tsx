// ─── HesitationWhisper ─── The commune notices when you can't decide ───
// "Hesitation is the wound through which they enter."

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { isPlayerHesitating } from '../engine/commune-intelligence'
import { playGameSound, preloadGameSounds } from '../engine/game-sounds'

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
  const whisperCountRef = useRef(0)
  const lastWhisperRef = useRef('')

  const pickWhisper = useCallback(() => {
    const pool = chorusLevel >= 3 ? WHISPERS_HIGH_CHORUS : WHISPERS_LOW_CHORUS
    // Avoid repeating the same whisper
    let next = pool[Math.floor(Math.random() * pool.length)]
    if (next === lastWhisperRef.current && pool.length > 1) {
      next = pool[(pool.indexOf(next) + 1) % pool.length]
    }
    lastWhisperRef.current = next
    whisperCountRef.current++
    setWhisper(next)
  }, [chorusLevel])

  useEffect(() => {
    startTimeRef.current = performance.now()
    whisperCountRef.current = 0
    void preloadGameSounds(['commune_whisper'])

    // Max whispers: 2 at low chorus, 3 at high chorus — prevents looping
    const maxWhispers = chorusLevel >= 3 ? 3 : 2
    // First whisper after hesitation, then longer cooldowns between subsequent ones
    const interval = setInterval(() => {
      if (whisperCountRef.current >= maxWhispers) return
      const elapsed = performance.now() - startTimeRef.current
      // Require longer hesitation for subsequent whispers (diminishing returns)
      const threshold = whisperCountRef.current === 0 ? 1 : 1.5 + whisperCountRef.current * 0.5
      if (isPlayerHesitating(elapsed / threshold)) {
        pickWhisper()
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [pickWhisper, chorusLevel])

  useEffect(() => {
    if (!whisper) return
    void playGameSound('commune_whisper')
  }, [whisper])

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
