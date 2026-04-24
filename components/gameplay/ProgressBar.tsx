export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-purple-300">Progress</span>
        <span className="text-sm text-purple-400">{current} of {total}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
