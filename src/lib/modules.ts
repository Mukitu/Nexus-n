export type ModuleId =
  | "policy"
  | "student"
  | "tax"
  | "finance"
  | "loan"
  | "investment"
  | "smallbiz"
  | "utilities"
  | "disaster"
  | "gpa"
  | "budget"
  | "inflation"
  | "attendance";

export type Language = "en" | "bn";

export type ModuleDef = {
  id: ModuleId;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  tags?: string[];
};

export const MODULES: ModuleDef[] = [
  {
    id: "policy",
    title: { en: "Policy Impact Simulator", bn: "নীতি প্রভাব সিমুলেটর" },
    description: {
      en: "Test tax, fuel, subsidies and budget trade-offs.",
      bn: "কর, জ্বালানি, ভর্তুকি ও বাজেট পরিবর্তনের প্রভাব দেখুন।",
    },
    tags: ["charts", "risk"],
  },
  {
    id: "student",
    title: { en: "Student Semester Result Predictor", bn: "সেমিস্টার রেজাল্ট প্রেডিক্টর" },
    description: {
      en: "Predict pass/fail with attendance and assessment marks.",
      bn: "উপস্থিতি ও নম্বর দিয়ে পাশ/ফেল অনুমান করুন।",
    },
    tags: ["charts", "risk"],
  },
  {
    id: "attendance",
    title: { en: "Attendance-Based Marks Calculator", bn: "উপস্থিতি-ভিত্তিক নম্বর" },
    description: {
      en: "Convert attendance percentage into marks.",
      bn: "উপস্থিতির শতাংশ থেকে নম্বর হিসাব করুন।",
    },
    tags: ["calculator"],
  },
  {
    id: "tax",
    title: { en: "Tax Calculator", bn: "ট্যাক্স ক্যালকুলেটর" },
    description: {
      en: "Salary tax, business tax and VAT—inside the platform.",
      bn: "স্যালারি ট্যাক্স, ব্যবসা ট্যাক্স ও ভ্যাট—একই প্ল্যাটফর্মে।",
    },
    tags: ["calculator", "charts"],
  },
  {
    id: "finance",
    title: { en: "Personal Finance Simulator", bn: "পার্সোনাল ফাইন্যান্স" },
    description: {
      en: "Model income, expenses and savings health.",
      bn: "আয়-ব্যয় ও সঞ্চয়ের অবস্থা বিশ্লেষণ করুন।",
    },
  },
  {
    id: "loan",
    title: { en: "Loan / EMI Calculator", bn: "লোন/ইএমআই ক্যালকুলেটর" },
    description: {
      en: "Estimate EMI and visualize breakdown.",
      bn: "ইএমআই ও খরচের বিশ্লেষণ দেখুন।",
    },
  },
  {
    id: "investment",
    title: { en: "Investment / Savings Planner", bn: "ইনভেস্টমেন্ট/সেভিংস প্ল্যানার" },
    description: {
      en: "Project savings growth toward a target.",
      bn: "লক্ষ্য অনুযায়ী সঞ্চয়ের বৃদ্ধি অনুমান করুন।",
    },
  },
  {
    id: "smallbiz",
    title: { en: "Small Business / Freelancer Tools", bn: "স্মল বিজনেস/ফ্রিল্যান্সার টুলস" },
    description: {
      en: "Track profit/loss and cashflow (offline save).",
      bn: "লাভ-ক্ষতি ও ক্যাশফ্লো ট্র্যাক করুন (অফলাইনে সেভ)।",
    },
  },
  {
    id: "utilities",
    title: { en: "Citizen Utility Calculators", bn: "সিটিজেন ইউটিলিটি ক্যালকুলেটর" },
    description: {
      en: "Estimate monthly & yearly utility costs.",
      bn: "মাসিক ও বার্ষিক ইউটিলিটি খরচ হিসাব করুন।",
    },
  },
  {
    id: "disaster",
    title: { en: "Disaster & Environmental Module", bn: "দুর্যোগ ও পরিবেশ" },
    description: {
      en: "Compute risk and resource allocation warnings.",
      bn: "ঝুঁকি ও রিসোর্স বরাদ্দের সতর্কতা দেখুন।",
    },
  },
  {
    id: "gpa",
    title: { en: "GPA / Scholarship Predictor", bn: "জিপিএ/স্কলারশিপ প্রেডিক্টর" },
    description: {
      en: "Predict GPA and eligibility hints.",
      bn: "জিপিএ ও যোগ্যতার ধারণা পান।",
    },
  },
  {
    id: "budget",
    title: { en: "Local Budget Planner", bn: "লোকাল বাজেট প্ল্যানার" },
    description: {
      en: "Build a balanced budget with categories.",
      bn: "ক্যাটাগরি অনুযায়ী বাজেট বানান।",
    },
  },
  {
    id: "inflation",
    title: { en: "Cost-of-Living & Inflation Simulator", bn: "ইনফ্লেশন সিমুলেটর" },
    description: {
      en: "Project expense increase over time.",
      bn: "সময়ের সাথে খরচ বৃদ্ধির পূর্বাভাস দেখুন।",
    },
  },
];

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function percent(n: number) {
  return Math.round(n * 100);
}

export function riskLevel(score0to100: number) {
  if (score0to100 < 35) return "low";
  if (score0to100 < 70) return "medium";
  return "high";
}

export function riskColorClass(level: ReturnType<typeof riskLevel>) {
  if (level === "low") return "text-accent-foreground";
  if (level === "medium") return "text-gold";
  return "text-destructive";
}
