// ─── Clue Journal ─── What you know. What they let you remember. ───
// "Evidence is only evidence if you can still read it."

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import type { Clue } from '../engine/types'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

const SUBJECT_LABELS: Record<string, string> = {
  mark: 'Mark',
  josh: 'Josh',
  simon: 'Simon',
  connie: 'Connie',
  ritual: 'Rituals',
  rune: 'Runes',
  general: 'Notes',
}

/** Determine if a clue has been corrupted by the chorus */
function getClueText(clue: Clue, chorusLevel: number): { text: string; corrupted: boolean } {
  if (clue.degradeAtChorus !== undefined && chorusLevel >= clue.degradeAtChorus && clue.corruptedText) {
    return { text: clue.corruptedText, corrupted: true }
  }
  return { text: clue.text, corrupted: false }
}

export function ClueJournal({
  clues,
  chorusLevel,
  open,
  onClose,
}: {
  clues: Clue[]
  chorusLevel: number
  open: boolean
  onClose: () => void
}) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  // Group clues by subject
  const grouped = useMemo(() => {
    const groups: Record<string, Clue[]> = {}
    for (const clue of clues) {
      if (!groups[clue.subject]) groups[clue.subject] = []
      groups[clue.subject].push(clue)
    }
    return groups
  }, [clues])

  const subjects = Object.keys(grouped)
  const activeClues = selectedSubject ? (grouped[selectedSubject] ?? []) : clues

  // Count corrupted clues
  const corruptedCount = clues.filter(c =>
    c.degradeAtChorus !== undefined && chorusLevel >= c.degradeAtChorus && c.corruptedText
  ).length

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="clue-journal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_SOFT }}
        >
          <motion.div
            className="clue-journal__panel"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_SOFT }}
          >
            <div className="clue-journal__header">
              <h2 className="clue-journal__title">Evidence</h2>
              {corruptedCount > 0 && (
                <span className="clue-journal__corrupted-count">
                  {corruptedCount} altered
                </span>
              )}
              <button
                type="button"
                className="clue-journal__close"
                onClick={onClose}
                aria-label="Close journal"
              >
                &times;
              </button>
            </div>

            {clues.length === 0 ? (
              <p className="clue-journal__empty">
                {chorusLevel >= 3
                  ? 'There is nothing to find here.'
                  : 'No evidence collected yet.'}
              </p>
            ) : (
              <>
                <div className="clue-journal__tabs">
                  <button
                    type="button"
                    className={`clue-journal__tab${selectedSubject === null ? ' clue-journal__tab--active' : ''}`}
                    onClick={() => setSelectedSubject(null)}
                  >
                    All
                  </button>
                  {subjects.map(subject => (
                    <button
                      key={subject}
                      type="button"
                      className={`clue-journal__tab${selectedSubject === subject ? ' clue-journal__tab--active' : ''}`}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {SUBJECT_LABELS[subject] ?? subject}
                    </button>
                  ))}
                </div>

                <ul className="clue-journal__list">
                  {activeClues.map((clue, i) => {
                    const { text, corrupted } = getClueText(clue, chorusLevel)
                    return (
                      <motion.li
                        key={clue.id}
                        className={`clue-journal__entry${corrupted ? ' clue-journal__entry--corrupted' : ''}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: corrupted ? 0.5 : 0.85, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3, ease: EASE_SOFT }}
                      >
                        <span className="clue-journal__entry-subject">
                          {SUBJECT_LABELS[clue.subject] ?? clue.subject}
                        </span>
                        <span className={`clue-journal__entry-text${corrupted ? ' clue-journal__entry-text--corrupted' : ''}`}>
                          {text}
                        </span>
                        {corrupted && (
                          <span className="clue-journal__entry-altered" aria-label="This memory has been altered">
                            altered
                          </span>
                        )}
                      </motion.li>
                    )
                  })}
                </ul>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
