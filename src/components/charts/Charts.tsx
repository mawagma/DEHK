import type { ShareRow } from "../../config/types";

const fmt = (n: number) => n.toLocaleString("de-DE");

/** Horizontale Balken mit Prozentwerten. */
export function BarChart({ rows, unit = "%" }: { rows: ShareRow[]; unit?: string }) {
  const max = unit === "%" ? 100 : Math.max(1, ...rows.map(r => r.value));
  return (
    <div className="bar-chart">
      {rows.map(row => (
        <div className="bar-row" key={row.label}>
          <span>{row.label}</span>
          <div className="bar-track" aria-hidden="true">
            <i style={{ width: `${Math.min(100, (row.value / max) * 100)}%`, background: row.color }} />
          </div>
          <strong>{fmt(row.value)}{unit ? ` ${unit}` : ""}</strong>
        </div>
      ))}
    </div>
  );
}

/** Ringdiagramm mit Legende; Werte werden in Anteile umgerechnet. */
export function DonutChart({ rows, label }: { rows: ShareRow[]; label: string }) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  let acc = 0;
  const stops = rows.map(r => {
    const from = (acc / total) * 100;
    acc += r.value;
    return `${r.color} ${from}% ${(acc / total) * 100}%`;
  });
  return (
    <div className="donut">
      <div className="donut-ring" role="img" aria-label={label} style={{ background: `conic-gradient(${stops.join(",")})` }} />
      <ul className="donut-legend">
        {rows.map(r => (
          <li key={r.label}>
            <i style={{ background: r.color }} aria-hidden="true" />
            <span>{r.label}</span>
            <strong>{Math.round((r.value / total) * 100)} %</strong>
          </li>
        ))}
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
