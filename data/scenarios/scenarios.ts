import levelData from "@/data/scenarios/level-01.json";
import level02 from "@/data/scenarios/level-02.json";
import level03 from "@/data/scenarios/level-03.json";
import level04 from "@/data/scenarios/level-04.json";
import level05 from "@/data/scenarios/level-05.json";

const scenarios = [
  levelData,
  level02,
  level03,
  level04,
  level05,
  // For testing: cycle through available levels multiple times
  // In production, you'd import all 30 levels
];

export default scenarios;
