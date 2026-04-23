import type { EIPrimaryBranch } from "./scenario";

export interface BranchScoreSummary {
  branch: EIPrimaryBranch;
  raw: number;
  max: number;
  normalized: number; // 0–100
}

export interface AssessmentReportView {
  anonymousUserId: string;
  sessionId: string;
  createdAt: string;

  rawScore: number;
  maxRawScore: number;
  overallNormalizedScore: number; // 0–100

  branchScores: BranchScoreSummary[];
  responseConsistencyIndex: number; // 0–1
  averageDecisionLatencyMs: number;
  adaptiveChangeMetric: number; // -1..+1 (placeholder until validation)

  strengths: string[];
  growthAreas: string[];
  behavioralInterpretation: string[];
  responsePatternInsights: string[];
}

