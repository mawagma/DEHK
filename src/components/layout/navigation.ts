import type { IconName, ModuleId, MunicipalityConfig } from "../../config/types";

export type NavItem = { to: string; label: string; module?: ModuleId; icon?: IconName; teaser?: string };

const all: NavItem[] = [
  { to: "/", label: "Überblick" },
  { to: "/zentren", label: "Zentren & Standorte", module: "zentren", icon: "pin", teaser: "Zentren im Stadtgebiet erkunden und Profile ansehen." },
  { to: "/nahversorgung", label: "Nahversorgung", module: "nahversorgung", icon: "cart", teaser: "Wie gut ist die fußläufige Versorgung mit Lebensmitteln?" },
  { to: "/einzelhandelsstruktur", label: "Einzelhandelsstruktur", module: "einzelhandelsstruktur", icon: "chart", teaser: "Betriebsbestand nach Sortiment, Standorttyp und Raum." },
  { to: "/einzelhandel-steuern", label: "Einzelhandel steuern", module: "einzelhandel-steuern", icon: "document", teaser: "Ziele, Grundsätze und Beispiele verständlich erklärt." }
];

export const navItems = (config: MunicipalityConfig) => all.filter(i => !i.module || config.modules[i.module]);
