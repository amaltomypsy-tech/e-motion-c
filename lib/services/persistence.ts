import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

import { connectToDatabase } from "@/lib/db";
import { UserSession } from "@/models/UserSession";
import { ScenarioResponse } from "@/models/ScenarioResponse";
import { AssessmentReport } from "@/models/AssessmentReport";

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
  createdAt: Date;
  completedAt?: Date;
};

export type ResponseRecord = {
  anonymousUserId: string;
  sessionId: string;
  levelId: string;
  selectedOptionId: string;
  branchPrimary: EIPrimaryBranch;
  itemScore: 0 | 1 | 2 | 3;
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
  const dir = path.join(process.cwd(), "data", "scenarios");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const order: string[] = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(dir, f), "utf8");
    const parsed = JSON.parse(raw) as ScenarioLevel;
    order.push(parsed.levelId);
  }
  return order;
}

export async function loadScenario(levelId: string): Promise<ScenarioLevel | null> {
  const dir = path.join(process.cwd(), "data", "scenarios");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const raw = await fs.readFile(path.join(dir, f), "utf8");
    const parsed = JSON.parse(raw) as ScenarioLevel;
    if (parsed.levelId === levelId) return parsed;
  }
  return null;
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
      scenarioOrder
    });
    return {
      anonymousUserId: session.anonymousUserId,
      sessionId: session.sessionId,
      ageGroup: session.ageGroup as AgeGroup,
      avatarId: session.avatarId ?? undefined,
      demographics: session.demographics ?? undefined,
      scenarioOrder: session.scenarioOrder,
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
  anonymousUserId: string;
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
      previous.reduce((sum, r) => sum + (r.itemScore ?? 0), 0) + scored.itemScore;

    const branchRunningScore = initBranchScoreMap();
    const branchScores = computeBranchScores([
      ...previous.map((p) => ({ branchPrimary: p.branchPrimary, itemScore: p.itemScore })),
      { branchPrimary: scenario.branchPrimary, itemScore: scored.itemScore }
    ]);
    for (const [k, v] of Object.entries(branchScores)) (branchRunningScore as any)[k] = v;

    const doc = await ScenarioResponse.create({
      anonymousUserId: input.anonymousUserId,
      sessionId: input.sessionId,
      levelId: input.levelId,
      selectedOptionId: input.selectedOptionId,
      branchPrimary: scenario.branchPrimary,
      itemScore: scored.itemScore,
      eiLevel: scored.eiLevel,
      rationaleSnapshot: scored.rationale,
      latencyMs: input.latencyMs,
      changedSelectionCount: input.changedSelectionCount,
      responseOrder,
      cumulativeRawScore,
      branchRunningScore
    });

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
  const cumulativeRawScore = prev.reduce((sum, r) => sum + (r.itemScore ?? 0), 0) + scored.itemScore;

  const branchRunningScore = initBranchScoreMap();
  const branchScores = computeBranchScores([
    ...prev.map((p) => ({ branchPrimary: p.branchPrimary, itemScore: p.itemScore })),
    { branchPrimary: scenario.branchPrimary, itemScore: scored.itemScore }
  ]);
  for (const [k, v] of Object.entries(branchScores)) (branchRunningScore as any)[k] = v;

  const rec: ResponseRecord = {
    anonymousUserId: input.anonymousUserId,
    sessionId: input.sessionId,
    levelId: input.levelId,
    selectedOptionId: input.selectedOptionId,
    branchPrimary: scenario.branchPrimary,
    itemScore: scored.itemScore,
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
