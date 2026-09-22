"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
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
  name: string;
  tools: Tool[];
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

  const [categories, setCategories] =
    useState<Category[]>([]);

  const menuRef =
    useRef<HTMLDivElement>(null);

  /* =========================================================
     LOAD CATEGORIES FROM API
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const data = await fetchCategories();

        if (!mounted || !Array.isArray(data)) {
          return;
        }

        const normalizedCategories: Category[] = [];

        for (const category of data) {
          /*
           * Category slug
           *
           * Your API type says slug can be undefined,
           * so only accept categories that have a valid slug.
           */
          if (
            typeof category.slug !== "string" ||
            category.slug.trim() === ""
          ) {
            continue;
          }

          /*
           * Category name
           */
          const categoryName =
            typeof category.name === "string" &&
            category.name.trim() !== ""
              ? category.name
              : "Category";

          /*
           * Tools
           */
          const tools: Tool[] = [];

          if (Array.isArray(category.tools)) {
            for (const rawTool of category.tools) {
              if (
                typeof rawTool !== "object" ||
                rawTool === null
              ) {
                continue;
              }

              const tool =
                rawTool as Record<string, unknown>;

              /*
               * Tool must have slug and name
               */
              if (
                typeof tool.slug !== "string" ||
                tool.slug.trim() === "" ||
                typeof tool.name !== "string" ||
                tool.name.trim() === ""
              ) {
                continue;
              }

              const normalizedTool: Tool = {
                slug: tool.slug,
                name: tool.name,
              };

              /*
               * category_slug is optional
               */
              if (
                typeof tool.category_slug ===
                "string" &&
                tool.category_slug.trim() !== ""
              ) {
                normalizedTool.category_slug =
                  tool.category_slug;
              }

              tools.push(normalizedTool);
            }
          }

          normalizedCategories.push({
            slug: category.slug,
            name: categoryName,
            tools,
          });
        }

        if (mounted) {
          setCategories(normalizedCategories);
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

  /* =========================================================
     CLOSE POPUP WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
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

  /* =========================================================
     TOGGLE MENU
  ========================================================= */

  function toggleMenu(
    menu: "tools" | "categories"
  ) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  return (
    <nav
      ref={menuRef}
      className="relative hidden items-center justify-center gap-1 lg:flex"
    >
      {navItems.map((item) => {
        /* =====================================================
           TOOLS
        ===================================================== */

        if (item.label === "Tools") {
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
                aria-expanded={
                  openMenu === "tools"
                }
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  openMenu === "tools"
                    ? "bg-[#E7F0FF] text-[#1769E0]"
                    : "text-[#52627A] hover:bg-[#F2F6FC] hover:text-[#1769E0]"
                }`}
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
                <div className="absolute left-1/2 top-full z-[100] mt-2 w-[700px] max-w-[calc(100vw-40px)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">

                  {/* Popup Header */}
                  <div className="mb-5 border-b border-slate-200 pb-4">
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
                      Explore our tools organized
                      by category.
                    </p>
                  </div>

                  {/* Categories + Tools */}
                  {categories.length > 0 ? (
                    <div className="max-h-[350px] overflow-y-auto pr-3">
                      <div className="grid grid-cols-3 gap-x-10 gap-y-4">

                        {categories.map(
                          (category) => (
                            <div
                              key={
                                category.slug
                              }
                              className="min-w-0"
                            >
                              {/* Category Name */}
                              <Link
                                href={`/tools/${category.slug}`}
                                onClick={() =>
                                  setOpenMenu(
                                    null
                                  )
                                }
                                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-800 transition hover:text-[#1769E0]"
                              >
                                {category.name}
                              </Link>

                              {/* Tools */}
                              {category.tools
                                .length > 0 ? (
                                <ul className="space-y-1">
                                  {category.tools.map(
                                    (tool) => (
                                      <li
                                        key={
                                          tool.slug
                                        }
                                        className="relative pl-4"
                                      >
                                        {/* Bullet */}
                                        <span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-[#1769E0]" />

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
                                          {
                                            tool.name
                                          }
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
                          )
                        )}

                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm font-medium text-slate-600">
                        No categories available.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Categories could not
                        be loaded.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        /* =====================================================
           CATEGORIES
        ===================================================== */

        if (item.label === "Categories") {
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
                aria-expanded={
                  openMenu === "categories"
                }
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  openMenu === "categories"
                    ? "bg-[#E7F0FF] text-[#1769E0]"
                    : "text-[#52627A] hover:bg-[#F2F6FC] hover:text-[#1769E0]"
                }`}
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
                <div className="absolute left-1/2 top-full z-[100] mt-2 w-80 max-w-[calc(100vw-40px)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">

                  {/* Header */}
                  <div className="mb-4 border-b border-slate-200 pb-3">
                    <p className="text-sm font-bold text-slate-800">
                      Categories
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Browse tools by category.
                    </p>
                  </div>

                  {/* Categories Only */}
                  {categories.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      <ul className="space-y-1.5">

                        {categories.map(
                          (category) => (
                            <li
                              key={
                                category.slug
                              }
                            >
                              <Link
                                href={`/tools/${category.slug}`}
                                onClick={() =>
                                  setOpenMenu(
                                    null
                                  )
                                }
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#F0F5FF] hover:text-[#1769E0]"
                              >
                                {/* Simple Icon */}
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E7F0FF] text-xs font-bold text-[#1769E0]">
                                  {category.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>

                                <span className="truncate font-semibold">
                                  {
                                    category.name
                                  }
                                </span>
                              </Link>
                            </li>
                          )
                        )}

                      </ul>
                    </div>
                  ) : (
                    <div className="py-5 text-center">
                      <p className="text-xs text-slate-500">
                        No categories
                        available.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        /* =====================================================
           NORMAL NAVIGATION LINKS
        ===================================================== */

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
              item.label === "Home"
                ? "bg-[#E7F0FF] text-[#1769E0]"
                : "text-[#52627A] hover:bg-[#F2F6FC] hover:text-[#1769E0]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}