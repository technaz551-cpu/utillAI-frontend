"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, CircleHelp, ImagePlus, LogOut, Sparkles } from "lucide-react";
import {
  clearStoredUser,
  ensureValidSession,
  fetchUserProfile,
  getStoredUser,
  type AuthUser,
  type UserProfile,
} from "@/lib/auth";
import { BACKGROUND_OPTIONS, getPreferences, setPreferences, type UserPreferences } from "@/lib/preferences";
import { btn } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setLocalPreferences] = useState<UserPreferences>(getPreferences());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const ok = await ensureValidSession();
      if (!ok) {
        window.location.href = "/login?next=/profile";
        return;
      }
      setUser(getStoredUser());
      const remote = await fetchUserProfile();
      setProfile(remote);
      setLoading(false);
    })();
  }, []);

  const updatePreferences = (next: Partial<UserPreferences>) => {
    setPreferences(next);
    setLocalPreferences(getPreferences());
  };

  const uploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePreferences({ avatar: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const signOut = () => {
    clearStoredUser();
    window.location.href = "/";
  };

  if (loading || !user) return null;
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "—";

  return (
    <main className="section-shell py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Account settings</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)]">Your profile</h1>
            <p className="mt-2 text-[var(--muted)]">One account for tools, SEO platform, and saved preferences.</p>
          </div>
          <button type="button" onClick={signOut} className={btn("secondary") + " !rounded-full !px-4"}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <div className="relative">
                {preferences.avatar ? (
                  <div aria-label={user.name} role="img" className="h-20 w-20 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${preferences.avatar})` }} />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--brand-primary)] text-2xl font-black text-white">{initials}</div>
                )}
                <label className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-[var(--surface)] bg-[var(--brand-primary)] text-white" title="Change profile picture">
                  <ImagePlus className="h-4 w-4" />
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="sr-only" />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">{profile?.full_name || user.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
              </div>
            </div>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
                <dt className="text-[var(--muted)]">Plan</dt>
                <dd className="font-semibold capitalize text-[var(--foreground)]">{profile?.plan || "free"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
                <dt className="text-[var(--muted)]">Role</dt>
                <dd className="font-semibold capitalize text-[var(--foreground)]">{profile?.role || "user"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Member since</dt>
                <dd className="font-semibold text-[var(--foreground)]">{memberSince}</dd>
              </div>
            </dl>

            <Link
              href="/tools/seo/platform"
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#4f46e5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4338ca]"
            >
              <Sparkles className="h-4 w-4" />
              Open SEO Platform
            </Link>

            <p className="mt-4 rounded-2xl bg-[var(--surface-alt)] p-4 text-xs text-[var(--muted)]">
              You stay signed in on this browser until you log out. Session renews automatically for up to 7 days.
            </p>
          </section>

          <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-card)]">
            <div className="border-b border-[var(--border)] pb-5">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Workspace settings</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Personalize your language and background.</p>
            </div>

            <div className="mt-7 border-t border-[var(--border)] pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Workspace background</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">Pick a background like a desktop wallpaper.</p>
                </div>
                <CircleHelp className="h-5 w-5 text-[var(--muted)]" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BACKGROUND_OPTIONS.map((option) => (
                  <button key={option.id} type="button" onClick={() => updatePreferences({ background: option.value })} className={`relative h-20 overflow-hidden rounded-2xl border-2 text-left transition hover:-translate-y-0.5 ${preferences.background === option.value ? "border-[var(--brand-primary)]" : "border-[var(--border)]"}`} style={option.value ? { backgroundImage: `url(${option.value})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                    {!option.value && <span className="absolute inset-0 bg-[var(--surface-alt)]" />}
                    <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/45 px-2 py-1 text-[10px] font-bold text-white">{option.label}</span>
                    {preferences.background === option.value && <Check className="absolute right-2 top-2 h-4 w-4 rounded-full bg-[var(--brand-primary)] p-0.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] hover:underline">
              <CircleHelp className="h-4 w-4" /> Need help? Contact support
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
