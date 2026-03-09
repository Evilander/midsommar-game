// ─── May Queen Dance ─── Rhythm-ritual minigame ───
// "The one scene where the game stops being about Midsommar and becomes Midsommar."
//
// The player must hit step cues while maintaining breathing inside a pulse band.
// Misses don't fail — they cause the commune to "help" (raising belonging, lowering autonomy).
// You can't lose. That's what makes it terrifying.

import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

const EASE_DANCE = cubicBezier(0.42, 0, 0.58, 1)

interface DanceBeat {
  timeMs: number
  type: 'step' | 'breathe_in' | 'breathe_out' | 'clap'
}

interface DanceRound {
  bpm: number
  beats: DanceBeat[]
  communeIntensity: number  // 0-1: how loud/present the commune is
  prompt?: string           // text shown during round
}

// 6 rounds, each escalating
const DANCE_ROUNDS: DanceRound[] = [
  {
    bpm: 80,
    communeIntensity: 0.2,
    prompt: 'Follow the rhythm.',
    beats: [
      { timeMs: 0, type: 'step' },
      { timeMs: 750, type: 'step' },
      { timeMs: 1500, type: 'breathe_in' },
      { timeMs: 2250, type: 'step' },
      { timeMs: 3000, type: 'step' },
      { timeMs: 3750, type: 'breathe_out' },
    ],
  },
  {
    bpm: 90,
    communeIntensity: 0.35,
    prompt: 'The circle tightens.',
    beats: [
      { timeMs: 0, type: 'step' },
      { timeMs: 667, type: 'step' },
      { timeMs: 1333, type: 'clap' },
      { timeMs: 2000, type: 'step' },
      { timeMs: 2667, type: 'breathe_in' },
      { timeMs: 3333, type: 'step' },
      { timeMs: 4000, type: 'breathe_out' },
    ],
  },
  {
    bpm: 100,
    communeIntensity: 0.5,
    prompt: 'Two dancers fall. They laugh as they hit the grass.',
    beats: [
      { timeMs: 0, type: 'step' },
      { timeMs: 600, type: 'step' },
      { timeMs: 1200, type: 'step' },
      { timeMs: 1800, type: 'clap' },
      { timeMs: 2400, type: 'breathe_in' },
      { timeMs: 3000, type: 'step' },
      { timeMs: 3600, type: 'step' },
      { timeMs: 4200, type: 'breathe_out' },
    ],
  },
  {
    bpm: 110,
    communeIntensity: 0.7,
    prompt: 'The singing is inside you now.',
    beats: [
      { timeMs: 0, type: 'step' },
      { timeMs: 545, type: 'step' },
      { timeMs: 1090, type: 'clap' },
      { timeMs: 1636, type: 'step' },
      { timeMs: 2181, type: 'step' },
      { timeMs: 2727, type: 'breathe_in' },
      { timeMs: 3272, type: 'step' },
      { timeMs: 3818, type: 'clap' },
      { timeMs: 4363, type: 'breathe_out' },
    ],
  },
  {
    bpm: 120,
    communeIntensity: 0.85,
    prompt: 'Only three remain.',
    beats: [
      { timeMs: 0, type: 'step' },
      { timeMs: 500, type: 'step' },
      { timeMs: 1000, type: 'step' },
      { timeMs: 1500, type: 'clap' },
      { timeMs: 2000, type: 'step' },
      { timeMs: 2500, type: 'breathe_in' },
      { timeMs: 3000, type: 'step' },
      { timeMs: 3500, type: 'step' },
      { timeMs: 4000, type: 'clap' },
      { timeMs: 4500, type: 'breathe_out' },
    ],
  },
  {
    bpm: 130,
    communeIntensity: 1.0,
    prompt: '',  // no prompt — you are the dance
    beats: [
      { timeMs: 0, type: 'step' },
      { timeMs: 462, type: 'step' },
      { timeMs: 923, type: 'clap' },
      { timeMs: 1385, type: 'step' },
      { timeMs: 1846, type: 'step' },
      { timeMs: 2308, type: 'breathe_in' },
      { timeMs: 2769, type: 'step' },
      { timeMs: 3231, type: 'step' },
      { timeMs: 3692, type: 'clap' },
      { timeMs: 4154, type: 'step' },
      { timeMs: 4615, type: 'step' },
      { timeMs: 5077, type: 'breathe_out' },
    ],
  },
]

const TOLERANCE_MS = 300 // hit window
const MISS_BELONGING_GAIN = 3
const MISS_AUTONOMY_LOSS = 4
const HIT_BELONGING_GAIN = 1

type BeatResult = 'waiting' | 'hit' | 'missed' | 'helped'

interface BeatState {
  beat: DanceBeat
  result: BeatResult
  timeMs: number
}

const BEAT_ICONS: Record<DanceBeat['type'], string> = {
  step: '◆',
  breathe_in: '○',
  breathe_out: '●',
  clap: '◇',
}

export function MayQueenDance({
  onComplete,
  onStatsDelta,
}: {
  onComplete: (result: { surrendered: boolean; totalHits: number; totalMisses: number; totalHelps: number }) => void
  onStatsDelta: (delta: { belonging: number; autonomy: number }) => void
}) {
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'intro' | 'playing' | 'between' | 'crowned'>('intro')
  const [beats, setBeats] = useState<BeatState[]>([])
  const [, setCurrentBeatIdx] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [totalHits, setTotalHits] = useState(0)
  const [totalMisses, setTotalMisses] = useState(0)
  const [totalHelps, setTotalHelps] = useState(0)
  const [helpText, setHelpText] = useState<string | null>(null)

  const startTimeRef = useRef(0)
  const frameRef = useRef(0)
  const keyDownRef = useRef(false)

  const currentRound = DANCE_ROUNDS[round]

  // Initialize beats for current round
  useEffect(() => {
    if (phase !== 'playing' || !currentRound) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset round state
    setBeats(currentRound.beats.map((b) => ({ beat: b, result: 'waiting', timeMs: b.timeMs })))
     
    setCurrentBeatIdx(0)
     
    setElapsedMs(0)
    startTimeRef.current = performance.now()

    const tick = () => {
      const now = performance.now()
      const elapsed = now - startTimeRef.current
      setElapsedMs(elapsed)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameRef.current)
  }, [phase, round, currentRound])

  // Check for missed beats
  useEffect(() => {
    if (phase !== 'playing' || !currentRound) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- update beat results on tick
    setBeats((prev) => {
      let changed = false
      const next = prev.map((b) => {
        if (b.result === 'waiting' && elapsedMs > b.timeMs + TOLERANCE_MS) {
          changed = true
          return { ...b, result: 'helped' as BeatResult }
        }
        return b
      })
      if (changed) {
        // Count new helps
        const newHelps = next.filter((b, i) => b.result === 'helped' && prev[i].result === 'waiting').length
        if (newHelps > 0) {
          setTotalHelps((h) => h + newHelps)
          setTotalMisses((m) => m + newHelps)
          onStatsDelta({ belonging: MISS_BELONGING_GAIN * newHelps, autonomy: -MISS_AUTONOMY_LOSS * newHelps })
          setHelpText('The women steady your step.')
          setTimeout(() => setHelpText(null), 1500)
        }
      }
      return changed ? next : prev
    })

    // Check if round is complete
    const lastBeat = currentRound.beats[currentRound.beats.length - 1]
    if (elapsedMs > lastBeat.timeMs + TOLERANCE_MS + 500) {
      cancelAnimationFrame(frameRef.current)
      if (round < DANCE_ROUNDS.length - 1) {
        setPhase('between')
      } else {
        setPhase('crowned')
      }
    }
  }, [elapsedMs, phase, currentRound, round, onStatsDelta])

  // Handle input
  const handleInput = useCallback(
    (beatType: 'step' | 'clap' | 'breathe_in' | 'breathe_out') => {
      if (phase !== 'playing') return

      setBeats((prev) => {
        // Find the nearest waiting beat of the right type within tolerance
        const now = elapsedMs
        let bestIdx = -1
        let bestDist = Infinity

        for (let i = 0; i < prev.length; i++) {
          const b = prev[i]
          if (b.result !== 'waiting') continue
          if (b.beat.type !== beatType) continue
          const dist = Math.abs(now - b.timeMs)
          if (dist <= TOLERANCE_MS && dist < bestDist) {
            bestIdx = i
            bestDist = dist
          }
        }

        if (bestIdx >= 0) {
          const next = [...prev]
          next[bestIdx] = { ...next[bestIdx], result: 'hit' }
          setTotalHits((h) => h + 1)
          onStatsDelta({ belonging: HIT_BELONGING_GAIN, autonomy: 0 })
          return next
        }
        return prev
      })
    },
    [phase, elapsedMs, onStatsDelta],
  )

  // Keyboard handling
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'Space') {
        e.preventDefault()
        handleInput('step') // step and clap share Space
        handleInput('clap')
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault()
        if (!keyDownRef.current) {
          keyDownRef.current = true
          handleInput('breathe_in')
        }
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        keyDownRef.current = false
        handleInput('breathe_out')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [handleInput])

  // Touch/click fallback
  const handleTap = useCallback(() => {
    handleInput('step')
    handleInput('clap')
  }, [handleInput])

  const communeIntensity = currentRound?.communeIntensity ?? 0

  if (phase === 'intro') {
    return (
      <motion.div
        className="dance-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="dance-intro__title">The Dance of the May Queen</h2>
        <p className="dance-intro__subtitle">Circle the maypole. Keep dancing. The last one standing is crowned.</p>
        <div className="dance-intro__controls">
          <div><strong>Space</strong> — Step / Clap</div>
          <div><strong>↑ Hold</strong> — Breathe in</div>
          <div><strong>↑ Release</strong> — Breathe out</div>
        </div>
        <p className="dance-intro__warning">You cannot fail. The commune will carry you.</p>
        <button
          type="button"
          className="dance-intro__start"
          onClick={() => setPhase('playing')}
        >
          Begin
        </button>
      </motion.div>
    )
  }

  if (phase === 'between') {
    return (
      <motion.div
        className="dance-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="dance-between__text">{DANCE_ROUNDS[round].prompt || `Round ${round + 1} complete.`}</p>
        <p className="dance-between__stats">
          Steps hit: {totalHits} | The commune steadied you: {totalHelps} times
        </p>
        <button
          type="button"
          className="dance-between__continue"
          onClick={() => {
            setRound((r) => r + 1)
            setPhase('playing')
          }}
        >
          Continue dancing
        </button>
      </motion.div>
    )
  }

  if (phase === 'crowned') {
    const surrendered = totalHelps > totalHits
    return (
      <motion.div
        className="dance-crowned"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: EASE_DANCE }}
      >
        <h2 className="dance-crowned__title">
          {surrendered ? 'The crown descends.' : 'You are the May Queen.'}
        </h2>
        <p className="dance-crowned__text">
          {surrendered
            ? 'The commune carried you through every stumble. The crown was always yours. The dance chose you — not for your strength, but for your willingness to be held.'
            : 'You danced until the dance became you. The crown is heavy. It feels exactly right.'}
        </p>
        <p className="dance-crowned__stats">
          Perfect steps: {totalHits} | Commune assists: {totalHelps}
        </p>
        <button
          type="button"
          className="dance-crowned__continue"
          onClick={() => onComplete({ surrendered, totalHits, totalMisses, totalHelps })}
        >
          Accept the crown
        </button>
      </motion.div>
    )
  }

  // Playing phase — the rhythm game
  const roundDuration = currentRound
    ? currentRound.beats[currentRound.beats.length - 1].timeMs + TOLERANCE_MS + 200
    : 5000

  return (
    <motion.div
      className="dance-arena"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleTap}
      style={{
        '--commune-intensity': communeIntensity,
      } as React.CSSProperties}
    >
      {/* Commune bloom overlay */}
      <div
        className="dance-arena__bloom"
        style={{ opacity: communeIntensity * 0.4 }}
      />

      {/* Round prompt */}
      <AnimatePresence>
        {currentRound?.prompt ? (
          <motion.div
            key={`prompt-${round}`}
            className="dance-arena__prompt"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {currentRound.prompt}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Help text when commune steadies you */}
      <AnimatePresence>
        {helpText ? (
          <motion.div
            key="help"
            className="dance-arena__help"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {helpText}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Beat track */}
      <div className="dance-arena__track">
        {beats.map((b, i) => {
          const position = ((b.timeMs - elapsedMs + 1500) / 3000) * 100 // approaching from right
          const visible = position > -10 && position < 110

          if (!visible) return null

          return (
            <motion.div
              key={`${round}-${i}`}
              className={`dance-beat dance-beat--${b.result} dance-beat--${b.beat.type}`}
              style={{ left: `${Math.max(0, Math.min(100, position))}%` }}
              animate={
                b.result === 'hit'
                  ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
                  : b.result === 'helped'
                    ? { scale: [1, 0.8], opacity: [1, 0.3] }
                    : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.3 }}
            >
              <span className="dance-beat__icon">{BEAT_ICONS[b.beat.type]}</span>
            </motion.div>
          )
        })}

        {/* Hit line */}
        <div className="dance-arena__hitline" />
      </div>

      {/* Progress bar */}
      <div className="dance-arena__progress">
        <div
          className="dance-arena__progress-fill"
          style={{ width: `${Math.min(100, (elapsedMs / roundDuration) * 100)}%` }}
        />
      </div>

      {/* Round indicator */}
      <div className="dance-arena__round">
        {DANCE_ROUNDS.map((_, i) => (
          <span
            key={i}
            className={`dance-arena__round-dot ${i <= round ? 'dance-arena__round-dot--active' : ''}`}
          />
        ))}
      </div>
    </motion.div>
  )
}
