"use client";

export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  const pct = total <= 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.22em] text-white/60">Progress</div>
        <div className="text-xs text-white/60">
          {current}/{total}
        </div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-white/70" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

