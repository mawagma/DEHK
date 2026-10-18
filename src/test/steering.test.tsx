import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";
import { SteeringPage } from "../pages/SteeringPage";

const renderAt = (url: string) => render(<MemoryRouter initialEntries={[url]}><SteeringPage config={config} /></MemoryRouter>);
afterEach(cleanup);

describe("Einzelhandel steuern", () => {
  it("öffnet das Kapitel aus der URL", () => {
    renderAt("/einzelhandel-steuern?kapitel=matrix");
    expect(screen.getByRole("heading", { level: 2, name: "Standort × Sortiment" })).toBeTruthy();
    expect(screen.getByRole("table")).toBeTruthy();
  });

  it("zeigt Synonym-Treffer mit Link zur Einzelhandelsstruktur", () => {
    renderAt("/einzelhandel-steuern?kapitel=sortimentsliste");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "E-Bike" } });
    expect(screen.getByText(/gefunden über „E-Bike“/)).toBeTruthy();
    const link = screen.getByRole("link", { name: /Wo gibt es das heute/ });
    expect(link.getAttribute("href")).toBe("/einzelhandelsstruktur?sortiment=Sonstige%20Sortimente");
  });

  it("verlinkt Beispiele auf das Zentrenprofil", () => {
    renderAt("/einzelhandel-steuern?kapitel=beispiele");
    expect(screen.getByRole("link", { name: /Einkaufsinnenstadt im Zentrenprofil/ }).getAttribute("href")).toBe("/zentren?zentrum=innenstadt&ansicht=profil");
  });
});
