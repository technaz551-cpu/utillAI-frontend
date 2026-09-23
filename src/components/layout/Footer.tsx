// // import Link from "next/link";
// // import {
// //   ArrowUpRight,
// //   Sparkles,
// //   Mail,
// //   ShieldCheck,
// //   Zap,
// //   Github,
// //   Globe,
// //   MessageCircle,
// //   Send,
// // } from "lucide-react";
// // import { fetchCategories } from "@/lib/api";

// // type FooterCategory = {
// //   slug: string;
// //   name: string;
// // };

// // /* =========================================================
// //    SAFELY NORMALIZE CATEGORIES FROM THE API

// //    fetchCategories() is only typed as returning
// //    { slug, name }[] — that's a TypeScript-only guarantee.
// //    At runtime the API can return missing fields, nulls, or
// //    nested objects, and rendering those directly as {category.name}
// //    crashes React with "Objects are not valid as a React child".
// //    This filters out anything that isn't a real string pair.
// // ========================================================= */
// // async function getFooterCategories(): Promise<FooterCategory[]> {
// //   try {
// //     const data = await fetchCategories();

// //     if (!Array.isArray(data)) {
// //       return [];
// //     }

// //     const normalized: FooterCategory[] = [];

// //     for (const raw of data) {
// //       if (typeof raw !== "object" || raw === null) {
// //         continue;
// //       }

// //       const category = raw as Record<string, unknown>;

// //       const slug =
// //         typeof category.slug === "string" && category.slug.trim() !== ""
// //           ? category.slug
// //           : null;

// //       const name =
// //         typeof category.name === "string" && category.name.trim() !== ""
// //           ? category.name
// //           : null;

// //       if (!slug || !name) {
// //         continue;
// //       }

// //       normalized.push({ slug, name });
// //     }

// //     return normalized;
// //   } catch (error) {
// //     console.error("Failed to load footer categories:", error);
// //     return [];
// //   }
// // }

// // const socialLinks = [
// //   { icon: Github, href: "https://github.com", label: "GitHub" },
// //   { icon: Globe, href: "https://utilai.com", label: "Website" },
// //   { icon: MessageCircle, href: "/contact", label: "Community" },
// // ];

// // export async function Footer() {
// //   const categories = await getFooterCategories();

// //   return (
// //     <footer className="relative mt-20 overflow-hidden border-t border-slate-200 bg-white">

// //       {/* ================= SOFT BACKGROUND ================= */}
// //       <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
// //       <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
// //       <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1769E0]/25 to-transparent" />

// //       <div className="section-shell relative z-10 py-14 sm:py-16 lg:py-20">

// //         {/* ================= CTA ================= */}
// //         <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-10 lg:px-12">

// //           {/* subtle dotted grid for a premium texture */}
// //           <div
// //             className="pointer-events-none absolute inset-0 opacity-[0.4]"
// //             style={{
// //               backgroundImage:
// //                 "radial-gradient(circle, rgba(23,105,224,0.14) 1px, transparent 1px)",
// //               backgroundSize: "18px 18px",
// //               maskImage:
// //                 "linear-gradient(to bottom right, black, transparent 70%)",
// //             }}
// //           />

// //           <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#1769E0]/10 blur-3xl" />
// //           <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#1769E0]/10 blur-3xl" />

// //           <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

// //             <div className="max-w-2xl">

// //               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#1769E0] shadow-sm backdrop-blur">
// //                 <Sparkles className="h-3.5 w-3.5" />
// //                 UTILAI
// //               </div>

// //               <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[2.25rem]">
// //                 Everything you need, all in one place.
// //               </h2>

// //               <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
// //                 Simple and practical tools for PDFs, images, developers,
// //                 text, productivity, and more — built to feel effortless.
// //               </p>

// //             </div>

// //             <Link
// //               href="/tools"
// //               className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1769E0] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(23,105,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_16px_40px_rgba(23,105,224,0.45)]"
// //             >
// //               Explore Tools
// //               <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
// //             </Link>

// //           </div>
// //         </div>


// //         {/* ================= FOOTER CONTENT ================= */}
// //         <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1.1fr]">

// //           {/* ================= BRAND ================= */}
// //           <div>

// //             <Link
// //               href="/"
// //               className="group inline-flex items-center gap-3"
// //             >
// //               <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1769E0] text-lg font-black text-white shadow-md shadow-blue-500/15 transition-transform duration-300 group-hover:scale-105">
// //                 U
// //               </span>

// //               <span className="text-2xl font-black tracking-[-0.05em] text-slate-900">
// //                 Util<span className="text-[#1769E0]">AI</span>
// //               </span>
// //             </Link>

// //             <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
// //               A growing collection of practical digital tools designed to
// //               make everyday work faster, simpler, and more productive.
// //             </p>

// //             {/* Small Feature Pills */}
// //             <div className="mt-5 flex flex-wrap gap-2">

// //               <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60">
// //                 <Zap className="h-3.5 w-3.5 text-[#1769E0]" />
// //                 Fast
// //               </span>

// //               <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60">
// //                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
// //                 Simple
// //               </span>

// //               <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60">
// //                 <Sparkles className="h-3.5 w-3.5 text-[#1769E0]" />
// //                 AI Powered
// //               </span>

// //             </div>

// //             {/* Social Icons */}
// //             <div className="mt-6 flex items-center gap-2.5">
// //               {socialLinks.map(({ icon: Icon, href, label }) => (
// //                 <Link
// //                   key={label}
// //                   href={href}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   aria-label={label}
// //                   className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#1769E0] hover:text-white hover:shadow-[0_8px_20px_rgba(23,105,224,0.3)]"
// //                 >
// //                   <Icon className="h-4 w-4" />
// //                 </Link>
// //               ))}
// //             </div>
// //           </div>


// //           {/* ================= QUICK LINKS ================= */}
// //           <div>

// //             <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
// //               Quick Links
// //             </p>

// //             <div className="mt-5 flex flex-col gap-3 text-sm">

// //               <Link
// //                 href="/"
// //                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
// //               >
// //                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
// //                   Home
// //                 </span>
// //               </Link>

// //               <Link
// //                 href="/tools"
// //                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
// //               >
// //                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
// //                   All Tools
// //                 </span>
// //               </Link>

// //               <Link
// //                 href="/categories"
// //                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
// //               >
// //                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
// //                   Categories
// //                 </span>
// //               </Link>

// //               <Link
// //                 href="/pricing"
// //                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
// //               >
// //                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
// //                   Pricing
// //                 </span>
// //               </Link>

// //               <Link
// //                 href="/about"
// //                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
// //               >
// //                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
// //                   About UtilAI
// //                 </span>
// //               </Link>

// //               <Link
// //                 href="/contact"
// //                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
// //               >
// //                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
// //                   Contact
// //                 </span>
// //               </Link>

// //             </div>
// //           </div>


// //           {/* ================= CATEGORIES ================= */}
// //           <div>

// //             <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
// //               Categories
// //             </p>

// //             <div className="mt-5 flex flex-col gap-3 text-sm">

// //               {categories.length > 0 ? (
// //                 categories.slice(0, 6).map((category) => (
// //                   <Link
// //                     key={category.slug}
// //                     href={`/tools/${category.slug}`}
// //                     className="group flex w-fit items-center gap-1.5 text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
// //                   >
// //                     {category.name}

// //                     <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
// //                   </Link>
// //                 ))
// //               ) : (
// //                 <>
// //                   <Link
// //                     href="/tools"
// //                     className="w-fit text-slate-600 hover:text-[#1769E0]"
// //                   >
// //                     Developer Tools
// //                   </Link>

// //                   <Link
// //                     href="/tools"
// //                     className="w-fit text-slate-600 hover:text-[#1769E0]"
// //                   >
// //                     PDF Tools
// //                   </Link>

// //                   <Link
// //                     href="/tools"
// //                     className="w-fit text-slate-600 hover:text-[#1769E0]"
// //                   >
// //                     Image Tools
// //                   </Link>

// //                   <Link
// //                     href="/tools"
// //                     className="w-fit text-slate-600 hover:text-[#1769E0]"
// //                   >
// //                     AI Tools
// //                   </Link>
// //                 </>
// //               )}

// //             </div>
// //           </div>


// //           {/* ================= STAY CONNECTED / NEWSLETTER ================= */}
// //           <div>

// //             <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
// //               Stay Connected
// //             </p>

// //             <div className="mt-5">

// //               <p className="text-sm leading-6 text-slate-500">
// //                 Get occasional updates on new tools and features. No spam,
// //                 ever.
// //               </p>

// //               {/* Premium newsletter input */}
// //               <form className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4 transition-colors duration-200 focus-within:border-[#1769E0]/50 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(23,105,224,0.08)]">
// //                 <input
// //                   type="email"
// //                   placeholder="you@email.com"
// //                   className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
// //                 />
// //                 <button
// //                   type="submit"
// //                   aria-label="Subscribe"
// //                   className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1769E0] text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
// //                 >
// //                   <Send className="h-4 w-4" />
// //                 </button>
// //               </form>

// //               <Link
// //                 href="/contact"
// //                 className="group mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1769E0] hover:shadow-sm"
// //               >
// //                 <Mail className="h-4 w-4 text-[#1769E0]" />

// //                 Contact Us

// //                 <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
// //               </Link>

// //             </div>
// //           </div>

// //         </div>


// //         {/* ================= BOTTOM BAR ================= */}
// //         <div className="mt-14 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

// //           <div className="flex items-center gap-4">
// //             <p>
// //               © {new Date().getFullYear()} UtilAI. All rights reserved.
// //             </p>

// //             <span className="hidden items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
// //               <span className="relative flex h-1.5 w-1.5">
// //                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
// //                 <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
// //               </span>
// //               All systems operational
// //             </span>
// //           </div>

// //           <div className="flex flex-wrap items-center gap-4">

// //             <Link
// //               href="/privacy"
// //               className="transition-colors duration-200 hover:text-[#1769E0]"
// //             >
// //               Privacy
// //             </Link>

// //             <Link
// //               href="/terms"
// //               className="transition-colors duration-200 hover:text-[#1769E0]"
// //             >
// //               Terms
// //             </Link>

// //             <Link
// //               href="/contact"
// //               className="transition-colors duration-200 hover:text-[#1769E0]"
// //             >
// //               Contact
// //             </Link>

// //           </div>

// //         </div>

// //       </div>
// //     </footer>
// //   );
// // }


// import Link from "next/link";
// import {
//   ArrowUpRight,
//   Sparkles,
//   Mail,
//   ShieldCheck,
//   Zap,
//   // Github,
//   Globe,
//   MessageCircle,
//   Send,
// } from "lucide-react";
// import { fetchCategories } from "@/lib/api";

// type FooterCategory = {
//   slug: string;
//   name: string;
// };

// /* =========================================================
//    SAFELY NORMALIZE CATEGORIES FROM THE API

//    fetchCategories() is only typed as returning
//    { slug, name }[] — that's a TypeScript-only guarantee.
//    At runtime the API can return missing fields, nulls, or
//    nested objects, and rendering those directly as {category.name}
//    crashes React with "Objects are not valid as a React child".
//    This filters out anything that isn't a real string pair.
// ========================================================= */
// async function getFooterCategories(): Promise<FooterCategory[]> {
//   try {
//     const data = await fetchCategories();

//     if (!Array.isArray(data)) {
//       return [];
//     }

//     const normalized: FooterCategory[] = [];

//     for (const raw of data) {
//       if (typeof raw !== "object" || raw === null) {
//         continue;
//       }

//       const category = raw as Record<string, unknown>;

//       const slug =
//         typeof category.slug === "string" && category.slug.trim() !== ""
//           ? category.slug
//           : null;

//       const name =
//         typeof category.name === "string" && category.name.trim() !== ""
//           ? category.name
//           : null;

//       if (!slug || !name) {
//         continue;
//       }

//       normalized.push({ slug, name });
//     }

//     return normalized;
//   } catch (error) {
//     console.error("Failed to load footer categories:", error);
//     return [];
//   }
// }

// const socialLinks = [
//   // { icon: Github, href: "https://github.com", label: "GitHub" },
//   { icon: Globe, href: "https://utilai.com", label: "Website" },
//   { icon: MessageCircle, href: "/contact", label: "Community" },
// ];

// export async function Footer() {
//   const categories = await getFooterCategories();

//   return (
//     <footer className="relative mt-20 overflow-hidden border-t border-slate-200 bg-white">

//       {/* ================= SOFT BACKGROUND ================= */}
//       <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
//       <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1769E0]/25 to-transparent" />

//       <div className="section-shell relative z-10 py-14 sm:py-16 lg:py-20">

//         {/* ================= CTA ================= */}
//         <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-10 lg:px-12">

//           {/* subtle dotted grid for a premium texture */}
//           <div
//             className="pointer-events-none absolute inset-0 opacity-[0.4]"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle, rgba(23,105,224,0.14) 1px, transparent 1px)",
//               backgroundSize: "18px 18px",
//               maskImage:
//                 "linear-gradient(to bottom right, black, transparent 70%)",
//             }}
//           />

//           <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#1769E0]/10 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#1769E0]/10 blur-3xl" />

//           <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
// {/* 
//             <div className="max-w-2xl">

//               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#1769E0] shadow-sm backdrop-blur">
//                 <Sparkles className="h-3.5 w-3.5" />
//                 UTILAI
//               </div>

//               <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[2.25rem]">
//                 Everything you need, all in one place.
//               </h2>

//               <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
//                 Simple and practical tools for PDFs, images, developers,
//                 text, productivity, and more — built to feel effortless.
//               </p>

//             </div> */}

//             {/* <Link
//               href="/tools"
//               className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1769E0] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(23,105,224,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_16px_40px_rgba(23,105,224,0.45)]"
//             >
//               Explore Tools
//               <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
//             </Link> */}

//           </div>
//         </div>


//         {/* ================= FOOTER CONTENT ================= */}
//         <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1.1fr]">

//           {/* ================= BRAND ================= */}
//           <div>

//             <Link
//               href="/"
//               className="group inline-flex items-center gap-3"
//             >
//               <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1769E0] text-lg font-black text-white shadow-md shadow-blue-500/15 transition-transform duration-300 group-hover:scale-105">
//                 U
//               </span>

//               <span className="text-2xl font-black tracking-[-0.05em] text-slate-900">
//                 Util<span className="text-[#1769E0]">AI</span>
//               </span>
//             </Link>

//             <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
//               A growing collection of practical digital tools designed to
//               make everyday work faster, simpler, and more productive.
//             </p>

//             {/* Small Feature Pills */}
//             <div className="mt-5 flex flex-wrap gap-2">

//               <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60">
//                 <Zap className="h-3.5 w-3.5 text-[#1769E0]" />
//                 Fast
//               </span>

//               <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60">
//                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
//                 Simple
//               </span>

//               <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60">
//                 <Sparkles className="h-3.5 w-3.5 text-[#1769E0]" />
//                 AI Powered
//               </span>

//             </div>

//             {/* Social Icons */}
//             <div className="mt-6 flex items-center gap-2.5">
//               {socialLinks.map(({ icon: Icon, href, label }) => {
//                 // Defensive guard: if a lucide-react icon name doesn't
//                 // exist in the installed package version, `Icon` comes
//                 // back as `undefined` and rendering it crashes the whole
//                 // page. Skip it (and warn) instead of crashing.
//                 if (!Icon) {
//                   if (process.env.NODE_ENV !== "production") {
//                     console.warn(
//                       `Footer: missing lucide-react icon for "${label}"`
//                     );
//                   }
//                   return null;
//                 }

//                 return (
//                   <Link
//                     key={label}
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={label}
//                     className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#1769E0] hover:text-white hover:shadow-[0_8px_20px_rgba(23,105,224,0.3)]"
//                   >
//                     <Icon className="h-4 w-4" />
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>


//           {/* ================= QUICK LINKS ================= */}
//           <div>

//             <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//               Quick Links
//             </p>

//             <div className="mt-5 flex flex-col gap-3 text-sm">

//               <Link
//                 href="/"
//                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
//               >
//                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
//                   Home
//                 </span>
//               </Link>

//               <Link
//                 href="/tools"
//                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
//               >
//                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
//                   All Tools
//                 </span>
//               </Link>

//               <Link
//                 href="/categories"
//                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
//               >
//                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
//                   Categories
//                 </span>
//               </Link>

//               <Link
//                 href="/pricing"
//                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
//               >
//                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
//                   Pricing
//                 </span>
//               </Link>

//               <Link
//                 href="/about"
//                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
//               >
//                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
//                   About UtilAI
//                 </span>
//               </Link>

//               <Link
//                 href="/contact"
//                 className="group w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
//               >
//                 <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-[#1769E0]/40">
//                   Contact
//                 </span>
//               </Link>

//             </div>
//           </div>


//           {/* ================= CATEGORIES ================= */}
//           <div>

//             <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//               Categories
//             </p>

//             <div className="mt-5 flex flex-col gap-3 text-sm">

//               {categories.length > 0 ? (
//                 categories.slice(0, 6).map((category) => (
//                   <Link
//                     key={category.slug}
//                     href={`/tools/${category.slug}`}
//                     className="group flex w-fit items-center gap-1.5 text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
//                   >
//                     {category.name}

//                     <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
//                   </Link>
//                 ))
//               ) : (
//                 <>
//                   <Link
//                     href="/tools"
//                     className="w-fit text-slate-600 hover:text-[#1769E0]"
//                   >
//                     Developer Tools
//                   </Link>

//                   <Link
//                     href="/tools"
//                     className="w-fit text-slate-600 hover:text-[#1769E0]"
//                   >
//                     PDF Tools
//                   </Link>

//                   <Link
//                     href="/tools"
//                     className="w-fit text-slate-600 hover:text-[#1769E0]"
//                   >
//                     Image Tools
//                   </Link>

//                   <Link
//                     href="/tools"
//                     className="w-fit text-slate-600 hover:text-[#1769E0]"
//                   >
//                     AI Tools
//                   </Link>
//                 </>
//               )}

//             </div>
//           </div>


//           {/* ================= STAY CONNECTED / NEWSLETTER ================= */}
//           <div>

//             <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//               Stay Connected
//             </p>

//             <div className="mt-5">

//               <p className="text-sm leading-6 text-slate-500">
//                 Get occasional updates on new tools and features. No spam,
//                 ever.
//               </p>

//               {/* Premium newsletter input */}
//               <form className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4 transition-colors duration-200 focus-within:border-[#1769E0]/50 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(23,105,224,0.08)]">
//                 <input
//                   type="email"
//                   placeholder="you@email.com"
//                   className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
//                 />
//                 <button
//                   type="submit"
//                   aria-label="Subscribe"
//                   className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1769E0] text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
//                 >
//                   <Send className="h-4 w-4" />
//                 </button>
//               </form>

//               <Link
//                 href="/contact"
//                 className="group mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1769E0] hover:shadow-sm"
//               >
//                 <Mail className="h-4 w-4 text-[#1769E0]" />

//                 Contact Us

//                 <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
//               </Link>

//             </div>
//           </div>

//         </div>


//         {/* ================= BOTTOM BAR ================= */}
//         <div className="mt-14 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

//           <div className="flex items-center gap-4">
//             <p>
//               © {new Date().getFullYear()} UtilAI. All rights reserved.
//             </p>

//             <span className="hidden items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
//               <span className="relative flex h-1.5 w-1.5">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
//                 <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               </span>
//               All systems operational
//             </span>
//           </div>

//           <div className="flex flex-wrap items-center gap-4">

//             <Link
//               href="/privacy"
//               className="transition-colors duration-200 hover:text-[#1769E0]"
//             >
//               Privacy
//             </Link>

//             <Link
//               href="/terms"
//               className="transition-colors duration-200 hover:text-[#1769E0]"
//             >
//               Terms
//             </Link>

//             <Link
//               href="/contact"
//               className="transition-colors duration-200 hover:text-[#1769E0]"
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
  ArrowUpRight,
  Sparkles,
  Mail,
  ShieldCheck,
  Zap,
  Globe,
  MessageCircle,
  Send,
  ChevronRight,
  Layers3,
  Command,
} from "lucide-react";
import { fetchCategories } from "@/lib/api";

type FooterCategory = {
  slug: string;
  name: string;
};

/* =========================================================
   SAFELY NORMALIZE CATEGORIES
========================================================= */

async function getFooterCategories(): Promise<FooterCategory[]> {
  try {
    const data = await fetchCategories();

    if (!Array.isArray(data)) {
      return [];
    }

    const normalized: FooterCategory[] = [];

    for (const raw of data) {
      if (typeof raw !== "object" || raw === null) {
        continue;
      }

      const category = raw as Record<string, unknown>;

      const slug =
        typeof category.slug === "string" &&
        category.slug.trim() !== ""
          ? category.slug
          : null;

      const name =
        typeof category.name === "string" &&
        category.name.trim() !== ""
          ? category.name
          : null;

      if (!slug || !name) {
        continue;
      }

      normalized.push({ slug, name });
    }

    return normalized;
  } catch (error) {
    console.error(
      "Failed to load footer categories:",
      error
    );

    return [];
  }
}

/* =========================================================
   SOCIAL LINKS
========================================================= */

const socialLinks = [
  {
    icon: Globe,
    href: "https://utilai.com",
    label: "Website",
  },
  {
    icon: MessageCircle,
    href: "/contact",
    label: "Community",
  },
];

/* =========================================================
   FOOTER
========================================================= */

export async function Footer() {
  const categories =
    await getFooterCategories();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-slate-200 bg-white">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-blue-50/70 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-50/30 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1769E0]/40 to-transparent" />
      </div>

      <div className="section-shell relative z-10 py-12 sm:py-16 lg:py-20">

        {/* =====================================================
            UNIQUE CTA CARD
        ===================================================== */}

        <div className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-slate-950 px-6 py-9 shadow-[0_24px_70px_rgba(15,23,42,0.12)] transition-all duration-500 hover:shadow-[0_30px_90px_rgba(23,105,224,0.16)] sm:px-9 sm:py-11 lg:px-12">

          {/* Glow */}
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#1769E0]/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />

          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "linear-gradient(to bottom right, black, transparent 75%)",
            }}
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div className="max-w-2xl">

              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-bold text-blue-300 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
                </span>

                UTILAI
              </div>

              <h2 className="max-w-xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-[2.5rem]">
                Your everyday tools.
                <span className="block text-blue-400">
                  One simple place.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                PDFs, images, developer utilities,
                AI tools and more — everything
                designed to make your everyday
                work simpler.
              </p>

            </div>

            {/* CTA */}
            <Link
              href="/tools"
              className="group/cta inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1769E0] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_35px_rgba(23,105,224,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-[0_18px_45px_rgba(23,105,224,0.5)]"
            >
              Explore Tools

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </Link>

          </div>
        </div>

        {/* =====================================================
            MAIN FOOTER GRID
        ===================================================== */}

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.15fr] lg:gap-8">

          {/* ===================================================
              BRAND
          =================================================== */}

          <div>

            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1769E0] text-lg font-black text-white shadow-[0_10px_30px_rgba(23,105,224,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-[0_14px_35px_rgba(23,105,224,0.35)]">
                U

                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blue-300 ring-4 ring-white" />
              </span>

              <span className="text-2xl font-black tracking-[-0.05em] text-slate-900">
                Util
                <span className="text-[#1769E0]">
                  AI
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              A growing collection of practical
              digital tools built to make everyday
              work faster, easier, and more
              productive.
            </p>

            {/* Feature Pills */}

            <div className="mt-5 flex flex-wrap gap-2">

              <div className="group/pill inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                <Zap className="h-3.5 w-3.5 text-[#1769E0]" />
                Fast
              </div>

              <div className="group/pill inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Simple
              </div>

              <div className="group/pill inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#1769E0]" />
                AI Powered
              </div>

            </div>

            {/* Social */}

            <div className="mt-6 flex items-center gap-2.5">

              {socialLinks.map(
                ({
                  icon: Icon,
                  href,
                  label,
                }) => (
                  <Link
                    key={label}
                    href={href}
                    target={
                      href.startsWith("http")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label={label}
                    className="group/social flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1769E0] hover:bg-[#1769E0] hover:text-white hover:shadow-[0_10px_25px_rgba(23,105,224,0.3)]"
                  >
                    <Icon className="h-4 w-4 transition-transform duration-300 group-hover/social:scale-110" />
                  </Link>
                )
              )}

            </div>
          </div>

          {/* ===================================================
              QUICK LINKS
          =================================================== */}

          <div>

            <div className="flex items-center gap-2">
              <Command className="h-4 w-4 text-[#1769E0]" />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Quick Links
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-1">

              {[
                ["Home", "/"],
                ["All Tools", "/tools"],
                ["Categories", "/categories"],
                ["Pricing", "/pricing"],
                ["About UtilAI", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="group/link flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-all duration-300 hover:bg-blue-50 hover:pl-4 hover:text-[#1769E0]"
                >
                  <span>{label}</span>

                  <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                </Link>
              ))}

            </div>
          </div>

          {/* ===================================================
              CATEGORIES
          =================================================== */}

          <div>

            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-[#1769E0]" />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Categories
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-1">

              {categories.length > 0 ? (
                categories
                  .slice(0, 6)
                  .map((category) => (
                    <Link
                      key={category.slug}
                      href={`/tools/${category.slug}`}
                      className="group/link flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-all duration-300 hover:bg-blue-50 hover:pl-4 hover:text-[#1769E0]"
                    >
                      <span>
                        {category.name}
                      </span>

                      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100" />
                    </Link>
                  ))
              ) : (
                <>
                  {[
                    "Developer Tools",
                    "PDF Tools",
                    "Image Tools",
                    "AI Tools",
                  ].map((name) => (
                    <Link
                      key={name}
                      href="/tools"
                      className="group/link flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-all duration-300 hover:bg-blue-50 hover:pl-4 hover:text-[#1769E0]"
                    >
                      <span>{name}</span>

                      <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                    </Link>
                  ))}
                </>
              )}

            </div>
          </div>

          {/* ===================================================
              STAY CONNECTED
          =================================================== */}

          <div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#1769E0]" />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Stay Connected
              </p>
            </div>

            <div className="mt-5">

              <p className="text-sm leading-6 text-slate-500">
                Get occasional updates about new
                tools and features. No spam, ever.
              </p>

              {/* Newsletter */}

              <form className="group/newsletter mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4 transition-all duration-300 focus-within:border-[#1769E0]/50 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(23,105,224,0.08)] hover:border-blue-200">

                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1769E0] text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-[0_6px_18px_rgba(23,105,224,0.35)]"
                >
                  <Send className="h-4 w-4" />
                </button>

              </form>

              {/* Contact */}

              <Link
                href="/contact"
                className="group/contact mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1769E0] hover:shadow-md"
              >
                <Mail className="h-4 w-4 text-[#1769E0]" />

                Contact Us

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/contact:-translate-y-0.5 group-hover/contact:translate-x-0.5" />
              </Link>

            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className="mt-12 flex flex-col gap-5 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-wrap items-center gap-3">

            <p>
              © {new Date().getFullYear()} UtilAI.
              All rights reserved.
            </p>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">

              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>

              All systems operational
            </span>

          </div>

          <div className="flex flex-wrap items-center gap-4">

            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-[#1769E0]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-[#1769E0]"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="transition-colors duration-200 hover:text-[#1769E0]"
            >
              Contact
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}