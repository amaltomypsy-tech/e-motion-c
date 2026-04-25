"use client";

const sceneStyles = {
  "phone-read-receipt": { a: "#172554", b: "#7c2d12", c: "#38bdf8", prop: "phone", place: "COLLEGE WALKWAY" },
  "classroom-tension": { a: "#111827", b: "#7f1d1d", c: "#f59e0b", prop: "board", place: "SEMINAR ROOM" },
  "friend-conflict": { a: "#1e1b4b", b: "#831843", c: "#f472b6", prop: "two", place: "CAMPUS STEPS" },
  "family-pressure": { a: "#1f2937", b: "#78350f", c: "#fbbf24", prop: "home", place: "DINING TABLE" },
  "group-project": { a: "#0f172a", b: "#064e3b", c: "#34d399", prop: "laptop", place: "PROJECT ROOM" },
  "interview-anxiety": { a: "#020617", b: "#3f3f46", c: "#a78bfa", prop: "door", place: "WAITING AREA" },
  "workplace-feedback": { a: "#111827", b: "#1d4ed8", c: "#93c5fd", prop: "desk", place: "WORKPLACE" },
  "social-media-misread": { a: "#18181b", b: "#be185d", c: "#f9a8d4", prop: "feed", place: "SOCIAL FEED" },
  "exam-stress": { a: "#111827", b: "#4c1d95", c: "#c4b5fd", prop: "papers", place: "STUDY DESK" },
  "silent-friend": { a: "#0f172a", b: "#155e75", c: "#67e8f9", prop: "bench", place: "QUIET CORNER" },
  "celebration-envy": { a: "#1e1b4b", b: "#a16207", c: "#fde68a", prop: "award", place: "CELEBRATION" },
  "public-embarrassment": { a: "#1f2937", b: "#991b1b", c: "#fecaca", prop: "stage", place: "PRESENTATION" },
  "apology-moment": { a: "#111827", b: "#065f46", c: "#6ee7b7", prop: "bridge", place: "AFTER CLASS" },
  "peer-pressure": { a: "#171717", b: "#6d28d9", c: "#ddd6fe", prop: "crowd", place: "GROUP CHAT" },
  "rejection-message": { a: "#0f172a", b: "#881337", c: "#fb7185", prop: "message", place: "PHONE SCREEN" },
  "late-night-overthinking": { a: "#020617", b: "#312e81", c: "#818cf8", prop: "moon", place: "2:13 AM" },
  "help-seeking": { a: "#111827", b: "#0f766e", c: "#5eead4", prop: "signal", place: "DEADLINE NIGHT" },
  "anger-control": { a: "#1c1917", b: "#b91c1c", c: "#fb923c", prop: "heat", place: "PUBLIC ACCUSATION" },
  "emotional-support": { a: "#172554", b: "#166534", c: "#86efac", prop: "sofa", place: "QUIET TALK" },
  misunderstanding: { a: "#111827", b: "#7c3aed", c: "#c084fc", prop: "threads", place: "TEXT THREAD" },
  "decision-under-pressure": { a: "#111827", b: "#b45309", c: "#fcd34d", prop: "clock", place: "EVENT FLOOR" },
  "teamwork-conflict": { a: "#0f172a", b: "#7f1d1d", c: "#fca5a5", prop: "split", place: "TEAM TABLE" },
  "criticism-response": { a: "#18181b", b: "#1e40af", c: "#bfdbfe", prop: "draft", place: "MENTOR NOTES" },
  "loneliness-in-crowd": { a: "#020617", b: "#374151", c: "#d1d5db", prop: "crowd", place: "COLLEGE EVENT" },
  "moral-dilemma": { a: "#111827", b: "#365314", c: "#bef264", prop: "fork", place: "QUIZ DAY" },
  "unexpected-change": { a: "#172554", b: "#0f766e", c: "#99f6e4", prop: "map", place: "PLAN CHANGE" },
  "trust-repair": { a: "#1f2937", b: "#9f1239", c: "#fda4af", prop: "thread", place: "REPAIR TALK" },
  "empathy-choice": { a: "#111827", b: "#0e7490", c: "#a5f3fc", prop: "window", place: "NEW CONTEXT" },
  disappointment: { a: "#111827", b: "#4f46e5", c: "#a5b4fc", prop: "notice", place: "RESULT BOARD" },
  "conflict-resolution": { a: "#1f2937", b: "#92400e", c: "#fed7aa", prop: "table", place: "REPAIR TABLE" },
  "final-reflection": { a: "#020617", b: "#6d28d9", c: "#f0abfc", prop: "mirror", place: "REFLECTION" }
};

function Character({ x = 120, y = 190, accent = "#f9a8d4", lean = 0, mood = "reflective" }) {
  const browTilt = /angry|tense|irritated|defensive|panic|panicked/i.test(mood) ? -6 : 0;
  const mouth =
    /calm|gentle|reflective|attentive/i.test(mood)
      ? "M-8 -34 C-3 -29 5 -29 10 -34"
      : /hurt|sad|disappointed|anxious|uneasy/i.test(mood)
        ? "M-10 -30 C-4 -35 4 -35 10 -30"
        : "M-9 -32 H9";
  return (
    <g className="scene-breathe" transform={`translate(${x} ${y}) skewX(${lean})`}>
      <ellipse cx="0" cy="-42" rx="23" ry="25" fill="rgba(255,255,255,0.84)" />
      <path d="M-18 -54 C-9 -71 12 -70 21 -53 C12 -61 -8 -62 -18 -54Z" fill="rgba(15,23,42,0.88)" />
      <g className="scene-blink">
        <ellipse cx="-8" cy="-43" rx="2.5" ry="3.5" fill="rgba(15,23,42,0.85)" />
        <ellipse cx="9" cy="-43" rx="2.5" ry="3.5" fill="rgba(15,23,42,0.85)" />
      </g>
      <path d="M-15 -50 H-4 M5 -50 H16" stroke="rgba(15,23,42,0.72)" strokeWidth="2" strokeLinecap="round" transform={`rotate(${browTilt})`} />
      <path d={mouth} fill="none" stroke="rgba(15,23,42,0.72)" strokeWidth="2" strokeLinecap="round" />
      <path d="M-31 14 C-24 -18 -12 -30 0 -30 C13 -30 25 -16 33 14 Z" fill="rgba(15,23,42,0.92)" />
      <path d="M-18 -16 C-8 -8 8 -8 19 -16" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round" />
      <path d="M-25 19 C-13 34 14 35 27 19" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

function SceneProp({ type, color, mood }) {
  if (type === "phone" || type === "message" || type === "feed") {
    return (
      <g className="scene-float" transform="translate(250 78)">
        <rect width="134" height="214" rx="22" fill="rgba(2,6,23,0.86)" stroke="rgba(255,255,255,0.28)" />
        <rect x="16" y="34" width="102" height="34" rx="14" fill="rgba(255,255,255,0.12)" />
        <rect x="16" y="84" width="78" height="28" rx="13" fill={color} opacity="0.86" />
        <rect x="38" y="128" width="80" height="28" rx="13" fill="rgba(255,255,255,0.16)" />
        <text x="68" y="184" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="13" fontWeight="700">
          seen
        </text>
      </g>
    );
  }

  if (type === "board" || type === "notice" || type === "draft") {
    return (
      <g className="scene-drift" transform="translate(224 68)">
        <rect width="184" height="126" rx="14" fill="rgba(15,23,42,0.74)" stroke="rgba(255,255,255,0.18)" />
        <path d="M24 35 H150 M24 62 H128 M24 89 H164" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.78" />
      </g>
    );
  }

  if (type === "clock" || type === "moon" || type === "mirror") {
    return (
      <g className="scene-pulse" transform="translate(305 125)">
        <circle r="68" fill="rgba(255,255,255,0.1)" stroke={color} strokeWidth="5" />
        <path d="M0 0 V-38 M0 0 L30 18" stroke="rgba(255,255,255,0.72)" strokeWidth="6" strokeLinecap="round" />
      </g>
    );
  }

  if (type === "crowd" || type === "two" || type === "split") {
    return (
      <g>
        <Character x={240} y={215} accent={color} lean={-5} mood={mood} />
        <Character x={325} y={218} accent="rgba(255,255,255,0.72)" lean={5} mood={mood} />
        <path className="scene-pulse" d="M282 72 C260 98 260 126 283 151 C310 123 310 96 282 72Z" fill={color} opacity="0.34" />
      </g>
    );
  }

  return (
    <g className="scene-float" transform="translate(238 118)">
      <rect width="178" height="92" rx="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
      <path d="M26 50 H152 M60 24 V76" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.84" />
    </g>
  );
}

export default function ScenarioScene({ visualType = "final-reflection", title, branch, mood, setting }) {
  const style = sceneStyles[visualType] ?? sceneStyles["final-reflection"];
  const particles = Array.from({ length: 16 }, (_, index) => ({
    id: index,
    x: 28 + ((index * 47) % 420),
    y: 34 + ((index * 31) % 220),
    delay: `${index * 0.18}s`
  }));

  return (
    <section
      className="scenario-scene relative min-h-[360px] overflow-hidden rounded-[1.25rem] border border-white/10 shadow-[0_28px_120px_rgba(0,0,0,0.42)]"
      style={{
        "--scene-a": style.a,
        "--scene-b": style.b,
        "--scene-c": style.c
      }}
      aria-label={`${title} scene`}
    >
      <div className="absolute inset-0 scene-gradient" />
      <div className="absolute inset-0 scene-grid" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 320" role="img" aria-hidden="true">
        <defs>
          <radialGradient id={`glow-${visualType}`}>
            <stop offset="0%" stopColor={style.c} stopOpacity="0.72" />
            <stop offset="100%" stopColor={style.c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="scene-pulse" cx="378" cy="92" r="128" fill={`url(#glow-${visualType})`} />
        <path d="M0 256 C88 224 146 248 220 229 C310 205 374 226 520 190 V320 H0Z" fill="rgba(2,6,23,0.62)" />
        <path d="M0 284 C120 246 210 286 320 250 C402 223 460 236 520 220 V320 H0Z" fill="rgba(255,255,255,0.06)" />
        {particles.map((particle) => (
          <circle
            key={particle.id}
            className="scene-particle"
            cx={particle.x}
            cy={particle.y}
            r={particle.id % 3 === 0 ? 3.2 : 2.2}
            fill={style.c}
            style={{ animationDelay: particle.delay }}
          />
        ))}
        <SceneProp type={style.prop} color={style.c} mood={mood} />
        <Character x={118} y={230} accent={style.c} mood={mood} />
        <path className="scene-drift" d="M84 93 C111 55 151 58 173 95 C144 113 112 114 84 93Z" fill={style.c} opacity="0.22" />
        <path className="scene-drift slow" d="M410 212 C433 184 462 187 480 214 C455 227 432 229 410 212Z" fill="white" opacity="0.16" />
      </svg>
      <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.24em] text-white/76 backdrop-blur">
            {style.place}
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/76 backdrop-blur">
            {mood}
          </span>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">{branch}</p>
          <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight text-white sm:text-5xl">{title}</h2>
          <p className="mt-3 max-w-md text-sm font-medium uppercase tracking-[0.16em] text-white/52">{setting}</p>
        </div>
      </div>
      <style jsx>{`
        .scenario-scene {
          background: #020617;
        }
        .scene-gradient {
          background:
            radial-gradient(circle at 78% 18%, color-mix(in srgb, var(--scene-c) 42%, transparent), transparent 31%),
            radial-gradient(circle at 18% 80%, color-mix(in srgb, var(--scene-b) 46%, transparent), transparent 38%),
            linear-gradient(135deg, var(--scene-a), var(--scene-b));
          animation: sceneShift 9s ease-in-out infinite alternate;
        }
        .scene-grid {
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 70%, transparent);
        }
        .scene-float { animation: float 4.8s ease-in-out infinite; }
        .scene-breathe { animation: breathe 5.2s ease-in-out infinite; transform-origin: center; }
        .scene-pulse { animation: pulse 3.8s ease-in-out infinite; transform-origin: center; }
        .scene-drift { animation: drift 7s ease-in-out infinite; }
        .scene-drift.slow { animation-duration: 9s; }
        .scene-particle { opacity: 0.42; animation: particle 5.8s ease-in-out infinite; }
        .scene-blink { animation: blink 5.6s ease-in-out infinite; transform-origin: center; }
        @keyframes sceneShift { from { filter: saturate(1); transform: scale(1); } to { filter: saturate(1.22); transform: scale(1.035); } }
        @keyframes float { 0%, 100% { transform: translate(250px, 78px); } 50% { transform: translate(250px, 66px); } }
        @keyframes breathe { 0%, 100% { opacity: 0.94; } 50% { opacity: 0.72; } }
        @keyframes pulse { 0%, 100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.68; transform: scale(1.06); } }
        @keyframes drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(16px); } }
        @keyframes particle { 0%, 100% { transform: translateY(0); opacity: 0.22; } 50% { transform: translateY(-18px); opacity: 0.64; } }
        @keyframes blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.08); } }
        @media (prefers-reduced-motion: reduce) {
          .scene-gradient, .scene-float, .scene-breathe, .scene-pulse, .scene-drift, .scene-particle, .scene-blink {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
