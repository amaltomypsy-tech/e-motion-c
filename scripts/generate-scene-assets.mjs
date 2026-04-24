import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "public", "scenes");

const scenes = [
  ["level-01", "The Read Receipt", "anxious", "hostel room at dusk with phone glow"],
  ["level-02", "Before the Viva", "tense", "college corridor outside a viva room"],
  ["level-03", "The Misread Message", "hurt", "quiet cafe table with unread chat"],
  ["level-04", "Roommate Noise, Exam Week", "irritated", "shared hostel room during exam week"],
  ["level-05", "The Group Chat Silence", "uneasy", "campus steps with muted group chat"],
  ["level-06", "Interview Nerves", "alert", "waiting area before an interview"],
  ["level-07", "A Friend Cancels Again", "disappointed", "rainy campus gate after a cancelled plan"],
  ["level-08", "Family Pressure Call", "overwhelmed", "balcony phone call with family expectations"],
  ["level-09", "Tone in the Classroom", "curious", "seminar classroom with subtle expressions"],
  ["level-10", "After a Low Mark", "down", "study desk with exam paper and soft lamp"],
  ["level-11", "Sarcasm in the Comment", "stung", "social media post seen late at night"],
  ["level-12", "Pre-Presentation Panic", "panicked", "auditorium backstage before presentation"],
  ["level-13", "Friend's Smile Feels Off", "attentive", "campus cafe with a strained smile"],
  ["level-14", "Motivation Dip in Internship", "drained", "intern desk near evening city windows"],
  ["level-15", "Late Reply from Partner", "anxious", "metro platform with phone in hand"],
  ["level-16", "Argument After a Misquote", "angry", "group discussion table after tension"],
  ["level-17", "Friend Avoids a Topic", "concerned", "quiet walkway under neem trees"],
  ["level-18", "Decision Fatigue at Night", "tired", "late night desk with stacked tasks"],
  ["level-19", "Friend's Joke Crossed a Line", "hurt", "college canteen after an awkward joke"],
  ["level-20", "Angry Email Draft", "heated", "laptop screen with unsent email draft"],
  ["level-21", "Noticing a Classmate's Stress", "observant", "library table with stressed classmate"],
  ["level-22", "Choosing a Hard Conversation Time", "uncertain", "calendar and evening campus path"],
  ["level-23", "Two Friends, One Conflict", "conflicted", "two friends seated apart in a courtyard"],
  ["level-24", "After a Heated Debate", "agitated", "debate hall after people leave"],
  ["level-25", "Quiet After Your Story", "self-conscious", "friends circle suddenly quiet"],
  ["level-26", "Choosing Study vs Rest", "overloaded", "bedside books beside a dim lamp"],
  ["level-27", "Misunderstood Voice Note", "confused", "voice note waveform on phone"],
  ["level-28", "Jealousy Spike", "jealous", "achievement notification in a shared study space"],
  ["level-29", "Noticing Your Own Irritation", "irritable", "crowded commute with inner tension"],
  ["level-30", "Choosing Feedback Words", "nervous", "notebook with careful feedback draft"],
  ["level-31", "Final Message Misread", "uncertain", "night terrace with final message thread"]
];

const palettes = {
  anxious: ["#171528", "#4d335f", "#d1848f", "#ffd7b5"],
  tense: ["#111827", "#263554", "#b0685b", "#f6c37b"],
  hurt: ["#16131f", "#402a3e", "#926979", "#f2c7bd"],
  irritated: ["#171313", "#4a2730", "#aa573f", "#ffd09c"],
  uneasy: ["#101923", "#24405b", "#6c7c91", "#d6e6f2"],
  alert: ["#10171c", "#173b46", "#3a8c8c", "#f5d58a"],
  disappointed: ["#12161f", "#27324b", "#6e7b9c", "#d4d8ef"],
  overwhelmed: ["#171426", "#44315b", "#a5687e", "#f2c6a9"],
  curious: ["#101923", "#214452", "#4a8c8a", "#d5e7c8"],
  down: ["#10131b", "#263047", "#65708d", "#ced3e6"],
  stung: ["#17121a", "#4a2435", "#9b4f64", "#f3bbb0"],
  panicked: ["#170f17", "#55304b", "#be5f5f", "#ffd3a8"],
  attentive: ["#121820", "#263e45", "#7b8b73", "#f0d7ae"],
  drained: ["#121418", "#323842", "#77786e", "#d8d2bd"],
  angry: ["#180f12", "#52222c", "#b24a35", "#f0b781"],
  tired: ["#10131a", "#252f42", "#5e6980", "#c9d0df"],
  heated: ["#180f11", "#552530", "#bf5f38", "#f7c173"],
  observant: ["#11191b", "#254046", "#6a8c86", "#d6eadc"],
  uncertain: ["#121521", "#2f3456", "#8375a3", "#e6d7f7"],
  conflicted: ["#131620", "#34304c", "#916b73", "#e9c4a8"],
  agitated: ["#151218", "#473042", "#a55d66", "#efc29d"],
  "self-conscious": ["#15141d", "#3d314f", "#936d89", "#ead0c3"],
  overloaded: ["#12131b", "#33364b", "#806f88", "#e0d3c6"],
  confused: ["#111923", "#263d53", "#777a9c", "#d8d8ef"],
  jealous: ["#101816", "#234135", "#5f8a66", "#d5d89e"],
  irritable: ["#171313", "#4b2e31", "#a46b4c", "#edc7a0"]
};

function person(x, y, scale, color, accent, posture = "neutral") {
  const lean = posture === "tense" ? -8 : posture === "soft" ? 5 : 0;
  return `
    <g transform="translate(${x} ${y}) scale(${scale}) rotate(${lean})">
      <circle cx="0" cy="-62" r="22" fill="${color}"/>
      <path d="M-24 -36 C-18 -56 17 -56 25 -36 L34 46 C13 59 -16 59 -36 46 Z" fill="${accent}"/>
      <path d="M-18 -80 C-6 -96 22 -88 28 -65 C14 -74 -1 -72 -19 -62 C-25 -68 -25 -74 -18 -80 Z" fill="#17151c"/>
      <path d="M-36 -20 C-70 2 -73 34 -51 49" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>
      <path d="M32 -20 C62 -1 67 27 49 43" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>
      <path d="M-22 46 L-34 104" stroke="#252839" stroke-width="12" stroke-linecap="round"/>
      <path d="M19 48 L31 105" stroke="#252839" stroke-width="12" stroke-linecap="round"/>
    </g>`;
}

function phone(x, y, scale, glow = "#f6d7ff") {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <rect x="-28" y="-52" width="56" height="104" rx="11" fill="#171923" stroke="#f7f0ff" stroke-opacity=".45"/>
      <rect x="-20" y="-37" width="40" height="70" rx="6" fill="${glow}" opacity=".84"/>
      <circle cx="0" cy="42" r="3" fill="#fff" opacity=".65"/>
      <path d="M-12 -14 H14 M-12 2 H8 M-12 18 H15" stroke="#2b3040" stroke-width="3" stroke-linecap="round" opacity=".58"/>
    </g>`;
}

function laptop(x, y, scale) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <rect x="-72" y="-44" width="144" height="88" rx="8" fill="#202332" stroke="#f8f1ff" stroke-opacity=".25"/>
      <rect x="-56" y="-29" width="112" height="56" rx="4" fill="#f1d7bb" opacity=".76"/>
      <path d="M-92 50 H92 L72 72 H-72 Z" fill="#151823"/>
      <path d="M-34 -10 H40 M-34 6 H28 M-34 22 H50" stroke="#392f3d" stroke-width="4" stroke-linecap="round" opacity=".62"/>
    </g>`;
}

function environment(label, i, c) {
  const desk = `<path d="M120 610 C300 565 590 560 840 610 L840 720 L120 720 Z" fill="#151823" opacity=".78"/>`;
  const window = `<rect x="600" y="116" width="184" height="245" rx="18" fill="#ffffff" opacity=".08"/><path d="M622 184 H762 M692 128 V344" stroke="#fff" stroke-opacity=".12" stroke-width="4"/>`;
  const campus = `<path d="M72 516 C220 462 353 492 490 448 C635 401 757 441 888 381 L888 720 L72 720 Z" fill="#16202b" opacity=".72"/><path d="M96 500 C218 470 361 486 470 456" stroke="#e8d7bc" stroke-opacity=".24" stroke-width="4" fill="none"/>`;
  const chat = `<g opacity=".84"><rect x="620" y="220" width="190" height="132" rx="24" fill="#fff" opacity=".13"/><path d="M652 262 H760 M652 296 H726" stroke="#fff" stroke-opacity=".42" stroke-width="8" stroke-linecap="round"/></g>`;
  const board = `<rect x="118" y="124" width="278" height="160" rx="16" fill="#ffffff" opacity=".09"/><path d="M150 174 H354 M150 214 H304" stroke="#fff" stroke-opacity=".25" stroke-width="7" stroke-linecap="round"/>`;
  const plants = `<g opacity=".65"><path d="M818 560 C800 508 823 468 850 438 C860 493 852 530 818 560 Z" fill="#6c9270"/><path d="M840 566 C840 508 872 477 902 454 C898 513 876 548 840 566 Z" fill="#86a983"/><rect x="806" y="564" width="63" height="62" rx="10" fill="#332b31"/></g>`;
  if (/classroom|viva|presentation|debate/i.test(label)) return `${board}${campus}`;
  if (/desk|email|intern|study|feedback|paper/i.test(label)) return `${window}${desk}${laptop(548, 482, 0.9)}`;
  if (/phone|message|chat|voice|reply|call/i.test(label)) return `${window}${desk}${phone(612, 442, 1.15, c[3])}${chat}`;
  if (/campus|gate|walkway|courtyard|canteen|friends/i.test(label)) return `${campus}${plants}`;
  if (/metro|commute/i.test(label)) return `<path d="M96 486 H864 V624 H96 Z" fill="#17202b" opacity=".68"/><path d="M156 512 H320 M396 512 H560 M636 512 H800" stroke="#fff" stroke-opacity=".16" stroke-width="42" stroke-linecap="round"/>`;
  if (/balcony|terrace/i.test(label)) return `<rect x="0" y="482" width="960" height="238" fill="#121722" opacity=".84"/><path d="M88 500 H872 M128 500 V660 M260 500 V660 M392 500 V660 M524 500 V660 M656 500 V660 M788 500 V660" stroke="#fff" stroke-opacity=".14" stroke-width="6"/>`;
  return `${window}${desk}`;
}

function svgFor(scene, index) {
  const [id, title, mood, label] = scene;
  const c = palettes[mood] ?? palettes.uncertain;
  const posture = ["tense", "panicked", "angry", "heated", "irritable"].includes(mood)
    ? "tense"
    : ["relieved", "calm", "observant", "attentive"].includes(mood)
      ? "soft"
      : "neutral";
  const secondPerson = /friend|roommate|family|classmate|group|friends|partner|conflict|debate|joke|story/i.test(title);
  const motif = /email|desk|study|feedback|intern|mark/i.test(label)
    ? laptop(640, 466, 0.72)
    : phone(652, 442, 0.92, c[3]);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 960 720" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${title}</title>
  <desc id="${id}-desc">Cinematic illustrated scene for ${label}, expressing a ${mood} emotional state in a young adult Indian assessment context.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c[0]}"/>
      <stop offset=".56" stop-color="${c[1]}"/>
      <stop offset="1" stop-color="${c[2]}"/>
    </linearGradient>
    <radialGradient id="light" cx=".68" cy=".24" r=".58">
      <stop offset="0" stop-color="${c[3]}" stop-opacity=".55"/>
      <stop offset=".48" stop-color="${c[3]}" stop-opacity=".12"/>
      <stop offset="1" stop-color="${c[0]}" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#000" flood-opacity=".35"/>
    </filter>
    <pattern id="grain" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r=".65" fill="#fff" opacity=".08"/>
    </pattern>
  </defs>
  <rect width="960" height="720" fill="url(#bg)"/>
  <rect width="960" height="720" fill="url(#light)"/>
  <path d="M0 116 C168 92 246 157 394 120 C563 78 695 94 960 42 V0 H0 Z" fill="#fff" opacity=".05"/>
  <path d="M0 574 C180 520 322 586 480 544 C642 501 757 560 960 494 V720 H0 Z" fill="#05060a" opacity=".34"/>
  ${environment(label, index, c)}
  <g filter="url(#softShadow)">
    ${person(360, 520, 1.18, "#b9826d", "#2e3448", posture)}
    ${secondPerson ? person(510, 534, 0.98, "#9f6f5d", "#394052", "soft") : motif}
  </g>
  <g opacity=".34">
    <circle cx="${170 + (index % 5) * 34}" cy="${130 + (index % 4) * 24}" r="3" fill="${c[3]}"/>
    <circle cx="${740 - (index % 6) * 24}" cy="${184 + (index % 3) * 30}" r="4" fill="#fff"/>
    <circle cx="${778 - (index % 5) * 29}" cy="${382 - (index % 4) * 21}" r="2.5" fill="${c[3]}"/>
  </g>
  <rect width="960" height="720" fill="url(#grain)" opacity=".33"/>
  <rect width="960" height="720" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>
</svg>
`;
}

await mkdir(outDir, { recursive: true });
await Promise.all(
  scenes.map((scene, index) => writeFile(path.join(outDir, `${scene[0]}.svg`), svgFor(scene, index + 1), "utf8"))
);

console.log(`Generated ${scenes.length} SVG scenes in ${path.relative(root, outDir)}`);
