// ─── Midsommar: The Game ─── Core Type System ───

// ═══════════════════════════════════════════════════
// PERCEPTION STATE — drives The Chorus mechanic
// ═══════════════════════════════════════════════════

export type PerceptionAxis = {
  grief: number       // 0-100: weight of family loss
  belonging: number   // 0-100: how deeply entrained by the Hårga
  trust: number       // 0-100: trust in the commune vs suspicion
  intoxication: number // 0-100: effects of mushroom tea, herbs
  sleep: number       // 0-100: sleep deprivation (100 = fully rested)
  autonomy: number    // 0-100: sense of individual agency (The Chorus erodes this)
}

export type RelationshipState = {
  christian: number   // -100 to 100: resentment ↔ love
  pelle: number       // -100 to 100: suspicion ↔ trust
  harga: number       // -100 to 100: fear ↔ belonging
  mark: number        // -100 to 100 (may become fixed after events)
  josh: number        // -100 to 100 (may become fixed after events)
}

export type GameFlags = Record<string, boolean>

// ═══════════════════════════════════════════════════
// STRESS STATE — drives anxiety mechanics
// ═══════════════════════════════════════════════════

export interface StressState {
  pulse: number          // 0-100: physiological arousal. Drives heartbeat BPM, timer pressure
  exposure: number       // 0-100: how "watched" by the commune right now
  mask: number           // 0-100: how much Dani is performing normalcy (high = cracking)
  dissociation: number   // 0-100: detachment during trauma/drugs. Distorts text/audio
}

// ═══════════════════════════════════════════════════
// CLUE / EVIDENCE SYSTEM
// ═══════════════════════════════════════════════════

export interface Clue {
  id: string
  text: string                   // what the player sees
  corruptedText?: string         // what it degrades to under intoxication/chorus
  source: string                 // scene where found
  subject: 'mark' | 'josh' | 'simon' | 'connie' | 'ritual' | 'rune' | 'general'
  degradeAtChorus?: number       // chorus level at which this clue corrupts
}

export interface GameState {
  day: number                    // 1-9
  chapter: string                // current chapter id
  scene: string                  // current scene id
  perception: PerceptionAxis
  relationships: RelationshipState
  stress: StressState            // anxiety/pressure state
  flags: GameFlags               // narrative flags (e.g., "witnessed_attestupa", "drank_tea")
  inventory: string[]            // item ids
  clues: Clue[]                  // discovered evidence (degrades over time)
  history: string[]              // scene ids visited (for tracking)
  chorusLevel: number            // 0-5: how much the commune speaks through the UI
  endings: string[]              // unlocked ending paths
}

// ═══════════════════════════════════════════════════
// SCENE SCHEMA — the shared contract
// ═══════════════════════════════════════════════════

export interface TextVariant {
  condition: VariantCondition
  text: string
}

export type VariantCondition =
  | { type: 'belonging', min?: number, max?: number }
  | { type: 'grief', min?: number, max?: number }
  | { type: 'intoxication', min?: number, max?: number }
  | { type: 'autonomy', min?: number, max?: number }
  | { type: 'flag', flag: string, value: boolean }
  | { type: 'relationship', target: keyof RelationshipState, min?: number, max?: number }
  | { type: 'chorus', min?: number, max?: number }
  | { type: 'always' }

export interface ChoiceEffect {
  perception?: Partial<PerceptionAxis>
  relationships?: Partial<RelationshipState>
  flags?: Record<string, boolean>
  inventory?: { add?: string[], remove?: string[] }
  chorus?: number  // delta to chorus level
}

export interface Choice {
  id: string
  // The Chorus mechanic: text shifts as autonomy drops
  text: string                    // default/high-autonomy text
  chorusText?: string             // low-autonomy variant (collective voice)
  condition?: VariantCondition    // when this choice is available
  effects: ChoiceEffect
  next: string                    // scene id to transition to
}

// ═══════════════════════════════════════════════════
// PRESSURE EVENTS — timed choices, commune defaults
// ═══════════════════════════════════════════════════

export interface PressureConfig {
  timerMs: number                // how long before the commune decides for you
  timerStyle: 'visible' | 'hidden' | 'heartbeat'  // visible = countdown bar, hidden = no UI, heartbeat = pulse speeds up
  defaultChoice: string          // choice id the commune picks if timer expires
  timerShrinkWithPulse?: boolean // if true, high pulse reduces available time
}

// ═══════════════════════════════════════════════════
// EXPLORATION HOTSPOTS
// ═══════════════════════════════════════════════════

export interface Hotspot {
  id: string
  label: string
  x: number                      // 0-100 percentage position
  y: number                      // 0-100 percentage position
  icon: 'examine' | 'take' | 'rune' | 'listen' | 'door'
  condition?: VariantCondition
  result: HotspotResult
}

export type HotspotResult =
  | { type: 'text', text: string, variants?: TextVariant[] }
  | { type: 'clue', clue: Clue }
  | { type: 'item', itemId: string, text: string }
  | { type: 'scene', sceneId: string }
  | { type: 'rune_puzzle', puzzleId: string }

// ═══════════════════════════════════════════════════
// RITUAL BEAT — for rhythm/synchrony scenes
// ═══════════════════════════════════════════════════

export interface RitualBeat {
  type: 'tap' | 'hold' | 'breathe' | 'release'
  timeMs: number                 // when this beat occurs in the sequence
  durationMs?: number            // for holds/breaths
  prompt?: string                // visual cue text
}

export interface RitualConfig {
  beats: RitualBeat[]
  bpm: number
  rounds: number
  toleranceMs: number            // hit window
  missEffect: 'commune_helps' | 'pulse_spike' | 'text_distort'
  missText?: string              // what happens narratively on miss
  perfectText?: string           // what happens on perfect round
}

export interface SceneNode {
  id: string
  day: number
  chapter: string

  // Scene mode — determines which renderer is used
  mode?: 'narrative' | 'exploration' | 'ritual' | 'rhythm'

  // Narrative content
  text: string                    // default prose
  variants?: TextVariant[]        // perception-dependent rewrites

  // Choices
  choices?: Choice[]              // player choices (if absent, auto-advance)
  next?: string                   // auto-advance target (if no choices)

  // Pressure system — timed/coerced choices
  pressure?: PressureConfig

  // Exploration mode — clickable hotspots
  hotspots?: Hotspot[]

  // Ritual mode — rhythm/synchrony config
  ritual?: RitualConfig

  // Stress modifiers — applied while this scene is active
  stressModifiers?: Partial<StressState>

  // Presentation
  background?: string             // background art/gradient token
  ambientSound?: string           // audio loop token
  transitionType?: 'fade' | 'dissolve' | 'cut' | 'breathe' | 'ritual'
  typingSpeed?: 'slow' | 'normal' | 'fast' | 'instant'

  // Visual distortion tokens for PerceptionCompositor
  visualEffects?: VisualEffect[]

  // Timing
  autoAdvanceMs?: number          // auto-advance after delay (for ritual sequences)
  pauseAfterMs?: number           // pause before showing choices
}

export interface VisualEffect {
  type: 'flowers_breathe' | 'face_linger' | 'text_waver' | 'sun_pulse'
      | 'chorus_sync' | 'border_bloom' | 'color_shift' | 'vignette'
  intensity: number               // 0-1
  condition?: VariantCondition
}

// ═══════════════════════════════════════════════════
// CHAPTER STRUCTURE
// ═══════════════════════════════════════════════════

export interface Chapter {
  id: string
  day: number
  title: string
  subtitle?: string
  scenes: SceneNode[]
  anchorScene: string             // the unmissable scene
  ritualScene?: string            // the ritual hinge
  consequenceScene?: string       // the irreversible turn
}

// ═══════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════

export const INITIAL_STRESS: StressState = {
  pulse: 30,
  exposure: 0,
  mask: 0,
  dissociation: 0,
}

export const INITIAL_STATE: GameState = {
  day: 1,
  chapter: 'arrival',
  scene: 'prologue_car',
  perception: {
    grief: 85,
    belonging: 5,
    trust: 20,
    intoxication: 0,
    sleep: 60,
    autonomy: 90,
  },
  relationships: {
    christian: 15,
    pelle: 30,
    harga: 10,
    mark: 40,
    josh: 35,
  },
  stress: { ...INITIAL_STRESS },
  flags: {},
  inventory: ['family_photo', 'phone_dead'],
  clues: [],
  history: [],
  chorusLevel: 0,
  endings: [],
}
