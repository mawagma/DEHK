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
    // Laut Gutachten: 9 bestehende + 1 perspektivischer zentraler Versorgungsbereich
    expect([existing, planned]).toEqual([9, 1]);
    expect(config.centers.filter(c => !central.has(c.categoryId))).toHaveLength(3);
  });

  it("hat Strukturanteile zwischen 0 und 100", () => {
    for (const c of config.centers) for (const r of c.structure ?? []) expect(r.value >= 0 && r.value <= 100, `${c.id} ${r.label}`).toBe(true);
  });

  it("verlinkt Beispiele nur auf vorhandene Zentren", () => {
    const ids = new Set(config.centers.map(c => c.id));
    for (const e of config.steering.examples) if (e.centerId) expect(ids.has(e.centerId), e.id).toBe(true);
  });

  it("hat eindeutige IDs bei Beispielen, Leitsätzen und Sortimentsgruppen", () => {
    for (const list of [config.steering.examples, config.steering.guidelines ?? [], config.steering.assortmentGroups]) {
      const ids = list.map(x => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("hat eine rechteckige Steuerungsmatrix", () => {
    const m = config.steering.matrix;
    if (!m) return;
    expect(m.cells).toHaveLength(m.rows.length);
    for (const row of m.cells) expect(row).toHaveLength(m.cols.length);
  });

  it("führt Sonderstandorte nicht als zentrale Versorgungsbereiche", () => {
    const sst = config.centers.filter(c => c.categoryId === "sst");
    expect(sst.length).toBeGreaterThan(0);
    for (const c of sst) expect(config.centerCategories.find(k => k.id === c.categoryId)?.isCentralSupplyArea).toBe(false);
  });

  it("gibt Nahversorgungszentren und Sonderstandorten unterschiedliche Texte", () => {
    for (const cat of ["nvz", "sst"]) {
      const texts = config.centers.filter(c => c.categoryId === cat).map(c => c.shortText);
      expect(new Set(texts).size).toBe(texts.length);
    }
  });

  it("ordnet jeder Warengruppe eine Bedarfsstufe zu, falls gepflegt", () => {
    const map = config.retail.needLevelByAssortment;
    if (!map) return;
    for (const a of config.retail.assortments) expect(map[a], a).toBeTruthy();
  });
});
