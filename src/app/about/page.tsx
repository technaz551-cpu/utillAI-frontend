// // import Link from "next/link";
// // import { ArrowRight, Check, Shield, Sparkles, Zap } from "lucide-react";
// // import { btn, card } from "@/lib/utils";

// // const pillars = [
// //   { title: "Built for everyday work", text: "From PDFs and AI writing to images and file workflows, our tools remove friction from daily tasks.", icon: Zap },
// //   { title: "Simple, reliable, secure", text: "We focus on fast tools, clean UX, and a dependable experience that feels professional and easy to trust.", icon: Shield },
// //   { title: "Designed to scale", text: "We help growing teams move faster with flexible workflows, reliable systems, and practical automation.", icon: Sparkles },
// // ];

// // export default function AboutPage() {
// //   return (
// //     <main className="section-shell py-16 md:py-20">
// //       <div className="mx-auto max-w-4xl text-center">
// //         <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
// //           <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
// //           About UtilAI
// //         </div>
// //         <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-6xl">We build tools that make work feel lighter.</h1>
// //         <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
// //           UtilAI is a focused toolkit for people who want faster, smoother, and smarter daily workflows — without the clutter of bloated software.
// //         </p>
// //       </div>

// //       <div className="mt-14 grid gap-5 md:grid-cols-3">
// //         {pillars.map(({ title, text, icon: Icon }) => (
// //           <div key={title} className={card("p-6") + " group hover:bg-[var(--brand-primary)] hover:text-white"}>
// //             <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] group-hover:bg-white/20 group-hover:text-white">
// //               <Icon className="h-5 w-5" />
// //             </div>
// //             <h2 className="mt-5 text-xl font-bold text-[var(--foreground)] group-hover:text-white">{title}</h2>
// //             <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] group-hover:text-white/80">{text}</p>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="mt-16 grid gap-8 rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_0.8fr]">
// //         <div>
// //           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Our approach</p>
// //           <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[var(--foreground)]">Clean design, useful tools, real-time results.</h2>
// //           <ul className="mt-6 space-y-3 text-[var(--muted)]">
// //             {[
// //               "Simple interfaces built to reduce friction.",
// //               "Useful tools for creative teams, freelancers, and fast-moving businesses.",
// //               "A focused product experience that balances power with ease of use.",
// //             ].map((item) => (
// //               <li key={item} className="flex items-start gap-3">
// //                 <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
// //                   <Check className="h-3.5 w-3.5" />
// //                 </span>
// //                 <span>{item}</span>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>

// //         <div className="rounded-[24px] bg-[var(--surface-alt)] p-6">
// //           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">What we believe</p>
// //           <p className="mt-4 text-base leading-relaxed text-[var(--foreground)]">
// //             Great tools should feel effortless to use — clear, dependable, and built around the job people actually need to do.
// //           </p>
// //           <Link href="/tools" className={btn("primary") + " mt-6 !rounded-full"}>
// //             Explore tools <ArrowRight className="ml-2 h-4 w-4" />
// //           </Link>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }
// import { Check, Shield, Sparkles, Zap } from "lucide-react";

// const pillars = [
//   {
//     title: "Built for everyday work",
//     text: "From PDFs and AI writing to images and file workflows, our tools remove friction from daily tasks.",
//     icon: Zap,
//   },
//   {
//     title: "Simple, reliable, secure",
//     text: "We focus on fast tools, clean UX, and a dependable experience that feels professional and easy to trust.",
//     icon: Shield,
//   },
//   {
//     title: "Designed to scale",
//     text: "We help growing teams move faster with flexible workflows, reliable systems, and practical automation.",
//     icon: Sparkles,
//   },
// ];

// const approachItems = [
//   "Simple interfaces built to reduce friction.",
//   "Useful tools for creative teams, freelancers, and fast-moving businesses.",
//   "A focused product experience that balances power with ease of use.",
// ];

// export default function AboutPage() {
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-blue-50/70 via-white to-sky-50/40">
//       {/* ========================================================= */}
//       {/* HERO */}
//       {/* ========================================================= */}

//       <section className="relative min-h-[590px] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100 px-6 py-16 lg:px-12">
//         {/* Background decorations */}
//         <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

//         <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

//         {/* LEFT CONTENT */}
//         <div className="relative z-20 mx-auto max-w-7xl">
//           <div className="max-w-[600px] pt-8 lg:pt-12">
//             {/* Badge */}
//             <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm backdrop-blur">
//               <Sparkles className="h-4 w-4 text-orange-500" />

//               <span>About UtilAI</span>

//               <span className="text-blue-200">•</span>

//               <span className="text-slate-500">
//                 Built for everyday work
//               </span>
//             </div>

//             {/* Heading */}
//             <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[64px]">
//               We build tools
//               <br />

//               <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
//                 that make work lighter.
//               </span>
//             </h1>

//             {/* Description */}
//             <p className="mt-7 max-w-[570px] text-base leading-7 text-slate-600 sm:text-lg">
//               UtilAI is a focused toolkit for people who want faster,
//               smoother, and smarter daily workflows — without the
//               clutter of bloated software.
//             </p>

//             {/* Small stats */}
//             <div className="mt-8 flex flex-wrap gap-3">
//               <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
//                 <span className="h-2 w-2 rounded-full bg-emerald-500" />
//                 Simple tools
//               </div>

//               <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
//                 <span className="h-2 w-2 rounded-full bg-blue-500" />
//                 Clean experience
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ========================================================= */}
//         {/* RIGHT IMAGE */}
//         {/* ========================================================= */}

//         <div className="pointer-events-none absolute right-5 top-16 z-10 hidden w-[520px] lg:block xl:right-12 xl:top-12 xl:w-[590px] 2xl:right-20 2xl:w-[650px]">
//           <div className="relative">
//             {/* Glow */}
//             <div className="absolute inset-10 rounded-full bg-blue-300/30 blur-3xl" />

//             {/* Image container */}
//             <div className="relative overflow-hidden rounded-[28px] border border-white/90 bg-white/50 p-3 shadow-[0_30px_80px_rgba(37,99,235,0.18)] backdrop-blur-sm">
//               <img
//                 src="/images3.png"
//                 alt="UtilAI tools"
//                 className="block h-auto w-full rounded-[20px] object-contain"
//               />
//             </div>
//           </div>
//         </div>

//         {/* MOBILE IMAGE */}
//         <div className="relative z-10 mx-auto mt-14 max-w-2xl lg:hidden">
//           <div className="overflow-hidden rounded-[28px] border border-white bg-white/60 p-3 shadow-2xl backdrop-blur-sm">
//             <img
//               src="/images3.png"
//               alt="UtilAI tools"
//               className="block h-auto w-full rounded-[20px] object-contain"
//             />
//           </div>
//         </div>
//       </section>

//       {/* ========================================================= */}
//       {/* OUR PILLARS */}
//       {/* ========================================================= */}

//       <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-12">
//         {/* Section heading */}
//         <div className="mb-10 max-w-2xl">
//           <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-bold text-blue-600 shadow-sm">
//             What drives us
//           </span>

//           <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
//             Built around the way
//             <span className="text-blue-600"> people actually work.</span>
//           </h2>

//           <p className="mt-4 text-base leading-7 text-slate-500">
//             We keep UtilAI focused on useful functionality, clear
//             interfaces, and tools that solve real everyday problems.
//           </p>
//         </div>

//         {/* Pillar cards */}
//         <div className="grid gap-5 md:grid-cols-3">
//           {pillars.map(({ title, text, icon: Icon }) => (
//             <div
//               key={title}
//               className="group relative isolate overflow-hidden rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
//             >
//               {/* Full card hover background */}
//               <span
//                 aria-hidden="true"
//                 className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 transition-transform duration-500 ease-out group-hover:scale-x-100"
//               />

//               {/* Icon */}
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20 group-hover:bg-white/20 group-hover:text-white">
//                 <Icon className="h-5 w-5" />
//               </div>

//               {/* Content */}
//               <h3 className="mt-5 text-xl font-bold text-slate-900 transition-colors group-hover:text-white">
//                 {title}
//               </h3>

//               <p className="mt-3 text-sm leading-7 text-slate-500 transition-colors group-hover:text-white/80">
//                 {text}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ========================================================= */}
//       {/* OUR APPROACH */}
//       {/* ========================================================= */}

//       <section className="mx-auto max-w-7xl px-6 pb-16 sm:pb-20 lg:px-12">
//         <div className="relative overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_20px_60px_rgba(37,99,235,0.08)]">
//           {/* Decorative background */}
//           <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

//           <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
//             {/* LEFT */}
//             <div>
//               <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
//                 Our approach
//               </span>

//               <h2 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
//                 Clean design.
//                 <br />

//                 <span className="text-blue-600">
//                   Useful tools. Real results.
//                 </span>
//               </h2>

//               <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
//                 Great tools should feel effortless to use — clear,
//                 dependable, and built around the job people actually
//                 need to do.
//               </p>

//               {/* Checklist */}
//               <ul className="mt-7 space-y-4">
//                 {approachItems.map((item) => (
//                   <li
//                     key={item}
//                     className="flex items-start gap-3 text-sm leading-6 text-slate-600"
//                   >
//                     <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
//                       <Check className="h-3.5 w-3.5" />
//                     </span>

//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* RIGHT */}
//             <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[26px] bg-gradient-to-br from-blue-50 via-white to-sky-100 p-8">
//               {/* Decorative circles */}
//               <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/40 blur-2xl" />

//               <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-sky-200/40 blur-2xl" />

//               {/* Main statement */}
//               <div className="relative text-center">
//                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-xl shadow-blue-200">
//                   <Sparkles className="h-7 w-7" />
//                 </div>

//                 <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
//                   Less friction.
//                 </h3>

//                 <p className="mt-2 text-lg font-semibold text-blue-600">
//                   More done.
//                 </p>

//                 <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-500">
//                   Practical tools designed to keep your everyday
//                   workflow simple and productive.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ========================================================= */}
//       {/* VALUES / FINAL SECTION */}
//       {/* ========================================================= */}

//       <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
//         <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-600 to-sky-500 px-7 py-10 shadow-xl shadow-blue-200/50 sm:px-10 sm:py-12">
//           {/* Decorative shapes */}
//           <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

//           <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

//           <div className="relative max-w-3xl">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
//               <Sparkles className="h-3.5 w-3.5" />
//               UTILAI
//             </div>

//             <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
//               Everything you need,
//               <br />
//               all in one place.
//             </h2>

//             <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
//               Simple and practical tools for PDFs, images,
//               developers, text, productivity, and more — built
//               to feel effortless.
//             </p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

import { Check, Shield, Sparkles, Zap } from "lucide-react";

const pillars = [
  {
    title: "Built for everyday work",
    text: "From PDFs and AI writing to images and file workflows, our tools remove friction from daily tasks.",
    icon: Zap,
  },
  {
    title: "Simple, reliable, secure",
    text: "We focus on fast tools, clean UX, and a dependable experience that feels professional and easy to trust.",
    icon: Shield,
  },
  {
    title: "Designed to scale",
    text: "We help growing teams move faster with flexible workflows, reliable systems, and practical automation.",
    icon: Sparkles,
  },
];

const approachItems = [
  "Simple interfaces built to reduce friction.",
  "Useful tools for creative teams, freelancers, and fast-moving businesses.",
  "A focused product experience that balances power with ease of use.",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/70 via-white to-sky-50/40">
      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100 px-4 py-12 sm:px-6 md:py-16 lg:px-12 lg:py-20">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

        {/* Content wrapper */}
        <div className="relative z-20 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* LEFT CONTENT */}
            <div className="flex flex-col justify-center py-8 lg:py-12">
              {/* Badge */}
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-3.5 py-2 text-xs sm:text-sm font-medium text-blue-600 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
                <span>About UtilAI</span>
                <span className="text-blue-200">•</span>
                <span className="text-slate-500">Built for everyday work</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
                We build tools
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                  that make work lighter.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
                UtilAI is a focused toolkit for people who want faster, smoother, and smarter daily workflows — without the clutter of bloated software.
              </p>

              {/* Stats/Badges */}
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Simple tools
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Clean experience
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md md:max-w-xl">
                {/* Glow effect */}
                <div className="absolute inset-10 rounded-full bg-blue-300/30 blur-3xl" />

                {/* Image container */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/90 bg-white/50 p-2 sm:p-3 shadow-2xl backdrop-blur-sm">
                  <img
                    src="/images3.png"
                    alt="UtilAI tools"
                    className="block h-auto w-full rounded-xl sm:rounded-2xl object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* OUR PILLARS */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-12">
        {/* Section heading */}
        <div className="mb-8 sm:mb-10 max-w-3xl">
          <span className="mb-3 inline-flex rounded-full border border-blue-100 bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-bold text-blue-600 shadow-sm">
            What drives us
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Built around the way
            <br className="hidden sm:block" />
            <span className="text-blue-600"> people actually work.</span>
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-slate-500">
            We keep UtilAI focused on useful functionality, clear interfaces, and tools that solve real everyday problems.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ title, text, icon: Icon }) => (
            <div
              key={title}
              className="group relative isolate overflow-hidden rounded-xl sm:rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:hover:shadow-xl hover:shadow-blue-100/60"
            >
              {/* Hover background */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />

              {/* Icon */}
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20 group-hover:bg-white/20 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold text-slate-900 transition-colors group-hover:text-white">
                {title}
              </h3>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-500 transition-colors group-hover:text-white/80">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* OUR APPROACH */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-100 bg-white shadow-lg sm:shadow-2xl">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="relative grid gap-8 sm:gap-10 p-5 sm:p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
            {/* LEFT */}
            <div>
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600">
                Our approach
              </span>

              <h2 className="mt-4 sm:mt-5 max-w-2xl text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Clean design.
                <br />
                <span className="text-blue-600">Useful tools. Real results.</span>
              </h2>

              <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500">
                Great tools should feel effortless to use — clear, dependable, and built around the job people actually need to do.
              </p>

              {/* Checklist */}
              <ul className="mt-6 sm:mt-7 space-y-3 sm:space-y-4">
                {approachItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-slate-600"
                  >
                    <span className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT */}
            <div className="relative flex min-h-64 sm:min-h-80 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 via-white to-sky-100 p-6 sm:p-8">
              {/* Decorative circles */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/40 blur-2xl" />
              <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-sky-200/40 blur-2xl" />

              {/* Main statement */}
              <div className="relative text-center">
                <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-lg sm:shadow-xl">
                  <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <h3 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  Less friction.
                </h3>

                <p className="mt-2 text-base sm:text-lg font-semibold text-blue-600">
                  More done.
                </p>

                <p className="mx-auto mt-3 sm:mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-slate-500">
                  Practical tools designed to keep your everyday workflow simple and productive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL SECTION */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 md:pb-20 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-8 sm:px-8 sm:py-12 shadow-lg sm:shadow-xl">
          {/* Decorative shapes */}
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-bold text-white backdrop-blur">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              UTILAI
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Everything you need,
              <br />
              all in one place.
            </h2>

            <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-blue-100">
              Simple and practical tools for PDFs, images, developers, text, productivity, and more — built to feel effortless.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}