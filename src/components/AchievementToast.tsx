// ─── Achievement Toast ─── Film frames flash on milestone moments ───
// Slides in from the right with the Director's Cut frame as backdrop

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { evaluateAchievements, type Achievement } from '../engine/achievements'
import type { GameState } from '../engine/types'

interface AchievementToastProps {
  gameState: GameState
  enabled: boolean
}

// Map achievement IDs to film frames + custom accent colors
const ACHIEVEMENT_FRAMES: Record<string, { src: string; accent: string }> = {
  witnessed_attestupa: { src: '/images/frames/attestupa-edge.jpg', accent: '#c4a35a' },
  drank_tea: { src: '/images/frames/dani-bad-trip.jpg', accent: '#7a9e6e' },
  refused_tea: { src: '/images/frames/prologue-apartment.jpg', accent: '#8b9faf' },
  crowned: { src: '/images/frames/may-queen-victory.jpg', accent: '#e8c4c4' },
  surrendered_dance: { src: '/images/frames/may-queen-crown.jpg', accent: '#d4b44a' },
  investigator: { src: '/images/frames/pelle-held.jpg', accent: '#8b6540' },
  camera_strap: { src: '/images/frames/dani-wail.jpg', accent: '#6a4a3a' },
  ending_fire: { src: '/images/frames/final-smile.jpg', accent: '#b83200' },
  ending_walk: { src: '/images/frames/prologue-discovery.jpg', accent: '#7a8a7a' },
  ending_sacrifice: { src: '/images/frames/temple-burning.jpg', accent: '#8b2500' },
  full_belonging: { src: '/images/frames/first-meal.jpg', accent: '#c4a35a' },
  full_autonomy: { src: '/images/frames/prologue-apartment.jpg', accent: '#4a6741' },
  max_chorus: { src: '/images/frames/maypole-wide.jpg', accent: '#e09898' },
  high_grief: { src: '/images/frames/dani-wail.jpg', accent: '#6a4a5a' },
  tried_to_leave: { src: '/images/frames/attestupa-cliff.jpg', accent: '#8b9faf' },
  chose_christian: { src: '/images/Dani-Gaze.webp', accent: '#b83200' },
  spared_christian: { src: '/images/Christian-Doubt.webp', accent: '#7a9e6e' },
  betrayer: { src: '/images/Pelle.webp', accent: '#4a6741' },
  asked_about_mark: { src: '/images/frames/first-meal.jpg', accent: '#8b6540' },
}

const DEFAULT_FRAME = { src: '/images/frames/maypole-wide.jpg', accent: '#c4a35a' }

interface ToastEntry {
  achievement: Achievement
  id: string
  frame: { src: string; accent: string }
}

export function AchievementToast({ gameState, enabled }: AchievementToastProps) {
  const [queue, setQueue] = useState<ToastEntry[]>([])
  const [current, setCurrent] = useState<ToastEntry | null>(null)
  const lastCheckRef = useRef<string>('')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  // Check for new achievements when game state changes
  useEffect(() => {
    if (!enabled) return
    const stateKey = `${gameState.currentSceneId}_${gameState.chorusLevel}_${JSON.stringify(gameState.flags)}`
    if (stateKey === lastCheckRef.current) return
    lastCheckRef.current = stateKey

    const newlyUnlocked = evaluateAchievements(gameState)
    if (newlyUnlocked.length > 0) {
      const entries: ToastEntry[] = newlyUnlocked.map(ach => ({
        achievement: ach,
        id: `${ach.id}_${Date.now()}`,
        frame: ACHIEVEMENT_FRAMES[ach.id] ?? DEFAULT_FRAME,
      }))
      setQueue(prev => [...prev, ...entries])
    }
  }, [gameState, enabled])

  // Process queue — show one at a time
  const dismissCurrent = useCallback(() => {
    setCurrent(null)
  }, [])

  useEffect(() => {
    if (current || queue.length === 0) return
    const [next, ...rest] = queue
    setCurrent(next)
    setQueue(rest)
    timerRef.current = setTimeout(dismissCurrent, 5000)
    return () => clearTimeout(timerRef.current)
  }, [current, queue, dismissCurrent])

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          className="achievement-toast"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          onClick={dismissCurrent}
          style={{ '--achievement-accent': current.frame.accent } as React.CSSProperties}
        >
          <div className="achievement-toast__frame">
            <img
              src={current.frame.src}
              alt=""
              className="achievement-toast__image"
              loading="eager"
            />
            <div className="achievement-toast__gradient" />
          </div>
          <div className="achievement-toast__content">
            <span className="achievement-toast__label">UNLOCKED</span>
            <span className="achievement-toast__title">{current.achievement.title}</span>
            <span className="achievement-toast__desc">{current.achievement.description}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
