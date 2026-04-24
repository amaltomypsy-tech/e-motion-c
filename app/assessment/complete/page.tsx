"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CompletePage() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(
      params.get("sessionId") ??
        localStorage.getItem("ei.assessment.sessionId") ??
        sessionStorage.getItem("sessionId") ??
        ""
    );
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-[#060711] px-5 text-white">
      <section className="w-full max-w-2xl rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 text-center shadow-2xl backdrop-blur sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/60">Assessment complete</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">The story has enough data now.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-100/72">
          Your responses have been recorded. The results page reads the saved MongoDB response documents and session totals for this session.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/results${sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : ""}`}
            className="rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-950 transition hover:bg-cyan-100"
          >
            View results
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-white/12 bg-white/[0.06] px-6 py-4 text-sm font-bold text-white/78 transition hover:bg-white/[0.1]"
          >
            Back to start
          </Link>
        </div>
      </section>
    </main>
  );
}
