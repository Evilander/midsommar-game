// ─── Content Warning ─── Respect before immersion ───

import { cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

const MIN_DISPLAY_MS = 3000

export function ContentWarning({ onAccept }: { onAccept: () => void }) {
  const [canProceed, setCanProceed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setCanProceed(true), MIN_DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleAccept = useCallback(() => {
    if (canProceed) onAccept()
  }, [canProceed, onAccept])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (canProceed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        onAccept()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [canProceed, onAccept])

  return (
    <motion.section
      className="content-warning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: EASE_SOFT }}
      onClick={handleAccept}
    >
      <div className="content-warning__inner">
        <motion.p
          className="content-warning__label"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: EASE_SOFT }}
        >
          Content Warning
        </motion.p>

        <motion.p
          className="content-warning__body"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: EASE_SOFT }}
        >
          This game explores grief, suicide, familial death, cult manipulation,
          drug use, emotional abuse, and ritual violence. Some scenes depict
          panic attacks, dissociation, and coercive control.
        </motion.p>

        <motion.p
          className="content-warning__body"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ delay: 1.4, duration: 1.2, ease: EASE_SOFT }}
        >
          The game is designed to be uncomfortable. If any of these subjects
          are harmful to you, please take care of yourself first.
        </motion.p>

        <motion.p
          className="content-warning__resource"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          988 Suicide &amp; Crisis Lifeline — call or text 988
        </motion.p>

        <motion.button
          type="button"
          className="content-warning__proceed"
          initial={{ opacity: 0 }}
          animate={{ opacity: canProceed ? 0.5 : 0 }}
          transition={{ duration: 0.8 }}
          onClick={handleAccept}
        >
          I understand
        </motion.button>
      </div>
    </motion.section>
  )
}
