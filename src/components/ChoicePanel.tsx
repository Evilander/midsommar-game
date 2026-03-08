import { AnimatePresence, motion } from 'framer-motion'

import type { Choice } from '../engine/types'

export function ChoicePanel({
  choices,
  chorusLevel,
  onChoose,
}: {
  choices: Choice[]
  chorusLevel: number
  onChoose: (choiceId: string) => void
}) {
  const chorusActive = chorusLevel >= 3

  return (
    <AnimatePresence>
      {choices.length > 0 ? (
        <motion.div
          key={choices.map((choice) => choice.id).join(':')}
          className="choice-panel"
          initial={{ opacity: 0, y: 14 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.9,
              staggerChildren: 0.18,
              delayChildren: 0.08,
            },
          }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.35 } }}
        >
          {choices.map((choice) => (
            <motion.button
              key={choice.id}
              type="button"
              className={`choice-button${chorusActive ? ' choice-button--chorus' : ''}`}
              onClick={() => onChoose(choice.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.992 }}
            >
              <span className="choice-button__label">{choice.text}</span>
              <span className="choice-button__motif" aria-hidden="true">
                <svg viewBox="0 0 120 26" role="presentation">
                  <path
                    d="M4 20C23 8 40 8 60 19C81 8 98 8 116 20"
                    fill="none"
                    pathLength="1"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.2"
                  />
                  <circle cx="22" cy="12" r="2.4" fill="currentColor" />
                  <circle cx="60" cy="7" r="2.2" fill="currentColor" />
                  <circle cx="98" cy="12" r="2.4" fill="currentColor" />
                </svg>
              </span>
            </motion.button>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
