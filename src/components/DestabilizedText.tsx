// ─── DestabilizedText ─── Text the commune colonizes ───
// "The commune should not just speak through choices, it should colonize the UI."

import { useEffect, useMemo, useRef, useState } from 'react'

// Words that transform from isolation to belonging
const SUBSTITUTION_MAP: Record<string, string> = {
  afraid: 'blessed',
  alone: 'together',
  wrong: 'sacred',
  leave: 'stay',
  help: 'join',
  escape: 'accept',
  danger: 'tradition',
  screaming: 'singing',
  blood: 'flowers',
  dead: 'sleeping',
  murder: 'sacrifice',
  trapped: 'home',
  scared: 'ready',
  stranger: 'family',
  panic: 'peace',
  horror: 'beauty',
  lost: 'found',
  crying: 'singing',
  pain: 'growth',
  dark: 'bright',
  cold: 'warm',
  silent: 'singing',
  empty: 'full',
  broken: 'whole',
}

// Level 3: pronoun gaslighting
const PRONOUN_SHIFTS: [RegExp, string][] = [
  [/\bI am\b/g, 'We are'],
  [/\bI was\b/g, 'We were'],
  [/\bI feel\b/g, 'We feel'],
  [/\bI don't\b/g, 'We don\'t'],
  [/\bI can't\b/g, 'We can\'t'],
  [/\bI need\b/g, 'We need'],
  [/\bI want\b/g, 'We want'],
  [/\bmy\b/gi, 'our'],
  [/\bmine\b/gi, 'ours'],
  [/\bme\b/g, 'us'],
  [/\bHe's not\b/g, 'You\'re not'],
  [/\bShe said\b/g, 'They said'],
]

interface WordState {
  original: string
  current: string
  substituted: boolean
  shimmerOffset: number
}

export function DestabilizedText({
  text,
  distortionLevel,
}: {
  text: string
  distortionLevel: number // 0-3
}) {
  const [words, setWords] = useState<WordState[]>([])
  const substitutionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Parse text into word states
  useEffect(() => {
    const tokens = text.split(/(\s+)/) // preserve whitespace
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync text tokens on prop change
    setWords(
      tokens.map((token) => ({
        original: token,
        current: token,
        substituted: false,
        shimmerOffset: Math.random(),
      })),
    )
  }, [text])

  // Level 2+: periodic word substitution
  useEffect(() => {
    if (distortionLevel < 2) {
      if (substitutionTimerRef.current) {
        clearInterval(substitutionTimerRef.current)
        substitutionTimerRef.current = null
      }
      return
    }

    const interval = distortionLevel >= 3 ? 3000 : 6000

    substitutionTimerRef.current = setInterval(() => {
      setWords((prev) => {
        // Find a word that hasn't been substituted yet and has a mapping
        const candidates = prev
          .map((w, idx) => ({ w, i: idx }))
          .filter(
            ({ w }) =>
              !w.substituted &&
              w.original.trim().length > 0 &&
              SUBSTITUTION_MAP[w.original.toLowerCase()],
          )

        if (candidates.length === 0) return prev

        const target = candidates[Math.floor(Math.random() * candidates.length)]
        const replacement = SUBSTITUTION_MAP[target.w.original.toLowerCase()] ?? target.w.original

        // Match original casing
        const cased =
          target.w.original[0] === target.w.original[0].toUpperCase()
            ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
            : replacement

        const next = [...prev]
        next[target.i] = { ...next[target.i], current: cased, substituted: true }
        return next
      })
    }, interval)

    return () => {
      if (substitutionTimerRef.current) clearInterval(substitutionTimerRef.current)
    }
  }, [distortionLevel])

  // Level 3: apply pronoun shifts to the full text
  const processedText = useMemo(() => {
    if (distortionLevel < 3) return null
    let result = words.map((w) => w.current).join('')
    for (const [pattern, replacement] of PRONOUN_SHIFTS) {
      result = result.replace(pattern, replacement)
    }
    return result
  }, [distortionLevel, words])

  if (distortionLevel === 0) {
    return <span>{text}</span>
  }

  // Level 3: render the fully gaslighted version
  if (distortionLevel >= 3 && processedText) {
    return (
      <span className="destabilized-text destabilized-text--level3">
        {processedText.split('').map((char, i) => (
          <span
            key={i}
            className="destabilized-text__char"
            style={{
              animationDelay: `${(i * 0.02) % 3}s`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
    )
  }

  // Level 1-2: render with per-word effects
  return (
    <span className={`destabilized-text destabilized-text--level${distortionLevel}`}>
      {words.map((word, i) => {
        if (word.original.trim().length === 0) {
          return <span key={i}>{word.original}</span>
        }

        const isSubstituted = word.substituted && word.current !== word.original

        return (
          <span
            key={i}
            className={`destabilized-text__word${isSubstituted ? ' destabilized-text__word--shifted' : ''}`}
            style={
              distortionLevel >= 1
                ? {
                    animationDelay: `${word.shimmerOffset * 4}s`,
                    animationDuration: `${3 + word.shimmerOffset * 2}s`,
                  }
                : undefined
            }
          >
            {word.current}
          </span>
        )
      })}
    </span>
  )
}
