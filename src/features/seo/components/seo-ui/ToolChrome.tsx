"use client";

export function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}

export function ProviderNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      {children}
    </div>
  );
}

export function ToolTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200 pb-0">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
            active === t.id
              ? "border border-b-0 border-slate-200 bg-white text-[#4f46e5]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ScoreGauge({ score, label }: { score: number | null | undefined; label: string }) {
  const v = score ?? 0;
  const color = v >= 90 ? "#22c55e" : v >= 50 ? "#f97316" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-24 w-24 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(${color} ${v * 3.6}deg, #e2e8f0 0deg)` }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold">
          {score != null ? Math.round(v) : "—"}
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-600">{label}</p>
    </div>
  );
}

export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
