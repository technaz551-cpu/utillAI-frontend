



import Link from "next/link";

import {
  ArrowUpRight,
  ChevronRight,
  Code2,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import { fetchCategories } from "@/lib/api";

type FooterCategory = {
  slug: string;
  name: string;
};

async function getFooterCategories(): Promise<FooterCategory[]> {
  try {
    const data = await fetchCategories();

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null,
      )
      .map((category) => ({
        slug:
          typeof category.slug === "string"
            ? category.slug.trim()
            : "",
        name:
          typeof category.name === "string"
            ? category.name.trim()
            : "",
      }))
      .filter(
        (category) =>
          category.slug !== "" &&
          category.name !== "",
      );
  } catch (error) {
    console.error(
      "Failed to load footer categories:",
      error,
    );

    return [];
  }
}

const quickLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "All Tools",
    href: "/tools",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const featuredTools = [
  {
    name: "PDF Tools",
    description: "Edit, merge and convert",
    href: "/tools/pdf",
    icon: FileText,
  },
  {
    name: "Image Tools",
    description: "Resize, convert and optimize",
    href: "/tools/image",
    icon: ImageIcon,
  },
  {
    name: "Developer",
    description: "Fast utility tools",
    href: "/tools/developer",
    icon: Code2,
  },
  {
    name: "AI Tools",
    description: "Smart productivity tools",
    href: "/tools/ai",
    icon: WandSparkles,
  },
];

const socialLinks = [
  {
    icon: Globe,
    href: "https://utilai.com",
    label: "Website",
  },
  {
    icon: MessageCircle,
    href: "/contact",
    label: "Contact",
  },
];

export async function Footer() {
  const categories = await getFooterCategories();

  return (
    <footer className="relative mt-16 w-full overflow-hidden bg-slate-950 text-white sm:mt-20">

      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(white 0.8px, transparent 0.8px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* =========================================================
          FEATURED TOOLS
      ========================================================= */}

      <div className="relative border-b border-white/10 bg-slate-900/80">

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          {featuredTools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.name}
                href={tool.href}
                className={`group relative flex min-w-0 items-center gap-4 px-4 py-5 transition-colors duration-200 hover:bg-white/[0.04] sm:px-5 ${
                  index > 0
                    ? "border-t border-white/10 sm:border-l sm:border-t-0"
                    : ""
                }`}
              >
                <span className="absolute inset-x-0 bottom-0 h-0 bg-blue-500 transition-all duration-200 group-hover:h-0.5" />

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-blue-400 transition-all duration-200 group-hover:border-blue-500/40 group-hover:bg-blue-500 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {tool.name}
                  </span>

                  <span className="mt-1 block truncate text-xs text-slate-400">
                    {tool.description}
                  </span>
                </span>

                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-blue-400" />
              </Link>
            );
          })}

        </div>
      </div>

      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

        <div className="grid min-w-0 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1.25fr] lg:gap-12">

          {/* =====================================================
              BRAND
          ===================================================== */}

          <div className="min-w-0">

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                U
              </span>

              <span className="text-2xl font-bold tracking-tight text-white">
                Util
                <span className="text-blue-400">
                  AI
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              A growing collection of practical digital
              tools designed to make everyday work faster,
              simpler, and more productive.
            </p>

            {/* Feature badges */}

            <div className="mt-5 flex flex-wrap gap-2">

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                <Zap className="h-3.5 w-3.5 text-blue-400" />
                Fast
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                Simple
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                Smart
              </span>

            </div>

            {/* Social */}

            <div className="mt-6 flex gap-2">

              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-500 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}

            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ===================================================== */}

          <div className="min-w-0">

            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              Quick Links
            </h3>

            <nav className="space-y-1">

              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-1 py-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}

                  <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-blue-400" />
                </Link>
              ))}

            </nav>
          </div>

          {/* =====================================================
              CATEGORIES
          ===================================================== */}

          <div className="min-w-0">

            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              Categories
            </h3>

            <nav className="space-y-1">

              {categories.length > 0 ? (
                categories.slice(0, 7).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/tools/${category.slug}`}
                    className="group flex items-center gap-1 py-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="truncate">
                      {category.name}
                    </span>

                    <ChevronRight className="h-3 w-3 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-blue-400" />
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/tools/pdf"
                    className="group flex items-center gap-1 py-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    PDF Tools
                    <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-blue-400" />
                  </Link>

                  <Link
                    href="/tools/image"
                    className="group flex items-center gap-1 py-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    Image Tools
                    <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-blue-400" />
                  </Link>

                  <Link
                    href="/tools/developer"
                    className="group flex items-center gap-1 py-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    Developer Tools
                    <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-blue-400" />
                  </Link>
                </>
              )}

            </nav>
          </div>

          {/* =====================================================
              STAY CONNECTED
          ===================================================== */}

          <div className="min-w-0">

            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              Stay Connected
            </h3>

            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Get occasional updates about new tools,
              features, and useful improvements.
            </p>

            {/* Newsletter */}

            <form className="mt-5 flex min-w-0 items-center rounded-2xl border border-white/10 bg-white p-1.5">

              <Mail className="ml-2 h-4 w-4 shrink-0 text-slate-400" />

              <input
                type="email"
                placeholder="you@email.com"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600"
              >
                <Send className="h-4 w-4" />
              </button>

            </form>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              No spam. Only useful updates.
            </p>

            {/* Contact */}

            <Link
              href="/contact"
              className="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500 hover:text-white"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />

              <span>Contact Us</span>

              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </Link>

          </div>
        </div>

        {/* =======================================================
            BOTTOM BAR
        ======================================================= */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm sm:mt-12 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 flex-wrap items-center gap-3 text-slate-500">

            <span>
              © {new Date().getFullYear()} UtilAI.
              All rights reserved.
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>

          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">

            <Link
              href="/privacy"
              className="text-slate-500 transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-slate-500 transition-colors hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="text-slate-500 transition-colors hover:text-white"
            >
              Contact
            </Link>

          </div>

        </div>
      </div>
    </footer>
  );
}