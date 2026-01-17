import { useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { ModuleDef, clamp, riskLevel } from "@/lib/modules";
import { fmtCurrencyBDT, fmtNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

type Result = {
  headline: string;
  metrics: Array<{ label: string; value: string }>;
  riskScore: number;
  chart: Array<{ name: string; value: number }>;
  suggestions: string[];
};

function computeTaxSalary(monthlySalary: number) {
  const annual = monthlySalary * 12;
  const slabs: Array<[number, number]> = [
    [350000, 0],
    [100000, 0.05],
    [300000, 0.1],
    [400000, 0.15],
    [500000, 0.2],
    [Number.POSITIVE_INFINITY, 0.25],
  ];
  let remaining = annual;
  let tax = 0;
  let used = 0;
  for (const [cap, rate] of slabs) {
    const take = Math.min(remaining, cap);
    tax += take * rate;
    remaining -= take;
    used += take;
    if (remaining <= 0) break;
  }
  return { annual, tax };
}

function computeModule(def: ModuleDef, values: Record<string, number>): Result {
  const id = def.id;

  if (id === "tax") {
    const monthlySalary = values.monthlySalary ?? 0;
    const businessProfit = values.businessProfit ?? 0;
    const vatSales = values.vatSales ?? 0;
    const vatRate = (values.vatRate ?? 15) / 100;

    const salary = computeTaxSalary(monthlySalary);
    const businessTax = businessProfit * 0.2;
    const vat = vatSales * vatRate;
    const total = salary.tax + businessTax + vat;

    const riskScore = clamp((total / Math.max(1, monthlySalary * 12 + businessProfit)) * 100, 0, 100);

    return {
      headline: "Tax Summary",
      metrics: [
        { label: "Annual Salary", value: fmtCurrencyBDT(salary.annual) },
        { label: "Salary Tax", value: fmtCurrencyBDT(salary.tax) },
        { label: "Business Tax", value: fmtCurrencyBDT(businessTax) },
        { label: "VAT", value: fmtCurrencyBDT(vat) },
      ],
      riskScore,
      chart: [
        { name: "Salary Tax", value: Math.round(salary.tax) },
        { name: "Business Tax", value: Math.round(businessTax) },
        { name: "VAT", value: Math.round(vat) },
      ],
      suggestions: [
        "Keep receipts and categorize expenses to reduce errors.",
        "Review VAT rate based on product/service category.",
        "Consider monthly savings buffer for tax payments.",
      ],
    };
  }

  if (id === "student") {
    const exam = values.exam ?? 0;
    const quiz = values.quiz ?? 0;
    const assignment = values.assignment ?? 0;
    const totalClasses = values.totalClasses ?? 0;
    const attended = values.attended ?? 0;

    // Attendance marks are scaled to 10 points (0–10)
    const attendancePct = totalClasses > 0 ? clamp(attended / totalClasses, 0, 1) : 0;
    const attendanceMarks = Math.round(attendancePct * 10);

    const total = clamp(exam + quiz + assignment + attendanceMarks, 0, 100);
    const passMark = 40;

    const riskScore = clamp(100 - total, 0, 100);

    return {
      headline: total >= passMark ? "Pass Likely" : "At Risk",
      metrics: [
        { label: "Total", value: `${fmtNumber(total)} / 100` },
        { label: "Attendance", value: `${fmtNumber(attendancePct * 100, 0)}%` },
        { label: "Attendance Marks", value: `${attendanceMarks} / 10` },
        { label: "Pass Mark", value: `${passMark} / 100` },
        { label: "Status", value: total >= passMark ? "Pass" : "Fail" },
      ],
      riskScore,
      chart: [
        { name: "Exam", value: exam },
        { name: "Quiz", value: quiz },
        { name: "Assignment", value: assignment },
        { name: "Attendance", value: attendanceMarks },
      ],
      suggestions: [
        "Prioritize weak components (quiz/assignment) for quick gains.",
        "Improve attendance to unlock easy marks.",
        "Plan revision blocks before exam weeks.",
      ],
    };
  }

  if (id === "attendance") {
    const totalClasses = values.totalClasses ?? 0;
    const attended = values.attended ?? 0;
    const pct = totalClasses > 0 ? clamp(attended / totalClasses, 0, 1) : 0;
    const marks = Math.round(pct * 10);
    const riskScore = clamp((1 - pct) * 100, 0, 100);

    return {
      headline: "Attendance Result",
      metrics: [
        { label: "Attendance", value: `${fmtNumber(pct * 100, 0)}%` },
        { label: "Marks", value: `${marks} / 10` },
        { label: "Classes", value: `${fmtNumber(attended)} / ${fmtNumber(totalClasses)}` },
        { label: "Tip", value: pct >= 0.75 ? "On track" : "Needs improvement" },
      ],
      riskScore,
      chart: [
        { name: "Attended", value: attended },
        { name: "Missed", value: Math.max(0, totalClasses - attended) },
      ],
      suggestions: [
        "Aim for 75%+ attendance to reduce academic risk.",
        "Set weekly reminders before class time.",
      ],
    };
  }

  if (id === "loan") {
    const amount = values.amount ?? 0;
    const annualRate = values.annualRate ?? 12;
    const months = values.months ?? 12;
    const r = annualRate / 100 / 12;
    const emi = r === 0 ? amount / Math.max(1, months) : (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPay = emi * months;
    const interest = totalPay - amount;
    const riskScore = clamp((interest / Math.max(1, totalPay)) * 100, 0, 100);

    return {
      headline: "EMI Summary",
      metrics: [
        { label: "EMI", value: fmtCurrencyBDT(emi) },
        { label: "Total Pay", value: fmtCurrencyBDT(totalPay) },
        { label: "Interest", value: fmtCurrencyBDT(interest) },
        { label: "Tenure", value: `${fmtNumber(months)} months` },
      ],
      riskScore,
      chart: [
        { name: "Principal", value: Math.round(amount) },
        { name: "Interest", value: Math.round(interest) },
      ],
      suggestions: [
        "Compare offers: small rate changes impact EMI strongly.",
        "Consider part pre-payment to reduce interest burden.",
      ],
    };
  }

  if (id === "investment") {
    const monthly = values.monthly ?? 0;
    const years = values.years ?? 5;
    const annualReturn = values.annualReturn ?? 10;
    const n = Math.max(1, years * 12);
    const r = annualReturn / 100 / 12;
    const future = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
    const contributed = monthly * n;
    const gain = future - contributed;
    const riskScore = clamp((annualReturn / 25) * 100, 0, 100);

    return {
      headline: "Projection",
      metrics: [
        { label: "Projected", value: fmtCurrencyBDT(future) },
        { label: "Contributed", value: fmtCurrencyBDT(contributed) },
        { label: "Gain", value: fmtCurrencyBDT(gain) },
        { label: "Horizon", value: `${fmtNumber(years)} years` },
      ],
      riskScore,
      chart: [
        { name: "Contributed", value: Math.round(contributed) },
        { name: "Gain", value: Math.round(gain) },
      ],
      suggestions: [
        "Increase monthly contribution gradually each year.",
        "Diversify to reduce volatility risk.",
      ],
    };
  }

  if (id === "finance") {
    const income = values.income ?? 0;
    const expenses = values.expenses ?? 0;
    const invest = values.invest ?? 0;
    const savings = income - expenses - invest;
    const savingsRate = income > 0 ? savings / income : 0;
    const riskScore = clamp((1 - clamp(savingsRate, 0, 1)) * 100, 0, 100);

    return {
      headline: "Finance Health",
      metrics: [
        { label: "Income", value: fmtCurrencyBDT(income) },
        { label: "Expenses", value: fmtCurrencyBDT(expenses) },
        { label: "Investments", value: fmtCurrencyBDT(invest) },
        { label: "Savings", value: fmtCurrencyBDT(savings) },
      ],
      riskScore,
      chart: [
        { name: "Expenses", value: Math.round(expenses) },
        { name: "Invest", value: Math.round(invest) },
        { name: "Savings", value: Math.round(Math.max(0, savings)) },
      ],
      suggestions: [
        "Target 20%+ savings rate where possible.",
        "Automate savings on payday.",
      ],
    };
  }

  if (id === "utilities") {
    const electricity = values.electricity ?? 0;
    const water = values.water ?? 0;
    const internet = values.internet ?? 0;
    const fuel = values.fuel ?? 0;
    const monthly = electricity + water + internet + fuel;
    const yearly = monthly * 12;
    const riskScore = clamp((monthly / 30000) * 100, 0, 100);

    return {
      headline: "Utility Cost",
      metrics: [
        { label: "Monthly", value: fmtCurrencyBDT(monthly) },
        { label: "Yearly", value: fmtCurrencyBDT(yearly) },
        { label: "Largest", value: [electricity, water, internet, fuel].sort((a, b) => b - a)[0] === electricity ? "Electricity" : "Other" },
        { label: "Insight", value: monthly > 15000 ? "High" : "Normal" },
      ],
      riskScore,
      chart: [
        { name: "Electricity", value: electricity },
        { name: "Water", value: water },
        { name: "Internet", value: internet },
        { name: "Fuel", value: fuel },
      ],
      suggestions: ["Track bills monthly to spot spikes.", "Consider energy-saving appliances."],
    };
  }

  if (id === "smallbiz") {
    const revenue = values.revenue ?? 0;
    const cost = values.cost ?? 0;
    const profit = revenue - cost;
    const margin = revenue > 0 ? profit / revenue : 0;
    const riskScore = clamp((1 - clamp(margin, 0, 1)) * 100, 0, 100);

    return {
      headline: "Business Snapshot",
      metrics: [
        { label: "Revenue", value: fmtCurrencyBDT(revenue) },
        { label: "Expenses", value: fmtCurrencyBDT(cost) },
        { label: "Profit", value: fmtCurrencyBDT(profit) },
        { label: "Margin", value: `${fmtNumber(margin * 100, 0)}%` },
      ],
      riskScore,
      chart: [
        { name: "Revenue", value: revenue },
        { name: "Expenses", value: cost },
      ],
      suggestions: [
        "Separate business and personal expenses.",
        "Review top costs and negotiate suppliers.",
      ],
    };
  }

  if (id === "policy") {
    const tax = values.tax ?? 10;
    const fuel = values.fuel ?? 0;
    const subsidy = values.subsidy ?? 0;
    const budget = values.budget ?? 0;

    const household = clamp(50 + subsidy / 10000 - fuel / 200 - tax / 2, 0, 100);
    const student = clamp(55 + subsidy / 12000 - tax / 2, 0, 100);
    const business = clamp(45 + budget / 15000 - tax, 0, 100);
    const riskScore = clamp(100 - (household + student + business) / 3, 0, 100);

    return {
      headline: "Impact Overview",
      metrics: [
        { label: "Household", value: `${fmtNumber(household)} / 100` },
        { label: "Student", value: `${fmtNumber(student)} / 100` },
        { label: "Business", value: `${fmtNumber(business)} / 100` },
        { label: "Risk", value: riskLevel(riskScore).toUpperCase() },
      ],
      riskScore,
      chart: [
        { name: "Household", value: household },
        { name: "Students", value: student },
        { name: "Business", value: business },
      ],
      suggestions: [
        "Balance subsidies with targeted tax relief.",
        "Avoid sudden fuel shocks; phase changes.",
        "Allocate budget to productivity multipliers.",
      ],
    };
  }


  if (id === "gpa") {
    const marks = values.marks ?? 0;
    const eligibility = values.eligibility ?? 0;
    const gpa = clamp((marks / 100) * 4, 0, 4);
    const scholarshipChance = clamp((gpa / 4) * 70 + eligibility, 0, 100);
    const riskScore = clamp(100 - scholarshipChance, 0, 100);

    return {
      headline: "GPA & Scholarship",
      metrics: [
        { label: "GPA", value: fmtNumber(gpa, 2) },
        { label: "Chance", value: `${fmtNumber(scholarshipChance, 0)}%` },
        { label: "Target", value: gpa >= 3.5 ? "Strong" : "Improve" },
        { label: "Tip", value: "Focus on high-credit courses." },
      ],
      riskScore,
      chart: [
        { name: "GPA", value: gpa },
        { name: "Chance", value: scholarshipChance / 25 },
      ],
      suggestions: ["Prioritize weak subjects for GPA lift.", "Check eligibility criteria early."],
    };
  }

  if (id === "budget") {
    const income = values.income ?? 0;
    const rent = values.rent ?? 0;
    const food = values.food ?? 0;
    const transport = values.transport ?? 0;
    const other = values.other ?? 0;
    const spend = rent + food + transport + other;
    const balance = income - spend;
    const riskScore = clamp((spend / Math.max(1, income)) * 100, 0, 100);

    return {
      headline: "Budget Plan",
      metrics: [
        { label: "Income", value: fmtCurrencyBDT(income) },
        { label: "Spending", value: fmtCurrencyBDT(spend) },
        { label: "Balance", value: fmtCurrencyBDT(balance) },
        { label: "Status", value: balance >= 0 ? "Balanced" : "Deficit" },
      ],
      riskScore,
      chart: [
        { name: "Rent", value: rent },
        { name: "Food", value: food },
        { name: "Transport", value: transport },
        { name: "Other", value: other },
      ],
      suggestions: ["Keep rent under 30–35% if possible.", "Set a fixed ‘other’ cap."],
    };
  }

  if (id === "inflation") {
    const base = values.base ?? 0;
    const monthlyInfl = (values.monthlyInfl ?? 1) / 100;
    const months = values.months ?? 12;
    const final = base * Math.pow(1 + monthlyInfl, months);
    const increase = final - base;
    const riskScore = clamp((increase / Math.max(1, base)) * 100, 0, 100);

    return {
      headline: "Cost Projection",
      metrics: [
        { label: "Now", value: fmtCurrencyBDT(base) },
        { label: "After", value: fmtCurrencyBDT(final) },
        { label: "Increase", value: fmtCurrencyBDT(increase) },
        { label: "Period", value: `${fmtNumber(months)} months` },
      ],
      riskScore,
      chart: [
        { name: "Now", value: base },
        { name: "After", value: final },
      ],
      suggestions: ["Keep an inflation buffer in monthly budget.", "Review subscriptions and recurring costs."],
    };
  }

  if (id === "disaster") {
    const population = values.population ?? 0;
    const resources = values.resources ?? 0;
    const severity = values.severity ?? 50;
    const coverage = population > 0 ? clamp(resources / population, 0, 1) : 0;
    const riskScore = clamp(severity * (1 - coverage), 0, 100);

    return {
      headline: "Disaster Readiness",
      metrics: [
        { label: "Population", value: fmtNumber(population) },
        { label: "Resources", value: fmtNumber(resources) },
        { label: "Coverage", value: `${fmtNumber(coverage * 100, 0)}%` },
        { label: "Severity", value: `${fmtNumber(severity)} / 100` },
      ],
      riskScore,
      chart: [
        { name: "Coverage", value: coverage * 100 },
        { name: "Risk", value: riskScore },
      ],
      suggestions: ["Increase resource coverage for worst-case days.", "Pre-assign roles and distribution points."],
    };
  }


  // fallback
  return {
    headline: "Result",
    metrics: [{ label: "Ready", value: "Yes" }],
    riskScore: 0,
    chart: [{ name: "Value", value: 50 }],
    suggestions: ["Add inputs and simulate."],
  };
}

const fieldPresets: Record<string, Array<{ key: string; label: string }>> = {
  policy: [
    { key: "tax", label: "Tax %" },
    { key: "fuel", label: "Fuel price delta" },
    { key: "subsidy", label: "Subsidy" },
    { key: "budget", label: "Budget" },
  ],
  student: [
    { key: "exam", label: "Exam" },
    { key: "quiz", label: "Quiz" },
    { key: "assignment", label: "Assignment" },
    { key: "totalClasses", label: "Total Classes" },
    { key: "attended", label: "Attended" },
  ],
  attendance: [
    { key: "totalClasses", label: "Total Classes" },
    { key: "attended", label: "Attended" },
  ],
  tax: [
    { key: "monthlySalary", label: "Monthly Salary (BDT)" },
    { key: "businessProfit", label: "Business Profit (BDT / year)" },
    { key: "vatSales", label: "VAT-able Sales (BDT)" },
    { key: "vatRate", label: "VAT Rate %" },
  ],
  finance: [
    { key: "income", label: "Monthly Income" },
    { key: "expenses", label: "Monthly Expenses" },
    { key: "invest", label: "Monthly Investment" },
  ],
  loan: [
    { key: "amount", label: "Loan Amount" },
    { key: "annualRate", label: "Interest % (annual)" },
    { key: "months", label: "Tenure (months)" },
  ],
  investment: [
    { key: "monthly", label: "Monthly Savings" },
    { key: "years", label: "Years" },
    { key: "annualReturn", label: "Expected Return %" },
  ],
  smallbiz: [
    { key: "revenue", label: "Revenue" },
    { key: "cost", label: "Expenses" },
  ],
  utilities: [
    { key: "electricity", label: "Electricity" },
    { key: "water", label: "Water" },
    { key: "internet", label: "Internet" },
    { key: "fuel", label: "Fuel" },
  ],
  disaster: [
    { key: "population", label: "Population" },
    { key: "resources", label: "Resources" },
    { key: "severity", label: "Scenario Severity (0-100)" },
  ],
  gpa: [
    { key: "marks", label: "Overall Marks (0-100)" },
    { key: "eligibility", label: "Eligibility Bonus (0-30)" },
  ],
  budget: [
    { key: "income", label: "Monthly Income" },
    { key: "rent", label: "Rent" },
    { key: "food", label: "Food" },
    { key: "transport", label: "Transport" },
    { key: "other", label: "Other" },
  ],
  inflation: [
    { key: "base", label: "Monthly Expenses Now" },
    { key: "monthlyInfl", label: "Monthly Inflation %" },
    { key: "months", label: "Months" },
  ],
};

export function ModuleDrawer({
  module,
  open,
  onOpenChange,
}: {
  module: ModuleDef | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { lang } = useI18n();
  const [values, setValues] = useState<Record<string, number>>({});
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);

  const result = useMemo(() => {
    if (!module) return null;
    return computeModule(module, values);
  }, [module, values]);

  const riskScore = result?.riskScore ?? 0;

  const persistKey = module ? `aodup_saved_${module.id}` : "";

  const fields = module ? fieldPresets[module.id] ?? [] : [];

  const handleDownloadPdf = async () => {
    if (!module || !result) return;
    const node = reportRef.current;
    if (!node) return;

    try {
      setIsExporting(true);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "hsl(var(--background))",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 portrait in pt
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 28;

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = margin;
      let remaining = imgHeight;

      while (remaining > 0) {
        pdf.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
        remaining -= pageHeight - margin * 2;
        if (remaining > 0) {
          pdf.addPage();
          y -= pageHeight - margin * 2;
        }
      }

      const safe = module.title.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      pdf.save(`aodup-${safe || module.id}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl bg-glass border-glass-border backdrop-blur-xl">
        {module && (
          <div className="flex h-full flex-col">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl">{module.title.en}</SheetTitle>
              <SheetDescription>{module.description.en}</SheetDescription>
            </SheetHeader>

            {/* Off-screen branded report layout for PDF export */}
            {result && (
              <div
                ref={reportRef}
                aria-hidden="true"
                className="fixed left-[-10000px] top-0 w-[794px] p-8"
              >
                <div className="rounded-2xl border border-glass-border bg-background p-6">
                  <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="text-xs text-muted-foreground">Nexus-N</div>
                        <div className="mt-1 text-lg font-semibold tracking-tight">{module.title[lang]}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{module.description[lang]}</div>
                      </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Generated</div>
                      <div className="mt-1">{new Date().toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3">
                    <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                      <div className="text-sm text-muted-foreground">Headline</div>
                      <div className="text-lg font-semibold">{result.headline}</div>
                    </div>

                    <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Risk</div>
                        <div className="text-sm text-muted-foreground">{fmtNumber(riskScore, 0)}%</div>
                      </div>
                      <div className="mt-2">
                        <Progress value={riskScore} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {result.metrics.map((m) => (
                        <div key={m.label} className="rounded-xl border border-glass-border bg-background/40 p-4">
                          <div className="text-xs text-muted-foreground">{m.label}</div>
                          <div className="mt-1 text-sm font-semibold">{m.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                      <div className="text-sm font-semibold">Charts</div>
                      <div className="mt-3 h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={result.chart}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--popover) / 0.95)",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "12px",
                              }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                      <div className="text-sm font-semibold">Suggestions</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {result.suggestions.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 text-xs text-muted-foreground">Made by Nishat (Full Stack Software Developer)</div>
                  </div>
                </div>
              </div>
            )}

            <Tabs defaultValue="input" className="flex-1">
              <TabsList className="bg-background/50 border border-glass-border">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {fields.map((f) => (
                    <div key={f.key} className="space-y-2">
                      <Label htmlFor={f.key}>{f.label}</Label>
                      <Input
                        id={f.key}
                        inputMode="decimal"
                        value={Number.isFinite(values[f.key]) ? String(values[f.key]) : ""}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          setValues((s) => ({ ...s, [f.key]: Number.isFinite(n) ? n : 0 }));
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="hero"
                    onClick={() => {
                      // results update automatically; this button is for UX confidence
                    }}
                  >
                    Run
                  </Button>
                  <Button
                    variant="glass"
                    onClick={() => {
                      localStorage.setItem(persistKey, JSON.stringify(values));
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setValues({});
                      localStorage.removeItem(persistKey);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!result || isExporting}
                    onClick={handleDownloadPdf}
                  >
                    {isExporting ? "Generating…" : "Download PDF"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    Print
                  </Button>
                </div>

                <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Risk Meter</div>
                    <div className="text-sm text-muted-foreground">{fmtNumber(riskScore, 0)}%</div>
                  </div>
                  <div className="mt-2">
                    <Progress value={riskScore} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="output" className="mt-4 space-y-4">
                {result && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                      <div className="text-sm text-muted-foreground">Headline</div>
                      <div className="text-lg font-semibold">{result.headline}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {result.metrics.map((m) => (
                        <div key={m.label} className="rounded-xl border border-glass-border bg-background/40 p-4">
                          <div className="text-xs text-muted-foreground">{m.label}</div>
                          <div className="mt-1 text-sm font-semibold">{m.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                      <div className="text-sm font-semibold">Charts</div>
                      <div className="mt-3 h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={result.chart}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--popover) / 0.95)",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "12px",
                              }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-xl border border-glass-border bg-background/40 p-4">
                      <div className="text-sm font-semibold">Suggestions</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {result.suggestions.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
