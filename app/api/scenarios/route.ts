import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { ScenarioLevel } from "@/types/scenario";

export const runtime = "nodejs";

async function loadAllScenarios(): Promise<ScenarioLevel[]> {
  const dir = path.join(process.cwd(), "data", "scenarios");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const scenarios: ScenarioLevel[] = [];
  for (const f of files) {
    const full = path.join(dir, f);
    const raw = await fs.readFile(full, "utf8");
    scenarios.push(JSON.parse(raw) as ScenarioLevel);
  }
  return scenarios;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const levelId = url.searchParams.get("levelId");
  const scenarios = await loadAllScenarios();

  if (levelId) {
    const found = scenarios.find((s) => s.levelId === levelId);
    if (!found) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(found);
  }

  return NextResponse.json({
    count: scenarios.length,
    scenarios: scenarios.map((s) => ({
      levelId: s.levelId,
      title: s.title,
      branchPrimary: s.branchPrimary,
      theme: s.theme,
      culturalTags: s.culturalTags
    }))
  });
}

