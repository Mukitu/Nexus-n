import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <Button
      variant="glass"
      onClick={() => setLang(lang === "en" ? "bn" : "en")}
      className="gap-2"
      aria-label="Toggle language"
      title={lang === "en" ? "Switch to Bangla" : "ইংরেজিতে পরিবর্তন"}
    >
      <Languages />
      <span className="text-sm font-semibold">{lang === "en" ? "BN" : "EN"}</span>
    </Button>
  );
}
