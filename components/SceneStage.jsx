"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

const particles = [
  { left: "9%", top: "18%", size: 6, delay: 0.1, duration: 9 },
  { left: "23%", top: "72%", size: 4, delay: 0.7, duration: 11 },
  { left: "41%", top: "24%", size: 5, delay: 1.2, duration: 10 },
  { left: "64%", top: "16%", size: 7, delay: 0.4, duration: 12 },
  { left: "82%", top: "58%", size: 5, delay: 1.5, duration: 9 },
  { left: "91%", top: "31%", size: 3, delay: 0.9, duration: 13 }
];

const moodTone = {
  anxious: "from-rose-400/20 via-fuchsia-300/10 to-indigo-400/20",
  tense: "from-amber-300/20 via-orange-400/10 to-slate-600/20",
  hurt: "from-pink-300/18 via-violet-300/10 to-slate-500/20",
  irritated: "from-orange-400/20 via-rose-300/10 to-zinc-600/20",
  uneasy: "from-sky-300/18 via-slate-300/10 to-indigo-400/20",
  alert: "from-teal-300/20 via-cyan-200/10 to-amber-200/18",
  disappointed: "from-blue-300/16 via-slate-300/10 to-violet-300/16",
  overwhelmed: "from-fuchsia-300/18 via-rose-300/12 to-slate-600/20",
  curious: "from-emerald-300/18 via-cyan-300/10 to-slate-500/20",
  down: "from-blue-300/14 via-slate-300/10 to-indigo-400/18",
  panicked: "from-red-300/20 via-orange-300/12 to-purple-400/20",
  attentive: "from-lime-200/16 via-teal-200/10 to-slate-500/16",
  drained: "from-stone-200/16 via-slate-300/10 to-zinc-500/20",
  angry: "from-red-400/22 via-orange-300/12 to-zinc-700/22",
  tired: "from-indigo-200/14 via-slate-300/10 to-blue-400/16",
  heated: "from-orange-400/22 via-red-300/14 to-stone-700/20",
  observant: "from-emerald-200/16 via-teal-300/10 to-slate-500/18",
  uncertain: "from-violet-300/18 via-slate-300/10 to-blue-400/18",
  conflicted: "from-rose-300/18 via-violet-300/10 to-amber-200/14",
  agitated: "from-rose-400/20 via-orange-200/10 to-slate-600/20",
  "self-conscious": "from-pink-300/18 via-violet-300/10 to-stone-300/14",
  overloaded: "from-violet-300/18 via-stone-200/10 to-slate-600/20",
  confused: "from-cyan-200/16 via-violet-300/10 to-slate-500/18",
  jealous: "from-emerald-300/20 via-lime-200/10 to-zinc-600/18",
  irritable: "from-orange-300/20 via-rose-300/10 to-stone-600/20",
  nervous: "from-amber-200/18 via-rose-200/10 to-indigo-400/18"
};

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

export default function SceneStage({
  levelNumber,
  totalLevels,
  title,
  branch,
  mood,
  sceneImage,
  context,
  prompt,
  options,
  selectedOptionId,
  submitting,
  onSelect,
  onClear,
  onSubmit
}) {
  const [imageReady, setImageReady] = useState(Boolean(sceneImage));
  const tone = moodTone[mood] ?? moodTone.uncertain;

  const backdropStyle = useMemo(
    () => ({
      backgroundImage:
        "radial-gradient(circle at 72% 16%, rgba(255,255,255,0.22), transparent 28%), linear-gradient(135deg, #151321 0%, #23182f 48%, #07060a 100%)"
    }),
    []
  );

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden rounded-none text-white md:rounded-[2rem]">
      <div className="absolute inset-0 bg-ink-950" style={backdropStyle} />

      {imageReady && sceneImage ? (
        <motion.img
          key={sceneImage}
          src={sceneImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          onError={() => setImageReady(false)}
        />
      ) : (
        <div className={clsx("absolute inset-0 bg-gradient-to-br", tone)} />
      )}

      <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-90 mix-blend-screen", tone)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(90deg,rgba(3,4,8,0.82),rgba(3,4,8,0.24)_46%,rgba(3,4,8,0.8))]" />
      <div className="film-grain absolute inset-0" />

      <motion.div
        className="absolute left-[18%] top-[18%] h-44 w-44 rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 22, -10, 0], y: [0, -16, 12, 0], opacity: [0.32, 0.48, 0.28, 0.32] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[22%] right-[12%] h-56 w-56 rounded-full bg-amber-100/10 blur-3xl"
        animate={{ x: [0, -28, 14, 0], y: [0, 18, -10, 0], opacity: [0.22, 0.42, 0.24, 0.22] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {particles.map((p) => (
        <motion.span
          key={`${p.left}-${p.top}`}
          aria-hidden="true"
          className="absolute rounded-full bg-white/55 shadow-[0_0_22px_rgba(255,255,255,0.42)]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 10, 0], opacity: [0.12, 0.52, 0.2, 0.12] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-end px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full border border-white/15 bg-black/26 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/72 backdrop-blur-md">
            Level {String(levelNumber).padStart(2, "0")} / {String(totalLevels).padStart(2, "0")}
          </div>
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/76 backdrop-blur-md">
            {branch}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)] lg:items-end">
          <motion.div
            className="max-w-3xl rounded-[1.35rem] border border-white/10 bg-black/36 p-5 shadow-glow backdrop-blur-xl sm:p-7"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/58">
              <span>{mood}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span>Interactive psychological story</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">{context}</p>
            <div className="mt-5 rounded-2xl border border-white/12 bg-white/[0.07] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/54">Choice point</div>
              <p className="mt-2 text-lg font-medium leading-7 text-white/94">{prompt}</p>
            </div>
          </motion.div>

          <motion.div
            className="rounded-[1.35rem] border border-white/10 bg-black/42 p-3 shadow-glow backdrop-blur-xl sm:p-4"
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          >
            <div className="grid gap-3">
              {options.map((option, index) => {
                const selected = selectedOptionId === option.optionId;
                return (
                  <button
                    key={option.optionId}
                    type="button"
                    onClick={() => onSelect(option.optionId)}
                    disabled={submitting}
                    className={clsx(
                      "group min-h-[104px] rounded-2xl border p-4 text-left transition duration-300 focus:outline-none focus:ring-4 focus:ring-white/20",
                      selected
                        ? "border-white/45 bg-white/16 shadow-[0_18px_48px_rgba(255,255,255,0.13)]"
                        : "border-white/10 bg-white/[0.045] hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.085]",
                      submitting && !selected ? "opacity-55" : ""
                    )}
                    aria-pressed={selected}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={clsx(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition",
                          selected ? "bg-white text-ink-950" : "bg-white/12 text-white/82"
                        )}
                      >
                        {optionLetter(index)}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-5 text-white sm:text-base">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-white/67">{option.description}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClear}
                disabled={!selectedOptionId || submitting}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!selectedOptionId || submitting}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? "Saving..." : "Submit choice"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
