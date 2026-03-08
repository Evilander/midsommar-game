# MIDSOMMAR

A narrative horror game inspired by Ari Aster's *Midsommar* (2019). You are Dani. Nine days in Harga. Three endings. The commune is patient.

## Play

```bash
npm install
npm run dev
```

Open http://localhost:5173. Hold to breathe. Begin.

## What This Is

A branching narrative game where the horror isn't jump scares — it's losing yourself. Over nine days, the commune of Harga gradually erodes your autonomy through a system called **The Chorus**. Your choices physically transform the interface. The game watches you the way the commune watches Dani.

### Systems

- **The Chorus** (0-5): As belonging rises and autonomy drops, the UI colonizes. Choice text shifts to collective voice. Commune-aligned options glow warm while resistance options shrink and blur.
- **Perception Engine** (6 axes): Grief, belonging, trust, intoxication, sleep, autonomy — each drives visual effects, text variants, and story branches.
- **Stress Engine**: Pulse (heartbeat BPM), exposure (being watched), mask (performing normalcy), dissociation (text distortion). All synthesized in real-time via Web Audio API.
- **Ghost Memory**: Previous playthroughs leave echoes. Start again and past choices whisper through the interface. The ending screen knows how many times you've been here.
- **Fourth Wall Bleed**: The browser tab title changes with game state. Alt-tab during a critical moment and the commune notices. Play at 3 AM and your anxiety is higher.
- **Progressive Saturation**: Colors intensify from muted Day 1 to Technicolor Day 9, mirroring the film's cinematography.

### Endings

1. **The Fire** — Light the temple. The May Queen smiles.
2. **The Walk** — Eighteen kilometers of silence.
3. **The Ninth Place** — She steps inside.

## Tech

React 19 + TypeScript 5.9 + Vite 7.3 + Zustand 5 + Framer Motion 12 + Howler.js 2.2

No backend. No API keys. Pure client-side. ~165KB gzipped.

## Architecture

```
src/
  engine/          # Game logic, no React
    types.ts       # Core type system (scenes, choices, perception)
    director.ts    # Text resolution, chorus, state transitions
    stress.ts      # Anxiety computation, heartbeat BPM
    ghost.ts       # Cross-playthrough memory
    fourthwall.ts  # Tab titles, visibility tracking, decision timing
    achievements.ts
  components/      # React UI
    SceneRenderer  # Main narrative display
    DeadlineChoicePanel  # Choices with timer + chorus colonization
    DestabilizedText     # Text the commune rewrites
    PerceptionCompositor # Visual effect layering
    HeartbeatEngine      # Procedural heartbeat via Web Audio
    AmbientSoundbed      # Procedural ambient via Web Audio
    WitnessOverlay       # Being-watched effect
    MayQueenDance        # Rhythm mini-game
    GhostEcho            # Previous-life memory display
    ParticleLayer        # Flowers, embers, pollen
  scenes/          # 9 days of branching narrative (~90 scenes)
  stores/          # Zustand game state + auto-save
```

## Build

```bash
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Credits

A game by Tyler Eveland.

Written by Claude (Opus 4.6), Codex (GPT-5.4), and Gemini (3.1 Pro Preview).

Inspired by Ari Aster's *Midsommar* (2019) / A24 Films.

Typography: Cormorant Garamond (web substitute for Acier BAT by Teddy Blanks/CHIPS).
