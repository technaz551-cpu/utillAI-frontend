"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ScoreGauge } from "@/features/seo/components/seo-ui/ToolChrome";
import type { KeywordOverview } from "@/features/seo/types/keywordOverview";
import { exportSerpOverviewCsv } from "@/features/seo/utils/keywordCsv";

function fmt(n: number | null | undefined, suffix = "") {
  if (n == null) return "n/a";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K${suffix}`;
  return `${n}${suffix}`;
}

function IntentTag({ intent }: { intent: string | null }) {
  if (!intent) return <span className="text-slate-400">—</span>;
  const colors: Record<string, string> = {
    Commercial: "bg-amber-100 text-amber-900",
    Informational: "bg-sky-100 text-sky-900",
    Local: "bg-emerald-100 text-emerald-900",
    Navigational: "bg-violet-100 text-violet-900",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[intent] || "bg-slate-100 text-slate-700"}`}>
      {intent}
    </span>
  );
}

function IdeaTable({ rows, empty }: { rows: KeywordOverview["variations"]; empty: string }) {
  if (!rows.length) return <p className="p-4 text-sm text-slate-500">{empty}</p>;
  return (
    <div className="max-h-64 overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-2">Keyword</th>
            <th className="p-2">Volume</th>
            <th className="p-2">KD%</th>
            <th className="p-2">Intent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.phrase} className="border-t border-slate-100">
              <td className="p-2 font-medium text-[#4f46e5]">{r.phrase}</td>
              <td className="p-2">{r.volume ?? "n/a"}</td>
              <td className="p-2">{r.keyword_difficulty ?? "n/a"}</td>
              <td className="p-2">
                <IntentTag intent={r.intent} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function KeywordOverviewPanel({
  projectId,
  overview,
  loading,
}: {
  projectId: string;
  overview: KeywordOverview | null;
  loading: boolean;
}) {
  if (loading) {
    return <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Analyzing keyword…</p>;
  }
  if (!overview) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center text-sm text-slate-600">
        Enter a keyword above and click <strong>Analyze</strong> for an overview like Semrush — metrics fill in when a provider is connected.
      </p>
    );
  }

  const trendData = overview.trend.map((p) => ({
    date: p.date.slice(5),
    position: p.value,
  }));
  const countryBars = overview.volume_by_country.map((c) => ({
    name: c.country_code,
    label: c.country_name,
    volume: c.volume ?? 0,
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Keyword Overview</p>
            <h2 className="text-2xl font-bold text-slate-900">{overview.phrase}</h2>
            <p className="mt-1 text-xs text-slate-500">
              {overview.in_project ? "Saved in this project" : "Not saved yet — use Save keywords to track"}
              {overview.latest_rank != null ? ` · Latest rank #${overview.latest_rank}` : ""}
            </p>
          </div>
          <IntentTag intent={overview.intent} />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs text-slate-500">Volume</p>
            <p className="text-2xl font-bold text-slate-900">{fmt(overview.volume)}</p>
            <p className="text-[10px] text-slate-400">{overview.country || "Market"}</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <ScoreGauge score={overview.keyword_difficulty} label="Keyword difficulty" />
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs text-slate-500">Global volume</p>
            <p className="text-2xl font-bold text-slate-900">{fmt(overview.global_volume)}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs text-slate-500">CPC</p>
            <p className="text-2xl font-bold text-slate-900">{overview.cpc != null ? `$${overview.cpc}` : "n/a"}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs text-slate-500">Competitive density</p>
            <p className="text-2xl font-bold text-slate-900">{overview.competitive_density ?? "n/a"}</p>
          </div>
        </div>

        {!overview.provider_connected ? (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{overview.provider_message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Trend</h3>
          <p className="text-xs text-slate-500">Position over time (from Rank Tracking logs)</p>
          <div className="mt-3 h-48">
            {trendData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis reversed allowDecimals={false} tick={{ fontSize: 10 }} domain={[1, "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="position" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Position" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Log ranks in{" "}
                <Link href={`/tools/seo/platform/${projectId}/rank-tracking`} className="ml-1 font-semibold text-[#4f46e5]">
                  Rank Tracking
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Volume by country</h3>
          <p className="text-xs text-slate-500">Full breakdown when keyword provider is connected</p>
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryBars.length ? countryBars : [{ name: "—", label: "—", volume: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v, _n, p) => [v === 0 ? "n/a" : v, (p as { payload?: { label?: string } }).payload?.label]} />
                <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h3 className="border-b border-slate-100 p-4 text-sm font-bold text-slate-800">Keyword variations</h3>
          <IdeaTable rows={overview.variations} empty="Add related phrases via CSV or paste — variations match your saved list." />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h3 className="border-b border-slate-100 p-4 text-sm font-bold text-slate-800">Questions</h3>
          <IdeaTable rows={overview.questions} empty="Save question-style keywords (how/what/why…) to see them here." />
        </div>
      </div>

      {overview.clusters.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Keyword strategy (groups)</h3>
          <p className="text-xs text-slate-500">From your CSV <strong>group</strong> column</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {overview.clusters.map((c) => (
              <div key={c.name} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm">
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.count} keywords</p>
                <ul className="mt-2 max-h-24 overflow-auto text-xs text-[#4f46e5]">
                  {c.keywords.map((k) => (
                    <li key={k} className="truncate">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">SERP analysis</h3>
            <p className="text-xs text-slate-500">Ranked URLs, authority, and traffic — live data with SERP provider</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => exportSerpOverviewCsv(overview.serp_results)}
          >
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">URL / SERP</th>
                <th className="p-3">Page AS</th>
                <th className="p-3">Ref. domains</th>
                <th className="p-3">Backlinks</th>
                <th className="p-3">Traffic</th>
                <th className="p-3">Keywords</th>
              </tr>
            </thead>
            <tbody>
              {overview.serp_results.map((row, i) => (
                <tr key={`${row.url}-${i}`} className="border-t border-slate-100">
                  <td className="max-w-md p-3">
                    {row.is_ai_overview ? (
                      <span className="font-medium text-indigo-700">AI / Provider notice</span>
                    ) : (
                      <a href={row.url} className="text-[#4f46e5] hover:underline" target="_blank" rel="noreferrer">
                        {row.url}
                      </a>
                    )}
                    {row.title ? <p className="mt-0.5 text-xs text-slate-500">{row.title}</p> : null}
                  </td>
                  <td className="p-3">{row.page_authority ?? "—"}</td>
                  <td className="p-3">{row.referring_domains ?? "—"}</td>
                  <td className="p-3">{row.backlinks ?? "—"}</td>
                  <td className="p-3">{row.search_traffic ?? "—"}</td>
                  <td className="p-3">{row.url_keywords ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 p-3 text-xs text-slate-500">
          <Link href={`/tools/seo/platform/${projectId}/ai-search-visibility`} className="font-semibold text-[#4f46e5]">
            AI Search Visibility →
          </Link>
          {" "}Log whether AI answers mention your brand for this topic.
        </div>
      </div>
    </div>
  );
}
