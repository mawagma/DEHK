import type { CenterConfig, MunicipalityConfig } from "../../config/types";
import { BarChart } from "../charts/Charts";

type Props = { config: MunicipalityConfig; centers: CenterConfig[]; onRemove: (id: string) => void; onClear: () => void };

const fmt = (n?: number, unit = "") => (n === undefined ? "–" : `${n.toLocaleString("de-DE")}${unit}`);

/** Zentrenvergleich nebeneinander (nur zentrale Versorgungsbereiche). */
export function CenterCompare({ config, centers, onRemove, onClear }: Props) {
  if (centers.length < 2) return null;
  const label = (id: string) => config.centerCategories.find(c => c.id === id)?.label ?? id;
  const rows: { label: string; value: (c: CenterConfig) => string }[] = [
    { label: "Kategorie", value: c => label(c.categoryId) },
    { label: "Betriebe", value: c => fmt(c.stores) },
    { label: "Verkaufsfläche", value: c => fmt(c.salesAreaM2, " m²") },
    { label: "Anteil an allen Betrieben", value: c => fmt(c.shareOfCityStoresPct, " %") },
    { label: "Leerstand (Ladenlokale)", value: c => fmt(c.vacancies) },
    { label: "Entwicklungsziel", value: c => c.goal?.label ?? "–" }
  ];

  return (
    <section className="compare" aria-labelledby="compare-title">
      <div className="section-row">
        <h2 id="compare-title">Zentrenvergleich</h2>
        <button type="button" className="text-button" onClick={onClear}>Vergleich leeren</button>
      </div>
      <div className="compare-grid" style={{ gridTemplateColumns: `repeat(${centers.length}, minmax(240px, 1fr))` }}>
        {centers.map(c => (
          <article key={c.id} className="compare-card">
            <header>
              <h3>{c.name}</h3>
              <button type="button" className="icon-button" aria-label={`${c.name} aus dem Vergleich entfernen`} onClick={() => onRemove(c.id)}>×</button>
            </header>
            <dl>
              {rows.map(r => <div key={r.label}><dt>{r.label}</dt><dd>{r.value(c)}</dd></div>)}
            </dl>
            {c.structure?.length ? <BarChart rows={c.structure} /> : <p className="muted small">Keine Bedarfsstufen hinterlegt.</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
