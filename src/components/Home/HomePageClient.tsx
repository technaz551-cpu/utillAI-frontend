

"use client";

import Link from "next/link";
import {
  Search,
  ArrowRight,
  Zap,
  Users,
  Sparkles,
  TrendingUp,
  Heart,
  FileText,
  ImageIcon,
  BrainCircuit,
  Globe,
  Code2,
  PenTool,
  CheckCircle2,
  Lock,
  ShieldCheck,
  HardDrive,
  Cloud,
} from "lucide-react";

export type HomeCategory = {
  slug: string;
  name: string;
  description?: string;
  count?: string;
};

export type HomeTool = {
  slug: string;
  name: string;
  short_description: string;
  category_slug: string;
};

type HomePageClientProps = {
  categories: HomeCategory[];
  popular: HomeTool[];
  totalTools: number;
};

const CATEGORY_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
  image: { icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
  ai: { icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50" },
  internet: { icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
  developer: { icon: Code2, color: "text-indigo-500", bg: "bg-indigo-50" },
  text: { icon: PenTool, color: "text-green-500", bg: "bg-green-50" },
};

export function HomePageClient({
  categories,
  popular,
  totalTools,
}: HomePageClientProps) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* ================= HERO SECTION (FULL WIDTH) ================= */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-[#F8FAFC] pt-12 pb-20 md:pt-20 md:pb-28">

        {/* Background Radial Glows */}
        <div className="pointer-events-none absolute -left-20 top-10 h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* ================= LEFT CONTENT COLUMN ================= */}
            <div className="z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#1769E0] shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>{totalTools || "63+"} AI Tools</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">All in One Place</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#12346B] sm:text-5xl lg:text-6xl">
                Your Ultimate Toolkit <br />
                <span className="bg-gradient-to-r from-[#1769E0] via-sky-500 to-blue-600 bg-clip-text text-transparent">
                  for Smarter Work
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
                AI-powered tools for productivity, creativity and more. Simple, fast, and powerful. Right in your browser.
              </p>

              <form action="/tools" className="mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-blue-100 bg-white p-2 shadow-[0_10px_30px_rgba(23,105,224,0.08)]">
                <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search tools... (e.g. PDF merge, image resize, AI chat)"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1769E0] text-white hover:bg-blue-700 transition">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/tools" className="flex items-center gap-2 rounded-full bg-[#1769E0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition">
                  Explore Tools <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  View Pricing
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>No installation needed</span></div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>Browser-based</span></div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>Your data stays private</span></div>
              </div>
            </div>

            {/* ================= RIGHT IMAGE WITH FLOATING TOOL CARDS ================= */}
            <div className="relative flex items-center justify-center lg:justify-end py-6">
              
              {/* Image Container Wrapper */}
              <div className="relative w-full max-w-xl">

                {/* Main WebP Image */}
                <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/40 p-2 shadow-2xl backdrop-blur-sm">
                  <img
                    src="/image.webp"
                    alt="UtilAI Mobile & Web Tools"
                    className="h-auto w-full rounded-2xl object-cover shadow-md"
                  />
                </div>

                {/* FLOATING CARD 1: Top Left */}
                <div className="animate-float-slow absolute -left-8 top-6 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur-md transition hover:scale-105">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">PDF Tools</p>
                    <p className="text-[10px] text-slate-400">Merge & Compress</p>
                  </div>
                </div>

                {/* FLOATING CARD 2: Middle Left */}
                <div className="animate-float-fast absolute -left-10 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur-md transition hover:scale-105 [animation-delay:1s]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">AI Tools</p>
                    <p className="text-[10px] text-slate-400">Generative AI</p>
                  </div>
                </div>

                {/* FLOATING CARD 3: Bottom Left */}
                <div className="animate-float-slow absolute -left-6 bottom-6 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur-md transition hover:scale-105 [animation-delay:2s]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Text Tools</p>
                    <p className="text-[10px] text-slate-400">Editor & Format</p>
                  </div>
                </div>

                {/* FLOATING CARD 4: Top Right */}
                <div className="animate-float-fast absolute -right-6 top-8 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur-md transition hover:scale-105 [animation-delay:0.5s]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Image Tools</p>
                    <p className="text-[10px] text-slate-400">Compress & Edit</p>
                  </div>
                </div>

                {/* FLOATING CARD 5: Bottom Right */}
                <div className="animate-float-slow absolute -right-8 bottom-10 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur-md transition hover:scale-105 [animation-delay:1.5s]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Dev Tools</p>
                    <p className="text-[10px] text-slate-400">JSON & Formatter</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <section className="border-y border-slate-200/80 bg-white py-8">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1769E0]"><Zap className="h-5 w-5" /></div>
              <div><p className="text-lg font-bold text-slate-900">{totalTools || "63+"}</p><p className="text-xs text-slate-500">Powerful Tools</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Users className="h-5 w-5" /></div>
              <div><p className="text-lg font-bold text-slate-900">2,500+</p><p className="text-xs text-slate-500">Active Users</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><Zap className="h-5 w-5" /></div>
              <div><p className="text-lg font-bold text-slate-900">120+</p><p className="text-xs text-slate-500">Automations</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><TrendingUp className="h-5 w-5" /></div>
              <div><p className="text-lg font-bold text-slate-900">98%</p><p className="text-xs text-slate-500">Time Saved</p></div>
            </div>
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><Heart className="h-5 w-5" /></div>
              <div><p className="text-lg font-bold text-slate-900">100%</p><p className="text-xs text-slate-500">Browser Based</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="py-20">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">EXPLORE POSSIBILITIES</span>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Powerful Tools for Every Task</h2>
          <p className="mt-1 text-sm text-slate-500">From everyday productivity to advanced creative workflows, UtilAI has the right tool for you.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const meta = CATEGORY_MAP[cat.slug] || { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" };
              const Icon = meta.icon;
              return (
                <Link key={cat.slug} href={`/tools/${cat.slug}`} className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-[#1769E0]">{cat.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{cat.description || "Explore powerful features for your everyday workflow."}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#1769E0]">
                    <span>{cat.count || "10+ Tools"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECURITY SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-blue-50/60 py-16">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white"><Lock className="h-6 w-6" /></div>
                  <div><h4 className="text-sm font-bold text-slate-800">Your Files</h4><p className="text-xs text-slate-500">Private & encrypted processing</p></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-blue-500" /><span>Drive Integration</span></div><span className="text-emerald-600 font-semibold">Connected</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-sky-500" /><span>OneDrive</span></div><span className="text-emerald-600 font-semibold">Connected</span></div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">YOUR DATA. YOUR CONTROL.</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Private. Fast. Reliable.</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">Your data stays yours. All tools run in your browser with secure, privacy-focused workflows. No installation, no data storage, no worries.</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200"><Lock className="h-4 w-4 text-blue-600" /><span>Private</span></div>
                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200"><Zap className="h-4 w-4 text-blue-600" /><span>Fast</span></div>
                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200"><ShieldCheck className="h-4 w-4 text-blue-600" /><span>Reliable</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="rounded-3xl bg-gradient-to-r from-[#1769E0] to-sky-600 p-10 text-center text-white shadow-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Join Thousands Who Work Smarter with UtilAI</h2>
            <p className="mt-2 text-sm text-blue-100">Access 60+ powerful tools and start turning your ideas into impact today.</p>
            <div className="mt-6">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1769E0] hover:bg-blue-50 transition">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}