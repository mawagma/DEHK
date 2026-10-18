import { describe, expect, it } from "vitest";
import {
  countBy, countByNeedLevel, crossTable, developmentSeries, EMPTY_FILTER, filterFromParams, filterStores,
  filterToParams, isFilterActive, maskCount, toCsv, toggle
} from "../lib/retailFilter";
import type { DemoDevelopmentRow, DemoStore } from "../demo/types";

const store = (id: string, assortment: string, locationType: string, district: string, centerId?: string): DemoStore =>
  ({ id, name: id, at: [0, 0], assortment, locationType, district, sizeClass: "unter 400 m²", centerId });
const stores = [
  store("a", "Bekleidung", "Hauptzentrum", "Mitte", "innenstadt"),
  store("b", "Bekleidung", "Sonderstandort", "Ost"),
  store("c", "Möbel", "Sonderstandort", "Ost"),
  store("d", "Möbel", "Sonderstandort", "West")
];

describe("filterStores", () => {
  it("liefert ohne Filter alle Betriebe", () => expect(filterStores(stores, EMPTY_FILTER)).toHaveLength(4));
  it("kombiniert Filter, Mehrfachauswahl bei Sortiment und Raum", () => {
    expect(filterStores(stores, { ...EMPTY_FILTER, assortments: ["Möbel"], locationType: "Sonderstandort", districts: ["Ost"] }).map(s => s.id)).toEqual(["c"]);
    expect(filterStores(stores, { ...EMPTY_FILTER, districts: ["Ost", "West"] })).toHaveLength(3);
    expect(filterStores(stores, { ...EMPTY_FILTER, assortments: ["Möbel", "Bekleidung"] })).toHaveLength(4);
    expect(filterStores(stores, { ...EMPTY_FILTER, districts: ["Nord"] })).toHaveLength(0);
  });
  it("filtert nach Zentrum", () => {
    expect(filterStores(stores, { ...EMPTY_FILTER, centerId: "innenstadt" }).map(s => s.id)).toEqual(["a"]);
  });
});

describe("URL-Abgleich", () => {
  it("hin und zurück ohne Verlust, auch mit Kommas in Werten", () => {
    const f = { assortments: ["Bekleidung, Schuhe", "Bau, Garten, Heimtier"], locationType: "Hauptzentrum", districts: ["Mitte"], centerId: "" };
    const back = filterFromParams(new URLSearchParams(filterToParams(f).toString()));
    expect(back).toEqual(f);
    expect(filterFromParams(new URLSearchParams(""))).toEqual(EMPTY_FILTER);
    expect(isFilterActive(EMPTY_FILTER)).toBe(false);
    expect(isFilterActive(back)).toBe(true);
  });
  it("toggle fügt hinzu und entfernt", () => {
    expect(toggle(["a"], "b")).toEqual(["a", "b"]);
    expect(toggle(["a", "b"], "a")).toEqual(["b"]);
  });
});

describe("Zählungen", () => {
  it("liefert Anzahl und Anteil in vorgegebener Reihenfolge", () => {
    expect(countBy(stores, "assortment", ["Möbel", "Bekleidung", "Sonstige"])).toEqual([
      { label: "Möbel", count: 2, pct: 50 }, { label: "Bekleidung", count: 2, pct: 50 }, { label: "Sonstige", count: 0, pct: 0 }
    ]);
    expect(countBy([], "assortment", ["Möbel"])[0]).toEqual({ label: "Möbel", count: 0, pct: 0 });
  });
  it("fasst Warengruppen zu Bedarfsstufen zusammen", () => {
    const rows = countByNeedLevel(stores, { Bekleidung: "mittelfristig", Möbel: "langfristig" });
    expect(rows.map(r => [r.label, r.count])).toEqual([["mittelfristig", 2], ["langfristig", 2]]);
  });
  it("Kreuztabelle Standorttyp × Warengruppe", () => {
    expect(crossTable(stores, ["Hauptzentrum", "Sonderstandort"], ["Bekleidung", "Möbel"], "locationType", "assortment")).toEqual([[1, 0], [1, 2]]);
  });
});

describe("Kleine Fallzahlen", () => {
  it("unterdrückt 1 bis Schwelle-1, nicht 0 und nicht ab Schwelle", () => {
    expect([0, 1, 2, 3, 10].map(n => maskCount(n))).toEqual([0, null, null, 3, 10]);
    expect(maskCount(4, 5)).toBeNull();
    expect(maskCount(5, 5)).toBe(5);
  });
});

describe("Entwicklung", () => {
  const table: DemoDevelopmentRow[] = [
    { year: "2015", assortment: "Möbel", locationType: "Sonderstandort", count: 5 },
    { year: "2025", assortment: "Möbel", locationType: "Sonderstandort", count: 3 },
    { year: "2015", assortment: "Bekleidung", locationType: "Hauptzentrum", count: 10 },
    { year: "2025", assortment: "Bekleidung", locationType: "Hauptzentrum", count: 8 }
  ];
  it("summiert die Reihe zur Auswahl", () => {
    expect(developmentSeries(table, EMPTY_FILTER)).toEqual([{ label: "2015", value: 15 }, { label: "2025", value: 11 }]);
    expect(developmentSeries(table, { ...EMPTY_FILTER, assortments: ["Möbel"] })).toEqual([{ label: "2015", value: 5 }, { label: "2025", value: 3 }]);
  });
  it("liefert bei Raum- oder Zentrenfilter keine Werte", () => {
    expect(developmentSeries(table, { ...EMPTY_FILTER, districts: ["Ost"] })).toBeNull();
    expect(developmentSeries(table, { ...EMPTY_FILTER, centerId: "innenstadt" })).toBeNull();
  });
});

describe("CSV-Export", () => {
  it("nutzt Semikolon und maskiert Sonderzeichen", () => {
    const csv = toCsv([{ title: "Sortiment", header: ["Warengruppe", "Anzahl"], rows: [["Bekleidung, Schuhe", 3], ['Sag "Hallo"; ok', 1]] }]);
    expect(csv).toBe('Sortiment\nWarengruppe;Anzahl\nBekleidung, Schuhe;3\n"Sag ""Hallo""; ok";1');
  });
});
