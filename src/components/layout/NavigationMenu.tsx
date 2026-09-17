
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const [openMenu, setOpenMenu] = useState<
    "tools" | "categories" | null
  >(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const toggleMenu = (
    menu: "tools" | "categories"
  ) => {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  };

  return (
    <nav
      ref={menuRef}
      className="relative hidden items-center justify-center gap-1 lg:flex"
    >
      {navItems.map((item) => {
        const isTools = item.label === "Tools";
        const isCategories = item.label === "Categories";

        /*
         * TOOLS BUTTON
         */
        if (isTools) {
          return (
            <div
              key={item.label}
              className="relative"
            >
              <button
                type="button"
                onClick={() => toggleMenu("tools")}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand-primary)] hover:text-white"
                aria-expanded={openMenu === "tools"}
              >
                Tools

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openMenu === "tools"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {openMenu === "tools" && (
                <div className="absolute left-1/2 top-full z-50 mt-3 w-[520px] -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_20px_60px_rgba(17,42,33,0.15)]">
                  <div className="mb-4 border-b border-[var(--border)] pb-3">
                    <Link
                      href="/tools"
                      onClick={() => setOpenMenu(null)}
                      className="text-lg font-bold text-[var(--foreground)] hover:text-[var(--brand-primary)]"
                    >
                      Browse All Tools
                    </Link>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Explore tools organized by category.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {categories.map((category) => {
                      const tools = category.tools || [];

                      return (
                        <div key={category.slug}>
                          {/* Category */}
                          <Link
                            href={`/tools/${category.slug}`}
                            onClick={() => setOpenMenu(null)}
                            className="mb-2 block text-sm font-bold text-[var(--foreground)] hover:text-[var(--brand-primary)]"
                          >
                            {category.label}
                          </Link>

                          {/* Tools */}
                          {tools.length > 0 ? (
                            <ul className="space-y-1.5">
                              {tools.map((tool) => (
                                <li
                                  key={tool.slug}
                                  className="relative pl-4 text-sm text-[var(--muted)]"
                                >
                                  <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />

                                  <Link
                                    href={`/tools/${
                                      tool.category_slug ||
                                      category.slug
                                    }/${tool.slug}`}
                                    onClick={() =>
                                      setOpenMenu(null)
                                    }
                                    className="transition hover:text-[var(--brand-primary)] hover:underline"
                                  >
                                    {tool.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-[var(--muted)]">
                              No tools available.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }

        /*
         * CATEGORIES BUTTON
         */
        if (isCategories) {
          return (
            <div
              key={item.label}
              className="relative"
            >
              <button
                type="button"
                onClick={() => toggleMenu("categories")}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand-primary)] hover:text-white"
                aria-expanded={
                  openMenu === "categories"
                }
              >
                Categories

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openMenu === "categories"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {openMenu === "categories" && (
                <div className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_20px_60px_rgba(17,42,33,0.15)]">
                  <div className="mb-3 border-b border-[var(--border)] pb-3">
                    <p className="text-lg font-bold text-[var(--foreground)]">
                      Categories
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Browse tools by category.
                    </p>
                  </div>

                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/tools/${category.slug}`}
                          onClick={() =>
                            setOpenMenu(null)
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--brand-primary)] hover:text-white"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 text-[9px] font-black text-[var(--brand-primary)]">
                            {category.icon}
                          </span>

                          {category.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }

        /*
         * NORMAL NAVIGATION LINKS
         */
        return (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand-primary)] hover:text-white"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

