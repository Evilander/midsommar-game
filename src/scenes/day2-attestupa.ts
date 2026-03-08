// ─── Day 2: The Ättestupa ─── The first irreversible turn ───

import type { SceneNode, Chapter } from '../engine/types'

export const DAY2_SCENES: SceneNode[] = [

  // ═══════════════════════════════════════════════════
  // MORNING: PREPARATION
  // ═══════════════════════════════════════════════════
  {
    id: 'day2_morning',
    day: 2,
    chapter: 'attestupa',
    text: `You wake to the sound of singing.

Not the half-sleep harmony from the night. This is full-throated, purposeful, rising from every building at once. Through the window, you see people moving in white — setting tables, carrying flowers, preparing.

Your head aches. Whether from the journey, the grief, or the way this place seems to vibrate at a frequency your body can't quite tune to.

Christian's bed is already empty.`,
    background: 'harga_meadow',
    ambientSound: 'morning_chant',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 2000,
    choices: [
      {
        id: 'find_christian_morning',
        text: 'Find Christian.',
        chorusText: 'Find the others.',
        effects: {
          relationships: { christian: -3 },
          perception: { grief: 3 },
        },
        next: 'day2_christian_morning',
      },
      {
        id: 'join_preparation',
        text: 'Join the preparations.',
        chorusText: 'Help prepare.',
        effects: {
          perception: { belonging: 5, autonomy: -3 },
          relationships: { harga: 5 },
        },
        next: 'day2_join_prep',
      },
      {
        id: 'watch_from_bed',
        text: 'Lie still. Watch through the window.',
        effects: {
          perception: { autonomy: 3 },
        },
        next: 'day2_watch',
      },
    ],
  },

  // ─── Find Christian ───
  {
    id: 'day2_christian_morning',
    day: 2,
    chapter: 'attestupa',
    text: `You find Christian outside with Josh. They're both writing in notebooks — or rather, Josh is writing, and Christian is pretending not to read over his shoulder.

"Hey," Christian says, looking up. Not at you. Past you. "Sleep okay?"

"Not really."

"Yeah, it's the light thing. You get used to it." He's already looking back at Josh's notebook.

Josh closes it. "Morning, Dani."

The two of them share a look you're not invited into. It's about the ceremony today. The one Pelle mentioned. The one Josh smiled about.`,
    background: 'harga_meadow',
    ambientSound: 'morning_chant',
    next: 'day2_pelle_warning',
  },

  // ─── Join preparation ───
  {
    id: 'day2_join_prep',
    day: 2,
    chapter: 'attestupa',
    text: `The women welcome you without surprise, as if a place had already been set aside.

They hand you flowers to weave into a garland. Your fingers are clumsy at first, but a young woman — maybe nineteen, with sun-blonde hair and a smile like a closed door — gently repositions your hands.

"Like this," she says. "You let the stem find its own path."

The work is repetitive, meditative. For fifteen minutes, you don't think about anything at all. When you look up, you realize you've been humming along with the others without knowing when you started.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'breathed_with_harga', value: true },
        text: `The women welcome you without surprise, as if a place had already been set aside.

They hand you flowers to weave into a garland. Your fingers remember the rhythm from yesterday — the breathing, the shared pulse. It takes you less time to fall into step.

A young woman, sun-blonde and serene, works beside you. "You have gentle hands," she says. Not flattery. Observation.

For fifteen minutes, you don't think about anything at all. When you look up, you realize the garland you've woven is beautiful. The woman holds it up to the light.

"For the elders," she says. "They wear our work to the other side."

You don't ask what she means. Part of you already knows.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'morning_chant',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.3 },
    ],
    next: 'day2_pelle_warning',
  },

  // ─── Watch from bed ───
  {
    id: 'day2_watch',
    day: 2,
    chapter: 'attestupa',
    text: `You lie still and watch.

Through the thin curtains, the commune moves with purpose. Men carrying wood. Women weaving flowers. Children running between them, grave-faced, not playing but participating.

Everyone knows what today is. Everyone has a role.

Everyone except you.

The thought arrives without invitation: you are always the one watching from the bed while the world prepares for something you weren't told about.

Your phone is on the nightstand. Dead. You pick it up anyway and press the power button. Nothing. The screen reflects your face back at you — tired, lost, 6,000 miles from the apartment where your sister's things are still in boxes.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'morning_distant',
    next: 'day2_pelle_warning',
  },

  // ═══════════════════════════════════════════════════
  // PELLE'S WARNING
  // ═══════════════════════════════════════════════════
  {
    id: 'day2_pelle_warning',
    day: 2,
    chapter: 'attestupa',
    text: `Pelle finds you before the ceremony.

"I need to prepare you," he says. His voice is different. Careful. "What you're about to see — it is the most sacred thing we do. It's called the Ättestupa."

He pauses, choosing his words.

"We believe life has seasons. Spring, summer, fall, winter. When someone reaches seventy-two — the end of winter — they... give their life back. Voluntarily. As a gift."

He watches your face.

"It's a cliff. They jump. It's considered a great honor."

The silence after that sentence is very loud.`,
    background: 'harga_meadow',
    ambientSound: 'wind_low',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    choices: [
      {
        id: 'refuse_watch',
        text: '"I don\'t want to see that."',
        effects: {
          perception: { autonomy: 10, belonging: -8 },
          relationships: { pelle: -5, harga: -5 },
          flags: { refused_attestupa: true },
        },
        next: 'day2_refuse_watch',
      },
      {
        id: 'agree_attend',
        text: '"I need to try."',
        effects: {
          perception: { autonomy: -5, belonging: 5 },
          relationships: { pelle: 5 },
        },
        next: 'day2_procession',
      },
      {
        id: 'ask_why',
        text: '"Why would anyone choose that?"',
        chorusText: '"Tell me more."',
        effects: {
          perception: { belonging: 3 },
          relationships: { pelle: 3 },
        },
        next: 'day2_pelle_explains',
      },
    ],
  },

  // ─── Pelle explains ───
  {
    id: 'day2_pelle_explains',
    day: 2,
    chapter: 'attestupa',
    text: `Pelle's face softens. Not with pity — with something older.

"My parents died when I was young," he says. "Not like this. Not by choice. They were taken from me in a fire. I had no say. No ritual. No meaning. Just loss."

He looks at his hands.

"What the Hårga offer is different. It's not death as punishment or accident. It's death as completion. The elders know the day. They prepare. They're celebrated. They leave with dignity, surrounded by everyone who loves them."

He looks at you then, and you realize he's not talking about the elders anymore.

"Wouldn't you rather your family had that? A choice? Instead of what happened?"

The question is a knife. It's also, somehow, the gentlest thing anyone has said to you about it.`,
    variants: [
      {
        condition: { type: 'grief', min: 70 },
        text: `Pelle's face softens. Not with pity — with something older.

"My parents died when I was young," he says. "Not like this. Not by choice. They were taken from me in a fire. I had no say. No ritual. No meaning. Just loss."

He pauses. His eyes are wet but steady.

"What the Hårga offer is different. When someone reaches seventy-two, they don't wither in a hospital bed. They don't lose their mind in a facility while their children stop visiting. They're honored. Celebrated. They choose their moment."

He looks at you, and his voice drops.

"Your sister didn't choose her moment, Dani. She chose everyone else's. That's not the same thing."

The truth of it hits you so hard you can't breathe. Because he's right. Terri didn't just die. She took your parents with her. And she left you behind to carry all of it.

"Here," Pelle says softly, "no one is left behind."`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'wind_low',
    typingSpeed: 'slow',
    next: 'day2_procession',
  },

  // ─── Refuse to watch ───
  {
    id: 'day2_refuse_watch',
    day: 2,
    chapter: 'attestupa',
    text: `Pelle nods. No judgment — or none you can see.

"Of course. I'll come find you after."

You go back to the sleeping quarters. Through the walls, you hear the procession leave — singing, footsteps, the sound of a small horn.

Then silence.

You sit on your bed. The walls are painted with scenes you haven't looked at closely before. One shows a figure at the top of a cliff, arms raised, surrounded by weeping faces that are also smiling.

You wait. It takes forty minutes. When the group returns, you hear Connie sobbing. Simon shouting. Christian's voice, low and strained.

Josh's voice: "That was incredible."

No one comes to find you for a long time.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'distant_procession',
    next: 'day2_aftermath',
  },

  // ═══════════════════════════════════════════════════
  // THE PROCESSION
  // ═══════════════════════════════════════════════════
  {
    id: 'day2_procession',
    day: 2,
    chapter: 'attestupa',
    text: `The community walks together up the hill. The two elders are carried on wooden thrones, draped in flowers your hands may have woven.

They are serene. The elder on the left catches your eye and smiles — the kind of smile that holds a whole life in it.

At the top of the cliff, they are set down gently. The horizon stretches out forever. The sun refuses to set.

Siv opens a leather-bound book and begins to sing. The words are in a language older than Swedish. The community sways together.

You stand between Christian and Pelle. Christian grips your arm. His palm is sweating.`,
    background: 'cliff_ceremony',
    ambientSound: 'ritual_chant',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.4 },
      { type: 'chorus_sync', intensity: 0.5 },
    ],
    pauseAfterMs: 3000,
    next: 'day2_the_jump',
  },

  // ═══════════════════════════════════════════════════
  // THE JUMP — POINT OF NO RETURN
  // ═══════════════════════════════════════════════════
  {
    id: 'day2_the_jump',
    day: 2,
    chapter: 'attestupa',
    text: `The first elder steps to the edge. He speaks a single sentence in Swedish, loud enough for everyone to hear. His voice doesn't waver.

He opens his arms.

He falls.

The sound arrives a second after the sight. A sound you will never describe to anyone.

Connie screams. Simon grabs her. Your vision narrows to a point.

The second elder steps forward. He too speaks. He too falls.

But this one doesn't die on impact. He lands on the rocks below, broken, alive, screaming. The sound he makes isn't human anymore.

Three men approach with a wooden mallet.

They silence him.`,
    background: 'cliff_ceremony',
    ambientSound: 'silence_heavy',
    transitionType: 'cut',
    typingSpeed: 'slow',
    pauseAfterMs: 4000,
    visualEffects: [
      { type: 'vignette', intensity: 0.7 },
    ],
    pressure: {
      timerMs: 6000,
      timerStyle: 'heartbeat',
      defaultChoice: 'go_silent',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 85, exposure: 95, dissociation: 20 },
    choices: [
      {
        id: 'scream',
        text: 'Scream.',
        effects: {
          perception: { grief: 15, autonomy: 8, belonging: -10 },
          relationships: { harga: -10 },
          flags: { screamed_attestupa: true },
        },
        next: 'day2_aftermath_scream',
      },
      {
        id: 'go_silent',
        text: 'Go completely still.',
        chorusText: 'Be still.',
        effects: {
          perception: { grief: 10, autonomy: -5 },
          flags: { dissociated_attestupa: true },
        },
        next: 'day2_aftermath_still',
      },
      {
        id: 'grip_christian',
        text: 'Grip Christian. Don\'t let go.',
        effects: {
          relationships: { christian: -8 },
          perception: { grief: 12 },
        },
        next: 'day2_aftermath_christian',
      },
      {
        id: 'watch_community',
        text: 'Watch the community\'s faces.',
        chorusText: 'Watch. Understand.',
        effects: {
          perception: { belonging: 5, autonomy: -3 },
          relationships: { harga: 5 },
          flags: { watched_faces_attestupa: true },
        },
        next: 'day2_aftermath_watch',
      },
    ],
  },

  // ─── Aftermath: Scream ───
  {
    id: 'day2_aftermath_scream',
    day: 2,
    chapter: 'attestupa',
    text: `You scream and you can't stop.

The sound tears out of you — not grief, not horror, but something deeper. Something that has been living in your chest since the night the police called.

Christian flinches away from you. Josh stares. Pelle watches with an expression you can't read.

But the Hårga don't stare. They don't flinch. They turn to you and they begin to cry with you.

Not mimicry. Not performance. They open their mouths and wail — matching your pitch, your rhythm, your anguish. The sound multiplies until the cliff face rings with it.

When you finally stop, gasping, the community stops with you. As if your grief was theirs. As if it always had been.

Siv approaches and places her hand on your cheek.

"We feel what you feel here," she says. "That is our way."`,
    background: 'cliff_ceremony',
    ambientSound: 'communal_wail',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.8 },
      { type: 'border_bloom', intensity: 0.5 },
    ],
    next: 'day2_aftermath',
  },

  // ─── Aftermath: Go still ───
  {
    id: 'day2_aftermath_still',
    day: 2,
    chapter: 'attestupa',
    text: `You leave your body.

Not metaphorically. You watch yourself from somewhere slightly above and to the left, a trick your mind learned the night of the phone call. The self that stands on the cliff is a photograph. The self that watches is smoke.

Simon is shouting. Connie is hyperventilating. Christian looks at you and says something you can't hear because you are not in your ears right now.

The Hårga weep. Not at the death — for the death. There's a difference that you understand but cannot explain.

Time passes. You come back into yourself the way a diver surfaces — gradually, then all at once. Pelle is holding a cup of water to your lips.

"Drink," he says. "You're safe."

You don't feel safe. But you drink.`,
    background: 'cliff_ceremony',
    ambientSound: 'wind_hollow',
    visualEffects: [
      { type: 'vignette', intensity: 0.6 },
      { type: 'text_waver', intensity: 0.4 },
    ],
    next: 'day2_aftermath',
  },

  // ─── Aftermath: Christian ───
  {
    id: 'day2_aftermath_christian',
    day: 2,
    chapter: 'attestupa',
    text: `You grip Christian's arm with both hands. He tenses. You hold tighter.

"Dani—" His voice is strained. He's not scared. He's embarrassed.

You can feel it — the way he calculates the scene around him. Josh watching. The Hårga watching. His girlfriend clutching him like a child in front of everyone.

He doesn't remove your hands. But he doesn't turn toward you either.

After a long moment, he pats your arm twice. Like you're a dog. Like you're a problem he's managing.

"Hey," he says. "It's okay. It's over."

It's not over. But you let go. Because the alternative is holding on to someone who is already gone.`,
    background: 'cliff_ceremony',
    ambientSound: 'wind_hollow',
    next: 'day2_aftermath',
  },

  // ─── Aftermath: Watch faces ───
  {
    id: 'day2_aftermath_watch',
    day: 2,
    chapter: 'attestupa',
    text: `You watch the community's faces.

They don't look horrified. They look reverent. Some cry — openly, beautifully, without shame. Others close their eyes and sway, their lips moving in silent prayer.

No one looks away. No one reaches for a phone. No one says "oh my God" in the hollow way Americans say it when they mean "I don't know what to feel so I'll say words."

They feel. Together. Completely.

Siv's voice rises in a chant that the community joins, voice by voice, until the air itself vibrates with the sound of fifty people processing death the way it was meant to be processed: communally, ritually, with the sun as witness.

You think: my family died in a closed apartment with the windows taped shut. No one sang. No one held anyone. The paramedics wore gloves.

The Hårga sing with their whole bodies.

It's horrifying. It's the most honest thing you've ever seen.`,
    background: 'cliff_ceremony',
    ambientSound: 'communal_chant',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.6 },
      { type: 'sun_pulse', intensity: 0.3 },
    ],
    next: 'day2_aftermath',
  },

  // ═══════════════════════════════════════════════════
  // AFTERMATH — THE CHOICE TO STAY
  // ═══════════════════════════════════════════════════
  {
    id: 'day2_aftermath',
    day: 2,
    chapter: 'attestupa',
    text: `Back at the commune, Simon and Connie are packing their bags.

"We're leaving," Simon says. His face is white. "This is insane. These people are insane."

Connie nods, wiping her eyes. "We've called a taxi. There must be a road out."

Christian and Josh sit at a table, speaking rapidly to each other. They're not scared — they're animated. You hear fragments: "anthropological significance," "lifecycle philosophy," "thesis material."

Pelle sits across from you. He says nothing. He just waits.

You look at the gate. The sun hangs over it, golden, endless. The painted face on the archway is still singing, or still screaming.

Simon catches your eye. "Come with us, Dani. You don't have to stay."`,
    background: 'harga_gate',
    ambientSound: 'tense_ambient',
    typingSpeed: 'normal',
    pauseAfterMs: 3000,
    pressure: {
      timerMs: 12000,
      timerStyle: 'visible',
      defaultChoice: 'stay_uncertain',
      timerShrinkWithPulse: false,
    },
    stressModifiers: { pulse: 50, exposure: 70 },
    choices: [
      {
        id: 'leave_with_simon',
        text: '"I want to leave."',
        effects: {
          perception: { autonomy: 15, belonging: -15 },
          relationships: { harga: -15, pelle: -10, christian: 5 },
          flags: { tried_to_leave_day2: true },
        },
        next: 'day2_try_leave',
      },
      {
        id: 'stay_uncertain',
        text: '"I\'m going to stay. I think."',
        chorusText: '"I\'m staying."',
        effects: {
          perception: { belonging: 8, autonomy: -8 },
          relationships: { harga: 8, pelle: 8 },
        },
        next: 'day2_stay',
      },
      {
        id: 'ask_christian',
        text: 'Look at Christian. Wait for him to decide.',
        effects: {
          perception: { autonomy: -10 },
          relationships: { christian: -5 },
        },
        next: 'day2_christian_decides',
      },
    ],
  },

  // ─── Try to leave ───
  {
    id: 'day2_try_leave',
    day: 2,
    chapter: 'attestupa',
    text: `"Okay," Simon says, relieved. "Good. The taxi should be here in an hour."

But an hour passes. Then two.

The taxi doesn't come.

Simon tries his phone again. No signal. Connie tries hers. Nothing.

"I'll drive," Simon says. But when you get to the car, the engine won't start. The battery is dead. Or removed.

"This is fine," Simon says, though nothing about the way he says it is fine. "We'll walk to the road. Flag someone down."

"It's eighteen kilometers," Ingemar says, appearing behind you with a smile so warm it makes your skin crawl. "In this heat? Let me find you a ride. Please. Sit. Have something cold to drink."

You sit. You have something cold to drink.

Simon and Connie never come back from the ride Ingemar arranges for them.

Nobody mentions them again.`,
    background: 'harga_gate',
    ambientSound: 'tense_ambient',
    visualEffects: [
      { type: 'vignette', intensity: 0.4 },
    ],
    next: 'day2_night',
  },

  // ─── Stay ───
  {
    id: 'day2_stay',
    day: 2,
    chapter: 'attestupa',
    text: `Simon stares at you. "After what you just saw?"

"I know," you say. "But I... I understand what they're trying to do."

You don't understand. Not really. But the word comes out anyway, and something about it feels true.

Pelle touches your shoulder. "I knew you would," he says, quietly enough that only you can hear.

Simon shakes his head. He and Connie leave for their taxi.

Christian appears beside you after they're gone. "You're staying?"

"Yeah."

"Good," he says. And for a single, rare moment, he looks at you — really looks at you — and you remember why you fell in love with him in the first place.

Then he turns to Josh. "Want to check out those rune paintings in the temple?"

The moment is over.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds',
    next: 'day2_night',
  },

  // ─── Christian decides ───
  {
    id: 'day2_christian_decides',
    day: 2,
    chapter: 'attestupa',
    text: `You look at Christian. He's already decided.

"We should stay," he says, not meeting your eyes. "This is important for the research."

"Research," you repeat.

"Our research. Josh and I have been talking, and—"

"Your research."

He has the grace to look uncomfortable. "Dani, if you want to go, I'll—"

But you both know he won't. You both know that if you leave, you leave alone. And the thought of being alone again — in the apartment with the boxes, with the silence, with the dead phone that will never ring with your mother's voice — is worse than anything you saw on that cliff.

"Fine," you say. "We'll stay."

You don't say it with conviction. You say it with exhaustion. Which the Hårga can smell, and which they will gently, patiently, lovingly feed on.`,
    background: 'harga_gate',
    ambientSound: 'meadow_birds',
    next: 'day2_night',
  },

  // ═══════════════════════════════════════════════════
  // DAY 2 NIGHT — AFTER THE ÄTTESTUPA
  // ═══════════════════════════════════════════════════
  {
    id: 'day2_night',
    day: 2,
    chapter: 'attestupa',
    text: `That night, the singing is different.

Deeper. More voices. A chord that presses on your sternum like a warm hand.

You lie in bed and think about the elder's face at the top of the cliff. He wasn't afraid. He looked relieved. Like he'd been waiting his whole life to fall.

You think about your parents in their bed. The gas filling the room. Your sister in the next room with the tape and the tubes.

Were they afraid?

Of course they were. They didn't choose it. It was done to them.

The elder chose.

Outside, the singing swells. Through the wall, you hear someone crying — another outsider, maybe, or maybe one of the Hårga, grieving for the elders with the same full-throated honesty they brought to the cliff.

The crying and the singing become the same sound.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_deep_chant',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.5 },
      { type: 'color_shift', intensity: 0.3 },
    ],
    autoAdvanceMs: 6000,
    next: 'day2_end',
  },

  {
    id: 'day2_end',
    day: 2,
    chapter: 'attestupa',
    text: `You dream of the cliff again. But this time, you're the one standing at the edge.

Below, the commune watches. They're not afraid for you. They're smiling.

Behind you, Christian calls your name. But the wind takes it.

The women begin to sing.

You don't jump. You don't step back.

You stand there, between the two choices, as the sun circles the horizon without setting.`,
    background: 'dream_meadow',
    ambientSound: 'dream_drone',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.7 },
      { type: 'sun_pulse', intensity: 0.5 },
      { type: 'color_shift', intensity: 0.4 },
    ],
    autoAdvanceMs: 5000,
    next: 'day3_morning',
  },
]

export const DAY2_CHAPTER: Chapter = {
  id: 'attestupa',
  day: 2,
  title: 'ÄTTESTUPA',
  subtitle: 'It does no good to die kicking and screaming.',
  scenes: DAY2_SCENES,
  anchorScene: 'day2_the_jump',
  ritualScene: 'day2_procession',
  consequenceScene: 'day2_try_leave',
}
