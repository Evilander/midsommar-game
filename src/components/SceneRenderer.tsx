import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { recordReadingBehavior } from '../engine/commune-intelligence'
import { playGameSound, preloadGameSounds, type GameSoundId } from '../engine/game-sounds'
import type { Choice, SceneNode, StressState, VisualEffect } from '../engine/types'
import { DeadlineChoicePanel } from './DeadlineChoicePanel'
import { DestabilizedText } from './DestabilizedText'
import { GhostEcho } from './GhostEcho'
import { HesitationWhisper } from './HesitationWhisper'
import { IntentResidueOverlay } from './IntentResidue'
import { PerceptionCompositor } from './PerceptionCompositor'
import type { PsychedelicLevel } from '../engine/psychedelic'
import { PsychedelicOverlay } from './PsychedelicOverlay'
import type { RuntimeBridge } from './runtimeBridge'

const DEFAULT_AUTO_ADVANCE_MS = 1700
const EASE_LINEAR = cubicBezier(0, 0, 1, 1)
const EASE_BREATHE = cubicBezier(0.42, 0, 0.58, 1)
const EASE_SOFT = cubicBezier(0.22, 1, 0.36, 1)
const EASE_RITUAL = cubicBezier(0.16, 1, 0.3, 1)

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
  apartment_night:
    'linear-gradient(160deg, rgba(28,24,22,0.98) 0%, rgba(42,36,30,0.95) 40%, rgba(32,28,24,0.97) 100%)',
  default: 'linear-gradient(135deg, rgba(254,250,243,1) 0%, rgba(249,243,231,1) 100%)',
}

// Scene-specific film stills — layered beneath gradients at low opacity.
// Film frames from the Director's Cut are in /images/frames/; promotional stills in /images/.
// Both are mixed to get the best visual match for each scene.
const SCENE_IMAGE_MAP: Record<string, { src: string; opacity?: number; position?: string }> = {
  // ── Prologue ──
  prologue_apartment: { src: '/images/frames/prologue-discovery.jpg', opacity: 0.09, position: 'center 25%' },
  prologue_aftermath: { src: '/images/frames/prologue-apartment.jpg', opacity: 0.06, position: 'center center' },
  prologue_departure: { src: '/images/frames/road-sweden.jpg', opacity: 0.07, position: 'center 40%' },
  prologue_car: { src: '/images/frames/first-meal.jpg', opacity: 0.1, position: 'center center' },
  // Apartment scenes — the guys planning the trip
  call_christian_panicked: { src: '/images/frames/road-sweden-2.jpg', opacity: 0.06, position: 'center 40%' },
  prologue_phone_christian: { src: '/images/frames/harga-arrival.jpg', opacity: 0.06, position: 'center 30%' },

  // ── Day 1 — arrival ──
  arrival_gate: { src: '/images/frames/attestupa-edge.jpg', opacity: 0.1, position: 'center 40%' },
  arrival_welcome: { src: '/images/frames/dani-bad-trip.jpg', opacity: 0.09, position: 'center 35%' },
  arrival_feast_intro: { src: '/images/frames/maypole-dance.jpg', opacity: 0.1, position: 'center 30%' },
  arrival_feast_sit: { src: '/images/frames/maypole-dance.jpg', opacity: 0.08, position: 'center 35%' },
  arrival_mushroom_offer: { src: '/images/frames/mushroom-meadow.jpg', opacity: 0.07, position: 'center 40%' },
  arrival_trip_onset: { src: '/images/frames/mushroom-meadow.jpg', opacity: 0.09, position: 'center 40%' },
  arrival_trip_deep: { src: '/images/frames/trip-meadow.jpg', opacity: 0.1, position: 'center 30%' },
  arrival_trip_panic: { src: '/images/frames/trip-meadow.jpg', opacity: 0.08, position: 'center 30%' },
  arrival_first_night: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.06, position: 'center center' },
  arrival_pelle_walk: { src: '/images/frames/attestupa-edge.jpg', opacity: 0.07, position: 'center 45%' },
  day1_end: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.05, position: 'center center' },

  // ── Day 2 — attestupa ──
  day2_morning: { src: '/images/frames/trip-meadow.jpg', opacity: 0.07, position: 'center 30%' },
  day2_procession: { src: '/images/frames/pelle-held.jpg', opacity: 0.09, position: 'center 35%' },
  day2_the_jump: { src: '/images/Midsommar_026.jpg', opacity: 0.1, position: 'center 30%' },
  day2_aftermath: { src: '/images/frames/dani-wail.jpg', opacity: 0.07, position: 'center 30%' },
  day2_aftermath_scream: { src: '/images/frames/dani-wail.jpg', opacity: 0.08, position: 'center 25%' },
  day2_aftermath_still: { src: '/images/frames/dani-wail.jpg', opacity: 0.06, position: 'center 30%' },
  day2_mark_tree: { src: '/images/frames/first-meal.jpg', opacity: 0.07, position: 'center 40%' },
  day2_pelle_held: { src: '/images/Pelle.webp', opacity: 0.08, position: 'center 20%' },
  day2_night: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.05, position: 'center center' },

  // ── Day 3 — isolation ──
  day3_morning: { src: '/images/frames/trip-meadow.jpg', opacity: 0.06, position: 'center 35%' },
  day3_fools_skin: { src: '/images/Midsommar_Mark%27s_Corpse_The_Fool.webp', opacity: 0.07, position: 'center 40%' },
  day3_josh_goes: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.08, position: 'center center' },
  day3_evening: { src: '/images/frames/attestupa-edge.jpg', opacity: 0.06, position: 'center 50%' },
  day3_night: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.05, position: 'center center' },

  // ── Day 4 — entanglement ──
  day4_morning: { src: '/images/frames/mating-ritual.jpg', opacity: 0.07, position: 'center 30%' },
  day4_tapestry: { src: '/images/frames/attestupa-cliff.jpg', opacity: 0.12, position: 'center center' },
  day4_midday: { src: '/images/Midsommar_064.jpg', opacity: 0.1, position: 'center 50%' },
  day4_night: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.06, position: 'center center' },
  day4_break: { src: '/images/frames/harga-arrival.jpg', opacity: 0.07, position: 'center 30%' },
  day4_end: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.05, position: 'center center' },

  // ── Day 5-7 — descent ──
  day5_morning: { src: '/images/florence-pugh-s-dani-takes-drugged-tea-in-midsommar.avif', opacity: 0.08, position: 'center 30%' },
  day5_afternoon: { src: '/images/frames/trip-meadow.jpg', opacity: 0.07, position: 'center 30%' },
  day5_evening: { src: '/images/frames/attestupa-edge.jpg', opacity: 0.06, position: 'center 45%' },
  day5_night: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.06, position: 'center center' },
  day6_feast: { src: '/images/frames/maypole-dance.jpg', opacity: 0.08, position: 'center 35%' },
  day6_night: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.07, position: 'center 40%' },
  day7_morning: { src: '/images/frames/trip-meadow.jpg', opacity: 0.06, position: 'center 30%' },
  // ── Day 8 — preparation ──
  day8_preparation: { src: '/images/frames/dani-smile.jpg', opacity: 0.08, position: 'center 30%' },
  day8_morning: { src: '/images/frames/attestupa-edge.jpg', opacity: 0.06, position: 'center 45%' },
  day8_temple_approach: { src: '/images/frames/dani-smile.jpg', opacity: 0.1, position: 'center 30%' },
  day8_vigil: { src: '/images/frames/may-queen-crown.jpg', opacity: 0.06, position: 'center center' },

  // ── Day 9 — fire & endings ──
  day9_fire: { src: '/images/frames/temple-burning.jpg', opacity: 0.09, position: 'center 30%' },
  day9_threshold: { src: '/images/frames/dani-smile.jpg', opacity: 0.1, position: 'center 35%' },
  ending_fire: { src: '/images/frames/final-smile.jpg', opacity: 0.12, position: 'center center' },
  ending_walk: { src: '/images/frames/first-meal.jpg', opacity: 0.09, position: 'center center' },
  ending_sacrifice: { src: '/images/frames/temple-burning.jpg', opacity: 0.1, position: 'center 30%' },
  ending_surrender: { src: '/images/frames/final-smile.jpg', opacity: 0.1, position: 'center center' },
  credits: { src: '/images/frames/prologue-apartment.jpg', opacity: 0.06, position: 'center center' },

  // ── Character moments with portrait images ──
  day2_christian_morning: { src: '/images/Midsommar_028.jpg', opacity: 0.07, position: 'center 30%' },
  day2_christian_decides: { src: '/images/Midsommar_040.jpg', opacity: 0.08, position: 'center 35%' },
  day2_try_leave: { src: '/images/frames/road-sweden.jpg', opacity: 0.09, position: 'center 40%' },
  day2_stay: { src: '/images/frames/harga-gate.jpg', opacity: 0.08, position: 'center 35%' },
  day2_cliff_edge: { src: '/images/Midsommar_025.jpg', opacity: 0.08, position: 'center 30%' },
  day3_ask_mark: { src: '/images/Mark_29.webp', opacity: 0.06, position: 'center 20%' },
  day3_marks_room_search: { src: '/images/Midsommar_Mark%27s_Corpse_The_Fool.webp', opacity: 0.05, position: 'center 30%' },
  day3_mark_trail_search: { src: '/images/Midsommar_045.jpg', opacity: 0.06, position: 'center 40%' },
  day3_marks_room_evidence: { src: '/images/Midsommar_046.jpg', opacity: 0.07, position: 'center 35%' },
  day3_blood_eagle: { src: '/images/Midsommar_024.jpg', opacity: 0.08, position: 'center 30%' },
  day3_simon_missing: { src: '/images/Midsommar_029.jpg', opacity: 0.06, position: 'center center' },
  day4_confront: { src: '/images/Midsommar_057.jpg', opacity: 0.06, position: 'center 30%' },
  day4_held: { src: '/images/midsommar2.webp', opacity: 0.06, position: 'center 30%' },
  day4_held_oracle: { src: '/images/intro-1562594545.jpg', opacity: 0.05, position: 'center 35%' },
  day4_tapestry_girl: { src: '/images/Midsommar_001.jpg', opacity: 0.1, position: 'center center' },
  day4_tapestry_barn: { src: '/images/Midsommar_001.jpg', opacity: 0.08, position: '70% center' },
  day4_mating_discovery: { src: '/images/Midsommar_056.jpg', opacity: 0.07, position: 'center center' },
  day4_mating_witness: { src: '/images/Midsommar_052.jpg', opacity: 0.06, position: 'center center' },
  day5_christian_thesis: { src: '/images/Midsommar_043.jpg', opacity: 0.06, position: 'center 35%' },
  day5_pelle_approach: { src: '/images/unpopular-opinion-pelle-edition-v0-ewlbm1gftoge1.webp', opacity: 0.07, position: 'center 20%' },
  day6_dance_prep: { src: '/images/Midsommar_044.jpg', opacity: 0.08, position: 'center 30%' },
  day6_dance: { src: '/images/Midsommar_044.jpg', opacity: 0.1, position: 'center center' },
  day6_crowned: { src: '/images/Midsommar-065.jpg', opacity: 0.1, position: 'center 25%' },
  day7_temple_interior: { src: '/images/midsommar-temple-1948826_f_improf_1038x616.webp', opacity: 0.08, position: 'center 35%' },
  day7_revelation: { src: '/images/Midsommar_024.jpg', opacity: 0.07, position: 'center 30%' },
  day8_temple_threshold: { src: '/images/midsommar-temple-1948826_f_improf_1038x616.webp', opacity: 0.1, position: 'center 40%' },
  day8_pelle_confrontation: { src: '/images/Pelle.webp', opacity: 0.09, position: 'center 20%' },
  day8_procession_start: { src: '/images/midsommar.webp', opacity: 0.08, position: 'center 35%' },
  day9_christian_bear: { src: '/images/Midsommar_061.jpg', opacity: 0.09, position: 'center 25%' },
  day9_torch_given: { src: '/images/frames/temple-fire.jpg', opacity: 0.1, position: 'center 35%' },
  arrival_breathe: { src: '/images/Midsommar_016.jpg', opacity: 0.07, position: 'center 35%' },
  arrival_step_back: { src: '/images/Midsommar_029.jpg', opacity: 0.05, position: 'center center' },
  arrival_explore: { src: '/images/Midsommar_016.jpg', opacity: 0.06, position: 'center 40%' },
  arrival_listen: { src: '/images/midsommar.webp', opacity: 0.05, position: 'center 35%' },
  arrival_cry: { src: '/images/frames/dani-wail.jpg', opacity: 0.06, position: 'center 25%' },
  arrival_find_christian: { src: '/images/Midsommar_032.jpg', opacity: 0.06, position: 'center 30%' },
  arrival_trip_sober: { src: '/images/Midsommar_038.jpg', opacity: 0.07, position: 'center 35%' },
  prologue_no_answer: { src: '/images/frames/prologue-apartment.jpg', opacity: 0.06, position: 'center center' },
  prologue_silence: { src: '/images/frames/prologue-discovery.jpg', opacity: 0.07, position: 'center 30%' },
  prologue_phone_friend: { src: '/images/frames/prologue-apartment.jpg', opacity: 0.05, position: 'center center' },
  prologue_flowers: { src: '/images/Midsommar_016.jpg', opacity: 0.07, position: 'center 35%' },
  prologue_pelle_answers: { src: '/images/Pelle.webp', opacity: 0.05, position: 'center 20%' },
  prologue_call_terri: { src: '/images/frames/prologue-apartment.jpg', opacity: 0.05, position: 'center center' },
  prologue_discovery: { src: '/images/190702112915-midsommar-film-trailer-grab-1.jpg', opacity: 0.06, position: 'center 30%' },
  day2_attestupa: { src: '/images/Midsommar_023.jpg', opacity: 0.09, position: 'center 30%' },

  // ── Additional scene mappings — previously unused images ──
  // Attestupan horror — Dani and Christian react
  day2_aftermath_christian: { src: '/images/9eb8ba10-a4d0-11e9-abdb-5d302154bf96.webp', opacity: 0.08, position: 'center 30%' },
  day2_aftermath_watch: { src: '/images/9eb8ba10-a4d0-11e9-abdb-5d302154bf96.webp', opacity: 0.07, position: 'center 35%' },
  day2_pelle_warning: { src: '/images/midsommar-header-image.webp', opacity: 0.06, position: 'center 30%' },

  // Josh's investigation and disappearance
  day3_warn_josh: { src: '/images/frames/josh-temple.jpg', opacity: 0.06, position: 'center 30%' },
  day3_follow_josh: { src: '/images/frames/josh-temple.jpg', opacity: 0.07, position: 'center 25%' },
  day3_camera_evidence: { src: '/images/frames/josh-temple.jpg', opacity: 0.05, position: 'center 30%' },
  day3_breakfast: { src: '/images/frames/first-meal.jpg', opacity: 0.06, position: 'center 35%' },
  day3_midday: { src: '/images/Midsommar_045.jpg', opacity: 0.05, position: 'center 40%' },

  // Maja and the seduction arc
  day4_midday_nine: { src: '/images/Maya_29.webp', opacity: 0.06, position: 'center 20%' },
  day3_maja_signal: { src: '/images/Maya_29.webp', opacity: 0.05, position: 'center 20%' },

  // Communal wailing — the women hold Dani while she breaks
  day4_held_humming: { src: '/images/midsommar4.0.webp', opacity: 0.07, position: 'center 30%' },

  // Maypole dance viewed from behind
  day6_washing: { src: '/images/frames/communal-wail.jpg', opacity: 0.07, position: 'center 40%' },
  day6_blessing: { src: '/images/frames/communal-wail.jpg', opacity: 0.08, position: 'center 35%' },

  // Bear suit preparation and final day
  day8_dressing: { src: '/images/Midsommar_060.jpg', opacity: 0.07, position: 'center 30%' },
  day8_forced: { src: '/images/Midsommar_060.jpg', opacity: 0.08, position: 'center 25%' },
  day8_pelle_farewell: { src: '/images/Pelle.webp', opacity: 0.07, position: 'center 20%' },
  day8_night: { src: '/images/midsommar-temple-1948826_f_improf_1038x616.webp', opacity: 0.06, position: 'center 40%' },
  day8_end: { src: '/images/midsommar.webp', opacity: 0.05, position: 'center 35%' },

  // Trying to leave
  day5_try_leave: { src: '/images/frames/road-sweden.jpg', opacity: 0.08, position: 'center 40%' },
  day5_accept: { src: '/images/midsommar4.0.webp', opacity: 0.06, position: 'center 30%' },
}

function getSceneImage(sceneId: string): { src: string; opacity: number; position: string } | null {
  const entry = SCENE_IMAGE_MAP[sceneId]
  if (!entry) return null
  return { src: entry.src, opacity: entry.opacity ?? 0.1, position: entry.position ?? 'center center' }
}

function getBackground(background?: string) {
  return BACKGROUND_MAP[background ?? 'default'] ?? BACKGROUND_MAP.default
}

function getTransition(scene: SceneNode) {
  switch (scene.transitionType) {
    case 'cut':
      return {
        initial: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0.98, transition: { duration: 0.08 } },
        transition: { duration: 0.12, ease: EASE_LINEAR },
      }
    case 'dissolve':
      return {
        initial: { opacity: 0, scale: 1.008, filter: 'blur(14px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 0.996, filter: 'blur(12px)' },
        transition: { duration: 1.55, ease: EASE_SOFT },
      }
    case 'breathe':
      return {
        initial: { opacity: 0, scale: 0.996, filter: 'blur(12px)' },
        animate: {
          opacity: [0.88, 1, 0.94, 1],
          scale: [0.998, 1, 1.002, 1],
          filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
        },
        exit: { opacity: 0, scale: 0.997, filter: 'blur(12px)' },
        transition: { duration: 3.4, times: [0, 0.3, 0.7, 1], ease: EASE_BREATHE },
      }
    case 'ritual':
      return {
        initial: { opacity: 0, scale: 1.02, filter: 'blur(10px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 0.985, filter: 'blur(14px)' },
        transition: { duration: 2.2, ease: EASE_RITUAL },
      }
    case 'fade':
    default:
      return {
        initial: { opacity: 0, y: 22, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -12, filter: 'blur(8px)' },
        transition: { duration: 1.25, ease: EASE_SOFT },
      }
  }
}

export function SceneRenderer({
  scene,
  resolvedText,
  typingDelay,
  chorusLevel,
  choices,
  effects,
  stress,
  distortionLevel,
  psychedelicLevel = 0,
  onChoose,
  onAdvance,
  registerBridge,
}: {
  scene: SceneNode
  resolvedText: string
  typingDelay: number
  chorusLevel: number
  choices: Choice[]
  effects: VisualEffect[]
  stress?: StressState
  distortionLevel?: number
  psychedelicLevel?: PsychedelicLevel
  onChoose: (choiceId: string) => void
  onAdvance: () => void
  registerBridge?: (bridge: RuntimeBridge | null) => void
}) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const elapsedRef = useRef(0)
  const autoAdvancedRef = useRef(false)
  const didFastForwardRef = useRef(false)
  const readingRecordedRef = useRef(false)
  const textCompleteSoundedRef = useRef(false)
  const choicesRevealSoundedRef = useRef(false)

  const pauseAfterMs = scene.pauseAfterMs ?? 900
  const typingDurationMs = typingDelay === 0 ? 0 : resolvedText.length * typingDelay
  const revealChoicesAtMs = typingDurationMs + pauseAfterMs
  const autoAdvanceAtMs =
    choices.length === 0 && scene.next
      ? revealChoicesAtMs + (scene.autoAdvanceMs ?? DEFAULT_AUTO_ADVANCE_MS)
      : Number.POSITIVE_INFINITY

  const deadline = Number.isFinite(autoAdvanceAtMs)
    ? autoAdvanceAtMs
    : choices.length > 0
      ? revealChoicesAtMs
      : typingDurationMs

  // Reset animation state on scene change — intentional synchronous reset
  useEffect(() => {
    if (readingRecordedRef.current === false && elapsedRef.current > 0) {
      recordReadingBehavior(didFastForwardRef.current)
    }
    elapsedRef.current = 0
    autoAdvancedRef.current = false
    didFastForwardRef.current = false
    readingRecordedRef.current = false
    textCompleteSoundedRef.current = false
    choicesRevealSoundedRef.current = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- scene reset requires immediate state sync
    setElapsedMs(0)
    if (scene.sounds?.onEnter) {
      void playGameSound(scene.sounds.onEnter)
    }
  }, [pauseAfterMs, resolvedText, scene.id, scene.sounds, typingDelay])

  useEffect(() => {
    const soundIds: GameSoundId[] = ['scene_advance', 'text_complete']

    if (scene.sounds?.onEnter) {
      soundIds.push(scene.sounds.onEnter)
    }
    if (scene.sounds?.onTextComplete) {
      soundIds.push(scene.sounds.onTextComplete)
    }
    if (scene.sounds?.onChoicesReveal) {
      soundIds.push(scene.sounds.onChoicesReveal)
    }

    void preloadGameSounds([...new Set(soundIds)])
  }, [scene.id, scene.sounds])

  const advanceElapsed = useCallback((ms: number) => {
    setElapsedMs((current) => {
      const next = Math.max(0, current + ms)
      elapsedRef.current = next
      return next
    })
  }, [])

  useEffect(() => {
    if (deadline === 0 || elapsedMs >= deadline) return

    let frameId = 0
    let previous = performance.now()

    const tick = (now: number) => {
      const delta = now - previous
      previous = now
      advanceElapsed(delta)
      if (elapsedRef.current < deadline) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [advanceElapsed, deadline, elapsedMs])

  useEffect(() => {
    if (!Number.isFinite(autoAdvanceAtMs) || autoAdvancedRef.current || elapsedMs < autoAdvanceAtMs) {
      return
    }

    autoAdvancedRef.current = true
    void playGameSound('scene_advance')
    onAdvance()
  }, [autoAdvanceAtMs, elapsedMs, onAdvance])

  const typedCharacters = useMemo(() => {
    if (typingDelay === 0) return resolvedText.length
    return Math.max(0, Math.min(resolvedText.length, Math.floor(elapsedMs / typingDelay)))
  }, [elapsedMs, resolvedText.length, typingDelay])

  const textComplete = typedCharacters >= resolvedText.length
  const choicesVisible = choices.length > 0 && elapsedMs >= revealChoicesAtMs

  // Record reading completion when text finishes naturally (not from fast-forward)
  useEffect(() => {
    if (textComplete && !readingRecordedRef.current && !didFastForwardRef.current) {
      readingRecordedRef.current = true
      recordReadingBehavior(false)
    }
  }, [textComplete])

  useEffect(() => {
    if (!textComplete || textCompleteSoundedRef.current || resolvedText.length === 0) return

    textCompleteSoundedRef.current = true
    void playGameSound('text_complete')
    if (scene.sounds?.onTextComplete) {
      void playGameSound(scene.sounds.onTextComplete)
    }
  }, [resolvedText.length, scene.sounds, textComplete])

  useEffect(() => {
    if (!choicesVisible || choicesRevealSoundedRef.current) return

    choicesRevealSoundedRef.current = true
    if (scene.sounds?.onChoicesReveal) {
      void playGameSound(scene.sounds.onChoicesReveal)
    }
  }, [choicesVisible, scene.sounds])
  const displayedText = resolvedText.slice(0, typedCharacters)
  const transition = getTransition(scene)
  const background = getBackground(scene.background)
  const sceneImage = getSceneImage(scene.id)

  const fastForward = useCallback(() => {
    if (!textComplete) {
      didFastForwardRef.current = true
      elapsedRef.current = typingDurationMs
      setElapsedMs(typingDurationMs)
      return
    }

    if (!choicesVisible && choices.length > 0) {
      elapsedRef.current = revealChoicesAtMs
      setElapsedMs(revealChoicesAtMs)
      return
    }

    if (Number.isFinite(autoAdvanceAtMs)) {
      elapsedRef.current = autoAdvanceAtMs
      setElapsedMs(autoAdvanceAtMs)
    }
  }, [autoAdvanceAtMs, choices.length, choicesVisible, revealChoicesAtMs, textComplete, typingDurationMs])

  useEffect(() => {
    if (!registerBridge) return

    registerBridge({
      advanceTime: advanceElapsed,
      snapshot: () =>
        JSON.stringify({
          mode: 'scene',
          scene: scene.id,
          chapter: scene.chapter,
          background: scene.background ?? 'default',
          typedCharacters,
          textComplete,
          choicesVisible,
          choices: choicesVisible
            ? choices.map((choice) => ({ id: choice.id, text: choice.text }))
            : [],
          chorusLevel,
        }),
    })

    return () => registerBridge(null)
  }, [
    advanceElapsed,
    choices,
    choicesVisible,
    chorusLevel,
    registerBridge,
    scene.background,
    scene.chapter,
    scene.id,
    textComplete,
    typedCharacters,
  ])

  return (
    <section
      className={[
        'scene-renderer',
        scene.background?.includes('night') ? 'is-night' : '',
        scene.background?.includes('dream') ? 'is-dream' : '',
        scene.transitionType === 'ritual' ? 'is-ritual' : '',
      ].filter(Boolean).join(' ')}
      data-psychedelic={psychedelicLevel > 0 ? psychedelicLevel : undefined}
      aria-label={`Day ${scene.day} ${scene.chapter}`}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`background-${scene.id}`}
          className="scene-renderer__backdrop"
          style={{ background }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: EASE_SOFT }}
        />
      </AnimatePresence>

      {sceneImage && (
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`image-${scene.id}`}
            className="scene-renderer__image-layer"
            style={{
              backgroundImage: `url(${sceneImage.src})`,
              backgroundPosition: sceneImage.position,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: sceneImage.opacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: EASE_SOFT }}
          />
        </AnimatePresence>
      )}

      <div className="scene-renderer__wash" />

      <div className="scene-renderer__frame">
        <PerceptionCompositor effects={effects} chorusLevel={chorusLevel}>
          <AnimatePresence initial={false} mode="wait">
            <motion.article
              key={scene.id}
              className="scene-renderer__scene"
              initial={transition.initial}
              animate={transition.animate}
              exit={transition.exit}
              transition={transition.transition}
            >
              <button
                type="button"
                className="scene-renderer__text-shell"
                onClick={fastForward}
                aria-label="Advance text"
              >
                <span className="scene-renderer__kicker">Day {scene.day}</span>
                <span className="scene-renderer__chapter">{scene.chapter.replace(/_/g, ' ')}</span>
                <span className="scene-renderer__text">
                  <DestabilizedText
                    text={displayedText}
                    distortionLevel={distortionLevel ?? 0}
                  />
                  {!textComplete ? <span className="scene-renderer__cursor" aria-hidden="true" /> : null}
                </span>
              </button>

              <GhostEcho sceneId={scene.id} />

              <DeadlineChoicePanel
                key={scene.id}
                sceneId={scene.id}
                choices={choicesVisible ? choices : []}
                chorusLevel={chorusLevel}
                pressure={scene.pressure}
                pulse={stress?.pulse ?? 0}
                onChoose={onChoose}
              />

              <HesitationWhisper
                choicesVisible={choicesVisible}
                chorusLevel={chorusLevel}
              />

              <IntentResidueOverlay sceneId={scene.id} />
              <PsychedelicOverlay level={psychedelicLevel} />
            </motion.article>
          </AnimatePresence>
        </PerceptionCompositor>
      </div>
    </section>
  )
}
