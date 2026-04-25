import mongoose, { Schema } from "mongoose";

export type AgeGroup = "17-21" | "22-24" | "25-27" | "non-target";
export type UserType = "target_sample" | "non_target_sample";

export interface IUserSession {
  anonymousUserId: string;
  sessionId: string;
  participant_id: string;
  participant_name: string;
  is_anonymous: boolean;
  age?: number;
  gender?: string;
  education?: string;
  userType: UserType;
  ageGroup: AgeGroup;
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
  startedAt?: Date;
  lastUpdatedAt?: Date;
  completedLevels?: string[];
  totalScore?: number;
  branchTotals?: {
    perceiving: number;
    using: number;
    understanding: number;
    managing: number;
  };
  createdAt: Date;
  completedAt?: Date;
}

const DemographicsSchema = new Schema(
  {
    participantName: { type: String, required: false },
    ageYears: { type: Number, required: false, min: 0, max: 120 },
    gender: { type: String, required: false },
    residenceArea: { type: String, required: false, enum: ["Urban", "Rural"] },
    educationLevel: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false, default: "India" },
    primaryLanguage: { type: String, required: false },
    institutionType: { type: String, required: false },
    socioeconomicStatus: { type: String, required: false },
    additionalNotes: { type: String, required: false }
  },
  { _id: false }
);

const UserSessionSchema = new Schema<IUserSession>(
  {
    anonymousUserId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true, index: true },
    participant_id: { type: String, required: true, unique: true, index: true },
    participant_name: { type: String, required: true, default: "Anonymous" },
    is_anonymous: { type: Boolean, required: true, default: true },
    age: { type: Number, required: false, min: 0, max: 120 },
    gender: { type: String, required: false },
    education: { type: String, required: false },
    userType: { type: String, required: true, enum: ["target_sample", "non_target_sample"], default: "non_target_sample" },
    ageGroup: { type: String, required: true },
    avatarId: { type: String, required: false },
    demographics: { type: DemographicsSchema, required: false },
    scenarioOrder: { type: [String], required: true, default: [] },
    startedAt: { type: Date, required: true, default: Date.now },
    lastUpdatedAt: { type: Date, required: true, default: Date.now },
    completedLevels: { type: [String], required: true, default: [] },
    totalScore: { type: Number, required: true, default: 0 },
    branchTotals: {
      type: Schema.Types.Mixed,
      required: true,
      default: { perceiving: 0, using: 0, understanding: 0, managing: 0 }
    },
    createdAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date, required: false }
  },
  { collection: "sessions" }
);

export const UserSession =
  (mongoose.models.UserSession as mongoose.Model<IUserSession>) ||
  mongoose.model<IUserSession>("UserSession", UserSessionSchema);
