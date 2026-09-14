import { Mail, MapPin, Phone } from "lucide-react";
import { btn, card } from "@/lib/utils";

export default function ContactPage() {
  return (
    <main className="section-shell py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Contact</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] md:text-6xl">Let’s talk about your next project.</h1>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className={card("p-6") + " group hover:bg-[var(--brand-primary)] hover:text-white"}>
            <Mail className="h-5 w-5 text-[var(--brand-primary)] group-hover:text-white" />
            <h2 className="mt-4 text-xl font-bold text-[var(--foreground)] group-hover:text-white">Email</h2>
            <p className="mt-2 text-sm text-[var(--muted)] group-hover:text-white/80">hello@technaz.com.au</p>
          </div>
          <div className={card("p-6") + " group hover:bg-[var(--brand-primary)] hover:text-white"}>
            <Phone className="h-5 w-5 text-[var(--brand-primary)] group-hover:text-white" />
            <h2 className="mt-4 text-xl font-bold text-[var(--foreground)] group-hover:text-white">Phone</h2>
            <p className="mt-2 text-sm text-[var(--muted)] group-hover:text-white/80">+61 400 000 000</p>
          </div>
          <div className={card("p-6") + " group hover:bg-[var(--brand-primary)] hover:text-white"}>
            <MapPin className="h-5 w-5 text-[var(--brand-primary)] group-hover:text-white" />
            <h2 className="mt-4 text-xl font-bold text-[var(--foreground)] group-hover:text-white">Location</h2>
            <p className="mt-2 text-sm text-[var(--muted)] group-hover:text-white/80">Australia-wide support</p>
          </div>
        </div>

        <form className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Full name
              <input type="text" placeholder="Your name" className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none focus:border-[var(--brand-primary)]" />
            </label>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Email
              <input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none focus:border-[var(--brand-primary)]" />
            </label>
          </div>

          <label className="mt-5 block text-sm font-medium text-[var(--foreground)]">
            Company
            <input type="text" placeholder="Your company" className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none focus:border-[var(--brand-primary)]" />
          </label>

          <label className="mt-5 block text-sm font-medium text-[var(--foreground)]">
            Message
            <textarea rows={5} placeholder="Tell us about your project" className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none focus:border-[var(--brand-primary)]" />
          </label>

          <button type="submit" className={btn("primary") + " mt-6 !rounded-full"}>Send message</button>
        </form>
      </div>
    </main>
  );
}
