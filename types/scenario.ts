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
  visualSetting?: string;
  emotionalTone?: string;
  avatarReaction?: string;
  animationHint?: string;
  soundCue?: string;
}

export interface ScenarioOption {
  id?: string;
  optionId: string;
  original_option_id?: string;
  original_text?: string;
  label: string;
  description: string;
  adaptiveLevel?: string;
  text?: string;
  score?: number;
  score_value?: number;
  branch?: EIPrimaryBranch;
  branchScore?: {
    perceiving: number;
    using: number;
    understanding: number;
    managing: number;
  };
  ei: {
    effectivenessScore: 0 | 1 | 2 | 3 | 4;
    effectivenessLevel: EIEffectivenessLevel;
    rationale: string; // explicit psychometric rationale tied to EI effectiveness
  };
}

export interface ScenarioLevel {
  level?: number;
  id?: string;
  levelId: string;
  chapter?: number;
  scene_title?: string;
  title: string;
  branchPrimary: EIPrimaryBranch;
  branch?: string;
  EI_branch?: EIPrimaryBranch;
  branchShort?: string;
  scenario?: string;
  player_state?: string;
  visual_setting?: string;
  emotional_tone?: string;
  avatar_reaction?: string;
  animation_hint?: string;
  sound_cue?: string;
  display_order?: string[];
  displayed_option_order?: string[];
  sceneTone?: string;
  context?: string;
  sceneImage?: string;
  mood?: string;
  setting?: string;
  story?: string;
  prompt?: string;
  visualType?: string;
  theme: string;
  culturalTags: string[];
  scene: SceneMetadata;
  narrative: {
    context: string;
    prompt: string;
    playerInternalState?: string;
  };
  options: ScenarioOption[]; // 3–4 options
}
