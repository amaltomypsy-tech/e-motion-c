import { NextResponse } from "next/server";
import scenarios from "@/data/scenarios.js";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const levelId = url.searchParams.get("levelId");

  if (levelId) {
    const found = scenarios.find((scenario: any) => scenario.levelId === levelId || scenario.id === levelId);
    if (!found) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(found);
  }

  return NextResponse.json({
    count: scenarios.length,
    scenarios: scenarios.map((scenario: any) => ({
      id: scenario.id,
      levelId: scenario.levelId,
      title: scenario.title,
      branch: scenario.branch,
      branchPrimary: scenario.branchPrimary,
      mood: scenario.mood,
      setting: scenario.setting,
      visualType: scenario.visualType
    }))
  });
}
