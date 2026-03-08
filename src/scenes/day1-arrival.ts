// ─── Day 1: Arrival ─── The commune must feel like relief before it feels like prison ───

import type { SceneNode, Chapter } from '../engine/types'

export const DAY1_SCENES: SceneNode[] = [

  // ═══════════════════════════════════════════════════
  // PROLOGUE: THE CAR
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_car',
    day: 1,
    chapter: 'arrival',
    text: `The car windows are open.

Warm air pushes the smell of grass through the back seat. Christian is asleep beside you, slack-mouthed, beautiful, unreachable. Pelle drives with one hand on the wheel. No one has spoken for several minutes.

The sunlight sits over everything like it has decided not to leave.

Your phone is dark. There will be no new messages. There is no one left to send them.

In the ditch, a line of blue flowers bends as the car passes. A second later, they bend back.`,
    background: 'road_sweden',
    ambientSound: 'car_wind_loop',
    transitionType: 'fade',
    typingSpeed: 'slow',
    pauseAfterMs: 2000,
    choices: [
      {
        id: 'wake_christian',
        text: 'Wake Christian.',
        chorusText: 'Let him sleep.',
        effects: {
          relationships: { christian: -5 },
          perception: { grief: 5 },
        },
        next: 'prologue_christian_wakes',
      },
      {
        id: 'ask_pelle',
        text: 'Ask Pelle where you are.',
        chorusText: 'Trust that Pelle knows the way.',
        effects: {
          relationships: { pelle: 5 },
          perception: { belonging: 3 },
        },
        next: 'prologue_pelle_answers',
      },
      {
        id: 'watch_flowers',
        text: 'Keep watching the flowers.',
        chorusText: 'Watch the flowers.',
        effects: {
          perception: { grief: 3, belonging: 2 },
        },
        next: 'prologue_flowers',
      },
    ],
  },

  // ─── Branch: Wake Christian ───
  {
    id: 'prologue_christian_wakes',
    day: 1,
    chapter: 'arrival',
    text: `Christian startles, already irritated.

"What?"

Before you answer, he looks past you, out the windshield. "Oh. Wow."

He doesn't look back at you. His face opens for the landscape in a way it hasn't opened for you in months.`,
    variants: [
      {
        condition: { type: 'grief', min: 80 },
        text: `Christian startles, already irritated.

"What?"

Before you answer, he looks past you, out the windshield. "Oh. Wow."

He doesn't look back at you. His face opens for the landscape in a way it hasn't opened for you since before. Since before your sister. Since before the gas.

You wonder if this is what grief does — makes you invisible to the people who should see you most.`,
      },
    ],
    background: 'road_sweden',
    ambientSound: 'car_wind_loop',
    next: 'arrival_gate',
  },

  // ─── Branch: Pelle answers ───
  {
    id: 'prologue_pelle_answers',
    day: 1,
    chapter: 'arrival',
    text: `Pelle smiles without turning.

"Almost there," he says. "You can feel this place before you see it."

He pauses, then adds quietly: "I'm glad you came, Dani. It means something that you're here."

His voice is so gentle it makes your throat ache. When was the last time someone said your name like it mattered?`,
    variants: [
      {
        condition: { type: 'grief', min: 80 },
        text: `Pelle smiles without turning.

"Almost there," he says. "You can feel this place before you see it."

He pauses, then adds quietly: "I'm glad you came, Dani. I lost my parents too. Not in the same way. But I know what it is to have the ground taken away."

His voice is so gentle it makes your throat ache. The gentleness is worse than cruelty. Cruelty you could push back against.`,
      },
    ],
    background: 'road_sweden',
    ambientSound: 'car_wind_loop',
    next: 'arrival_gate',
  },

  // ─── Branch: Watch flowers ───
  {
    id: 'prologue_flowers',
    day: 1,
    chapter: 'arrival',
    text: `One flower opens in the center like an eye. When you blink, it is only a flower again.

But for a moment — just a moment — you felt it looking at you. Not with menace. With recognition.

Like it knew you were coming. Like the whole meadow had been waiting, patient and bright, for exactly this car, exactly this girl, exactly this grief.`,
    background: 'road_sweden',
    ambientSound: 'car_wind_loop',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.3 },
    ],
    next: 'arrival_gate',
  },

  // ═══════════════════════════════════════════════════
  // ARRIVAL: THE GATE
  // ═══════════════════════════════════════════════════
  {
    id: 'arrival_gate',
    day: 1,
    chapter: 'arrival',
    text: `The trees break.

White buildings. Painted runes. Long tables in impossible daylight. People waiting in stillness, as if they have been told the exact minute of your arrival.

No one waves. They simply look happy that you have come.`,
    background: 'harga_gate',
    ambientSound: 'meadow_birds',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    choices: [
      {
        id: 'reach_for_christian',
        text: "Reach for Christian's hand.",
        chorusText: 'Step forward.',
        effects: {
          relationships: { christian: -3 },
          perception: { grief: 5, autonomy: -2 },
        },
        next: 'arrival_christian_hand',
      },
      {
        id: 'exit_car_first',
        text: 'Get out of the car first.',
        chorusText: 'Step into the light.',
        effects: {
          perception: { autonomy: 5, belonging: 3 },
        },
        next: 'arrival_exit_first',
      },
      {
        id: 'stay_seated',
        text: 'Stay seated and ask why everyone is staring.',
        chorusText: 'They are not staring. They are welcoming.',
        effects: {
          perception: { autonomy: 3 },
          relationships: { pelle: -2 },
        },
        next: 'arrival_stay_seated',
      },
    ],
  },

  // ─── Branch: Christian's hand ───
  {
    id: 'arrival_christian_hand',
    day: 1,
    chapter: 'arrival',
    text: `He squeezes once, distracted, and lets go too soon.

His attention is already on the buildings, the painted wood, the thesis forming behind his eyes. You can see it happen — the moment you stop being a person he's with and become a person he's near.

Mark climbs out stretching, already grinning. "Dude, this is like a cult compound in the best way."

Josh elbows him. "Show some respect."

"What? I said best way."`,
    background: 'harga_gate',
    ambientSound: 'meadow_birds',
    next: 'arrival_welcome',
  },

  // ─── Branch: Exit first ───
  {
    id: 'arrival_exit_first',
    day: 1,
    chapter: 'arrival',
    text: `Heat rises from the dirt. Flowers brush your bare ankle like fingertips.

The air smells of cut grass and something sweeter — elderflower, maybe, or honey left open in the sun.

For the first time in weeks, your chest doesn't feel like it's being pressed flat. The space here is so wide that your grief has room to stand beside you instead of inside you.

Mark climbs out behind you. "Holy shit. Is it always this bright?"

"Always," Pelle says. "The sun barely sets. You'll see."`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.2 },
    ],
    next: 'arrival_welcome',
  },

  // ─── Branch: Stay seated ───
  {
    id: 'arrival_stay_seated',
    day: 1,
    chapter: 'arrival',
    text: `Pelle turns to you gently.

"They're welcoming you," he says.

The sentence lands in you like comfort. Like warning.

"They knew we were coming?"

"They know everything that matters here," Pelle says, and the warmth in his voice doesn't make that less strange. It makes it more.`,
    background: 'harga_gate',
    ambientSound: 'meadow_birds',
    next: 'arrival_welcome',
  },

  // ═══════════════════════════════════════════════════
  // THE WELCOME — THE CHORUS BEGINS
  // ═══════════════════════════════════════════════════
  {
    id: 'arrival_welcome',
    day: 1,
    chapter: 'arrival',
    text: `An older woman approaches carrying a wreath of fresh-cut flowers.

She does not ask your name. She says it softly, as if remembering:

"Dani."

Behind her, the women inhale together.

For one impossible second, your ribs obey them.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds_chorus',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.4 },
    ],
    choices: [
      {
        id: 'breathe_with',
        text: 'Breathe with them.',
        chorusText: 'Breathe.',
        effects: {
          perception: { belonging: 10, autonomy: -8, grief: -5 },
          relationships: { harga: 10 },
          chorus: 1,
          flags: { breathed_with_harga: true },
        },
        next: 'arrival_breathe',
      },
      {
        id: 'look_to_christian',
        text: 'Look to Christian.',
        chorusText: 'Look for someone who sees you.',
        effects: {
          relationships: { christian: -5 },
          perception: { grief: 8, autonomy: 3 },
        },
        next: 'arrival_look_christian',
      },
      {
        id: 'step_back',
        text: 'Step back.',
        chorusText: 'Feel the distance.',
        effects: {
          perception: { autonomy: 8, belonging: -5 },
          relationships: { harga: -8 },
        },
        next: 'arrival_step_back',
      },
    ],
  },

  // ─── Branch: Breathe with them ───
  {
    id: 'arrival_breathe',
    day: 1,
    chapter: 'arrival',
    text: `The panic loosens. Not gone. Shared.

The women's breath enters you through some channel that isn't air. You feel your heartbeat slow to match the rhythm of the circle forming around you. The elder places the wreath gently on your head.

"You carry so much," she whispers. "Here, we carry together."

That feels terrible. That feels good.

You can't tell anymore which of those is worse.`,
    variants: [
      {
        condition: { type: 'grief', min: 80 },
        text: `The panic loosens. Not gone. Shared.

For the first time since the funeral — since before the funeral, since the phone call, since the police at the door — the grief doesn't feel like it's eating you from the inside.

It feels held.

The elder places the wreath on your head and whispers: "You carry so much. Here, we carry together."

Tears come before you can stop them. The women don't look away. They lean in. Their eyes don't fill with pity. They fill with understanding so complete it feels like being swallowed.

That feels terrible. That feels good.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'chorus_hum',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.5 },
      { type: 'chorus_sync', intensity: 0.6 },
      { type: 'border_bloom', intensity: 0.3 },
    ],
    next: 'arrival_feast_intro',
  },

  // ─── Branch: Look to Christian ───
  {
    id: 'arrival_look_christian',
    day: 1,
    chapter: 'arrival',
    text: `Christian is already smiling at something Pelle has said. He does not see your face.

He's talking about the architecture. The painted wood. The runic calendar. His voice has that eager quality it gets when he's found something that might be a thesis, which is the same voice he used to use when he found something that might make you laugh.

The elder waits patiently. She doesn't follow your gaze to Christian. She watches you like she already knows what you'll find when you look there.

Nothing. You'll find nothing.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds',
    next: 'arrival_feast_intro',
  },

  // ─── Branch: Step back ───
  {
    id: 'arrival_step_back',
    day: 1,
    chapter: 'arrival',
    text: `The women do not stop smiling. You feel the distance immediately, like stepping from shade into full noon.

The wreath lowers in the elder's hands but doesn't withdraw. She holds it the way you'd hold a door open for someone you know will come back.

"There is no hurry," she says. "The sun is long here."

Behind her, the women exhale together, and you feel the absence of being included in that breath like a physical chill in the warmth.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds',
    next: 'arrival_feast_intro',
  },

  // ═══════════════════════════════════════════════════
  // THE FEAST — FIRST EXPLORATION
  // ═══════════════════════════════════════════════════
  {
    id: 'arrival_feast_intro',
    day: 1,
    chapter: 'arrival',
    text: `Above the gate hangs a painted sun with a human face.

Its mouth is open in either song or pain.

You pass beneath it into the commune proper. Tables have been laid end to end in the meadow, heavy with bread, fish, berries, cheese. Flowers are woven into everything — the tablecloths, the chair backs, the children's hair.

Mark is already eating. Josh is photographing the rune paintings on the communal hall. Christian is deep in conversation with an elder about seasonal cycles.

Pelle touches your arm.

"Come. Let me show you where you'll sleep. You must be tired."`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    choices: [
      {
        id: 'go_with_pelle',
        text: 'Go with Pelle.',
        chorusText: 'Follow.',
        effects: {
          relationships: { pelle: 8 },
          perception: { belonging: 5, sleep: 10, autonomy: -3 },
        },
        next: 'arrival_pelle_walk',
      },
      {
        id: 'stay_feast',
        text: 'Stay at the feast. Sit with Christian.',
        chorusText: 'Sit with the others.',
        effects: {
          relationships: { christian: 3 },
          perception: { autonomy: 5 },
        },
        next: 'arrival_feast_sit',
      },
      {
        id: 'explore_alone',
        text: 'Ask for a moment alone. Walk the grounds.',
        effects: {
          perception: { autonomy: 8, belonging: -3 },
          flags: { explored_grounds_early: true },
        },
        next: 'arrival_explore',
      },
    ],
  },

  // ─── Pelle walk ───
  {
    id: 'arrival_pelle_walk',
    day: 1,
    chapter: 'arrival',
    text: `Pelle walks you past the communal hall, past a workshop where someone is carving wood, past a garden where herbs grow in spirals.

"My parents died when I was young," he says, not looking at you. "The Hårga raised me. They became my family."

He stops at a small white building with wildflowers climbing the walls.

"This is yours. The bed is soft. The walls are thin, so you'll hear the singing at night. Don't be alarmed. It's just... how we process the day."

He looks at you then, really looks, the way Christian used to.

"You don't have to carry everything alone here, Dani. That's not how we do things."`,
    background: 'harga_sleeping_quarters',
    ambientSound: 'evening_birds',
    typingSpeed: 'slow',
    next: 'arrival_mushroom_offer',
  },

  // ─── Feast sit ───
  {
    id: 'arrival_feast_sit',
    day: 1,
    chapter: 'arrival',
    text: `You sit beside Christian. He glances at you, surprised, then slides a plate of berries toward you without comment.

The berries are the sweetest thing you've ever tasted. Bright, almost electric. A Hårga woman across the table watches you eat and smiles.

"Good?"

"Really good."

"Everything here is grown in common," she says. "Nothing is kept alone."

Christian leans over. "Babe, did you hear what Odd was saying about the life-cycle paintings? There's a whole cosmology in the—"

He catches your expression and stops.

"Sorry. Are you okay?"

"I'm fine."

You're not fine. But the berries are extraordinary.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    next: 'arrival_mushroom_offer',
  },

  // ─── Explore alone ───
  {
    id: 'arrival_explore',
    day: 1,
    chapter: 'arrival',
    text: `You walk the perimeter of the commune alone.

It's beautiful. Impossibly, relentlessly beautiful. Every surface is painted or carved or woven. The buildings are old but perfect, maintained with a care that feels like devotion.

Behind the sleeping quarters, you find a building with no windows. The door is painted with a symbol you don't recognize — a tree with faces in its roots.

You try the handle. Locked.

A child appears behind you, maybe eight years old, blond, watching with that same patient smile.

"That's the temple," she says. "You'll see inside later."

"When?"

She tilts her head, as if the question doesn't quite make sense.

"When it's time."`,
    background: 'harga_perimeter',
    ambientSound: 'wind_distant',
    visualEffects: [
      { type: 'vignette', intensity: 0.2 },
    ],
    next: 'arrival_mushroom_offer',
  },

  // ═══════════════════════════════════════════════════
  // THE MUSHROOM TRIP — based on Ari Aster's screenplay
  // ═══════════════════════════════════════════════════
  {
    id: 'arrival_mushroom_offer',
    day: 1,
    chapter: 'arrival',
    text: `After the feast, Pelle produces a small cloth bag.

"We have a tradition," he says, holding up a dried mushroom cap. "For the first night. To open the doors of perception. To see clearly."

Mark grabs one immediately. "Finally." Josh takes one with academic curiosity. Christian looks at you — the question on his face isn't "should we?" but "are you going to make this difficult?"

Pelle holds one out to you. It's small, brown, unremarkable. The other Hårga are taking them too, breaking them into tea, chewing them raw.

"You don't have to," Pelle says. "But it's better if you can see clearly on the first night. The commune is more honest when everyone's doors are open."`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    choices: [
      {
        id: 'take_mushroom',
        text: 'Take it.',
        chorusText: 'Open.',
        effects: {
          perception: { intoxication: 40, autonomy: -10, belonging: 5 },
          flags: { took_mushrooms: true },
          chorus: 1,
        },
        next: 'arrival_trip_onset',
      },
      {
        id: 'refuse_mushroom',
        text: '"I\'m on medication. I can\'t."',
        effects: {
          perception: { autonomy: 10 },
          relationships: { harga: -5 },
          flags: { refused_mushrooms: true },
        },
        next: 'arrival_trip_sober',
      },
    ],
  },

  {
    id: 'arrival_trip_onset',
    day: 1,
    chapter: 'arrival',
    text: `It tastes like dirt and something sweeter underneath. Like flowers that grew in soil too rich.

For twenty minutes, nothing happens.

Then the grass starts breathing.

Not metaphorically. The blades rise and fall in waves, synchronized, like the meadow itself is a living chest. The trees at the perimeter pulse — expanding and contracting as if pumped by a massive heart you can't see.

Your hands. You look at your hands. The skin is moving. Cells dividing, dying, regenerating — you can see it. The cycle of life happening on the surface of your own body.

"Beautiful, isn't it?" Pelle says from somewhere beside you. His face is kaleidoscopic. "The medicine helps you see what's always there."

You look at the sky. The sun has a face. It's looking at you.`,
    background: 'harga_meadow',
    ambientSound: 'trip_ambient',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    stressModifiers: { dissociation: 60, pulse: 55 },
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.9 },
      { type: 'color_shift', intensity: 0.7 },
      { type: 'sun_pulse', intensity: 0.8 },
      { type: 'text_waver', intensity: 0.6 },
      { type: 'border_bloom', intensity: 0.5 },
    ],
    pauseAfterMs: 3000,
    choices: [
      {
        id: 'embrace_trip',
        text: 'Let it take you.',
        chorusText: 'See.',
        effects: {
          perception: { intoxication: 20, belonging: 10, autonomy: -15 },
          chorus: 1,
        },
        next: 'arrival_trip_deep',
      },
      {
        id: 'panic_trip',
        text: 'The grass is breathing. The grass is breathing.',
        effects: {
          perception: { grief: 15, intoxication: 10, autonomy: 5 },
          flags: { panicked_on_mushrooms: true },
        },
        next: 'arrival_trip_panic',
      },
    ],
  },

  {
    id: 'arrival_trip_deep',
    day: 1,
    chapter: 'arrival',
    text: `You let it take you.

The world peels open like a flower. Layer after layer of reality folding back to reveal something underneath that is brighter, more organized, more true.

The commune's singing starts — or maybe it was always happening and you couldn't hear it. The voices weave through the air like visible threads. You can see the sound. You can see the harmony. It has a shape, and the shape is a circle, and you are inside it.

A woman takes your hand. Her skin against yours is electric. You can feel her heartbeat through her palm, and your heart adjusts to match it. Two hearts beating in unison. Then three. Then the whole commune, a single vast pulse.

You look across the meadow and see your mother.

No — not your mother. A woman who looks like your mother from a distance, tending flowers, humming.

The flowers she tends are growing from a mound that might be a grave or might be a garden.

"Everything that dies becomes something else here," Pelle whispers.

You nod. Under the mushrooms, that doesn't sound insane. It sounds like physics.`,
    background: 'dream_meadow',
    ambientSound: 'trip_choral',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    stressModifiers: { dissociation: 75 },
    visualEffects: [
      { type: 'flowers_breathe', intensity: 1.0 },
      { type: 'chorus_sync', intensity: 0.9 },
      { type: 'color_shift', intensity: 0.9 },
      { type: 'sun_pulse', intensity: 0.7 },
      { type: 'border_bloom', intensity: 0.7 },
    ],
    autoAdvanceMs: 6000,
    next: 'arrival_first_night',
  },

  {
    id: 'arrival_trip_panic',
    day: 1,
    chapter: 'arrival',
    text: `The panic hits like a door slamming.

One second you're watching the grass breathe and it's interesting. The next second the grass is breathing and that means the ground is alive and you're standing on something alive that could swallow you.

Your hands are wrong. The skin is too thin. You can see through it to the blood underneath. Your sister's face flashes — not a memory, a hallucination, projected onto the bark of the nearest tree. She's blue. Her lips are moving.

"I can see you."

"No," you hear yourself say. "No no no—"

Christian appears. "Dani? Dani, you're okay. You're having a bad—"

"I can see my sister. She's in the tree. Christian, she's in the tree."

He puts his hand on your arm. His touch feels like insects. You pull away so hard you fall backward into the grass, which wraps around your shoulders like fingers.

The Hårga women come. They don't speak. They form a circle around you and they breathe — deep, synchronized, the rhythm of the commune settling over your panic like a weighted blanket.

Slowly — five minutes? thirty? — the breathing holds you together until your own heart finds the beat.

The grass is just grass again.

But the fear lives in your body now, and it will live there for the rest of your time in Hårga. Every time the flowers bend, every time the trees sway, you'll remember the moment the world opened up and showed you the thing underneath.`,
    background: 'harga_meadow',
    ambientSound: 'panic_breathe',
    transitionType: 'cut',
    typingSpeed: 'normal',
    stressModifiers: { pulse: 90, dissociation: 70, mask: 60 },
    visualEffects: [
      { type: 'text_waver', intensity: 0.9 },
      { type: 'vignette', intensity: 0.8 },
      { type: 'color_shift', intensity: 0.6 },
      { type: 'flowers_breathe', intensity: 0.7 },
    ],
    pressure: {
      timerMs: 5000,
      timerStyle: 'heartbeat',
      defaultChoice: 'let_them_breathe',
      timerShrinkWithPulse: true,
    },
    choices: [
      {
        id: 'let_them_breathe',
        text: 'Let the women hold you.',
        chorusText: 'Breathe.',
        effects: {
          perception: { belonging: 15, autonomy: -10, grief: -5 },
          relationships: { harga: 10 },
          chorus: 1,
          flags: { held_during_panic: true },
        },
        next: 'arrival_first_night',
      },
      {
        id: 'fight_panic',
        text: 'Push them away. Find Christian.',
        effects: {
          perception: { autonomy: 10, grief: 10 },
          relationships: { christian: -5, harga: -8 },
        },
        next: 'arrival_first_night',
      },
    ],
  },

  {
    id: 'arrival_trip_sober',
    day: 1,
    chapter: 'arrival',
    text: `Pelle nods without judgment. "Of course."

But the others take them. Mark eats two. Josh takes one and begins scribbling notes about "entheogenic traditions in Nordic folk religion." Christian takes one and doesn't look at you while he does it.

Within an hour, the world tilts.

You're sober in a sea of people who aren't. Mark is lying in the grass, laughing at nothing. Josh is touching a tree trunk with both hands, muttering about "the living wood." Christian is sitting cross-legged with a Hårga woman, their foreheads nearly touching, breathing in unison.

You stand at the edge of it all, watching. Sober. Alone. The only person in this commune whose doors are closed.

A child tugs your sleeve.

"Why aren't you dancing?" she asks.

"I'm not—"

"Everyone else is dancing." She looks at you with an intensity too heavy for her age. "Even the trees."

You look at the trees. They're still. Of course they're still.

But for a second — just a second — you could swear the branches reached toward you.`,
    background: 'harga_meadow',
    ambientSound: 'trip_ambient_distant',
    typingSpeed: 'normal',
    visualEffects: [
      { type: 'vignette', intensity: 0.3 },
    ],
    next: 'arrival_first_night',
  },

  // ═══════════════════════════════════════════════════
  // FIRST NIGHT — THE SINGING
  // ═══════════════════════════════════════════════════
  {
    id: 'arrival_first_night',
    day: 1,
    chapter: 'arrival',
    text: `Night doesn't come. The sun sits at the horizon like a held breath, painting everything in gold that refuses to dim.

You lie in the narrow bed. Through the thin walls, you hear singing — a low, wordless harmony that rises and falls with the rhythm of breathing.

It should be unsettling. Voices in the half-dark, keening together.

But it sounds like the sound your mother used to make when she'd hum in the kitchen. Before.

Your chest aches. Your eyes sting.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    visualEffects: [
      { type: 'color_shift', intensity: 0.3 },
      { type: 'chorus_sync', intensity: 0.3 },
    ],
    choices: [
      {
        id: 'cry_quietly',
        text: 'Let yourself cry.',
        chorusText: 'Release.',
        effects: {
          perception: { grief: -8, belonging: 8, autonomy: -5 },
          chorus: 1,
          flags: { cried_first_night: true },
        },
        next: 'arrival_cry',
      },
      {
        id: 'go_to_christian',
        text: 'Go find Christian.',
        effects: {
          relationships: { christian: -5 },
          perception: { grief: 5, autonomy: 5 },
        },
        next: 'arrival_find_christian',
      },
      {
        id: 'listen_singing',
        text: 'Listen until it ends.',
        chorusText: 'Listen.',
        effects: {
          perception: { belonging: 5 },
          relationships: { harga: 5 },
        },
        next: 'arrival_listen',
      },
    ],
  },

  // ─── Cry ───
  {
    id: 'arrival_cry',
    day: 1,
    chapter: 'arrival',
    text: `You cry.

Not the way you cried at the funeral — controlled, jaw clenched, apologizing. Not the way you cried alone in the apartment, suffocating into a pillow so Christian wouldn't hear.

You cry open-mouthed, ugly, real.

And through the wall, as if they hear you — they must hear you, the walls are paper — the singing shifts. It doesn't stop. It doesn't get louder. It reshapes itself around the sound of your grief, finding harmonies that hold it without trying to fix it.

For the first time in months, you don't feel crazy for how much it hurts.

You feel met.

Eventually, you sleep. When you wake, there are fresh flowers on your pillow. You don't remember anyone entering.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing_soft',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.6 },
      { type: 'chorus_sync', intensity: 0.7 },
      { type: 'border_bloom', intensity: 0.4 },
    ],
    transitionType: 'breathe',
    next: 'day1_end',
  },

  // ─── Find Christian ───
  {
    id: 'arrival_find_christian',
    day: 1,
    chapter: 'arrival',
    text: `You cross the compound in the golden half-light. Christian's building is three doors down. The singing follows you across the grass.

He's awake. Sitting on his bed. On his phone, even though there's no signal.

"Can I stay here tonight?"

He looks at you the way you look at a notification you don't want to open.

"Yeah. Sure. Of course."

He makes room. You lie beside him. He faces the wall. After a few minutes, his breathing evens out.

The singing continues outside. Without him, through the wall, it almost sounds like voices calling your name.

You don't sleep for a long time.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing_distant',
    next: 'day1_end',
  },

  // ─── Listen ───
  {
    id: 'arrival_listen',
    day: 1,
    chapter: 'arrival',
    text: `You listen.

The singing goes on for an hour. Maybe two. Time moves differently here — not faster, not slower, but sideways, like a river finding a new channel.

The harmonies are simple but layered. Each voice is distinct, but they move together with a precision that feels less like practice and more like instinct. Like breathing. Like a heartbeat shared between fifty people.

When it finally fades, the silence it leaves behind is the most peaceful thing you've felt since before everything.

You sleep with the window open. The midnight sun paints your ceiling gold.

Tomorrow, Pelle says, the real celebrations begin.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'silence_wind',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.15 },
    ],
    next: 'day1_end',
  },

  // ═══════════════════════════════════════════════════
  // DAY 1 END — CHAPTER TRANSITION
  // ═══════════════════════════════════════════════════
  {
    id: 'day1_end',
    day: 1,
    chapter: 'arrival',
    text: `You dream of your sister's apartment. The door is closed. Gas hisses behind it. But this time, instead of opening it, you walk outside into a meadow where women in white are dancing in a circle.

They see you and make room.

You step in.`,
    background: 'dream_meadow',
    ambientSound: 'dream_drone',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.8 },
      { type: 'color_shift', intensity: 0.5 },
    ],
    autoAdvanceMs: 5000,
    next: 'day2_morning',
  },
]

export const DAY1_CHAPTER: Chapter = {
  id: 'arrival',
  day: 1,
  title: 'ARRIVAL',
  subtitle: 'The sun is long here.',
  scenes: DAY1_SCENES,
  anchorScene: 'arrival_welcome',
  ritualScene: 'arrival_first_night',
  consequenceScene: 'arrival_breathe',
}
