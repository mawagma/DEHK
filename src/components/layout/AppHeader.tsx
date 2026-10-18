import { NavLink } from "react-router-dom";
import type { MunicipalityConfig } from "../../config/types";
import { Icon } from "../ui/Icon";
import { navItems } from "./navigation";

export function AppHeader({ config }: { config: MunicipalityConfig }) {
  return (
    <header className="app-header">
      <div className="topbar">
        <span><strong>{config.title}</strong> <span className="topbar-sep" aria-hidden="true">|</span> {config.municipality}</span>
        <a className="topbar-link" href={`mailto:${config.contact.email}`}>
          <Icon name="mail" size={16} /> Kontakt
        </a>
      </div>
      <div className="mainbar">
        <NavLink to="/" className="brand" aria-label={`GMA – ${config.title} ${config.municipality}, Startseite`}>
          <img src="./gma-logo.jpg" alt="" />
        </NavLink>
        <nav className="main-nav" aria-label="Hauptnavigation">
          {navItems(config).map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>{item.label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
