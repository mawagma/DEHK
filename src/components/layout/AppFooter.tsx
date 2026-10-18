import type { MunicipalityConfig } from "../../config/types";

export function AppFooter({ config }: { config: MunicipalityConfig }) {
  return (
    <footer className="app-footer">
      <div className="footer-brand">
        <img src="./gma-logo.jpg" alt="GMA" />
        <span>Forschen. Beraten. Umsetzen.</span>
      </div>
      <ul className="footer-links">
        <li>{config.conceptStatus}</li>
        <li>Datenstand: {config.dataStatus}</li>
        {config.contact.conceptUrl ? <li><a href={config.contact.conceptUrl}>Konzept (PDF)</a></li> : null}
        <li><a href={config.contact.imprintUrl} target="_blank" rel="noreferrer">Impressum</a></li>
        <li><a href={config.contact.privacyUrl} target="_blank" rel="noreferrer">Datenschutz</a></li>
      </ul>
    </footer>
  );
}
