import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";
import { getDemoData } from "../demo";
import { hexAt, populationLabel, wellSuppliedShare } from "../lib/supply";
import { SupplyPage } from "../pages/SupplyPage";

const demo = getDemoData(config)!;
const renderPage = () => render(<MemoryRouter><SupplyPage config={config} /></MemoryRouter>);
afterEach(cleanup);

describe("Nahversorgung", () => {
  it("zeigt den Einwohneranteil gut versorgter Bereiche", () => {
    renderPage();
    const share = wellSuppliedShare(demo.hexes, config.supply.wellSuppliedClassIds!);
    expect(document.querySelector(".kpi-sentence")!.textContent).toContain(`${share} %`);
    expect(screen.getByRole("img", { name: /Anteil der Einwohner nach Versorgungsgrad/ })).toBeTruthy();
  });

  it("zeigt für eine Beispieladresse die Werte der Rasterzelle", () => {
    renderPage();
    const address = demo.exampleAddresses[0];
    const hex = hexAt(demo.hexes, address.at)!;
    fireEvent.change(screen.getByLabelText("Wie ist meine Adresse versorgt?"), { target: { value: address.label } });
    const info = document.querySelector(".store-info") as HTMLElement;
    expect(within(info).getByText(address.label)).toBeTruthy();
    expect(within(info).getByText(populationLabel(hex.pop, config.supply.minPopulation))).toBeTruthy();
    expect(within(info).getByText(`in ca. ${hex.nearestMarketM.toLocaleString("de-DE")} m`)).toBeTruthy();
  });

  it("filtert Märkte über die Legende", () => {
    renderPage();
    const type = config.supply.marketTypes[0];
    const others = demo.markets.filter(m => m.typeId !== type.id);
    const button = screen.getByRole("button", { name: new RegExp(`^${type.label}`) });
    fireEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    const labelOf = (id: string) => config.supply.marketTypes.find(t => t.id === id)!.label;
    for (const m of others.slice(0, 3)) expect(screen.queryByRole("button", { name: `${m.name} (${labelOf(m.typeId)})` })).toBeNull();
    const kept = demo.markets.find(m => m.typeId === type.id)!;
    expect(screen.getByRole("button", { name: `${kept.name} (${type.label})` })).toBeTruthy();
  });
});
