import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — UtilAI",
  description: "Privacy Policy for UtilAI.",
};

const sections = [
  {
    title: "1. Introduction",
    content: (
      <p>
        Welcome to UtilAI. We value your privacy and are committed to being transparent about how information may be collected, used, and protected when you visit our website and use our online tools. This Privacy Policy explains our practices regarding information and the choices available to you.
      </p>
    ),
  },
  {
    title: "2. Information We Collect",
    content: (
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Information you provide: Information you submit through contact forms, feedback forms, or support requests.</li>
        <li>Usage information: Information about how you interact with our website, including pages visited, tools used, browser type, device information, and approximate location derived from your IP address.</li>
        <li>Technical information: Server logs and diagnostic information used to maintain website security, reliability, and performance.</li>
      </ul>
    ),
  },
  {
    title: "3. How We Use Information",
    content: (
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Operate and maintain UtilAI.</li>
        <li>Provide and improve our online tools.</li>
        <li>Respond to questions and support requests.</li>
        <li>Diagnose technical problems and prevent misuse.</li>
        <li>Understand website usage and improve user experience.</li>
        <li>Comply with legal obligations.</li>
        <li>Support advertising and measurement services, where applicable.</li>
      </ul>
    ),
  },
  {
    title: "4. Cookies and Similar Technologies",
    content: (
      <div className="space-y-4">
        <p>UtilAI and its service providers may use cookies or similar technologies to maintain website functionality, understand website usage, remember preferences, and support advertising where enabled.</p>
        <p>You can manage cookies through your browser settings. Blocking certain cookies may affect some website features.</p>
        <p>Where required by applicable law, we will request consent before using technologies that require it.</p>
      </div>
    ),
  },
  {
    title: "5. Advertising and Google AdSense",
    content: (
      <div className="space-y-4">
        <p>UtilAI may display advertisements provided by Google AdSense or other advertising partners.</p>
        <p>Third-party advertising providers may use cookies, web beacons, IP addresses, or similar technologies to deliver, measure, and personalise advertisements, subject to applicable settings, consent requirements, and their own privacy policies.</p>
        <p>Google&apos;s advertising technologies may use information about visits to this and other websites to provide advertisements. Users can learn more about Google&apos;s advertising practices and manage available ad personalisation settings through Google&apos;s advertising controls.</p>
        <p>
          For more information, please visit Google&apos;s Privacy Policy:{" "}
          <a className="text-[var(--brand-primary)] underline-offset-4 hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            https://policies.google.com/privacy
          </a>
        </p>
        <p>If advertising services are not yet enabled on UtilAI, this section describes advertising that may be introduced in the future.</p>
      </div>
    ),
  },
  {
    title: "6. Third-Party Services",
    content: (
      <p>We may use third-party services for website analytics, hosting, security, performance, or advertising. These providers may process information according to their own privacy policies and the services configured on our website. We will identify relevant services in this policy as appropriate to the services actually used.</p>
    ),
  },
  {
    title: "7. Files and Tool Inputs",
    content: (
      <div className="space-y-4">
        <p>Some UtilAI tools may allow users to enter text or upload files for processing.</p>
        <p>Please do not submit confidential, sensitive, or personal information unless you understand how the relevant tool processes it. The handling, storage, retention, and deletion of submitted content depend on the tool&apos;s implementation.</p>
        <p>UtilAI will describe its actual file-processing practices, including whether submitted content is stored, how long it is retained, and whether third-party providers process it.</p>
      </div>
    ),
  },
  {
    title: "8. Data Security and Retention",
    content: (
      <div className="space-y-4">
        <p>We take reasonable measures designed to protect information against unauthorised access, loss, misuse, or alteration.</p>
        <p>Information is retained only for as long as reasonably necessary for the purposes for which it was collected, subject to legal, security, and operational requirements.</p>
        <p>No method of transmission or electronic storage can be guaranteed to be completely secure.</p>
      </div>
    ),
  },
  {
    title: "9. Your Privacy Rights",
    content: (
      <p>Depending on your location and applicable law, you may have rights to request access to, correction of, or deletion of certain personal information, or to object to or restrict particular processing. To make a privacy-related request, contact us using the details below. We may need to verify your identity before responding.</p>
    ),
  },
  {
    title: "10. Children's Privacy",
    content: (
      <p>UtilAI is not intended to knowingly collect personal information from children in circumstances where parental consent is required. If you believe a child has provided personal information inappropriately, please contact us so that we can review the matter.</p>
    ),
  },
  {
    title: "11. External Links",
    content: (
      <p>Our website may contain links to third-party websites. We do not control their privacy practices and encourage you to review their privacy policies before providing information to them.</p>
    ),
  },
  {
    title: "12. Changes to This Policy",
    content: (
      <p>We may update this Privacy Policy to reflect changes to our website, services, or legal requirements. The updated version will be published on this page with a revised &quot;Last Updated&quot; date.</p>
    ),
  },
  {
    title: "13. Contact Us",
    content: (
      <div className="space-y-2">
        <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
        <p>Website: <a className="text-[var(--brand-primary)] underline-offset-4 hover:underline" href="https://utillai.technaz.com.au/">https://utillai.technaz.com.au/</a></p>
        <p>Email: <a className="text-[var(--brand-primary)] underline-offset-4 hover:underline" href="mailto:hello@technaz.com.au">hello@technaz.com.au</a></p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="section-shell py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            <Shield className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            Legal
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-5xl">
            Privacy Policy
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
          <Link className="transition-colors hover:text-[var(--foreground)]" href="/terms">
            Terms of Service
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
