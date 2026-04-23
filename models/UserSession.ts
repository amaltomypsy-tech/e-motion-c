import mongoose, { Schema } from "mongoose";

export type AgeGroup = "18-21" | "22-24" | "25-27";

export interface IUserSession {
  anonymousUserId: string;
  sessionId: string;
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
  createdAt: Date;
  completedAt?: Date;
}

const DemographicsSchema = new Schema(
  {
    participantName: { type: String, required: false },
    ageYears: { type: Number, required: false, min: 18, max: 27 },
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
    ageGroup: { type: String, required: true },
    avatarId: { type: String, required: false },
    demographics: { type: DemographicsSchema, required: false },
    scenarioOrder: { type: [String], required: true, default: [] },
    createdAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date, required: false }
  },
  { collection: "user_sessions" }
);

export const UserSession =
  (mongoose.models.UserSession as mongoose.Model<IUserSession>) ||
  mongoose.model<IUserSession>("UserSession", UserSessionSchema);
