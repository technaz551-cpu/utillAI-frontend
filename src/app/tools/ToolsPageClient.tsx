// "use client";

// import { useMemo, useState } from "react";
// import Link from "next/link";

// import { categoryAccent } from "@/lib/utils";

// import {
//   FileText,
//   FileImage,
//   FileJson,
//   FileArchive,
//   FileSpreadsheet,
//   FileSearch,
//   FileType,
//   Sparkles,
//   Code2,
//   Globe,
//   Search,
//   Languages,
//   ShieldCheck,
//   Wrench,
//   Video,
//   Music,
//   ScanText,
//   Palette,
//   ArrowRight,
//   ChevronRight,
//   Zap,
//   Grid3X3,
//   LayoutGrid,
//   AlignLeft,
//   ChevronDown,
//   Home,
// } from "lucide-react";

// /* =========================================================
//    TYPES
// ========================================================= */

// type Tool = {
//   slug: string;
//   name: string;
//   short_description: string;
//   category_slug: string;
// };

// type Category = {
//   slug: string;
//   name: string;
//   tools: Tool[];
// };

// type SortOption = "popular" | "az" | "za";

// /* =========================================================
//    TOOL ICON
// ========================================================= */

// function getToolIcon(slug: string, name: string) {
//   const value = `${slug} ${name}`.toLowerCase();

//   if (/pdf/.test(value)) return FileText;
//   if (/image|photo|picture|jpg|jpeg|png|webp/.test(value)) return FileImage;
//   if (/video|mp4|movie|gif/.test(value)) return Video;
//   if (/audio|music|mp3|sound|voice/.test(value)) return Music;
//   if (/json/.test(value)) return FileJson;
//   if (/code|html|css|javascript|typescript|developer/.test(value)) return Code2;
//   if (/excel|spreadsheet|csv/.test(value)) return FileSpreadsheet;
//   if (/word|docx|markdown/.test(value)) return FileType;
//   if (/zip|compress|archive|extract/.test(value)) return FileArchive;
//   if (/translate|language/.test(value)) return Languages;
//   if (/seo|search|keyword/.test(value)) return Search;
//   if (/ai|chatgpt|generator|generate/.test(value)) return Sparkles;
//   if (/internet|url|website|domain/.test(value)) return Globe;
//   if (/ocr|scan/.test(value)) return ScanText;
//   if (/color|palette|design/.test(value)) return Palette;
//   if (/security|password|hash|encrypt/.test(value)) return ShieldCheck;
//   if (/metadata|exif|inspect|analy/.test(value)) return FileSearch;
//   if (/text|document|editor|summar/.test(value)) return FileText;

//   return Wrench;
// }

// /* =========================================================
//    CATEGORY ICON (for sidebar)
// ========================================================= */

// function getCategoryIcon(slug: string, name: string) {
//   const value = `${slug} ${name}`.toLowerCase();

//   if (/pdf/.test(value)) return FileText;
//   if (/image/.test(value)) return FileImage;
//   if (/ai/.test(value)) return Sparkles;
//   if (/developer|code/.test(value)) return Code2;
//   if (/text/.test(value)) return AlignLeft;
//   if (/internet|web/.test(value)) return Globe;
//   if (/seo/.test(value)) return Search;
//   if (/productivity/.test(value)) return Zap;
//   if (/design/.test(value)) return Palette;

//   return Grid3X3;
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// export default function ToolsPageClient({
//   categories,
// }: {
//   categories: Category[];
// }) {
//   const [activeCategory, setActiveCategory] = useState<string>("all");
//   const [query, setQuery] = useState("");
//   const [sortBy, setSortBy] = useState<SortOption>("popular");

//   const totalTools = categories.reduce(
//     (total, category) => total + (category.tools?.length || 0),
//     0
//   );

//   /* Filtered + sorted categories, based on sidebar/pill selection and search */
//   const visibleCategories = useMemo(() => {
//     const q = query.trim().toLowerCase();

//     const base =
//       activeCategory === "all"
//         ? categories
//         : categories.filter((c) => c.slug === activeCategory);

//     return base
//       .map((cat) => {
//         let tools = cat.tools || [];

//         if (q) {
//           tools = tools.filter(
//             (t) =>
//               t.name.toLowerCase().includes(q) ||
//               t.short_description?.toLowerCase().includes(q)
//           );
//         }

//         if (sortBy === "az") {
//           tools = [...tools].sort((a, b) => a.name.localeCompare(b.name));
//         } else if (sortBy === "za") {
//           tools = [...tools].sort((a, b) => b.name.localeCompare(a.name));
//         }

//         return { ...cat, tools };
//       })
//       .filter((cat) => cat.tools.length > 0);
//   }, [categories, activeCategory, query, sortBy]);

//   const activeCategoryName =
//     activeCategory === "all"
//       ? "All Tools"
//       : categories.find((c) => c.slug === activeCategory)?.name || "Tools";

//   return (
//     <main className="min-h-screen bg-[#f7fbff]">
//       <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
//         {/* Breadcrumb */}
//         <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
//           <Home size={14} />
//           <Link href="/" className="hover:text-blue-600">
//             Home
//           </Link>
//           <ChevronRight size={14} />
//           <span className="font-medium text-slate-600">All Tools</span>
//         </div>

//         <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
//           {/* =================================================
//               SIDEBAR
//           ================================================= */}
//           <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[280px]">
//             <div className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
//               <button
//                 onClick={() => setActiveCategory("all")}
//                 className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
//                   activeCategory === "all"
//                     ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                     : "text-slate-600 hover:bg-blue-50"
//                 }`}
//               >
//                 <span className="flex items-center gap-3">
//                   <LayoutGrid size={17} />
//                   All Tools
//                 </span>
//                 <span
//                   className={`rounded-full px-2 py-0.5 text-xs ${
//                     activeCategory === "all"
//                       ? "bg-white/20 text-white"
//                       : "bg-blue-50 text-blue-600"
//                   }`}
//                 >
//                   {totalTools}
//                 </span>
//               </button>

//               <div className="mt-1 space-y-1">
//                 {categories.map((cat) => {
//                   const Icon = getCategoryIcon(cat.slug, cat.name);
//                   const isActive = activeCategory === cat.slug;

//                   return (
//                     <button
//                       key={cat.slug}
//                       onClick={() => setActiveCategory(cat.slug)}
//                       className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
//                         isActive
//                           ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                           : "text-slate-600 hover:bg-blue-50"
//                       }`}
//                     >
//                       <span className="flex items-center gap-3">
//                         <Icon size={17} />
//                         {cat.name}
//                       </span>
//                       <span
//                         className={`rounded-full px-2 py-0.5 text-xs ${
//                           isActive
//                             ? "bg-white/20 text-white"
//                             : "bg-blue-50 text-blue-600"
//                         }`}
//                       >
//                         {cat.tools?.length || 0}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Upgrade to Pro card */}
//             <div className="mt-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white shadow-lg shadow-blue-200/50">
//               <Zap size={20} className="mb-3" />
//               <h3 className="text-base font-bold">Upgrade to Pro</h3>
//               <p className="mt-1.5 text-sm leading-6 text-blue-100">
//                 Get unlimited access to all premium tools, remove ads and
//                 more.
//               </p>
//               <Link
//                 href="/pricing"
//                 className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
//               >
//                 Go Pro
//                 <ArrowRight size={15} />
//               </Link>
//             </div>
//           </aside>

//           {/* =================================================
//               MAIN CONTENT
//           ================================================= */}
//           <div className="min-w-0 flex-1">
//             {/* Header */}
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
//               <Sparkles size={15} className="text-amber-500" />
//               <span className="font-semibold text-blue-600">
//                 {totalTools} Tools
//               </span>
//             </div>

//             <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
//               All Tools{" "}
//               <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
//                 At Your Fingertips
//               </span>
//             </h1>

//             <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
//               Browse our complete collection of {totalTools} powerful tools.
//               From PDF and image editing to AI, developer, text and SEO
//               tools — everything you need in one place.
//             </p>

//             {/* Search + sort */}
//             <div className="mt-7 flex flex-col gap-3 sm:flex-row">
//               <div className="flex flex-1 items-center gap-3 rounded-2xl border border-blue-100 bg-white px-5 py-3.5 shadow-sm">
//                 <Search size={19} className="shrink-0 text-slate-400" />
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search for tools, features or anything..."
//                   className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
//                 />
//                 <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700">
//                   <ArrowRight size={16} />
//                 </button>
//               </div>

//               <div className="relative shrink-0">
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value as SortOption)}
//                   className="h-full appearance-none rounded-2xl border border-blue-100 bg-white px-5 py-3.5 pr-10 text-sm font-medium text-slate-600 shadow-sm outline-none"
//                 >
//                   <option value="popular">Sort by: Popular</option>
//                   <option value="az">Sort by: A–Z</option>
//                   <option value="za">Sort by: Z–A</option>
//                 </select>
//                 <ChevronDown
//                   size={15}
//                   className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//               </div>
//             </div>

//             {/* Category pills */}
//             <div className="mt-5 flex flex-wrap gap-2.5">
//               <button
//                 onClick={() => setActiveCategory("all")}
//                 className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
//                   activeCategory === "all"
//                     ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                     : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
//                 }`}
//               >
//                 All
//               </button>

//               {categories.map((cat) => (
//                 <button
//                   key={cat.slug}
//                   onClick={() => setActiveCategory(cat.slug)}
//                   className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
//                     activeCategory === cat.slug
//                       ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                       : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
//                   }`}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>

//             {/* =================================================
//                 TOOL SECTIONS
//             ================================================= */}
//             <div className="mt-12 space-y-14">
//               {visibleCategories.length === 0 && (
//                 <div className="rounded-2xl border border-blue-100 bg-white p-10 text-center text-sm text-slate-500">
//                   No tools match "{query}" in {activeCategoryName}.
//                 </div>
//               )}

//               {visibleCategories.map((cat) => {
//                 const accent = categoryAccent(cat.slug);
//                 const CatIcon = getCategoryIcon(cat.slug, cat.name);

//                 return (
//                   <section key={cat.slug} className="scroll-mt-24">
//                     <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
//                       <Link
//                         href={`/tools/${cat.slug}`}
//                         className="group inline-flex items-center gap-3"
//                       >
//                         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                           <CatIcon size={19} />
//                         </span>
//                         <div>
//                           <h2 className="text-xl font-bold tracking-tight text-slate-800 transition group-hover:text-blue-600">
//                             {cat.name}
//                           </h2>
//                           <p className="mt-0.5 text-xs text-slate-400">
//                             {cat.tools.length} tools
//                           </p>
//                         </div>
//                       </Link>

//                       <Link
//                         href={`/tools/${cat.slug}`}
//                         className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
//                       >
//                         {cat.tools.length} tools
//                         <ChevronRight size={16} />
//                       </Link>
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                       {cat.tools.map((tool) => {
//                         const Icon = getToolIcon(tool.slug, tool.name);

//                         return (
//                           <Link
//                             key={tool.slug}
//                             href={`/tools/${tool.category_slug}/${tool.slug}`}
//                             className="group relative flex min-h-[150px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
//                           >
//                             <div className="flex items-start justify-between gap-3">
//                               <div
//                                 className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accent.badge} transition-transform duration-300 group-hover:scale-110`}
//                               >
//                                 <Icon size={19} strokeWidth={1.8} />
//                               </div>
//                             </div>

//                             <h3 className="mt-4 text-sm font-bold leading-5 text-slate-800 transition-colors group-hover:text-blue-700">
//                               {tool.name}
//                             </h3>

//                             <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
//                               {tool.short_description}
//                             </p>

//                             <div className="mt-auto flex items-center justify-between pt-4">
//                               <span className="text-xs font-semibold text-blue-600">
//                                 Open
//                               </span>
//                               <ArrowRight
//                                 size={14}
//                                 className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
//                               />
//                             </div>
//                           </Link>
//                         );
//                       })}
//                     </div>
//                   </section>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { categoryAccent } from "@/lib/utils";

import {
  FileText,
  FileImage,
  FileJson,
  FileArchive,
  FileSpreadsheet,
  FileSearch,
  FileType,
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
  ArrowRight,
  ChevronRight,
  Zap,
  Grid3X3,
  LayoutGrid,
  AlignLeft,
  ChevronDown,
  Home,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

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

type SortOption = "popular" | "az" | "za";

/* =========================================================
   TOOL ICON
========================================================= */

function getToolIcon(slug: string, name: string) {
  const value = `${slug} ${name}`.toLowerCase();

  if (/pdf/.test(value)) return FileText;
  if (/image|photo|picture|jpg|jpeg|png|webp/.test(value))
    return FileImage;
  if (/video|mp4|movie|gif/.test(value)) return Video;
  if (/audio|music|mp3|sound|voice/.test(value)) return Music;
  if (/json/.test(value)) return FileJson;
  if (/code|html|css|javascript|typescript|developer/.test(value))
    return Code2;
  if (/excel|spreadsheet|csv/.test(value)) return FileSpreadsheet;
  if (/word|docx|markdown/.test(value)) return FileType;
  if (/zip|compress|archive|extract/.test(value)) return FileArchive;
  if (/translate|language/.test(value)) return Languages;
  if (/seo|search|keyword/.test(value)) return Search;
  if (/ai|chatgpt|generator|generate/.test(value)) return Sparkles;
  if (/internet|url|website|domain/.test(value)) return Globe;
  if (/ocr|scan/.test(value)) return ScanText;
  if (/color|palette|design/.test(value)) return Palette;
  if (/security|password|hash|encrypt/.test(value))
    return ShieldCheck;
  if (/metadata|exif|inspect|analy/.test(value)) return FileSearch;
  if (/text|document|editor|summar/.test(value)) return FileText;

  return Wrench;
}

/* =========================================================
   CATEGORY ICON
========================================================= */

function getCategoryIcon(slug: string, name: string) {
  const value = `${slug} ${name}`.toLowerCase();

  if (/pdf/.test(value)) return FileText;
  if (/image/.test(value)) return FileImage;
  if (/ai/.test(value)) return Sparkles;
  if (/developer|code/.test(value)) return Code2;
  if (/text/.test(value)) return AlignLeft;
  if (/internet|web/.test(value)) return Globe;
  if (/seo/.test(value)) return Search;
  if (/productivity/.test(value)) return Zap;
  if (/design/.test(value)) return Palette;

  return Grid3X3;
}

/* =========================================================
   PAGE
========================================================= */

export default function ToolsPageClient({
  categories,
  initialSearch = "",
}: {
  categories: Category[];
  initialSearch?: string;
}) {
  const [activeCategory, setActiveCategory] =
    useState<string>("all");

  const [query, setQuery] = useState(initialSearch);

  const [sortBy, setSortBy] =
    useState<SortOption>("popular");

  /* =======================================================
     TOTAL TOOLS
  ======================================================= */

  const totalTools = categories.reduce(
    (total, category) =>
      total + (category.tools?.length || 0),
    0
  );

  /* =======================================================
     FILTER + SEARCH + SORT
  ======================================================= */

  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();

    /* -----------------------------------------------------
       First apply sidebar category selection
    ----------------------------------------------------- */

    const base =
      activeCategory === "all"
        ? categories
        : categories.filter(
            (category) =>
              category.slug === activeCategory
          );

    /* -----------------------------------------------------
       No search query
       → show normal category selection
    ----------------------------------------------------- */

    if (!q) {
      return base
        .map((cat) => {
          let tools = cat.tools || [];

          if (sortBy === "az") {
            tools = [...tools].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          } else if (sortBy === "za") {
            tools = [...tools].sort((a, b) =>
              b.name.localeCompare(a.name)
            );
          }

          return {
            ...cat,
            tools,
          };
        })
        .filter((cat) => cat.tools.length > 0);
    }

    /* -----------------------------------------------------
       SEARCH MODE

       Category search:
       "PDF"
       "Image"
       "Developer"

       → Show that category and ALL its tools.

       Tool search:
       "compressor"
       "json formatter"

       → Show only matching tools inside their category.
    ----------------------------------------------------- */

    return base
      .map((cat) => {
        const categoryName =
          cat.name.toLowerCase();

        const categorySlug =
          cat.slug.toLowerCase();

        /* Check whether search matches category */

        const categoryMatches =
          categoryName.includes(q) ||
          categorySlug.includes(q);

        let tools: Tool[];

        if (categoryMatches) {
          /*
            Category matched.

            Example:
            Search = "PDF"

            → PDF category is shown
            → all PDF tools are shown
          */

          tools = [...(cat.tools || [])];
        } else {
          /*
            Category did not match.

            Now search individual tools.
          */

          tools = (cat.tools || []).filter(
            (tool) => {
              const toolName =
                tool.name?.toLowerCase() || "";

              const toolSlug =
                tool.slug?.toLowerCase() || "";

              const description =
                tool.short_description?.toLowerCase() ||
                "";

              return (
                toolName.includes(q) ||
                toolSlug.includes(q) ||
                description.includes(q)
              );
            }
          );
        }

        /* -------------------------------------------------
           SORT SEARCH RESULTS
        ------------------------------------------------- */

        if (sortBy === "az") {
          tools.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else if (sortBy === "za") {
          tools.sort((a, b) =>
            b.name.localeCompare(a.name)
          );
        }

        return {
          ...cat,
          tools,
        };
      })
      .filter((cat) => cat.tools.length > 0);
  }, [
    categories,
    activeCategory,
    query,
    sortBy,
  ]);

  /* =======================================================
     ACTIVE CATEGORY NAME
  ======================================================= */

  const activeCategoryName =
    activeCategory === "all"
      ? "All Tools"
      : categories.find(
          (category) =>
            category.slug === activeCategory
        )?.name || "Tools";

  /* =======================================================
     SEARCH RESULT COUNT
  ======================================================= */

  const visibleToolCount =
    visibleCategories.reduce(
      (total, category) =>
        total + category.tools.length,
      0
    );

  return (
    <main className="min-h-screen bg-[#f7fbff]">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Home size={14} />

          <Link
            href="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <span className="font-medium text-slate-600">
            All Tools
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[280px]">
            <div className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">

              {/* All Tools */}

              <button
                onClick={() =>
                  setActiveCategory("all")
                }
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  activeCategory === "all"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-blue-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <LayoutGrid size={17} />
                  All Tools
                </span>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeCategory === "all"
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {totalTools}
                </span>
              </button>

              {/* Categories */}

              <div className="mt-1 space-y-1">
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(
                    cat.slug,
                    cat.name
                  );

                  const isActive =
                    activeCategory === cat.slug;

                  return (
                    <button
                      key={cat.slug}
                      onClick={() =>
                        setActiveCategory(cat.slug)
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "text-slate-600 hover:bg-blue-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={17} />
                        {cat.name}
                      </span>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {cat.tools?.length || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upgrade to Pro */}

            <div className="mt-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white shadow-lg shadow-blue-200/50">
              <Zap
                size={20}
                className="mb-3"
              />

              <h3 className="text-base font-bold">
                Upgrade to Pro
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-blue-100">
                Get unlimited access to all premium
                tools, remove ads and more.
              </p>

              <Link
                href="/pricing"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Go Pro
                <ArrowRight size={15} />
              </Link>
            </div>
          </aside>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="min-w-0 flex-1">

            {/* Header */}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              <Sparkles
                size={15}
                className="text-amber-500"
              />

              <span className="font-semibold text-blue-600">
                {query
                  ? `${visibleToolCount} Results`
                  : `${totalTools} Tools`}
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              All Tools{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                At Your Fingertips
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Browse our complete collection of{" "}
              {totalTools} powerful tools. From PDF and
              image editing to AI, developer, text and
              SEO tools — everything you need in one
              place.
            </p>

            {/* =================================================
                SEARCH + SORT
            ================================================= */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-blue-100 bg-white px-5 py-3.5 shadow-sm focus-within:border-blue-200 focus-within:ring-2 focus-within:ring-blue-100">

                <Search
                  size={19}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search for tools, features or anything..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setQuery(query.trim())
                  }
                  aria-label="Search"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Sort */}

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as SortOption
                    )
                  }
                  className="h-full appearance-none rounded-2xl border border-blue-100 bg-white px-5 py-3.5 pr-10 text-sm font-medium text-slate-600 shadow-sm outline-none"
                >
                  <option value="popular">
                    Sort by: Popular
                  </option>

                  <option value="az">
                    Sort by: A–Z
                  </option>

                  <option value="za">
                    Sort by: Z–A
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* =================================================
                CATEGORY PILLS
            ================================================= */}

            <div className="mt-5 flex flex-wrap gap-2.5">

              <button
                onClick={() =>
                  setActiveCategory("all")
                }
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeCategory === "all"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() =>
                    setActiveCategory(cat.slug)
                  }
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    activeCategory === cat.slug
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* =================================================
                SEARCH STATUS
            ================================================= */}

            {query.trim() && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-3">
                <div className="text-sm text-slate-600">
                  Search results for{" "}
                  <span className="font-bold text-blue-600">
                    "{query}"
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-600 hover:text-white"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* =================================================
                TOOL SECTIONS
            ================================================= */}

            <div className="mt-12 space-y-14">

              {/* No Results */}

              {visibleCategories.length === 0 && (
                <div className="rounded-2xl border border-blue-100 bg-white p-10 text-center shadow-sm">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                    <Search size={23} />
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-slate-800">
                    No tools found
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    No tools match{" "}
                    <span className="font-semibold">
                      "{query}"
                    </span>
                    {activeCategory !== "all" &&
                      ` in ${activeCategoryName}`}
                    .
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Show All Tools
                  </button>
                </div>
              )}

              {/* Categories + Tools */}

              {visibleCategories.map((cat) => {
                const accent = categoryAccent(
                  cat.slug
                );

                const CatIcon =
                  getCategoryIcon(
                    cat.slug,
                    cat.name
                  );

                return (
                  <section
                    key={cat.slug}
                    className="scroll-mt-24"
                  >

                    {/* Category Header */}

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

                      <Link
                        href={`/tools/${cat.slug}`}
                        className="group inline-flex items-center gap-3"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <CatIcon size={19} />
                        </span>

                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-slate-800 transition group-hover:text-blue-600">
                            {cat.name}
                          </h2>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {cat.tools.length} tools
                          </p>
                        </div>
                      </Link>

                      <Link
                        href={`/tools/${cat.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {cat.tools.length} tools
                        <ChevronRight size={16} />
                      </Link>
                    </div>

                    {/* Tool Cards */}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                      {cat.tools.map((tool) => {
                        const Icon =
                          getToolIcon(
                            tool.slug,
                            tool.name
                          );

                        return (
                          <Link
                            key={tool.slug}
                            href={`/tools/${tool.category_slug}/${tool.slug}`}
                            className="group relative flex min-h-[150px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accent.badge} transition-transform duration-300 group-hover:scale-110`}
                              >
                                <Icon
                                  size={19}
                                  strokeWidth={1.8}
                                />
                              </div>

                            </div>

                            <h3 className="mt-4 text-sm font-bold leading-5 text-slate-800 transition-colors group-hover:text-blue-700">
                              {tool.name}
                            </h3>

                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                              {tool.short_description}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-4">

                              <span className="text-xs font-semibold text-blue-600">
                                Open
                              </span>

                              <ArrowRight
                                size={14}
                                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
                              />

                            </div>
                          </Link>
                        );
                      })}

                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}