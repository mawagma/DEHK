import { describe, expect, it } from "vitest";
import { aboutEnabled, findGlossaryEntry, glossarySlug } from "../lib/about";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";

describe("Über das Konzept / Glossar", () => {
  it("erzeugt stabile Anker", () => {
    expect(glossarySlug("Zentraler Versorgungsbereich (ZVB)")).toBe("zentraler-versorgungsbereich-zvb");
    expect(glossarySlug("Großflächigkeit")).toBe("grossflaechigkeit");
  });
  it("findet Einträge über den Wortanfang", () => {
    expect(findGlossaryEntry(config, "zentraler Versorgungsbereich")?.term).toBe("Zentraler Versorgungsbereich (ZVB)");
    expect(findGlossaryEntry(config, "Gibt es nicht")).toBeUndefined();
  });
  it("lässt sich abschalten", () => {
    expect(aboutEnabled(config)).toBe(true);
    expect(aboutEnabled({ ...config, modules: { ...config.modules, "ueber-das-konzept": false } })).toBe(false);
    expect(aboutEnabled({ ...config, about: undefined, glossary: undefined })).toBe(false);
  });
});
