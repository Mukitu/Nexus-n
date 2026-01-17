import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string;
};

type CVData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  summary: string;
  experiences: ExperienceItem[];
  educationDegree: string;
  educationInstitute: string;
  educationDates: string;
  skills: string;
};

type TemplateId =
  | "t1"
  | "t2"
  | "t3"
  | "t4"
  | "t5"
  | "t6"
  | "t7"
  | "t8"
  | "t9"
  | "t10";

const DEFAULT_CV: CVData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  summary: "",
  experiences: [
    {
      id: "exp-1",
      title: "",
      company: "",
      location: "",
      dates: "",
      bullets: "",
    },
  ],
  educationDegree: "",
  educationInstitute: "",
  educationDates: "",
  skills: "",
};

const TEMPLATES: Array<{ id: TemplateId; name: string; paperClass: string; headerClass: string }> = [
  { id: "t1", name: "Classic", paperClass: "rounded-none", headerClass: "border-b border-paper" },
  { id: "t2", name: "Modern", paperClass: "rounded-xl", headerClass: "border-b border-paper" },
  { id: "t3", name: "Compact", paperClass: "rounded-lg", headerClass: "border-b border-paper" },
  { id: "t4", name: "Minimal", paperClass: "rounded-none", headerClass: "" },
  { id: "t5", name: "Editorial", paperClass: "rounded-xl", headerClass: "border-b border-paper" },
  { id: "t6", name: "Mono", paperClass: "rounded-md", headerClass: "border-b border-paper" },
  { id: "t7", name: "Bold", paperClass: "rounded-xl", headerClass: "border-b-2 border-paper" },
  { id: "t8", name: "Neat", paperClass: "rounded-lg", headerClass: "border-b border-paper" },
  { id: "t9", name: "Timeline", paperClass: "rounded-xl", headerClass: "border-b border-paper" },
  { id: "t10", name: "A4 Pro", paperClass: "rounded-none", headerClass: "border-b border-paper" },
];

function splitLines(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitSkills(value: string) {
  return value
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

export default function CVBuilderPage() {
  const { lang } = useI18n();
  const [template, setTemplate] = useState<TemplateId>("t1");
  const [data, setData] = useState<CVData>(DEFAULT_CV);
  const [downloading, setDownloading] = useState(false);
  const paperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = lang === "bn" ? "সিভি বিল্ডার | Nexus-N" : "CV Builder | Nexus-N";
  }, [lang]);

  const labels = useMemo(() => {
    const bn = lang === "bn";
    return {
      h1: bn ? "সিভি বিল্ডার" : "CV Builder",
      subtitle: bn
        ? "১০টা template থেকে পছন্দ করুন, ইনপুট দিন, পাশে live preview দেখুন, তারপর PDF ডাউনলোড করুন।"
        : "Pick a template, fill in details, see live preview, then download as PDF.",
      template: bn ? "টেমপ্লেট" : "Template",
      downloadPdf: bn ? "PDF ডাউনলোড" : "Download PDF",
      downloading: bn ? "ডাউনলোড হচ্ছে…" : "Downloading…",
      form: bn ? "ইনপুট" : "Input",
      preview: bn ? "প্রিভিউ" : "Preview",
      personal: bn ? "পার্সোনাল" : "Personal",
      fullName: bn ? "নাম" : "Full name",
      title: bn ? "পদবি/টাইটেল" : "Title",
      email: bn ? "ইমেইল" : "Email",
      phone: bn ? "ফোন" : "Phone",
      location: bn ? "ঠিকানা/লোকেশন" : "Location",
      links: bn ? "লিংক (LinkedIn/Portfolio)" : "Links (LinkedIn/Portfolio)",
      summary: bn ? "সংক্ষিপ্ত পরিচিতি" : "Summary",
      experience: bn ? "অভিজ্ঞতা" : "Experience",
      add: bn ? "যোগ করুন" : "Add",
      remove: bn ? "রিমুভ" : "Remove",
      expTitle: bn ? "পজিশন" : "Role",
      expCompany: bn ? "কোম্পানি" : "Company",
      expLocation: bn ? "লোকেশন" : "Location",
      expDates: bn ? "সময়কাল" : "Dates",
      expBullets: bn ? "কাজের বর্ণনা (প্রতি লাইনে ১টা)" : "Highlights (one per line)",
      education: bn ? "শিক্ষাগত যোগ্যতা" : "Education",
      eduDegree: bn ? "ডিগ্রি" : "Degree",
      eduInstitute: bn ? "প্রতিষ্ঠান" : "Institute",
      eduDates: bn ? "সময়কাল" : "Dates",
      skills: bn ? "স্কিল (কমা দিয়ে আলাদা)" : "Skills (comma separated)",
    };
  }, [lang]);

  const currentTemplate = TEMPLATES.find((t) => t.id === template) ?? TEMPLATES[0];

  const onDownloadPDF = async () => {
    const node = paperRef.current;
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
        // Basic multi-page support by slicing the canvas vertically
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

      const safeName = (data.fullName || "cv").trim().replace(/\s+/g, "-").toLowerCase();
      pdf.save(`${safeName}.pdf`);
      toast.success(lang === "bn" ? "PDF ডাউনলোড হয়েছে" : "PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error(lang === "bn" ? "PDF তৈরি করা যায়নি" : "Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-paper-foreground">{children}</div>
  );

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6">
      <header className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{labels.h1}</h1>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-muted-foreground">{labels.template}</div>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "rounded-md border px-3 py-1 text-xs transition-colors",
                    template === t.id
                      ? "border-ring bg-accent text-accent-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <Button variant="hero" onClick={onDownloadPDF} disabled={downloading}>
            {downloading ? labels.downloading : labels.downloadPdf}
          </Button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-glass border-glass-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{labels.form}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={labels.fullName}>
                <Input value={data.fullName} onChange={(e) => setData((p) => ({ ...p, fullName: e.target.value }))} />
              </Field>
              <Field label={labels.title}>
                <Input value={data.title} onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))} />
              </Field>
              <Field label={labels.email}>
                <Input value={data.email} onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))} />
              </Field>
              <Field label={labels.phone}>
                <Input value={data.phone} onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))} />
              </Field>
              <Field label={labels.location}>
                <Input value={data.location} onChange={(e) => setData((p) => ({ ...p, location: e.target.value }))} />
              </Field>
              <Field label={labels.links}>
                <Input value={data.links} onChange={(e) => setData((p) => ({ ...p, links: e.target.value }))} />
              </Field>
            </div>

            <Field label={labels.summary}>
              <Textarea
                value={data.summary}
                onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
              />
            </Field>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{labels.experience}</div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setData((p) => ({
                      ...p,
                      experiences: [
                        ...p.experiences,
                        {
                          id: `exp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                          title: "",
                          company: "",
                          location: "",
                          dates: "",
                          bullets: "",
                        },
                      ],
                    }))
                  }
                >
                  <Plus className="size-4" />
                  {labels.add}
                </Button>
              </div>

              <div className="space-y-4">
                {data.experiences.map((exp, idx) => (
                  <div key={exp.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        {labels.experience} {idx + 1}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setData((p) => ({
                            ...p,
                            experiences: p.experiences.length <= 1 ? p.experiences : p.experiences.filter((x) => x.id !== exp.id),
                          }))
                        }
                        disabled={data.experiences.length <= 1}
                      >
                        <Trash2 className="size-4" />
                        {labels.remove}
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={labels.expTitle}>
                        <Input
                          value={exp.title}
                          onChange={(e) =>
                            setData((p) => ({
                              ...p,
                              experiences: p.experiences.map((x) => (x.id === exp.id ? { ...x, title: e.target.value } : x)),
                            }))
                          }
                        />
                      </Field>
                      <Field label={labels.expCompany}>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            setData((p) => ({
                              ...p,
                              experiences: p.experiences.map((x) => (x.id === exp.id ? { ...x, company: e.target.value } : x)),
                            }))
                          }
                        />
                      </Field>
                      <Field label={labels.expLocation}>
                        <Input
                          value={exp.location}
                          onChange={(e) =>
                            setData((p) => ({
                              ...p,
                              experiences: p.experiences.map((x) => (x.id === exp.id ? { ...x, location: e.target.value } : x)),
                            }))
                          }
                        />
                      </Field>
                      <Field label={labels.expDates}>
                        <Input
                          value={exp.dates}
                          onChange={(e) =>
                            setData((p) => ({
                              ...p,
                              experiences: p.experiences.map((x) => (x.id === exp.id ? { ...x, dates: e.target.value } : x)),
                            }))
                          }
                        />
                      </Field>
                    </div>

                    <div className="mt-4">
                      <Field label={labels.expBullets}>
                        <Textarea
                          value={exp.bullets}
                          onChange={(e) =>
                            setData((p) => ({
                              ...p,
                              experiences: p.experiences.map((x) => (x.id === exp.id ? { ...x, bullets: e.target.value } : x)),
                            }))
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold">{labels.education}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={labels.eduDegree}>
                  <Input
                    value={data.educationDegree}
                    onChange={(e) => setData((p) => ({ ...p, educationDegree: e.target.value }))}
                  />
                </Field>
                <Field label={labels.eduInstitute}>
                  <Input
                    value={data.educationInstitute}
                    onChange={(e) => setData((p) => ({ ...p, educationInstitute: e.target.value }))}
                  />
                </Field>
                <Field label={labels.eduDates}>
                  <Input
                    value={data.educationDates}
                    onChange={(e) => setData((p) => ({ ...p, educationDates: e.target.value }))}
                  />
                </Field>
              </div>
            </div>

            <Field label={labels.skills}>
              <Textarea value={data.skills} onChange={(e) => setData((p) => ({ ...p, skills: e.target.value }))} />
            </Field>
          </CardContent>
        </Card>

        <Card className="bg-glass border-glass-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{labels.preview}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-xl border border-glass-border bg-background p-3">
              <div
                className={cn(
                  "mx-auto w-[794px] min-h-[1123px] border bg-paper text-paper-foreground shadow-soft",
                  currentTemplate.paperClass,
                )}
              >
                <div ref={paperRef} className={cn("h-full w-full bg-paper text-paper-foreground", currentTemplate.paperClass)}>
                  <div className={cn("px-10 pt-10", currentTemplate.headerClass)}>
                    <div className="flex flex-col gap-2 pb-6">
                      <div className={cn("text-3xl font-semibold tracking-tight", template === "t5" && "font-serif")}
                      >
                        {data.fullName || " "}
                      </div>
                      <div className={cn("text-sm", template === "t6" && "font-mono")}>{data.title || " "}</div>
                      <div className="text-xs text-muted-foreground">
                        {[data.email, data.phone, data.location, data.links].filter(Boolean).join(" • ") || " "}
                      </div>
                    </div>
                  </div>

                  <div className={cn("px-10 pb-10 pt-6", template === "t3" && "pt-4")}
                  >
                    {data.summary?.trim() ? (
                      <>
                        <SectionTitle>{labels.summary}</SectionTitle>
                        <div className={cn("mt-2 text-sm leading-relaxed", template === "t3" && "text-[13px]")}
                        >
                          {data.summary}
                        </div>
                      </>
                    ) : null}

                    {data.experiences.some((x) => (x.title || x.company || x.bullets).trim?.() || x.dates || x.location) ? (
                      <>
                        <SectionTitle>{labels.experience}</SectionTitle>
                        <div className="mt-2 space-y-4">
                          {data.experiences
                            .filter((x) => (x.title || x.company || x.bullets || x.dates || x.location).trim?.() || x.dates || x.location)
                            .map((x) => (
                              <div key={x.id}>
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <div className="text-sm font-semibold">
                                    {[x.title, x.company].filter(Boolean).join(" — ") || " "}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{x.dates || " "}</div>
                                </div>
                                <div className="text-xs text-muted-foreground">{x.location || " "}</div>
                                {splitLines(x.bullets).length ? (
                                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                                    {splitLines(x.bullets).map((b, idx) => (
                                      <li key={idx}>{b}</li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            ))}
                        </div>
                      </>
                    ) : null}

                    {(data.educationDegree || data.educationInstitute).trim?.() ? (
                      <>
                        <SectionTitle>{labels.education}</SectionTitle>
                        <div className="mt-2">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <div className="text-sm font-semibold">
                              {[data.educationDegree, data.educationInstitute].filter(Boolean).join(" — ") || " "}
                            </div>
                            <div className="text-xs text-muted-foreground">{data.educationDates || " "}</div>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {splitSkills(data.skills).length ? (
                      <>
                        <SectionTitle>{labels.skills}</SectionTitle>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {splitSkills(data.skills).map((s) => (
                            <span
                              key={s}
                              className={cn(
                                "rounded-full border px-3 py-1 text-xs",
                                template === "t7" ? "border-paper" : "border-paper",
                              )}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
