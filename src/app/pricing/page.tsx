import Link from "next/link";
import { Check } from "lucide-react";
import { btn, card } from "@/lib/utils";

const plans = [
  { name: "Free", price: "$0", period: "forever", features: ["All basic tools", "Standard limits", "Ad-supported"], cta: "Get Started", href: "/tools", highlight: false },
  { name: "Pro", price: "$9", period: "/month", features: ["Ad-free experience", "Higher file limits", "Batch processing", "Tool history"], cta: "Upgrade to Pro", href: "/register", highlight: true },
  { name: "Business", price: "$29", period: "/month", features: ["Everything in Pro", "API access", "Priority processing", "Team accounts"], cta: "Contact Sales", href: "/contact", highlight: false },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold md:text-4xl">Simple pricing</h1>
        <p className="mt-4 text-[var(--muted)]">Use every tool for free, or upgrade for an ad-free experience with higher limits.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={card(
              "flex flex-col " + (p.highlight ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/30" : ""),
            )}
          >
            {p.highlight && (
              <span className="mb-4 inline-block w-fit rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="mt-4">
              <span className="text-3xl font-semibold">{p.price}</span>
              <span className="text-sm text-[var(--muted)]">{p.period}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-[var(--muted)]">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href={p.href} className={btn(p.highlight ? "primary" : "secondary") + " mt-8 text-center"}>{p.cta}</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
