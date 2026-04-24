import React, { useEffect, useState } from "react";

interface FeedbackOverlayProps {
  feedback: string;
}

export default function FeedbackOverlay({ feedback }: FeedbackOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 border border-purple-400/50 rounded-3xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1H7a1 1 0 000 2h2V4zm2 5H9a1 1 0 000 2h2V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Reflection</h4>
            <p className="text-purple-100 text-sm leading-relaxed">{feedback}</p>
          </div>
        </div>
        <p className="text-xs text-purple-300/60 mt-4">Moving to next scenario...</p>
      </div>
    </div>
  );
}
