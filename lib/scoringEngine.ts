import scoringRules from "@/data/scoring/scoring-rules.json";
import type { EIPrimaryBranch, EIEffectivenessLevel, ScenarioLevel } from "@/types/scenario";
import type { ScenarioResponseRecord } from "@/types/response";

export type BranchScoreMap = Record<EIPrimaryBranch, number>;

export const EI_BRANCHES: EIPrimaryBranch[] = [
  "Perceiving Emotions",
  "Using Emotions to Facilitate Thinking",
  "Understanding Emotions",
  "Managing Emotions"
];

export function getMaxRawScore(levelCount: number) {
  return Math.max(0, levelCount) * 4;
}

export function normalizeScore(raw: number, maxRaw: number, scaleMax = 100) {
  if (maxRaw <= 0) return 0;
  const clamped = Math.max(0, Math.min(raw, maxRaw));
  return Math.round((clamped / maxRaw) * scaleMax);
}

export function scoreSelectedOption(scenario: ScenarioLevel, selectedOptionId: string) {
  const option = scenario.options.find((o) => o.optionId === selectedOptionId);
  if (!option) {
    throw new Error(`Option not found: ${selectedOptionId} in ${scenario.levelId}`);
  }
  return {
    itemScore: Math.min(4, option.score ?? option.ei.effectivenessScore),
    eiLevel: option.ei.effectivenessLevel as EIEffectivenessLevel,
    rationale: option.ei.rationale
  };
}

export function initBranchScoreMap(): BranchScoreMap {
  return EI_BRANCHES.reduce((acc, b) => {
    acc[b] = 0;
    return acc;
  }, {} as BranchScoreMap);
}

export function computeBranchScores(responses: Pick<ScenarioResponseRecord, "branchPrimary" | "itemScore">[]) {
  const scores = initBranchScoreMap();
  for (const r of responses) scores[r.branchPrimary] += r.itemScore;
  return scores;
}

export function computeAverageLatency(responses: Pick<ScenarioResponseRecord, "latencyMs">[]) {
  if (responses.length === 0) return 0;
  const total = responses.reduce((sum, r) => sum + r.latencyMs, 0);
  return Math.round(total / responses.length);
}

export function computeConsistencyIndex(responses: Pick<ScenarioResponseRecord, "itemScore">[]) {
  // Prototype-friendly, transparent metric (0..1):
  // - High when scores are stable (low variance) AND not dominated by extreme oscillation.
  // - NOT a clinical metric; replace with reliability/IRT logic after validation.
  if (responses.length <= 1) return 1;

  const scores = responses.map((r) => r.itemScore);
  const mean = scores.reduce<number>((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce<number>((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;

  // Maximum variance occurs with a 0/3 split around mean ~1.5 => variance ~2.25
  const maxVariance = 2.25;
  const varianceComponent = 1 - Math.min(variance / maxVariance, 1);

  // Oscillation penalty: count score direction changes
  let flips = 0;
  for (let i = 2; i < scores.length; i++) {
    const prevDelta = scores[i - 1] - scores[i - 2];
    const delta = scores[i] - scores[i - 1];
    if (prevDelta === 0 || delta === 0) continue;
    if ((prevDelta > 0 && delta < 0) || (prevDelta < 0 && delta > 0)) flips += 1;
  }
  const flipPenalty = Math.min(flips / Math.max(scores.length - 2, 1), 1) * 0.25;

  const index = Math.max(0, Math.min(varianceComponent - flipPenalty, 1));
  return Math.round(index * 100) / 100;
}

export function computeAdaptiveChangeMetric(
  responses: Pick<ScenarioResponseRecord, "branchPrimary" | "itemScore" | "responseOrder">[]
) {
  // Placeholder for future adaptive/longitudinal comparisons (e.g., within-branch difficulty gradients).
  // Current behavior:
  // - If a branch has >=2 items, compare first vs last item score within that branch, scaled to -1..+1.
  const byBranch = new Map<EIPrimaryBranch, { first: number; last: number }>();
  for (const b of EI_BRANCHES) byBranch.set(b, { first: Number.NaN, last: Number.NaN });

  const sorted = [...responses].sort((a, b) => a.responseOrder - b.responseOrder);
  for (const r of sorted) {
    const entry = byBranch.get(r.branchPrimary)!;
    if (Number.isNaN(entry.first)) entry.first = r.itemScore;
    entry.last = r.itemScore;
  }

  const deltas: number[] = [];
  for (const b of EI_BRANCHES) {
    const { first, last } = byBranch.get(b)!;
    if (Number.isNaN(first) || Number.isNaN(last) || first === last) continue;
    deltas.push((last - first) / 3);
  }

  if (deltas.length === 0) return 0;
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return Math.round(Math.max(-1, Math.min(avg, 1)) * 100) / 100;
}

export function effectivenessLabel(level: EIEffectivenessLevel) {
  const map = scoringRules.effectivenessLevels as Record<
    EIEffectivenessLevel,
    { score: number; label: string }
  >;
  return map[level]?.label ?? "EI effectiveness";
}
