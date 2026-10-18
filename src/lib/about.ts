import type { MunicipalityConfig } from "../config/types";

/** Seite „Über das Konzept“ ist aktiv, wenn Inhalte gepflegt sind und das Modul nicht abgeschaltet ist. */
export const aboutEnabled = (c: MunicipalityConfig) => c.modules["ueber-das-konzept"] !== false && !!(c.about || c.glossary?.length);

/** Stabiler Anker für Glossarbegriffe, z. B. "Zentraler Versorgungsbereich (ZVB)" -> "zentraler-versorgungsbereich-zvb". */
export const glossarySlug = (term: string) =>
  term.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Glossareintrag zu einem Begriff (Anfang des Eintrags genügt, z. B. "Zentraler Versorgungsbereich"). */
export const findGlossaryEntry = (c: MunicipalityConfig, term: string) =>
  c.glossary?.find(g => g.term.toLowerCase().startsWith(term.toLowerCase()));
