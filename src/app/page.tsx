
import { fetchCategories, fetchTools } from "@/lib/api";
import { HomePageClient } from "@/components/Home/HomePageClient";

export default async function HomePage() {
  const [categories, popular] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchTools({ popular: true }).catch(() => []),
  ]);

  const totalTools = (
    categories as Array<{ tools?: unknown[] }>
  ).reduce(
    (n, c) => n + (c.tools?.length || 0),
    0
  );

  return (
    <HomePageClient
      categories={categories}
      popular={popular}
      totalTools={totalTools}
    />
  );
}