// import Link from "next/link";
// import { ArrowUpRight, Sparkles } from "lucide-react";
// import { fetchCategories } from "@/lib/api";

// export async function Footer() {
//   const categories = (await fetchCategories().catch(() => [])) as Array<{ slug: string; name: string }>;

//   return (
//     <footer className="relative mt-20 bg-[#1d2a2a] text-white">
//       <div className="section-shell py-16">
//         <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
//           <div>
//             <div className="flex items-center gap-3">
//               <span className="brand-mark !h-10 !w-10 !rounded-xl">T</span>
//               <span className="text-3xl font-black tracking-[-0.07em] text-white">TECHNAZ</span>
//             </div>
//             <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
//               Australia’s trusted technology partner — we build, support and scale IT for growing businesses.
//             </p>
//           </div>

//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Quick Links</p>
//             <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200">
//               <Link href="/" className="transition hover:text-white">Home</Link>
//               <Link href="/about" className="transition hover:text-white">About</Link>
//               <Link href="/services" className="transition hover:text-white">Services</Link>
//               <Link href="/pricing" className="transition hover:text-white">Product</Link>
//               <Link href="/contact" className="transition hover:text-white">Contact</Link>
//             </div>
//           </div>

//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Our Services</p>
//             <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200">
//               <Link href="/tools" className="transition hover:text-white">Managed IT</Link>
//               <Link href="/tools" className="transition hover:text-white">Cloud Solutions</Link>
//               <Link href="/tools" className="transition hover:text-white">Cyber Security</Link>
//               <Link href="/tools" className="transition hover:text-white">Custom Software</Link>
//               <Link href="/tools" className="transition hover:text-white">DevOps & Support</Link>
//             </div>
//           </div>

//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Get in touch</p>
//             <div className="mt-4 space-y-3 text-sm text-slate-200">
//               <p className="hover:text-white">hello@technaz.com.au</p>
//               <p>Australia-wide support</p>
//               <p>Mon – Fri, 8:00am – 6:00pm AEST</p>
//               <div className="flex gap-3 pt-2">
//                 <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-700/60 text-sm font-bold text-white">in</span>
//                 <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-700/60 text-sm font-bold text-white">f</span>
//                 <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-700/60 text-sm font-bold text-white">◎</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-12 border-t border-slate-600 pt-6 text-sm text-slate-300 sm:flex sm:items-center sm:justify-between">
//           <p>© {new Date().getFullYear()} Technaz. All rights reserved.</p>
//           <p>Managed IT &amp; Custom Software for Australian Businesses</p>
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
} from "lucide-react";
import { fetchCategories } from "@/lib/api";

export async function Footer() {
  const categories = (await fetchCategories().catch(() => [])) as Array<{
    slug: string;
    name: string;
  }>;

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-slate-200 bg-white">

      {/* ================= SOFT BACKGROUND ================= */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />

      <div className="section-shell relative z-10 py-14 sm:py-16 lg:py-20">

        {/* ================= CTA ================= */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-8 shadow-sm sm:px-8 lg:px-10">

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="max-w-2xl">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-bold text-[#1769E0]">
                <Sparkles className="h-3.5 w-3.5" />
                UTILAI
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Everything you need, all in one place.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Simple and practical tools for PDFs, images, developers,
                text, productivity, and more.
              </p>

            </div>

            <Link
              href="/tools"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1769E0] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              Explore Tools
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

          </div>
        </div>


        {/* ================= FOOTER CONTENT ================= */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1fr]">

          {/* ================= BRAND ================= */}
          <div>

            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1769E0] text-lg font-black text-white shadow-md shadow-blue-500/15 transition-transform duration-300 group-hover:scale-105">
                U
              </span>

              <span className="text-2xl font-black tracking-[-0.05em] text-slate-900">
                Util<span className="text-[#1769E0]">AI</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              A growing collection of practical digital tools designed to
              make everyday work faster, simpler, and more productive.
            </p>

            {/* Small Feature Pills */}
            <div className="mt-5 flex flex-wrap gap-2">

              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                <Zap className="h-3.5 w-3.5 text-[#1769E0]" />
                Fast
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Simple
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-[#1769E0]" />
                AI Powered
              </span>

            </div>
          </div>


          {/* ================= QUICK LINKS ================= */}
          <div>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Quick Links
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">

              <Link
                href="/"
                className="w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
              >
                Home
              </Link>

              <Link
                href="/tools"
                className="w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
              >
                All Tools
              </Link>

              <Link
                href="/categories"
                className="w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
              >
                Categories
              </Link>

              <Link
                href="/about"
                className="w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
              >
                About UtilAI
              </Link>

              <Link
                href="/contact"
                className="w-fit text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
              >
                Contact
              </Link>

            </div>
          </div>


          {/* ================= CATEGORIES ================= */}
          <div>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Categories
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">

              {categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/tools/${category.slug}`}
                    className="group flex w-fit items-center gap-1.5 text-slate-600 transition-colors duration-200 hover:text-[#1769E0]"
                  >
                    {category.name}

                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/tools"
                    className="w-fit text-slate-600 hover:text-[#1769E0]"
                  >
                    Developer Tools
                  </Link>

                  <Link
                    href="/tools"
                    className="w-fit text-slate-600 hover:text-[#1769E0]"
                  >
                    PDF Tools
                  </Link>

                  <Link
                    href="/tools"
                    className="w-fit text-slate-600 hover:text-[#1769E0]"
                  >
                    Image Tools
                  </Link>

                  <Link
                    href="/tools"
                    className="w-fit text-slate-600 hover:text-[#1769E0]"
                  >
                    AI Tools
                  </Link>
                </>
              )}

            </div>
          </div>


          {/* ================= CONTACT ================= */}
          <div>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Stay Connected
            </p>

            <div className="mt-5">

              <p className="text-sm leading-6 text-slate-500">
                Have a question, suggestion, or feedback? We'd love to hear
                from you.
              </p>

              <Link
                href="/contact"
                className="group mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1769E0] hover:shadow-sm"
              >
                <Mail className="h-4 w-4 text-[#1769E0]" />

                Contact Us

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

            </div>
          </div>

        </div>


        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} UtilAI. All rights reserved.
          </p>

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

