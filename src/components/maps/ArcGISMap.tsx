import "@arcgis/core/assets/esri/themes/light/main.css";
import { useEffect, useRef, useState } from "react";

type Selection = {
  /** Layer-ID in der WebMap, deren Features auswählbar sind. */
  layerId?: string;
  /** Attributfeld mit der fachlichen ID (z. B. CENTER_ID). */
  idField: string;
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

type Props = {
  webMapId: string;
  portalUrl?: string;
  ariaLabel: string;
  selection?: Selection;
};

type Status = "loading" | "ready" | "error";

export function ArcGISMap({ webMapId, portalUrl, ariaLabel, selection }: Props) {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<__esri.MapView | null>(null);
  const layerRef = useRef<__esri.FeatureLayer | null>(null);
  const highlightRef = useRef<__esri.Handle | null>(null);
  const onSelectRef = useRef(selection?.onSelect);
  onSelectRef.current = selection?.onSelect;
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const layerId = selection?.layerId;
  const idField = selection?.idField;

  useEffect(() => {
    if (!mapDiv.current) return;
    let destroyed = false;
    let view: __esri.MapView | null = null;
    setStatus("loading");

    (async () => {
      try {
        const [{ default: WebMap }, { default: MapView }, { default: esriConfig }] = await Promise.all([
          import("@arcgis/core/WebMap"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/config")
        ]);
        if (destroyed) return;
        if (portalUrl) esriConfig.portalUrl = portalUrl;

        const webmap = new WebMap({ portalItem: { id: webMapId } });
        view = new MapView({ container: mapDiv.current!, map: webmap, constraints: { snapToZoom: false } });
        viewRef.current = view;
        await view.when();
        if (destroyed) return;

        if (layerId && idField) {
          const layer = webmap.findLayerById(layerId) as __esri.FeatureLayer | undefined;
          if (!layer) {
            setMessage(`Layer „${layerId}“ wurde in der WebMap nicht gefunden.`);
          } else {
            layer.outFields = [idField];
            layerRef.current = layer;
            view.on("click", async event => {
              const hit = await view!.hitTest(event, { include: [layer] });
              const graphic = hit.results.find(r => r.type === "graphic")?.graphic;
              const id = graphic?.attributes?.[idField];
              if (id == null) return;
              onSelectRef.current?.(String(id));
            });
          }
        }
        setStatus("ready");
      } catch (e) {
        if (destroyed) return;
        console.error("ArcGIS WebMap konnte nicht geladen werden", e);
        setStatus("error");
      }
    })();

    return () => {
      destroyed = true;
      highlightRef.current?.remove();
      view?.destroy();
      viewRef.current = null;
      layerRef.current = null;
    };
  }, [webMapId, portalUrl, layerId, idField]);

  // Auswahl aus der Liste → Feature hervorheben und hinzoomen.
  const selectedId = selection?.selectedId;
  useEffect(() => {
    const view = viewRef.current;
    const layer = layerRef.current;
    highlightRef.current?.remove();
    if (status !== "ready" || !view || !layer || !idField || !selectedId) return;
    let cancelled = false;
    (async () => {
      try {
        const where = `${idField} = '${selectedId.replace(/'/g, "''")}'`;
        const { features } = await layer.queryFeatures({ where, returnGeometry: true, outFields: [idField] });
        if (cancelled || !features.length) return;
        const layerView = await view.whenLayerView(layer);
        highlightRef.current = layerView.highlight(features);
        await view.goTo(features, { duration: 600 });
      } catch (e) {
        if (!cancelled) console.error("Zoom auf Auswahl fehlgeschlagen", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId, status, idField]);

  return (
    <div className="arcgis-map-shell" role="region" aria-label={ariaLabel} aria-busy={status === "loading"}>
      {status === "loading" ? <div className="map-status">Karte wird geladen …</div> : null}
      {status === "error" ? <div className="map-status is-error">Die Karte konnte nicht geladen werden. Bitte später erneut versuchen.</div> : null}
      {message ? <div className="map-status is-error">{message}</div> : null}
      <div className="arcgis-map" ref={mapDiv} />
    </div>
  );
}
