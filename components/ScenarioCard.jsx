import ChoiceCard from "./ChoiceCard.jsx";

export default function ScenarioCard({ scenario, levelNumber, totalLevels, selectedOptionId, locked, onSelect }) {
  const sceneUrl = `/scenes/${scenario.levelId}.png`;
  const fallback = scenario.scene?.background?.value || "linear-gradient(135deg,#12111f,#21102f 52%,#090710)";

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#070712] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(5,5,12,0.9),rgba(5,5,12,0.62),rgba(5,5,12,0.86)), url('${sceneUrl}'), ${fallback}`
        }}
      />
      <div className="film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-5 py-6 md:py-9">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-pink-200">
              Level {String(levelNumber).padStart(2, "0")}
            </p>
            <h1 className="mt-2 text-2xl font-black sm:text-4xl">{scenario.title}</h1>
          </div>
          <p className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/75 backdrop-blur">
            {scenario.branchPrimary}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/45 p-5 backdrop-blur md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-100/60">
              Scene {levelNumber} of {totalLevels}
            </p>
            <p className="mt-5 text-xl font-semibold leading-9 text-white md:text-2xl">
              {scenario.narrative.context}
            </p>
            <div className="mt-6 rounded-3xl border border-pink-200/20 bg-pink-500/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink-100/70">Emotional cue</p>
              <p className="mt-2 text-lg leading-7 text-pink-50">"{scenario.narrative.prompt}"</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {scenario.options.map((option, index) => (
              <ChoiceCard
                key={option.optionId}
                option={option}
                index={index}
                selected={selectedOptionId === option.optionId}
                disabled={locked}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
