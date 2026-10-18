import { useEffect, useRef, useState } from "react";

type Props = {
  webMapId: string;
  portalUrl?: string;
  ariaLabel: string;
  compact?: boolean;
};

const isPlaceholder = (id: string) => !id || id.startsWith("YOUR_");

export function ArcGISMap({ webMapId, portalUrl, ariaLabel, compact }: Props) {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPlaceholder(webMapId) || !mapDiv.current) return;

    let view: any;

    (async () => {
      try {
        const [{ default: WebMap }, { default: MapView }, esriConfig] = await Promise.all([
          import("@arcgis/core/WebMap"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/config")
        ]);

        if (portalUrl) esriConfig.default.portalUrl = portalUrl;

        const webmap = new WebMap({ portalItem: { id: webMapId } });
        view = new MapView({
          container: mapDiv.current!,
          map: webmap,
          constraints: { snapToZoom: false }
        });
        await view.when();
      } catch (e) {
        console.error(e);
        setError("Die ArcGIS-WebMap konnte nicht geladen werden.");
      }
    })();

    return () => {
      if (view) view.destroy();
    };
  }, [webMapId, portalUrl]);

  if (isPlaceholder(webMapId)) {
    return (
      <div className={`map-placeholder ${compact ? "is-compact" : ""}`} role="img" aria-label={ariaLabel}>
        <svg viewBox="0 0 800 500" aria-hidden="true">
          <rect x="0" y="0" width="800" height="500" rx="20" className="map-bg" />
          <path d="M50 380 C190 300 240 410 390 330 S620 220 770 300" className="river" />
          <path d="M80 120 C230 65 360 110 470 70 S660 90 730 150" className="road" />
          <path d="M100 250 C240 180 350 250 470 205 S650 170 720 230" className="road" />
          <circle cx="305" cy="230" r="13" className="pin" />
          <circle cx="510" cy="185" r="10" className="pin secondary" />
          <circle cx="610" cy="285" r="10" className="pin secondary" />
          <path d="M250 270 l80 -28 60 48 -32 70 -90 -12z" className="center-shape" />
        </svg>
        <div className="map-placeholder-copy">
          <strong>ArcGIS WebMap</strong>
          <span>WebMap-ID in der kommunalen Konfiguration eintragen</span>
        </div>
      </div>
    );
  }

  return (
    <div className="arcgis-map-shell" aria-label={ariaLabel}>
      {error ? <div className="map-error">{error}</div> : null}
      <div className="arcgis-map" ref={mapDiv} />
    </div>
  );
}
