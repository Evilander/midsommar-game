// ─── Day 3: The Thinning ─── Friends disappear. The commune tightens. ───

import type { SceneNode, Chapter } from '../engine/types'

export const DAY3_SCENES: SceneNode[] = [

  {
    id: 'day3_morning',
    day: 3,
    chapter: 'thinning',
    text: `Mark is gone.

Not gone like Simon and Connie — their leaving was announced, negotiated, a thing with bags and arguments. Mark is just... absent. His bed is made. His wallet is on the nightstand.

"He probably wandered off with that Swedish girl," Josh says, barely looking up from his notebook. "He was obsessed with her."

Christian nods. "He does this."

But Mark doesn't do this. Mark is lazy and predictable and would never leave his wallet behind. You know this. They know this. Nobody says it.

The commune moves around the absence like water around a stone. The tables are set with one fewer place. No one mentions his name.`,
    background: 'harga_meadow',
    ambientSound: 'morning_chant',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2500,
    choices: [
      {
        id: 'ask_about_mark',
        text: '"Has anyone seen Mark?"',
        effects: {
          perception: { autonomy: 5 },
          relationships: { harga: -5 },
          flags: { asked_about_mark: true },
        },
        next: 'day3_ask_mark',
      },
      {
        id: 'dont_ask',
        text: 'Say nothing. Eat breakfast.',
        chorusText: 'Eat. The food is warm.',
        effects: {
          perception: { belonging: 5, autonomy: -5 },
          relationships: { harga: 3 },
        },
        next: 'day3_breakfast',
      },
      {
        id: 'check_marks_things',
        text: 'Check his belongings. Something is wrong.',
        effects: {
          perception: { autonomy: 8 },
          flags: { searched_marks_things: true },
        },
        next: 'day3_marks_things',
      },
    ],
  },

  {
    id: 'day3_ask_mark',
    day: 3,
    chapter: 'thinning',
    text: `The woman setting the table pauses. Her smile doesn't change — it just hardens at the edges.

"The young man with the jokes? I believe he went to explore the lake with one of our girls. He seemed very happy."

"He left his wallet."

"Perhaps he did not need it." She sets down a plate of cheese and bread. "Here there is no buying or selling. Only sharing."

You look at Christian. He shrugs. Josh doesn't look up.

Pelle appears with a cup of something warm. "Don't worry about Mark," he says. "People find their own paths here."

His voice is so kind that you almost forget you're scared.`,
    background: 'harga_feast',
    ambientSound: 'morning_birds',
    next: 'day3_midday',
  },

  {
    id: 'day3_breakfast',
    day: 3,
    chapter: 'thinning',
    text: `The food is extraordinary. Fresh bread with butter that tastes like sunshine. Berries so bright they seem to pulse. Honey from hives you can hear humming in the garden.

You eat and you don't think about Mark. You don't think about Simon and Connie. You don't think about the cliff.

A girl across the table — Maja, you've learned her name — watches Christian with an intensity that should be embarrassing but is somehow accepted here. The women on either side of her seem to encourage it.

Christian notices. You notice him notice. He doesn't look away as quickly as he should.

The berries are sweet. The sun is warm. You have another piece of bread.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.2 },
    ],
    next: 'day3_midday',
  },

  {
    id: 'day3_marks_things',
    day: 3,
    chapter: 'thinning',
    text: `His wallet is here. His credit cards. His cash. His phone — dead, like yours, like everyone's. His passport.

His shoes are gone. His clothes are gone. But these — the things you'd grab if you were leaving a place — are all neatly arranged on the nightstand as if placed there by someone who understood which items mattered but not why.

Under his pillow, you find a note on folded paper. It's in Swedish. You can't read it.

You show it to Christian later. He takes a photo of it with his dead phone out of habit, then realizes. He puts it in his pocket.

"I'm sure he's fine," he says. The note disappears. Neither of you ever sees it again.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'silence_wind',
    visualEffects: [
      { type: 'vignette', intensity: 0.3 },
    ],
    next: 'day3_midday',
  },

  // ═══════════════════════════════════════════════════
  // MIDDAY: THE DANCE LESSON
  // ═══════════════════════════════════════════════════
  {
    id: 'day3_midday',
    day: 3,
    chapter: 'thinning',
    text: `In the afternoon, the women teach you a dance.

It's called something you can't pronounce — a name that sounds like water moving over stones. The movements are slow, deliberate, each gesture freighted with meaning the teacher explains only in fragments.

"The right hand reaches for the sun. The left hand holds the earth. The body is the bridge."

You're terrible at first. But the women don't laugh. They adjust your arms, your hips, your chin, with touches so tender they make you want to cry.

Christian watches from the edge of the field. He has his arms crossed. When you catch his eye, he looks away, and you realize he's talking to Maja.`,
    background: 'harga_meadow',
    ambientSound: 'dance_music',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    choices: [
      {
        id: 'keep_dancing',
        text: 'Keep dancing. Let the rhythm take you.',
        chorusText: 'Dance.',
        effects: {
          perception: { belonging: 8, autonomy: -5, grief: -3 },
          relationships: { harga: 8 },
          chorus: 1,
        },
        next: 'day3_dance_deep',
      },
      {
        id: 'stop_watch_christian',
        text: 'Stop. Go to Christian.',
        effects: {
          perception: { autonomy: 5 },
          relationships: { christian: -5, harga: -3 },
        },
        next: 'day3_confront_christian',
      },
    ],
  },

  {
    id: 'day3_dance_deep',
    day: 3,
    chapter: 'thinning',
    text: `You keep dancing.

The rhythm is simple — two counts forward, one count back, a turn that makes the sky wheel overhead. But inside the simplicity there's a complexity that reveals itself only when you stop thinking.

Your body remembers something your mind doesn't. The women move around you in a pattern that tightens and releases, like breathing, like the flowers in the ditch that bent when the car passed.

For three minutes, you are not Dani. You are not grieving. You are not afraid. You are a body in a circle of bodies, doing what bodies have done for ten thousand years.

When the music stops, you're crying. Not from sadness. From something older that doesn't have a name.

The women hold you. Every one of them.`,
    background: 'harga_meadow',
    ambientSound: 'dance_music_slow',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.5 },
      { type: 'chorus_sync', intensity: 0.6 },
      { type: 'border_bloom', intensity: 0.3 },
    ],
    next: 'day3_evening',
  },

  {
    id: 'day3_confront_christian',
    day: 3,
    chapter: 'thinning',
    text: `"What were you talking to her about?"

Christian blinks. "Who?"

"Maja. The girl who's been staring at you for two days."

"She was asking about my research." He says it casually, the way he says everything that matters. "She's interested in my thesis topic."

"You don't have a thesis topic."

The words come out sharper than you intended. Christian's face closes like a door.

"Okay, Dani. Cool."

He walks away. Not toward the commune. Not toward you. Into the space between, where he's always most comfortable — close enough to claim he didn't leave, far enough that you can't reach him.

The women watching from the dance circle exchange a look you're not meant to see but do. They don't look surprised. They look patient.`,
    background: 'harga_meadow',
    ambientSound: 'wind_low',
    next: 'day3_evening',
  },

  // ═══════════════════════════════════════════════════
  // EVENING: JOSH AND THE RUBI RADR
  // ═══════════════════════════════════════════════════
  {
    id: 'day3_evening',
    day: 3,
    chapter: 'thinning',
    text: `That evening, Josh is frantic.

"I need to see the Rubi Radr," he tells Christian, pacing. "The sacred text. It's the key to everything — the lifecycle, the rituals, the cosmology. If I can photograph it, my thesis is made."

"They said no one's allowed."

"I know what they said. But I saw where they keep it." Josh's eyes are bright with the particular madness of a man who has confused ambition with courage.

"I'm going tonight. During the singing. When everyone's in the main house."

Christian looks torn. You can see the thesis-envy working behind his eyes — the fear that Josh will get there first, publish first, succeed first.

"Don't do it," you say. "They'll know."

Josh looks at you. Not with contempt, exactly. With the particular dismissal men reserve for women who express caution.

"I'll be careful."`,
    background: 'harga_feast',
    ambientSound: 'evening_birds',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    pressure: {
      timerMs: 10000,
      timerStyle: 'hidden',
      defaultChoice: 'say_nothing_josh',
      timerShrinkWithPulse: false,
    },
    stressModifiers: { exposure: 40 },
    choices: [
      {
        id: 'warn_josh',
        text: '"Josh. People are disappearing. Don\'t go."',
        effects: {
          perception: { autonomy: 8 },
          relationships: { josh: -3 },
          flags: { warned_josh: true },
        },
        next: 'day3_warn_josh',
      },
      {
        id: 'tell_pelle',
        text: 'Tell Pelle what Josh is planning.',
        chorusText: 'Protect what is sacred.',
        effects: {
          perception: { belonging: 8, autonomy: -10 },
          relationships: { josh: -15, pelle: 10, harga: 10 },
          flags: { betrayed_josh: true },
          chorus: 1,
        },
        next: 'day3_tell_pelle',
      },
      {
        id: 'say_nothing_josh',
        text: 'Say nothing. It\'s not your problem.',
        effects: {
          perception: { autonomy: -3 },
        },
        next: 'day3_josh_goes',
      },
    ],
  },

  {
    id: 'day3_warn_josh',
    day: 3,
    chapter: 'thinning',
    text: `Josh pauses. For a second, something flickers in his face — not fear, but recognition. He heard you.

Then it's gone.

"I appreciate the concern, Dani. But this is my life's work." He touches your shoulder, the way you'd touch a child who's scared of thunder. "I'll be fine."

He's not fine. You know this before morning comes.`,
    background: 'harga_feast',
    ambientSound: 'evening_birds',
    next: 'day3_josh_goes',
  },

  {
    id: 'day3_tell_pelle',
    day: 3,
    chapter: 'thinning',
    text: `You find Pelle by the garden. The words come out before you can think about why you're saying them.

"Josh is going to try to photograph the Rubi Radr tonight."

Pelle's face doesn't change. Not surprise. Not anger. Just... acknowledgment. Like you've told him something he already knew.

"Thank you, Dani," he says quietly. "That book is very sacred to us. You understand what it means to protect sacred things."

He touches your hand. "You're one of the kind ones."

You walk back to the main house with a feeling in your chest that you can't name. It sits between guilt and relief. You betrayed Josh. You protected the commune. You did both at the same time, and the terrible thing is that the second feeling is stronger.

Josh goes anyway. Josh doesn't come back.`,
    background: 'harga_meadow',
    ambientSound: 'evening_birds',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.4 },
    ],
    next: 'day3_night',
  },

  {
    id: 'day3_josh_goes',
    day: 3,
    chapter: 'thinning',
    text: `Josh leaves after midnight — or what passes for midnight here, a golden dimming that never quite becomes dark.

You hear the door close softly. You lie awake and listen. The singing continues from the main hall.

Christian is awake too. You can tell by his breathing — the shallow, calculated stillness of someone pretending to sleep.

Neither of you says anything.

In the morning, Josh's bed is empty. His notebook is on the floor, open to a page covered in rune drawings. His shoes are by the door.

Christian picks up the notebook. Reads it. Puts it in his own bag.

"He probably went to clear his head," Christian says.

You both know that isn't true. You both know that knowing isn't the same as doing something about it.

Outside, the commune is setting tables for breakfast. One fewer place.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'betrayed_josh', value: true },
        text: `You lie awake all night. Not from worry. From certainty.

You told Pelle. Pelle told the elders. The elders have ways of protecting what is sacred.

At 2 AM — or what would be 2 AM if the sun ever set — you hear footsteps outside the window. More than two people. Moving with purpose. Moving quietly.

Josh's bed is empty when you look.

In the morning, his notebook is on the floor, open to a page of rune drawings. His shoes are by the door. His reading glasses are on the nightstand, folded neatly, as if someone had removed them from his face with care.

Christian picks up the notebook. You watch him read a dead man's words and say nothing.

"He probably went to clear his head," Christian says.

You eat breakfast. The food tastes exactly the same as it did before you became someone who does this.`,
      },
      {
        condition: { type: 'flag', flag: 'warned_josh', value: true },
        text: `Josh leaves after midnight. You heard the door. You could have gotten up. You could have stopped him physically. Stood in the doorway. Screamed.

You didn't.

You warned him with words, which is the form of warning that lets you believe you tried while knowing you didn't try enough.

In the morning, his bed is empty. His notebook is on the floor. His shoes are by the door.

Christian picks up the notebook. He doesn't mention you. He doesn't mention the warning.

"He probably went to clear his head," Christian says.

One fewer place at breakfast. The commune hums around the absence like it was always part of the arrangement.`,
      },
    ],
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing_distant',
    stressModifiers: { exposure: 30, mask: 20 },
    visualEffects: [
      { type: 'vignette', intensity: 0.4 },
    ],
    next: 'day3_night',
  },

  // ═══════════════════════════════════════════════════
  // NIGHT
  // ═══════════════════════════════════════════════════
  {
    id: 'day3_night',
    day: 3,
    chapter: 'thinning',
    text: `Three people are gone now. Simon. Connie. Mark. Maybe Josh. The group that arrived five strong is down to two: you and Christian.

And Christian is drifting.

You can feel it — the way he leans toward the commune when they speak, the way his notebook fills with their words instead of yours. The way Maja's name appears in his conversations more than yours does.

The singing tonight is the loudest yet. Through the walls, it sounds like the whole earth is vibrating.

You put your hands on the mattress and feel it hum.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_deep_chant',
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.6 },
      { type: 'flowers_breathe', intensity: 0.4 },
    ],
    autoAdvanceMs: 5000,
    next: 'day3_end',
  },

  {
    id: 'day3_end',
    day: 3,
    chapter: 'thinning',
    text: `You dream you're at dinner. Everyone is there — Mark, Josh, Simon, Connie. They're eating. They're smiling.

But when you look closer, their smiles don't reach their eyes. Their eyes are closed. All of them.

They eat with their eyes closed, and the food on their plates is flowers.

You look down. Your plate is empty.

The women begin to hum.`,
    background: 'dream_meadow',
    ambientSound: 'dream_drone',
    transitionType: 'breathe',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.8 },
      { type: 'color_shift', intensity: 0.5 },
    ],
    autoAdvanceMs: 4000,
    next: 'day4_morning',
  },
]

export const DAY3_CHAPTER: Chapter = {
  id: 'thinning',
  day: 3,
  title: 'THE THINNING',
  subtitle: 'One fewer place at the table.',
  scenes: DAY3_SCENES,
  anchorScene: 'day3_morning',
  ritualScene: 'day3_midday',
  consequenceScene: 'day3_josh_goes',
}
