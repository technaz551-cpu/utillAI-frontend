"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  addBacklink,
  addCompetitor,
  bulkCreateKeywords,
  getKeywordOverview,
  cancelAudit,
  createTask,
  downloadReport,
  getCompetitorGapSummary,
  getPageDetail,
  getPositionTrackingDashboard,
  getRankingSummary,
  getSiteAuditSummary,
  getTrackedRankings,
  listAiVisibility,
  listAlerts,
  listAudits,
  listBacklinks,
  listCompetitors,
  listIssues,
  listKeywords,
  listAllPages,
  listPerformance,
  listRankings,
  listTasks,
  logAiVisibility,
  lookupPageByUrl,
  recordRanking,
  removeCompetitor,
  runPageSpeed,
  startAudit,
  updateIssueStatus,
  updateProject,
  updateTask,
} from "@/features/seo/api/client";
import { SeoOverviewPanel } from "@/features/seo/components/SeoOverviewPanel";
import {
  AiSearchVisibilityView,
  AnalyticsView,
  BacklinkAnalysisView,
  CompetitorAnalysisView,
  ContentSeoView,
  IntegrationsPanel,
  KeywordResearchView,
  OnPageSeoView,
  PerformanceView,
  SearchConsoleView,
  SiteAuditView,
  UrlInspectionView,
} from "@/features/seo/components/SeoToolViews";
import { PositionTrackingView } from "@/features/seo/components/PositionTrackingView";
import { SeoWritingAssistantView } from "@/features/seo/components/SeoWritingAssistantView";
import type { SeoSectionSlug } from "@/features/seo/navigation";
import { parseKeywordsFromCsv } from "@/features/seo/utils/keywordCsv";
import type { PositionTrackingDashboard } from "@/features/seo/types/positionTracking";
import type {
  DashboardCharts,
  DashboardSummary,
  PageDetail,
  PageRow,
  SeoAuditRun,
  SeoIssue,
  SeoKeyword,
  SeoProject,
  SeoTask,
} from "@/features/seo/types";
import type { KeywordOverview } from "@/features/seo/types/keywordOverview";

export function SeoSectionPanels({
  projectId,
  section,
  project,
  summary,
  charts,
  integrations,
  onRefresh,
}: {
  projectId: string;
  section: SeoSectionSlug;
  project: SeoProject | null;
  summary: DashboardSummary | null;
  charts: DashboardCharts | null;
  integrations: Record<string, unknown> | null;
  onRefresh: () => void;
}) {
  const [audits, setAudits] = useState<SeoAuditRun[]>([]);
  const [issues, setIssues] = useState<SeoIssue[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [pageDetail, setPageDetail] = useState<PageDetail | null>(null);
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [tasks, setTasks] = useState<SeoTask[]>([]);
  const [alerts, setAlerts] = useState<Record<string, unknown>[]>([]);
  const [backlinks, setBacklinks] = useState<Record<string, unknown>[]>([]);
  const [performance, setPerformance] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [blSource, setBlSource] = useState("");
  const [blTarget, setBlTarget] = useState("");
  const [competitors, setCompetitors] = useState<Record<string, unknown>[]>([]);
  const [compDomain, setCompDomain] = useState("");
  const [rankings, setRankings] = useState<Record<string, unknown>[]>([]);
  const [trackedRows, setTrackedRows] = useState<Record<string, unknown>[]>([]);
  const [rankSummary, setRankSummary] = useState<Record<string, unknown> | null>(null);
  const [auditSummary, setAuditSummary] = useState<Record<string, unknown> | null>(null);
  const [inspectMsg, setInspectMsg] = useState("");
  const [rankPhrase, setRankPhrase] = useState("");
  const [rankPos, setRankPos] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandLocation, setBrandLocation] = useState("");
  const [focusAreas, setFocusAreas] = useState("");
  const [bizName, setBizName] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [profileSaveMsg, setProfileSaveMsg] = useState("");
  const [bulkKw, setBulkKw] = useState("");
  const [kwCountry, setKwCountry] = useState("worldwide");
  const [kwImportMsg, setKwImportMsg] = useState("");
  const [kwSearch, setKwSearch] = useState("");
  const [kwOverview, setKwOverview] = useState<KeywordOverview | null>(null);
  const [kwOverviewLoading, setKwOverviewLoading] = useState(false);
  const [inspectUrl, setInspectUrl] = useState("");
  const [gapMsg, setGapMsg] = useState<string | null>(null);
  const [aiChecks, setAiChecks] = useState<Record<string, unknown>[]>([]);
  const [aiQuestion, setAiQuestion] = useState("");
  const [rankCountry, setRankCountry] = useState("worldwide");
  const [rankDevice, setRankDevice] = useState("desktop");
  const [positionDashboard, setPositionDashboard] = useState<PositionTrackingDashboard | null>(null);
  const [blAnchor, setBlAnchor] = useState("");
  const [blRel, setBlRel] = useState("follow");

  useEffect(() => {
    if (!project) return;
    setBrandName(project.brand_name || "");
    setBrandLocation(project.brand_location || project.default_country || "");
    setFocusAreas((project.focus_areas || []).join(", "));
    setBizName(project.business_name || "");
    setBizAddress(project.business_address || "");
    setBizPhone(project.business_phone || "");
  }, [project]);

  useEffect(() => {
    if (section === "site-audit") {
      void listAudits(projectId).then(setAudits);
      void listIssues(projectId, { status: "open" }).then((r) => setIssues(r.items));
      void listAllPages(projectId).then(setPages);
      void getSiteAuditSummary(projectId).then(setAuditSummary).catch(() => setAuditSummary(null));
    }
    if (section === "on-page-seo" || section === "content-seo")
      void listIssues(projectId, { status: "open" }).then((r) => setIssues(r.items));
    if (section === "url-inspection" || section === "content-seo" || section === "on-page-seo")
      void listAllPages(projectId).then(setPages);
    if (section === "keyword-research") void listKeywords(projectId).then(setKeywords);
    if (section === "seo-tasks") void listTasks(projectId).then(setTasks);
    if (section === "alerts") void listAlerts(projectId).then(setAlerts);
    if (section === "backlink-analysis") void listBacklinks(projectId).then(setBacklinks);
    if (section === "website-performance") void listPerformance(projectId).then(setPerformance);
    if (section === "competitor-analysis") {
      void listCompetitors(projectId).then(setCompetitors);
      void getCompetitorGapSummary(projectId).then((d) => setGapMsg(String(d.message || "")));
    }
    if (section === "ai-search-visibility") void listAiVisibility(projectId).then(setAiChecks);
    if (section === "rank-tracking") {
      void listRankings(projectId).then(setRankings);
      void getTrackedRankings(projectId).then(setTrackedRows).catch(() => setTrackedRows([]));
      void getRankingSummary(projectId).then(setRankSummary);
      void listKeywords(projectId).then(setKeywords);
      void getPositionTrackingDashboard(projectId)
        .then(setPositionDashboard)
        .catch(() => setPositionDashboard(null));
    }
  }, [projectId, section]);

  useEffect(() => {
    if (section !== "site-audit") return;
    const active = audits.some((a) => a.status === "pending" || a.status === "running");
    if (!active) return;
    const t = setInterval(() => {
      void listAudits(projectId).then(setAudits);
      onRefresh();
    }, 3000);
    return () => clearInterval(t);
  }, [section, audits, projectId, onRefresh]);

  const runAudit = async () => {
    setBusy(true);
    setError("");
    try {
      await startAudit(projectId);
      setAudits(await listAudits(projectId));
      void getSiteAuditSummary(projectId).then(setAuditSummary).catch(() => {});
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  if (section === "overview") {
    return (
      <SeoOverviewPanel
        projectId={projectId}
        project={project}
        summary={summary}
        charts={charts}
      />
    );
  }

  if (section === "projects") {
    return (
      <p className="text-sm text-slate-600">
        <Link href="/tools/seo/platform" className="font-semibold text-[#2547f0]">All projects</Link>
      </p>
    );
  }

  if (section === "site-audit") {
    return (
      <SiteAuditView
        projectId={projectId}
        project={project}
        summary={summary}
        auditSummary={auditSummary}
        audits={audits}
        issues={issues}
        pages={pages}
        error={error}
        busy={busy}
        onRunAudit={() => void runAudit()}
        onCancelAudit={(id) => void cancelAudit(id).then(() => listAudits(projectId).then(setAudits))}
        onResolveIssue={(id, status) => void updateIssueStatus(id, status).then(onRefresh)}
      />
    );
  }

  if (section === "on-page-seo") {
    return (
      <OnPageSeoView
        issues={issues}
        pages={pages}
        pageDetail={pageDetail}
        onSelectPage={(id) => void getPageDetail(id).then(setPageDetail)}
      />
    );
  }

  if (section === "url-inspection") {
    return (
      <>
        {inspectMsg ? <p className="mb-3 text-sm text-amber-700">{inspectMsg}</p> : null}
        <UrlInspectionView
          pages={pages}
          pageDetail={pageDetail}
          inspectUrl={inspectUrl}
          onInspectUrlChange={setInspectUrl}
          onSelectPage={(id) => void getPageDetail(id).then(setPageDetail)}
          onLookupUrl={() => {
            setInspectMsg("");
            const q = inspectUrl.trim();
            if (!q) return;
            void lookupPageByUrl(projectId, q)
              .then((detail) => {
                if (!detail) {
                  setPageDetail(null);
                  setInspectMsg("No crawled page matched that URL. Run a site audit first.");
                  return;
                }
                setPageDetail(detail);
              })
              .catch((e) =>
                setInspectMsg(e instanceof Error ? e.message : "Lookup failed."),
              );
          }}
        />
      </>
    );
  }

  if (section === "content-seo") {
    return <ContentSeoView pages={pages} issues={issues} />;
  }

  if (section === "seo-writing-assistant") {
    return (
      <SeoWritingAssistantView
        projectId={projectId}
        defaultKeyword={project?.brand_name || project?.domain}
      />
    );
  }

  if (section === "keyword-research") {
    const countryArg = kwCountry === "worldwide" ? undefined : kwCountry;
    const importPhrasesInBatches = async (phrases: string[]) => {
      const chunkSize = 100;
      let created = 0;
      let skipped = 0;
      for (let i = 0; i < phrases.length; i += chunkSize) {
        const chunk = phrases.slice(i, i + chunkSize);
        const res = await bulkCreateKeywords(projectId, chunk, countryArg);
        created += res.created;
        skipped += res.skipped;
      }
      return { created, skipped, total: phrases.length };
    };
    const runKeywordOverview = (phraseOverride?: string) => {
      const p = (phraseOverride ?? kwSearch).trim();
      if (!p) return;
      if (phraseOverride) setKwSearch(phraseOverride);
      setKwOverviewLoading(true);
      void getKeywordOverview(
        projectId,
        p,
        kwCountry === "worldwide" ? undefined : kwCountry,
      )
        .then(setKwOverview)
        .catch(() => setKwOverview(null))
        .finally(() => setKwOverviewLoading(false));
    };
    return (
      <KeywordResearchView
        projectId={projectId}
        keywords={keywords}
        searchPhrase={kwSearch}
        onSearchPhraseChange={setKwSearch}
        onAnalyzeKeyword={runKeywordOverview}
        overview={kwOverview}
        overviewLoading={kwOverviewLoading}
        bulkText={bulkKw}
        importMessage={kwImportMsg}
        onBulkChange={setBulkKw}
        country={kwCountry}
        onCountryChange={setKwCountry}
        onAnalyze={() => {
          setKwImportMsg("");
          const lines = bulkKw.split("\n").map((s) => s.trim()).filter(Boolean);
          if (!lines.length) return;
          void importPhrasesInBatches(lines)
            .then((r) => {
              setKwImportMsg(`Imported ${r.created} keyword(s), skipped ${r.skipped} duplicate(s).`);
              setBulkKw("");
            })
            .then(() => listKeywords(projectId).then(setKeywords))
            .catch((e) =>
              setKwImportMsg(e instanceof Error ? e.message : "Import failed."),
            );
        }}
        onImportCsv={(file) => {
          setKwImportMsg("");
          void file
            .text()
            .then((text) => parseKeywordsFromCsv(text))
            .then((phrases) => {
              if (!phrases.length) {
                setKwImportMsg("No keywords found in CSV. Use a keyword or phrase column.");
                return;
              }
              return importPhrasesInBatches(phrases).then((r) => {
                setKwImportMsg(
                  `Imported ${r.created} keyword(s) from CSV, skipped ${r.skipped} duplicate(s).`,
                );
              });
            })
            .then(() => listKeywords(projectId).then(setKeywords))
            .catch((e) =>
              setKwImportMsg(e instanceof Error ? e.message : "Could not read CSV."),
            );
        }}
      />
    );
  }

  if (section === "seo-tasks") {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <button type="button" className="rounded-lg bg-[#2547f0] px-4 py-2 text-sm font-semibold text-white" onClick={() => void createTask(projectId, taskTitle).then(() => listTasks(projectId).then(setTasks))}>
            Add task
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span>{t.title}</span>
              <select className="rounded border border-slate-200 text-xs" value={t.status} onChange={(e) => void updateTask(t.id, { status: e.target.value }).then(() => listTasks(projectId).then(setTasks))}>
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section === "reports") {
    return (
      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-lg bg-[#2547f0] px-4 py-2 text-sm font-semibold text-white" onClick={() => void downloadReport(projectId, "issues")}>
          Download issues CSV
        </button>
        <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold" onClick={() => void downloadReport(projectId, "pages")}>
          Download pages CSV
        </button>
      </div>
    );
  }

  if (section === "backlink-analysis") {
    return (
      <BacklinkAnalysisView
        backlinks={backlinks}
        summary={summary}
        blSource={blSource}
        blTarget={blTarget}
        blAnchor={blAnchor}
        blRel={blRel}
        onSource={setBlSource}
        onTarget={setBlTarget}
        onAnchor={setBlAnchor}
        onRel={setBlRel}
        onAdd={() =>
          void addBacklink(projectId, blSource, blTarget, {
            anchor_text: blAnchor,
            rel: blRel,
          }).then(() => listBacklinks(projectId).then(setBacklinks))
        }
      />
    );
  }

  if (section === "website-performance") {
    return (
      <PerformanceView
        projectId={projectId}
        performance={performance}
        error={error}
        onRunMobile={() =>
          void runPageSpeed(projectId, "mobile")
            .then(() => listPerformance(projectId).then(setPerformance))
            .catch((e) => setError(e.message))
        }
        onRunDesktop={() =>
          void runPageSpeed(projectId, "desktop")
            .then(() => listPerformance(projectId).then(setPerformance))
            .catch((e) => setError(e.message))
        }
      />
    );
  }

  if (section === "alerts") {
    return (
      <ul className="space-y-2 text-sm">
        {alerts.map((a) => (
          <li key={String(a.id)} className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="font-semibold">{String(a.title)}</p>
            <p className="text-slate-600">{String(a.body)}</p>
          </li>
        ))}
        {alerts.length === 0 ? <p className="text-slate-500">No alerts yet.</p> : null}
      </ul>
    );
  }

  if (section === "competitor-analysis") {
    return (
      <CompetitorAnalysisView
        competitors={competitors}
        gapMessage={gapMsg}
        compDomain={compDomain}
        onDomain={setCompDomain}
        onAdd={() =>
          void addCompetitor(projectId, compDomain.trim())
            .then(() => listCompetitors(projectId).then(setCompetitors))
            .then(onRefresh)
            .then(() => setCompDomain(""))
        }
        onRemove={(id) =>
          void removeCompetitor(id)
            .then(() => listCompetitors(projectId).then(setCompetitors))
            .then(onRefresh)
        }
      />
    );
  }

  if (section === "rank-tracking") {
    const refreshPosition = () =>
      void getPositionTrackingDashboard(projectId)
        .then(setPositionDashboard)
        .catch(() => setPositionDashboard(null));
    return (
      <PositionTrackingView
        projectId={projectId}
        project={project}
        dashboard={positionDashboard}
        rankPhrase={rankPhrase}
        rankPos={rankPos}
        country={rankCountry}
        device={rankDevice}
        onPhrase={setRankPhrase}
        onPos={setRankPos}
        onCountry={setRankCountry}
        onDevice={setRankDevice}
        onRefresh={() => {
          refreshPosition();
          void getRankingSummary(projectId).then(setRankSummary);
        }}
        onLog={() =>
          void recordRanking(projectId, {
            phrase: rankPhrase.trim(),
            position: rankPos === "" ? null : Number(rankPos),
            country: rankCountry,
            device: rankDevice,
          })
            .then(() => listRankings(projectId).then(setRankings))
            .then(() => getTrackedRankings(projectId).then(setTrackedRows))
            .then(() => getRankingSummary(projectId).then(setRankSummary))
            .then(refreshPosition)
            .then(onRefresh)
            .then(() => {
              setRankPhrase("");
              setRankPos("");
            })
        }
      />
    );
  }

  if (section === "ai-search-visibility") {
    return (
      <AiSearchVisibilityView
        project={project}
        checks={aiChecks}
        question={aiQuestion}
        onQuestion={setAiQuestion}
        onLog={(payload) =>
          void logAiVisibility(projectId, { question: aiQuestion.trim(), ...payload })
            .then(() => listAiVisibility(projectId).then(setAiChecks))
            .then(() => setAiQuestion(""))
        }
      />
    );
  }

  if (section === "local-seo") {
    const saveLocal = () => {
      void updateProject(projectId, {
        business_name: bizName.trim() || null,
        business_address: bizAddress.trim() || null,
        business_phone: bizPhone.trim() || null,
      }).then(onRefresh);
    };
    return (
      <div className="max-w-xl space-y-4 rounded-lg border border-slate-200 bg-white p-5 text-sm">
        <p className="text-slate-600">NAP (name, address, phone) for local consistency checks.</p>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="Business name"
          value={bizName}
          onChange={(e) => setBizName(e.target.value)}
        />
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="Address"
          rows={3}
          value={bizAddress}
          onChange={(e) => setBizAddress(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="Phone"
          value={bizPhone}
          onChange={(e) => setBizPhone(e.target.value)}
        />
        <button
          type="button"
          className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-white"
          onClick={() => void saveLocal()}
        >
          Save NAP
        </button>
      </div>
    );
  }

  if (section === "search-console") {
    return <SearchConsoleView integrations={integrations} />;
  }

  if (section === "analytics") {
    return <AnalyticsView integrations={integrations} summary={summary} />;
  }

  if (section === "settings") {
    const saveBrand = () => {
      setProfileSaveMsg("");
      const areas = focusAreas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      void updateProject(projectId, {
        brand_name: brandName.trim() || null,
        brand_location: brandLocation.trim() || null,
        focus_areas: areas,
      })
        .then(onRefresh)
        .then(() => setProfileSaveMsg("Profile saved."))
        .catch((e) =>
          setProfileSaveMsg(e instanceof Error ? e.message : "Could not save profile."),
        );
    };
    return (
      <div className="space-y-8">
        <div className="max-w-xl space-y-3 rounded-lg border border-slate-200 bg-white p-5 text-sm">
          <h3 className="font-semibold text-slate-900">Brand & focus</h3>
          <p className="text-xs text-slate-500">
            Used for dashboard setup progress and overview. Does not change crawl country (see project
            default country when creating the project).
          </p>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Brand name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Location / market"
            value={brandLocation}
            onChange={(e) => setBrandLocation(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Focus areas (comma-separated)"
            value={focusAreas}
            onChange={(e) => setFocusAreas(e.target.value)}
          />
          <button
            type="button"
            className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-white"
            onClick={() => void saveBrand()}
          >
            Save profile
          </button>
          {profileSaveMsg ? (
            <p
              className={`text-xs ${profileSaveMsg === "Profile saved." ? "text-emerald-700" : "text-red-600"}`}
            >
              {profileSaveMsg}
            </p>
          ) : null}
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Integrations</h3>
          <IntegrationsPanel data={integrations} />
        </div>
      </div>
    );
  }

  return (
    <p className="text-sm text-slate-600">
      Connect a data provider in Settings. UTILAI does not fabricate rankings or traffic metrics.
    </p>
  );
}
