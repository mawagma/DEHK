import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import App from "../App";
import { wiesbadenConfig as config } from "../config/municipalities/wiesbaden";

afterEach(() => { cleanup(); window.location.hash = ""; });

describe("Hash-Routing", () => {
  it("wechselt den Inhalt bei einer Hash-Änderung ohne Neuladen", async () => {
    render(<HashRouter><App config={config} /></HashRouter>);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Einzelhandel für starke Zentren");
    await act(async () => {
      window.location.hash = "#/nahversorgung";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Nahversorgung");
  });

  it("rendert Navigationslinks relativ als #/…", () => {
    render(<HashRouter><App config={config} /></HashRouter>);
    const hrefs = screen.getAllByRole("link").map(a => a.getAttribute("href") ?? "");
    expect(hrefs.filter(h => h.includes("/#/"))).toEqual([]);
    expect(hrefs).toContain("#/zentren");
  });
});
