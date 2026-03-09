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

"Your thesis." Your voice is flat.

"Our flight isn't for another week, Dani."`,
    variants: [
      {
        condition: { type: 'flag', flag: 'confronted_christian_with_camera', value: true },
        text: `Christian apologizes.

"I know how it looked," he says. He does not say Josh's name first. He does not say Mark's. He starts with optics, which feels exactly right.

You think of the torn camera strap in your hand on Day 3. You think of forcing him to look at it. You think of him saying, "That does not prove anything," as if proof was the issue and not cowardice.

"I don't know what happened," he says. "The tea - I think they put something in it. I didn't plan-"

"You never plan anything," you say. "That is your whole life. Things happen around you and afterward you call it confusion."

He flinches, but not enough.

"Are you leaving?" you ask.

Christian hesitates. One second. Two. The same pause he had when Mark vanished. When Josh vanished. When you asked him to leave.

"Our flight isn't for another week, Dani."

Even now, he says flight. Schedule. Logistics. Not escape.`,
      },
      {
        condition: { type: 'flag', flag: 'hid_josh_camera_strap', value: true },
        text: `Christian apologizes.

The torn camera strap is still hidden in your bag. It feels heavier now than when you found it.

"I don't know what happened," he says, standing in the doorway with his hands in his pockets, looking at the floor. "The tea - I think they put something in it. I didn't plan-"

"Josh didn't plan to vanish either."

Christian goes still.

"Dani..."

"Are you leaving?" you ask. "Are we leaving? Together? Right now?"

He hesitates. One second. Two. The hesitation is the answer.

"Our flight isn't for another week, Dani."

You realize he is asking time to do the work that courage should do for him.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'morning_birds',
    sounds: {
      onChoicesReveal: 'timer_urgent',
    },
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    memoryBloom: {
      lines: [
        `The apology does not change anything. You know where the pause is coming.`,
        `He says the same line again. It sounds weaker every time.`,
      ],
    },
    pressure: {
      timerMs: 15000,
      timerStyle: 'hidden',
      defaultChoice: 'accept_stay',
      timerShrinkWithPulse: true,
    },
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
        id: 'make_him_say_maja',
        text: 'Make him say Maja\'s name out loud.',
        effects: {
          perception: { autonomy: 5, grief: 6, trust: -3 },
          relationships: { christian: -10 },
          flags: { made_christian_say_maja_day5: true },
        },
        next: 'day5_morning_maja',
      },
      {
        id: 'ask_about_missing_friends',
        text: 'Ask him where Josh and Mark are.',
        effects: {
          perception: { autonomy: 8, trust: -6, grief: 3 },
          relationships: { christian: -8, harga: -2 },
          flags: { questioned_missing_friends_day5: true },
        },
        next: 'day5_morning_missing',
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

Once you say it, the room settles.

The women bring you tea. Chamomile. Honey. No one says what happened last night.

"The dance is tomorrow," one of them says. "The dance of the May Queen. All young women are invited."

"What does the May Queen do?"

"She crowns the summer. She chooses the sacrifice. She becomes the face of the Hårga for a year."

You drink it anyway.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds',
    next: 'day5_afternoon',
  },

  {
    id: 'day5_try_leave',
    day: 5,
    chapter: 'descent',
    text: `You pack your bag. Your dead phone. The family photo. Clothes that smell like flowers.

You walk to the gate.

It's not locked. There are no guards. The road stretches out through the meadow, through the woods, to the highway eighteen kilometers away.

You stand there for ten minutes.

Behind you, the singing has started again.

The road leads back to New York. Back to the apartment. Back to the boxes. Back to Christian.

You turn around.

The commune is right where you left it. The gate is open. A child waves.

"I knew you'd come back," Pelle says from behind you. "This is where you belong, Dani."

You feel relief before you can stop it.`,
    background: 'harga_gate',
    ambientSound: 'wind_low',
    visualEffects: [
      { type: 'sun_pulse', intensity: 0.3 },
    ],
    next: 'day5_afternoon',
  },

  {
    id: 'day5_morning_maja',
    day: 5,
    chapter: 'descent',
    text: `You do not let him hide inside the passive voice.

"Say her name."

Christian blinks. "What?"

"Say her name. If this was confusion, if this was the tea, if you have a version of this that leaves you decent, then start with the simplest part. Say her name."

His throat moves.

"Maja," he says finally, and even then it sounds reluctant, as if the name itself might implicate him more than the act.

"Thank you," you say. "Now at least one person in this room is willing to admit another person exists."

He looks hurt by that. Not ashamed. Hurt. The distinction clarifies everything.

Outside, women are laughing over basins of flowers. The day keeps moving with or without your humiliation. The commune is very good at that.`,
    background: 'harga_meadow',
    ambientSound: 'morning_birds',
    transitionType: 'dissolve',
    next: 'day5_afternoon',
  },

  {
    id: 'day5_morning_missing',
    day: 5,
    chapter: 'descent',
    text: `"Where are Josh and Mark?"

Christian's whole body tightens, not with grief but with inconvenience.

"Dani, I don't know."

"You don't know, or you didn't ask?"

"People leave. Things are... strange here."

"Josh left without his notes?" you ask. "Mark left without making noise about it? Christian, Mark made noise opening a bag of chips. He did not vanish elegantly."

Christian presses thumb to forehead. "I can't do this right now."

You realize he means the conversation, not the disappearances.

Past him, the lane between buildings is busy with ordinary work: linens snapped clean in the sun, children carrying bowls, old women sorting flowers by color. The village has perfected the look of a place where nothing bad has ever needed cleaning up.`,
    background: 'harga_meadow',
    ambientSound: 'morning_birds',
    transitionType: 'dissolve',
    next: 'day5_afternoon',
  },

  {
    id: 'day5_afternoon',
    day: 5,
    chapter: 'descent',
    text: `By afternoon, the commune has decided something about you.

Not with an announcement. With attention.

Two women bring you to a shaded table where garlands are being woven for tomorrow. Another kneels to measure the hem of a white dress against your ankle. They do not ask whether you plan to dance. They fit the dress as though the answer is already settled.

Across the yard, Christian sits with a notebook open on his knee. Maja pours more tea. An elder leans over the page, pointing to a runic diagram. Christian's face is alive in the familiar, painful way it gets when he thinks he's touching original material.

Pelle appears beside you with a bowl of strawberries. "Today you are not a guest," he says. "Tomorrow you will understand why."`,
    variants: [
      {
        condition: { type: 'flag', flag: 'tried_to_leave_alone', value: true },
        text: `When you return from the gate, the commune receives your return without comment. That is worse than triumph would have been.

By afternoon, two women are already waiting with garlands and white linen. Another bends to measure the hem of a dress against your ankle. They work with the calm certainty of people adjusting a place card, not persuading a person.

Across the yard, Christian sits with a notebook open on his knee. Maja pours more tea. An elder traces a rune on the page with one blunt fingertip. Christian leans in, alert, intent, grateful to be wanted for the part of himself that writes footnotes.

Pelle offers you strawberries and says, very gently, "You came back in time. We were hoping you would."`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'meadow_birds_chorus',
    sounds: {
      onChoicesReveal: 'timer_urgent',
    },
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    pressure: {
      timerMs: 17000,
      timerStyle: 'heartbeat',
      defaultChoice: 'let_them_fit_dress',
      timerShrinkWithPulse: true,
    },
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.3 },
      { type: 'chorus_sync', intensity: 0.2 },
    ],
    stressModifiers: { exposure: 55, mask: 35 },
    choices: [
      {
        id: 'let_them_fit_dress',
        text: 'Hold still while they fit the dress.',
        chorusText: 'Be fitted.',
        effects: {
          perception: { belonging: 8, autonomy: -6, trust: 4 },
          relationships: { harga: 8 },
          chorus: 1,
          flags: { accepted_day5_fitting: true },
        },
        next: 'day5_afternoon_fitting',
      },
      {
        id: 'watch_christian_maja',
        text: 'Keep watching Christian and Maja.',
        effects: {
          perception: { grief: 8, autonomy: 5, trust: -4 },
          relationships: { christian: -6 },
          flags: { watched_christian_maja_day5: true },
        },
        next: 'day5_afternoon_study',
      },
      {
        id: 'ask_pelle_inclusion',
        text: 'Ask Pelle why they are including you.',
        effects: {
          perception: { trust: 6, belonging: 4, autonomy: 2 },
          relationships: { pelle: 6, harga: 3 },
          flags: { asked_pelle_day5_afternoon: true },
        },
        next: 'day5_afternoon_pelle',
      },
      {
        id: 'inspect_dress_runes',
        text: 'Ask what they stitched into the hem.',
        effects: {
          perception: { autonomy: 6, trust: -2, belonging: 2 },
          relationships: { harga: 2 },
          flags: { inspected_day5_dress_runes: true },
        },
        next: 'day5_afternoon_runes',
      },
    ],
  },

  {
    id: 'day5_afternoon_fitting',
    day: 5,
    chapter: 'descent',
    text: `You let them turn you by the shoulders and hips without resisting.

One woman kneels to pin the dress at your ankle. Another smooths the fabric across your ribs and says, almost conversationally, "You hold your breath when you are being observed."

"Most people do," you say.

"Not here."

She lays her palm between your shoulder blades until your lungs open. The touch is not tender, exactly. It is competent. Maternal in the way hospitals sometimes are.

When the hem is finished they step back together, heads tilted, evaluating not beauty but fit. Whether the body can be used cleanly inside the role prepared for it.

"Tomorrow," one of them says, satisfied. "You will not have to think with only your own mind."`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds_chorus',
    transitionType: 'dissolve',
    next: 'day5_evening',
  },

  {
    id: 'day5_afternoon_study',
    day: 5,
    chapter: 'descent',
    text: `You keep your eyes on Christian.

He does not notice at first. He is too busy being chosen for the version of himself he likes best - the one with a notebook, a source, a room full of men explaining why he matters.

An elder draws two branching lines on the page. One is marked with fertility runes. The other with a hooked symbol you saw carved near the yellow temple.

"For pairing?" Christian asks.

"For ripening," the elder corrects.

Maja watches Christian write that down. She is not shy. She looks exactly like someone listening to instructions being carried out on schedule.

Then the elder says, softly enough that Christian may or may not hear it, "And the queen must be kept from distress before the dance."

Your chest goes cold. Nobody at the table looks at you, which is how you know the sentence was about you.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds_chorus',
    transitionType: 'dissolve',
    next: 'day5_evening',
  },

  {
    id: 'day5_afternoon_pelle',
    day: 5,
    chapter: 'descent',
    text: `Pelle does not answer immediately. He offers you a strawberry first. He offers you a strawberry before he answers.

"Because you are open," he says at last.

"Open to what?"

"To being held."

You almost laugh. "That is a flattering word for what grief does to a person."

Pelle's expression does not change. "No. Grief hollows. Most people spend all their strength pretending it has not. You stopped pretending before you came here."

He reaches to lift one of the unfinished flower chains from your lap and settles it back down, a touch brief enough to deny and intimate enough to register.

"They recognize you," he says. "That is not the same thing as using you. Though sometimes it feels similar at first."`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds_chorus',
    transitionType: 'dissolve',
    next: 'day5_evening',
  },

  {
    id: 'day5_afternoon_runes',
    day: 5,
    chapter: 'descent',
    text: `The oldest seamstress turns the dress inside out and shows you the inner hem.

Tiny runes have been worked into the stitching in white thread on white linen, nearly invisible until the light catches them. Not decoration. Instruction.

"Protection?" you ask.

She smiles in a way that refuses the category.

"Opening," she says, tapping one mark. "Receiving." Another. "Endurance." Another still, darker than the rest, a knot of thread hidden near the back seam. "Transformation."

"Transformation into what?"

The woman folds the dress again before answering. "That depends what is ready to leave you."

When she places the linen back in your hands, it feels warmer than cloth should.`,
    background: 'harga_meadow',
    ambientSound: 'meadow_birds_chorus',
    transitionType: 'dissolve',
    next: 'day5_evening',
  },

  {
    id: 'day5_evening',
    day: 5,
    chapter: 'descent',
    text: `At supper, they save a place for you near the center of the long table.

Not beside Christian. Near the center.

He arrives late, smelling faintly of herbs and barn heat, his notebook tucked under one arm. When he sees you in the half-fitted white dress, something flickers across his face - surprise, maybe, or the realization that events are moving without his permission.

"You look..." he says.

Maja sets a cup near his hand before he finishes the sentence.

An elder asks him a question about lineage and ritual copying. Christian turns toward the question the way a plant turns toward sun. His mouth opens. He turns away before finishing.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'watched_christian_maja_day5', value: true },
        text: `At supper, they save a place for you near the center of the long table.

Christian takes longer than he should to notice. When he does, he looks from the white dress to your hair to the women around you, as if trying to decide whether this is social or ceremonial and therefore whether he needs to respond.

"You look..." he says.

Maja refills his cup before he can finish.

An elder asks about the thesis. Christian turns immediately, grateful for the reroute. He begins talking about source authority, about oral correction, about the Rubi Radr as if saying the right academic words can keep the world at seminar scale.`,
      },
    ],
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    sounds: {
      onChoicesReveal: 'timer_urgent',
    },
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    pressure: {
      timerMs: 14500,
      timerStyle: 'visible',
      defaultChoice: 'let_him_keep_talking',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 42, exposure: 60, mask: 45 },
    choices: [
      {
        id: 'ask_christian_walk',
        text: 'Ask him to walk with you after the meal.',
        effects: {
          perception: { autonomy: 4, grief: 6 },
          relationships: { christian: -8 },
          flags: { asked_christian_walk_day5: true },
        },
        next: 'day5_evening_walk_request',
      },
      {
        id: 'let_him_keep_talking',
        text: 'Let him keep talking.',
        chorusText: 'Listen from where you are.',
        effects: {
          perception: { belonging: 4, autonomy: -3, grief: 5 },
          relationships: { christian: -5, harga: 4 },
        },
        next: 'day5_evening_listen',
      },
      {
        id: 'leave_before_he_notices',
        text: 'Leave the table before he notices you leaving.',
        effects: {
          perception: { autonomy: 8, grief: 4 },
          relationships: { christian: -6 },
          flags: { left_day5_evening_early: true },
        },
        next: 'day5_evening_departure',
      },
    ],
  },

  {
    id: 'day5_evening_walk_request',
    day: 5,
    chapter: 'descent',
    text: `You wait for the elder to finish his question.

"Can you walk with me after this?" you ask Christian quietly.

For a moment, he looks cornered enough to become honest.

"After this?" he repeats, buying time with the words themselves. He glances at the notebook. At Maja. At the elder still waiting for his answer. "Yeah. Sure. After dinner."

You know before he says it that he is not coming.

He turns back to the table. The elder resumes speaking about inherited duties. Maja lowers her eyes, not in shame but in acceptance of the sequence already underway.

When you leave, Christian does not stop talking. He does not even look relieved. He looks absorbed, which is somehow crueler.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    transitionType: 'dissolve',
    next: 'day5_night',
  },

  {
    id: 'day5_evening_listen',
    day: 5,
    chapter: 'descent',
    text: `You stay where they've seated you and let the words reach you from across the table in pieces.

Lineage. Harvest. Purity. Timing.

Christian says something about comparative structures. The elder corrects him gently, the way one corrects a child using the wrong bowl.

"Not comparative," the elder says. "Living."

Christian smiles, writes it down, and keeps going.

Then someone farther down the table asks whether grief makes the queen more porous to blessing. A few people laugh softly, not because it is a joke but because the answer is obvious to them.

Nobody includes you in the conversation. Nobody needs to. They do not need to say your name. The question is about you anyway.

The stew cools in front of you. You do not remember lifting the spoon once.`,
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    transitionType: 'dissolve',
    next: 'day5_night',
  },

  {
    id: 'day5_evening_departure',
    day: 5,
    chapter: 'descent',
    text: `You rise while an elder is still speaking.

No one stops you. That is worse.

Outside, the evening light has gone flat and endless. Behind the storehouse, three women stand with their hands linked, practicing the breathing cries that rise before communal grief. Inhale together. Break together. Recover together. The sound is private and rehearsed, which makes it worse.

One of them notices you and smiles as if you've arrived early for something meant in your honor.

When you look back toward the feast hall, your place at the table is still there. Cup full. Napkin folded.`,
    background: 'harga_meadow',
    ambientSound: 'wind_low',
    transitionType: 'dissolve',
    next: 'day5_night',
  },

  {
    id: 'day5_night',
    day: 5,
    chapter: 'descent',
    text: `The sleeping room glows with the pale light the place calls dark.

Your dress hangs from a peg by the door. Flowers have been braided into the belt. Water and a towel wait on the pillow.

Through the wall, the commune is singing again. Low. Continuous.

Christian never comes.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'asked_christian_walk_day5', value: true },
        text: `The sleeping room glows with the pale light the place calls dark.

You waited after supper longer than you meant to. Long enough for bowls to be cleared, for candles to be trimmed, for Christian to become only a voice at the far end of the hall, still discussing ritual authorship with an elder while Maja stood behind his chair.

Now the white dress hangs from a peg by the door. Flowers are braided into the belt. Water, a towel, and lavender sit on the pillow.

Through the wall, the commune sings in low, even waves.

Christian never comes.`,
      },
      {
        condition: { type: 'relationship', target: 'christian', max: 0 },
        text: `The sleeping room glows with the pale light the place calls dark.

Your white dress hangs by the door. Fresh flowers have been braided into the belt. The bed has been turned down. Water and lavender wait at the pillow.

Through the wall, the singing rises and falls in long shared breaths.

Christian does not knock. You realize you are no longer surprised.`,
      },
    ],
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing',
    sounds: {
      onChoicesReveal: 'timer_urgent',
    },
    transitionType: 'breathe',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    pressure: {
      timerMs: 13000,
      timerStyle: 'heartbeat',
      defaultChoice: 'let_singing_hold_you_day5',
      timerShrinkWithPulse: true,
    },
    visualEffects: [
      { type: 'chorus_sync', intensity: 0.4 },
      { type: 'flowers_breathe', intensity: 0.3 },
      { type: 'vignette', intensity: 0.2 },
    ],
    stressModifiers: { pulse: 48, exposure: 35, mask: 60 },
    choices: [
      {
        id: 'go_to_christian_door_day5',
        text: "Go to Christian's door.",
        effects: {
          perception: { autonomy: 4, grief: 7 },
          relationships: { christian: -5 },
          flags: { went_to_christian_door_day5: true },
        },
        next: 'day5_night_door',
      },
      {
        id: 'let_singing_hold_you_day5',
        text: 'Lie down and let the singing reach you.',
        chorusText: 'Be sung to sleep.',
        effects: {
          perception: { belonging: 8, autonomy: -6, grief: -4 },
          relationships: { harga: 6 },
          chorus: 1,
          flags: { accepted_day5_song: true },
        },
        next: 'day5_night_song',
      },
      {
        id: 'watch_white_night_day5',
        text: 'Sit at the window and watch the white night.',
        effects: {
          perception: { autonomy: 6, grief: 5, sleep: -5 },
          flags: { watched_white_night_day5: true },
        },
        next: 'day5_night_window',
      },
      {
        id: 'unbraid_flower_belt_day5',
        text: 'Unbraid the flowers from the belt.',
        effects: {
          perception: { autonomy: 7, belonging: -3, grief: 4 },
          flags: { unbraided_day5_belt: true },
        },
        next: 'day5_night_belt',
      },
    ],
  },

  {
    id: 'day5_night_door',
    day: 5,
    chapter: 'descent',
    text: `You cross the sleeping room barefoot and step into the pale corridor.

Christian's door is not shut all the way. A line of warm light cuts across the floorboards.

You take one step toward it and hear voices inside. Christian's, low and eager. An elder's, patient. Another voice you cannot place. Not Maja's. Not yet.

Before you can look in, a hand settles lightly on your wrist.

It is one of the older women from the fitting table. Her face is kind enough to be unbearable.

"He is being instructed," she says. "Tonight you should rest."

"Instructed for what?"

Her thumb brushes once over your pulse.

"For what is already moving toward all of you."

She lets go. The door stays almost-open. You go back to your bed without having seen anything, which is somehow the more complete humiliation.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing',
    transitionType: 'breathe',
    next: 'day6_washing',
  },

  {
    id: 'day5_night_song',
    day: 5,
    chapter: 'descent',
    text: `You lie down fully dressed and listen.

The melody starts small and grows.

After a while, you match your breathing to it.

At some point, someone on the other side of the wall puts her hand against the boards.

You put your hand there too.

The singing does not stop before you fall asleep.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing',
    transitionType: 'breathe',
    next: 'day6_washing',
  },

  {
    id: 'day5_night_window',
    day: 5,
    chapter: 'descent',
    text: `You sit at the window until your legs go numb.

Nothing gets dark enough to feel private. Across the field, women move around the maypole in slow rehearsal.

One space in the circle is being left open.

A child crosses the field carrying a flower crown larger than her torso. She stumbles once, rights herself, keeps going.

By the time you leave the window, dawn and midnight still look the same.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'wind_low',
    transitionType: 'breathe',
    next: 'day6_washing',
  },

  {
    id: 'day5_night_belt',
    day: 5,
    chapter: 'descent',
    text: `You take the belt down from the peg and begin loosening the flowers one stem at a time.

The braid has been woven too tightly.

At the fourth knot you find what caught the stems together: a strand of pale hair twisted through the twine. Not enough to identify. Enough to make the thing feel personal.

You hold it up to the window. Hair. Flower sap. White thread.

For a second you consider tearing the whole belt apart.

Instead you set it back exactly as you found it.

When you wake the next morning, the flowers look fresher than they did tonight.`,
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing',
    transitionType: 'breathe',
    next: 'day6_washing',
  },

  // ═══════════════════════════════════════════════════
  // DAY 6: THE DANCE
  // ═══════════════════════════════════════════════════
  {
    id: 'day6_washing',
    day: 6,
    chapter: 'descent',
    text: `They wake you before the meal.

The women lead you to a bathhouse steamed with herbs. Warm water is poured over your shoulders and hair. One woman washes your feet. Another rubs oil into your wrists and throat.

No part of it is sexual.

It is practical. It is ceremonial.

When they lift the white dress over your head, you raise your arms before anyone asks.`,
    background: 'harga_sleeping_quarters',
    ambientSound: 'morning_chant',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.5 },
      { type: 'chorus_sync', intensity: 0.6 },
      { type: 'sun_pulse', intensity: 0.2 },
    ],
    stressModifiers: { pulse: 40, exposure: 70, dissociation: 15 },
    choices: [
      {
        id: 'let_them_arrange_body',
        text: 'Let them arrange you.',
        chorusText: 'Be prepared.',
        effects: {
          perception: { belonging: 10, autonomy: -10, trust: 5 },
          relationships: { harga: 10 },
          chorus: 1,
          flags: { surrendered_day6_washing: true },
        },
        next: 'day6_dance',
      },
      {
        id: 'ask_may_queen_role',
        text: 'Ask what the May Queen must do.',
        effects: {
          perception: { trust: 4, autonomy: 3, belonging: 3 },
          relationships: { harga: 4 },
          flags: { asked_may_queen_role: true },
        },
        next: 'day6_dance',
      },
      {
        id: 'keep_own_hands_on_dress',
        text: 'Keep your own hands on the dress as they tie it.',
        effects: {
          perception: { autonomy: 10, belonging: -4, grief: 3 },
          flags: { resisted_day6_washing: true },
        },
        next: 'day6_dance',
      },
    ],
  },

  {
    id: 'day6_dance',
    day: 6,
    chapter: 'descent',
    mode: 'rhythm',
    text: `The dance of the May Queen.

You line up with the other women — fifteen of them, all blonde, all barefoot, all wearing white dresses with flower crowns woven into their hair. You are the only outsider.

The maypole stands at the center of the field, massive, draped in greenery and ribbons. The community gathers around it in a circle. The musicians begin.

The dance is simple: circle the maypole. Keep dancing. The last one standing is crowned.

"It's not about strength," the elder tells you. "It's about surrender. The one who stops resisting it lasts the longest."

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

Some are laughing. Some are crying. Some look relieved.

You keep going. Your legs burn. Your vision blurs.

The music gets faster. The community claps in time.

The last woman falls. You stand alone.

The crown descends.

It is heavy. Heavier than it looks.

The commune starts singing louder.

You are the May Queen.

You do not know what that means yet.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'surrendered_to_dance', value: true },
        text: `One by one, the other women fall. You barely notice.

When the last woman falls and the crown comes down, you are not surprised.

The weight feels right.

The commune sings.

For the first time in a long time, you feel useful.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'coronation_chant',
    sounds: {
      onEnter: 'crown_place',
    },
    transitionType: 'breathe',
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.8 },
      { type: 'chorus_sync', intensity: 0.9 },
      { type: 'border_bloom', intensity: 0.7 },
      { type: 'sun_pulse', intensity: 0.6 },
    ],
    next: 'day6_blessing',
  },

  {
    id: 'day6_blessing',
    day: 6,
    chapter: 'descent',
    text: `They do not let the crown remain symbolic for long.

They lift you into a flower cart. The wheels move slowly through the commune. Children run beside it. Men carrying rye bow as you pass. Women touch the hem of your dress.

At each stop, someone places something in your hands - a basket of berries, a loaf of bread, a child, a branch heavy with new leaves - and waits for your blessing.

You realize everyone here is looking at you for instruction.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'surrendered_to_dance', value: true },
        text: `They lift you into a flower cart.

The wheels carry you between white buildings and bright rows of rye. Faces tilt up toward you from every side. Children run beside the cart until a singer draws them back into rhythm. Women press fingertips to the hem of your dress and then to their own mouths.

At each stop, something is placed in your hands - berries, bread, green branches, a laughing child too small to fear the crown.

The attention does not feel hostile. That is part of why it works.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'coronation_chant',
    transitionType: 'ritual',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.8 },
      { type: 'chorus_sync', intensity: 0.8 },
      { type: 'sun_pulse', intensity: 0.5 },
      { type: 'border_bloom', intensity: 0.4 },
    ],
    stressModifiers: { pulse: 35, exposure: 90, dissociation: 20 },
    choices: [
      {
        id: 'bless_the_fields',
        text: 'Lay your hand over the rye and blessing words.',
        chorusText: 'Bless the field.',
        effects: {
          perception: { belonging: 10, autonomy: -8, grief: -4 },
          relationships: { harga: 8 },
          chorus: 1,
          flags: { blessed_fields_day6: true },
        },
        next: 'day6_feast',
      },
      {
        id: 'bless_the_child',
        text: 'Kiss the child they place in your arms.',
        chorusText: 'Bless the child.',
        effects: {
          perception: { belonging: 8, trust: 4, grief: -3 },
          relationships: { harga: 10 },
          chorus: 1,
          flags: { blessed_child_day6: true },
        },
        next: 'day6_feast',
      },
      {
        id: 'search_for_christian_day6',
        text: 'Search the crowd for Christian.',
        effects: {
          perception: { autonomy: 6, grief: 6 },
          relationships: { christian: -5 },
          flags: { searched_for_christian_day6: true },
        },
        next: 'day6_feast',
      },
    ],
  },

  {
    id: 'day6_feast',
    day: 6,
    chapter: 'descent',
    text: `At the evening feast, they seat you alone.

Not abandoned. Displayed.

Your chair is raised by one shallow step above the others. Platters arrive untouched and leave half-touched because people keep standing to toast you before you can finish anything. Cups are refilled. Songs begin and end around your name. Women who barely spoke to you on Day 1 now look at you with open affection.

Christian is there eventually, but far down the table. No place has been saved beside you. Maja sits near him. An elder keeps one hand on his notebook while speaking. Even at this distance, you can see that Christian is listening harder to the commune than he ever listened to you.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'searched_for_christian_day6', value: true },
        text: `At the evening feast, they seat you alone on a raised chair near the center.

You look for Christian before you let yourself look at anyone else.

He is there, eventually, but far down the table, bracketed by Maja and an elder who keeps two fingers on his notebook while speaking in low, deliberate phrases. No place has been saved beside you. The fact arrives as information first, pain second.

Around you, cups are refilled before they empty. Platters arrive untouched and leave half-touched because people keep standing to toast you. The Hårga say your title with warmth. Christian says nothing at all.`,
      },
    ],
    background: 'harga_feast',
    ambientSound: 'feast_ambient',
    sounds: {
      onEnter: 'chapter_transition',
    },
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.6 },
      { type: 'sun_pulse', intensity: 0.3 },
      { type: 'chorus_sync', intensity: 0.4 },
    ],
    stressModifiers: { pulse: 38, exposure: 82, mask: 70, dissociation: 15 },
    choices: [
      {
        id: 'drink_may_queen_wine',
        text: 'Drink the sweet wine they keep offering.',
        chorusText: 'Drink.',
        effects: {
          perception: { intoxication: 10, belonging: 6, autonomy: -4 },
          relationships: { harga: 5 },
          flags: { drank_day6_feast_wine: true },
        },
        next: 'day6_night',
      },
      {
        id: 'ask_for_christian_feast',
        text: 'Ask why Christian is seated so far from you.',
        effects: {
          perception: { autonomy: 6, grief: 5, trust: -3 },
          relationships: { christian: -5, harga: -2 },
          flags: { asked_for_christian_feast: true },
        },
        next: 'day6_night',
      },
      {
        id: 'accept_toasts_day6',
        text: 'Lift your cup when they toast the May Queen.',
        chorusText: 'Toast with them.',
        effects: {
          perception: { belonging: 10, autonomy: -8, grief: -3 },
          relationships: { harga: 8 },
          chorus: 1,
          flags: { accepted_day6_toasts: true },
        },
        next: 'day6_night',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // DAY 7: THE REVELATION
  // ═══════════════════════════════════════════════════
  {
    id: 'day6_night',
    day: 6,
    chapter: 'descent',
    text: `When they finally take the crown off, your scalp hurts.

The stems have pressed marks into your skin. Petals cling to your neck. Two women ease the dress open at the back and catch it before it falls.

"Family should not undress alone after a holy day," one of them says.

Family.

The word lands harder than it should.`,
    variants: [
      {
        condition: { type: 'autonomy', max: 45 },
        text: `When they lift the crown away, your skin remembers it.

The flowers have left marks along the scalp and throat. Warm fingers loosen the dress ties and keep the weight from dropping all at once. Someone presses a cool cloth to the places where the stems bit deepest.

"Family should not undress alone after a holy day," one woman says.

For a moment, being tended feels easier than being alone.`,
      },
    ],
    background: 'sleeping_quarters_night',
    ambientSound: 'night_singing_soft',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    visualEffects: [
      { type: 'flowers_breathe', intensity: 0.5 },
      { type: 'chorus_sync', intensity: 0.5 },
      { type: 'vignette', intensity: 0.3 },
    ],
    stressModifiers: { pulse: 46, exposure: 40, mask: 72, dissociation: 20 },
    choices: [
      {
        id: 'let_women_stay_day6_night',
        text: 'Let them stay until you sleep.',
        chorusText: 'Let them stay.',
        effects: {
          perception: { belonging: 10, autonomy: -8, grief: -6 },
          relationships: { harga: 8 },
          chorus: 1,
          flags: { let_women_stay_day6_night: true },
        },
        next: 'day7_morning',
      },
      {
        id: 'ask_to_be_alone_day6_night',
        text: 'Ask to be alone with the marks the crown left.',
        effects: {
          perception: { autonomy: 10, belonging: -5, grief: 4 },
          flags: { asked_to_be_alone_day6_night: true },
        },
        next: 'day7_morning',
      },
      {
        id: 'ask_where_christian_is_day6_night',
        text: 'Ask where Christian is now.',
        effects: {
          perception: { autonomy: 5, grief: 8, trust: -4 },
          relationships: { christian: -6 },
          flags: { asked_where_christian_is_day6_night: true },
        },
        next: 'day7_morning',
      },
    ],
  },

  {
    id: 'day7_morning',
    day: 7,
    chapter: 'descent',
    text: `By morning, the commune has changed shape.

The long tables have been pulled back from the temple clearing. Men carry timber toward the yellow building in pairs. Women weave new garlands. Children are kept farther from the center.

You realize all at once that you have not seen Simon, Connie, Mark, or Josh in too long. Not in the casual way of travel companions drifting. In the organized way of items removed from a room before guests are shown in.

No one looks hurried.

That is what makes it worse.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'asked_where_christian_is_day6_night', value: true },
        text: `By morning, the commune has changed shape.

When you asked about Christian in the night, one of the women smiled and said, "He is where he needs to be." You keep hearing it.

The long tables have been moved back from the temple clearing. Men carry timber toward the yellow building two by two. Women weave fresh garlands with hard concentration. Children are redirected each time they wander too close.

You have not seen Simon, Connie, Mark, or Josh in too long. Now you realize you have not seen Christian either.

No one seems alarmed by any of it.

That is what makes it worse.`,
      },
    ],
    background: 'harga_meadow',
    ambientSound: 'ritual_chant',
    sounds: {
      onEnter: 'ghost_echo',
    },
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 2500,
    visualEffects: [
      { type: 'vignette', intensity: 0.4 },
      { type: 'sun_pulse', intensity: 0.3 },
      { type: 'chorus_sync', intensity: 0.3 },
    ],
    stressModifiers: { pulse: 52, exposure: 88, mask: 76, dissociation: 18 },
    choices: [
      {
        id: 'walk_where_guided_day7',
        text: 'Walk where they guide you.',
        chorusText: 'Walk with us.',
        effects: {
          perception: { belonging: 8, autonomy: -6, grief: -2 },
          relationships: { harga: 6 },
          chorus: 1,
        },
        next: 'day7_revelation',
      },
      {
        id: 'count_whos_missing_day7',
        text: "Count who isn't here.",
        effects: {
          perception: { autonomy: 8, grief: 6, trust: -6 },
          flags: { counted_missing_day7: true },
        },
        next: 'day7_revelation',
      },
      {
        id: 'ask_siv_today_day7',
        text: 'Ask Siv what today is for.',
        effects: {
          perception: { autonomy: 4, trust: 3 },
          relationships: { harga: 2 },
          flags: { asked_siv_day7_morning: true },
        },
        next: 'day7_revelation',
      },
    ],
  },

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

She is asking you to choose Christian or one of them.

She says it gently, as if the choice is ordinary.`,
    background: 'harga_meadow',
    ambientSound: 'silence_heavy',
    sounds: {
      onEnter: 'commune_whisper',
      onChoicesReveal: 'timer_urgent',
    },
    transitionType: 'dissolve',
    typingSpeed: 'slow',
    pauseAfterMs: 4000,
    visualEffects: [
      { type: 'vignette', intensity: 0.52 },
      { type: 'sun_pulse', intensity: 0.3 },
      { type: 'text_waver', intensity: 0.22 },
    ],
    pressure: {
      timerMs: 16000,
      timerStyle: 'visible',
      defaultChoice: 'choose_christian',
      timerShrinkWithPulse: true,
    },
    stressModifiers: { pulse: 66, exposure: 90, mask: 76, dissociation: 22 },
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

No — that's not true. You feel everything. But it passes through you now instead of stopping. Grief, rage, love, betrayal, relief. They are all still there. They do not stop you.`,
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

Ingemar steps forward. He steps forward without hesitation and kneels.

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

She leaves the question in the room.`,
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
