import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { IconName, MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import { centerFeatures } from "../components/centers/centerFeatures";
import { navItems } from "../components/layout/navigation";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap } from "../components/maps/SchematicMap";
import { MetricCard } from "../components/ui/MetricCard";
import { TopicCard } from "../components/ui/TopicCard";

const metricIcons: IconName[] = ["building", "pin", "chart"];

export function OverviewPage({ config }: { config: MunicipalityConfig }) {
  const navigate = useNavigate();
  const demo = getDemoData(config);
  const features = useMemo(() => (demo ? centerFeatures(config, demo, false) : []), [config, demo]);
  const openCenter = (id: string) => navigate(`/zentren?zentrum=${encodeURIComponent(id)}`);
  // Zentren haben keine eigene Kachel: die Karte ist ihr Einstieg.
  const topics = navItems(config).filter(i => i.module && i.module !== "zentren");

  return (
    <>
      <section className="hero">
        <div className="hero-panel">
          <span className="eyebrow">{config.municipality} · {config.conceptStatus}</span>
          <h1>{config.overview.headline}</h1>
          <p>{config.overview.intro}</p>
          <Link className="link-cta" to="/zentren">Zu den <strong>Zentren &amp; Standorten</strong></Link>
        </div>
        <div className="hero-map">
          <MapPanel
            webMapId={config.arcgis.webMaps.overview}
            portalUrl={config.arcgis.portalUrl}
            ariaLabel="Übersichtskarte der Zentrenstruktur"
            fallback={demo ? (
              <SchematicMap
                ariaLabel={`Beispielkarte der Zentren in ${config.municipality}. Ein Zentrum auswählen, um es auf der Seite Zentren & Standorte zu öffnen.`}
                outline={demo.outline}
                rivers={demo.rivers}
                features={features}
                onSelect={openCenter}
                legend={
                  <>
                    <strong>Zentren und Standorte</strong>
                    {config.centerCategories.map(c => (
                      <span key={c.id} className="legend-row"><LegendSymbol shape={c.symbol} fill={c.color} />{c.label}</span>
                    ))}
                  </>
                }
              />
            ) : null}
          />
        </div>

      </section>

      <section className="overview-body">
        <div className="metric-grid" aria-label={`${config.municipality} im Überblick`}>
          {config.overview.metrics.map((m, i) => <MetricCard key={m.label} icon={metricIcons[i % metricIcons.length]} {...m} />)}
        </div>

        <h2 className="section-title">Themen entdecken</h2>
        <div className="topic-grid">
          {topics.map(t => <TopicCard key={t.to} icon={t.icon!} title={t.label} text={t.teaser!} to={t.to} />)}
        </div>
      </section>
    </>
  );
}
