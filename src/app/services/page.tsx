// import Link from "next/link";
// import { FileText, Shield, Search, ArrowRight } from "lucide-react";

// export const metadata = {
//   title: "Services — UtilAI",
//   description: "Overview of UtilAI services and platform capabilities.",
// };

// export default function ServicesPage() {
//   const services = [
//     {
//       icon: FileText,
//       title: "PDF Tools",
//       description:
//         "Merge, split, compress, convert, protect and edit PDFs online with fast, secure processing.",
//       href: "/tools/pdf",
//     },
//     {
//       icon: Search,
//       title: "SEO Platform",
//       description:
//         "Manage SEO projects, run audits, track issues and get actionable insights to improve visibility.",
//       href: "/tools/seo/platform",
//     },
//     {
//       icon: Shield,
//       title: "Image & Privacy Tools",
//       description:
//         "Compress, convert, resize and remove backgrounds while keeping your files secure and private.",
//       href: "/tools/image",
//     },
//   ];

//   return (
//     <main className="section-shell py-16 md:py-20">
//       <div className="mx-auto max-w-6xl">
//         <div className="max-w-2xl">
//           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
//             Services
//           </p>
//           <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-5xl">
//             Practical tools for everyday work
//           </h1>
//           <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
//             UtilAI brings together fast, reliable utilities and an SEO platform to help you create, convert, optimise and get more done.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {services.map((service) => {
//             const Icon = service.icon;
//             return (
//               <Link
//                 key={service.title}
//                 href={service.href}
//                 className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[0_40px_80px_-60px_rgba(15,23,42,0.9)]"
//               >
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
//                   <Icon className="h-5 w-5" />
//                 </div>
//                 <h2 className="mt-6 text-xl font-bold tracking-tight text-[var(--foreground)]">
//                   {service.title}
//                 </h2>
//                 <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
//                   {service.description}
//                 </p>
//                 <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)]">
//                   Explore
//                   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }



import Link from "next/link";

export const metadata = {
  title: "Terms of Service — UtilAI",
  description:
    "Read the Terms of Service governing your access to and use of UtilAI online tools and services.",
};

const sections = [
  {
    title: "1. Introduction",
    content: (
      <p>
        These Terms of Service govern your access to and use of the UtilAI
        website and its online tools. By using UtilAI, you agree to these
        Terms. If you disagree, please discontinue use of the website.
      </p>
    ),
  },
  {
    title: "2. About UtilAI",
    content: (
      <p>
        UtilAI provides online utilities that may include AI tools, text
        utilities, PDF and image tools, converters, calculators, developer
        tools, and other web-based services. Features may change over time.
      </p>
    ),
  },
  {
    title: "3. Acceptable Use",
    content: (
      <>
        <p>You agree to use UtilAI lawfully and not to:</p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Engage in fraudulent, illegal, or harmful activities.</li>
          <li>Attempt unauthorised access to systems or user information.</li>
          <li>Upload malicious files or code.</li>
          <li>Disrupt website security or availability.</li>
          <li>
            Violate another person's privacy or intellectual property rights.
          </li>
          <li>Abuse or bypass reasonable usage restrictions.</li>
        </ul>
        <p className="mt-4">
          We may restrict access when reasonably necessary to protect the
          website and its users.
        </p>
      </>
    ),
  },
  {
    title: "4. User Content and Files",
    content: (
      <p>
        You are responsible for the text, images, documents, and other content
        you submit. You must have the necessary rights to use that content and
        must not submit unlawful or infringing material. You retain any rights
        you hold in your submitted content. File processing, storage, and
        deletion depend on the relevant tool's actual functionality.
      </p>
    ),
  },
  {
    title: "5. Tool Results and AI Outputs",
    content: (
      <p>
        Tool results may contain errors or inaccuracies. AI-generated content
        may be incomplete or unexpected. You are responsible for reviewing and
        verifying results before relying on, publishing, or distributing them,
        particularly for important decisions. We do not guarantee that every
        result will be accurate, complete, or suitable for every purpose.
      </p>
    ),
  },
  {
    title: "6. Intellectual Property",
    content: (
      <p>
        UtilAI's branding, design, original content, and software may be
        protected by intellectual property laws. You may not copy or
        commercially exploit protected website materials without permission,
        except where permitted by law.
      </p>
    ),
  },
  {
    title: "7. Third-Party Services",
    content: (
      <p>
        UtilAI may use or link to third-party services. Those services may
        operate under their own terms and privacy policies. We do not control
        external websites or their practices.
      </p>
    ),
  },
  {
    title: "8. Availability and Changes",
    content: (
      <p>
        We aim to keep UtilAI available but do not guarantee uninterrupted
        service or error-free operation. We may update, modify, suspend, or
        discontinue tools when necessary.
      </p>
    ),
  },
  {
    title: "9. Disclaimer and Liability",
    content: (
      <p>
        To the extent permitted by applicable law, UtilAI is provided on an
        “as is” and “as available” basis. Nothing in these Terms excludes
        rights or liabilities that cannot legally be excluded. Any limitation
        of liability applies only to the extent permitted by applicable law.
      </p>
    ),
  },
  {
    title: "10. Changes to These Terms",
    content: (
      <p>
        We may update these Terms from time to time. The latest version will
        be published on this page with a revised date.
      </p>
    ),
  },
  {
    title: "11. Applicable Law",
    content: (
      <p>
        These Terms are subject to applicable law. Any governing-law provisions
        must be consistent with the laws that apply to the website operator
        and the user.
      </p>
    ),
  },
  {
    title: "12. Contact Us",
    content: (
      <>
        <p>
          For questions about these Terms of Service, contact us using the
          details below.
        </p>
        <div className="mt-4 space-y-2">
          <p>
            <span className="font-semibold text-[var(--foreground)]">
              Website:{" "}
            </span>
            <a
              href="https://utillai.technaz.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand-primary)] underline underline-offset-4"
            >
              utillai.technaz.com.au
            </a>
          </p>
          <p>
            <span className="font-semibold text-[var(--foreground)]">
              Email:{" "}
            </span>
            <a
              href="mailto:hello@technaz.com.au"
              className="text-[var(--brand-primary)] underline underline-offset-4"
            >
              hello@technaz.com.au
            </a>
          </p>
        </div>
      </>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="section-shell py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 border-b border-[var(--border)] pb-8 md:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Last Updated: October 26, 2026
          </p>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
            Please read these terms carefully before using UtilAI and its
            online tools and services.
          </p>
        </header>

        <div className="space-y-8 md:space-y-10">
          {sections.map((section) => (
            <section key={section.title} id={`section-${section.title.split(".")[0]}`}>
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
                {section.title}
              </h2>

              <div className="mt-3 text-sm leading-7 text-[var(--muted)] md:text-base">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-[var(--border)] pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition-opacity hover:opacity-80"
          >
            Back to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}
