import { ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

function buildEmbedUrl(query: string) {
  const q = encodeURIComponent(query);
  // Works without API key for many use cases (simple query embed)
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

function buildOpenUrl(query: string) {
  const q = encodeURIComponent(query);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function MapEmbed({ query }: { query: string }) {
  const { lang } = useI18n();
  const bn = lang === "bn";

  return (
    <Card className="border-glass-border bg-glass shadow-soft overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <div className="text-sm font-medium tracking-tight">{bn ? "ম্যাপ" : "Map"}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{query}</div>
        </div>
        <a
          className="text-xs text-muted-foreground story-link inline-flex items-center gap-1"
          href={buildOpenUrl(query)}
          target="_blank"
          rel="noreferrer"
        >
          {bn ? "গুগল ম্যাপে খুলুন" : "Open in Google Maps"}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="relative aspect-[16/7] w-full">
        <iframe
          title={bn ? "গুগল ম্যাপ" : "Google Map"}
          src={buildEmbedUrl(query)}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Card>
  );
}
