const branchShortMap = {
  "Perceiving Emotions": "Perceive",
  "Using Emotions to Facilitate Thinking": "Use",
  "Understanding Emotions": "Understand",
  "Managing Emotions": "Manage"
};

const branchKeys = {
  "Perceiving Emotions": "perceiving",
  "Using Emotions to Facilitate Thinking": "using",
  "Understanding Emotions": "understanding",
  "Managing Emotions": "managing"
};

const visualTypeBySetting = {
  chat: "phone-read-receipt",
  classroom: "classroom-tension",
  interview: "interview-anxiety",
  conflict: "teamwork-conflict",
  family: "family-pressure",
  presentation: "public-embarrassment",
  reflection: "final-reflection",
  study: "exam-stress",
  work: "workplace-feedback",
  social: "social-media-misread"
};

const displayOrders = [
  ["o2", "o4", "o1", "o3"],
  ["o3", "o1", "o4", "o2"],
  ["o4", "o2", "o3", "o1"],
  ["o2", "o3", "o1", "o4"],
  ["o3", "o4", "o2", "o1"],
  ["o4", "o1", "o3", "o2"],
  ["o2", "o1", "o4", "o3"],
  ["o3", "o2", "o1", "o4"],
  ["o4", "o3", "o2", "o1"],
  ["o2", "o4", "o3", "o1"],
  ["o3", "o1", "o2", "o4"],
  ["o4", "o2", "o1", "o3"],
  ["o2", "o3", "o4", "o1"],
  ["o3", "o4", "o1", "o2"],
  ["o4", "o1", "o2", "o3"],
  ["o2", "o1", "o3", "o4"],
  ["o3", "o2", "o4", "o1"],
  ["o4", "o3", "o1", "o2"],
  ["o2", "o4", "o1", "o3"],
  ["o3", "o1", "o4", "o2"],
  ["o4", "o2", "o3", "o1"],
  ["o2", "o3", "o1", "o4"],
  ["o3", "o4", "o2", "o1"],
  ["o4", "o1", "o3", "o2"],
  ["o2", "o1", "o4", "o3"],
  ["o3", "o2", "o1", "o4"],
  ["o4", "o3", "o2", "o1"],
  ["o2", "o4", "o3", "o1"],
  ["o3", "o1", "o2", "o4"],
  ["o4", "o2", "o1", "o3"],
  ["o2", "o3", "o4", "o1"]
];

function branchScore(branch, score) {
  return {
    perceiving: branch === "Perceiving Emotions" ? score : 0,
    using: branch === "Using Emotions to Facilitate Thinking" ? score : 0,
    understanding: branch === "Understanding Emotions" ? score : 0,
    managing: branch === "Managing Emotions" ? score : 0
  };
}

function effectivenessLevel(score) {
  if (score === 4) return "high";
  if (score === 3) return "moderate";
  if (score === 2) return "low";
  return "very_low";
}

function makeOption(question, option) {
  return {
    ...option,
    optionId: option.id,
    original_option_id: option.id,
    original_text: option.text,
    label: option.text,
    description: option.text,
    text: option.text,
    score_value: option.score,
    branch: question.branch,
    branchScore: branchScore(question.branch, option.score),
    ei: {
      effectivenessScore: option.score,
      effectivenessLevel: effectivenessLevel(option.score),
      rationale: `${option.role}: ${option.rationale}`
    }
  };
}

function makeQuestion(item, index) {
  const question = {
    level: index + 1,
    id: item.id,
    levelId: item.id,
    chapter: index + 1,
    scene_title: item.sceneTitle,
    title: item.sceneTitle,
    branch: item.branch,
    branchPrimary: item.branch,
    EI_branch: item.branch,
    branchShort: branchShortMap[item.branch],
    branchKey: branchKeys[item.branch],
    scenario: item.scenario,
    player_state: item.playerState,
    visual_setting: item.visualSetting,
    emotional_tone: item.emotionalTone,
    avatar_reaction: item.avatarReaction,
    animation_hint: item.animationHint,
    sound_cue: item.soundCue,
    display_order: displayOrders[index],
    displayed_option_order: displayOrders[index],
    sceneTone: item.emotionalTone,
    mood: item.avatarState,
    setting: item.visualGroup,
    story: item.scenario,
    context: item.scenario,
    prompt: item.prompt,
    visualType: visualTypeBySetting[item.visualGroup] ?? "final-reflection",
    theme: item.visualGroup,
    culturalTags: [item.visualGroup, branchShortMap[item.branch], "young-adult", "India-adaptable", "research"],
    scene: {
      background: { type: "gradient", value: item.visualSetting },
      ambientAudioSrc: "",
      avatarEmotionState: item.avatarState,
      visualSetting: item.visualSetting,
      emotionalTone: item.emotionalTone,
      avatarReaction: item.avatarReaction,
      animationHint: item.animationHint,
      soundCue: item.soundCue
    },
    narrative: {
      context: item.scenario,
      prompt: item.prompt,
      playerInternalState: item.playerState
    },
    options: []
  };
  question.options = item.options.map((option) => makeOption(question, option));
  return question;
}

const items = [
  {
    id: "level-01",
    sceneTitle: "The Read Receipt",
    branch: "Perceiving Emotions",
    visualGroup: "chat",
    avatarState: "nervous",
    emotionalTone: "quiet, uncertain, socially tense",
    visualSetting: "A dim hostel room lit by a phone screen and a half-finished cup of chai on the desk.",
    avatarReaction: "Eyes linger on the screen; shoulders slightly lifted, thumb hovering without tapping.",
    animationHint: "The seen marker stays still while the typing bubble briefly appears and vanishes.",
    soundCue: "Faint ceiling fan and one soft notification from another app.",
    playerState: "My chest is tight; I want to know if I have done something wrong.",
    scenario: "You messaged a close friend about meeting after class. It shows seen, but there is no reply for hours. Earlier, they were warm, but today their replies have been shorter.",
    prompt: "What do you do next?",
    options: [
      { id: "o1", text: "Notice the anxiety first, then check what you actually know: seen message, shorter replies, no clear reason. Give it some time and, if needed, ask once without assuming.", score: 4, role: "High EI response", rationale: "separates internal cues from limited external evidence under ambiguity." },
      { id: "o2", text: "Send a simple follow-up like, 'Hey, just checking about later. No rush,' because waiting is making you restless.", score: 3, role: "Partially adaptive response", rationale: "seeks data directly, though urgency is still driven by discomfort." },
      { id: "o3", text: "Start replaying recent conversations and hold back from messaging because it feels safer to wait for them to explain.", score: 2, role: "Avoidant or confused response", rationale: "recognizes uncertainty but lets anxious inference dominate perception." },
      { id: "o4", text: "Put up a vague status about people ignoring messages so they might understand you are hurt.", score: 1, role: "Impulsive or reactive response", rationale: "acts on an unverified read and increases ambiguity." }
    ]
  },
  {
    id: "level-02",
    sceneTitle: "Before the Viva",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "interview",
    avatarState: "nervous",
    emotionalTone: "alert, pressured, anticipatory",
    visualSetting: "Late-night study table, laptop open to slides, tube light flickering above scattered notes.",
    avatarReaction: "Jaw tight, breathing shallow, but eyes alert and scanning the screen.",
    animationHint: "Slide thumbnails pulse softly as the cursor moves between notes and calendar.",
    soundCue: "Muted clock tick and distant scooter traffic.",
    playerState: "The worry is loud, but maybe it is pointing at what needs attention.",
    scenario: "Your project viva is tomorrow. You feel nervous, and your mind keeps jumping between possible questions, your guide's expectations, and one weak slide you avoided fixing.",
    prompt: "How do you use this emotional state tonight?",
    options: [
      { id: "o1", text: "Treat the nervousness as a signal and make a short plan: fix the weak slide, rehearse three likely questions, then stop at a set time.", score: 4, role: "High EI response", rationale: "uses arousal to prioritize thinking and protect recovery." },
      { id: "o2", text: "Do a broad review until you feel a little calmer, even if the plan is not very specific.", score: 3, role: "Partially adaptive response", rationale: "uses emotion to initiate preparation but with weaker focus." },
      { id: "o3", text: "Keep switching between slides, videos, and old chats because settling on one task feels difficult.", score: 2, role: "Avoidant or confused response", rationale: "emotional arousal fragments attention rather than guiding it." },
      { id: "o4", text: "Tell yourself panic means you are already going to mess up, then stay awake pushing randomly through everything.", score: 1, role: "Impulsive or reactive response", rationale: "lets fear drive inefficient and exhausting cognition." }
    ]
  },
  {
    id: "level-03",
    sceneTitle: "The One-Word Reply",
    branch: "Understanding Emotions",
    visualGroup: "chat",
    avatarState: "hurt",
    emotionalTone: "tender, ambiguous, easily misread",
    visualSetting: "Phone chat open during a quiet bus ride home after college.",
    avatarReaction: "Brows pinch for a second; lips press together before the phone is lowered.",
    animationHint: "The word 'Okay' lands alone in the thread, leaving empty space beneath it.",
    soundCue: "Bus engine hum and a brief dip into silence.",
    playerState: "I was excited, and now I feel suddenly small.",
    scenario: "Someone you are dating replies 'Okay' to something you shared with excitement. They were affectionate yesterday, but today they have been slower and less expressive.",
    prompt: "What interpretation do you hold before responding?",
    options: [
      { id: "o1", text: "Hold several possibilities at once: they may be busy, tired, distracted, or less interested. Notice the hurt and ask gently if everything is okay.", score: 4, role: "High EI response", rationale: "tracks emotional causes and avoids premature certainty." },
      { id: "o2", text: "Assume the reply probably means low energy, respond lightly, and check later when tone is easier to read.", score: 3, role: "Partially adaptive response", rationale: "keeps the interpretation tentative but narrows possibilities." },
      { id: "o3", text: "Decide they are pulling away, but say nothing because you do not want to look needy.", score: 2, role: "Avoidant or confused response", rationale: "turns hurt into a fixed explanation without enough evidence." },
      { id: "o4", text: "Reply, 'Wow, okay then,' because the one-word answer feels disrespectful after your effort.", score: 1, role: "Impulsive or reactive response", rationale: "confuses emotional impact with confirmed intent." }
    ]
  },
  {
    id: "level-04",
    sceneTitle: "Noise During Exam Week",
    branch: "Managing Emotions",
    visualGroup: "conflict",
    avatarState: "irritated",
    emotionalTone: "strained, tired, close to snapping",
    visualSetting: "Shared room at midnight, reels playing from the next bed, exam notes open under harsh light.",
    avatarReaction: "Shoulders tense; fingers grip the pen harder before loosening.",
    animationHint: "The volume icon flickers with each burst of audio.",
    soundCue: "Tinny reel audio, then a low breath.",
    playerState: "I am exhausted, and every sound feels personal.",
    scenario: "It is exam week. Your roommate is watching reels loudly late at night. You have tried to ignore it, but your irritation is rising and your focus is slipping.",
    prompt: "What is the most emotionally effective next step?",
    options: [
      { id: "o1", text: "Pause long enough to steady your voice, then say, 'I am struggling to focus. Can we keep audio low after 11 this week?'", score: 4, role: "High EI response", rationale: "regulates irritation while making a concrete request." },
      { id: "o2", text: "Use earphones for tonight and bring up quiet hours tomorrow when you are less tired.", score: 3, role: "Partially adaptive response", rationale: "reduces immediate escalation but delays direct resolution." },
      { id: "o3", text: "Keep studying with visible annoyance, hoping they notice and lower the volume.", score: 2, role: "Avoidant or confused response", rationale: "contains anger but relies on indirect communication." },
      { id: "o4", text: "Say, 'Can you stop being so inconsiderate?' because the frustration has built up too much.", score: 1, role: "Impulsive or reactive response", rationale: "expresses the need through blame, increasing defensiveness." }
    ]
  },
  {
    id: "level-05",
    sceneTitle: "The Group Chat Silence",
    branch: "Perceiving Emotions",
    visualGroup: "chat",
    avatarState: "confused",
    emotionalTone: "uneasy, watchful, socially anxious",
    visualSetting: "Afternoon library corner, group chat open beside highlighted notes.",
    avatarReaction: "Eyes move between the unread count and the door; one foot taps under the table.",
    animationHint: "Profile icons remain still while the screen brightness slowly dims.",
    soundCue: "Library hush and a chair scraping far away.",
    playerState: "My stomach drops even though nothing has actually happened.",
    scenario: "You shared an idea in your friend group chat. No one reacts for hours. Two people are online, but the chat is quiet, and you notice yourself checking repeatedly.",
    prompt: "What helps you perceive the situation more accurately?",
    options: [
      { id: "o1", text: "Name the uneasy feeling, then look for context: time of day, everyone's usual reply pattern, and whether the silence is actually about you.", score: 4, role: "High EI response", rationale: "integrates body cues with contextual emotional evidence." },
      { id: "o2", text: "Ask once, 'Does this idea work for everyone?' so you can stop guessing from silence.", score: 3, role: "Partially adaptive response", rationale: "clarifies cues directly but may bypass self-observation." },
      { id: "o3", text: "Assume the idea probably sounded awkward and decide not to bring it up again.", score: 2, role: "Avoidant or confused response", rationale: "treats anxiety as evidence of social rejection." },
      { id: "o4", text: "Send a few more messages to make the chat active again because the quiet feels unbearable.", score: 1, role: "Impulsive or reactive response", rationale: "acts to relieve discomfort rather than perceive accurately." }
    ]
  },
  {
    id: "level-06",
    sceneTitle: "Interview Nerves",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "interview",
    avatarState: "nervous",
    emotionalTone: "energized, hopeful, unstable",
    visualSetting: "Waiting area outside a campus interview room, resume folder balanced on your knees.",
    avatarReaction: "Hands smooth the resume edge; posture straightens after a slow exhale.",
    animationHint: "The interview room door opens for another candidate, then closes.",
    soundCue: "Low hallway murmur and a quick heartbeat-like bass pulse.",
    playerState: "I am scared, but the fear is making me sharper.",
    scenario: "Your interview starts in two hours. You feel nervous but energized, and your thoughts swing between hope and fear about how you will come across.",
    prompt: "How do you use this state to think more effectively?",
    options: [
      { id: "o1", text: "Use the alertness to rehearse three likely questions and one example that shows your strengths, then take a short grounding break.", score: 4, role: "High EI response", rationale: "channels arousal into structured preparation and composure." },
      { id: "o2", text: "Skim the company profile and your resume again because reviewing something familiar calms you.", score: 3, role: "Partially adaptive response", rationale: "uses emotion to prepare, though less strategically." },
      { id: "o3", text: "Try to act like you are not nervous and avoid thinking about the interview until they call your name.", score: 2, role: "Avoidant or confused response", rationale: "suppresses useful emotional information." },
      { id: "o4", text: "Keep texting friends for reassurance until the last minute because the nervousness feels too intense to sit with.", score: 1, role: "Impulsive or reactive response", rationale: "outsources regulation and weakens task focus." }
    ]
  },
  {
    id: "level-07",
    sceneTitle: "A Friend Cancels Again",
    branch: "Understanding Emotions",
    visualGroup: "conflict",
    avatarState: "hurt",
    emotionalTone: "disappointed, angry, uncertain",
    visualSetting: "Cafe table with two untouched glasses, rain gathering outside the window.",
    avatarReaction: "A small swallow; eyes leave the phone and settle on the empty chair.",
    animationHint: "The cancelled-plan message slides in over the reservation reminder.",
    soundCue: "Rain tapping glass and muffled cafe conversations.",
    playerState: "I feel foolish for expecting it to be different this time.",
    scenario: "A close friend cancels plans for the third time, saying they are busy. You feel disappointed and a little angry, but you also know they have been under pressure at home.",
    prompt: "What understanding best fits before you respond?",
    options: [
      { id: "o1", text: "Recognize both hurt and care: they may be overloaded, avoiding something, or not realizing the impact. Ask what is happening and say the pattern matters to you.", score: 4, role: "High EI response", rationale: "understands mixed emotions and multiple causes over time." },
      { id: "o2", text: "Assume they are probably stretched thin, reply politely, and decide to talk about the pattern later.", score: 3, role: "Partially adaptive response", rationale: "allows context but may understate your own hurt." },
      { id: "o3", text: "Tell yourself you should not feel upset because they are busy, then go quiet.", score: 2, role: "Avoidant or confused response", rationale: "misunderstands valid disappointment as unfairness." },
      { id: "o4", text: "Text that you are done making plans with someone who clearly does not care.", score: 1, role: "Impulsive or reactive response", rationale: "turns repeated disappointment into a global character judgment." }
    ]
  },
  {
    id: "level-08",
    sceneTitle: "The Family Pressure Call",
    branch: "Managing Emotions",
    visualGroup: "family",
    avatarState: "irritated",
    emotionalTone: "pressured, defensive, guilty",
    visualSetting: "Balcony at dusk, phone against your ear, city sounds rising below.",
    avatarReaction: "Free hand rubs the forehead; voice lowers before answering.",
    animationHint: "The call timer keeps climbing while message previews stack silently.",
    soundCue: "Distant traffic and a thin line of call static.",
    playerState: "I want them to understand, but I also want to escape this call.",
    scenario: "A family member insists you should choose a career path you are unsure about. Their concern is real, but their tone feels controlling, and guilt mixes with irritation.",
    prompt: "How do you manage the moment?",
    options: [
      { id: "o1", text: "Acknowledge their concern, slow the pace, and set a boundary: 'I hear you. I need time to compare options before deciding.'", score: 4, role: "High EI response", rationale: "regulates defensiveness while protecting autonomy." },
      { id: "o2", text: "Say you will think about it and move the conversation to a calmer time because you feel close to arguing.", score: 3, role: "Partially adaptive response", rationale: "prevents escalation but postpones clearer boundary-setting." },
      { id: "o3", text: "Agree for now so the pressure stops, even though you feel resentful afterward.", score: 2, role: "Avoidant or confused response", rationale: "reduces conflict by disconnecting from your own emotional signal." },
      { id: "o4", text: "Snap that they never listen and end the call before they can reply.", score: 1, role: "Impulsive or reactive response", rationale: "discharges anger without managing the relationship." }
    ]
  },
  {
    id: "level-09",
    sceneTitle: "Tone in the Classroom",
    branch: "Perceiving Emotions",
    visualGroup: "classroom",
    avatarState: "confused",
    emotionalTone: "public, ambiguous, slightly embarrassing",
    visualSetting: "Bright classroom after a presentation, classmates shifting bags while the professor comments.",
    avatarReaction: "Smile freezes briefly; eyes search the professor's face for warmth or criticism.",
    animationHint: "A feedback line appears on the projector, then the screen sleeps.",
    soundCue: "Projector fan and scattered notebook zips.",
    playerState: "Was that a joke, criticism, or both?",
    scenario: "After your presentation, the professor says, 'Interesting choice of examples,' with a half-smile. A few classmates glance at each other, and you feel embarrassed.",
    prompt: "What do you attend to first?",
    options: [
      { id: "o1", text: "Notice your embarrassment, then read several cues together: voice tone, facial expression, class reaction, and the actual feedback content.", score: 4, role: "High EI response", rationale: "uses multiple emotional signals rather than one cue." },
      { id: "o2", text: "Ask after class if they meant the examples worked, because the comment felt hard to read.", score: 3, role: "Partially adaptive response", rationale: "clarifies ambiguity but after an initial emotional spike." },
      { id: "o3", text: "Assume it was criticism and mentally check out for the rest of class.", score: 2, role: "Avoidant or confused response", rationale: "lets embarrassment narrow perception." },
      { id: "o4", text: "Whisper to a friend that the professor was being sarcastic because the glance from classmates stung.", score: 1, role: "Impulsive or reactive response", rationale: "converts ambiguous cues into a defensive certainty." }
    ]
  },
  {
    id: "level-10",
    sceneTitle: "After a Low Mark",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "study",
    avatarState: "hurt",
    emotionalTone: "flat, disappointed, self-doubting",
    visualSetting: "Exam portal open on a laptop, late afternoon light fading across the desk.",
    avatarReaction: "Body sinks back; fingers stop moving on the trackpad.",
    animationHint: "The score loads with a small delay, then the page becomes still.",
    soundCue: "Room tone drops into a muted low hum.",
    playerState: "I feel numb and ashamed, but I need to understand what happened.",
    scenario: "You receive a lower mark than expected. You feel disappointed, slightly ashamed, and oddly numb. A re-test is in two weeks.",
    prompt: "How can the emotion help your next thinking step?",
    options: [
      { id: "o1", text: "Let the first wave pass, then use the disappointment to identify which topics, study methods, or exam choices need changing.", score: 4, role: "High EI response", rationale: "turns emotion into diagnostic attention." },
      { id: "o2", text: "Take the evening off and review the paper tomorrow when the shame feels less sharp.", score: 3, role: "Partially adaptive response", rationale: "protects thinking from overload but delays analysis." },
      { id: "o3", text: "Scroll through others' reactions and compare marks, hoping it will tell you how bad this really is.", score: 2, role: "Avoidant or confused response", rationale: "uses social comparison instead of task-relevant emotion." },
      { id: "o4", text: "Decide the subject is not for you and stop looking at the material for a few days.", score: 1, role: "Impulsive or reactive response", rationale: "lets shame drive a broad conclusion." }
    ]
  },
  {
    id: "level-11",
    sceneTitle: "Sarcasm in the Comment",
    branch: "Understanding Emotions",
    visualGroup: "social",
    avatarState: "hurt",
    emotionalTone: "exposed, irritated, unsure",
    visualSetting: "Instagram comments under a fresh post, screen glowing in a dark room.",
    avatarReaction: "Brows tighten; thumb hovers over reply, then pulls back.",
    animationHint: "A laughing emoji reaction bounces once and settles.",
    soundCue: "Soft notification, then sudden quiet.",
    playerState: "I cannot tell if I am being teased or targeted.",
    scenario: "A classmate comments, 'Wow, influencer era?' under your post. Some friends like the comment. You feel a mix of embarrassment and irritation.",
    prompt: "What understanding best explains the emotional situation?",
    options: [
      { id: "o1", text: "It could be playful teasing, status-joking, or a mild dig. Your embarrassment matters, but the intent needs context before you respond.", score: 4, role: "High EI response", rationale: "distinguishes impact, intent, and social context." },
      { id: "o2", text: "It is probably a joke, but if it keeps bothering you, ask them privately what they meant.", score: 3, role: "Partially adaptive response", rationale: "keeps options open but leans toward one interpretation." },
      { id: "o3", text: "It must mean they think you are showing off, so it is better to act like you did not care.", score: 2, role: "Avoidant or confused response", rationale: "treats embarrassment as proof of judgment." },
      { id: "o4", text: "Reply with a sharper joke so people know you are not someone to mock.", score: 1, role: "Impulsive or reactive response", rationale: "uses irritation to escalate uncertain social meaning." }
    ]
  },
  {
    id: "level-12",
    sceneTitle: "Pre-Presentation Panic",
    branch: "Managing Emotions",
    visualGroup: "presentation",
    avatarState: "nervous",
    emotionalTone: "panicky, exposed, high-stakes",
    visualSetting: "Back of a seminar hall, name called next, slides mirrored on the projector.",
    avatarReaction: "Breath catches; one hand presses briefly against the stomach.",
    animationHint: "The cursor blinks on the first slide while audience shadows shift.",
    soundCue: "Muffled applause fading into heartbeat-like silence.",
    playerState: "My body thinks this is danger, but I still have to speak.",
    scenario: "You are about to present. Your mouth is dry, your hands feel cold, and you worry everyone will notice you are anxious.",
    prompt: "What response manages the emotion best?",
    options: [
      { id: "o1", text: "Ground your feet, take two slower breaths, and begin with the first prepared sentence instead of waiting to feel fearless.", score: 4, role: "High EI response", rationale: "regulates physiological arousal while preserving action." },
      { id: "o2", text: "Sip water and look at one friendly face before starting.", score: 3, role: "Partially adaptive response", rationale: "uses manageable support cues but less fully regulates panic." },
      { id: "o3", text: "Rush through the opening quickly so the anxious part is over sooner.", score: 2, role: "Avoidant or confused response", rationale: "reduces exposure by sacrificing pacing." },
      { id: "o4", text: "Apologize immediately for being nervous and explain you are not good at presentations.", score: 1, role: "Impulsive or reactive response", rationale: "lets anxiety define the interaction." }
    ]
  },
  {
    id: "level-13",
    sceneTitle: "A Smile That Feels Off",
    branch: "Perceiving Emotions",
    visualGroup: "classroom",
    avatarState: "reflective",
    emotionalTone: "subtle, concerned, ambiguous",
    visualSetting: "College corridor between classes, sunlight striping the floor through railings.",
    avatarReaction: "Head tilts slightly; gaze softens without staring.",
    animationHint: "The friend's smile appears for a beat, then their eyes drop to the floor.",
    soundCue: "Footsteps passing and a distant bell.",
    playerState: "They said they are fine, but their face did not match it.",
    scenario: "A friend smiles and says they are fine after getting a call from home. Their voice is steady, but their eyes look wet and they avoid your gaze.",
    prompt: "What do you perceive from the cues?",
    options: [
      { id: "o1", text: "The smile may be covering sadness or worry. Stay gentle and ask if they want company without forcing them to explain.", score: 4, role: "High EI response", rationale: "reads mixed facial and vocal cues with respect for privacy." },
      { id: "o2", text: "Assume something is off and tell them you are around if they want to talk later.", score: 3, role: "Partially adaptive response", rationale: "notices emotion but gathers less immediate information." },
      { id: "o3", text: "Accept 'fine' literally because asking more might make things awkward.", score: 2, role: "Avoidant or confused response", rationale: "misses incongruent emotional cues." },
      { id: "o4", text: "Say, 'You are clearly not fine,' because the fake smile bothers you.", score: 1, role: "Impulsive or reactive response", rationale: "identifies distress but confronts it bluntly." }
    ]
  },
  {
    id: "level-14",
    sceneTitle: "Motivation Dip in Internship",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "work",
    avatarState: "reflective",
    emotionalTone: "drained, bored, quietly worried",
    visualSetting: "Office desk near closing time, spreadsheet open, coffee gone cold.",
    avatarReaction: "Eyes unfocus; shoulders drop before posture resets.",
    animationHint: "Rows of data blur slightly, then one task cell highlights.",
    soundCue: "Keyboard taps thinning out around the room.",
    playerState: "I am not sad exactly; I just feel switched off.",
    scenario: "During your internship, a repetitive task starts feeling meaningless. You notice restlessness, low energy, and a worry that you are becoming careless.",
    prompt: "How do you use that emotion to guide thinking?",
    options: [
      { id: "o1", text: "Treat the dip as information: identify the task's purpose, set a short accuracy target, and ask one clarifying question if needed.", score: 4, role: "High EI response", rationale: "uses low motivation to improve attention and meaning." },
      { id: "o2", text: "Break the task into smaller blocks and reward yourself with a short walk after one clean section.", score: 3, role: "Partially adaptive response", rationale: "supports focus, though it may not address meaning." },
      { id: "o3", text: "Keep the tab open while switching to easier tasks whenever boredom gets uncomfortable.", score: 2, role: "Avoidant or confused response", rationale: "lets emotion fragment priorities." },
      { id: "o4", text: "Decide the internship is pointless and do the task carelessly because nobody will notice.", score: 1, role: "Impulsive or reactive response", rationale: "turns boredom into disengaged judgment." }
    ]
  },
  {
    id: "level-15",
    sceneTitle: "Late Reply From Partner",
    branch: "Understanding Emotions",
    visualGroup: "chat",
    avatarState: "nervous",
    emotionalTone: "anxious, tender, suspicious",
    visualSetting: "Phone on pillow at night, unread messages glowing beside a charging cable.",
    avatarReaction: "Body curls inward slightly; thumb scrolls old messages.",
    animationHint: "Old affectionate messages slide past under today's silence.",
    soundCue: "Quiet room with a charging chime.",
    playerState: "I miss them and also feel annoyed that I care this much.",
    scenario: "Your partner has replied late for three days. They say college work is heavy. You feel anxious, a little angry, and embarrassed by how often you check your phone.",
    prompt: "What emotional understanding is most accurate?",
    options: [
      { id: "o1", text: "Your anxiety may be about distance, not proof of rejection. Their workload and your need for reassurance can both be real.", score: 4, role: "High EI response", rationale: "understands simultaneous emotions and relational needs." },
      { id: "o2", text: "They are probably busy, but the pattern is worth discussing when both of you have time.", score: 3, role: "Partially adaptive response", rationale: "recognizes context and pattern with less depth about self-emotion." },
      { id: "o3", text: "If you were more secure, this would not bother you, so it is better to hide it.", score: 2, role: "Avoidant or confused response", rationale: "mislabels anxiety as personal weakness." },
      { id: "o4", text: "The late replies clearly mean their feelings changed, so you should reply coldly too.", score: 1, role: "Impulsive or reactive response", rationale: "confuses fear with evidence and mirrors withdrawal." }
    ]
  },
  {
    id: "level-16",
    sceneTitle: "Argument After a Misquote",
    branch: "Managing Emotions",
    visualGroup: "conflict",
    avatarState: "irritated",
    emotionalTone: "angry, exposed, defensive",
    visualSetting: "Team meeting room, laptop screens open, one sentence from you repeated incorrectly.",
    avatarReaction: "Eyes sharpen; hand lifts slightly, then lowers to the table.",
    animationHint: "The misquoted line appears in chat as your cursor blinks in reply.",
    soundCue: "Low room murmur and a chair rolling back.",
    playerState: "I want to correct this before everyone believes it.",
    scenario: "During a group project discussion, someone summarizes your point in a way that makes you sound careless. You feel anger rise because others are listening.",
    prompt: "What is the best way to manage the emotion?",
    options: [
      { id: "o1", text: "Interrupt gently but clearly: 'I want to clarify that my point was slightly different,' then restate it without attacking them.", score: 4, role: "High EI response", rationale: "uses anger's signal while regulating expression." },
      { id: "o2", text: "Wait for a pause and correct the point, even if your tone is a little tense.", score: 3, role: "Partially adaptive response", rationale: "addresses the issue with moderate regulation." },
      { id: "o3", text: "Stay quiet in the meeting but feel annoyed and message another teammate afterward.", score: 2, role: "Avoidant or confused response", rationale: "contains anger but does not repair the public misunderstanding." },
      { id: "o4", text: "Say, 'That is not what I said at all,' with visible irritation so the room knows you are serious.", score: 1, role: "Impulsive or reactive response", rationale: "corrects content while escalating emotional threat." }
    ]
  },
  {
    id: "level-17",
    sceneTitle: "Friend Avoids a Topic",
    branch: "Perceiving Emotions",
    visualGroup: "social",
    avatarState: "reflective",
    emotionalTone: "careful, uneasy, protective",
    visualSetting: "College canteen table, half-eaten snacks, friends laughing nearby.",
    avatarReaction: "Eyes soften; body leans back to give space.",
    animationHint: "The friend's smile fades when a family topic comes up.",
    soundCue: "Canteen chatter briefly muffles.",
    playerState: "Something shifted, and I do not want to push too hard.",
    scenario: "When you mention internships in another city, your friend suddenly looks away and changes the topic. Their voice stays normal, but their hands become restless.",
    prompt: "What emotional cue reading is strongest?",
    options: [
      { id: "o1", text: "They may feel worry, pressure, or sadness connected to the topic. Notice the shift and leave room for them to choose whether to talk.", score: 4, role: "High EI response", rationale: "perceives nonverbal change without overclaiming." },
      { id: "o2", text: "Assume the topic made them uncomfortable and gently move on for now.", score: 3, role: "Partially adaptive response", rationale: "reads discomfort but gathers little detail." },
      { id: "o3", text: "Think they are bored with the conversation and try to make the topic more interesting.", score: 2, role: "Avoidant or confused response", rationale: "misreads withdrawal as disinterest." },
      { id: "o4", text: "Ask in front of everyone why they got weird about it.", score: 1, role: "Impulsive or reactive response", rationale: "notices a cue but ignores emotional safety." }
    ]
  },
  {
    id: "level-18",
    sceneTitle: "Decision Fatigue at Night",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "study",
    avatarState: "confused",
    emotionalTone: "foggy, overloaded, restless",
    visualSetting: "Bedroom after midnight, multiple tabs open for course registration.",
    avatarReaction: "Eyes blink slowly; fingers hover between two forms.",
    animationHint: "Dropdown menus open and close without selection.",
    soundCue: "Low laptop fan and distant street noise.",
    playerState: "Every option looks wrong because I am too tired to think.",
    scenario: "You need to choose elective preferences tonight. You are tired, mildly anxious, and irritated by how many small decisions remain.",
    prompt: "How should the emotion shape your thinking process?",
    options: [
      { id: "o1", text: "Recognize fatigue as reducing judgment. Pick only the non-negotiables now, save the rest, and review in the morning if the deadline allows.", score: 4, role: "High EI response", rationale: "uses emotional state to adjust decision timing and scope." },
      { id: "o2", text: "Make a quick pros-and-cons list for the top two options so the decision feels less scattered.", score: 3, role: "Partially adaptive response", rationale: "structures thinking but may underestimate fatigue." },
      { id: "o3", text: "Ask several friends what they are choosing and follow whichever answer appears most common.", score: 2, role: "Avoidant or confused response", rationale: "outsources thought because emotion feels uncomfortable." },
      { id: "o4", text: "Click through choices randomly because you are irritated and want it finished.", score: 1, role: "Impulsive or reactive response", rationale: "lets fatigue and irritation control the decision." }
    ]
  },
  {
    id: "level-19",
    sceneTitle: "A Joke Crossed a Line",
    branch: "Understanding Emotions",
    visualGroup: "social",
    avatarState: "hurt",
    emotionalTone: "embarrassed, stung, socially exposed",
    visualSetting: "Birthday table at a cafe, everyone laughing as one joke hangs too long.",
    avatarReaction: "Smile stays on but eyes drop; shoulders pull inward.",
    animationHint: "Laughter continues for a second after your expression changes.",
    soundCue: "Clinking plates and laughter fading unevenly.",
    playerState: "Part of me knows it was a joke, but it still hurt.",
    scenario: "A friend jokes about your old failure in front of others. People laugh. You feel embarrassed, hurt, and a little guilty for not being able to laugh along.",
    prompt: "What emotional understanding fits best?",
    options: [
      { id: "o1", text: "The joke may not have been meant to harm, but it touched shame in a public setting. Both intent and impact matter.", score: 4, role: "High EI response", rationale: "differentiates shame, embarrassment, intent, and impact." },
      { id: "o2", text: "It was probably casual teasing, but your discomfort is a sign to tell them later where the line is.", score: 3, role: "Partially adaptive response", rationale: "recognizes impact but simplifies the emotional mix." },
      { id: "o3", text: "You are being too sensitive, so you should forget it and not make the group uncomfortable.", score: 2, role: "Avoidant or confused response", rationale: "invalidates hurt and shame instead of understanding them." },
      { id: "o4", text: "They humiliated you on purpose, so you should bring up something embarrassing about them too.", score: 1, role: "Impulsive or reactive response", rationale: "converts hurt into retaliatory certainty." }
    ]
  },
  {
    id: "level-20",
    sceneTitle: "The Angry Email Draft",
    branch: "Managing Emotions",
    visualGroup: "work",
    avatarState: "irritated",
    emotionalTone: "heated, unfair, urgent",
    visualSetting: "Internship desk after feedback, email draft open with several sharp sentences.",
    avatarReaction: "Nostrils flare; hand pauses over the send button.",
    animationHint: "The send button glows while the cursor blinks at the end of a blunt line.",
    soundCue: "Keyboard clacks stop abruptly.",
    playerState: "I want to defend myself before this version of me becomes official.",
    scenario: "Your supervisor sends feedback that feels unfair and dismissive. You draft a defensive email immediately, and your anger makes the sentences sharper than usual.",
    prompt: "What should you do with the emotion?",
    options: [
      { id: "o1", text: "Save the draft, step away, then revise it into specific questions and evidence once the anger cools.", score: 4, role: "High EI response", rationale: "uses anger as information while delaying high-risk expression." },
      { id: "o2", text: "Ask for a short meeting instead of replying point by point over email.", score: 3, role: "Partially adaptive response", rationale: "chooses a richer channel but may still carry emotion into it." },
      { id: "o3", text: "Do not reply at all and hope the issue fades because responding feels risky.", score: 2, role: "Avoidant or confused response", rationale: "avoids escalation but leaves emotion and problem unmanaged." },
      { id: "o4", text: "Send the draft now because if you soften it, they will not understand how unfair it felt.", score: 1, role: "Impulsive or reactive response", rationale: "lets anger dictate timing and tone." }
    ]
  },
  {
    id: "level-21",
    sceneTitle: "Noticing a Classmate's Stress",
    branch: "Perceiving Emotions",
    visualGroup: "classroom",
    avatarState: "reflective",
    emotionalTone: "concerned, quiet, observant",
    visualSetting: "Lab room before submission, screens glowing while classmates whisper over code.",
    avatarReaction: "Eyes track a classmate's clenched jaw and repeated sighs without staring.",
    animationHint: "Their cursor remains still while deadline reminders pop up.",
    soundCue: "Soft typing, then a long exhale nearby.",
    playerState: "They look stretched, but I do not know if help would feel intrusive.",
    scenario: "A classmate who is usually relaxed keeps rubbing their temples, rereading the same line, and giving short answers. The deadline is close.",
    prompt: "What is the best emotional read?",
    options: [
      { id: "o1", text: "They likely feel stressed or stuck. Ask quietly if they want help, while keeping the option easy to decline.", score: 4, role: "High EI response", rationale: "reads body and behavior cues and checks respectfully." },
      { id: "o2", text: "Assume they are under pressure and give them space unless they ask.", score: 3, role: "Partially adaptive response", rationale: "notices stress but may miss an opening for support." },
      { id: "o3", text: "Take their short answers personally and avoid them for the rest of the lab.", score: 2, role: "Avoidant or confused response", rationale: "misattributes stress cues as interpersonal rejection." },
      { id: "o4", text: "Tell them in front of others that they look stressed and should calm down.", score: 1, role: "Impulsive or reactive response", rationale: "recognizes distress but responds in a socially unsafe way." }
    ]
  },
  {
    id: "level-22",
    sceneTitle: "Choosing a Hard Conversation Time",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "conflict",
    avatarState: "reflective",
    emotionalTone: "uncertain, careful, heavy",
    visualSetting: "Campus walkway after class, phone open to an unsent message.",
    avatarReaction: "Pace slows; thumb selects and deletes the same sentence twice.",
    animationHint: "Calendar slots slide past as the message draft waits.",
    soundCue: "Footsteps on concrete and a soft wind bed.",
    playerState: "I want to say it now, but I am not sure now is when I can think clearly.",
    scenario: "You need to talk to a friend about feeling taken for granted. You are tired after class, a little resentful, and worried the conversation could become emotional.",
    prompt: "How do you use emotion to choose timing?",
    options: [
      { id: "o1", text: "Use the resentment as a signal that the topic matters, but choose a time when both of you are not rushed or already depleted.", score: 4, role: "High EI response", rationale: "uses affect to plan conditions for better reasoning." },
      { id: "o2", text: "Send a message asking to talk later because saying nothing will keep building tension.", score: 3, role: "Partially adaptive response", rationale: "uses emotion to initiate repair but less fully prepares." },
      { id: "o3", text: "Wait indefinitely because any emotional conversation could damage the friendship.", score: 2, role: "Avoidant or confused response", rationale: "lets fear overrule needed problem-solving." },
      { id: "o4", text: "Start the conversation immediately while the feeling is fresh, even if you sound annoyed.", score: 1, role: "Impulsive or reactive response", rationale: "confuses emotional intensity with optimal timing." }
    ]
  },
  {
    id: "level-23",
    sceneTitle: "Two Friends, One Conflict",
    branch: "Understanding Emotions",
    visualGroup: "conflict",
    avatarState: "confused",
    emotionalTone: "loyal, conflicted, tense",
    visualSetting: "Hostel common area after dinner, two separate chat windows open on your phone.",
    avatarReaction: "Gaze shifts between messages; shoulders sink with the weight of both sides.",
    animationHint: "Two typing indicators alternate without overlapping.",
    soundCue: "TV noise from another room under a low sustained tone.",
    playerState: "I care about both of them, and that makes the situation harder to read.",
    scenario: "Two close friends are upset with each other and both tell you their side. One sounds hurt and betrayed; the other sounds defensive and ashamed.",
    prompt: "What understanding helps you respond fairly?",
    options: [
      { id: "o1", text: "Both may be protecting vulnerable feelings: hurt on one side, shame and defensiveness on the other. Avoid becoming the judge before hearing context.", score: 4, role: "High EI response", rationale: "maps layered emotions across people." },
      { id: "o2", text: "Tell each friend you care about them and need more context before taking any side.", score: 3, role: "Partially adaptive response", rationale: "keeps fairness but focuses more on action than emotional structure." },
      { id: "o3", text: "Believe whoever seems more upset because stronger emotion probably means they were hurt more.", score: 2, role: "Avoidant or confused response", rationale: "misreads emotional intensity as accuracy." },
      { id: "o4", text: "Push them into a group call right away because the tension is uncomfortable for you.", score: 1, role: "Impulsive or reactive response", rationale: "acts from your discomfort rather than understanding readiness." }
    ]
  },
  {
    id: "level-24",
    sceneTitle: "After a Heated Debate",
    branch: "Managing Emotions",
    visualGroup: "classroom",
    avatarState: "irritated",
    emotionalTone: "agitated, proud, unsettled",
    visualSetting: "Seminar room emptying after a debate, chairs angled out of place.",
    avatarReaction: "Breath is still quick; hand grips the backpack strap.",
    animationHint: "A final argument line echoes as the room lights flicker off row by row.",
    soundCue: "Chairs scraping and voices receding down the corridor.",
    playerState: "I still feel charged, and I do not fully trust what I might say next.",
    scenario: "A debate in class got heated. You made a strong point, but someone mocked your example. Class is over, and they are standing nearby.",
    prompt: "What manages the after-emotion best?",
    options: [
      { id: "o1", text: "Let the adrenaline settle before speaking, then decide whether a brief clarification or private follow-up is needed.", score: 4, role: "High EI response", rationale: "matches regulation strategy to post-conflict arousal." },
      { id: "o2", text: "Say a short, neutral line like, 'That got intense; we can discuss later,' and leave.", score: 3, role: "Partially adaptive response", rationale: "de-escalates but may not process the unresolved feeling." },
      { id: "o3", text: "Avoid eye contact and leave quickly, then replay better comebacks for the next hour.", score: 2, role: "Avoidant or confused response", rationale: "prevents immediate conflict but sustains rumination." },
      { id: "o4", text: "Walk up and make one final cutting point so they know the mockery was not acceptable.", score: 1, role: "Impulsive or reactive response", rationale: "lets residual arousal drive further escalation." }
    ]
  },
  {
    id: "level-25",
    sceneTitle: "Quiet After Your Story",
    branch: "Perceiving Emotions",
    visualGroup: "social",
    avatarState: "guilty",
    emotionalTone: "awkward, ashamed, uncertain",
    visualSetting: "Friend circle on a campus lawn, laughter fading after your story ends.",
    avatarReaction: "Smile falters; eyes scan faces for disapproval.",
    animationHint: "Conversation bubbles shrink as one friend looks down at the grass.",
    soundCue: "Outdoor chatter thins, then a bird call cuts through.",
    playerState: "I think I may have said too much, but I cannot tell.",
    scenario: "You tell a funny story about someone not present. The group goes quieter than expected. One friend gives a small smile but looks uncomfortable.",
    prompt: "What do you perceive in the moment?",
    options: [
      { id: "o1", text: "The quiet may signal discomfort, awkwardness, or concern about gossip. Notice your shame and the group's shift before continuing.", score: 4, role: "High EI response", rationale: "reads group affect and self-conscious body cues together." },
      { id: "o2", text: "Lightly check, 'Was that too much?' because the mood changed after the story.", score: 3, role: "Partially adaptive response", rationale: "seeks feedback but after interpreting the cue." },
      { id: "o3", text: "Assume they are judging you and stop talking for the rest of the hangout.", score: 2, role: "Avoidant or confused response", rationale: "overreads quiet as rejection." },
      { id: "o4", text: "Make another joke quickly so the awkwardness disappears.", score: 1, role: "Impulsive or reactive response", rationale: "tries to erase discomfort instead of perceiving it." }
    ]
  },
  {
    id: "level-26",
    sceneTitle: "Choosing Study vs Rest",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "study",
    avatarState: "confused",
    emotionalTone: "overloaded, guilty, depleted",
    visualSetting: "Desk at 1 a.m., highlighter uncapped, phone alarm set for morning.",
    avatarReaction: "Head dips forward; eyes burn while the hand keeps underlining.",
    animationHint: "Text on the page doubles slightly, then refocuses.",
    soundCue: "A long yawn and the low buzz of a tube light.",
    playerState: "If I sleep, I feel guilty; if I continue, nothing is going in.",
    scenario: "You have an exam tomorrow. You feel guilty for not finishing revision, but your body is heavy and you are rereading the same paragraph without absorbing it.",
    prompt: "How should emotion inform your decision?",
    options: [
      { id: "o1", text: "Use the guilt as a planning cue, not a command: review the two highest-value points, then sleep enough to think clearly tomorrow.", score: 4, role: "High EI response", rationale: "balances emotional pressure with cognitive effectiveness." },
      { id: "o2", text: "Set a 30-minute timer for final revision and stop when it ends.", score: 3, role: "Partially adaptive response", rationale: "creates structure but may still bargain with exhaustion." },
      { id: "o3", text: "Stay at the desk so you feel less guilty, even if the studying is mostly pretend.", score: 2, role: "Avoidant or confused response", rationale: "uses action to soothe guilt without improving thinking." },
      { id: "o4", text: "Panic-study all night because resting now feels like giving up.", score: 1, role: "Impulsive or reactive response", rationale: "lets guilt override learning and recovery." }
    ]
  },
  {
    id: "level-27",
    sceneTitle: "The Misunderstood Voice Note",
    branch: "Understanding Emotions",
    visualGroup: "chat",
    avatarState: "confused",
    emotionalTone: "confused, defensive, uneasy",
    visualSetting: "Kitchen counter at night, voice note waveform paused halfway.",
    avatarReaction: "Head tilts; eyebrows lift at one phrase, then settle into uncertainty.",
    animationHint: "The waveform rewinds to the same five seconds repeatedly.",
    soundCue: "A clipped voice note phrase and fridge hum.",
    playerState: "Their tone sounded annoyed, but voice notes can be misleading.",
    scenario: "A friend sends a voice note about your missed plan. Their words are normal, but their tone sounds tight. You feel defensive and guilty at the same time.",
    prompt: "What is the best emotional interpretation?",
    options: [
      { id: "o1", text: "They may be disappointed, tired, or trying not to sound angry. Your guilt may be accurate enough to repair without assuming hostility.", score: 4, role: "High EI response", rationale: "understands tone ambiguity and mixed self-emotion." },
      { id: "o2", text: "They sound upset, so apologize briefly and ask if they want to talk later.", score: 3, role: "Partially adaptive response", rationale: "responds to likely emotion but with less nuance." },
      { id: "o3", text: "Focus on the exact words and ignore the tone because tone is too easy to misread.", score: 2, role: "Avoidant or confused response", rationale: "drops relevant paralinguistic emotion data." },
      { id: "o4", text: "Send a defensive reply explaining why you missed the plan before they accuse you.", score: 1, role: "Impulsive or reactive response", rationale: "lets guilt and defensiveness create a threat response." }
    ]
  },
  {
    id: "level-28",
    sceneTitle: "Jealousy Spike",
    branch: "Managing Emotions",
    visualGroup: "social",
    avatarState: "irritated",
    emotionalTone: "jealous, ashamed, reactive",
    visualSetting: "Cafe table where your friend excitedly describes someone else's achievement.",
    avatarReaction: "Smile appears polite; fingers tighten around the cup.",
    animationHint: "The friend's words blur for a second as a social media post flashes in memory.",
    soundCue: "Cafe chatter muffled under a short low swell.",
    playerState: "I am happy for them, but I hate that I feel behind.",
    scenario: "A friend gets an opportunity you wanted. You feel jealousy, shame for feeling jealous, and pressure to sound supportive immediately.",
    prompt: "How do you manage the emotion?",
    options: [
      { id: "o1", text: "Acknowledge the jealousy privately, offer a sincere but simple congratulations, and give yourself space later to process what it points to.", score: 4, role: "High EI response", rationale: "regulates envy without denying or acting it out." },
      { id: "o2", text: "Congratulate them and keep the conversation short because you need time before you can be fully warm.", score: 3, role: "Partially adaptive response", rationale: "protects the relationship while managing limited capacity." },
      { id: "o3", text: "Act extra excited so nobody can tell you are jealous, then feel worse afterward.", score: 2, role: "Avoidant or confused response", rationale: "masks emotion without processing it." },
      { id: "o4", text: "Point out that opportunities like that depend a lot on luck so the moment feels less painful.", score: 1, role: "Impulsive or reactive response", rationale: "soothes jealousy by diminishing the other person's success." }
    ]
  },
  {
    id: "level-29",
    sceneTitle: "Noticing Your Own Irritation",
    branch: "Perceiving Emotions",
    visualGroup: "reflection",
    avatarState: "reflective",
    emotionalTone: "irritable, bodily, inward",
    visualSetting: "Crowded metro ride, bag strap digging into your shoulder after a long day.",
    avatarReaction: "Jaw clenches; eyes narrow at small inconveniences before softening.",
    animationHint: "The carriage sways as notification banners stack unread.",
    soundCue: "Metro brakes and layered announcements.",
    playerState: "Everything is annoying me, which probably means something is happening inside me.",
    scenario: "On the way home, tiny things feel irritating: someone standing too close, a slow reply, a noisy video. Your neck is tight and your patience is thin.",
    prompt: "What is the most accurate perception of your state?",
    options: [
      { id: "o1", text: "You may be overstimulated and tired, not suddenly surrounded by unreasonable people. The body tension is an emotional cue.", score: 4, role: "High EI response", rationale: "perceives internal bodily signals as affective information." },
      { id: "o2", text: "You are probably in a bad mood, so it is better to delay non-urgent replies.", score: 3, role: "Partially adaptive response", rationale: "recognizes state effects but with less precise body awareness." },
      { id: "o3", text: "Everyone is being irritating today, so avoiding people is the safest option.", score: 2, role: "Avoidant or confused response", rationale: "externalizes internal arousal." },
      { id: "o4", text: "Send a blunt reply because holding irritation in will only make it worse.", score: 1, role: "Impulsive or reactive response", rationale: "mistakes discharge for accurate perception." }
    ]
  },
  {
    id: "level-30",
    sceneTitle: "Choosing Feedback Words",
    branch: "Using Emotions to Facilitate Thinking",
    visualGroup: "work",
    avatarState: "nervous",
    emotionalTone: "careful, anxious, responsible",
    visualSetting: "Shared document open before a team review, cursor blinking beside a comment box.",
    avatarReaction: "Lips press together; posture leans closer to the screen.",
    animationHint: "A harsh sentence is typed, deleted, and rewritten shorter.",
    soundCue: "Keyboard tap, delete key, then a soft notification.",
    playerState: "I am annoyed by the mistake, but I want the feedback to actually help.",
    scenario: "A teammate's section has repeated errors. You feel annoyed because the deadline is near, but you also want them to improve without feeling attacked.",
    prompt: "How do you use your emotion to choose words?",
    options: [
      { id: "o1", text: "Use the annoyance to identify the exact problem, then write specific feedback with one priority fix and a collaborative tone.", score: 4, role: "High EI response", rationale: "uses emotion to sharpen attention while preserving usefulness." },
      { id: "o2", text: "Leave concise comments on the biggest errors and avoid discussing smaller issues for now.", score: 3, role: "Partially adaptive response", rationale: "prioritizes under emotional pressure but may limit support." },
      { id: "o3", text: "Rewrite the section yourself because explaining the mistakes feels tiring and awkward.", score: 2, role: "Avoidant or confused response", rationale: "uses frustration to bypass communication." },
      { id: "o4", text: "Comment, 'Please check your work properly,' because the deadline pressure makes patience hard.", score: 1, role: "Impulsive or reactive response", rationale: "expresses irritation in a low-information way." }
    ]
  },
  {
    id: "level-31",
    sceneTitle: "Final Message Misread",
    branch: "Understanding Emotions",
    visualGroup: "reflection",
    avatarState: "reflective",
    emotionalTone: "uncertain, tender, unresolved",
    visualSetting: "Night rooftop after the assessment story arc, phone dimmed beside folded arms.",
    avatarReaction: "Face softens; gaze stays away from the screen for a moment before returning.",
    animationHint: "A long unsent message collapses into a shorter draft.",
    soundCue: "Night air, distant traffic, and a single soft vibration.",
    playerState: "I want closure, but I know my feelings are not the whole story.",
    scenario: "You are about to send a final message after a misunderstanding with someone important. You feel grief about the distance, guilt about your part, and uncertainty about what they feel.",
    prompt: "What emotional understanding should guide the message?",
    options: [
      { id: "o1", text: "The distance may hold sadness, guilt, protectiveness, and confusion on both sides. Acknowledge your part without claiming to know all of theirs.", score: 4, role: "High EI response", rationale: "understands complex emotional transitions and reciprocal ambiguity." },
      { id: "o2", text: "Say you miss how things were and are open to talking, while keeping the message brief.", score: 3, role: "Partially adaptive response", rationale: "expresses feeling clearly but with less explicit emotional complexity." },
      { id: "o3", text: "Avoid sending anything because if they cared, they would already have understood you.", score: 2, role: "Avoidant or confused response", rationale: "turns grief into a fixed interpretation of their care." },
      { id: "o4", text: "Send a long message listing every hurt so they finally understand what they caused.", score: 1, role: "Impulsive or reactive response", rationale: "uses unresolved pain to overwhelm rather than clarify." }
    ]
  }
];

const eiQuestions = items.map(makeQuestion);

export { branchKeys };
export default eiQuestions;
