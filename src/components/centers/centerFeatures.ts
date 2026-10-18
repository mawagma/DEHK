import type { CenterCategoryConfig, MunicipalityConfig } from "../../config/types";
import type { DemoData } from "../../demo/types";
import type { MapFeature } from "../maps/SchematicMap";

export const categoryOf = (config: MunicipalityConfig, categoryId: string): CenterCategoryConfig | undefined =>
  config.centerCategories.find(c => c.id === categoryId);

/** Zentren als Kartenobjekte: optional Abgrenzung (Fläche) plus Symbol je Kategorie. */
export function centerFeatures(config: MunicipalityConfig, demo: DemoData, withAreas: boolean): MapFeature[] {
  return demo.centers.flatMap(geo => {
    const center = config.centers.find(c => c.id === geo.id);
    const cat = center && categoryOf(config, center.categoryId);
    if (!center || !cat) return [];
    const label = `${cat.label} ${center.name}${center.status === "perspektivisch" ? " (perspektivisch)" : ""}`;
    const dashed = center.status === "perspektivisch";
    const marker: MapFeature = { id: center.id, label, at: geo.at, shape: cat.symbol, fill: cat.color, size: 7, dashed, focusable: true };
    if (!withAreas) return [marker];
    return [{ id: `${center.id}__area`, label, points: geo.shape, fill: `${cat.color}33`, dashed, selectId: center.id }, marker];
  });
}

