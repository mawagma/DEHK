import { NavLink } from "react-router-dom";
import type { MunicipalityConfig } from "../../config/types";
import { Icon } from "../ui/Icon";
import { navItems } from "./navigation";

export function AppHeader({ config }: { config: MunicipalityConfig }) {
  return (
    <header className="app-header">
      <NavLink to="/" className="brand" aria-label={`${config.title} ${config.municipality} – Startseite`}>
        <img src="./gma-logo.jpg" alt="GMA – Forschen. Beraten. Umsetzen." />
        <span className="brand-copy">
          <strong>{config.title}</strong>
          <span>{config.municipality}</span>
        </span>
      </NavLink>

      <nav className="main-nav" aria-label="Hauptnavigation">
        {navItems(config).map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"}>{item.label}</NavLink>
        ))}
      </nav>

      <a className="primary-button header-contact" href={`mailto:${config.contact.email}`}>
        <Icon name="mail" size={18} /> <span className="label">Kontakt</span>
      </a>
    </header>
  );
}
