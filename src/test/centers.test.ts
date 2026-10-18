import { describe, expect, it } from "vitest";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";
import { isCentral, parseCompare, sortCenters, sumOf } from "../lib/centers";

const label = (id: string) => config.centerCategories.find(c => c.id === id)!.label;

describe("Zentren-Logik", () => {
  it("sortiert nach Betrieben absteigend, fehlende Werte zuletzt", () => {
    const sorted = sortCenters(config.centers, "stores", "desc", label);
    expect(sorted[0].id).toBe("innenstadt");
    expect(sorted.at(-1)!.stores).toBeUndefined();
    const asc = sortCenters(config.centers, "stores", "asc", label);
    expect(asc.at(-1)!.stores).toBeUndefined();
  });

  it("nimmt in den Vergleich nur zentrale Versorgungsbereiche, max. drei", () => {
    const ids = parseCompare("innenstadt,aeppelallee,biebrich,biebrich,gibtsnicht,dotzheim,erbenheim", config).map(c => c.id);
    expect(ids).toEqual(["innenstadt", "biebrich", "dotzheim"]);
    expect(parseCompare(null, config)).toEqual([]);
  });

  it("summiert ohne Sonderstandorte, wenn vorher gefiltert", () => {
    const zvb = config.centers.filter(c => isCentral(config, c));
    expect(zvb.some(c => c.categoryId === "sst")).toBe(false);
    expect(sumOf(zvb, "stores")).toBe(zvb.reduce((n, c) => n + (c.stores ?? 0), 0));
    expect(sumOf([], "stores")).toBeUndefined();
  });
});
