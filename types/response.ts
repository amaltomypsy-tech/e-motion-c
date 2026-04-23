import type { EIPrimaryBranch, EIEffectivenessLevel } from "./scenario";

export interface ScenarioResponseInput {
  anonymousUserId: string;
  sessionId: string;
  levelId: string;
  selectedOptionId: string;
  latencyMs: number;
  changedSelectionCount: number;
}

export interface ScenarioResponseRecord extends ScenarioResponseInput {
  branchPrimary: EIPrimaryBranch;
  itemScore: 0 | 1 | 2 | 3;
  eiLevel: EIEffectivenessLevel;
  rationaleSnapshot?: string;
  responseOrder: number;
  timestamp: string;
  cumulativeRawScore: number;
  branchRunningScore: Record<EIPrimaryBranch, number>;
}

export interface UserSessionRecord {
  anonymousUserId: string;
  sessionId: string;
  ageGroup: "18-21" | "22-24" | "25-27";
  avatarId?: string;
  demographics?: {
    participantName?: string;
    ageYears?: number;
    gender?: string;
    residenceArea?: "Urban" | "Rural";
    educationLevel?: string;
    city?: string;
    state?: string;
    country?: string;
    primaryLanguage?: string;
    institutionType?: string;
    socioeconomicStatus?: string;
    additionalNotes?: string;
  };
  scenarioOrder: string[];
  createdAt: string;
  completedAt?: string;
}
