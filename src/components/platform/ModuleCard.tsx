import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function ModuleCard({
  title,
  description,
  onOpen,
  onCardClick,
  actionLabel,
}: {
  title: string;
  description: string;
  onOpen: () => void;
  onCardClick?: () => void;
  actionLabel?: string;
}) {
  const { t } = useI18n();

  const data = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        i,
        v: 20 + Math.sin(i / 2) * 8 + i * 2,
      })),
    [],
  );

  return (
    <Card
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (!onCardClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      }}
      className={
        "group relative overflow-hidden border-glass-border bg-glass shadow-soft backdrop-blur-xl transition-transform hover:-translate-y-0.5 hover:shadow-elevated" +
        (onCardClick ? " cursor-pointer" : "")
      }
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-brand blur-3xl opacity-20" />
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-base font-semibold leading-tight">{title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="shrink-0"
          >
            {actionLabel ?? t("open")}
          </Button>
        </div>

        <div className="mt-4 h-16 rounded-lg border border-glass-border bg-background/40 p-2 opacity-90">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="mini" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "hsl(var(--popover) / 0.9)",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fill="url(#mini)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

