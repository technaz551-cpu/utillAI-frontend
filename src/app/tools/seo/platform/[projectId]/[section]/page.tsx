import { notFound } from "next/navigation";

import { SEO_SECTIONS, type SeoSectionSlug } from "@/features/seo/navigation";
import { SeoProjectSection } from "@/features/seo/views/SeoProjectSection";

type Props = {
  params: Promise<{ projectId: string; section: string }>;
};

export default async function SeoProjectSectionPage({ params }: Props) {
  const { projectId, section } = await params;
  const valid = SEO_SECTIONS.some((s) => s.slug === section);
  if (!valid) notFound();

  // Name is hydrated client-side in a later pass; shell shows project id fallback.
  return (
    <SeoProjectSection
      projectId={projectId}
      section={section as SeoSectionSlug}
    />
  );
}
