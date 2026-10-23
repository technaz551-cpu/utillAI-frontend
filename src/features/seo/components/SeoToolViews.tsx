"use client";

import Link from "next/link";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import {
  ProviderNotice,
  ScoreGauge,
  SectionIntro,
  StatPill,
  ToolTabs,
} from "@/features/seo/components/seo-ui/ToolChrome";
import { SeverityBadge } from "@/features/seo/components/SeverityBadge";
import { KeywordOverviewPanel } from "@/features/seo/components/KeywordOverviewPanel";
import type { KeywordOverview } from "@/features/seo/types/keywordOverview";
import { downloadKeywordCsvTemplate, exportKeywordsToCsv } from "@/features/seo/utils/keywordCsv";
import type {
  DashboardSummary,
  PageDetail,
  PageRow,
  SeoAuditRun,
  SeoIssue,
  SeoKeyword,
  SeoProject,
} from "@/features/seo/types";

function auditStat(
  auditSummary: Record<string, unknown> | null,
  key: string,
  fallback: string | number,
): string | number {
  const v = auditSummary?.[key];
  if (typeof v === "number" || typeof v === "string") return v;
  return fallback;
}

function exportCrawledPagesCsv(pages: PageRow[]) {
  const header =
    "url,title,status_code,issues,depth,incoming_links,blocked_index,word_count";
  const rows = pages.map((p) => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    return [
      esc(p.url),
      esc(p.title || ""),
      p.status_code ?? "",
      p.open_issues_count ?? 0,
      p.depth ?? "",
      p.incoming_links_count ?? 0,
      p.is_noindex ? "noindex" : "ok",
      p.word_count ?? "",
    ].join(",");
  });
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "site-audit-crawled-pages.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function statusPill(code: number | null | undefined) {
  if (code == null || code === 0) return { text: "—", cls: "bg-slate-100 text-slate-600" };
  if (code >= 200 && code < 300) return { text: String(code), cls: "bg-emerald-100 text-emerald-800" };
  if (code >= 300 && code < 400) return { text: String(code), cls: "bg-amber-100 text-amber-900" };
  return { text: String(code), cls: "bg-red-100 text-red-800" };
}

export function SiteAuditView({
  projectId,
  project,
  summary,
  auditSummary,
  audits,
  issues,
  pages,
  error,
  busy,
  onRunAudit,
  onCancelAudit,
  onResolveIssue,
}: {
  projectId: string;
  project: SeoProject | null;
  summary: DashboardSummary | null;
  auditSummary: Record<string, unknown> | null;
  audits: SeoAuditRun[];
  issues: SeoIssue[];
  pages: PageRow[];
  error: string;
  busy: boolean;
  onRunAudit: () => void;
  onCancelAudit: (id: string) => void;
  onResolveIssue: (id: string, status: string) => void;
}) {
  const [tab, setTab] = useState("pages");
  const [pageFilter, setPageFilter] = useState("");
  const [listPage, setListPage] = useState(1);
  const pageSize = 25;
  const latest = audits[0];
  const categories = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of issues) {
      m.set(i.category || "other", (m.get(i.category || "other") || 0) + 1);
    }
    return [...m.entries()];
  }, [issues]);

  const filteredPages = useMemo(() => {
    const q = pageFilter.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.url.toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q) ||
        String(p.status_code || "").includes(q),
    );
  }, [pages, pageFilter]);
  const totalListPages = Math.max(1, Math.ceil(filteredPages.length / pageSize));
  const pageSlice = filteredPages.slice((listPage - 1) * pageSize, listPage * pageSize);

  return (
    <>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Site Audit</p>
            <h2 className="text-xl font-bold text-slate-900">{project?.domain || project?.website_url || "Project"}</h2>
            <p className="mt-1 text-xs text-slate-500">
              Updated: {summary?.last_audit_at?.slice(0, 16).replace("T", ", ") || "Never"}
              {" · "}Mobile crawl
              {" · "}Pages crawled: {latest?.pages_crawled ?? summary?.pages_crawled ?? 0}/
              {latest?.pages_target ?? "—"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onRunAudit}
              className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Starting…" : "Rerun campaign"}
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
              onClick={() => exportCrawledPagesCsv(pages)}
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <ToolTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "issues", label: "Issues" },
          { id: "pages", label: "Crawled Pages" },
          { id: "statistics", label: "Statistics" },
          { id: "history", label: "Progress" },
        ]}
      />
      {tab === "overview" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <StatPill label="Health score" value={summary?.health_score ?? "—"} />
            <StatPill
              label="Open issues"
              value={auditStat(auditSummary, "open_issues", summary?.open_issues ?? 0)}
            />
            <StatPill
              label="Pages crawled"
              value={auditStat(auditSummary, "pages_crawled", summary?.pages_crawled ?? 0)}
            />
            <StatPill
              label="Indexable"
              value={auditStat(auditSummary, "indexable_pages", summary?.indexable_pages ?? 0)}
            />
          </div>
          {auditSummary?.broken_pages != null ? (
            <StatPill label="Broken pages (4xx/5xx)" value={String(auditSummary.broken_pages)} />
          ) : null}
        </div>
      ) : null}
      {tab === "issues" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {categories.map(([cat, n]) => (
              <span key={cat} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize">
                {cat} ({n})
              </span>
            ))}
          </div>
          {issues.map((issue) => (
            <div key={issue.id} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={issue.severity} />
                <span className="font-semibold">{issue.title}</span>
              </div>
              <p className="mt-1 break-all text-xs text-slate-500">{issue.url}</p>
              <p className="mt-2 text-slate-600">{issue.recommendation}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800" onClick={() => onResolveIssue(issue.id, "resolved")}>
                  Mark fixed
                </button>
                <button type="button" className="rounded-md bg-slate-100 px-2 py-1 text-xs" onClick={() => onResolveIssue(issue.id, "ignored")}>
                  Ignore
                </button>
              </div>
            </div>
          ))}
          {issues.length === 0 ? <p className="text-sm text-slate-500">No open issues. Run an audit first.</p> : null}
        </div>
      ) : null}
      {tab === "pages" ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
            <input
              className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Find pages by URL or title…"
              value={pageFilter}
              onChange={(e) => {
                setPageFilter(e.target.value);
                setListPage(1);
              }}
            />
            <Link
              href={`/tools/seo/platform/${projectId}/url-inspection`}
              className="text-xs font-semibold text-[#4f46e5]"
            >
              URL Inspection →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Page URL</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Issues</th>
                  <th className="p-2">Blocked</th>
                  <th className="p-2">Depth</th>
                  <th className="p-2">Incoming</th>
                  <th className="p-2" />
                </tr>
              </thead>
              <tbody>
                {pageSlice.map((p, idx) => {
                  const st = statusPill(p.status_code);
                  return (
                    <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                      <td className="p-2 text-slate-400">{(listPage - 1) * pageSize + idx + 1}</td>
                      <td className="max-w-[220px] p-2">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 truncate text-[#4f46e5] hover:underline"
                        >
                          <span className="truncate">{p.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                      <td className="max-w-[160px] truncate p-2">{p.title || "—"}</td>
                      <td className="p-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>{st.text}</span>
                      </td>
                      <td className="p-2">
                        {(p.open_issues_count ?? 0) > 0 ? (
                          <button
                            type="button"
                            className="font-semibold text-[#4f46e5] hover:underline"
                            onClick={() => setTab("issues")}
                          >
                            {p.open_issues_count} issue{(p.open_issues_count ?? 0) > 1 ? "s" : ""}
                          </button>
                        ) : (
                          <span className="text-emerald-600">Healthy</span>
                        )}
                      </td>
                      <td className="p-2 text-xs">{p.is_noindex ? "Noindex" : "—"}</td>
                      <td className="p-2 text-xs">
                        {p.depth != null ? `${p.depth} click${p.depth === 1 ? "" : "s"}` : "—"}
                      </td>
                      <td className="p-2">{p.incoming_links_count ?? "—"}</td>
                      <td className="p-2">
                        <Link
                          href={`/tools/seo/platform/${projectId}/url-inspection`}
                          className="inline-flex rounded p-1 text-slate-500 hover:bg-slate-100"
                          title="Inspect URL"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pages.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No crawled pages yet — run a campaign.</p>
          ) : (
            <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-xs text-slate-600">
              <span>
                Page {listPage} of {totalListPages} · {filteredPages.length} URLs
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={listPage <= 1}
                  className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
                  onClick={() => setListPage((n) => Math.max(1, n - 1))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={listPage >= totalListPages}
                  className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
                  onClick={() => setListPage((n) => Math.min(totalListPages, n + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {tab === "statistics" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatPill label="Total URLs" value={pages.length} />
          <StatPill label="Broken (4xx+)" value={pages.filter((p) => (p.status_code ?? 0) >= 400).length} />
          <StatPill label="Noindex" value={pages.filter((p) => p.is_noindex).length} />
          <StatPill label="With open issues" value={pages.filter((p) => (p.open_issues_count ?? 0) > 0).length} />
          <StatPill label="Depth 0 (home)" value={pages.filter((p) => p.depth === 0).length} />
        </div>
      ) : null}
      {tab === "history" ? (
        <ul className="space-y-2 text-sm">
          {audits.map((a) => (
            <li key={a.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-slate-200 px-4 py-3">
              <span>
                {a.status} · {a.pages_crawled}/{a.pages_target} pages · {a.issues_found} issues · score {a.health_score ?? "—"}
              </span>
              {(a.status === "pending" || a.status === "running") && (
                <button type="button" className="text-xs font-semibold text-red-600" onClick={() => onCancelAudit(a.id)}>
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function PageDetailPanel({ pageDetail }: { pageDetail: PageDetail }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 text-sm">
      <h3 className="font-bold">{pageDetail.title || "Untitled"}</h3>
      <p className="mt-1 break-all text-xs text-slate-500">{pageDetail.url}</p>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">HTTP status</dt>
          <dd className="font-medium">{pageDetail.status_code ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Response time</dt>
          <dd>{pageDetail.response_time_ms != null ? `${pageDetail.response_time_ms} ms` : "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Word count</dt>
          <dd>{pageDetail.word_count ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Index</dt>
          <dd>{pageDetail.is_noindex ? "Noindex" : "Indexable"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-slate-500">Robots meta</dt>
          <dd>{pageDetail.robots_meta || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-slate-500">Canonical</dt>
          <dd className="break-all">{pageDetail.canonical || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-slate-500">Meta description</dt>
          <dd>{pageDetail.meta_description || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-slate-500">H1</dt>
          <dd>{(pageDetail.h1 || []).join(" · ") || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Internal links</dt>
          <dd>{pageDetail.internal_links_count}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Images missing alt</dt>
          <dd>{pageDetail.images_missing_alt}</dd>
        </div>
        {(pageDetail.structured_data_types?.length ?? 0) > 0 ? (
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">Structured data</dt>
            <dd>{pageDetail.structured_data_types.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
      {pageDetail.recommendations?.length ? (
        <>
          <h4 className="mt-4 font-semibold">Fix recommendations</h4>
          <ul className="mt-1 list-disc pl-5 text-slate-600">
            {pageDetail.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function httpStatusLabel(code: number | null | undefined): { text: string; className: string } {
  if (code == null) return { text: "—", className: "bg-slate-100 text-slate-600" };
  if (code >= 200 && code < 300) return { text: String(code), className: "bg-emerald-100 text-emerald-800" };
  if (code >= 300 && code < 400) return { text: String(code), className: "bg-amber-100 text-amber-900" };
  return { text: String(code), className: "bg-red-100 text-red-800" };
}

function onPageRowStatus(
  page: PageRow,
  openIssues: number,
): { label: string; className: string } {
  if (page.status_code != null && page.status_code >= 400) {
    return { label: "Error", className: "bg-red-100 text-red-800" };
  }
  if (page.is_noindex) {
    return { label: "Noindex", className: "bg-amber-100 text-amber-900" };
  }
  if (openIssues > 0 || !page.title || (page.word_count ?? 0) < 120) {
    return { label: "Needs work", className: "bg-orange-100 text-orange-900" };
  }
  return { label: "Good", className: "bg-emerald-100 text-emerald-800" };
}

export function UrlInspectionView({
  pages,
  pageDetail,
  onSelectPage,
  inspectUrl,
  onInspectUrlChange,
  onLookupUrl,
}: {
  pages: PageRow[];
  pageDetail: PageDetail | null;
  onSelectPage: (id: string) => void;
  inspectUrl: string;
  onInspectUrlChange: (v: string) => void;
  onLookupUrl: () => void;
}) {
  const filtered = inspectUrl.trim()
    ? pages.filter((p) => p.url.toLowerCase().includes(inspectUrl.toLowerCase()))
    : pages;
  return (
    <>
      <SectionIntro
        title="URL Inspection"
        description="Check a URL’s HTTP status, indexability, canonical, robots meta, title, description, and on-page recommendations from the latest crawl."
      />
      <div className="mb-4 flex gap-2">
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Paste full URL or path to inspect…"
          value={inspectUrl}
          onChange={(e) => onInspectUrlChange(e.target.value)}
        />
        <button type="button" className="shrink-0 rounded-xl bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white" onClick={onLookupUrl}>
          Inspect
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="max-h-96 overflow-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-2">URL</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-2">
                    <button type="button" className="text-left text-[#4f46e5]" onClick={() => onSelectPage(p.id)}>
                      {p.url.length > 56 ? `${p.url.slice(0, 56)}…` : p.url}
                    </button>
                  </td>
                  <td className="p-2">{p.status_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageDetail ? (
          <PageDetailPanel pageDetail={pageDetail} />
        ) : (
          <p className="text-sm text-slate-500">Select a URL from the list (run Site Audit first).</p>
        )}
      </div>
    </>
  );
}

const KEYWORD_IMPROVEMENT_GUIDE: { title: string; items: string[] }[] = [
  {
    title: "Build a focused keyword list",
    items: [
      "Group keywords by topic (services, locations, brand) using the group column in CSV.",
      "Prioritize 20–50 core terms first; expand after you track rankings.",
      "Include brand, product, and problem-based queries (how to / best / vs).",
    ],
  },
  {
    title: "Match keywords to pages",
    items: [
      "Assign one primary keyword per URL; avoid targeting the same phrase on many pages.",
      "Use On-Page SEO and Site Audit to fix titles and meta descriptions for target phrases.",
      "Track positions in Rank Tracking after you map keywords to landing pages.",
    ],
  },
  {
    title: "When you connect a keyword provider",
    items: [
      "Sort by volume and difficulty — target realistic KD for your domain authority.",
      "Use intent (informational vs commercial) to pick blog vs product pages.",
      "Refresh the list quarterly; drop zero-value or duplicate phrases.",
    ],
  },
];

export function KeywordResearchView({
  projectId,
  keywords,
  searchPhrase,
  onSearchPhraseChange,
  onAnalyzeKeyword,
  overview,
  overviewLoading,
  bulkText,
  onBulkChange,
  onAnalyze,
  onImportCsv,
  importMessage,
  country,
  onCountryChange,
}: {
  projectId: string;
  keywords: SeoKeyword[];
  searchPhrase: string;
  onSearchPhraseChange: (v: string) => void;
  onAnalyzeKeyword: (phrase?: string) => void;
  overview: KeywordOverview | null;
  overviewLoading: boolean;
  bulkText: string;
  onBulkChange: (v: string) => void;
  onAnalyze: () => void;
  onImportCsv: (file: File) => void;
  importMessage: string;
  country: string;
  onCountryChange: (v: string) => void;
}) {
  const [tab, setTab] = useState<"overview" | "list" | "import">("overview");

  return (
    <>
      <SectionIntro
        title="Keyword Overview"
        description="Semrush-style overview: volume, KD, intent, variations, SERP table, and CSV import/export. Live volume/SERP metrics require a provider — we never invent numbers."
      />

      <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <select
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          <option value="worldwide">Worldwide</option>
          <option value="US">United States</option>
          <option value="PK">Pakistan</option>
          <option value="UK">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="IN">India</option>
        </select>
        <input
          className="min-w-[200px] flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium"
          placeholder="Enter keyword to analyze…"
          value={searchPhrase}
          onChange={(e) => onSearchPhraseChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAnalyzeKeyword();
          }}
        />
        <button
          type="button"
          className="rounded-xl bg-[#4f46e5] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#4338ca]"
          onClick={() => onAnalyzeKeyword()}
        >
          Analyze
        </button>
      </div>

      <ToolTabs
        active={tab}
        onChange={(id) => setTab(id as "overview" | "list" | "import")}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "list", label: `Keyword list (${keywords.length})` },
          { id: "import", label: "Import / bulk" },
        ]}
      />

      {tab === "overview" ? (
        <KeywordOverviewPanel projectId={projectId} overview={overview} loading={overviewLoading} />
      ) : null}

      {tab === "list" ? (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
              onClick={() => exportKeywordsToCsv(keywords)}
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">Keyword</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">KD</th>
                  <th className="p-3">Intent</th>
                  <th className="p-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k) => (
                  <tr key={k.id} className="border-t border-slate-100">
                    <td className="p-3 font-medium">
                      <button
                        type="button"
                        className="text-left text-[#4f46e5] hover:underline"
                        onClick={() => {
                          onSearchPhraseChange(k.phrase);
                          setTab("overview");
                          onAnalyzeKeyword(k.phrase);
                        }}
                      >
                        {k.phrase}
                      </button>
                    </td>
                    <td className="p-3">{k.search_volume ?? "n/a"}</td>
                    <td className="p-3">{k.difficulty ?? "n/a"}</td>
                    <td className="p-3">—</td>
                    <td className="p-3 text-xs">{k.data_source || "manual"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {keywords.length === 0 ? <p className="p-4 text-sm text-slate-500">No keywords saved yet.</p> : null}
          </div>
        </>
      ) : null}

      {tab === "import" ? (
        <>
      <ProviderNotice>
        Connect a keyword API in Settings for volume, KD%, intent, and trends (Semrush/Ahrefs/DataForSEO).
      </ProviderNotice>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={country} onChange={(e) => onCountryChange(e.target.value)}>
          <option value="worldwide">Worldwide</option>
          <option value="US">United States</option>
          <option value="PK">Pakistan</option>
          <option value="UK">United Kingdom</option>
          <option value="AU">Australia</option>
        </select>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => downloadKeywordCsvTemplate()}
        >
          Download CSV template
        </button>
        <label className="cursor-pointer rounded-lg bg-[#4f46e5] px-3 py-2 text-sm font-semibold text-white hover:bg-[#4338ca]">
          Import CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportCsv(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="mb-2 text-xs text-slate-500">
        CSV: first row may be header with column <strong>keyword</strong> or <strong>phrase</strong>; otherwise first column is used. Max 100 keywords per import batch (large files import in batches).
      </p>
      {importMessage ? (
        <p className={`mb-2 text-sm ${importMessage.startsWith("Imported") ? "text-emerald-700" : "text-red-600"}`}>
          {importMessage}
        </p>
      ) : null}
      <textarea
        className="min-h-[120px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        placeholder="Enter keywords (one per line), e.g.&#10;ims&#10;ims pro"
        value={bulkText}
        onChange={(e) => onBulkChange(e.target.value)}
      />
      <button type="button" className="mt-2 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white" onClick={onAnalyze}>
        Save keywords
      </button>

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900">How to improve keyword research</h3>
        <div className="mt-4 space-y-4">
          {KEYWORD_IMPROVEMENT_GUIDE.map((block) => (
            <div key={block.title}>
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#4f46e5]">{block.title}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm">
          <Link href={`/tools/seo/platform/${projectId}/rank-tracking`} className="font-semibold text-[#4f46e5]">
            Rank Tracking →
          </Link>
          <Link href={`/tools/seo/platform/${projectId}/on-page-seo`} className="font-semibold text-[#4f46e5]">
            On-Page SEO →
          </Link>
          <Link href={`/tools/seo/platform/${projectId}/settings`} className="font-semibold text-[#4f46e5]">
            Settings (integrations) →
          </Link>
        </div>
      </div>
        </>
      ) : null}
    </>
  );
}

export function RankTrackingView({
  keywords,
  rankings,
  trackedRows,
  rankSummary,
  rankPhrase,
  rankPos,
  country,
  device,
  onPhrase,
  onPos,
  onCountry,
  onDevice,
  onLog,
}: {
  keywords: SeoKeyword[];
  rankings: Record<string, unknown>[];
  trackedRows: Record<string, unknown>[];
  rankSummary: Record<string, unknown> | null;
  rankPhrase: string;
  rankPos: string;
  country: string;
  device: string;
  onPhrase: (v: string) => void;
  onPos: (v: string) => void;
  onCountry: (v: string) => void;
  onDevice: (v: string) => void;
  onLog: () => void;
}) {
  const kwMap = useMemo(() => new Map(keywords.map((k) => [k.id, k.phrase])), [keywords]);
  return (
    <>
      <SectionIntro
        title="Rank Tracking"
        description="Track Google positions for selected keywords, ranking URL, and changes over time. Use manual logs now; connect a SERP provider for daily automated checks."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        {(["top_3", "top_10", "top_20"] as const).map((k) => (
          <StatPill key={k} label={k.replace("_", " ")} value={String(rankSummary?.[k] ?? 0)} />
        ))}
        <StatPill label="Keywords" value={keywords.length} />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="rounded-lg border border-slate-200 px-2 py-2 text-sm" value={country} onChange={(e) => onCountry(e.target.value)}>
          <option value="worldwide">Country</option>
          <option value="US">US</option>
          <option value="PK">PK</option>
        </select>
        <select className="rounded-lg border border-slate-200 px-2 py-2 text-sm" value={device} onChange={(e) => onDevice(e.target.value)}>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
        <input className="min-w-[140px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Keyword" value={rankPhrase} onChange={(e) => onPhrase(e.target.value)} />
        <input className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Pos" value={rankPos} onChange={(e) => onPos(e.target.value)} />
        <button type="button" className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white" onClick={onLog}>
          Log position
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Keyword</th>
              <th className="p-3">Position</th>
              <th className="p-3">Change</th>
              <th className="p-3">Previous</th>
              <th className="p-3">Device</th>
              <th className="p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {(trackedRows.length ? trackedRows : rankings.slice(0, 50)).map((r, i) => {
              const change = r.position_change as number | null | undefined;
              return (
                <tr key={String(r.id || r.keyword_id || i)} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{String(r.phrase || kwMap.get(String(r.keyword_id)) || "—")}</td>
                  <td className="p-3 font-semibold">{r.position == null ? "—" : String(r.position)}</td>
                  <td className="p-3">
                    {change == null ? "—" : change > 0 ? (
                      <span className="text-emerald-600">+{change}</span>
                    ) : change < 0 ? (
                      <span className="text-red-600">{change}</span>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="p-3">{r.previous_position == null ? "—" : String(r.previous_position)}</td>
                  <td className="p-3">{String(r.device || "desktop")}</td>
                  <td className="p-3 text-xs">{r.recorded_at ? String(r.recorded_at).slice(0, 10) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function CompetitorAnalysisView({
  competitors,
  gapMessage,
  compDomain,
  onDomain,
  onAdd,
  onRemove,
}: {
  competitors: Record<string, unknown>[];
  gapMessage: string | null;
  compDomain: string;
  onDomain: (v: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <>
      <SectionIntro
        title="Competitor Analysis"
        description="Add competitor domains, compare keywords, top pages, content gaps, backlinks, and traffic estimates when a market data provider is connected."
      />
      {gapMessage ? <ProviderNotice>{gapMessage}</ProviderNotice> : null}
      <div className="mb-6 flex flex-wrap gap-2">
        <input className="min-w-[200px] flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="competitor.com" value={compDomain} onChange={(e) => onDomain(e.target.value)} />
        <button type="button" className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white" onClick={onAdd}>
          Add competitor
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {["Keywords compare", "Top pages", "Content gaps", "Backlink compare"].map((title) => (
          <div key={title} className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-sm">
            <p className="font-bold text-slate-800">{title}</p>
            <p className="mt-1 text-slate-500">Available after SERP/backlink provider integration.</p>
          </div>
        ))}
      </div>
      <h4 className="mb-2 mt-6 text-sm font-bold">Your competitors</h4>
      <ul className="space-y-2">
        {competitors.map((c) => (
          <li key={String(c.id)} className="flex justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm">
            <span className="font-medium">{String(c.domain)}</span>
            <button type="button" className="text-xs text-red-600" onClick={() => onRemove(String(c.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export function BacklinkAnalysisView({
  backlinks,
  summary,
  blSource,
  blTarget,
  blAnchor,
  blRel,
  onSource,
  onTarget,
  onAnchor,
  onRel,
  onAdd,
}: {
  backlinks: Record<string, unknown>[];
  summary: DashboardSummary | null;
  blSource: string;
  blTarget: string;
  blAnchor: string;
  blRel: string;
  onSource: (v: string) => void;
  onTarget: (v: string) => void;
  onAnchor: (v: string) => void;
  onRel: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <>
      <SectionIntro
        title="Backlink Analysis"
        description="Monitor backlinks, referring domains, anchor text, follow/nofollow, and new or lost links. Import via API/CSV or add manually."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatPill label="Total backlinks" value={summary?.backlinks_count ?? 0} />
        <StatPill label="Referring domains" value={summary?.referring_domains ?? 0} />
        <StatPill label="New/lost tracking" value="Manual" />
      </div>
      <ProviderNotice>Automated new/lost link detection requires a backlink index provider.</ProviderNotice>
      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Source URL (referring page)" value={blSource} onChange={(e) => onSource(e.target.value)} />
        <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Target URL (your page)" value={blTarget} onChange={(e) => onTarget(e.target.value)} />
        <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Anchor text" value={blAnchor} onChange={(e) => onAnchor(e.target.value)} />
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={blRel} onChange={(e) => onRel(e.target.value)}>
          <option value="follow">Follow</option>
          <option value="nofollow">Nofollow</option>
        </select>
      </div>
      <button type="button" className="mb-4 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white" onClick={onAdd}>
        Add backlink
      </button>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Source</th>
              <th className="p-3">Target</th>
              <th className="p-3">Anchor</th>
              <th className="p-3">Rel</th>
            </tr>
          </thead>
          <tbody>
            {backlinks.map((b) => (
              <tr key={String(b.id)} className="border-t border-slate-100">
                <td className="max-w-xs truncate p-3">{String(b.source_url)}</td>
                <td className="max-w-xs truncate p-3">{String(b.target_url)}</td>
                <td className="p-3">{String(b.anchor_text || "—")}</td>
                <td className="p-3">{String(b.rel || "follow")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

type CwvStatus = "good" | "needs_improvement" | "poor" | "unknown";

function cwvStatus(
  metric: "lcp" | "inp" | "cls" | "fcp" | "ttfb",
  value: number | null | undefined,
): CwvStatus {
  if (value == null || Number.isNaN(value)) return "unknown";
  const v = Number(value);
  if (metric === "lcp") {
    if (v <= 2500) return "good";
    if (v <= 4000) return "needs_improvement";
    return "poor";
  }
  if (metric === "inp") {
    if (v <= 200) return "good";
    if (v <= 500) return "needs_improvement";
    return "poor";
  }
  if (metric === "cls") {
    if (v <= 0.1) return "good";
    if (v <= 0.25) return "needs_improvement";
    return "poor";
  }
  if (metric === "fcp") {
    if (v <= 1800) return "good";
    if (v <= 3000) return "needs_improvement";
    return "poor";
  }
  if (v <= 800) return "good";
  if (v <= 1800) return "needs_improvement";
  return "poor";
}

function CwvBadge({ status }: { status: CwvStatus }) {
  const map = {
    good: "bg-emerald-100 text-emerald-800",
    needs_improvement: "bg-amber-100 text-amber-900",
    poor: "bg-red-100 text-red-800",
    unknown: "bg-slate-100 text-slate-600",
  };
  const label = {
    good: "Good",
    needs_improvement: "Needs work",
    poor: "Poor",
    unknown: "—",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${map[status]}`}>
      {label[status]}
    </span>
  );
}

const WHOLE_SITE_PERFORMANCE_GUIDE: { title: string; items: string[] }[] = [
  {
    title: "Core Web Vitals (whole site)",
    items: [
      "Fix the slowest templates first (homepage, top landing pages, checkout) — one theme fix improves every URL using it.",
      "Set explicit width/height on images and embeds sitewide to cut CLS.",
      "Preload the LCP image/font on key templates; avoid lazy-loading above-the-fold hero media.",
      "Reduce main-thread JavaScript: defer non-critical scripts, remove unused plugins/widgets.",
    ],
  },
  {
    title: "Server, CDN & caching",
    items: [
      "Enable HTTPS, HTTP/2 or HTTP/3, and Brotli/Gzip compression on the origin or CDN.",
      "Use a CDN for static assets globally; cache HTML carefully with short TTL or edge rules.",
      "Improve TTFB: upgrade hosting, enable object cache (Redis), optimize DB queries on CMS pages.",
      "Set long cache headers for versioned CSS/JS/images (cache-bust via filename).",
    ],
  },
  {
    title: "Images & media",
    items: [
      "Convert large images to WebP/AVIF; serve responsive srcset sizes, not one huge file everywhere.",
      "Lazy-load below-the-fold images; compress without visible quality loss.",
      "Do not autoplay heavy video on mobile; use poster images and load video on interaction.",
    ],
  },
  {
    title: "CSS, fonts & JavaScript",
    items: [
      "Inline critical CSS for above-the-fold; load the rest asynchronously.",
      "Subset fonts, use font-display: swap, and limit font families/weights site-wide.",
      "Split bundles, tree-shake, and remove legacy jQuery/widgets if unused on most pages.",
    ],
  },
  {
    title: "SEO + performance together (UTILAI)",
    items: [
      "Run Site Audit — fix broken links (4xx/5xx) and redirect chains; they waste crawl budget and slow users.",
      "Fix noindex/canonical mistakes in On-Page SEO so Google crawls the right URLs once.",
      "Keep pages lean in Content SEO — thin or duplicate pages often load unnecessary assets.",
    ],
  },
];

export function PerformanceView({
  projectId,
  performance,
  error,
  onRunMobile,
  onRunDesktop,
}: {
  projectId: string;
  performance: Record<string, unknown>[];
  error: string;
  onRunMobile: () => void;
  onRunDesktop: () => void;
}) {
  const latest = performance[0];
  const opportunities = (latest?.improvement_opportunities as Record<string, unknown>[] | undefined) ?? [];

  return (
    <>
      <SectionIntro
        title="Website Performance"
        description="Measure with PageSpeed Insights, then apply sitewide fixes — scores below are for your homepage URL but the playbook below improves the whole site."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white" onClick={onRunMobile}>
          Analyze (mobile)
        </button>
        <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold" onClick={onRunDesktop}>
          Analyze (desktop)
        </button>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {latest ? (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
            <ScoreGauge score={Number(latest.performance_score)} label="Performance" />
            <ScoreGauge score={Number(latest.accessibility_score)} label="Accessibility" />
            <ScoreGauge score={Number(latest.best_practices_score)} label="Best practices" />
            <ScoreGauge score={Number(latest.seo_score)} label="SEO" />
            <StatPill label="Strategy" value={String(latest.strategy)} />
          </div>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                ["LCP", latest.lcp_ms, "lcp", "ms"],
                ["INP", latest.inp_ms, "inp", "ms"],
                ["CLS", latest.cls, "cls", ""],
                ["FCP", latest.fcp_ms, "fcp", "ms"],
                ["TTFB", latest.ttfb_ms, "ttfb", "ms"],
              ] as const
            ).map(([label, raw, key, unit]) => {
              const num = raw == null ? null : Number(raw);
              const status = cwvStatus(key, num);
              return (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">{label}</span>
                    <CwvBadge status={status} />
                  </div>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {num == null || Number.isNaN(num) ? "—" : key === "cls" ? num.toFixed(3) : `${Math.round(num)}${unit}`}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <ProviderNotice>
          Run mobile and desktop analysis to see scores, Core Web Vitals, and Lighthouse-specific fixes for your site URL.
        </ProviderNotice>
      )}

      {opportunities.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5">
          <h3 className="text-sm font-bold text-slate-900">Lighthouse fixes (from latest run)</h3>
          <p className="mt-1 text-xs text-slate-600">
            Prioritized from Google PageSpeed — apply these template-level changes to improve the whole website.
          </p>
          <ul className="mt-4 max-h-80 space-y-3 overflow-auto text-sm">
            {opportunities.map((o) => (
              <li key={String(o.id)} className="rounded-lg border border-white bg-white/90 p-3">
                <p className="font-semibold text-slate-900">{String(o.title)}</p>
                {o.score != null ? (
                  <p className="text-xs text-slate-500">Audit score: {String(o.score)}</p>
                ) : null}
                {o.savings_ms ? (
                  <p className="text-xs font-medium text-emerald-700">Est. savings ~{String(o.savings_ms)} ms</p>
                ) : null}
                {o.description ? (
                  <p className="mt-1 text-xs text-slate-600 line-clamp-4">{String(o.description)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900">How to improve the whole website</h3>
        <p className="mt-1 text-xs text-slate-500">
          Sitewide checklist — not only the tested URL. Roll out on your CMS/theme/CDN so every page benefits.
        </p>
        <div className="mt-4 space-y-4">
          {WHOLE_SITE_PERFORMANCE_GUIDE.map((block) => (
            <div key={block.title}>
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#4f46e5]">{block.title}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm">
          <Link href={`/tools/seo/platform/${projectId}/site-audit`} className="font-semibold text-[#4f46e5]">
            Site Audit (broken links &amp; redirects) →
          </Link>
          <Link href={`/tools/seo/platform/${projectId}/on-page-seo`} className="font-semibold text-[#4f46e5]">
            On-Page SEO →
          </Link>
        </div>
      </div>

      <h3 className="mb-2 text-sm font-bold text-slate-800">Run history</h3>
      <ul className="space-y-2 text-sm">
        {performance.map((row) => (
          <li key={String(row.id)} className="rounded-lg border border-slate-200 p-3">
            {String(row.strategy)} · Perf {String(row.performance_score)} · LCP {String(row.lcp_ms)}ms · CLS{" "}
            {String(row.cls)} · SEO {String(row.seo_score ?? "—")}
          </li>
        ))}
        {performance.length === 0 ? <li className="text-slate-500">No runs yet.</li> : null}
      </ul>
    </>
  );
}

export function AiSearchVisibilityView({
  project,
  checks,
  question,
  onQuestion,
  onLog,
}: {
  project: SeoProject | null;
  checks: Record<string, unknown>[];
  question: string;
  onQuestion: (v: string) => void;
  onLog: (payload: { brand_mentioned: boolean; website_linked: boolean }) => void;
}) {
  const brand = project?.brand_name || project?.domain || "your brand";
  return (
    <>
      <SectionIntro
        title="AI Search Visibility"
        description={`Log whether AI answers (e.g. ChatGPT) mention ${brand} or link to your site for important questions. Track competitors over time manually until an AI monitoring API is connected.`}
      />
      <p className="mb-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
        Example: “Best insurance management software?” — does the answer include <strong>{brand}</strong> or your URL?
      </p>
      <textarea
        className="min-h-[80px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        placeholder="Enter a question to track…"
        value={question}
        onChange={(e) => onQuestion(e.target.value)}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white" onClick={() => onLog({ brand_mentioned: true, website_linked: true })}>
          Brand + link seen
        </button>
        <button type="button" className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white" onClick={() => onLog({ brand_mentioned: true, website_linked: false })}>
          Brand only
        </button>
        <button type="button" className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white" onClick={() => onLog({ brand_mentioned: false, website_linked: false })}>
          Not mentioned
        </button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Question</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Link</th>
              <th className="p-3">Checked</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((c) => (
              <tr key={String(c.id)} className="border-t border-slate-100">
                <td className="p-3">{String(c.question)}</td>
                <td className="p-3">{c.brand_mentioned ? "Yes" : "No"}</td>
                <td className="p-3">{c.website_linked ? "Yes" : "No"}</td>
                <td className="p-3 text-xs">{String(c.checked_at).slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function ContentSeoView({ pages, issues }: { pages: PageRow[]; issues: SeoIssue[] }) {
  const thin = pages.filter((p) => (p.word_count ?? 0) < 120);
  const dupTitles = issues.filter((i) => i.issue_type.includes("duplicate") || i.title.toLowerCase().includes("duplicate"));
  return (
    <>
      <SectionIntro
        title="Content SEO"
        description="Find thin content, duplicate pages, and topic gaps from crawl data. Use recommendations to improve existing pages."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatPill label="Thin pages (&lt;120 words)" value={thin.length} />
        <StatPill label="Duplicate-related issues" value={dupTitles.length} />
        <StatPill label="Total crawled pages" value={pages.length} />
      </div>
      <h4 className="mb-2 text-sm font-bold">Thin content URLs</h4>
      <ul className="mb-6 max-h-48 space-y-1 overflow-auto text-sm">
        {thin.map((p) => (
          <li key={p.id} className="truncate text-[#4f46e5]">{p.url}</li>
        ))}
        {thin.length === 0 ? <li className="text-slate-500">None detected.</li> : null}
      </ul>
      <h4 className="mb-2 text-sm font-bold">Content recommendations (from issues)</h4>
      <ul className="space-y-2 text-sm">
        {issues.slice(0, 15).map((i) => (
          <li key={i.id} className="rounded-lg border border-slate-100 px-3 py-2">{i.title} — <span className="text-slate-500">{i.recommendation}</span></li>
        ))}
      </ul>
    </>
  );
}

export function OnPageSeoView({ issues, pages, onSelectPage, pageDetail }: {
  issues: SeoIssue[];
  pages: PageRow[];
  onSelectPage: (id: string) => void;
  pageDetail: PageDetail | null;
}) {
  const issuesByUrl = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of issues) {
      const u = (i.url || "").split("?")[0];
      m.set(u, (m.get(u) || 0) + 1);
    }
    return m;
  }, [issues]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <SectionIntro
        title="On-Page SEO"
        description="Every crawled URL with HTTP status and on-page health. Click a row for full crawl detail (title, meta, headings, links). Run Site Audit if the list is empty."
      />
      <ProviderNotice>
        Crawler stores full HTML signals in the database. This table shows all pages from the latest audit; detailed fields load when you select a URL (same data as URL Inspection).
      </ProviderNotice>
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatPill label="Crawled pages" value={pages.length} />
        <StatPill label="Open on-page issues" value={issues.length} />
        <StatPill
          label="Missing title"
          value={pages.filter((p) => !p.title?.trim()).length}
        />
        <StatPill
          label="Thin (&lt;120 words)"
          value={pages.filter((p) => (p.word_count ?? 0) > 0 && (p.word_count ?? 0) < 120).length}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="overflow-x-auto rounded-xl border border-slate-200 xl:col-span-3">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">URL</th>
                <th className="p-3">HTTP</th>
                <th className="p-3">On-page status</th>
                <th className="p-3">Title</th>
                <th className="p-3">Words</th>
                <th className="p-3">Issues</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => {
                const issueCount = issuesByUrl.get(p.url.split("?")[0]) || 0;
                const http = httpStatusLabel(p.status_code);
                const rowStatus = onPageRowStatus(p, issueCount);
                const active = selectedId === p.id;
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-slate-100 cursor-pointer hover:bg-slate-50 ${active ? "bg-indigo-50/80" : ""}`}
                    onClick={() => {
                      setSelectedId(p.id);
                      onSelectPage(p.id);
                    }}
                  >
                    <td className="max-w-[200px] truncate p-3 text-[#4f46e5]">{p.url}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${http.className}`}>
                        {http.text}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${rowStatus.className}`}>
                        {rowStatus.label}
                      </span>
                    </td>
                    <td className="max-w-[140px] truncate p-3">{p.title || "—"}</td>
                    <td className="p-3">{p.word_count ?? "—"}</td>
                    <td className="p-3">{issueCount || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pages.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No pages yet — run Site Audit first.</p>
          ) : null}
        </div>
        <div className="xl:col-span-2">
          {pageDetail ? (
            <PageDetailPanel pageDetail={pageDetail} />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Select a row to load full crawl details for that URL.
            </p>
          )}
        </div>
      </div>
      {issues.length > 0 ? (
        <>
          <h4 className="mt-8 text-sm font-bold text-slate-800">Open audit issues</h4>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {issues.slice(0, 12).map((issue) => (
              <div key={issue.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <SeverityBadge severity={issue.severity} />{" "}
                <span className="font-semibold">{issue.title}</span>
                <p className="text-xs text-slate-500">{issue.url}</p>
                <p className="mt-1 text-slate-600">{issue.recommendation}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

export function IntegrationsPanel({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return <p className="text-sm text-slate-500">Loading integration status…</p>;
  const cards = [
    { key: "google_search_console", title: "Google Search Console" },
    { key: "google_analytics", title: "Google Analytics (GA4)" },
    { key: "pagespeed", title: "PageSpeed Insights" },
    { key: "keyword_provider", title: "Keyword data provider" },
    { key: "serp_rank_provider", title: "SERP / rank tracking" },
    { key: "backlink_provider", title: "Backlink index" },
    { key: "ai_visibility_provider", title: "AI visibility monitoring" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map(({ key, title }) => {
        const block = (data[key] as Record<string, unknown>) || {};
        const ok = Boolean(block.connected || block.available || block.configured);
        return (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-900">{title}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  ok ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                }`}
              >
                {block.connected ? "Connected" : block.configured || block.available ? "Ready" : "Not set"}
              </span>
            </div>
            {block.message ? <p className="mt-2 text-xs text-slate-500">{String(block.message)}</p> : null}
            {block.provider ? <p className="mt-1 text-xs text-slate-400">Provider: {String(block.provider)}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export function SearchConsoleView({ integrations }: { integrations: Record<string, unknown> | null }) {
  const gsc = (integrations?.google_search_console as Record<string, unknown>) || {};
  return (
    <>
      <SectionIntro
        title="Search Console"
        description="Import queries, clicks, impressions, and indexing coverage from Google Search Console."
      />
      <ProviderNotice>
        {gsc.connected
          ? "Search Console is connected for this project."
          : "Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in backend .env, then complete OAuth connect (coming in next release)."}
      </ProviderNotice>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatPill label="Queries" value={gsc.connected ? "—" : "Connect"} />
        <StatPill label="Clicks (28d)" value={gsc.connected ? "—" : "Connect"} />
        <StatPill label="Indexed pages" value={gsc.connected ? "—" : "Connect"} />
      </div>
    </>
  );
}

export function AnalyticsView({ integrations, summary }: { integrations: Record<string, unknown> | null; summary: DashboardSummary | null }) {
  const ga = (integrations?.google_analytics as Record<string, unknown>) || {};
  return (
    <>
      <SectionIntro
        title="Analytics"
        description="Organic traffic and landing-page performance from GA4."
      />
      <ProviderNotice>
        {ga.connected
          ? "GA4 is connected."
          : "Connect GA4 via OAuth to populate organic traffic on the dashboard."}
      </ProviderNotice>
      <StatPill label="Organic sessions" value={summary?.organic_traffic ?? "n/a"} />
    </>
  );
}

export function DashboardAiCard({
  projectId,
  brand,
  summary,
  aiTrend,
}: {
  projectId: string;
  brand: string;
  summary: DashboardSummary | null;
  aiTrend: { date: string; brand_mentions: number; checks: number }[];
}) {
  const checks = summary?.ai_checks_count ?? 0;
  const mentions = summary?.ai_brand_mentions ?? 0;
  const rate = checks > 0 ? Math.round((mentions / checks) * 100) : null;
  const spark = aiTrend.slice(-7);

  return (
    <Link
      href={`/tools/seo/platform/${projectId}/ai-search-visibility`}
      className="block rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm transition hover:border-indigo-300"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">AI Search Visibility</p>
          <p className="mt-2 text-sm text-slate-700">
            Manual checks: does AI mention <strong>{brand}</strong> or link your site?
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <span>
              <strong className="text-slate-900">{checks}</strong> checks
            </span>
            <span>
              <strong className="text-emerald-700">{mentions}</strong> brand mentions
            </span>
            <span>
              {rate != null ? (
                <>
                  <strong className="text-slate-900">{rate}%</strong> mention rate
                </>
              ) : (
                "Log checks to see trend"
              )}
            </span>
          </div>
          <span className="mt-3 inline-block text-sm font-semibold text-[#4f46e5]">Open AI visibility →</span>
        </div>
        {spark.length > 0 ? (
          <div className="min-w-[140px] text-right text-xs text-slate-500">
            <p className="mb-1 font-semibold text-slate-600">Brand mentions (7d)</p>
            <div className="flex h-12 items-end justify-end gap-1">
              {spark.map((p) => (
                <div
                  key={p.date}
                  className="w-3 rounded-t bg-indigo-400"
                  style={{ height: `${Math.max(8, p.brand_mentions * 12)}px` }}
                  title={`${p.date}: ${p.brand_mentions}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
