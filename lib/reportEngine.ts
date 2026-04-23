import type { BranchScoreSummary } from "@/types/report";
import type { EIPrimaryBranch } from "@/types/scenario";
import { EI_BRANCHES, normalizeScore } from "@/lib/scoringEngine";

function rankBranches(branchScores: BranchScoreSummary[]) {
  const sorted = [...branchScores].sort((a, b) => b.normalized - a.normalized);
  return {
    strongest: sorted.slice(0, 2),
    growth: sorted.slice(-2).reverse()
  };
}

function branchFriendlyTitle(branch: EIPrimaryBranch) {
  return branch;
}

export function buildInterpretation(params: {
  overallNormalizedScore: number;
  branchScores: BranchScoreSummary[];
  responseConsistencyIndex: number;
  averageDecisionLatencyMs: number;
  adaptiveChangeMetric: number;
}) {
  const { strongest, growth } = rankBranches(params.branchScores);

  const strengths = strongest.map(
    (b) => `${branchFriendlyTitle(b.branch)} (relative strength in this session)`
  );
  const growthAreas = growth.map(
    (b) => `${branchFriendlyTitle(b.branch)} (opportunity for skill-building)`
  );

  const behavioralInterpretation: string[] = [
    "This report reflects patterns in scenario-based decision-making within a short assessment session.",
    "It is developmental and non-diagnostic; it does not label personality or mental health.",
    "Scores represent emotional effectiveness in context: noticing feelings, using them to think, making sense of emotions, and choosing regulation strategies."
  ];

  const responsePatternInsights: string[] = [];

  if (params.responseConsistencyIndex < 0.55) {
    responsePatternInsights.push(
      "Your responses varied across scenarios. This can happen when situations feel very different, or when you are experimenting with different ways of responding."
    );
  } else {
    responsePatternInsights.push(
      "Your responses were relatively consistent across scenarios, suggesting stable decision patterns during this session."
    );
  }

  if (params.averageDecisionLatencyMs > 45000) {
    responsePatternInsights.push(
      "You took longer on many decisions. That can reflect careful consideration when scenarios feel personally relevant or complex."
    );
  } else if (params.averageDecisionLatencyMs < 12000) {
    responsePatternInsights.push(
      "You decided quickly on many items. Quick choices can be efficient, though pausing briefly can help in ambiguous situations."
    );
  } else {
    responsePatternInsights.push(
      "Your decision speed was moderate, balancing reflection with forward momentum."
    );
  }

  if (params.adaptiveChangeMetric !== 0) {
    responsePatternInsights.push(
      "Across comparable items, your later choices differed from earlier ones. In a longer assessment, this can inform adaptive item selection."
    );
  }

  return { strengths, growthAreas, behavioralInterpretation, responsePatternInsights };
}

export function buildBranchScoreSummaries(params: {
  branchRawScores: Record<EIPrimaryBranch, number>;
  branchMaxRaw: Record<EIPrimaryBranch, number>;
}) {
  const out: BranchScoreSummary[] = [];
  for (const b of EI_BRANCHES) {
    const raw = params.branchRawScores[b] ?? 0;
    const max = params.branchMaxRaw[b] ?? 0;
    out.push({
      branch: b,
      raw,
      max,
      normalized: normalizeScore(raw, max, 100)
    });
  }
  return out;
}
