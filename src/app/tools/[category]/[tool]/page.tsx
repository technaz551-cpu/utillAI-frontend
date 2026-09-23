// // import type { Metadata } from "next";
// // import { notFound } from "next/navigation";
// // import { fetchTool, fetchTools, SITE_URL } from "@/lib/api";
// // import { ToolEngine } from "@/features/tools/ToolEngine";
// // import { AdSlot, Breadcrumbs, RelatedTools, ToolSeoContent } from "@/components/tools/ToolPageSections";
// // import type { ToolMeta } from "@/features/tools/client-processors";

// // type Props = { params: Promise<{ category: string; tool: string }> };

// // export async function generateMetadata({ params }: Props): Promise<Metadata> {
// //   const { category, tool: slug } = await params;
// //   const tool = await fetchTool(category, slug);
// //   if (!tool) return {};
// //   return {
// //     title: tool.seo_title || tool.name,
// //     description: tool.meta_description || tool.short_description,
// //     alternates: { canonical: `${SITE_URL}/tools/${category}/${slug}` },
// //     openGraph: { title: tool.seo_title, description: tool.meta_description },
// //   };
// // }

// // export default async function ToolPage({ params }: Props) {
// //   const { category, tool: slug } = await params;
// //   const [tool, allTools] = await Promise.all([
// //     fetchTool(category, slug),
// //     fetchTools().catch(() => []) as Promise<ToolMeta[]>,
// //   ]);
// //   if (!tool) notFound();

// //   const jsonLd = {
// //     "@context": "https://schema.org",
// //     "@type": "WebApplication",
// //     name: tool.name,
// //     description: tool.short_description,
// //     applicationCategory: "UtilityApplication",
// //     offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
// //   };

// //   const isPdfEditor = slug === "pdf-editor";

// //   if (isPdfEditor) {
// //     return (
// //       <main className="pdf-editor-page h-[calc(100dvh-5.9rem)] overflow-hidden bg-[#edf5f1]">
// //         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
// //         <ToolEngine tool={tool as ToolMeta} />
// //       </main>
// //     );
// //   }

// //   return (
// //     <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
// //       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
// //       <Breadcrumbs tool={tool as ToolMeta} />
// //       <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{tool.name}</h1>
// //       <p className="mt-3 text-lg leading-relaxed text-[var(--muted)]">{tool.short_description}</p>
// //       <AdSlot placement="tool-top" />
// //       <div className="mt-8">
// //         <ToolEngine tool={tool as ToolMeta} />
// //       </div>
// //       <AdSlot placement="tool-bottom" />
// //       <ToolSeoContent tool={tool as ToolMeta} />
// //       <RelatedTools tool={tool as ToolMeta} allTools={allTools} />
// //     </main>
// //   );
// // }


// import type { Metadata } from "next";
// import { notFound } from "next/navigation";

// import { fetchTool, fetchTools, SITE_URL } from "@/lib/api";
// import { ToolEngine } from "@/features/tools/ToolEngine";
// import {
//   AdSlot,
//   Breadcrumbs,
//   RelatedTools,
//   ToolSeoContent,
// } from "@/components/tools/ToolPageSections";

// import type { ToolMeta } from "@/features/tools/client-processors";

// type Props = {
//   params: Promise<{
//     category: string;
//     tool: string;
//   }>;
// };

// export async function generateMetadata({
//   params,
// }: Props): Promise<Metadata> {
//   const { category, tool: slug } = await params;

//   const tool = await fetchTool(category, slug);

//   if (!tool) return {};

//   return {
//     title: tool.seo_title || tool.name,
//     description: tool.meta_description || tool.short_description,

//     alternates: {
//       canonical: `${SITE_URL}/tools/${category}/${slug}`,
//     },

//     openGraph: {
//       title: tool.seo_title || tool.name,
//       description:
//         tool.meta_description || tool.short_description,
//     },
//   };
// }

// export default async function ToolPage({ params }: Props) {
//   const { category, tool: slug } = await params;

//   const [tool, allTools] = await Promise.all([
//     fetchTool(category, slug),

//     fetchTools().catch(() => []) as Promise<ToolMeta[]>,
//   ]);

//   if (!tool) notFound();

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "WebApplication",
//     name: tool.name,
//     description: tool.short_description,
//     applicationCategory: "UtilityApplication",
//     offers: {
//       "@type": "Offer",
//       price: "0",
//       priceCurrency: "USD",
//     },
//   };

//   const isPdfEditor = slug === "pdf-editor";

//   /*
//    * ---------------------------------------------------------
//    * PDF EDITOR
//    * ---------------------------------------------------------
//    *
//    * PDF editor needs the full viewport workspace, so keep
//    * its special layout separate from normal tools.
//    */
//   if (isPdfEditor) {
//     return (
//       <main className="pdf-editor-page h-[calc(100dvh-5.9rem)] overflow-hidden bg-[#edf5f1]">
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(jsonLd),
//           }}
//         />

//         <ToolEngine tool={tool as ToolMeta} />
//       </main>
//     );
//   }

//   /*
//    * ---------------------------------------------------------
//    * NORMAL TOOL PAGE
//    * ---------------------------------------------------------
//    */

//   return (
//     <main className="min-h-screen bg-[var(--background)]">
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(jsonLd),
//         }}
//       />

//       <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
//         {/* =================================================
//             BREADCRUMBS
//         ================================================= */}

//         <Breadcrumbs tool={tool as ToolMeta} />

//         {/* =================================================
//             TOOL HERO
//         ================================================= */}

//         <section className="relative mt-2 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-6 py-7 shadow-sm sm:px-8 sm:py-9 md:px-10">
//           {/* Decorative background */}
//           <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

//           <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />

//           <div className="relative">
//             {/* Category badge */}

//             <div className="mb-5 flex flex-wrap items-center gap-2">
//               <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold capitalize text-blue-600 shadow-sm">
//                 <span className="h-2 w-2 rounded-full bg-blue-500" />

//                 {category.replace("-", " ")} tool
//               </span>

//               {tool.processing_type === "client" && (
//                 <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
//                   <span className="h-2 w-2 rounded-full bg-emerald-500" />

//                   Browser processing
//                 </span>
//               )}
//             </div>

//             {/* Title */}

//             <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
//               {tool.name}
//             </h1>

//             {/* Description */}

//             <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
//               {tool.short_description}
//             </p>

//             {/* Small trust/info row */}

//             <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
//               <span className="inline-flex items-center gap-2">
//                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
//                   ✓
//                 </span>

//                 Free to use
//               </span>

//               {tool.processing_type === "client" && (
//                 <span className="inline-flex items-center gap-2">
//                   <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
//                     ✓
//                   </span>

//                   Files stay in your browser
//                 </span>
//               )}

//               {tool.accepted_formats &&
//                 tool.accepted_formats.length > 0 && (
//                   <span className="inline-flex items-center gap-2">
//                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
//                       ✓
//                     </span>

//                     {tool.accepted_formats
//                       .slice(0, 5)
//                       .join(", ")
//                       .toUpperCase()}
//                   </span>
//                 )}
//             </div>
//           </div>
//         </section>

//         {/* =================================================
//             TOP AD
//         ================================================= */}

//         <AdSlot placement="tool-top" />

//         {/* =================================================
//             TOOL WORKSPACE
//         ================================================= */}

//         <section className="mt-8">
//           <div className="relative">
//             {/* Blue top accent */}

//             <div className="absolute left-6 right-6 top-0 z-10 h-1 rounded-full bg-blue-500" />

//             <div className="rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm">
//               <div className="rounded-[1.35rem] bg-slate-50/70 p-3 sm:p-5 md:p-6">
//                 <ToolEngine tool={tool as ToolMeta} />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* =================================================
//             BOTTOM AD
//         ================================================= */}

//         <AdSlot placement="tool-bottom" />

//         {/* =================================================
//             SEO CONTENT
//         ================================================= */}

//         <ToolSeoContent tool={tool as ToolMeta} />

//         {/* =================================================
//             RELATED TOOLS
//         ================================================= */}

//         <RelatedTools
//           tool={tool as ToolMeta}
//           allTools={allTools}
//         />
//       </div>
//     </main>
//   );
// }


import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCategory } from "@/lib/api";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: `${category.replace("-", " ")} Tools — Free Online`, description: `Free online ${category} tools.` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const data = await fetchCategory(category) as {
    slug: string;
    name: string;
    description: string;
    tools: Array<{ slug: string; name: string; short_description: string; category_slug: string }>;
  } | null;
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
        {data.tools.length} tools
      </span>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">{data.name}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-500">{data.description}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.tools.map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.category_slug}/${t.slug}`}
            className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-800 transition-colors group-hover:text-blue-700">{t.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{t.short_description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}