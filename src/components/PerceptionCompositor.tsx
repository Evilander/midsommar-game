import { useMemo, type CSSProperties, type ReactNode } from 'react'

import type { VisualEffect } from '../engine/types'

type EffectMap = Record<VisualEffect['type'], number>

const EMPTY_EFFECTS: EffectMap = {
  flowers_breathe: 0,
  face_linger: 0,
  text_waver: 0,
  sun_pulse: 0,
  chorus_sync: 0,
  border_bloom: 0,
  color_shift: 0,
  vignette: 0,
}

function FlowerCluster({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="presentation" aria-hidden="true">
      <g fill="currentColor" opacity="0.9">
        <ellipse cx="60" cy="27" rx="11" ry="18" />
        <ellipse cx="87" cy="43" rx="11" ry="18" transform="rotate(55 87 43)" />
        <ellipse cx="93" cy="73" rx="11" ry="18" transform="rotate(110 93 73)" />
        <ellipse cx="60" cy="92" rx="11" ry="18" transform="rotate(180 60 92)" />
        <ellipse cx="27" cy="73" rx="11" ry="18" transform="rotate(250 27 73)" />
        <ellipse cx="33" cy="43" rx="11" ry="18" transform="rotate(305 33 43)" />
      </g>
      <circle cx="60" cy="60" r="13" fill="var(--accent)" opacity="0.7" />
      <path
        d="M60 103C60 88 54 82 42 74C29 66 20 53 18 33"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        opacity="0.45"
      />
    </svg>
  )
}

function VineBorder({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 220 640" role="presentation" aria-hidden="true">
      <path
        d="M104 0C108 46 83 70 89 122C95 168 139 194 136 244C133 298 74 319 82 381C89 435 148 467 144 523C142 566 112 598 98 640"
        fill="none"
        pathLength="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="128" cy="118" r="8" fill="currentColor" />
      <circle cx="90" cy="246" r="8" fill="currentColor" />
      <circle cx="126" cy="388" r="8" fill="currentColor" />
      <circle cx="100" cy="524" r="8" fill="currentColor" />
      <path
        d="M104 88C130 86 152 99 163 123"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M84 219C57 222 37 236 27 261"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M110 356C134 353 152 363 166 392"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function PerceptionCompositor({
  effects,
  chorusLevel,
  children,
}: {
  effects: VisualEffect[]
  chorusLevel: number
  children: ReactNode
}) {
  const intensities = useMemo<EffectMap>(() => {
    const next = { ...EMPTY_EFFECTS }

    for (const effect of effects) {
      next[effect.type] = Math.max(next[effect.type], effect.intensity)
    }

    return next
  }, [effects])

  const className = [
    'perception-compositor',
    intensities.flowers_breathe > 0 ? 'is-flowers-breathe' : '',
    intensities.sun_pulse > 0 ? 'is-sun-pulse' : '',
    intensities.chorus_sync > 0 ? 'is-chorus-sync' : '',
    intensities.text_waver > 0 ? 'is-text-waver' : '',
    intensities.border_bloom > 0 ? 'is-border-bloom' : '',
    intensities.color_shift > 0 ? 'is-color-shift' : '',
    intensities.vignette > 0 ? 'is-vignette' : '',
    intensities.face_linger > 0 ? 'is-face-linger' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const style = {
    '--flowers-breathe': intensities.flowers_breathe.toString(),
    '--sun-pulse': intensities.sun_pulse.toString(),
    '--chorus-sync': Math.min(1, intensities.chorus_sync + chorusLevel * 0.06).toString(),
    '--text-waver': intensities.text_waver.toString(),
    '--border-bloom': intensities.border_bloom.toString(),
    '--color-shift': intensities.color_shift.toString(),
    '--vignette': intensities.vignette.toString(),
    '--face-linger': intensities.face_linger.toString(),
  } as CSSProperties

  return (
    <div className={className} style={style}>
      <div className="perception-compositor__overlay" aria-hidden="true">
        <div className="perception-compositor__sun" />
        <div className="perception-compositor__vignette" />
        <div className="perception-compositor__color-wash" />
        <div className="perception-compositor__face-linger" />
        <div className="perception-compositor__flowers perception-compositor__flowers--top">
          <FlowerCluster className="perception-compositor__flower" />
          <FlowerCluster className="perception-compositor__flower perception-compositor__flower--small" />
          <FlowerCluster className="perception-compositor__flower perception-compositor__flower--tiny" />
        </div>
        <div className="perception-compositor__flowers perception-compositor__flowers--bottom">
          <FlowerCluster className="perception-compositor__flower" />
          <FlowerCluster className="perception-compositor__flower perception-compositor__flower--small" />
          <FlowerCluster className="perception-compositor__flower perception-compositor__flower--tiny" />
        </div>
        <VineBorder className="perception-compositor__vine perception-compositor__vine--left" />
        <VineBorder className="perception-compositor__vine perception-compositor__vine--right" />
      </div>
      <div className="perception-compositor__content">{children}</div>
    </div>
  )
}
