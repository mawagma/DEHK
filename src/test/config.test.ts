import { describe, expect, it } from "vitest";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";

describe("Kommunale Konfiguration Wiesbaden", () => {
  it("hat eindeutige Zentren-IDs und gültige Kategorien", () => {
    const ids = config.centers.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const categories = new Set(config.centerCategories.map(c => c.id));
    for (const c of config.centers) expect(categories.has(c.categoryId), c.id).toBe(true);
  });

  it("zählt Sonderstandorte nicht als zentrale Versorgungsbereiche", () => {
    const central = new Set(config.centerCategories.filter(c => c.isCentralSupplyArea).map(c => c.id));
    const csa = config.centers.filter(c => central.has(c.categoryId));
    const existing = csa.filter(c => c.status === "bestehend").length;
    const planned = csa.filter(c => c.status === "perspektivisch").length;
    expect(`${existing} + ${planned}`).toBe(config.overview.metrics.find(m => m.label === "Zentrale Versorgungsbereiche")?.value);
    expect(config.centers.filter(c => !central.has(c.categoryId))).toHaveLength(3);
  });

  it("hat Strukturanteile zwischen 0 und 100", () => {
    for (const c of config.centers) for (const r of c.structure ?? []) expect(r.value >= 0 && r.value <= 100, `${c.id} ${r.label}`).toBe(true);
  });
});
