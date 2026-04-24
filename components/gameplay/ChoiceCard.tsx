interface Option {
  optionId: string;
  label: string;
  description: string;
  ei: {
    effectivenessScore: number;
    effectivenessLevel: string;
    rationale: string;
  };
}

export default function ChoiceCard({
  option,
  isSelected,
  onSelect,
  disabled,
}: {
  option: Option;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onSelect(option.optionId)}
      disabled={disabled && !isSelected}
      className={`text-left p-6 rounded-2xl border-2 transition-all ${
        isSelected
          ? "bg-purple-600/30 border-purple-400 scale-105"
          : "bg-white/5 border-purple-500/20 hover:bg-white/10 hover:border-purple-400/50"
      } ${disabled && !isSelected ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <p className="font-bold text-white mb-2">{option.label}</p>
      <p className="text-sm text-purple-200/80">{option.description}</p>
    </button>
  );
}
