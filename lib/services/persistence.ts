import { v4 as uuidv4 } from "uuid";

import { connectToDatabase } from "@/lib/db";
import { UserSession } from "@/models/UserSession";
import { ScenarioResponse } from "@/models/ScenarioResponse";
import { AssessmentReport } from "@/models/AssessmentReport";
import scenarios from "@/data/scenarios.js";

import type { ScenarioLevel } from "@/types/scenario";
import type { AssessmentReportView } from "@/types/report";
import type { EIPrimaryBranch } from "@/types/scenario";

import {
  computeAdaptiveChangeMetric,
  computeAverageLatency,
  computeBranchScores,
  computeConsistencyIndex,
  getMaxRawScore,
  initBranchScoreMap,
  normalizeScore,
  scoreSelectedOption
} from "@/lib/scoringEngine";
import { buildBranchScoreSummaries, buildInterpretation } from "@/lib/reportEngine";

export type AgeGroup = "18-21" | "22-24" | "25-27";

export type Demographics = {
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

export type SessionRecord = {
  anonymousUserId: string;
  sessionId: string;
  ageGroup: AgeGroup;
  avatarId?: string;
  demographics?: Demographics;
  scenarioOrder: string[];
  startedAt?: Date;
  lastUpdatedAt?: Date;
  completedLevels?: string[];
  totalScore?: number;
  branchTotals?: Record<"perceiving" | "using" | "understanding" | "managing", number>;
  createdAt: Date;
  completedAt?: Date;
};

export type ResponseRecord = {
  anonymousUserId: string;
  sessionId: string;
  levelId: string;
  scenarioTitle?: string;
  branch?: string;
  selectedOptionId: string;
  selectedOptionText?: string;
  score?: number;
  branchScore?: Record<string, number>;
  responseTimeMs?: number;
  createdAt?: Date;
  branchPrimary: EIPrimaryBranch;
  itemScore: 0 | 1 | 2 | 3 | 4;
  eiLevel: "high" | "moderate" | "low" | "very_low";
  rationaleSnapshot?: string;
  latencyMs: number;
  changedSelectionCount: number;
  responseOrder: number;
  timestamp: Date;
  cumulativeRawScore: number;
  branchRunningScore: Record<string, number>;
};

function hasMongo() {
  return Boolean(process.env.MONGODB_URI);
}

// -------------------------
// Scenario helpers
// -------------------------
export async function loadScenarioOrder(): Promise<string[]> {
  return scenarios.map((scenario: any) => scenario.levelId);
}

export async function loadScenario(levelId: string): Promise<ScenarioLevel | null> {
  return (scenarios.find((scenario: any) => scenario.levelId === levelId || scenario.id === levelId) ??
    null) as ScenarioLevel | null;
}

// -------------------------
// In-memory fallback (dev)
// -------------------------
type MemoryStore = {
  sessions: Map<string, SessionRecord>;
  responsesBySession: Map<string, ResponseRecord[]>;
  reportsBySession: Map<string, AssessmentReportView>;
};

declare global {
  // eslint-disable-next-line no-var
  var __eiMemoryStore: MemoryStore | undefined;
}

function mem(): MemoryStore {
  if (!global.__eiMemoryStore) {
    global.__eiMemoryStore = {
      sessions: new Map(),
      responsesBySession: new Map(),
      reportsBySession: new Map()
    };
  }
  return global.__eiMemoryStore;
}

// -------------------------
// Public persistence API
// -------------------------
export async function createSession(input: {
  ageGroup: AgeGroup;
  anonymousUserId?: string;
  avatarId?: string;
  demographics?: Demographics;
}): Promise<SessionRecord> {
  const anonymousUserId = input.anonymousUserId ?? uuidv4();
  const sessionId = uuidv4();
  const scenarioOrder = await loadScenarioOrder();

  if (hasMongo()) {
    await connectToDatabase();
    const session = await UserSession.create({
      anonymousUserId,
      sessionId,
      ageGroup: input.ageGroup,
      avatarId: input.avatarId,
      demographics: input.demographics,
      scenarioOrder,
      startedAt: new Date(),
      lastUpdatedAt: new Date(),
      completedLevels: [],
      totalScore: 0,
      branchTotals: { perceiving: 0, using: 0, understanding: 0, managing: 0 }
    });
    return {
      anonymousUserId: session.anonymousUserId,
      sessionId: session.sessionId,
      ageGroup: session.ageGroup as AgeGroup,
      avatarId: session.avatarId ?? undefined,
      demographics: session.demographics ?? undefined,
      scenarioOrder: session.scenarioOrder,
      startedAt: session.startedAt,
      lastUpdatedAt: session.lastUpdatedAt,
      completedLevels: session.completedLevels,
      totalScore: session.totalScore,
      branchTotals: session.branchTotals,
      createdAt: session.createdAt,
      completedAt: session.completedAt ?? undefined
    };
  }

  const record: SessionRecord = {
    anonymousUserId,
    sessionId,
    ageGroup: input.ageGroup,
    avatarId: input.avatarId,
    demographics: input.demographics,
    scenarioOrder,
    startedAt: new Date(),
    lastUpdatedAt: new Date(),
    completedLevels: [],
    totalScore: 0,
    branchTotals: { perceiving: 0, using: 0, understanding: 0, managing: 0 },
    createdAt: new Date()
  };
  mem().sessions.set(sessionId, record);
  return record;
}

export async function updateSession(input: {
  sessionId: string;
  avatarId?: string;
  demographics?: Demographics;
}): Promise<boolean> {
  if (hasMongo()) {
    await connectToDatabase();
    const updated = await UserSession.findOneAndUpdate(
      { sessionId: input.sessionId },
      {
        $set: {
          ...(input.avatarId ? { avatarId: input.avatarId } : {}),
          ...(input.demographics ? { demographics: input.demographics } : {})
        }
      },
      { new: true }
    ).lean();
    return Boolean(updated);
  }

  const s = mem().sessions.get(input.sessionId);
  if (!s) return false;
  if (input.avatarId) s.avatarId = input.avatarId;
  if (input.demographics) s.demographics = input.demographics;
  mem().sessions.set(input.sessionId, s);
  return true;
}

export async function getSession(sessionId: string): Promise<SessionRecord | null> {
  if (hasMongo()) {
    await connectToDatabase();
    const s = await UserSession.findOne({ sessionId }).lean();
    if (!s) return null;
    return {
      anonymousUserId: s.anonymousUserId,
      sessionId: s.sessionId,
      ageGroup: s.ageGroup as AgeGroup,
      avatarId: s.avatarId ?? undefined,
      demographics: s.demographics ?? undefined,
      scenarioOrder: s.scenarioOrder ?? [],
      startedAt: s.startedAt,
      lastUpdatedAt: s.lastUpdatedAt,
      completedLevels: s.completedLevels,
      totalScore: s.totalScore,
      branchTotals: s.branchTotals,
      createdAt: s.createdAt,
      completedAt: s.completedAt ?? undefined
    };
  }

  return mem().sessions.get(sessionId) ?? null;
}

export async function listSessions(filter?: { sessionId?: string }) {
  if (hasMongo()) {
    await connectToDatabase();
    const query = filter?.sessionId ? { sessionId: filter.sessionId } : {};
    return await UserSession.find(query).sort({ createdAt: -1 }).lean();
  }

  if (filter?.sessionId) {
    const s = mem().sessions.get(filter.sessionId);
    return s ? [s] : [];
  }
  return [...mem().sessions.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function saveResponse(input: {
  anonymousUserId?: string;
  sessionId: string;
  levelId: string;
  selectedOptionId: string;
  latencyMs: number;
  changedSelectionCount: number;
}): Promise<ResponseRecord> {
  const session = await getSession(input.sessionId);
  if (!session) throw new Error("session_not_found");

  const scenario = await loadScenario(input.levelId);
  if (!scenario) throw new Error("scenario_not_found");

  const scored = scoreSelectedOption(scenario, input.selectedOptionId);
  const option = scenario.options.find((candidate) => candidate.optionId === input.selectedOptionId || candidate.id === input.selectedOptionId);
  if (!option) throw new Error("option_not_found");
  const selectedOptionText = option.text ?? option.description ?? option.label;
  const itemScore = Math.min(4, option.score ?? scored.itemScore) as 0 | 1 | 2 | 3 | 4;
  const branchScore = option.branchScore ?? {
    perceiving: scenario.branchPrimary === "Perceiving Emotions" ? itemScore : 0,
    using: scenario.branchPrimary === "Using Emotions to Facilitate Thinking" ? itemScore : 0,
    understanding: scenario.branchPrimary === "Understanding Emotions" ? itemScore : 0,
    managing: scenario.branchPrimary === "Managing Emotions" ? itemScore : 0
  };

  if (hasMongo()) {
    await connectToDatabase();
    const already = await ScenarioResponse.findOne({ sessionId: input.sessionId, levelId: input.levelId })
      .select({ _id: 1 })
      .lean();
    if (already) throw new Error("already_answered");

    const previous = await ScenarioResponse.find({ sessionId: input.sessionId })
      .sort({ responseOrder: 1 })
      .select({ branchPrimary: 1, itemScore: 1, responseOrder: 1, _id: 0 })
      .lean();

    const responseOrder = previous.length + 1;
    const cumulativeRawScore =
      previous.reduce((sum, r) => sum + (r.itemScore ?? 0), 0) + itemScore;

    const branchRunningScore = initBranchScoreMap();
    const branchScores = computeBranchScores([
      ...previous.map((p) => ({ branchPrimary: p.branchPrimary, itemScore: p.itemScore })),
      { branchPrimary: scenario.branchPrimary, itemScore }
    ]);
    for (const [k, v] of Object.entries(branchScores)) (branchRunningScore as any)[k] = v;

    const doc = await ScenarioResponse.create({
      anonymousUserId: input.anonymousUserId ?? session.anonymousUserId,
      sessionId: input.sessionId,
      levelId: input.levelId,
      scenarioTitle: scenario.title,
      branch: scenario.branch ?? scenario.branchPrimary,
      selectedOptionId: input.selectedOptionId,
      selectedOptionText,
      score: itemScore,
      branchScore,
      responseTimeMs: input.latencyMs,
      createdAt: new Date(),
      branchPrimary: scenario.branchPrimary,
      itemScore,
      eiLevel: scored.eiLevel,
      rationaleSnapshot: scored.rationale,
      latencyMs: input.latencyMs,
      changedSelectionCount: input.changedSelectionCount,
      responseOrder,
      cumulativeRawScore,
      branchRunningScore
    });

    const previousSession = await UserSession.findOne({ sessionId: input.sessionId })
      .select({ completedLevels: 1, totalScore: 1, branchTotals: 1 })
      .lean();
    const completedLevels = Array.from(
      new Set([...(previousSession?.completedLevels ?? []), input.levelId])
    );
    const currentTotals = previousSession?.branchTotals ?? {
      perceiving: 0,
      using: 0,
      understanding: 0,
      managing: 0
    };
    await UserSession.updateOne(
      { sessionId: input.sessionId },
      {
        $set: {
          lastUpdatedAt: new Date(),
          completedLevels,
          totalScore: (previousSession?.totalScore ?? 0) + itemScore,
          branchTotals: {
            perceiving: (currentTotals.perceiving ?? 0) + (branchScore.perceiving ?? 0),
            using: (currentTotals.using ?? 0) + (branchScore.using ?? 0),
            understanding: (currentTotals.understanding ?? 0) + (branchScore.understanding ?? 0),
            managing: (currentTotals.managing ?? 0) + (branchScore.managing ?? 0)
          }
        }
      }
    );

    if (responseOrder >= (session.scenarioOrder?.length ?? 0) && !session.completedAt) {
      await UserSession.updateOne({ sessionId: input.sessionId }, { $set: { completedAt: new Date() } });
    }

    return doc.toObject() as ResponseRecord;
  }

  const store = mem();
  const existing = (store.responsesBySession.get(input.sessionId) ?? []).find((r) => r.levelId === input.levelId);
  if (existing) throw new Error("already_answered");

  const prev = store.responsesBySession.get(input.sessionId) ?? [];
  const responseOrder = prev.length + 1;
  const cumulativeRawScore = prev.reduce((sum, r) => sum + (r.itemScore ?? 0), 0) + itemScore;

  const branchRunningScore = initBranchScoreMap();
  const branchScores = computeBranchScores([
    ...prev.map((p) => ({ branchPrimary: p.branchPrimary, itemScore: p.itemScore })),
    { branchPrimary: scenario.branchPrimary, itemScore }
  ]);
  for (const [k, v] of Object.entries(branchScores)) (branchRunningScore as any)[k] = v;

  const rec: ResponseRecord = {
    anonymousUserId: input.anonymousUserId ?? session.anonymousUserId,
    sessionId: input.sessionId,
    levelId: input.levelId,
    scenarioTitle: scenario.title,
    branch: scenario.branch ?? scenario.branchPrimary,
    selectedOptionId: input.selectedOptionId,
    selectedOptionText,
    score: itemScore,
    branchScore,
    responseTimeMs: input.latencyMs,
    createdAt: new Date(),
    branchPrimary: scenario.branchPrimary,
    itemScore,
    eiLevel: scored.eiLevel,
    rationaleSnapshot: scored.rationale,
    latencyMs: input.latencyMs,
    changedSelectionCount: input.changedSelectionCount,
    responseOrder,
    timestamp: new Date(),
    cumulativeRawScore,
    branchRunningScore
  };

  const next = [...prev, rec];
  store.responsesBySession.set(input.sessionId, next);
  session.completedLevels = Array.from(new Set([...(session.completedLevels ?? []), input.levelId]));
  session.totalScore = (session.totalScore ?? 0) + itemScore;
  session.branchTotals = {
    perceiving: (session.branchTotals?.perceiving ?? 0) + (branchScore.perceiving ?? 0),
    using: (session.branchTotals?.using ?? 0) + (branchScore.using ?? 0),
    understanding: (session.branchTotals?.understanding ?? 0) + (branchScore.understanding ?? 0),
    managing: (session.branchTotals?.managing ?? 0) + (branchScore.managing ?? 0)
  };
  session.lastUpdatedAt = new Date();

  if (responseOrder >= (session.scenarioOrder?.length ?? 0) && !session.completedAt) {
    session.completedAt = new Date();
    store.sessions.set(input.sessionId, session);
  }

  return rec;
}

export async function listResponses(filter: { sessionId: string }) {
  if (hasMongo()) {
    await connectToDatabase();
    return await ScenarioResponse.find({ sessionId: filter.sessionId })
      .sort({ responseOrder: 1 })
      .lean();
  }
  return mem().responsesBySession.get(filter.sessionId) ?? [];
}

export async function getOrCreateReport(input: {
  anonymousUserId: string;
  sessionId: string;
}): Promise<AssessmentReportView> {
  const session = await getSession(input.sessionId);
  if (!session || session.anonymousUserId !== input.anonymousUserId) {
    throw new Error("session_not_found");
  }

  if (hasMongo()) {
    await connectToDatabase();
    const existing = await AssessmentReport.findOne({ sessionId: input.sessionId }).lean();
    if (existing) return existingToView(existing);
  } else {
    const existing = mem().reportsBySession.get(input.sessionId);
    if (existing) return existing;
  }

  const responses = await listResponses({ sessionId: input.sessionId });
  const branchRawScores = computeBranchScores(
    responses.map((r: any) => ({ branchPrimary: r.branchPrimary, itemScore: r.itemScore }))
  ) as Record<EIPrimaryBranch, number>;

  const levelCount = session.scenarioOrder?.length ?? responses.length;
  const rawScore = responses.reduce((sum: number, r: any) => sum + (r.itemScore ?? 0), 0);
  const maxRawScore = getMaxRawScore(levelCount);
  const overallNormalizedScore = normalizeScore(rawScore, maxRawScore, 100);

  const branchMaxRaw: Record<EIPrimaryBranch, number> = initBranchScoreMap();
  const counts = initBranchScoreMap();
  for (const r of responses as any[]) {
    const b = r.branchPrimary as EIPrimaryBranch;
    counts[b] += 1;
  }
  for (const b of Object.keys(counts) as EIPrimaryBranch[]) branchMaxRaw[b] = counts[b] * 3;

  const branchScores = buildBranchScoreSummaries({ branchRawScores, branchMaxRaw });
  const responseConsistencyIndex = computeConsistencyIndex(responses as any);
  const averageDecisionLatencyMs = computeAverageLatency(responses as any);
  const adaptiveChangeMetric = computeAdaptiveChangeMetric(responses as any);

  const interp = buildInterpretation({
    overallNormalizedScore,
    branchScores,
    responseConsistencyIndex,
    averageDecisionLatencyMs,
    adaptiveChangeMetric
  });

  const view: AssessmentReportView = {
    anonymousUserId: input.anonymousUserId,
    sessionId: input.sessionId,
    createdAt: new Date().toISOString(),
    rawScore,
    maxRawScore,
    overallNormalizedScore,
    branchScores,
    responseConsistencyIndex,
    averageDecisionLatencyMs,
    adaptiveChangeMetric,
    strengths: interp.strengths,
    growthAreas: interp.growthAreas,
    behavioralInterpretation: interp.behavioralInterpretation,
    responsePatternInsights: interp.responsePatternInsights
  };

  if (hasMongo()) {
    const saved = await AssessmentReport.create({
      anonymousUserId: input.anonymousUserId,
      sessionId: input.sessionId,
      rawScore,
      maxRawScore,
      overallNormalizedScore,
      branchScores,
      responseConsistencyIndex,
      averageDecisionLatencyMs,
      adaptiveChangeMetric,
      strengths: interp.strengths,
      growthAreas: interp.growthAreas,
      behavioralInterpretation: interp.behavioralInterpretation,
      responsePatternInsights: interp.responsePatternInsights
    });
    return existingToView(saved.toObject());
  }

  mem().reportsBySession.set(input.sessionId, view);
  return view;
}

export async function listReports(filter?: { sessionId?: string }) {
  if (hasMongo()) {
    await connectToDatabase();
    const query = filter?.sessionId ? { sessionId: filter.sessionId } : {};
    return await AssessmentReport.find(query).sort({ createdAt: -1 }).lean();
  }

  if (filter?.sessionId) {
    const rep = mem().reportsBySession.get(filter.sessionId);
    return rep ? [rep] : [];
  }
  return [...mem().reportsBySession.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function isMongoEnabled() {
  return hasMongo();
}

function existingToView(existing: any): AssessmentReportView {
  return {
    anonymousUserId: existing.anonymousUserId,
    sessionId: existing.sessionId,
    createdAt: new Date(existing.createdAt).toISOString(),
    rawScore: existing.rawScore,
    maxRawScore: existing.maxRawScore,
    overallNormalizedScore: existing.overallNormalizedScore,
    branchScores: existing.branchScores,
    responseConsistencyIndex: existing.responseConsistencyIndex,
    averageDecisionLatencyMs: existing.averageDecisionLatencyMs,
    adaptiveChangeMetric: existing.adaptiveChangeMetric,
    strengths: existing.strengths,
    growthAreas: existing.growthAreas,
    behavioralInterpretation: existing.behavioralInterpretation,
    responsePatternInsights: existing.responsePatternInsights
  };
}
