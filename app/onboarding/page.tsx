"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";

type AgeGroup = "18-21" | "22-24" | "25-27";

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: "18-21", label: "18–21" },
  { value: "22-24", label: "22–24" },
  { value: "25-27", label: "25–27" }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("18-21");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => !!ageGroup && !loading, [ageGroup, loading]);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ageGroup })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const message =
          payload && typeof payload.message === "string"
            ? payload.message
            : `Session creation failed (${res.status})`;
        throw new Error(message);
      }
      const data = (await res.json()) as {
        anonymousUserId: string;
        sessionId: string;
        ageGroup: AgeGroup;
        scenarioOrder: string[];
        createdAt: string;
      };

      localStorage.setItem("ei.assessment.anonymousUserId", data.anonymousUserId);
      localStorage.setItem("ei.assessment.sessionId", data.sessionId);
      localStorage.setItem("ei.assessment.ageGroup", data.ageGroup);
      localStorage.setItem("ei.assessment.scenarioOrder", JSON.stringify(data.scenarioOrder));

      router.push("/demographics");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold">Onboarding</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Your responses are recorded under an anonymous identifier. This prototype is designed for
          research use; it is not a diagnostic tool.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-xs uppercase tracking-[0.22em] text-white/60">Age group</div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {AGE_GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setAgeGroup(g.value)}
                className={[
                  "rounded-2xl border px-4 py-3 text-left transition",
                  ageGroup === g.value
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                ].join(" ")}
              >
                <div className="text-sm font-semibold">{g.label}</div>
                <div className="mt-1 text-xs text-white/60">Young adult research cohort</div>
              </button>
            ))}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-xs text-white/55">
              Takes ~3–5 minutes in this prototype (3 items).
            </div>
            <Button onClick={start} disabled={!canSubmit}>
              {loading ? "Starting…" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
