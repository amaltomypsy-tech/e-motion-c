"use client";

import clsx from "clsx";

export function DecisionCard({
  title,
  description,
  selected,
  onClick
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group w-full rounded-2xl border p-4 text-left transition",
        selected
          ? "border-white/30 bg-white/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/95">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-white/70">{description}</div>
        </div>
        <div
          className={clsx(
            "mt-1 h-3 w-3 rounded-full border transition",
            selected ? "border-white bg-white" : "border-white/20 bg-transparent"
          )}
        />
      </div>
    </button>
  );
}
