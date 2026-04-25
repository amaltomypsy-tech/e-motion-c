import { NextResponse } from "next/server";
import scenarios from "@/data/scenarios.js";

export const runtime = "nodejs";

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return ((state >>> 0) / 4294967296);
  };
}

function orderedScenario(scenario: any, sessionId: string | null) {
  const optionIds = scenario.options.map((option: any) => option.optionId ?? option.id);
  const baseOrder = scenario.display_order?.length === optionIds.length ? scenario.display_order : optionIds;
  const order = [...baseOrder];
  const random = seededRandom(hashSeed(`${sessionId ?? "anonymous"}:${scenario.levelId}`));

  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const optionsById = new Map(scenario.options.map((option: any) => [option.optionId ?? option.id, option]));
  return {
    ...scenario,
    display_order: order,
    displayed_option_order: order,
    options: order.map((id) => optionsById.get(id)).filter(Boolean)
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const levelId = url.searchParams.get("levelId");
  const sessionId = url.searchParams.get("sessionId");

  if (levelId) {
    const found = scenarios.find((scenario: any) => scenario.levelId === levelId || scenario.id === levelId);
    if (!found) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(orderedScenario(found, sessionId));
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
