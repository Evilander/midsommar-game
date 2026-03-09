// ─── Choice Regret Flash ─── Ghost text of paths not taken ───
// After the player makes a choice, the rejected options briefly ghost across
// the screen as fading afterimages. The commune wants you to know what you gave up.

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface RegretEntry {
  id: string
  text: string
}

interface ChoiceRegretFlashProps {
  rejectedChoices: string[]
  chorusLevel: number
  enabled: boolean
}

export function ChoiceRegretFlash({ rejectedChoices, chorusLevel, enabled }: ChoiceRegretFlashProps) {
  const [entries, setEntries] = useState<RegretEntry[]>([])

  useEffect(() => {
    if (!enabled || rejectedChoices.length === 0 || chorusLevel < 2) return

    // Only show regret at chorus 2+, and more strongly at higher chorus
    const showCount = Math.min(rejectedChoices.length, chorusLevel >= 4 ? 3 : 1)
    const selected = rejectedChoices.slice(0, showCount)

    const newEntries = selected.map((text, i) => ({
      id: `regret_${Date.now()}_${i}`,
      text,
    }))
    setEntries(newEntries)

    const timer = setTimeout(() => setEntries([]), 3000)
    return () => clearTimeout(timer)
  }, [rejectedChoices, chorusLevel, enabled])

  if (!enabled || chorusLevel < 2) return null

  return (
    <div className="choice-regret-layer" aria-hidden="true">
      <AnimatePresence>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="choice-regret-text"
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{
              opacity: [0, 0.15 + chorusLevel * 0.05, 0],
              y: [20, -10 - i * 30, -40 - i * 30],
              filter: ['blur(4px)', 'blur(1px)', 'blur(6px)'],
            }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            style={{
              top: `${55 + i * 8}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {entry.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
