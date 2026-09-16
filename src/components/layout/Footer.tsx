import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { fetchCategories } from "@/lib/api";

export async function Footer() {
  const categories = (await fetchCategories().catch(() => [])) as Array<{ slug: string; name: string }>;

  return (
    <footer className="relative mt-20 bg-[#1d2a2a] text-white">
      <div className="section-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="brand-mark !h-10 !w-10 !rounded-xl">T</span>
              <span className="text-3xl font-black tracking-[-0.07em] text-white">TECHNAZ</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
              Australia’s trusted technology partner — we build, support and scale IT for growing businesses.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Quick Links</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200">
              <Link href="/" className="transition hover:text-white">Home</Link>
              <Link href="/about" className="transition hover:text-white">About</Link>
              <Link href="/services" className="transition hover:text-white">Services</Link>
              <Link href="/pricing" className="transition hover:text-white">Product</Link>
              <Link href="/contact" className="transition hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Our Services</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200">
              <Link href="/tools" className="transition hover:text-white">Managed IT</Link>
              <Link href="/tools" className="transition hover:text-white">Cloud Solutions</Link>
              <Link href="/tools" className="transition hover:text-white">Cyber Security</Link>
              <Link href="/tools" className="transition hover:text-white">Custom Software</Link>
              <Link href="/tools" className="transition hover:text-white">DevOps & Support</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Get in touch</p>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <p className="hover:text-white">hello@technaz.com.au</p>
              <p>Australia-wide support</p>
              <p>Mon – Fri, 8:00am – 6:00pm AEST</p>
              <div className="flex gap-3 pt-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-700/60 text-sm font-bold text-white">in</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-700/60 text-sm font-bold text-white">f</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-700/60 text-sm font-bold text-white">◎</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-600 pt-6 text-sm text-slate-300 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Technaz. All rights reserved.</p>
          <p>Managed IT &amp; Custom Software for Australian Businesses</p>
        </div>
      </div>
    </footer>
  );
}
