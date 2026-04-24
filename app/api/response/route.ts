import { NextResponse } from "next/server";
import { isMongoEnabled, getSession, listResponses, saveResponse } from "@/lib/services/persistence";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const responseTimeMs = Number(body.responseTimeMs ?? body.latencyMs ?? 0);

  if (!body.sessionId || !body.levelId || !body.selectedOptionId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const rec = await saveResponse({
      anonymousUserId: body.anonymousUserId,
      sessionId: body.sessionId,
      levelId: body.levelId,
      selectedOptionId: body.selectedOptionId,
      latencyMs: Math.max(0, Math.round(responseTimeMs)),
      changedSelectionCount: Number(body.changedSelectionCount ?? 0)
    });

    return NextResponse.json({
      sessionId: rec.sessionId,
      levelId: rec.levelId,
      scenarioTitle: rec.scenarioTitle,
      branch: rec.branch ?? rec.branchPrimary,
      selectedOptionId: rec.selectedOptionId,
      selectedOptionText: rec.selectedOptionText,
      score: rec.score ?? rec.itemScore,
      branchScore: rec.branchScore,
      responseTimeMs: rec.responseTimeMs ?? rec.latencyMs,
      createdAt: (rec.createdAt ?? rec.timestamp).toISOString(),
      persistence: isMongoEnabled() ? "mongo" : "memory"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "save_failed";
    if (message === "scenario_not_found") return NextResponse.json({ error: message }, { status: 404 });
    if (message === "session_not_found") return NextResponse.json({ error: message }, { status: 404 });
    if (message === "already_answered") return NextResponse.json({ error: message }, { status: 409 });
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "missing_sessionId" }, { status: 400 });

  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "session_not_found" }, { status: 404 });

  const responses = await listResponses({ sessionId });
  return NextResponse.json({
    session: {
      sessionId: session.sessionId,
      startedAt: session.startedAt ?? session.createdAt,
      lastUpdatedAt: session.lastUpdatedAt ?? session.completedAt ?? session.createdAt,
      completedLevels: session.completedLevels ?? responses.map((response: any) => response.levelId),
      totalScore:
        session.totalScore ?? responses.reduce((sum: number, response: any) => sum + (response.score ?? response.itemScore ?? 0), 0),
      branchTotals:
        session.branchTotals ??
        responses.reduce(
          (totals: any, response: any) => {
            const branchScore = response.branchScore ?? {};
            totals.perceiving += branchScore.perceiving ?? 0;
            totals.using += branchScore.using ?? 0;
            totals.understanding += branchScore.understanding ?? 0;
            totals.managing += branchScore.managing ?? 0;
            return totals;
          },
          { perceiving: 0, using: 0, understanding: 0, managing: 0 }
        )
    },
    responses: responses.map((response: any) => ({
      sessionId: response.sessionId,
      levelId: response.levelId,
      scenarioTitle: response.scenarioTitle,
      branch: response.branch ?? response.branchPrimary,
      selectedOptionId: response.selectedOptionId,
      selectedOptionText: response.selectedOptionText,
      score: response.score ?? response.itemScore,
      branchScore: response.branchScore,
      responseTimeMs: response.responseTimeMs ?? response.latencyMs,
      createdAt: new Date(response.createdAt ?? response.timestamp).toISOString()
    })),
    persistence: isMongoEnabled() ? "mongo" : "memory"
  });
}
