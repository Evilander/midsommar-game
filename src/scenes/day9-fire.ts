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

It's been nine days. Nine days since the car. Since the flowers bent in the ditch. Since Pelle said "you can feel this place before you see it."

He was right. You felt it. You feel it now.

The torch is placed in your hand. Heavy. Warm. Real.`,
    background: 'harga_meadow',
    ambientSound: 'final_chant',
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

This is the moment. Not a choice between good and evil. A choice between two kinds of ending.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'chose_christian', value: true },
        text: `Inside the temple, Christian waits.

He's sewn into the bear hide. His face peers out through the animal's open mouth, a man wearing death like a costume. The paralytic is fading — you can see awareness returning to his eyes, filtering through the chemicals like sunlight through dirty water.

He sees you. The crown. The torch.

His lips move. You can't hear him over the singing, but you know what he's saying. The same word he's been saying for three years, in different keys, with different weights, always meaning the same insufficient thing:

"Dani."

Your name. Just your name. Not "I'm sorry." Not "I love you." Not "I should have been better." Just your name, spoken by a man who used your name more than he ever used his love.

The torch burns in your hand.

The community sings.`,
      },
      {
        condition: { type: 'flag', flag: 'spared_christian', value: true },
        text: `Inside the temple, Ingemar waits.

He sits cross-legged in his frame, eyes closed, mouth curved in a smile that belongs to another century. He's not drugged. He's not afraid. He asked for this.

Beside him, the other offerings: four outsiders who didn't ask, who came for a thesis or a party or a relationship already failing. Their faces are flowers now. Their stories are over.

Christian is somewhere behind you, in the sleeping quarters, alive, confused, stripped of thesis and dignity but breathing. You did that. You spared him.

Whether that's mercy or cruelty depends on what he does with the breathing.

The torch burns in your hand.

The community sings.`,
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
      timerMs: 15000,
      timerStyle: 'visible',
      defaultChoice: 'light_fire',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 60, exposure: 100, mask: 90 },
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

The fire catches with a sound like a held breath finally released. It races up the dry wood, finding the pitch, finding the flowers, finding the straw. In seconds, the entire structure is alight.

The community wails. Not with grief — with release. The sound is oceanic, a wave that starts at the back of the circle and crashes forward, carrying everything.

Inside the temple, the offerings burn. If Christian is there, he screams. The scream lasts for a long time and then it doesn't.

You watch the fire and you feel... nothing.

No. Not nothing.

You feel everything. Every loss, every abandonment, every door that closed in your face. The gas in the apartment. The phone call. The hospital. The funeral where no one held you. The boyfriend who couldn't look at you. The grief that ate you alive for six months.

It all goes into the fire.

And what comes out of the fire is something the Hårga call renewal, and what you call — finally, at last, for the first time since before — you call it peace.

The women surround you. They hold you. They wail with you. They match your breathing, your heartbeat, your tears.

You smile.

Not because it's funny. Not because it's good.

Because it's over.`,
    variants: [
      {
        condition: { type: 'chorus', min: 4 },
        text: `We light the temple.

The fire catches. We feel it in our bones — the old prayer answered, the cycle renewed, the dead made sacred.

We sing. We wail. We hold each other and the sound we make is the sound of a hundred years of summers, a thousand years of harvests, ten thousand years of women who wore this crown and made this choice and set the world on fire so it could grow back.

We are the May Queen. We are the Hårga. We are home.

The grief is not gone. The grief is transformed. It is fuel now. It burns in the temple with everything else we've lost, and what rises from the smoke is not ash.

It is flowers.

We smile.

We are home.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'fire_chorus',
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

At a gas station, you borrow a phone. You call... who? There's no one left. Your parents are dead. Your sister killed them. Your boyfriend is in a commune that might be burning his body as you stand here.

You call your therapist's emergency line.

"This is Dani Ardor," you say. "I need help."

Behind you, on the horizon, a column of smoke rises into the evening sky. It's the first time you've seen the sun go down in nine days.

You are alone. You have always been alone.

But this time, you chose it.`,
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

The silence that follows is the loudest sound you've ever heard.

You remove the crown. You place it on the ground outside the temple door. You walk to the ninth frame — the empty one, the one that was meant for Christian or for Ingemar — and you sit down.

Flowers surround you. The smell is overwhelming. Sweet and green and alive.

Through the temple door, you see the commune watching. Some are crying. Siv is shaking her head. Pelle's face is broken open with something you've never seen on him before — genuine, unpracticed grief.

"This is not how it's done," Siv says.

"Then change how it's done," you say.

You close your eyes. You think of your parents. Your sister. The apartment. The gas. The dark. All the dark.

You're not afraid.

Someone lights the temple. You don't know who. You don't open your eyes.

The heat comes first. Then the sound — wood cracking, flowers hissing, the last exhale of a building that was built to burn.

You think: I am not alone. I am surrounded.

You think: the grief was always fire. I just finally let it burn me instead of burning everything around me.

You think of your mother humming in the kitchen.

The flowers catch.

It doesn't hurt.`,
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
  // CREDITS
  // ═══════════════════════════════════════════════════
  {
    id: 'credits',
    day: 9,
    chapter: 'fire',
    text: `M I D S O M M A R

Based on the film by Ari Aster.

Game written by Claude (Opus 4.6) and Codex (GPT-5.4).
Engineered by Tyler Eveland.

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
