"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.28),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.2),transparent_30%),linear-gradient(135deg,#0b1020_0%,#151026_50%,#08070d_100%)]" />
      <div className="film-grain absolute inset-0" />
      <section className="relative z-10 flex min-h-screen items-center px-5 py-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-purple-100 backdrop-blur">
              Mayer and Salovey four-branch model
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
              E-Motion-C: An Interactive Emotional Intelligence Journey
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-purple-100/80 sm:text-lg">
              Step into cinematic social moments, choose how you respond, and receive a research-friendly EI profile shaped by your decisions.
            </p>
            <button
              onClick={() => router.push("/onboarding")}
              className="mt-9 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-950 shadow-[0_20px_80px_rgba(236,72,153,0.32)] transition hover:scale-[1.02] hover:bg-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-300/40"
            >
              Start Journey
            </button>
          </div>

          <div className="relative min-h-[390px] rounded-[2rem] border border-white/10 bg-black/25 p-4 shadow-2xl backdrop-blur">
            <div className="absolute inset-4 rounded-[1.55rem] bg-[linear-gradient(160deg,rgba(30,41,59,0.45),rgba(88,28,135,0.38)),url('/scenes/level-01.png')] bg-cover bg-center" />
            <div className="absolute inset-4 rounded-[1.55rem] bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative z-10 flex h-[360px] flex-col justify-end p-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-200">Chapter 01</p>
              <h2 className="mt-2 text-3xl font-black">The Read Receipt</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
                A message sits unanswered. The screen is quiet, but your mind starts filling in the silence.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {["Perceive", "Use", "Understand", "Manage"].map((label) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
