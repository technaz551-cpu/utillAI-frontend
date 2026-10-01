// import Link from "next/link";
// import {
//   ChevronRight,
//   Globe,
//   Mail,
//   MessageCircle,
//   Send,
//   ShieldCheck,
//   Sparkles,
//   Zap,
// } from "lucide-react";

// import { fetchCategories } from "@/lib/api";

// type FooterCategory = {
//   slug: string;
//   name: string;
// };

// async function getFooterCategories(): Promise<FooterCategory[]> {
//   try {
//     const data = await fetchCategories();

//     if (!Array.isArray(data)) {
//       return [];
//     }

//     return data
//       .filter(
//         (item): item is Record<string, unknown> =>
//           typeof item === "object" && item !== null,
//       )
//       .map((category) => ({
//         slug:
//           typeof category.slug === "string"
//             ? category.slug.trim()
//             : "",
//         name:
//           typeof category.name === "string"
//             ? category.name.trim()
//             : "",
//       }))
//       .filter(
//         (category) =>
//           category.slug !== "" &&
//           category.name !== "",
//       );
//   } catch (error) {
//     console.error(
//       "Failed to load footer categories:",
//       error,
//     );

//     return [];
//   }
// }

// const quickLinks = [
//   { label: "Home", href: "/" },
//   { label: "All Tools", href: "/tools" },
//   { label: "Categories", href: "/categories" },
//   { label: "Pricing", href: "/pricing" },
//   { label: "About", href: "/about" },
//   { label: "Contact", href: "/contact" },
// ];

// const socialLinks = [
//   {
//     icon: Globe,
//     href: "https://utilai.com",
//     label: "Website",
//   },
//   {
//     icon: MessageCircle,
//     href: "/contact",
//     label: "Contact",
//   },
// ];

// export async function Footer() {
//   const categories = await getFooterCategories();

//   return (
//     <footer className="relative mt-20 w-full overflow-hidden bg-slate-950 text-slate-300">
//       {/* =========================================================
//           BACKGROUND EFFECTS
//       ========================================================= */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/15 blur-[120px]" />
//         <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
        
//         {/* Subtle grid pattern */}
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "24px 24px",
//           }}
//         />
//       </div>

//       {/* Top Border Accent */}
//       <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

//       {/* =========================================================
//           MAIN FOOTER CONTENT
//       ========================================================= */}
//       <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
//         <div className="grid min-w-0 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
//           {/* =====================================================
//               BRAND COLUMN (Span 4)
//           ===================================================== */}
//           <div className="min-w-0 lg:col-span-4">
//             <Link
//               href="/"
//               className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
//             >
//               <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
//                 U
//               </span>
//               <span className="text-2xl font-bold tracking-tight text-white">
//                 Util<span className="text-blue-400">AI</span>
//               </span>
//             </Link>

//             <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
//               A growing collection of practical digital tools designed to make everyday work faster, simpler, and more productive.
//             </p>

//             {/* Feature Badges */}
//             <div className="mt-5 flex flex-wrap gap-2">
//               <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur">
//                 <Zap className="h-3.5 w-3.5 text-blue-400" />
//                 Fast
//               </span>
//               <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur">
//                 <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
//                 Simple
//               </span>
//               <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur">
//                 <Sparkles className="h-3.5 w-3.5 text-blue-400" />
//                 Smart
//               </span>
//             </div>

//             {/* Social Icons */}
//             <div className="mt-6 flex gap-2">
//               {socialLinks.map((social) => {
//                 const Icon = social.icon;

//                 return (
//                   <Link
//                     key={social.label}
//                     href={social.href}
//                     aria-label={social.label}
//                     className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
//                   >
//                     <Icon className="h-4 w-4" />
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>

//           {/* =====================================================
//               QUICK LINKS (Span 2)
//           ===================================================== */}
//           <div className="min-w-0 lg:col-span-2">
//             <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
//               Quick Links
//             </h3>
//             <nav className="space-y-2">
//               {quickLinks.map((link) => (
//                 <Link
//                   key={link.label}
//                   href={link.href}
//                   className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
//                 >
//                   <span>{link.label}</span>
//                   <ChevronRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 text-blue-400" />
//                 </Link>
//               ))}
//             </nav>
//           </div>

//           {/* =====================================================
//               CATEGORIES (Span 2)
//           ===================================================== */}
//           <div className="min-w-0 lg:col-span-2">
//             <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
//               Categories
//             </h3>
//             {/* <nav className="space-y-2">
//               {categories.length > 0 ? (
//                 categories.slice(0, 6).map((category) => (
//                   <Link
//                     key={category.slug}
//                     href={`/tools/${category.slug}`}
//                     className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
//                   >
//                     <span className="truncate">{category.name}</span>
//                     <ChevronRight className="ml-1 h-3 w-3 shrink-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 text-blue-400" />
//                   </Link>
//                 ))
//               ) : (
//                 <>
//                   <Link
//                     href="/tools/pdf"
//                     className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
//                   >
//                     <span>PDF Tools</span>
//                     <ChevronRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 text-blue-400" />
//                   </Link>
//                   <Link
//                     href="/tools/image"
//                     className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
//                   >
//                     <span>Image Tools</span>
//                     <ChevronRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 text-blue-400" />
//                   </Link>
//                   <Link
//                     href="/tools/developer"
//                     className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
//                   >
//                     <span>Developer Tools</span>
//                     <ChevronRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 text-blue-400" />
//                   </Link>
//                 </>
//               )}
//             </nav> */}

// <nav className="space-y-2">
//   {(categories.length > 0
//     ? categories.slice(0, 6).map((category) => category.name)
//     : ["PDF Tools", "Image Tools", "Developer Tools"]
//   ).map((name, index) => (
//     <Link
//       key={`${name}-${index}`}
//       href="/categories"
//       className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
//     >
//       <span className="truncate">{name}</span>
//       <ChevronRight className="ml-1 h-3 w-3 shrink-0 text-blue-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
//     </Link>
//   ))}
// </nav>



//           </div>

//           {/* =====================================================
//               NEWSLETTER / STAY CONNECTED (Span 4)
//           ===================================================== */}
//           <div className="min-w-0 lg:col-span-4">
//             <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
//               Stay Connected
//             </h3>
//             <p className="text-sm leading-relaxed text-slate-400">
//               Get occasional updates about new tools, features, and useful improvements.
//             </p>

//             {/* Newsletter Form */}
//             <form className="mt-4 flex min-w-0 items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
//               <Mail className="ml-2.5 h-4 w-4 shrink-0 text-slate-500" />
//               <input
//                 type="email"
//                 placeholder="you@email.com"
//                 className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-100 outline-none placeholder:text-slate-500"
//               />
//               <button
//                 type="submit"
//                 aria-label="Subscribe"
//                 className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500"
//               >
//                 <Send className="h-3.5 w-3.5" />
//               </button>
//             </form>
//             <p className="mt-2 text-xs text-slate-500">
//               No spam. Unsubscribe anytime.
//             </p>
//           </div>
//         </div>

//         {/* =======================================================
//             BOTTOM BAR
//         ======================================================= */}
//         <div className="mt-12 flex flex-col gap-4 border-t border-slate-800/80 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-wrap items-center gap-3 text-slate-500">
//             <span>
//               © {new Date().getFullYear()} UtilAI. All rights reserved.
//             </span>
//             <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
//             <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
//               All systems operational
//             </span>
//           </div>

//           <div className="flex flex-wrap items-center gap-5 text-slate-400">
//             <Link
//               href="/privacy"
//               className="transition-colors hover:text-white"
//             >
//               Privacy Policy
//             </Link>
//             <Link
//               href="/terms"
//               className="transition-colors hover:text-white"
//             >
//               Terms of Service
//             </Link>
//             <Link
//               href="/contact"
//               className="transition-colors hover:text-white"
//             >
//               Contact
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



import Link from "next/link";
import {
  ChevronRight,
  Globe,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
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
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Shown only when the categories API is unavailable.
const fallbackCategories: FooterCategory[] = [
  { slug: "pdf", name: "PDF Tools" },
  { slug: "image", name: "Image Tools" },
  { slug: "developer", name: "Developer Tools" },
];

// If your category page lives at a different URL, change only this line.
const categoryHref = (slug: string) => `/categories/${slug}`;

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
  const footerCategories =
    categories.length > 0 ? categories.slice(0, 6) : fallbackCategories;

  return (
    <footer className="relative mt-20 w-full overflow-hidden bg-slate-950 text-slate-300">
      {/* =========================================================
          BACKGROUND EFFECTS
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Top Border Accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* =========================================================
          MAIN FOOTER CONTENT
      ========================================================= */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid min-w-0 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* =====================================================
              BRAND COLUMN (Span 4)
          ===================================================== */}
          <div className="min-w-0 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                U
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                Util<span className="text-blue-400">AI</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              A growing collection of practical digital tools designed to make everyday work faster, simpler, and more productive.
            </p>

            {/* Feature Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur">
                <Zap className="h-3.5 w-3.5 text-blue-400" />
                Fast
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                Simple
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                Smart
              </span>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS (Span 2)
          ===================================================== */}
          <div className="min-w-0 lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Quick Links
            </h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 text-blue-400" />
                </Link>
              ))}
            </nav>
          </div>

          {/* =====================================================
              CATEGORIES SECTION - REMOVED TEMPORARILY
              Uncomment this block if you want to restore it later.
          ===================================================== */}
          {/* <div className="min-w-0 lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Categories
            </h3>
            <nav className="space-y-2">
              {footerCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={categoryHref(category.slug)}
                  className="group flex items-center text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="truncate">{category.name}</span>
                  <ChevronRight className="ml-1 h-3 w-3 shrink-0 text-blue-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div> */}

          {/* =====================================================
              NEWSLETTER / STAY CONNECTED (Span 5)
          ===================================================== */}
          <div className="min-w-0 lg:col-span-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Stay Connected
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Get occasional updates about new tools, features, and useful improvements.
            </p>

            {/* Newsletter Form */}
            <form className="mt-4 flex min-w-0 items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
              <Mail className="ml-2.5 h-4 w-4 shrink-0 text-slate-500" />
              <input
                type="email"
                placeholder="you@email.com"
                className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            <p className="mt-2 text-xs text-slate-500">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* =======================================================
            BOTTOM BAR
        ======================================================= */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800/80 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-slate-500">
            <span>
              © {new Date().getFullYear()} UtilAI. All rights reserved.
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-400">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}