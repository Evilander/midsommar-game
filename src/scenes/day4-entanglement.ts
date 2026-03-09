// ─── Day 4: Entanglement ─── The love spell. Christian drifts. The commune offers what he won't. ───

import type { SceneNode, Chapter } from '../engine/types'

export const DAY4_SCENES: SceneNode[] = [
  {
    id: 'day4_morning',
    day: 4,
    chapter: 'entanglement',
    text: `Josh is gone.

Christian has his notebook. You watched him take it. Neither of you mentions this.

At breakfast, Christian sits apart from you. Not far. Ten feet. Enough. Maja sits beside him. She brings him tea.

You watch her hands as she sets the cup down. Her fingertips brush his wrist. He doesn't pull away.

The tea smells different from what you've been drinking. Sweeter.

An elder woman sits beside you. She says nothing. She places a warm hand between your shoulder blades.

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

"It's just tea." He sighs — the long, patient sigh of a man who believes his patience is his best quality. "I think the jet lag is getting to you. Or the altitude. You haven't been sleeping."

"Three of our friends are missing, Christian."

"They're not missing. Simon and Connie left. Mark is — I don't know, he's Mark." He picks up the cup and drinks from it, deliberately, looking at you the whole time. Not defiance. Demonstration. "See? Tea."

Something crosses his face. Not cruelty — that would require intention. Something lazier. It is not cruelty. It is avoidance.

"Maybe I should just go check on Josh," he says, and stands. He walks away without answering.

Maja watches from across the table. She does not look triumphant. She looks patient.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    sounds: {
      onChoicesReveal: 'timer_urgent',
    },
    typingSpeed: 'slow',
    pauseAfterMs: 1500,
    memoryBloom: {
      lines: [
        `You know how this argument goes before he opens his mouth.`,
        `The tea. The sigh. The dismissal. He does the same thing every time.`,
      ],
    },
    pressure: {
      timerMs: 7000,
      timerStyle: 'heartbeat',
      defaultChoice: 'steal_the_cup',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 45, mask: 40 },
    visualEffects: [
      { type: 'vignette', intensity: 0.2 },
    ],
    choices: [
      {
        id: 'follow_josh_thread',
        text: 'Keep pushing. Ask where Josh went.',
        effects: {
          relationships: { christian: -10 },
          perception: { autonomy: 10, grief: 6 },
          flags: { pressed_christian_day4: true },
        },
        next: 'day4_confront_josh',
      },
      {
        id: 'steal_the_cup',
        text: 'Take the cup he left behind.',
        effects: {
          perception: { autonomy: 7, grief: 4 },
          flags: { took_christian_cup: true },
        },
        next: 'day4_confront_cup',
      },
      {
        id: 'meet_maja_eyes',
        text: "Ignore him. Watch Maja watch you.",
        chorusText: 'See who is patient.',
        effects: {
          perception: { belonging: 4, autonomy: -2, grief: 5 },
          relationships: { harga: 4, christian: -6 },
          chorus: 1,
          flags: { met_maja_gaze: true },
        },
        next: 'day4_midday',
      },
    ],
  },

  {
    id: 'day4_confront_josh',
    day: 4,
    chapter: 'entanglement',
    text: `"Where is Josh?"

Christian stops with one hand on the bench. The question lands harder than the accusation about the tea. For a second his face clears, and in that clear space you see fear.

"He was talking to the elders all night," Christian says. "You know how he gets. Obsessed."

"He wouldn't just disappear."

"People leave, Dani."

"Not Josh."

That irritates him more than grief ever has. Being contradicted. Being asked to admit that the world might be doing something ugly while he is still benefiting from it.

"You always do this," he says. "You take one weird thing and build a whole catastrophe out of it."

One weird thing. A cliff ritual. Missing friends. Drugged food. A sealed temple. He says it like a minor inconvenience.

Across the yard, Josh's boots are lined up outside the sleeping house. Clean. Side by side. Waiting.

Christian sees you looking. He looks too. Then he looks away first.`,
    background: 'sleeping_quarters_day',
    ambientSound: 'wind_low',
    sounds: {
      onEnter: 'ghost_echo',
    },
    visualEffects: [
      { type: 'vignette', intensity: 0.32 },
    ],
    next: 'day4_midday',
  },

  {
    id: 'day4_confront_cup',
    day: 4,
    chapter: 'entanglement',
    text: `You take the cup before anyone can stop you.

The tea has gone lukewarm. On the surface floats a yellow film, almost invisible until the light catches it. Flower pollen. Something powdered. Something pink dissolving in threads.

You lift it to your nose. Honey, herbs, and beneath that a sweet rot.

An old woman appears at your elbow. You did not see her walk over.

"It is opened for him," she says.

"Opened to what?"

She taps the rim of the cup with one blunt fingernail. "To listening."

"Did you drug him?"

The woman's smile is patient, almost pitying. "We help him accept what is offered."

You set the cup down too hard. A little spills over your hand. The liquid is sticky. By evening your palm still smells sweet and rotten.

When you look up, Maja is gone. But the place where she sat is scattered with crushed petals, arranged so carelessly they can only have been deliberate.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    sounds: {
      onEnter: 'commune_whisper',
    },
    visualEffects: [
      { type: 'color_shift', intensity: 0.18 },
    ],
    next: 'day4_midday',
  },

  {
    id: 'day4_held',
    day: 4,
    chapter: 'entanglement',
    text: `The woman's hand stays on your back.

She does not speak at first.

Other women sit down around you. After a while your breathing starts to match theirs.

"You have carried this alone too long," the elder says. "Here, grief is shared."

You cry. They cry with you.

For the first time since the funeral, no one asks you to stop.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'cried_first_night', value: true },
        text: `The woman's hand is warm. You remember it from the first night.

This time you do not resist.

The grief comes back in pieces. Your sister. Your parents. The apartment. Christian.

"We are your family now," the elder says. "If you want that."

You want it more than you should.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'chorus_hum',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.7 },
      { type: 'flowers_breathe', intensity: 0.6 },
      { type: 'border_bloom', intensity: 0.4 },
    ],
    choices: [
      {
        id: 'follow_the_humming',
        text: 'Stay with the women. Follow the humming.',
        chorusText: 'Lean into the circle.',
        effects: {
          perception: { belonging: 10, autonomy: -6, grief: -10 },
          relationships: { harga: 8 },
          chorus: 1,
          flags: { followed_humming_day4: true },
        },
        next: 'day4_held_humming',
      },
      {
        id: 'ask_what_they_know',
        text: 'Ask them what happened to Josh.',
        effects: {
          perception: { autonomy: 7, grief: 4 },
          relationships: { harga: -2 },
          flags: { asked_about_josh_day4: true },
        },
        next: 'day4_held_oracle',
      },
    ],
  },

  {
    id: 'day4_held_humming',
    day: 4,
    chapter: 'entanglement',
    text: `They lead you away from the table.

Behind the sleeping house they form a half-circle and begin to hum. The elder places both hands on your ribs.

"Breathe where it hurts," she says.

You do. More women join in.

For a moment the sound is bigger than your own body.

Then the elder kisses your forehead and steps back.

"Tonight," she says, "do not be afraid of what is shown."`,
    background: 'harga_meadow',
    ambientSound: 'chorus_hum',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.82 },
      { type: 'flowers_breathe', intensity: 0.52 },
    ],
    next: 'day4_midday',
  },

  {
    id: 'day4_held_oracle',
    day: 4,
    chapter: 'entanglement',
    text: `"Josh," you say. "Where is he?"

The elder waits before answering.

"Some things are shown," she says. "Some are taken."

"That is not an answer."

"It is the one you are getting."

She turns your face toward the temple.

"The people who force their way in are changed by it," she says.

A younger woman presses something into your palm.

It is part of Josh's pencil.

When you look up, she has already stepped back.`,
    background: 'harga_meadow',
    ambientSound: 'wind_low',
    sounds: {
      onEnter: 'ghost_echo',
    },
    visualEffects: [
      { type: 'vignette', intensity: 0.34 },
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

It's not your story. It is close enough to make you step back.`,
    background: 'harga_perimeter',
    ambientSound: 'wind_low',
    sounds: {
      onEnter: 'commune_whisper',
    },
    visualEffects: [
      { type: 'vignette', intensity: 0.3 },
    ],
    choices: [
      {
        id: 'trace_the_girl',
        text: 'Trace the girl through every panel.',
        effects: {
          perception: { autonomy: 6, grief: 8 },
          flags: { studied_tapestry_story: true },
        },
        next: 'day4_tapestry_girl',
      },
      {
        id: 'study_the_barn_panel',
        text: 'Study the barn panel until it gives something up.',
        effects: {
          perception: { autonomy: 8, grief: 4 },
          flags: { studied_barn_panel: true },
        },
        next: 'day4_tapestry_barn',
      },
    ],
  },

  {
    id: 'day4_tapestry_girl',
    day: 4,
    chapter: 'entanglement',
    text: `You follow the girl through the panels.

She changes slowly. First she is alone. Then she is led forward. Then she is gone. Then she returns crowned.

At the bottom of the tapestry, one word repeats beneath her.

Held.

The word repeats beneath every panel: Held.

It reads less like a story than a pattern being repeated.`,
    background: 'harga_perimeter',
    ambientSound: 'dream_drone',
    visualEffects: [
      { type: 'color_shift', intensity: 0.24 },
      { type: 'vignette', intensity: 0.26 },
    ],
    next: 'day4_midday',
  },

  {
    id: 'day4_tapestry_barn',
    day: 4,
    chapter: 'entanglement',
    text: `You look only at panel 4.

The woven man is faceless at first glance, just a body rendered in dark thread. But the longer you study him, the more details emerge. A bend in one knee. One hand slightly raised, not in surrender but confusion. The women around him are singing; the thread of their open mouths loops outward in repeated crescents.

Near the man's feet, the artist has stitched tiny cups into the weave.

Once you see them, you see them everywhere.

Someone behind you says, "It helps if you don't think of it as seduction."

You turn. Ulf stands in the doorway holding a bundle of cut greenery. His expression is unreadable, but his voice carries the mild irritation of a man correcting a child.

"Then what is it?" you ask.

He considers. "Placement."

He leaves before you can ask another question. A few leaves shake loose from the bundle and land on the floor.`,
    background: 'harga_perimeter',
    ambientSound: 'wind_low',
    sounds: {
      onEnter: 'commune_whisper',
    },
    visualEffects: [
      { type: 'text_waver', intensity: 0.16 },
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

Inside, the walls are painted floor to ceiling with the lifecycle of the Hårga. Birth, growth, harvest, death, rebirth. It circles the room.

At the center, a stone altar holds a book bound in leather. The Rubi Radr. Josh died trying to photograph it. You're being invited to see it.

Siv opens it. The pages are filled with symbols you can't read. But the illustrations are clear: a woman, crowned in flowers, standing before a burning temple. The nine sacrifices. The renewal.

"You understand more than you know, Dani," Siv says.

The worst part is that she's right.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    sounds: {
      onChoicesReveal: 'timer_urgent',
    },
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.4 },
    ],
    typingSpeed: 'slow',
    pauseAfterMs: 2000,
    pressure: {
      timerMs: 9000,
      timerStyle: 'heartbeat',
      defaultChoice: 'look_closer_radr',
      timerShrinkWithPulse: true,
    },
    choices: [
      {
        id: 'look_closer_radr',
        text: 'Look closer at the book Josh died for.',
        effects: {
          perception: { autonomy: 8, grief: 6 },
          flags: { inspected_rubi_radr_day4: true },
        },
        next: 'day4_midday_radr',
      },
      {
        id: 'ask_about_the_nine',
        text: 'Ask who the nine sacrifices are.',
        effects: {
          perception: { autonomy: 6, grief: 8 },
          relationships: { harga: -2 },
          flags: { asked_about_nine_day4: true },
        },
        next: 'day4_midday_nine',
      },
      {
        id: 'accept_siv_trust',
        text: 'Say nothing. Let Siv believe you understand.',
        chorusText: 'Be worthy of trust.',
        effects: {
          perception: { belonging: 8, autonomy: -5, grief: -4 },
          relationships: { harga: 8 },
          chorus: 1,
          flags: { accepted_siv_trust: true },
        },
        next: 'day4_night',
      },
    ],
  },

  {
    id: 'day4_midday_radr',
    day: 4,
    chapter: 'entanglement',
    text: `You step closer to the Rubi Radr.

The cover is old. The corners are worn from handling.

Siv turns a page. The drawings repeat the same sequence. Crown. Cup. Bed. Barn. Temple. Fire.

There is a dark smear in one margin. Blood, maybe. Pigment, maybe.

"The oracle dreams," Siv says. "Others interpret."

Josh died trying to photograph this.

When Siv closes the book, the sound is heavier than it should be.

"Tonight brings clarity," she says.`,
    background: 'yellow_temple_interior',
    ambientSound: 'ritual_chant',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.48 },
      { type: 'vignette', intensity: 0.18 },
    ],
    next: 'day4_night',
  },

  {
    id: 'day4_midday_nine',
    day: 4,
    chapter: 'entanglement',
    text: `"Nine," you say. "Who are they?"

Siv's expression does not change, but the air does. The women at the doorway stop breathing loudly enough for you to hear the stop.

"Four from the Harga," Siv says. "Four from outside. One selected by the Queen so that balance is not mistaken for chance."

"Selected from who?"

"From what remains."

"And if the Queen refuses?"

Siv smiles then, almost tenderly. "A true Queen does not refuse clarity."

She smooths a strand of hair behind your ear.

"You have been grieving alone," she says. "We do not do that here."

Outside the temple, children are laughing.`,
    background: 'yellow_temple_interior',
    ambientSound: 'ritual_chant',
    sounds: {
      onEnter: 'ghost_echo',
    },
    visualEffects: [
      { type: 'text_waver', intensity: 0.14 },
    ],
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

This is ritual. Christian is part of it, whether he understands that or not.

You stand in the doorway. The woman who brought you touches your shoulder.

"Now you see," she says. "Now you're free."`,
    background: 'sleeping_quarters_night',
    ambientSound: 'panic_breathe',
    sounds: {
      onEnter: 'commune_whisper',
      onChoicesReveal: 'timer_urgent',
    },
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    pressure: {
      timerMs: 8000,
      timerStyle: 'heartbeat',
      defaultChoice: 'break_cry_day4',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 78, exposure: 68, mask: 84, dissociation: 18 },
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.5 },
      { type: 'vignette', intensity: 0.55 },
      { type: 'text_waver', intensity: 0.32 },
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

The sound comes out of you before you are ready for it.

The women come immediately. They surround the bed and cry with you.

When it stops, you are lying in a circle of bodies.

"He is not enough for you," the elder says. "He was never enough."

She's right. He was never enough. But he was all you had.

"You have us now," she says.`,
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
    text: `You hold yourself together. Jaw locked. Eyes dry. Hands flat on the mattress.

The women watch. They do not approach.

Christian's breathing slows through the wall. Satisfied. Then silence.

You stare at the ceiling and count the painted panels. There are seventy-two.

You do not sleep. You do not cry.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'silence_heavy',
    sounds: {
      onEnter: 'ghost_echo',
    },
    visualEffects: [
      { type: 'vignette', intensity: 0.6 },
      { type: 'text_waver', intensity: 0.2 },
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
