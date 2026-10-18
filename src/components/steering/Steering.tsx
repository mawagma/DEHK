import { useId, useState } from "react";
import { Link } from "react-router-dom";
import type { AssortmentGroup, MunicipalityConfig, SteeringExample, SteeringGuideline, SteeringMatrix, SteeringStep } from "../../config/types";
import { itemRetailGroup, searchAssortments } from "../../lib/assortments";

/** Leitstruktur WO? → WAS? → WIE GROSS? → GRUNDSÄTZE. */
export function SteeringFlow({ steps }: { steps: SteeringStep[] }) {
  return (
    <ol className="steering-flow">
      {steps.map((s, i) => (
        <li key={s.question}>
          <span className="step-number" aria-hidden="true">{i + 1}</span>
          <strong>{s.question}</strong>
          <span className="step-title">{s.title}</span>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Vorbereitete Beispielsituationen – bewusst ohne Ampel/Zulässigkeitsaussage. */
export function ExampleSwitcher({ examples, centerName }: { examples: SteeringExample[]; centerName?: (id: string) => string | undefined }) {
  const [activeId, setActiveId] = useState(examples[0]?.id);
  const active = examples.find(e => e.id === activeId) ?? examples[0];
  const id = useId();
  if (!active) return null;
  const linkedName = active.centerId ? centerName?.(active.centerId) : undefined;
  return (
    <div className="examples">
      <div className="segmented" role="tablist" aria-label="Beispiele">
        {examples.map(e => (
          <button key={e.id} type="button" role="tab" id={`${id}-${e.id}`} aria-selected={e.id === active.id} aria-controls={`${id}-panel`}
            onClick={() => setActiveId(e.id)}>
            {e.title}
          </button>
        ))}
      </div>
      <div className="example-panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${active.id}`}>
        <dl className="example-facts">
          <div><dt>Wo?</dt><dd>{active.where}</dd></div>
          <div><dt>Was?</dt><dd>{active.what}</dd></div>
          <div><dt>Wie groß?</dt><dd>{active.size}</dd></div>
        </dl>
        <h3>Einordnung nach den Grundsätzen</h3>
        <p>{active.assessment}</p>
        {linkedName ? (
          <Link className="text-link" to={`/zentren?zentrum=${encodeURIComponent(active.centerId!)}&ansicht=profil`}>
            Beispielstandort: {linkedName} im Zentrenprofil ansehen <span aria-hidden="true">→</span>
          </Link>
        ) : null}
        <p className="muted small">Die Beispiele erklären die Systematik des Konzepts. Sie sind keine Prüfung eines realen Einzelfalls.</p>
      </div>
    </div>
  );
}

/** Sortimentsliste mit Suche über Namen und Synonyme. */
export function AssortmentSearch({ groups, retailLinks }: { groups: AssortmentGroup[]; retailLinks: boolean }) {
  const [query, setQuery] = useState("");
  const result = searchAssortments(groups, query);
  const hits = result.reduce((n, g) => n + g.hits.length, 0);
  const searching = query.trim().length > 0;
  return (
    <div className="assortment-search">
      <label className="search-field">
        <span>Sortiment suchen</span>
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="z. B. Schuhe, E-Bike, Tierfutter" />
      </label>
      <p className="muted small" aria-live="polite">{searching ? `${hits} Treffer` : `${hits} Sortimente in ${groups.length} Gruppen`}</p>
      <div className="assortment-groups">
        {result.map(({ group, hits }) => (
          <section key={group.id} className="card">
            <h3>{group.label}</h3>
            <p className="muted small">{group.description}</p>
            {hits.length ? (
              <ul>
                {hits.map(h => {
                  const target = retailLinks ? itemRetailGroup(h.item) : undefined;
                  return (
                    <li key={h.name}>
                      <span>{h.name}</span>
                      {h.viaSynonym ? <small className="via"> – gefunden über „{h.viaSynonym}“</small> : null}
                      {searching && target ? (
                        <Link className="where-link" to={`/einzelhandelsstruktur?sortiment=${encodeURIComponent(target)}`}>
                          Wo gibt es das heute? <span aria-hidden="true">→</span>
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted small">Kein Treffer in dieser Gruppe.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export function GuidelineList({ guidelines }: { guidelines: SteeringGuideline[] }) {
  return (
    <ol className="guidelines">
      {guidelines.map((g, i) => (
        <li key={g.id}>
          <span className="guideline-no" aria-hidden="true">{i + 1}</span>
          <div>
            <h3>{g.title}</h3>
            <p>{g.text}</p>
            <span className="chip">Gilt für: {g.appliesTo}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Matrix Standort × Sortiment mit neutralen Textlabels (bewusst ohne Farben, die Zulässigkeit suggerieren). */
export function MatrixTable({ matrix }: { matrix: SteeringMatrix }) {
  const labels = [...new Set(matrix.cells.flat())];
  return (
    <div className="matrix">
      <div className="table-wrap">
        <table className="data-table matrix-table">
          <caption className="sr-only">Standortkategorien und Sortimentsgruppen nach dem Einzelhandelskonzept</caption>
          <thead>
            <tr><th scope="col">Standort</th>{matrix.cols.map(c => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {matrix.rows.map((r, i) => (
              <tr key={r}><th scope="row">{r}</th>{matrix.cols.map((c, j) => <td key={c}>{matrix.cells[i]?.[j] ?? "–"}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">Legende: {labels.map(l => `„${l}“`).join(", ")} – fachliche Kurzbezeichnungen der Grundsätze, keine Zulässigkeitsaussage und keine Einzelfallprüfung.</p>
    </div>
  );
}

export function ProcedureSteps({ steps, config }: { steps: { title: string; text: string }[]; config: MunicipalityConfig }) {
  const person = config.contact.person;
  return (
    <div className="procedure">
      <ol className="process-list">
        {steps.map(s => <li key={s.title}><div><b>{s.title}</b><br /><span className="muted">{s.text}</span></div></li>)}
      </ol>
      <aside className="card person-card" aria-label="Ansprechpartner">
        <h3>Ansprechpartner</h3>
        {person ? (
          <address className="person">
            <strong>{person.name}</strong>
            <span>{person.role}</span>
            {person.email ? <a href={`mailto:${person.email}`}>{person.email}</a> : null}
            {person.phone ? <span>{person.phone}</span> : null}
          </address>
        ) : (
          <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
        )}
      </aside>
    </div>
  );
}
