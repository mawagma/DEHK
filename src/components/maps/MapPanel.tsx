import type { ComponentProps, ReactNode } from "react";
import { isPlaceholderId } from "../../demo";
import { ArcGISMap } from "./ArcGISMap";

type Props = ComponentProps<typeof ArcGISMap> & {
  /** Beispielkarte, solange keine echte WebMap-ID konfiguriert ist. */
  fallback: ReactNode | null;
};

export function MapPanel({ fallback, ...arcgis }: Props) {
  if (!isPlaceholderId(arcgis.webMapId)) return <ArcGISMap {...arcgis} />;
  return fallback ?? <div className="map-status is-static">Für diese Kommune ist noch keine Karte hinterlegt.</div>;
}
