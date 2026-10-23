"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { listAiVisibility } from "@/features/seo/api/client";
import type { AiVisibilityPoint, DashboardSummary } from "@/features/seo/types";

function buildTrendFromChecks(checks: Record<string, unknown>[]): AiVisibilityPoint[] {
  const byDate = new Map<string, AiVisibilityPoint>();
  for (const c of checks) {
    const d = String(c.checked_at || "").slice(0, 10);
    if (!d) continue;
    const row = byDate.get(d) || {
      date: d,
      checks: 0,
      brand_mentions: 0,
      website_links: 0,
    };
    row.checks += 1;
    if (c.brand_mentioned) row.brand_mentions += 1;
    if (c.website_linked) row.website_links += 1;
    byDate.set(d, row);
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
}

export function AiVisibilityDashboardChart({
  projectId,
  trendFromApi,
  summary,
}: {
  projectId: string;
  trendFromApi?: AiVisibilityPoint[];
  summary: DashboardSummary | null;
}) {
  const [fallbackTrend, setFallbackTrend] = useState<AiVisibilityPoint[]>([]);

  useEffect(() => {
    if (trendFromApi && trendFromApi.length > 0) {
      setFallbackTrend([]);
      return;
    }
    let mounted = true;
    void listAiVisibility(projectId)
      .then((checks) => {
        if (mounted) setFallbackTrend(buildTrendFromChecks(checks));
      })
      .catch(() => {
        if (mounted) setFallbackTrend([]);
      });
    return () => {
      mounted = false;
    };
  }, [projectId, trendFromApi]);

  const trend = trendFromApi?.length ? trendFromApi : fallbackTrend;

  const chartData = useMemo(
    () =>
      trend.map((p) => ({
        date: p.date.slice(5),
        checks: p.checks,
        brand: p.brand_mentions,
        links: p.website_links,
      })),
    [trend],
  );

  const checks = summary?.ai_checks_count ?? trend.reduce((a, p) => a + p.checks, 0);
  const mentions = summary?.ai_brand_mentions ?? trend.reduce((a, p) => a + p.brand_mentions, 0);
  const rate = checks > 0 ? Math.round((mentions / checks) * 100) : null;

  return (
    <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 to-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">AI Search Visibility</h3>
          <p className="text-xs text-slate-500">Brand mentions &amp; site links from manual AI checks</p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
            <span>
              <strong className="text-slate-900">{checks}</strong> checks
            </span>
            <span>
              <strong className="text-emerald-700">{mentions}</strong> mentions
            </span>
            {rate != null ? (
              <span>
                <strong className="text-slate-900">{rate}%</strong> mention rate
              </span>
            ) : null}
          </div>
        </div>
        <Link
          href={`/tools/seo/platform/${projectId}/ai-search-visibility`}
          className="rounded-xl bg-[#4f46e5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338ca]"
        >
          Log AI check
        </Link>
      </div>
      <div className="h-64 rounded-xl border border-white/80 bg-white/90 p-2">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="checks"
                stroke="#94a3b8"
                strokeWidth={1.5}
                dot={false}
                name="Checks"
              />
              <Line
                type="monotone"
                dataKey="brand"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#6366f1" }}
                name="Brand mentions"
              />
              <Line
                type="monotone"
                dataKey="links"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Site linked"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
            <p>No AI visibility data yet.</p>
            <p className="text-xs">Log a check under AI Search Visibility — the graph updates here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
