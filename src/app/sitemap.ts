import { MetadataRoute } from "next";
import { SITE_URL, apiFetch } from "@/lib/api";
import { PDF_CATEGORY, PDF_TOOLS } from "@/features/tools/pdf-catalog";
import { AI_CATEGORY, AI_TOOLS } from "@/features/tools/ai-catalog";
import { IMAGE_CATEGORY, IMAGE_TOOLS } from "@/features/tools/image-catalog";
import { INTERNET_CATEGORY, INTERNET_TOOLS } from "@/features/tools/internet-catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallbackTools = [...PDF_TOOLS, ...AI_TOOLS, ...IMAGE_TOOLS, ...INTERNET_TOOLS];
  const fallbackCategories = [PDF_CATEGORY, AI_CATEGORY, IMAGE_CATEGORY, INTERNET_CATEGORY];
  const tools = await apiFetch<Array<{ slug: string; category_slug: string }>>("/tools").catch(() => fallbackTools);
  const categories = await apiFetch<Array<{ slug: string }>>("/categories").catch(() => fallbackCategories);

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.7 },
  ];

  categories.forEach((c) => entries.push({ url: `${SITE_URL}/tools/${c.slug}`, changeFrequency: "weekly", priority: 0.8 }));
  tools.forEach((t) => entries.push({ url: `${SITE_URL}/tools/${t.category_slug}/${t.slug}`, changeFrequency: "weekly", priority: 0.8 }));

  return entries;
}
