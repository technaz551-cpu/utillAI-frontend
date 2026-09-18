"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchCategories } from "@/lib/api";

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
  label?: string;
  name?: string;
  icon?: string;
  description?: string;
  tools?: Tool[];
};

type NavigationMenuProps = {
  navItems: NavItem[];
};

export function NavigationMenu({
  navItems,
}: NavigationMenuProps) {
  const [openMenu, setOpenMenu] = useState<
    "tools" | "categories" | null
  >(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);

  /*
   * Load categories from backend/local fallback
   */
  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const data = await fetchCategories();

        if (mounted && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error(
          "Failed to load navigation categories:",
          error
        );

        if (mounted) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Close popup when clicking outside
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Toggle popup
   */
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
        const isCategories =
          item.label === "Categories";

        /*
         * =========================
         * TOOLS POPUP
         * =========================
         */
        if (isTools) {
          return (
            <div
              key={item.label}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  toggleMenu("tools")
                }
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  openMenu === "tools"
                    ? "bg-[#E7F0FF] text-[#1769E0]"
                    : "text-[#52627A] hover:bg-[#F2F6FC] hover:text-[#1769E0]"
                }`}
                aria-expanded={
                  openMenu === "tools"
                }
              >
                Tools

                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    openMenu === "tools"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {openMenu === "tools" && (
                <div className="absolute left-1/2 top-full z-[100] mt-2 w-max max-w-[700px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">

                  {/* Header */}
                  <div className="mb-5 pb-4 border-b border-slate-200">
                    <Link
                      href="/tools"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                      className="text-base font-bold text-slate-800 transition hover:text-[#1769E0]"
                    >
                      Browse All Tools
                    </Link>

                    <p className="mt-1 text-xs text-slate-500">
                      Explore our tools organized by
                      category.
                    </p>
                  </div>

                  {/* Categories + Tools - SCROLLABLE */}
                  {categories.length > 0 ? (
                    <div className="max-h-[480px] overflow-y-auto pr-3">
                      {/* Custom Scrollbar Styling */}
                      <style>{`
                        .tools-popup::-webkit-scrollbar {
                          width: 6px;
                        }
                        .tools-popup::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .tools-popup::-webkit-scrollbar-thumb {
                          background: #cbd5e1;
                          border-radius: 3px;
                        }
                        .tools-popup::-webkit-scrollbar-thumb:hover {
                          background: #94a3b8;
                        }
                      `}</style>
                      
                      <div className="tools-popup grid grid-cols-2 gap-6 gap-y-2">
                        {categories.map(
                          (category) => {
                            const categoryName =
                              category.label ||
                              category.name ||
                              "Category";

                            const tools =
                              category.tools || [];

                            // Dynamic spacing based on tool count
                            let toolSpacing = "space-y-0.5";
                            let categoryGap = "mb-1.5";

                            if (tools.length === 0) {
                              toolSpacing = "space-y-0";
                              categoryGap = "mb-1";
                            } else if (tools.length <= 3) {
                              toolSpacing = "space-y-0.5";
                              categoryGap = "mb-1.5";
                            } else if (tools.length <= 6) {
                              toolSpacing = "space-y-1";
                              categoryGap = "mb-2";
                            } else {
                              toolSpacing = "space-y-1";
                              categoryGap = "mb-2";
                            }

                            return (
                              <div
                                key={category.slug}
                                className="min-w-0"
                              >
                                {/* Category */}
                                <Link
                                  href={`/tools/${category.slug}`}
                                  onClick={() =>
                                    setOpenMenu(null)
                                  }
                                  className={`${categoryGap} block text-xs font-bold text-slate-800 transition hover:text-[#1769E0] uppercase tracking-wide`}
                                >
                                  {categoryName}
                                </Link>

                                {/* Tools */}
                                {tools.length > 0 ? (
                                  <ul className={toolSpacing}>
                                    {tools.map(
                                      (tool) => (
                                        <li
                                          key={
                                            tool.slug
                                          }
                                          className="relative pl-3.5"
                                        >
                                          {/* Bullet */}
                                          <span className="absolute left-0 top-[6px] h-1 w-1 rounded-full bg-[#1769E0]" />

                                          <Link
                                            href={`/tools/${
                                              tool.category_slug ||
                                              category.slug
                                            }/${tool.slug}`}
                                            onClick={() =>
                                              setOpenMenu(
                                                null
                                              )
                                            }
                                            className="text-xs text-slate-600 transition hover:text-[#1769E0] hover:underline"
                                          >
                                            {tool.name}
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-slate-400">
                                    No tools available.
                                  </p>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-xs font-medium text-slate-600">
                        No categories available.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Categories could not be loaded.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        /*
         * =========================
         * CATEGORIES POPUP
         * =========================
         */
        if (isCategories) {
          return (
            <div
              key={item.label}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  toggleMenu("categories")
                }
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  openMenu === "categories"
                    ? "bg-[#E7F0FF] text-[#1769E0]"
                    : "text-[#52627A] hover:bg-[#F2F6FC] hover:text-[#1769E0]"
                }`}
                aria-expanded={
                  openMenu === "categories"
                }
              >
                Categories

                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    openMenu === "categories"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {openMenu === "categories" && (
                <div className="absolute left-1/2 top-full z-[100] mt-2 w-80 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">

                  {/* Header */}
                  <div className="mb-4 pb-3 border-b border-slate-200">
                    <p className="text-sm font-bold text-slate-800">
                      Categories
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Browse tools by category.
                    </p>
                  </div>

                  {/* ONLY CATEGORIES - SCROLLABLE */}
                  {categories.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      <style>{`
                        .categories-popup::-webkit-scrollbar {
                          width: 6px;
                        }
                        .categories-popup::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .categories-popup::-webkit-scrollbar-thumb {
                          background: #cbd5e1;
                          border-radius: 3px;
                        }
                        .categories-popup::-webkit-scrollbar-thumb:hover {
                          background: #94a3b8;
                        }
                      `}</style>
                      
                      <ul className="categories-popup space-y-1.5">
                        {categories.map(
                          (category) => {
                            const categoryName =
                              category.label ||
                              category.name ||
                              "Category";

                            return (
                              <li
                                key={category.slug}
                              >
                                <Link
                                  href={`/tools/${category.slug}`}
                                  onClick={() =>
                                    setOpenMenu(
                                      null
                                    )
                                  }
                                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#F0F5FF] hover:text-[#1769E0]"
                                >
                                  {/* Icon with background */}
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E7F0FF]" />


                                  <span className="truncate font-semibold">
                                    {categoryName}
                                  </span>
                                </Link>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs text-slate-500">
                        No categories available.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        /*
         * =========================
         * NORMAL LINKS
         * =========================
         */
        return (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full px-4 py-2 text-[13px] font-medium text-[#52627A] transition-all duration-200 hover:bg-[#F2F6FC] hover:text-[#1769E0]"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}