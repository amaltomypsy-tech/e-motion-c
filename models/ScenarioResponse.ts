import mongoose, { Schema } from "mongoose";
import type { EIPrimaryBranch, EIEffectivenessLevel } from "@/types/scenario";

export interface IScenarioResponse {
  anonymousUserId: string;
  sessionId: string;
  levelId: string;
  selectedOptionId: string;
  branchPrimary: EIPrimaryBranch;
  itemScore: 0 | 1 | 2 | 3;
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
    levelId: { type: String, required: true, index: true },
    selectedOptionId: { type: String, required: true },
    branchPrimary: { type: String, required: true },
    itemScore: { type: Number, required: true, min: 0, max: 3 },
    eiLevel: { type: String, required: true },
    rationaleSnapshot: { type: String, required: false },
    latencyMs: { type: Number, required: true },
    changedSelectionCount: { type: Number, required: true },
    responseOrder: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    cumulativeRawScore: { type: Number, required: true },
    branchRunningScore: { type: Schema.Types.Mixed, required: true }
  },
  { collection: "scenario_responses" }
);

ScenarioResponseSchema.index({ sessionId: 1, responseOrder: 1 }, { unique: true });
ScenarioResponseSchema.index({ sessionId: 1, levelId: 1 }, { unique: true });

export const ScenarioResponse =
  (mongoose.models.ScenarioResponse as mongoose.Model<IScenarioResponse>) ||
  mongoose.model<IScenarioResponse>("ScenarioResponse", ScenarioResponseSchema);
