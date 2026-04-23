"use client";

import type { BranchScoreSummary } from "@/types/report";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";

export function BranchRadarChart({ data }: { data: BranchScoreSummary[] }) {
  const chartData = data.map((d) => ({ branch: d.branch, score: d.normalized }));

  return (
    <div className="h-72 w-full rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 text-sm font-semibold text-white/90">Branch Profile</div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="branch"
              tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }}
            />
            <Radar
              dataKey="score"
              stroke="rgba(255,255,255,0.75)"
              fill="rgba(255,255,255,0.18)"
              fillOpacity={1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

