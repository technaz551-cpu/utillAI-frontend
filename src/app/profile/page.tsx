// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { Check, CircleHelp, ImagePlus, Languages, LogOut } from "lucide-react";
// import { clearStoredUser, getStoredUser, type AuthUser } from "@/lib/auth";
// import { BACKGROUND_OPTIONS, getPreferences, setPreferences, type UserPreferences } from "@/lib/preferences";
// import { btn } from "@/lib/utils";

// export default function ProfilePage() {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [preferences, setLocalPreferences] = useState<UserPreferences>(getPreferences());

//   useEffect(() => {
//     const storedUser = getStoredUser();
//     setUser(storedUser);
//     if (!storedUser) window.location.href = "/login";
//   }, []);

//   const updatePreferences = (next: Partial<UserPreferences>) => {
//     setPreferences(next);
//     setLocalPreferences(getPreferences());
//   };

//   const uploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => updatePreferences({ avatar: String(reader.result) });
//     reader.readAsDataURL(file);
//   };

//   const signOut = () => {
//     clearStoredUser();
//     window.location.href = "/";
//   };

//   if (!user) return null;
//   const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

//   return (
//     <main className="section-shell py-12 md:py-16">
//       <div className="mx-auto max-w-5xl">
//         <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Account settings</p>
//             <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)]">Your profile</h1>
//             <p className="mt-2 text-[var(--muted)]">Personalize your UtilAI workspace.</p>
//           </div>
//           <button type="button" onClick={signOut} className={btn("secondary") + " !rounded-full !px-4"}>
//             <LogOut className="mr-2 h-4 w-4" /> Log out
//           </button>
//         </div>

//         <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
//           <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-card)]">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 {preferences.avatar ? (
//                   <div aria-label={user.name} role="img" className="h-20 w-20 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${preferences.avatar})` }} />
//                 ) : (
//                   <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--brand-primary)] text-2xl font-black text-white">{initials}</div>
//                 )}
//                 <label className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-[var(--surface)] bg-[var(--brand-primary)] text-white" title="Change profile picture">
//                   <ImagePlus className="h-4 w-4" />
//                   <input type="file" accept="image/*" onChange={uploadAvatar} className="sr-only" />
//                 </label>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-[var(--foreground)]">{user.name}</h2>
//                 <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
//               </div>
//             </div>
//             <div className="mt-8 rounded-2xl bg-[var(--surface-alt)] p-4 text-sm text-[var(--muted)]">
//               Your picture is stored in this browser and is not uploaded to the server.
//             </div>
//           </section>

//           <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-card)]">
//             <div className="border-b border-[var(--border)] pb-5">
//               <h2 className="text-xl font-bold text-[var(--foreground)]">Workspace settings</h2>
//               <p className="mt-1 text-sm text-[var(--muted)]">Personalize your language and background.</p>
//             </div>

//             {/* <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]">
//               <span className="flex items-center gap-2"><Languages className="h-4 w-4 text-[var(--brand-primary)]" /> Language</span>
//               <select
//                 value={preferences.language}
//                 onChange={(event) =>
//                   updatePreferences({
//                     language: event.target.value,
//                   })
//                 }
//                 className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-normal text-[var(--foreground)] outline-none focus:border-[var(--brand-primary)]"
//               >
//                 <option value="en">English</option>
//                 <option value="ur">Urdu</option>
//                 <option value="es">Spanish</option>
//                 <option value="ar">Arabic</option>
//                 <option value="zh">Chinese</option>
//                 <option value="ja">Japanese</option>
//                 <option value="ko">Korean</option>
//               </select>
//             </label> */}

//             <div className="mt-7 border-t border-[var(--border)] pt-6">
//               <div className="flex items-center justify-between gap-3">
//                 <div>
//                   <h3 className="font-semibold text-[var(--foreground)]">Workspace background</h3>
//                   <p className="mt-1 text-sm text-[var(--muted)]">Pick a background like a desktop wallpaper.</p>
//                 </div>
//                 <CircleHelp className="h-5 w-5 text-[var(--muted)]" />
//               </div>
//               <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {BACKGROUND_OPTIONS.map((option) => (
//                   <button key={option.id} type="button" onClick={() => updatePreferences({ background: option.value })} className={`relative h-20 overflow-hidden rounded-2xl border-2 text-left transition hover:-translate-y-0.5 ${preferences.background === option.value ? "border-[var(--brand-primary)]" : "border-[var(--border)]"}`} style={option.value ? { backgroundImage: `url(${option.value})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
//                     {!option.value && <span className="absolute inset-0 bg-[var(--surface-alt)]" />}
//                     <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/45 px-2 py-1 text-[10px] font-bold text-white">{option.label}</span>
//                     {preferences.background === option.value && <Check className="absolute right-2 top-2 h-4 w-4 rounded-full bg-[var(--brand-primary)] p-0.5 text-white" />}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <Link href="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] hover:underline">
//               <CircleHelp className="h-4 w-4" /> Need help? Contact support
//             </Link>
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, CircleHelp, ImagePlus, Languages, LogOut } from "lucide-react";
import { clearStoredUser, getStoredUser, type AuthUser } from "@/lib/auth";
import { BACKGROUND_OPTIONS, getPreferences, setPreferences, type UserPreferences } from "@/lib/preferences";
import { btn } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [preferences, setLocalPreferences] = useState<UserPreferences>(getPreferences());

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    if (!storedUser) window.location.href = "/login";
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

  if (!user) return null;
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="section-shell py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Account settings</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[var(--foreground)]">Your profile</h1>
            <p className="mt-2 text-slate-500">Personalize your UtilAI workspace.</p>
          </div>
          <button type="button" onClick={signOut} className={btn("secondary") + " !rounded-full !px-4"}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[30px] border border-[var(--border)] bg-white p-7 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                {preferences.avatar ? (
                  <div aria-label={user.name} role="img" className="h-20 w-20 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${preferences.avatar})` }} />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-2xl font-black text-white">{initials}</div>
                )}
                <label className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white" title="Change profile picture">
                  <ImagePlus className="h-4 w-4" />
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="sr-only" />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">{user.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Your picture is stored in this browser and is not uploaded to the server.
            </div>
          </section>

          <section className="rounded-[30px] border border-[var(--border)] bg-white p-7 shadow-xl">
            <div className="border-b border-[var(--border)] pb-5">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Workspace settings</h2>
              <p className="mt-1 text-sm text-slate-500">Personalize your language and background.</p>
            </div>

            {/* <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]">
              <span className="flex items-center gap-2"><Languages className="h-4 w-4 text-blue-600" /> Language</span>
              <select
                value={preferences.language}
                onChange={(event) =>
                  updatePreferences({
                    language: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-slate-50 px-4 py-3 font-normal text-[var(--foreground)] outline-none focus:border-blue-600"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="es">Spanish</option>
                <option value="ar">Arabic</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </label> */}

            <div className="mt-7 border-t border-[var(--border)] pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Workspace background</h3>
                  <p className="mt-1 text-sm text-slate-500">Pick a background like a desktop wallpaper.</p>
                </div>
                <CircleHelp className="h-5 w-5 text-slate-500" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BACKGROUND_OPTIONS.map((option) => (
                  <button key={option.id} type="button" onClick={() => updatePreferences({ background: option.value })} className={`relative h-20 overflow-hidden rounded-2xl border-2 text-left transition hover:-translate-y-0.5 ${preferences.background === option.value ? "border-blue-600" : "border-[var(--border)]"}`} style={option.value ? { backgroundImage: `url(${option.value})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                    {!option.value && <span className="absolute inset-0 bg-slate-50" />}
                    <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/45 px-2 py-1 text-[10px] font-bold text-white">{option.label}</span>
                    {preferences.background === option.value && <Check className="absolute right-2 top-2 h-4 w-4 rounded-full bg-blue-600 p-0.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
              <CircleHelp className="h-4 w-4" /> Need help? Contact support
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}