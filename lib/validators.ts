import { z } from "zod";

export const AgeGroupSchema = z.enum(["17-21", "18-21", "22-24", "25-27", "non-target"]);

export const CreateSessionSchema = z.object({
  name: z.string().max(200).optional(),
  age: z.coerce.number().int().min(0).max(120).optional(),
  gender: z.string().max(120).optional(),
  education: z.string().max(120).optional(),
  is_anonymous: z.boolean().optional(),
  ageGroup: AgeGroupSchema.optional(),
  anonymousUserId: z.string().min(8).optional(),
  avatarId: z.string().min(1).optional(),
  demographics: z
    .object({
      participantName: z.string().min(1).max(200).optional(),
      ageYears: z.coerce.number().int().min(0).max(120).optional(),
      gender: z.string().max(120).optional(),
      residenceArea: z.enum(["Urban", "Rural"]).optional(),
      educationLevel: z.string().min(1).max(120).optional(),
      city: z.string().min(1).max(120).optional(),
      state: z.string().min(1).max(120).optional(),
      country: z.string().min(1).max(120).optional(),
      primaryLanguage: z.string().min(1).max(120).optional(),
      institutionType: z.string().min(1).max(120).optional(),
      socioeconomicStatus: z.string().min(1).max(120).optional(),
      additionalNotes: z.string().max(600).optional()
    })
    .optional()
});

export const UpdateSessionSchema = z.object({
  sessionId: z.string().min(8),
  avatarId: z.string().min(1).optional(),
  demographics: z
    .object({
      participantName: z.string().min(1).max(200).optional(),
      ageYears: z.coerce.number().int().min(0).max(120).optional(),
      gender: z.string().max(120).optional(),
      residenceArea: z.enum(["Urban", "Rural"]).optional(),
      educationLevel: z.string().min(1).max(120).optional(),
      city: z.string().min(1).max(120).optional(),
      state: z.string().min(1).max(120).optional(),
      country: z.string().min(1).max(120).optional(),
      primaryLanguage: z.string().min(1).max(120).optional(),
      institutionType: z.string().min(1).max(120).optional(),
      socioeconomicStatus: z.string().min(1).max(120).optional(),
      additionalNotes: z.string().max(600).optional()
    })
    .optional()
});

export const SaveResponseSchema = z.object({
  anonymousUserId: z.string().min(8),
  sessionId: z.string().min(8),
  levelId: z.string().min(1),
  selectedOptionId: z.string().min(1),
  latencyMs: z.number().int().min(0).max(1000 * 60 * 60),
  changedSelectionCount: z.number().int().min(0).max(50)
});

export const GenerateReportSchema = z.object({
  anonymousUserId: z.string().min(8),
  sessionId: z.string().min(8)
});
