/** Parse keywords from CSV text. Uses column "keyword" or "phrase" if present, else first column. */
export function parseKeywordsFromCsv(text: string): string[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];

  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (c === "," && !inQuotes) {
        out.push(cur.trim());
        cur = "";
        continue;
      }
      cur += c;
    }
    out.push(cur.trim());
    return out.map((s) => s.replace(/^"|"$/g, "").trim());
  };

  const firstCells = parseLine(lines[0]);
  const headerLower = firstCells.map((c) => c.toLowerCase());
  let colIndex = 0;
  let startRow = 0;
  const kwCol = headerLower.findIndex((h) =>
    ["keyword", "keywords", "phrase", "query", "search term"].includes(h),
  );
  if (kwCol >= 0) {
    colIndex = kwCol;
    startRow = 1;
  }

  const seen = new Set<string>();
  const phrases: string[] = [];
  for (let i = startRow; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    const raw = (cells[colIndex] ?? cells[0] ?? "").trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    phrases.push(raw);
  }
  return phrases;
}

export const KEYWORD_CSV_TEMPLATE = `keyword,group,notes
best crm software,commercial,optional campaign label
your brand name,brand,
`;

export function exportKeywordsToCsv(
  rows: { phrase: string; search_volume?: number | null; difficulty?: number | null; group?: string | null; data_source?: string | null }[],
) {
  const header = "keyword,volume,kd,group,source";
  const lines = rows.map((r) => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    return [
      esc(r.phrase),
      r.search_volume ?? "",
      r.difficulty ?? "",
      esc(r.group || ""),
      esc(r.data_source || "manual"),
    ].join(",");
  });
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "utilai-keywords-export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSerpOverviewCsv(rows: { url: string; title?: string | null }[]) {
  const header = "url,title";
  const lines = rows
    .filter((r) => r.url)
    .map((r) => `"${r.url.replace(/"/g, '""')}","${(r.title || "").replace(/"/g, '""')}"`);
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "utilai-serp-export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadKeywordCsvTemplate() {
  const blob = new Blob([KEYWORD_CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "utilai-keywords-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
