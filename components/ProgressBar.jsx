export default function ProgressBar({ current, total, branch }) {
  const progress = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
        <span>{branch}</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
