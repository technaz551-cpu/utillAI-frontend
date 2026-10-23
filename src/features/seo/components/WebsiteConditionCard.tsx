"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert } from "lucide-react";

import type { WebsiteCondition } from "@/features/seo/types";

const STATUS_STYLE: Record<
  WebsiteCondition["overall_status"],
  { bg: string; border: string; text: string; icon: typeof CheckCircle2 }
> = {
  healthy: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
    icon: CheckCircle2,
  },
  needs_attention: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-950",
    icon: AlertTriangle,
  },
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-950",
    icon: ShieldAlert,
  },
  unknown: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-800",
    icon: HelpCircle,
  },
};

const METRIC_STYLE: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  warn: "bg-amber-100 text-amber-900 ring-amber-200",
  bad: "bg-red-100 text-red-900 ring-red-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  unknown: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function WebsiteConditionCard({
  projectId,
  condition,
}: {
  projectId: string;
  condition: WebsiteCondition | null | undefined;
}) {
  if (!condition) return null;

  const style = STATUS_STYLE[condition.overall_status] ?? STATUS_STYLE.unknown;
  const Icon = style.icon;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${style.border} ${style.bg}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-3">
          <Icon className={`mt-0.5 h-8 w-8 shrink-0 ${style.text}`} aria-hidden />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Website condition (right now)
            </p>
            <h2 className={`mt-1 text-xl font-bold ${style.text}`}>{condition.overall_label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">{condition.headline}</p>
            {condition.audited_at ? (
              <p className="mt-1 text-xs text-slate-500">
                Based on last audit: {condition.audited_at.slice(0, 16).replace("T", ", ")}
                {condition.audit_status ? ` · ${condition.audit_status}` : ""}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/tools/seo/platform/${projectId}/site-audit`}
            className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white"
          >
            Site Audit
          </Link>
          <Link
            href={`/tools/seo/platform/${projectId}/on-page-seo`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
          >
            View issues
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {condition.metrics.map((m) => (
          <span
            key={m.label}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${METRIC_STYLE[m.status] || METRIC_STYLE.neutral}`}
          >
            <span className="opacity-80">{m.label}:</span>
            <span className="font-bold">{m.value}</span>
          </span>
        ))}
      </div>

      {condition.recommendations.length > 0 ? (
        <div className="mt-4 rounded-xl border border-white/60 bg-white/70 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">What to do next</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {condition.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
