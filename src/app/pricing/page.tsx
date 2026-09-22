// import Link from "next/link";
// import { Check, Sparkles } from "lucide-react";
// import { btn, card } from "@/lib/utils";

// const plans = [
//   { name: "Free", price: "$0", period: "forever", features: ["All core tools", "Standard usage limits", "Perfect for everyday tasks"], cta: "Get started", href: "/tools", highlight: false },
//   { name: "Pro", price: "$9", period: "/month", features: ["Priority processing", "Higher file limits", "Saved workflow history", "Ad-free experience"], cta: "Upgrade to Pro", href: "/register", highlight: true },
//   { name: "Business", price: "$29", period: "/month", features: ["Everything in Pro", "Team access", "Custom workflows", "Dedicated support"], cta: "Talk to sales", href: "/contact", highlight: false },
// ];

// export default function PricingPage() {
//   return (
//     <main className="section-shell py-16 md:py-20">
//       <div className="mx-auto max-w-3xl text-center">
//         <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
//           <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
//           Flexible plans
//         </div>
//         <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-6xl">Choose the plan that fits your workflow</h1>
//         <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
//           Start free, then upgrade whenever you want more power, speed, and seamless creative productivity.
//         </p>
//       </div>

//       <div className="mt-14 grid gap-6 lg:grid-cols-3">
//         {plans.map((plan) => (
//           <div
//             key={plan.name}
//             className={card(
//               "group flex flex-col px-6 py-7 hover:bg-[var(--brand-primary)] hover:text-white " +
//                 (plan.highlight ? "border-[var(--brand-primary)]/40 bg-gradient-to-b from-[var(--surface-raised)] to-[var(--surface-alt)] shadow-[0_24px_52px_rgba(26,166,215,0.18)]" : "")
//             )}
//           >
//             {plan.highlight && (
//                 <span className="mb-5 inline-flex w-fit rounded-full bg-[var(--brand-primary)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)] group-hover:bg-white/15 group-hover:text-white">
//                 Most popular
//               </span>
//             )}
//             <h2 className="text-2xl font-black tracking-[-0.05em] text-[var(--foreground)] group-hover:text-white">{plan.name}</h2>
//             <div className="mt-6 flex items-end gap-2">
//               <span className="text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] group-hover:text-white">{plan.price}</span>
//               <span className="pb-1 text-sm font-medium text-[var(--muted)] group-hover:text-white/80">{plan.period}</span>
//             </div>
//             <ul className="mt-7 flex-1 space-y-3 text-sm text-[var(--muted)] group-hover:text-white/80">
//               {plan.features.map((feature) => (
//                 <li key={feature} className="flex items-start gap-3">
//                   <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] group-hover:bg-white/15 group-hover:text-white">
//                     <Check className="h-3.5 w-3.5" />
//                   </span>
//                   <span>{feature}</span>
//                 </li>
//               ))}
//             </ul>
//             <Link href={plan.href} className={btn(plan.highlight ? "primary" : "secondary") + " mt-8 w-full !justify-center !rounded-full"}>{plan.cta}</Link>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need for everyday tasks.",
    features: [
      "All core tools",
      "Standard usage limits",
      "PDF & Image tools, unlimited",
      "1 free trial per tool in other categories",
    ],
    cta: "Get started",
    href: "/tools",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$5",
    period: "/month",
    description: "A step up for regular, light everyday use.",
    features: [
      "Everything in Free",
      "Higher daily usage limits",
      "No trial caps on Internet & Dev tools",
      "Email support",
    ],
    cta: "Choose Starter",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For people who use UtilAI every day.",
    features: [
      "Everything in Starter",
      "Priority processing",
      "Higher file limits",
      "Saved workflow history",
      "Ad-free experience",
    ],
    cta: "Upgrade to Pro",
    href: "/register",
    highlight: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "For teams that need more control.",
    features: [
      "Everything in Pro",
      "Team access & roles",
      "Custom workflows",
      "Dedicated support",
    ],
    cta: "Talk to sales",
    href: "/contact",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#EAF2FF] via-[#F3F8FF] to-white">

      {/* ================= SOFT BACKGROUND GLOW (matches hero) ================= */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#1769E0]/10 blur-[110px]" />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-20 text-center md:pt-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1769E0] shadow-sm">
          <Sparkles size={14} className="text-[#1769E0]" />
          Simple, transparent pricing
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
          Choose the plan that{" "}
          <span className="text-[#1769E0]">fits your workflow</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#52627A] md:text-lg">
          Start free with 63+ tools, then move up whenever you want more
          speed, higher limits, and a smoother workflow.
        </p>
      </section>

      {/* =========================================================
          PLANS — 4 cards, Free on the left through to Business
      ========================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
                plan.highlight
                  ? "border-[#1769E0] bg-[#1769E0] text-white shadow-[0_20px_60px_rgba(23,105,224,0.35)] lg:-translate-y-3"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm hover:-translate-y-1 hover:border-[#1769E0]/40 hover:bg-[#F5F9FF] hover:shadow-[0_16px_44px_rgba(23,105,224,0.14)]"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1769E0] shadow-[0_8px_20px_rgba(15,23,42,0.18)]">
                  Most popular
                </span>
              )}

              <h2
                className={`text-lg font-bold ${
                  plan.highlight ? "text-white" : "text-slate-900"
                }`}
              >
                {plan.name}
              </h2>
              <p
                className={`mt-1 text-xs ${
                  plan.highlight ? "text-white/75" : "text-[#52627A]"
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-1.5">
                <span
                  className={`text-4xl font-black tracking-tight ${
                    plan.highlight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`pb-1 text-sm font-medium ${
                    plan.highlight ? "text-white/75" : "text-[#52627A]"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-3 text-sm ${
                      plan.highlight ? "text-white/90" : "text-slate-600"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.highlight
                          ? "bg-white/15 text-white"
                          : "bg-[#E7F0FF] text-[#1769E0]"
                      }`}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                  plan.highlight
                    ? "bg-white text-[#1769E0] shadow-[0_10px_28px_rgba(15,23,42,0.18)] hover:bg-[#F0F5FF]"
                    : "border border-slate-200 text-slate-700 group-hover:border-[#1769E0]/40 group-hover:bg-white group-hover:text-[#1769E0]"
                }`}
              >
                {plan.cta}
                {plan.highlight && <ArrowRight size={15} />}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-[#52627A]">
          All plans include access to our full tools directory. Cancel
          anytime — no hidden fees.
        </p>
      </section>
    </main>
  );
}