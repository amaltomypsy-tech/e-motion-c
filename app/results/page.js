"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const branchLabels = {
  perceiving: "Perceiving Emotions",
  using: "Using Emotions",
  understanding: "Understanding Emotions",
  managing: "Managing Emotions"
};

const branchShortToKey = {
  "Perceiving Emotions": "perceiving",
  "Using Emotions to Facilitate Thinking": "using",
  "Understanding Emotions": "understanding",
  "Managing Emotions": "managing"
};

function interpretation(strongest, growth) {
  return `Your response pattern is strongest in ${branchLabels[strongest]}, suggesting this branch was most available during the story moments. ${branchLabels[growth]} appears to be the main development edge, which means future practice can focus on slowing down, reading context, and choosing emotion-informed action when pressure rises.`;
}

export default function ResultsPage() {
  const router = useRouter();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const params = new URLSearchParams(window.location.search);
      const sessionId =
        params.get("sessionId") ??
        localStorage.getItem("ei.assessment.sessionId") ??
        sessionStorage.getItem("sessionId");

      if (!sessionId) {
        router.replace("/onboarding");
        return;
      }

      try {
        const response = await fetch(`/api/response?sessionId=${encodeURIComponent(sessionId)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Could not load results");
        setPayload(data);
      } catch (err) {
        const localResponses = JSON.parse(localStorage.getItem(`ei.assessment.responses.${sessionId}`) ?? "[]");
        if (localResponses.length) {
          const totals = { perceiving: 0, using: 0, understanding: 0, managing: 0 };
          for (const response of localResponses) {
            const key = branchShortToKey[response.branch] ?? "perceiving";
            totals[key] += response.score ?? 0;
          }
          setPayload({
            session: {
              sessionId,
              participant_id: localStorage.getItem("ei.assessment.participant_id") ?? sessionId,
              participant_name: localStorage.getItem("ei.assessment.participant_name") ?? "Anonymous",
              is_anonymous: localStorage.getItem("ei.assessment.is_anonymous") === "true",
              age: Number(localStorage.getItem("ei.assessment.age") ?? 0),
              userType: localStorage.getItem("ei.assessment.userType") ?? "non_target_sample",
              completedLevels: localResponses.map((response) => response.level_id),
              totalScore: localResponses.reduce((sum, response) => sum + (response.score ?? 0), 0),
              branchTotals: totals
            },
            responses: localResponses.map((response) => ({
              levelId: response.level_id,
              scenarioTitle: response.title,
              branch: response.branch,
              selectedOptionId: response.selected_option_id,
              selectedOptionText: response.selected_option_text,
              selectedOptionDescription: response.selected_option_description,
              adaptiveLevel: response.adaptiveLevel,
              score: response.score,
              createdAt: response.timestamp
            })),
            persistence: "local"
          });
        } else {
          setError(err instanceof Error ? err.message : "Could not load results");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const summary = useMemo(() => {
    const totals = payload?.session?.branchTotals ?? {
      perceiving: 0,
      using: 0,
      understanding: 0,
      managing: 0
    };
    const entries = Object.entries(totals);
    const strongest = entries.reduce((best, item) => (item[1] > best[1] ? item : best), entries[0] ?? ["perceiving", 0])[0];
    const growth = entries.reduce((low, item) => (item[1] < low[1] ? item : low), entries[0] ?? ["perceiving", 0])[0];
    return { totals, strongest, growth };
  }, [payload]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[#060711] text-white">Reading saved responses...</main>;
  }

  if (error || !payload) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#060711] px-5 text-white">
        <div className="rounded-2xl border border-red-300/25 bg-red-500/12 p-6 text-center">
          <h1 className="text-2xl font-black">Results unavailable</h1>
          <p className="mt-3 text-red-100/80">{error || "No saved results were returned."}</p>
        </div>
      </main>
    );
  }

  const completed = payload.session.completedLevels?.length ?? payload.responses.length;
  const totalScore = payload.session.totalScore ?? 0;
  const maxScore = Math.max(1, completed * 4);
  const normalized = Math.round((totalScore / maxScore) * 100);
  const userType = payload.session.userType ?? "non_target_sample";
  const isTargetSample = userType === "target_sample";

  return (
    <main className="min-h-screen bg-[#060711] px-4 py-8 text-white sm:px-6">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(244,114,182,0.14),transparent_28%),linear-gradient(135deg,#060711,#101322_54%,#050507)]" />
      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/60">Research summary</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">Your EI Story Profile</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-100/70">
            {isTargetSample
              ? "This is a non-diagnostic, research-style profile generated from the response documents saved for this session."
              : "This experience is designed and validated primarily for individuals aged 17-27. Your results are shown for general insight and may not reflect standardized interpretation."}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/48">Total score</p>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-6xl font-black">{totalScore}</span>
              <span className="pb-2 text-lg font-bold text-white/50">/ {maxScore}</span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-amber-200" style={{ width: `${normalized}%` }} />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-100/68">
              Completed levels: <strong className="text-white">{completed}</strong>
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-black/24 p-6 backdrop-blur">
            <h2 className="text-2xl font-black">Branch-wise scores</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Object.entries(summary.totals).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-white">{branchLabels[key]}</h3>
                    <span className="text-sm font-black text-cyan-100">{value}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-cyan-200" style={{ width: `${Math.min(100, (value / Math.max(1, completed * 4)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isTargetSample ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[1.25rem] border border-emerald-200/15 bg-emerald-300/8 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-100/55">Strongest branch</p>
              <h2 className="mt-2 text-2xl font-black">{branchLabels[summary.strongest]}</h2>
            </div>
            <div className="rounded-[1.25rem] border border-amber-200/15 bg-amber-300/8 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-100/55">Development focus</p>
              <h2 className="mt-2 text-2xl font-black">{branchLabels[summary.growth]}</h2>
            </div>
          </div>
        ) : null}

        {isTargetSample ? (
          <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-6">
            <h2 className="text-2xl font-black">Interpretation</h2>
            <p className="mt-3 max-w-4xl text-base leading-8 text-slate-100/72">
              {interpretation(summary.strongest, summary.growth)}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-6">
            <h2 className="text-2xl font-black">General insight only</h2>
            <p className="mt-3 max-w-4xl text-base leading-8 text-slate-100/72">
              This experience is designed and validated primarily for individuals aged 17-27. Your results are shown for general insight and may not reflect standardized interpretation.
            </p>
          </div>
        )}

        <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-black/24 p-5 backdrop-blur">
          <h2 className="text-2xl font-black">Selected responses</h2>
          <div className="mt-5 grid gap-3">
            {payload.responses.map((response) => (
              <article key={response.levelId} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/42">{response.levelId}</p>
                    <h3 className="mt-1 text-lg font-black">{response.scenarioTitle}</h3>
                    <p className="mt-1 text-sm text-cyan-100/62">{response.branch}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-950">{response.score}/4</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-100/72">{response.selectedOptionText}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
