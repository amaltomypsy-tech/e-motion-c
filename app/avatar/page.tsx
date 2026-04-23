"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";

const AVATARS = ["avatar-01", "avatar-02", "avatar-03", "avatar-04"];

export default function AvatarPage() {
  const router = useRouter();
  const [avatarId, setAvatarId] = useState<string>("avatar-01");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("ei.assessment.avatarId");
    if (existing) setAvatarId(existing);
  }, []);

  async function continueToAssessment() {
    const sessionId = localStorage.getItem("ei.assessment.sessionId");
    if (!sessionId) {
      router.push("/onboarding");
      return;
    }
    setSaving(true);
    try {
      localStorage.setItem("ei.assessment.avatarId", avatarId);
      await fetch("/api/session", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, avatarId })
      }).catch(() => {
        // Avatar is optional; do not block progress if update fails.
      });
      router.push("/assessment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold">Avatar (optional)</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Choose a minimal avatar label for immersion. This does not affect scoring.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatarId(a)}
                className={[
                  "rounded-2xl border px-4 py-4 text-left transition",
                  avatarId === a
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                ].join(" ")}
              >
                <div className="text-sm font-semibold">{a}</div>
                <div className="mt-1 text-xs text-white/60">Minimal identity anchor</div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end">
            <Button onClick={continueToAssessment} disabled={saving}>
              {saving ? "Saving…" : "Begin assessment"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

