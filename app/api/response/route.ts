import { NextResponse } from "next/server";
import { SaveResponseSchema } from "@/lib/validators";
import { isMongoEnabled, saveResponse } from "@/lib/services/persistence";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = SaveResponseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { anonymousUserId, sessionId, levelId, selectedOptionId, latencyMs, changedSelectionCount } =
    parsed.data;

  try {
    const rec = await saveResponse({
      anonymousUserId,
      sessionId,
      levelId,
      selectedOptionId,
      latencyMs,
      changedSelectionCount
    });

    return NextResponse.json({
      anonymousUserId: rec.anonymousUserId,
      sessionId: rec.sessionId,
      levelId: rec.levelId,
      selectedOptionId: rec.selectedOptionId,
      branchPrimary: rec.branchPrimary,
      itemScore: rec.itemScore,
      eiLevel: rec.eiLevel,
      rationaleSnapshot: rec.rationaleSnapshot ?? null,
      latencyMs: rec.latencyMs,
      changedSelectionCount: rec.changedSelectionCount,
      responseOrder: rec.responseOrder,
      timestamp: rec.timestamp.toISOString(),
      cumulativeRawScore: rec.cumulativeRawScore,
      branchRunningScore: rec.branchRunningScore,
      persistence: isMongoEnabled() ? "mongo" : "memory"
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    if (msg === "scenario_not_found") return NextResponse.json({ error: msg }, { status: 404 });
    if (msg === "session_not_found") return NextResponse.json({ error: msg }, { status: 404 });
    if (msg === "already_answered") return NextResponse.json({ error: msg }, { status: 409 });
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
