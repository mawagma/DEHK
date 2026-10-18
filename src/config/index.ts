import { wiesbadenConfig } from "./municipalities/wiesbaden";
import type { MunicipalityConfig } from "./types";

const municipalities: Record<string, MunicipalityConfig> = { wiesbaden: wiesbadenConfig };

// Kommune per Build-Variable wählen (VITE_MUNICIPALITY=wiesbaden). Neue Kommune = neue Datei + Eintrag hier.
export const activeConfig: MunicipalityConfig =
  municipalities[import.meta.env.VITE_MUNICIPALITY ?? "wiesbaden"] ?? wiesbadenConfig;
