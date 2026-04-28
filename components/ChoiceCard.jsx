"use client";

export default function ChoiceCard({ option, index, selected, disabled, onSelect }) {
  const letter = String.fromCharCode(65 + index);
  const title = option.label || "";
  const body = option.description || option.text || "";
  const showTitle = title && title.trim() !== body.trim();
  const displayText = body || title || `Choice ${letter}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      disabled={disabled}
      className={[
        "group relative min-h-[118px] overflow-hidden rounded-2xl border p-4 text-left transition duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-200/20 sm:p-5",
        selected
          ? "border-cyan-200/80 bg-cyan-300/16 shadow-[0_18px_70px_rgba(34,211,238,0.2)]"
          : "border-white/10 bg-white/[0.065] hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/[0.105]",
        disabled && !selected ? "cursor-not-allowed opacity-45" : ""
      ].join(" ")}
      aria-pressed={selected}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.14),transparent_32%)] opacity-0 transition group-hover:opacity-100" />
      <span className="relative flex items-start gap-4">
        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black transition",
            selected ? "bg-cyan-100 text-slate-950" : "bg-white/12 text-white"
          ].join(" ")}
        >
          {letter}
        </span>
        <span className="min-w-0">
          {showTitle ? (
            <span className="block text-sm font-black uppercase tracking-[0.08em] text-white/90">{title}</span>
          ) : null}
          <span className={[showTitle ? "mt-2 " : "", "block text-sm leading-6 text-slate-100/82"].join("")}>
            {displayText}
          </span>
        </span>
      </span>
    </button>
  );
}
