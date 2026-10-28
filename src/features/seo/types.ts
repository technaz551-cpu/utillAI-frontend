export type SeoProject = {
  id: string;
  name: string;
  website_url: string;
  domain: string;
  status: string;
  default_country?: string | null;
  brand_name?: string | null;
  brand_location?: string | null;
  focus_areas?: string[];
  business_name?: string | null;
  business_address?: string | null;
  business_phone?: string | null;
  health_score: number | null;
  last_audit_at: string | null;
  open_issues: number;
  pages_crawled?: number;
};

export type SetupStep = {
  id: string;
  label: string;
  status: string;
  detail?: string | null;
};

export type SeoAuditRun = {
  id: string;
  project_id: string;
  status: string;
  pages_crawled: number;
  pages_target: number;
  issues_found: number;
  health_score: number | null;
  error: string | null;
  created_at: string;
};

export type SeoIssue = {
  id: string;
  url: string | null;
  issue_type: string;
  category: string;
  severity: string;
  title: string;
  explanation: string;
  recommendation: string;
  status: string;
};

export type PageRow = {
  id: string;
  url: string;
  status_code: number | null;
  title: string | null;
  response_time_ms: number | null;
  word_count: number | null;
  is_noindex: boolean;
  depth?: number | null;
  internal_links_count?: number;
  incoming_links_count?: number;
  open_issues_count?: number;
};

export type PageDetail = PageRow & {
  meta_description: string | null;
  canonical: string | null;
  robots_meta: string | null;
  h1: string[];
  h2: string[];
  h3: string[];
  internal_links_count: number;
  external_links_count: number;
  images_total: number;
  images_missing_alt: number;
  structured_data_types: string[];
  recommendations: string[];
};

export type SeoKeyword = {
  id: string;
  phrase: string;
  group?: string | null;
  target_url?: string | null;
  notes?: string | null;
  search_volume: number | null;
  difficulty: number | null;
  data_source: string | null;
};

export type SeoTask = {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  due_date?: string | null;
  url?: string | null;
  issue_id?: string | null;
};

export type WebsiteConditionMetric = {
  label: string;
  value: string;
  status: "ok" | "warn" | "bad" | "neutral" | "unknown";
};

export type WebsiteCondition = {
  overall_status: "healthy" | "needs_attention" | "critical" | "unknown" | "scanning";
  overall_label: string;
  headline: string;
  audited_at: string | null;
  audit_status: string | null;
  metrics: WebsiteConditionMetric[];
  recommendations: string[];
};

export type DashboardSummary = {
  health_score: number | null;
  health_score_label: string;
  pages_crawled: number;
  indexable_pages: number;
  open_issues: number;
  issues_by_severity: Record<string, number>;
  last_audit_status: string | null;
  last_audit_at: string | null;
  keywords_count: number;
  backlinks_count: number;
  referring_domains: number;
  tracked_keywords: number;
  competitors_count: number;
  organic_traffic: number | null;
  organic_traffic_source: string | null;
  setup_steps: SetupStep[];
  setup_completed: number;
  setup_total: number;
  ai_checks_count?: number;
  ai_brand_mentions?: number;
  ai_website_links?: number;
  website_condition?: WebsiteCondition | null;
  audit_in_progress?: boolean;
  audit_pages_crawled?: number;
  audit_pages_target?: number;
};

export type ChartDataset = {
  label: string;
  data: { date: string; value: number }[];
  source: string;
  metric_definition?: string | null;
};

export type RankingProgressPoint = {
  date: string;
  top_3: number;
  top_10: number;
  top_20: number;
};

export type AiVisibilityPoint = {
  date: string;
  checks: number;
  brand_mentions: number;
  website_links: number;
};

export type DashboardIssuePreview = {
  id: string;
  severity: string;
  title: string;
  url: string;
  category?: string | null;
  recommendation?: string | null;
};

export type CrawlDetailStats = {
  total: number;
  indexable: number;
  noindex: number;
  broken: number;
  redirects: number;
  other: number;
};

export type DashboardCharts = {
  health_score_history: ChartDataset;
  issues_by_severity: ChartDataset;
  issues_open_vs_resolved: ChartDataset;
  crawl_breakdown?: ChartDataset | null;
  ranking_progress?: RankingProgressPoint[];
  ai_visibility_trend?: AiVisibilityPoint[];
  open_issues_preview?: DashboardIssuePreview[];
  crawl_detail?: CrawlDetailStats | null;
};
