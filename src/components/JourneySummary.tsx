// ─── JourneySummary ─── A medical chart for a soul ───

import { cubicBezier, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { evaluateAchievements, getAllAchievements, type Achievement } from '../engine/achievements'
import { getProfile, getManipulationStyle } from '../engine/commune-intelligence'
import { getCompletionStats, recordPlaythroughComplete } from '../engine/completion'
import { calculateScore } from '../engine/scoring'
import { getCycleCount } from '../engine/ghost'
import type { GameState } from '../engine/types'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

// Flag → readable moment descriptions
const FLAG_MOMENTS: Record<string, string> = {
  witnessed_attestupa: 'Witnessed the attestupa.',
  drank_tea: 'Drank the mushroom tea.',
  refused_tea: 'Refused the tea.',
  surrendered_to_dance: 'Surrendered to the dance.',
  fought_for_crown: 'Fought for the crown.',
  chose_christian: 'Chose Christian as the ninth.',
  spared_christian: 'Spared Christian.',
  refused_to_choose: 'Refused to choose.',
  lit_the_fire: 'Lit the temple.',
  dropped_torch: 'Dropped the torch.',
  entered_temple: 'Walked into the fire.',
  tried_to_leave_alone: 'Tried to leave alone.',
  let_them_breathe: 'Let them breathe for her.',
  fight_the_trip: 'Fought the trip.',
  confronted_mark: 'Confronted Mark.',
  explored_ruins: 'Explored the ruins.',
  found_blood_book: 'Found the blood book.',
}

// Perception value → contextual label
function perceptionLabel(key: string, value: number): string {
  switch (key) {
    case 'grief':
      if (value > 70) return 'The weight never lifted.'
      if (value > 40) return 'She carried it, but lighter.'
      return 'She let it burn.'
    case 'belonging':
      if (value > 70) return 'She became one of them.'
      if (value > 40) return 'She felt their pull.'
      return 'She stayed herself.'
    case 'trust':
      if (value > 60) return 'She trusted the commune.'
      if (value > 30) return 'She doubted quietly.'
      return 'She never believed.'
    case 'autonomy':
      if (value > 60) return 'She kept saying I.'
      if (value > 30) return 'The I was fading.'
      return 'She stopped saying I.'
    case 'intoxication':
      if (value > 50) return 'The tea never wore off.'
      if (value > 20) return 'Edges remained soft.'
      return 'She stayed clear.'
    case 'sleep':
      if (value > 60) return 'She slept when they let her.'
      if (value > 30) return 'The nights blurred.'
      return 'She forgot what rest felt like.'
    default:
      return ''
  }
}

// The commune's assessment of the player — deeply unsettling personalized text
function communeAssessment(compliance: number, impulsiveness: number, attentiveness: number): string[] {
  const lines: string[] = []

  if (compliance > 0.65) {
    lines.push('She came willingly.')
  } else if (compliance > 0.4) {
    lines.push('She resisted, but not where it mattered.')
  } else {
    lines.push('She fought. We adapted.')
  }

  if (impulsiveness > 0.6) {
    lines.push('Her choices came fast — the body knew before the mind.')
  } else if (impulsiveness < 0.25) {
    lines.push('She weighed every word. We gave her time. Patience is a gift.')
  }

  if (attentiveness > 0.7) {
    lines.push('She read everything. She wanted to understand.')
  } else if (attentiveness < 0.3) {
    lines.push('She skimmed the surface. The roots grew beneath.')
  }

  return lines
}

function endingTitle(state: GameState): string {
  if (state.flags.entered_temple) return 'The Ninth Place'
  if (state.flags.dropped_torch) return 'The Walk Away'
  return 'The Fire'
}

export function JourneySummary({
  gameState,
  onNewGame,
  onCredits,
}: {
  gameState: GameState
  onNewGame: () => void
  onCredits: () => void
}) {
  const cycles = getCycleCount()

  // Evaluate achievements and record completion
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [allAchievements, setAllAchievements] = useState<Array<Achievement & { unlocked: boolean }>>([])
  const [completion, setCompletion] = useState(getCompletionStats())

  useEffect(() => {
    recordPlaythroughComplete()
    const fresh = evaluateAchievements(gameState)
    setNewAchievements(fresh)
    setAllAchievements(getAllAchievements())
    setCompletion(getCompletionStats())
  }, [gameState])

  const unlockedCount = allAchievements.filter(a => a.unlocked).length
  const totalCount = allAchievements.length

  const moments = Object.entries(gameState.flags)
    .filter(([key, val]) => val && FLAG_MOMENTS[key])
    .map(([key]) => FLAG_MOMENTS[key])

  const perceptionEntries = Object.entries(gameState.perception) as [string, number][]
  const score = calculateScore(gameState)
  const communeProfile = getProfile()
  const manipStyle = getManipulationStyle()
  const assessment = communeAssessment(
    communeProfile.compliance,
    communeProfile.impulsiveness,
    communeProfile.attentiveness,
  )

  return (
    <motion.section
      className="journey-summary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_SOFT }}
    >
      <div className="journey-summary__content">
        <motion.h2
          className="journey-summary__title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: EASE_SOFT }}
        >
          {score.title}
        </motion.h2>

        <motion.p
          className="journey-summary__ending"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {score.description}
        </motion.p>

        <motion.p
          className="journey-summary__ending-type"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Ending: {endingTitle(gameState)}
        </motion.p>

        <motion.div
          className="journey-summary__stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          <div className="journey-summary__stat-line">
            <span>Days in Harga</span>
            <span>{gameState.day}</span>
          </div>
          <div className="journey-summary__stat-line">
            <span>Scenes witnessed</span>
            <span>{gameState.history.length}</span>
          </div>
          <div className="journey-summary__stat-line">
            <span>Chorus level</span>
            <span>{gameState.chorusLevel} / 5</span>
          </div>
          {cycles > 0 && (
            <div className="journey-summary__stat-line">
              <span>Cycle</span>
              <span>{cycles}</span>
            </div>
          )}
          <div className="journey-summary__stat-line">
            <span>Harga discovered</span>
            <span>{completion.percentage}%</span>
          </div>
        </motion.div>

        <motion.div
          className="journey-summary__scores"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1 }}
        >
          {([
            ['Clarity', score.clarity, 'How much she saw through them'],
            ['Surrender', score.surrender, 'How deeply she was absorbed'],
            ['Survival', score.survival, 'How much of herself remains'],
          ] as const).map(([label, value, hint], i) => (
            <motion.div
              key={label}
              className="journey-summary__score-group"
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 + i * 0.2, duration: 0.8, ease: EASE_SOFT }}
            >
              <div className="journey-summary__score-header">
                <span className="journey-summary__score-label">{label}</span>
                <span className="journey-summary__score-value">{value}</span>
              </div>
              <div className="journey-summary__bar-track">
                <motion.div
                  className="journey-summary__bar-fill journey-summary__bar-fill--score"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ delay: 1.3 + i * 0.2, duration: 1.2, ease: EASE_SOFT }}
                />
              </div>
              <span className="journey-summary__score-hint">{hint}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="journey-summary__perception"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          {perceptionEntries.map(([key, value], i) => (
            <motion.div
              key={key}
              className="journey-summary__bar-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4 + i * 0.15, duration: 0.8, ease: EASE_SOFT }}
            >
              <div className="journey-summary__bar-header">
                <span className="journey-summary__bar-label">{key}</span>
                <span className="journey-summary__bar-value">{Math.round(value)}</span>
              </div>
              <div className="journey-summary__bar-track">
                <motion.div
                  className="journey-summary__bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ delay: 1.6 + i * 0.15, duration: 1, ease: EASE_SOFT }}
                />
              </div>
              <span className="journey-summary__bar-context">{perceptionLabel(key, value)}</span>
            </motion.div>
          ))}
        </motion.div>

        {moments.length > 0 && (
          <motion.div
            className="journey-summary__moments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <h3 className="journey-summary__moments-title">Moments</h3>
            <ul className="journey-summary__moments-list">
              {moments.map((m, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 2.7 + i * 0.2, duration: 0.6 }}
                >
                  {m}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {newAchievements.length > 0 && (
          <motion.div
            className="journey-summary__achievements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1 }}
          >
            <h3 className="journey-summary__moments-title">
              Unlocked ({unlockedCount} / {totalCount})
            </h3>
            <ul className="journey-summary__achievements-list">
              {newAchievements.map((ach, i) => (
                <motion.li
                  key={ach.id}
                  className="journey-summary__achievement"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.8, x: 0 }}
                  transition={{ delay: 3.4 + i * 0.2, duration: 0.6, ease: EASE_SOFT }}
                >
                  <span className="journey-summary__achievement-title">{ach.title}</span>
                  <span className="journey-summary__achievement-desc">{ach.description}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {communeProfile.totalChoicesMade > 3 && (
          <motion.div
            className="journey-summary__commune-knows"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.8 + newAchievements.length * 0.15, duration: 1.5 }}
          >
            <h3 className="journey-summary__commune-title">The Commune Knows</h3>
            <ul className="journey-summary__commune-lines">
              {assessment.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                  transition={{ delay: 4.2 + newAchievements.length * 0.15 + i * 0.6, duration: 1.2, ease: EASE_SOFT }}
                >
                  {line}
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="journey-summary__commune-style"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 5.5 + newAchievements.length * 0.15, duration: 1.5 }}
            >
              Approach: {manipStyle}
            </motion.p>
          </motion.div>
        )}

        <motion.div
          className="journey-summary__actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 + newAchievements.length * 0.15 + (communeProfile.totalChoicesMade > 3 ? 2.5 : 0), duration: 1 }}
        >
          <button type="button" className="journey-summary__btn" onClick={onCredits}>
            Credits
          </button>
          <button type="button" className="journey-summary__btn journey-summary__btn--primary" onClick={onNewGame}>
            {cycles > 0 ? 'Begin Again' : 'New Game'}
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}
