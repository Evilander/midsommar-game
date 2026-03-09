// ─── Prologue: Before Sweden ─── The world that breaks before the story begins ───
// Winter. Brooklyn. The last night everything was still possible.

import type { SceneNode, Chapter } from '../engine/types'

export const PROLOGUE_SCENES: SceneNode[] = [

  // ═══════════════════════════════════════════════════
  // SCENE 1: THE EMAIL
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_apartment',
    day: 0,
    chapter: 'prologue',
    text: `Your apartment is cold.

Not broken-heater cold. The kind of cold that comes from being awake at a time when your body knows you should be sleeping. January in Brooklyn. Snow on the fire escape. The radiator clicks but produces nothing you can feel.

You are sitting on the edge of your bed with your phone in your hand and your sister's email open on the screen.

    I can't anymore. Everything's black.
    Mom and dad are coming too.
    Goodbye.

You have read it four times. Each time, a different word carries the weight. Can't. Black. Coming. Goodbye.

Terri has sent emails like this before. Not exactly like this. But close enough that you have learned how to hold the panic at arm's length, how to breathe through the first thirty seconds before calling her. Close enough that your boyfriend Christian has stopped asking what's wrong when you check your phone at dinner. Three years together and he's learned when to look up from his plate and when not to bother.

But this one says goodbye. Terri has never said goodbye.`,
    background: 'apartment_night',
    ambientSound: 'wind_hollow',
    transitionType: 'fade',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    memoryBloom: {
      lines: [
        `The email feels familiar before you finish reading it.`,
        `You already know which word will hit hardest.`,
      ],
    },
    stressModifiers: { pulse: 35, exposure: 0, mask: 20, dissociation: 0 },
    choices: [
      {
        id: 'call_terri',
        text: 'Call Terri.',
        effects: {
          perception: { grief: 5, autonomy: 5 },
          flags: { called_terri_first: true },
        },
        next: 'prologue_no_answer',
      },
      {
        id: 'email_terri_back',
        text: 'Email her back. Then email her again.',
        effects: {
          perception: { grief: 8, sleep: -5 },
          flags: { emailed_terri: true },
        },
        next: 'prologue_no_answer',
      },
      {
        id: 'call_friend',
        text: 'Call your friend first. You need someone to tell you this is normal.',
        effects: {
          perception: { autonomy: 3, grief: 3 },
          flags: { called_friend_first: true },
        },
        next: 'prologue_phone_friend',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // SCENE 2A: NO ANSWER (from calling/emailing Terri)
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_no_answer',
    day: 0,
    chapter: 'prologue',
    text: `No answer.

You call again. Voicemail. Her voice on the recording sounds like a person you used to know — bright, slightly too loud, the way she sounded before the diagnosis turned her into a series of crises you were supposed to manage.

You text: Are you there?

You text: Terri please.

You text: I'm calling mom and dad.

No response. You try your parents' landline. It rings six times and clicks to the answering machine. Your father's voice, recorded years ago, says they can't come to the phone right now.

The panic is no longer at arm's length.`,
    background: 'apartment_night',
    ambientSound: 'wind_hollow',
    transitionType: 'cut',
    typingSpeed: 'normal',
    stressModifiers: { pulse: 50, exposure: 0, mask: 10, dissociation: 5 },
    choices: [
      {
        id: 'call_christian_panicked',
        text: 'Call Christian.',
        effects: {
          perception: { grief: 5 },
          relationships: { christian: 3 },
          flags: { called_christian_panicked: true },
        },
        next: 'prologue_phone_christian',
      },
      {
        id: 'call_friend_after',
        text: 'Call your friend. You need to hear another voice.',
        effects: {
          perception: { autonomy: 5, grief: 3 },
        },
        next: 'prologue_phone_friend',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // SCENE 2B: THE FRIEND
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_phone_friend',
    day: 0,
    chapter: 'prologue',
    text: `Your friend picks up on the second ring. She always picks up. That used to embarrass you. Now it makes you want to cry.

You tell her about the email. She listens. Then you tell her the thing underneath the email — the thing you actually called about.

"What if I'm scaring him off?" you say. "I called him today in tears because my sister wrote another scary email, and I could hear it in his voice. He's just... working up the nerve to say something."

"He should be there when you need him," she says.

"But what if I need him too much? What if it's become a chore?"

"Then he's not the right guy. Because it shouldn't ever be a chore."

"But he never asks anything from me. I've never even seen him cry. I'm the only one leaning."

"Or the only one opening up," she says. "The only one making yourself vulnerable."

You hear the truth in it. You don't want it.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'called_friend_first', value: true },
        text: `Your friend picks up on the second ring. She always picks up.

You tell her about the email. She tells you to breathe. Then — because this is what you do, because you can't help it — you stop talking about your sister and start talking about him.

"What if I'm scaring him off?" you say. "I called him today in tears because Terri wrote another scary email, and I could hear it in his tone. He's working up the nerve to say something."

"He should be there when you need him."

"But what if I need him too much? What if it's become a chore?"

"Then he's not the right guy. Because it shouldn't ever be a chore."

"But he never asks for anything from me! I've never even seen him cry! I'm the only one leaning!"

"Or the only one opening up," she says quietly. "The only one making yourself vulnerable."

You know she's right. You hate that she's right, because being right doesn't make it hurt less.`,
      },
    ],
    background: 'apartment_night',
    ambientSound: 'wind_hollow',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 2000,
    stressModifiers: { pulse: 40, exposure: 0, mask: 30, dissociation: 0 },
    choices: [
      {
        id: 'defend_christian',
        text: '"He tries. He does try."',
        effects: {
          perception: { autonomy: -5, grief: 3 },
          relationships: { christian: 5 },
          flags: { defended_christian: true },
        },
        next: 'prologue_phone_christian',
      },
      {
        id: 'admit_truth_friend',
        text: '"I know. I know he\'s not."',
        effects: {
          perception: { autonomy: 8, grief: 5 },
          relationships: { christian: -5 },
          flags: { admitted_truth_to_friend: true },
        },
        next: 'prologue_phone_christian',
      },
      {
        id: 'change_subject_back',
        text: '"I should call Terri again."',
        effects: {
          perception: { grief: 8, autonomy: 3 },
          flags: { refocused_on_terri: true },
        },
        next: 'prologue_phone_christian',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // SCENE 3: CHRISTIAN
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_phone_christian',
    day: 0,
    chapter: 'prologue',
    text: `Christian picks up. You can hear the bar behind him — voices, a game on a screen somewhere, Mark's laugh cutting through everything like a saw.

"Hey. What's up?"

You tell him about the email. You try to keep your voice level. You pace the kitchen when you're not speaking.

"She does this every other day, Dani," he says. "And only because you let her."

"I don't let her. She's bipolar."

"Yeah, I know. But you do, though, babes. You go straight to crisis mode."

"You said yourself this email seemed different."

"Right, but... is it, though? Really? It's still just another obvious ploy for attention, just like every other panic attack she's given you."

The word ploy. The word obvious. As if her illness is something she is doing to you.

You want to scream. You apologize instead.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'admitted_truth_to_friend', value: true },
        text: `Christian picks up. The bar is loud behind him — voices, a game on a screen, Mark's laugh like something breaking.

"Hey. What's up?"

You almost don't tell him. Your friend's words are still warm in your ear: he's not the right guy. But the email is on your screen and you can't carry it alone, so you tell him.

"She does this every other day, Dani. And only because you let her."

"I don't let her. She's bipolar."

"Yeah, I know. But you do, though, babes. You go straight to crisis mode."

"You said yourself this email seemed different."

"Right, but... is it, though? Really?"

Ploy. Attention. Panic attack she's given you. As if your sister's illness is a gift she wraps and delivers to ruin your evening.

Your friend was right. You know your friend was right.

You apologize anyway.`,
      },
    ],
    background: 'apartment_night',
    ambientSound: 'wind_hollow',
    transitionType: 'cut',
    typingSpeed: 'normal',
    stressModifiers: { pulse: 55, exposure: 0, mask: 50, dissociation: 0 },
    choices: [
      {
        id: 'push_back_christian',
        text: '"Don\'t call it a ploy. Don\'t call my sister\'s suffering a ploy."',
        effects: {
          perception: { autonomy: 10, grief: 5 },
          relationships: { christian: -8 },
          flags: { pushed_back_on_christian: true },
        },
        next: 'prologue_silence',
      },
      {
        id: 'apologize_christian',
        text: '"You\'re right. I\'m sorry. I\'m sorry for calling."',
        effects: {
          perception: { autonomy: -10, grief: 8 },
          relationships: { christian: 3 },
          flags: { apologized_to_christian: true },
        },
        next: 'prologue_silence',
      },
      {
        id: 'ask_him_to_come',
        text: '"Can you come over? I don\'t want to be alone tonight."',
        effects: {
          perception: { autonomy: -3, grief: 3 },
          relationships: { christian: -3 },
          flags: { asked_christian_to_come: true },
        },
        next: 'prologue_silence',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // SCENE 4: THE SILENCE
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_silence',
    day: 0,
    chapter: 'prologue',
    text: `After you hang up, the apartment is quieter than it was before.

You email Terri again:

    Please answer me. I love you. Whatever this is, we can figure it out.

You stare at the phone. The screen stays dark. Outside, the snow has stopped. The streetlights make the fire escape look like a bone.

You sit on the kitchen floor because the bed feels too far away and the couch reminds you of Christian.

Minutes pass. Your phone doesn't ring.

You try your parents again. Six rings. The machine. Your father's voice, unchanged, preserved in magnetic tape while the man himself—

You hang up before the beep.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'asked_christian_to_come', value: true },
        text: `Christian said he'd try. He said he'd try, and then said nothing else.

You sit on the kitchen floor because the bed is too far away. You email Terri again:

    Please answer me. I love you. Whatever this is, we can figure it out.

The screen stays dark. You try your parents' landline. Six rings. The machine. Your father's voice, recorded in another year, says they can't come to the phone right now.

You sit on the floor and you wait.

Christian doesn't come.

By the time the phone finally rings, you have been sitting in the same position for so long that your legs have gone to sleep.`,
      },
      {
        condition: { type: 'flag', flag: 'pushed_back_on_christian', value: true },
        text: `Christian hung up first. He does that when you push back — exits the conversation like someone leaving a room with too many people in it.

You sit on the kitchen floor. You email Terri:

    Please answer me. I love you. Whatever this is, we can figure it out.

Nothing. You try your parents. Six rings, then the machine. Your father's voice from years ago, cheerful and unchanged, telling you they can't come to the phone right now.

Can't come to the phone. Can't anymore. Everything's black.

The connections assemble themselves in a part of your brain that has been preparing for this call your entire life.

When the phone rings, you already know.`,
      },
    ],
    background: 'apartment_night',
    ambientSound: 'silence_heavy',
    transitionType: 'breathe',
    typingSpeed: 'slow',
    pauseAfterMs: 4000,
    stressModifiers: { pulse: 65, exposure: 0, mask: 5, dissociation: 10 },
    next: 'prologue_discovery',
  },

  // ═══════════════════════════════════════════════════
  // SCENE 5: THE DISCOVERY
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_discovery',
    day: 0,
    chapter: 'prologue',
    text: `The phone rings.

It is not Terri.

What follows arrives in pieces. A voice that is not a voice you know. Words that are medical, then legal, then nothing. Carbon monoxide. Garden hoses from the exhaust. Duct tape. The parents' bedroom. Your sister's room.

You say "no" and then you say it again and the word stops meaning anything. You are on the floor. You are making a noise you have never heard yourself make.

That person is gone now.

The rest of the night happens to someone else. Sirens. Christian arrives — you don't remember calling him. He sits on the couch. You lie across his lap and you scream and he holds you, and Christian arrives. He sits on the couch. You lie across his lap and scream. He holds you rigidly.

Not grief for you. Regret for himself.

Snow falls outside. The radiator clicks.`,
    background: 'apartment_night',
    ambientSound: 'silence_heavy',
    sounds: {
      onEnter: 'ghost_echo',
    },
    transitionType: 'cut',
    typingSpeed: 'slow',
    pauseAfterMs: 5000,
    visualEffects: [
      { type: 'vignette', intensity: 0.7 },
      { type: 'text_waver', intensity: 0.3 },
    ],
    stressModifiers: { pulse: 90, exposure: 0, mask: 0, dissociation: 40 },
    next: 'prologue_aftermath',
  },

  // ═══════════════════════════════════════════════════
  // SCENE 6: THE AFTERMATH
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_aftermath',
    day: 0,
    chapter: 'prologue',
    text: `Weeks pass.

You move through them the way you move through a house where the lights have all been turned off. Carefully. With your hands out. Bumping into things that used to be where you left them.

Christian brings food. You eat some of it. He stays the night sometimes, and when he does, you can feel him lying awake beside you, calculating the cost of leaving a girl whose family just died.

One evening he says, "So, I'm going to Sweden."

You look at him.

"With the guys. Pelle's commune. It's for my thesis." He pauses. "I told you about this."

You are certain he didn't. But you've learned that certainty doesn't matter in this relationship. What matters is what he remembers, which is always more convenient than what you remember.

"You already have a ticket," you say.

"Yeah." He looks at the floor. "I was thinking... maybe you should come. It might be good for you. To get away."

He asks you to come in a way that leaves him covered either way. If you come to Sweden, he hasn't abandoned you. If you stay, it was your choice.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'pushed_back_on_christian', value: true },
        text: `Weeks pass like rooms you walk through without seeing.

Christian brings food. You eat what you can. He sleeps over sometimes, rigid on his side of the bed, a man serving a sentence he didn't know he'd been given.

You haven't fought since the night of the phone call. There is nothing left to fight about. The argument about your sister — ploy, he called it — sits between you like furniture neither of you will move.

One evening he says, "So, I'm going to Sweden."

"With the guys. Pelle's commune. For my thesis." He pauses. "I told you about this."

He didn't. You know he didn't. But the last time you pushed back, he left.

"You already have a ticket."

"Yeah." He looks at the floor. "Maybe you should come. It might be good for you."

You hear the structure underneath the offer: if you come, he's not abandoning you. If you don't, it was your decision.`,
      },
      {
        condition: { type: 'flag', flag: 'apologized_to_christian', value: true },
        text: `Weeks pass.

You apologize less now. Not because you've stopped feeling sorry — you've just run out of things to apologize for. The apologies have covered the phone calls, the crying, the nights you couldn't sleep, the mornings you couldn't eat. There is nothing left to be sorry about except being alive and needing someone.

Christian brings food. He sleeps over when he can. You can feel him calculating whether this is enough — whether showing up counts as the same thing as being present.

One evening he says, "So, I'm going to Sweden."

"Pelle's commune. For my thesis. I told you about this."

He didn't. You know he didn't. You don't say so.

"You already have a ticket."

"Yeah." He looks at the floor. "Maybe you should come. Get away from all this."

All this. Your dead family. Your grief. The apartment where you sat on the kitchen floor and learned what the word goodbye means when your sister writes it for the last time.

He wants to get you away from all this.`,
      },
    ],
    background: 'apartment_night',
    ambientSound: 'wind_hollow',
    transitionType: 'dissolve',
    typingSpeed: 'normal',
    pauseAfterMs: 3000,
    stressModifiers: { pulse: 45, exposure: 0, mask: 60, dissociation: 20 },
    choices: [
      {
        id: 'say_yes_immediately',
        text: '"Okay."',
        effects: {
          perception: { autonomy: -8, grief: -3, belonging: 3 },
          relationships: { christian: 5 },
          flags: { agreed_to_sweden: true },
        },
        next: 'prologue_departure',
      },
      {
        id: 'ask_if_he_wants_you_there',
        text: '"Do you actually want me to come?"',
        effects: {
          perception: { autonomy: 8, grief: 5 },
          relationships: { christian: -5 },
          flags: { questioned_invitation: true },
        },
        next: 'prologue_departure',
      },
      {
        id: 'say_you_shouldnt',
        text: '"I shouldn\'t. You should go without me."',
        effects: {
          perception: { autonomy: 5, grief: 10 },
          relationships: { christian: -3 },
          flags: { tried_to_refuse_sweden: true },
        },
        next: 'prologue_departure',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // SCENE 7: DEPARTURE
  // ═══════════════════════════════════════════════════
  {
    id: 'prologue_departure',
    day: 0,
    chapter: 'prologue',
    text: `You pack a bag. You don't pack much.

Your therapist says travel might help. Your friend says Christian should have invited you from the beginning, not as an afterthought. You don't disagree, but you go anyway, because the alternative is sitting in this apartment where every silence sounds like a phone that should be ringing.

At the airport, Christian carries your bag. Mark talks too much. Josh reads something about Nordic runes with his headphones on. Pelle catches your eye across the terminal and smiles in a way that feels like the first real warmth you've encountered in weeks.

"I'm glad you're coming," Pelle says.

You almost believe him. You almost believe yourself.

On the plane, you take your Ativan and close your eyes and try not to think about the fact that you're leaving the country where your family is buried, and that you are going to a place where the sun never sets, and that you cannot remember the last time you slept through the night.`,
    variants: [
      {
        condition: { type: 'flag', flag: 'questioned_invitation', value: true },
        text: `When you asked Christian if he actually wanted you there, he said, "Of course." The way he said it — slightly too fast, slightly too bright — told you everything his words wouldn't.

You pack a bag anyway. Your therapist says travel might help. Your friend says he should have invited you from the start. You don't disagree with either of them, but you go, because staying means sitting in the apartment where the phone rang and everything ended.

At the airport, Mark talks too much. Josh reads a book about Nordic runes. Christian carries your bag like a penance.

Pelle catches your eye and says, "I'm glad you're coming, Dani."

He says your name the way Christian used to. Before. When your name in his mouth still meant something besides obligation.

On the plane, you take your Ativan and lean your head against the window and try not to think about the fact that you are flying toward a place where the sun doesn't set, and you haven't slept through the night since January, and everyone who loved you unconditionally is dead.`,
      },
      {
        condition: { type: 'flag', flag: 'tried_to_refuse_sweden', value: true },
        text: `You said you shouldn't go. Christian's face flickered — relief for half a second, then guilt, then the careful mask of a man who knows what the right thing looks like even when he doesn't feel it.

"No, you should come," he said. "I want you to come."

So you pack a bag. Because when a person who might leave you says stay, you stay. And when they say come, you come.

Your therapist says it might help. Your friend says it won't. You go anyway.

At the airport, Pelle finds you before anyone else does. "I lost my parents too," he says quietly, standing close enough that you can smell woodsmoke on his jacket. "Not the same way. But I know what it is to have the ground disappear."

It's the most honest thing anyone has said to you since January.

On the plane, you take your Ativan. You lean against the window. You fly toward a country where the sun never sets, and you wonder if that means you'll never have to sleep again, and whether that would be a mercy or a punishment.`,
      },
    ],
    background: 'apartment_night',
    ambientSound: 'wind_road',
    transitionType: 'fade',
    typingSpeed: 'slow',
    pauseAfterMs: 3000,
    stressModifiers: { pulse: 35, exposure: 0, mask: 45, dissociation: 15 },
    next: 'prologue_car',
  },
]

export const PROLOGUE_CHAPTER: Chapter = {
  id: 'prologue',
  day: 0,
  title: 'BEFORE',
  subtitle: 'The last night everything was still possible.',
  scenes: PROLOGUE_SCENES,
  anchorScene: 'prologue_apartment',
  consequenceScene: 'prologue_discovery',
}
