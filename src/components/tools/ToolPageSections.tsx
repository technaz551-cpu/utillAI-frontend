import Link from "next/link";
import { ToolMeta } from "@/features/tools/client-processors";
import { card, categoryAccent } from "@/lib/utils";

export function Breadcrumbs({ tool }: { tool: ToolMeta }) {
  const accent = categoryAccent(tool.category_slug);
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
      <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
      <span>/</span>
      <Link href={`/tools/${tool.category_slug}`} className={`capitalize hover:opacity-80 ${accent.text}`}>
        {tool.category_slug.replace("-", " ")}
      </Link>
      <span>/</span>
      <span className="text-[var(--foreground)]">{tool.name}</span>
    </nav>
  );
}

export function AdSlot({ placement }: { placement: string }) {
  return (
    <div className="my-6 flex h-20 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 text-xs text-[var(--muted)]">
      Ad — {placement}
    </div>
  );
}

export function ToolSeoContent({ tool }: { tool: ToolMeta }) {
  const steps = tool.how_to_use?.length ? tool.how_to_use : [
    "Enter or upload your input",
    "Configure options if needed",
    "Click Process",
    "Copy or download the result",
  ];
  const faqs = tool.faq?.length ? tool.faq : [
    { question: `Is ${tool.name} free?`, answer: "Yes, this tool is free to use with standard limits." },
    { question: "Is my data safe?", answer: tool.processing_type === "client" ? "Yes — processing happens entirely in your browser." : "Files are processed securely and automatically deleted." },
    { question: "What formats are supported?", answer: tool.accepted_formats?.length ? tool.accepted_formats.join(", ").toUpperCase() : "Text and standard formats." },
  ];

  return (
    <div className="mt-12 space-y-10">
      <AdSlot placement="in-content" />
      <section>
        <h2 className="text-xl font-semibold">How to use {tool.name}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
          {steps.map((s, i) => <li key={i}>{typeof s === "string" ? s : s}</li>)}
        </ol>
      </section>
      {tool.features && tool.features.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold">Features</h2>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[var(--muted)]">{tool.features.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>
      )}
      <section>
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((f) => (
            <div key={f.question} className={card("py-4")}>
              <h3 className="font-medium">{f.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RelatedTools({ tool, allTools }: { tool: ToolMeta; allTools: ToolMeta[] }) {
  const related = (tool.related_tools || [])
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter(Boolean) as ToolMeta[];

  if (!related.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold">Related tools</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((t) => {
          const accent = categoryAccent(t.category_slug);
          return (
            <Link key={t.slug} href={`/tools/${t.category_slug}/${t.slug}`} className={card(accent.ring + " py-4 transition-colors hover:bg-[var(--surface-raised)]")}>
              <h3 className={`font-medium ${accent.text}`}>{t.name}</h3>
              <p className="mt-1.5 text-sm text-[var(--muted)] line-clamp-2">{t.short_description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
