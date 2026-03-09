// --- Soundtrack Engine --- Bobby Krlic's score made interactive ---
// The Haxan Cloak scores your dissolution.

import { Howl, Howler } from 'howler'

// Track IDs map to expected filenames in public/audio/soundtrack/
export interface SoundtrackTrack {
  id: string
  filename: string
  loop: boolean
  baseVolume: number
  fadeInMs: number
  fadeOutMs: number
}

// Bobby Krlic - Midsommar (Original Score)
// Filenames match the converted MP3s in public/audio/soundtrack/
const SOUNDTRACK_TRACKS: SoundtrackTrack[] = [
  { id: 'prophesy',          filename: '01_-_prophesy.mp3',                       loop: true,  baseVolume: 0.72, fadeInMs: 3000, fadeOutMs: 2500 },
  { id: 'gassed',            filename: '02_-_gassed.mp3',                         loop: false, baseVolume: 0.68, fadeInMs: 1500, fadeOutMs: 3000 },
  { id: 'halsingland',       filename: '03_-_h__lsingland.mp3',                   loop: true,  baseVolume: 0.65, fadeInMs: 3000, fadeOutMs: 2500 },
  { id: 'the_house',         filename: '04_-_the_house_that_h__rga_built.mp3',    loop: true,  baseVolume: 0.62, fadeInMs: 2500, fadeOutMs: 2500 },
  { id: 'attestupan',        filename: '05_-_attestupan.mp3',                     loop: false, baseVolume: 0.75, fadeInMs: 2000, fadeOutMs: 4000 },
  { id: 'ritual_transfig',   filename: '06_-_ritual_in_transfigured_time.mp3',    loop: true,  baseVolume: 0.68, fadeInMs: 2500, fadeOutMs: 2500 },
  { id: 'murder_mystery',    filename: '07_-_murder__mystery_.mp3',               loop: true,  baseVolume: 0.6,  fadeInMs: 2500, fadeOutMs: 3000 },
  { id: 'the_blessing',      filename: '08_-_the_blessing.mp3',                   loop: true,  baseVolume: 0.65, fadeInMs: 2500, fadeOutMs: 2500 },
  { id: 'chorus_of_sirens',  filename: '09_-_chorus_of_sirens.mp3',               loop: true,  baseVolume: 0.7,  fadeInMs: 2500, fadeOutMs: 2500 },
  { id: 'language_of_sex',   filename: '10_-_a_language_of_sex.mp3',              loop: true,  baseVolume: 0.58, fadeInMs: 2000, fadeOutMs: 2000 },
  { id: 'harga_collapsing',  filename: '11_-_h__rga__collapsing.mp3',             loop: false, baseVolume: 0.75, fadeInMs: 3000, fadeOutMs: 4000 },
  { id: 'fire_temple',       filename: '12_-_fire_temple.mp3',                    loop: false, baseVolume: 0.82, fadeInMs: 4000, fadeOutMs: 5000 },
]

// Current scene graph routing. The older placeholder IDs left most of the score unused.
const SCENE_TRACK_MAP: Record<string, string> = {
  // Title screen — prophesy plays while you hold to breathe
  title: 'prophesy',

  // Prologue
  prologue_apartment: 'gassed',
  prologue_no_answer: 'gassed',
  prologue_phone_friend: 'gassed',
  prologue_phone_christian: 'gassed',
  prologue_silence: 'gassed',
  prologue_discovery: 'gassed',
  prologue_aftermath: 'gassed',
  prologue_departure: 'prophesy',
  prologue_car: 'prophesy',

  // Day 1
  arrival_gate: 'halsingland',
  arrival_welcome: 'halsingland',
  arrival_breathe: 'halsingland',
  arrival_feast_intro: 'halsingland',
  arrival_feast_sit: 'halsingland',
  arrival_pelle_walk: 'halsingland',
  arrival_mushroom_offer: 'halsingland',
  arrival_trip_onset: 'the_blessing',
  arrival_trip_deep: 'the_blessing',
  arrival_trip_panic: 'the_house',
  arrival_trip_sober: 'the_house',
  arrival_first_night: 'the_blessing',
  day1_end: 'the_blessing',

  // Day 2
  day2_morning: 'halsingland',
  day2_pelle_warning: 'halsingland',
  day2_procession: 'attestupan',
  day2_the_jump: 'attestupan',
  day2_aftermath_scream: 'the_house',
  day2_aftermath_still: 'the_house',
  day2_aftermath_christian: 'the_house',
  day2_aftermath_watch: 'the_house',
  day2_aftermath: 'the_house',
  day2_mark_tree: 'murder_mystery',
  day2_pelle_held: 'the_house',
  day2_night: 'the_blessing',
  day2_end: 'the_blessing',

  // Day 3
  day3_morning: 'murder_mystery',
  day3_ask_mark: 'murder_mystery',
  day3_breakfast: 'murder_mystery',
  day3_marks_room_search: 'murder_mystery',
  day3_mark_trail_search: 'murder_mystery',
  day3_marks_room_evidence: 'murder_mystery',
  day3_midday: 'ritual_transfig',
  day3_evening: 'murder_mystery',
  day3_warn_josh: 'murder_mystery',
  day3_tell_pelle: 'murder_mystery',
  day3_josh_goes: 'murder_mystery',
  day3_camera_evidence: 'murder_mystery',
  day3_fools_skin: 'murder_mystery',
  day3_night: 'the_house',
  day3_end: 'the_blessing',

  // Day 4
  day4_morning: 'ritual_transfig',
  day4_tapestry: 'ritual_transfig',
  day4_midday: 'ritual_transfig',
  day4_night: 'language_of_sex',
  day4_break: 'chorus_of_sirens',
  day4_hold: 'the_house',
  day4_end: 'the_blessing',

  // Day 5-7
  day5_morning: 'the_house',
  day5_accept: 'chorus_of_sirens',
  day5_try_leave: 'the_house',
  day5_afternoon: 'chorus_of_sirens',
  day5_evening: 'the_house',
  day5_night: 'the_house',
  day6_washing: 'chorus_of_sirens',
  day6_dance: 'chorus_of_sirens',
  day6_crowned: 'chorus_of_sirens',
  day6_blessing: 'chorus_of_sirens',
  day6_feast: 'chorus_of_sirens',
  day6_night: 'the_house',
  day7_morning: 'harga_collapsing',
  day7_revelation: 'harga_collapsing',
  day8_preparation: 'harga_collapsing',
  day8_preparation_spare: 'harga_collapsing',
  day8_forced: 'harga_collapsing',

  // Day 8
  day8_morning: 'harga_collapsing',
  day8_dressing: 'harga_collapsing',
  day8_procession_start: 'harga_collapsing',
  day8_temple_approach: 'harga_collapsing',
  day8_temple_threshold: 'harga_collapsing',
  day8_pelle_farewell: 'harga_collapsing',
  day8_vigil: 'harga_collapsing',
  day8_night: 'harga_collapsing',
  day8_end: 'harga_collapsing',

  // Day 9 + endings
  day9_fire: 'fire_temple',
  day9_threshold: 'fire_temple',
  ending_fire: 'fire_temple',
  ending_walk: 'harga_collapsing',
  ending_sacrifice: 'fire_temple',
  ending_surrender: 'fire_temple',
  credits: 'prophesy',
}

const PREFIX_TRACK_MAP: Array<[prefix: string, trackId: string]> = [
  ['day9_', 'fire_temple'],
  ['ending_', 'fire_temple'],
  ['day8_', 'harga_collapsing'],
  ['day7_', 'harga_collapsing'],
  ['day6_', 'chorus_of_sirens'],
  ['day5_', 'the_house'],
  ['day4_', 'ritual_transfig'],
  ['day3_', 'murder_mystery'],
  ['day2_', 'attestupan'],
  ['arrival_', 'halsingland'],
  ['prologue_', 'gassed'],
]

// State-based overrides — these take priority over scene mapping
export interface SoundtrackState {
  chorusLevel: number
  intoxication: number
  pulse: number
  day: number
  isRitual: boolean
}

function getStateOverrideTrack(state: SoundtrackState): string | null {
  // Day 9 fire scenes override everything
  if (state.day === 9 && state.chorusLevel >= 3) return 'fire_temple'
  if (state.day >= 8 && state.pulse >= 82) return 'fire_temple'
  if (state.day >= 7 && state.chorusLevel >= 4) return 'harga_collapsing'
  // During intense rituals at high chorus, switch to choral
  if (state.isRitual && state.chorusLevel >= 4) return 'chorus_of_sirens'
  // High intoxication shifts to ethereal
  if (state.intoxication > 60) return 'the_blessing'
  if (state.pulse > 70 && state.day >= 3) return 'the_house'
  return null
}

function getMappedTrack(sceneId: string): string | null {
  const exact = SCENE_TRACK_MAP[sceneId]
  if (exact) return exact

  for (const [prefix, trackId] of PREFIX_TRACK_MAP) {
    if (sceneId.startsWith(prefix)) return trackId
  }

  return null
}

// --- Soundtrack Manager --- Singleton that manages playback ---

let currentTrackId: string | null = null
let currentHowl: Howl | null = null
let nextHowl: Howl | null = null
let masterVolume = 0.7
let enabled = false
const availableTracks = new Set<string>(SOUNDTRACK_TRACKS.map(t => t.id))

// Initialize soundtrack — register tracks and install audio unlock listeners.
export function initSoundtrack(): string[] {
  const ids = SOUNDTRACK_TRACKS.map(t => t.id)
  console.log(`[soundtrack] init: ${ids.length} tracks registered`)
  installGlobalAudioUnlock()
  return ids
}

export function setSoundtrackEnabled(value: boolean): void {
  enabled = value
  if (!value) {
    stopSoundtrack()
  }
}

export function setSoundtrackVolume(volume: number): void {
  masterVolume = Math.max(0, Math.min(1, volume))
  if (currentHowl) {
    const track = SOUNDTRACK_TRACKS.find((t) => t.id === currentTrackId)
    if (track) {
      currentHowl.volume(track.baseVolume * masterVolume)
    }
  }
}

export function isSoundtrackAvailable(): boolean {
  return availableTracks.size > 0
}

export function getTrackForScene(sceneId: string, state: SoundtrackState): string | null {
  if (!enabled || availableTracks.size === 0) return null

  const override = getStateOverrideTrack(state)
  if (override && availableTracks.has(override)) return override

  const mapped = getMappedTrack(sceneId)
  if (mapped && availableTracks.has(mapped)) return mapped

  return null
}

export function playSoundtrackForScene(sceneId: string, state: SoundtrackState): void {
  if (!enabled) return

  const trackId = getTrackForScene(sceneId, state)
  if (trackId === currentTrackId) return

  if (!trackId) {
    fadeOutCurrent(3000)
    return
  }

  // Defer until user has interacted (browser autoplay policy)
  if (!userHasInteracted) {
    pendingTrackId = trackId
    return
  }

  crossfadeTo(trackId)
}

function unlockAudioContext(): void {
  // Howler creates its AudioContext lazily. Once it exists, we need
  // to resume it — browsers suspend contexts created outside a gesture.
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume().catch(() => undefined)
  }
}

function crossfadeTo(trackId: string): void {
  const track = SOUNDTRACK_TRACKS.find((t) => t.id === trackId)
  if (!track) { console.warn(`[soundtrack] no track def for ${trackId}`); return }

  console.log(`[soundtrack] crossfadeTo("${trackId}") file=${track.filename} masterVol=${masterVolume}`)

  if (nextHowl) {
    nextHowl.unload()
    nextHowl = null
  }

  const newHowl = new Howl({
    src: [`/audio/soundtrack/${track.filename}`],
    loop: track.loop,
    volume: 0,
    html5: false,
  })

  // Unlock immediately — the Howl constructor may have just created Howler.ctx
  unlockAudioContext()

  nextHowl = newHowl

  newHowl.once('load', () => {
    // Resume again in the load callback — catches edge cases where the
    // context was created after the user gesture completed
    unlockAudioContext()

    const targetVol = track.baseVolume * masterVolume
    console.log(`[soundtrack] loaded "${trackId}", playing at targetVol=${targetVol.toFixed(3)}`)
    fadeOutCurrent(track.fadeOutMs)
    newHowl.play()
    newHowl.fade(0, targetVol, track.fadeInMs)

    currentHowl = newHowl
    currentTrackId = trackId
    nextHowl = null
  })

  newHowl.once('loaderror', (_id: number, err: unknown) => {
    console.error(`[soundtrack] LOAD ERROR for ${trackId}`, err)
    availableTracks.delete(trackId)
    nextHowl = null
  })
}

function fadeOutCurrent(durationMs: number): void {
  if (!currentHowl) return

  const howlToFade = currentHowl
  howlToFade.fade(howlToFade.volume(), 0, durationMs)

  window.setTimeout(() => {
    howlToFade.stop()
    howlToFade.unload()
  }, durationMs + 200)

  currentHowl = null
  currentTrackId = null
}

export function stopSoundtrack(): void {
  fadeOutCurrent(1000)
  if (nextHowl) {
    nextHowl.unload()
    nextHowl = null
  }
}

// Track whether a user gesture has unlocked audio
let userHasInteracted = false
let pendingTrackId: string | null = null
let globalUnlockInstalled = false

function installGlobalAudioUnlock(): void {
  if (globalUnlockInstalled || typeof document === 'undefined') return
  globalUnlockInstalled = true

  const unlock = () => {
    userHasInteracted = true
    unlockAudioContext()
    // If a track was pending because we hadn't interacted yet, start it now
    if (pendingTrackId) {
      const trackToPlay = pendingTrackId
      pendingTrackId = null
      crossfadeTo(trackToPlay)
    }
  }

  // Cover all possible user gesture types
  for (const event of ['click', 'touchstart', 'keydown', 'mousedown']) {
    document.addEventListener(event, unlock, { once: false, passive: true })
  }
}

export function resumeSoundtrack(): void {
  userHasInteracted = true
  unlockAudioContext()

  // Install global unlock for future interactions (keyboard, etc.)
  installGlobalAudioUnlock()

  // Now play the pending track that was deferred
  if (pendingTrackId) {
    const trackToPlay = pendingTrackId
    pendingTrackId = null
    crossfadeTo(trackToPlay)
  }
}

