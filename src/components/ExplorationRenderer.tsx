import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { evaluateCondition } from '../engine/director'
import type { Clue, GameState, Hotspot, SceneNode, StressState, TextVariant } from '../engine/types'
import type { RuntimeBridge } from './runtimeBridge'

const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)

const BACKGROUND_MAP: Record<string, string> = {
  road_sweden:
    'linear-gradient(145deg, rgba(209,230,193,0.95) 0%, rgba(151,184,150,0.92) 30%, rgba(207,226,244,0.96) 70%, rgba(252,246,233,0.98) 100%)',
  harga_gate:
    'radial-gradient(circle at top, rgba(244,222,168,0.68), transparent 45%), linear-gradient(150deg, rgba(254,250,243,1) 0%, rgba(247,238,216,0.92) 55%, rgba(235,214,173,0.82) 100%)',
  harga_meadow:
    'linear-gradient(155deg, rgba(239,245,202,0.96) 0%, rgba(192,216,126,0.92) 38%, rgba(246,232,183,0.92) 72%, rgba(254,250,243,0.95) 100%)',
  harga_feast:
    'radial-gradient(circle at top, rgba(245,214,143,0.48), transparent 40%), linear-gradient(135deg, rgba(255,249,236,1) 0%, rgba(237,209,144,0.88) 48%, rgba(214,165,89,0.66) 100%)',
  harga_perimeter:
    'linear-gradient(150deg, rgba(225,234,214,0.96) 0%, rgba(169,187,155,0.9) 48%, rgba(196,209,198,0.88) 100%)',
  harga_sleeping_quarters:
    'linear-gradient(135deg, rgba(252,246,235,0.98) 0%, rgba(237,219,191,0.92) 44%, rgba(215,184,145,0.84) 100%)',
  sleeping_quarters_night:
    'radial-gradient(circle at top right, rgba(255,204,112,0.32), transparent 40%), linear-gradient(135deg, rgba(254,247,223,0.98) 0%, rgba(244,212,140,0.82) 40%, rgba(168,123,75,0.78) 100%)',
  dream_meadow:
    'radial-gradient(circle at 20% 10%, rgba(255,214,153,0.4), transparent 38%), linear-gradient(140deg, rgba(255,248,225,0.96) 0%, rgba(237,198,169,0.9) 30%, rgba(243,218,133,0.9) 65%, rgba(195,233,170,0.82) 100%)',
  cliff_ceremony:
    'linear-gradient(165deg, rgba(220,227,214,0.96) 0%, rgba(186,194,180,0.92) 42%, rgba(137,145,133,0.9) 100%)',
  default: 'linear-gradient(135deg, rgba(254,250,243,1) 0%, rgba(249,243,231,1) 100%)',
}

type InspectionCard = {
  title: string
  body: string
  tone: 'observation' | 'evidence' | 'warning'
}

function getBackground(background?: string) {
  return BACKGROUND_MAP[background ?? 'default'] ?? BACKGROUND_MAP.default
}

function resolveVariantText(base: string, variants: TextVariant[] | undefined, gameState: GameState): string {
  if (!variants || variants.length === 0) return base
  for (const variant of variants) {
    if (evaluateCondition(variant.condition, gameState)) {
      return variant.text
    }
  }
  return base
}

function hotspotGlyph(icon: Hotspot['icon']): string {
  switch (icon) {
    case 'take': return '+'
    case 'listen': return '~'
    case 'door': return '>'
    case 'rune': return '*'
    case 'examine':
    default:
      return 'o'
  }
}

function ExplorationRendererScene({
  scene,
  gameState,
  stress,
  chorusLevel,
  onClueFound,
  onHotspotScene,
  onAdvance,
  registerBridge,
}: {
  scene: SceneNode
  gameState: GameState
  stress: StressState
  chorusLevel: number
  onClueFound: (clue: Clue) => void
  onHotspotScene: (sceneId: string) => void
  onAdvance: () => void
  registerBridge?: (bridge: RuntimeBridge | null) => void
}) {
  const [inspection, setInspection] = useState<InspectionCard | null>(null)
  const [inspectedHotspots, setInspectedHotspots] = useState<string[]>([])
  const newlyFoundRef = useRef<Set<string>>(new Set())

  const discoveredClues = useMemo(() => new Set(gameState.clues.map((clue) => clue.id)), [gameState.clues])
  const hotspots = useMemo(
    () => (scene.hotspots ?? []).filter((hotspot) => !hotspot.condition || evaluateCondition(hotspot.condition, gameState)),
    [gameState, scene.hotspots],
  )

  const inspectHotspot = useCallback((hotspot: Hotspot) => {
    setInspectedHotspots((current) => (current.includes(hotspot.id) ? current : [...current, hotspot.id]))

    switch (hotspot.result.type) {
      case 'text': {
        setInspection({
          title: hotspot.label,
          body: resolveVariantText(hotspot.result.text, hotspot.result.variants, gameState),
          tone: 'observation',
        })
        return
      }
      case 'clue': {
        const alreadyOwned = discoveredClues.has(hotspot.result.clue.id) || newlyFoundRef.current.has(hotspot.result.clue.id)
        if (!alreadyOwned) {
          onClueFound(hotspot.result.clue)
          newlyFoundRef.current.add(hotspot.result.clue.id)
        }
        setInspection({
          title: hotspot.label,
          body: alreadyOwned
            ? `You already took this with you.\n\n${hotspot.result.clue.text}`
            : hotspot.result.clue.text,
          tone: 'evidence',
        })
        return
      }
      case 'scene': {
        onHotspotScene(hotspot.result.sceneId)
        return
      }
      case 'item': {
        setInspection({
          title: hotspot.label,
          body: hotspot.result.text,
          tone: 'evidence',
        })
        return
      }
      case 'rune_puzzle': {
        setInspection({
          title: hotspot.label,
          body: 'The symbols almost connect, but this ritual language is still beyond you.',
          tone: 'warning',
        })
      }
    }
  }, [discoveredClues, gameState, onClueFound, onHotspotScene])

  useEffect(() => {
    if (!registerBridge) return

    registerBridge({
      advanceTime: () => undefined,
      snapshot: () =>
        JSON.stringify({
          mode: 'exploration',
          scene: scene.id,
          hotspots: hotspots.map((hotspot) => ({
            id: hotspot.id,
            label: hotspot.label,
            inspected: inspectedHotspots.includes(hotspot.id),
          })),
          inspection: inspection?.title ?? null,
          clues: gameState.clues.map((clue) => clue.id),
        }),
    })

    return () => registerBridge(null)
  }, [gameState.clues, hotspots, inspectedHotspots, inspection?.title, registerBridge, scene.id])

  const background = getBackground(scene.background)
  const inspectedCount = inspectedHotspots.length
  const evidenceCount = hotspots.filter((hotspot) => hotspot.result.type === 'clue').length

  return (
    <section className="scene-renderer exploration-renderer" aria-label={`Day ${scene.day} ${scene.chapter}`}>
      <motion.div
        className="scene-renderer__backdrop"
        style={{ background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_SOFT }}
      />
      <div className="scene-renderer__wash" />

      <div className="scene-renderer__frame">
        <div className="exploration-renderer__layout">
          <motion.aside
            className="exploration-renderer__brief"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE_SOFT }}
          >
            <span className="exploration-renderer__kicker">Day {scene.day}</span>
            <h2 className="exploration-renderer__chapter">{scene.chapter.replace(/_/g, ' ')}</h2>
            <p className="exploration-renderer__text">{scene.text}</p>

            <dl className="exploration-renderer__stats">
              <div>
                <dt>Pressure</dt>
                <dd>{Math.round(stress.exposure)}</dd>
              </div>
              <div>
                <dt>Chorus</dt>
                <dd>{chorusLevel}/5</dd>
              </div>
              <div>
                <dt>Inspected</dt>
                <dd>{inspectedCount}/{hotspots.length}</dd>
              </div>
              <div>
                <dt>Evidence</dt>
                <dd>{gameState.clues.length}</dd>
              </div>
            </dl>

            <div className="exploration-renderer__actions">
              {scene.next ? (
                <button
                  type="button"
                  className="exploration-renderer__advance"
                  onClick={onAdvance}
                >
                  {inspectedCount === 0 ? 'Leave this place' : 'Move on'}
                </button>
              ) : null}
              <span className="exploration-renderer__hint">
                Search the room. The commune is counting on what you miss.
              </span>
            </div>
          </motion.aside>

          <motion.div
            className="exploration-renderer__board"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE_SOFT }}
          >
            <div className="exploration-renderer__map">
              <div className="exploration-renderer__grid" aria-hidden="true" />
              {hotspots.map((hotspot) => {
                const inspected = inspectedHotspots.includes(hotspot.id)
                const isEvidence = hotspot.result.type === 'clue'
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    className={[
                      'exploration-renderer__hotspot',
                      inspected ? 'is-inspected' : '',
                      isEvidence ? 'is-evidence' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    onClick={() => inspectHotspot(hotspot)}
                    aria-label={hotspot.label}
                  >
                    <span className="exploration-renderer__hotspot-glyph" aria-hidden="true">
                      {hotspotGlyph(hotspot.icon)}
                    </span>
                    <span className="exploration-renderer__hotspot-label">{hotspot.label}</span>
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={inspection?.title ?? 'search'}
                className={[
                  'exploration-renderer__inspection',
                  inspection ? `is-${inspection.tone}` : '',
                ].join(' ')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE_SOFT }}
              >
                {inspection ? (
                  <>
                    <span className="exploration-renderer__inspection-title">{inspection.title}</span>
                    <p className="exploration-renderer__inspection-body">{inspection.body}</p>
                  </>
                ) : (
                  <>
                    <span className="exploration-renderer__inspection-title">Search Pattern</span>
                    <p className="exploration-renderer__inspection-body">
                      {evidenceCount > 0
                        ? 'Objects that matter feel too carefully placed. Start with what should have been taken and was not.'
                        : 'Search the edges first. The commune hides things in the open.'}
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function ExplorationRenderer(props: {
  scene: SceneNode
  gameState: GameState
  stress: StressState
  chorusLevel: number
  onClueFound: (clue: Clue) => void
  onHotspotScene: (sceneId: string) => void
  onAdvance: () => void
  registerBridge?: (bridge: RuntimeBridge | null) => void
}) {
  return <ExplorationRendererScene key={props.scene.id} {...props} />
}
