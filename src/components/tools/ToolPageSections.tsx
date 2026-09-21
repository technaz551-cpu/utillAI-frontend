// import Link from "next/link";
// import { ToolMeta } from "@/features/tools/client-processors";
// import { card, categoryAccent } from "@/lib/utils";

// export function Breadcrumbs({ tool }: { tool: ToolMeta }) {
//   const accent = categoryAccent(tool.category_slug);
//   return (
//     <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
//       <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
//       <span>/</span>
//       <Link href={`/tools/${tool.category_slug}`} className={`capitalize hover:opacity-80 ${accent.text}`}>
//         {tool.category_slug.replace("-", " ")}
//       </Link>
//       <span>/</span>
//       <span className="text-[var(--foreground)]">{tool.name}</span>
//     </nav>
//   );
// }

// export function AdSlot({ placement }: { placement: string }) {
//   return (
//     <div className="my-6 flex h-20 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 text-xs text-[var(--muted)]">
//       Ad — {placement}
//     </div>
//   );
// }

// export function ToolSeoContent({ tool }: { tool: ToolMeta }) {
//   const steps = tool.how_to_use?.length ? tool.how_to_use : [
//     "Enter or upload your input",
//     "Configure options if needed",
//     "Click Process",
//     "Copy or download the result",
//   ];
//   const faqs = tool.faq?.length ? tool.faq : [
//     { question: `Is ${tool.name} free?`, answer: "Yes, this tool is free to use with standard limits." },
//     { question: "Is my data safe?", answer: tool.processing_type === "client" ? "Yes — processing happens entirely in your browser." : "Files are processed securely and automatically deleted." },
//     { question: "What formats are supported?", answer: tool.accepted_formats?.length ? tool.accepted_formats.join(", ").toUpperCase() : "Text and standard formats." },
//   ];

//   return (
//     <div className="mt-12 space-y-10">
//       <AdSlot placement="in-content" />
//       <section>
//         <h2 className="text-xl font-semibold">How to use {tool.name}</h2>
//         <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
//           {steps.map((s, i) => <li key={i}>{typeof s === "string" ? s : s}</li>)}
//         </ol>
//       </section>
//       {tool.features && tool.features.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold">Features</h2>
//           <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[var(--muted)]">{tool.features.map((f) => <li key={f}>{f}</li>)}</ul>
//         </section>
//       )}
//       <section>
//         <h2 className="text-xl font-semibold">FAQ</h2>
//         <div className="mt-4 space-y-3">
//           {faqs.map((f) => (
//             <div key={f.question} className={card("py-4")}>
//               <h3 className="font-medium">{f.question}</h3>
//               <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.answer}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// export function RelatedTools({ tool, allTools }: { tool: ToolMeta; allTools: ToolMeta[] }) {
//   const related = (tool.related_tools || [])
//     .map((slug) => allTools.find((t) => t.slug === slug))
//     .filter(Boolean) as ToolMeta[];

//   if (!related.length) return null;
//   return (
//     <section className="mt-12">
//       <h2 className="text-lg font-semibold">Related tools</h2>
//       <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//         {related.map((t) => {
//           const accent = categoryAccent(t.category_slug);
//           return (
//             <Link key={t.slug} href={`/tools/${t.category_slug}/${t.slug}`} className={card(accent.ring + " py-4 transition-colors hover:bg-[var(--surface-raised)]")}>
//               <h3 className={`font-medium ${accent.text}`}>{t.name}</h3>
//               <p className="mt-1.5 text-sm text-[var(--muted)] line-clamp-2">{t.short_description}</p>
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

import Link from "next/link";
import { ToolMeta } from "@/features/tools/client-processors";
import { card, categoryAccent } from "@/lib/utils";

export function Breadcrumbs({ tool }: { tool: ToolMeta }) {
  const accent = categoryAccent(tool.category_slug);

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm">
      <Link
        href="/"
        className="rounded-full px-3 py-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
      >
        Home
      </Link>

      <span className="text-slate-300">/</span>

      <Link
        href={`/tools/${tool.category_slug}`}
        className={`rounded-full bg-blue-50 px-3 py-1.5 capitalize transition hover:bg-blue-100 ${accent.text}`}
      >
        {tool.category_slug.replace("-", " ")}
      </Link>

      <span className="text-slate-300">/</span>

      <span className="max-w-full truncate rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm ring-1 ring-slate-100">
        {tool.name}
      </span>
    </nav>
  );
}

export function AdSlot({ placement }: { placement: string }) {
  return (
    <div className="my-8 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/80 px-4 text-xs text-slate-400">
      <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-blue-100">
        Advertisement · {placement}
      </span>
    </div>
  );
}

export function ToolSeoContent({ tool }: { tool: ToolMeta }) {
  const steps = tool.how_to_use?.length
    ? tool.how_to_use
    : [
        "Enter or upload your input",
        "Configure options if needed",
        "Click Process",
        "Copy or download the result",
      ];

  const faqs = tool.faq?.length
    ? tool.faq
    : [
        {
          question: `Is ${tool.name} free?`,
          answer: "Yes, this tool is free to use with standard limits.",
        },
        {
          question: "Is my data safe?",
          answer:
            tool.processing_type === "client"
              ? "Yes — processing happens entirely in your browser."
              : "Files are processed securely and automatically deleted.",
        },
        {
          question: "What formats are supported?",
          answer: tool.accepted_formats?.length
            ? tool.accepted_formats.join(", ").toUpperCase()
            : "Text and standard formats.",
        },
      ];

  return (
    <div className="mt-14 space-y-10">

      <AdSlot placement="in-content" />

      {/* How to use */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6 shadow-sm sm:p-8">

        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Simple & Easy
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            How to use{" "}
            <span className="text-blue-600">{tool.name}</span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Get started in just a few simple steps. No complicated setup
            required.
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-200">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="pt-1">
                  <p className="text-sm font-medium leading-6 text-slate-700">
                    {step}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      {tool.features && tool.features.length > 0 && (
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <span className="mb-3 inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600">
              What You Get
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Features
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Explore the features designed to make your work easier.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {tool.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="text-sm leading-6 text-slate-600">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 p-6 sm:p-8">
        <div className="mb-6">
          <span className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
            Got Questions?
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Find answers to common questions about {tool.name}.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <h3 className="flex items-start gap-3 font-semibold text-slate-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  ?
                </span>

                <span className="pt-0.5">{faq.question}</span>
              </h3>

              <p className="mt-3 pl-10 text-sm leading-7 text-slate-500">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RelatedTools({
  tool,
  allTools,
}: {
  tool: ToolMeta;
  allTools: ToolMeta[];
}) {
  const related = (tool.related_tools || [])
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter(Boolean) as ToolMeta[];

  if (!related.length) return null;

  return (
    <section className="mt-14 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/70 p-6 sm:p-8">

      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-3 inline-flex rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
            Keep Exploring
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Related Tools
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Discover more tools to simplify your workflow.
          </p>
        </div>

        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-600 hover:text-white"
        >
          Explore All
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((relatedTool) => {
          const accent = categoryAccent(relatedTool.category_slug);

          return (
            <Link
              key={relatedTool.slug}
              href={`/tools/${relatedTool.category_slug}/${relatedTool.slug}`}
              className={card(
                `group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg ${accent.ring}`
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold ${accent.text}`}
                >
                  ✦
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-600 group-hover:text-white">
                  →
                </span>
              </div>

              <h3
                className={`text-base font-bold text-slate-800 transition group-hover:text-blue-600 ${accent.text}`}
              >
                {relatedTool.name}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {relatedTool.short_description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-600">
                Try this tool
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}