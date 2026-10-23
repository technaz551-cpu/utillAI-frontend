export type WritingScores = {
  seo: number;
  readability: number;
  originality: number;
  tone: number;
  tips: string[];
};

export function scoreSeoContent(text: string, targetKeyword?: string): WritingScores {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = plain ? plain.split(" ").filter(Boolean) : [];
  const wordCount = words.length;
  const sentences = plain.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentence = sentences.length ? wordCount / sentences.length : 0;

  let seo = 40;
  const tips: string[] = [];
  if (wordCount >= 300) seo += 25;
  else tips.push("Aim for at least 300 words for substantive SEO content.");
  if (wordCount >= 600) seo += 10;
  if (/^#\s/m.test(text) || /<h1/i.test(text)) seo += 10;
  else tips.push("Add a clear H1 heading with your primary topic.");
  if (/^##\s/m.test(text) || /<h2/i.test(text)) seo += 5;
  if (targetKeyword?.trim()) {
    const kw = targetKeyword.trim().toLowerCase();
    const body = plain.toLowerCase();
    const count = body.split(kw).length - 1;
    if (count >= 1 && count <= Math.max(3, Math.floor(wordCount / 150))) seo += 15;
    else if (count === 0) tips.push(`Use your target keyword “${targetKeyword}” naturally in the body.`);
    else tips.push("Avoid keyword stuffing — reduce repeated exact-match phrases.");
  }

  let readability = 50;
  if (avgSentence > 0 && avgSentence <= 20) readability += 30;
  else if (avgSentence <= 25) readability += 15;
  else tips.push("Shorten long sentences for better readability.");
  if (wordCount >= 100) readability += 20;

  const originality = wordCount >= 50 ? 72 : 30;
  if (wordCount < 50) tips.push("Write more content before assessing originality.");

  let tone = 65;
  if (/\b(you|your)\b/i.test(plain)) tone += 10;
  if (/\b(we|our)\b/i.test(plain)) tone += 5;

  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
  return {
    seo: clamp(seo),
    readability: clamp(readability),
    originality: clamp(originality),
    tone: clamp(tone),
    tips,
  };
}
