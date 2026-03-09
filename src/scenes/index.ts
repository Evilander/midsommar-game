// ─── Scene Registry ─── All narrative content indexed by scene id ───

import type { SceneNode, Chapter } from '../engine/types'
import { PROLOGUE_SCENES, PROLOGUE_CHAPTER } from './day0-prologue'
import { DAY1_SCENES, DAY1_CHAPTER } from './day1-arrival'
import { DAY2_SCENES, DAY2_CHAPTER } from './day2-attestupa'
import { DAY3_SCENES, DAY3_CHAPTER } from './day3-isolation'
import { DAY4_SCENES, DAY4_CHAPTER } from './day4-entanglement'
import { DAY5_7_SCENES, DAY5_7_CHAPTER } from './day5-7-descent'
import { DAY8_SCENES, DAY8_CHAPTER } from './day8-preparation'
import { DAY9_SCENES, DAY9_CHAPTER } from './day9-fire'

// All scenes in a flat array
export const ALL_SCENES: SceneNode[] = [
  ...PROLOGUE_SCENES,
  ...DAY1_SCENES,
  ...DAY2_SCENES,
  ...DAY3_SCENES,
  ...DAY4_SCENES,
  ...DAY5_7_SCENES,
  ...DAY8_SCENES,
  ...DAY9_SCENES,
]

// All chapters in order
export const CHAPTERS: Chapter[] = [
  PROLOGUE_CHAPTER,
  DAY1_CHAPTER,
  DAY2_CHAPTER,
  DAY3_CHAPTER,
  DAY4_CHAPTER,
  DAY5_7_CHAPTER,
  DAY8_CHAPTER,
  DAY9_CHAPTER,
]
