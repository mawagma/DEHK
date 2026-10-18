import { describe, expect, it } from "vitest";
import type { AssortmentGroup } from "../config/types";
import { searchAssortments } from "../lib/assortments";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";

const groups: AssortmentGroup[] = [
  { id: "a", label: "A", description: "", items: ["Bücher", { name: "Fahrräder", synonyms: ["E-Bike", "Pedelec"] }] },
  { id: "b", label: "B", description: "", items: [{ name: "Telekommunikation", synonyms: ["Handy", "Smartphone"] }] }
];

describe("Sortimentssuche", () => {
  it("findet über den Namen", () => {
    const r = searchAssortments(groups, "bücher");
    expect(r[0].hits.map(h => h.name)).toEqual(["Bücher"]);
    expect(r[0].hits[0].viaSynonym).toBeUndefined();
  });
  it("findet über Synonyme und meldet das Synonym", () => {
    const r = searchAssortments(groups, "e-bike");
    expect(r[0].hits).toEqual([expect.objectContaining({ name: "Fahrräder", viaSynonym: "E-Bike" })]);
    expect(searchAssortments(groups, "Smartphone")[1].hits[0]).toMatchObject({ name: "Telekommunikation", viaSynonym: "Smartphone" });
  });
  it("liefert ohne Suchbegriff alles und bei keinem Treffer leere Gruppen", () => {
    expect(searchAssortments(groups, " ").flatMap(g => g.hits)).toHaveLength(3);
    expect(searchAssortments(groups, "xyz").flatMap(g => g.hits)).toHaveLength(0);
  });
  it("Wiesbaden: Tierfutter führt zum Zoologischen Bedarf", () => {
    const hit = searchAssortments(config.steering.assortmentGroups, "Tierfutter").flatMap(g => g.hits)[0];
    expect(hit.name).toBe("Zoologischer Bedarf");
  });
  it("Wiesbaden: jede zugeordnete Warengruppe existiert", () => {
    for (const g of config.steering.assortmentGroups)
      for (const i of g.items) if (typeof i !== "string" && i.retailGroup) expect(config.retail.assortments).toContain(i.retailGroup);
  });
});
