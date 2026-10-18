import { Link } from "react-router-dom";
import type { MunicipalityConfig } from "../../config/types";
import { ImageCredit } from "../ui/ImageCredit";
import { navItems } from "./navigation";

export function AppFooter({ config }: { config: MunicipalityConfig }) {
  const c = config.contact;
  return (
    <footer className="app-footer">
      <div className="footer-grid">
        <div>
          <h2>{config.title}</h2>
          <p>{config.municipality}<br />{config.conceptStatus}<br />Datenstand: {config.dataStatus}</p>
        </div>
        <nav aria-label="Themen">
          <h2>Themen</h2>
          <ul>{navItems(config).map(i => <li key={i.to}><Link to={i.to}>{i.label}</Link></li>)}</ul>
        </nav>
        <div>
          <h2>Kontakt</h2>
          <ul>
            <li><a href={`mailto:${c.email}`}>{c.email}</a></li>
            {c.conceptUrl ? <li><a href={c.conceptUrl}>Konzept (PDF)</a></li> : null}
            <li><a href={c.imprintUrl} target="_blank" rel="noreferrer">Impressum</a></li>
            <li><a href={c.privacyUrl} target="_blank" rel="noreferrer">Datenschutz</a></li>
          </ul>
        </div>
      </div>
      <p className="footer-claim">
        GMA · Forschen. Beraten. Umsetzen.
        {config.heroImage ? <> · <ImageCredit image={config.heroImage} /></> : null}
      </p>
    </footer>
  );
}
