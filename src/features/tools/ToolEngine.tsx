"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Download, Play, RotateCcw, Shield } from "lucide-react";
import { btn, card, inputClass } from "@/lib/utils";
import {
  CLIENT_PROCESSORS,
  CALCULATOR_TOOLS,
  SEO_FORM_TOOLS,
  INTERNET_FORM_TOOLS,
  NO_INPUT_TOOLS,
  ToolMeta,
  type ToolStat,
  type ToolSection,
  type ToolMeter,
} from "@/features/tools/client-processors";
import { FileClientTool } from "./FileClientTool";
import { ServerFileTool } from "./ServerFileTool";
import { SpeedTestTool } from "./SpeedTestTool";
import { PdfTool } from "./PdfTool";
import  PdfEditor from "./pdfeditor/PdfEditor";
import { ImageTool } from "./ImageTool";
import { EmailOtpTool } from "./EmailOtpTool";
import { PDF_TOOL_SLUGS } from "./pdf-catalog";
import { IMAGE_TOOL_SLUGS } from "./image-catalog";
import { EMAIL_OTP_SLUGS } from "./internet-catalog";

interface Props {
  tool: ToolMeta;
}

const OUTPUT_FONTS = [
  { id: "mono", name: "Monospace", family: "var(--font-mono), ui-monospace, Consolas, monospace" },
  { id: "sans", name: "Sans Serif", family: "var(--font-sans), ui-sans-serif, system-ui, sans-serif" },
  { id: "serif", name: "Serif", family: 'Georgia, "Times New Roman", Times, serif' },
  { id: "cursive", name: "Cursive", family: '"Segoe Script", "Comic Sans MS", cursive' },
  { id: "display", name: "Display", family: 'Impact, "Arial Black", sans-serif' },
] as const;

const HUMANIZER_SLUGS = new Set(["human-summarizer", "humanize-text", "ai-likelihood-detector"]);

export function ToolEngine({ tool }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<ToolStat[] | null>(null);
  const [sections, setSections] = useState<ToolSection[] | null>(null);
  const [meter, setMeter] = useState<ToolMeter | null>(null);
  const [outputFont, setOutputFont] = useState<(typeof OUTPUT_FONTS)[number]["id"]>("mono");
  const [error, setError] = useState("");
  const [options, setOptions] = useState<Record<string, unknown>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const isServer = tool.processing_type === "server" || tool.processing_type === "hybrid";
  const isFileClient = ["resize-image", "jpg-to-png", "png-to-jpg", "webp-converter", "rotate-image", "flip-image", "crop-image"].includes(tool.slug);
  const needsTextarea = !CALCULATOR_TOOLS.has(tool.slug) && !SEO_FORM_TOOLS.has(tool.slug) && !NO_INPUT_TOOLS.has(tool.slug);

  useEffect(() => {
    setInput("");
    setOutput("");
    setStats(null);
    setSections(null);
    setMeter(null);
    setOutputFont("mono");
    setError("");
    setOptions({});
    setStatus("idle");
  }, [tool.slug]);

  if (tool.slug === "pdf-editor") {
    return <PdfEditor tool={tool} />;
  }
  if (PDF_TOOL_SLUGS.has(tool.slug)) {
    return <PdfTool tool={tool} />;
  }
  if (IMAGE_TOOL_SLUGS.has(tool.slug)) {
    return <ImageTool tool={tool} />;
  }
  if (isServer && tool.slug !== "compress-image") {
    return <ServerFileTool tool={tool} />;
  }
  if (tool.slug === "internet-speed-test") {
    return <SpeedTestTool />;
  }
  if (EMAIL_OTP_SLUGS.has(tool.slug)) {
    return <EmailOtpTool tool={tool} />;
  }
  if (isFileClient || tool.slug === "compress-image") {
    return <FileClientTool tool={tool} />;
  }

  const run = useCallback(async () => {
    setStatus("processing");
    setError("");
    const processor = CLIENT_PROCESSORS[tool.slug];
    if (!processor) {
      setError("Tool processor not implemented");
      setStatus("error");
      return;
    }
    try {
      const result = await Promise.resolve(processor(input, options));
      if (result.error) {
        setError(result.error);
        setOutput("");
        setStats(null);
        setSections(null);
        setMeter(null);
        setStatus("error");
      } else {
        setOutput(result.output);
        setStats(result.stats?.length ? result.stats : null);
        setSections(result.sections?.length ? result.sections : null);
        setMeter(result.meter ?? null);
        setStatus("success");
      }
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }, [input, options, tool.slug]);

  const copy = () => navigator.clipboard.writeText(output);
  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${tool.slug}-result.txt`;
    a.click();
  };

  const selectedFont = OUTPUT_FONTS.find((f) => f.id === outputFont) ?? OUTPUT_FONTS[0];

  return (
    <div className={card()}>
      {tool.processing_type === "client" && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <p className="text-xs leading-relaxed text-cyan-200/80">
            Runs locally in your browser — your input is never sent to our servers.
          </p>
        </div>
      )}

      {CALCULATOR_TOOLS.has(tool.slug) && <CalculatorFields slug={tool.slug} options={options} setOptions={setOptions} />}
      {SEO_FORM_TOOLS.has(tool.slug) && <SeoFields options={options} setOptions={setOptions} />}
      {INTERNET_FORM_TOOLS.has(tool.slug) && <InternetFields slug={tool.slug} options={options} setOptions={setOptions} />}

      {tool.slug === "case-converter" && (
        <select className={inputClass + " mb-4"} value={String(options.mode || "upper")} onChange={(e) => setOptions({ mode: e.target.value })}>
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="title">Title Case</option>
          <option value="sentence">Sentence case</option>
        </select>
      )}
      {tool.slug === "password-generator" && (
        <div className="mb-4 space-y-3">
          <input type="number" min={4} max={128} placeholder="Length" className={inputClass} defaultValue={16} onChange={(e) => setOptions({ ...options, length: e.target.value })} />
          <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={options.includeNumbers !== false} onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })} />
              Numbers
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={options.includeSymbols !== false} onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })} />
              Symbols
            </label>
          </div>
        </div>
      )}
      {(tool.slug === "text-summarizer" || HUMANIZER_SLUGS.has(tool.slug)) && (
        <input type="number" min={1} max={20} placeholder="Sentences" className={inputClass + " mb-4"} defaultValue={3} onChange={(e) => setOptions({ ...options, sentenceCount: e.target.value })} />
      )}
      {(tool.slug === "keyword-extractor" || tool.slug === "sentiment-analyzer") && (
        <input type="number" min={1} max={50} placeholder="Keyword count" className={inputClass + " mb-4"} defaultValue={10} onChange={(e) => setOptions({ ...options, count: e.target.value })} />
      )}
      {tool.slug === "text-case-converter" && (
        <select className={inputClass + " mb-4"} value={String(options.case || "upper")} onChange={(e) => setOptions({ ...options, case: e.target.value })}>
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="title">Title Case</option>
          <option value="capitalize">Capitalize</option>
        </select>
      )}
      {tool.slug === "random-text-generator" && (
        <input type="number" min={1} max={5000} placeholder="Length" className={inputClass + " mb-4"} defaultValue={100} onChange={(e) => setOptions({ ...options, length: e.target.value })} />
      )}
      {tool.slug === "keyword-density-checker" && (
        <input placeholder="Keyword to analyze" className={inputClass + " mb-4"} onChange={(e) => setOptions({ ...options, keyword: e.target.value })} />
      )}

      {needsTextarea && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholderFor(tool.slug)}
          rows={8}
          className={inputClass + " resize-y font-mono"}
        />
      )}

      {NO_INPUT_TOOLS.has(tool.slug) && (
        <p className="mb-4 text-sm text-[var(--muted)]">
          {tool.slug === "what-is-my-ip" ? "Click Process to fetch your public IP address." : "Click Process to generate a result."}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={run} disabled={status === "processing"} className={btn("primary")}>
          <Play className="mr-2 h-4 w-4" /> {status === "processing" ? "Processing…" : "Process"}
        </button>
        <button onClick={() => { setInput(""); setOutput(""); setStats(null); setSections(null); setMeter(null); setOutputFont("mono"); setError(""); setStatus("idle"); }} className={btn("secondary")}>
          <RotateCcw className="mr-2 h-4 w-4" /> Clear
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {output && HUMANIZER_SLUGS.has(tool.slug) && (
        <HumanizerResult
          meter={meter}
          sections={sections}
          stats={stats}
          onCopyAll={copy}
          onDownload={download}
        />
      )}

      {output && !HUMANIZER_SLUGS.has(tool.slug) && (
        <div className={`mt-6 ${stats || tool.slug === "text-summarizer" ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]" : ""}`}>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Result</span>
              <div className="flex gap-1">
                <button onClick={copy} className={btn("ghost")} title="Copy"><Copy className="h-4 w-4" /></button>
                <button onClick={download} className={btn("ghost")} title="Download"><Download className="h-4 w-4" /></button>
              </div>
            </div>
            <pre
              className={`max-h-96 overflow-auto rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4 text-sm leading-relaxed text-blue-200 whitespace-pre-wrap ${tool.slug === "text-summarizer" ? "" : "font-mono"}`}
              style={tool.slug === "text-summarizer" ? { fontFamily: selectedFont.family } : undefined}
            >
              {output}
            </pre>
          </div>
          {(stats || tool.slug === "text-summarizer") && (
            <aside className="rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4">
              {stats && (
                <>
                  <p className="mb-3 text-sm font-medium">
                    {tool.slug === "sentiment-analyzer" || tool.slug === "keyword-extractor"
                      ? "Analysis"
                      : "How it shortened"}
                  </p>
                  <ul className="space-y-3">
                    {stats.map((stat) => (
                      <li key={stat.label} className="border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0">
                        <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">{stat.label}</p>
                        <p className="mt-1 text-sm font-medium text-cyan-200">{stat.value}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {tool.slug === "text-summarizer" && (
                <div className={stats ? "mt-4 border-t border-[var(--border)] pt-4" : ""}>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">Font used</p>
                  <p className="mt-1 text-sm font-medium text-cyan-200">
                    {selectedFont.name}
                  </p>
                  <label className="mt-3 block text-[11px] uppercase tracking-wide text-[var(--muted)]">
                    Change font
                  </label>
                  <select
                    className={inputClass + " mt-1"}
                    value={outputFont}
                    onChange={(e) => setOutputFont(e.target.value as (typeof OUTPUT_FONTS)[number]["id"])}
                  >
                    {OUTPUT_FONTS.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

function HumanizerResult({
  meter,
  sections,
  stats,
  onCopyAll,
  onDownload,
}: {
  meter: ToolMeter | null;
  sections: ToolSection[] | null;
  stats: ToolStat[] | null;
  onCopyAll: () => void;
  onDownload: () => void;
}) {
  const tone =
    meter?.label === "High"
      ? { text: "text-rose-300", bar: "bg-rose-400" }
      : meter?.label === "Medium"
        ? { text: "text-amber-300", bar: "bg-amber-400" }
        : { text: "text-emerald-300", bar: "bg-emerald-400" };
  const score = Math.max(0, Math.min(100, meter?.value ?? 0));

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Result</span>
        <div className="flex gap-1">
          <button onClick={onCopyAll} className={btn("ghost")} title="Copy all"><Copy className="h-4 w-4" /></button>
          <button onClick={onDownload} className={btn("ghost")} title="Download"><Download className="h-4 w-4" /></button>
        </div>
      </div>

      {meter && (
        <div className="rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">AI likelihood</p>
              <p className={`mt-1 text-2xl font-semibold ${tone.text}`}>{meter.label}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold tabular-nums">{score}</p>
              <p className="text-[11px] text-[var(--muted)]">out of 100</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${score}%` }} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            Heuristic estimate only — not a reliable AI detector.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {(sections || []).map((section) => (
          <div key={section.id} className="flex min-h-[180px] flex-col rounded-xl border border-[var(--border)] bg-[#0a0f18]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
              <p className="text-sm font-medium">{section.title}</p>
              <button
                type="button"
                className={btn("ghost") + " !px-2 !py-1"}
                title={`Copy ${section.title}`}
                onClick={() => navigator.clipboard.writeText(section.text)}
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-blue-100">{section.text}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[var(--border)] bg-[#0a0f18] px-3 py-3">
              <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">{stat.label}</p>
              <p className="mt-1 text-sm font-medium text-cyan-200">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function placeholderFor(slug: string) {
  const map: Record<string, string> = {
    "url-parser": "https://example.com/path?key=value",
    "url-encoder": "hello world",
    "url-decoder": "hello%20world",
    "url-validator": "https://example.com",
    "query-parser": "https://example.com/search?q=tools&page=1",
    "dns-lookup": "example.com",
    "a-record-lookup": "example.com",
    "redirect-checker": "https://example.com",
    "http-status-checker": "https://example.com",
    "email-extractor": "Contact us at hello@example.com and support@example.com",
    "user-agent-parser": "Paste a User-Agent string…",
    "ip-validator": "192.168.1.1 or 2001:db8::1",
    "cidr-calculator": "192.168.1.0/24",
    "email-validator": "user@example.com",
    "text-summarizer": "Paste an article or long text to summarize…",
    "human-summarizer": "Paste long or AI-sounding text to detect, humanize, and summarize…",
    "ai-likelihood-detector": "Paste long or AI-sounding text to detect, humanize, and summarize…",
    "humanize-text": "Paste long or AI-sounding text to detect, humanize, and summarize…",
    "text-analyzer": "Paste text to count words, characters and sentences…",
    "keyword-extractor": "Paste a review or article to get sentiment and keywords…",
    "sentiment-analyzer": "Paste a review or article to get sentiment and keywords…",
    "text-case-converter": "Paste text to convert case…",
    "text-cleaner": "Paste text with extra spaces or line breaks…",
    "slug-generator": "My Blog Post Title",
    "jwt-decoder": "Paste your JWT token here…",
    "http-status-lookup": "404",
    "mac-address-formatter": "AABBCCDDEEFF",
    "color-picker": "#3b82f6",
  };
  return map[slug] || "Enter or paste your input here…";
}

function CalculatorFields({ slug, options, setOptions }: { slug: string; options: Record<string, unknown>; setOptions: (o: Record<string, unknown>) => void }) {
  const set = (k: string, v: string) => setOptions({ ...options, [k]: v });
  if (slug === "emi-calculator" || slug === "loan-calculator") return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      <input placeholder="Principal (₹)" type="number" className={inputClass} onChange={(e) => set("principal", e.target.value)} />
      <input placeholder="Rate (% p.a.)" type="number" className={inputClass} onChange={(e) => set("rate", e.target.value)} />
      <input placeholder="Tenure (years)" type="number" className={inputClass} onChange={(e) => set("tenure", e.target.value)} />
    </div>
  );
  if (slug === "bmi-calculator") return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2">
      <input placeholder="Weight (kg)" type="number" className={inputClass} onChange={(e) => set("weight", e.target.value)} />
      <input placeholder="Height (cm)" type="number" className={inputClass} onChange={(e) => set("height", e.target.value)} />
    </div>
  );
  if (slug === "age-calculator") return (
    <input type="date" className={inputClass + " mb-4"} onChange={(e) => set("dob", e.target.value)} />
  );
  if (slug === "unit-converter" || slug === "data-converter" || slug === "currency-converter") return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      <input placeholder="Value" type="number" className={inputClass} onChange={(e) => set("value", e.target.value)} />
      <input placeholder="From" className={inputClass} onChange={(e) => set("from", e.target.value)} />
      <input placeholder="To" className={inputClass} onChange={(e) => set("to", e.target.value)} />
    </div>
  );
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2">
      <input placeholder="Value" type="number" className={inputClass} onChange={(e) => set("value", e.target.value)} />
      <input placeholder="Percent / Rate" type="number" className={inputClass} onChange={(e) => set("percent", e.target.value)} />
    </div>
  );
}

function SeoFields({ options, setOptions }: { options: Record<string, unknown>; setOptions: (o: Record<string, unknown>) => void }) {
  const set = (k: string, v: string) => setOptions({ ...options, [k]: v });
  return (
    <div className="mb-4 space-y-3">
      <input placeholder="Title" className={inputClass} onChange={(e) => set("title", e.target.value)} />
      <input placeholder="Description" className={inputClass} onChange={(e) => set("description", e.target.value)} />
      <input placeholder="URL" className={inputClass} onChange={(e) => set("url", e.target.value)} />
    </div>
  );
}

function InternetFields({ slug, options, setOptions }: { slug: string; options: Record<string, unknown>; setOptions: (o: Record<string, unknown>) => void }) {
  const set = (key: string, value: string) => setOptions({ ...options, [key]: value });
  if (slug === "dns-lookup") {
    return (
      <select className={inputClass + " mb-4"} value={String(options.type || "A")} onChange={(e) => setOptions({ ...options, type: e.target.value })}>
        <option value="A">A (IPv4)</option>
        <option value="AAAA">AAAA (IPv6)</option>
        <option value="CNAME">CNAME</option>
        <option value="MX">MX</option>
        <option value="TXT">TXT</option>
        <option value="NS">NS</option>
      </select>
    );
  }
  if (slug === "mac-address-formatter") {
    return (
      <select className={inputClass + " mb-4"} value={String(options.format || "colon")} onChange={(e) => setOptions({ ...options, format: e.target.value })}>
        <option value="colon">Colon (AA:BB:CC:DD:EE:FF)</option>
        <option value="dash">Dash (AA-BB-CC-DD-EE-FF)</option>
        <option value="dot">Dot (AABB.CCDD.EEFF)</option>
      </select>
    );
  }
  if (slug === "generate-random-email") {
    return (
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <input placeholder="Domain (example.com)" className={inputClass} defaultValue="example.com" onChange={(e) => set("domain", e.target.value)} />
        <input placeholder="Username length (5–30)" type="number" min={5} max={30} className={inputClass} defaultValue={10} onChange={(e) => set("usernameLength", e.target.value)} />
      </div>
    );
  }
  if (slug === "generate-otp") {
    return (
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <input placeholder="OTP length (4–8)" type="number" min={4} max={8} className={inputClass} defaultValue={6} onChange={(e) => set("otpLength", e.target.value)} />
        <input placeholder="Expiry seconds" type="number" min={30} className={inputClass} defaultValue={300} onChange={(e) => set("expirySeconds", e.target.value)} />
      </div>
    );
  }
  if (slug === "verify-otp") {
    return (
      <input placeholder="Enter the OTP to verify" className={`${inputClass} mb-4`} onChange={(e) => set("userOtp", e.target.value)} />
    );
  }
  if (slug === "query-builder") {
    return (
      <div className="mb-4 space-y-3">
        <input placeholder="Base URL (https://example.com/search)" className={inputClass} onChange={(e) => set("baseUrl", e.target.value)} />
        <textarea placeholder={"Parameters, one per line:\nq=tools\npage=1"} className={`${inputClass} min-h-28`} onChange={(e) => set("params", e.target.value)} />
      </div>
    );
  }
  return null;
}
