import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("stürzt nicht ab, wenn window.scrollTo ein Promise liefert (neuere Chrome-Versionen)", async () => {
    const spy = vi.spyOn(window, "scrollTo").mockImplementation((() => Promise.resolve()) as never);
    render(<HashRouter><App config={config} /></HashRouter>);
    await act(async () => { window.location.hash = "#/zentren"; window.dispatchEvent(new HashChangeEvent("hashchange")); });
    await act(async () => { window.location.hash = "#/nahversorgung"; window.dispatchEvent(new HashChangeEvent("hashchange")); });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Nahversorgung");
    spy.mockRestore();
  });

  it("rendert Navigationslinks relativ als #/…", () => {
    render(<HashRouter><App config={config} /></HashRouter>);
    const hrefs = screen.getAllByRole("link").map(a => a.getAttribute("href") ?? "");
    expect(hrefs.filter(h => h.includes("/#/"))).toEqual([]);
    expect(hrefs).toContain("#/zentren");
  });
});
