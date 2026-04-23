import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function DataNoticePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-white/60">Data notice</div>
        <h1 className="mt-2 text-3xl font-semibold">What we collect (and why)</h1>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
          <p>
            This platform is a research-oriented emotional intelligence assessment prototype. Demographic
            inputs help analyze patterns across groups (e.g., age band differences) and improve cultural
            adaptability.
          </p>
          <p>
            <span className="font-semibold text-white/90">Age (18–27)</span> is used only to place participants
            into the study cohort and support age-group analysis. It is not used to label or diagnose.
          </p>
          <p>
            <span className="font-semibold text-white/90">Gender</span> and <span className="font-semibold text-white/90">Urban/Rural</span>{" "}
            are optional and are used for group-level research summaries and fairness checks.
          </p>
          <p>
            <span className="font-semibold text-white/90">Name</span> is optional. If you want strict anonymity,
            leave it blank and use a participant code (e.g., P01) if needed.
          </p>
          <p className="text-white/60">
            The dashboard is non-diagnostic and developmental. It reflects EI effectiveness in scenario choices,
            not morality, politeness, extroversion, or confidence.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/onboarding">
            <Button>Back to onboarding</Button>
          </Link>
          <Link href="/unity">
            <Button variant="ghost">Back to Unity gate</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

