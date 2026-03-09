// ─── PsychedelicOverlay ─── The doors of perception ───
// "The grass starts breathing. Not metaphorically."

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'

import type { PsychedelicLevel } from '../engine/psychedelic'

const EASE_MUSHROOM = cubicBezier(0.33, 1, 0.68, 1)

export function PsychedelicOverlay({ level }: { level: PsychedelicLevel }) {
  if (level === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        key={`psychedelic-${level}`}
        className={`psychedelic psychedelic--level-${level}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3, ease: EASE_MUSHROOM }}
        aria-hidden="true"
      >
        {/* Color wash — hue cycling through the spectrum via mix-blend-mode */}
        <div className="psychedelic__hue" />

        {/* Organic pattern layers — floating radial gradients */}
        <div className="psychedelic__pattern psychedelic__pattern--violet" />
        <div className="psychedelic__pattern psychedelic__pattern--emerald" />
        {level >= 2 && (
          <div className="psychedelic__pattern psychedelic__pattern--gold" />
        )}

        {/* Radial breathing pulse — the world's heartbeat made visible */}
        <div className="psychedelic__pulse" />

        {/* Edge luminance — borders become organic */}
        <div className="psychedelic__edge" />

        {/* Level 2+: Organic tracers — afterimage halos */}
        {level >= 2 && <div className="psychedelic__tracers" />}

        {/* Level 3: Reality fractures — geometric intrusion from the periphery */}
        {level >= 3 && (
          <>
            <div className="psychedelic__fracture" />
            <div className="psychedelic__interference" />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
