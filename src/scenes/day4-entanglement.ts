// ─── Day 4: Entanglement ─── The love spell. Christian drifts. The commune offers what he won't. ───

import type { SceneNode, Chapter } from '../engine/types'

export const DAY4_SCENES: SceneNode[] = [
  {
    id: 'day4_morning',
    day: 4,
    chapter: 'entanglement',
    text: `Josh is gone.

Christian has his notebook. You watched him take it. Neither of you mentions this.

At breakfast, Christian sits apart from you. Not far — ten feet — but the distance feels architectural. Maja sits beside him. She brings him tea.

You watch her hands as she sets the cup down. Her fingertips brush his wrist. He doesn't pull away.

The tea smells different from what you've been drinking. Sweeter. More deliberate.

An elder woman sits beside you. She says nothing. She places a warm hand on your back, between your shoulder blades, in the exact place where the tension lives.

"You are holding so much," she says. "Let us hold some of it."`,
    background: 'harga_feast',
    ambientSound: 'morning_chant',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    choices: [
      {
        id: 'confront_christian_maya',
        text: 'Go to Christian. Ask about the tea.',
        effects: {
          relationships: { christian: -8 },
          perception: { autonomy: 8, grief: 10 },
        },
        next: 'day4_confront',
      },
      {
        id: 'let_elder_hold',
        text: 'Let the woman hold you.',
        chorusText: 'Be held.',
        effects: {
          perception: { belonging: 12, autonomy: -8, grief: -8 },
          relationships: { harga: 10 },
          chorus: 1,
        },
        next: 'day4_held',
      },
      {
        id: 'walk_alone_day4',
        text: 'Leave the table. Walk.',
        effects: {
          perception: { autonomy: 5, grief: 5 },
          flags: { found_tapestry: true },
        },
        next: 'day4_tapestry',
      },
    ],
  },

  {
    id: 'day4_confront',
    day: 4,
    chapter: 'entanglement',
    text: `"What is she giving you?"

Christian looks at the cup as if seeing it for the first time. "Tea? It's just tea, Dani."

"She put something in it. Yesterday at dinner. I saw her—"

"You're being paranoid." His voice has the flat quality of a man who has practiced this sentence in advance. "You've been paranoid since we got here."

"Three of our friends are missing!"

"They're not missing. They left. Or they're exploring. You're doing the thing you do where—"

"Where what?"

He stops. The calculation flickers across his face — the weighing of cruelty against convenience.

"Never mind."

Maja watches from across the table. She doesn't look triumphant. She looks patient. Like someone tending a garden who knows exactly when the fruit will fall.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    stressModifiers: { pulse: 45, mask: 40 },
    visualEffects: [
      { type: 'vignette', intensity: 0.2 },
    ],
    next: 'day4_midday',
  },

  {
    id: 'day4_held',
    day: 4,
    chapter: 'entanglement',
    text: `The woman's hand is warm. Not hot — warm the way the sun is warm through a window in early spring.

She doesn't speak. She just holds her hand on your back, and something inside you unclenches. A knot you didn't know you'd been carrying. A fist you've been making with your whole body since the night the phone rang.

Other women gather. Not crowding — attending. They sit near you in a loose circle, and their breathing synchronizes with yours. You feel it happen. Your chest rises when theirs rises. Your exhale matches the collective exhale.

"You have carried this alone too long," the elder says. "Here, grief is not private. Grief is the community's responsibility."

You cry. They cry with you. And for the first time since the funeral, the crying feels like it's doing what crying is supposed to do.

It feels like release.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'cried_first_night', value: true },
        text: `The woman's hand is warm. The same warmth you felt on the first night, when the singing wrapped around your crying and held it.

This time, you don't fight it. You lean into the circle of women and you let go.

The grief comes in waves — your sister, your parents, the apartment, the gas, the phone call, Christian's empty eyes. Each wave is met by a hand on your shoulder, a breath that matches yours, a voice that harmonizes with your sobbing.

"We are your family now," the elder whispers. "If you'll let us."

The terrifying thing is that you want to. The terrifying thing is that this is the safest you've felt in months.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'chorus_hum',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.7 },
      { type: 'flowers_breathe', intensity: 0.6 },
      { type: 'border_bloom', intensity: 0.4 },
    ],
    next: 'day4_midday',
  },

  {
    id: 'day4_tapestry',
    day: 4,
    chapter: 'entanglement',
    text: `Behind the main house, in a building you haven't entered before, you find the tapestry.

It tells a story in panels, woven in thread that still holds its color after what must be centuries:

Panel 1: A girl stands alone at the edge of a forest. Behind her, a house burns.
Panel 2: A man in golden robes offers the girl his hand. She takes it.
Panel 3: The girl dances in a circle of women. Flowers grow from her footsteps.
Panel 4: A man — a different man, darker, reluctant — is led into a barn. He is naked. Women surround him.
Panel 5: The girl wears a crown of flowers. She is smiling. The crown weighs her head down until she can barely stand.
Panel 6: A building burns. Inside it, nine shapes. The girl watches from outside. She is still smiling.

You stare at panel 1 for a long time.

A girl stands alone at the edge of a forest. Behind her, a house burns.

It's not your story. But it's so close to your story that the difference feels like a translation error.`,
    background: 'harga_perimeter',
    ambientSound: 'wind_low',
    visualEffects: [
      { type: 'vignette', intensity: 0.3 },
    ],
    next: 'day4_midday',
  },

  {
    id: 'day4_midday',
    day: 4,
    chapter: 'entanglement',
    text: `In the afternoon, Siv finds you.

"I would like to show you something," she says. "Something we show only to people we trust."

She leads you to the yellow temple. The one with no windows. The one the child said you'd see "when it's time."

Inside, the walls are painted floor to ceiling with the lifecycle of the Hårga. Birth, growth, harvest, death, rebirth. It spirals around the room like a helix.

At the center, a stone altar holds a book bound in leather. The Rubi Radr. Josh died trying to photograph it. You're being invited to see it.

Siv opens it. The pages are filled with symbols you can't read. But the illustrations are clear: a woman, crowned in flowers, standing before a burning temple. The nine sacrifices. The renewal.

"You understand more than you know, Dani," Siv says.

The terrible thing is: she's right.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.4 },
    ],
    typingSpeed: 'slow',
    next: 'day4_night',
  },

  {
    id: 'day4_night',
    day: 4,
    chapter: 'entanglement',
    text: `That night, through the walls, you hear Christian.

Not his voice. His breathing. His breathing and — other breathing. Maja's breathing.

You lie in your narrow bed and listen to your boyfriend betray you ten feet away, separated by a wall thinner than the excuses he'll make in the morning.

But the sounds aren't coming from next door. They're coming from somewhere else. Further. The barn.

A woman appears at your bedside. You didn't hear the door open.

"Come," she says. "You should see."

She leads you across the compound in the endless golden light to the barn. The door is ajar. Inside:

Christian is naked. Maja is beneath him. Around them — in a circle, holding hands, singing — nine naked women, their voices matched to the rhythm of the act. They sway. They breathe. They moan in unison.

He doesn't see you. His eyes are glassy with whatever they've given him. Maja's face is serene. Sacred.

The women singing don't look at the couple. They look at each other. They look at the ceiling. Their voices build and build.

This is not sex. This is a ceremony. A ritual as old as the runes on the walls. A mating rite designed to produce a child, and Christian is the instrument, and he went willingly, or at least he didn't resist, which in this place is the same thing.

You stand in the doorway. The woman who brought you touches your shoulder.

"Now you see," she says. "Now you're free."`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    pressure: {
      timerMs: 8000,
      timerStyle: 'heartbeat',
      defaultChoice: 'break_cry_day4',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 70, exposure: 60, mask: 80 },
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.5 },
      { type: 'vignette', intensity: 0.4 },
    ],
    choices: [
      {
        id: 'break_cry_day4',
        text: 'Break.',
        chorusText: 'Let them hold you.',
        effects: {
          perception: { belonging: 15, autonomy: -12, grief: -10 },
          relationships: { harga: 15, christian: -20 },
          chorus: 1,
          flags: { broke_day4_night: true },
        },
        next: 'day4_break',
      },
      {
        id: 'hold_together',
        text: 'Hold yourself together. Steel jaw. Dry eyes.',
        effects: {
          perception: { autonomy: 10, grief: 15 },
          relationships: { christian: -10 },
        },
        next: 'day4_hold',
      },
    ],
  },

  {
    id: 'day4_break',
    day: 4,
    chapter: 'entanglement',
    text: `You break.

The sound that comes out of you is not crying. It's the sound of something structural giving way — a beam that's been holding up a ceiling for too long, finally splitting.

The women come immediately. Not rushing — flowing. They surround your bed and they wail with you. Not at you. With you. Their voices find the shape of your grief and wrap around it like hands around a wound.

You don't know how long it lasts. Time has no meaning here. When it ends, you're lying in a circle of women who are stroking your hair and humming and the world smells like flowers and sweat and salt.

"He is not enough for you," the elder whispers. "He was never enough."

She's right. He was never enough. But he was all you had.

"You have us now," she says, as if she heard the thought.

Maybe she did.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'communal_wail',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.9 },
      { type: 'flowers_breathe', intensity: 0.7 },
      { type: 'border_bloom', intensity: 0.6 },
    ],
    transitionType: 'breathe',
    next: 'day4_end',
  },

  {
    id: 'day4_hold',
    day: 4,
    chapter: 'entanglement',
    text: `You hold yourself together. Jaw locked. Eyes dry. Hands flat on the mattress, pressing down as if you could press the feelings through the bed and into the earth.

The women watch. They don't approach. They honor your distance.

But their silence is not empty. It's full of something — patience, maybe, or the particular mercy of people who know that the thing you're resisting is the thing that will save you.

Christian's breathing slows through the wall. Satisfied. Then silence.

You stare at the ceiling and count the painted panels. There are seventy-two. Each one tells a small story. Each one ends in fire.

You don't sleep. You don't cry. You hold yourself together so hard that you can feel yourself fracturing along the lines where the holding is strongest.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'silence_wind',
    visualEffects: [
      { type: 'vignette', intensity: 0.5 },
    ],
    next: 'day4_end',
  },

  {
    id: 'day4_end',
    day: 4,
    chapter: 'entanglement',
    text: `In your dream, you stand in your parents' bedroom. The gas is hissing. But instead of opening the door, you walk to the window and look out.

The Hårga are there. In the yard. In the street. Everywhere. Dancing in a circle with flowers in their hair.

They see you in the window. They beckon.

Behind you, the gas fills the room. In front of you, the sun never sets.

You step through the glass.`,
    background: 'dream_meadow',
    ambientSound: 'dream_drone',
    transitionType: 'breathe',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.9 },
      { type: 'color_shift', intensity: 0.5 },
    ],
    autoAdvanceMs: 4000,
    next: 'day5_morning',
  },
]

export const DAY4_CHAPTER: Chapter = {
  id: 'entanglement',
  day: 4,
  title: 'ENTANGLEMENT',
  subtitle: 'He was never enough.',
  scenes: DAY4_SCENES,
  anchorScene: 'day4_night',
  ritualScene: 'day4_midday',
  consequenceScene: 'day4_break',
}
