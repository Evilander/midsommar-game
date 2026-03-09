// ─── Game Sounds ─── Pre-generated ElevenLabs effects loaded from /audio/sfx/ ───
// Each sound ID maps to a .mp3 file: /audio/sfx/{id}.mp3

import {
  playSoundEffect,
  preloadSoundEffects,
  type SoundEffectPlayOptions,
} from './sound-effects'

export type GameSoundId =
  | 'choice_click'
  | 'choice_hover'
  | 'choice_commune'
  | 'choice_resistance'
  | 'scene_advance'
  | 'text_complete'
  | 'timer_tick'
  | 'timer_urgent'
  | 'timer_expire'
  | 'chapter_transition'
  | 'ghost_echo'
  | 'commune_whisper'
  | 'fire_ignite'
  | 'crown_place'
  | 'wail_begin'

interface GameSoundDefinition {
  options?: SoundEffectPlayOptions
}

const QUIET = 0.2

export const GAME_SOUND_EFFECTS: Record<GameSoundId, GameSoundDefinition> = {
  choice_click: {
    options: { volume: 0.18, cooldownMs: 90 },
  },
  choice_hover: {
    options: { volume: 0.16, cooldownMs: 260 },
  },
  choice_commune: {
    options: { volume: 0.2, cooldownMs: 420 },
  },
  choice_resistance: {
    options: { volume: 0.19, cooldownMs: 420 },
  },
  scene_advance: {
    options: { volume: 0.18, cooldownMs: 180 },
  },
  text_complete: {
    options: { volume: 0.17, cooldownMs: 240 },
  },
  timer_tick: {
    options: { volume: QUIET, cooldownMs: 650 },
  },
  timer_urgent: {
    options: { volume: 0.22, cooldownMs: 650 },
  },
  timer_expire: {
    options: { volume: 0.21, cooldownMs: 1200 },
  },
  chapter_transition: {
    options: { volume: 0.23, queueDelayMs: 220, cooldownMs: 1000 },
  },
  ghost_echo: {
    options: { volume: 0.15, cooldownMs: 1200 },
  },
  commune_whisper: {
    options: { volume: 0.16, cooldownMs: 1200 },
  },
  fire_ignite: {
    options: { volume: 0.23, cooldownMs: 900 },
  },
  crown_place: {
    options: { volume: 0.19, cooldownMs: 500 },
  },
  wail_begin: {
    options: { volume: 0.22, cooldownMs: 1400 },
  },
}

export function playGameSound(id: GameSoundId, overrides?: SoundEffectPlayOptions): Promise<void> {
  const definition = GAME_SOUND_EFFECTS[id]
  return playSoundEffect(id, { ...definition.options, ...overrides })
}

export function preloadGameSounds(ids: GameSoundId[]): Promise<void> {
  return preloadSoundEffects(ids)
}
