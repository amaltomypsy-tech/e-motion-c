"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChoiceCard from "@/components/ChoiceCard.jsx";
import ScenarioScene from "@/components/ScenarioScene.jsx";
import type { ScenarioLevel } from "@/types/scenario";

function readStorage(key: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key) ?? sessionStorage.getItem(key.replace("ei.assessment.", ""));
}

function optionOrder(scenario: ScenarioLevel) {
  return scenario.display_order ?? scenario.displayed_option_order ?? scenario.options.map((option: any) => option.optionId ?? option.id);
}

function playSceneChangeSound() {
  if (typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!AudioContextCtor) return;

  try {
    const audioContext = new AudioContextCtor();
    const master = audioContext.createGain();
    const shimmer = audioContext.createOscillator();
    const lowPulse = audioContext.createOscillator();
    const now = audioContext.currentTime;

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.055, now + 0.025);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    master.connect(audioContext.destination);

    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(620, now);
    shimmer.frequency.exponentialRampToValueAtTime(880, now + 0.18);
    shimmer.connect(master);

    lowPulse.type = "triangle";
    lowPulse.frequency.setValueAtTime(164, now);
    lowPulse.frequency.exponentialRampToValueAtTime(220, now + 0.22);
    lowPulse.connect(master);

    shimmer.start(now);
    lowPulse.start(now + 0.03);
    shimmer.stop(now + 0.36);
    lowPulse.stop(now + 0.3);
    window.setTimeout(() => audioContext.close().catch(() => undefined), 500);
  } catch {
    // Audio can be blocked by browser policy; navigation should continue silently.
  }
}

function saveLocalResponse(scenario: ScenarioLevel, selected: any, selectedOptionId: string, sessionId: string) {
  if (typeof window === "undefined") return;
  const key = `ei.assessment.responses.${sessionId}`;
  const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
  const withoutCurrent = existing.filter((response: any) => response.level_id !== scenario.levelId);
  const displayedOptionOrder = optionOrder(scenario);
  withoutCurrent.push({
    participant_id: localStorage.getItem("ei.assessment.participant_id") ?? sessionId,
    participant_name: localStorage.getItem("ei.assessment.participant_name") ?? "Anonymous",
    is_anonymous: localStorage.getItem("ei.assessment.is_anonymous") === "true",
    age: Number(localStorage.getItem("ei.assessment.age") ?? 0),
    userType: localStorage.getItem("ei.assessment.userType") ?? "non_target_sample",
    level_id: scenario.levelId,
    chapter: scenario.chapter,
    title: scenario.scene_title ?? scenario.title,
    scene_title: scenario.scene_title ?? scenario.title,
    branch: scenario.branch ?? scenario.branchPrimary,
    displayed_option_order: displayedOptionOrder,
    selected_display_position: displayedOptionOrder.indexOf(selectedOptionId) + 1,
    selected_option_id: selectedOptionId,
    original_option_id: selected?.original_option_id ?? selectedOptionId,
    original_option_text: selected?.original_text ?? selected?.label ?? selected?.text ?? selected?.description,
    selected_option_text: selected?.original_text ?? selected?.label ?? selected?.text ?? selected?.description,
    selected_option_description: selected?.description ?? selected?.text ?? selected?.label,
    score: selected?.score_value ?? selected?.score ?? selected?.ei?.effectivenessScore,
    adaptiveLevel: selected?.adaptiveLevel,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(key, JSON.stringify(withoutCurrent));
}

export default function AssessmentLevelPage() {
  const router = useRouter();
  const params = useParams<{ levelId: string }>();
  const levelId = params.levelId;

  const [scenario, setScenario] = useState<ScenarioLevel | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [changedCount, setChangedCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [anonymousUserId, setAnonymousUserId] = useState<string | null>(null);
  const [scenarioOrder, setScenarioOrder] = useState<string[]>([]);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const sid = readStorage("ei.assessment.sessionId");
    const uid = readStorage("ei.assessment.anonymousUserId");
    const orderRaw =
      typeof window !== "undefined"
        ? localStorage.getItem("ei.assessment.scenarioOrder") ?? sessionStorage.getItem("scenarioOrder")
        : null;

    setSessionId(sid);
    setAnonymousUserId(uid);
    try {
      setScenarioOrder(orderRaw ? (JSON.parse(orderRaw) as string[]) : []);
    } catch {
      setScenarioOrder([]);
    }
  }, []);

  useEffect(() => {
    startRef.current = Date.now();
    setSelectedOptionId(null);
    setChangedCount(0);
    setError("");
    (async () => {
      const sid =
        typeof window !== "undefined"
          ? localStorage.getItem("ei.assessment.sessionId") ?? sessionStorage.getItem("sessionId")
          : null;
      const query = sid
        ? `/api/scenarios?levelId=${encodeURIComponent(levelId)}&sessionId=${encodeURIComponent(sid)}`
        : `/api/scenarios?levelId=${encodeURIComponent(levelId)}`;
      const response = await fetch(query);
      if (!response.ok) {
        setScenario(null);
        setError("Scenario not found.");
        return;
      }
      setScenario((await response.json()) as ScenarioLevel);
    })();
  }, [levelId]);

  const progress = useMemo(() => {
    const total = scenarioOrder.length || 31;
    const indexFromOrder = scenarioOrder.findIndex((item) => item === levelId);
    const indexFromId = Number(levelId.replace("level-", "")) - 1;
    const current = indexFromOrder >= 0 ? indexFromOrder + 1 : Number.isFinite(indexFromId) ? indexFromId + 1 : 1;
    return { current, total };
  }, [levelId, scenarioOrder]);

  function pick(option: any) {
    const nextId = option.optionId ?? option.id;
    setSelectedOptionId((previous) => {
      if (previous && previous !== nextId) setChangedCount((count) => count + 1);
      return nextId;
    });
  }

  async function submit() {
    if (!scenario || !selectedOptionId) return;
    if (!sessionId || !anonymousUserId) {
      router.push("/onboarding");
      return;
    }

    setSubmitting(true);
    setError("");
    playSceneChangeSound();
    const selected = scenario.options.find((option: any) => (option.optionId ?? option.id) === selectedOptionId);
    const displayedOptionOrder = optionOrder(scenario);
    saveLocalResponse(scenario, selected, selectedOptionId, sessionId);

    try {
      const response = await fetch("/api/response", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          anonymousUserId,
          sessionId,
          levelId: scenario.levelId,
          scenarioTitle: scenario.scene_title ?? scenario.title,
          branch: scenario.branch ?? scenario.branchPrimary,
          displayedOptionOrder,
          selectedDisplayPosition: displayedOptionOrder.indexOf(selectedOptionId) + 1,
          selectedOptionId,
          originalOptionId: selected?.original_option_id ?? selectedOptionId,
          originalOptionText: selected?.original_text ?? selected?.text ?? selected?.description ?? selected?.label,
          selectedOptionText: selected?.original_text ?? selected?.text ?? selected?.description ?? selected?.label,
          score: selected?.score_value ?? selected?.score ?? selected?.ei?.effectivenessScore,
          branchScore: selected?.branchScore,
          responseTimeMs: Date.now() - startRef.current,
          latencyMs: Date.now() - startRef.current,
          changedSelectionCount: changedCount
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok && data?.error !== "already_answered") throw new Error(data?.error || "Save failed");
    } catch (err) {
      setError(err instanceof Error ? `Saved locally. Server sync failed: ${err.message}` : "Saved locally. Server sync failed.");
    } finally {
      setSubmitting(false);
      const currentIdx = scenarioOrder.findIndex((item) => item === scenario.levelId);
      const numeric = Number(scenario.levelId.replace("level-", ""));
      const nextId =
        currentIdx >= 0
          ? scenarioOrder[currentIdx + 1]
          : numeric < 31
            ? `level-${String(numeric + 1).padStart(2, "0")}`
            : null;
      if (!nextId) {
        fetch("/api/session/complete", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId })
        }).catch(() => undefined);
      }
      router.push(nextId ? `/assessment/${nextId}` : `/assessment/complete?sessionId=${encodeURIComponent(sessionId)}`);
    }
  }

  if (!scenario) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#060711] px-5 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white/70">
          {error || "Loading scenario..."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060711] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(244,114,182,0.14),transparent_28%),linear-gradient(135deg,#060711,#101322_54%,#050507)]" />
      <section className="relative z-10 mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/22 px-4 py-3 backdrop-blur">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
                Level {String(progress.current).padStart(2, "0")} of {progress.total}
              </p>
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-amber-200"
                  style={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
                />
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold text-white/68">
              {scenario.branchShort ?? scenario.branch ?? scenario.branchPrimary}
            </div>
          </div>

          <ScenarioScene
            visualType={scenario.visualType}
            title={scenario.title}
            branch={scenario.branchShort ?? scenario.branch ?? scenario.branchPrimary}
            mood={scenario.sceneTone ?? scenario.mood ?? scenario.scene?.avatarEmotionState ?? "reflective"}
            setting={scenario.setting ?? scenario.theme}
          />

          <div className="rounded-2xl border border-white/10 bg-black/28 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">Story context</p>
            <p className="mt-3 text-base leading-8 text-slate-100/82">{scenario.context ?? scenario.story ?? scenario.narrative.context}</p>
            <h1 className="mt-5 text-2xl font-black leading-tight text-white sm:text-3xl">{scenario.prompt ?? scenario.narrative.prompt}</h1>
          </div>
        </div>

        <aside className="rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl backdrop-blur sm:p-5 lg:sticky lg:top-5 lg:self-start">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-100/58">Choose response</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Select the option you would stand behind in this scene.</p>
          </div>
          <div className="grid gap-3">
            {scenario.options.map((option: any, index) => {
              const id = option.optionId ?? option.id;
              return (
                <ChoiceCard
                  key={id}
                  option={option}
                  index={index}
                  selected={selectedOptionId === id}
                  disabled={submitting}
                  onSelect={pick}
                />
              );
            })}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-300/25 bg-red-500/12 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={submit}
            disabled={!selectedOptionId || submitting}
            className="mt-5 w-full rounded-2xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? "Saving response..." : progress.current >= 31 ? "Submit final response" : "Submit and continue"}
          </button>
        </aside>
      </section>
    </main>
  );
}
