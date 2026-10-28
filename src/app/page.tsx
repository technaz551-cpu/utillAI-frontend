import { fetchCategories, fetchTools } from "@/lib/api";
import { HomePageClient, type HomeTool } from "@/components/Home/HomePageClient";
import type { ToolMeta } from "@/features/tools/client-processors";

function toHomeTools(items: unknown[]): HomeTool[] {
  return items
    .map((item) => {
      const t = item as Partial<ToolMeta> & Record<string, unknown>;
      const slug = String(t.slug ?? "");
      if (!slug) return null;
      return {
        slug,
        name: String(t.name ?? ""),
        short_description: String(t.short_description ?? t.description ?? ""),
        category_slug: String(t.category_slug ?? t.category ?? ""),
      };
    })
    .filter((row): row is HomeTool => row !== null);
}

function categoryCountLabel(cat: {
  slug?: string;
  tools?: unknown[];
  count?: string;
}): string {
  if (cat.slug === "seo") return "8+ Tools";
  if (Array.isArray(cat.tools)) return `${cat.tools.length} Tools`;
  if (typeof cat.count === "string" && cat.count) return cat.count;
  return "10+ Tools";
}
import { PDF_CATEGORY, PDF_TOOLS } from "@/features/tools/pdf-catalog";
import { AI_CATEGORY, AI_TOOLS } from "@/features/tools/ai-catalog";
import { IMAGE_CATEGORY, IMAGE_TOOLS } from "@/features/tools/image-catalog";
import { INTERNET_CATEGORY, INTERNET_TOOLS } from "@/features/tools/internet-catalog";
import { SEO_CATEGORY, SEO_TOOLS } from "@/features/tools/seo-catalog";

export default async function HomePage() {
  const fallbackCategories = [
    { ...PDF_CATEGORY, count: "10+ Tools" },
    { ...IMAGE_CATEGORY, count: "12+ Tools" },
    { ...AI_CATEGORY, count: "15+ Tools" },
    { ...INTERNET_CATEGORY, count: "8+ Tools" },
    { slug: "developer", name: "Developer Tools", description: "Format, convert, encode, and debug with ease.", count: "10+ Tools" },
    { ...SEO_CATEGORY, count: "8+ Tools" },
  ];

  const fallbackTools = [
    ...PDF_TOOLS,
    ...AI_TOOLS,
    ...IMAGE_TOOLS,
    ...INTERNET_TOOLS,
    ...SEO_TOOLS,
  ];

  const [categories, popular] = await Promise.all([
    fetchCategories().catch(() => fallbackCategories),
    fetchTools({ popular: true }).catch(() => fallbackTools.slice(0, 6)),
  ]);

  const categoryCards = (categories || fallbackCategories).map((cat) => ({
    slug: String(cat.slug || ""),
    name: String(cat.name || "Category"),
    description: typeof cat.description === "string" ? cat.description : undefined,
    count: categoryCountLabel({
      slug: typeof cat.slug === "string" ? cat.slug : undefined,
      tools: "tools" in cat && Array.isArray(cat.tools) ? cat.tools : undefined,
      count: "count" in cat && typeof cat.count === "string" ? cat.count : undefined,
    }),
  }));

  const popularList =
    Array.isArray(popular) && popular.length > 0
      ? popular
      : fallbackTools.slice(0, 6);

  return (
    <HomePageClient
      categories={categoryCards.filter((c) => c.slug)}
      popular={toHomeTools(popularList)}
      totalTools={fallbackTools.length || 63}
    />
  );
}