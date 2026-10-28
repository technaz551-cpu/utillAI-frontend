"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import {
  listAlerts,
  listAudits,
  listKeywords,
  listProjects,
  listTasks,
} from "@/features/seo/api/client";
import { AiVisibilityDashboardChart } from "@/features/seo/components/charts/AiVisibilityDashboardChart";
import { DashboardChartsPanel } from "@/features/seo/components/charts/DashboardChartsPanel";
import { WebsiteConditionCard } from "@/features/seo/components/WebsiteConditionCard";
import type {
  DashboardCharts,
  DashboardSummary,
  SeoKeyword,
  SeoProject,
  SeoTask,
} from "@/features/seo/types";

function HealthRing({ score }: { score: number | null }) {
  const v = score ?? 0;
  const pct = Math.min(100, Math.max(0, v));
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#eab308" : "#ef4444";
  const label = pct >= 70 ? "Good" : pct >= 40 ? "Fair" : score == null ? "—" : "Poor";
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg, #e2e8f0 0deg)`,
        }}
      >
        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="text-xl font-bold leading-none text-slate-900">{score ?? "—"}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SEO Health Score</p>
        <p className="text-lg font-bold text-slate-900">{label}</p>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  delta,
  deltaUp,
}: {
  title: string;
  value: string | number;
  delta?: string;
  deltaUp?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              deltaUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}
          >
            {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function healthDelta(charts: DashboardCharts | null): { text: string; up: boolean } | null {
  const pts = charts?.health_score_history.data ?? [];
  if (pts.length < 2) return null;
  const first = pts[0].value;
  const last = pts[pts.length - 1].value;
  const diff = last - first;
  if (diff === 0) return null;
  return { text: `${diff > 0 ? "+" : ""}${diff}`, up: diff > 0 };
}

export function SeoOverviewPanel({
  projectId,
  project,
  summary,
  charts,
}: {
  projectId: string;
  project: SeoProject | null;
  summary: DashboardSummary | null;
  charts: DashboardCharts | null;
}) {
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [tasks, setTasks] = useState<SeoTask[]>([]);
  const [projects, setProjects] = useState<SeoProject[]>([]);
  const [activity, setActivity] = useState<{ title: string; time: string; tone: string }[]>([]);
  useEffect(() => {
    void listKeywords(projectId).then(setKeywords).catch(() => {});
    void listTasks(projectId).then(setTasks).catch(() => {});
    void listProjects().then(setProjects).catch(() => {});

    void Promise.all([
      listAudits(projectId),
      listAlerts(projectId),
      listTasks(projectId),
    ]).then(([audits, alerts, taskList]) => {
      const items: { title: string; time: string; sort: string; tone: string }[] = [];
      for (const a of audits.slice(0, 5)) {
        items.push({
          title: `Site audit ${a.status} — ${a.pages_crawled} pages, ${a.issues_found} issues`,
          time: a.created_at?.slice(0, 16).replace("T", " ") || "",
          sort: a.created_at || "",
          tone: a.status === "completed" ? "emerald" : "slate",
        });
      }
      for (const al of alerts.slice(0, 5)) {
        items.push({
          title: String(al.title || "Alert"),
          time: String(al.created_at || "").slice(0, 16),
          sort: String(al.created_at || ""),
          tone: "amber",
        });
      }
      for (const t of taskList.slice(0, 3)) {
        items.push({
          title: `Task: ${t.title}`,
          time: t.due_date?.slice(0, 10) || "—",
          sort: t.due_date || "",
          tone: "indigo",
        });
      }
      items.sort((a, b) => b.sort.localeCompare(a.sort));
      setActivity(items.slice(0, 8).map(({ title, time, tone }) => ({ title, time, tone })));
    }).catch(() => {});
  }, [projectId]);

  const healthTrend = healthDelta(charts);
  const setup = summary?.setup_steps ?? [];
  const completed = summary?.setup_completed ?? 0;
  const total = summary?.setup_total ?? 4;

  const keywordRows = useMemo(() => keywords.slice(0, 6), [keywords]);

  return (
    <div className="space-y-5">
      {completed < total ? (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">
                Finish setup <span className="text-slate-500">{completed}/{total}</span>
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {setup.map((s) => (
                  <span
                    key={s.id}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      s.status === "done" ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={`/tools/seo/platform/${projectId}/settings`}
              className="rounded-xl bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white"
            >
              Complete setup
            </Link>
          </div>
        </div>
      ) : null}

      <WebsiteConditionCard projectId={projectId} condition={summary?.website_condition} />

      {summary?.audit_in_progress ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950">
          <p className="font-semibold">First site scan running…</p>
          <p className="mt-1 text-blue-900/90">
            Crawled{" "}
            <strong>{summary.audit_pages_crawled ?? summary.pages_crawled ?? 0}</strong>
            {summary.audit_pages_target ? (
              <>
                {" "}
                of <strong>{summary.audit_pages_target}</strong>
              </>
            ) : null}{" "}
            pages. Health score and issues will appear here when the scan completes.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <p className="text-xs font-semibold text-slate-500">Selected project</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{project?.domain || "—"}</p>
          <div className="mt-2">
            <HealthRing
              score={
                summary?.audit_in_progress && summary.health_score == null
                  ? null
                  : summary?.health_score ?? null
              }
            />
            {summary?.audit_in_progress && summary.health_score == null ? (
              <p className="mt-2 text-xs font-medium text-blue-600">Calculating health…</p>
            ) : null}
          </div>
        </div>
        <KpiCard
          title="Total Crawled Pages"
          value={summary?.pages_crawled ?? 0}
          delta={healthTrend?.text}
          deltaUp={healthTrend?.up}
        />
        <KpiCard title="Total Issues" value={summary?.open_issues ?? 0} />
        <KpiCard title="Keywords Tracked" value={summary?.keywords_count ?? 0} />
      </div>

      <AiVisibilityDashboardChart
        projectId={projectId}
        trendFromApi={charts?.ai_visibility_trend}
        summary={summary}
      />

      {charts ? (
        <DashboardChartsPanel projectId={projectId} charts={charts} summary={summary} />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Top Keywords</h3>
            <Link href={`/tools/seo/platform/${projectId}/keyword-research`} className="text-xs font-semibold text-[#4f46e5]">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2 font-semibold">Keyword</th>
                  <th className="pb-2 font-semibold">Volume</th>
                  <th className="pb-2 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {keywordRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-500">
                      Add keywords in Keyword Research.
                    </td>
                  </tr>
                ) : (
                  keywordRows.map((k) => (
                    <tr key={k.id} className="border-b border-slate-50">
                      <td className="py-2.5 font-medium text-slate-800">{k.phrase}</td>
                      <td className="py-2.5 text-slate-600">{k.search_volume ?? "—"}</td>
                      <td className="py-2.5 text-xs text-slate-500">{k.data_source || "manual"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
          <ul className="mt-4 space-y-3">
            {activity.length === 0 ? (
              <li className="text-sm text-slate-500">Run an audit to see activity.</li>
            ) : (
              activity.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      item.tone === "emerald"
                        ? "bg-emerald-500"
                        : item.tone === "amber"
                          ? "bg-amber-500"
                          : "bg-indigo-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Project Overview</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2">Website</th>
                  <th className="pb-2">Health</th>
                  <th className="pb-2">Issues</th>
                  <th className="pb-2">Pages</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="py-3">
                      <p className="font-semibold text-slate-800">{p.domain}</p>
                      <p className="text-xs text-slate-500">{p.name}</p>
                    </td>
                    <td className="py-3 font-bold text-emerald-600">{p.health_score ?? "—"}</td>
                    <td className="py-3">{p.open_issues}</td>
                    <td className="py-3 text-slate-600">—</td>
                    <td className="py-3">
                      <Link
                        href={`/tools/seo/platform/${p.id}/overview`}
                        className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-[#4f46e5]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Recent SEO Tasks</h3>
            <Link href={`/tools/seo/platform/${projectId}/seo-tasks`} className="text-xs font-semibold text-[#4f46e5]">
              All tasks
            </Link>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="pb-2">Task</th>
                <th className="pb-2">Priority</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500">
                    No tasks yet.
                  </td>
                </tr>
              ) : (
                tasks.slice(0, 5).map((t) => (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="py-2.5 font-medium">{t.title}</td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-800">
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
