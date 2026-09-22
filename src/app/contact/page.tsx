import {
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Clock,
} from "lucide-react";

const contactItems = [
  {
    title: "Email",
    value: "hello@technaz.com.au",
    description: "Send us an email and we'll get back to you.",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+61 400 000 000",
    description: "Talk directly with our support team.",
    icon: Phone,
  },
  {
    title: "Location",
    value: "Australia-wide support",
    description: "Supporting customers wherever they are.",
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/70 via-white to-sky-50/40">
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100 px-6 py-16 lg:px-12">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-3xl pt-6 sm:pt-10">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-orange-500" />

              <span>Contact UtilAI</span>

              <span className="text-blue-200">•</span>

              <span className="text-slate-500">
                We're here to help
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[64px]">
              Let&apos;s talk about
              <br />

              <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                your next project.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Have a question, need help with a tool, or want to
              discuss an idea? Send us a message and our team will
              be happy to help.
            </p>

            {/* Small information pills */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Quick response
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                Support available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CONTACT CONTENT */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ===================================================== */}
          {/* CONTACT INFO */}
          {/* ===================================================== */}

          <div>
            <div className="mb-7">
              <span className="inline-flex rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-bold text-blue-600 shadow-sm">
                Get in touch
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                We&apos;d love to
                <span className="text-blue-600"> hear from you.</span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                Choose the easiest way to reach us. Whether you have
                a question or need assistance, we're ready to help.
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-4">
              {contactItems.map(
                ({ title, value, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="group relative isolate overflow-hidden rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
                  >
                    {/* Full card hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-blue-600 via-blue-600 to-sky-500 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20 group-hover:bg-white/20 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-white">
                          {title}
                        </h3>

                        <p className="mt-1 break-words text-sm font-semibold text-blue-600 transition-colors group-hover:text-white">
                          {value}
                        </p>

                        <p className="mt-1.5 text-sm leading-6 text-slate-500 transition-colors group-hover:text-white/80">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ===================================================== */}
          {/* CONTACT FORM */}
          {/* ===================================================== */}

          <div className="relative overflow-hidden rounded-[30px] border border-blue-100 bg-white p-6 shadow-[0_20px_60px_rgba(37,99,235,0.10)] sm:p-8">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

            <div className="relative">
              {/* Form heading */}
              <div className="mb-7">
                <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                  Send a message
                </span>

                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Tell us what you need.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill out the form below and we'll get back to you.
                </p>
              </div>

              <form>
                {/* Name + Email */}
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Full name

                    <input
                      type="text"
                      placeholder="Your name"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    Email

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>

                {/* Company */}
                <label className="mt-5 block text-sm font-semibold text-slate-700">
                  Company

                  <input
                    type="text"
                    placeholder="Your company"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                {/* Message */}
                <label className="mt-5 block text-sm font-semibold text-slate-700">
                  Message

                  <textarea
                    rows={6}
                    placeholder="Tell us about your project..."
                    className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200"
                >
                  Send message

                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BOTTOM CTA */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-600 to-sky-500 px-7 py-10 shadow-xl shadow-blue-200/50 sm:px-10 sm:py-12">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              UTILAI
            </div>

            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Have an idea?
              <br />
              Let&apos;s make it happen.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              We&apos;re always happy to hear feedback, answer questions,
              and learn how UtilAI can make your workflow easier.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}