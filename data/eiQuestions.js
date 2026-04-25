const branchShortMap = {
  "Perceiving Emotions": "Perceive",
  "Using Emotions to Facilitate Thinking": "Use",
  "Understanding Emotions": "Understand",
  "Managing Emotions": "Manage"
};

const visualTypeByTone = {
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

const branchKeys = {
  "Perceiving Emotions": "perceiving",
  "Using Emotions to Facilitate Thinking": "using",
  "Understanding Emotions": "understanding",
  "Managing Emotions": "managing"
};

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
    text: `${option.label} - ${option.description}`,
    branchScore: branchScore(question.branch, option.score),
    ei: {
      effectivenessScore: option.score,
      effectivenessLevel: effectivenessLevel(option.score),
      rationale: `${option.adaptiveLevel}: this response reflects ${question.branchShort.toLowerCase()}-branch emotional intelligence in the specific context.`
    }
  };
}

function makeQuestion({
  id,
  chapter,
  title,
  branch,
  sceneTone,
  context,
  prompt,
  visualGroup,
  options
}) {
  const question = {
    id,
    levelId: id,
    chapter,
    title,
    branch,
    branchPrimary: branch,
    branchShort: branchShortMap[branch],
    branchKey: branchKeys[branch],
    sceneTone,
    mood: sceneTone.split(",")[0],
    setting: visualGroup,
    story: context,
    context,
    prompt,
    visualType: visualTypeByTone[visualGroup] ?? "final-reflection",
    theme: visualGroup,
    culturalTags: [visualGroup, branchShortMap[branch], "young-adult", "research"],
    scene: {
      background: { type: "gradient", value: visualGroup },
      ambientAudioSrc: "",
      avatarEmotionState: sceneTone
    },
    narrative: { context, prompt },
    options: []
  };
  question.options = options.map((option) => makeOption(question, option));
  return question;
}

const eiQuestions = [
  makeQuestion({
    id: "level-01",
    chapter: 1,
    title: "The Read Receipt",
    branch: "Perceiving Emotions",
    sceneTone: "uncertain, quiet, emotionally tense",
    visualGroup: "chat",
    context: "You sent a message to a close friend about meeting after class. The message shows 'seen' but there is no reply for hours.",
    prompt: "What do you do next?",
    options: [
      { id: "o1", label: "Pause and read the cues", description: "Notice your body cues and the uncertainty. Check for other signals, including their recent tone, context, and timing, before assuming intent.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Send one neutral follow-up", description: "Send a short check-in: 'Hey, just checking if you are free later. No rush.'", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume they are upset and apologize", description: "Send: 'Sorry if I upset you. Did I do something wrong?'", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Post a pointed story or status", description: "Indirectly express irritation online so they notice.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-02",
    chapter: 2,
    title: "Before the Viva",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "nervous, alert, anticipatory",
    visualGroup: "interview",
    context: "Tomorrow is your project viva. You feel nervous, and your mind keeps replaying what could go wrong.",
    prompt: "How do you use your emotional state to prepare effectively tonight?",
    options: [
      { id: "o1", label: "Channel the alertness into a plan", description: "Name the nervous energy as a signal. Create a short checklist with key slides, likely questions, and 30-minute review blocks.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Distract to calm down, then study", description: "Watch something light for an hour to reduce stress, then attempt revision.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Force yourself to study harder with self-criticism", description: "Tell yourself you are behind and must push until late night, even if anxiety increases.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Ignore feelings and wing it", description: "Decide emotions are irrelevant and skip preparation; assume you will manage tomorrow.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-03",
    chapter: 3,
    title: "The Misread Message",
    branch: "Understanding Emotions",
    sceneTone: "hurt, uncertain, relationally sensitive",
    visualGroup: "chat",
    context: "A person you are dating replies: 'Okay.' to a message you sent with excitement. You feel hurt and start thinking they do not care.",
    prompt: "What is the most emotionally accurate interpretation to hold before you respond?",
    options: [
      { id: "o1", label: "Multiple possibilities; ask for context", description: "Recognize hurt and uncertainty. Consider they may be busy, tired, or upset about something else. Ask: 'Everything okay?'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume mild disinterest but stay calm", description: "Interpret it as low enthusiasm, respond briefly, and check later in person.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "They do not value me", description: "Conclude they are losing interest; withdraw and stop messaging first.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "They are disrespecting me; confront immediately", description: "Send an accusatory message about their tone.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-04",
    chapter: 4,
    title: "Roommate Noise, Exam Week",
    branch: "Managing Emotions",
    sceneTone: "irritated, strained, sleep-deprived",
    visualGroup: "conflict",
    context: "It is exam week. Your roommate is watching reels loudly late at night. You feel irritated and your focus is slipping.",
    prompt: "What is the most emotionally effective next step?",
    options: [
      { id: "o1", label: "Pause, then assert a clear request", description: "Take a breath, then say calmly: 'I am struggling to focus. Can we keep audio low after 11 pm this week?'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Use a practical workaround first", description: "Put on earplugs or headphones now and plan to discuss a quiet-hours agreement tomorrow.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Confront sharply in the moment", description: "Say: 'Can you stop? You are being selfish.'", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Blast your own audio to retaliate", description: "Play something loud so they 'get the message.'", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-05",
    chapter: 5,
    title: "The Group Chat Silence",
    branch: "Perceiving Emotions",
    sceneTone: "uneasy, watchful, socially anxious",
    visualGroup: "chat",
    context: "You shared an idea in your friend group chat. No one reacts for hours. You feel uneasy and start checking the chat repeatedly.",
    prompt: "What helps you perceive what is happening more accurately?",
    options: [
      { id: "o1", label: "Name your feeling and look for evidence", description: "Notice anxiety and uncertainty, then check contextual cues such as time of day, past patterns, and whether others are also quiet.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Ask one clarifying question", description: "Send a neutral follow-up: 'Just checking. Does this idea work for everyone?'", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume they are annoyed", description: "Conclude you said something wrong and withdraw without checking.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Send multiple messages to force a response", description: "Keep messaging until someone replies.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-06",
    chapter: 6,
    title: "Interview Nerves",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "nervous, energized, hopeful",
    visualGroup: "interview",
    context: "You have an interview in two hours. You feel nervous but energized. Your thoughts jump between hope and fear.",
    prompt: "How do you use this emotional state to think more effectively?",
    options: [
      { id: "o1", label: "Convert nervous energy into targeted rehearsal", description: "Use the alertness to identify 3 likely questions and rehearse structured STAR-format answers for 20 minutes.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Do general reading to feel prepared", description: "Skim many topics to reduce uncertainty, without a clear plan.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Try to suppress the nervousness completely", description: "Tell yourself emotions are weakness and push through without acknowledging them.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Cancel preparation because it feels overwhelming", description: "Avoid thinking about it until it is time to leave.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-07",
    chapter: 7,
    title: "A Friend Cancels Again",
    branch: "Understanding Emotions",
    sceneTone: "disappointed, angry, uncertain",
    visualGroup: "conflict",
    context: "A close friend cancels plans for the third time, saying they are 'busy'. You feel disappointed and slightly angry.",
    prompt: "What understanding best fits before you respond?",
    options: [
      { id: "o1", label: "Hold multiple explanations", description: "Acknowledge hurt and anger, and consider possibilities: genuine overload, avoidance, or shifting priorities, then ask calmly.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume they are careless but stay polite", description: "Interpret it as poor planning and respond briefly; decide later what it means.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "They do not respect me", description: "Conclude the cancellations prove they do not care; withdraw.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Attack their character immediately", description: "Send an angry message calling them unreliable and selfish.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-08",
    chapter: 8,
    title: "Family Pressure Call",
    branch: "Managing Emotions",
    sceneTone: "overwhelmed, defensive, pressured",
    visualGroup: "family",
    context: "A family member calls and insists you should choose a career path you are unsure about. You feel overwhelmed and defensive.",
    prompt: "What response shows effective emotion management?",
    options: [
      { id: "o1", label: "Regulate first, then set a respectful boundary", description: "Slow your breathing, then say: 'I hear your concern. I need time to decide. Can we talk after I gather information?'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Change topic to avoid conflict", description: "Keep the call pleasant and postpone the discussion without stating your needs clearly.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Argue to prove you are right", description: "Debate intensely to win the point.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Hang up or say something hurtful", description: "End the call abruptly or insult them.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-09",
    chapter: 9,
    title: "Tone in the Classroom",
    branch: "Perceiving Emotions",
    sceneTone: "unsure, attentive, cautious",
    visualGroup: "classroom",
    context: "In class, a friend answers you with a short tone and avoids eye contact. You are unsure if they are upset with you or just tired.",
    prompt: "What is the best way to perceive their emotion accurately?",
    options: [
      { id: "o1", label: "Observe multiple cues, then check in privately", description: "Notice posture, timing, and context. Later ask: 'You seemed quiet. Are you okay?'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume they are stressed and give space", description: "Step back for now and wait to see if their behavior changes.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume it is about you", description: "Conclude they are angry at you and become defensive.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Confront them publicly", description: "Ask loudly in front of others: 'Why are you acting like this?'", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-10",
    chapter: 10,
    title: "After a Low Mark",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "disappointed, embarrassed, avoidant",
    visualGroup: "study",
    context: "You receive a lower mark than expected. You feel disappointed and embarrassed, and you want to avoid thinking about it.",
    prompt: "How can emotion support better thinking right now?",
    options: [
      { id: "o1", label: "Use the feeling to identify what to change", description: "Acknowledge disappointment, then review errors and plan 2 specific improvements for the next assessment.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Take a short break then reflect", description: "Step away briefly to calm down, then decide what to review.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Ruminate on what it means about you", description: "Replay the result and compare yourself with others.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Avoid everything related to the subject", description: "Decide it is pointless and disengage completely.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-11",
    chapter: 11,
    title: "Sarcasm in the Comment",
    branch: "Understanding Emotions",
    sceneTone: "stung, ambiguous, exposed",
    visualGroup: "social",
    context: "You post an achievement. Someone comments: 'Wow, must be nice.' You feel stung and unsure if it is sarcasm or genuine.",
    prompt: "What understanding best fits before replying?",
    options: [
      { id: "o1", label: "Recognize ambiguity; consider multiple emotions", description: "Hold that it could be envy, teasing, or neutral tone. Decide to clarify privately if needed.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume mild negativity and respond politely", description: "Reply briefly without escalating and move on.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume they are attacking you", description: "Conclude they are jealous and respond defensively.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Publicly shame them", description: "Reply with sarcasm to embarrass them.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-12",
    chapter: 12,
    title: "Pre-Presentation Panic",
    branch: "Managing Emotions",
    sceneTone: "panicked, blank, physically activated",
    visualGroup: "presentation",
    context: "You are about to present. Your heart races and your mind goes blank. You feel panic building.",
    prompt: "What is the most effective emotion management strategy right now?",
    options: [
      { id: "o1", label: "Ground and slow breathing, then one cue card", description: "Use a brief breathing cycle, feel your feet on the ground, then focus on your first 2 talking points.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Distract briefly to reduce arousal", description: "Look away, sip water, and try to calm down before starting.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Push through while criticizing yourself", description: "Tell yourself you are failing and force yourself to start immediately.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Escape the situation", description: "Leave the room or ask to skip without trying regulation.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-13",
    chapter: 13,
    title: "Friend's Smile Feels Off",
    branch: "Perceiving Emotions",
    sceneTone: "concerned, observant, gentle",
    visualGroup: "conflict",
    context: "A friend smiles and says they are 'fine', but their eyes look tired and their voice is flat.",
    prompt: "What helps you perceive their emotion more accurately?",
    options: [
      { id: "o1", label: "Notice mismatched cues and invite sharing", description: "Observe face and voice mismatch and gently ask: 'You seem tired. Want to talk?'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume they need space", description: "Give them room without checking in.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Take their words literally only", description: "Accept 'fine' and ignore nonverbal signals.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Insist they must be upset", description: "Push them to admit something is wrong.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-14",
    chapter: 14,
    title: "Motivation Dip in Internship",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "bored, frustrated, low-focus",
    visualGroup: "work",
    context: "Your internship tasks feel repetitive. You feel bored and slightly frustrated, and your focus drops.",
    prompt: "How can you use these emotions to think and act more effectively?",
    options: [
      { id: "o1", label: "Treat frustration as a signal to adjust strategy", description: "Identify what is missing, such as challenge or clarity. Propose one improved task or learning goal to your mentor.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Power through without reflection", description: "Finish tasks mechanically and hope motivation returns.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Complain to peers repeatedly", description: "Vent often, but do not change your plan.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Quit impulsively", description: "Resign suddenly because it feels pointless.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-15",
    chapter: 15,
    title: "Late Reply from Partner",
    branch: "Understanding Emotions",
    sceneTone: "anxious, uncertain, attachment-sensitive",
    visualGroup: "chat",
    context: "Someone you are dating has not replied all day. You feel anxious and start imagining worst-case reasons.",
    prompt: "What understanding helps you respond effectively?",
    options: [
      { id: "o1", label: "Separate feeling from conclusion", description: "Recognize anxiety as a signal of uncertainty. Consider neutral causes such as being busy or having a phone off, and decide to check in calmly.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume they forgot, but wait", description: "Decide it is probably carelessness and postpone talking.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume rejection", description: "Conclude they do not like you and withdraw.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Send accusatory messages", description: "Message repeatedly with blame about being ignored.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-16",
    chapter: 16,
    title: "Argument After a Misquote",
    branch: "Managing Emotions",
    sceneTone: "angry, public, reactive",
    visualGroup: "conflict",
    context: "In a heated discussion, someone misquotes you. You feel angry and tempted to prove them wrong publicly.",
    prompt: "What is the most emotionally effective response?",
    options: [
      { id: "o1", label: "Lower intensity, then clarify", description: "Slow down, keep your voice steady, and say: 'That is not what I meant. Let me rephrase.'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Pause and revisit later", description: "Say you need a break and return to the topic when calmer.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Correct them with sarcasm", description: "Mock the mistake to score a point.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Explode and attack", description: "Raise your voice and insult them.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-17",
    chapter: 17,
    title: "Friend Avoids a Topic",
    branch: "Perceiving Emotions",
    sceneTone: "curious, cautious, private",
    visualGroup: "conflict",
    context: "When you mention a mutual friend, your friend quickly changes the topic and fidgets. You are unsure what they are feeling.",
    prompt: "What helps you perceive their emotion accurately?",
    options: [
      { id: "o1", label: "Notice avoidance cues and check gently", description: "Observe topic shift and fidgeting, then ask privately: 'Did something happen? We can talk if you want.'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume they are busy and move on", description: "Drop it without checking.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume they are gossiping", description: "Conclude they are hiding something and become suspicious.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Force the topic", description: "Insist they explain immediately in front of others.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-18",
    chapter: 18,
    title: "Decision Fatigue at Night",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "tired, irritable, cognitively overloaded",
    visualGroup: "reflection",
    context: "It is late. You feel tired and irritable while trying to choose between two important options, such as a course or project path.",
    prompt: "How do you use your emotional state to support better thinking?",
    options: [
      { id: "o1", label: "Use fatigue as a cue to postpone and structure", description: "Recognize tiredness may bias choices. Write pros and cons and revisit in the morning with a clear plan.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Ask someone else to decide for you", description: "Hand over the decision to reduce stress.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Decide quickly to end discomfort", description: "Choose impulsively just to stop thinking about it.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Ruminate for hours", description: "Keep thinking in circles without structure.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-19",
    chapter: 19,
    title: "Friend's Joke Crossed a Line",
    branch: "Understanding Emotions",
    sceneTone: "hurt, angry, embarrassed",
    visualGroup: "conflict",
    context: "A friend makes a joke about you in front of others. You feel hurt and angry, and also embarrassed.",
    prompt: "What understanding helps you respond more effectively?",
    options: [
      { id: "o1", label: "Name mixed emotions and their triggers", description: "Recognize hurt as value, anger as boundary, and embarrassment as social exposure. Decide to talk privately and state impact.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume it was harmless teasing", description: "Tell yourself you are overreacting and ignore it.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume they wanted to humiliate you", description: "Conclude they intended harm and become resentful.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Humiliate them back", description: "Respond with a harsher joke to 'win.'", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-20",
    chapter: 20,
    title: "Angry Email Draft",
    branch: "Managing Emotions",
    sceneTone: "angry, criticized, impulsive",
    visualGroup: "work",
    context: "A supervisor criticizes your work harshly. You draft an angry email reply and your finger hovers over Send.",
    prompt: "What is the most effective emotion management choice?",
    options: [
      { id: "o1", label: "Delay sending; rewrite after cooling down", description: "Save the draft, take 10 minutes to cool down, then rewrite with specific facts and a request for clarity.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Send a short neutral reply now", description: "Reply minimally: 'Noted. I will update.'", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Send the angry email", description: "Send immediately so they know you are upset.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Post about it on social media", description: "Vague-post or name the workplace online.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-21",
    chapter: 21,
    title: "Noticing a Classmate's Stress",
    branch: "Perceiving Emotions",
    sceneTone: "attentive, concerned, low-pressure",
    visualGroup: "classroom",
    context: "A classmate keeps tapping their foot, sighing, and rereading the same line. They say 'I am okay' but seem tense.",
    prompt: "What helps you perceive their emotion accurately?",
    options: [
      { id: "o1", label: "Integrate cues and offer a low-pressure check-in", description: "Notice physiological cues of tension and ask: 'You seem stressed. Want a quick break or help?'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume it is none of your business", description: "Ignore cues to avoid awkwardness.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume they are angry at you", description: "Interpret tension as personal hostility.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Tell them to stop being dramatic", description: "Dismiss their signals.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-22",
    chapter: 22,
    title: "Choosing a Hard Conversation Time",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "nervous, considerate, strategic",
    visualGroup: "conflict",
    context: "You need to have a difficult talk with a friend. You feel nervous and you notice they seem stressed today too.",
    prompt: "How do you use emotional information to choose the best approach?",
    options: [
      { id: "o1", label: "Use both states to plan a calmer time", description: "Recognize mutual stress; propose a time when both can be calm and private, and prepare 2 key points.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Bring it up quickly to get it over with", description: "Start the conversation immediately even if both feel tense.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Wait indefinitely until you feel perfect", description: "Delay again and again because nerves persist.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Send a long message at midnight", description: "Dump everything in text when emotions peak.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-23",
    chapter: 23,
    title: "Two Friends, One Conflict",
    branch: "Understanding Emotions",
    sceneTone: "divided, pressured, empathic",
    visualGroup: "conflict",
    context: "Two friends argue. One seems angry, the other seems withdrawn. Both ask you to take sides.",
    prompt: "What understanding helps you respond effectively?",
    options: [
      { id: "o1", label: "Identify differing emotional needs", description: "See anger may signal feeling unheard; withdrawal may signal overwhelm or hurt. Offer to listen separately without taking sides.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume both are being immature", description: "Tell them to stop fighting without exploring what is underneath.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Pick the calmer person as right", description: "Assume the angry person is wrong and side with the withdrawn friend.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Spread the conflict", description: "Tell others about it and intensify group pressure.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-24",
    chapter: 24,
    title: "After a Heated Debate",
    branch: "Managing Emotions",
    sceneTone: "tense, ruminative, activated",
    visualGroup: "conflict",
    context: "After a heated debate, your body still feels tense and you keep replaying the conversation. You want to calm down but feel stuck.",
    prompt: "What is the most effective emotion management step?",
    options: [
      { id: "o1", label: "Use a structured cool-down", description: "Do a short walk or breathing, then write one reflection: what mattered, what you can control next time, and one repair step if needed.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Distract for a while", description: "Watch something to shift attention away from rumination.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Replay the argument to win mentally", description: "Keep rehearsing comebacks.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Message them immediately in anger", description: "Send more arguments to continue the fight.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-25",
    chapter: 25,
    title: "Quiet After Your Story",
    branch: "Perceiving Emotions",
    sceneTone: "self-conscious, uncertain, socially scanning",
    visualGroup: "social",
    context: "You share a story at a meet-up. The group gets quieter and someone looks away. You feel self-conscious.",
    prompt: "What helps you perceive the group's emotion more accurately?",
    options: [
      { id: "o1", label: "Scan for multiple cues, not just silence", description: "Notice facial expressions, posture, and whether others are still engaged. Ask a neutral question to check understanding.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume they are just tired", description: "Decide it is late and move to a new topic.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume you embarrassed yourself", description: "Withdraw and stop speaking for the rest of the meet-up.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Demand reassurance", description: "Ask directly: 'Was that boring? Tell me honestly.'", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-26",
    chapter: 26,
    title: "Choosing Study vs Rest",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "stressed, exhausted, conflicted",
    visualGroup: "study",
    context: "You feel stressed and exhausted, but you also have an upcoming test. You are torn between studying more or sleeping.",
    prompt: "How do you use your emotions to make a better decision?",
    options: [
      { id: "o1", label: "Use stress and fatigue to prioritize recovery and quality", description: "Recognize fatigue will reduce learning. Choose sleep and a short, high-yield revision plan for tomorrow.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Study a little more, then sleep", description: "Do one focused 20-minute review, then stop.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Stay up late to reduce anxiety", description: "Study until very late because you feel worried.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Avoid both by scrolling", description: "Scroll endlessly because the decision feels stressful.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-27",
    chapter: 27,
    title: "Misunderstood Voice Note",
    branch: "Understanding Emotions",
    sceneTone: "misread, defensive, clarifying",
    visualGroup: "chat",
    context: "You send a voice note quickly. The other person replies: 'Why are you angry?' You did not intend anger.",
    prompt: "What understanding best helps you handle this?",
    options: [
      { id: "o1", label: "Acknowledge perception and clarify intent", description: "Understand that tone can be misread. Reply: 'I was not angry, just rushed. Sorry it sounded that way.'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Explain your situation only", description: "Say you were busy, without acknowledging their experience.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Blame them for being sensitive", description: "Say they are overreacting.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Escalate with a defensive tone", description: "Reply angrily: 'I am not angry, stop accusing me.'", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-28",
    chapter: 28,
    title: "Jealousy Spike",
    branch: "Managing Emotions",
    sceneTone: "jealous, self-doubting, tempted",
    visualGroup: "social",
    context: "You see a peer's success post and feel jealousy and self-doubt. You are tempted to comment negatively or shut down.",
    prompt: "What is the most effective way to manage this emotion?",
    options: [
      { id: "o1", label: "Name it, reframe, and choose a value-aligned action", description: "Acknowledge jealousy without judging it; reframe it as a signal of your goals; take one small step toward your own plan.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Mute the account for now", description: "Reduce triggers temporarily and return later when calmer.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Vent to others repeatedly", description: "Complain about unfairness and compare yourself constantly.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Leave a spiteful comment", description: "Post something negative to reduce your discomfort.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-29",
    chapter: 29,
    title: "Noticing Your Own Irritation",
    branch: "Perceiving Emotions",
    sceneTone: "irritable, tense, self-aware",
    visualGroup: "reflection",
    context: "You notice you are snapping at small things today. Your shoulders are tense and you feel impatient in conversations.",
    prompt: "What is the most accurate way to perceive what is happening emotionally?",
    options: [
      { id: "o1", label: "Check body cues and likely triggers", description: "Notice tension and impatience; scan for triggers such as sleep, hunger, stress, or unresolved worry before acting.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume everyone else is annoying", description: "Decide people are the problem and avoid them.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Ignore it until it goes away", description: "Continue as normal without noticing patterns.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Label yourself as a bad person", description: "Assume irritation means something is wrong with you.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-30",
    chapter: 30,
    title: "Choosing Feedback Words",
    branch: "Using Emotions to Facilitate Thinking",
    sceneTone: "frustrated, nervous, deliberate",
    visualGroup: "work",
    context: "A teammate's work affected your project timeline. You feel frustrated but also nervous about giving feedback.",
    prompt: "How do you use these emotions to choose effective words?",
    options: [
      { id: "o1", label: "Use emotion to choose clarity and respect", description: "Let frustration signal the impact; let nervousness signal the need for care. Use specifics: behavior, impact, request.", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Hint indirectly", description: "Make vague comments so it does not feel confrontational.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Delay until you explode", description: "Avoid the talk until frustration builds.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Criticize their character", description: "Say they are lazy or unreliable.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  }),
  makeQuestion({
    id: "level-31",
    chapter: 31,
    title: "Final Message Misread",
    branch: "Understanding Emotions",
    sceneTone: "uneasy, ambiguous, reflective",
    visualGroup: "chat",
    context: "After a long conversation, the other person ends with: 'Fine.' You feel uneasy and interpret it as anger, but you are not sure.",
    prompt: "What understanding helps you respond with emotional accuracy?",
    options: [
      { id: "o1", label: "Treat it as ambiguous and clarify", description: "Recognize unease as uncertainty. Consider that 'Fine' could mean tiredness, resignation, or irritation. Ask: 'Are we okay?'", score: 4, adaptiveLevel: "Highly adaptive" },
      { id: "o2", label: "Assume mild irritation and disengage", description: "Reply briefly and plan to revisit later.", score: 3, adaptiveLevel: "Moderately adaptive" },
      { id: "o3", label: "Assume they are angry at you", description: "Apologize repeatedly without knowing what happened.", score: 2, adaptiveLevel: "Less adaptive" },
      { id: "o4", label: "Accuse them of being passive-aggressive", description: "Confront harshly about their tone.", score: 1, adaptiveLevel: "Maladaptive" }
    ]
  })
];

export const EI_QUESTIONS = eiQuestions;
export default eiQuestions;
