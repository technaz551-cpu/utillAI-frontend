import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchCategories } from "@/lib/api";
import { btn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Categories", href: "/tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CATEGORY_ITEMS = [
  { slug: "pdf", label: "PDF", icon: "PDF", description: "Merge, convert, and optimize files." },
  { slug: "image", label: "Image", icon: "IMG", description: "Resize, convert, and transform visuals." },
  { slug: "ai", label: "AI", icon: "AI", description: "Summaries, detection, and text helpers." },
  { slug: "internet", label: "Internet", icon: "NET", description: "Check URLs, DNS, and network tools." },
  { slug: "developer", label: "Developer", icon: "DEV", description: "Utility tools for faster workflows." },
  { slug: "text", label: "Text", icon: "TXT", description: "Format, clean, and analyze content." },
];

export async function Header() {
  const categories = await fetchCategories().catch(() => []);
  const toolsByCategory = categories as Array<{
    slug: string;
    tools?: Array<{ slug: string; name: string; category_slug?: string }>;
  }>;

  return (
    <header className="group/header sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)]/90 backdrop-blur-2xl">
      <div className="section-shell grid h-[5.9rem] grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
        <div className="hidden items-center justify-start gap-3 sm:flex">
          <Link href="/pricing" className={btn("ghost") + " !rounded-full !px-3 !py-2 text-[10px] uppercase tracking-[0.18em]"}>Plans</Link>
          <Link href="/tools" className={btn("secondary") + " !rounded-full !px-3 !py-2 text-[10px] uppercase tracking-[0.18em]"}>Explore</Link>
        </div>

        <Link href="/" className="group/logo flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02]">
          <span className="brand-mark !h-10 !w-10 !rounded-xl !text-lg sm:!h-[3.2rem] sm:!w-[3.2rem] sm:!rounded-[0.9rem] sm:!text-[1.55rem]">T</span>
          <span className="flex items-center gap-1.5 text-[1.35rem] font-black tracking-[-0.08em] text-[var(--foreground)] sm:gap-2 sm:text-[1.7rem] md:text-[2.15rem]">
            UtilAI
            <span className="inline-flex items-center rounded-full border border-[var(--brand-primary)]/50 bg-[var(--brand-primary)]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              AI
            </span>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          <nav className="nav-shell hidden items-center gap-1 rounded-full border border-[var(--border)] bg-white/80 p-1 shadow-[0_12px_24px_rgba(17,42,33,0.06)] opacity-0 transition-all duration-200 lg:flex lg:translate-y-1 lg:group-hover/header:translate-y-0 lg:group-hover/header:opacity-100 lg:group-focus-within:opacity-100 lg:group-hover/logo:opacity-100 lg:[&:hover]:opacity-100 lg:[&:hover]:translate-y-0">
            {NAV_ITEMS.map((item) => {
              if (item.label === "Tools" || item.label === "Categories") {
                return (
                  <div key={item.label} className="group/menu relative">
                    <button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand-primary)] hover:text-white">
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+0.9rem)] w-[720px] -translate-x-1/2 rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-5 text-left opacity-0 shadow-[0_30px_80px_rgba(0,0,0,0.22)] transition-all duration-200 group-hover/menu:visible group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0 -translate-y-3 invisible">
                      <div className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Browse all</p>
                          <p className="mt-1 text-sm text-[var(--foreground)]">Powerful tools for creative, fast-moving work</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1.5 text-[11px] font-semibold text-[var(--foreground)]">
                          <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                          Workflow suite
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {CATEGORY_ITEMS.map((category) => {
                          const tools = toolsByCategory.find((item) => item.slug === category.slug)?.tools || [];
                          return (
                            <div
                              key={category.slug}
                              className="group/category rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/35 hover:bg-[var(--brand-primary)]"
                            >
                              <Link href={`/tools/${category.slug}`} className="flex items-center justify-between gap-3">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/25 via-[var(--brand-secondary)]/20 to-[var(--brand-accent)]/25 text-[11px] font-black tracking-[0.06em] text-[var(--foreground)] group-hover/category:bg-white/15 group-hover/category:text-white">
                                  {category.icon}
                                </span>
                                <ArrowRight className="h-4 w-4 text-[var(--muted)] group-hover/category:text-white" />
                              </Link>
                              <Link href={`/tools/${category.slug}`} className="mt-4 block text-base font-bold text-[var(--foreground)] group-hover/category:text-white">
                                {category.label}
                              </Link>
                              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)] group-hover/category:text-white/80">{category.description}</p>
                              {item.label === "Tools" && (
                                <ul className="mt-3 space-y-1 border-t border-[var(--border)]/70 pt-3 group-hover/category:border-white/20">
                                  {tools.slice(0, 5).map((tool) => (
                                    <li key={tool.slug} className="flex items-start gap-2 text-xs text-[var(--muted)] group-hover/category:text-white/85">
                                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)] group-hover/category:bg-white" />
                                      <Link href={`/tools/${tool.category_slug || category.slug}/${tool.slug}`} className="hover:underline">
                                        {tool.name}
                                      </Link>
                                    </li>
                                  ))}
                                  {tools.length > 5 && (
                                    <li className="pt-1 text-xs font-semibold text-[var(--brand-primary)] group-hover/category:text-white">
                                      <Link href={`/tools/${category.slug}`}>View all {tools.length} tools</Link>
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand-primary)] hover:text-white"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <AuthStatus />

          <MobileNav
            navItems={NAV_ITEMS}
            categories={CATEGORY_ITEMS.map((category) => ({
              slug: category.slug,
              label: category.label,
              tools: toolsByCategory.find((item) => item.slug === category.slug)?.tools || [],
            }))}
          />
        </div>
      </div>
    </header>
  );
}
