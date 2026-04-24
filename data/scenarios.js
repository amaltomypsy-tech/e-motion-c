const BRANCHES = [
  "Perceiving Emotions",
  "Using Emotions to Facilitate Thinking",
  "Understanding Emotions",
  "Managing Emotions"
];

const visualTypes = [
  "phone-read-receipt",
  "classroom-tension",
  "friend-conflict",
  "family-pressure",
  "group-project",
  "interview-anxiety",
  "workplace-feedback",
  "social-media-misread",
  "exam-stress",
  "silent-friend",
  "celebration-envy",
  "public-embarrassment",
  "apology-moment",
  "peer-pressure",
  "rejection-message",
  "late-night-overthinking",
  "help-seeking",
  "anger-control",
  "emotional-support",
  "misunderstanding",
  "decision-under-pressure",
  "teamwork-conflict",
  "criticism-response",
  "loneliness-in-crowd",
  "moral-dilemma",
  "unexpected-change",
  "trust-repair",
  "empathy-choice",
  "disappointment",
  "conflict-resolution",
  "final-reflection"
];

const scenarioSeeds = [
  {
    title: "The Read Receipt",
    mood: "uncertain",
    setting: "college messaging situation",
    story:
      "You sent a message to a close friend after class. The message shows seen, but there is no reply for hours.",
    prompt: "What do you do next?"
  },
  {
    title: "Classroom Static",
    mood: "tense",
    setting: "classroom discussion",
    story:
      "During a seminar, your answer is met with a long silence. Two classmates exchange glances and the teacher moves on quickly.",
    prompt: "How do you read the moment?"
  },
  {
    title: "The Shifted Tone",
    mood: "hurt",
    setting: "friend conflict",
    story:
      "A friend who is usually warm replies sharply when you ask about weekend plans. Their face looks tired more than angry.",
    prompt: "How do you respond?"
  },
  {
    title: "Pressure at Home",
    mood: "pressured",
    setting: "family expectation",
    story:
      "A parent compares your progress with a cousin's success. You feel defensive, but you also notice worry under their words.",
    prompt: "What is your next move?"
  },
  {
    title: "The Uneven Project",
    mood: "frustrated",
    setting: "group project",
    story:
      "Two teammates have missed deadlines, and the presentation is tomorrow. The group chat is quiet except for nervous apologies.",
    prompt: "What do you choose?"
  },
  {
    title: "Waiting Room Pulse",
    mood: "anxious",
    setting: "interview waiting area",
    story:
      "You are outside an interview room. Your hands are cold, your thoughts speed up, and another candidate seems effortlessly calm.",
    prompt: "How do you use the feeling?"
  },
  {
    title: "Feedback in Fluorescent Light",
    mood: "exposed",
    setting: "workplace feedback",
    story:
      "Your supervisor says your report missed important details. Their tone is direct, and your first reaction is embarrassment.",
    prompt: "What response shows emotional intelligence?"
  },
  {
    title: "The Caption Problem",
    mood: "misread",
    setting: "social media misunderstanding",
    story:
      "Someone posts a vague caption after a disagreement. Friends start reacting, and you wonder if it is about you.",
    prompt: "What do you do before reacting?"
  },
  {
    title: "Exam Eve",
    mood: "overloaded",
    setting: "exam stress",
    story:
      "It is the night before an exam. Your notes are unfinished, and panic keeps pulling you away from studying.",
    prompt: "How do you direct the emotion?"
  },
  {
    title: "A Friend Goes Quiet",
    mood: "concerned",
    setting: "silent friend",
    story:
      "A friend who usually jokes in the group has stopped responding and sits alone after class.",
    prompt: "What is the most emotionally attuned action?"
  },
  {
    title: "Their Big Win",
    mood: "envious",
    setting: "celebration with mixed feelings",
    story:
      "Your roommate wins an award you also wanted. You feel proud of them and disappointed for yourself at the same time.",
    prompt: "What do you do with that mix?"
  },
  {
    title: "Everyone Heard",
    mood: "embarrassed",
    setting: "public embarrassment",
    story:
      "You mispronounce a key term during a presentation. A few people laugh before the room settles again.",
    prompt: "How do you recover?"
  },
  {
    title: "The Apology Window",
    mood: "regretful",
    setting: "apology moment",
    story:
      "You interrupted someone in a heated discussion. Later, you can see that your words landed harder than you intended.",
    prompt: "What do you say?"
  },
  {
    title: "The Dare",
    mood: "conflicted",
    setting: "peer pressure",
    story:
      "Friends push you to make fun of someone online because everyone is doing it. You feel the pull to belong.",
    prompt: "What choice protects the emotional field?"
  },
  {
    title: "No, Thanks",
    mood: "rejected",
    setting: "rejection message",
    story:
      "Someone you like replies kindly but clearly that they do not feel the same. Your chest tightens as you reread it.",
    prompt: "What do you do next?"
  },
  {
    title: "2:13 AM",
    mood: "ruminative",
    setting: "late-night overthinking",
    story:
      "You replay a short conversation again and again at night, trying to decode every pause and expression.",
    prompt: "How do you interrupt the spiral?"
  },
  {
    title: "Asking for Backup",
    mood: "vulnerable",
    setting: "help seeking",
    story:
      "A deadline is slipping and you know you need help, but asking feels like admitting you failed.",
    prompt: "How do you approach it?"
  },
  {
    title: "Heat Rising",
    mood: "angry",
    setting: "anger control",
    story:
      "Someone accuses you unfairly in front of others. You feel heat in your face and an urge to snap back.",
    prompt: "What is the strongest next step?"
  },
  {
    title: "Sitting Beside Sadness",
    mood: "supportive",
    setting: "emotional support",
    story:
      "A close friend shares that they feel like they are falling behind everyone. They are not asking for advice yet.",
    prompt: "How do you support them?"
  },
  {
    title: "The Wrong Meaning",
    mood: "confused",
    setting: "misunderstanding",
    story:
      "Your short reply was interpreted as rude. You meant to be efficient, but the other person now seems distant.",
    prompt: "What do you clarify?"
  },
  {
    title: "Fast Choice",
    mood: "pressured",
    setting: "decision under pressure",
    story:
      "A student team needs an immediate decision during an event, and everyone looks to you while emotions run high.",
    prompt: "How do you decide?"
  },
  {
    title: "Split Team",
    mood: "divided",
    setting: "teamwork conflict",
    story:
      "Two team members argue about whose idea should lead the project. Both feel dismissed and the deadline is close.",
    prompt: "What role do you take?"
  },
  {
    title: "Comment in the Margin",
    mood: "defensive",
    setting: "criticism response",
    story:
      "Your mentor leaves detailed criticism on your draft. Part of you wants to explain why every comment is unfair.",
    prompt: "How do you respond internally and externally?"
  },
  {
    title: "Crowded Alone",
    mood: "lonely",
    setting: "loneliness in crowd",
    story:
      "You are at a college event surrounded by people, but everyone seems already connected to someone else.",
    prompt: "What do you do with the feeling?"
  },
  {
    title: "The Shortcut",
    mood: "uneasy",
    setting: "moral dilemma",
    story:
      "A classmate offers you leaked answers for a quiz. Refusing may make things awkward, but accepting feels wrong.",
    prompt: "What action fits the emotional and ethical context?"
  },
  {
    title: "Plan Changed",
    mood: "disoriented",
    setting: "unexpected change",
    story:
      "A carefully planned event is suddenly moved online. People are disappointed, and you feel your effort was wasted.",
    prompt: "How do you adapt?"
  },
  {
    title: "After Trust Breaks",
    mood: "guarded",
    setting: "trust repair",
    story:
      "A friend shared something private. They now apologize and say they understand why you are hurt.",
    prompt: "What is a balanced response?"
  },
  {
    title: "The Other Side",
    mood: "empathetic",
    setting: "empathy choice",
    story:
      "A classmate snaps at you, then you learn they have been handling a serious family problem all week.",
    prompt: "How does that information change your response?"
  },
  {
    title: "Not Selected",
    mood: "disappointed",
    setting: "disappointment",
    story:
      "You worked hard for a role and were not selected. The person chosen asks if you are okay.",
    prompt: "What do you say or do?"
  },
  {
    title: "Table Between Us",
    mood: "resolving",
    setting: "conflict resolution",
    story:
      "You and a friend finally sit down after days of tension. Both of you have reasons to feel hurt.",
    prompt: "How do you start the repair conversation?"
  },
  {
    title: "The Mirror Scene",
    mood: "reflective",
    setting: "final reflection",
    story:
      "After thirty emotional moments, you look back at the pattern of your choices and the situations that pulled you off center.",
    prompt: "What closing response best represents your growth mindset?"
  }
];

function branchScore(primaryKey, strength) {
  const baseline = {
    perceiving: Math.max(0, strength - 1),
    using: Math.max(0, strength - 1),
    understanding: Math.max(0, strength - 1),
    managing: Math.max(0, strength - 1)
  };
  baseline[primaryKey] = strength;
  if (strength >= 3) {
    baseline.understanding = Math.max(baseline.understanding, strength - 1);
    baseline.managing = Math.max(baseline.managing, strength - 1);
  }
  return baseline;
}

function effectivenessLevel(score) {
  if (score >= 4) return "high";
  if (score === 3) return "moderate";
  if (score === 2) return "low";
  return "very_low";
}

function makeOptions(branchKey, contextLabel) {
  const options = [
    {
      id: "o1",
      text: `Pause, read the emotional cues, and choose a response that fits ${contextLabel}.`,
      score: 4,
      branchScore: branchScore(branchKey, 4)
    },
    {
      id: "o2",
      text: "Ask one calm clarifying question before deciding what the moment means.",
      score: 3,
      branchScore: branchScore(branchKey, 3)
    },
    {
      id: "o3",
      text: "React from the first feeling that shows up, even if the context is incomplete.",
      score: 1,
      branchScore: branchScore(branchKey, 1)
    },
    {
      id: "o4",
      text: "Avoid the discomfort or escalate the situation so the feeling leaves quickly.",
      score: 0,
      branchScore: branchScore(branchKey, 0)
    }
  ];

  return options.map((option) => ({
    ...option,
    optionId: option.id,
    label: option.text.split(",")[0],
    description: option.text,
    ei: {
      effectivenessScore: Math.min(3, option.score),
      effectivenessLevel: effectivenessLevel(option.score),
      rationale:
        option.score >= 3
          ? "The response keeps emotional information connected to context before action."
          : "The response narrows the emotional field and increases the risk of misreading or escalation."
    }
  }));
}

const branchKeys = ["perceiving", "using", "understanding", "managing"];

const scenarios = scenarioSeeds.map((seed, index) => {
  const branchIndex = index % BRANCHES.length;
  const branch = BRANCHES[branchIndex];
  const branchKey = branchKeys[branchIndex];
  const id = `level-${String(index + 1).padStart(2, "0")}`;

  return {
    id,
    levelId: id,
    title: seed.title,
    branch,
    branchPrimary: branch,
    mood: seed.mood,
    setting: seed.setting,
    story: seed.story,
    prompt: seed.prompt,
    visualType: visualTypes[index],
    theme: seed.setting,
    culturalTags: [seed.setting, seed.mood, "young-adult", "research"],
    scene: {
      background: { type: "gradient", value: "cinematic-generated" },
      ambientAudioSrc: "",
      avatarEmotionState: seed.mood
    },
    narrative: {
      context: seed.story,
      prompt: seed.prompt
    },
    options: makeOptions(branchKey, seed.setting)
  };
});

export { BRANCHES, visualTypes };
export default scenarios;
