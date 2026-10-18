import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";
import { getDemoData } from "../demo";
import { RetailStructurePage } from "../pages/RetailStructurePage";

const renderAt = (url: string) => render(<MemoryRouter initialEntries={[url]}><RetailStructurePage config={config} /></MemoryRouter>);
const kpi = () => document.querySelector(".kpi")!.textContent;
afterEach(cleanup);

describe("Einzelhandelsstruktur", () => {
  it("liest Filter aus der URL und zeigt sie als Chips", () => {
    renderAt("/einzelhandelsstruktur?sortiment=Bekleidung%2C%20Schuhe&lage=Hauptzentrum");
    const chips = within(screen.getByRole("list", { name: "Aktive Filter" }));
    expect(chips.getByText("Bekleidung, Schuhe")).toBeTruthy();
    expect(chips.getByText("Hauptzentrum")).toBeTruthy();
    const expected = getDemoData(config)!.stores.filter(s => s.assortment === "Bekleidung, Schuhe" && s.locationType === "Hauptzentrum").length;
    expect(kpi()).toBe(expected.toLocaleString("de-DE"));
  });

  it("filtert über den Link aus dem Zentrenprofil auf einen Bereich", () => {
    renderAt("/einzelhandelsstruktur?zentrum=biebrich");
    expect(screen.getByText("Bereich: Biebrich")).toBeTruthy();
    expect(kpi()).toBe(String(config.centers.find(c => c.id === "biebrich")!.stores));
  });

  it("setzt per Klick auf einen Balken einen Filter und zeigt Absolut + Prozent", () => {
    renderAt("/einzelhandelsstruktur");
    const bar = screen.getByRole("button", { name: /Nahrungs- und Genussmittel/ });
    expect(bar.textContent).toMatch(/\d · \d+ %/);
    fireEvent.click(bar);
    expect(screen.getByRole("button", { name: /Nahrungs- und Genussmittel/, pressed: true })).toBeTruthy();
    expect(within(screen.getByRole("list", { name: "Aktive Filter" })).getByText("Nahrungs- und Genussmittel")).toBeTruthy();
  });

  it("weist kleine Fallzahlen nicht aus", () => {
    const stores = getDemoData(config)!.stores;
    const combo = config.retail.assortments
      .flatMap(a => config.retail.districts.map(d => ({ a, d, n: stores.filter(s => s.assortment === a && s.district === d && s.locationType === "Sonderstandort").length })))
      .find(c => c.n > 0 && c.n < 3);
    expect(combo, "Demodaten enthalten eine Kombination mit 1–2 Betrieben").toBeTruthy();
    renderAt(`/einzelhandelsstruktur?lage=Sonderstandort&sortiment=${encodeURIComponent(combo!.a)}&raum=${encodeURIComponent(combo!.d)}`);
    expect(kpi()).toBe("weniger als 3");
    expect(screen.getByText(/keine Größenklassen ausgewiesen/)).toBeTruthy();
  });
});
