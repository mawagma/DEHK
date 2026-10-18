import { useId, useState } from "react";
import type { AssortmentGroup, SteeringExample, SteeringStep } from "../../config/types";

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
export function ExampleSwitcher({ examples }: { examples: SteeringExample[] }) {
  const [activeId, setActiveId] = useState(examples[0]?.id);
  const active = examples.find(e => e.id === activeId) ?? examples[0];
  const id = useId();
  if (!active) return null;
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
        <p className="muted small">Die Beispiele erklären die Systematik des Konzepts. Sie sind keine Prüfung eines realen Einzelfalls.</p>
      </div>
    </div>
  );
}

/** Sortimentsliste mit Suche über alle Gruppen. */
export function AssortmentSearch({ groups }: { groups: AssortmentGroup[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = groups.map(g => ({ ...g, items: g.items.filter(i => i.toLowerCase().includes(q)) }));
  const hits = filtered.reduce((n, g) => n + g.items.length, 0);
  return (
    <div className="assortment-search">
      <label className="search-field">
        <span>Sortiment suchen</span>
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="z. B. Schuhe" />
      </label>
      <p className="muted small" aria-live="polite">{q ? `${hits} Treffer` : `${hits} Sortimente in ${groups.length} Gruppen`}</p>
      <div className="assortment-groups">
        {filtered.map(g => (
          <section key={g.id} className="card">
            <h3>{g.label}</h3>
            <p className="muted small">{g.description}</p>
            {g.items.length ? (
              <ul>{g.items.map(i => <li key={i}>{i}</li>)}</ul>
            ) : (
              <p className="muted small">Kein Treffer in dieser Gruppe.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
