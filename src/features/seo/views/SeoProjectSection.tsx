"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { validateStoredSession } from "@/lib/auth";

import {
  getDashboardCharts,
  getDashboardSummary,
  getIntegrationStatus,
  getProject,
} from "@/features/seo/api/client";
import { SeoSectionPanels } from "@/features/seo/components/SeoSectionPanels";
import { SeoShell } from "@/features/seo/components/SeoShell";
import type { SeoSectionSlug } from "@/features/seo/navigation";
import { SEO_NAV_GROUPS } from "@/features/seo/navigation";
import type { DashboardCharts, DashboardSummary, SeoProject } from "@/features/seo/types";

function sectionTitle(slug: SeoSectionSlug): string {
  for (const g of SEO_NAV_GROUPS) {
    const item = g.items.find((i) => i.slug === slug);
    if (item) return item.label;
  }
  return slug.replace(/-/g, " ");
}

export function SeoProjectSection({
  projectId,
  section,
}: {
  projectId: string;
  section: SeoSectionSlug;
}) {
  const [project, setProject] = useState<SeoProject | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [integrations, setIntegrations] = useState<Record<string, unknown> | null>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    void validateStoredSession().then((ok) => {
      if (!ok) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    });
  }, [pathname, router]);

  const refresh = useCallback(() => {
    void getDashboardSummary(projectId).then(setSummary).catch(() => {});
    void getDashboardCharts(projectId).then(setCharts).catch(() => {});
    void getProject(projectId).then(setProject).catch(() => {});
  }, [projectId]);

  useEffect(() => {
    refresh();
    if (section === "settings" || section === "analytics" || section === "search-console") {
      void getIntegrationStatus(projectId).then(setIntegrations).catch(() => {});
    }
  }, [projectId, section, refresh]);

  return (
    <SeoShell projectId={projectId} project={project} sectionSlug={section}>
      {section !== "overview" ? (
        <h2 className="mb-5 text-lg font-bold text-slate-900">{sectionTitle(section)}</h2>
      ) : (
        <div className="sr-only">{sectionTitle(section)}</div>
      )}
      <div
        className={
          section === "overview"
            ? undefined
            : "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
        }
      >
        <SeoSectionPanels
          projectId={projectId}
          section={section}
          project={project}
          summary={summary}
          charts={charts}
          integrations={integrations}
          onRefresh={refresh}
        />
      </div>
    </SeoShell>
  );
}
