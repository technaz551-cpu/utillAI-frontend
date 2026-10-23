"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SeverityBadge } from "@/features/seo/components/SeverityBadge";
import type { DashboardCharts, DashboardSummary } from "@/features/seo/types";

const SEV_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
};

const CRAWL_LABELS: Record<string, string> = {
  indexable: "Indexable (200)",
  noindex: "Noindex",
  broken: "Broken (4xx/5xx)",
  redirects: "Redirects (3xx)",
  other: "Other",
};

const CRAWL_COLORS: Record<string, string> = {
  indexable: "#22c55e",
  noindex: "#eab308",
  broken: "#ef4444",
  redirects: "#3b82f6",
  other: "#94a3b8",
};

function DonutCenter({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-slate-500">{label}</span>
    </div>
  );
}

export function DashboardChartsPanel({
  projectId,
  charts,
  summary,
}: {
  projectId: string;
  charts: DashboardCharts;
  summary: DashboardSummary | null;
}) {
  const [severityFilter, setSeverityFilter] = useState<string | "all">("all");
  const [crawlFilter, setCrawlFilter] = useState<string | "all">("all");

  const health = charts.health_score_history.data.map((p) => ({
    date: p.date.slice(5),
    score: p.value,
  }));

  const sev = charts.issues_by_severity.data
    .filter((p) => p.value > 0)
    .map((p) => ({
      key: p.date,
      name: p.date.charAt(0).toUpperCase() + p.date.slice(1),
      value: p.value,
      fill: SEV_COLORS[p.date] || "#94a3b8",
    }));

  const totalIssues = sev.reduce((a, b) => a + b.value, 0) || summary?.open_issues || 0;

  const issueRows = charts.open_issues_preview ?? [];
  const filteredIssues = useMemo(() => {
    if (severityFilter === "all") return issueRows;
    return issueRows.filter((i) => i.severity === severityFilter);
  }, [issueRows, severityFilter]);

  const crawlFromApi = charts.crawl_breakdown?.data ?? [];
  const crawlData =
    crawlFromApi.length > 0
      ? crawlFromApi.map((p) => ({
          key: p.date,
          name: CRAWL_LABELS[p.date] || p.date,
          value: p.value,
          fill: CRAWL_COLORS[p.date] || "#94a3b8",
        }))
      : [{ key: "none", name: "No crawl yet", value: 1, fill: "#e2e8f0" }];
  const crawled = charts.crawl_detail?.total ?? summary?.pages_crawled ?? 0;
  const crawlDetail = charts.crawl_detail;

  const rankData = (charts.ranking_progress ?? []).map((p) => ({
    date: p.date.slice(5),
    top3: p.top_3,
    top10: p.top_10,
    top20: p.top_20,
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2">
          <h3 className="text-sm font-bold text-slate-800">SEO Health Trend</h3>
          <p className="text-xs text-slate-500">UTILAI health score over time</p>
          <div className="mt-4 h-64">
            {health.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-500">
                <p>No history yet.</p>
                <p className="text-xs">Run a site audit to start tracking.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={health}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#22c55e" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-800">Issues by Severity</h3>
            <Link
              href={`/tools/seo/platform/${projectId}/site-audit`}
              className="text-xs font-semibold text-[#4f46e5]"
            >
              Site Audit →
            </Link>
          </div>
          <p className="text-xs text-slate-500">Click a severity to filter the list below</p>
          <div className="relative mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sev.length ? sev : [{ name: "None", value: 1, fill: "#e2e8f0", key: "none" }]}
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(_, index) => {
                    const row = sev[index];
                    if (row?.key) {
                      setSeverityFilter((prev) => (prev === row.key ? "all" : row.key));
                    }
                  }}
                >
                  {(sev.length ? sev : [{ fill: "#e2e8f0" }]).map((entry, i) => (
                    <Cell
                      key={i}
                      fill={"fill" in entry ? entry.fill : "#e2e8f0"}
                      stroke={severityFilter === (entry as { key?: string }).key ? "#0f172a" : undefined}
                      strokeWidth={severityFilter === (entry as { key?: string }).key ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={28} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter label="Open" value={totalIssues} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverityFilter(s)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                  severityFilter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {issueRows.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-800">
              Issue details
              {severityFilter !== "all" ? (
                <span className="ml-2 font-normal capitalize text-slate-500">({severityFilter})</span>
              ) : null}
            </h3>
            <span className="text-xs text-slate-500">
              Showing {filteredIssues.length} of {issueRows.length} open issues (from latest audit)
            </span>
          </div>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2 pr-2">Severity</th>
                  <th className="pb-2 pr-2">Issue</th>
                  <th className="pb-2 pr-2">URL</th>
                  <th className="pb-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="border-t border-slate-100 align-top">
                    <td className="py-2 pr-2">
                      <SeverityBadge severity={issue.severity} />
                    </td>
                    <td className="py-2 pr-2">
                      <p className="font-medium text-slate-900">{issue.title}</p>
                      {issue.recommendation ? (
                        <p className="mt-0.5 text-xs text-slate-500">{issue.recommendation}</p>
                      ) : null}
                    </td>
                    <td className="max-w-[200px] truncate py-2 pr-2 text-xs text-[#4f46e5]">{issue.url}</td>
                    <td className="py-2 text-xs capitalize text-slate-600">{issue.category || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredIssues.length === 0 ? (
              <p className="py-4 text-sm text-slate-500">No issues in this severity bucket.</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Crawl Stats</h3>
              <p className="text-xs text-slate-500">Latest site audit — click a segment for counts</p>
            </div>
            <Link
              href={`/tools/seo/platform/${projectId}/on-page-seo`}
              className="text-xs font-semibold text-[#4f46e5]"
            >
              All pages →
            </Link>
          </div>
          <div className="relative mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crawlData}
                  innerRadius={45}
                  outerRadius={68}
                  dataKey="value"
                  paddingAngle={2}
                  onClick={(_, index) => {
                    const row = crawlData[index];
                    if (row?.key && row.key !== "none") {
                      setCrawlFilter((prev) => (prev === row.key ? "all" : row.key));
                    }
                  }}
                >
                  {crawlData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.fill}
                      stroke={crawlFilter === entry.key ? "#0f172a" : undefined}
                      strokeWidth={crawlFilter === entry.key ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter label="Pages" value={crawled || "—"} />
          </div>
          {crawlDetail ? (
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs">
              {(
                [
                  ["indexable", crawlDetail.indexable, "200 OK, indexable"],
                  ["noindex", crawlDetail.noindex, "noindex / blocked"],
                  ["broken", crawlDetail.broken, "HTTP 4xx/5xx"],
                  ["redirects", crawlDetail.redirects, "HTTP 3xx"],
                  ["other", crawlDetail.other, "Other responses"],
                ] as const
              ).map(([key, count, hint]) => (
                <div
                  key={key}
                  className={`rounded-lg px-2 py-1.5 ${
                    crawlFilter === key || crawlFilter === "all" ? "bg-slate-50" : "opacity-60"
                  }`}
                >
                  <dt className="font-semibold capitalize text-slate-700">
                    {CRAWL_LABELS[key]?.split(" (")[0] || key}
                  </dt>
                  <dd className="text-lg font-bold text-slate-900">{count}</dd>
                  <dd className="text-[10px] text-slate-500">{hint}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-xs text-slate-500">Run Site Audit to populate crawl breakdown.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Ranking Progress</h3>
          <p className="text-xs text-slate-500">Manual rank logs (Top 3 / 10 / 20)</p>
          <div className="mt-4 h-56">
            {rankData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="top3" stroke="#22c55e" strokeWidth={2} dot={false} name="Top 3" />
                  <Line type="monotone" dataKey="top10" stroke="#3b82f6" strokeWidth={2} dot={false} name="Top 10" />
                  <Line type="monotone" dataKey="top20" stroke="#a855f7" strokeWidth={2} dot={false} name="Top 20" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
                Log positions in Rank Tracking to see progress.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
