"use client";

import Link from "next/link";
import { Download, Plus, RefreshCw, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ProviderNotice, ToolTabs } from "@/features/seo/components/seo-ui/ToolChrome";
import type { PositionTrackingDashboard } from "@/features/seo/types/positionTracking";
import type { SeoProject } from "@/features/seo/types";

type ChartMetric = "visibility" | "share_of_voice" | "est_traffic" | "avg_position";

const MAIN_TABS = [
  { id: "landscape", label: "Landscape" },
  { id: "overview", label: "Overview" },
  { id: "distribution", label: "Rankings Distribution" },
  { id: "pages", label: "Pages" },
  { id: "tags", label: "Tags" },
];

const METRIC_TABS: { id: ChartMetric; label: string }[] = [
  { id: "visibility", label: "Visibility" },
  { id: "share_of_voice", label: "Share of Voice" },
  { id: "est_traffic", label: "Est. Traffic" },
  { id: "avg_position", label: "Avg. Position" },
];

function fmtPct(n: number | null | undefined) {
  if (n == null) return "—";
  return `${n.toFixed(2)}%`;
}

function fmtNum(n: number | null | undefined) {
  if (n == null) return "—";
  return String(n);
}

function changeBadge(change: number | null | undefined) {
  if (change == null || change === 0) return <span className="text-slate-400">—</span>;
  const up = change > 0;
  return (
    <span className={up ? "text-emerald-600" : "text-red-600"}>
      {up ? "+" : ""}
      {change}
    </span>
  );
}

function kdDot(kd: number | null) {
  if (kd == null) return <span className="text-slate-400">—</span>;
  const color = kd <= 30 ? "bg-emerald-500" : kd <= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {kd}
    </span>
  );
}

function exportKeywordsCsv(rows: PositionTrackingDashboard["keywords"]) {
  const header = "keyword,position,change,volume,kd,visibility,est_traffic,url";
  const lines = rows.map((r) => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    return [
      esc(r.phrase),
      r.position ?? "",
      r.position_change ?? "",
      r.search_volume ?? "",
      r.difficulty ?? "",
      r.visibility_pct,
      r.est_traffic,
      esc(r.ranking_url || ""),
    ].join(",");
  });
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "position-tracking-keywords.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function KpiCard({
  label,
  value,
  change,
  suffix,
}: {
  label: string;
  value: string;
  change: number | null | undefined;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
        {suffix ? <span className="text-base font-semibold text-slate-500">{suffix}</span> : null}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Change: {changeBadge(change)}
      </p>
    </div>
  );
}

function RankingsTable({
  rows,
  dateLabel,
}: {
  rows: PositionTrackingDashboard["keywords"];
  dateLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">Keyword</th>
            <th className="p-3">Intent</th>
            <th className="p-3">KD%</th>
            <th className="p-3">Pos.</th>
            <th className="p-3">Diff</th>
            <th className="p-3">Visibility</th>
            <th className="p-3">Est. Traffic</th>
            <th className="p-3">Vol.</th>
            <th className="p-3">{dateLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-6 text-center text-slate-500">
                No tracked keywords yet. Add keywords below or import from Keyword Research.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.keyword_id} className="border-t border-slate-100 hover:bg-slate-50/80">
                <td className="p-3 font-medium text-slate-900">{r.phrase}</td>
                <td className="p-3 text-xs uppercase text-slate-500">{r.intent.slice(0, 1)}</td>
                <td className="p-3">{kdDot(r.difficulty)}</td>
                <td className="p-3 font-semibold">{r.position ?? "—"}</td>
                <td className="p-3">{changeBadge(r.position_change)}</td>
                <td className="p-3">{fmtPct(r.visibility_pct)}</td>
                <td className="p-3">{r.est_traffic}</td>
                <td className="p-3">{r.search_volume ?? "—"}</td>
                <td className="p-3 text-xs text-slate-500">
                  {r.recorded_at ? String(r.recorded_at).slice(0, 10) : "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function DistributionChart({ data }: { data: PositionTrackingDashboard["distribution"] }) {
  const chartData = [
    { bucket: "#1–3", count: data.top_1_3 },
    { bucket: "#4–10", count: data.top_4_10 },
    { bucket: "#11–20", count: data.top_11_20 },
    { bucket: "#21–100", count: data.top_21_100 },
    { bucket: "Not ranked", count: data.not_ranked },
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Keywords" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PositionTrackingView({
  projectId,
  project,
  dashboard,
  rankPhrase,
  rankPos,
  country,
  device,
  onPhrase,
  onPos,
  onCountry,
  onDevice,
  onLog,
  onRefresh,
}: {
  projectId: string;
  project: SeoProject | null;
  dashboard: PositionTrackingDashboard | null;
  rankPhrase: string;
  rankPos: string;
  country: string;
  device: string;
  onPhrase: (v: string) => void;
  onPos: (v: string) => void;
  onCountry: (v: string) => void;
  onDevice: (v: string) => void;
  onLog: () => void;
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState("landscape");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("visibility");
  const [kwFilter, setKwFilter] = useState("");

  const domain = project?.domain || project?.website_url || dashboard?.domain || "Project";
  const targeting = dashboard?.targeting;
  const kpis = dashboard?.kpis;
  const trend = dashboard?.visibility_trend ?? [];

  const filteredKeywords = useMemo(() => {
    const q = kwFilter.trim().toLowerCase();
    const list = dashboard?.keywords ?? [];
    if (!q) return list;
    return list.filter((r) => r.phrase.toLowerCase().includes(q));
  }, [dashboard?.keywords, kwFilter]);

  const chartData = useMemo(
    () =>
      trend.map((p) => ({
        date: p.date.slice(5),
        visibility: p.visibility,
        share_of_voice: p.share_of_voice,
        est_traffic: p.est_traffic,
        avg_position: p.avg_position,
      })),
    [trend],
  );

  const metricValue =
    chartMetric === "visibility"
      ? kpis?.visibility.value
      : chartMetric === "share_of_voice"
        ? kpis?.share_of_voice.value
        : chartMetric === "est_traffic"
          ? kpis?.est_traffic.value
          : kpis?.avg_position.value;

  const metricLabel = METRIC_TABS.find((m) => m.id === chartMetric)?.label ?? "Visibility";

  return (
    <>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Position Tracking</p>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              {domain}
              <Settings2 className="h-4 w-4 text-slate-400" aria-hidden />
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {targeting?.country || "Worldwide"} ({targeting?.search_engine || "Google"}) ·{" "}
              {targeting?.device || "Desktop"} · Updated:{" "}
              {dashboard?.last_updated
                ? String(dashboard.last_updated).slice(0, 16).replace("T", ", ")
                : "Never"}
              {" · "}Keywords: {dashboard?.keywords_count ?? 0}
              {" · "}Competitors: {dashboard?.competitors_count ?? 0}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
              onClick={() => dashboard && exportKeywordsCsv(dashboard.keywords)}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link
              href={`/tools/seo/platform/${projectId}/keyword-research`}
              className="inline-flex items-center gap-1 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add keywords
            </Link>
          </div>
        </div>
      </div>

      <ProviderNotice>
        {dashboard?.data_note ||
          "Log positions manually or connect a SERP provider in Settings for automated tracking."}
      </ProviderNotice>

      <ToolTabs tabs={MAIN_TABS} active={tab} onChange={setTab} />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
        <input
          className="min-w-[160px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Filter by keyword"
          value={kwFilter}
          onChange={(e) => setKwFilter(e.target.value)}
        />
        <select
          className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
          value={country}
          onChange={(e) => onCountry(e.target.value)}
        >
          <option value="worldwide">Worldwide</option>
          <option value="US">US</option>
          <option value="AU">Australia</option>
          <option value="PK">Pakistan</option>
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
          value={device}
          onChange={(e) => onDevice(e.target.value)}
        >
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
        <input
          className="min-w-[120px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Keyword"
          value={rankPhrase}
          onChange={(e) => onPhrase(e.target.value)}
        />
        <input
          className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
          placeholder="Pos"
          value={rankPos}
          onChange={(e) => onPos(e.target.value)}
        />
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
          onClick={onLog}
        >
          Log position
        </button>
      </div>

      {(tab === "landscape" || tab === "overview") && (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Visibility"
            value={fmtPct(kpis?.visibility.value)}
            change={kpis?.visibility.change}
          />
          <KpiCard
            label="Est. Traffic"
            value={fmtNum(kpis?.est_traffic.value)}
            change={kpis?.est_traffic.change}
          />
          <KpiCard
            label="Avg. Position"
            value={fmtNum(kpis?.avg_position.value)}
            change={kpis?.avg_position.change}
          />
          <KpiCard
            label="Share of Voice"
            value={fmtPct(kpis?.share_of_voice.value)}
            change={kpis?.share_of_voice.change}
          />
        </div>
      )}

      {tab === "landscape" && dashboard ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900">Rankings distribution</h3>
            <p className="text-xs text-slate-500">
              Improved {dashboard.improved_count} · Declined {dashboard.declined_count}
            </p>
            <div className="mt-2">
              <DistributionChart data={dashboard.distribution} />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Summary</h3>
            <p className="mt-2 text-sm text-slate-600">
              Tracking {dashboard.keywords_count} keywords for {domain}. Visibility is{" "}
              {fmtPct(kpis?.visibility.value)} with estimated traffic of{" "}
              {fmtNum(kpis?.est_traffic.value)} visits based on logged SERP positions.
            </p>
            <Link
              href={`/tools/seo/platform/${projectId}/competitor-analysis`}
              className="mt-3 inline-block text-sm font-semibold text-[#4f46e5]"
            >
              Add competitors →
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Top keywords</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {(dashboard.top_keywords.length ? dashboard.top_keywords : filteredKeywords.slice(0, 5)).map(
                (k) => (
                  <li key={k.keyword_id} className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="truncate pr-2">{k.phrase}</span>
                    <span className="font-semibold">{k.position ?? "—"}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-700">Positive impact</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {dashboard.positive_impact.length === 0 ? (
                <li className="text-slate-500">No gains yet</li>
              ) : (
                dashboard.positive_impact.map((k) => (
                  <li key={k.keyword_id} className="flex justify-between">
                    <span className="truncate pr-2">{k.phrase}</span>
                    <span className="text-emerald-600">+{k.position_change}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-red-700">Negative impact</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {dashboard.negative_impact.length === 0 ? (
                <li className="text-slate-500">No drops yet</li>
              ) : (
                dashboard.negative_impact.map((k) => (
                  <li key={k.keyword_id} className="flex justify-between">
                    <span className="truncate pr-2">{k.phrase}</span>
                    <span className="text-red-600">{k.position_change}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
            <h3 className="mb-2 text-sm font-bold text-slate-900">Pages</h3>
            {dashboard.pages.length === 0 ? (
              <p className="text-sm text-slate-500">
                Ranking URLs appear when positions are logged with a URL (SERP provider) or you set target URLs on
                keywords.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-2">URL</th>
                      <th className="p-2">Keywords</th>
                      <th className="p-2">Avg. position</th>
                      <th className="p-2">Est. traffic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.pages.map((p) => (
                      <tr key={p.url} className="border-t border-slate-100">
                        <td className="max-w-md truncate p-2 text-[#4f46e5]">{p.url}</td>
                        <td className="p-2">{p.keywords}</td>
                        <td className="p-2">{p.avg_position ?? "—"}</td>
                        <td className="p-2">{p.est_traffic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 lg:col-span-3">
            <h3 className="text-sm font-bold text-slate-800">Cannibalization · Tags · SERP features</h3>
            <p className="mt-1 text-sm text-slate-500">
              Tag keywords in Keyword Research to group campaigns. Cannibalization and SERP feature tracking require a
              connected SERP provider.
            </p>
          </div>
        </div>
      ) : null}

      {tab === "overview" && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap gap-1">
            {METRIC_TABS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setChartMetric(m.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  chartMetric === m.id
                    ? "bg-[#4f46e5] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-900">{domain}</span> · {metricLabel}:{" "}
            <span className="text-lg font-bold text-[#4f46e5]">
              {chartMetric === "visibility" || chartMetric === "share_of_voice"
                ? fmtPct(metricValue as number)
                : fmtNum(metricValue as number)}
            </span>
          </p>
          <div className="mt-3 h-64">
            {chartData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                Log at least two position checks on different days to see the trend line.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={chartMetric}
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={metricLabel}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {tab === "overview" && (
        <div>
          <h3 className="mb-2 text-sm font-bold text-slate-900">
            Rankings overview 1–{filteredKeywords.length} ({filteredKeywords.length})
          </h3>
          <RankingsTable rows={filteredKeywords} dateLabel="Updated" />
        </div>
      )}

      {tab === "distribution" && dashboard && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">How your keywords rank</h3>
          <DistributionChart data={dashboard.distribution} />
        </div>
      )}

      {tab === "pages" && dashboard && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-slate-900">Pages in rankings</h3>
          {dashboard.pages.length === 0 ? (
            <p className="text-sm text-slate-500">No ranking URLs recorded yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-2">URL</th>
                  <th className="p-2">Keywords</th>
                  <th className="p-2">Avg. position</th>
                  <th className="p-2">Est. traffic</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.pages.map((p) => (
                  <tr key={p.url} className="border-t border-slate-100">
                    <td className="max-w-lg truncate p-2">{p.url}</td>
                    <td className="p-2">{p.keywords}</td>
                    <td className="p-2">{p.avg_position ?? "—"}</td>
                    <td className="p-2">{p.est_traffic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "tags" && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <p className="text-sm font-semibold text-slate-800">Tags</p>
          <p className="mt-2 text-sm text-slate-500">
            Assign tags to keywords in Keyword Research (group field) to filter campaigns here in a future update.
          </p>
        </div>
      )}
    </>
  );
}
