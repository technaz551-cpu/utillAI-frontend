


import { INTERNET_PROCESSORS } from "@/features/tools/internet-processors";
import { humanize } from "@/features/tools/humanizer";

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

export type ToolProcessor = (
  input: string,
  options?: Record<string, unknown>
) => ToolResult | Promise<ToolResult>;

/* -------------------------------------------------------------------------- */
/*                               TEXT HELPERS                                 */
/* -------------------------------------------------------------------------- */

function countWords(text: string): number {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/(?<=[.!?])(?:\s+|\n+)|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getWords(text: string): string[] {
  return text.toLowerCase().match(/\b[a-zA-ZÀ-ÿ'-]+\b/g) || [];
}

function specialSymbolStats(text: string) {
  const symbols = [...text].filter((ch) => {
    if (!ch.trim()) return false;
    return !/[\p{L}\p{N}]/u.test(ch);
  });

  const unique = [...new Set(symbols)].sort((a, b) => a.localeCompare(b));

  return { types: unique.length, count: symbols.length, list: unique };
}

/** UTF-8 safe Base64 (replaces the deprecated escape/unescape trick). */
function utf8ToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToUtf8(value: string): string {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

/* -------------------------------------------------------------------------- */
/*                              TEXT SUMMARIZER                               */
/* -------------------------------------------------------------------------- */

const SUMMARY_STOP_WORDS = new Set([
  "the", "is", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
  "that", "this", "are", "was", "were", "as", "by", "from", "it", "be", "has",
  "have", "had", "at", "but", "not", "they", "their", "them", "we", "our",
  "you", "your", "he", "she", "his", "her", "which", "who", "what", "when",
  "where", "how",
]);

function tokenizeForSummary(text: string): string[] {
  return getWords(text).filter((word) => word.length > 2 && !SUMMARY_STOP_WORDS.has(word));
}

/**
 * Extractive summarizer.
 * - keeps original sentence order
 * - favours early sentences
 * - penalises very short / very long sentences
 */
function summarizeText(text: string, sentenceCount = 3): string {
  const sentences = splitSentences(text);

  if (!sentences.length) return "";
  if (sentences.length <= sentenceCount) return sentences.join(" ");

  const frequencies = new Map<string, number>();
  for (const word of tokenizeForSummary(text)) {
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }

  const maxFrequency = Math.max(...frequencies.values(), 1);

  const scored = sentences.map((sentence, index) => {
    const words = tokenizeForSummary(sentence);

    if (!words.length) return { sentence, index, score: 0 };

    const frequencyScore =
      words.reduce((sum, word) => sum + (frequencies.get(word) || 0) / maxFrequency, 0) /
      words.length;

    const positionBonus =
      index === 0 ? 0.35 : index < Math.ceil(sentences.length * 0.25) ? 0.15 : 0;

    const lengthPenalty = words.length < 4 ? 0.35 : words.length > 60 ? 0.15 : 0;

    return { sentence, index, score: frequencyScore + positionBonus - lengthPenalty };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence)
    .join(" ");
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

/* -------------------------------------------------------------------------- */
/*                            AI TEXT HEURISTICS                              */
/* -------------------------------------------------------------------------- */

const AI_PHRASES = [
  "in today's world",
  "in the modern era",
  "in today's society",
  "it is important to note",
  "it is worth noting",
  "it is essential to",
  "furthermore",
  "moreover",
  "in conclusion",
  "ultimately",
  "additionally",
  "consequently",
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
  "on the other hand",
  "in addition",
];

const FORMAL_WORDS = new Set([
  "furthermore", "moreover", "consequently", "therefore", "additionally",
  "nevertheless", "ultimately", "hence", "thus",
]);

const COMMON_WORDS = new Set([
  "the", "and", "that", "this", "with", "from", "have", "has", "were", "will",
  "would", "could", "should", "about", "their", "there", "which", "because",
  "while", "where", "when",
]);

/**
 * Repeated 3-word phrases. Kept deliberately low-weight to avoid false positives.
 */
function repeatedPhraseScore(text: string): number {
  const words = getWords(text);
  if (words.length < 20) return 0;

  const phrases = new Map<string, number>();

  for (let i = 0; i < words.length - 2; i++) {
    const phrase = words.slice(i, i + 3).join(" ");
    if (phrase.split(" ").every((word) => COMMON_WORDS.has(word))) continue;
    phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
  }

  const repeated = [...phrases.values()].filter((count) => count >= 2);

  if (repeated.length >= 4) return 8;
  if (repeated.length >= 2) return 5;
  if (repeated.length >= 1) return 2;
  return 0;
}

type AiDetection = {
  likelihood: "Low" | "Medium" | "High";
  score: number;
  signals: string[];
};

/**
 * Heuristic AI-likelihood score.
 * This is NOT proof that text was written by AI. It only measures style patterns.
 */
function detectAiLikelihood(text: string): AiDetection {
  const original = text.trim();
  const words = getWords(original);

  if (!original || !words.length) {
    return { likelihood: "Low", score: 0, signals: [] };
  }

  const sentences = splitSentences(original);
  const lower = original.toLowerCase();

  let score = 0;
  const signals: string[] = [];

  /* Phrase detection */
  const matchedPhrases = AI_PHRASES.filter((phrase) => lower.includes(phrase));

  if (matchedPhrases.length >= 4) {
    score += 22;
    signals.push("Several formulaic phrases");
  } else if (matchedPhrases.length >= 2) {
    score += 12;
    signals.push("Some formulaic phrases");
  } else if (matchedPhrases.length === 1) {
    score += 5;
    signals.push("One formulaic phrase");
  }

  /* Sentence uniformity */
  if (sentences.length >= 3) {
    const lengths = sentences.map((sentence) => getWords(sentence).length);
    const average = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance =
      lengths.reduce((sum, length) => sum + Math.pow(length - average, 2), 0) / lengths.length;
    const deviation = Math.sqrt(variance);

    if (average > 28) {
      score += 10;
      signals.push("Long average sentence length");
    } else if (average > 22) {
      score += 5;
      signals.push("Moderately long sentences");
    }

    if (deviation < 5 && average > 12) {
      score += 8;
      signals.push("Highly uniform sentence lengths");
    }
  }

  /* Vocabulary */
  const lexicalDiversity = new Set(words).size / Math.max(words.length, 1);

  if (words.length >= 80 && lexicalDiversity < 0.42) {
    score += 7;
    signals.push("Low lexical diversity");
  } else if (words.length >= 120 && lexicalDiversity > 0.82) {
    score += 3;
    signals.push("High formal vocabulary diversity");
  }

  /* Repeated words */
  const frequency = new Map<string, number>();
  for (const word of words) {
    if (word.length < 5) continue;
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  const repeatedWords = [...frequency.values()].filter((count) => count >= 4);

  if (repeatedWords.length >= 4) {
    score += 8;
    signals.push("Repeated vocabulary patterns");
  } else if (repeatedWords.length >= 2) {
    score += 4;
    signals.push("Some repeated vocabulary");
  }

  /* Formality */
  const formalCount = words.filter((word) => FORMAL_WORDS.has(word)).length;

  if (formalCount >= 4) {
    score += 8;
    signals.push("Frequent formal transitions");
  } else if (formalCount >= 2) {
    score += 4;
    signals.push("Formal transition words");
  }

  /* Repeated phrases */
  const phraseScore = repeatedPhraseScore(original);
  score += phraseScore;
  if (phraseScore > 0) signals.push("Repeated phrase patterns");

  score = Math.min(100, Math.max(0, Math.round(score)));

  const likelihood = score >= 65 ? "High" : score >= 35 ? "Medium" : "Low";

  return { likelihood, score, signals };
}

/* -------------------------------------------------------------------------- */
/*                         HUMANIZER / DETECTOR TOOLS                         */
/* -------------------------------------------------------------------------- */

function humanizeOnly(input: string, opts?: Record<string, unknown>): ToolResult {
  const text = input.trim();

  if (!text) return { output: "", error: "Please provide some text." };

  const intensity = Number(opts?.intensity);

  const result = humanize(text, {
    intensity: Number.isFinite(intensity) ? intensity : 0.7,
    contractions: opts?.contractions !== false,
  });

  return {
    output: result.text,
    sections: [{ id: "humanized", title: "Humanized text", text: result.text }],
    stats: [
      { label: "Edits made", value: String(result.changes) },
      { label: "AI patterns left", value: `${result.tellsBefore} → ${result.tellsAfter}` },
      {
        label: "Sentence variation",
        value: `${result.before.variation} → ${result.after.variation}`,
      },
      { label: "Words", value: `${countWords(text)} → ${countWords(result.text)}` },
      { label: "Characters", value: `${text.length} → ${result.text.length}` },
    ],
  };
}

function detectOnly(input: string): ToolResult {
  const text = input.trim();

  if (!text) return { output: "", error: "Please provide some text." };

  const detection = detectAiLikelihood(text);

  const signalText = detection.signals.length
    ? detection.signals.map((signal) => `• ${signal}`).join("\n")
    : "• No strong stylistic signals detected";

  return {
    output: [
      `AI likelihood: ${detection.likelihood}`,
      `Score: ${detection.score}/100`,
      "",
      "Signals:",
      signalText,
      "",
      "Note: This is a heuristic estimate, not proof that text was written by AI.",
    ].join("\n"),

    meter: { label: detection.likelihood, value: detection.score },

    sections: [
      { id: "detection", title: "AI likelihood", text: `${detection.likelihood} (${detection.score}/100)` },
      { id: "signals", title: "Signals", text: signalText },
    ],

    stats: [
      { label: "AI likelihood", value: detection.likelihood },
      { label: "Score", value: `${detection.score}/100` },
      { label: "Words", value: String(countWords(text)) },
      { label: "Sentences", value: String(splitSentences(text).length) },
    ],
  };
}

function humanSummarizer(input: string, opts?: Record<string, unknown>): ToolResult {
  const text = input.trim();

  if (!text) return { output: "", error: "Please provide some text." };

  const sentenceCount = Math.max(1, Math.min(20, Number(opts?.sentenceCount || 3)));

  // 1) humanize the wording, 2) summarize the result. Detection is NOT part of this tool.
  const humanized = humanize(text).text;
  const summary = summarizeText(humanized, sentenceCount);

  return {
    output: summary,
    sections: [{ id: "summary", title: "Human summary", text: summary }],
    stats: summarizeStats(text, summary),
  };
}

/* -------------------------------------------------------------------------- */
/*                         SENTIMENT / KEYWORDS                               */
/* -------------------------------------------------------------------------- */

const POSITIVE_WORDS = new Set([
  "good", "great", "excellent", "amazing", "awesome", "happy", "love", "best",
  "wonderful", "perfect", "nice", "success", "successful", "helpful", "positive",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "worst", "hate", "sad", "poor", "awful", "horrible",
  "problem", "angry", "disappointed", "negative", "failure", "failed",
]);

const KEYWORD_STOP_WORDS = new Set([
  ...SUMMARY_STOP_WORDS,
  "its", "than", "then", "into", "over", "after", "before", "these", "those",
]);

function sentimentAndKeywords(input: string, opts?: Record<string, unknown>): ToolResult {
  if (!input.trim()) return { output: "", error: "Please provide text." };

  const limit = Math.max(1, Math.min(100, Number(opts?.count || 10)));
  const words = getWords(input);

  const positiveScore = words.filter((word) => POSITIVE_WORDS.has(word)).length;
  const negativeScore = words.filter((word) => NEGATIVE_WORDS.has(word)).length;

  const sentiment =
    positiveScore > negativeScore ? "Positive" : negativeScore > positiveScore ? "Negative" : "Neutral";

  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < 3 || KEYWORD_STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  const keywords = [...counts.entries()]
    .sort((a, b) => (b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0])))
    .slice(0, limit);

  const keywordLines = keywords.length
    ? keywords.map(([word, n], index) => `${index + 1}. ${word} (${n})`).join("\n")
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

/* -------------------------------------------------------------------------- */
/*                             CLIENT PROCESSORS                              */
/* -------------------------------------------------------------------------- */

export const CLIENT_PROCESSORS: Record<string, ToolProcessor> = {
  /* ------------------------------- JSON ---------------------------------- */

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

  /* ----------------------------- Encoding -------------------------------- */

  "base64-encoder": (input) => ({ output: utf8ToBase64(input) }),

  "base64-decoder": (input) => {
    try {
      return { output: base64ToUtf8(input) };
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

  /* ----------------------------- Generators ------------------------------ */

  "uuid-generator": () => ({ output: crypto.randomUUID() }),

  "hash-generator": async (input) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return { output: hash };
  },

  /* ------------------------------- Text ---------------------------------- */

  "word-counter": (input) => ({
    output: [
      `Words: ${countWords(input)}`,
      `Characters: ${input.length}`,
      `Sentences: ${splitSentences(input).length}`,
    ].join("\n"),
  }),

  "character-counter": (input) => ({
    output: [
      `With spaces: ${input.length}`,
      `Without spaces: ${input.replace(/\s/g, "").length}`,
    ].join("\n"),
  }),

  "case-converter": (input, opts) => {
    const mode = (opts?.mode as string) || "upper";

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
    const lines = input.split("\n").filter((line) => line.trim());
    lines.sort((a, b) => (opts?.desc ? b.localeCompare(a) : a.localeCompare(b)));
    return { output: lines.join("\n") };
  },

  "text-reverser": (input) => ({ output: [...input].reverse().join("") }),

  "text-cleaner": (input) => ({ output: input.replace(/\s+/g, " ").trim() }),

  "lorem-ipsum-generator": (_, opts) => {
    const paras = Math.min(50, Math.max(1, Number(opts?.paragraphs || 3)));
    const lorem =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    return { output: Array(paras).fill(lorem).join("\n\n") };
  },

  "slug-generator": (input) => ({
    output: input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-"),
  }),

  "password-generator": (_, opts) => {
    const len = Math.min(128, Math.max(4, Number(opts?.length || 16)));

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts?.includeNumbers !== false) chars += "0123456789";
    if (opts?.includeSymbols !== false) chars += "!@#$%^&*";

    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);

    let password = "";
    for (let i = 0; i < len; i++) password += chars[arr[i] % chars.length];

    return { output: password };
  },

  /* ------------------------------ CSV ------------------------------------ */

  "csv-to-json": (input) => {
    const trimmed = input.trim();
    if (!trimmed) return { output: "[]" };

    const lines = trimmed.split(/\r?\n/);
    const headers = lines[0].split(",").map((header) => header.trim());

    const rows = lines.slice(1).map((line) => {
      const values = line.split(",");
      return Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()]));
    });

    return { output: JSON.stringify(rows, null, 2) };
  },

  "json-to-csv": (input) => {
    try {
      const data = JSON.parse(input);

      if (!Array.isArray(data) || !data.length) {
        return { output: "", error: "JSON must be a non-empty array" };
      }

      const keys = Object.keys(data[0]);

      const escapeCsv = (value: unknown) => {
        const str = String(value ?? "");
        return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
      };

      const rows = [
        keys.map(escapeCsv).join(","),
        ...data.map((row) => keys.map((key) => escapeCsv(row[key])).join(",")),
      ];

      return { output: rows.join("\n") };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },

  /* ---------------------------- Timestamp ------------------------------- */

  "timestamp-converter": (input) => {
    const ts = Number(input);

    if (isNaN(ts)) return { output: "", error: "Enter a valid Unix timestamp" };

    const ms = ts < 1e12 ? ts * 1000 : ts;
    const date = new Date(ms);

    if (isNaN(date.getTime())) return { output: "", error: "Invalid timestamp" };

    return { output: date.toISOString() + "\nLocal: " + date.toLocaleString() };
  },

  /* ---------------------------- Calculators ----------------------------- */

  "percentage-calculator": (input, opts) => {
    const val = Number(opts?.value ?? (input || 0));
    const pct = Number(opts?.percent || 0);

    if (opts?.mode === "change") {
      if (val === 0) return { output: "", error: "Original value cannot be zero" };
      return { output: `Change: ${(((pct - val) / val) * 100).toFixed(2)}%` };
    }

    return { output: `${pct}% of ${val} = ${((val * pct) / 100).toFixed(2)}` };
  },

  "emi-calculator": (_, opts) => {
    const P = Number(opts?.principal || 0);
    const annualRate = Number(opts?.rate || 0);
    const years = Number(opts?.tenure || 0);

    if (!P || !annualRate || !years) {
      return { output: "", error: "Enter principal, rate and tenure" };
    }

    const r = annualRate / 12 / 100;
    const n = years * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;

    return {
      output: [
        `Monthly EMI: ₹${emi.toFixed(2)}`,
        `Total Payment: ₹${total.toFixed(2)}`,
        `Total Interest: ₹${(total - P).toFixed(2)}`,
      ].join("\n"),
    };
  },

  "bmi-calculator": (_, opts) => {
    const weight = Number(opts?.weight || 0);
    const height = Number(opts?.height || 0) / 100;

    if (!weight || !height) {
      return { output: "", error: "Enter weight (kg) and height (cm)" };
    }

    const bmi = weight / (height * height);

    const category =
      bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

    return { output: `BMI: ${bmi.toFixed(1)} (${category})` };
  },

  "discount-calculator": (_, opts) => {
    const price = Number(opts?.price || 0);
    const discount = Number(opts?.discount || 0);
    const finalPrice = price - (price * discount) / 100;

    return {
      output: [
        `Original: ₹${price}`,
        `Discount: ${discount}%`,
        `Final Price: ₹${finalPrice.toFixed(2)}`,
        `You Save: ₹${(price - finalPrice).toFixed(2)}`,
      ].join("\n"),
    };
  },

  "gst-calculator": (_, opts) => {
    const amount = Number(opts?.amount || 0);
    const rate = Number(opts?.rate || 18);
    const mode = String(opts?.mode || "add");

    if (mode === "add") {
      const gst = (amount * rate) / 100;
      return {
        output: [
          `Base: ₹${amount}`,
          `GST (${rate}%): ₹${gst.toFixed(2)}`,
          `Total: ₹${(amount + gst).toFixed(2)}`,
        ].join("\n"),
      };
    }

    const base = amount / (1 + rate / 100);

    return {
      output: [
        `Total: ₹${amount}`,
        `Base: ₹${base.toFixed(2)}`,
        `GST: ₹${(amount - base).toFixed(2)}`,
      ].join("\n"),
    };
  },

  "age-calculator": (_, opts) => {
    const dob = new Date(String(opts?.dob || ""));

    if (isNaN(dob.getTime())) return { output: "", error: "Enter a valid date of birth" };

    const now = new Date();

    if (dob > now) return { output: "", error: "Date of birth cannot be in the future" };

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();

    if (now.getDate() - dob.getDate() < 0) months--;

    if (months < 0) {
      years--;
      months += 12;
    }

    return { output: `Age: ${years} years, ${months} months` };
  },

  "loan-calculator": (_, opts) => CLIENT_PROCESSORS["emi-calculator"]!("", opts),

  /* ------------------------------- Colors -------------------------------- */

  "hex-to-rgb": (input) => {
    const hex = input.replace("#", "").trim();

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return { output: "", error: "Invalid HEX color" };

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return { output: `rgb(${r}, ${g}, ${b})` };
  },

  "rgb-to-hex": (input) => {
    const match = input.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);

    if (!match) return { output: "", error: "Enter RGB like: 255, 128, 0" };

    const values = match.slice(1).map(Number);

    if (values.some((value) => value < 0 || value > 255)) {
      return { output: "", error: "RGB values must be between 0 and 255" };
    }

    const hex = values.map((value) => value.toString(16).padStart(2, "0")).join("");

    return { output: `#${hex}` };
  },

  "color-picker": (input) => {
    const hex = input.replace("#", "").trim();

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return { output: "", error: "Enter a 6-digit HEX color like #3b82f6" };
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }

    return {
      output: [
        `HEX: #${hex.toUpperCase()}`,
        `RGB: rgb(${r}, ${g}, ${b})`,
        `HSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      ].join("\n"),
    };
  },

  /* ------------------------------- URL ----------------------------------- */

  "url-parser": (input) => {
    try {
      const raw = input.trim();
      const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      const params = [...url.searchParams.entries()];

      const query = params.length
        ? params.map(([key, value]) => `  ${key} = ${value}`).join("\n")
        : "  (none)";

      return {
        output: [
          `Full URL: ${url.href}`,
          `Protocol: ${url.protocol.replace(":", "")}`,
          `Host: ${url.hostname}`,
          `Port: ${url.port || (url.protocol === "https:" ? "443" : "80")}`,
          `Path: ${url.pathname}`,
          `Query:\n${query}`,
          `Hash: ${url.hash || "(none)"}`,
          `Origin: ${url.origin}`,
        ].join("\n"),
      };
    } catch {
      return { output: "", error: "Invalid URL" };
    }
  },

  /* ------------------------------- Network ------------------------------- */

  "ip-validator": (input) => {
    const ip = input.trim();

    const v4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
    const v6 =
      /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)+:$/;

    if (v4.test(ip)) {
      const parts = ip.split(".").map(Number);

      const isPrivate =
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        parts[0] === 127;

      return {
        output: [
          "Valid IPv4",
          `Address: ${ip}`,
          "Version: 4",
          `Scope: ${isPrivate ? "Private / loopback" : "Public routable"}`,
        ].join("\n"),
      };
    }

    if (v6.test(ip)) {
      return { output: ["Valid IPv6", `Address: ${ip}`, "Version: 6"].join("\n") };
    }

    return { output: "", error: "Not a valid IPv4 or IPv6 address" };
  },

  "cidr-calculator": (input) => {
    const match = input.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);

    if (!match) return { output: "", error: "Enter CIDR like 192.168.1.0/24" };

    const octets = match[1].split(".").map(Number);
    const prefix = Number(match[2]);

    if (octets.some((octet) => octet > 255) || prefix < 0 || prefix > 32) {
      return { output: "", error: "Invalid CIDR notation" };
    }

    const ipInt =
      ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];

    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;

    const hosts =
      prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, 2 ** (32 - prefix) - 2);

    const formatIp = (value: number) =>
      [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join(".");

    return {
      output: [
        `Network: ${formatIp(network)}/${prefix}`,
        `Subnet mask: ${formatIp(mask)}`,
        `Broadcast: ${formatIp(broadcast)}`,
        `First host: ${prefix >= 31 ? formatIp(network) : formatIp(network + 1)}`,
        `Last host: ${prefix >= 31 ? formatIp(broadcast) : formatIp(broadcast - 1)}`,
        `Usable hosts: ${hosts}`,
      ].join("\n"),
    };
  },

  "mac-address-formatter": (input, opts) => {
    const hex = input.replace(/[^0-9a-fA-F]/g, "");

    if (hex.length !== 12) {
      return { output: "", error: "MAC address must contain 12 hex digits" };
    }

    const separator = opts?.format === "dash" ? "-" : opts?.format === "dot" ? "." : ":";
    const parts = hex.match(/.{2}/g)!.map((part) => part.toUpperCase());

    return { output: parts.join(separator) };
  },

  "email-validator": (input) => {
    const email = input.trim();

    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!regex.test(email)) return { output: "", error: "Invalid email address format" };

    const [local, domain] = email.split("@");
    const tld = domain.split(".").pop();

    return {
      output: ["Valid email format", `Local part: ${local}`, `Domain: ${domain}`, `TLD: ${tld}`].join("\n"),
    };
  },

  "http-status-lookup": (input) => {
    const codes: Record<number, string> = {
      100: "Continue", 101: "Switching Protocols", 102: "Processing",
      200: "OK", 201: "Created", 202: "Accepted", 204: "No Content", 206: "Partial Content",
      301: "Moved Permanently", 302: "Found", 304: "Not Modified",
      307: "Temporary Redirect", 308: "Permanent Redirect",
      400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
      405: "Method Not Allowed", 408: "Request Timeout", 409: "Conflict", 410: "Gone",
      413: "Payload Too Large", 415: "Unsupported Media Type", 418: "I'm a teapot",
      422: "Unprocessable Entity", 429: "Too Many Requests",
      500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable",
      504: "Gateway Timeout",
    };

    const code = Number(input.trim());

    if (!Number.isInteger(code) || code < 100 || code > 599) {
      return { output: "", error: "Enter an HTTP status code between 100 and 599" };
    }

    const family =
      code >= 500
        ? "5xx Server Error"
        : code >= 400
          ? "4xx Client Error"
          : code >= 300
            ? "3xx Redirection"
            : code >= 200
              ? "2xx Success"
              : "1xx Informational";

    return {
      output: [`Code: ${code}`, `Status: ${codes[code] || "Unknown"}`, `Class: ${family}`].join("\n"),
    };
  },

  "user-agent-parser": (input) => {
    const ua = input.trim();

    if (!ua) return { output: "", error: "Paste a User-Agent string" };

    const browser = /Edg\//.test(ua)
      ? "Microsoft Edge"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : /MSIE|Trident/.test(ua)
              ? "Internet Explorer"
              : "Unknown";

    const os = /Windows NT 10/.test(ua)
      ? "Windows 10/11"
      : /Windows NT/.test(ua)
        ? "Windows"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Android/.test(ua)
            ? "Android"
            : /iPhone|iPad|iPod/.test(ua)
              ? "iOS"
              : /Linux/.test(ua)
                ? "Linux"
                : "Unknown";

    const device = /iPad/.test(ua) ? "Tablet" : /Mobile|Android|iPhone/.test(ua) ? "Mobile" : "Desktop";

    return {
      output: [`Browser: ${browser}`, `OS: ${os}`, `Device: ${device}`, "", `Raw:\n${ua}`].join("\n"),
    };
  },

  /* -------------------------------- JWT ---------------------------------- */

  "jwt-decoder": (input) => {
    const parts = input.trim().split(".");

    if (parts.length !== 3) {
      return { output: "", error: "JWT must have three dot-separated parts" };
    }

    const decode = (part: string) => {
      const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
      return JSON.parse(base64ToUtf8(padded));
    };

    try {
      const header = decode(parts[0]);
      const payload = decode(parts[1]);

      return {
        output: [
          `Header:\n${JSON.stringify(header, null, 2)}`,
          `Payload:\n${JSON.stringify(payload, null, 2)}`,
          "Note: Signature is not verified.",
        ].join("\n\n"),
      };
    } catch {
      return { output: "", error: "Could not decode JWT — check the token format" };
    }
  },

  /* ------------------------------- DNS ---------------------------------- */

  "dns-lookup": async (input, opts) => {
    const name = input.trim().replace(/^https?:\/\//, "").split("/")[0];

    if (!name) return { output: "", error: "Enter a domain name" };

    const typeMap: Record<string, string> = {
      A: "1", AAAA: "28", CNAME: "5", MX: "15", TXT: "16", NS: "2",
    };

    const type = String(opts?.type || "A").toUpperCase();
    const typeNum = typeMap[type];

    if (!typeNum) return { output: "", error: "Unsupported record type" };

    try {
      const response = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${typeNum}`
      );

      if (!response.ok) {
        return { output: "", error: `DNS lookup failed (HTTP ${response.status})` };
      }

      const data = await response.json();

      if (data.Status !== 0) {
        return { output: "", error: `DNS lookup failed (RCODE ${data.Status})` };
      }

      const answers = (data.Answer || []) as Array<{ data: string; TTL?: number }>;

      const lines = answers.length
        ? answers
            .map((answer) => `  ${answer.data}${answer.TTL != null ? `  (TTL ${answer.TTL}s)` : ""}`)
            .join("\n")
        : "  (no records found)";

      return {
        output: [`Domain: ${name}`, `Type: ${type}`, "", `Records:\n${lines}`].join("\n"),
      };
    } catch {
      return { output: "", error: "DNS lookup failed — check your connection" };
    }
  },

  "what-is-my-ip": async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();

      return {
        output: ["Your public IP address:", data.ip, "", "Fetched via ipify.org"].join("\n"),
      };
    } catch {
      return { output: "", error: "Could not fetch your IP — check your connection" };
    }
  },

  /* -------------------------------- SEO ---------------------------------- */

  "meta-tag-generator": (_, opts) => {
    const title = String(opts?.title || "");
    const description = String(opts?.description || "");

    return {
      output: [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}">`,
        `<meta name="robots" content="index, follow">`,
      ].join("\n"),
    };
  },

  "robots-txt-generator": (_, opts) => ({
    output: [
      "User-agent: *",
      opts?.allowAll ? "Allow: /" : "Disallow: /admin\nDisallow: /dashboard",
      `Sitemap: ${opts?.sitemap || "https://example.com/sitemap.xml"}`,
    ].join("\n"),
  }),

  "sitemap-generator": (input) => {
    const urls = input
      .split(/\r?\n/)
      .map((url) => url.trim())
      .filter(Boolean);

    const entries = urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");

    return {
      output: [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        entries,
        "</urlset>",
      ].join("\n"),
    };
  },

  "open-graph-generator": (_, opts) => ({
    output: [
      `<meta property="og:title" content="${opts?.title || ""}">`,
      `<meta property="og:description" content="${opts?.description || ""}">`,
      `<meta property="og:image" content="${opts?.image || ""}">`,
    ].join("\n"),
  }),

  "serp-preview": (_, opts) => ({
    output: [
      `Title: ${opts?.title || "Page Title"}`,
      `URL: ${opts?.url || "https://example.com"}`,
      `Description: ${opts?.description || "Meta description appears here..."}`,
    ].join("\n"),
  }),

  "utm-builder": (_, opts) => {
    const base = String(opts?.url || "https://example.com");
    const params = new URLSearchParams();

    if (opts?.source) params.set("utm_source", String(opts.source));
    if (opts?.medium) params.set("utm_medium", String(opts.medium));
    if (opts?.campaign) params.set("utm_campaign", String(opts.campaign));

    const query = params.toString();

    return { output: query ? `${base}${base.includes("?") ? "&" : "?"}${query}` : base };
  },

  "keyword-density-checker": (input, opts) => {
    const keyword = String(opts?.keyword || "").trim().toLowerCase();

    if (!keyword) return { output: "", error: "Enter a keyword" };

    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    const count = words.filter((word) => word.includes(keyword)).length;
    const density = words.length ? ((count / words.length) * 100).toFixed(2) : "0";

    return {
      output: [
        `Total words: ${words.length}`,
        `Keyword "${keyword}" count: ${count}`,
        `Density: ${density}%`,
      ].join("\n"),
    };
  },

  /* ------------------------------ Conversion ----------------------------- */

  "unit-converter": (_, opts) => {
    const value = Number(opts?.value || 0);
    const from = String(opts?.from || "m");
    const to = String(opts?.to || "ft");

    const length: Record<string, number> = { m: 1, km: 1000, ft: 0.3048, in: 0.0254, mi: 1609.34 };

    if (!(from in length) || !(to in length)) {
      return { output: "", error: "Unsupported unit" };
    }

    const result = (value * length[from]) / length[to];

    return { output: `${value} ${from} = ${result.toFixed(4)} ${to}` };
  },

  "data-converter": (_, opts) => {
    const value = Number(opts?.value || 0);
    const from = String(opts?.from || "MB");
    const to = String(opts?.to || "GB");

    const units: Record<string, number> = {
      B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4,
    };

    if (!(from in units) || !(to in units)) {
      return { output: "", error: "Unsupported unit" };
    }

    const result = (value * units[from]) / units[to];

    return { output: `${value} ${from} = ${result.toFixed(4)} ${to}` };
  },

  "currency-converter": (_, opts) => {
    // Static fallback rates. For live conversion use a server/API source.
    const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, AUD: 1.53 };

    const value = Number(opts?.value || 0);
    const from = String(opts?.from || "USD");
    const to = String(opts?.to || "INR");

    if (!(from in rates) || !(to in rates)) {
      return { output: "", error: "Unsupported currency" };
    }

    const result = (value / rates[from]) * rates[to];

    return { output: `${value} ${from} = ${result.toFixed(2)} ${to}` };
  },

  /* ------------------------------ Text tools ----------------------------- */

  "text-summarizer": (input, opts) => {
    const text = input.trim();

    if (!text) return { output: "", error: "Please provide some text." };

    const sentenceCount = Math.max(1, Math.min(20, Number(opts?.sentenceCount || 3)));
    const summary = summarizeText(text, sentenceCount);

    return {
      output: summary,
      stats: summarizeStats(text, summary),
      sections: [{ id: "summary", title: "Summary", text: summary }],
    };
  },

  // These three tools are independent:
  //   human-summarizer      -> humanize + summarize
  //   ai-likelihood-detector -> detection only
  //   humanize-text         -> humanization only
  "human-summarizer": humanSummarizer,
  "ai-likelihood-detector": detectOnly,
  "humanize-text": humanizeOnly,

  "text-analyzer": (input) => {
    if (!input.trim()) return { output: "", error: "Please provide text." };

    const symbols = specialSymbolStats(input);

    return {
      output: [
        `Words: ${countWords(input)}`,
        `Characters: ${input.length}`,
        `Characters without spaces: ${input.replace(/\s/g, "").length}`,
        `Sentences: ${splitSentences(input).length}`,
        `Special symbol types: ${symbols.types}`,
        `Special symbols used: ${symbols.list.length ? symbols.list.join(" ") : "None"}`,
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
    const length = Math.min(5000, Math.max(1, Number(opts?.length || 100)));
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);

    let text = "";
    for (let i = 0; i < length; i++) text += chars[arr[i] % chars.length];

    return { output: text };
  },

  /* ------------------------- Internet processors ------------------------- */

  ...INTERNET_PROCESSORS,
};

/* -------------------------------------------------------------------------- */
/*                                TOOL SETS                                   */
/* -------------------------------------------------------------------------- */

export const CALCULATOR_TOOLS = new Set([
  "percentage-calculator",
  "emi-calculator",
  "bmi-calculator",
  "discount-calculator",
  "gst-calculator",
  "age-calculator",
  "loan-calculator",
  "unit-converter",
  "data-converter",
  "currency-converter",
]);

export const SEO_FORM_TOOLS = new Set([
  "meta-tag-generator",
  "open-graph-generator",
  "serp-preview",
  "utm-builder",
  "robots-txt-generator",
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
  "uuid-generator",
  "password-generator",
  "what-is-my-ip",
  "random-text-generator",
  "generate-random-email",
  "generate-otp",
  "verify-otp",
  "query-builder",
]);

export const FILE_CLIENT_TOOLS = new Set([
  "image-converter",
  "resize-image",
  "crop-image",
  "jpg-to-png",
  "png-to-jpg",
  "webp-converter",
  "rotate-image",
  "flip-image",
]);

export const SERVER_TOOLS = new Set<string>([]);