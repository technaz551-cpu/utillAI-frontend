"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredUser, type AuthUser } from "@/lib/auth";
import { getPreferences } from "@/lib/preferences";

export function AuthStatus() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    const syncPreferences = () => setAvatar(getPreferences().avatar);
    syncUser();
    syncPreferences();

    window.addEventListener("auth:state-change", syncUser);
    window.addEventListener("preferences:change", syncPreferences);
    return () => {
      window.removeEventListener("auth:state-change", syncUser);
      window.removeEventListener("preferences:change", syncPreferences);
    };
  }, []);

  if (user) {
    const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return (
      <div className="flex items-center gap-2">
        <Link href="/profile" className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-2 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white">
          {avatar ? (
            <span aria-label="Profile picture" role="img" className="h-7 w-7 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${avatar})` }} />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[10px] font-bold text-white">{initials}</span>
          )}
          <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
        </Link>
      </div>
    );
  }

  return (
    <Link href="/login" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white">
      Sign in
    </Link>
  );
}
