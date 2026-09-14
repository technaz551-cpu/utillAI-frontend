"use client";

import Link from "next/link";
import { useState } from "react";
import { setStoredUser } from "@/lib/auth";
import { btn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    const nameFromEmail = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    setStoredUser({
      id: `user_${Date.now()}`,
      name: nameFromEmail || "UtilAI User",
      email,
      token: `demo_${Date.now()}`,
    });

    window.location.href = "/";
  };

  return (
    <main className="section-shell flex items-center justify-center py-16 md:py-24">
      <div className="w-full max-w-md rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Welcome back</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[var(--foreground)]">Login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Access your toolkit and saved workflows.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className={btn("primary") + " mt-2 w-full !justify-center !rounded-full"}>Login</button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Don’t have an account? <Link href="/register" className="font-semibold text-[var(--brand-primary)]">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
