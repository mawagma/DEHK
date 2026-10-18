import type { Center } from "../../config/municipalities/wiesbaden";
import { MetricCard } from "../ui/MetricCard";

type Props = {
  center: Center;
  onBack: () => void;
};

export function CenterProfile({ center, onBack }: Props) {
  return (
    <section className="center-profile">
      <button className="back-button" type="button" onClick={onBack}>← Zurück zur Übersicht</button>

      <div className="profile-heading">
        <div>
          <span className="eyebrow">{center.category}</span>
          <h1>{center.name}</h1>
          <p>{center.shortText}</p>
        </div>
        {center.status === "perspektivisch" ? <span className="status-chip">Perspektivisch</span> : null}
      </div>

      <div className="profile-metrics">
        {center.stores !== undefined ? (
          <MetricCard value={center.stores.toLocaleString("de-DE")} label="Einzelhandelsbetriebe" />
        ) : null}
        {center.salesAreaM2 !== undefined ? (
          <MetricCard value={`${center.salesAreaM2.toLocaleString("de-DE")} m²`} label="Verkaufsfläche im Zentrum" />
        ) : null}
      </div>

      {center.structure?.length ? (
        <section className="chart-card">
          <div className="section-title">
            <span>Einzelhandelsstruktur</span>
            <small>Anteil an der Verkaufsfläche</small>
          </div>
          <div className="bar-chart">
            {center.structure.map(row => (
              <div className="bar-row" key={row.label}>
                <span>{row.label}</span>
                <div className="bar-track"><i style={{ width: `${Math.min(row.value, 100)}%` }} /></div>
                <strong>{row.value} %</strong>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">
          Für dieses Zentrum sind im Prototyp noch keine Profilkennzahlen hinterlegt.
        </div>
      )}

      <section className="info-card">
        <h2>Standortinformationen</h2>
        <p>
          Diese Profilvorlage wird für alle Zentren wiederverwendet. Texte und Kennzahlen werden aus der
          kommunalen Konfiguration beziehungsweise später aus freigegebenen Datenquellen geladen.
        </p>
      </section>
    </section>
  );
}
