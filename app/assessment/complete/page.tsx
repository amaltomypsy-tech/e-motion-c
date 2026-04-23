"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function CompletePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-white/60">Complete</div>
        <h2 className="mt-2 text-2xl font-semibold">Session finished.</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          You can now generate a non-diagnostic dashboard report based on your recorded choices.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard">
            <Button>Open dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Back to home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

