import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

// Fix default marker icon paths for Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export type MapMarker = {
  id: string;
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
};

type Bounds = [[number, number], [number, number]];

function Refit({ bounds }: { bounds: Bounds }) {
  const map = useMap();
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    map.flyToBounds(bounds, {
      padding: [24, 24],
      animate: !prefersReducedMotion,
      duration: prefersReducedMotion ? 0 : 0.85,
      easeLinearity: 0.25,
      maxZoom: 12,
    });
  }, [map, bounds]);
  return null;
}

function boundsFromCenter(center: [number, number], zoom: number): Bounds {
  const [lat, lng] = center;
  const delta = zoom <= 7 ? 2 : zoom <= 9 ? 1 : zoom <= 11 ? 0.5 : 0.25;
  return [
    [lat - delta, lng - delta],
    [lat + delta, lng + delta],
  ];
}

function boundsFromMarkers(markers: MapMarker[]): Bounds {
  let minLat = markers[0].lat;
  let maxLat = markers[0].lat;
  let minLng = markers[0].lng;
  let maxLng = markers[0].lng;
  for (const m of markers) {
    minLat = Math.min(minLat, m.lat);
    maxLat = Math.max(maxLat, m.lat);
    minLng = Math.min(minLng, m.lng);
    maxLng = Math.max(maxLng, m.lng);
  }
  // add tiny padding so single marker isn't over-zoomed
  const pad = 0.01;
  return [
    [minLat - pad, minLng - pad],
    [maxLat + pad, maxLng + pad],
  ];
}

export function MapWithMarkers({
  title,
  center,
  zoom = 10,
  markers,
}: {
  title?: string;
  center: [number, number];
  zoom?: number;
  markers: MapMarker[];
}) {
  const { lang } = useI18n();
  const bn = lang === "bn";

  const bounds = useMemo<Bounds>(() => {
    return markers.length > 0 ? boundsFromMarkers(markers) : boundsFromCenter(center, zoom);
  }, [markers, center, zoom]);

  return (
    <Card className="border-glass-border bg-glass shadow-soft overflow-hidden">
      <div className="p-4">
        <div className="text-sm font-medium tracking-tight">{title ?? (bn ? "ম্যাপ" : "Map")}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {bn ? `মার্কার: ${markers.length}` : `Markers: ${markers.length}`}
        </div>
      </div>

      <div className="relative aspect-[16/6] w-full">
        <MapContainer bounds={bounds} className="absolute inset-0 z-0 h-full w-full">
          <Refit bounds={bounds} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]}>
              <Popup>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{m.title}</div>
                  {m.subtitle ? <div className="text-xs text-muted-foreground">{m.subtitle}</div> : null}
                  <div className="text-[11px] text-muted-foreground">
                    {m.lat.toFixed(5)}, {m.lng.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}

