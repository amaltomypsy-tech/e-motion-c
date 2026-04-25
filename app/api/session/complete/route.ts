import { NextResponse } from "next/server";
import { completeSession, getSession, isMongoEnabled, listResponses } from "@/lib/services/persistence";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sessionId = body.sessionId ?? body.participant_id;
  if (!sessionId) return NextResponse.json({ error: "missing_sessionId" }, { status: 400 });

  const session = await completeSession(sessionId);
  if (!session) return NextResponse.json({ error: "session_not_found" }, { status: 404 });

  const responses = await listResponses({ sessionId });
  return NextResponse.json({
    ok: true,
    participant_id: session.participant_id,
    participant_name: session.participant_name,
    is_anonymous: session.is_anonymous,
    age: session.age,
    userType: session.userType,
    completed_at: session.completedAt,
    responseCount: responses.length,
    persistence: isMongoEnabled() ? "mongo" : "memory"
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") ?? url.searchParams.get("participant_id");
  if (!sessionId) return NextResponse.json({ error: "missing_sessionId" }, { status: 400 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "session_not_found" }, { status: 404 });
  return NextResponse.json({ session, persistence: isMongoEnabled() ? "mongo" : "memory" });
}
