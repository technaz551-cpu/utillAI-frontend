import Link from "next/link";
import { ArrowRight, Check, Shield, Sparkles, Zap } from "lucide-react";
import { btn, card } from "@/lib/utils";

const pillars = [
  { title: "Built for everyday work", text: "From PDFs and AI writing to images and file workflows, our tools remove friction from daily tasks.", icon: Zap },
  { title: "Simple, reliable, secure", text: "We focus on fast tools, clean UX, and a dependable experience that feels professional and easy to trust.", icon: Shield },
  { title: "Designed to scale", text: "We help growing teams move faster with flexible workflows, reliable systems, and practical automation.", icon: Sparkles },
];

export default function AboutPage() {
  return (
    <main className="section-shell py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
          About UtilAI
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-6xl">We build tools that make work feel lighter.</h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
          UtilAI is a focused toolkit for people who want faster, smoother, and smarter daily workflows — without the clutter of bloated software.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {pillars.map(({ title, text, icon: Icon }) => (
          <div key={title} className={card("p-6") + " group hover:bg-[var(--brand-primary)] hover:text-white"}>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] group-hover:bg-white/20 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[var(--foreground)] group-hover:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] group-hover:text-white/80">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-8 rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Our approach</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[var(--foreground)]">Clean design, useful tools, real-time results.</h2>
          <ul className="mt-6 space-y-3 text-[var(--muted)]">
            {[
              "Simple interfaces built to reduce friction.",
              "Useful tools for creative teams, freelancers, and fast-moving businesses.",
              "A focused product experience that balances power with ease of use.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] bg-[var(--surface-alt)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">What we believe</p>
          <p className="mt-4 text-base leading-relaxed text-[var(--foreground)]">
            Great tools should feel effortless to use — clear, dependable, and built around the job people actually need to do.
          </p>
          <Link href="/tools" className={btn("primary") + " mt-6 !rounded-full"}>
            Explore tools <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
