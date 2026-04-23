"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";

export default function AssessmentIndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstLevelId, setFirstLevelId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("ei.assessment.sessionId");
    const scenarioOrderRaw = localStorage.getItem("ei.assessment.scenarioOrder");
    if (!sessionId || !scenarioOrderRaw) {
      router.push("/onboarding");
      return;
    }
    try {
      const order = JSON.parse(scenarioOrderRaw) as string[];
      setFirstLevelId(order[0] ?? null);
    } catch {
      setFirstLevelId(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="text-sm text-white/60">Preparing…</div>;
  if (!firstLevelId)
    return <div className="text-sm text-white/70">No scenarios found. Check `data/scenarios/*.json`.</div>;

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-white/60">Assessment</div>
        <h2 className="mt-2 text-2xl font-semibold">Ready when you are.</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          You’ll see one scenario at a time. Choose the option that best reflects emotionally effective
          action in context.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push(`/assessment/${firstLevelId}`)}>Start</Button>
        </div>
      </div>
    </main>
  );
}

