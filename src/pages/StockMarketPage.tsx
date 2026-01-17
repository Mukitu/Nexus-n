import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { parseAndCleanCSV } from "@/lib/stockCsv";
import {
  computeRisk,
  computeTrend,
  computeVolatility,
  profitabilityScore,
  type Risk,
  type StockFundamentals,
  type StockSeriesPoint,
  type Trend,
} from "@/lib/stock";

const SAMPLE_SYMBOL = "RECKITTBEN";
const SAMPLE_SERIES: StockSeriesPoint[] = [
  { date: "2025-01-02", close: 5050, volume: 180000 },
  { date: "2025-01-03", close: 5075, volume: 210000 },
  { date: "2025-01-04", close: 5060, volume: 195000 },
  { date: "2025-01-05", close: 5100, volume: 260000 },
  { date: "2025-01-06", close: 5120, volume: 310000 },
  { date: "2025-01-07", close: 5140, volume: 280000 },
  { date: "2025-01-08", close: 5130, volume: 240000 },
  { date: "2025-01-09", close: 5165, volume: 330000 },
  { date: "2025-01-10", close: 5180, volume: 360000 },
  { date: "2025-01-11", close: 5205, volume: 420000 },
  { date: "2025-01-12", close: 5190, volume: 300000 },
  { date: "2025-01-13", close: 5220, volume: 470000 },
];

type FundForm = {
  lastTradingPrice: string;
  dayLow: string;
  dayHigh: string;
  volume: string;
  marketCap: string;
  peRatio: string;
  dividendPct: string;
  eps: string;
  sector: string;
};

const SAMPLE_FUND: StockFundamentals = {
  lastTradingPrice: 5220,
  dayLow: 5180,
  dayHigh: 5250,
  volume: 470000,
  marketCap: 65_000_000_000,
  peRatio: 18,
  dividendPct: 3.5,
  eps: 22,
  sector: "Consumer Goods",
};

const EMPTY_FUND: FundForm = {
  lastTradingPrice: "",
  dayLow: "",
  dayHigh: "",
  volume: "",
  marketCap: "",
  peRatio: "",
  dividendPct: "",
  eps: "",
  sector: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

function downloadTextFile(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function StockMarketPage() {
  const { lang } = useI18n();
  const [symbol, setSymbol] = useState("");
  const [fund, setFund] = useState<FundForm>(EMPTY_FUND);
  const [series, setSeries] = useState<StockSeriesPoint[]>([]);
  const [csvRaw, setCsvRaw] = useState("");
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [csvMapping, setCsvMapping] = useState<{ date: number; close: number; volume: number } | null>(null);
  const [csvWarnings, setCsvWarnings] = useState<string[]>([]);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  // 0..100 (0 = conservative, 50 = balanced, 100 = aggressive)
  const [riskAppetite, setRiskAppetite] = useState(50);

  useEffect(() => {
    document.title = lang === "bn" ? "স্টক অ্যানালাইজার | Nexus-N" : "Stock Analyzer | Nexus-N";
  }, [lang]);

  const labels = useMemo(() => {
    const bn = lang === "bn";
    return {
      h1: bn ? "স্টক মার্কেট প্রেডিক্টর ও অ্যানালাইজার" : "Stock Market Predictor & Analyzer",
      sub: bn
        ? "DSE/CSE স্টকের জন্য ইনপুট দিন বা CSV আপলোড করুন—রেজাল্ট, চার্ট এবং রিকমেন্ডেশন সাথে সাথে পাবেন।"
        : "Enter inputs or upload CSV—get instant analysis, charts and recommendation.",
      stockInput: bn ? "স্টক ইনপুট" : "Stock Input",
      symbol: bn ? "স্টক সিম্বল" : "Stock Symbol",
      uploadCsv: bn ? "CSV আপলোড" : "Upload CSV",
      csvHint: bn ? "CSV ফরম্যাট: date, close, volume" : "CSV format: date, close, volume",
      pasteCsv: bn ? "CSV পেস্ট (ঐচ্ছিক)" : "Paste CSV (optional)",
      loadSample: bn ? "স্যাম্পল লোড" : "Load sample",
      applyCsv: bn ? "CSV Apply" : "Apply CSV",
      fundamentals: bn ? "ফান্ডামেন্টালস" : "Fundamentals",
      resetFund: bn ? "রিসেট" : "Reset",
      last: bn ? "লাস্ট প্রাইস" : "Last price",
      dayLow: bn ? "ডে লো" : "Day low",
      dayHigh: bn ? "ডে হাই" : "Day high",
      volume: bn ? "ভলিউম" : "Volume",
      mcap: bn ? "মার্কেট ক্যাপ (BDT)" : "Market cap (BDT)",
      pe: bn ? "P/E রেশিও" : "P/E ratio",
      div: bn ? "ডিভিডেন্ড %" : "Dividend %",
      eps: bn ? "EPS" : "EPS",
      sector: bn ? "সেক্টর" : "Sector",
      analysis: bn ? "অ্যানালাইসিস" : "Analysis",
      verdict: bn ? "ফাইনাল সিদ্ধান্ত" : "Final verdict",
      whyThis: bn ? "কেন এই সাজেশন?" : "Why this suggestion?",
      checklist: bn ? "সহজ চেকলিস্ট" : "Beginner checklist",
      settings: bn ? "সেটিংস" : "Settings",
      riskAppetite: bn ? "রিস্ক অ্যাপেটাইট" : "Risk appetite",
      conservative: bn ? "Conservative" : "Conservative",
      balanced: bn ? "Balanced" : "Balanced",
      aggressive: bn ? "Aggressive" : "Aggressive",
      confidence: bn ? "কনফিডেন্স" : "Confidence",
      dataQuality: bn ? "ডাটা কোয়ালিটি" : "Data quality",
      columnMap: bn ? "কলাম ম্যাপিং" : "Column mapping",
      analysisCards: bn ? "সামারি" : "Summary",
      trend: bn ? "ট্রেন্ড" : "Trend",
      risk: bn ? "রিস্ক" : "Risk",
      action: bn ? "সাজেস্টেড অ্যাকশন" : "Suggested action",
      score: bn ? "প্রফিটেবিলিটি স্কোর" : "Profitability score",
      charts: bn ? "চার্ট" : "Charts",
      priceTrend: bn ? "প্রাইস ট্রেন্ড" : "Price trend",
      volumeTrend: bn ? "ভলিউম ট্রেন্ড" : "Volume trend",
      downloadPdf: bn ? "PDF ডাউনলোড" : "Download PDF",
      downloading: bn ? "ডাউনলোড হচ্ছে…" : "Downloading…",
      downloadCsv: bn ? "Excel/CSV ডাউনলোড" : "Download Excel/CSV",
      validationErr: bn ? "ইনপুট ঠিক করুন (নম্বরগুলো valid হতে হবে)" : "Please fix inputs (numbers must be valid)",
      csvErr: bn ? "CSV পড়া যায়নি—ফরম্যাট চেক করুন" : "Could not parse CSV—check format",
      csvMappedOk: bn ? "CSV ক্লিন + ম্যাপ হয়ে গেছে" : "CSV cleaned & mapped",
      madeBy: bn ? "Made by Nishat (Full Stack Software Developer)" : "Made by Nishat (Full Stack Software Developer)",
      warningTitle: bn ? "সতর্কতা" : "Warning",
      up: bn ? "Uptrend" : "Uptrend",
      down: bn ? "Downtrend" : "Downtrend",
      stable: bn ? "Stable" : "Stable",
      low: bn ? "Low" : "Low",
      medium: bn ? "Medium" : "Medium",
      high: bn ? "High" : "High",
      buy: bn ? "Buy" : "Buy",
      hold: bn ? "Hold" : "Hold",
      sell: bn ? "Sell" : "Sell",
    };
  }, [lang]);

  const profile = useMemo(() => {
    if (riskAppetite <= 33) return "conservative" as const;
    if (riskAppetite >= 67) return "aggressive" as const;
    return "balanced" as const;
  }, [riskAppetite]);

  const thresholds = useMemo(() => {
    // Tweakable, but kept simple for users.
    if (profile === "conservative") {
      return { peGoodMax: 18, peOverMin: 30, divGoodMin: 2.5, buyScoreMin: 60, sellScoreMax: 52 };
    }
    if (profile === "aggressive") {
      return { peGoodMax: 24, peOverMin: 40, divGoodMin: 1.5, buyScoreMin: 52, sellScoreMax: 55 };
    }
    return { peGoodMax: 20, peOverMin: 35, divGoodMin: 2, buyScoreMin: 55, sellScoreMax: 55 };
  }, [profile]);

  function decideAction(input: {
    trend: Trend;
    risk: Risk;
    peRatio: number;
    dividendPct: number;
    score: number;
  }): "buy" | "hold" | "sell" {
    const pe = input.peRatio;
    const div = input.dividendPct;

    const peGood = pe > 0 && pe <= thresholds.peGoodMax;
    const peOver = pe >= thresholds.peOverMin;
    const divGood = div >= thresholds.divGoodMin;

    // Conservative users: don’t buy on high risk.
    const highRiskBuyBlocked = profile === "conservative" ? input.risk === "high" : false;

    if (input.trend === "up" && !highRiskBuyBlocked && input.risk !== "high" && (peGood || divGood) && input.score >= thresholds.buyScoreMin)
      return "buy";

    if (input.trend === "down" && (input.risk === "high" || peOver) && input.score < thresholds.sellScoreMax) return "sell";

    return "hold";
  }

  const toNum = (v: string) => {
    const n = Number(String(v).replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : NaN;
  };

  const fundNum = useMemo<StockFundamentals>(() => {
    return {
      lastTradingPrice: Number.isFinite(toNum(fund.lastTradingPrice)) ? toNum(fund.lastTradingPrice) : 0,
      dayLow: Number.isFinite(toNum(fund.dayLow)) ? toNum(fund.dayLow) : 0,
      dayHigh: Number.isFinite(toNum(fund.dayHigh)) ? toNum(fund.dayHigh) : 0,
      volume: Number.isFinite(toNum(fund.volume)) ? toNum(fund.volume) : 0,
      marketCap: Number.isFinite(toNum(fund.marketCap)) ? toNum(fund.marketCap) : 0,
      peRatio: Number.isFinite(toNum(fund.peRatio)) ? toNum(fund.peRatio) : 0,
      dividendPct: Number.isFinite(toNum(fund.dividendPct)) ? toNum(fund.dividendPct) : 0,
      eps: Number.isFinite(toNum(fund.eps)) ? toNum(fund.eps) : 0,
      sector: fund.sector,
    };
  }, [fund]);

  const derived = useMemo(() => {
    const { trend, maShort, maLong } = computeTrend(series, 5, 10);
    const vol = computeVolatility(series);
    const risk = computeRisk(vol, fundNum.marketCap);
    const score = profitabilityScore(fundNum.dividendPct, fundNum.eps, fundNum.volume);
    const action = decideAction({ trend, risk, peRatio: fundNum.peRatio, dividendPct: fundNum.dividendPct, score });

    const trendStrength = (() => {
      if (!maShort || !maLong) return 0;
      const ratio = maShort / maLong;
      return Math.min(1, Math.abs(ratio - 1) / 0.03); // 0..1
    })();

    const confidence = (() => {
      const riskScore = risk === "low" ? 0.85 : risk === "medium" ? 0.6 : 0.35;
      const valuationScore =
        fundNum.peRatio > 0 && fundNum.peRatio <= thresholds.peGoodMax
          ? 0.75
          : fundNum.peRatio >= thresholds.peOverMin
            ? 0.35
            : 0.55;
      const dividendScore = fundNum.dividendPct >= thresholds.divGoodMin ? 0.7 : 0.45;
      const profitScore = score / 100;

      const c = 0.28 * trendStrength + 0.22 * riskScore + 0.2 * valuationScore + 0.15 * dividendScore + 0.15 * profitScore;
      return Math.round(c * 100);
    })();

    const reasons = buildReasons({ trend, risk, score, maShort, maLong });

    return { trend, maShort, maLong, vol, risk, score, action, confidence, reasons };
  }, [series, fundNum, thresholds, profile]);

  function buildReasons(input: {
    trend: Trend;
    risk: Risk;
    score: number;
    maShort: number;
    maLong: number;
  }) {
    const bn = lang === "bn";
    const items: string[] = [];

    // Trend reason
    if (input.trend === "up") items.push(bn ? `ট্রেন্ড আপ (MA5 > MA10)` : "Uptrend (MA5 > MA10)");
    if (input.trend === "down") items.push(bn ? `ট্রেন্ড ডাউন (MA5 < MA10)` : "Downtrend (MA5 < MA10)");
    if (input.trend === "stable") items.push(bn ? `ট্রেন্ড স্থিতিশীল (MA5 ≈ MA10)` : "Stable trend (MA5 ≈ MA10)");

    // Risk reason
    if (input.risk === "low") items.push(bn ? "ভলাটিলিটি কম, রিস্ক তুলনামূলক কম" : "Lower volatility → lower risk");
    if (input.risk === "medium") items.push(bn ? "ভলাটিলিটি মাঝারি, সতর্ক থাকুন" : "Moderate volatility → be cautious");
    if (input.risk === "high") items.push(bn ? "ভলাটিলিটি বেশি, ঝুঁকি বেশি" : "High volatility → higher risk");

    // Fundamentals reason
    const pe = fundNum.peRatio;
    if (pe > 0 && pe <= thresholds.peGoodMax)
      items.push(bn ? `P/E যুক্তিসঙ্গত (≤ ${thresholds.peGoodMax})` : `P/E looks reasonable (≤ ${thresholds.peGoodMax})`);
    if (pe >= thresholds.peOverMin) items.push(bn ? `P/E বেশি (≥ ${thresholds.peOverMin})` : `P/E looks high (≥ ${thresholds.peOverMin})`);

    if (fundNum.dividendPct >= thresholds.divGoodMin)
      items.push(bn ? `ডিভিডেন্ড ভালো (≥ ${thresholds.divGoodMin}%)` : `Dividend is supportive (≥ ${thresholds.divGoodMin}%)`);
    else items.push(bn ? `ডিভিডেন্ড কম (< ${thresholds.divGoodMin}%)` : `Dividend is low (< ${thresholds.divGoodMin}%)`);

    // Profit score
    if (input.score >= thresholds.buyScoreMin) items.push(bn ? `প্রফিট স্কোর শক্ত (${input.score}/100)` : `Profit score is strong (${input.score}/100)`);
    else items.push(bn ? `প্রফিট স্কোর মাঝারি/কম (${input.score}/100)` : `Profit score is moderate/low (${input.score}/100)`);

    // Profile reason
    items.push(
      bn
        ? `আপনার প্রোফাইল: ${profile === "conservative" ? "Conservative" : profile === "aggressive" ? "Aggressive" : "Balanced"}`
        : `Profile: ${profile === "conservative" ? "Conservative" : profile === "aggressive" ? "Aggressive" : "Balanced"}`,
    );

    return items;
  }

  const riskUi = useMemo(() => {
    const risk = derived.risk;
    const pctVal = risk === "low" ? 25 : risk === "medium" ? 60 : 90;
    const label = risk === "low" ? labels.low : risk === "medium" ? labels.medium : labels.high;

    // No direct color classes; keep it token-driven.
    const barStyle =
      risk === "low"
        ? ({ backgroundColor: "hsl(var(--accent))" } as const)
        : risk === "medium"
          ? ({ backgroundColor: "hsl(var(--gold))" } as const)
          : ({ backgroundColor: "hsl(var(--destructive))" } as const);

    return { pctVal, label, barStyle };
  }, [derived.risk, labels.low, labels.medium, labels.high]);

  const trendLabel = derived.trend === "up" ? labels.up : derived.trend === "down" ? labels.down : labels.stable;
  const actionLabel = derived.action === "buy" ? labels.buy : derived.action === "sell" ? labels.sell : labels.hold;

  const validate = () => {
    const fields: Array<[string, string]> = [
      ["lastTradingPrice", fund.lastTradingPrice],
      ["dayLow", fund.dayLow],
      ["dayHigh", fund.dayHigh],
      ["volume", fund.volume],
      ["marketCap", fund.marketCap],
      ["peRatio", fund.peRatio],
      ["dividendPct", fund.dividendPct],
      ["eps", fund.eps],
    ];

    const ok = fields.every(([, v]) => v.trim() !== "" && Number.isFinite(toNum(v)));
    if (!ok) toast.error(labels.validationErr);
    return ok;
  };

  const applyCsvText = (text: string) => {
    const res = parseAndCleanCSV(text, csvMapping ?? undefined);

    setCsvColumns(res.meta.columns);
    setCsvWarnings([
      ...res.issues.map((i) => `Line ${i.line}: ${i.message}`),
      ...(res.meta.duplicatesRemoved ? [`Duplicates removed: ${res.meta.duplicatesRemoved}`] : []),
      ...(res.meta.sorted ? [lang === "bn" ? "ডেট অনুসারে sort করা হয়েছে" : "Sorted by date"] : []),
    ]);

    if (!res.series.length) {
      toast.error(labels.csvErr);
      return;
    }

    setSeries(res.series);
    const last = res.series[res.series.length - 1];
    setFund((p) => ({ ...p, lastTradingPrice: String(last.close), volume: String(last.volume) }));

    toast.success(labels.csvMappedOk);
  };

  const onApplyCsv = () => {
    applyCsvText(csvRaw);
  };

  const onCsvFile = async (file: File) => {
    const text = await file.text();
    setCsvRaw(text);
    applyCsvText(text);
  };

  const onDownloadPDF = async () => {
    if (!validate()) return;
    const node = reportRef.current;
    if (!node) return;

    try {
      setDownloading(true);
      toast.message(labels.downloading);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        let y = 0;
        let remaining = imgHeight;
        const pxPerPt = canvas.width / pageWidth;
        const pageCanvasHeightPx = Math.floor(pageHeight * pxPerPt);

        while (remaining > 0) {
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pageCanvasHeightPx, canvas.height - Math.floor(y * pxPerPt));
          const ctx = pageCanvas.getContext("2d");
          if (!ctx) break;

          ctx.drawImage(
            canvas,
            0,
            Math.floor(y * pxPerPt),
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height,
          );

          const pageImg = pageCanvas.toDataURL("image/png");
          const pageImgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;

          if (y > 0) pdf.addPage();
          pdf.addImage(pageImg, "PNG", 0, 0, imgWidth, pageImgHeight);

          y += pageHeight;
          remaining -= pageHeight;
        }
      }

      const name = (symbol || "stock").trim().replace(/\s+/g, "-").toLowerCase();
      pdf.save(`${name}-report.pdf`);
      toast.success(lang === "bn" ? "PDF ডাউনলোড হয়েছে" : "PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error(lang === "bn" ? "PDF তৈরি করা যায়নি" : "Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const onDownloadCSV = () => {
    if (!validate()) return;

    const header = [
      "symbol",
      "trend",
      "risk",
      "action",
      "profitability_score",
      "ma5",
      "ma10",
      "volatility",
      "pe_ratio",
      "dividend_pct",
      "eps",
      "market_cap",
      "last_price",
      "volume",
      "sector",
    ].join(",");

    const row = [
      symbol,
      derived.trend,
      derived.risk,
      derived.action,
      derived.score,
      derived.maShort.toFixed(2),
      derived.maLong.toFixed(2),
      derived.vol.toFixed(6),
      fundNum.peRatio,
      fundNum.dividendPct,
      fundNum.eps,
      fundNum.marketCap,
      fundNum.lastTradingPrice,
      fundNum.volume,
      fundNum.sector,
    ].join(",");

    const seriesHeader = "date,close,volume";
    const seriesRows = series.map((p) => `${p.date},${p.close},${p.volume}`).join("\n");

    const out = [
      "# summary",
      header,
      row,
      "",
      "# series",
      seriesHeader,
      seriesRows,
      "",
    ].join("\n");

    const name = (symbol || "stock").trim().replace(/\s+/g, "-").toLowerCase();
    downloadTextFile(`${name}-analysis.csv`, out, "text/csv");
    toast.success(lang === "bn" ? "CSV ডাউনলোড হয়েছে" : "CSV downloaded");
  };

  const tooltipStyle = {
    background: "hsl(var(--popover) / 0.95)",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
  } as const;

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{labels.h1}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{labels.sub}</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-glass border-glass-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{labels.stockInput}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={labels.symbol}>
                <Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
              </Field>
              <Field label={labels.uploadCsv}>
                <Input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const f = e.currentTarget.files?.[0];
                    if (f) void onCsvFile(f);
                  }}
                />
                <div className="mt-2 text-xs text-muted-foreground">{labels.csvHint}</div>
              </Field>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSymbol(SAMPLE_SYMBOL);
                  setFund({
                    lastTradingPrice: String(SAMPLE_FUND.lastTradingPrice),
                    dayLow: String(SAMPLE_FUND.dayLow),
                    dayHigh: String(SAMPLE_FUND.dayHigh),
                    volume: String(SAMPLE_FUND.volume),
                    marketCap: String(SAMPLE_FUND.marketCap),
                    peRatio: String(SAMPLE_FUND.peRatio),
                    dividendPct: String(SAMPLE_FUND.dividendPct),
                    eps: String(SAMPLE_FUND.eps),
                    sector: SAMPLE_FUND.sector,
                  });
                  setSeries(SAMPLE_SERIES);
                  setCsvRaw("");
                  setCsvColumns([]);
                  setCsvMapping(null);
                  setCsvWarnings([]);
                  setRiskAppetite(50);
                  toast.success(lang === "bn" ? "স্যাম্পল লোড হয়েছে" : "Sample loaded");
                }}
              >
                {labels.loadSample}
              </Button>
              <Button type="button" variant="glass" onClick={onDownloadPDF} disabled={downloading}>
                {downloading ? labels.downloading : labels.downloadPdf}
              </Button>
              <Button type="button" variant="glass" onClick={onDownloadCSV}>
                {labels.downloadCsv}
              </Button>
            </div>

            <div className="rounded-xl border border-glass-border bg-background/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{labels.settings}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {labels.riskAppetite}: {profile === "conservative" ? labels.conservative : profile === "aggressive" ? labels.aggressive : labels.balanced}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {labels.confidence}: <span className="font-semibold tabular-nums">{derived.confidence}%</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Slider
                  value={[riskAppetite]}
                  onValueChange={(v) => setRiskAppetite(v[0] ?? 50)}
                  min={0}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{labels.conservative}</span>
                  <span>{labels.balanced}</span>
                  <span>{labels.aggressive}</span>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {lang === "bn"
                    ? "Conservative হলে Buy করতে বেশি শর্ত পূরণ হতে হবে; Aggressive হলে একটু কম শর্তেও Buy দেখাতে পারে।"
                    : "Conservative requires stronger signals to Buy; Aggressive may Buy with fewer signals."}
                </div>
              </div>
            </div>

            <Field label={labels.pasteCsv}>
              <Textarea value={csvRaw} onChange={(e) => setCsvRaw(e.target.value)} />

              {csvWarnings.length > 0 && (
                <div className="mt-2 rounded-lg border border-glass-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <div className="mb-1 font-semibold">{labels.dataQuality}</div>
                  <ul className="list-disc space-y-1 pl-4">
                    {csvWarnings.slice(0, 6).map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {csvColumns.length > 0 && (
                <div className="mt-3 rounded-lg border border-glass-border bg-background/60 p-3">
                  <div className="text-xs font-semibold">{labels.columnMap}</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Date</div>
                      <Input
                        value={csvMapping?.date ?? ""}
                        onChange={(e) =>
                          setCsvMapping((p) => ({ ...(p ?? { date: 0, close: 1, volume: 2 }), date: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Close</div>
                      <Input
                        value={csvMapping?.close ?? ""}
                        onChange={(e) =>
                          setCsvMapping((p) => ({ ...(p ?? { date: 0, close: 1, volume: 2 }), close: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Volume</div>
                      <Input
                        value={csvMapping?.volume ?? ""}
                        onChange={(e) =>
                          setCsvMapping((p) => ({ ...(p ?? { date: 0, close: 1, volume: 2 }), volume: Number(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {lang === "bn"
                      ? "হেডার auto-detect না হলে এখানে কলাম ইনডেক্স সেট করে আবার Apply দিন।"
                      : "If auto-detect fails, set column indexes here and press Apply again."}
                  </div>
                </div>
              )}

              <div className="mt-2 flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={onApplyCsv}>
                  {labels.applyCsv}
                </Button>
              </div>
            </Field>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">{labels.fundamentals}</div>
                <Button type="button" variant="outline" size="sm" onClick={() => setFund(EMPTY_FUND)}>
                  {labels.resetFund}
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={labels.last}>
                  <Input
                    inputMode="decimal"
                    value={fund.lastTradingPrice}
                    onChange={(e) => setFund((p) => ({ ...p, lastTradingPrice: e.target.value }))}
                  />
                </Field>
                <Field label={labels.volume}>
                  <Input inputMode="numeric" value={fund.volume} onChange={(e) => setFund((p) => ({ ...p, volume: e.target.value }))} />
                </Field>
                <Field label={labels.dayLow}>
                  <Input inputMode="decimal" value={fund.dayLow} onChange={(e) => setFund((p) => ({ ...p, dayLow: e.target.value }))} />
                </Field>
                <Field label={labels.dayHigh}>
                  <Input inputMode="decimal" value={fund.dayHigh} onChange={(e) => setFund((p) => ({ ...p, dayHigh: e.target.value }))} />
                </Field>
                <Field label={labels.mcap}>
                  <Input inputMode="numeric" value={fund.marketCap} onChange={(e) => setFund((p) => ({ ...p, marketCap: e.target.value }))} />
                </Field>
                <Field label={labels.pe}>
                  <Input inputMode="decimal" value={fund.peRatio} onChange={(e) => setFund((p) => ({ ...p, peRatio: e.target.value }))} />
                </Field>
                <Field label={labels.div}>
                  <Input
                    inputMode="decimal"
                    value={fund.dividendPct}
                    onChange={(e) => setFund((p) => ({ ...p, dividendPct: e.target.value }))}
                  />
                </Field>
                <Field label={labels.eps}>
                  <Input inputMode="decimal" value={fund.eps} onChange={(e) => setFund((p) => ({ ...p, eps: e.target.value }))} />
                </Field>
                <Field label={labels.sector}>
                  <Input value={fund.sector} onChange={(e) => setFund((p) => ({ ...p, sector: e.target.value }))} />
                </Field>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{labels.analysis}</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={reportRef} className="space-y-4">
              <div className="rounded-xl border border-glass-border bg-background/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{labels.verdict}</div>
                    <div className="mt-1 text-2xl font-semibold">{actionLabel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{labels.confidence}</div>
                    <div className="mt-1 text-lg font-semibold tabular-nums">{derived.confidence}%</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {lang === "bn"
                        ? `থ্রেশহোল্ড: P/E≤${thresholds.peGoodMax}, Dividend≥${thresholds.divGoodMin}%, BuyScore≥${thresholds.buyScoreMin}`
                        : `Thresholds: P/E≤${thresholds.peGoodMax}, Dividend≥${thresholds.divGoodMin}%, BuyScore≥${thresholds.buyScoreMin}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-glass-border bg-background/60 p-4">
                  <div className="text-xs text-muted-foreground">{labels.trend}</div>
                  <div className="mt-1 text-lg font-semibold">{trendLabel}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    MA5: {derived.maShort.toFixed(2)} • MA10: {derived.maLong.toFixed(2)}
                  </div>
                </div>

                <div className="rounded-xl border border-glass-border bg-background/60 p-4">
                  <div className="text-xs text-muted-foreground">{labels.action}</div>
                  <div className="mt-1 text-lg font-semibold">{actionLabel}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {lang === "bn"
                      ? "এই ফলাফল আপনার Risk Appetite অনুযায়ী adjust হয়।"
                      : "This result adapts to your Risk Appetite."}
                  </div>
                </div>

                <div className="rounded-xl border border-glass-border bg-background/60 p-4 sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">{labels.risk}</div>
                      <div className="mt-1 text-lg font-semibold">{riskUi.label}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">σ: {derived.vol.toFixed(4)}</div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${riskUi.pctVal}%`, ...riskUi.barStyle }} />
                  </div>
                </div>

                <div className="rounded-xl border border-glass-border bg-background/60 p-4 sm:col-span-2">
                  <div className="text-xs text-muted-foreground">{labels.score}</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">{derived.score}/100</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Dividend: {fund.dividendPct.trim() ? `${fund.dividendPct}%` : "-"} • EPS: {fund.eps.trim() ? fund.eps : "-"} • Volume: {fund.volume.trim() ? fund.volume : "-"}
                  </div>
                </div>

                <div className="rounded-xl border border-glass-border bg-background/60 p-4 sm:col-span-2">
                  <div className="text-sm font-semibold">{labels.whyThis}</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {derived.reasons.slice(0, 7).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-glass-border bg-background/60 p-4 sm:col-span-2">
                  <div className="text-sm font-semibold">{labels.checklist}</div>
                  <div className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <div>
                      1) {lang === "bn" ? "ডাটা ঠিক আছে (CSV clean)" : "Data OK (CSV clean)"}
                    </div>
                    <div>
                      2) {lang === "bn" ? `ট্রেন্ড: ${trendLabel}` : `Trend: ${trendLabel}`}
                    </div>
                    <div>
                      3) {lang === "bn" ? `রিস্ক: ${riskUi.label}` : `Risk: ${riskUi.label}`}
                    </div>
                    <div>
                      4) {lang === "bn" ? `P/E বনাম থ্রেশহোল্ড` : `P/E vs thresholds`}
                    </div>
                    <div>
                      5) {lang === "bn" ? `ডিভিডেন্ড বনাম থ্রেশহোল্ড` : `Dividend vs thresholds`}
                    </div>
                    <div>
                      6) {lang === "bn" ? `স্কোর: ${derived.score}/100` : `Score: ${derived.score}/100`}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {lang === "bn"
                      ? "চেকলিস্টের বেশিরভাগ পয়েন্ট শক্ত হলে Buy, দুর্বল/ঝুঁকি বেশি হলে Hold/Sell দেখাবে।"
                      : "If most checklist signals are strong → Buy; if weak/high-risk → Hold/Sell."}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-glass-border bg-background/60 p-4">
                <div className="mb-3 text-sm font-semibold">{labels.charts}</div>

                <div className="grid gap-4 lg:grid-cols-1">
                  <div>
                    <div className="text-xs text-muted-foreground">{labels.priceTrend}</div>
                    <div className="mt-2 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={series}>
                          <CartesianGrid stroke="hsl(var(--border) / 0.5)" strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">{labels.volumeTrend}</div>
                    <div className="mt-2 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={series}>
                          <CartesianGrid stroke="hsl(var(--border) / 0.5)" strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-6 border-t border-glass-border pt-4 text-xs text-muted-foreground">
              {labels.madeBy}
            </footer>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
