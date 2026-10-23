"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { SectionIntro } from "@/features/seo/components/seo-ui/ToolChrome";
import { scoreSeoContent } from "@/features/seo/utils/seoWritingScore";

const STORAGE_PREFIX = "utilai_seo_writing_";

export function SeoWritingAssistantView({
  projectId,
  defaultKeyword,
}: {
  projectId: string;
  defaultKeyword?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");
  const [targetKeyword, setTargetKeyword] = useState(defaultKeyword || "");
  const [docTitle, setDocTitle] = useState("Untitled document");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${projectId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { html?: string; title?: string; keyword?: string };
        if (parsed.html) setHtml(parsed.html);
        if (parsed.title) setDocTitle(parsed.title);
        if (parsed.keyword) setTargetKeyword(parsed.keyword);
      }
    } catch {
      /* ignore */
    }
  }, [projectId]);

  useEffect(() => {
    if (editorRef.current && html && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [html]);

  const persist = useCallback(
    (nextHtml: string, title: string, kw: string) => {
      localStorage.setItem(
        `${STORAGE_PREFIX}${projectId}`,
        JSON.stringify({ html: nextHtml, title, keyword: kw }),
      );
    },
    [projectId],
  );

  const onInput = () => {
    const next = editorRef.current?.innerHTML || "";
    setHtml(next);
    persist(next, docTitle, targetKeyword);
  };

  const scores = useMemo(() => scoreSeoContent(html, targetKeyword), [html, targetKeyword]);

  const radarData = [
    { metric: "Readability", value: scores.readability },
    { metric: "SEO", value: scores.seo },
    { metric: "Tone", value: scores.tone },
    { metric: "Originality", value: scores.originality },
  ];

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    onInput();
  };

  const plainLength = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;

  return (
    <div className="space-y-4">
      <SectionIntro
        title="SEO Writing Assistant"
        description="Write or paste content — get live scores for SEO, readability, tone, and originality. Saves locally in your browser for this project."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <input
          className="min-w-[200px] flex-1 text-lg font-bold text-slate-900 outline-none"
          value={docTitle}
          onChange={(e) => {
            setDocTitle(e.target.value);
            persist(html, e.target.value, targetKeyword);
          }}
        />
        <input
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
          placeholder="Target keyword"
          value={targetKeyword}
          onChange={(e) => {
            setTargetKeyword(e.target.value);
            persist(html, docTitle, e.target.value);
          }}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
            {[
              { label: "H1", cmd: () => exec("formatBlock", "h1") },
              { label: "H2", cmd: () => exec("formatBlock", "h2") },
              { label: "H3", cmd: () => exec("formatBlock", "h3") },
              { label: "B", cmd: () => exec("bold") },
              { label: "I", cmd: () => exec("italic") },
              { label: "• List", cmd: () => exec("insertUnorderedList") },
              { label: "1. List", cmd: () => exec("insertOrderedList") },
            ].map(({ label, cmd }) => (
              <button
                key={label}
                type="button"
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={cmd}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            ref={editorRef}
            className="min-h-[420px] p-5 text-sm leading-relaxed text-slate-800 outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
            contentEditable
            suppressContentEditableWarning
            onInput={onInput}
          />
          <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">{plainLength} words</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-slate-500">Content score</p>
            <p className="mt-1 text-sm text-slate-600">
              {plainLength < 20 ? "Start writing to get the score…" : "Live analysis (heuristic — not a plagiarism API)."}
            </p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {radarData.map((d) => (
                <div key={d.metric} className="rounded-lg bg-slate-50 py-2">
                  <p className="text-slate-500">{d.metric}</p>
                  <p className="text-lg font-bold text-slate-900">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
          {scores.tips.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm">
              <p className="font-semibold text-amber-900">Recommendations</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-amber-950">
                {scores.tips.slice(0, 6).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
