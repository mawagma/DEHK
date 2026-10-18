import { describe, expect, it } from "vitest";
import { EMPTY_FILTER, filterStores, shareBy } from "../lib/retailFilter";
import type { DemoStore } from "../demo/types";

const store = (id: string, assortment: string, locationType: string, district: string): DemoStore =>
  ({ id, name: id, at: [0, 0], assortment, locationType, district, sizeClass: "unter 400 m²" });
const stores = [
  store("a", "Bekleidung", "Hauptzentrum", "Mitte"),
  store("b", "Bekleidung", "Sonderstandort", "Ost"),
  store("c", "Möbel", "Sonderstandort", "Ost"),
  store("d", "Möbel", "Sonderstandort", "West")
];

describe("filterStores", () => {
  it("liefert ohne Filter alle Betriebe", () => expect(filterStores(stores, EMPTY_FILTER)).toHaveLength(4));
  it("kombiniert alle drei Filter", () => {
    expect(filterStores(stores, { assortment: "Möbel", locationType: "Sonderstandort", district: "Ost" }).map(s => s.id)).toEqual(["c"]);
    expect(filterStores(stores, { ...EMPTY_FILTER, locationType: "Sonderstandort" })).toHaveLength(3);
    expect(filterStores(stores, { ...EMPTY_FILTER, district: "Nord" })).toHaveLength(0);
  });
});

describe("shareBy", () => {
  it("berechnet Anteile in vorgegebener Reihenfolge", () => {
    expect(shareBy(stores, "assortment", ["Möbel", "Bekleidung", "Sonstige"]).map(r => r.value)).toEqual([50, 50, 0]);
  });
  it("teilt bei leerer Menge nicht durch null", () => {
    expect(shareBy([], "assortment", ["Möbel"])[0].value).toBe(0);
  });
});
