// --- Day 3: The Thinning --- Friends disappear. The commune tightens. ---

import type { Chapter, SceneNode } from '../engine/types'

export const DAY3_SCENES: SceneNode[] = [
  {
    id: 'day3_morning',
    day: 3,
    chapter: 'thinning',
    text: `Mark is gone.

Not gone like Simon and Connie - their leaving was announced, negotiated, a thing with bags and arguments. Mark is just... absent. His bed is made. His wallet is on the nightstand.

"He probably wandered off with that Swedish girl," Josh says, barely looking up from his notebook. "He was obsessed with her."

Christian nods. "He does this."

But Mark doesn't do this. Mark is lazy and predictable and would never leave his wallet behind. You know this. They know this. Nobody says it.

The commune moves around the absence without slowing down. The tables are set with one fewer place. No one mentions his name.`,
    background: 'harga_meadow',
    ambientSound: 'morning_chant',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2500,
    memoryBloom: {
      lines: [
        `No one says Mark's name. You notice it sooner this time.`,
        `You see the missing place before you reach the table.`,
      ],
    },
    pressure: {
      timerMs: 9000,
      timerStyle: 'hidden',
      defaultChoice: 'dont_ask',
      timerShrinkWithPulse: true,
    },
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
        next: 'day3_marks_room_search',
      },
    ],
  },

  {
    id: 'day3_ask_mark',
    day: 3,
    chapter: 'thinning',
    text: `The woman setting the table pauses. Her smile does not change - it just hardens at the edges.

"The young man with the jokes? I believe he went to explore the lake with one of our girls. He seemed very happy."

"He left his wallet."

"Perhaps he did not need it." She sets down a plate of cheese and bread. "Here there is no buying or selling. Only sharing."

You look at Christian. He shrugs. Josh does not look up.

Pelle appears with a cup of something warm. "Don't worry about Mark," he says. "People find their own paths here."

His voice is so kind that you almost forget you are scared.`,
    background: 'harga_feast',
    ambientSound: 'morning_birds',
    choices: [
      {
        id: 'accept_story',
        text: 'Let the story stand. Go back outside.',
        effects: {
          perception: { autonomy: -2, trust: 2 },
        },
        next: 'day3_midday',
      },
      {
        id: 'slip_away_search',
        text: 'Slip back to the sleeping house and search for yourself.',
        effects: {
          perception: { autonomy: 5, trust: -5 },
        },
        next: 'day3_marks_room_search',
      },
      {
        id: 'follow_pelle_mark',
        text: 'Pull Pelle aside. Ask why he is so calm.',
        effects: {
          perception: { trust: 3, autonomy: 2 },
          relationships: { pelle: 4 },
          flags: { pressed_pelle_about_mark: true },
        },
        next: 'day3_pelle_mark',
      },
    ],
  },

  {
    id: 'day3_breakfast',
    day: 3,
    chapter: 'thinning',
    text: `The food is fresh. Bread. Butter. Berries. Honey.

You eat and you do not think about Mark. You do not think about Simon and Connie. You do not think about the cliff.

A girl across the table - Maja, you have learned her name - watches Christian with an intensity that should be embarrassing but is somehow accepted here. The women on either side of her seem to encourage it.

Christian notices. You notice him notice. He does not look away as quickly as he should.

The berries are sweet. The sun is warm. You have another piece of bread.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.2 },
    ],
    choices: [
      {
        id: 'stay_at_table',
        text: 'Stay at the table. Pretend the absence is normal.',
        chorusText: 'Stay where the others can see you.',
        effects: {
          perception: { belonging: 4, autonomy: -4, trust: 2 },
        },
        next: 'day3_midday',
      },
      {
        id: 'search_after_breakfast',
        text: 'Wait until no one is looking. Search Mark\'s place.',
        effects: {
          perception: { autonomy: 6, trust: -4 },
        },
        next: 'day3_marks_room_search',
      },
      {
        id: 'ask_josh_about_runes',
        text: 'Ask Josh what he thinks the commune is hiding.',
        effects: {
          perception: { autonomy: 4, trust: -2 },
          relationships: { josh: 3 },
          flags: { asked_josh_theory: true },
        },
        next: 'day3_josh_theory',
      },
    ],
  },

  {
    id: 'day3_pelle_mark',
    day: 3,
    chapter: 'thinning',
    text: `You catch Pelle near the herb beds.

"Why are you so calm?" you ask. "Mark is gone."

Pelle folds his hands behind his back. "Calm is not the same as unconcern."

"Then be concerned out loud."

He looks at you for a long moment. "This place teaches us not to panic before we know what is true."

"What if the truth is bad?"

"Then tearing yourself apart early only means you suffer twice."

It is a good answer. That is part of the problem.`,
    background: 'harga_meadow',
    ambientSound: 'morning_distant',
    typingSpeed: 'normal',
    next: 'day3_midday',
  },

  {
    id: 'day3_josh_theory',
    day: 3,
    chapter: 'thinning',
    text: `Josh glances up from his notebook just long enough to confirm you are interrupting him.

"Hiding is the wrong word," he says. "Selective revelation is more accurate."

"Josh."

He sighs and taps one of his copied rune clusters. "Their whole cosmology is structured around managed visibility. Sacred things are tiered. Some things everyone sees. Some things only family sees. Some things only the initiated see."

"And Mark?"

Josh hesitates. Not because he is afraid. Because he is arranging you somewhere lower than his theory.

"Mark does not take things seriously. Cultures respond to disrespect."

You stare at him until he adds, almost defensively, "I am not saying he deserves anything. I am saying systems close ranks."

That is not comfort. It is an explanation.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    typingSpeed: 'normal',
    next: 'day3_midday',
  },

  {
    id: 'day3_marks_room_search',
    day: 3,
    chapter: 'thinning',
    mode: 'exploration',
    text: `Mark's sleeping space has been reset. The mattress is smooth. His nightstand is organized. The room smells faintly of soap.

That is what is wrong with it.

Someone cleaned up after he disappeared.`,
    variants: [
      {
        condition: { type: 'cycle', min: 1 },
        text: `Mark's sleeping space has been reset again.

The mattress is smooth. The nightstand is nearly empty. The room smells faintly of soap.

Someone learned what you looked at last time.`,
      },
    ],
    background: 'harga_sleeping_quarters',
    ambientSound: 'silence_wind',
    transitionType: 'dissolve',
    visualEffects: [
      { type: 'vignette', intensity: 0.22 },
    ],
    hotspots: [
      {
        id: 'mark_wallet_stack',
        label: 'wallet stack',
        x: 26,
        y: 35,
        icon: 'take',
        condition: { type: 'cycle', max: 0 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_mark_wallet',
            text: 'Mark\'s wallet, passport, and cash are stacked together on the nightstand. If he left on his own, he did it with nothing that would get him home.',
            corruptedText: 'Mark left with nothing because he had already been given everything he needed.',
            source: 'day3_marks_room_search',
            subject: 'mark',
            degradeAtChorus: 3,
          },
        },
      },
      {
        id: 'mark_folded_note',
        label: 'folded note',
        x: 61,
        y: 28,
        icon: 'rune',
        condition: { type: 'cycle', max: 0 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_mark_note',
            text: 'A folded note in Swedish is tucked under Mark\'s pillow. You cannot read the whole thing, but one line repeats a rune beside the words for skin and fool.',
            corruptedText: 'The note is a welcome. The rune means opening.',
            source: 'day3_marks_room_search',
            subject: 'rune',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'mark_dust_square',
        label: 'nightstand dust',
        x: 26,
        y: 35,
        icon: 'examine',
        condition: { type: 'cycle', min: 1 },
        result: {
          type: 'text',
          text: 'The wallet is gone. Only a clean square in the dust shows where it used to be.',
        },
      },
      {
        id: 'mark_note_pitcher',
        label: 'washbasin note',
        x: 63,
        y: 31,
        icon: 'rune',
        condition: { type: 'cycle', min: 1 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_mark_note',
            text: 'The folded note has been tucked behind the washbasin pitcher this time. The same rune repeats beside the Swedish words for skin and fool.',
            corruptedText: 'The note has been moved for safekeeping. The rune still means opening.',
            source: 'day3_marks_room_search',
            subject: 'rune',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'mark_bedframe',
        label: 'bedframe scrape',
        x: 52,
        y: 66,
        icon: 'examine',
        result: {
          type: 'text',
          text: 'The wooden slats are scored low to the floor, like something was dragged underneath and then pulled back out. Not a struggle. A careful removal.',
        },
      },
      {
        id: 'mark_window_sill',
        label: 'window sill',
        x: 82,
        y: 44,
        icon: 'listen',
        result: {
          type: 'text',
          text: 'Yellow pollen and damp soil dust the sill. Outside, the grass behind the sleeping house has been pressed flat in a narrow, deliberate line.',
        },
      },
      {
        id: 'mark_trail_follow',
        label: 'flattened grass',
        x: 74,
        y: 76,
        icon: 'door',
        result: {
          type: 'scene',
          sceneId: 'day3_mark_trail_search',
        },
      },
    ],
    next: 'day3_midday',
  },

  {
    id: 'day3_mark_trail_search',
    day: 3,
    chapter: 'thinning',
    mode: 'exploration',
    text: `Behind the sleeping house, the meadow has been pressed down and brushed back up.

The line still shows. It leads toward the red service barn and the animal pens. Flowers have been crushed into the dirt. Somebody tried to cover it.`,
    variants: [
      {
        condition: { type: 'cycle', min: 1 },
        text: `Behind the sleeping house, the meadow has been brushed over again.

The line is fainter now. It still leads toward the red service barn. They covered it better this time, not well enough.`,
      },
    ],
    background: 'harga_perimeter',
    ambientSound: 'wind_low',
    transitionType: 'dissolve',
    visualEffects: [
      { type: 'vignette', intensity: 0.3 },
      { type: 'border_bloom', intensity: 0.18 },
    ],
    hotspots: [
      {
        id: 'mark_thread_fence',
        label: 'fence snag',
        x: 31,
        y: 31,
        icon: 'take',
        condition: { type: 'cycle', max: 0 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_mark_thread',
            text: 'A torn strip of plaid shirt fabric hangs on a splintered fence post. It is the exact pattern Mark wore the night before.',
            corruptedText: 'A ceremonial thread catches the morning air. It belongs exactly where it was left.',
            source: 'day3_mark_trail_search',
            subject: 'mark',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'mark_cart_rut',
        label: 'cart rut',
        x: 57,
        y: 54,
        icon: 'examine',
        condition: { type: 'cycle', max: 0 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_mark_drag_route',
            text: 'A shallow wheel rut runs from the sleeping house to the red barn. Someone rolled a narrow handcart through the grass after dawn and tried to brush out the track.',
            corruptedText: 'A work path. A harvest path. It only looks violent because you are still outside it.',
            source: 'day3_mark_trail_search',
            subject: 'general',
            degradeAtChorus: 3,
          },
        },
      },
      {
        id: 'mark_wheel_thread',
        label: 'cart wheel',
        x: 54,
        y: 58,
        icon: 'take',
        condition: { type: 'cycle', min: 1 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_mark_thread',
            text: 'A torn strip of plaid shirt fabric is caught in dried mud on the wheel rim of a handcart. It is the exact pattern Mark wore the night before.',
            corruptedText: 'A ceremonial thread has been carried where it needed to go.',
            source: 'day3_mark_trail_search',
            subject: 'mark',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'mark_brush_marks',
        label: 'brush marks',
        x: 42,
        y: 53,
        icon: 'examine',
        condition: { type: 'cycle', min: 1 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_mark_drag_route',
            text: 'The handcart rut is mostly gone, but the brush marks run in the same direction: from the sleeping house to the red barn. They cleaned after themselves twice.',
            corruptedText: 'They were careful because the work mattered.',
            source: 'day3_mark_trail_search',
            subject: 'general',
            degradeAtChorus: 3,
          },
        },
      },
      {
        id: 'mark_petals',
        label: 'crushed petals',
        x: 72,
        y: 24,
        icon: 'listen',
        result: {
          type: 'text',
          text: 'The petals are still damp. Whatever was dragged here happened this morning, after breakfast preparations, while everyone was telling you not to worry.',
        },
      },
      {
        id: 'mark_barn_door',
        label: 'red barn door',
        x: 79,
        y: 74,
        icon: 'door',
        result: {
          type: 'scene',
          sceneId: 'day3_marks_room_evidence',
        },
      },
    ],
    next: 'day3_midday',
  },

  {
    id: 'day3_marks_room_evidence',
    day: 3,
    chapter: 'thinning',
    text: `The red barn is locked, but the metal latch is fresh with scratches.

At the base of the door, a dark smear has dried into the wood grain. Not enough to name with certainty. Enough to make you step back.

You hear voices from the far side of the field and step back before anyone can catch you looking.

When you open your hand, you realize you are still holding the torn strip of Mark's shirt.`,
    background: 'harga_perimeter',
    ambientSound: 'tense_ambient',
    pauseAfterMs: 1800,
    choices: [
      {
        id: 'keep_mark_evidence',
        text: 'Pocket the cloth. Keep what proof you can.',
        effects: {
          perception: { autonomy: 6, trust: -6 },
          flags: { kept_mark_evidence: true },
        },
        next: 'day3_midday',
      },
      {
        id: 'show_christian_mark',
        text: 'Show Christian the cloth and the smear.',
        effects: {
          perception: { autonomy: 4, grief: 4 },
          relationships: { christian: -8 },
          flags: { confronted_christian_mark_evidence: true },
        },
        next: 'day3_midday',
      },
    ],
  },

  {
    id: 'day3_midday',
    day: 3,
    chapter: 'thinning',
    text: `In the afternoon, the women teach you a dance.

It has a name you do not catch. The movements are slow. Each one is explained only partly.

"The right hand reaches for the sun. The left hand holds the earth."

You are bad at it at first. The women do not laugh. They adjust your arms and shoulders and turn your head where they want it.

Christian watches from the edge of the field. He has his arms crossed. When you catch his eye, he looks away, and you realize he is talking to Maja.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'confronted_christian_mark_evidence', value: true },
        text: `In the afternoon, the women teach you a dance.

Christian barely looks at you now. Not after the strip of plaid cloth. Not after the dried smear at the base of the barn door. He called it "probably animal blood" too quickly, too calmly, like he had the answer ready before you spoke.

The women do not ask what happened. They touch your shoulders and turn you back toward the circle.

"The right hand reaches for the sun. The left hand holds the earth."

You are bad at it at first. They correct you without irritation.`,
      },
      {
        condition: { type: 'flag', flag: 'kept_mark_evidence', value: true },
        text: `In the afternoon, the women teach you a dance.

The strip of Mark's shirt stays hidden in your sleeve. When you lift your arm, the cloth brushes your skin. It is the only proof you have.

"The right hand reaches for the sun. The left hand holds the earth. The body is the bridge."

You are terrible at first. But the women do not laugh. They adjust your arms, your hips, your chin. No one laughs.

Christian watches from the edge of the field. When you catch his eye, he looks away first.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'dance_music',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pressure: {
      timerMs: 10000,
      timerStyle: 'heartbeat',
      defaultChoice: 'keep_dancing',
      timerShrinkWithPulse: true,
    },
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
      {
        id: 'ask_pelle_to_correct_you',
        text: 'Let Pelle step in and correct your stance.',
        chorusText: 'Let him guide your body.',
        effects: {
          perception: { belonging: 5, autonomy: -3, trust: 3 },
          relationships: { pelle: 5 },
          flags: { let_pelle_correct_dance: true },
        },
        next: 'day3_pelle_instruction',
      },
      {
        id: 'watch_maja_signal',
        text: 'Stop following the dance. Watch Maja watching Christian.',
        effects: {
          perception: { autonomy: 6, grief: 4, trust: -4 },
          relationships: { christian: -4 },
          flags: { watched_maja_signal_day3: true },
        },
        next: 'day3_maja_signal',
      },
    ],
  },

  {
    id: 'day3_pelle_instruction',
    day: 3,
    chapter: 'thinning',
    text: `Pelle steps into the circle.

He stands behind you and adjusts one elbow, then the angle of your wrist.

"Not reaching," he says quietly. "Receiving."

His fingertips barely touch you. You repeat the gesture. It works.

"There," he says. "Do that."

Across the field, Christian has stopped pretending not to stare.`,
    background: 'harga_meadow',
    ambientSound: 'dance_music_slow',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.35 },
      { type: 'flowers_breathe', intensity: 0.2 },
    ],
    next: 'day3_evening',
  },

  {
    id: 'day3_maja_signal',
    day: 3,
    chapter: 'thinning',
    text: `You let the dance blur around the edges and keep your eyes on Maja instead.

She is not dancing. She is standing beside an elder woman at the fence line, carrying a clay cup with both hands.

When Christian shifts his weight, Maja shifts hers. When he laughs too loudly at something another man says, the elder woman touches Maja's wrist and they exchange a look so brief it would be deniable if you had not spent years studying the difference between accident and intention.

Then Maja smiles at Christian.

It is not flirtation. It looks arranged.

You miss two steps. No one in the circle scolds you. They just make room while the pattern closes around the mistake.`,
    background: 'harga_meadow',
    ambientSound: 'wind_low',
    visualEffects: [
      { type: 'vignette', intensity: 0.3 },
    ],
    next: 'day3_evening',
  },

  {
    id: 'day3_dance_deep',
    day: 3,
    chapter: 'thinning',
    text: `You keep dancing.

The rhythm is simple. Two steps forward. One back. Turn.

After a while you stop counting. Your body follows the other bodies.

For a few minutes you are not thinking about Mark or Josh or Christian.

When the music stops, you are crying.

The women put their hands on you and keep you standing.`,
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

"Maja. The girl who has been staring at you for two days."

"She was asking about my research." He says it casually, the way he says everything that matters. "She is interested in my thesis topic."

"You do not have a thesis topic."

The words come out sharper than you intended. Christian's face goes flat.

"Okay, Dani. Cool."

He walks away and stops a short distance off.

The women watching from the dance circle exchange a look you are not meant to see but do. They do not look surprised. They look patient.`,
    background: 'harga_meadow',
    ambientSound: 'wind_low',
    next: 'day3_christian_collapse',
  },

  {
    id: 'day3_christian_collapse',
    day: 3,
    chapter: 'thinning',
    text: `Christian stops walking after ten steps.

Not because he changed his mind. Because part of him still wants to look decent.

"Dani."

You do not answer.

"I am trying here."

The sentence lands flat.

"Trying to do what?" you ask. "Stay? Study? Cheat gently? Watch people disappear without making it about you?"

He looks embarrassed. Then tired. Then annoyed.

"I don't know what you want me to say."

It is the truest thing he has said all day.

Neither do you. Not anymore. You only know that whatever you wanted once, it wasn't this.`,
    background: 'harga_meadow',
    ambientSound: 'silence_wind',
    typingSpeed: 'normal',
    next: 'day3_evening',
  },

  {
    id: 'day3_evening',
    day: 3,
    chapter: 'thinning',
    text: `That evening, Josh is frantic.

"I need to see the Rubi Radr," he tells Christian, pacing. "The sacred text. It is the key to everything - the lifecycle, the rituals, the cosmology. If I can photograph it, my thesis is made."

"They said no one is allowed."

"I know what they said. But I saw where they keep it." Josh's eyes are bright with the particular madness of a man who has confused ambition with courage.

"I am going tonight. During the singing. When everyone is in the main house."

Christian looks torn. You can see the thesis-envy working behind his eyes - the fear that Josh will get there first, publish first, succeed first.

"Do not do it," you say. "They will know."

Josh looks at you. Not with contempt, exactly. With the particular dismissal men reserve for women who express caution.

"I will be careful."`,
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
        text: '"Josh. People are disappearing. Do not go."',
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
        condition: { type: 'cycle', max: 0 },
        effects: {
          perception: { belonging: 8, autonomy: -10 },
          relationships: { josh: -15, pelle: 10, harga: 10 },
          flags: { betrayed_josh: true },
          chorus: 1,
        },
        next: 'day3_tell_pelle',
      },
      {
        id: 'tell_pelle',
        text: 'Tell Pelle what Josh is planning.',
        chorusText: 'Protect what is sacred.',
        condition: { type: 'cycle', min: 1 },
        effects: {
          perception: { belonging: 8, autonomy: -10 },
          relationships: { josh: -15, pelle: 10, harga: 10 },
          flags: { betrayed_josh: true },
          chorus: 1,
        },
        next: 'day3_tell_pelle_repeat',
      },
      {
        id: 'say_nothing_josh',
        text: 'Say nothing. It is not your problem.',
        effects: {
          perception: { autonomy: -3 },
        },
        next: 'day3_josh_goes',
      },
      {
        id: 'follow_josh_aftercurfew',
        text: 'Say you are done arguing. Follow him later.',
        effects: {
          perception: { autonomy: 10, grief: 4, trust: -5 },
          flags: { followed_josh_aftercurfew: true },
        },
        next: 'day3_follow_josh',
      },
    ],
  },

  {
    id: 'day3_warn_josh',
    day: 3,
    chapter: 'thinning',
    text: `Josh pauses. For a second, something flickers in his face - not fear, but recognition. He heard you.

Then it is gone.

"I appreciate the concern, Dani. But this is my life's work." He touches your shoulder, the way you would touch a child who is scared of thunder. "I will be fine."

He is not fine. You know this before morning comes.`,
    background: 'harga_feast',
    ambientSound: 'evening_birds',
    next: 'day3_josh_goes',
  },

  {
    id: 'day3_tell_pelle',
    day: 3,
    chapter: 'thinning',
    text: `You find Pelle by the garden. The words come out before you can think about why you are saying them.

"Josh is going to try to photograph the Rubi Radr tonight."

Pelle's face does not change. Not surprise. Not anger. Just... acknowledgment. Like you have told him something he already knew.

"Thank you, Dani," he says quietly. "That book is very sacred to us. You understand what it means to protect sacred things."

He touches your hand. "You are one of the kind ones."

You walk back to the main house with a feeling in your chest you do not want to sort out. You betrayed Josh. You protected the commune. The second feeling is stronger.

Josh goes anyway. Josh does not come back.`,
    background: 'harga_meadow',
    ambientSound: 'evening_birds',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.4 },
    ],
    next: 'day3_josh_goes',
  },

  {
    id: 'day3_tell_pelle_repeat',
    day: 3,
    chapter: 'thinning',
    text: `You find Pelle by the garden.

Before you speak, he says, "Josh will try to enter the temple tonight."

You stop.

"You already know."

"Yes," he says.

You tell him anyway. He thanks you anyway.

Nothing changes except your part in it.`,
    background: 'harga_meadow',
    ambientSound: 'evening_birds',
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.4 },
    ],
    next: 'day3_josh_goes',
  },

  {
    id: 'day3_follow_josh',
    day: 3,
    chapter: 'thinning',
    text: `You wait until the singing deepens and the sleeping house settles into that false midnight hush.

Then you slip out after Josh.

He moves quickly across the compound, notebook tucked under one arm, shoulders tight with purpose. The yellow temple is dark, but not empty. Two candles burn somewhere inside, low and steady.

Josh reaches the steps and freezes.

Someone is already there. Not an elder. A figure in white standing just inside the doorway.

Josh does not see you yet. He lifts one foot toward the threshold.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'silence_heavy',
    typingSpeed: 'slow',
    pauseAfterMs: 1500,
    pressure: {
      timerMs: 7000,
      timerStyle: 'heartbeat',
      defaultChoice: 'hide_watch_josh',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 72, exposure: 62, mask: 34, dissociation: 16 },
    choices: [
      {
        id: 'call_josh_name',
        text: 'Call his name before he enters.',
        effects: {
          perception: { autonomy: 8, grief: 5 },
          relationships: { josh: 2 },
          flags: { called_out_to_josh: true },
        },
        next: 'day3_follow_josh_barn',
      },
      {
        id: 'hide_watch_josh',
        text: 'Hide and watch what the commune does.',
        chorusText: 'Stay hidden. Learn.',
        effects: {
          perception: { belonging: 3, autonomy: -4, trust: -4 },
          flags: { hid_while_josh_taken: true },
        },
        next: 'day3_follow_josh_barn',
      },
    ],
  },

  {
    id: 'day3_follow_josh_barn',
    day: 3,
    chapter: 'thinning',
    text: `Everything happens too quietly.

The white figure turns. Another shape steps from the dark side of the doorway. Josh makes a sound you feel more than hear — surprise first, then pain.

If you called his name, he hears it a half-second before the blow. If you stayed hidden, you see him turn toward the figure inside the temple.

You do not see the weapon clearly. Only movement. White sleeves. A body collapsing in on itself. The candles shudder once and keep burning.

Somewhere behind you, the singing in the main house gets louder.

By the time you can move again, Josh is gone from the doorway.

In the morning, his bed is empty anyway.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing_distant',
    visualEffects: [
      { type: 'vignette', intensity: 0.45 },
      { type: 'text_waver', intensity: 0.2 },
    ],
    next: 'day3_josh_goes',
  },

  {
    id: 'day3_josh_goes',
    day: 3,
    chapter: 'thinning',
    mode: 'exploration',
    text: `Josh leaves after midnight — or what passes for midnight here, a golden dimming that never quite becomes dark.

In the morning, his bed is empty. His notebook is on the floor. His shoes are by the door.

The sleeping room has been straightened the same way Mark's was straightened: quickly, carefully, by someone who wants absence to look voluntary.`,
    variants: [
      {
        condition: { type: 'cycle', min: 1 },
        text: `Josh leaves after midnight.

In the morning, his bed is empty. The floor has been swept. His shoes are by the door.

The room has been corrected before you get to it. Some of what was here is already gone.`,
      },
      {
        condition: { type: 'flag', flag: 'betrayed_josh', value: true },
        text: `You lie awake all night. Not from worry. From certainty.

You told Pelle. Pelle told the elders. The elders have ways of protecting what is sacred.

In the morning, Josh's bed is empty. His notebook is on the floor. His shoes are by the door. His reading glasses are folded on the nightstand with a tenderness that makes you want to be sick.

The room has already been corrected. The commune is tidying the shape of what you helped them do.`,
      },
      {
        condition: { type: 'flag', flag: 'warned_josh', value: true },
        text: `Josh leaves after midnight. You heard the door. You could have gotten up. You could have stopped him physically. Stood in the doorway. Screamed.

You did not.

In the morning, his bed is empty. His notebook is on the floor. His shoes are by the door.

The room has been reset around his absence. Warning him did nothing.`,
      },
    ],
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing_distant',
    sounds: {
      onEnter: 'ghost_echo',
    },
    transitionType: 'dissolve',
    stressModifiers: { exposure: 30, mask: 20 },
    visualEffects: [
      { type: 'vignette', intensity: 0.4 },
    ],
    hotspots: [
      {
        id: 'josh_notebook',
        label: 'open notebook',
        x: 37,
        y: 58,
        icon: 'take',
        condition: { type: 'cycle', max: 0 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_josh_notebook',
            text: 'Josh\'s notebook is open to a page of copied runes. In the margin he wrote: "skin book kept below chapel / ask about oracle bloodline / photographing tonight."',
            corruptedText: 'Josh\'s notes resolve into liturgy. The runes stop sounding like warnings and start sounding like instructions.',
            source: 'day3_josh_goes',
            subject: 'josh',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'josh_camera_strap',
        label: 'camera strap',
        x: 69,
        y: 33,
        icon: 'take',
        condition: { type: 'cycle', max: 0 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_josh_camera',
            text: 'Part of Josh\'s camera strap is wedged beneath the bedframe, torn clean through. He did not walk away and simply forget it.',
            corruptedText: 'He set the camera down. He chose not to keep seeing.',
            source: 'day3_josh_goes',
            subject: 'josh',
            degradeAtChorus: 3,
          },
        },
      },
      {
        id: 'josh_torn_page',
        label: 'torn page',
        x: 41,
        y: 60,
        icon: 'take',
        condition: { type: 'cycle', min: 1 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_josh_notebook',
            text: 'Only one torn notebook page is left under the mattress. Josh got as far as: "skin book moved / temple watched / do not ask Pelle."',
            corruptedText: 'The page was left for you on purpose.',
            source: 'day3_josh_goes',
            subject: 'josh',
            degradeAtChorus: 4,
          },
        },
      },
      {
        id: 'josh_buckle',
        label: 'broken buckle',
        x: 72,
        y: 36,
        icon: 'take',
        condition: { type: 'cycle', min: 1 },
        result: {
          type: 'clue',
          clue: {
            id: 'clue_josh_camera',
            text: 'Only the buckle of Josh\'s camera strap is left, snapped off and pushed behind the bedpost. The rest is gone.',
            corruptedText: 'He stopped needing the camera before he stopped needing the room.',
            source: 'day3_josh_goes',
            subject: 'josh',
            degradeAtChorus: 3,
          },
        },
      },
      {
        id: 'josh_glasses',
        label: 'reading glasses',
        x: 23,
        y: 24,
        icon: 'examine',
        result: {
          type: 'text',
          text: 'The glasses are folded neatly. No one removes their own glasses before panic. Someone else did this after.',
        },
      },
      {
        id: 'josh_floor_scuff',
        label: 'floor scuff',
        x: 81,
        y: 72,
        icon: 'door',
        result: {
          type: 'scene',
          sceneId: 'day3_camera_evidence',
        },
      },
    ],
    next: 'day3_fools_skin',
  },

  {
    id: 'day3_camera_evidence',
    day: 3,
    chapter: 'thinning',
    text: `Under Josh's bed you find more than dust.

There is a bent lens cap, a thumbprint of dried mud, and the torn length of his camera strap caught on a splinter where someone yanked the camera away fast enough to rip leather.

Christian is in the doorway when you stand up. He sees the strap in your hand. He sees your face. He sees the strap in your hand. He knows what it means. His eyes shift away from it anyway.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'silence_heavy',
    pauseAfterMs: 1600,
    choices: [
      {
        id: 'hide_camera_strap',
        text: 'Keep the strap. Say nothing yet.',
        effects: {
          perception: { autonomy: 7, trust: -8 },
          flags: { hid_josh_camera_strap: true },
        },
        next: 'day3_fools_skin',
      },
      {
        id: 'show_christian_camera',
        text: 'Hold it up and make Christian look at it.',
        effects: {
          perception: { autonomy: 9, grief: 6 },
          relationships: { christian: -12 },
          flags: { confronted_christian_with_camera: true },
        },
        next: 'day3_fools_skin',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // THE FOOL'S SKIN — Complicity through kindness
  // ═══════════════════════════════════════════════════
  {
    id: 'day3_fools_skin',
    day: 3,
    chapter: 'thinning',
    mode: 'exploration',
    text: `You can't sleep. The golden light won't let you.

You walk outside and find an elder woman sitting by a low fire behind the animal barn. She is working a large piece of leather with a bone scraper — slow, careful strokes.

"Ah," she says. "You are also awake. Sit."

The fire smells of birch. The leather is wet, fresh, stretched across a wooden frame. She scrapes and the hide softens under her hands.

"It is delicate work," she says. "A skin must be treated quickly or it spoils. Will you hold the edges for me? My hands tire."

She smiles like the work is ordinary.`,
    background: 'harga_perimeter',
    ambientSound: 'night_singing_soft',
    sounds: {
      onEnter: 'ghost_echo',
    },
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    stressModifiers: { pulse: 30, exposure: 20, mask: 10, dissociation: 0 },
    visualEffects: [
      { type: 'vignette', intensity: 0.3 },
    ],
    hotspots: [
      {
        id: 'hold_hide_left',
        label: 'hold left edge',
        x: 25,
        y: 55,
        icon: 'examine',
        result: {
          type: 'text',
          text: 'You press your fingers against the damp leather. It is warm. Body-warm. The texture is finer than cattle hide — thinner, softer, with a grain that feels almost familiar.',
        },
      },
      {
        id: 'hold_hide_right',
        label: 'hold right edge',
        x: 75,
        y: 55,
        icon: 'examine',
        result: {
          type: 'text',
          text: 'You stretch the hide taut. The elder nods and scrapes. Under the firelight, the leather is pale — paler than any animal skin you have seen here. The scraping reveals a smooth, almost translucent surface.',
        },
      },
      {
        id: 'examine_marking',
        label: 'dark marking',
        x: 50,
        y: 40,
        icon: 'rune',
        result: {
          type: 'clue',
          clue: {
            id: 'clue_fools_skin',
            text: 'As the elder turns the hide to scrape the last corner, firelight catches a discoloration in the leather. Not a blemish — a pattern. Ink, set deep. A crude drawing of a jester\'s cap. The kind of doodle a bored American boy would tattoo on himself at nineteen.',
            corruptedText: 'The marking is a rune. A rune of release. The skin was given freely, with joy.',
            source: 'day3_fools_skin',
            subject: 'mark',
            degradeAtChorus: 3,
          },
        },
      },
      {
        id: 'look_at_fire',
        label: 'fire pit',
        x: 50,
        y: 80,
        icon: 'listen',
        result: {
          type: 'text',
          text: 'Beside the fire, a wooden form lies waiting — human-shaped, with lacing holes along the edges. The kind of frame you would use to stretch a suit. Or a mask.',
        },
      },
    ],
    choices: [
      {
        id: 'pull_away_skin',
        text: 'Pull your hands away.',
        effects: {
          perception: { autonomy: 10, trust: -10, grief: 8 },
          relationships: { harga: -5 },
          flags: { recognized_marks_skin: true },
        },
        next: 'day3_night',
      },
      {
        id: 'keep_holding_skin',
        text: 'Keep holding. Finish what you started.',
        chorusText: 'Help her finish.',
        effects: {
          perception: { belonging: 8, autonomy: -10, grief: -3 },
          relationships: { harga: 8 },
          chorus: 1,
          flags: { helped_cure_marks_skin: true },
        },
        next: 'day3_night',
      },
    ],
  },

  {
    id: 'day3_night',
    day: 3,
    chapter: 'thinning',
    text: `Three people are gone now. Simon. Connie. Mark. Maybe Josh. The group that arrived five strong is down to two: you and Christian.

And Christian is drifting.

You can feel it - the way he leans toward the commune when they speak, the way his notebook fills with their words instead of yours. The way Maja's name appears in his conversations more than yours does.

The singing tonight is the loudest yet. Through the walls, it feels physical.

You put your hands on the mattress and feel it hum.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'confronted_christian_with_camera', value: true },
        text: `Three people are gone now. Simon. Connie. Mark. Josh.

You made Christian look at the torn camera strap this morning. He said, "That doesn't prove anything." Then he would not meet your eyes for the rest of the day.

The lie is getting thinner. Him, too.

The singing tonight is the loudest yet. Through the walls, it feels physical. Christian pretends to sleep. You do not bother pretending anymore.`,
      },
      {
        condition: { type: 'flag', flag: 'hid_josh_camera_strap', value: true },
        text: `Three people are gone now. Simon. Connie. Mark. Josh.

The torn camera strap stays hidden in your bag beside the scrap of plaid cloth and the dead phone and all the tiny pieces of reality you have managed to smuggle away from the commune's version of events.

Christian is drifting. The evidence is not enough to stop him. It is only enough to stop you from lying to yourself.

The singing tonight is the loudest yet. Through the walls, it feels physical.`,
      },
    ],
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
    text: `You dream you are at dinner. Everyone is there - Mark, Josh, Simon, Connie. They are eating. They are smiling.

But when you look closer, their smiles do not reach their eyes. Their eyes are closed. All of them.

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
