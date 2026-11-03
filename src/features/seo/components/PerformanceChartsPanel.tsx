"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PerfRow = {
  id: string;
  strategy: string;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  lcp_ms: number | null;
  inp_ms: number | null;
  cls: number | null;
  measured_at: string;
};

function parseRow(raw: Record<string, unknown>): PerfRow {
  const num = (k: string) => {
    const v = raw[k];
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };
  return {
    id: String(raw.id ?? raw._id ?? Math.random()),
    strategy: String(raw.strategy || "mobile"),
    performance_score: Number(raw.performance_score) || 0,
    accessibility_score: Number(raw.accessibility_score) || 0,
    best_practices_score: Number(raw.best_practices_score) || 0,
    seo_score: Number(raw.seo_score) || 0,
    lcp_ms: num("lcp_ms"),
    inp_ms: num("inp_ms"),
    cls: num("cls"),
    measured_at: String(raw.measured_at || ""),
  };
}

function cwvColor(metric: "lcp" | "inp" | "cls", value: number | null): string {
  if (value == null) return "#94a3b8";
  const v = value;
  if (metric === "lcp") {
    if (v <= 2500) return "#10b981";
    if (v <= 4000) return "#f59e0b";
    return "#ef4444";
  }
  if (metric === "inp") {
    if (v <= 200) return "#10b981";
    if (v <= 500) return "#f59e0b";
    return "#ef4444";
  }
  if (v <= 0.1) return "#10b981";
  if (v <= 0.25) return "#f59e0b";
  return "#ef4444";
}

const SCORE_FILL = "#6366f1";

export function PerformanceFlowSteps() {
  const steps = [
    {
      n: "1",
      title: "Run tests",
      text: "Analyze mobile first (most users), then desktop. Each run uses Google PageSpeed on your project URL.",
    },
    {
      n: "2",
      title: "Read the graphs",
      text: "Green = good Core Web Vitals. Compare mobile vs desktop bars. Trend line shows progress over time.",
    },
    {
      n: "3",
      title: "Fix & re-test",
      text: "Work through Lighthouse fixes below, deploy changes, then run again to see scores move.",
    },
  ];
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-3">
      {steps.map((s) => (
        <div key={s.n} className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#4f46e5] text-xs font-bold text-white">
            {s.n}
          </span>
          <h3 className="mt-2 text-sm font-bold text-slate-900">{s.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export function PerformanceChartsPanel({ performance }: { performance: Record<string, unknown>[] }) {
  const rows = useMemo(() => performance.map(parseRow), [performance]);
  const latestMobile = useMemo(() => rows.find((r) => r.strategy === "mobile"), [rows]);
  const latestDesktop = useMemo(() => rows.find((r) => r.strategy === "desktop"), [rows]);
  const focus = latestMobile ?? latestDesktop ?? rows[0];

  const categoryCompare = useMemo(() => {
    const cats = [
      { key: "performance_score" as const, label: "Performance" },
      { key: "accessibility_score" as const, label: "Accessibility" },
      { key: "best_practices_score" as const, label: "Best practices" },
      { key: "seo_score" as const, label: "SEO" },
    ];
    return cats.map((c) => ({
      name: c.label,
      mobile: latestMobile?.[c.key] ?? null,
      desktop: latestDesktop?.[c.key] ?? null,
    }));
  }, [latestMobile, latestDesktop]);

  const cwvBars = useMemo(() => {
    if (!focus) return [];
    const lcp = focus.lcp_ms != null ? focus.lcp_ms / 1000 : null;
    const inp = focus.inp_ms;
    const cls = focus.cls != null ? focus.cls * 100 : null;
    return [
      {
        name: "LCP (s)",
        raw: focus.lcp_ms,
        display: lcp,
        fill: cwvColor("lcp", focus.lcp_ms),
      },
      {
        name: "INP (ms)",
        raw: focus.inp_ms,
        display: inp,
        fill: cwvColor("inp", focus.inp_ms),
      },
      {
        name: "CLS (×100)",
        raw: focus.cls,
        display: cls,
        fill: cwvColor("cls", focus.cls),
      },
    ].filter((d) => d.display != null);
  }, [focus]);

  const trendData = useMemo(() => {
    const sorted = [...rows].sort(
      (a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime(),
    );
    const byDate = new Map<string, { date: string; mobile?: number; desktop?: number }>();
    for (const r of sorted) {
      const date = r.measured_at.slice(0, 10) || "run";
      const entry = byDate.get(date) || { date: date.slice(5) };
      if (r.strategy === "mobile") entry.mobile = r.performance_score;
      else entry.desktop = r.performance_score;
      byDate.set(date, entry);
    }
    return Array.from(byDate.values());
  }, [rows]);

  if (!rows.length) return null;

  return (
    <div className="mb-6 space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Lighthouse scores — mobile vs desktop</h3>
          <p className="text-xs text-slate-500">Latest run per device (0–100)</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryCompare} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="mobile" name="Mobile" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="desktop" name="Desktop" fill="#312e81" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">
            Core Web Vitals snapshot ({focus?.strategy || "latest"})
          </h3>
          <p className="text-xs text-slate-500">Bar length = relative size · color = Good / Needs work / Poor</p>
          <div className="mt-3 h-56">
            {cwvBars.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cwvBars} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(v, _n, p) => {
                      const row = p.payload as { raw: number | null; name: string };
                      if (row.name.startsWith("LCP")) return [`${row.raw} ms`, "LCP"];
                      if (row.name.startsWith("CLS")) return [row.raw?.toFixed(3), "CLS"];
                      return [`${row.raw} ms`, "INP"];
                    }}
                  />
                  <Bar dataKey="display" name="Value">
                    {cwvBars.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">No CWV data in this run.</p>
            )}
          </div>
        </div>
      </div>

      {trendData.length > 1 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">Performance score over time</h3>
          <p className="text-xs text-slate-500">Re-run tests after fixes to see the line go up</p>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="mobile" name="Mobile perf" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="desktop" name="Desktop perf" stroke="#1e1b4b" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
          Run at least two tests (mobile and/or desktop) on different days to see a trend line here.
        </p>
      )}

      <div className="flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Good
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Needs work
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Poor
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: SCORE_FILL }} /> Lighthouse category
        </span>
      </div>
    </div>
  );
}
