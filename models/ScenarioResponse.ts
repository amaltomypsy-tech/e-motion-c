import mongoose, { Schema } from "mongoose";
import type { EIPrimaryBranch, EIEffectivenessLevel } from "@/types/scenario";

export interface IScenarioResponse {
  anonymousUserId: string;
  sessionId: string;
  participant_id?: string;
  levelId: string;
  chapter?: number;
  scenarioTitle?: string;
  branch?: string;
  selectedOptionId: string;
  selectedOptionText?: string;
  selectedOptionDescription?: string;
  adaptiveLevel?: string;
  score?: number;
  branchScore?: Record<string, number>;
  responseTimeMs?: number;
  createdAt?: Date;
  branchPrimary: EIPrimaryBranch;
  itemScore: 0 | 1 | 2 | 3 | 4;
  eiLevel: EIEffectivenessLevel;
  rationaleSnapshot?: string;
  latencyMs: number;
  changedSelectionCount: number;
  responseOrder: number;
  timestamp: Date;
  cumulativeRawScore: number;
  branchRunningScore: Record<string, number>;
}

const ScenarioResponseSchema = new Schema<IScenarioResponse>(
  {
    anonymousUserId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    participant_id: { type: String, required: false, index: true },
    levelId: { type: String, required: true, index: true },
    chapter: { type: Number, required: false },
    scenarioTitle: { type: String, required: false },
    branch: { type: String, required: false },
    selectedOptionId: { type: String, required: true },
    selectedOptionText: { type: String, required: false },
    selectedOptionDescription: { type: String, required: false },
    adaptiveLevel: { type: String, required: false },
    score: { type: Number, required: false, min: 0, max: 4 },
    branchScore: { type: Schema.Types.Mixed, required: false },
    responseTimeMs: { type: Number, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
    branchPrimary: { type: String, required: true },
    itemScore: { type: Number, required: true, min: 0, max: 4 },
    eiLevel: { type: String, required: true },
    rationaleSnapshot: { type: String, required: false },
    latencyMs: { type: Number, required: true },
    changedSelectionCount: { type: Number, required: true },
    responseOrder: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    cumulativeRawScore: { type: Number, required: true },
    branchRunningScore: { type: Schema.Types.Mixed, required: true }
  },
  { collection: "responses" }
);

ScenarioResponseSchema.index({ sessionId: 1, responseOrder: 1 }, { unique: true });
ScenarioResponseSchema.index({ sessionId: 1, levelId: 1 }, { unique: true });

export const ScenarioResponse =
  (mongoose.models.ScenarioResponse as mongoose.Model<IScenarioResponse>) ||
  mongoose.model<IScenarioResponse>("ScenarioResponse", ScenarioResponseSchema);
