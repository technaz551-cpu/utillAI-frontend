import Link from "next/link";
import { btn } from "@/lib/utils";

const NAV_CATEGORIES = [
  { slug: "pdf", label: "PDF" },
  { slug: "ai", label: "AI" },
  { slug: "image", label: "Image" },
  { slug: "developer", label: "Developer" },
  { slug: "internet", label: "Internet" },
  { slug: "text", label: "Text" },
  { slug: "seo", label: "SEO" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight">
          Tool<span className="text-[var(--accent)]">Forge</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/tools" className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]">
            All Tools
          </Link>
          {NAV_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/tools/${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              {c.label}
            </Link>
          ))}
          <Link href="/pricing" className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]">
            Pricing
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/login" className={btn("ghost") + " hidden sm:inline-flex"}>Sign in</Link>
          <Link href="/pricing" className={btn("primary")}>Go Pro</Link>
        </div>
      </div>
    </header>
  );
}
