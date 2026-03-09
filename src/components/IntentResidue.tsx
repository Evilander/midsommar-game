// ─── IntentResidue ─── The commune knows what you wanted ───
// "She chose compliance. But we felt her reach for the door."

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { consumeIntentResidue, type IntentResidue as IntentResidueData } from '../engine/intent-harvest'

const EASE_GHOST = cubicBezier(0.22, 1, 0.36, 1)

const WHISPER_FRAMES = [
  'You almost chose differently.',
  'We saw you hesitate.',
  'The other path remembers.',
  'She reached — then pulled back.',
  'We felt it. The almost.',
]

function ResidueWhisper({ residue }: { residue: IntentResidueData }) {
  const [frame] = useState(() => WHISPER_FRAMES[Math.floor(Math.random() * WHISPER_FRAMES.length)])

  return (
    <motion.div
      className="intent-residue intent-residue--whisper"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: residue.strength * 0.4, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 2.5, ease: EASE_GHOST }}
    >
      <span className="intent-residue__frame">{frame}</span>
      <span className="intent-residue__abandoned">"{residue.abandonedText}"</span>
    </motion.div>
  )
}

function ResidueAfterimage({ residue }: { residue: IntentResidueData }) {
  return (
    <motion.div
      className="intent-residue intent-residue--afterimage"
      initial={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
      animate={{ opacity: residue.strength * 0.5, scale: 1, filter: 'blur(1px)' }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
      transition={{ duration: 3, ease: EASE_GHOST }}
    >
      <span className="intent-residue__double">
        <span className="intent-residue__chosen">{residue.chosenText}</span>
        <span className="intent-residue__shadow">{residue.abandonedText}</span>
      </span>
    </motion.div>
  )
}

function ResidueContamination({ residue }: { residue: IntentResidueData }) {
  return (
    <motion.div
      className="intent-residue intent-residue--contamination"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: residue.strength * 0.55, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 3.5, ease: EASE_GHOST }}
    >
      <span className="intent-residue__intrusion">
        She wanted to say: "{residue.abandonedText}"
      </span>
    </motion.div>
  )
}

export function IntentResidueOverlay({ sceneId }: { sceneId: string }) {
  // Consume residue once per scene — computed during render via useMemo
  const residueSnapshot = useMemo(() => consumeIntentResidue(), [sceneId])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(false) // eslint-disable-line react-hooks/set-state-in-effect -- reset on scene change
    if (!residueSnapshot) return
    const timer = setTimeout(() => setDismissed(true), 4500)
    return () => clearTimeout(timer)
  }, [sceneId, residueSnapshot])

  const residue = dismissed ? null : residueSnapshot

  return (
    <AnimatePresence>
      {residue && (
        residue.manifestation === 'contamination' ? (
          <ResidueContamination key="contamination" residue={residue} />
        ) : residue.manifestation === 'afterimage' ? (
          <ResidueAfterimage key="afterimage" residue={residue} />
        ) : (
          <ResidueWhisper key="whisper" residue={residue} />
        )
      )}
    </AnimatePresence>
  )
}
