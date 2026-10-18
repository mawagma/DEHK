import { Navigate, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { OverviewPage } from "./pages/OverviewPage";
import { CentersPage } from "./pages/CentersPage";
import { wiesbadenConfig } from "./config/municipalities/wiesbaden";

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader config={wiesbadenConfig} />
      <main>
        <Routes>
          <Route path="/" element={<OverviewPage config={wiesbadenConfig} />} />
          <Route path="/zentren" element={<CentersPage config={wiesbadenConfig} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <div>
          <strong>GMA</strong> · Forschen. Beraten. Umsetzen.
        </div>
        <div className="footer-links">
          <span>{wiesbadenConfig.conceptStatus}</span>
          <span>{wiesbadenConfig.dataStatus}</span>
          <span>Quellen</span>
          <span>Impressum</span>
        </div>
      </footer>
    </div>
  );
}
