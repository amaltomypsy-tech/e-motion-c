import mongoose, { Schema } from "mongoose";

export interface IAssessmentReport {
  anonymousUserId: string;
  sessionId: string;
  createdAt: Date;
  rawScore: number;
  maxRawScore: number;
  overallNormalizedScore: number;
  branchScores: Array<{
    branch: string;
    raw: number;
    max: number;
    normalized: number;
  }>;
  responseConsistencyIndex: number;
  averageDecisionLatencyMs: number;
  adaptiveChangeMetric: number;
  strengths: string[];
  growthAreas: string[];
  behavioralInterpretation: string[];
  responsePatternInsights: string[];
}

const BranchScoreSchema = new Schema(
  {
    branch: { type: String, required: true },
    raw: { type: Number, required: true },
    max: { type: Number, required: true },
    normalized: { type: Number, required: true }
  },
  { _id: false }
);

const AssessmentReportSchema = new Schema<IAssessmentReport>(
  {
    anonymousUserId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true, index: true },
    createdAt: { type: Date, required: true, default: Date.now },
    rawScore: { type: Number, required: true },
    maxRawScore: { type: Number, required: true },
    overallNormalizedScore: { type: Number, required: true },
    branchScores: { type: [BranchScoreSchema], required: true, default: [] },
    responseConsistencyIndex: { type: Number, required: true },
    averageDecisionLatencyMs: { type: Number, required: true },
    adaptiveChangeMetric: { type: Number, required: true },
    strengths: { type: [String], required: true, default: [] },
    growthAreas: { type: [String], required: true, default: [] },
    behavioralInterpretation: { type: [String], required: true, default: [] },
    responsePatternInsights: { type: [String], required: true, default: [] }
  },
  { collection: "assessment_reports" }
);

export const AssessmentReport =
  (mongoose.models.AssessmentReport as mongoose.Model<IAssessmentReport>) ||
  mongoose.model<IAssessmentReport>("AssessmentReport", AssessmentReportSchema);
