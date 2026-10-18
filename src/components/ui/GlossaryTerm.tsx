import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { MunicipalityConfig } from "../../config/types";
import { aboutEnabled, findGlossaryEntry, glossarySlug } from "../../lib/about";

/** Dezenter Link auf einen Glossarbegriff. Ohne Glossareintrag bleibt nur der Text stehen. */
export function GlossaryTerm({ config, term, children }: { config: MunicipalityConfig; term: string; children?: ReactNode }) {
  const entry = findGlossaryEntry(config, term);
  if (!entry || !aboutEnabled(config)) return <>{children ?? term}</>;
  return (
    <Link className="glossary-term" to={`/ueber-das-konzept?begriff=${glossarySlug(entry.term)}`} title={entry.definition.replace(/^\[Platzhalter\]\s*/, "")}>
      {children ?? term}
    </Link>
  );
}
