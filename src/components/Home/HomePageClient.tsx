"use client";

import Link from "next/link";

import {
  ArrowRight,
  BrainCircuit,
  Code2,
  FileText,
  Globe,
  ImageIcon,
  PenTool,
  Search,
  Shield,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import { btn, card, categoryAccent } from "@/lib/utils";

const TOOL_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  image: ImageIcon,
  ai: BrainCircuit,
  internet: Globe,
  developer: Code2,
  text: PenTool,
};

type HomeCategory = {
  slug: string;
  name: string;
  description: string;
  tools?: unknown[];
};

type HomeTool = {
  slug: string;
  name: string;
  short_description: string;
  category_slug: string;
};

type HomePageClientProps = {
  categories: HomeCategory[];
  popular: HomeTool[];
  totalTools: number;
};

export function HomePageClient({
  categories,
  popular,
  totalTools,
}: HomePageClientProps) {
  const { t } = useLanguage();

  const stats = [
    {
      label: t.common.tools,
      value: String(totalTools || "60+"),
    },
    {
      label: t.common.categories,
      value: String(categories.length || 6),
    },
    {
      label: "Client-side",
      value: "Built in",
    },
  ];

  const features = [
    {
      title: "Secure by default",
      text: "Private-by-design workflows for files and sensitive content.",
    },
    {
      title: "Built for speed",
      text: "Fast processing, clear actions, and streamlined interfaces.",
    },
    {
      title: "Made for creativity",
      text: "A friendly SaaS experience with colorful, product-grade polish.",
    },
  ];

  return (
    <main className="pb-10">
      {/* HERO */}
      <section className="section-shell relative overflow-hidden pb-16 pt-10 md:pt-16">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[var(--pink)]/10 blur-3xl" />

        <div className="pointer-events-none absolute left-0 top-10 h-64 w-64 rounded-full bg-[var(--cyan)]/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] shadow-[0_10px_24px_rgba(66,46,94,0.05)]">
              <Zap className="h-3.5 w-3.5 text-[var(--pink)]" />

              {totalTools || "60+"} {t.common.tools} ·{" "}
              {t.common.workflowSuite}
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.07em] text-[var(--foreground)] md:text-6xl">
              {t.home.title}

              <span className="block bg-gradient-to-r from-[var(--pink)] via-[var(--purple)] to-[var(--cyan)] bg-clip-text text-transparent">
                {t.home.everythingYouNeed}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              {t.home.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools"
                className={btn("primary") + " !rounded-full"}
              >
                {t.home.exploreTools}
              </Link>

              <Link
                href="/pricing"
                className={btn("secondary") + " !rounded-full"}
              >
                {t.pricing.title}
              </Link>
            </div>

            <form
              action="/tools"
              className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />

                <input
                  name="q"
                  placeholder={t.tools.searchPlaceholder}
                  className="w-full rounded-full border border-[var(--border)] bg-white/90 py-3.5 pl-11 pr-4 text-sm text-[var(--foreground)] shadow-[0_12px_28px_rgba(76,52,104,0.05)] outline-none transition-all focus:border-[var(--pink)] focus:ring-4 focus:ring-[var(--pink-soft)]"
                />
              </div>

              <button
                type="submit"
                className={btn("primary") + " !rounded-full !px-6"}
              >
                {t.common.search}
              </button>
            </form>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-[var(--border)] bg-white/80 p-4 shadow-[0_16px_36px_rgba(79,58,120,0.06)]"
                >
                  <p className="text-2xl font-black tracking-[-0.05em] text-[var(--foreground)]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURED SUITE */}
          <div className="relative">
            <div className="rounded-[32px] border border-[var(--border)] bg-white/80 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm">
              <div className="rounded-[28px] bg-gradient-to-br from-[var(--surface-alt)] via-white to-[var(--surface-strong)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      {t.home.featuredTools}
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">
                      {t.home.popularTools}
                    </h2>
                  </div>

                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--pink)] via-[var(--purple)] to-[var(--cyan)] text-white shadow-[0_18px_36px_rgba(125,92,255,0.25)]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  {popular.slice(0, 4).map((tool) => {
                    const accent = categoryAccent(tool.category_slug);

                    const Icon =
                      TOOL_ICONS[tool.category_slug] ?? Sparkles;

                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.category_slug}/${tool.slug}`}
                        className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/30 hover:shadow-[0_16px_26px_rgba(2,20,31,0.2)]"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${accent.badge}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>

                          <div>
                            <p className="font-bold text-[var(--foreground)]">
                              {tool.name}
                            </p>

                            <p className="text-xs capitalize text-[var(--muted)]">
                              {tool.category_slug.replace("-", " ")}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--foreground)]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS */}
      <section className="section-shell pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              {t.home.popularTools}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--foreground)]">
              {t.home.everythingYouNeed}
            </h2>
          </div>

          <Link
            href="/tools"
            className="hidden items-center gap-2 text-sm font-semibold text-[var(--foreground)] sm:inline-flex"
          >
            {t.common.viewAll}

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {popular.slice(0, 8).map((tool) => {
            const accent = categoryAccent(tool.category_slug);

            const Icon =
              TOOL_ICONS[tool.category_slug] ?? Sparkles;

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.category_slug}/${tool.slug}`}
                className={card(
                  accent.ring +
                    " group hover:-translate-y-1.5 hover:bg-[var(--brand-primary)] hover:text-white hover:shadow-[0_22px_38px_rgba(2,22,35,0.24)]"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${accent.badge} group-hover:bg-white/15 group-hover:text-white`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] group-hover:border-white/25 group-hover:bg-white/15 group-hover:text-white">
                    {tool.category_slug}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[var(--foreground)] group-hover:text-white">
                  {tool.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] group-hover:text-white/80">
                  {tool.short_description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-white">
                  {t.home.tryNow}

                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-shell pb-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              {t.categories.title}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--foreground)]">
              {t.home.everythingYouNeed}
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const accent = categoryAccent(category.slug);

            const Icon =
              TOOL_ICONS[category.slug] ?? Sparkles;

            return (
              <Link
                key={category.slug}
                href={`/tools/${category.slug}`}
                className={card(
                  accent.ring +
                    " group hover:-translate-y-1.5 hover:bg-[var(--brand-primary)] hover:text-white hover:shadow-[0_22px_38px_rgba(2,22,35,0.24)]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black ${accent.badge} group-hover:bg-white/15 group-hover:text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] group-hover:border-white/25 group-hover:bg-white/15 group-hover:text-white">
                    {category.tools?.length || 0}{" "}
                    {t.common.tools}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[var(--foreground)] group-hover:text-white">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] group-hover:text-white/80">
                  {category.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-white">
                  {t.home.learnMore}

                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white/70 py-16">
        <div className="section-shell">
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_32px_rgba(76,54,107,0.06)]"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--pink)]/15 via-[var(--purple)]/15 to-[var(--cyan)]/15 text-[var(--foreground)]">
                  <Wand2 className="h-5 w-5 text-[var(--pink)]" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[var(--foreground)]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* PRIVACY */}
          <div className="mt-8 flex flex-col items-center gap-4 rounded-[32px] border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] to-[var(--surface-alt)] p-8 text-center shadow-[0_18px_38px_rgba(68,42,96,0.07)]">
            <Shield className="h-9 w-9 text-[var(--pink)]" />

            <h3 className="text-2xl font-black tracking-[-0.05em] text-[var(--foreground)]">
              Your data stays yours
            </h3>

            <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              Many tools work locally in the browser, and server-side tools
              are processed securely with clear delivery and privacy-minded
              patterns.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}