/**
 * Advanced Audio Manager for EI Assessment
 * Handles ambient sounds, UI feedback, and scenario-based audio
 */

import { resolveAudioPath } from "./audioPath";

interface AudioTrack {
  element: HTMLAudioElement;
  volume: number;
  loop: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
}

class AudioManager {
  private tracks: Map<string, AudioTrack> = new Map();
  private masterVolume: number = 1;
  private enabled: boolean = true;
  private fadeIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    // Initialize on first user interaction
    if (typeof window !== "undefined") {
      document.addEventListener("click", () => this.resumeAudioContext(), { once: true });
    }
  }

  private resumeAudioContext() {
    // Resume all audio contexts (browser autoplay policy)
    this.tracks.forEach((track) => {
      if (track.element.paused && this.enabled) {
        track.element.play().catch(() => {
          // Silently fail - autoplay might still be blocked
        });
      }
    });
  }

  loadTrack(
    id: string,
    src: string,
    options: {
      volume?: number;
      loop?: boolean;
      fadeInDuration?: number;
      fadeOutDuration?: number;
    } = {}
  ) {
    const audio = new Audio(resolveAudioPath(src));
    audio.preload = "auto";

    const track: AudioTrack = {
      element: audio,
      volume: options.volume ?? 0.3,
      loop: options.loop ?? false,
      fadeInDuration: options.fadeInDuration ?? 1000,
      fadeOutDuration: options.fadeOutDuration ?? 1000,
    };

    this.tracks.set(id, track);
    this.updateVolume(id);
  }

  play(
    id: string,
    options: { fadeIn?: boolean; delay?: number } = {}
  ) {
    if (!this.enabled) return;

    const track = this.tracks.get(id);
    if (!track) {
      console.warn(`Audio track "${id}" not found`);
      return;
    }

    const play = () => {
      track.element.currentTime = 0;
      track.element.loop = track.loop;
      track.element.play().catch(() => {
        // Silently fail
      });

      if (options.fadeIn) {
        this.fadeIn(id);
      }
    };

    if (options.delay) {
      setTimeout(play, options.delay);
    } else {
      play();
    }
  }

  stop(id: string, options: { fadeOut?: boolean } = {}) {
    const track = this.tracks.get(id);
    if (!track) return;

    if (options.fadeOut) {
      this.fadeOut(id);
    } else {
      track.element.pause();
      track.element.currentTime = 0;
    }
  }

  fadeIn(id: string) {
    const track = this.tracks.get(id);
    if (!track) return;

    // Clear existing fade
    const existing = this.fadeIntervals.get(`fade-${id}`);
    if (existing) clearInterval(existing);

    track.element.volume = 0;
    const startTime = Date.now();
    const duration = track.fadeInDuration;
    const targetVolume = track.volume * this.masterVolume;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      track.element.volume = targetVolume * progress;

      if (progress >= 1) {
        clearInterval(interval);
        this.fadeIntervals.delete(`fade-${id}`);
      }
    }, 50);

    this.fadeIntervals.set(`fade-${id}`, interval);
  }

  fadeOut(id: string) {
    const track = this.tracks.get(id);
    if (!track) return;

    const existing = this.fadeIntervals.get(`fade-${id}`);
    if (existing) clearInterval(existing);

    const startVolume = track.element.volume;
    const startTime = Date.now();
    const duration = track.fadeOutDuration;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      track.element.volume = startVolume * (1 - progress);

      if (progress >= 1) {
        track.element.pause();
        track.element.currentTime = 0;
        clearInterval(interval);
        this.fadeIntervals.delete(`fade-${id}`);
      }
    }, 50);

    this.fadeIntervals.set(`fade-${id}`, interval);
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.tracks.forEach((track) => this.updateVolume(track.element.src));
  }

  private updateVolume(id: string) {
    const track = this.tracks.get(id);
    if (track) {
      track.element.volume = track.volume * this.masterVolume;
    }
  }

  setTrackVolume(id: string, volume: number) {
    const track = this.tracks.get(id);
    if (track) {
      track.volume = Math.max(0, Math.min(1, volume));
      this.updateVolume(id);
    }
  }

  enable() {
    this.enabled = true;
    this.resumeAudioContext();
  }

  disable() {
    this.enabled = false;
    this.tracks.forEach((track) => {
      track.element.pause();
      track.element.currentTime = 0;
    });
  }

  isEnabled() {
    return this.enabled;
  }

  cleanup() {
    this.fadeIntervals.forEach((interval) => clearInterval(interval));
    this.fadeIntervals.clear();
    this.tracks.forEach((track) => {
      track.element.pause();
      track.element.currentTime = 0;
    });
  }
}

export const audioManager = new AudioManager();
export default AudioManager;
