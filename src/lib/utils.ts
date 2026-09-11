import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function btn(variant: "primary" | "secondary" | "ghost" = "primary") {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none";
  return cn(base, {
    "bg-[var(--accent)] text-white shadow-sm shadow-blue-500/20 hover:brightness-110": variant === "primary",
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]": variant === "secondary",
    "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5": variant === "ghost",
  });
}

export function card(className?: string) {
  return cn(
    "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-sm shadow-black/20 backdrop-blur-sm",
    className,
  );
}

export const CATEGORY_ACCENTS: Record<string, { badge: string; text: string; ring: string }> = {
  pdf: { badge: "bg-rose-500/10 text-rose-300", text: "text-rose-300", ring: "hover:border-rose-500/40" },
  ai: { badge: "bg-indigo-500/10 text-indigo-300", text: "text-indigo-300", ring: "hover:border-indigo-500/40" },
  image: { badge: "bg-sky-500/10 text-sky-300", text: "text-sky-300", ring: "hover:border-sky-500/40" },
  developer: { badge: "bg-violet-500/10 text-violet-300", text: "text-violet-300", ring: "hover:border-violet-500/40" },
  text: { badge: "bg-amber-500/10 text-amber-300", text: "text-amber-300", ring: "hover:border-amber-500/40" },
  calculators: { badge: "bg-emerald-500/10 text-emerald-300", text: "text-emerald-300", ring: "hover:border-emerald-500/40" },
  seo: { badge: "bg-fuchsia-500/10 text-fuchsia-300", text: "text-fuchsia-300", ring: "hover:border-fuchsia-500/40" },
  converters: { badge: "bg-orange-500/10 text-orange-300", text: "text-orange-300", ring: "hover:border-orange-500/40" },
  color: { badge: "bg-pink-500/10 text-pink-300", text: "text-pink-300", ring: "hover:border-pink-500/40" },
  internet: { badge: "bg-cyan-500/10 text-cyan-300", text: "text-cyan-300", ring: "hover:border-cyan-500/40" },
};

export function categoryAccent(slug: string) {
  return CATEGORY_ACCENTS[slug] ?? { badge: "bg-blue-500/10 text-blue-300", text: "text-blue-300", ring: "hover:border-blue-500/40" };
}

export const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[#0d121c] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";
