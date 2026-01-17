import { z } from "zod";
import type { StockSeriesPoint } from "@/lib/stock";

export type CsvIssue = {
  line: number;
  message: string;
};

export type CsvParseResult = {
  series: StockSeriesPoint[];
  issues: CsvIssue[];
  meta: {
    delimiter: "," | "\t";
    hasHeader: boolean;
    columns: string[];
    mapped: { date: number; close: number; volume: number } | null;
    duplicatesRemoved: number;
    sorted: boolean;
  };
};

const normalizeHeader = (h: string) =>
  h
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 %]/g, "");

const HEADER_SYNONYMS = {
  date: ["date", "trading date", "trade date", "দিন", "তারিখ"],
  close: ["close", "ltp", "last", "last price", "closing price", "price", "দাম", "ক্লোজ"],
  volume: ["volume", "vol", "qty", "quantity", "trade", "traded", "turnover", "ভলিউম"],
} as const;

function detectDelimiter(text: string): "," | "\t" {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim().length) ?? "";
  const comma = (firstLine.match(/,/g) ?? []).length;
  const tab = (firstLine.match(/\t/g) ?? []).length;
  return tab > comma ? "\t" : ",";
}

function splitRow(line: string, delimiter: string): string[] {
  // Minimal CSV split (handles quotes in a basic way)
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (!inQ && ch === delimiter) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const RowSchema = z.object({
  date: z.string().trim().min(1),
  close: z.number().finite(),
  volume: z.number().finite(),
});

export function parseAndCleanCSV(text: string, mapping?: { date: number; close: number; volume: number }): CsvParseResult {
  const issues: CsvIssue[] = [];
  const delimiter = detectDelimiter(text);

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) {
    return {
      series: [],
      issues: [{ line: 1, message: "Empty file" }],
      meta: { delimiter, hasHeader: false, columns: [], mapped: null, duplicatesRemoved: 0, sorted: false },
    };
  }

  const first = splitRow(lines[0], delimiter);
  const normalized = first.map(normalizeHeader);
  const hasHeader = normalized.some((h) =>
    [...HEADER_SYNONYMS.date, ...HEADER_SYNONYMS.close, ...HEADER_SYNONYMS.volume].some((k) => h.includes(normalizeHeader(k))),
  );

  const columns = hasHeader ? first : [];

  const autoMap = () => {
    if (!hasHeader) return null;
    const idx = {
      date: normalized.findIndex((h) => HEADER_SYNONYMS.date.some((k) => h.includes(normalizeHeader(k)))),
      close: normalized.findIndex((h) => HEADER_SYNONYMS.close.some((k) => h.includes(normalizeHeader(k)))),
      volume: normalized.findIndex((h) => HEADER_SYNONYMS.volume.some((k) => h.includes(normalizeHeader(k)))),
    };
    return idx.date >= 0 && idx.close >= 0 && idx.volume >= 0 ? idx : null;
  };

  const map = mapping ?? autoMap();
  const dataLines = hasHeader ? lines.slice(1) : lines;

  if (!map) {
    issues.push({
      line: 1,
      message: hasHeader
        ? "Could not auto-detect columns. Please map Date/Close/Volume."
        : "Header not detected. Please include header or paste as: date,close,volume",
    });
    return {
      series: [],
      issues,
      meta: { delimiter, hasHeader, columns, mapped: null, duplicatesRemoved: 0, sorted: false },
    };
  }

  const out: StockSeriesPoint[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const lineNo = (hasHeader ? 2 : 1) + i;
    const row = splitRow(dataLines[i], delimiter);
    const date = row[map.date] ?? "";
    const close = Number((row[map.close] ?? "").replace(/,/g, ""));
    const volume = Number((row[map.volume] ?? "").replace(/,/g, ""));

    const parsed = RowSchema.safeParse({ date, close, volume });
    if (!parsed.success) {
      issues.push({ line: lineNo, message: "Invalid row (need date, close, volume)" });
      continue;
    }

    out.push({ date: parsed.data.date!, close: parsed.data.close!, volume: parsed.data.volume! });
  }

  // Deduplicate by date (keep last)
  const byDate = new Map<string, StockSeriesPoint>();
  for (const p of out) byDate.set(p.date, p);
  const duplicatesRemoved = Math.max(0, out.length - byDate.size);
  let series = Array.from(byDate.values());

  // Sort by date if looks like YYYY-MM-DD
  const looksISO = series.every((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.date));
  let sorted = false;
  if (looksISO) {
    series = series.sort((a, b) => a.date.localeCompare(b.date));
    sorted = true;
  }

  return {
    series,
    issues,
    meta: { delimiter, hasHeader, columns, mapped: map, duplicatesRemoved, sorted },
  };
}
