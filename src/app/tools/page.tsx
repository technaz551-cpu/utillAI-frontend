// import Link from "next/link";

// import { fetchCategories } from "@/lib/api";
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
//   Star,
//   Grid3X3,
//   CheckCircle2,
// } from "lucide-react";

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

// /* =========================================================
//    TOOL ICON
// ========================================================= */

// function getToolIcon(slug: string, name: string) {
//   const value = `${slug} ${name}`.toLowerCase();

//   if (/pdf/.test(value)) return FileText;

//   if (/image|photo|picture|jpg|jpeg|png|webp/.test(value)) {
//     return FileImage;
//   }

//   if (/video|mp4|movie|gif/.test(value)) {
//     return Video;
//   }

//   if (/audio|music|mp3|sound|voice/.test(value)) {
//     return Music;
//   }

//   if (/json/.test(value)) {
//     return FileJson;
//   }

//   if (/code|html|css|javascript|typescript|developer/.test(value)) {
//     return Code2;
//   }

//   if (/excel|spreadsheet|csv/.test(value)) {
//     return FileSpreadsheet;
//   }

//   if (/word|docx|markdown/.test(value)) {
//     return FileType;
//   }

//   if (/zip|compress|archive|extract/.test(value)) {
//     return FileArchive;
//   }

//   if (/translate|language/.test(value)) {
//     return Languages;
//   }

//   if (/seo|search|keyword/.test(value)) {
//     return Search;
//   }

//   if (/ai|chatgpt|generator|generate/.test(value)) {
//     return Sparkles;
//   }

//   if (/internet|url|website|domain/.test(value)) {
//     return Globe;
//   }

//   if (/ocr|scan/.test(value)) {
//     return ScanText;
//   }

//   if (/color|palette|design/.test(value)) {
//     return Palette;
//   }

//   if (/security|password|hash|encrypt/.test(value)) {
//     return ShieldCheck;
//   }

//   if (/metadata|exif|inspect|analy/.test(value)) {
//     return FileSearch;
//   }

//   if (/text|document|editor|summar/.test(value)) {
//     return FileText;
//   }

//   return Wrench;
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// export default async function AllToolsPage() {
//   const categories = (await fetchCategories().catch(
//     () => []
//   )) as Category[];

//   const totalTools = categories.reduce(
//     (total, category) =>
//       total + (category.tools?.length || 0),
//     0
//   );

//   return (
//     <main className="min-h-screen overflow-hidden bg-[#f7fbff]">

//       {/* =====================================================
//           HERO
//       ===================================================== */}

//       <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-[#eef7ff] via-white to-[#eaf6ff]">

//         {/* Background decoration */}
//         <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl" />

//         <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl" />

//         <div className="pointer-events-none absolute bottom-[-180px] left-[35%] h-[400px] w-[400px] rounded-full bg-blue-100/40 blur-3xl" />

//         {/* Hero container */}
//         <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-10">

//           {/* =================================================
//               LEFT CONTENT
//           ================================================= */}

//           <div className="relative z-20 w-full lg:w-[50%]">

//             {/* Badge */}
//             <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">

//               <Sparkles
//                 size={15}
//                 className="text-amber-500"
//               />

//               <span className="font-semibold text-blue-600">
//                 {totalTools} Tools
//               </span>

//               <span className="text-blue-200">
//                 •
//               </span>

//               <span>
//                 All in One Place
//               </span>

//             </div>

//             {/* Heading */}
//             <h1 className="max-w-[650px] text-5xl font-extrabold leading-[1.03] tracking-tight text-slate-900 sm:text-6xl lg:text-[68px]">

//               Explore All

//               <br />

//               <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
//                 Tools & Categories
//               </span>

//             </h1>

//             {/* Description */}
//             <p className="mt-7 max-w-[570px] text-base leading-8 text-slate-600 sm:text-lg">
//               Discover powerful tools for productivity,
//               creativity, and more. Browse PDF, AI, image,
//               developer, text, SEO and other tools — all in
//               one place.
//             </p>

//             {/* Buttons */}
//             <div className="mt-8 flex flex-wrap gap-3">

//               <a
//                 href="#tool-categories"
//                 className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
//               >
//                 Explore Tools

//                 <ArrowRight
//                   size={17}
//                   className="transition-transform group-hover:translate-x-1"
//                 />
//               </a>

//               <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-5 py-3.5 text-sm font-medium text-slate-600 shadow-sm">

//                 <span className="h-2 w-2 rounded-full bg-emerald-500" />

//                 {categories.length} Categories

//               </div>

//             </div>

//             {/* Small trust row */}
//             <div className="mt-9 flex flex-wrap items-center gap-5 text-sm text-slate-500">

//               <div className="flex items-center gap-2">
//                 <CheckCircle2
//                   size={16}
//                   className="text-blue-500"
//                 />
//                 Fast & Easy
//               </div>

//               <div className="flex items-center gap-2">
//                 <ShieldCheck
//                   size={16}
//                   className="text-blue-500"
//                 />
//                 Secure
//               </div>

//               <div className="flex items-center gap-2">
//                 <Zap
//                   size={16}
//                   className="text-blue-500"
//                 />
//                 Free Tools
//               </div>

//             </div>

//           </div>

//           {/* =================================================
//               RIGHT IMAGE
//           ================================================= */}

//           <div className="pointer-events-none absolute right-[-100px] top-1/2 z-10 hidden w-[680px] -translate-y-1/2 lg:block xl:right-[-60px] xl:w-[760px] 2xl:right-[-20px] 2xl:w-[820px]">

//             <img
//               src="/images3.png"
//               alt="UtilAI Tools"
//               className="block h-auto w-full object-contain drop-shadow-[0_30px_55px_rgba(37,99,235,0.18)]"
//             />

//           </div>

//           {/* Mobile image */}
//           <div className="absolute left-1/2 top-[440px] z-10 w-[650px] -translate-x-1/2 lg:hidden">

//             <img
//               src="/images3.png"
//               alt="UtilAI Tools"
//               className="h-auto w-full object-contain drop-shadow-[0_25px_45px_rgba(37,99,235,0.16)]"
//             />

//           </div>

//         </div>
//       </section>


//       {/* =====================================================
//           QUICK SEARCH AREA
//       ===================================================== */}

//       <section className="relative z-20 mx-auto -mt-8 max-w-4xl px-5">

//         <div className="rounded-2xl border border-blue-100 bg-white p-2 shadow-xl shadow-blue-100/40">

//           <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-5 py-4">

//             <Search
//               size={21}
//               className="shrink-0 text-slate-400"
//             />

//             <input
//               type="text"
//               placeholder="Search for a tool..."
//               className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
//             />

//             <div className="hidden rounded-lg bg-white px-3 py-1.5 text-xs text-slate-400 shadow-sm sm:block">
//               Search
//             </div>

//           </div>

//         </div>

//       </section>


//       {/* =====================================================
//           CATEGORY SHORTCUTS
//       ===================================================== */}

//       <section className="mx-auto max-w-7xl px-5 pb-8 pt-20 sm:px-8 lg:px-10">

//         <div className="mb-7 flex items-end justify-between gap-4">

//           <div>

//             <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">

//               <Grid3X3 size={13} />

//               Categories

//             </span>

//             <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//               Find tools by category
//             </h2>

//           </div>

//         </div>


//         <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

//           {categories.map((category) => (

//             <Link
//               key={category.slug}
//               href={`/tools/${category.slug}`}
//               className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
//             >

//               <div className="flex min-w-0 items-center gap-3">

//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

//                   <Wrench size={18} />

//                 </div>

//                 <div className="min-w-0">

//                   <p className="truncate text-sm font-bold text-slate-800 group-hover:text-blue-600">
//                     {category.name}
//                   </p>

//                   <p className="text-xs text-slate-400">
//                     {category.tools?.length || 0} tools
//                   </p>

//                 </div>

//               </div>

//               <ChevronRight
//                 size={17}
//                 className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
//               />

//             </Link>

//           ))}

//         </div>

//       </section>


//       {/* =====================================================
//           ALL TOOLS
//       ===================================================== */}

//       <section
//         id="tool-categories"
//         className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10"
//       >

//         {/* Header */}
//         <div className="mb-12">

//           <span className="mb-3 inline-flex rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
//             Browse Collection
//           </span>

//           <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

//             <div>

//               <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
//                 All Tool Categories
//               </h2>

//               <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
//                 Everything you need in one place. Choose a category
//                 and explore powerful tools built for everyday tasks.
//               </p>

//             </div>

//             <div className="flex items-center gap-2 text-sm text-slate-400">

//               <Star
//                 size={16}
//                 className="fill-amber-400 text-amber-400"
//               />

//               <span>
//                 {totalTools}+ useful tools
//               </span>

//             </div>

//           </div>

//         </div>


//         {/* ===================================================
//             CATEGORY SECTIONS
//         =================================================== */}

//         <div className="space-y-16">

//           {categories.map((cat) => {

//             const accent = categoryAccent(cat.slug);

//             const tools = cat.tools || [];

//             return (

//               <section
//                 key={cat.slug}
//                 className="scroll-mt-24"
//               >

//                 {/* Category heading */}
//                 <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

//                   <Link
//                     href={`/tools/${cat.slug}`}
//                     className="group inline-flex items-center gap-3"
//                   >

//                     <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-blue-600 to-cyan-400" />

//                     <div>

//                       <h2 className="text-xl font-bold tracking-tight text-slate-800 transition group-hover:text-blue-600 sm:text-2xl">
//                         {cat.name}
//                       </h2>

//                       <p className="mt-0.5 text-xs text-slate-400">
//                         Explore {tools.length} available tools
//                       </p>

//                     </div>

//                     <ArrowRight
//                       size={18}
//                       className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
//                     />

//                   </Link>


//                   <span
//                     className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${accent.badge}`}
//                   >
//                     {tools.length} Tools
//                   </span>

//                 </div>


//                 {/* Tool grid */}
//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

//                   {tools.map((tool) => {

//                     const Icon = getToolIcon(
//                       tool.slug,
//                       tool.name
//                     );

//                     return (

//                       <Link
//                         key={tool.slug}
//                         href={`/tools/${tool.category_slug}/${tool.slug}`}
//                         className="group relative flex min-h-[185px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
//                       >

//                         {/* Hover background */}
//                         <span
//                           aria-hidden="true"
//                           className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 transition-transform duration-300 group-hover:scale-y-100"
//                         />


//                         <div className="relative z-10 flex h-full flex-1 flex-col">

//                           {/* Top */}
//                           <div className="flex items-start justify-between gap-3">

//                             <div className="flex min-w-0 items-start gap-3">

//                               {/* Icon */}
//                               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white">

//                                 <Icon
//                                   size={21}
//                                   strokeWidth={1.8}
//                                 />

//                               </div>


//                               {/* Name */}
//                               <div className="min-w-0">

//                                 <h3 className="pt-1 text-base font-bold leading-6 text-slate-800 transition-colors group-hover:text-blue-700">
//                                   {tool.name}
//                                 </h3>

//                                 <span className="mt-1 block text-[11px] font-medium uppercase tracking-wider text-blue-500">
//                                   {cat.name}
//                                 </span>

//                               </div>

//                             </div>


//                             {/* Arrow */}
//                             <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">

//                               <ArrowRight
//                                 size={15}
//                               />

//                             </span>

//                           </div>


//                           {/* Description */}
//                           <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
//                             {tool.short_description}
//                           </p>


//                           {/* Footer */}
//                           <div className="mt-auto flex items-center justify-between pt-5">

//                             <span className="text-xs font-semibold text-blue-600">
//                               Open Tool
//                             </span>

//                             <span className="text-xs text-slate-300 transition group-hover:text-blue-400">
//                               →
//                             </span>

//                           </div>

//                         </div>

//                       </Link>

//                     );

//                   })}

//                 </div>

//               </section>

//             );

//           })}

//         </div>

//       </section>


//       {/* =====================================================
//           FEATURE STRIP
//       ===================================================== */}

//       <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">

//         <div className="grid gap-4 md:grid-cols-3">

//           {/* Card 1 */}
//           <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

//             <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

//               <Zap size={20} />

//             </div>

//             <h3 className="font-bold text-slate-800">
//               Fast & Simple
//             </h3>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               Get everyday tasks done quickly with clean,
//               focused tools.
//             </p>

//           </div>


//           {/* Card 2 */}
//           <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

//             <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">

//               <ShieldCheck size={20} />

//             </div>

//             <h3 className="font-bold text-slate-800">
//               Privacy Focused
//             </h3>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               Built with a clean and straightforward experience
//               for everyday use.
//             </p>

//           </div>


//           {/* Card 3 */}
//           <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

//             <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">

//               <Grid3X3 size={20} />

//             </div>

//             <h3 className="font-bold text-slate-800">
//               Everything Together
//             </h3>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               PDF, image, AI, developer, text and more in one
//               organized collection.
//             </p>

//           </div>

//         </div>

//       </section>


//       {/* =====================================================
//           BOTTOM CTA
//       ===================================================== */}

//       <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">

//         <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-blue-600 via-blue-600 to-sky-500 px-6 py-12 shadow-2xl shadow-blue-200/50 sm:px-10 sm:py-14">

//           {/* Decorative circles */}
//           <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

//           <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />


//           <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">

//             <div className="max-w-2xl">

//               <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">

//                 <Sparkles size={13} />

//                 UtilAI Tools

//               </div>

//               <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">

//                 Ready to get things done?

//               </h2>

//               <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">

//                 Explore the complete collection and find the right
//                 tool for your everyday tasks.

//               </p>

//             </div>


//             <Link
//               href="/"
//               className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
//             >

//               Back to Home

//               <ArrowRight
//                 size={17}
//                 className="transition-transform group-hover:translate-x-1"
//               />

//             </Link>

//           </div>

//         </div>

//       </section>

//     </main>
//   );
// }


import { fetchCategories } from "@/lib/api";

import ToolsPageClient from "./ToolsPageClient";

type ToolsPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function AllToolsPage({
  searchParams,
}: ToolsPageProps) {
  const params = await searchParams;

  const categories = (await fetchCategories().catch(() => [])) as any[];

  return (
    <ToolsPageClient
      categories={categories}
      initialSearch={params.search || ""}
    />
  );
}