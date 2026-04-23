"use client";

import clsx from "clsx";

export function AvatarPanel({ avatarId, emotionState }: { avatarId?: string; emotionState?: string }) {
  const fallback = "Anonymous";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div
        className={clsx(
          "grid h-10 w-10 place-items-center rounded-2xl border border-white/10",
          "bg-gradient-to-br from-white/10 to-white/0"
        )}
        aria-hidden="true"
      >
        <span className="text-xs text-white/70">{(avatarId ?? "A").slice(-2).toUpperCase()}</span>
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white/90">{avatarId ?? fallback}</div>
        <div className="text-xs text-white/60">
          {emotionState ? `Current state: ${emotionState}` : "Current state: —"}
        </div>
      </div>
    </div>
  );
}
