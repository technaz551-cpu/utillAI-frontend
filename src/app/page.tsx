import Link from "next/link";
import { ArrowRight, Search, Shield, Zap } from "lucide-react";
import { fetchCategories, fetchTools } from "@/lib/api";
import { btn, card, categoryAccent } from "@/lib/utils";

export default async function HomePage() {
  const [categories, popular] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchTools({ popular: true }).catch(() => []),
  ]);

  const totalTools = (categories as Array<{ tools?: unknown[] }>).reduce((n, c) => n + (c.tools?.length || 0), 0);

  return (
    <main>
      <section className="relative overflow-hidden px-4 pb-20 pt-16 md:pt-24">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)]">
            <Zap className="h-3.5 w-3.5 text-[var(--accent)]" />
            {totalTools || "60+"} free tools · No signup required
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Online tools that
            <span className="block text-[var(--accent)]">just get the job done</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            PDFs, images, developer utilities, network tools, text helpers and more — fast, private, and built for real workflows.
          </p>

          <form action="/tools" className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                name="q"
                placeholder="Search tools — merge pdf, dns lookup, json format…"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-[var(--accent)]"
              />
            </div>
            <button type="submit" className={btn("primary") + " px-6"}>Search</button>
          </form>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Tools", value: String(totalTools || "60+") },
              { label: "Categories", value: String(categories.length || 9) },
              { label: "Client-side", value: "Many" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-3">
                <p className="text-xl font-semibold">{s.value}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Popular tools</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Most used this week</p>
          </div>
          <Link href="/tools" className="hidden items-center gap-1 text-sm text-[var(--accent)] hover:underline sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(popular as Array<{ slug: string; name: string; short_description: string; category_slug: string }>).map((t) => {
            const accent = categoryAccent(t.category_slug);
            return (
              <Link
                key={t.slug}
                href={`/tools/${t.category_slug}/${t.slug}`}
                className={card(accent.ring + " group transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-raised)]")}
              >
                <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${accent.badge}`}>
                  {t.category_slug.replace("-", " ")}
                </span>
                <h3 className={`mt-3 font-medium ${accent.text}`}>{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">{t.short_description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <h2 className="text-2xl font-semibold">Browse by category</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Pick a category to explore related tools</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(categories as Array<{ slug: string; name: string; description: string; tools?: unknown[] }>).map((c) => {
            const accent = categoryAccent(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/tools/${c.slug}`}
                className={card(accent.ring + " transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-raised)]")}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-medium">{c.name}</h3>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${accent.badge}`}>
                    {c.tools?.length || 0}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{c.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--surface)]/40 px-4 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Shield className="mb-4 h-8 w-8 text-[var(--accent)]" />
          <h2 className="text-xl font-semibold">Your data stays yours</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Client-side tools run entirely in your browser. Server tools process files securely and delete them automatically after processing.
          </p>
        </div>
      </section>
    </main>
  );
}
