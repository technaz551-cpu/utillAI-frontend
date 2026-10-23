import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ClipboardList,
  FileText,
  Gauge,
  Globe,
  LayoutDashboard,
  Link2,
  MapPin,
  PenLine,
  Search,
  Settings,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";

export type SeoNavItem = {
  slug: SeoSectionSlug | "projects-home";
  label: string;
  icon: LucideIcon;
  href?: string;
};

export type SeoNavGroup = {
  label: string;
  items: SeoNavItem[];
};

export const SEO_SIDEBAR_GROUPS: SeoNavGroup[] = [
  {
    label: "Main",
    items: [
      { slug: "overview", label: "Dashboard", icon: LayoutDashboard },
      { slug: "projects-home", label: "Projects", icon: Globe },
    ],
  },
  {
    label: "SEO Tools",
    items: [
      { slug: "site-audit", label: "Site Audit", icon: Wrench },
      { slug: "url-inspection", label: "URL Inspection", icon: Search },
      { slug: "keyword-research", label: "Keyword Research", icon: Target },
      { slug: "rank-tracking", label: "Position Tracking", icon: TrendingUp },
      { slug: "competitor-analysis", label: "Competitor Analysis", icon: Swords },
      { slug: "backlink-analysis", label: "Backlink Analysis", icon: Link2 },
      { slug: "on-page-seo", label: "On-Page SEO", icon: FileText },
      { slug: "content-seo", label: "Content SEO", icon: FileText },
      { slug: "seo-writing-assistant", label: "SEO Writing Assistant", icon: PenLine },
      { slug: "website-performance", label: "Website Performance", icon: Gauge },
      { slug: "ai-search-visibility", label: "AI Search Visibility", icon: Sparkles },
      { slug: "search-console", label: "Search Console", icon: BarChart3 },
      { slug: "analytics", label: "Analytics", icon: Activity },
      { slug: "local-seo", label: "Local SEO", icon: MapPin },
    ],
  },
  {
    label: "Project Management",
    items: [
      { slug: "seo-tasks", label: "SEO Tasks", icon: ClipboardList },
      { slug: "reports", label: "Reports", icon: FileText },
      { slug: "alerts", label: "Alerts & Automation", icon: AlertTriangle },
    ],
  },
  {
    label: "Settings",
    items: [{ slug: "settings", label: "Settings", icon: Settings }],
  },
];

/** Flat list for header quick-search (slug excludes projects-home). */
export const SEO_QUICK_NAV_ITEMS = SEO_SIDEBAR_GROUPS.flatMap((g) => g.items).filter(
  (i) => i.slug !== "projects-home",
);

export const SEO_NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ slug: "overview" as const, label: "Dashboard" }],
  },
  {
    label: "Site performance",
    items: [
      { slug: "site-audit" as const, label: "Site Audit" },
      { slug: "rank-tracking" as const, label: "Position Tracking" },
      { slug: "website-performance" as const, label: "Site Speed" },
    ],
  },
  {
    label: "Competitive analysis",
    items: [
      { slug: "competitor-analysis" as const, label: "Competitors" },
      { slug: "backlink-analysis" as const, label: "Backlinks" },
    ],
  },
  {
    label: "Keyword research",
    items: [
      { slug: "keyword-research" as const, label: "Keywords" },
      { slug: "on-page-seo" as const, label: "On-Page Issues" },
      { slug: "url-inspection" as const, label: "URL Inspection" },
      { slug: "content-seo" as const, label: "Content" },
      { slug: "seo-writing-assistant" as const, label: "SEO Writing Assistant" },
    ],
  },
  {
    label: "Search & AI",
    items: [
      { slug: "search-console" as const, label: "Search Console" },
      { slug: "analytics" as const, label: "Analytics" },
      { slug: "ai-search-visibility" as const, label: "AI Visibility" },
    ],
  },
  {
    label: "Workflow",
    items: [
      { slug: "seo-tasks" as const, label: "Tasks" },
      { slug: "reports" as const, label: "Reports" },
      { slug: "alerts" as const, label: "Alerts" },
      { slug: "local-seo" as const, label: "Local SEO" },
      { slug: "settings" as const, label: "Settings" },
    ],
  },
] as const;

export type SeoSectionSlug =
  | (typeof SEO_NAV_GROUPS)[number]["items"][number]["slug"]
  | "projects";

export const SEO_SECTIONS: { slug: SeoSectionSlug; label: string }[] = SEO_NAV_GROUPS.flatMap(
  (g) => g.items.map((item) => ({ slug: item.slug as SeoSectionSlug, label: item.label })),
);
