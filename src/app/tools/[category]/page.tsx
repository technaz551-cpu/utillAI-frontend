import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCategory } from "@/lib/api";
import { card, categoryAccent } from "@/lib/utils";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: `${category.replace("-", " ")} Tools — Free Online`, description: `Free online ${category} tools.` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const data = await fetchCategory(category) as {
    slug: string;
    name: string;
    description: string;
    tools: Array<{ slug: string; name: string; short_description: string; category_slug: string }>;
  } | null;
  if (!data) notFound();

  const accent = categoryAccent(data.slug);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${accent.badge}`}>
        {data.tools.length} tools
      </span>
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{data.name}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">{data.description}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.tools.map((t) => (
          <Link key={t.slug} href={`/tools/${t.category_slug}/${t.slug}`} className={card(accent.ring + " group transition-all hover:bg-[var(--brand-primary)] hover:text-white") + " block"}>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand-primary)] group-hover:bg-white" />
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)] group-hover:text-white">{t.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] group-hover:text-white/80">{t.short_description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
