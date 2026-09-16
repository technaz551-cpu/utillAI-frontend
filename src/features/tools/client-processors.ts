import { INTERNET_PROCESSORS } from "@/features/tools/internet-processors";

export interface ToolMeta {
  id: string;
  slug: string;
  name: string;
  description?: string; 
  category?: string;
  category_slug: string;
  processing_type: "client" | "server" | "hybrid";
  short_description: string;
  long_description?: string;
  how_to_use?: string[];
  features?: string[];
  faq?: Array<{ question: string; answer: string }>;
  related_tools?: string[];
  seo_title?: string;
  meta_description?: string;
  accepted_formats?: string[];
}

export type ToolStat = { label: string; value: string };

export type ToolSection = { id: string; title: string; text: string };

export type ToolMeter = { label: string; value: number };

export type ToolResult = {
  output: string;
  error?: string;
  stats?: ToolStat[];
  sections?: ToolSection[];
  meter?: ToolMeter;
};

export type ToolProcessor = (input: string, options?: Record<string, unknown>) => ToolResult | Promise<ToolResult>;

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function splitSentences(text: string) {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
}

function specialSymbolStats(text: string) {
  const symbols = [...text].filter((ch) => {
    if (!ch.trim()) return false;
    return !/[\p{L}\p{N}]/u.test(ch);
  });
  const unique = [...new Set(symbols)].sort((a, b) => a.localeCompare(b));
  return {
    types: unique.length,
    count: symbols.length,
    list: unique,
  };
}

function summarizeText(text: string, sentenceCount: number) {
  const sentences = splitSentences(text);
  if (sentences.length <= sentenceCount) return text;
  const stop = new Set(["the", "is", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "that", "this", "are", "was", "were", "as", "by"]);
  const words = (text.toLowerCase().match(/\b[a-zA-Z]+\b/g) || []).filter((w) => !stop.has(w));
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const ranked = [...sentences]
    .map((sentence) => {
      const sw = sentence.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
      return { sentence, score: sw.reduce((n, w) => n + (freq.get(w) || 0), 0) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .map((x) => x.sentence);
  const important = new Set(ranked);
  return sentences.filter((s) => important.has(s)).join(" ");
}

const AI_PHRASES = [
  "in today's world",
  "in the modern era",
  "it is important to note",
  "it is worth noting",
  "furthermore",
  "moreover",
  "in conclusion",
  "ultimately",
  "plays a crucial role",
  "plays an important role",
  "has become increasingly",
  "rapidly evolving",
  "multifaceted",
  "delve into",
  "landscape",
  "transformative",
  "comprehensive",
  "significant",
  "potential benefits",
  "potential challenges",
];

const FORMAL_WORDS = new Set([
  "furthermore", "moreover", "consequently", "therefore", "additionally", "nevertheless", "ultimately",
]);

const HUMANIZE_REPLACEMENTS: Array<[string, string]> = [
  ["in today's world", "today"],
  ["in the modern era", "today"],
  ["it is important to note that", "importantly"],
  ["it is worth noting that", "notably"],
  ["a significant number of", "many"],
  ["a large number of", "many"],
  ["due to the fact that", "because"],
  ["in order to", "to"],
  ["at this point in time", "now"],
  ["has the ability to", "can"],
  ["is able to", "can"],
  ["are able to", "can"],
  ["plays a crucial role in", "helps"],
  ["plays an important role in", "helps"],
  ["in the process of", "while"],
  ["with regard to", "about"],
  ["with respect to", "about"],
  ["for the purpose of", "to"],
  ["in addition to", "besides"],
  ["a wide range of", "many"],
  ["a variety of", "many"],
  ["it should be noted that", ""],
  ["it is important to understand that", ""],
  ["furthermore", "Also"],
  ["moreover", "Also"],
  ["consequently", "So"],
  ["therefore", "So"],
  ["utilize", "use"],
  ["utilization", "use"],
  ["approximately", "about"],
  ["numerous", "many"],
  ["individuals", "people"],
  ["facilitate", "help"],
  ["demonstrate", "show"],
  ["commence", "start"],
  ["terminate", "end"],
  ["obtain", "get"],
  ["require assistance", "need help"],
  ["subsequently", "later"],
  ["prior to", "before"],
  ["in conclusion", "Overall"],
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectAiLikelihood(text: string) {
  const original = text.trim();
  const words = original.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
  const sentences = splitSentences(original);
  if (!words.length) return { likelihood: "Low", score: 0 };
  let score = 0;
  const lower = original.toLowerCase();
  for (const phrase of AI_PHRASES) {
    if (lower.includes(phrase)) score += 8;
  }
  if (sentences.length) {
    const average = words.length / sentences.length;
    if (average > 25) score += 15;
    else if (average > 20) score += 8;
  }
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const repeated = [...freq.entries()].filter(([word, n]) => n >= 4 && word.length > 4).length;
  if (repeated >= 3) score += 10;
  else if (repeated >= 1) score += 5;
  const formalCount = words.filter((w) => FORMAL_WORDS.has(w)).length;
  score += Math.min(formalCount * 4, 16);
  score = Math.min(score, 100);
  const likelihood = score >= 60 ? "High" : score >= 30 ? "Medium" : "Low";
  return { likelihood, score };
}

function humanizeText(text: string) {
  let result = text.trim();
  for (const [old, next] of HUMANIZE_REPLACEMENTS) {
    result = result.replace(new RegExp(`\\b${escapeRegExp(old)}\\b`, "gi"), next);
  }
  result = result.replace(/\s+/g, " ").trim();
  result = result.replace(/\s+([,.!?;:])/g, "$1");
  result = result.replace(/([.!?]){2,}/g, "$1");
  return result;
}

function summarizeStats(original: string, summary: string): ToolStat[] {
  const originalWords = countWords(original);
  const summaryWords = countWords(summary);
  const originalSentences = splitSentences(original).length;
  const summarySentences = splitSentences(summary).length;
  const reduction = originalWords
    ? Math.max(0, Math.round((1 - summaryWords / originalWords) * 1000) / 10)
    : 0;
  return [
    { label: "Reduced by", value: `${reduction}%` },
    { label: "Words", value: `${originalWords} → ${summaryWords}` },
    { label: "Sentences", value: `${originalSentences} → ${summarySentences}` },
    { label: "Characters", value: `${original.length} → ${summary.length}` },
  ];
}

function humanizeDetectSummarize(input: string, opts?: Record<string, unknown>): ToolResult {
  const sentenceCount = Math.max(1, Number(opts?.sentenceCount || 3));
  const text = input.trim();
  if (!text) return { output: "", error: "Please provide some text." };
  const detection = detectAiLikelihood(text);
  const humanized = humanizeText(text);
  const summary = summarizeText(humanized, sentenceCount);
  return {
    output: [
      `AI likelihood: ${detection.likelihood} (${detection.score})`,
      "",
      "Humanized text:",
      humanized,
      "",
      "Summary:",
      summary,
    ].join("\n"),
    meter: { label: detection.likelihood, value: detection.score },
    sections: [
      { id: "humanized", title: "Humanized text", text: humanized },
      { id: "summary", title: "Summary", text: summary },
    ],
    stats: summarizeStats(text, summary),
  };
}

function sentimentAndKeywords(input: string, opts?: Record<string, unknown>): ToolResult {
  if (!input.trim()) return { output: "", error: "Please provide text." };
  const count = Math.max(1, Number(opts?.count || 10));
  const positive = new Set(["good", "great", "excellent", "amazing", "awesome", "happy", "love", "best", "wonderful", "perfect", "nice"]);
  const negative = new Set(["bad", "terrible", "worst", "hate", "sad", "poor", "awful", "horrible", "problem", "angry", "disappointed"]);
  const words = input.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
  const positiveScore = words.filter((w) => positive.has(w)).length;
  const negativeScore = words.filter((w) => negative.has(w)).length;
  const sentiment = positiveScore > negativeScore ? "Positive" : negativeScore > positiveScore ? "Negative" : "Neutral";
  const stop = new Set(["the", "is", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "that", "this", "are", "was", "were", "as", "by", "from", "it", "be", "has", "have", "at"]);
  const keywordWords = (input.toLowerCase().match(/\b[a-zA-Z]{3,}\b/g) || []).filter((w) => !stop.has(w));
  const freq = new Map<string, number>();
  for (const w of keywordWords) freq.set(w, (freq.get(w) || 0) + 1);
  const keywords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, count);
  const keywordLines = keywords.length
    ? keywords.map(([word, n], i) => `${i + 1}. ${word} (${n})`).join("\n")
    : "None";
  return {
    output: [
      `Sentiment: ${sentiment}`,
      `Positive score: ${positiveScore}`,
      `Negative score: ${negativeScore}`,
      "",
      "Keywords:",
      keywordLines,
    ].join("\n"),
    stats: [
      { label: "Sentiment", value: sentiment },
      { label: "Positive", value: String(positiveScore) },
      { label: "Negative", value: String(negativeScore) },
      { label: "Keywords", value: String(keywords.length) },
    ],
  };
}

export const CLIENT_PROCESSORS: Record<string, ToolProcessor> = {
  "json-formatter": (input) => {
    try {
      return { output: JSON.stringify(JSON.parse(input), null, 2) };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "json-validator": (input) => {
    try {
      JSON.parse(input);
      return { output: "✓ Valid JSON" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "json-minifier": (input) => {
    try {
      return { output: JSON.stringify(JSON.parse(input)) };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "base64-encoder": (input) => ({ output: btoa(unescape(encodeURIComponent(input))) }),
  "base64-decoder": (input) => {
    try {
      return { output: decodeURIComponent(escape(atob(input))) };
    } catch {
      return { output: "", error: "Invalid Base64 string" };
    }
  },
  "url-encoder": (input) => ({ output: encodeURIComponent(input) }),
  "url-decoder": (input) => {
    try {
      return { output: decodeURIComponent(input) };
    } catch {
      return { output: "", error: "Invalid URL encoding" };
    }
  },
  "uuid-generator": () => ({ output: crypto.randomUUID() }),
  "hash-generator": async (input) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    const hash = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return { output: hash };
  },
  "word-counter": (input) => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const chars = input.length;
    const sentences = input.split(/[.!?]+/).filter(Boolean).length;
    return { output: `Words: ${words}\nCharacters: ${chars}\nSentences: ${sentences}` };
  },
  "character-counter": (input) => ({
    output: `With spaces: ${input.length}\nWithout spaces: ${input.replace(/\s/g, "").length}`,
  }),
  "case-converter": (input, opts) => {
    const mode = opts?.mode as string || "upper";
    const map: Record<string, string> = {
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      title: input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
      sentence: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
    };
    return { output: map[mode] || input };
  },
  "duplicate-line-remover": (input) => ({
    output: [...new Set(input.split("\n"))].join("\n"),
  }),
  "text-sorter": (input, opts) => {
    const lines = input.split("\n").filter(Boolean);
    lines.sort((a, b) => opts?.desc ? b.localeCompare(a) : a.localeCompare(b));
    return { output: lines.join("\n") };
  },
  "text-reverser": (input) => ({ output: input.split("").reverse().join("") }),
  "text-cleaner": (input) => ({ output: input.replace(/\s+/g, " ").trim() }),
  "lorem-ipsum-generator": (_, opts) => {
    const paras = Number(opts?.paragraphs || 3);
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    return { output: Array(paras).fill(lorem).join("\n\n") };
  },
  "slug-generator": (input) => ({
    output: input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
  }),
  "password-generator": (_, opts) => {
    const len = Math.min(128, Math.max(4, Number(opts?.length || 16)));
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts?.includeNumbers !== false) chars += "0123456789";
    if (opts?.includeSymbols !== false) chars += "!@#$%^&*";
    let pwd = "";
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) pwd += chars[arr[i] % chars.length];
    return { output: pwd };
  },
  "csv-to-json": (input) => {
    const lines = input.trim().split("\n");
    if (!lines.length) return { output: "[]" };
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const vals = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || "").trim()]));
    });
    return { output: JSON.stringify(rows, null, 2) };
  },
  "json-to-csv": (input) => {
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data) || !data.length) return { output: "", error: "JSON must be a non-empty array" };
      const keys = Object.keys(data[0]);
      const rows = [keys.join(","), ...data.map((r) => keys.map((k) => r[k] ?? "").join(","))];
      return { output: rows.join("\n") };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "timestamp-converter": (input) => {
    const ts = Number(input);
    if (isNaN(ts)) return { output: "", error: "Enter a valid Unix timestamp" };
    const ms = ts < 1e12 ? ts * 1000 : ts;
    return { output: new Date(ms).toISOString() + "\nLocal: " + new Date(ms).toLocaleString() };
  },
  "percentage-calculator": (input, opts) => {
    const val = Number(opts?.value || 0);
    const pct = Number(opts?.percent || 0);
    if (opts?.mode === "of") return { output: `${pct}% of ${val} = ${(val * pct / 100).toFixed(2)}` };
    if (opts?.mode === "change") return { output: `Change: ${(((pct - val) / val) * 100).toFixed(2)}%` };
    return { output: `${pct}% of ${val} = ${(val * pct / 100).toFixed(2)}` };
  },
  "emi-calculator": (_, opts) => {
    const P = Number(opts?.principal || 0);
    const r = Number(opts?.rate || 0) / 12 / 100;
    const n = Number(opts?.tenure || 0) * 12;
    if (!P || !r || !n) return { output: "", error: "Enter principal, rate and tenure" };
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return { output: `Monthly EMI: ₹${emi.toFixed(2)}\nTotal Payment: ₹${total.toFixed(2)}\nTotal Interest: ₹${(total - P).toFixed(2)}` };
  },
  "bmi-calculator": (_, opts) => {
    const w = Number(opts?.weight || 0);
    const h = Number(opts?.height || 0) / 100;
    if (!w || !h) return { output: "", error: "Enter weight (kg) and height (cm)" };
    const bmi = w / (h * h);
    let cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
    return { output: `BMI: ${bmi.toFixed(1)} (${cat})` };
  },
  "discount-calculator": (_, opts) => {
    const price = Number(opts?.price || 0);
    const disc = Number(opts?.discount || 0);
    const final = price - (price * disc / 100);
    return { output: `Original: ₹${price}\nDiscount: ${disc}%\nFinal Price: ₹${final.toFixed(2)}\nYou Save: ₹${(price - final).toFixed(2)}` };
  },
  "gst-calculator": (_, opts) => {
    const amt = Number(opts?.amount || 0);
    const rate = Number(opts?.rate || 18);
    const mode = opts?.mode as string || "add";
    if (mode === "add") {
      const gst = amt * rate / 100;
      return { output: `Base: ₹${amt}\nGST (${rate}%): ₹${gst.toFixed(2)}\nTotal: ₹${(amt + gst).toFixed(2)}` };
    }
    const base = amt / (1 + rate / 100);
    return { output: `Total: ₹${amt}\nBase: ₹${base.toFixed(2)}\nGST: ₹${(amt - base).toFixed(2)}` };
  },
  "age-calculator": (_, opts) => {
    const dob = new Date(String(opts?.dob || ""));
    if (isNaN(dob.getTime())) return { output: "", error: "Enter a valid date of birth" };
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (months < 0) { years--; months += 12; }
    return { output: `Age: ${years} years, ${months} months` };
  },
  "loan-calculator": (_, opts) => {
    return CLIENT_PROCESSORS["emi-calculator"]!("", opts);
  },
  "hex-to-rgb": (input) => {
    const hex = input.replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return { output: "", error: "Invalid HEX color" };
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { output: `rgb(${r}, ${g}, ${b})` };
  },
  "rgb-to-hex": (input) => {
    const m = input.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return { output: "", error: "Enter RGB like: 255, 128, 0" };
    const hex = [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
    return { output: `#${hex}` };
  },
  "color-picker": (input) => {
    const hex = input.replace("#", "").trim();
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return { output: "", error: "Enter a 6-digit HEX color like #3b82f6" };
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return {
      output: `HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    };
  },
  "url-parser": (input) => {
    try {
      const raw = input.trim();
      const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      const params = [...u.searchParams.entries()];
      const query = params.length
        ? params.map(([k, v]) => `  ${k} = ${v}`).join("\n")
        : "  (none)";
      return {
        output: [
          `Full URL: ${u.href}`,
          `Protocol: ${u.protocol.replace(":", "")}`,
          `Host: ${u.hostname}`,
          `Port: ${u.port || (u.protocol === "https:" ? "443" : "80")}`,
          `Path: ${u.pathname}`,
          `Query:\n${query}`,
          `Hash: ${u.hash || "(none)"}`,
          `Origin: ${u.origin}`,
        ].join("\n"),
      };
    } catch {
      return { output: "", error: "Invalid URL" };
    }
  },
  "ip-validator": (input) => {
    const ip = input.trim();
    const v4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
    const v6 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)+:$/;
    if (v4.test(ip)) {
      const parts = ip.split(".").map(Number);
      const isPrivate =
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        parts[0] === 127;
      return { output: `Valid IPv4\nAddress: ${ip}\nVersion: 4\nScope: ${isPrivate ? "Private / loopback" : "Public routable"}` };
    }
    if (v6.test(ip)) return { output: `Valid IPv6\nAddress: ${ip}\nVersion: 6` };
    return { output: "", error: "Not a valid IPv4 or IPv6 address" };
  },
  "cidr-calculator": (input) => {
    const m = input.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
    if (!m) return { output: "", error: "Enter CIDR like 192.168.1.0/24" };
    const octets = m[1].split(".").map(Number);
    const prefix = Number(m[2]);
    if (octets.some((o) => o > 255) || prefix < 0 || prefix > 32) return { output: "", error: "Invalid CIDR notation" };
    const ipInt = ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const hosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, (1 << (32 - prefix)) - 2);
    const fmt = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    return {
      output: [
        `Network: ${fmt(network)}/${prefix}`,
        `Subnet mask: ${fmt(mask)}`,
        `Broadcast: ${fmt(broadcast)}`,
        `First host: ${prefix >= 31 ? fmt(network) : fmt(network + 1)}`,
        `Last host: ${prefix >= 31 ? fmt(broadcast) : fmt(broadcast - 1)}`,
        `Usable hosts: ${hosts}`,
      ].join("\n"),
    };
  },
  "mac-address-formatter": (input, opts) => {
    const hex = input.replace(/[^0-9a-fA-F]/g, "");
    if (hex.length !== 12) return { output: "", error: "MAC address must contain 12 hex digits" };
    const sep = opts?.format === "dash" ? "-" : opts?.format === "dot" ? "." : ":";
    const parts = hex.match(/.{2}/g)!.map((p) => p.toUpperCase());
    return { output: parts.join(sep) };
  },
  "email-validator": (input) => {
    const email = input.trim();
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!re.test(email)) return { output: "", error: "Invalid email address format" };
    const [local, domain] = email.split("@");
    const tld = domain.split(".").pop();
    return { output: `Valid email format\nLocal part: ${local}\nDomain: ${domain}\nTLD: ${tld}` };
  },
  "http-status-lookup": (input) => {
    const codes: Record<number, string> = {
      100: "Continue", 101: "Switching Protocols", 102: "Processing",
      200: "OK", 201: "Created", 202: "Accepted", 204: "No Content", 206: "Partial Content",
      301: "Moved Permanently", 302: "Found", 304: "Not Modified", 307: "Temporary Redirect", 308: "Permanent Redirect",
      400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed",
      408: "Request Timeout", 409: "Conflict", 410: "Gone", 413: "Payload Too Large", 415: "Unsupported Media Type",
      418: "I'm a teapot", 422: "Unprocessable Entity", 429: "Too Many Requests",
      500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout",
    };
    const code = Number(input.trim());
    if (!Number.isInteger(code) || code < 100 || code > 599) return { output: "", error: "Enter an HTTP status code between 100 and 599" };
    const label = codes[code];
    const family = code >= 500 ? "5xx Server Error" : code >= 400 ? "4xx Client Error" : code >= 300 ? "3xx Redirection" : code >= 200 ? "2xx Success" : "1xx Informational";
    return { output: `Code: ${code}\nStatus: ${label || "Unknown"}\nClass: ${family}` };
  },
  "user-agent-parser": (input) => {
    const ua = input.trim();
    if (!ua) return { output: "", error: "Paste a User-Agent string" };
    const browser =
      /Edg\//.test(ua) ? "Microsoft Edge" :
      /Chrome\//.test(ua) && !/Edg\//.test(ua) ? "Chrome" :
      /Firefox\//.test(ua) ? "Firefox" :
      /Safari\//.test(ua) && !/Chrome\//.test(ua) ? "Safari" :
      /MSIE|Trident/.test(ua) ? "Internet Explorer" : "Unknown";
    const os =
      /Windows NT 10/.test(ua) ? "Windows 10/11" :
      /Windows NT/.test(ua) ? "Windows" :
      /Mac OS X/.test(ua) ? "macOS" :
      /Android/.test(ua) ? "Android" :
      /iPhone|iPad|iPod/.test(ua) ? "iOS" :
      /Linux/.test(ua) ? "Linux" : "Unknown";
    const device = /Mobile|Android|iPhone/.test(ua) ? "Mobile" : /iPad|Tablet/.test(ua) ? "Tablet" : "Desktop";
    return { output: `Browser: ${browser}\nOS: ${os}\nDevice: ${device}\n\nRaw:\n${ua}` };
  },
  "jwt-decoder": (input) => {
    const token = input.trim();
    const parts = token.split(".");
    if (parts.length !== 3) return { output: "", error: "JWT must have three dot-separated parts" };
    const decode = (part: string) => {
      const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      return JSON.parse(decodeURIComponent(escape(atob(padded))));
    };
    try {
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      return {
        output: `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nNote: Signature is not verified.`,
      };
    } catch {
      return { output: "", error: "Could not decode JWT — check the token format" };
    }
  },
  "dns-lookup": async (input, opts) => {
    const name = input.trim().replace(/^https?:\/\//, "").split("/")[0];
    if (!name) return { output: "", error: "Enter a domain name" };
    const typeMap: Record<string, string> = { A: "1", AAAA: "28", CNAME: "5", MX: "15", TXT: "16", NS: "2" };
    const type = String(opts?.type || "A").toUpperCase();
    const typeNum = typeMap[type];
    if (!typeNum) return { output: "", error: "Unsupported record type" };
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${typeNum}`);
      const data = await res.json();
      if (data.Status !== 0) return { output: "", error: `DNS lookup failed (RCODE ${data.Status})` };
      const answers = (data.Answer || []) as Array<{ data: string; TTL?: number }>;
      const lines = answers.length
        ? answers.map((a) => `  ${a.data}${a.TTL != null ? `  (TTL ${a.TTL}s)` : ""}`).join("\n")
        : "  (no records found)";
      return { output: `Domain: ${name}\nType: ${type}\n\nRecords:\n${lines}` };
    } catch {
      return { output: "", error: "DNS lookup failed — check your connection" };
    }
  },
  "what-is-my-ip": async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return { output: `Your public IP address:\n${data.ip}\n\nFetched via ipify.org` };
    } catch {
      return { output: "", error: "Could not fetch your IP — check your connection" };
    }
  },
  "meta-tag-generator": (_, opts) => {
    const title = opts?.title || "";
    const desc = opts?.description || "";
    return { output: `<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta name="robots" content="index, follow">` };
  },
  "robots-txt-generator": (_, opts) => ({
    output: `User-agent: *\n${opts?.allowAll ? "Allow: /" : "Disallow: /admin\nDisallow: /dashboard"}\nSitemap: ${opts?.sitemap || "https://example.com/sitemap.xml"}`,
  }),
  "sitemap-generator": (input) => {
    const urls = input.split("\n").filter(Boolean);
    const entries = urls.map((u) => `  <url><loc>${u.trim()}</loc></url>`).join("\n");
    return { output: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>` };
  },
  "open-graph-generator": (_, opts) => ({
    output: `<meta property="og:title" content="${opts?.title || ""}">\n<meta property="og:description" content="${opts?.description || ""}">\n<meta property="og:image" content="${opts?.image || ""}">`,
  }),
  "serp-preview": (_, opts) => ({
    output: `Title: ${opts?.title || "Page Title"}\nURL: ${opts?.url || "https://example.com"}\nDescription: ${opts?.description || "Meta description appears here..."}`,
  }),
  "utm-builder": (_, opts) => {
    const base = String(opts?.url || "https://example.com");
    const params = new URLSearchParams();
    if (opts?.source) params.set("utm_source", String(opts.source));
    if (opts?.medium) params.set("utm_medium", String(opts.medium));
    if (opts?.campaign) params.set("utm_campaign", String(opts.campaign));
    return { output: `${base}${base.includes("?") ? "&" : "?"}${params.toString()}` };
  },
  "keyword-density-checker": (input, opts) => {
    const keyword = String(opts?.keyword || "").toLowerCase();
    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    const count = words.filter((w) => w.includes(keyword)).length;
    const density = words.length ? ((count / words.length) * 100).toFixed(2) : "0";
    return { output: `Total words: ${words.length}\nKeyword "${keyword}" count: ${count}\nDensity: ${density}%` };
  },
  "unit-converter": (_, opts) => {
    const val = Number(opts?.value || 0);
    const from = String(opts?.from || "m");
    const to = String(opts?.to || "ft");
    const length: Record<string, number> = { m: 1, km: 1000, ft: 0.3048, in: 0.0254, mi: 1609.34 };
    if (!(from in length) || !(to in length)) return { output: "", error: "Unsupported unit" };
    const result = (val * length[from]) / length[to];
    return { output: `${val} ${from} = ${result.toFixed(4)} ${to}` };
  },
  "data-converter": (_, opts) => {
    const val = Number(opts?.value || 0);
    const from = String(opts?.from || "MB");
    const units: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 };
    const to = String(opts?.to || "GB");
    if (!(from in units) || !(to in units)) return { output: "", error: "Unsupported unit" };
    const result = (val * units[from]) / units[to];
    return { output: `${val} ${from} = ${result.toFixed(4)} ${to}` };
  },
  "text-summarizer": (input, opts) => {
    const sentenceCount = Math.max(1, Number(opts?.sentenceCount || 3));
    const text = input.trim();
    if (!text) return { output: "", error: "Please provide some text." };
    const summary = summarizeText(text, sentenceCount);
    return { output: summary, stats: summarizeStats(text, summary) };
  },
  "human-summarizer": humanizeDetectSummarize,
  "ai-likelihood-detector": humanizeDetectSummarize,
  "humanize-text": humanizeDetectSummarize,
  "text-analyzer": (input) => {
    if (!input.trim()) return { output: "", error: "Please provide text." };
    const words = input.trim() ? input.trim().split(/\s+/) : [];
    const sentences = input.split(/[.!?]+/).filter((s) => s.trim());
    const symbols = specialSymbolStats(input);
    const symbolList = symbols.list.length ? symbols.list.join(" ") : "None";
    return {
      output: [
        `Words: ${words.length}`,
        `Characters: ${input.length}`,
        `Characters without spaces: ${input.replace(/\s/g, "").length}`,
        `Sentences: ${sentences.length}`,
        `Special symbol types: ${symbols.types}`,
        `Special symbols used: ${symbolList}`,
        `Special symbol count: ${symbols.count}`,
      ].join("\n"),
    };
  },
  "keyword-extractor": sentimentAndKeywords,
  "sentiment-analyzer": sentimentAndKeywords,
  "text-case-converter": (input, opts) => {
    if (!input) return { output: "", error: "Please provide text." };
    const mode = String(opts?.case || "upper");
    const map: Record<string, string> = {
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      title: input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
      capitalize: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
    };
    if (!(mode in map)) return { output: "", error: "Invalid case." };
    return { output: map[mode] };
  },
  "random-text-generator": (_, opts) => {
    const len = Math.min(5000, Math.max(1, Number(opts?.length || 100)));
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let text = "";
    for (let i = 0; i < len; i++) text += chars[arr[i] % chars.length];
    return { output: text };
  },
  "currency-converter": (_, opts) => {
    const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, AUD: 1.53 };
    const val = Number(opts?.value || 0);
    const from = String(opts?.from || "USD");
    const to = String(opts?.to || "INR");
    if (!(from in rates) || !(to in rates)) return { output: "", error: "Unsupported currency" };
    const result = (val / rates[from]) * rates[to];
    return { output: `${val} ${from} = ${result.toFixed(2)} ${to}` };
  },
  ...INTERNET_PROCESSORS,
};

export const CALCULATOR_TOOLS = new Set([
  "percentage-calculator", "emi-calculator", "bmi-calculator", "discount-calculator",
  "gst-calculator", "age-calculator", "loan-calculator", "unit-converter", "data-converter", "currency-converter",
]);

export const SEO_FORM_TOOLS = new Set([
  "meta-tag-generator", "open-graph-generator", "serp-preview", "utm-builder", "robots-txt-generator",
]);

export const INTERNET_FORM_TOOLS = new Set([
  "dns-lookup",
  "mac-address-formatter",
  "query-builder",
  "generate-random-email",
  "generate-otp",
  "verify-otp",
]);

export const NO_INPUT_TOOLS = new Set([
  "uuid-generator", "password-generator", "what-is-my-ip", "random-text-generator",
  "generate-random-email", "generate-otp", "verify-otp", "query-builder",
]);

export const FILE_CLIENT_TOOLS = new Set([
  "image-converter", "resize-image", "crop-image", "jpg-to-png", "png-to-jpg", "webp-converter", "rotate-image", "flip-image",
]);

export const SERVER_TOOLS = new Set<string>([]);
