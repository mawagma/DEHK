import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { MunicipalityConfig } from "./config/types";
import { AppFooter } from "./components/layout/AppFooter";
import { AppHeader } from "./components/layout/AppHeader";
import { CentersPage } from "./pages/CentersPage";
import { OverviewPage } from "./pages/OverviewPage";
import { RetailStructurePage } from "./pages/RetailStructurePage";
import { SteeringPage } from "./pages/SteeringPage";
import { SupplyPage } from "./pages/SupplyPage";

export default function App({ config }: { config: MunicipalityConfig }) {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  const m = config.modules;

  return (
    <div className="app-shell">
      {/* Klick abfangen: "#inhalt" würde bei #-Adressen sonst als Seitenwechsel gelesen. */}
      <a className="skip-link" href="#inhalt" onClick={e => { e.preventDefault(); document.getElementById("inhalt")?.focus(); }}>
        Zum Inhalt springen
      </a>
      <AppHeader config={config} />
      <main id="inhalt" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<OverviewPage config={config} />} />
          {m.zentren ? <Route path="/zentren" element={<CentersPage config={config} />} /> : null}
          {m.nahversorgung ? <Route path="/nahversorgung" element={<SupplyPage config={config} />} /> : null}
          {m.einzelhandelsstruktur ? <Route path="/einzelhandelsstruktur" element={<RetailStructurePage config={config} />} /> : null}
          {m["einzelhandel-steuern"] ? <Route path="/einzelhandel-steuern" element={<SteeringPage config={config} />} /> : null}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppFooter config={config} />
    </div>
  );
}
