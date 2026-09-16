import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function btn(variant: "primary" | "secondary" | "ghost" = "primary") {
  const base = "inline-flex items-center justify-center rounded-full px-5 py-2.75 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";
  return cn(base, {
    "bg-[var(--brand-primary)] text-white shadow-[0_12px_25px_rgba(29,189,120,0.22)] hover:-translate-y-0.5 hover:bg-[var(--brand-secondary)]": variant === "primary",
    "border border-[var(--border)] bg-white text-[var(--foreground)] shadow-[0_8px_20px_rgba(17,42,33,0.04)] hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/35 hover:bg-[var(--surface-alt)]": variant === "secondary",
    "text-[var(--muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--foreground)]": variant === "ghost",
  });
}

export function card(className?: string) {
  return cn(
    "rounded-[28px] border border-emerald-200 bg-[#edfaf3] p-6 shadow-[0_18px_42px_rgba(17,42,33,0.08)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#1dbd78] hover:bg-[#e6f7ee] hover:shadow-[0_24px_48px_rgba(29,189,120,0.12)]",
    className,
  );
}

export const CATEGORY_ACCENTS: Record<string, { badge: string; text: string; ring: string }> = {
  pdf: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  ai: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  image: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  developer: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  text: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  calculators: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  seo: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  converters: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  color: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
  internet: { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" },
};

export function categoryAccent(slug: string) {
  return CATEGORY_ACCENTS[slug] ?? { badge: "bg-emerald-50 text-emerald-700", text: "text-[var(--foreground)]", ring: "hover:border-emerald-300" };
}

export const inputClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--muted)] focus:border-[var(--pink)] focus:ring-4 focus:ring-[var(--pink-soft)]";
