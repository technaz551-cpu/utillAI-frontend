import { apiFetch } from "@/lib/api";
import { HomePageClient } from "@/components/Home/HomePageClient";
import { PDF_CATEGORY, PDF_TOOLS } from "@/features/tools/pdf-catalog";
import { AI_CATEGORY, AI_TOOLS } from "@/features/tools/ai-catalog";
import { IMAGE_CATEGORY, IMAGE_TOOLS } from "@/features/tools/image-catalog";
import { INTERNET_CATEGORY, INTERNET_TOOLS } from "@/features/tools/internet-catalog";

export default async function HomePage() {
  const fallbackCategories = [
    { ...PDF_CATEGORY, count: "10+ Tools" },
    { ...IMAGE_CATEGORY, count: "12+ Tools" },
    { ...AI_CATEGORY, count: "15+ Tools" },
    { ...INTERNET_CATEGORY, count: "8+ Tools" },
    { slug: "developer", name: "Developer Tools", description: "Format, convert, encode, and debug with ease.", count: "10+ Tools" },
    { slug: "text", name: "Text Tools", description: "Count, transform, clean and analyze text instantly.", count: "8+ Tools" },
  ];

  const fallbackTools = [
    ...PDF_TOOLS,
    ...AI_TOOLS,
    ...IMAGE_TOOLS,
    ...INTERNET_TOOLS,
  ];

  const categories = await apiFetch<any[]>("/categories").catch(() => fallbackCategories);
  const popular = await apiFetch<any[]>("/tools/popular").catch(() => fallbackTools.slice(0, 6));

  return (
    <HomePageClient
      categories={categories || fallbackCategories}
      popular={popular || fallbackTools.slice(0, 6)}
      totalTools={fallbackTools.length || 63}
    />
  );
}