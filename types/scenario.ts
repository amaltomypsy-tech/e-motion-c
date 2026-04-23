export type EIPrimaryBranch =
  | "Perceiving Emotions"
  | "Using Emotions to Facilitate Thinking"
  | "Understanding Emotions"
  | "Managing Emotions";

export type EIEffectivenessLevel = "high" | "moderate" | "low" | "very_low";

export interface SceneMetadata {
  background?: {
    type: "gradient" | "image";
    value: string; // gradient CSS or public path (e.g. "/images/scene-01.jpg")
  };
  ambientAudioSrc?: string; // public path (e.g. "/audio/ambient-01.mp3")
  avatarEmotionState?: string; // short label used for UI only; NOT scored
}

export interface ScenarioOption {
  optionId: string;
  label: string;
  description: string;
  ei: {
    effectivenessScore: 0 | 1 | 2 | 3;
    effectivenessLevel: EIEffectivenessLevel;
    rationale: string; // explicit psychometric rationale tied to EI effectiveness
  };
}

export interface ScenarioLevel {
  levelId: string;
  title: string;
  branchPrimary: EIPrimaryBranch;
  theme: string;
  culturalTags: string[];
  scene: SceneMetadata;
  narrative: {
    context: string;
    prompt: string;
  };
  options: ScenarioOption[]; // 3–4 options
}

