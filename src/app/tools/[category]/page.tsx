import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Braces,
  Code2,
  FileCode2,
  FileJson,
  Globe,
  Hash,
  Image,
  KeyRound,
  Link2,
  Terminal,
  Wrench,
} from "lucide-react";

import { fetchCategory } from "@/lib/api";
import { categoryAccent } from "@/lib/utils";

type Props = {
  params: Promise<{ category: string }>;
};

type CategoryData = {
  slug: string;
  name: string;
  description: string;
  tools: Array<{
    slug: string;
    name: string;
    short_description: string;
    category_slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { category } = await params;

  const readableCategory = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `${readableCategory} Tools — Free Online`,
    description: `Free online ${readableCategory.toLowerCase()} tools.`,
  };
}

/* -------------------------------- */
/* TOOL ICON                         */
/* -------------------------------- */

function getToolIcon(slug: string) {
  const iconClass = "h-5 w-5";

  const icons: Record<string, React.ReactNode> = {
    "json-formatter": <Braces className={iconClass} />,
    "json-validator": <FileJson className={iconClass} />,
    base64: <Code2 className={iconClass} />,
    "url-encoder": <Link2 className={iconClass} />,
    "uuid-generator": <KeyRound className={iconClass} />,
    "hash-generator": <Hash className={iconClass} />,
    "jwt-decoder": <Terminal className={iconClass} />,
    "timestamp-converter": <Globe className={iconClass} />,

    "jpg-to-png": <Image className={iconClass} />,
    "png-to-jpg": <Image className={iconClass} />,
    "webp-converter": <Image className={iconClass} />,

    "pdf-editor": <FileCode2 className={iconClass} />,

    default: <Wrench className={iconClass} />,
  };

  return icons[slug] ?? icons.default;
}

/* -------------------------------- */
/* CATEGORY PAGE                    */
/* -------------------------------- */

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const data = (await fetchCategory(category)) as CategoryData | null;

  if (!data) notFound();

  const accent = categoryAccent(data.slug);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ============================= */}
      {/* HERO                          */}
      {/* ============================= */}

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {/* Background decoration */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-24 top-20 h-40 w-40 rounded-full bg-blue-400/5 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          {/* Right top corner image with hover */}
          {/* <div className="group absolute right-4 top-6 z-10 hidden w-40 overflow-hidden rounded-2xl border border-white/80 bg-white/40 p-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-2 hover:scale-105 hover:shadow-2xl md:right-6 md:top-10 md:block lg:w-56 xl:w-64"> */}
          <div className="group absolute right-4 top-16 z-10 hidden w-64 overflow-hidden rounded-2xl border border-white/80 bg-white/40 p-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-2 hover:scale-105 hover:shadow-2xl md:right-6 md:top-24 md:block lg:w-80 xl:w-[28rem]">
            <img
              src="/images4.png"
              alt="UtilAI Mobile & Web Tools"
              className="block h-auto w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Breadcrumb */}
          <div className="mb-7 flex items-center gap-2 text-sm text-[var(--muted)]">
            <Link href="/" className="transition hover:text-blue-500">
              Home
            </Link>

            <span>/</span>

            <span className="text-[var(--foreground)]">{data.name}</span>
          </div>

          <div className="max-w-3xl lg:max-w-2xl">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-500">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

              {data.tools.length} {data.tools.length === 1 ? "Tool" : "Tools"}
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
              {data.name}
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
              {data.description}
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-9 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Free online tools
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Easy to use
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              No installation
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* TOOLS                         */}
      {/* ============================= */}

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* Section heading */}
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              Explore tools
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)] md:text-3xl">
              Choose a tool
            </h2>
          </div>

          <p className="text-sm text-[var(--muted)]">
            {data.tools.length} tools available
          </p>
        </div>

        {/* Tool grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.category_slug}/${tool.slug}`}
              className="
                group relative overflow-hidden rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
                p-5
                transition-all duration-300
                hover:-translate-y-1
                hover:border-blue-500
                hover:bg-blue-500
                hover:shadow-xl
                hover:shadow-blue-500/20
              "
            >
              {/* Full-card blue hover layer */}
              <div
                aria-hidden
                className="
                  pointer-events-none absolute inset-0
                  -translate-x-full
                  bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600
                  transition-transform duration-300
                  group-hover:translate-x-0
                "
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  {/* Icon */}
                  <div
                    className="
                      flex h-11 w-11 shrink-0 items-center justify-center
                      rounded-xl
                      border border-blue-500/20
                      bg-blue-500/10
                      text-blue-500
                      transition-all duration-300
                      group-hover:border-white/20
                      group-hover:bg-white/15
                      group-hover:text-white
                    "
                  >
                    {getToolIcon(tool.slug)}
                  </div>

                  {/* Arrow */}
                  <div
                    className="
                      flex h-8 w-8 items-center justify-center
                      rounded-full
                      border border-[var(--border)]
                      text-[var(--muted)]
                      transition-all duration-300
                      group-hover:border-white/20
                      group-hover:bg-white/10
                      group-hover:text-white
                    "
                  >
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Tool name */}
                <h3
                  className="
                    mt-5 text-base font-semibold
                    text-[var(--foreground)]
                    transition-colors
                    group-hover:text-white
                  "
                >
                  {tool.name}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-2 line-clamp-2
                    text-sm leading-6
                    text-[var(--muted)]
                    transition-colors
                    group-hover:text-white/80
                  "
                >
                  {tool.short_description}
                </p>

                {/* Bottom action */}
                <div
                  className="
                    mt-5 flex items-center gap-1.5
                    text-xs font-semibold
                    text-blue-500
                    transition-colors
                    group-hover:text-white
                  "
                >
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {data.tools.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Wrench className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No tools available yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Tools for this category will appear here when they are added.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}