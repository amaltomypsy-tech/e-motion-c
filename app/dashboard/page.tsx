"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AssessmentReportView } from "@/types/report";
import { ScoreSummary } from "@/components/dashboard/ScoreSummary";
import { BranchRadarChart } from "@/components/dashboard/BranchRadarChart";
import { InterpretationCard } from "@/components/dashboard/InterpretationCard";
import { Button } from "@/components/common/Button";

export default function DashboardPage() {
  const router = useRouter();
  const [report, setReport] = useState<AssessmentReportView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("ei.assessment.sessionId");
    const anonymousUserId = localStorage.getItem("ei.assessment.anonymousUserId");
    if (!sessionId || !anonymousUserId) return;

    setLoading(true);
    setError(null);
    fetch("/api/report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, anonymousUserId })
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Report failed (${r.status})`);
        return (await r.json()) as AssessmentReportView;
      })
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-white/60">Generating report…</div>;

  if (!report) {
    return (
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Complete an assessment session first. Then return here to generate your report.
          </p>
          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => router.push("/onboarding")}>Start onboarding</Button>
            <Button variant="ghost" onClick={() => router.push("/")}>
              Back to home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/60">Assessment report</div>
          <h2 className="mt-2 text-3xl font-semibold">Your EI profile (session-based)</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
            Student-friendly and culturally sensitive. Non-diagnostic. Interprets only emotional effectiveness
            in scenario decisions.
          </p>
        </div>
        <div className="text-xs text-white/50">
          Session: <span className="text-white/70">{report.sessionId}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ScoreSummary overall={report.overallNormalizedScore} raw={report.rawScore} maxRaw={report.maxRawScore} />
        <BranchRadarChart data={report.branchScores} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <InterpretationCard title="Strengths" items={report.strengths} />
        <InterpretationCard title="Growth areas" items={report.growthAreas} />
        <InterpretationCard title="Response insights" items={report.responsePatternInsights} />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-sm font-semibold text-white/90">Behavioral interpretation</div>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
          {report.behavioralInterpretation.map((t, idx) => (
            <li key={`bi-${idx}`} className="flex gap-2">
              <span className="mt-[0.35rem] h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-white/60">Consistency</div>
            <div className="mt-2 text-2xl font-semibold">{Math.round(report.responseConsistencyIndex * 100)}%</div>
            <div className="mt-1 text-xs text-white/55">Prototype metric (replace after validation)</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-white/60">Avg latency</div>
            <div className="mt-2 text-2xl font-semibold">{Math.round(report.averageDecisionLatencyMs / 1000)}s</div>
            <div className="mt-1 text-xs text-white/55">Per item</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-white/60">Adaptive change</div>
            <div className="mt-2 text-2xl font-semibold">{report.adaptiveChangeMetric}</div>
            <div className="mt-1 text-xs text-white/55">Placeholder (-1..+1)</div>
          </div>
        </div>
      </div>
    </main>
  );
}

