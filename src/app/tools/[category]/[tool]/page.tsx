import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTool, fetchTools, SITE_URL } from "@/lib/api";
import { ToolEngine } from "@/features/tools/ToolEngine";
import { AdSlot, Breadcrumbs, RelatedTools, ToolSeoContent } from "@/components/tools/ToolPageSections";
import type { ToolMeta } from "@/features/tools/client-processors";

type Props = { params: Promise<{ category: string; tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, tool: slug } = await params;
  const tool = await fetchTool(category, slug);
  if (!tool) return {};
  return {
    title: tool.seo_title || tool.name,
    description: tool.meta_description || tool.short_description,
    alternates: { canonical: `${SITE_URL}/tools/${category}/${slug}` },
    openGraph: { title: tool.seo_title, description: tool.meta_description },
  };
}

export default async function ToolPage({ params }: Props) {
  const { category, tool: slug } = await params;
  const [tool, allTools] = await Promise.all([
    fetchTool(category, slug),
    fetchTools().catch(() => []) as Promise<ToolMeta[]>,
  ]);
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.short_description,
    applicationCategory: "UtilityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const isPdfEditor = slug === "pdf-editor";

  if (isPdfEditor) {
    return (
      <main className="h-[calc(100vh-4.25rem)] overflow-hidden bg-[#e8eaed]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ToolEngine tool={tool as ToolMeta} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs tool={tool as ToolMeta} />
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{tool.name}</h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--muted)]">{tool.short_description}</p>
      <AdSlot placement="tool-top" />
      <div className="mt-8">
        <ToolEngine tool={tool as ToolMeta} />
      </div>
      <AdSlot placement="tool-bottom" />
      <ToolSeoContent tool={tool as ToolMeta} />
      <RelatedTools tool={tool as ToolMeta} allTools={allTools} />
    </main>
  );
}
