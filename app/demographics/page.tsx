"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";

type Demographics = {
  participantName?: string;
  ageYears?: number;
  gender?: "Male" | "Female";
  residenceArea?: "Urban" | "Rural";
  educationLevel?: string;
  city?: string;
  state?: string;
  country?: string;
  primaryLanguage?: string;
  institutionType?: string;
  socioeconomicStatus?: string;
  additionalNotes?: string;
};

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

export default function DemographicsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const [demo, setDemo] = useState<Demographics>({
    country: "India"
  });

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("ei.assessment.sessionId") : null;
    setSessionId(id);
    if (!id) router.push("/onboarding");
  }, [router]);

  async function saveAndContinue() {
    if (!sessionId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/session", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId,
          demographics: {
            ...demo,
            ageYears: demo.ageYears ? Number(demo.ageYears) : undefined
          }
        })
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          payload && typeof payload.message === "string" ? payload.message : `Save failed (${res.status})`;
        throw new Error(message);
      }
      localStorage.setItem("ei.assessment.demographics", JSON.stringify(demo));
      router.push("/avatar");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold">Participant details</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          These are collected for research context and export. Keep it minimal and culturally adaptable.
          Name is optional; if you want strict anonymity, leave it blank.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Participant name (optional)</FieldLabel>
              <Input
                placeholder="e.g., P01 or initials"
                value={demo.participantName ?? ""}
                onChange={(e) => setDemo((d) => ({ ...d, participantName: e.target.value || undefined }))}
              />
            </div>
            <div>
              <FieldLabel>Age (years)</FieldLabel>
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
                value={demo.ageYears ?? ""}
                onChange={(e) =>
                  setDemo((d) => ({
                    ...d,
                    ageYears: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
              />
            </div>
            <div>
              <FieldLabel>Gender</FieldLabel>
              <Select value={demo.gender ?? ""} onChange={(e) => setDemo((d) => ({ ...d, gender: (e.target.value as any) || undefined }))}>
                <option value="">Prefer not to say / blank</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <div>
              <FieldLabel>Residence</FieldLabel>
              <Select
                value={demo.residenceArea ?? ""}
                onChange={(e) =>
                  setDemo((d) => ({ ...d, residenceArea: (e.target.value as any) || undefined }))
                }
              >
                <option value="">Prefer not to say / blank</option>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </Select>
            </div>
            <div>
              <FieldLabel>Education level</FieldLabel>
              <Input
                placeholder="e.g., Undergraduate / Postgraduate"
                value={demo.educationLevel ?? ""}
                onChange={(e) => setDemo((d) => ({ ...d, educationLevel: e.target.value || undefined }))}
              />
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <Input
                placeholder="e.g., Kochi"
                value={demo.city ?? ""}
                onChange={(e) => setDemo((d) => ({ ...d, city: e.target.value || undefined }))}
              />
            </div>
            <div>
              <FieldLabel>State</FieldLabel>
              <Input
                placeholder="e.g., Kerala"
                value={demo.state ?? ""}
                onChange={(e) => setDemo((d) => ({ ...d, state: e.target.value || undefined }))}
              />
            </div>
            <div>
              <FieldLabel>Primary language</FieldLabel>
              <Input
                placeholder="e.g., Malayalam / Hindi / English"
                value={demo.primaryLanguage ?? ""}
                onChange={(e) => setDemo((d) => ({ ...d, primaryLanguage: e.target.value || undefined }))}
              />
            </div>
            <div>
              <FieldLabel>Institution type</FieldLabel>
              <Input
                placeholder="e.g., Government / Private / Autonomous"
                value={demo.institutionType ?? ""}
                onChange={(e) => setDemo((d) => ({ ...d, institutionType: e.target.value || undefined }))}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Additional notes (optional)</FieldLabel>
              <Input
                placeholder="Any demographic notes you want to capture (optional)"
                value={demo.additionalNotes ?? ""}
                onChange={(e) => setDemo((d) => ({ ...d, additionalNotes: e.target.value || undefined }))}
              />
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-end">
            <Button onClick={saveAndContinue} disabled={saving}>
              {saving ? "Saving…" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
