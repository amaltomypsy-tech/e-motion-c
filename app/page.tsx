import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.03] to-black/40 p-10 shadow-glow">
        <div className="absolute inset-0 film-grain" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">
            Research Prototype · Ages 18–27
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            An interactive, story-driven Emotional Intelligence assessment
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            A cinematic scenario engine grounded in Mayer & Salovey’s four-branch model. Decisions are
            scored for emotional effectiveness (not morality, politeness, extroversion, or confidence).
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/onboarding">
              <Button>Start onboarding</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">View dashboard (after completion)</Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {[
              "Perceiving Emotions",
              "Using Emotions to Facilitate Thinking",
              "Understanding Emotions",
              "Managing Emotions"
            ].map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

