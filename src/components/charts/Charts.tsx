import type { ShareRow } from "../../config/types";

const fmt = (n: number) => n.toLocaleString("de-DE");

/** Diagrammzeile: value = Prozent (bzw. Wert in `unit`), optional Anzahl, Referenzwert und eigener Anzeigetext. */
export type ChartRow = ShareRow & { count?: number; reference?: number; display?: string };

const valueText = (r: ChartRow, unit: string) =>
  r.display ?? (r.count !== undefined ? `${fmt(r.count)} · ${fmt(r.value)} %` : `${fmt(r.value)}${unit ? ` ${unit}` : ""}`);

type BarProps = {
  rows: ChartRow[];
  unit?: string;
  /** Macht Balken zu Knöpfen (z. B. Filter setzen). */
  onSelect?: (label: string) => void;
  selected?: string[];
  /** Beschriftung der grauen Referenzreihe, z. B. "Gesamtstadt". Nur sichtbar, wenn Zeilen `reference` haben. */
  referenceLabel?: string;
};

/** Horizontale Balken; optional mit grauer Referenzreihe und klickbaren Zeilen. */
export function BarChart({ rows, unit = "%", onSelect, selected = [], referenceLabel }: BarProps) {
  const max = unit === "%" ? 100 : Math.max(1, ...rows.map(r => r.value));
  const hasRef = rows.some(r => r.reference !== undefined);
  return (
    <div className="bar-chart">
      {hasRef && referenceLabel ? (
        <p className="chart-key"><i className="key-main" aria-hidden="true" /> Auswahl <i className="key-ref" aria-hidden="true" /> {referenceLabel}</p>
      ) : null}
      {rows.map(row => {
        const body = (
          <>
            <span>{row.label}</span>
            <div className="bar-track" aria-hidden="true">
              <i style={{ width: `${Math.min(100, (row.value / max) * 100)}%`, background: row.color }} />
              {row.reference !== undefined ? <b className="bar-ref" style={{ width: `${Math.min(100, (row.reference / max) * 100)}%` }} /> : null}
            </div>
            <strong>
              {valueText(row, unit)}
              {row.reference !== undefined ? <span className="sr-only"> (Referenz {referenceLabel}: {fmt(row.reference)} %)</span> : null}
            </strong>
          </>
        );
        return onSelect ? (
          <button key={row.label} type="button" className={`bar-row is-button${selected.includes(row.label) ? " is-selected" : ""}`}
            aria-pressed={selected.includes(row.label)} onClick={() => onSelect(row.label)} title={`Nach „${row.label}“ filtern`}>
            {body}
          </button>
        ) : (
          <div className="bar-row" key={row.label}>{body}</div>
        );
      })}
    </div>
  );
}

/** Ringdiagramm mit Legende; Werte werden in Anteile umgerechnet. Legende optional klickbar. */
export function DonutChart({ rows, label, onSelect, selected = [] }: { rows: ChartRow[]; label: string; onSelect?: (label: string) => void; selected?: string[] }) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  let acc = 0;
  const stops = rows.map(r => {
    const from = (acc / total) * 100;
    acc += r.value;
    return `${r.color} ${from}% ${(acc / total) * 100}%`;
  });
  const text = (r: ChartRow) => r.display ?? (r.count !== undefined ? `${fmt(r.count)} · ${Math.round((r.value / total) * 100)} %` : `${Math.round((r.value / total) * 100)} %`);
  return (
    <div className="donut">
      <div className="donut-ring" role="img" aria-label={`${label}: ${rows.map(r => `${r.label} ${text(r)}`).join(", ")}`} style={{ background: `conic-gradient(${stops.join(",")})` }} />
      <ul className="donut-legend">
        {rows.map(r => {
          const inner = (<><i style={{ background: r.color }} aria-hidden="true" /><span>{r.label}</span><strong>{text(r)}</strong></>);
          return (
            <li key={r.label}>
              {onSelect ? (
                <button type="button" className={`legend-button${selected.includes(r.label) ? " is-selected" : ""}`} aria-pressed={selected.includes(r.label)} onClick={() => onSelect(r.label)}>
                  {inner}
                </button>
              ) : inner}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Säulen für Zeitreihen (z. B. Entwicklung des Betriebsbestands). */
export function ColumnChart({ rows, label }: { rows: ShareRow[]; label: string }) {
  const max = Math.max(1, ...rows.map(r => r.value));
  return (
    <div className="column-chart" role="img" aria-label={`${label}: ${rows.map(r => `${r.label} ${fmt(r.value)}`).join(", ")}`}>
      {rows.map(r => (
        <div className="column" key={r.label}>
          <strong>{fmt(r.value)}</strong>
          <i style={{ height: `${(r.value / max) * 100}%` }} />
          <span>{r.label}</span>
        </div>
      ))}
    </div>
  );
}
