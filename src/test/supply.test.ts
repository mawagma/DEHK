import { describe, expect, it } from "vitest";
import type { DemoHex } from "../demo/types";
import { hexagon } from "../demo/geometry";
import { hexAt, populationByClass, populationLabel, wellSuppliedShare } from "../lib/supply";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";
import { getDemoData } from "../demo";

const hex = (id: string, classId: string, pop: number, x: number): DemoHex =>
  ({ id, classId, pop, points: hexagon([x, 0], 10), nearestMarketM: 300, marketsInWalk: 2, district: "Mitte" });
const hexes = [hex("a", "1", 600, 0), hex("b", "2", 200, 30), hex("c", "5", 200, 60)];
const classes = [{ id: "1", label: "Sehr hoch", color: "#000" }, { id: "2", label: "Hoch", color: "#111" }, { id: "5", label: "Sehr gering", color: "#222" }];

describe("Nahversorgung", () => {
  it("summiert Einwohner je Klasse mit Anteil", () => {
    expect(populationByClass(hexes, classes).map(r => [r.pop, r.pct])).toEqual([[600, 60], [200, 20], [200, 20]]);
  });
  it("berechnet den Anteil gut versorgter Einwohner aus gelieferten Klassen", () => {
    expect(wellSuppliedShare(hexes, ["1", "2"])).toBe(80);
    expect(wellSuppliedShare([], ["1"])).toBe(0);
  });
  it("rundet Einwohner und unterdrückt kleine Werte", () => {
    expect(populationLabel(1234)).toBe("ca. 1.230");
    expect(populationLabel(7)).toBe("weniger als 10");
    expect(populationLabel(40, 50)).toBe("weniger als 50");
  });
  it("findet die Zelle an einem Punkt", () => {
    expect(hexAt(hexes, [31, 1])?.id).toBe("b");
    expect(hexAt(hexes, [500, 500])).toBeUndefined();
  });
  it("Demodaten: alle Beispieladressen liegen in einer Rasterzelle", () => {
    const demo = getDemoData(config)!;
    for (const a of demo.exampleAddresses) expect(hexAt(demo.hexes, a.at), a.label).toBeTruthy();
  });
});
