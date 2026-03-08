// ─── CreditsScreen ─── Closing the book ───

import { cubicBezier, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

const CREDITS = [
  { type: 'heading' as const, text: 'MIDSOMMAR' },
  { type: 'spacer' as const },
  { type: 'line' as const, text: 'A game by Tyler Eveland' },
  { type: 'spacer' as const },
  { type: 'label' as const, text: 'Written by' },
  { type: 'line' as const, text: 'Claude (Opus 4.6) — Anthropic' },
  { type: 'line' as const, text: 'Codex (GPT-5.4) — OpenAI' },
  { type: 'line' as const, text: 'Gemini (3.1 Pro Preview) — Google' },
  { type: 'spacer' as const },
  { type: 'label' as const, text: 'Inspired by' },
  { type: 'line' as const, text: 'Ari Aster\'s Midsommar (2019)' },
  { type: 'line' as const, text: 'A24 Films' },
  { type: 'spacer' as const },
  { type: 'label' as const, text: 'Technologies' },
  { type: 'line' as const, text: 'React 19 · TypeScript · Vite' },
  { type: 'line' as const, text: 'Framer Motion · Zustand · Howler.js' },
  { type: 'spacer' as const },
  { type: 'label' as const, text: 'In memory of' },
  { type: 'line' as const, text: 'the midnight sun' },
  { type: 'spacer' as const },
  { type: 'spacer' as const },
  { type: 'quote' as const, text: '"It does no good to die kicking and screaming."' },
  { type: 'line' as const, text: '— Siv' },
  { type: 'spacer' as const },
  { type: 'spacer' as const },
  { type: 'line' as const, text: 'Thank you for playing.' },
]

export function CreditsScreen({ onReturn }: { onReturn: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollDone, setScrollDone] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let frame = 0
    const speed = 0.4 // px per frame

    const tick = () => {
      if (!el) return
      el.scrollTop += speed

      if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) {
        setScrollDone(true)
        return
      }

      frame = requestAnimationFrame(tick)
    }

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick)
    }, 1500)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const handleKey = () => onReturn()
    const handleClick = () => onReturn()

    // Allow dismissal after 2 seconds
    const timer = setTimeout(() => {
      window.addEventListener('keydown', handleKey)
      window.addEventListener('click', handleClick)
    }, 2000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('click', handleClick)
    }
  }, [onReturn])

  return (
    <motion.section
      className="credits"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: EASE_SOFT }}
    >
      <svg className="credits__flower" viewBox="0 0 140 140" aria-hidden="true">
        <g fill="currentColor" opacity="0.08">
          <ellipse cx="70" cy="24" rx="11" ry="23" />
          <ellipse cx="104" cy="44" rx="11" ry="23" transform="rotate(56 104 44)" />
          <ellipse cx="112" cy="83" rx="11" ry="23" transform="rotate(113 112 83)" />
          <ellipse cx="70" cy="108" rx="11" ry="23" transform="rotate(180 70 108)" />
          <ellipse cx="28" cy="83" rx="11" ry="23" transform="rotate(247 28 83)" />
          <ellipse cx="36" cy="44" rx="11" ry="23" transform="rotate(304 36 44)" />
        </g>
        <circle cx="70" cy="70" r="16" fill="currentColor" opacity="0.04" />
      </svg>

      <div className="credits__scroll" ref={scrollRef}>
        <div className="credits__inner">
          {CREDITS.map((entry, i) => {
            if (entry.type === 'spacer') {
              return <div key={i} className="credits__spacer" />
            }
            return (
              <motion.p
                key={i}
                className={`credits__${entry.type}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: entry.type === 'heading' ? 1 : 0.7 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 1 }}
              >
                {entry.text}
              </motion.p>
            )
          })}
        </div>
      </div>

      {scrollDone && (
        <motion.p
          className="credits__dismiss"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
        >
          Press any key
        </motion.p>
      )}
    </motion.section>
  )
}
