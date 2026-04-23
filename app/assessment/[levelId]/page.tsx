"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ScenarioLevel } from "@/types/scenario";
import { TransitionFade } from "@/components/cinematic/TransitionFade";
import { ScenePlayer } from "@/components/cinematic/ScenePlayer";
import { AvatarPanel } from "@/components/gameplay/AvatarPanel";
import { DecisionCard } from "@/components/gameplay/DecisionCard";
import { ProgressIndicator } from "@/components/gameplay/ProgressIndicator";
import { Button } from "@/components/common/Button";

export default function AssessmentLevelPage() {
  const router = useRouter();
  const params = useParams<{ levelId: string }>();
  const levelId = params.levelId;

  const [scenario, setScenario] = useState<ScenarioLevel | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [changedCount, setChangedCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const startRef = useRef<number>(Date.now());

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [anonymousUserId, setAnonymousUserId] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | undefined>(undefined);
  const [scenarioOrder, setScenarioOrder] = useState<string[]>([]);

  useEffect(() => {
    const sid = typeof window !== "undefined" ? localStorage.getItem("ei.assessment.sessionId") : null;
    const uid =
      typeof window !== "undefined" ? localStorage.getItem("ei.assessment.anonymousUserId") : null;
    const aid =
      typeof window !== "undefined" ? localStorage.getItem("ei.assessment.avatarId") : null;
    const orderRaw =
      typeof window !== "undefined" ? localStorage.getItem("ei.assessment.scenarioOrder") : null;

    setSessionId(sid);
    setAnonymousUserId(uid);
    setAvatarId(aid ?? undefined);

    try {
      setScenarioOrder(orderRaw ? (JSON.parse(orderRaw) as string[]) : []);
    } catch {
      setScenarioOrder([]);
    }
  }, []);

  const progress = useMemo(() => {
    const idx = scenarioOrder.findIndex((x) => x === levelId);
    return { current: idx >= 0 ? idx + 1 : 1, total: scenarioOrder.length || 1 };
  }, [scenarioOrder, levelId]);

  useEffect(() => {
    startRef.current = Date.now();
    setSelectedOptionId(null);
    setChangedCount(0);
    (async () => {
      const res = await fetch(`/api/scenarios?levelId=${encodeURIComponent(levelId)}`);
      if (!res.ok) return;
      const data = (await res.json()) as ScenarioLevel;
      setScenario(data);
    })();
  }, [levelId]);

  function pick(optionId: string) {
    setSelectedOptionId((prev) => {
      if (prev && prev !== optionId) setChangedCount((c) => c + 1);
      return optionId;
    });
  }

  async function submit() {
    if (!scenario || !selectedOptionId || !sessionId || !anonymousUserId) {
      router.push("/onboarding");
      return;
    }

    setSubmitting(true);
    try {
      const latencyMs = Date.now() - startRef.current;
      const res = await fetch("/api/response", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          anonymousUserId,
          sessionId,
          levelId: scenario.levelId,
          selectedOptionId,
          latencyMs,
          changedSelectionCount: changedCount
        })
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);

      const currentIdx = scenarioOrder.findIndex((x) => x === scenario.levelId);
      const nextId = currentIdx >= 0 ? scenarioOrder[currentIdx + 1] : null;
      router.push(nextId ? `/assessment/${nextId}` : "/assessment/complete");
    } catch {
      // If save fails, keep the user on the screen to retry.
    } finally {
      setSubmitting(false);
    }
  }

  if (!scenario) return <div className="text-sm text-white/60">Loading scenario…</div>;

  return (
    <TransitionFade>
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <ScenePlayer scene={scenario.scene} audioEnabled={audioEnabled} />

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-white/60">
                    {scenario.branchPrimary}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold">{scenario.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {scenario.narrative.context}
                  </p>
                  <p className="mt-4 text-base font-medium text-white/90">{scenario.narrative.prompt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAudioEnabled((v) => !v)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/70 hover:bg-white/[0.06]"
                  >
                    Sound: {audioEnabled ? "On" : "Off"}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {scenario.options.map((o) => (
                  <DecisionCard
                    key={o.optionId}
                    title={o.label}
                    description={o.description}
                    selected={selectedOptionId === o.optionId}
                    onClick={() => pick(o.optionId)}
                  />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedOptionId(null)} disabled={submitting}>
                  Clear
                </Button>
                <Button onClick={submit} disabled={!selectedOptionId || submitting}>
                  {submitting ? "Submitting…" : "Submit choice"}
                </Button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-white/55">
                Scoring reflects EI effectiveness only (not morality, politeness, confidence, or sociability).
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <ProgressIndicator current={progress.current} total={progress.total} />
            <AvatarPanel avatarId={avatarId} emotionState={scenario.scene.avatarEmotionState} />
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-white/60">Theme</div>
              <div className="mt-2 text-sm text-white/80">{scenario.theme}</div>
              <div className="mt-4 text-xs uppercase tracking-[0.22em] text-white/60">Cultural tags</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {scenario.culturalTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </TransitionFade>
  );
}
