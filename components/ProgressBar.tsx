import React from "react";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-black/40 px-6 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="w-full h-2 bg-purple-950/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-purple-300/60 mt-2">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
}
