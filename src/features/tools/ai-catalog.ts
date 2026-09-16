import type { ToolMeta } from "@/features/tools/client-processors";

export const AI_TOOL_SLUGS = new Set([
  "text-summarizer",
  "text-analyzer",
  "keyword-extractor",
  "sentiment-analyzer",
  "password-generator",
  "email-validator",
  "text-case-converter",
  "human-summarizer",
  "ai-likelihood-detector",
  "humanize-text",
  "text-cleaner",
  "slug-generator",
  "random-text-generator",
]);

const privacyFaq = {
  question: "Is my text sent to a server?",
  answer: "No. These AI tools run entirely in your browser. Your text never leaves your device.",
};

export const AI_TOOLS: ToolMeta[] = [
  {
    id: "text-summarizer",
    slug: "text-summarizer",
    name: "Text Summarizer",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Summarize long text into the most important sentences.",
    long_description: "Extractive summarization ranks sentences by keyword frequency and keeps the most important ones in original order.",
    how_to_use: ["Paste an article or notes", "Choose how many sentences to keep", "Click Process", "Copy or download the summary"],
    features: ["Extractive ranking", "Keeps original sentence order", "Private — processed locally"],
    faq: [privacyFaq, { question: "Is Text Summarizer free?", answer: "Yes, this tool is free to use." }],
    related_tools: ["human-summarizer", "text-analyzer", "sentiment-analyzer"],
    seo_title: "Text Summarizer — Summarize Text in Your Browser",
    meta_description: "Summarize long text into key sentences in your browser. Free, private, no upload required.",
  },
  {
    id: "human-summarizer",
    slug: "human-summarizer",
    name: "Humanize & Detect",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Detect AI-like writing, rewrite it in plainer language, and summarize it — all in one pass.",
    long_description: "One tool for three jobs: a heuristic AI-likelihood score, rule-based humanizing of stiff phrases, and an extractive summary of the rewritten text.",
    how_to_use: ["Paste long or AI-sounding text", "Choose how many summary sentences to keep", "Click Process", "Read the score, humanized text, and summary"],
    features: ["AI-likelihood meter", "Rule-based humanizing", "Extractive summary", "Copy each result separately", "Private — processed locally"],
    faq: [
      privacyFaq,
      { question: "Is this an accurate AI detector?", answer: "No. The score is a heuristic based on common AI-like phrasing, not a guaranteed detection." },
      { question: "Will this bypass AI detectors?", answer: "No. Humanizing only simplifies wording for readability." },
    ],
    related_tools: ["text-summarizer", "text-cleaner", "text-analyzer"],
    seo_title: "Humanize & Detect — AI Likelihood, Humanize, Summarize",
    meta_description: "Detect AI-like writing, humanize stiff phrasing, and summarize text in your browser. Free and private.",
  },
  {
    id: "text-analyzer",
    slug: "text-analyzer",
    name: "Text Analyzer",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Count words, characters and sentences in any text.",
    how_to_use: ["Paste your text", "Click Process", "Read the word, character and sentence counts"],
    features: ["Word count", "Characters with and without spaces", "Sentence count"],
    faq: [privacyFaq],
    related_tools: ["text-summarizer", "sentiment-analyzer"],
    seo_title: "Text Analyzer — Word and Character Counter",
    meta_description: "Analyze text for word, character and sentence counts in your browser.",
  },
  {
    id: "sentiment-analyzer",
    slug: "sentiment-analyzer",
    name: "Sentiment & Keywords",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Detect sentiment and extract the most frequent keywords from the same text.",
    long_description: "One pass over your text: score positive vs negative wording, then rank the top keywords after stop-word filtering.",
    how_to_use: ["Paste a review, article or comment", "Set how many keywords to return", "Click Process", "Read sentiment, scores and keywords"],
    features: ["Positive / negative / neutral", "Score breakdown", "Stop-word keyword ranking", "Private — processed locally"],
    faq: [privacyFaq, { question: "Is Sentiment & Keywords free?", answer: "Yes, this tool is free to use." }],
    related_tools: ["text-analyzer", "text-summarizer"],
    seo_title: "Sentiment & Keyword Analyzer — Tone and Keywords in Text",
    meta_description: "Analyze sentiment and extract keywords from any text in your browser. Free, private, no account required.",
  },
  {
    id: "password-generator",
    slug: "password-generator",
    name: "Password Generator",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Generate a secure random password.",
    how_to_use: ["Set length and character options", "Click Process", "Copy the generated password"],
    features: ["Letters, numbers and symbols", "Cryptographically random", "Generated on your device"],
    faq: [privacyFaq],
    related_tools: ["random-text-generator", "slug-generator"],
    seo_title: "Password Generator — Create Strong Passwords",
    meta_description: "Generate a strong random password in your browser. Free and private.",
  },
  {
    id: "email-validator",
    slug: "email-validator",
    name: "Email Validator",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Check whether an email address is formatted correctly.",
    how_to_use: ["Enter an email address", "Click Process", "See whether the format is valid"],
    features: ["Format check", "Local and domain parts", "Private — processed locally"],
    faq: [privacyFaq],
    related_tools: ["slug-generator", "text-cleaner"],
    seo_title: "Email Validator — Check Email Format",
    meta_description: "Validate email address format in your browser. Free and private.",
  },
  {
    id: "text-case-converter",
    slug: "text-case-converter",
    name: "Text Case Converter",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Convert text to upper, lower, title or capitalized case.",
    how_to_use: ["Paste your text", "Choose a case", "Click Process"],
    features: ["Upper, lower, title and capitalize", "Instant conversion", "Private — processed locally"],
    faq: [privacyFaq],
    related_tools: ["text-cleaner", "slug-generator"],
    seo_title: "Case Converter — Change Text Case Online",
    meta_description: "Convert text between upper, lower, title and capitalize case in your browser.",
  },
  {
    id: "text-cleaner",
    slug: "text-cleaner",
    name: "Text Cleaner",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Remove extra spaces and line breaks from text.",
    how_to_use: ["Paste messy text", "Click Process", "Copy the cleaned result"],
    features: ["Collapse whitespace", "Trim edges", "Private — processed locally"],
    faq: [privacyFaq],
    related_tools: ["text-case-converter", "slug-generator"],
    seo_title: "Text Cleaner — Remove Extra Spaces",
    meta_description: "Clean extra spaces and line breaks from text in your browser.",
  },
  {
    id: "slug-generator",
    slug: "slug-generator",
    name: "Slug Generator",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Turn text into a URL-friendly slug.",
    how_to_use: ["Enter a title or phrase", "Click Process", "Copy the slug"],
    features: ["Lowercase", "Hyphenated", "Strips special characters"],
    faq: [privacyFaq],
    related_tools: ["text-cleaner", "text-case-converter"],
    seo_title: "Slug Generator — URL-Friendly Slugs",
    meta_description: "Generate a URL-friendly slug from any text in your browser.",
  },
  {
    id: "random-text-generator",
    slug: "random-text-generator",
    name: "Random Text Generator",
    category_slug: "ai",
    processing_type: "client",
    short_description: "Generate random placeholder text of a given length.",
    how_to_use: ["Set the length", "Click Process", "Copy the generated text"],
    features: ["Adjustable length", "Letters and spaces", "Generated on your device"],
    faq: [privacyFaq],
    related_tools: ["password-generator", "text-summarizer"],
    seo_title: "Random Text Generator — Placeholder Text",
    meta_description: "Generate random placeholder text in your browser. Free and private.",
  },
];

export const AI_CATEGORY = {
  slug: "ai",
  name: "AI Tools",
  description: "Summarize, analyze and transform text in your browser. Your input never leaves your device.",
  icon: "sparkles",
  tools: AI_TOOLS,
};

export function getAiTool(category: string, slug: string): ToolMeta | null {
  if (category !== "ai") return null;
  if (slug === "keyword-extractor") {
    const merged = AI_TOOLS.find((t) => t.slug === "sentiment-analyzer");
    return merged ? { ...merged, id: "keyword-extractor", slug: "keyword-extractor" } : null;
  }
  if (slug === "humanize-text" || slug === "ai-likelihood-detector") {
    const merged = AI_TOOLS.find((t) => t.slug === "human-summarizer");
    return merged ? { ...merged, id: slug, slug } : null;
  }
  return AI_TOOLS.find((t) => t.slug === slug) ?? null;
}

export function collapseMergedAiTools<T extends { slug?: string }>(tools: T[]): T[] {
  const slugs = new Set(tools.map((t) => t.slug));
  return tools.filter((t) => {
    if (t.slug === "keyword-extractor" && slugs.has("sentiment-analyzer")) return false;
    if ((t.slug === "humanize-text" || t.slug === "ai-likelihood-detector") && slugs.has("human-summarizer")) return false;
    return true;
  });
}

export function localAiTools(params?: { category?: string; popular?: boolean }): ToolMeta[] {
  if (params?.category && params.category !== "ai") return [];
  const popular = new Set(["text-summarizer", "human-summarizer", "sentiment-analyzer"]);
  if (params?.popular) return AI_TOOLS.filter((t) => popular.has(t.slug));
  return AI_TOOLS;
}
