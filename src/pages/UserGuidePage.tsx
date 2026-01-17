import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { MODULES } from "@/lib/modules";
import { useI18n } from "@/lib/i18n";

export default function UserGuidePage() {
  const { t, lang } = useI18n();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 animate-enter">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("guide")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Step-by-step usage for each module (collapsible).</p>
      </header>

      <Card className="border-glass-border bg-glass shadow-soft backdrop-blur-xl">
        <div className="p-5">
          <Accordion type="single" collapsible className="w-full">
            {MODULES.map((m) => (
              <AccordionItem key={m.id} value={m.id}>
                <AccordionTrigger>{m.title[lang]}</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Open the module from the Dashboard card.</li>
                    <li>Enter inputs in the slide-in panel.</li>
                    <li>Switch to Output to see charts, risk and suggestions.</li>
                    <li>Save results for offline access; Download PDF for branded summary.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 text-sm">
            <a className="story-link" href="/">
              ← {t("dashboard")}
            </a>
          </div>
        </div>
      </Card>

      <footer className="mt-10 border-t border-glass-border pt-6 pb-10">
        <div className="text-sm text-muted-foreground">{t("madeBy")}</div>
      </footer>
    </main>
  );
}
