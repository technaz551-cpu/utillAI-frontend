/**
 * humanizer.ts
 *
 * Rule-based text humanizer. No AI model, runs fully on the client.
 *
 * What it does (in order, per paragraph):
 *  1. Protects things that must never change (code, URLs, emails, "quoted text").
 *  2. Replaces stock AI phrases and words with several natural alternatives,
 *     keeping grammar (verb forms, a/an, capitalisation) intact.
 *  3. Swaps em dashes for commas / hyphens.
 *  4. Adds contractions ("do not" -> "don't").
 *  5. Rewrites sentence openers ("Furthermore," -> "Also," / dropped).
 *  6. Reshapes rhythm: splits some long sentences, merges some short ones,
 *     and is more aggressive when every sentence is about the same length.
 *  7. Tidies spacing, capitalisation and punctuation.
 *
 * Pass a `seed` to get repeatable output; leave it out for a fresh variation
 * each time the user clicks the button.
 */

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface HumanizeOptions {
  /** 0 = touch very little, 1 = rewrite everything it safely can. Default 0.7 */
  intensity?: number;
  /** Turn "do not" into "don't" etc. Turn off for formal/academic text. Default true */
  contractions?: boolean;
  /** Same seed + same text = same output. Omit for a different result each run. */
  seed?: number;
}

export interface RhythmStats {
  sentences: number;
  meanWords: number;
  stdev: number;
  /** stdev / mean. Higher = more varied sentence lengths. */
  variation: number;
}

export interface HumanizeResult {
  text: string;
  /** Number of individual edits made */
  changes: number;
  /** Count of typical AI-sounding patterns before / after */
  tellsBefore: number;
  tellsAfter: number;
  before: RhythmStats;
  after: RhythmStats;
}

type Rng = () => number;

interface Ctx {
  rng: Rng;
  intensity: number;
  contractions: boolean;
  changes: { n: number };
  lastOpener: string;
}

interface Rule {
  re: RegExp;
  to: readonly string[] | ((match: string, rng: Rng) => string);
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function createRng(seed?: number): Rng {
  if (seed === undefined) return Math.random;
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const wordCount = (s: string) => (s.match(/\S+/g) ?? []).length;
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/** Copy the capitalisation style of `source` onto `replacement`. */
function matchCase(source: string, replacement: string): string {
  if (!replacement) return replacement;
  if (source.length > 2 && source === source.toUpperCase() && /[A-Z]/.test(source)) {
    return replacement.toUpperCase();
  }
  if (/^[A-Z]/.test(source)) return upperFirst(replacement);
  return replacement;
}

function capitalizeSentence(s: string): string {
  return s.replace(
    /^([\s"'“‘(\[]*)([a-z])/,
    (_m, pre: string, ch: string) => pre + ch.toUpperCase()
  );
}

/* ---------------------------- protected segments --------------------------- */

const PROTECTED =
  /```[\s\S]*?```|`[^`\n]+`|https?:\/\/[^\s)]+|www\.[^\s)]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|"[^"\n]{2,400}"|“[^”\n]{2,400}”|\{\{[^}\n]+\}\}/g;

function protect(text: string) {
  const store: string[] = [];
  const masked = text.replace(PROTECTED, (m) => {
    store.push(m);
    return `\uE000${store.length - 1}\uE001`;
  });
  const restore = (t: string) =>
    t.replace(/\uE000(\d+)\uE001/g, (_m, i: string) => store[Number(i)] ?? "");
  return { masked, restore };
}

/* ------------------------------ sentences/stats ---------------------------- */

const ABBREVIATIONS = /\b(?:e\.g|i\.e|vs|Mr|Mrs|Ms|Dr|Prof)\./g;

function splitSentences(paragraph: string): string[] {
  const masked = paragraph.replace(ABBREVIATIONS, (m) => m.replace(/\./g, "\uE002"));
  return masked
    .split(/(?<=[.!?]["'”’)\]]?)\s+/)
    .map((s) => s.replace(/\uE002/g, ".").trim())
    .filter(Boolean);
}

function lengthStats(lens: number[]) {
  if (!lens.length) return { mean: 0, sd: 0, cv: 0 };
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const variance = lens.reduce((s, n) => s + (n - mean) ** 2, 0) / lens.length;
  const sd = Math.sqrt(variance);
  return { mean, sd, cv: mean ? sd / mean : 0 };
}

export function rhythmStats(text: string): RhythmStats {
  const lens = text
    .split(/\n+/)
    .flatMap((p) => splitSentences(p))
    .map(wordCount)
    .filter((n) => n > 0);
  const { mean, sd, cv } = lengthStats(lens);
  return {
    sentences: lens.length,
    meanWords: round(mean, 1),
    stdev: round(sd, 1),
    variation: round(cv, 2),
  };
}

/* ------------------------------- AI "tells" -------------------------------- */

const AI_TELLS: RegExp[] = [
  /\bin today['’]s\b/gi,
  /\bin the modern era\b/gi,
  /\b(?:furthermore|moreover|additionally|consequently)\b/gi,
  /\b(?:delve|delves|delved|delving)\b/gi,
  /\b(?:crucial|pivotal|multifaceted|transformative|seamless(?:ly)?|cutting-edge|myriad|plethora)\b/gi,
  /\bit is (?:important|worth|crucial|essential) (?:to )?(?:note|noting|mention)/gi,
  /\b(?:utiliz|leverag|facilitat|underscor)\w*/gi,
  /\bin conclusion\b/gi,
  /\bplays? an? (?:crucial|vital|pivotal|key|significant|important) role\b/gi,
  /—/g,
];

/** How many typical AI-sounding patterns the text still contains. */
export function countAiTells(text: string): number {
  return AI_TELLS.reduce((sum, re) => sum + (text.match(re)?.length ?? 0), 0);
}

/* -------------------------------------------------------------------------- */
/*                          PHRASE / WORD REPLACEMENT                         */
/* -------------------------------------------------------------------------- */

/** Keeps a trailing comma if the matched text had one. Empty choice = drop. */
const alt =
  (options: readonly string[]) =>
  (m: string, rng: Rng): string => {
    const choice = pick(rng, options);
    return choice ? choice + (m.endsWith(",") ? "," : "") : "";
  };

/** Regular verb family: base / -s / -ed / -ing. */
function verbFamily(
  re: RegExp,
  forms: { base: string; s: string; ed: string; ing: string }
): Rule {
  return {
    re,
    to: (m) => {
      const l = m.toLowerCase();
      if (l.endsWith("ing")) return forms.ing;
      if (l.endsWith("ed")) return forms.ed;
      if (l.endsWith("s")) return forms.s;
      return forms.base;
    },
  };
}

const VERB_BEFORE = "(?:to|can|will|could|would|should|may|might|must|and)";

const REPLACEMENT_RULES: Rule[] = [
  /* ------------------------------- phrases -------------------------------- */
  {
    re: /\bin today['’]s (?:fast-paced |digital |modern |ever-changing )?(?:world|society|age|era)\b,?/gi,
    to: alt(["these days", "right now", "today"]),
  },
  { re: /\bin the modern era\b,?/gi, to: alt(["these days", "today", "nowadays"]) },
  {
    re: /\bit (?:is|'s) (?:important|crucial|essential|vital) to (?:note|remember|understand|mention|highlight|emphasize) that\b,?|\bit is worth (?:noting|mentioning|remembering) that\b,?|\bit (?:should|must) be noted that\b,?/gi,
    to: alt([""]),
  },
  { re: /\ba (?:significant|large|considerable|substantial|great) number of\b/gi, to: ["many", "lots of", "plenty of"] },
  { re: /\ba (?:significant|large|considerable|substantial|great) (?:amount|deal) of\b/gi, to: ["a lot of", "plenty of"] },
  { re: /\bdue to the fact that\b/gi, to: ["because", "since"] },
  { re: /\bin order to\b/gi, to: ["to"] },
  { re: /\bat this point in time\b/gi, to: ["now", "right now", "at the moment"] },
  { re: /\b(?:has|have) the ability to\b/gi, to: ["can"] },
  { re: /\b(?:is|are) able to\b/gi, to: ["can"] },
  {
    re: /\bplay(?:s)? an? (?:crucial|vital|pivotal|key|significant|important|major) role in\b/gi,
    to: (m, rng) =>
      /^play\b/i.test(m)
        ? pick(rng, ["matter for", "shape", "are central to"])
        : pick(rng, ["matters for", "shapes", "is central to"]),
  },
  { re: /\bin the process of (?=\w+ing\b)/gi, to: ["while "] },
  { re: /\bwith (?:regard|respect) to\b/gi, to: ["about", "on", "regarding"] },
  { re: /\bfor the purpose of\b/gi, to: ["for"] },
  { re: /\bin addition to\b/gi, to: ["besides", "on top of", "along with"] },
  { re: /\ba (?:wide )?(?:range|variety|array) of\b/gi, to: ["many", "all kinds of", "lots of"] },
  { re: /\ba (?:myriad|plethora) of\b/gi, to: ["many", "lots of"] },
  { re: /\bin (?:conclusion|summary),?|\bto (?:sum up|summarize),?/gi, to: alt(["Overall", "All in all", "In the end"]) },
  {
    re: /\bon the other hand,?/gi,
    to: (m, rng) => {
      const c = pick(rng, ["but", "then again", "still"]);
      return c === "but" ? c : c + (m.endsWith(",") ? "," : "");
    },
  },
  { re: /\bwhen it comes to\b/gi, to: ["for", "with", "on"] },
  { re: /\bserves as\b/gi, to: ["is"] },
  { re: /\ba testament to\b/gi, to: ["proof of", "a sign of"] },
  { re: /\bin the realm of\b/gi, to: ["in"] },
  { re: /\bhas become increasingly\b/gi, to: ["is getting more", "is now more"] },
  { re: /\bhave become increasingly\b/gi, to: ["are getting more", "are now more"] },
  { re: /\brapidly (?:evolving|changing)\b/gi, to: ["fast-changing", "quickly changing"] },
  {
    re: /\bdelv(?:e|es|ed|ing) into\b/gi,
    to: (m, rng) => {
      const l = m.toLowerCase();
      if (l.startsWith("delving")) return pick(rng, ["digging into", "looking at", "getting into"]);
      if (l.startsWith("delved")) return pick(rng, ["dug into", "looked at", "got into"]);
      if (l.startsWith("delves")) return pick(rng, ["digs into", "looks at", "gets into"]);
      return pick(rng, ["dig into", "look at", "get into"]);
    },
  },

  /* ------------------------------- verbs ---------------------------------- */
  verbFamily(/\butili[sz](?:e|es|ed|ing)\b/gi, { base: "use", s: "uses", ed: "used", ing: "using" }),
  { re: /\butili[sz]ation\b/gi, to: ["use"] },
  verbFamily(/\bfacilitat(?:e|es|ed|ing)\b/gi, { base: "support", s: "supports", ed: "supported", ing: "supporting" }),
  verbFamily(/\bdemonstrat(?:e|es|ed|ing)\b/gi, { base: "show", s: "shows", ed: "showed", ing: "showing" }),
  verbFamily(/\bcommenc(?:e|es|ed|ing)\b/gi, { base: "start", s: "starts", ed: "started", ing: "starting" }),
  verbFamily(/\bobtain(?:s|ed|ing)?\b/gi, { base: "get", s: "gets", ed: "got", ing: "getting" }),
  verbFamily(new RegExp(`(?<=\\b${VERB_BEFORE} )leverage\\b|\\bleverag(?:es|ing)\\b`, "gi"), {
    base: "use", s: "uses", ed: "used", ing: "using",
  }),
  verbFamily(
    new RegExp(
      `(?<=\\b${VERB_BEFORE} )foster\\b|\\bfoster(?:s|ed|ing)\\b(?! (?:care|parents?|homes?|famil(?:y|ies)|child|children|mother|father|kids?|carers?)\\b)`,
      "gi"
    ),
    { base: "encourage", s: "encourages", ed: "encouraged", ing: "encouraging" }
  ),
  verbFamily(/\bunderscor(?:es|ed|ing)(?= (?:the|how|that|its|their|this|our|why|just)\b)/gi, {
    base: "highlight", s: "highlights", ed: "highlighted", ing: "highlighting",
  }),

  /* ------------------------------ adjectives ------------------------------ */
  { re: /\bcrucial\b/gi, to: ["key", "important"] },
  { re: /\bcrucially\b/gi, to: ["importantly"] },
  { re: /\bpivotal\b/gi, to: ["key", "central"] },
  { re: /\bmulti-?faceted\b/gi, to: ["complex", "layered"] },
  { re: /\btransformative\b/gi, to: ["far-reaching", "game-changing"] },
  { re: /\bcomprehensive\b/gi, to: ["thorough", "complete"] },
  { re: /\bseamless\b/gi, to: ["smooth"] },
  { re: /\bseamlessly\b/gi, to: ["smoothly"] },
  { re: /\bcutting-edge\b/gi, to: ["modern", "up-to-date"] },
  { re: /\bnumerous\b/gi, to: ["many"] },
  { re: /\bvarious\b/gi, to: ["different", "several"] },
  {
    re: /(?<=\b(?:a|an|the|of|with|some|its|their|this|these|in|have|has|had) )significant\b(?! (?:others?|digits?|figures?|differences?)\b)/gi,
    to: ["big", "major", "real"],
  },

  /* ------------------------------ other words ----------------------------- */
  { re: /\bindividuals\b/gi, to: ["people"] },
  { re: /\bapproximately\b/gi, to: ["about", "roughly"] },
  { re: /\bsubsequently\b/gi, to: ["later", "then", "after that"] },
  { re: /\bprior to\b/gi, to: ["before"] },
  { re: /\brequire assistance\b/gi, to: ["need help"] },
];

function applyReplacementRules(text: string, ctx: Ctx): string {
  // Stock AI phrases are the easiest giveaway, so these are replaced almost every time.
  const p = 0.7 + 0.3 * ctx.intensity;
  let out = text;
  for (const rule of REPLACEMENT_RULES) {
    out = out.replace(rule.re, (match) => {
      if (ctx.rng() > p) return match;
      const next = typeof rule.to === "function" ? rule.to(match, ctx.rng) : pick(ctx.rng, rule.to);
      ctx.changes.n++;
      return matchCase(match, next);
    });
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*                               SMALL TRANSFORMS                             */
/* -------------------------------------------------------------------------- */

function replaceDashes(text: string, ctx: Ctx): string {
  // One style per paragraph so paired dashes ("a — b — c") stay consistent.
  const sep = ctx.rng() < 0.7 ? ", " : " - ";
  return text.replace(/\s*—\s*|\s+–\s+/g, () => {
    ctx.changes.n++;
    return sep;
  });
}

const CONTRACTION_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["it is", "it's"], ["that is", "that's"], ["there is", "there's"], ["here is", "here's"],
  ["what is", "what's"], ["who is", "who's"], ["he is", "he's"], ["she is", "she's"],
  ["I am", "I'm"], ["we are", "we're"], ["they are", "they're"], ["you are", "you're"],
  ["I will", "I'll"], ["we will", "we'll"], ["they will", "they'll"], ["you will", "you'll"], ["it will", "it'll"],
  ["do not", "don't"], ["does not", "doesn't"], ["did not", "didn't"],
  ["cannot", "can't"], ["can not", "can't"], ["will not", "won't"],
  ["would not", "wouldn't"], ["should not", "shouldn't"], ["could not", "couldn't"],
  ["is not", "isn't"], ["are not", "aren't"], ["was not", "wasn't"], ["were not", "weren't"],
  ["has not", "hasn't"], ["have not", "haven't"], ["had not", "hadn't"],
];

// The lookahead means "it is" at the end of a clause ("...what it is.") is left alone.
const CONTRACTION_RULES = CONTRACTION_PAIRS.map(([from, to]) => ({
  re: new RegExp(`\\b${from.replace(/ /g, "\\s+")}\\b(?=\\s+[\\w"'(\\uE000])`, "gi"),
  to,
}));

function applyContractions(text: string, ctx: Ctx): string {
  const p = 0.35 + 0.55 * ctx.intensity;
  let out = text;
  for (const { re, to } of CONTRACTION_RULES) {
    out = out.replace(re, (m) => {
      if (ctx.rng() > p) return m;
      ctx.changes.n++;
      return matchCase(m, to);
    });
  }
  return out;
}

/** "A, B, and C" -> "A, B and C" (only for single-word lists, only sometimes). */
function relaxOxfordComma(text: string, ctx: Ctx): string {
  return text.replace(
    /\b([A-Za-z'-]+), ([A-Za-z'-]+), and ([A-Za-z'-]+)\b/g,
    (m, a: string, b: string, c: string) => {
      if (ctx.rng() > 0.6 * ctx.intensity) return m;
      ctx.changes.n++;
      return `${a}, ${b} and ${c}`;
    }
  );
}

const OPENER_RULES: ReadonlyArray<{ re: RegExp; options: readonly string[] }> = [
  {
    re: /^(?:Furthermore|Moreover|Additionally|In addition)\s*,\s*/i,
    options: ["Also, ", "Plus, ", "On top of that, ", "", ""],
  },
  { re: /^(?:Therefore|Consequently|Thus|Hence)\s*,\s*/i, options: ["So, ", "So ", "That's why "] },
  { re: /^(?:Nevertheless|Nonetheless)\s*,\s*/i, options: ["Still, ", "Even so, ", "But "] },
  { re: /^Ultimately\s*,\s*/i, options: ["In the end, ", "At the end of the day, ", ""] },
];

function rewriteOpener(sentence: string, ctx: Ctx): string {
  for (const rule of OPENER_RULES) {
    const m = sentence.match(rule.re);
    if (!m) continue;
    if (ctx.rng() > 0.5 + 0.5 * ctx.intensity) return sentence;
    let choice = pick(ctx.rng, rule.options);
    if (choice && choice === ctx.lastOpener) choice = pick(ctx.rng, rule.options);
    ctx.lastOpener = choice;
    ctx.changes.n++;
    return choice + sentence.slice(m[0].length);
  }
  return sentence;
}

/** Fix "a important" / "an big" after replacements. */
function fixArticles(text: string): string {
  return text.replace(/\b([Aa])(n?)\s+([a-z][a-z'-]*)/g, (match, a: string, n: string, word: string) => {
    const vowelStart = /^[aeiou]/.test(word);
    const vowelSound = vowelStart
      ? !/^(uni|use|usu|uti|eu|one|once|ubiq)/.test(word)
      : /^(hour|honest|honor|honour|heir)/.test(word);
    if (vowelSound && !n) return `${a}n ${word}`;
    if (!vowelSound && n) return `${a} ${word}`;
    return match;
  });
}

function tidy(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/([.!?])\s*,/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/^[,;:\s]+/, "")
    .trim();
}

/* -------------------------------------------------------------------------- */
/*                              SENTENCE RHYTHM                               */
/* -------------------------------------------------------------------------- */

const SAFE_MERGE_STARTS = new Set([
  "the", "this", "that", "it", "they", "we", "these", "those", "there",
  "he", "she", "you", "our", "their", "its", "his", "her", "some", "many", "most", "each",
]);

// A ", and ..." is only treated as a clause break when a subject-like word follows,
// so verb lists ("develop skills, adapt to change, and understand ...") stay intact.
const SUBJECT_STARTS = new Set([
  ...SAFE_MERGE_STARTS, "a", "an", "i", "people", "everyone", "nobody", "someone", "there",
]);

const firstWord = (s: string) => (s.match(/^[^\s]+/)?.[0] ?? "").toLowerCase().replace(/[^a-z']/g, "");

function splitSentenceAt(
  s: string,
  ctx: Ctx,
  minSide: number,
  preferImbalance: boolean
): [string, string] | null {
  if (/[?!]["')\]]?$/.test(s)) return null;

  const re =
    /,\s+(and|but|so)\s+(?=(?!that\b)[a-z\uE000])|;\s+|,\s+which\s+(?=(?:is|are|was|means|makes|helps|allows|lets|can|will|has|have|shows|gives|leads|takes|requires|creates)\b)/g;

  const options: Array<{ left: string; right: string; score: number }> = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(s)) !== null) {
    const left = s.slice(0, m.index).replace(/[,;:\s]+$/, "");
    const rest = s.slice(m.index + m[0].length);
    const leftWords = wordCount(left);
    const restWords = wordCount(rest);
    if (leftWords < minSide || restWords < minSide) continue;

    const kind = m[1]?.toLowerCase();
    let right: string;

    if (kind) {
      // Avoid splitting lists like "red, green, and blue paint".
      const lastChunk = left.split(",").pop() ?? "";
      if (wordCount(lastChunk) < 3) continue;
      if (kind === "and" && !SUBJECT_STARTS.has(firstWord(rest))) continue;
      if (kind === "and") right = ctx.rng() < 0.5 ? `And ${rest}` : rest;
      else if (kind === "but") right = `But ${rest}`;
      else right = `So ${rest}`;
    } else if (/^,\s+which/.test(m[0])) {
      right = `That ${rest}`;
    } else {
      right = rest; // semicolon
    }

    options.push({ left: `${left}.`, right, score: Math.abs(leftWords - restWords) });
  }

  if (!options.length) return null;
  const chosen = preferImbalance
    ? options.sort((a, b) => b.score - a.score)[0]
    : pick(ctx.rng, options);
  return [chosen.left, capitalizeSentence(chosen.right)];
}

function reshape(sentences: string[], ctx: Ctx): string[] {
  const { mean, cv } = lengthStats(sentences.map(wordCount));

  // AI text is often "flat": every sentence is about the same length.
  const flat = sentences.length >= 3 && mean >= 12 && cv < 0.35;
  const splitThreshold = flat ? 15 : 24;
  const minSide = flat ? 4 : 6;
  const pSplit = (flat ? 0.5 : 0.3) + 0.4 * ctx.intensity;

  const afterSplit: string[] = [];
  for (const s of sentences) {
    if (wordCount(s) >= splitThreshold && ctx.rng() < pSplit) {
      const parts = splitSentenceAt(s, ctx, minSide, flat);
      if (parts) {
        afterSplit.push(...parts);
        ctx.changes.n++;
        continue;
      }
    }
    afterSplit.push(s);
  }

  // Only glue short sentences together when the text is genuinely choppy;
  // merging in already-varied text would flatten its rhythm.
  const choppy = mean < 11;

  const out: string[] = [];
  for (let i = 0; i < afterSplit.length; i++) {
    const a = afterSplit[i];
    const b = afterSplit[i + 1];
    if (
      choppy &&
      b &&
      wordCount(a) <= 9 &&
      wordCount(b) <= 9 &&
      /\.$/.test(a) &&
      SAFE_MERGE_STARTS.has(firstWord(b)) &&
      ctx.rng() < 0.25 + 0.4 * ctx.intensity
    ) {
      out.push(`${a.slice(0, -1)}, and ${lowerFirst(b)}`);
      ctx.changes.n++;
      i++;
      continue;
    }
    out.push(a);
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*                                  MAIN API                                  */
/* -------------------------------------------------------------------------- */

function processParagraph(paragraph: string, ctx: Ctx): string {
  let t = applyReplacementRules(paragraph, ctx);
  t = replaceDashes(t, ctx);
  if (ctx.contractions) t = applyContractions(t, ctx);
  t = relaxOxfordComma(t, ctx);

  let sentences = splitSentences(t);
  sentences = sentences.map((s) => rewriteOpener(s, ctx));
  sentences = reshape(sentences, ctx);
  sentences = sentences.map(capitalizeSentence);

  return fixArticles(tidy(sentences.join(" ")));
}

export function humanize(input: string, options: HumanizeOptions = {}): HumanizeResult {
  const source = input.trim();

  const ctx: Ctx = {
    rng: createRng(options.seed),
    intensity: clamp(Number.isFinite(options.intensity) ? (options.intensity as number) : 0.7, 0, 1),
    contractions: options.contractions !== false,
    changes: { n: 0 },
    lastOpener: "",
  };

  const { masked, restore } = protect(source);

  // Keep the user's paragraph / line breaks exactly as they were.
  const pieces = masked.split(/(\n+)/);
  const processed = pieces.map((piece, i) =>
    i % 2 === 1 || !piece.trim() ? piece : processParagraph(piece, ctx)
  );

  const text = restore(processed.join(""));

  return {
    text,
    changes: ctx.changes.n,
    tellsBefore: countAiTells(source),
    tellsAfter: countAiTells(text),
    before: rhythmStats(source),
    after: rhythmStats(text),
  };
}