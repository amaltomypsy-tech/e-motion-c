import { NextResponse } from "next/server";
import { GenerateReportSchema } from "@/lib/validators";
import { getOrCreateReport, isMongoEnabled } from "@/lib/services/persistence";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = GenerateReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { anonymousUserId, sessionId } = parsed.data;
  try {
    const report = await getOrCreateReport({ anonymousUserId, sessionId });
    return NextResponse.json({ ...report, persistence: isMongoEnabled() ? "mongo" : "memory" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    if (msg === "session_not_found") return NextResponse.json({ error: msg }, { status: 404 });
    return NextResponse.json({ error: "report_failed" }, { status: 500 });
  }
}
