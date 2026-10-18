import { useMemo, useState } from "react";
import type { MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import { DonutChart } from "../components/charts/Charts";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap, type MapFeature } from "../components/maps/SchematicMap";
import { Icon } from "../components/ui/Icon";
import { DemoNotice, Hint, PageIntro } from "../components/ui/Notes";

export function SupplyPage({ config }: { config: MunicipalityConfig }) {
  const demo = getDemoData(config);
  const { classes, marketTypes } = config.supply;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const features = useMemo<MapFeature[]>(() => {
    if (!demo) return [];
    const classColor = new Map(classes.map(c => [c.id, c.color]));
    const typeColor = new Map(marketTypes.map(t => [t.id, t.color]));
    return [
      ...demo.hexes.map(h => ({ id: h.id, label: `Versorgungsgrad: ${classes.find(c => c.id === h.classId)?.label}`, points: h.points, fill: classColor.get(h.classId) ?? "#ccc" })),
      ...demo.markets.map(m => ({ id: m.id, label: `${m.name} (${marketTypes.find(t => t.id === m.typeId)?.label})`, at: m.at, fill: typeColor.get(m.typeId) ?? "#333", size: 4.5, focusable: true }))
    ];
  }, [demo, classes, marketTypes]);

  const shares = useMemo(
    () => classes.map(c => ({ label: c.label, color: c.color, value: demo?.hexes.filter(h => h.classId === c.id).length ?? 0 })),
    [demo, classes]
  );

  const market = demo?.markets.find(m => m.id === selectedId);
  const hex = demo?.hexes.find(h => h.id === selectedId);

  return (
    <>
      <PageIntro title="Nahversorgung" text={config.supply.intro} />
      <section className="page">

      <div className="workspace">
        <div className="workspace-map">
          <MapPanel
            webMapId={config.arcgis.webMaps.supply}
            portalUrl={config.arcgis.portalUrl}
            ariaLabel="Karte zur Nahversorgung"
            fallback={demo ? (
              <SchematicMap
                ariaLabel="Beispielkarte: Versorgungsgrad als Hexagone und Lebensmittelmärkte als Punkte"
                outline={demo.outline}
                rivers={demo.rivers}
                features={features}
                selectedId={selectedId}
                onSelect={setSelectedId}
                className="is-supply"
              />
            ) : null}
          />
        </div>

        <aside className="workspace-side padded" aria-label="Legende und Informationen zur Nahversorgung">
          <section className="side-block" aria-live="polite">
            <h2>Ausgewählter Bereich</h2>
            {market ? (
              <div className="selection-card">
                <span className="metric-icon"><Icon name="cart" /></span>
                <div>
                  <strong>{market.name}</strong>
                  <span>{marketTypes.find(t => t.id === market.typeId)?.label}</span>
                </div>
              </div>
            ) : hex ? (
              <p>Versorgungsgrad in dieser Rasterzelle: <strong>{classes.find(c => c.id === hex.classId)?.label}</strong></p>
            ) : (
              <p className="muted">Klicken Sie auf ein Hexagon oder einen Lebensmittelmarkt, um Informationen anzuzeigen.</p>
            )}
          </section>

          <section className="side-block">
            <h2>Versorgungsgrad <small>(Index)</small></h2>
            <ul className="legend-list">
              {classes.map(c => <li key={c.id}><i className="swatch" style={{ background: c.color }} />{c.label}</li>)}
            </ul>
          </section>

          <section className="side-block">
            <h2>Lebensmittelmärkte</h2>
            <ul className="legend-list">
              {marketTypes.map(t => <li key={t.id}><LegendSymbol shape="circle" fill={t.color} />{t.label}</li>)}
            </ul>
          </section>

          <section className="side-block">
            <h2>Stadtweit</h2>
            <p className="muted small">Anteil der Rasterzellen nach Versorgungsgrad (Beispielwerte)</p>
            <DonutChart rows={shares} label="Anteil der Rasterzellen nach Versorgungsgrad" />
          </section>
        </aside>
      </div>

      <Hint title="Methodik">{config.supply.methodNote}</Hint>
      {config.isDemo ? <DemoNotice /> : null}
    </section>
    </>
  );
}
