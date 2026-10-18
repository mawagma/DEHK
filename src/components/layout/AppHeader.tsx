import { NavLink } from "react-router-dom";

type Props = {
  config: {
    title: string;
    municipality: string;
  };
};

export function AppHeader({ config }: Props) {
  return (
    <header className="app-header">
      <div className="brand">
        <img src="./gma-logo.jpg" alt="GMA" />
        <div className="brand-copy">
          <strong>{config.title}</strong>
          <span>{config.municipality}</span>
        </div>
      </div>

      <nav className="main-nav" aria-label="Hauptnavigation">
        <NavLink to="/" end>Überblick</NavLink>
        <NavLink to="/zentren">Zentren &amp; Standorte</NavLink>
        <span className="nav-disabled">Nahversorgung</span>
        <span className="nav-disabled">Einzelhandelsstruktur</span>
        <span className="nav-disabled">Einzelhandel steuern</span>
      </nav>

      <button className="secondary-button" type="button">Interner Bereich</button>
    </header>
  );
}
