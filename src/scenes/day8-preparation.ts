import type { SceneNode, Chapter } from '../engine/types'

export const DAY8_SCENES: SceneNode[] = [
  {
    id: 'day8_morning',
    day: 8,
    chapter: 'preparation',
    text: `You wake before the singing ends.

Three women are already in the room. One at your feet. One by the washbasin. One holding the crown with both hands, as if it were an infant or a weapon.

"Good morning, May Queen," they say.

Flowers have been threaded through your hair while you slept. Petals cling to your throat. Your neck aches from yesterday. The ache is holy now. Everything is holy now.

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

The flower dress comes in pieces. White linen first. Then the stitched panels of cornflowers, roses, fern, buttercups, foxglove. Fresh weight layered over fresh weight until your body disappears beneath summer.

A girl no older than fifteen lifts a mirror.

For a moment you don't understand the woman inside it. The face is yours. The mouth is yours. But the rest has been swallowed by bloom. You look bridal. Funereal. Like something the earth made to apologize for what it is about to take back.

"Beautiful," one woman whispers.

No one says safe.`,
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

Not deeply. Not theatrically. Just enough to tell you that whatever happens next will happen through you. Children bow. Elders bow. Women with flour on their wrists and men with dirt under their nails bow as if this, too, were work that needed doing.

No one looks away.

You walk between them and hear your flowers brushing their flowers. A soft sound. Almost like rain.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
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

Yellow. Triangular. Too bright beneath the white sky. It looks less built than placed, as if some careful hand set it down in the meadow this morning and all the grass beneath it died politely.

The doors stand open.

From here you can already see flowers draped over the frames inside. Garlands. Green boughs. The dark curve of animal hide. A boot. A hand that does not move.

Offerings, they call them.

The word does not make the bodies smaller.

The commune keeps singing. Sweetly. Patiently. The melody lifts and falls around the temple the way smoke will tomorrow.

Dread arrives without drama. It simply takes its seat inside you and stays.`,
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    visualEffects: [
      { type: 'vignette', intensity: 0.5 },
      { type: 'sun_pulse', intensity: 0.5 },
      { type: 'text_waver', intensity: 0.3 },
    ],
    stressModifiers: { pulse: 55, exposure: 90, mask: 75 },
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

He looks at you with that same soft, unbearable face he wore in New York. The one that always made kindness feel like architecture. Designed. Load-bearing.

"I brought you here because I saw you," he says. "Before you were seen by us, you were unseen everywhere else."

Brought.

The word lands harder than any blessing has.

"On purpose?" you ask.

"Yes."

Not accident. Not invitation. Selection.

He does not apologize. That would make it smaller than it is.

"Whatever happens tomorrow," he says, "you were never random to me."

For a moment he is plain in front of you. Devout. Certain. Loving, perhaps. But with the kind of love that can carry a person to an altar and call it rescue.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'refused_to_choose', value: true },
        text: `Pelle waits for you beside the temple path.

"You would not choose," he says.

"I wasn't supposed to be here."

"No," he says. "You were always supposed to be here."

The sentence chills the air around you.

He tells you then without gentleness. He watched Christian neglect you in small daily ways. Watched grief hollow you out after your family died. Watched you become easy to lose.

"I brought you because I knew we would not lose you."

"Brought me."

"On purpose."

Not a friend, then. Not only that. A hand on the small of your back years before it touched you.

The singing from the meadow goes on. Steady. Certain.

"Even now," Pelle says, "you still resist. That is why I chose you."

You look at him and see faith stripped of tenderness. Clean. Bright. Terrible.`,
      },
      {
        condition: { type: 'flag', flag: 'chose_christian', value: true },
        text: `Pelle waits for you beside the path, watching the temple as if he helped grow it.

"You chose," he says.

You do not answer.

"I knew you would see him clearly in the end."

The words make you turn toward him. "You knew."

"I hoped," he says. Then, after a beat: "I brought you here because I hoped."

Brought.

Not invited. Brought.

He says he saw, from the first dinner in New York, how Christian let your grief sit beside him like a stranger. How you kept asking to be held and were handed explanations instead. How lonely you were even before Sweden.

"I wanted you with us," he says. "On purpose."

You think of the road. The flowers in the ditch. The smile in the car. All of it angled toward this field, this dress, this temple.

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

He speaks quietly, as if confessing something sacred rather than shameful. He saw your loneliness before you said a word about it. Saw the way Christian's attention skimmed over you like a stone over water. Saw a woman already half-abandoned and thought: here. Here is someone we can keep.

"On purpose," he says.

The honesty is surgical.

He wanted you in Sweden. Wanted you in white. Wanted you crowned. Perhaps wanted you before you knew you could be wanted at all.

"You think kindness excuses design?" you ask.

"No," he says. "But design can still contain kindness."

The temple stands behind him like the end of an argument neither of you can win.`,
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

Not inside. Not outside. Witness distance.

The commune forms a ring far enough away to seem respectful, close enough to feel like a wall. No one speaks. The flowers on your dress have started to warm and bruise. Sweetness turning.

You know what waits in the wood. You know what morning is for.

The knowledge does not arrive all at once. It pulses. It returns. It sits down harder each time.`,
    background: 'harga_meadow',
    ambientSound: 'silence_heavy',
    transitionType: 'cut',
    typingSpeed: 'slow',
    pauseAfterMs: 2000,
    pressure: {
      timerMs: 12000,
      timerStyle: 'visible',
      defaultChoice: 'accept_silence',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 65, exposure: 95, mask: 85 },
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

Somewhere outside, the temple keeps its shape against the white sky. Somewhere inside it, wood waits for flame. So do bodies. So do names.

You close your eyes and the song keeps entering anyway.`,
    variants: [
      {
        condition: { type: 'autonomy', min: 60 },
        text: `The last night barely dims.

The commune sings outside the sleeping house. Their voices move together with a calm that feels obscene now. They are not wondering what tomorrow brings. They know. That is the song.

You lie awake beneath the flower dress they never fully removed. The stems dig into your skin. The perfume has gone overripe. Beautiful things rot fast.

You try to separate sounds. One voice. Then another. Your own breath. Something that still belongs to you.

The temple stands somewhere beyond the wall, patient as a blade wrapped in ribbon.

You think: I can still see this clearly.

You think it again because you are afraid of losing the sentence.`,
      },
      {
        condition: { type: 'autonomy', max: 45 },
        text: `We do not get a real night. Only a pale softening.

Outside the sleeping house, our voices continue. They rise and fall like breathing shared by many lungs. Tomorrow is terrible. Tomorrow is beautiful. We know this because we have been taught by the flowers, by the fire, by the bodies carried gently to their places.

The dress is still around us. Its sweetness is heavy now. Warm. Fading.

Beyond the wall, the temple waits. Beyond the waiting, renewal.

We listen until the song and the blood and the white sky feel arranged by the same hand.

Sleep comes like agreement.`,
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
