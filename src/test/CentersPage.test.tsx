import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";
import { CentersPage } from "../pages/CentersPage";

const renderPage = (url = "/zentren") =>
  render(<MemoryRouter initialEntries={[url]}><CentersPage config={config} /></MemoryRouter>);

const listButton = (name: string) => screen.getByRole("button", { name });

afterEach(cleanup);

describe("Zentren & Standorte", () => {
  it("Listenauswahl markiert dasselbe Zentrum in der Karte", () => {
    renderPage();
    fireEvent.click(listButton("Biebrich"));
    expect(screen.getByRole("button", { name: "Biebrich", pressed: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Stadtteilzentrum Biebrich", pressed: true })).toBeTruthy();
  });

  it("Kartenauswahl markiert das Zentrum in der Liste", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Nahversorgungszentrum Dotzheim" }));
    expect(screen.getByRole("button", { name: "Dotzheim", pressed: true })).toBeTruthy();
  });

  it("öffnet das Profil (30/70) und kehrt zur Übersicht zurück", () => {
    const { container } = renderPage("/zentren?zentrum=innenstadt");
    fireEvent.click(screen.getByRole("button", { name: "Einkaufsinnenstadt ansehen →" }));
    expect(container.querySelector(".workspace.is-profile")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Hauptzentrum Einkaufsinnenstadt" })).toBeTruthy();
    expect(screen.getByText("498")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "← Zurück zur Übersicht" }));
    expect(container.querySelector(".workspace.is-profile")).toBeNull();
    expect(screen.getByRole("button", { name: "Einkaufsinnenstadt", pressed: true })).toBeTruthy();
  });

  it("zeigt einen Hinweis, wenn keine Profilkennzahlen vorliegen", () => {
    renderPage("/zentren?zentrum=dotzheim&ansicht=profil");
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
