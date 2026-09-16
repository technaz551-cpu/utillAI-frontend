import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { btn, card } from "@/lib/utils";

const plans = [
  { name: "Free", price: "$0", period: "forever", features: ["All core tools", "Standard usage limits", "Perfect for everyday tasks"], cta: "Get started", href: "/tools", highlight: false },
  { name: "Pro", price: "$9", period: "/month", features: ["Priority processing", "Higher file limits", "Saved workflow history", "Ad-free experience"], cta: "Upgrade to Pro", href: "/register", highlight: true },
  { name: "Business", price: "$29", period: "/month", features: ["Everything in Pro", "Team access", "Custom workflows", "Dedicated support"], cta: "Talk to sales", href: "/contact", highlight: false },
];

export default function PricingPage() {
  return (
    <main className="section-shell py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
          Flexible plans
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-6xl">Choose the plan that fits your workflow</h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          Start free, then upgrade whenever you want more power, speed, and seamless creative productivity.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={card(
              "group flex flex-col px-6 py-7 hover:bg-[var(--brand-primary)] hover:text-white " +
                (plan.highlight ? "border-[var(--brand-primary)]/40 bg-gradient-to-b from-[var(--surface-raised)] to-[var(--surface-alt)] shadow-[0_24px_52px_rgba(26,166,215,0.18)]" : "")
            )}
          >
            {plan.highlight && (
                <span className="mb-5 inline-flex w-fit rounded-full bg-[var(--brand-primary)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)] group-hover:bg-white/15 group-hover:text-white">
                Most popular
              </span>
            )}
            <h2 className="text-2xl font-black tracking-[-0.05em] text-[var(--foreground)] group-hover:text-white">{plan.name}</h2>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] group-hover:text-white">{plan.price}</span>
              <span className="pb-1 text-sm font-medium text-[var(--muted)] group-hover:text-white/80">{plan.period}</span>
            </div>
            <ul className="mt-7 flex-1 space-y-3 text-sm text-[var(--muted)] group-hover:text-white/80">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] group-hover:bg-white/15 group-hover:text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href={plan.href} className={btn(plan.highlight ? "primary" : "secondary") + " mt-8 w-full !justify-center !rounded-full"}>{plan.cta}</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
