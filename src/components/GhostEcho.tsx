// ─── GhostEcho ─── Memories from another life ───
// "She has been here before."

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { getSceneEchoes } from '../engine/ghost'

const EASE_GHOST = cubicBezier(0.22, 1, 0.36, 1)

export function GhostEcho({ sceneId }: { sceneId: string }) {
  const [echoText, setEchoText] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    setEchoText(null)

    const echoes = getSceneEchoes(sceneId)
    if (echoes.length === 0) return

    const latest = echoes.sort((a, b) => b.cycle - a.cycle)[0]
    setEchoText(latest.choiceText)

    const show = setTimeout(() => setVisible(true), 1400)
    const hide = setTimeout(() => setVisible(false), 5000)

    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [sceneId])

  if (!echoText) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="ghost-echo"
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 0.35, y: 0, filter: 'blur(0.5px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
          transition={{ duration: 2.5, ease: EASE_GHOST }}
          aria-hidden="true"
        >
          <span className="ghost-echo__text">&ldquo;{echoText}&rdquo;</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
