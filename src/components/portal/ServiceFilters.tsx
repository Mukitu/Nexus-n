import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { DISTRICTS } from "@/lib/smartDistrictDummy";

type Props = {
  districtId: string;
  query: string;
  onChange: (next: { districtId: string; query: string }) => void;
};

export function ServiceFilters({ districtId, query, onChange }: Props) {
  const { lang } = useI18n();
  const bn = lang === "bn";

  const [draftQuery, setDraftQuery] = useState(query);

  // small debounce so UI feels premium
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (draftQuery !== query) onChange({ districtId, query: draftQuery });
    }, 200);
    return () => window.clearTimeout(id);
  }, [draftQuery, query, districtId, onChange]);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const onReset = () => {
    setDraftQuery("");
    onChange({ districtId: "all", query: "" });
  };

  return (
    <div className="rounded-2xl border border-glass-border bg-glass p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {bn ? "ফিল্টার" : "Filters"}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onReset}>
          {bn ? "রিসেট" : "Reset"}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{bn ? "জেলা" : "District"}</div>
          <Select value={districtId} onValueChange={(v) => onChange({ districtId: v, query })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              <SelectItem value="all">{bn ? "সব" : "All"}</SelectItem>
              {DISTRICTS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{bn ? "সার্চ" : "Search"}</div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={draftQuery} onChange={(e) => setDraftQuery(e.target.value)} className="pl-9" />
          </div>
        </div>
      </div>
    </div>
  );
}
