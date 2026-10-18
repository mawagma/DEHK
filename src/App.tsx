import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { MunicipalityConfig } from "./config/types";
import { AppFooter } from "./components/layout/AppFooter";
import { AppHeader } from "./components/layout/AppHeader";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { aboutEnabled } from "./lib/about";
import { AboutPage } from "./pages/AboutPage";
import { CentersPage } from "./pages/CentersPage";
import { OverviewPage } from "./pages/OverviewPage";
import { RetailStructurePage } from "./pages/RetailStructurePage";
import { SteeringPage } from "./pages/SteeringPage";
import { SupplyPage } from "./pages/SupplyPage";

/** Hält den Router bei jeder Hash-Änderung mit der Adresszeile synchron (falls ein Browser kein popstate meldet). */
function useHashSync() {
  const navigate = useNavigate();
  useEffect(() => {
    const sync = () => {
      const target = window.location.hash.replace(/^#/, "") || "/";
      if (!target.startsWith("/")) return; // z. B. "#inhalt" ist kein Seitenwechsel
      navigate(target, { replace: true });
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [navigate]);
}

export default function App({ config }: { config: MunicipalityConfig }) {
  const { pathname } = useLocation();
  // Geschweifte Klammern: neuere Browser geben bei scrollTo ein Promise zurück, React hielte es für eine Aufräumfunktion.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useHashSync();
  const m = config.modules;

  return (
    <div className="app-shell">
      {/* Klick abfangen: "#inhalt" würde bei #-Adressen sonst als Seitenwechsel gelesen. */}
      <a className="skip-link" href="#inhalt" onClick={e => { e.preventDefault(); document.getElementById("inhalt")?.focus(); }}>
        Zum Inhalt springen
      </a>
      <AppHeader config={config} />
      <main id="inhalt" tabIndex={-1}>
        <div key={pathname} className="route-fade">
        <ErrorBoundary resetKey={pathname}>
        <Routes>
          <Route path="/" element={<OverviewPage config={config} />} />
          {m.zentren ? <Route path="/zentren" element={<CentersPage config={config} />} /> : null}
          {m.nahversorgung ? <Route path="/nahversorgung" element={<SupplyPage config={config} />} /> : null}
          {m.einzelhandelsstruktur ? <Route path="/einzelhandelsstruktur" element={<RetailStructurePage config={config} />} /> : null}
          {m["einzelhandel-steuern"] ? <Route path="/einzelhandel-steuern" element={<SteeringPage config={config} />} /> : null}
          {aboutEnabled(config) ? <Route path="/ueber-das-konzept" element={<AboutPage config={config} />} /> : null}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ErrorBoundary>
        </div>
      </main>
      <AppFooter config={config} />
    </div>
  );
}
