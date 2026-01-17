import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "bn";

type Dict = Record<string, { en: string; bn: string }>;

const dict: Dict = {
  appName: {
    en: "Nexus-N",
    bn: "Nexus-N",
  },
  dashboardTagline: {
    en: "A modern, bilingual utility dashboard for campus life.",
    bn: "ক্যাম্পাস লাইফের জন্য আধুনিক, দ্বিভাষিক ইউটিলিটি ড্যাশবোর্ড।",
  },
  dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  team: { en: "Team", bn: "টিম" },
  guide: { en: "User Guide", bn: "ব্যবহার নির্দেশিকা" },
  modules: { en: "Modules", bn: "মডিউলসমূহ" },
  stocks: { en: "Stock Analyzer", bn: "স্টক অ্যানালাইজার" },
  cvBuilder: { en: "CV Builder", bn: "সিভি বিল্ডার" },

  services: { en: "Smart District Services", bn: "স্মার্ট ডিস্ট্রিক্ট সার্ভিস" },
  serviceTravel: { en: "Travel", bn: "ভ্রমণ" },
  serviceMedical: { en: "Medical", bn: "চিকিৎসা" },
  serviceBlood: { en: "Blood Bank", bn: "ব্লাড ব্যাংক" },

  open: { en: "Open", bn: "খুলুন" },
  run: { en: "Run", bn: "চালান" },
  save: { en: "Save", bn: "সেভ" },
  print: { en: "Print", bn: "প্রিন্ট" },
  reset: { en: "Reset", bn: "রিসেট" },
  input: { en: "Input", bn: "ইনপুট" },
  output: { en: "Output", bn: "আউটপুট" },
  headline: { en: "Headline", bn: "সারসংক্ষেপ" },
  charts: { en: "Charts", bn: "চার্ট" },
  suggestions: { en: "Suggestions", bn: "পরামর্শ" },
  riskMeter: { en: "Risk Meter", bn: "ঝুঁকি মিটার" },
  savedLocal: { en: "Saved locally for offline use", bn: "অফলাইনে ব্যবহারের জন্য লোকালি সেভ হয়েছে" },

  language: { en: "Language", bn: "ভাষা" },
  theme: { en: "Theme", bn: "থিম" },
  light: { en: "Light", bn: "লাইট" },
  dark: { en: "Dark", bn: "ডার্ক" },

  metricHousehold: { en: "Household Impact", bn: "গৃহস্থালি প্রভাব" },
  metricStudents: { en: "Students", bn: "শিক্ষার্থী" },
  metricBusiness: { en: "Business Risk", bn: "ব্যবসা ঝুঁকি" },
  metricFinance: { en: "Finance Overview", bn: "আর্থিক অবস্থা" },

  quickLinks: { en: "Quick Links", bn: "দ্রুত লিংক" },
  madeBy: {
    en: "Made by Nishat (Full Stack Software Developer)",
    bn: "তৈরি করেছেন নিশাত (ফুল স্ট্যাক সফটওয়্যার ডেভেলপার)",
  },

  tutorialTitle: { en: "Welcome", bn: "স্বাগতম" },
  tutorialBody: {
    en: "Pick any module card to open a slide-in panel. Your results can be saved offline and printed.",
    bn: "যেকোনো মডিউল কার্ডে ক্লিক করে স্লাইড প্যানেল খুলুন। ফলাফল অফলাইনে সেভ ও প্রিন্ট করা যাবে।",
  },
  tutorialCta: { en: "Got it", bn: "বুঝেছি" },
};

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof dict) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function safeGetItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore (storage may be blocked in some environments)
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = safeGetItem("aodup_lang");
    return saved === "bn" || saved === "en" ? saved : "en";
  });

  const setLang = (next: Language) => {
    setLangState(next);
    safeSetItem("aodup_lang", next);
  };

  useEffect(() => {
    try {
      document.documentElement.lang = lang === "bn" ? "bn" : "en";
    } catch {
      // ignore
    }
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => dict[key][lang],
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
