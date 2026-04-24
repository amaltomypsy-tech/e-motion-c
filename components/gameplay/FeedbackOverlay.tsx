interface Option {
  optionId: string;
  label: string;
  ei: {
    effectivenessScore: number;
    effectivenessLevel: string;
    rationale: string;
  };
}

const scoreColors = {
  high: "text-green-300",
  moderate: "text-yellow-300",
  low: "text-orange-300",
};

export default function FeedbackOverlay({ option }: { option: Option }) {
  return (
    <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-8 backdrop-blur mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Reflective Feedback</h3>
      <p className="text-purple-200 leading-relaxed">{option.ei.rationale}</p>
      <div className={`mt-4 text-sm font-semibold ${scoreColors[option.ei.effectivenessLevel as keyof typeof scoreColors]}`}>
        Emotional Effectiveness: {option.ei.effectivenessLevel.charAt(0).toUpperCase() + option.ei.effectivenessLevel.slice(1)}
      </div>
    </div>
  );
}
