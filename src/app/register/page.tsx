"use client";

import Link from "next/link";
import { useState } from "react";
import { setStoredUser } from "@/lib/auth";
import { btn } from "@/lib/utils";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setStoredUser({
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      token: `demo_${Date.now()}`,
    });

    window.location.href = "/";
  };

  return (
    <main className="section-shell flex items-center justify-center py-16 md:py-24">
      <div className="w-full max-w-md rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Create account</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[var(--foreground)]">Sign up</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Start using UtilAI with a free account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Full name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--foreground)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--foreground)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className={btn("primary") + " mt-2 w-full !justify-center !rounded-full"}>Create account</button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Already have an account? <Link href="/login" className="font-semibold text-[var(--brand-primary)]">Login</Link>
        </p>
      </div>
    </main>
  );
}
