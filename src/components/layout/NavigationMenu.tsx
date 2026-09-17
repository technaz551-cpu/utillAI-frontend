"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type Tool = {
  slug: string;
  name: string;
  category_slug?: string;
};

type Category = {
  slug: string;
  label: string;
  icon: string;
  description: string;
  tools: Tool[];
};

type NavigationMenuProps = {
  navItems: NavItem[];
  categories: Category[];
};

export function NavigationMenu({
  navItems,
  categories,
}: NavigationMenuProps) {
  return (
    <nav className="nav-shell hidden items-center gap-1 rounded-full border border-[var(--border)] bg-white/80 p-1 shadow-[0_12px_24px_rgba(17,42,33,0.06)] opacity-0 transition-all duration-200 lg:flex lg:translate-y-1 lg:group-hover/header:translate-y-0 lg:group-hover/header:opacity-100 lg:group-focus-within:opacity-100 lg:group-hover/logo:opacity-100 lg:[&:hover]:translate-y-0 lg:[&:hover]:opacity-100">
      {navItems.map((item) => {
        const isDropdown =
          item.label === "Tools" ||
          item.label === "Categories";

        if (isDropdown) {
          return (
            <div
              key={item.label}
              className="group/menu relative"
            >
              {/* Dropdown Trigger */}
              <button
                type="button"
                className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand-primary)] hover:text-white"
              >
                {item.label}

                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown */}
              <div className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+0.9rem)] w-[720px] -translate-x-1/2 -translate-y-3 rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-5 text-left opacity-0 shadow-[0_30px_80px_rgba(0,0,0,0.22)] transition-all duration-200 group-hover/menu:visible group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
                
                {/* Dropdown Header */}
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                      Browse all
                    </p>

                    <p className="mt-1 text-sm text-[var(--foreground)]">
                      Powerful tools for creative, fast-moving work
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1.5 text-[11px] font-semibold text-[var(--foreground)]">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />

                    Workflow suite
                  </div>
                </div>

                {/* Categories */}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {categories.map((category) => {
                    const tools = category.tools || [];

                    return (
                      <div
                        key={category.slug}
                        className="group/category rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/35 hover:bg-[var(--brand-primary)]"
                      >
                        {/* Category Link */}
                        <Link
                          href={`/tools/${category.slug}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/25 via-[var(--brand-secondary)]/20 to-[var(--brand-accent)]/25 text-[11px] font-black tracking-[0.06em] text-[var(--foreground)] group-hover/category:bg-white/15 group-hover/category:text-white">
                            {category.icon}
                          </span>

                          <ArrowRight className="h-4 w-4 text-[var(--muted)] group-hover/category:text-white" />
                        </Link>

                        {/* Category Name */}
                        <Link
                          href={`/tools/${category.slug}`}
                          className="mt-4 block text-base font-bold text-[var(--foreground)] group-hover/category:text-white"
                        >
                          {category.label}
                        </Link>

                        {/* Category Description */}
                        <p className="mt-1 text-sm leading-relaxed text-[var(--muted)] group-hover/category:text-white/80">
                          {category.description}
                        </p>

                        {/* Tools */}
                        {item.label === "Tools" && (
                          <ul className="mt-3 space-y-1 border-t border-[var(--border)]/70 pt-3 group-hover/category:border-white/20">
                            {tools
                              .slice(0, 5)
                              .map((tool) => (
                                <li
                                  key={tool.slug}
                                  className="flex items-start gap-2 text-xs text-[var(--muted)] group-hover/category:text-white/85"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)] group-hover/category:bg-white" />

                                  <Link
                                    href={`/tools/${
                                      tool.category_slug ||
                                      category.slug
                                    }/${tool.slug}`}
                                    className="hover:underline"
                                  >
                                    {tool.name}
                                  </Link>
                                </li>
                              ))}

                            {tools.length > 5 && (
                              <li className="pt-1 text-xs font-semibold text-[var(--brand-primary)] group-hover/category:text-white">
                                <Link
                                  href={`/tools/${category.slug}`}
                                >
                                  View all {tools.length} tools
                                </Link>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        {/* Normal Navigation Link */}
        return (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand-primary)] hover:text-white"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}