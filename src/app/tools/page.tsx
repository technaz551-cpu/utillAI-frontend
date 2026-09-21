
import Link from "next/link";
import { fetchCategories } from "@/lib/api";
import { categoryAccent } from "@/lib/utils";

import {
  FileText,
  FileImage,
  FileCode,
  FileJson,
  FileArchive,
  FileSpreadsheet,
  FileSearch,
  FileType,
  Image,
  Sparkles,
  Code2,
  Globe,
  Search,
  Languages,
  ShieldCheck,
  Wrench,
  Video,
  Music,
  ScanText,
  Palette,
  File,
} from "lucide-react";

type Tool = {
  slug: string;
  name: string;
  short_description: string;
  category_slug: string;
};

type Category = {
  slug: string;
  name: string;
  tools: Tool[];
};

// Select icon according to tool name or slug
function getToolIcon(slug: string, name: string) {
  const value = `${slug} ${name}`.toLowerCase();

  if (/pdf/.test(value)) return FileText;

  if (/image|photo|picture|jpg|jpeg|png|webp/.test(value))
    return FileImage;

  if (/video|mp4|movie|gif/.test(value))
    return Video;

  if (/audio|music|mp3|sound|voice/.test(value))
    return Music;

  if (/json/.test(value))
    return FileJson;

  if (/code|html|css|javascript|typescript|developer/.test(value))
    return Code2;

  if (/excel|spreadsheet|csv/.test(value))
    return FileSpreadsheet;

  if (/word|docx|markdown/.test(value))
    return FileType;

  if (/zip|compress|archive|extract/.test(value))
    return FileArchive;

  if (/translate|language/.test(value))
    return Languages;

  if (/seo|search|keyword/.test(value))
    return Search;

  if (/ai|chatgpt|generator|generate/.test(value))
    return Sparkles;

  if (/internet|url|website|domain/.test(value))
    return Globe;

  if (/ocr|scan/.test(value))
    return ScanText;

  if (/color|palette|design/.test(value))
    return Palette;

  if (/security|password|hash|encrypt/.test(value))
    return ShieldCheck;

  if (/metadata|exif|inspect|analy/.test(value))
    return FileSearch;

  if (/text|document|editor|summar/.test(value))
    return FileText;

  return Wrench;
}

export default async function AllToolsPage() {
  const categories = (await fetchCategories().catch(
    () => []
  )) as Category[];

  const totalTools = categories.reduce(
    (total, category) => total + (category.tools?.length || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/70 via-white to-sky-50/40">

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-blue-100/70">

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 md:py-24">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles size={15} className="text-amber-500" />

              <span>{totalTools} Tools</span>

              <span className="text-blue-200">•</span>

              <span className="text-slate-500">
                All in One Place
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Explore All
              <br />

              <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                Tools & Categories
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Discover powerful tools for productivity, creativity,
              and more. Browse PDF, AI, image, developer, text, SEO
              and other tools — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">

              <a
                href="#tool-categories"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              >
                Explore Tools
                <span aria-hidden="true">→</span>
              </a>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-5 py-3.5 text-sm font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {categories.length} Categories
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section
        id="tool-categories"
        className="mx-auto max-w-7xl px-4 py-12 sm:py-16"
      >

        <div className="mb-10">

          <span className="mb-3 inline-flex rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
            Browse Collection
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            All Tool Categories
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Find the right tool for your task. Choose a category
            and explore the available tools.
          </p>

        </div>

        <div className="space-y-12 sm:space-y-16">

          {categories.map((cat) => {
            const accent = categoryAccent(cat.slug);
            const tools = cat.tools || [];

            return (
              <section key={cat.slug} className="scroll-mt-24">

                {/* Category Heading */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                  <Link
                    href={`/tools/${cat.slug}`}
                    className="group inline-flex items-center gap-3"
                  >

                    <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-600 to-sky-400" />

                    <h2 className="text-xl font-bold tracking-tight text-slate-800 transition group-hover:text-blue-600 sm:text-2xl">
                      {cat.name}
                    </h2>

                    <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                      →
                    </span>

                  </Link>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge}`}
                  >
                    {tools.length} Tools
                  </span>

                </div>

                {/* Tools Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {tools.map((tool) => {
                    const Icon = getToolIcon(
                      tool.slug,
                      tool.name
                    );

                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.category_slug}/${tool.slug}`}
                        className="group relative isolate flex min-h-36 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
                      >

                        {/* Full Card Hover Fill */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 z-0 origin-left scale-x-0 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100/70 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                        />

                        {/* Card Content */}
                        <div className="relative z-10 flex h-full flex-1 flex-col">

                          {/* Icon + Name + Arrow */}
                          <div className="flex items-start justify-between gap-3">

                            <div className="flex min-w-0 items-start gap-3">

                              {/* Tool Icon */}
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:from-blue-600 group-hover:to-sky-500 group-hover:text-white">

                                <Icon
                                  size={21}
                                  strokeWidth={1.8}
                                />

                              </div>

                              {/* Tool Name */}
                              <h3 className="pt-1 text-base font-bold leading-6 text-slate-800 transition-colors group-hover:text-blue-700">
                                {tool.name}
                              </h3>

                            </div>

                            {/* Arrow */}
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                              →
                            </span>

                          </div>

                          {/* Description */}
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 transition-colors group-hover:text-slate-600">
                            {tool.short_description}
                          </p>

                          {/* Open Tool */}
                          <div className="mt-auto pt-4">

                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                              Open Tool

                              <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                              </span>
                            </span>

                          </div>

                        </div>
                      </Link>
                    );
                  })}

                </div>
              </section>
            );
          })}

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-10 shadow-xl shadow-blue-200/50 sm:px-10 sm:py-12">

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to get started?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                Explore the collection and find tools that make
                your everyday tasks easier.
              </p>

            </div>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Back to Home
              <span aria-hidden="true">→</span>
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}