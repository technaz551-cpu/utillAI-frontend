"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { btn } from "@/lib/utils";

type MobileCategory = {
  slug: string;
  label: string;
  tools: Array<{ slug: string; name: string; category_slug?: string }>;
};

type Props = {
  navItems: Array<{ label: string; href: string }>;
  categories: MobileCategory[];
};

export function MobileNav({ navItems, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const close = () => {
    if (drawerRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    setOpen(false);
  };

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open navigation" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_10px_22px_rgba(9,25,37,0.12)] lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      {open && <button type="button" aria-label="Close navigation" onClick={close} className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-[2px] lg:hidden" />}

      <aside ref={drawerRef} id="mobile-navigation" className={`fixed bottom-0 left-0 top-0 z-[70] flex w-[min(88vw,360px)] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-[20px_0_60px_rgba(0,0,0,0.2)] transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`} aria-hidden={!open} inert={!open ? true : undefined}>
        <div className="flex h-[5.9rem] shrink-0 items-center justify-between border-b border-[var(--border)] px-5">
          <Link href="/" onClick={close} className="flex items-center gap-3">
            <span className="brand-mark !h-10 !w-10 !rounded-xl !text-lg">T</span>
            <span className="text-xl font-black tracking-[-0.06em] text-[var(--foreground)]">UtilAI</span>
          </Link>
          <button type="button" onClick={close} aria-label="Close navigation" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--brand-primary)] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="flex flex-col gap-1">
            {navItems.filter((item) => item.label !== "Tools" && item.label !== "Categories").map((item) => (
              <Link key={item.label} href={item.href} onClick={close} className="rounded-2xl px-4 py-3 text-base font-semibold text-[var(--foreground)] transition hover:bg-[var(--brand-primary)] hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Tools by category</p>
            <div className="mt-2 flex flex-col gap-1">
              {categories.map((category) => (
                <div key={category.slug} className="rounded-2xl bg-[var(--surface-alt)]">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/tools/${category.slug}`} onClick={close} className="min-w-0 flex-1 px-4 py-3 text-sm font-bold text-[var(--foreground)] hover:text-[var(--brand-primary)]">
                      {category.label}
                    </Link>
                    <button type="button" aria-label={`Show ${category.label} tools`} onClick={() => setExpandedCategory(expandedCategory === category.slug ? null : category.slug)} className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)] hover:bg-[var(--brand-primary)] hover:text-white">
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategory === category.slug ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {expandedCategory === category.slug && (
                    <ul className="space-y-1 border-t border-[var(--border)] px-4 py-3">
                      {category.tools.slice(0, 8).map((tool) => (
                        <li key={tool.slug} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]" />
                          <Link href={`/tools/${tool.category_slug || category.slug}/${tool.slug}`} onClick={close} className="hover:text-[var(--brand-primary)] hover:underline">
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Link href="/login" onClick={close} className={btn("primary") + " mt-6 w-full !justify-center !rounded-2xl !py-3"}>Sign in</Link>
        </nav>
      </aside>
    </>
  );
}
