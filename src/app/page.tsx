
import { fetchCategories, fetchTools } from "@/lib/api";
import { HomePageClient } from "@/components/Home/HomePageClient";

export default async function HomePage() {
  const [categories, popular] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchTools({ popular: true }).catch(() => []),
  ]);

  const categoryData = categories
    .filter((category) => category.slug)
    .map((category) => ({
      slug: String(category.slug),
      name: String(category.name ?? ""),
      description: String(category.description ?? ""),
      tools: Array.isArray(category.tools) ? category.tools : [],
    }));

  const popularTools = popular
    .filter((tool) => tool.slug)
    .map((tool) => ({
      slug: String(tool.slug),
      name: String(tool.name ?? ""),
      short_description: String(tool.short_description ?? ""),
      category_slug: String(tool.category_slug ?? ""),
    }));

  const totalTools = categoryData.reduce(
    (total, category) => total + category.tools.length,
    0
  );

  return (
    <HomePageClient
      categories={categoryData}
      popular={popularTools}
      totalTools={totalTools}
    />
  );
}

