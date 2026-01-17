import { useEffect, useMemo, useState } from "react";

import { MapWithMarkers, type MapMarker } from "@/components/portal/MapWithMarkers";
import { ServiceFilters } from "@/components/portal/ServiceFilters";
import { ServiceItemCard } from "@/components/portal/ServiceItemCard";
import { useI18n } from "@/lib/i18n";
import { isDemoText, stripDemoLabel } from "@/lib/stripDemoLabel";
import { MEDICAL_SERVICES, getDistrictName, getUpazilaName } from "@/lib/smartDistrictDummy";

export default function MedicalServicePage() {
  const { lang } = useI18n();
  const bn = lang === "bn";

  const [filters, setFilters] = useState({ districtId: "all", query: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = window.setTimeout(() => setLoading(false), 220);
    return () => window.clearTimeout(id);
  }, [filters.districtId, filters.query]);

  const items = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return MEDICAL_SERVICES.filter((x) => {
      if ((x as any).isDemo) return false;
      if (isDemoText(x.name.en) || isDemoText(x.name.bn)) return false;
      if (filters.districtId !== "all" && x.districtId !== filters.districtId) return false;
      if (!q) return true;
      const hay = `${stripDemoLabel(x.name.en)} ${stripDemoLabel(x.name.bn)} ${x.kind} ${x.emergencyPhone}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filters]);

  const mapCenter: [number, number] = useMemo(() => {
    if (filters.districtId !== "all") {
      const first = items[0];
      if (first) return [first.lat, first.lng];
    }
    return [23.685, 90.3563];
  }, [filters.districtId, items]);

  const markers: MapMarker[] = useMemo(() => {
    return items.slice(0, 25).map((x) => {
      const location = `${getUpazilaName(x.districtId, x.upazilaId, lang)}, ${getDistrictName(x.districtId, lang)}`;
      return {
        id: x.id,
        title: location,
        subtitle: bn
          ? `${stripDemoLabel(x.name[lang])} • ধরন: ${x.kind} • ইমার্জেন্সি: ${x.emergencyPhone}`
          : `${stripDemoLabel(x.name[lang])} • Type: ${x.kind} • Emergency: ${x.emergencyPhone}`,
        lat: x.lat,
        lng: x.lng,
      };
    });
  }, [items, lang, bn]);

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6 animate-enter">
      <header className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{bn ? "চিকিৎসা সেবা" : "Medical Service"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {bn ? "সরকারি হাসপাতাল/স্বাস্থ্যকেন্দ্র তথ্য খুঁজুন" : "Find government medical services."}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {bn ? `মোট ফলাফল: ${items.length}` : `Results: ${items.length}`}
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <ServiceFilters districtId={filters.districtId} query={filters.query} onChange={setFilters} />

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
                subtitle={bn ? `ধরন: ${x.kind}` : `Type: ${x.kind}`}
                meta={`${bn ? "ইমার্জেন্সি" : "Emergency"}: ${x.emergencyPhone} • ${bn ? "লোকেশন" : "Location"}: ${getUpazilaName(x.districtId, x.upazilaId, lang)}, ${getDistrictName(x.districtId, lang)}`}
              />
            ))}
          </div>
        )}

        <MapWithMarkers
          title={bn ? "চিকিৎসা ম্যাপ" : "Medical map"}
          center={mapCenter}
          zoom={filters.districtId === "all" ? 7 : 12}
          markers={markers}
        />
      </section>
    </main>
  );
}
