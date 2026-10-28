"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, Home, Menu, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { listProjects } from "@/features/seo/api/client";
import {
  SEO_QUICK_NAV_ITEMS,
  SEO_SIDEBAR_GROUPS,
  type SeoSectionSlug,
} from "@/features/seo/navigation";
import type { SeoProject } from "@/features/seo/types";
import { getStoredUser, type AuthUser } from "@/lib/auth";

function navHref(projectId: string | undefined, slug: string): string {
  if (slug === "projects-home" || slug === "overview") {
    if (!projectId) return "/tools/seo/platform";
    return `/tools/seo/platform/${projectId}/overview`;
  }
  if (!projectId) return "/tools/seo/platform";
  return `/tools/seo/platform/${projectId}/${slug}`;
}

function isNavActive(pathname: string, projectId: string | undefined, slug: string): boolean {
  if (slug === "projects-home") return pathname === "/tools/seo/platform";
  if (slug === "overview") {
    if (!projectId) return pathname === "/tools/seo/platform";
    return pathname === `/tools/seo/platform/${projectId}/overview`;
  }
  if (!projectId) return false;
  return pathname.endsWith(`/${slug}`);
}

export function SeoShell({
  projectId,
  project,
  sectionSlug,
  children,
}: {
  projectId?: string;
  project?: SeoProject | null;
  sectionSlug?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);
  const [projects, setProjects] = useState<SeoProject[]>([]);
  const [quickSearch, setQuickSearch] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    sync();
    window.addEventListener("auth:state-change", sync);
    return () => window.removeEventListener("auth:state-change", sync);
  }, []);

  const runQuickSearch = () => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return;
    const tool = SEO_QUICK_NAV_ITEMS.find(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        String(i.slug).replace(/-/g, " ").includes(q),
    );
    const proj = projects.find(
      (p) =>
        p.domain.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.website_url.toLowerCase().includes(q),
    );
    if (proj) {
      const section = (sectionSlug || "overview") as SeoSectionSlug;
      router.push(`/tools/seo/platform/${proj.id}/${section}`);
      setQuickSearch("");
      return;
    }
    if (projectId && tool && tool.slug !== "overview") {
      router.push(`/tools/seo/platform/${projectId}/${tool.slug}`);
      setQuickSearch("");
      return;
    }
    if (projectId && (q.startsWith("http") || q.startsWith("/"))) {
      router.push(`/tools/seo/platform/${projectId}/url-inspection`);
      setQuickSearch("");
      return;
    }
    if (projectId && tool?.slug === "overview") {
      router.push(`/tools/seo/platform/${projectId}/overview`);
      setQuickSearch("");
    }
  };

  useEffect(() => {
    void listProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  const pageTitle =
    sectionSlug === "overview" || !sectionSlug
      ? "SEO Dashboard"
      : SEO_SIDEBAR_GROUPS.flatMap((g) => g.items).find((i) => i.slug === sectionSlug)?.label ??
        "SEO";

  return (
    <div className="flex min-h-dvh bg-[#eef1f8] text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#0f1729] text-slate-300 transition-transform lg:static lg:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/"
          onClick={() => setMobileNav(false)}
          className="flex h-16 items-center gap-2 border-b border-white/10 px-5 transition hover:bg-white/5"
          title="Back to UtilAI home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4f46e5]">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0">
            <span className="block text-lg font-bold tracking-tight text-white">UTILAI</span>
            <span className="block truncate text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Main site home
            </span>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            href="/"
            onClick={() => setMobileNav(false)}
            className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:border-[#4f46e5]/50 hover:bg-white/10 hover:text-white"
          >
            <Home className="h-4 w-4 shrink-0 text-[#818cf8]" />
            Back to Home
          </Link>
          {SEO_SIDEBAR_GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const needsProject =
                    item.slug !== "projects-home" && item.slug !== "overview";
                  const disabled = needsProject && !projectId;
                  const href = navHref(projectId, item.slug);
                  const active = isNavActive(pathname, projectId, item.slug);
                  const Icon = item.icon;
                  return (
                    <li key={item.slug}>
                      {disabled ? (
                        <span
                          className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600"
                          title="Open a project first"
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-50" />
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          href={href}
                          onClick={() => setMobileNav(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "bg-[#4f46e5] text-white shadow-lg shadow-indigo-900/30"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] p-4 text-white">
            <p className="text-sm font-semibold">Upgrade to Pro</p>
            <p className="mt-1 text-xs text-indigo-100">Unlock advanced audits &amp; automation.</p>
            <Link
              href="/pricing"
              className="mt-3 inline-block rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#4f46e5]"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </aside>

      {mobileNav ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNav(false)}
        />
      ) : null}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 md:px-6">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#4f46e5] hover:text-[#4f46e5]"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="relative hidden max-w-xl flex-1 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search projects, tools, or URLs… (Enter)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runQuickSearch();
                }}
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </button>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1 transition hover:border-[#4f46e5] hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4f46e5] text-xs font-bold text-white">
                  {(user?.name || "U").slice(0, 1).toUpperCase()}
                </span>
                <div className="hidden text-left text-xs sm:block">
                  <p className="font-semibold text-slate-800">{user?.name || "Account"}</p>
                  <p className="text-slate-500">Profile</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <div className="border-b border-slate-200 bg-white px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
              {project ? (
                <p className="text-sm text-slate-500">{project.domain}</p>
              ) : (
                <p className="text-sm text-slate-500">Manage all your SEO projects</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {projectId && projects.length > 0 ? (
                <div className="relative">
                  <select
                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium"
                    value={projectId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const section = (sectionSlug || "overview") as SeoSectionSlug;
                      router.push(`/tools/seo/platform/${id}/${section}`);
                    }}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.domain}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              ) : null}
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600" defaultValue="30">
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
              <Link
                href="/tools/seo/platform"
                className="rounded-xl bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4338ca]"
              >
                + Add Project
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
