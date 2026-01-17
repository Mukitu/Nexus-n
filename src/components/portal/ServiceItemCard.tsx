import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function VerifiedBadge({ label }: { label: string }) {
  return (
    <Badge variant="secondary" className="border border-glass-border bg-glass">
      {label}
    </Badge>
  );
}

export function ServiceItemCard({
  title,
  subtitle,
  meta,
  verifiedLabel,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  verifiedLabel?: string;
}) {
  return (
    <Card className="border-glass-border bg-glass shadow-soft hover-scale">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold tracking-tight">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div> : null}
          </div>
          {verifiedLabel ? <VerifiedBadge label={verifiedLabel} /> : null}
        </div>
        {meta ? <div className="mt-3 text-xs text-muted-foreground">{meta}</div> : null}
      </div>
    </Card>
  );
}
