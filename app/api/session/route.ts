import { NextResponse } from "next/server";
import { CreateSessionSchema, UpdateSessionSchema } from "@/lib/validators";
import { createSession, updateSession, isMongoEnabled } from "@/lib/services/persistence";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = CreateSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const session = await createSession({
      name: parsed.data.name,
      age: parsed.data.age,
      gender: parsed.data.gender,
      education: parsed.data.education,
      is_anonymous: parsed.data.is_anonymous,
      ageGroup: parsed.data.ageGroup,
      anonymousUserId: parsed.data.anonymousUserId,
      avatarId: parsed.data.avatarId,
      demographics: parsed.data.demographics
    });

    return NextResponse.json({
      participant_id: session.participant_id,
      participant_name: session.participant_name,
      is_anonymous: session.is_anonymous,
      age: session.age,
      gender: session.gender,
      education: session.education,
      userType: session.userType,
      anonymousUserId: session.anonymousUserId,
      sessionId: session.sessionId,
      ageGroup: session.ageGroup,
      avatarId: session.avatarId ?? null,
      scenarioOrder: session.scenarioOrder,
      createdAt: session.createdAt.toISOString(),
      persistence: isMongoEnabled() ? "mongo" : "memory"
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "session_create_failed",
        message: isMongoEnabled()
          ? "Could not create session."
          : "Could not create session (memory mode)."
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = UpdateSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const ok = await updateSession({
    sessionId: parsed.data.sessionId,
    avatarId: parsed.data.avatarId,
    demographics: parsed.data.demographics
  });
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, persistence: isMongoEnabled() ? "mongo" : "memory" });
}
