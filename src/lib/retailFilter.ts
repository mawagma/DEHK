import type { ShareRow } from "../config/types";
import type { DemoStore } from "../demo/types";

/** Leerer String = "alle". */
export type RetailFilter = { assortment: string; locationType: string; district: string };

export const EMPTY_FILTER: RetailFilter = { assortment: "", locationType: "", district: "" };

export function filterStores(stores: DemoStore[], f: RetailFilter) {
  return stores.filter(
    s =>
      (!f.assortment || s.assortment === f.assortment) &&
      (!f.locationType || s.locationType === f.locationType) &&
      (!f.district || s.district === f.district)
  );
}

/** Prozentanteile je Kategorie in vorgegebener Reihenfolge (gerundet). */
export function shareBy(stores: DemoStore[], key: "assortment" | "locationType", order: string[], colors?: string[]): ShareRow[] {
  const total = stores.length || 1;
  return order.map((label, i) => ({
    label,
    value: Math.round((stores.filter(s => s[key] === label).length / total) * 100),
    color: colors?.[i]
  }));
}
