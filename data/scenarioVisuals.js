export const scenarioVisuals = {
  "level-01": { mood: "anxious", sceneImage: "/scenes/level-01.svg", branch: "Perceiving" },
  "level-02": { mood: "tense", sceneImage: "/scenes/level-02.svg", branch: "Using" },
  "level-03": { mood: "hurt", sceneImage: "/scenes/level-03.svg", branch: "Understanding" },
  "level-04": { mood: "irritated", sceneImage: "/scenes/level-04.svg", branch: "Managing" },
  "level-05": { mood: "uneasy", sceneImage: "/scenes/level-05.svg", branch: "Perceiving" },
  "level-06": { mood: "alert", sceneImage: "/scenes/level-06.svg", branch: "Using" },
  "level-07": { mood: "disappointed", sceneImage: "/scenes/level-07.svg", branch: "Understanding" },
  "level-08": { mood: "overwhelmed", sceneImage: "/scenes/level-08.svg", branch: "Managing" },
  "level-09": { mood: "curious", sceneImage: "/scenes/level-09.svg", branch: "Perceiving" },
  "level-10": { mood: "down", sceneImage: "/scenes/level-10.svg", branch: "Using" },
  "level-11": { mood: "stung", sceneImage: "/scenes/level-11.svg", branch: "Understanding" },
  "level-12": { mood: "panicked", sceneImage: "/scenes/level-12.svg", branch: "Managing" },
  "level-13": { mood: "attentive", sceneImage: "/scenes/level-13.svg", branch: "Perceiving" },
  "level-14": { mood: "drained", sceneImage: "/scenes/level-14.svg", branch: "Using" },
  "level-15": { mood: "anxious", sceneImage: "/scenes/level-15.svg", branch: "Understanding" },
  "level-16": { mood: "angry", sceneImage: "/scenes/level-16.svg", branch: "Managing" },
  "level-17": { mood: "concerned", sceneImage: "/scenes/level-17.svg", branch: "Perceiving" },
  "level-18": { mood: "tired", sceneImage: "/scenes/level-18.svg", branch: "Using" },
  "level-19": { mood: "hurt", sceneImage: "/scenes/level-19.svg", branch: "Understanding" },
  "level-20": { mood: "heated", sceneImage: "/scenes/level-20.svg", branch: "Managing" },
  "level-21": { mood: "observant", sceneImage: "/scenes/level-21.svg", branch: "Perceiving" },
  "level-22": { mood: "uncertain", sceneImage: "/scenes/level-22.svg", branch: "Using" },
  "level-23": { mood: "conflicted", sceneImage: "/scenes/level-23.svg", branch: "Understanding" },
  "level-24": { mood: "agitated", sceneImage: "/scenes/level-24.svg", branch: "Managing" },
  "level-25": { mood: "self-conscious", sceneImage: "/scenes/level-25.svg", branch: "Perceiving" },
  "level-26": { mood: "overloaded", sceneImage: "/scenes/level-26.svg", branch: "Using" },
  "level-27": { mood: "confused", sceneImage: "/scenes/level-27.svg", branch: "Understanding" },
  "level-28": { mood: "jealous", sceneImage: "/scenes/level-28.svg", branch: "Managing" },
  "level-29": { mood: "irritable", sceneImage: "/scenes/level-29.svg", branch: "Perceiving" },
  "level-30": { mood: "nervous", sceneImage: "/scenes/level-30.svg", branch: "Using" },
  "level-31": { mood: "uncertain", sceneImage: "/scenes/level-31.svg", branch: "Understanding" }
};

export function getScenarioVisual(levelId) {
  return scenarioVisuals[levelId] ?? {
    mood: "reflective",
    sceneImage: `/scenes/${levelId}.svg`,
    branch: "Assessment"
  };
}
