"use client";

export function ScoreSummary({ overall, raw, maxRaw }: { overall: number; raw: number; maxRaw: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-xs uppercase tracking-[0.22em] text-white/60">Overall EI</div>
      <div className="mt-2 flex items-end gap-3">
        <div className="text-4xl font-semibold">{overall}</div>
        <div className="pb-1 text-sm text-white/60">/ 100</div>
      </div>
      <div className="mt-2 text-sm text-white/65">
        Raw: <span className="text-white/80">{raw}</span> /{" "}
        <span className="text-white/80">{maxRaw}</span>
      </div>
    </div>
  );
}

