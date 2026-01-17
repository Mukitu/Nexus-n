import { useEffect, useMemo, useState } from "react";

import { MapWithMarkers, type MapMarker } from "@/components/portal/MapWithMarkers";
import { ServiceFilters } from "@/components/portal/ServiceFilters";
import { ServiceItemCard } from "@/components/portal/ServiceItemCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useI18n } from "@/lib/i18n";
import { isDemoText, stripDemoLabel } from "@/lib/stripDemoLabel";
import { TRAVEL_SPOTS, getDistrictName, getUpazilaName, type TravelSpot } from "@/lib/smartDistrictDummy";

const ALL_TYPES: Array<TravelSpot["type"]> = ["Nature", "Historical", "Religious", "Adventure"];

export default function TravelServicePage() {
  const { lang } = useI18n();
  const bn = lang === "bn";

  const [filters, setFilters] = useState({ districtId: "all", query: "" });
  const [types, setTypes] = useState<Array<TravelSpot["type"]>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = window.setTimeout(() => setLoading(false), 220);
    return () => window.clearTimeout(id);
  }, [filters.districtId, filters.query, types.join("|")]);

  const items = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return TRAVEL_SPOTS.filter((x) => {
      if (isDemoText(x.name.en) || isDemoText(x.name.bn) || isDemoText(x.summary.en) || isDemoText(x.summary.bn)) return false;
      if (filters.districtId !== "all" && x.districtId !== filters.districtId) return false;
      if (types.length > 0 && !types.includes(x.type)) return false;
      if (!q) return true;
      const hay = `${stripDemoLabel(x.name.en)} ${stripDemoLabel(x.name.bn)} ${x.type} ${stripDemoLabel(x.summary.en)} ${stripDemoLabel(x.summary.bn)}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filters, types]);

  const mapCenter: [number, number] = useMemo(() => {
    if (filters.districtId !== "all") {
      const first = items[0];
      if (first) return [first.lat, first.lng];
    }
    // Bangladesh center
    return [23.685, 90.3563];
  }, [filters.districtId, items]);

  const markers: MapMarker[] = useMemo(() => {
    // Keep marker count reasonable for UI
    return items.slice(0, 25).map((x) => ({
      id: x.id,
      title: x.name[lang],
      subtitle: bn ? `ধরন: ${typeLabel(x.type)}` : `Type: ${x.type}`,
      lat: x.lat,
      lng: x.lng,
    }));
  }, [items, lang, bn]);

  const typeLabel = (t: TravelSpot["type"]) => {
    if (!bn) return t;
    if (t === "Nature") return "প্রকৃতি";
    if (t === "Historical") return "ঐতিহাসিক";
    if (t === "Religious") return "ধর্মীয়";
    return "অ্যাডভেঞ্চার";
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6 animate-enter">
      <header className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{bn ? "ভ্রমণ সেবা" : "Travel Service"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {bn ? "জেলা/উপজেলা অনুযায়ী ট্রাভেল স্পট খুঁজুন" : "Find travel spots by district and upazila."}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">{bn ? `মোট ফলাফল: ${items.length}` : `Results: ${items.length}`}</div>
        </div>
      </header>

      <section className="space-y-4">
        <ServiceFilters districtId={filters.districtId} query={filters.query} onChange={setFilters} />

        <div className="rounded-2xl border border-glass-border bg-glass p-4 shadow-soft">
          <div className="mb-2 text-xs text-muted-foreground">{bn ? "ফিল্টার টাইপ" : "Type filters"}</div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ToggleGroup
              type="multiple"
              value={types}
              onValueChange={(v) => setTypes((v as Array<TravelSpot["type"]>).filter((x) => ALL_TYPES.includes(x)))}
              className="justify-start"
            >
              {ALL_TYPES.map((t) => (
                <ToggleGroupItem key={t} value={t} aria-label={t}>
                  {typeLabel(t)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {types.length > 0 ? (
              <button
                type="button"
                onClick={() => setTypes([])}
                className="text-xs text-muted-foreground story-link"
              >
                {bn ? "টাইপ ক্লিয়ার" : "Clear types"}
              </button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl border border-glass-border bg-glass shadow-soft animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-glass-border bg-glass p-6 text-sm text-muted-foreground">
            {bn ? "কোনো তথ্য পাওয়া যায়নি—ফিল্টার/সার্চ বদলান।" : "No data found—try changing filters/search."}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((x) => (
              <ServiceItemCard
                key={x.id}
                title={stripDemoLabel(x.name[lang])}
                subtitle={bn ? `ধরন: ${typeLabel(x.type)}` : `Type: ${x.type}`}
                meta={`${bn ? "লোকেশন" : "Location"}: ${getUpazilaName(x.districtId, x.upazilaId, lang)}, ${getDistrictName(x.districtId, lang)}`}
              />
            ))}
          </div>
        )}

        <MapWithMarkers
          title={bn ? "ট্রাভেল ম্যাপ" : "Travel map"}
          center={mapCenter}
          zoom={filters.districtId === "all" ? 7 : 12}
          markers={markers}
        />
      </section>
    </main>
  );
}
