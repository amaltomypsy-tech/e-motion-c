using System;

namespace EIStoryAssessment
{
    // Minimal scenario models for Unity UI. Keep Next.js scenario JSON as source-of-truth.
    // If you later add localization/cultural variants, keep them in the JSON and rehydrate here.

    [Serializable]
    public class ScenarioLevel
    {
        public string levelId;
        public string title;
        public string branchPrimary;
        public string theme;
        public string[] culturalTags;
        public Narrative narrative;
        public ScenarioOption[] options;
        public SceneMetadata scene;
    }

    [Serializable]
    public class Narrative
    {
        public string context;
        public string prompt;
    }

    [Serializable]
    public class ScenarioOption
    {
        public string optionId;
        public string label;
        public string description;
    }

    [Serializable]
    public class SceneMetadata
    {
        public Background background;
        public string ambientAudioSrc;
        public string avatarEmotionState;
    }

    [Serializable]
    public class Background
    {
        public string type;  // "gradient" or "image"
        public string value; // CSS gradient or image path under /public
    }
}

