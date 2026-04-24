import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type { EIPrimaryBranch } from "@/types/scenario";
import { EI_BRANCHES } from "@/lib/scoringEngine";
import {
  isMongoEnabled,
  listReports,
  listResponses,
  listSessions
} from "@/lib/services/persistence";

export const runtime = "nodejs";

function requireExportKey(req: Request) {
  const key = process.env.EXPORT_KEY;
  if (!key) return { ok: true as const }; // local prototype convenience
  const provided = req.headers.get("x-export-key");
  if (provided && provided === key) return { ok: true as const };
  return { ok: false as const, message: "Missing/invalid export key." };
}

function safe(v: unknown) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export async function GET(req: Request) {
  const guard = requireExportKey(req);
  if (!guard.ok) {
    return NextResponse.json({ error: "unauthorized", message: guard.message }, { status: 401 });
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");

  const sessions = await listSessions(sessionId ? { sessionId } : undefined);

  const responses = sessionId
    ? await listResponses({ sessionId })
    : // If no sessionId provided, export responses for all sessions we have.
      (
        await Promise.all(
          (sessions as any[]).map((s) => listResponses({ sessionId: s.sessionId }))
        )
      ).flat();

  const reports = await listReports(sessionId ? { sessionId } : undefined);

  const wb = new ExcelJS.Workbook();
  wb.creator = "EI Story Assessment";
  wb.created = new Date();

  // Sheet 1: Sessions / Demographics
  const wsSessions = wb.addWorksheet("Sessions");
  wsSessions.columns = [
    { header: "sessionId", key: "sessionId", width: 38 },
    { header: "anonymousUserId", key: "anonymousUserId", width: 38 },
    { header: "ageGroup", key: "ageGroup", width: 10 },
    { header: "avatarId", key: "avatarId", width: 14 },
    { header: "startedAt", key: "startedAt", width: 22 },
    { header: "lastUpdatedAt", key: "lastUpdatedAt", width: 22 },
    { header: "createdAt", key: "createdAt", width: 22 },
    { header: "completedAt", key: "completedAt", width: 22 },
    { header: "completedLevels", key: "completedLevels", width: 16 },
    { header: "totalScore", key: "totalScore", width: 12 },
    { header: "branchTotal_perceiving", key: "branchTotal_perceiving", width: 22 },
    { header: "branchTotal_using", key: "branchTotal_using", width: 18 },
    { header: "branchTotal_understanding", key: "branchTotal_understanding", width: 24 },
    { header: "branchTotal_managing", key: "branchTotal_managing", width: 20 },
    { header: "participantName", key: "participantName", width: 22 },
    { header: "ageYears", key: "ageYears", width: 10 },
    { header: "gender", key: "gender", width: 14 },
    { header: "residenceArea", key: "residenceArea", width: 14 },
    { header: "educationLevel", key: "educationLevel", width: 18 },
    { header: "city", key: "city", width: 18 },
    { header: "state", key: "state", width: 18 },
    { header: "country", key: "country", width: 14 },
    { header: "primaryLanguage", key: "primaryLanguage", width: 18 },
    { header: "institutionType", key: "institutionType", width: 18 },
    { header: "socioeconomicStatus", key: "socioeconomicStatus", width: 20 },
    { header: "additionalNotes", key: "additionalNotes", width: 34 }
  ];

  for (const s of sessions) {
    wsSessions.addRow({
      sessionId: safe(s.sessionId),
      anonymousUserId: safe(s.anonymousUserId),
      ageGroup: safe(s.ageGroup),
      avatarId: safe(s.avatarId),
      startedAt: s.startedAt ? new Date(s.startedAt).toISOString() : "",
      lastUpdatedAt: s.lastUpdatedAt ? new Date(s.lastUpdatedAt).toISOString() : "",
      createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : "",
      completedAt: s.completedAt ? new Date(s.completedAt).toISOString() : "",
      completedLevels: s.completedLevels?.length ?? "",
      totalScore: s.totalScore ?? "",
      branchTotal_perceiving: s.branchTotals?.perceiving ?? "",
      branchTotal_using: s.branchTotals?.using ?? "",
      branchTotal_understanding: s.branchTotals?.understanding ?? "",
      branchTotal_managing: s.branchTotals?.managing ?? "",
      participantName: safe(s.demographics?.participantName),
      ageYears: s.demographics?.ageYears ?? "",
      gender: safe(s.demographics?.gender),
      residenceArea: safe(s.demographics?.residenceArea),
      educationLevel: safe(s.demographics?.educationLevel),
      city: safe(s.demographics?.city),
      state: safe(s.demographics?.state),
      country: safe(s.demographics?.country),
      primaryLanguage: safe(s.demographics?.primaryLanguage),
      institutionType: safe(s.demographics?.institutionType),
      socioeconomicStatus: safe(s.demographics?.socioeconomicStatus),
      additionalNotes: safe(s.demographics?.additionalNotes)
    });
  }

  // Sheet 2: Responses (item-level)
  const wsResponses = wb.addWorksheet("Responses");
  wsResponses.columns = [
    { header: "sessionId", key: "sessionId", width: 38 },
    { header: "anonymousUserId", key: "anonymousUserId", width: 38 },
    { header: "responseOrder", key: "responseOrder", width: 12 },
    { header: "levelId", key: "levelId", width: 14 },
    { header: "scenarioTitle", key: "scenarioTitle", width: 28 },
    { header: "branch", key: "branch", width: 34 },
    { header: "branchPrimary", key: "branchPrimary", width: 34 },
    { header: "selectedOptionId", key: "selectedOptionId", width: 14 },
    { header: "selectedOptionText", key: "selectedOptionText", width: 62 },
    { header: "score", key: "score", width: 10 },
    { header: "itemScore_legacy", key: "itemScore", width: 14 },
    { header: "branchScore_perceiving", key: "branchScore_perceiving", width: 22 },
    { header: "branchScore_using", key: "branchScore_using", width: 18 },
    { header: "branchScore_understanding", key: "branchScore_understanding", width: 24 },
    { header: "branchScore_managing", key: "branchScore_managing", width: 20 },
    { header: "eiLevel", key: "eiLevel", width: 12 },
    { header: "responseTimeMs", key: "responseTimeMs", width: 16 },
    { header: "latencyMs_legacy", key: "latencyMs", width: 16 },
    { header: "changedSelectionCount", key: "changedSelectionCount", width: 20 },
    { header: "createdAt", key: "createdAt", width: 22 },
    { header: "timestamp_legacy", key: "timestamp", width: 22 },
    { header: "cumulativeRawScore", key: "cumulativeRawScore", width: 18 },
    { header: "rationaleSnapshot", key: "rationaleSnapshot", width: 46 }
  ];

  for (const r of responses) {
    const branchScore = r.branchScore ?? {};
    wsResponses.addRow({
      sessionId: safe(r.sessionId),
      anonymousUserId: safe(r.anonymousUserId),
      responseOrder: r.responseOrder ?? "",
      levelId: safe(r.levelId),
      scenarioTitle: safe(r.scenarioTitle),
      branch: safe(r.branch ?? r.branchPrimary),
      branchPrimary: safe(r.branchPrimary),
      selectedOptionId: safe(r.selectedOptionId),
      selectedOptionText: safe(r.selectedOptionText),
      score: r.score ?? r.itemScore ?? "",
      itemScore: r.itemScore ?? "",
      branchScore_perceiving: branchScore.perceiving ?? "",
      branchScore_using: branchScore.using ?? "",
      branchScore_understanding: branchScore.understanding ?? "",
      branchScore_managing: branchScore.managing ?? "",
      eiLevel: safe(r.eiLevel),
      responseTimeMs: r.responseTimeMs ?? r.latencyMs ?? "",
      latencyMs: r.latencyMs ?? "",
      changedSelectionCount: r.changedSelectionCount ?? "",
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : "",
      cumulativeRawScore: r.cumulativeRawScore ?? "",
      rationaleSnapshot: safe(r.rationaleSnapshot)
    });
  }

  // Sheet 3: Reports (score matrix / summary)
  const wsReports = wb.addWorksheet("Reports");
  const reportColumns: Array<Partial<ExcelJS.Column>> = [
    { header: "sessionId", key: "sessionId", width: 38 },
    { header: "anonymousUserId", key: "anonymousUserId", width: 38 },
    { header: "createdAt", key: "createdAt", width: 22 },
    { header: "rawScore", key: "rawScore", width: 10 },
    { header: "maxRawScore", key: "maxRawScore", width: 12 },
    { header: "overallNormalizedScore", key: "overallNormalizedScore", width: 22 },
    { header: "responseConsistencyIndex", key: "responseConsistencyIndex", width: 22 },
    { header: "averageDecisionLatencyMs", key: "averageDecisionLatencyMs", width: 22 },
    { header: "adaptiveChangeMetric", key: "adaptiveChangeMetric", width: 18 }
  ];
  for (const b of EI_BRANCHES) {
    reportColumns.push({ header: `${b} raw`, key: `${b}__raw`, width: 16 });
    reportColumns.push({ header: `${b} max`, key: `${b}__max`, width: 16 });
    reportColumns.push({ header: `${b} normalized`, key: `${b}__norm`, width: 18 });
  }
  wsReports.columns = reportColumns;

  const branchKey = (b: EIPrimaryBranch, suffix: string) => `${b}__${suffix}`;

  for (const rep of reports) {
    const row: Record<string, any> = {
      sessionId: safe(rep.sessionId),
      anonymousUserId: safe(rep.anonymousUserId),
      createdAt: rep.createdAt ? new Date(rep.createdAt).toISOString() : "",
      rawScore: rep.rawScore ?? "",
      maxRawScore: rep.maxRawScore ?? "",
      overallNormalizedScore: rep.overallNormalizedScore ?? "",
      responseConsistencyIndex: rep.responseConsistencyIndex ?? "",
      averageDecisionLatencyMs: rep.averageDecisionLatencyMs ?? "",
      adaptiveChangeMetric: rep.adaptiveChangeMetric ?? ""
    };

    for (const b of EI_BRANCHES) {
      const found = (rep.branchScores ?? []).find((x: any) => x.branch === b);
      row[branchKey(b, "raw")] = found?.raw ?? "";
      row[branchKey(b, "max")] = found?.max ?? "";
      row[branchKey(b, "norm")] = found?.normalized ?? "";
    }

    wsReports.addRow(row);
  }

  // Make header rows visually distinct.
  for (const ws of [wsSessions, wsResponses, wsReports]) {
    ws.getRow(1).font = { bold: true };
    ws.views = [{ state: "frozen", ySplit: 1 }];
  }

  const buffer = (await wb.xlsx.writeBuffer()) as ArrayBuffer;
  const asUint8 = new Uint8Array(buffer);

  return new Response(asUint8, {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="ei_assessment_export${sessionId ? `_${sessionId}` : ""}_${isMongoEnabled() ? "mongo" : "memory"}.xlsx"`
    }
  });
}
