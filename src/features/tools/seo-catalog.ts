import type { ToolMeta } from "@/features/tools/client-processors";

export const SEO_PLATFORM_TOOL: ToolMeta = {
  id: "seo-platform",
  slug: "seo-platform",
  name: "SEO Platform",
  description:
    "Full dashboard: projects, site audits, keywords, position tracking, and reports.",
  short_description:
    "Full dashboard: projects, site audits, keywords, position tracking, and reports.",
  category: "seo",
  category_slug: "seo",
  processing_type: "client",
  seo_title: "SEO Platform — Site Audit & Rank Tracking",
  meta_description:
    "Manage SEO projects, run site audits, track keywords, and fix issues in one dashboard.",
};

const SEO_UTILITY_TOOLS: ToolMeta[] = [
  {
    id: "meta-tag-generator",
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate HTML meta tags for SEO.",
    short_description: "Generate HTML meta tags for SEO.",
    category: "seo",
    category_slug: "seo",
    processing_type: "client",
    seo_title: "Meta Tag Generator — Free Online Tool",
    meta_description: "Generate HTML meta tags for SEO.",
  },
  {
    id: "robots-txt-generator",
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    description: "Create a robots.txt file for your website.",
    short_description: "Create a robots.txt file for your website.",
    category: "seo",
    category_slug: "seo",
    processing_type: "client",
    seo_title: "Robots.txt Generator",
    meta_description: "Create a robots.txt file for your website.",
  },
  {
    id: "sitemap-generator",
    slug: "sitemap-generator",
    name: "Sitemap Generator",
    description: "Generate XML sitemap from URL list.",
    short_description: "Generate XML sitemap from URL list.",
    category: "seo",
    category_slug: "seo",
    processing_type: "client",
    seo_title: "Sitemap Generator",
    meta_description: "Generate XML sitemap from URL list.",
  },
  {
    id: "open-graph-generator",
    slug: "open-graph-generator",
    name: "Open Graph Generator",
    description: "Generate Open Graph meta tags for social sharing.",
    short_description: "Generate Open Graph meta tags for social sharing.",
    category: "seo",
    category_slug: "seo",
    processing_type: "client",
    seo_title: "Open Graph Generator",
    meta_description: "Generate Open Graph meta tags for social sharing.",
  },
  {
    id: "serp-preview",
    slug: "serp-preview",
    name: "SERP Preview",
    description: "Preview how your page appears in Google search.",
    short_description: "Preview how your page appears in Google search.",
    category: "seo",
    category_slug: "seo",
    processing_type: "client",
    seo_title: "SERP Preview",
    meta_description: "Preview how your page appears in Google search.",
  },
  {
    id: "utm-builder",
    slug: "utm-builder",
    name: "UTM Builder",
    description: "Build UTM tracking URLs for campaigns.",
    short_description: "Build UTM tracking URLs for campaigns.",
    category: "seo",
    category_slug: "seo",
    processing_type: "client",
    seo_title: "UTM Builder",
    meta_description: "Build UTM tracking URLs for campaigns.",
  },
  {
    id: "keyword-density-checker",
    slug: "keyword-density-checker",
    name: "Keyword Density Checker",
    description: "Analyze keyword frequency in text.",
    short_description: "Analyze keyword frequency in text.",
    category: "seo",
    category_slug: "seo",
    processing_type: "client",
    seo_title: "Keyword Density Checker",
    meta_description: "Analyze keyword frequency in text.",
  },
];

export const localSeoTools: ToolMeta[] = [SEO_PLATFORM_TOOL, ...SEO_UTILITY_TOOLS];

export const SEO_TOOLS = localSeoTools;

export const SEO_CATEGORY = {
  slug: "seo",
  name: "SEO Tools",
  description:
    "SEO Platform plus meta tags, sitemaps, SERP preview, and on-page utilities.",
  tools: localSeoTools,
};

export function getSeoTool(slug: string): ToolMeta | undefined {
  return localSeoTools.find((tool) => tool.slug === slug);
}

const SEO_POPULAR_SLUGS = new Set(["seo-platform", "meta-tag-generator"]);

export function localSeoToolsFiltered(params?: { popular?: boolean }): ToolMeta[] {
  if (params?.popular) {
    return localSeoTools.filter((t) => SEO_POPULAR_SLUGS.has(t.slug));
  }
  return localSeoTools;
}

/** Nav / menus: SEO Platform lives under /tools/seo/platform, not /tools/seo/seo-platform */
export function seoToolHref(
  categorySlug: string,
  tool: { slug: string; category_slug?: string },
): string {
  if (tool.slug === "seo-platform") {
    return "/tools/seo/platform";
  }
  return `/tools/${tool.category_slug || categorySlug}/${tool.slug}`;
}

export function overlaySeoCategoryTools(
  tools: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  const rest = tools.filter((t) => String(t.slug) !== "seo-platform");
  const platform = {
    slug: SEO_PLATFORM_TOOL.slug,
    name: SEO_PLATFORM_TOOL.name,
    category_slug: "seo",
    short_description: SEO_PLATFORM_TOOL.short_description,
  };
  return [platform, ...rest];
}
