import { Link } from "react-router-dom";
import type { CenterCategoryConfig, CenterConfig, MunicipalityConfig } from "../../config/types";
import { BarChart, ColumnChart } from "../charts/Charts";
import { GlossaryTerm } from "../ui/GlossaryTerm";
import { Hint } from "../ui/Notes";
import { MetricCard } from "../ui/MetricCard";

type Props = {
  config: MunicipalityConfig;
  center: CenterConfig;
  category?: CenterCategoryConfig;
  onBack: () => void;
  onCompare?: () => void;
  compared?: boolean;
};

const fmt = (n: number) => n.toLocaleString("de-DE");

export function CenterProfile({ config, center, category, onBack, onCompare, compared }: Props) {
  const isSpecial = category ? !category.isCentralSupplyArea : false;
  const metrics = [
    center.stores !== undefined && { icon: "building" as const, value: fmt(center.stores), label: "Einzelhandelsbetriebe" },
    center.salesAreaM2 !== undefined && { icon: "chart" as const, value: `${fmt(center.salesAreaM2)} m²`, label: "Verkaufsfläche" },
    !isSpecial && center.shareOfCityStoresPct !== undefined && { icon: "pin" as const, value: `${fmt(center.shareOfCityStoresPct)} %`, label: "Anteil an allen Betrieben der Stadt" },
    !isSpecial && center.vacancies !== undefined && { icon: "info" as const, value: fmt(center.vacancies), label: "Leerstehende Ladenlokale" }
  ].filter(Boolean) as { icon: "building" | "chart" | "pin" | "info"; value: string; label: string }[];

  return (
    <section className="center-profile" aria-labelledby="profile-title">
      <div className="profile-actions">
        <button className="back-button" type="button" onClick={onBack}>← Zurück zur Übersicht</button>
        {onCompare && !isSpecial ? (
          <button className="text-button" type="button" aria-pressed={compared} onClick={onCompare}>
            {compared ? "✓ Im Vergleich" : "+ Zum Vergleich"}
          </button>
        ) : null}
      </div>

      <div className="profile-heading">
        <div>
          <h2 id="profile-title">{category?.label} {center.name}</h2>
          <p>{center.shortText}</p>
        </div>
        <div className="chips">
          {category ? <span className="chip">{category.label}</span> : null}
          {center.status === "perspektivisch" ? <span className="chip is-warning">Perspektivisch</span> : null}
          {isSpecial ? (
            <span className="chip is-muted">Kein <GlossaryTerm config={config} term="Zentraler Versorgungsbereich">zentraler Versorgungsbereich</GlossaryTerm></span>
          ) : (
            <span className="chip"><GlossaryTerm config={config} term="Zentraler Versorgungsbereich">Zentraler Versorgungsbereich</GlossaryTerm></span>
          )}
        </div>
      </div>

      {center.image ? <img className="profile-image" src={center.image.src} alt="" loading="lazy" /> : null}

      {center.prospectNote ? <Hint title="Perspektivisches Zentrum – Voraussetzungen">{center.prospectNote}</Hint> : null}

      {!isSpecial && (center.location || center.supplyFunction) ? (
        <dl className="profile-facts">
          {center.location ? <div><dt>Lage und Erreichbarkeit</dt><dd>{center.location}</dd></div> : null}
          {center.supplyFunction ? <div><dt>Versorgungsfunktion</dt><dd>{center.supplyFunction}</dd></div> : null}
        </dl>
      ) : null}

      {metrics.length ? (
        <div className="profile-metrics">{metrics.map(m => <MetricCard key={m.label} {...m} />)}</div>
      ) : null}

      {center.structure?.length ? (
        <section className="card">
          <div className="card-title">
            <h3>Einzelhandelsstruktur nach <GlossaryTerm config={config} term="Bedarfsstufen">Bedarfsstufen</GlossaryTerm></h3>
            <small>{center.structureCaption}</small>
          </div>
          <BarChart rows={center.structure} />
        </section>
      ) : !metrics.length ? (
        <div className="empty-state">Für dieses Zentrum sind noch keine freigegebenen Profilkennzahlen hinterlegt.</div>
      ) : null}

      {center.anchors?.length ? (
        <section className="profile-section">
          <h3>{isSpecial ? "Prägende Betriebe" : "Magnetbetriebe"}</h3>
          <ul className="tag-list">{center.anchors.map(a => <li key={a} className="chip">{a}</li>)}</ul>
        </section>
      ) : null}

      {!isSpecial && (center.strengths?.length || center.weaknesses?.length) ? (
        <div className="swot">
          {center.strengths?.length ? (
            <section><h3>Stärken</h3><ul>{center.strengths.map(s => <li key={s}>{s}</li>)}</ul></section>
          ) : null}
          {center.weaknesses?.length ? (
            <section><h3>Schwächen</h3><ul>{center.weaknesses.map(s => <li key={s}>{s}</li>)}</ul></section>
          ) : null}
        </div>
      ) : null}

      {center.goal ? (
        <section className="goal">
          <h3>{isSpecial ? "Steuerungsziel" : "Entwicklungsziel"}</h3>
          <p><span className="goal-badge">{center.goal.label}</span> {center.goal.text}</p>
        </section>
      ) : null}

      {!isSpecial && center.recommendations?.length ? (
        <section className="profile-section">
          <h3>Empfehlungen</h3>
          <ul className="check-list">{center.recommendations.map(r => <li key={r}>{r}</li>)}</ul>
        </section>
      ) : null}

      {center.development?.length ? (
        <section className="card">
          <div className="card-title"><h3>Entwicklung der Betriebe</h3><small>je Erhebungsjahr, gleiche Abgrenzung</small></div>
          <ColumnChart rows={center.development} label={`Betriebe in ${center.name} je Erhebungsjahr`} />
        </section>
      ) : null}

      {config.modules.einzelhandelsstruktur && center.status !== "perspektivisch" ? (
        <Link className="primary-button profile-cta" to={`/einzelhandelsstruktur?zentrum=${encodeURIComponent(center.id)}`}>
          Betriebe in diesem Bereich ansehen <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </section>
  );
}
