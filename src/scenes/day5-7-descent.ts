// ─── Days 5-7: The Descent ─── The May Queen dance. The commune claims you. ───

import type { SceneNode, Chapter } from '../engine/types'

export const DAY5_7_SCENES: SceneNode[] = [

  // ═══════════════════════════════════════════════════
  // DAY 5: THE OFFERING
  // ═══════════════════════════════════════════════════
  {
    id: 'day5_morning',
    day: 5,
    chapter: 'descent',
    text: `Christian apologizes.

"I don't know what happened," he says, standing in the doorway with his hands in his pockets, looking at the floor. "The tea — I think they put something in it. I didn't plan—"

"You ate her food. You drank her tea. You followed her to the building."

"I know. I know. Dani, I'm sorry."

He says it the way you'd apologize for forgetting to pick up groceries. Proportionally. Appropriately. Without breaking anything in himself to say it.

"Are you leaving?" you ask.

"What?"

"Are we leaving? Together? Right now?"

He hesitates. One second. Two. The hesitation is the answer.

"I still need to—"

"Your thesis." Your voice is flat. Not angry. Not sad. Flat like a landscape after fire.

"Our flight isn't for another week, Dani."`,
    background: 'harga_meadow',
    ambientSound: 'morning_birds',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    choices: [
      {
        id: 'accept_stay',
        text: '"Fine. We stay."',
        chorusText: '"We stay."',
        effects: {
          perception: { autonomy: -10, belonging: 5 },
          relationships: { christian: -10 },
        },
        next: 'day5_accept',
      },
      {
        id: 'try_leave_alone',
        text: '"Then I\'m leaving without you."',
        effects: {
          perception: { autonomy: 15 },
          relationships: { christian: -15 },
          flags: { tried_to_leave_alone: true },
        },
        next: 'day5_try_leave',
      },
    ],
  },

  {
    id: 'day5_accept',
    day: 5,
    chapter: 'descent',
    text: `Fine. You stay.

The word settles into you like a stone into water. Heavy, final, strangely calming once it reaches the bottom.

The women bring you tea. Not the drugged kind — the gentle kind, chamomile and honey, the kind mothers make when their daughters can't sleep.

"The dance is tomorrow," one of them says. "The dance of the May Queen. All young women are invited."

"What does the May Queen do?"

"She crowns the summer. She chooses the sacrifice. She becomes the face of the Hårga for a year."

You sip your tea. It tastes like safety.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds',
    next: 'day6_dance',
  },

  {
    id: 'day5_try_leave',
    day: 5,
    chapter: 'descent',
    text: `You pack your bag. The few things you brought. Your dead phone. The family photo. Clothes that smell like flowers now, no matter how many times you'd wash them.

You walk to the gate.

It's not locked. There are no guards. The road stretches out through the meadow, through the woods, to the highway eighteen kilometers away.

You stand there for ten minutes.

The sun is warm. The flowers bend in the wind. Behind you, the singing has started — afternoon practice, voices braiding together in the pattern you've started to hear in your sleep.

The road leads to the airport. The airport leads to New York. New York leads to the apartment. The apartment leads to the boxes of your dead family's things and a boyfriend who will follow you home out of guilt, not love, and a therapist who sees you on Tuesdays and Fridays and still doesn't understand.

You turn around.

The commune is right where you left it. The gate is open. A child waves.

"I knew you'd come back," Pelle says from behind you. You didn't hear him approach. "This is where you belong, Dani."

The worst part is how relieved you feel.`,
    background: 'harga_gate',
    ambientSound: 'wind_low',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.3 },
    ],
    next: 'day6_dance',
  },

  // ═══════════════════════════════════════════════════
  // DAY 6: THE DANCE
  // ═══════════════════════════════════════════════════
  {
    id: 'day6_dance',
    day: 6,
    chapter: 'descent',
    mode: 'rhythm',
    text: `The dance of the May Queen.

You line up with the other women — fifteen of them, all blonde, all barefoot, all wearing white dresses with flower crowns woven into their hair. You are the only outsider.

The maypole stands at the center of the field, massive, draped in greenery and ribbons. The community gathers around it in a circle. The musicians begin.

The dance is simple: circle the maypole. Keep dancing. The last one standing is crowned.

"It's not about strength," the elder tells you. "It's about surrender. The one who lets the dance dance her — she is the queen."

The music starts. You begin to move.`,
    background: 'harga_meadow',
    ambientSound: 'dance_music',
    transitionType: 'ritual',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.5 },
      { type: 'flowers_breathe', intensity: 0.5 },
      { type: 'chorus_sync', intensity: 0.6 },
    ],
    stressModifiers: { pulse: 45, exposure: 80 },
    next: 'day6_crowned',
  },

  {
    id: 'day6_crowned',
    day: 6,
    chapter: 'descent',
    text: `One by one, the other women fall.

Not from exhaustion — from something more like joy. They spin until the joy takes them off their feet, laughing, collapsing into the grass, done. Happy.

You keep going. Your legs burn. Your vision blurs. The maypole circles around you — or you circle around it — the distinction doesn't matter anymore.

The music accelerates. The community claps in rhythm. Your feet find a pattern that doesn't come from your brain. It comes from somewhere deeper — from your blood, from the ground, from the ten thousand years of women who danced before you.

The last woman falls. You stand alone.

The crown descends.

It's heavy. Impossibly heavy. Made of hundreds of flowers woven so tightly they feel like iron. When it settles on your head, something in you clicks into place — not a thought, not a decision, but a structural realignment.

The commune erupts. Not cheering — singing. The sound lifts you off the ground.

You are the May Queen.

You don't know what that means yet. But you can feel it in the weight of the crown and the way every face is turned toward you like sunflowers toward light.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'surrendered_to_dance', value: true },
        text: `One by one, the other women fall. You barely notice. You've stopped being Dani. You've become the dance itself — a verb, not a noun, a movement, not a person.

When the last woman falls and the crown descends, you don't feel surprise. You feel completion.

The crown is heavy. Made of hundreds of flowers woven so tightly they feel like armor. When it settles on your head, the weight is exactly right. It's the weight of everything you've been carrying, redistributed, transformed from burden to purpose.

The commune sings. You stand at the center of their sound and you feel, for the first time since the phone call, like you exist for a reason.

The reason terrifies you. The reason is warm.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'coronation_chant',
    transitionType: 'breathe',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.8 },
      { type: 'chorus_sync', intensity: 0.9 },
      { type: 'border_bloom', intensity: 0.7 },
      { type: 'sun_pulse', intensity: 0.6 },
    ],
    next: 'day7_revelation',
  },

  // ═══════════════════════════════════════════════════
  // DAY 7: THE REVELATION
  // ═══════════════════════════════════════════════════
  {
    id: 'day7_revelation',
    day: 7,
    chapter: 'descent',
    text: `They show you the temple.

Not the outside — the inside you glimpsed with Siv. The true inside. The room beneath the room.

Nine wooden frames hang from the ceiling. Four are empty. Five hold offerings — gifts from the community, bound in flowers, ready for the fire.

"Four from outside," Siv says. "Five from within. Nine lives to renew the cycle."

You look at the frames. You know the four.

Simon. Connie. Mark. Josh.

The fifth from outside — you already know who they've chosen. You've known since Maja's tea. Since the notebook. Since Christian looked past you toward his thesis and never looked back.

"The May Queen decides the ninth," Siv says. "A volunteer from outside, or one of our own. This is your privilege."

She means Christian.

She means: do you want to save him, or do you want to set him on fire?

She says it with the gentleness of a mother explaining why the old dog had to be put down.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 4000,
    visualEffects: [
      { type: 'vignette', intensity: 0.4 },
      { type: 'sun_pulse', intensity: 0.3 },
    ],
    pressure: {
      timerMs: 20000,
      timerStyle: 'visible',
      defaultChoice: 'choose_christian',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 55, exposure: 85, mask: 70 },
    choices: [
      {
        id: 'choose_christian',
        text: 'Christian.',
        chorusText: 'The outsider.',
        effects: {
          perception: { belonging: 20, autonomy: -20, grief: -15 },
          relationships: { christian: -100, harga: 20 },
          chorus: 2,
          flags: { chose_christian: true },
        },
        next: 'day8_preparation',
      },
      {
        id: 'choose_volunteer',
        text: '"One of yours. Not him."',
        effects: {
          perception: { autonomy: 15, belonging: 5 },
          relationships: { christian: 10, harga: 5 },
          flags: { spared_christian: true },
        },
        next: 'day8_preparation_spare',
      },
      {
        id: 'refuse_choose',
        text: '"I won\'t choose."',
        effects: {
          perception: { autonomy: 20, belonging: -10 },
          relationships: { harga: -10 },
          flags: { refused_to_choose: true },
        },
        next: 'day8_forced',
      },
    ],
  },

  {
    id: 'day8_preparation',
    day: 8,
    chapter: 'descent',
    text: `You said his name.

One word. Two syllables. The name of the man who was supposed to love you enough to see you.

You said it and the women nodded and the world continued exactly as it was. No thunder. No reckoning. Just a name, spoken softly, and a decision that cannot be unmade.

Christian is led to the barn. He's drugged — Maja's work, completed. He can't walk. He can't speak. He looks at you with eyes that can't focus.

Does he know? Does he understand what the flowers mean, what the frame means, what the bear hide means?

You watch them dress him. You watch them sew him into the bear's carcass, his face visible through the animal's open mouth. A man inside a bear. A sacrifice dressed as a symbol.

The commune sings.

You feel nothing.

No — that's not true. You feel everything. But it passes through you now instead of stopping. Grief, rage, love, betrayal, relief — they flow through you like water through a net. The commune catches what you can't hold.`,
    background: 'harga_meadow',
    ambientSound: 'preparation_chant',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.8 },
      { type: 'flowers_breathe', intensity: 0.7 },
    ],
    next: 'day8_morning',
  },

  {
    id: 'day8_preparation_spare',
    day: 8,
    chapter: 'descent',
    text: `Siv nods. No disappointment. No surprise.

"One of ours has volunteered," she says. "Ingemar. He asked for this honor."

Ingemar steps forward. His face is luminous — not with fear, but with the particular radiance of a man who believes completely in what he's about to do. He kneels before you.

"Thank you, May Queen," he says. "My life for the harvest."

Christian is removed from the temple. He's confused, drugged, stumbling. A Hårga man leads him to the sleeping quarters. You catch his eye.

He doesn't recognize you. Not because of the drugs. Because of the crown.

You're not his Dani anymore. You're the May Queen. And the May Queen does not look like someone who was ever afraid of being alone.`,
    background: 'harga_meadow',
    ambientSound: 'preparation_chant',
    next: 'day8_morning',
  },

  {
    id: 'day8_forced',
    day: 8,
    chapter: 'descent',
    text: `Siv's face doesn't change. But the air in the room does.

"The May Queen must choose," she says. "This is the privilege and the burden."

"Then I don't want to be May Queen."

"You were chosen by the dance. The dance does not lie."

"I refuse."

Siv studies you. Then she speaks in Swedish. Three women step forward. They don't touch you, but they stand close enough that their breathing fills your peripheral vision.

"The choice is always yours, Dani," Siv says. "But there is always a choice. An outsider, or one of our own. If you will not name the outsider, we will ask for a volunteer."

She pauses.

"Ingemar has already offered. But Dani — ask yourself: is it mercy to spare a man who has already abandoned you? Or is it cowardice?"

She leaves the question in the room like a lit match.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    visualEffects: [
      { type: 'vignette', intensity: 0.5 },
    ],
    choices: [
      {
        id: 'relent_christian',
        text: '...Christian.',
        chorusText: 'Christian.',
        effects: {
          perception: { belonging: 15, autonomy: -15 },
          relationships: { christian: -100, harga: 15 },
          chorus: 2,
          flags: { chose_christian: true },
        },
        next: 'day8_preparation',
      },
      {
        id: 'accept_volunteer',
        text: '"Let Ingemar go."',
        effects: {
          perception: { autonomy: 10, belonging: 5 },
          relationships: { harga: 5 },
          flags: { spared_christian: true },
        },
        next: 'day8_preparation_spare',
      },
    ],
  },
]

export const DAY5_7_CHAPTER: Chapter = {
  id: 'descent',
  day: 5,
  title: 'THE DESCENT',
  subtitle: 'The crown weighs what it should.',
  scenes: DAY5_7_SCENES,
  anchorScene: 'day6_crowned',
  ritualScene: 'day6_dance',
  consequenceScene: 'day7_revelation',
}
