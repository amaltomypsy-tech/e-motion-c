"use client";

import { useEffect, useState } from "react";
import { audioManager } from "@/lib/audioManager";

export function AudioSystem() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Load audio tracks
    // Ambient sounds for different moods
    audioManager.loadTrack("ambient-calm", "ambient-calm.mp3", {
      volume: 0.15,
      loop: true,
      fadeInDuration: 2000,
      fadeOutDuration: 1500,
    });

    audioManager.loadTrack("ambient-tense", "ambient-tense.mp3", {
      volume: 0.12,
      loop: true,
      fadeInDuration: 2000,
      fadeOutDuration: 1500,
    });

    audioManager.loadTrack("ambient-reflective", "ambient-reflective.mp3", {
      volume: 0.18,
      loop: true,
      fadeInDuration: 2000,
      fadeOutDuration: 1500,
    });

    // UI Feedback sounds
    audioManager.loadTrack("ui-click", "ui-click.mp3", {
      volume: 0.4,
      loop: false,
    });

    audioManager.loadTrack("ui-select", "ui-select.mp3", {
      volume: 0.5,
      loop: false,
    });

    audioManager.loadTrack("ui-success", "ui-success.mp3", {
      volume: 0.6,
      loop: false,
    });

    audioManager.loadTrack("ui-transition", "ui-transition.mp3", {
      volume: 0.35,
      loop: false,
    });

    // High effectiveness feedback
    audioManager.loadTrack("feedback-high", "feedback-high.mp3", {
      volume: 0.55,
      loop: false,
    });

    // Moderate effectiveness feedback
    audioManager.loadTrack("feedback-moderate", "feedback-moderate.mp3", {
      volume: 0.45,
      loop: false,
    });

    // Low effectiveness feedback
    audioManager.loadTrack("feedback-low", "feedback-low.mp3", {
      volume: 0.4,
      loop: false,
    });

    return () => {
      audioManager.cleanup();
    };
  }, []);

  return (
    <button
      onClick={() => {
        if (isEnabled) {
          audioManager.disable();
          setIsEnabled(false);
        } else {
          audioManager.enable();
          setIsEnabled(true);
        }
      }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-lg transition-all hover:border-white/40 hover:bg-white/20 active:scale-95"
      title={isEnabled ? "Disable audio" : "Enable audio"}
    >
      <svg
        className="h-5 w-5 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        {isEnabled ? (
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        ) : (
          <path d="M16.6 14.89L17 14.5c.39-.39.39-1.02 0-1.41l-3.54-3.54c.05-.21.08-.43.08-.67 0-1.66-1.34-3-3-3-1.02 0-1.9.51-2.45 1.28l2.45 2.45c.33-.16.7-.25 1.1-.25 1.66 0 3 1.34 3 3 0 .4-.09.77-.25 1.1l2.61 2.61zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.53 2.61 6.43 6 6.92v-2.02C4.48 18.5 2 16.19 2 13c0-2.36 1.93-4.38 4.25-4.98L3 5.27zM20.97 17.5l1.03 1.03c.39-.39.61-.86.61-1.38C22.61 15.74 17.58 11 12 11c-.5 0-.97.1-1.44.25l1.39 1.39c.21-.05.43-.08.67-.08C14.66 12.5 16 13.84 16 15.5c0 .24-.03.46-.08.67l4.05 4.33zM12 4L9.91 6.09C10.39 6.04 10.69 6 12 6c5.58 0 10.61 4.24 10.97 9.5h2.02C23.45 7.9 18.3 4 12 4z" />
        )}
      </svg>
    </button>
  );
}
