import Link from "next/link";
import { fetchCategories } from "@/lib/api";

export async function Footer() {
  const categories = await fetchCategories().catch(() => []) as Array<{ slug: string; name: string }>;

  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--surface)]/50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-lg font-semibold">ToolForge</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              Practical online utilities for files, code, networks and everyday work. Free to use, no account required.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Browse</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/tools" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">All tools</Link>
              <Link href="/pricing" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Pricing</Link>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Categories</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {categories.map((c) => (
                <Link key={c.slug} href={`/tools/${c.slug}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ToolForge</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--foreground)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
