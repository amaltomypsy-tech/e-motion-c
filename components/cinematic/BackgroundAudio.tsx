"use client";

import { useEffect, useRef } from "react";

export function BackgroundAudio({ src, enabled }: { src?: string; enabled: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!src) return;
    if (!audioRef.current) audioRef.current = new Audio(src);
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.25;
    if (enabled) {
      audio.play().catch(() => {
        // Autoplay often requires a user gesture. Fail silently.
      });
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [src, enabled]);

  return null;
}

