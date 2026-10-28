"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  createProject,
  deleteProject,
  listProjects,
} from "@/features/seo/api/client";
import { SeoShell } from "@/features/seo/components/SeoShell";
import type { SeoProject } from "@/features/seo/types";
import { ensureValidSession } from "@/lib/auth";

export function SeoPlatformHome() {
  const router = useRouter();
  const [projects, setProjects] = useState<SeoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const load = () => {
    setLoading(true);
    void listProjects()
      .then(setProjects)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void ensureValidSession().then((ok) => {
      if (!ok) {
        router.replace("/login?next=/tools/seo/platform");
        return;
      }
      load();
    });
  }, [router]);

  const add = async () => {
    setError("");
    try {
      const p = await createProject({ name: name.trim(), website_url: url.trim() });
      setName("");
      setUrl("");
      router.push(`/tools/seo/platform/${p.id}/overview`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create project");
    }
  };

  return (
    <SeoShell sectionSlug="overview">
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-1">
          <h2 className="text-lg font-bold text-slate-900">Add project</h2>
          <p className="mt-1 text-sm text-slate-500">
            We start a site audit automatically so the dashboard shows health and current state.
          </p>
          {error ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="button"
              className="w-full rounded-xl bg-[#4f46e5] py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca]"
              onClick={() => void add()}
              disabled={!name.trim() || !url.trim()}
            >
              Create project &amp; scan site
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Your projects</h2>
          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading…</p>
          ) : projects.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No projects yet — create one to unlock SEO tools in the sidebar.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="pb-2">Website</th>
                    <th className="pb-2">Health</th>
                    <th className="pb-2">Issues</th>
                    <th className="pb-2">Pages</th>
                    <th className="pb-2">Last audit</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-t border-slate-100">
                      <td className="py-3">
                        <p className="font-semibold text-slate-900">{p.domain}</p>
                        <p className="text-xs text-slate-500">{p.website_url}</p>
                      </td>
                      <td className="py-3 font-bold text-emerald-600">{p.health_score ?? "—"}</td>
                      <td className="py-3">{p.open_issues}</td>
                      <td className="py-3">{p.pages_crawled ?? "—"}</td>
                      <td className="py-3 text-xs text-slate-500">
                        {p.last_audit_at?.slice(0, 10) ?? "Never"}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/tools/seo/platform/${p.id}/overview`}
                          className="mr-2 rounded-lg bg-[#4f46e5] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
                          onClick={() => void deleteProject(p.id).then(load)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          { title: "Site Audit", desc: "Crawl & technical issues", slug: "site-audit" },
          { title: "Keywords", desc: "Track phrases & ranks", slug: "keyword-research" },
          { title: "Performance", desc: "PageSpeed Insights", slug: "website-performance" },
        ].map((card) => (
          <div
            key={card.slug}
            className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-5 text-sm text-slate-600"
          >
            <p className="font-bold text-slate-800">{card.title}</p>
            <p className="mt-1">{card.desc}</p>
            <p className="mt-2 text-xs text-slate-400">Open a project to use this tool.</p>
          </div>
        ))}
      </div>
    </SeoShell>
  );
}
