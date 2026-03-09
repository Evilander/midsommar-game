// ─── Transition Stinger ─── Subliminal horror between scenes ───
// At key narrative moments, a full-screen film frame flashes for ~800ms.
// Fast fade-in, slow fade-out. The commune shows you what's coming.

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StingerConfig {
  src: string
  opacity: number
  hold: number
}

const STINGER_MAP: Record<string, StingerConfig> = {
  // Attestupa — commune gathered on the cliff
  day2_the_jump:        { src: '/images/Midsommar_025.jpg', opacity: 0.25, hold: 900 },
  day2_aftermath:       { src: '/images/frames/attestupa-cliff.jpg', opacity: 0.2, hold: 700 },
  // Mark's fate
  day3_fools_skin:      { src: '/images/Midsommar_Mark%27s_Corpse_The_Fool.webp', opacity: 0.22, hold: 800 },
  // Blood eagle rune
  day3_blood_eagle:     { src: '/images/Midsommar_024.jpg', opacity: 0.28, hold: 850 },
  // The mating ritual
  day4_mating_discovery:{ src: '/images/Midsommar_052.jpg', opacity: 0.18, hold: 900 },
  day4_mating_witness:  { src: '/images/Midsommar_056.jpg', opacity: 0.2, hold: 800 },
  // Christian in the barn
  day4_confront:        { src: '/images/Midsommar_057.jpg', opacity: 0.22, hold: 750 },
  // May Queen crowned
  day6_crowned:         { src: '/images/Midsommar-065.jpg', opacity: 0.25, hold: 900 },
  // Christian in the bear
  day9_christian_bear:  { src: '/images/Midsommar_061.jpg', opacity: 0.3, hold: 1000 },
  // The fire
  day9_fire:            { src: '/images/frames/temple-burning.jpg', opacity: 0.28, hold: 1100 },
  day9_threshold:       { src: '/images/frames/final-smile.jpg', opacity: 0.25, hold: 900 },
  // Endings
  ending_fire:          { src: '/images/hq720.jpg', opacity: 0.3, hold: 1200 },
  ending_sacrifice:     { src: '/images/frames/temple-fire.jpg', opacity: 0.28, hold: 1000 },
}

interface TransitionStingerProps {
  sceneId: string
  enabled: boolean
}

export function TransitionStinger({ sceneId, enabled }: TransitionStingerProps) {
  const [active, setActive] = useState<StingerConfig | null>(null)

  useEffect(() => {
    if (!enabled) return

    const config = STINGER_MAP[sceneId]
    if (!config) return

    setActive(config)
    const timer = setTimeout(() => setActive(null), config.hold)
    return () => clearTimeout(timer)
  }, [sceneId, enabled])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={sceneId}
          className="transition-stinger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
          transition={{ duration: 0.1 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            backgroundImage: `url(${active.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: active.opacity,
          }}
        />
      )}
    </AnimatePresence>
  )
}
