import type { ChartRow } from "../charts/Charts";
import { BarChart, ColumnChart } from "../charts/Charts";
import { maskCount, maskedLabel, type CountRow } from "../../lib/retailFilter";

/** Zählzeilen -> Diagrammzeilen, kleine Fallzahlen maskiert, optional mit Referenzanteil. */
export function toChartRows(rows: CountRow[], min: number, reference?: CountRow[], color?: (label: string) => string | undefined): ChartRow[] {
  return rows.map(r => {
    const masked = maskCount(r.count, min) === null;
    return {
      label: r.label,
      value: masked ? 0 : r.pct,
      count: r.count,
      color: color?.(r.label),
      display: masked ? maskedLabel(min) : undefined,
      reference: reference?.find(x => x.label === r.label)?.pct
    };
  });
}

type Props = {
  total: number;
  min: number;
  sizeRows: ChartRow[];
  needRows?: ChartRow[];
  development: { label: string; value: number }[] | null;
  cross: { rows: string[]; cols: string[]; values: number[][] };
  referenceLabel?: string;
};

/** Größenklassen, Bedarfsstufen, Entwicklung und Kreuztabelle zur aktuellen Auswahl. */
export function RetailAnalysis({ total, min, sizeRows, needRows, development, cross, referenceLabel }: Props) {
  const tooFew = total > 0 && total < min;
  const maxCell = Math.max(1, ...cross.values.flat());
  return (
    <>
      <div className="analysis-grid">
        <section className="card" aria-labelledby="size-title">
          <h2 id="size-title" className="card-heading">Größenklassen der Verkaufsfläche</h2>
          {tooFew ? <p className="muted">Bei weniger als {min} Betrieben werden keine Größenklassen ausgewiesen.</p> : <BarChart rows={sizeRows} referenceLabel={referenceLabel} />}
          <p className="muted small">Nur Größenklassen, keine exakten Flächen einzelner Betriebe.</p>
        </section>

        {needRows ? (
          <section className="card" aria-labelledby="need-title">
            <h2 id="need-title" className="card-heading">Betriebe nach Bedarfsstufe</h2>
            <BarChart rows={needRows} referenceLabel={referenceLabel} />
          </section>
        ) : null}

        <section className="card" aria-labelledby="dev-title">
          <h2 id="dev-title" className="card-heading">Entwicklung des Betriebsbestands <small>(Demo-Werte)</small></h2>
          {development ? (
            <ColumnChart rows={development} label="Anzahl Betriebe der Auswahl je Erhebungsjahr" />
          ) : (
            <p className="muted">Für Teilräume und einzelne Zentren liegen keine vergleichbaren Entwicklungsdaten vor.</p>
          )}
        </section>
      </div>

      <details className="cross-table card">
        <summary>Kreuztabelle Standorttyp × Warengruppe</summary>
        {tooFew ? (
          <p className="muted">Bei weniger als {min} Betrieben wird keine Kreuztabelle ausgewiesen.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table heat-table">
              <caption className="sr-only">Anzahl Betriebe nach Standorttyp und Warengruppe; Werte unter {min} werden nicht ausgewiesen</caption>
              <thead>
                <tr><th scope="col">Standorttyp</th>{cross.cols.map(c => <th key={c} scope="col" className="num">{c}</th>)}</tr>
              </thead>
              <tbody>
                {cross.rows.map((r, i) => (
                  <tr key={r}>
                    <th scope="row">{r}</th>
                    {cross.values[i].map((v, j) => {
                      const shown = maskCount(v, min);
                      return (
                        <td key={j} className="num" style={shown ? { background: `rgba(0, 104, 165, ${0.06 + 0.4 * (v / maxCell)})` } : undefined}>
                          {shown === null ? <span title={maskedLabel(min)}>&lt; {min}</span> : shown.toLocaleString("de-DE")}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </>
  );
}
