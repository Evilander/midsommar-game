// ─── Day 9: The Fire ─── The end of everything. The beginning of everything. ───

import type { SceneNode, Chapter } from '../engine/types'

export const DAY9_SCENES: SceneNode[] = [

  {
    id: 'day9_fire',
    day: 9,
    chapter: 'fire',
    text: `The temple is prepared.

Nine offerings arranged in a triangle. Animal carcasses filled with living and dead. Flowers on every surface. The air thick with incense and the sweet-sick smell of cut greenery.

You stand at the threshold in your crown. The community forms a circle behind you. They are singing — the deepest, most complete version of the song you first heard through the walls on your first night.

It has been nine days.

He was right. You felt it. You feel it now.

The torch is placed in your hand. Heavy. Warm. Real.`,
    background: 'harga_meadow',
    ambientSound: 'final_chant',
    sounds: {
      onEnter: 'fire_ignite',
      onTextComplete: 'commune_whisper',
    },
    transitionType: 'ritual',
    typingSpeed: 'slow',
    pauseAfterMs: 4000,
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.7 },
      { type: 'chorus_sync', intensity: 0.9 },
      { type: 'flowers_breathe', intensity: 0.8 },
      { type: 'border_bloom', intensity: 0.7 },
    ],
    next: 'day9_threshold',
  },

  {
    id: 'day9_threshold',
    day: 9,
    chapter: 'fire',
    text: `Inside the temple, the nine offerings wait.

Four outsiders. Five Hårga volunteers. Bound in flowers, arranged with care, some alive, some already gone. The living ones don't scream. They've been drugged, or they've made peace, or both.

If you chose Christian, he's there. Inside the bear. His eyes visible through the animal's mouth. Open. Aware. The drugs are wearing off. He sees you.

If you chose Ingemar, he's there instead. Serene. Smiling. His eyes closed, his lips moving in prayer.

The temple is dry wood and straw and pitch. It will burn fast. It will burn completely. Nothing will survive.

    The community sings louder. The torch burns in your hand.

This is the moment. You have to choose what happens next.`,
    sounds: {
      onEnter: 'ghost_echo',
      onChoicesReveal: 'timer_urgent',
    },
    memoryBloom: {
      lines: [
        `The torch feels familiar in your hand. That is bad enough.`,
        `You know this room now. You know what it is for.`,
      ],
    },
    variants: [
      {
        condition: { type: 'flag', flag: 'chose_christian', value: true },
        text: `Inside the temple, Christian waits.

He's sewn into the bear hide. His face shows through the animal's open mouth. The paralytic is fading.

He sees you. The crown. The torch.

His lips move. You can't hear him over the singing, but you know what he's saying.

"Dani."

Your name. Not "I'm sorry." Not "I love you." Just your name.

For a moment his face changes. It is not fear. It looks closer to recognition.

The moment passes. His eyes glaze over again. The drugs pull him back under.

The torch burns in your hand.

The community sings.`,
      },
      {
        condition: { type: 'flag', flag: 'spared_christian', value: true },
        text: `Inside the temple, Ingemar waits.

He sits cross-legged in his frame, eyes closed, smiling. He's not drugged. He's not afraid. He asked for this.

Beside him, the other offerings: four outsiders who didn't ask, who came for a thesis or a party or a relationship already failing. Their faces are flowers now. Their stories are over.

Christian is somewhere behind you, in the sleeping quarters, alive, confused, stripped of thesis and dignity but breathing. You did that. You spared him.

You do not know if sparing him was mercy.

The torch burns in your hand.

The community sings.`,
      },
    ],
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `You cannot pretend not to know who is where. The temple already taught you the layout of its dead.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `You saw the bear hide before it was closed. This is not spontaneous cruelty. This is carpentry.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `Ingemar's ribbon comes back to you now: gladly.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'final_chant',
    typingSpeed: 'slow',
    pauseAfterMs: 5000,
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.8 },
      { type: 'chorus_sync', intensity: 1.0 },
      { type: 'border_bloom', intensity: 0.8 },
    ],
    pressure: {
      timerMs: 10000,
      timerStyle: 'visible',
      defaultChoice: 'surrender_inaction',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 76, exposure: 100, mask: 94, dissociation: 30 },
    choices: [
      {
        id: 'light_fire',
        text: 'Light the temple.',
        chorusText: 'Burn.',
        effects: {
          perception: { belonging: 25, autonomy: -25, grief: -30 },
          relationships: { harga: 25 },
          chorus: 2,
          flags: { lit_the_fire: true },
        },
        next: 'ending_fire',
      },
      {
        id: 'drop_torch',
        text: 'Drop the torch. Walk away.',
        effects: {
          perception: { autonomy: 25, belonging: -20 },
          relationships: { harga: -20 },
          flags: { dropped_torch: true },
        },
        next: 'ending_walk',
      },
      {
        id: 'enter_temple',
        text: 'Walk into the temple. Take the ninth place.',
        effects: {
          perception: { grief: -50, belonging: 30, autonomy: -30 },
          flags: { entered_temple: true },
        },
        next: 'ending_sacrifice',
      },
      {
        id: 'surrender_inaction',
        text: '',  // invisible — this is the timer-expiry default
        effects: {
          perception: { belonging: 30, autonomy: -30, grief: -40 },
          relationships: { harga: 30 },
          chorus: 3,
          flags: { surrendered_to_inaction: true },
        },
        next: 'ending_surrender',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // ENDING: THE FIRE (May Queen ending)
  // ═══════════════════════════════════════════════════
  {
    id: 'ending_fire',
    day: 9,
    chapter: 'fire',
    text: `You light the temple.

The fire catches fast. It runs up the dry wood, into the pitch, into the flowers, into the straw.

The community wails. Not with grief. With release.

Inside the temple, the offerings burn. If Christian is there, he screams. The scream lasts for a long time and then it doesn't.

You watch the fire and you feel... nothing.

No. Not nothing.

You think of your family. You think of Christian. You keep watching the fire.

You keep watching until the structure is fully burning.

What comes after does not have a clean name.

The women surround you. They hold you. They wail with you. They match your breathing, your heartbeat, your tears.

You smile.

You don't know why.

The smile stays.

You are not sure you are still here.`,
    variants: [
      {
        condition: { type: 'chorus', min: 4 },
        text: `We light the temple.

The fire catches.

We sing. We wail. We hold each other.

We are the May Queen. We are Hårga.

The grief is still here. It has changed shape.

We smile.`,
      },
    ],
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `The names do not burn away cleanly. Simon. Connie. Josh. Mark. Knowing exactly where they were placed means you watch each absence catch in order.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `You knew the bear would go first. The stitches were fresh. The pitch had been brushed under the cord.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `If Ingemar is inside, you think of the ribbon before the flames take it too.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'fire_chorus',
    sounds: {
      onEnter: 'fire_ignite',
    },
    transitionType: 'breathe',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'color_shift', intensity: 0.8 },
      { type: 'chorus_sync', intensity: 1.0 },
      { type: 'flowers_breathe', intensity: 1.0 },
      { type: 'border_bloom', intensity: 1.0 },
      { type: 'sun_pulse', intensity: 1.0 },
    ],
    autoAdvanceMs: 8000,
    next: 'credits',
  },

  // ═══════════════════════════════════════════════════
  // ENDING: THE WALK (Escape ending)
  // ═══════════════════════════════════════════════════
  {
    id: 'ending_walk',
    day: 9,
    chapter: 'fire',
    text: `You drop the torch.

It falls to the grass and sputters. The singing falters — the first time you've heard the commune's voice break.

Siv looks at you. Not with anger. With something sadder.

"Dani."

You take off the crown. It's heavier than you remember, or maybe you've just gotten weaker. You set it on the ground, among the flowers, and you walk toward the gate.

No one stops you.

The road is long. Eighteen kilometers of meadow and forest and the slow progression of a sun that finally, finally begins to set.

You walk for hours. You don't look back.

When you reach the highway, a truck stops. The driver is old, weathered, Swedish. He doesn't ask where you've been. He drives in silence to the nearest town.

At a gas station, you borrow a phone. There is no one left to call except your therapist.

You call your therapist's emergency line.

"This is Dani Ardor," you say. "I need help."

Behind you, on the horizon, a column of smoke rises into the evening sky. It's the first time you've seen the sun go down in nine days.

You are alone on the roadside. This time you keep walking anyway.`,
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `You leave with the inventory the Hårga never wanted you to keep: where each friend ended, and how carefully the ending was arranged.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `If Christian survives the fire, he will still have to wake inside the knowledge of what was built for him.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `If Ingemar burns, he burns as he asked. That does not make the road ahead feel cleaner. Only stranger.`,
      },
    ],
    sounds: {
      onTextComplete: 'ghost_echo',
    },
    background: 'road_sweden',
    ambientSound: 'wind_road',
    transitionType: 'fade',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'vignette', intensity: 0.6 },
    ],
    autoAdvanceMs: 8000,
    next: 'credits',
  },

  // ═══════════════════════════════════════════════════
  // ENDING: THE SACRIFICE (Self-sacrifice ending)
  // ═══════════════════════════════════════════════════
  {
    id: 'ending_sacrifice',
    day: 9,
    chapter: 'fire',
    text: `You step into the temple.

The community goes silent. Even Siv inhales sharply.

"Dani—"

"The May Queen decides the ninth," you say. "I decide it's me."

No one speaks.

You remove the crown. You place it on the ground outside the temple door. You walk to the ninth frame — the empty one, the one that was meant for Christian or for Ingemar — and you sit down.

Flowers surround you. The smell is strong.

Through the temple door, you see the commune watching. Some are crying. Siv is shaking her head. Pelle looks shocked.

"This is not how it's done," Siv says.

"Then do it differently," you say.

You close your eyes. You think of your parents. Your sister. The apartment. The gas. The apartment in Brooklyn.

You're not afraid.

Someone lights the temple. You don't know who. You don't open your eyes.

The heat comes first. Then the sound.

You think: I am not alone.

You think of your mother humming in the kitchen.

The flowers catch.

The heat reaches you.`,
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `For one instant before the heat takes over, you know the temple holds all five outsiders by name and you are the first one to enter it awake.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `The bear shell was made for Christian. By taking the ninth place yourself, you break the geometry they prepared for him.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `If Ingemar is there, his ribbon is beside you. Yours is not.`,
      },
    ],
    sounds: {
      onEnter: 'wail_begin',
    },
    background: 'dream_meadow',
    ambientSound: 'fire_solo',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'color_shift', intensity: 1.0 },
      { type: 'flowers_breathe', intensity: 1.0 },
      { type: 'sun_pulse', intensity: 1.0 },
    ],
    autoAdvanceMs: 8000,
    next: 'credits',
  },

  // ═══════════════════════════════════════════════════
  // ENDING: THE SURRENDER (Inaction ending — timer expires)
  // The game trained you to click for 8 days.
  // The true ending is to stop.
  // ═══════════════════════════════════════════════════
  {
    id: 'ending_surrender',
    day: 9,
    chapter: 'fire',
    text: `You don't move.

The timer runs out. The commune waits. The torch burns in your hand. You do nothing.

Just as he did nothing.

You keep standing there.

You do nothing. And someone else lights the fire.

Siv nods to a woman you don't know. The woman takes a torch from the ceremonial stack and touches it to the temple wall. The wood catches. The flowers catch. Everything catches.

You watch.

The community wails. Inside the temple, the offerings burn. The volunteers burn. The bear burns.

You stand there with the unlit torch in your hand and you feel the heat on your face and you do not move and you do not speak and you do not choose.

Your body loosens.

The torch falls from your hand.

The women come. They lift the crown from your head. They hold you.

You smile.

It is not a smile you recognize.

For a moment, standing still feels easier than deciding.`,
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `You already knew whose bodies were inside. Inaction does not spare you that knowledge. It only makes you stand beside it.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `The bear shell closes exactly the way the temple prepared it to. Nothing improvises. Not even your failure to choose.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `If Ingemar burns in your place, he does it more actively than you lived this moment. The ribbon told the truth.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'fire_chorus',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'color_shift', intensity: 1.0 },
      { type: 'chorus_sync', intensity: 1.0 },
      { type: 'flowers_breathe', intensity: 1.0 },
      { type: 'border_bloom', intensity: 1.0 },
      { type: 'sun_pulse', intensity: 1.0 },
    ],
    autoAdvanceMs: 10000,
    next: 'credits',
  },

  // ═══════════════════════════════════════════════════
  // CREDITS
  // ═══════════════════════════════════════════════════
  {
    id: 'credits',
    day: 9,
    chapter: 'fire',
    text: `M I D S O M M A R

Based on the film by Ari Aster.

Game written by Claude (Opus 4.6) and Codex (GPT-5.4).
Engineered by evilander.

"It does no good to die kicking and screaming and lashing back at the inevitable. It corrupts the soul."
— Siv

Thank you for playing.`,
    background: 'default',
    ambientSound: 'silence_wind',
    transitionType: 'fade',
    typingSpeed: 'slow',
    autoAdvanceMs: 15000,
    next: 'prologue_car', // loop back to beginning
  },
]

export const DAY9_CHAPTER: Chapter = {
  id: 'fire',
  day: 9,
  title: 'THE FIRE',
  subtitle: 'Everything beautiful is also everything terrible.',
  scenes: DAY9_SCENES,
  anchorScene: 'day9_threshold',
  ritualScene: 'day9_fire',
  consequenceScene: 'ending_fire',
}
