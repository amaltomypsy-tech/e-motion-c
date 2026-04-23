"use client";

import type { SceneMetadata } from "@/types/scenario";
import { BackgroundAudio } from "@/components/cinematic/BackgroundAudio";

export function ScenePlayer({ scene, audioEnabled }: { scene: SceneMetadata; audioEnabled: boolean }) {
  const bg =
    scene.background?.type === "image"
      ? `url(${scene.background.value})`
      : scene.background?.value ??
        "linear-gradient(135deg, rgba(21,19,33,1) 0%, rgba(10,9,16,1) 65%, rgba(5,5,8,1) 100%)";

  return (
    <div className="relative h-[46vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-glow">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: bg, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 film-grain" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

      <div className="relative flex h-full items-end p-6">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-white/70">
            Interactive Assessment Scene
          </p>
          <p className="mt-2 text-lg font-semibold text-white/95">
            Stay with the emotional detail, then choose.
          </p>
        </div>
      </div>

      <BackgroundAudio src={scene.ambientAudioSrc || undefined} enabled={audioEnabled} />
    </div>
  );
}

