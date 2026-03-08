// ─── WitnessOverlay ─── The feeling of being watched ───
// "The terror in Midsommar is being seen by a smiling group when you do not know the rules."

import { useEffect, useMemo, useRef, useState } from 'react'

interface WatcherEye {
  id: number
  x: number
  y: number
  side: 'top' | 'bottom' | 'left' | 'right'
  opacity: number
  size: number
}

function generateEyes(count: number, seed: number): WatcherEye[] {
  const eyes: WatcherEye[] = []
  const rng = (i: number) => {
    const x = Math.sin(seed * 1000 + i * 127.1) * 43758.5453
    return x - Math.floor(x)
  }

  for (let i = 0; i < count; i++) {
    const side = (['top', 'bottom', 'left', 'right'] as const)[Math.floor(rng(i * 4) * 4)]
    let x = 0
    let y = 0
    switch (side) {
      case 'top':
        x = 10 + rng(i * 4 + 1) * 80
        y = 2 + rng(i * 4 + 2) * 8
        break
      case 'bottom':
        x = 10 + rng(i * 4 + 1) * 80
        y = 90 + rng(i * 4 + 2) * 8
        break
      case 'left':
        x = 2 + rng(i * 4 + 2) * 6
        y = 15 + rng(i * 4 + 1) * 70
        break
      case 'right':
        x = 92 + rng(i * 4 + 2) * 6
        y = 15 + rng(i * 4 + 1) * 70
        break
    }
    eyes.push({
      id: i,
      x,
      y,
      side,
      opacity: 0.15 + rng(i * 4 + 3) * 0.35,
      size: 3 + rng(i * 7) * 4,
    })
  }
  return eyes
}

export function WitnessOverlay({ exposure }: { exposure: number }) {
  const [seed, setSeed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Slowly cycle the eye positions
  useEffect(() => {
    if (exposure < 50) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSeed((s) => s + 1)
    }, 4000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [exposure >= 50])

  const eyes = useMemo(() => {
    if (exposure < 50) return []
    const count = Math.floor(((exposure - 50) / 50) * 12) + 2
    return generateEyes(count, seed)
  }, [exposure, seed])

  if (exposure < 20) return null

  const vignetteOpacity = Math.min(0.6, ((exposure - 20) / 80) * 0.6)
  const steadyEyes = exposure > 75
  const breatheScreen = exposure > 90

  return (
    <div
      className="witness-overlay"
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 50,
      }}
    >
      {/* Pulsing vignette */}
      <div
        className="witness-overlay__vignette"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(44, 36, 22, 0.4) 100%)',
          opacity: vignetteOpacity,
          animation: `witnessPulse ${3 + (1 - exposure / 100) * 4}s ease-in-out infinite alternate`,
        }}
      />

      {/* Watcher eyes — warm ivory, peripheral */}
      {eyes.map((eye) => (
        <div
          key={`${eye.id}-${seed}`}
          className="witness-overlay__eye-pair"
          style={{
            position: 'absolute',
            left: `${eye.x}%`,
            top: `${eye.y}%`,
            opacity: steadyEyes ? eye.opacity * 1.5 : eye.opacity,
            transition: steadyEyes
              ? 'opacity 2s ease'
              : 'opacity 3s ease-in-out',
            animation: steadyEyes
              ? undefined
              : `eyeFade ${5 + eye.id % 3}s ease-in-out infinite alternate`,
          }}
        >
          {/* Two dots side by side — eyes */}
          <svg
            width={eye.size * 3}
            height={eye.size * 2}
            viewBox="0 0 30 20"
            style={{ filter: 'blur(0.5px)' }}
          >
            <circle cx="8" cy="10" r="3" fill="rgba(254, 246, 227, 0.7)" />
            <circle cx="22" cy="10" r="3" fill="rgba(254, 246, 227, 0.7)" />
            {/* Pupils — tiny dark dots */}
            <circle cx="8" cy="10" r="1.2" fill="rgba(44, 36, 22, 0.5)" />
            <circle cx="22" cy="10" r="1.2" fill="rgba(44, 36, 22, 0.5)" />
          </svg>
        </div>
      ))}

      {/* Screen breathing at extreme exposure */}
      {breatheScreen && (
        <div
          className="witness-overlay__breathe"
          style={{
            position: 'fixed',
            inset: 0,
            animation: 'screenBreathe 6s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
