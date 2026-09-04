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
} from "@/features/tools/client-processors";
import { FileClientTool } from "./FileClientTool";
import { ServerFileTool } from "./ServerFileTool";
import { SpeedTestTool } from "./SpeedTestTool";

interface Props {
  tool: ToolMeta;
}

export function ToolEngine({ tool }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState<Record<string, unknown>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const isServer = tool.processing_type === "server" || tool.processing_type === "hybrid";
  const isFileClient = ["resize-image", "jpg-to-png", "png-to-jpg", "webp-converter", "rotate-image", "flip-image", "crop-image"].includes(tool.slug);
  const needsTextarea = !CALCULATOR_TOOLS.has(tool.slug) && !SEO_FORM_TOOLS.has(tool.slug) && !NO_INPUT_TOOLS.has(tool.slug);

  useEffect(() => {
    setInput("");
    setOutput("");
    setError("");
    setOptions({});
    setStatus("idle");
  }, [tool.slug]);

  if (isServer && tool.slug !== "compress-image") {
    return <ServerFileTool tool={tool} />;
  }
  if (tool.slug === "internet-speed-test") {
    return <SpeedTestTool />;
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
        setStatus("error");
      } else {
        setOutput(result.output);
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
        <input type="number" placeholder="Length" className={inputClass + " mb-4"} onChange={(e) => setOptions({ length: e.target.value })} defaultValue={16} />
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
        <button onClick={() => { setInput(""); setOutput(""); setError(""); setStatus("idle"); }} className={btn("secondary")}>
          <RotateCcw className="mr-2 h-4 w-4" /> Clear
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {output && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Result</span>
            <div className="flex gap-1">
              <button onClick={copy} className={btn("ghost")} title="Copy"><Copy className="h-4 w-4" /></button>
              <button onClick={download} className={btn("ghost")} title="Download"><Download className="h-4 w-4" /></button>
            </div>
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4 font-mono text-sm leading-relaxed text-blue-200 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}

function placeholderFor(slug: string) {
  const map: Record<string, string> = {
    "url-parser": "https://example.com/path?key=value",
    "dns-lookup": "example.com",
    "ip-validator": "192.168.1.1 or 2001:db8::1",
    "cidr-calculator": "192.168.1.0/24",
    "email-validator": "user@example.com",
    "jwt-decoder": "Paste your JWT token here…",
    "http-status-lookup": "404",
    "user-agent-parser": "Paste a User-Agent string…",
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
  return null;
}
