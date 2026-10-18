import type { CenterConfig, MunicipalityConfig } from "../config/types";

export const isCentral = (config: MunicipalityConfig, c: CenterConfig) =>
  !!config.centerCategories.find(k => k.id === c.categoryId)?.isCentralSupplyArea;

export type CenterSortKey = "name" | "category" | "stores" | "salesAreaM2";
export type SortDir = "asc" | "desc";

/** Sortiert Standorte; fehlende Zahlen stehen immer am Ende. */
export function sortCenters(rows: CenterConfig[], key: CenterSortKey, dir: SortDir, categoryLabel: (id: string) => string) {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (key === "name") return sign * a.name.localeCompare(b.name, "de");
    if (key === "category") return sign * categoryLabel(a.categoryId).localeCompare(categoryLabel(b.categoryId), "de");
    const x = a[key], y = b[key];
    if (x === undefined && y === undefined) return 0;
    if (x === undefined) return 1;
    if (y === undefined) return -1;
    return sign * (x - y);
  });
}

export const MAX_COMPARE = 3;

/** Liest "?vergleich=a,b" – nur zentrale Versorgungsbereiche (keine Sonderstandorte), ohne Duplikate, max. 3. */
export function parseCompare(param: string | null, config: MunicipalityConfig) {
  const ids = (param ?? "").split(",").map(s => s.trim()).filter(Boolean);
  return [...new Set(ids)]
    .map(id => config.centers.find(c => c.id === id))
    .filter((c): c is CenterConfig => !!c && isCentral(config, c))
    .slice(0, MAX_COMPARE);
}

/** Summe über Standorte; undefined, wenn kein Wert vorliegt. */
export const sumOf = (rows: CenterConfig[], key: "stores" | "salesAreaM2") => {
  const values = rows.map(r => r[key]).filter((v): v is number => v !== undefined);
  return values.length ? values.reduce((a, b) => a + b, 0) : undefined;
};
