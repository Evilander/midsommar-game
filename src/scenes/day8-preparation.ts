import type { SceneNode, Chapter } from '../engine/types'

export const DAY8_SCENES: SceneNode[] = [
  {
    id: 'day8_morning',
    day: 8,
    chapter: 'preparation',
    text: `You wake before the singing ends.

Three women are already in the room. One at your feet. One by the washbasin. One holding the crown with both hands.

"Good morning, May Queen," they say.

Flowers have been threaded through your hair while you slept. Petals cling to your throat. Your neck aches from yesterday.

When they lower the crown onto your head, the weight returns at once. Not surprising. Worse than surprising. Familiar.

Outside, the commune is waiting for you to become visible.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'morning_chant',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.7 },
      { type: 'sun_pulse', intensity: 0.4 },
    ],
    next: 'day8_dressing',
  },

  {
    id: 'day8_dressing',
    day: 8,
    chapter: 'preparation',
    text: `They dress you slowly.

Not for modesty. For arrangement.

The flower dress comes in pieces. White linen first. Then the stitched panels of cornflowers, roses, fern, buttercups, foxglove. They keep adding flowers until the dress stops looking wearable.

A girl no older than fifteen lifts a mirror.

For a moment you don't understand the woman inside it. The face is yours. The mouth is yours. The rest is flowers.

"Beautiful," one woman whispers.

No one asks if you are comfortable.`,
    background: 'harga_feast',
    ambientSound: 'preparation_chant',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.9 },
      { type: 'face_linger', intensity: 0.6 },
    ],
    next: 'day8_procession_start',
  },

  {
    id: 'day8_procession_start',
    day: 8,
    chapter: 'preparation',
    text: `The doors open.

Sunlight floods the threshold. The whole commune is outside already, arranged in two lines down the packed-earth path.

You step forward. The dress drags through pollen. Bees worry at the hem and do not sting.

Everyone bows.

Not deeply. Not theatrically. Children bow. Elders bow. Women with flour on their wrists and men with dirt under their nails bow.

No one looks away.

You walk between them and hear your flowers brushing theirs.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    sounds: {
      onEnter: 'chapter_transition',
    },
    transitionType: 'ritual',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.8 },
      { type: 'border_bloom', intensity: 0.5 },
      { type: 'sun_pulse', intensity: 0.4 },
    ],
    stressModifiers: { exposure: 85, mask: 70 },
    next: 'day8_temple_approach',
  },

  {
    id: 'day8_temple_approach',
    day: 8,
    chapter: 'preparation',
    text: `Then you see the temple.

Yellow. Triangular. Too bright beneath the white sky.

The doors stand open.

From here you can already see flowers draped over the frames inside. Garlands. Green boughs. The dark curve of animal hide. A boot. A hand that does not move.

Offerings, they call them.

The word does not make the bodies smaller.

The commune keeps singing. Sweetly. Patiently.

You feel dread and it does not pass.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    sounds: {
      onEnter: 'commune_whisper',
    },
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    visualEffects: [
      { type: 'vignette', intensity: 0.5 },
      { type: 'sun_pulse', intensity: 0.5 },
      { type: 'text_waver', intensity: 0.3 },
    ],
    stressModifiers: { pulse: 55, exposure: 90, mask: 75 },
    next: 'day8_temple_threshold',
  },

  {
    id: 'day8_temple_threshold',
    day: 8,
    chapter: 'preparation',
    mode: 'exploration',
    text: `No one stops you from stepping closer.

That is what makes it worse.

The temple doors stand open. The commune keeps singing behind you. Inside, the air is sweet with flowers and resin and the smell of something dead.

You step closer and look inside.`,
    background: 'harga_meadow',
    ambientSound: 'tense_ambient',
    sounds: {
      onEnter: 'ghost_echo',
    },
    transitionType: 'dissolve',
    memoryBloom: {
      lines: [
        `The doors are open again. You know what that means now.`,
        `You have stood here before. The temple does not look different. You do.`,
      ],
    },
    visualEffects: [
      { type: 'vignette', intensity: 0.55 },
      { type: 'sun_pulse', intensity: 0.35 },
      { type: 'border_bloom', intensity: 0.2 },
    ],
    hotspots: [
      {
        id: 'temple_outsider_frames',
        label: 'outsider frames',
        x: 31,
        y: 46,
        icon: 'take',
        result: {
          type: 'clue',
          clue: {
            id: 'clue_temple_outsider_frames',
            text: 'Each outsider has been arranged with a label disguised as decoration: Simon\'s London football scarf, Connie\'s coral bracelet, Josh\'s yellow camera strap tied beneath fresh flowers, Mark\'s jester-marked hide stretched over a frame. The temple is not chaos. It is catalogued.',
            corruptedText: 'The offerings are lovingly named so none of them will be lost in the fire.',
            source: 'day8_temple_threshold',
            subject: 'ritual',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'temple_bear_shell',
        label: 'bear shell',
        x: 67,
        y: 38,
        icon: 'take',
        condition: { type: 'flag', flag: 'chose_christian', value: true },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_temple_bear_shell',
            text: 'The bear carcass has already been split, cleaned, and laced with fresh cord. The stitches are half-finished, waiting only for a body. Christian was chosen long before the last torch was lit.',
            corruptedText: 'The bear is a holy garment waiting to welcome the chosen outsider home.',
            source: 'day8_temple_threshold',
            subject: 'ritual',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'temple_ingemar_ribbon',
        label: 'volunteer ribbon',
        x: 67,
        y: 38,
        icon: 'take',
        condition: { type: 'flag', flag: 'spared_christian', value: true },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_temple_ingemar_ribbon',
            text: 'A handwritten ribbon is tucked into Ingemar\'s flowers: FOR THE HARVEST, GLADLY. The ink is steady. The signature is his. Even devotion here arrives with paperwork.',
            corruptedText: 'Ingemar wrote his joy into the ribbon so the fire would know him by name.',
            source: 'day8_temple_threshold',
            subject: 'ritual',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'temple_pitch_bowls',
        label: 'pitch bowls',
        x: 53,
        y: 69,
        icon: 'examine',
        result: {
          type: 'text',
          text: 'Clay bowls wait at the foot of each frame, filled with black pitch, yellow sap, and crushed flowers. The temple has been prepared to burn quickly.',
        },
      },
      {
        id: 'temple_door_runes',
        label: 'door runes',
        x: 84,
        y: 58,
        icon: 'rune',
        result: {
          type: 'text',
          text: 'The runes on the doorframe are darker where fingers have traced them for years. Renewal, cleansing, return. The words are old enough to feel practiced instead of believed.',
        },
      },
    ],
    next: 'day8_pelle_farewell',
  },

  {
    id: 'day8_pelle_farewell',
    day: 8,
    chapter: 'preparation',
    text: `Pelle waits for you beside the path, just beyond the temple doors.

He has flower pollen on his cuffs. Smoke in his hair already, though nothing is burning yet.

"You understand now," he says.

"Do I?"

He looks at you the same way he did in New York.

"I brought you here because I saw you," he says. "Before us, no one was really seeing you."

Brought.

"On purpose?" you ask.

"Yes."

Not accident. Not invitation.

He does not apologize. That would make it smaller than it is.

"Whatever happens tomorrow," he says, "you were never random to me."`,
    variants: [
      {
        condition: { type: 'flag', flag: 'refused_to_choose', value: true },
        text: `Pelle waits for you beside the temple path.

"You would not choose," he says.

"I wasn't supposed to be here."

"No," he says. "You were always supposed to be here."

The sentence chills the air around you.

He tells you then without gentleness. He watched Christian neglect you in small daily ways. He watched grief wear you down.

"I brought you because I knew we would not lose you."

"Brought me."

"On purpose."

Not a friend, then. Not only that. A hand on the small of your back years before it touched you.

The singing from the meadow goes on. Steady. Certain.

"Even now," Pelle says, "you still resist. That is why I chose you."`,
      },
      {
        condition: { type: 'flag', flag: 'chose_christian', value: true },
        text: `Pelle waits for you beside the path, watching the temple.

"You chose," he says.

You do not answer.

"I knew you would see him clearly in the end."

The words make you turn toward him. "You knew."

"I hoped," he says. Then, after a beat: "I brought you here because I hoped."

Brought.

Not invited. Brought.

He says he saw, from the first dinner in New York, how Christian kept failing you. How you kept asking to be held and were handed explanations instead. How lonely you were even before Sweden.

"I wanted you with us," he says. "On purpose."

You think of the road. The flowers in the ditch. The smile in the car. You think of the road, the car, and the first day here.

Pelle does not look ashamed. Only truthful.

"I am sorry for your pain," he says. "Not for bringing you home."

The second sentence is the true one.`,
      },
      {
        condition: { type: 'flag', flag: 'spared_christian', value: true },
        text: `Pelle waits for you just short of the temple doors.

"You spared him," he says.

There is no accusation in it. That is worse.

"I brought you here because I believed you would choose from the center of yourself," he says. "Not from fear."

Brought.

You stare at him. He meets it.

He speaks quietly. He saw your loneliness before you said a word about it. He saw how little Christian gave you. He saw someone the commune could keep.

"On purpose," he says.

The honesty is blunt.

He wanted you in Sweden. Wanted you in white. Wanted you crowned. Perhaps wanted you before you knew you could be wanted at all.

"You think kindness excuses design?" you ask.

"No," he says. "But design can still contain kindness."

The temple stands behind him while he says it.`,
      },
    ],
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `Inside the temple, Simon, Connie, Josh, and Mark are already arranged as a finished sentence. Pelle does not have to describe what the Hårga are doing. You have seen the grammar for yourself.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `You cannot stop seeing the open bear shell behind him, the empty space measured exactly to Christian's shape.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `The ribbon in Ingemar's flowers keeps flashing through your mind: gladly. The worst part is that he meant it.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'chorus_hum',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    visualEffects: [
      { type: 'vignette', intensity: 0.4 },
      { type: 'text_waver', intensity: 0.4 },
    ],
    next: 'day8_vigil',
  },

  {
    id: 'day8_vigil',
    day: 8,
    chapter: 'preparation',
    text: `They seat you alone on a carved chair facing the temple.

Not inside. Not outside.

The commune forms a ring around you. No one speaks. The flowers on your dress have started to bruise.

You know what waits in the wood. You know what morning is for.

The knowledge does not arrive all at once. It keeps coming back.`,
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `You know where each outsider is now. The temple no longer contains abstractions. It contains Simon's scarf. Connie's bracelet. Josh's strap. Mark's skin.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `Somewhere under the singing, you can still hear the fresh cord creaking against the bear hide waiting for Christian.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `Ingemar wrote consent into a ribbon because even faith here wants a witness.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'tense_ambient',
    sounds: {
      onEnter: 'commune_whisper',
      onChoicesReveal: 'timer_urgent',
    },
    transitionType: 'cut',
    typingSpeed: 'slow',
    pauseAfterMs: 2000,
    memoryBloom: {
      lines: [
        `The chair feels familiar now. You do not like that.`,
        `This part comes faster on the next cycle. The singing starts and your body already knows where you are.`,
      ],
    },
    pressure: {
      timerMs: 9000,
      timerStyle: 'visible',
      defaultChoice: 'accept_silence',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 74, exposure: 98, mask: 88, dissociation: 28 },
    visualEffects: [
      { type: 'vignette', intensity: 0.6 },
      { type: 'chorus_sync', intensity: 0.5 },
      { type: 'text_waver', intensity: 0.3 },
    ],
    choices: [
      {
        id: 'accept_silence',
        text: 'Accept the silence.',
        chorusText: 'Sit with us.',
        effects: {
          perception: { belonging: 10, autonomy: -10, grief: -5 },
          relationships: { harga: 10 },
          chorus: 1,
          flags: { accepted_day8_silence: true },
        },
        next: 'day8_night',
      },
      {
        id: 'say_this_is_wrong',
        text: '"This is wrong."',
        effects: {
          perception: { autonomy: 12, belonging: -8, grief: 5 },
          relationships: { harga: -8, pelle: -5 },
          flags: { protested_day8_vigil: true },
        },
        next: 'day8_night',
      },
      {
        id: 'ask_who_burns',
        text: '"Who is in there?"',
        effects: {
          perception: { autonomy: 5, grief: 8 },
          relationships: { harga: -3 },
          flags: { asked_day8_vigil_question: true },
        },
        next: 'day8_night',
      },
    ],
  },

  {
    id: 'day8_night',
    day: 8,
    chapter: 'preparation',
    text: `The last night does not get dark. It only turns softer at the edges.

From the sleeping house, you hear the commune singing beyond the walls. Low. Continuous. Not celebration. Not grief. The sound people make when they have already agreed to tomorrow.

You lie under the flowers and listen.

Somewhere outside, the temple keeps its shape against the white sky. Inside it, wood waits for flame. So do bodies.

You close your eyes and the song keeps entering anyway.`,
    variants: [
      {
        condition: { type: 'autonomy', min: 60 },
        text: `The last night barely dims.

The commune sings outside the sleeping house. Their voices move together with a calm that feels obscene now. They are not wondering what tomorrow brings. They know. That is the song.

You lie awake beneath the flower dress they never fully removed. The stems dig into your skin. The perfume has gone overripe. Beautiful things rot fast.

You try to separate sounds. One voice. Then another. Your own breath. Something that still belongs to you.

The temple is still there beyond the wall.

You think: I can still see this clearly.

You think it again because you are afraid of losing the sentence.`,
      },
      {
        condition: { type: 'autonomy', max: 45 },
        text: `We do not get a real night. Only a pale softening.

Outside the sleeping house, our voices continue. They rise and fall like breathing shared by many lungs. Tomorrow is already decided. We know this because we have been taught by the flowers, by the fire, by the bodies carried gently to their places.

The dress is still around us. Its sweetness is heavy now. Warm. Fading.

Beyond the wall, the temple waits. Beyond the waiting, renewal.

We listen until the song and the blood and the white sky feel arranged by the same hand.

Sleep comes slowly.`,
      },
    ],
    echoes: [
      {
        condition: { type: 'clue', clueId: 'clue_temple_outsider_frames' },
        text: `When you close your eyes, you still know where each of them is.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_bear_shell' },
        text: `The empty bear shell keeps coming back to you. It was ready before Christian was.`,
      },
      {
        condition: { type: 'clue', clueId: 'clue_temple_ingemar_ribbon' },
        text: `Ingemar's handwriting bothers you more than it should. He meant every word.`,
      },
    ],
    background: 'sleeping_quarters_night',
    ambientSound: 'night_deep_chant',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.7 },
      { type: 'chorus_sync', intensity: 0.7 },
      { type: 'vignette', intensity: 0.4 },
    ],
    next: 'day8_end',
  },

  {
    id: 'day8_end',
    day: 8,
    chapter: 'preparation',
    text: `Morning arrives without asking.

The temple is still there.

So are you.`,
    background: 'harga_meadow',
    ambientSound: 'final_chant',
    transitionType: 'fade',
    typingSpeed: 'slow',
    autoAdvanceMs: 4000,
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.6 },
      { type: 'border_bloom', intensity: 0.4 },
    ],
    next: 'day9_fire',
  },
]

export const DAY8_CHAPTER: Chapter = {
  id: 'preparation',
  day: 8,
  title: 'THE PREPARATION',
  subtitle: 'Everything beautiful is also everything terrible.',
  scenes: DAY8_SCENES,
  anchorScene: 'day8_temple_approach',
  ritualScene: 'day8_procession_start',
  consequenceScene: 'day8_vigil',
}
