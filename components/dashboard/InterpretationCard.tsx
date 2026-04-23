"use client";

export function InterpretationCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
        {items.map((t, idx) => (
          <li key={`${title}-${idx}`} className="flex gap-2">
            <span className="mt-[0.35rem] h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

