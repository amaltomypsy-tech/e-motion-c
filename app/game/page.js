"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import scenarios from "@/data/scenarios.js";
import ScenarioCard from "@/components/ScenarioCard.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";
import FeedbackOverlay from "@/components/FeedbackOverlay.jsx";

export default function GamePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [ready, setReady] = useState(false);
  const startedAt = useRef(Date.now());

  const scenario = scenarios[currentIndex];
  const anonymousUserId = typeof window !== "undefined" ? sessionStorage.getItem("anonymousUserId") : "";
  const sessionId = typeof window !== "undefined" ? sessionStorage.getItem("sessionId") : "";
  const playerName = typeof window !== "undefined" ? sessionStorage.getItem("playerName") || "traveler" : "traveler";

  const chapterNumber = useMemo(() => {
    const branches = [];
    for (const item of scenarios) {
      if (!branches.includes(item.branchPrimary)) branches.push(item.branchPrimary);
    }
    return branches.indexOf(scenario.branchPrimary) + 1;
  }, [scenario.branchPrimary]);

  useEffect(() => {
    if (!sessionStorage.getItem("sessionId") || !sessionStorage.getItem("anonymousUserId")) {
      router.replace("/onboarding");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    startedAt.current = Date.now();
  }, [currentIndex]);

  async function handleSelect(option) {
    if (selectedOption || saving) return;
    setSelectedOption(option);
    setSaving(true);
    setError("");

    const latencyMs = Math.max(0, Date.now() - startedAt.current);

    try {
      const response = await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousUserId,
          sessionId,
          levelId: scenario.levelId,
          selectedOptionId: option.optionId,
          latencyMs,
          changedSelectionCount: 0
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok && data?.error !== "already_answered") {
        throw new Error(data?.error || "Could not save response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save response");
    } finally {
      setSaving(false);
    }
  }

  function continueStory() {
    if (saving) return;
    setTransitioning(true);
    window.setTimeout(() => {
      if (currentIndex >= scenarios.length - 1) {
        router.push("/results");
        return;
      }
      setCurrentIndex((value) => value + 1);
      setSelectedOption(null);
      setTransitioning(false);
    }, 520);
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070712] text-purple-100">
        Loading your story...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#070712]">
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-black/45 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold uppercase tracking-[0.24em] text-white/48">
              {playerName}'s journey - Chapter {chapterNumber}
            </p>
            <ProgressBar current={currentIndex + 1} total={scenarios.length} branch={scenario.branchPrimary} />
          </div>
        </div>
      </div>

      <div className="pt-20">
        <ScenarioCard
          scenario={scenario}
          levelNumber={currentIndex + 1}
          totalLevels={scenarios.length}
          selectedOptionId={selectedOption?.optionId}
          locked={Boolean(selectedOption)}
          onSelect={handleSelect}
        />
      </div>

      <FeedbackOverlay option={selectedOption} saving={saving} onContinue={continueStory} />

      {error ? (
        <div className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100 backdrop-blur">
          Response saved locally in the story flow, but the server returned: {error}
        </div>
      ) : null}

      <div
        className={[
          "pointer-events-none fixed inset-0 z-[55] bg-white transition-opacity duration-500",
          transitioning ? "opacity-100" : "opacity-0"
        ].join(" ")}
      />
    </main>
  );
}
