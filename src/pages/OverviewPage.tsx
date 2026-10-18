import { Link } from "react-router-dom";
import { ArcGISMap } from "../components/maps/ArcGISMap";
import { MetricCard } from "../components/ui/MetricCard";
import { TopicCard } from "../components/ui/TopicCard";
import type { wiesbadenConfig } from "../config/municipalities/wiesbaden";

type Config = typeof wiesbadenConfig;
type Props = { config: Config };

export function OverviewPage({ config }: Props) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Einzelhandel in {config.municipality}</span>
          <h1>Ein digitales Konzept, das räumliche Zusammenhänge verständlich macht.</h1>
          <p>
            Erkunden Sie Zentren und Standorte und erhalten Sie einen schnellen Einstieg in die
            zentralen Themen des Einzelhandelskonzepts.
          </p>
          <Link className="primary-button" to="/zentren">Zentren entdecken →</Link>

          <div className="metric-grid">
            {config.overviewMetrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
          </div>
        </div>

        <div className="hero-map">
          <div className="map-heading">
            <div>
              <span className="eyebrow">Räumlicher Einstieg</span>
              <h2>Zentrenstruktur</h2>
            </div>
            <Link to="/zentren">Alle Zentren →</Link>
          </div>
          <ArcGISMap
            webMapId={config.arcgis.overviewWebMapId}
            portalUrl={config.arcgis.portalUrl}
            ariaLabel="Übersichtskarte der Zentrenstruktur"
          />
        </div>
      </section>

      <section className="topic-section">
        <div className="section-heading">
          <span className="eyebrow">Themenbereiche</span>
          <h2>Ein Konzept – mehrere Perspektiven</h2>
        </div>
        <div className="topic-grid">
          <TopicCard eyebrow="01" title="Zentren & Standorte" text="Zentren im Stadtgebiet erkunden und Profile öffnen." to="/zentren" />
          <TopicCard eyebrow="02" title="Nahversorgung" text="Fußläufige Erreichbarkeit und Nahversorgungsangebote betrachten." disabled />
          <TopicCard eyebrow="03" title="Einzelhandelsstruktur" text="Betriebsbestand nach Sortiment, Standorttyp und Raum analysieren." disabled />
          <TopicCard eyebrow="04" title="Einzelhandel steuern" text="Steuerungsgrundsätze anhand verständlicher Beispiele nachvollziehen." disabled />
        </div>
      </section>
    </>
  );
}
