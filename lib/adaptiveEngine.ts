import type { EIPrimaryBranch } from "@/types/scenario";

export interface AdaptiveContext {
  branchPerformance: Record<EIPrimaryBranch, number>; // normalized 0–100
  completedLevelIds: string[];
  remainingLevelIds: string[];
}

export interface AdaptiveDecision {
  nextLevelId: string | null;
  reason: string;
}

export function chooseNextScenario(ctx: AdaptiveContext): AdaptiveDecision {
  // Placeholder for future adaptive branching:
  // - Increase ambiguity/difficulty for high-performing branches
  // - Add targeted items for lower-performing branches
  // - Control exposure and counterbalance cultural tags
  //
  // Prototype behavior: deterministic next-in-order.
  const nextLevelId = ctx.remainingLevelIds[0] ?? null;
  return {
    nextLevelId,
    reason: nextLevelId ? "prototype-sequential-order" : "no-remaining-levels"
  };
}

