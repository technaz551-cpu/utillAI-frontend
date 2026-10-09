// import Link from "next/link";
// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import {
//   ArrowRight,
//   Braces,
//   Code2,
//   FileCode2,
//   FileJson,
//   Globe,
//   Hash,
//   Image,
//   KeyRound,
//   Link2,
//   Terminal,
//   Wrench,
// } from "lucide-react";

// import { fetchCategory } from "@/lib/api";
// import { categoryAccent } from "@/lib/utils";

// type Props = {
//   params: Promise<{ category: string }>;
// };

// type CategoryData = {
//   slug: string;
//   name: string;
//   description: string;
//   tools: Array<{
//     slug: string;
//     name: string;
//     short_description: string;
//     category_slug: string;
//   }>;
// };

// export async function generateMetadata({
//   params,
// }: Props): Promise<Metadata> {
//   const { category } = await params;

//   const readableCategory = category
//     .replace(/-/g, " ")
//     .replace(/\b\w/g, (char) => char.toUpperCase());

//   return {
//     title: `${readableCategory} Tools — Free Online`,
//     description: `Free online ${readableCategory.toLowerCase()} tools.`,
//   };
// }

// /* -------------------------------- */
// /* HERO IMAGE PER CATEGORY           */
// /* -------------------------------- */

// // Key = category slug (URL wala), value = public/ folder ki image.
// // Nayi category ki image lagani ho to yahan ek line add karein.
// const categoryHeroImages: Record<string, string> = {
//   image: "/images4.png",
//   pdf: "/pdf-hero.png",
//   developer: "/developer-hero.png",
//   text: "/text-hero.png",
//   ai: "/ai-hero.png",
//   seo: "/seo-hero.png",
// };

// // Jis category ki image upar na ho, us ke liye default.
// // Default nahi chahiye to "" (khali) rehne dein.
// const defaultHeroImage = "";

// /* -------------------------------- */
// /* TOOL ICON                         */
// /* -------------------------------- */

// function getToolIcon(slug: string) {
//   const iconClass = "h-5 w-5";

//   const icons: Record<string, React.ReactNode> = {
//     "json-formatter": <Braces className={iconClass} />,
//     "json-validator": <FileJson className={iconClass} />,
//     base64: <Code2 className={iconClass} />,
//     "url-encoder": <Link2 className={iconClass} />,
//     "uuid-generator": <KeyRound className={iconClass} />,
//     "hash-generator": <Hash className={iconClass} />,
//     "jwt-decoder": <Terminal className={iconClass} />,
//     "timestamp-converter": <Globe className={iconClass} />,

//     "jpg-to-png": <Image className={iconClass} />,
//     "png-to-jpg": <Image className={iconClass} />,
//     "webp-converter": <Image className={iconClass} />,

//     "pdf-editor": <FileCode2 className={iconClass} />,

//     default: <Wrench className={iconClass} />,
//   };

//   return icons[slug] ?? icons.default;
// }

// /* -------------------------------- */
// /* CATEGORY PAGE                    */
// /* -------------------------------- */

// export default async function CategoryPage({ params }: Props) {
//   const { category } = await params;

//   const data = (await fetchCategory(category)) as CategoryData | null;

//   if (!data) notFound();

//   const accent = categoryAccent(data.slug);

//   const heroImage = categoryHeroImages[data.slug] ?? defaultHeroImage;

//   return (
//     <main className="min-h-screen bg-[var(--background)]">
//       {/* ============================= */}
//       {/* HERO                          */}
//       {/* ============================= */}

//       <section className="relative overflow-hidden border-b border-[var(--border)]">
//         {/* Background decoration */}
//         <div aria-hidden className="pointer-events-none absolute inset-0">
//           <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
//           <div className="absolute -left-24 top-20 h-40 w-40 rounded-full bg-blue-400/5 blur-3xl" />
//           <div className="absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />
//         </div>

//         <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
//           {/* Right top corner image with hover (category ke hisab se) */}
//           {heroImage && (
//             <div className="group absolute right-4 top-16 z-10 hidden w-64 overflow-hidden rounded-2xl border border-white/80 bg-white/40 p-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-2 hover:scale-105 hover:shadow-2xl md:right-6 md:top-24 md:block lg:w-80 xl:w-[28rem]">
//               <img
//                 src={heroImage}
//                 alt={`${data.name} illustration`}
//                 className="block h-auto w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
//               />
//             </div>
//           )}

//           {/* Breadcrumb */}
//           <div className="mb-7 flex items-center gap-2 text-sm text-[var(--muted)]">
//             <Link href="/" className="transition hover:text-blue-500">
//               Home
//             </Link>

//             <span>/</span>

//             <span className="text-[var(--foreground)]">{data.name}</span>
//           </div>

//           <div className="max-w-3xl lg:max-w-2xl">
//             {/* Category badge */}
//             <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-500">
//               <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

//               {data.tools.length} {data.tools.length === 1 ? "Tool" : "Tools"}
//             </div>

//             {/* Heading */}
//             <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
//               {data.name}
//             </h1>

//             {/* Description */}
//             <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
//               {data.description}
//             </p>
//           </div>

//           {/* Quick stats */}
//           <div className="mt-9 flex flex-wrap gap-3">
//             <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
//               <span className="h-2 w-2 rounded-full bg-blue-500" />
//               Free online tools
//             </div>

//             <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
//               <span className="h-2 w-2 rounded-full bg-emerald-500" />
//               Easy to use
//             </div>

//             <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
//               <span className="h-2 w-2 rounded-full bg-violet-500" />
//               No installation
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ============================= */}
//       {/* TOOLS                         */}
//       {/* ============================= */}

//       <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
//         {/* Section heading */}
//         <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
//               Explore tools
//             </p>

//             <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)] md:text-3xl">
//               Choose a tool
//             </h2>
//           </div>

//           <p className="text-sm text-[var(--muted)]">
//             {data.tools.length} tools available
//           </p>
//         </div>

//         {/* Tool grid */}
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {data.tools.map((tool) => (
//             <Link
//               key={tool.slug}
//               href={`/tools/${tool.category_slug}/${tool.slug}`}
//               className="
//                 group relative overflow-hidden rounded-2xl
//                 border border-[var(--border)]
//                 bg-[var(--surface)]
//                 p-5
//                 transition-all duration-300
//                 hover:-translate-y-1
//                 hover:border-blue-500
//                 hover:bg-blue-500
//                 hover:shadow-xl
//                 hover:shadow-blue-500/20
//               "
//             >
//               {/* Full-card blue hover layer */}
//               <div
//                 aria-hidden
//                 className="
//                   pointer-events-none absolute inset-0
//                   -translate-x-full
//                   bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600
//                   transition-transform duration-300
//                   group-hover:translate-x-0
//                 "
//               />

//               {/* Content */}
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between gap-4">
//                   {/* Icon */}
//                   <div
//                     className="
//                       flex h-11 w-11 shrink-0 items-center justify-center
//                       rounded-xl
//                       border border-blue-500/20
//                       bg-blue-500/10
//                       text-blue-500
//                       transition-all duration-300
//                       group-hover:border-white/20
//                       group-hover:bg-white/15
//                       group-hover:text-white
//                     "
//                   >
//                     {getToolIcon(tool.slug)}
//                   </div>

//                   {/* Arrow */}
//                   <div
//                     className="
//                       flex h-8 w-8 items-center justify-center
//                       rounded-full
//                       border border-[var(--border)]
//                       text-[var(--muted)]
//                       transition-all duration-300
//                       group-hover:border-white/20
//                       group-hover:bg-white/10
//                       group-hover:text-white
//                     "
//                   >
//                     <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
//                   </div>
//                 </div>

//                 {/* Tool name */}
//                 <h3
//                   className="
//                     mt-5 text-base font-semibold
//                     text-[var(--foreground)]
//                     transition-colors
//                     group-hover:text-white
//                   "
//                 >
//                   {tool.name}
//                 </h3>

//                 {/* Description */}
//                 <p
//                   className="
//                     mt-2 line-clamp-2
//                     text-sm leading-6
//                     text-[var(--muted)]
//                     transition-colors
//                     group-hover:text-white/80
//                   "
//                 >
//                   {tool.short_description}
//                 </p>

//                 {/* Bottom action */}
//                 <div
//                   className="
//                     mt-5 flex items-center gap-1.5
//                     text-xs font-semibold
//                     text-blue-500
//                     transition-colors
//                     group-hover:text-white
//                   "
//                 >
//                   Open tool
//                   <ArrowRight className="h-3.5 w-3.5" />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Empty state */}
//         {data.tools.length === 0 && (
//           <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
//             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
//               <Wrench className="h-5 w-5" />
//             </div>

//             <h3 className="mt-4 text-lg font-semibold">
//               No tools available yet
//             </h3>

//             <p className="mt-2 text-sm text-[var(--muted)]">
//               Tools for this category will appear here when they are added.
//             </p>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }


import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Braces,
  Code2,
  FileArchive,
  FileSpreadsheet,
  FileCode2,
  FileJson,
  FileText,
  Globe,
  Hash,
  Image,
  KeyRound,
  Link2,
  LockKeyhole,
  PenTool,
  Presentation,
  RotateCw,
  Shield,
  Split,
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

type ToolCardData = CategoryData["tools"][number] & {
  comingSoon?: boolean;
  destinationSlug?: string;
};

const PDF_TOOL_CARDS: ToolCardData[] = [
  { slug: "merge-pdf", name: "Merge PDF", category_slug: "pdf", short_description: "Combine PDFs in the order you want with an easy-to-use PDF merger." },
  { slug: "split-pdf", name: "Split PDF", destinationSlug: "split-pdf", category_slug: "pdf", short_description: "Separate pages or split a PDF into individual files." },
  { slug: "compress-pdf", name: "Compress PDF", category_slug: "pdf", short_description: "Reduce PDF file size while keeping the document readable." },
  { slug: "pdf-to-word", name: "PDF to Word", category_slug: "pdf", comingSoon: true, short_description: "Convert PDF files into editable Word documents." },
  { slug: "pdf-to-powerpoint", name: "PDF to PowerPoint", category_slug: "pdf", comingSoon: true, short_description: "Turn PDF pages into an editable PowerPoint presentation." },
  { slug: "pdf-to-excel", name: "PDF to Excel", category_slug: "pdf", comingSoon: true, short_description: "Extract PDF tables into an editable spreadsheet." },
  { slug: "word-to-pdf", name: "Word to PDF", category_slug: "pdf", comingSoon: true, short_description: "Convert DOC and DOCX documents into PDF files." },
  { slug: "powerpoint-to-pdf", name: "PowerPoint to PDF", category_slug: "pdf", comingSoon: true, short_description: "Convert presentations into easy-to-share PDF files." },
  { slug: "excel-to-pdf", name: "Excel to PDF", category_slug: "pdf", comingSoon: true, short_description: "Convert spreadsheets into PDF documents." },
  { slug: "pdf-to-jpg", name: "PDF to JPG", destinationSlug: "pdf-to-jpg", category_slug: "pdf", short_description: "Convert each PDF page into a JPG image." },
  { slug: "jpg-to-pdf", name: "JPG to PDF", category_slug: "pdf", short_description: "Turn a collection of images into one PDF document." },
  { slug: "pdf-editor", name: "Edit PDF", category_slug: "pdf", short_description: "Add text, images and shapes to your PDF." },
  { slug: "sign-pdf", name: "Sign PDF", destinationSlug: "watermark-pdf", category_slug: "pdf", short_description: "Add your own signature to a PDF document." },
  { slug: "watermark-pdf", name: "Watermark PDF", category_slug: "pdf", short_description: "Add a text or image watermark to your PDF." },
  { slug: "rotate-pdf", name: "Rotate PDF", destinationSlug: "rotate-crop-pdf", category_slug: "pdf", short_description: "Rotate PDF pages to the orientation you need." },
  { slug: "html-to-pdf", name: "HTML to PDF", category_slug: "pdf", comingSoon: true, short_description: "Convert a web page or HTML document into PDF." },
  { slug: "unlock-pdf", name: "Unlock PDF", category_slug: "pdf", comingSoon: true, short_description: "Remove password protection from a PDF you are authorized to access." },
  { slug: "protect-pdf", name: "Protect PDF", category_slug: "pdf", short_description: "Protect PDF documents with a password." },
  { slug: "organize-pdf", name: "Organize PDF", category_slug: "pdf", short_description: "Reorder, rotate or remove pages from a PDF." },
  { slug: "pdf-to-pdfa", name: "PDF to PDF/A", category_slug: "pdf", comingSoon: true, short_description: "Convert a PDF to an archival PDF/A format." },
  { slug: "crop-pdf", name: "Crop PDF", destinationSlug: "rotate-crop-pdf", category_slug: "pdf", short_description: "Trim margins and adjust the visible page area." },
];

const pdfToolIcons: Record<string, React.ReactNode> = {
  "merge-pdf": <FileArchive className="h-5 w-5" />,
  "split-pdf": <Split className="h-5 w-5" />,
  "compress-pdf": <FileArchive className="h-5 w-5" />,
  "pdf-to-word": <FileText className="h-5 w-5" />,
  "pdf-to-excel": <FileSpreadsheet className="h-5 w-5" />,
  "excel-to-pdf": <FileSpreadsheet className="h-5 w-5" />,
  "pdf-to-powerpoint": <Presentation className="h-5 w-5" />,
  "powerpoint-to-pdf": <Presentation className="h-5 w-5" />,
  "sign-pdf": <PenTool className="h-5 w-5" />,
  "watermark-pdf": <Shield className="h-5 w-5" />,
  "rotate-pdf": <RotateCw className="h-5 w-5" />,
  "unlock-pdf": <LockKeyhole className="h-5 w-5" />,
  "protect-pdf": <Shield className="h-5 w-5" />,
  "organize-pdf": <FileArchive className="h-5 w-5" />,
};

function getCategoryTools(data: CategoryData): ToolCardData[] {
  if (data.slug !== "pdf") return data.tools;

  const pdfSlugs = new Set(
    PDF_TOOL_CARDS.flatMap((tool) => [tool.slug, tool.destinationSlug ?? tool.slug]),
  );
  const extraTools = data.tools.filter((tool) => !pdfSlugs.has(tool.slug));
  return [...PDF_TOOL_CARDS, ...extraTools];
}

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
/* HERO IMAGE PER CATEGORY           */
/* -------------------------------- */

// Key = category slug (URL wala), value = public/ folder ki image.
// File ke naam apni asli files ke naam se badal dein.
const categoryHeroImages: Record<string, string> = {
  // Image tools
  image: "/images4.png",
  "image-tools": "/images4.png",

  // PDF tools
  pdf: "/images7.png",
  "pdf-tools": "/images7.png",

  // Developer tools
  developer: "/images8.png",
  "developer-tools": "/images8.png",
  // Internet tools
  internet:"/images6.png",
  "internet-tools":"/images6.png",
  // AI tools
  ai: "/images5.png",
  "ai-tools": "/images5.png",
};

// Jis category ki image map mein na ho, us ke liye default.
// Default nahi chahiye to "" (khali) rehne dein.
const defaultHeroImage = "";

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

  const tools = getCategoryTools(data);
  const accent = categoryAccent(data.slug);

  // data.slug ya URL wala category, dono check hote hain
  const heroImage =
    categoryHeroImages[data.slug] ??
    categoryHeroImages[category] ??
    defaultHeroImage;

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
          {/* Right top corner image with hover (category ke hisab se) */}
          {heroImage && (
            <div className="group absolute right-4 top-16 z-10 hidden w-64 overflow-hidden rounded-2xl border border-white/80 bg-white/40 p-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-2 hover:scale-105 hover:shadow-2xl md:right-6 md:top-24 md:block lg:w-80 xl:w-[28rem]">
              <img
                src={heroImage}
                alt={`${data.name} illustration`}
                className="block h-auto w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          )}

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

              {tools.length} {tools.length === 1 ? "Tool" : "Tools"}
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
            {tools.length} tools available
          </p>
        </div>

        {/* Tool grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => {
            const cardContent = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    tool.comingSoon
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {pdfToolIcons[tool.slug] ?? getToolIcon(tool.slug)}
                  </div>
                  {tool.comingSoon ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      Coming soon
                    </span>
                  ) : (
                    <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-800">
                  {tool.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-500">
                  {tool.short_description}
                </p>
              </>
            );

            const cardClassName = `group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 ${
              tool.comingSoon
                ? "cursor-default"
                : "hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/70"
            }`;

            return tool.comingSoon ? (
              <div key={tool.slug} className={cardClassName} aria-label={`${tool.name}, coming soon`}>
                {cardContent}
              </div>
            ) : (
              <Link
                key={tool.slug}
                href={`/tools/${tool.category_slug}/${tool.destinationSlug ?? tool.slug}`}
                className={cardClassName}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {tools.length === 0 && (
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