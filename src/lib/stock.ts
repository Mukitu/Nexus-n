export type StockSeriesPoint = {
  date: string; // YYYY-MM-DD or any label
  close: number;
  volume: number;
};

export type StockFundamentals = {
  lastTradingPrice: number;
  dayLow: number;
  dayHigh: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendPct: number;
  eps: number;
  sector: string;
};

export type Trend = "up" | "down" | "stable";
export type Risk = "low" | "medium" | "high";
export type Action = "buy" | "hold" | "sell";

export function safeNum(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function movingAverage(values: number[], window: number) {
  if (window <= 0) return 0;
  if (values.length < window) return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const slice = values.slice(values.length - window);
  return slice.reduce((a, b) => a + b, 0) / window;
}

export function stdDev(values: number[]) {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function pct(n: number) {
  return Math.round(n * 100);
}

export function parseSimpleCSV(text: string): StockSeriesPoint[] {
  // Expected: date, close, volume (header optional)
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const rows = lines.map((l) => l.split(",").map((c) => c.trim()));

  // Detect header
  const first = rows[0].map((x) => x.toLowerCase());
  const hasHeader = first.includes("date") || first.includes("close") || first.includes("volume");
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const out: StockSeriesPoint[] = [];
  for (const r of dataRows) {
    const [date, close, volume] = r;
    const c = Number(close);
    const v = Number(volume);
    if (!date || !Number.isFinite(c) || !Number.isFinite(v)) continue;
    out.push({ date, close: c, volume: v });
  }
  return out;
}

export function computeTrend(series: StockSeriesPoint[], short = 5, long = 10): { trend: Trend; maShort: number; maLong: number } {
  const closes = series.map((p) => p.close).filter((n) => Number.isFinite(n));
  const maS = movingAverage(closes, short);
  const maL = movingAverage(closes, long);
  if (!maS || !maL) return { trend: "stable", maShort: maS, maLong: maL };

  const ratio = maS / maL;
  if (ratio >= 1.01) return { trend: "up", maShort: maS, maLong: maL };
  if (ratio <= 0.99) return { trend: "down", maShort: maS, maLong: maL };
  return { trend: "stable", maShort: maS, maLong: maL };
}

export function computeVolatility(series: StockSeriesPoint[]): number {
  // daily return volatility based on close-to-close
  const closes = series.map((p) => p.close).filter((n) => Number.isFinite(n));
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const prev = closes[i - 1];
    const cur = closes[i];
    if (prev > 0) returns.push((cur - prev) / prev);
  }
  return stdDev(returns);
}

export function computeRisk(volatility: number, marketCap: number): Risk {
  // Heuristic thresholds (university-project friendly, not investment advice)
  const cap = Math.max(0, marketCap);
  if (cap >= 50_000_000_000 && volatility < 0.02) return "low";
  if (cap >= 10_000_000_000 && volatility < 0.05) return "medium";
  return "high";
}

export function profitabilityScore(dividendPct: number, eps: number, volume: number): number {
  const d = clamp(dividendPct, 0, 20) / 20; // 0..1
  const e = clamp(eps, 0, 50) / 50;
  const v = Math.log10(Math.max(1, volume)); // 0..~
  const vNorm = clamp((v - 2) / 6, 0, 1); // maps 1e2..1e8 roughly

  return Math.round((d * 0.35 + e * 0.35 + vNorm * 0.3) * 100);
}

export function suggestedAction(input: {
  trend: Trend;
  risk: Risk;
  peRatio: number;
  dividendPct: number;
  score: number;
}): Action {
  const pe = input.peRatio;
  const div = input.dividendPct;
  const { trend, risk, score } = input;

  const peGood = pe > 0 && pe <= 20;
  const peOver = pe >= 35;
  const divGood = div >= 2;

  if (trend === "up" && risk !== "high" && (peGood || divGood) && score >= 55) return "buy";
  if (trend === "down" && (risk === "high" || peOver) && score < 55) return "sell";
  return "hold";
}

export function riskMeterColor(risk: Risk) {
  if (risk === "low") return "hsl(var(--accent))";
  if (risk === "medium") return "hsl(var(--gold))";
  return "hsl(var(--destructive))";
}
