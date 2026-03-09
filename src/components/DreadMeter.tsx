// ─── Dread Meter ─── A subtle HUD showing psychological dissolution ───
// Displays as a thin bar at the bottom of the screen.
// Left side = Autonomy (cold blue), Right side = Belonging (warm gold).
// The bar shifts as the player assimilates. At high chorus, it pulses.
// Clicking reveals detailed perception stats.

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { getCommunionRatio } from '../engine/communion-tracker'

function CommunionRatio() {
  const { surrendered, resisted } = getCommunionRatio()
  if (surrendered === 0 && resisted === 0) return null
  return (
    <div className="dread-meter__stat">
      <span className="dread-meter__stat-label">Communion</span>
      <span className="dread-meter__stat-value dread-meter__stat-value--communion">
        {surrendered} / {resisted}
      </span>
    </div>
  )
}

interface DreadMeterProps {
  belonging: number
  autonomy: number
  grief: number
  chorusLevel: number
  pulse: number
  day: number
  enabled: boolean
}

export function DreadMeter({
  belonging,
  autonomy,
  grief,
  chorusLevel,
  pulse,
  day,
  enabled,
}: DreadMeterProps) {
  const [expanded, setExpanded] = useState(false)
  const toggle = useCallback(() => setExpanded(v => !v), [])

  if (!enabled || day < 1) return null

  // Balance: 0 = full autonomy, 100 = full belonging
  const balance = Math.round(
    (belonging / (belonging + autonomy + 1)) * 100,
  )

  // Pulse animation speed based on stress
  const pulseSpeed = pulse > 70 ? '1s' : pulse > 40 ? '2.5s' : '0s'

  // Label based on state
  const label =
    chorusLevel >= 5 ? 'WE ARE' :
    chorusLevel >= 4 ? 'DISSOLVING' :
    chorusLevel >= 3 ? 'YIELDING' :
    balance > 65 ? 'BELONGING' :
    balance < 35 ? 'RESISTING' :
    'UNCERTAIN'

  return (
    <>
      <motion.div
        className="dread-meter"
        onClick={toggle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          '--dread-balance': `${balance}%`,
          '--dread-pulse-speed': pulseSpeed,
          '--dread-grief': `${Math.min(100, grief)}%`,
        } as React.CSSProperties}
      >
        <div className="dread-meter__track">
          <div className="dread-meter__fill" />
          <div className="dread-meter__grief-overlay" />
        </div>
        <span className="dread-meter__label">{label}</span>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="dread-meter__detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="dread-meter__stat">
              <span className="dread-meter__stat-label">Belonging</span>
              <div className="dread-meter__stat-bar">
                <div className="dread-meter__stat-fill dread-meter__stat-fill--belonging" style={{ width: `${belonging}%` }} />
              </div>
              <span className="dread-meter__stat-value">{belonging}</span>
            </div>
            <div className="dread-meter__stat">
              <span className="dread-meter__stat-label">Autonomy</span>
              <div className="dread-meter__stat-bar">
                <div className="dread-meter__stat-fill dread-meter__stat-fill--autonomy" style={{ width: `${autonomy}%` }} />
              </div>
              <span className="dread-meter__stat-value">{autonomy}</span>
            </div>
            <div className="dread-meter__stat">
              <span className="dread-meter__stat-label">Grief</span>
              <div className="dread-meter__stat-bar">
                <div className="dread-meter__stat-fill dread-meter__stat-fill--grief" style={{ width: `${Math.min(100, grief)}%` }} />
              </div>
              <span className="dread-meter__stat-value">{grief}</span>
            </div>
            <div className="dread-meter__stat">
              <span className="dread-meter__stat-label">Chorus</span>
              <div className="dread-meter__stat-bar">
                <div className="dread-meter__stat-fill dread-meter__stat-fill--chorus" style={{ width: `${chorusLevel * 20}%` }} />
              </div>
              <span className="dread-meter__stat-value">{chorusLevel}/5</span>
            </div>
            <div className="dread-meter__stat">
              <span className="dread-meter__stat-label">Day</span>
              <span className="dread-meter__stat-value dread-meter__stat-value--day">{day}/9</span>
            </div>
            <CommunionRatio />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
