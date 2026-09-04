import { MetadataRoute } from "next";
import { SITE_URL, apiFetch } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await apiFetch<Array<{ slug: string; category_slug: string }>>("/tools").catch(() => []);
  const categories = await apiFetch<Array<{ slug: string }>>("/categories").catch(() => []);

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.7 },
  ];

  categories.forEach((c) => entries.push({ url: `${SITE_URL}/tools/${c.slug}`, changeFrequency: "weekly", priority: 0.8 }));
  tools.forEach((t) => entries.push({ url: `${SITE_URL}/tools/${t.category_slug}/${t.slug}`, changeFrequency: "weekly", priority: 0.8 }));

  return entries;
}
