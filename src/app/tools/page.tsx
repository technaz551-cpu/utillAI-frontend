import Link from "next/link";
import { fetchCategories } from "@/lib/api";
import { categoryAccent } from "@/lib/utils";

export default async function AllToolsPage() {
  const categories = await fetchCategories().catch(() => []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-semibold md:text-4xl">All tools</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">Browse the full collection — PDF, AI, image, developer, internet, text, SEO and more.</p>
      <div className="mt-12 space-y-14">
        {(categories as Array<{ slug: string; name: string; tools: Array<{ slug: string; name: string; short_description: string; category_slug: string }> }>).map((cat) => {
          const accent = categoryAccent(cat.slug);
          return (
            <section key={cat.slug}>
              <div className="mb-5 flex items-center gap-3">
                <Link href={`/tools/${cat.slug}`} className="text-xl font-semibold hover:text-[var(--accent)]">{cat.name}</Link>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${accent.badge}`}>{cat.tools?.length || 0}</span>
              </div>
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.tools?.map((t) => (
                  <li key={t.slug} className="group relative pl-6">
                    <span className="absolute left-1 top-2.5 h-2.5 w-2.5 rounded-full bg-[var(--brand-primary)] transition-transform group-hover:scale-125" />
                    <Link href={`/tools/${t.category_slug}/${t.slug}`} className="font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--brand-primary)]">
                      {t.name}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] line-clamp-2">{t.short_description}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
