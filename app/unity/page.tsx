"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/Button";

type AgeGroup = "18-21" | "22-24" | "25-27";

function ageToGroup(ageYears: number): AgeGroup {
  if (ageYears <= 21) return "18-21";
  if (ageYears <= 24) return "22-24";
  return "25-27";
}

function FieldLabel({ children }: { children: string }) {
  return <div className="text-xs uppercase tracking-[0.22em] text-white/60">{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90",
        "placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/15"
      ].join(" ")}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90",
        "focus:outline-none focus:ring-2 focus:ring-white/15"
      ].join(" ")}
    />
  );
}

export default function UnityWebGLHostPage() {
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [participantName, setParticipantName] = useState("");
  const [ageYears, setAgeYears] = useState<number | "">("");
  const [gender, setGender] = useState<"" | "Male" | "Female">("");
  const [residenceArea, setResidenceArea] = useState<"" | "Urban" | "Rural">("");
  const [stateName, setStateName] = useState("");

  useEffect(() => {
    const sid = typeof window !== "undefined" ? localStorage.getItem("ei.assessment.sessionId") : null;
    setExistingSessionId(sid);
  }, []);

  const canStart = useMemo(() => !loading && typeof ageYears === "number" && ageYears >= 18 && ageYears <= 27, [
    loading,
    ageYears
  ]);

  async function startSessionThenOpenUnity() {
    setLoading(true);
    setError(null);
    try {
      if (typeof ageYears !== "number") throw new Error("Enter age (18–27).");
      const ageGroup = ageToGroup(ageYears);

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ageGroup,
          demographics: {
            participantName: participantName || undefined,
            ageYears,
            gender: gender || undefined,
            residenceArea: residenceArea || undefined,
            state: stateName || undefined
          }
        })
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          payload && typeof payload.message === "string" ? payload.message : `Session creation failed (${res.status})`;
        throw new Error(message);
      }

      localStorage.setItem("ei.assessment.anonymousUserId", payload.anonymousUserId);
      localStorage.setItem("ei.assessment.sessionId", payload.sessionId);
      localStorage.setItem("ei.assessment.ageGroup", payload.ageGroup);
      localStorage.setItem("ei.assessment.scenarioOrder", JSON.stringify(payload.scenarioOrder ?? []));
      localStorage.setItem(
        "ei.assessment.demographics",
        JSON.stringify({ participantName, ageYears, gender, residenceArea, state: stateName })
      );
      setExistingSessionId(payload.sessionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function resetSession() {
    localStorage.removeItem("ei.assessment.anonymousUserId");
    localStorage.removeItem("ei.assessment.sessionId");
    localStorage.removeItem("ei.assessment.ageGroup");
    localStorage.removeItem("ei.assessment.scenarioOrder");
    localStorage.removeItem("ei.assessment.avatarId");
    localStorage.removeItem("ei.assessment.demographics");
    setExistingSessionId(null);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/60">Unity WebGL</div>
          <h2 className="mt-1 text-2xl font-semibold">Cinematic scenario player</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
            Before opening the cinematic player, enter minimal participant details for research export.
            Dashboard remains in Next.js at <code className="text-white/80">/dashboard</code>.
          </p>
        </div>
        <div className="flex gap-2">
          {existingSessionId ? (
            <Button variant="ghost" onClick={resetSession}>
              Reset session
            </Button>
          ) : null}
          <Link href="/">
            <Button variant="ghost">Back to home</Button>
          </Link>
        </div>
      </div>

      {!existingSessionId ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Name</FieldLabel>
              <Input
                placeholder="Optional (leave blank for anonymity)"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Age</FieldLabel>
              <div className="mt-2 text-xs text-white/55">
                Why we ask:{" "}
                <a className="underline hover:text-white/80" href="/data-notice">
                  see data notice
                </a>
              </div>
              <Input
                type="number"
                min={18}
                max={27}
                placeholder="18–27"
                value={ageYears}
                onChange={(e) => setAgeYears(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
            <div>
              <FieldLabel>Gender</FieldLabel>
              <Select value={gender} onChange={(e) => setGender((e.target.value as any) || "")}>
                <option value="">Prefer not to say / blank</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <div>
              <FieldLabel>State</FieldLabel>
              <Input
                placeholder="Optional (e.g., Kerala)"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Residence</FieldLabel>
              <Select
                value={residenceArea}
                onChange={(e) => setResidenceArea((e.target.value as any) || "")}
              >
                <option value="">Prefer not to say / blank</option>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </Select>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button onClick={startSessionThenOpenUnity} disabled={!canStart}>
              {loading ? "Starting…" : "Open cinematic player"}
            </Button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-white/55">
            The Unity build must be copied into <code className="text-white/80">public/unity</code>{" "}
            (so <code className="text-white/80">public/unity/index.html</code> exists).
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-white/60">
            Session ready: <span className="text-white/70">{existingSessionId}</span>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-glow">
            <iframe
              title="Unity WebGL"
              src="/unity/index.html"
              className="h-[72vh] w-full"
              allow="autoplay; fullscreen"
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/55">
            After playing, open <code className="text-white/70">/dashboard</code> for the report, or{" "}
            download Excel from <code className="text-white/70">/api/export</code>.
          </p>
        </div>
      )}
    </main>
  );
}
