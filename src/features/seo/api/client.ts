import { API_BASE } from "@/lib/api-config";
import { clearStoredUser, getStoredUser, refreshSession } from "@/lib/auth";

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

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
  detail?: string;
};

function authHeaders(): HeadersInit {
  const user = getStoredUser();
  if (!user?.token) throw new Error("Sign in to use the SEO platform.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  };
}

function parseErrorDetail(body: ApiEnvelope<unknown> | null, status: number): string {
  if (typeof body?.detail === "string") return body.detail;
  if (body?.message) return body.message;
  if (status === 401) {
    return "Session expired or invalid. Please log in again.";
  }
  return `Request failed (${status})`;
}

async function seoFetch<T>(
  path: string,
  init?: RequestInit,
  retried = false,
): Promise<T> {
  const response = await fetch(`${API_BASE}/seo${path}`, {
    ...init,
    headers: { ...(init?.headers || {}), ...authHeaders() },
  });
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (response.status === 401) {
    if (!retried && (await refreshSession())) {
      return seoFetch(path, init, true);
    }
    clearStoredUser();
    throw new Error(parseErrorDetail(body, 401));
  }
  if (!response.ok || body?.success === false) {
    throw new Error(parseErrorDetail(body, response.status));
  }
  if (!body?.success) throw new Error(`Request failed (${response.status})`);
  return body.data as T;
}

export function listProjects() {
  return seoFetch<SeoProject[]>("/projects");
}

export function getProject(projectId: string) {
  return seoFetch<SeoProject>(`/projects/${projectId}`);
}

export function createProject(payload: {
  name: string;
  website_url: string;
  default_country?: string;
}) {
  return seoFetch<SeoProject>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteProject(projectId: string) {
  return seoFetch<{ deleted: boolean }>(`/projects/${projectId}`, {
    method: "DELETE",
  });
}

export function updateProject(
  projectId: string,
  patch: Partial<
    Pick<
      SeoProject,
      | "name"
      | "website_url"
      | "default_country"
      | "brand_name"
      | "brand_location"
      | "focus_areas"
      | "business_name"
      | "business_address"
      | "business_phone"
    >
  >,
) {
  return seoFetch<SeoProject>(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function listCompetitors(projectId: string) {
  return seoFetch<Record<string, unknown>[]>(`/projects/${projectId}/competitors`);
}

export function addCompetitor(projectId: string, domain: string, label?: string) {
  return seoFetch<Record<string, unknown>>(`/projects/${projectId}/competitors`, {
    method: "POST",
    body: JSON.stringify({ domain, label }),
  });
}

export function removeCompetitor(competitorId: string) {
  return seoFetch<{ deleted: boolean }>(`/competitors/${competitorId}`, {
    method: "DELETE",
  });
}

export function listRankings(projectId: string, keywordId?: string) {
  const q = keywordId ? `?keyword_id=${encodeURIComponent(keywordId)}` : "";
  return seoFetch<Record<string, unknown>[]>(`/projects/${projectId}/rankings${q}`);
}

export function recordRanking(
  projectId: string,
  payload: {
    keyword_id?: string;
    phrase?: string;
    position: number | null;
    country?: string;
    device?: string;
  },
) {
  return seoFetch<Record<string, unknown>>(`/projects/${projectId}/rankings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getRankingSummary(projectId: string) {
  return seoFetch<Record<string, unknown>>(`/projects/${projectId}/rankings/summary`);
}

export function startAudit(projectId: string, opts?: { max_pages?: number }) {
  return seoFetch<SeoAuditRun>(`/projects/${projectId}/audits`, {
    method: "POST",
    body: JSON.stringify(opts || {}),
  });
}

export function cancelAudit(auditId: string) {
  return seoFetch<SeoAuditRun>(`/audits/${auditId}/cancel`, { method: "POST" });
}

export function listAudits(projectId: string) {
  return seoFetch<SeoAuditRun[]>(`/projects/${projectId}/audits`);
}

export function getDashboardSummary(projectId: string) {
  return seoFetch<DashboardSummary>(`/projects/${projectId}/dashboard/summary`);
}

export function getDashboardCharts(projectId: string) {
  return seoFetch<DashboardCharts>(`/projects/${projectId}/dashboard/charts`);
}

export function listIssues(
  projectId: string,
  params?: { page?: number; severity?: string; status?: string },
) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.severity) q.set("severity", params.severity);
  if (params?.status) q.set("status", params.status);
  const qs = q.toString();
  return seoFetch<{
    items: SeoIssue[];
    total: number;
    page: number;
    page_size: number;
  }>(`/projects/${projectId}/issues${qs ? `?${qs}` : ""}`);
}

export function updateIssueStatus(issueId: string, status: string) {
  return seoFetch<SeoIssue>(`/issues/${issueId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function listPages(projectId: string, page = 1, pageSize = 100) {
  return seoFetch<{ items: PageRow[]; total: number; page_size?: number }>(
    `/projects/${projectId}/pages?page=${page}&page_size=${pageSize}`,
  );
}

/** Fetches all crawled pages (paginated API, max 100 per request). */
export async function listAllPages(projectId: string): Promise<PageRow[]> {
  const pageSize = 100;
  const items: PageRow[] = [];
  let page = 1;
  let total = Number.POSITIVE_INFINITY;
  while (items.length < total) {
    const batch = await listPages(projectId, page, pageSize);
    total = batch.total;
    if (!batch.items.length) break;
    items.push(...batch.items);
    page += 1;
    if (page > 50) break;
  }
  return items;
}

export function getPageDetail(pageId: string) {
  return seoFetch<PageDetail>(`/pages/${pageId}`);
}

export function listKeywords(projectId: string) {
  return seoFetch<SeoKeyword[]>(`/projects/${projectId}/keywords`);
}

export function getKeywordOverview(projectId: string, phrase: string, country?: string) {
  const q = new URLSearchParams({ phrase });
  if (country && country !== "worldwide") q.set("country", country);
  return seoFetch<import("@/features/seo/types/keywordOverview").KeywordOverview>(
    `/projects/${projectId}/keywords/overview?${q.toString()}`,
  );
}

export function createKeyword(projectId: string, phrase: string) {
  return seoFetch<SeoKeyword>(`/projects/${projectId}/keywords`, {
    method: "POST",
    body: JSON.stringify({ phrase }),
  });
}

export function bulkCreateKeywords(
  projectId: string,
  phrases: string[],
  country?: string,
) {
  return seoFetch<{ created: number; skipped: number; total: number }>(
    `/projects/${projectId}/keywords/bulk`,
    {
      method: "POST",
      body: JSON.stringify({ phrases, country }),
    },
  );
}

export function lookupPageByUrl(projectId: string, url: string) {
  return seoFetch<PageDetail | null>(
    `/projects/${projectId}/pages/lookup?url=${encodeURIComponent(url)}`,
  );
}

export function getSiteAuditSummary(projectId: string) {
  return seoFetch<Record<string, unknown>>(`/projects/${projectId}/site-audit/summary`);
}

export function getTrackedRankings(projectId: string) {
  return seoFetch<Record<string, unknown>[]>(`/projects/${projectId}/rankings/tracked`);
}

export function getPositionTrackingDashboard(projectId: string) {
  return seoFetch<import("@/features/seo/types/positionTracking").PositionTrackingDashboard>(
    `/projects/${projectId}/rankings/position-dashboard`,
  );
}

export function listTasks(projectId: string) {
  return seoFetch<SeoTask[]>(`/projects/${projectId}/tasks`);
}

export function createTask(projectId: string, title: string) {
  return seoFetch<SeoTask>(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title, priority: "medium", status: "pending" }),
  });
}

export function updateTask(taskId: string, patch: Partial<SeoTask>) {
  return seoFetch<SeoTask>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function getIntegrationStatus(projectId: string) {
  return seoFetch<Record<string, unknown>>(
    `/projects/${projectId}/integrations/status`,
  );
}

export function listAlerts(projectId: string) {
  return seoFetch<Record<string, unknown>[]>(`/projects/${projectId}/alerts`);
}

export function listBacklinks(projectId: string) {
  return seoFetch<Record<string, unknown>[]>(`/projects/${projectId}/backlinks`);
}

export function addBacklink(
  projectId: string,
  source_url: string,
  target_url: string,
  opts?: { anchor_text?: string; rel?: string },
) {
  return seoFetch<Record<string, unknown>>(`/projects/${projectId}/backlinks`, {
    method: "POST",
    body: JSON.stringify({ source_url, target_url, ...opts }),
  });
}

export function getCompetitorGapSummary(projectId: string) {
  return seoFetch<Record<string, unknown>>(`/projects/${projectId}/competitors/gap-summary`);
}

export function listAiVisibility(projectId: string) {
  return seoFetch<Record<string, unknown>[]>(`/projects/${projectId}/ai-visibility`);
}

export function logAiVisibility(
  projectId: string,
  payload: {
    question: string;
    brand_mentioned: boolean;
    website_linked: boolean;
    competitor_notes?: string;
  },
) {
  return seoFetch<Record<string, unknown>>(`/projects/${projectId}/ai-visibility`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listPerformance(projectId: string) {
  return seoFetch<Record<string, unknown>[]>(`/projects/${projectId}/performance`);
}

export function runPageSpeed(projectId: string, strategy: "mobile" | "desktop" = "mobile") {
  return seoFetch<Record<string, unknown>>(
    `/projects/${projectId}/performance/run?strategy=${strategy}`,
    { method: "POST" },
  );
}

export async function downloadReport(projectId: string, kind: "issues" | "pages") {
  const user = getStoredUser();
  if (!user?.token) throw new Error("Sign in required.");
  const path =
    kind === "issues"
      ? `/projects/${projectId}/reports/issues.csv`
      : `/projects/${projectId}/reports/pages.csv`;
  const response = await fetch(`${API_BASE}/seo${path}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
  if (!response.ok) throw new Error("Export failed.");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `utilai-${kind}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
