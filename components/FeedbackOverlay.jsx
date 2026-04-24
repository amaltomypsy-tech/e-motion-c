export default function FeedbackOverlay({ option, saving, onContinue }) {
  if (!option) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/15 bg-[#10101f]/95 p-6 shadow-2xl md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink-200">Reflective pause</p>
        <h2 className="mt-3 text-2xl font-black text-white">What this response may reveal</h2>
        <p className="mt-4 text-base leading-7 text-purple-50/80">{option.ei.rationale}</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-white/68">
          This is not marked as right or wrong during the story. It is one behavioral signal that contributes to the final profile.
        </p>
        <button
          onClick={onContinue}
          disabled={saving}
          className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-purple-100 disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Saving response..." : "Continue the story"}
        </button>
      </div>
    </div>
  );
}
