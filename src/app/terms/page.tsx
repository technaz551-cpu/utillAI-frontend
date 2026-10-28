import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — UtilAI",
  description: "Terms of Service for UtilAI.",
};

const sections = [
  {
    title: "1. Introduction",
    content: (
      <p>
        Welcome to UtilAI. These Terms of Service govern your access to and use of the UtilAI website and its online tools. By accessing or using UtilAI, you agree to these Terms. If you do not agree, please discontinue use of the website.
      </p>
    ),
  },
  {
    title: "2. About UtilAI",
    content: (
      <p>UtilAI provides online utilities that may include AI-powered tools, text utilities, PDF tools, image tools, converters, calculators, developer tools, and other web-based services. The availability and functionality of individual tools may change over time.</p>
    ),
  },
  {
    title: "3. Use of Our Services",
    content: (
      <div className="space-y-4">
        <p>You may use UtilAI for lawful personal or business purposes, subject to these Terms and applicable law.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the website for unlawful, fraudulent, or harmful activities.</li>
          <li>Attempt to gain unauthorised access to our systems or other users&apos; information.</li>
          <li>Interfere with website security, availability, or performance.</li>
          <li>Upload malicious code or files intended to harm systems or users.</li>
          <li>Violate another person&apos;s privacy, intellectual property, or other legal rights.</li>
          <li>Abuse, overload, scrape, or automate access to the services in ways that violate applicable rules or disrupt the website.</li>
        </ul>
        <p>We may restrict access where reasonably necessary to protect the website, its users, or our services.</p>
      </div>
    ),
  },
  {
    title: "4. User Content and Uploaded Files",
    content: (
      <div className="space-y-4">
        <p>You are responsible for the text, images, documents, and other content you submit through UtilAI.</p>
        <p>You must have the rights and permissions required to use and process any content you submit. Do not upload content that is unlawful or infringes another person&apos;s rights.</p>
        <p>Your use of a tool does not transfer ownership of your original content to UtilAI.</p>
        <p>The processing, storage, and deletion of submitted content depend on the relevant tool&apos;s functionality. Please review our Privacy Policy and any tool-specific notices before submitting files or other information.</p>
      </div>
    ),
  },
  {
    title: "5. Tool Results and Accuracy",
    content: (
      <div className="space-y-4">
        <p>UtilAI provides tools for general informational and practical purposes. Results may contain errors, omissions, or inaccuracies and may not always meet your requirements.</p>
        <p>You are responsible for reviewing and verifying results before relying on them, particularly for legal, financial, medical, security, or other important decisions.</p>
        <p>Unless expressly stated otherwise, we do not guarantee that every result will be accurate, complete, suitable for a particular purpose, or error-free.</p>
      </div>
    ),
  },
  {
    title: "6. Artificial Intelligence Tools",
    content: (
      <div className="space-y-4">
        <p>Some tools may use artificial intelligence or automated processing. Their outputs may be incomplete, inaccurate, unexpected, or similar to outputs provided to other users.</p>
        <p>You should independently review AI-generated results before publishing, distributing, or relying on them. You are responsible for ensuring that your use of generated content complies with applicable law and third-party rights.</p>
      </div>
    ),
  },
  {
    title: "7. Intellectual Property",
    content: (
      <div className="space-y-4">
        <p>The UtilAI website, including its branding, design, original text, and software components, may be protected by intellectual property laws.</p>
        <p>Except where permitted by law or authorised by the relevant rights holder, you may not copy, redistribute, modify, or commercially exploit protected website materials without permission.</p>
        <p>You retain any rights you hold in content you submit, subject to the permissions necessary to provide the relevant service.</p>
      </div>
    ),
  },
  {
    title: "8. Third-Party Services and Links",
    content: (
      <p>UtilAI may rely on third-party services or provide links to external websites. These services may be governed by separate terms and privacy policies. We are not responsible for third-party websites or services that we do not control. Your use of them is subject to their applicable terms.</p>
    ),
  },
  {
    title: "9. Availability and Changes",
    content: (
      <div className="space-y-4">
        <p>We aim to keep UtilAI available and functioning, but we do not guarantee uninterrupted access or that every tool will always be available.</p>
        <p>We may modify, suspend, or discontinue features when reasonably necessary for maintenance, security, improvement, or operational reasons.</p>
      </div>
    ),
  },
  {
    title: "10. Disclaimer",
    content: (
      <p>To the extent permitted by applicable law, UtilAI is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without warranties that cannot legally be excluded. Nothing in these Terms excludes or limits rights or guarantees that cannot be excluded or limited under applicable law.</p>
    ),
  },
  {
    title: "11. Limitation of Liability",
    content: (
      <p>To the extent permitted by applicable law, UtilAI will not be liable for indirect or consequential losses arising from the use of, or inability to use, the website. Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by law. Any other limitations apply only to the extent legally permitted.</p>
    ),
  },
  {
    title: "12. Changes to These Terms",
    content: (
      <p>We may revise these Terms from time to time. Updated Terms will be published on this page with a revised &quot;Last Updated&quot; date. Your continued use of UtilAI after revised Terms are published constitutes acceptance where permitted by applicable law.</p>
    ),
  },
  {
    title: "13. Governing Law",
    content: (
      <p>These Terms are subject to applicable laws. Any governing-law or jurisdiction provisions will be applied in accordance with the laws that legally apply to the operator and the user.</p>
    ),
  },
  {
    title: "14. Contact Us",
    content: (
      <div className="space-y-2">
        <p>If you have questions about these Terms of Service, please contact us:</p>
        <p>Website: <a className="text-[var(--brand-primary)] underline-offset-4 hover:underline" href="https://utillai.technaz.com.au/">https://utillai.technaz.com.au/</a></p>
        <p>Email: <a className="text-[var(--brand-primary)] underline-offset-4 hover:underline" href="mailto:hello@technaz.com.au">hello@technaz.com.au</a></p>
      </div>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="section-shell py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            <FileText className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            Legal
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">Last Updated: October 26, 2026</p>
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] md:p-10">
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 text-base leading-relaxed text-[var(--muted)]">{section.content}</div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)]">
          <Link className="transition-colors hover:text-[var(--foreground)]" href="/privacy">
            Privacy Policy
          </Link>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <Link className="transition-colors hover:text-[var(--foreground)]" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
