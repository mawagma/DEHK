import type { DemoDevelopmentRow, DemoStore } from "../demo/types";

/**
 * Ein Filterzustand für Karte, Kennzahlen und Diagramme. Leere Liste / leerer String = „alle“.
 * Sortiment und Raum erlauben Mehrfachauswahl.
 */
export type RetailFilter = { assortments: string[]; locationType: string; districts: string[]; centerId: string };

export const EMPTY_FILTER: RetailFilter = { assortments: [], locationType: "", districts: [], centerId: "" };

export const isFilterActive = (f: RetailFilter) => f.assortments.length > 0 || !!f.locationType || f.districts.length > 0 || !!f.centerId;

export function filterStores(stores: DemoStore[], f: RetailFilter) {
  return stores.filter(
    s =>
      (!f.assortments.length || f.assortments.includes(s.assortment)) &&
      (!f.locationType || s.locationType === f.locationType) &&
      (!f.districts.length || f.districts.includes(s.district)) &&
      (!f.centerId || s.centerId === f.centerId)
  );
}

/** URL-Parameter: ?sortiment=A&sortiment=B&lage=…&raum=…&zentrum=… (Werte dürfen Kommas enthalten). */
export function filterFromParams(p: URLSearchParams): RetailFilter {
  return {
    assortments: p.getAll("sortiment").filter(Boolean),
    locationType: p.get("lage") ?? "",
    districts: p.getAll("raum").filter(Boolean),
    centerId: p.get("zentrum") ?? ""
  };
}

export function filterToParams(f: RetailFilter) {
  const p = new URLSearchParams();
  f.assortments.forEach(a => p.append("sortiment", a));
  if (f.locationType) p.set("lage", f.locationType);
  f.districts.forEach(d => p.append("raum", d));
  if (f.centerId) p.set("zentrum", f.centerId);
  return p;
}

export const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

export type CountRow = { label: string; count: number; pct: number };

/** Anzahl und gerundeter Anteil je Kategorie in vorgegebener Reihenfolge. */
export function countBy<K extends "assortment" | "locationType" | "sizeClass">(stores: DemoStore[], key: K, order: string[]): CountRow[] {
  const total = stores.length || 1;
  return order.map(label => {
    const count = stores.filter(s => s[key] === label).length;
    return { label, count, pct: Math.round((count / total) * 100) };
  });
}

/** Bedarfsstufen über die Zuordnung Warengruppe -> Bedarfsstufe (Reihenfolge der ersten Nennung). */
export function countByNeedLevel(stores: DemoStore[], mapping: Record<string, string>): CountRow[] {
  const levels = [...new Set(Object.values(mapping))];
  const total = stores.length || 1;
  return levels.map(label => {
    const count = stores.filter(s => mapping[s.assortment] === label).length;
    return { label, count, pct: Math.round((count / total) * 100) };
  });
}

export const DEFAULT_MIN_COUNT = 3;

/** Kleine Fallzahlen unterdrücken: 1 … (min-1) werden nicht ausgewiesen (null). 0 bleibt 0. */
export const maskCount = (n: number, min = DEFAULT_MIN_COUNT): number | null => (n > 0 && n < min ? null : n);
export const maskedLabel = (min = DEFAULT_MIN_COUNT) => `weniger als ${min}`;

/** Kreuztabelle: Zeilen × Spalten mit Anzahl Betriebe. */
export function crossTable(stores: DemoStore[], rows: string[], cols: string[], rowKey: "locationType", colKey: "assortment") {
  return rows.map(r => cols.map(c => stores.filter(s => s[rowKey] === r && s[colKey] === c).length));
}

/**
 * Entwicklung zur aktuellen Auswahl aus der vorbereiteten Tabelle (nur Summieren).
 * Für Raum- und Zentrenfilter liegen keine vergleichbaren Daten vor -> null.
 */
export function developmentSeries(table: DemoDevelopmentRow[], f: RetailFilter) {
  if (f.districts.length || f.centerId) return null;
  const years = [...new Set(table.map(r => r.year))].sort();
  return years.map(year => ({
    label: year,
    value: table
      .filter(r => r.year === year && (!f.assortments.length || f.assortments.includes(r.assortment)) && (!f.locationType || r.locationType === f.locationType))
      .reduce((n, r) => n + r.count, 0)
  }));
}

/** CSV (Semikolon, für Excel in Deutschland) aus aggregierten Abschnitten – keine Einzelbetriebe. */
export function toCsv(sections: { title: string; header: string[]; rows: (string | number)[][] }[]) {
  const cell = (v: string | number) => {
    const s = String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return sections
    .map(sec => [sec.title, sec.header.map(cell).join(";"), ...sec.rows.map(r => r.map(cell).join(";"))].join("\n"))
    .join("\n\n");
}
