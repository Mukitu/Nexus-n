import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Droplet, MapPinned, Stethoscope } from "lucide-react";

import { MODULES, ModuleDef } from "@/lib/modules";
import { ModuleCard } from "@/components/platform/ModuleCard";
import { ModuleDrawer } from "@/components/platform/ModuleDrawer";
import { FirstRunDialog } from "@/components/platform/FirstRunDialog";
import { Card } from "@/components/ui/card";
import { fmtNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-glass-border bg-glass shadow-soft backdrop-blur-xl">
      <div className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-lg font-semibold tracking-tight">{value}</div>
      </div>
    </Card>
  );
}

function ServiceQuickCard({
  title,
  subtitle,
  to,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link to={to} className="block">
      <Card className="border-glass-border bg-glass shadow-soft hover-scale">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold tracking-tight">{title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
            </div>
            <div className="rounded-xl border border-glass-border bg-background/60 p-2">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const bn = lang === "bn";
  const [active, setActive] = useState<ModuleDef | null>(null);

  const metrics = useMemo(() => {
    const base = lang === "bn" ? 1 : 1;
    return {
      household: 78 * base,
      students: 1240 * base,
      business: 22 * base,
      finance: 86 * base,
    };
  }, [lang]);

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6 animate-enter">
      <FirstRunDialog />

      <section className="mb-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("appName")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("dashboardTagline")}</p>
          </div>
          <div className="hidden lg:block text-xs text-muted-foreground">Tip: Use Ctrl/⌘ + B to toggle sidebar</div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label={t("metricHousehold")} value={`${fmtNumber(metrics.household)} / 100`} />
        <Metric label={t("metricStudents")} value={fmtNumber(metrics.students)} />
        <Metric label={t("metricBusiness")} value={`${fmtNumber(metrics.business)}%`} />
        <Metric label={t("metricFinance")} value={`${fmtNumber(metrics.finance)} / 100`} />
      </section>

      <section id="modules" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("modules")}</h2>
          <div className="text-xs text-muted-foreground">13 modules • slide-in panels</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => (
            <ModuleCard
              key={m.id}
              title={m.title[lang]}
              description={m.description[lang]}
              actionLabel={m.id === "tax" ? "Visit" : undefined}
              onCardClick={
                m.id === "tax"
                  ? () => {
                      window.location.href = "https://next-tax.vercel.app/";
                    }
                  : undefined
              }
              onOpen={() => {
                if (m.id === "tax") {
                  window.location.href = "https://next-tax.vercel.app/";
                  return;
                }
                setActive(m);
              }}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("services")}</h2>
          <div className="text-xs text-muted-foreground">{bn ? "জেলা ভিত্তিক সার্ভিস" : "District-based services"}</div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ServiceQuickCard
            title={t("serviceTravel")}
            subtitle={bn ? "ভ্রমণ স্পট খুঁজুন" : "Find travel spots"}
            to="/services/travel"
            icon={MapPinned}
          />
          <ServiceQuickCard
            title={t("serviceMedical")}
            subtitle={bn ? "সরকারি চিকিৎসা তথ্য" : "Government medical info"}
            to="/services/medical"
            icon={Stethoscope}
          />
          <ServiceQuickCard
            title={t("serviceBlood")}
            subtitle={bn ? "ব্লাড ব্যাংক খুঁজুন" : "Find blood banks"}
            to="/services/blood-bank"
            icon={Droplet}
          />
        </div>
      </section>

      <section className="mt-10">
        <div className="rounded-2xl border border-glass-border bg-glass p-5 shadow-soft">
          <div className="text-sm font-semibold">{t("quickLinks")}</div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a className="story-link" href="/team">
              {t("team")}
            </a>
            <a className="story-link" href="/guide">
              {t("guide")}
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-10 border-t border-glass-border pt-6 pb-10">
        <div className="text-sm text-muted-foreground">{t("madeBy")}</div>
      </footer>

      <ModuleDrawer module={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </main>
  );
}
