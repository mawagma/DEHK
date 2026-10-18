import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";
import { CentersPage } from "../pages/CentersPage";

const renderPage = (url = "/zentren") =>
  render(<MemoryRouter initialEntries={[url]}><CentersPage config={config} /></MemoryRouter>);

const side = (label: string) => within(screen.getByRole("complementary", { name: label }));
const listButton = (name: string) => side("Zentrenliste").getByRole("button", { name });

afterEach(cleanup);

describe("Zentren & Standorte", () => {
  it("Listenauswahl markiert dasselbe Zentrum in der Karte", () => {
    renderPage();
    fireEvent.click(listButton("Biebrich"));
    expect(side("Zentrenliste").getByRole("button", { name: "Biebrich", pressed: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Stadtteilzentrum Biebrich", pressed: true })).toBeTruthy();
  });

  it("Kartenauswahl markiert das Zentrum in der Liste", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Nahversorgungszentrum Dotzheim" }));
    expect(side("Zentrenliste").getByRole("button", { name: "Dotzheim", pressed: true })).toBeTruthy();
  });

  it("öffnet das Profil (30/70) und kehrt zur Übersicht zurück", () => {
    const { container } = renderPage("/zentren?zentrum=innenstadt");
    fireEvent.click(screen.getByRole("button", { name: "Einkaufsinnenstadt ansehen →" }));
    expect(container.querySelector(".workspace.is-profile")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Hauptzentrum Einkaufsinnenstadt" })).toBeTruthy();
    expect(side("Zentrenprofil").getAllByText("498").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "← Zurück zur Übersicht" }));
    expect(container.querySelector(".workspace.is-profile")).toBeNull();
    expect(side("Zentrenliste").getByRole("button", { name: "Einkaufsinnenstadt", pressed: true })).toBeTruthy();
  });

  it("zeigt einen Hinweis, wenn keine Profilkennzahlen vorliegen", () => {
    renderPage("/zentren?zentrum=schelmengraben&ansicht=profil");
    expect(screen.getByText(/noch keine freigegebenen Profilkennzahlen/)).toBeTruthy();
  });
});

describe("Fehleranzeige", () => {
  it("zeigt statt einer weißen Seite eine Meldung", async () => {
    const { ErrorBoundary } = await import("../components/layout/ErrorBoundary");
    const Boom = () => { throw new Error("Testfehler"); };
    const spy = console.error; console.error = () => {};
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    console.error = spy;
    expect(screen.getByRole("alert").textContent).toContain("Testfehler");
  });
});

describe("Zentrenvergleich", () => {
  it("liest den Vergleich aus der URL und zeigt Kennzahlen nebeneinander", () => {
    renderPage("/zentren?vergleich=innenstadt,biebrich,aeppelallee");
    const compare = within(screen.getByRole("region", { name: "Zentrenvergleich" }));
    expect(compare.getByRole("heading", { name: "Einkaufsinnenstadt" })).toBeTruthy();
    expect(compare.getByRole("heading", { name: "Biebrich" })).toBeTruthy();
    // Sonderstandort wird nicht in den Vergleich übernommen
    expect(compare.queryByRole("heading", { name: /Äppelallee/ })).toBeNull();
  });

  it("führt Sonderstandorte in der Tabelle getrennt und ohne Vergleichsauswahl", () => {
    renderPage("/zentren");
    expect(screen.getByText(/Sonderstandorte – kein zentraler Versorgungsbereich/)).toBeTruthy();
    expect(screen.queryByRole("checkbox", { name: /Äppelallee/ })).toBeNull();
    expect(screen.getByRole("checkbox", { name: "Biebrich vergleichen" })).toBeTruthy();
  });
});
