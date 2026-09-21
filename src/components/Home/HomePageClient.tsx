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
            <div className="relative flex w-full items-center justify-center py-6 lg:justify-end">

              {/* Relative Container for Image + Floating Cards */}
              <div className="relative w-full max-w-lg lg:max-w-xl">

                {/* Main WebP Image */}
                <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/40 p-2 shadow-2xl backdrop-blur-sm">
                  <img
                    src="/image.webp"
                    alt="UtilAI Mobile & Web Tools"
                    className="h-auto w-full rounded-2xl object-cover shadow-md"
                  />
                </div>

                {/* FLOATING CARD 1: Top Left */}
                <div className="animate-float-slow absolute -left-4 top-4 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-left-10 lg:top-6 lg:gap-3 lg:rounded-2xl lg:p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 lg:h-10 lg:w-10 lg:rounded-xl">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 lg:text-xs">PDF Tools</p>
                    <p className="text-[9px] text-slate-400 lg:text-[10px]">Merge & Compress</p>
                  </div>
                </div>

                {/* FLOATING CARD 2: Middle Left */}
                <div className="animate-float-fast absolute -left-6 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-left-12 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:1s]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 lg:h-10 lg:w-10 lg:rounded-xl">
                    <BrainCircuit className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 lg:text-xs">AI Tools</p>
                    <p className="text-[9px] text-slate-400 lg:text-[10px]">Generative AI</p>
                  </div>
                </div>

                {/* FLOATING CARD 3: Bottom Left */}
                <div className="animate-float-slow absolute -left-4 bottom-4 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-left-8 lg:bottom-6 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:2s]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 lg:h-10 lg:w-10 lg:rounded-xl">
                    <PenTool className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 lg:text-xs">Text Tools</p>
                    <p className="text-[9px] text-slate-400 lg:text-[10px]">Editor & Format</p>
                  </div>
                </div>

                {/* FLOATING CARD 4: Top Right */}
                <div className="animate-float-fast absolute -right-4 top-6 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-right-8 lg:top-8 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:0.5s]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 lg:h-10 lg:w-10 lg:rounded-xl">
                    <ImageIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 lg:text-xs">Image Tools</p>
                    <p className="text-[9px] text-slate-400 lg:text-[10px]">Compress & Edit</p>
                  </div>
                </div>

                {/* FLOATING CARD 5: Bottom Right */}
                <div className="animate-float-slow absolute -right-4 bottom-8 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-right-10 lg:bottom-10 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:1.5s]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 lg:h-10 lg:w-10 lg:rounded-xl">
                    <Code2 className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 lg:text-xs">Dev Tools</p>
                    <p className="text-[9px] text-slate-400 lg:text-[10px]">JSON & Formatter</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
{/* ================= STATS BAR ================= */}
<section className="mx-4 rounded-4xl border-y border-blue-300/30 bg-blue-400 py-8 cursor-pointer transition-all duration-300 hover:bg-blue-500 sm:mx-8 lg:mx-12">
  <div className="w-full px-4 sm:px-8 lg:px-12">
    <div className="grid grid-cols-2 gap-6 md:grid-cols-5">

      {/* Powerful Tools */}
      <div className="group flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-blue-700/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-white/30">
          <Zap className="h-6 w-6" strokeWidth={2.2} />
        </div>

        <div>
          <p className="text-lg font-bold text-white">
            {totalTools || "63+"}
          </p>
          <p className="text-xs text-white/80">
            Powerful Tools
          </p>
        </div>
      </div>

      {/* Active Users */}
      <div className="group flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/30 text-white shadow-lg shadow-indigo-700/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-indigo-500/40">
          <Users className="h-6 w-6" strokeWidth={2.2} />
        </div>

        <div>
          <p className="text-lg font-bold text-white">
            2,500+
          </p>
          <p className="text-xs text-white/80">
            Active Users
          </p>
        </div>
      </div>

      {/* Automations */}
      <div className="group flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/30 text-white shadow-lg shadow-sky-700/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-sky-500/40">
          <Zap className="h-6 w-6" strokeWidth={2.2} />
        </div>

        <div>
          <p className="text-lg font-bold text-white">
            120+
          </p>
          <p className="text-xs text-white/80">
            Automations
          </p>
        </div>
      </div>

      {/* Time Saved */}
      <div className="group flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/30 text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-emerald-500/40">
          <TrendingUp className="h-6 w-6" strokeWidth={2.2} />
        </div>

        <div>
          <p className="text-lg font-bold text-white">
            98%
          </p>
          <p className="text-xs text-white/80">
            Time Saved
          </p>
        </div>
      </div>

      {/* Browser Based */}
      <div className="group col-span-2 flex items-center gap-3 md:col-span-1">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/30 text-white shadow-lg shadow-rose-700/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-rose-500/40">
          <Heart className="h-6 w-6" strokeWidth={2.2} />
        </div>

        <div>
          <p className="text-lg font-bold text-white">
            100%
          </p>
          <p className="text-xs text-white/80">
            Browser Based
          </p>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* ================= TOOLS & IMAGE SECTION (Image Layout) ================= */}
      <section className="py-20">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">EXPLORE POSSIBILITIES</span>
          <h2 className="mt-1 text-3xl md:text-4xl font-extrabold text-slate-900">Powerful Tools for Every Task</h2>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">From everyday productivity to advanced creative workflows, UtilAI has the right tool for you.</p>

          {/* Tools Grid + Image Layout */}
          <div className="mt-10 grid gap-8 lg:grid-cols-5 items-start">
            
            {/* LEFT: Tools Grid (4 columns) */}
            <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => {
                const meta = CATEGORY_MAP[cat.slug] || { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" };
                const Icon = meta.icon;
                return (
                  <Link key={cat.slug} href={`/tools/${cat.slug}`} className="group relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-[#1769E0]">{cat.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">{cat.description || "Explore powerful features."}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#1769E0]">
                      <span>{cat.count || "10+"}</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* RIGHT: Image Section with Hover Effect */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="group relative rounded-3xl border-2 border-slate-200/80 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-300">
                <img 
                  src="/images1.jpg" 
                  alt="UtilAI Tools" 
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US SECTION ================= */}
      <section className="py-20 bg-slate-50/50">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">WHY CHOOSE UTILAI</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">More Than Just Tools</h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl">We're building a smarter, more productive tomorrow with AI.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Easy to Use</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">Clean and intuitive interface designed for everyone</p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">All in One Place</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">60+ tools across productivity, creativity and development</p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Always Updated</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">New tools and features added regularly</p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Accessible Anywhere</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">Works on any device, anytime, right in your browser</p>
            </div>

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


// "use client";

// import Link from "next/link";
// import {
//   Search,
//   ArrowRight,
//   Zap,
//   Users,
//   Sparkles,
//   TrendingUp,
//   Heart,
//   FileText,
//   ImageIcon,
//   BrainCircuit,
//   Globe,
//   Code2,
//   PenTool,
//   CheckCircle2,
//   Lock,
//   ShieldCheck,
//   HardDrive,
//   Cloud,
// } from "lucide-react";

// export type HomeCategory = {
//   slug: string;
//   name: string;
//   description?: string;
//   count?: string;
// };

// export type HomeTool = {
//   slug: string;
//   name: string;
//   short_description: string;
//   category_slug: string;
// };

// type HomePageClientProps = {
//   categories: HomeCategory[];
//   popular: HomeTool[];
//   totalTools: number;
// };

// const CATEGORY_MAP: Record<string, { icon: any; color: string; bg: string }> = {
//   pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
//   image: { icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
//   ai: { icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50" },
//   internet: { icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
//   developer: { icon: Code2, color: "text-indigo-500", bg: "bg-indigo-50" },
//   text: { icon: PenTool, color: "text-green-500", bg: "bg-green-50" },
// };

// export function HomePageClient({
//   categories,
//   popular,
//   totalTools,
// }: HomePageClientProps) {
//   return (
//     <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
//       {/* ================= HERO SECTION (FULL WIDTH) ================= */}
//       <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-[#F8FAFC] pt-12 pb-20 md:pt-20 md:pb-28">

//         {/* Background Radial Glows */}
//         <div className="pointer-events-none absolute -left-20 top-10 h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-3xl" />
//         <div className="pointer-events-none absolute -right-20 top-20 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl" />

//         <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12">
//           <div className="grid items-center gap-12 lg:grid-cols-2">

//             {/* ================= LEFT CONTENT COLUMN ================= */}
//             <div className="z-10">
//               <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#1769E0] shadow-sm backdrop-blur">
//                 <Sparkles className="h-3.5 w-3.5 text-amber-500" />
//                 <span>{totalTools || "63+"} AI Tools</span>
//                 <span className="text-slate-300">•</span>
//                 <span className="text-slate-500">All in One Place</span>
//               </div>

//               <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#12346B] sm:text-5xl lg:text-6xl">
//                 Your Ultimate Toolkit <br />
//                 <span className="bg-gradient-to-r from-[#1769E0] via-sky-500 to-blue-600 bg-clip-text text-transparent">
//                   for Smarter Work
//                 </span>
//               </h1>

//               <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
//                 AI-powered tools for productivity, creativity and more. Simple, fast, and powerful. Right in your browser.
//               </p>

//               <form action="/tools" className="mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-blue-100 bg-white p-2 shadow-[0_10px_30px_rgba(23,105,224,0.08)]">
//                 <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
//                 <input
//                   type="text"
//                   name="q"
//                   placeholder="Search tools... (e.g. PDF merge, image resize, AI chat)"
//                   className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
//                 />
//                 <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1769E0] text-white hover:bg-blue-700 transition">
//                   <ArrowRight className="h-4 w-4" />
//                 </button>
//               </form>

//               <div className="mt-6 flex flex-wrap items-center gap-4">
//                 <Link href="/tools" className="flex items-center gap-2 rounded-full bg-[#1769E0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition">
//                   Explore Tools <ArrowRight className="h-4 w-4" />
//                 </Link>
//                 <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
//                   View Pricing
//                 </Link>
//               </div>

//               <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500">
//                 <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>No installation needed</span></div>
//                 <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>Browser-based</span></div>
//                 <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>Your data stays private</span></div>
//               </div>
//             </div>
//             {/* ================= RIGHT IMAGE WITH FLOATING TOOL CARDS ================= */}
//             <div className="relative flex w-full items-center justify-center py-6 lg:justify-end">

//               {/* Relative Container for Image + Floating Cards */}
//               <div className="relative w-full max-w-lg lg:max-w-xl">

//                 {/* Main WebP Image */}
//                 <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/40 p-2 shadow-2xl backdrop-blur-sm">
//                   <img
//                     src="/image.webp"
//                     alt="UtilAI Mobile & Web Tools"
//                     className="h-auto w-full rounded-2xl object-cover shadow-md"
//                   />
//                 </div>

//                 {/* FLOATING CARD 1: Top Left */}
//                 <div className="animate-float-slow absolute -left-4 top-4 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-left-10 lg:top-6 lg:gap-3 lg:rounded-2xl lg:p-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 lg:h-10 lg:w-10 lg:rounded-xl">
//                     <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-bold text-slate-800 lg:text-xs">PDF Tools</p>
//                     <p className="text-[9px] text-slate-400 lg:text-[10px]">Merge & Compress</p>
//                   </div>
//                 </div>

//                 {/* FLOATING CARD 2: Middle Left */}
//                 <div className="animate-float-fast absolute -left-6 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-left-12 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:1s]">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 lg:h-10 lg:w-10 lg:rounded-xl">
//                     <BrainCircuit className="h-4 w-4 lg:h-5 lg:w-5" />
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-bold text-slate-800 lg:text-xs">AI Tools</p>
//                     <p className="text-[9px] text-slate-400 lg:text-[10px]">Generative AI</p>
//                   </div>
//                 </div>

//                 {/* FLOATING CARD 3: Bottom Left */}
//                 <div className="animate-float-slow absolute -left-4 bottom-4 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-left-8 lg:bottom-6 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:2s]">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 lg:h-10 lg:w-10 lg:rounded-xl">
//                     <PenTool className="h-4 w-4 lg:h-5 lg:w-5" />
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-bold text-slate-800 lg:text-xs">Text Tools</p>
//                     <p className="text-[9px] text-slate-400 lg:text-[10px]">Editor & Format</p>
//                   </div>
//                 </div>

//                 {/* FLOATING CARD 4: Top Right */}
//                 <div className="animate-float-fast absolute -right-4 top-6 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-right-8 lg:top-8 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:0.5s]">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 lg:h-10 lg:w-10 lg:rounded-xl">
//                     <ImageIcon className="h-4 w-4 lg:h-5 lg:w-5" />
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-bold text-slate-800 lg:text-xs">Image Tools</p>
//                     <p className="text-[9px] text-slate-400 lg:text-[10px]">Compress & Edit</p>
//                   </div>
//                 </div>

//                 {/* FLOATING CARD 5: Bottom Right */}
//                 <div className="animate-float-slow absolute -right-4 bottom-8 z-20 hidden items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-xl backdrop-blur-md transition hover:scale-105 sm:flex lg:-right-10 lg:bottom-10 lg:gap-3 lg:rounded-2xl lg:p-3 [animation-delay:1.5s]">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 lg:h-10 lg:w-10 lg:rounded-xl">
//                     <Code2 className="h-4 w-4 lg:h-5 lg:w-5" />
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-bold text-slate-800 lg:text-xs">Dev Tools</p>
//                     <p className="text-[9px] text-slate-400 lg:text-[10px]">JSON & Formatter</p>
//                   </div>
//                 </div>

//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= STATS BAR ================= */}
//       <section className="border-y border-slate-200/80 bg-white py-8">
//         <div className="w-full px-4 sm:px-8 lg:px-12">
//           <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1769E0]"><Zap className="h-5 w-5" /></div>
//               <div><p className="text-lg font-bold text-slate-900">{totalTools || "63+"}</p><p className="text-xs text-slate-500">Powerful Tools</p></div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Users className="h-5 w-5" /></div>
//               <div><p className="text-lg font-bold text-slate-900">2,500+</p><p className="text-xs text-slate-500">Active Users</p></div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><Zap className="h-5 w-5" /></div>
//               <div><p className="text-lg font-bold text-slate-900">120+</p><p className="text-xs text-slate-500">Automations</p></div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><TrendingUp className="h-5 w-5" /></div>
//               <div><p className="text-lg font-bold text-slate-900">98%</p><p className="text-xs text-slate-500">Time Saved</p></div>
//             </div>
//             <div className="flex items-center gap-3 col-span-2 md:col-span-1">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><Heart className="h-5 w-5" /></div>
//               <div><p className="text-lg font-bold text-slate-900">100%</p><p className="text-xs text-slate-500">Browser Based</p></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= TOOLS & IMAGE SECTION (Image Layout) ================= */}
//       <section className="py-20">
//         <div className="w-full px-4 sm:px-8 lg:px-12">
//           <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">EXPLORE POSSIBILITIES</span>
//           <h2 className="mt-1 text-3xl md:text-4xl font-extrabold text-slate-900">Powerful Tools for Every Task</h2>
//           <p className="mt-2 text-base text-slate-600 max-w-2xl">From everyday productivity to advanced creative workflows, UtilAI has the right tool for you.</p>

//           {/* Tools Grid + Image Layout */}
//           <div className="mt-10 grid gap-8 lg:grid-cols-5 items-start">
            
//             {/* LEFT: Tools Grid (4 columns) */}
//             <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               {categories.map((cat) => {
//                 const meta = CATEGORY_MAP[cat.slug] || { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" };
//                 const Icon = meta.icon;
//                 return (
//                   <Link key={cat.slug} href={`/tools/${cat.slug}`} className="group relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
//                     <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${meta.bg} ${meta.color} transition-all duration-300 group-hover:scale-115 group-hover:shadow-lg`}>
//                       <Icon className="h-6 w-6" />
//                     </div>
//                     <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-[#1769E0]">{cat.name}</h3>
//                     <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">{cat.description || "Explore powerful features."}</p>
//                     <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#1769E0]">
//                       <span>{cat.count || "10+"}</span>
//                       <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* RIGHT: Image Section with Monitor Frame Effect */}
//             <div className="lg:col-span-2 flex flex-col gap-4">
//               <div className="group relative rounded-[28px] overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-2xl">
//                 {/* Monitor-like frame with border */}
//                 <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 p-3 rounded-[28px]">
//                   {/* Notch at top */}
//                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-slate-900 rounded-b-xl z-20" />
                  
//                   {/* Image container */}
//                   <div className="relative rounded-[24px] overflow-hidden border-2 border-slate-700/50">
//                     <img 
//                       src="/images1.jpg" 
//                       alt="UtilAI Tools" 
//                       className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px]" />
//                   </div>

//                   {/* Monitor bottom bezel */}
//                   <div className="mt-2 h-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-[24px]" />
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= WHY CHOOSE US SECTION ================= */}
//       <section className="py-20 bg-slate-50/50">
//         <div className="w-full px-4 sm:px-8 lg:px-12">
//           <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">WHY CHOOSE UTILAI</span>
//           <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">More Than Just Tools</h2>
//           <p className="mt-3 text-base text-slate-600 max-w-2xl">We're building a smarter, more productive tomorrow with AI.</p>

//           <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
//             {/* Feature 1 */}
//             <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
//                 <CheckCircle2 className="h-6 w-6" />
//               </div>
//               <h3 className="mt-4 text-base font-bold text-slate-900">Easy to Use</h3>
//               <p className="mt-2 text-xs leading-relaxed text-slate-500">Clean and intuitive interface designed for everyone</p>
//             </div>

//             {/* Feature 2 */}
//             <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                 <Zap className="h-6 w-6" />
//               </div>
//               <h3 className="mt-4 text-base font-bold text-slate-900">All in One Place</h3>
//               <p className="mt-2 text-xs leading-relaxed text-slate-500">60+ tools across productivity, creativity and development</p>
//             </div>

//             {/* Feature 3 */}
//             <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
//                 <TrendingUp className="h-6 w-6" />
//               </div>
//               <h3 className="mt-4 text-base font-bold text-slate-900">Always Updated</h3>
//               <p className="mt-2 text-xs leading-relaxed text-slate-500">New tools and features added regularly</p>
//             </div>

//             {/* Feature 4 */}
//             <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
//                 <Globe className="h-6 w-6" />
//               </div>
//               <h3 className="mt-4 text-base font-bold text-slate-900">Accessible Anywhere</h3>
//               <p className="mt-2 text-xs leading-relaxed text-slate-500">Works on any device, anytime, right in your browser</p>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= SECURITY SECTION ================= */}
//       <section className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-blue-50/60 py-16">
//         <div className="w-full px-4 sm:px-8 lg:px-12">
//           <div className="grid items-center gap-10 lg:grid-cols-2">
//             <div className="flex justify-center">
//               <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">
//                 <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white"><Lock className="h-6 w-6" /></div>
//                   <div><h4 className="text-sm font-bold text-slate-800">Your Files</h4><p className="text-xs text-slate-500">Private & encrypted processing</p></div>
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-blue-500" /><span>Drive Integration</span></div><span className="text-emerald-600 font-semibold">Connected</span></div>
//                   <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-sky-500" /><span>OneDrive</span></div><span className="text-emerald-600 font-semibold">Connected</span></div>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">YOUR DATA. YOUR CONTROL.</span>
//               <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Private. Fast. Reliable.</h2>
//               <p className="mt-3 text-sm leading-relaxed text-slate-600">Your data stays yours. All tools run in your browser with secure, privacy-focused workflows. No installation, no data storage, no worries.</p>
//               <div className="mt-6 flex flex-wrap gap-4">
//                 <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200"><Lock className="h-4 w-4 text-blue-600" /><span>Private</span></div>
//                 <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200"><Zap className="h-4 w-4 text-blue-600" /><span>Fast</span></div>
//                 <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200"><ShieldCheck className="h-4 w-4 text-blue-600" /><span>Reliable</span></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= CTA BANNER ================= */}
//       <section className="py-16">
//         <div className="w-full px-4 sm:px-8 lg:px-12">
//           <div className="rounded-3xl bg-gradient-to-r from-[#1769E0] to-sky-600 p-10 text-center text-white shadow-xl">
//             <h2 className="text-2xl font-bold sm:text-3xl">Join Thousands Who Work Smarter with UtilAI</h2>
//             <p className="mt-2 text-sm text-blue-100">Access 60+ powerful tools and start turning your ideas into impact today.</p>
//             <div className="mt-6">
//               <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1769E0] hover:bg-blue-50 transition">
//                 Get Started Free <ArrowRight className="h-4 w-4" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }