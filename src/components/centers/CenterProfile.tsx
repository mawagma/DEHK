import type { CenterCategoryConfig, CenterConfig } from "../../config/types";
import { BarChart } from "../charts/Charts";
import { Hint } from "../ui/Notes";
import { MetricCard } from "../ui/MetricCard";

type Props = {
  center: CenterConfig;
  category?: CenterCategoryConfig;
  onBack: () => void;
};

export function CenterProfile({ center, category, onBack }: Props) {
  const hasMetrics = center.stores !== undefined || center.salesAreaM2 !== undefined;
  return (
    <section className="center-profile" aria-labelledby="profile-title">
      <button className="back-button" type="button" onClick={onBack}>← Zurück zur Übersicht</button>

      <div className="profile-heading">
        <div>
          <h2 id="profile-title">{category?.label} {center.name}</h2>
          <p>{center.shortText}</p>
        </div>
        <div className="chips">
          {category ? <span className="chip" style={{ color: category.color }}>{category.label}</span> : null}
          {center.status === "perspektivisch" ? <span className="chip is-warning">Perspektivisch</span> : null}
          {category && !category.isCentralSupplyArea ? <span className="chip is-muted">Kein zentraler Versorgungsbereich</span> : null}
        </div>
      </div>

      {hasMetrics ? (
        <div className="profile-metrics">
          {center.stores !== undefined ? (
            <MetricCard icon="building" value={center.stores.toLocaleString("de-DE")} label="Einzelhandelsbetriebe" />
          ) : null}
          {center.salesAreaM2 !== undefined ? (
            <MetricCard icon="chart" value={`${center.salesAreaM2.toLocaleString("de-DE")} m²`} label="Verkaufsfläche im Zentrum" />
          ) : null}
        </div>
      ) : null}

      {center.structure?.length ? (
        <section className="card">
          <div className="card-title">
            <h3>Einzelhandelsstruktur</h3>
            <small>{center.structureCaption}</small>
          </div>
          <BarChart rows={center.structure} />
        </section>
      ) : (
        <div className="empty-state">Für dieses Zentrum sind noch keine freigegebenen Profilkennzahlen hinterlegt.</div>
      )}

      <Hint title="Datengrundlage">
        Kennzahlen beziehen sich auf den abgegrenzten Bereich. Detaillierte Betriebsanalysen finden Sie unter „Einzelhandelsstruktur“.
      </Hint>
    </section>
  );
}
