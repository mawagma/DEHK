import { useMemo, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { IconName, MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import { centerFeatures } from "../components/centers/centerFeatures";
import { navItems } from "../components/layout/navigation";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap } from "../components/maps/SchematicMap";
import { ImageCredit } from "../components/ui/ImageCredit";
import { MetricCard } from "../components/ui/MetricCard";
import { cssImage } from "../components/ui/Notes";
import { TopicCard } from "../components/ui/TopicCard";

const metricIcons: IconName[] = ["building", "pin", "chart"];

export function OverviewPage({ config }: { config: MunicipalityConfig }) {
  const navigate = useNavigate();
  const demo = getDemoData(config);
  const features = useMemo(() => (demo ? centerFeatures(config, demo, false) : []), [config, demo]);
  const openCenter = (id: string) => navigate(`/zentren?zentrum=${encodeURIComponent(id)}`);
  // Zentren haben keine eigene Kachel: die Karte ist ihr Einstieg.
  const topics = navItems(config).filter(i => i.module && i.module !== "zentren");
  const hero = config.heroImage;
  const heroStyle = hero ? ({ "--hero-image": cssImage(hero.src), "--hero-focus": hero.focusX ?? "50%" } as CSSProperties) : undefined;
  const counts = config.centerCategories.map(c => ({ ...c, n: config.centers.filter(x => x.categoryId === c.id).length }));

  return (
    <>
      <section className={hero ? "hero has-image" : "hero"} style={heroStyle}>
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <span className="eyebrow">{config.municipality} · {config.conceptStatus}</span>
            <h1>{config.overview.headline}</h1>
            <p>{config.overview.intro}</p>
            <div className="hero-actions">
              <Link className="primary-button on-dark" to="/zentren">Zentren entdecken <span aria-hidden="true">→</span></Link>
              <Link className="link-cta" to="/einzelhandel-steuern">So wird gesteuert</Link>
            </div>
          </div>
          <div className="metric-grid reveal" style={{ "--i": 1 } as CSSProperties} aria-label={`${config.municipality} im Überblick`}>
            {config.overview.metrics.map((m, i) => <MetricCard key={m.label} icon={metricIcons[i % metricIcons.length]} {...m} />)}
          </div>
        </div>
        {hero ? <ImageCredit image={hero} className="image-credit" /> : null}
      </section>

      <div className="overview-body">
        <section className="map-showcase reveal" style={{ "--i": 2 } as CSSProperties} aria-labelledby="map-title">
          <div className="map-showcase-map">
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
                />
              ) : null}
            />
          </div>
          <div className="map-showcase-side">
            <span className="eyebrow">Zentrenstruktur</span>
            <h2 id="map-title">Wo der Einzelhandel seine Zentren hat</h2>
            <p>Zentrale Versorgungsbereiche und Sonderstandorte im Stadtgebiet. Ein Zentrum in der Karte anklicken, um das Profil zu öffnen.</p>
            <ul className="category-list">
              {counts.map(c => (
                <li key={c.id}>
                  <LegendSymbol shape={c.symbol} fill={c.color} />
                  <span>{c.groupLabel}</span>
                  <b>{c.n}</b>
                </li>
              ))}
            </ul>
            <Link className="primary-button" to="/zentren">Alle Zentren ansehen <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section aria-labelledby="topics-title">
          <div className="section-head">
            <span className="eyebrow">Themen</span>
            <h2 id="topics-title" className="section-title">Das Konzept entdecken</h2>
          </div>
          <div className="topic-grid">
            {topics.map((t, i) => (
              <div key={t.to} className="reveal" style={{ "--i": i + 3 } as CSSProperties}>
                <TopicCard icon={t.icon!} title={t.label} text={t.teaser!} to={t.to} image={t.module ? config.pageImages?.[t.module]?.cardSrc : undefined} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
