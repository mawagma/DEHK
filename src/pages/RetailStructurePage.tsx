import { useMemo, useState } from "react";
import type { MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import { EMPTY_FILTER, filterStores, shareBy, type RetailFilter } from "../lib/retailFilter";
import { BarChart, ColumnChart, DonutChart } from "../components/charts/Charts";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap, type MapFeature } from "../components/maps/SchematicMap";
import { RetailFilterBar } from "../components/retail/RetailFilterBar";
import { DemoNotice, Hint, PageIntro } from "../components/ui/Notes";

const typeColors = ["#005783", "#006da8", "#2a9d8f", "#e08a2c", "#9aa8b0"];

export function RetailStructurePage({ config }: { config: MunicipalityConfig }) {
  const demo = getDemoData(config);
  const { assortments, locationTypes, districts } = config.retail;
  // Ein Filterzustand für Karte, Kennzahl und Diagramme.
  const [filter, setFilter] = useState<RetailFilter>(EMPTY_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stores = useMemo(() => filterStores(demo?.stores ?? [], filter), [demo, filter]);
  const features = useMemo<MapFeature[]>(
    () => stores.map(s => ({
      id: s.id,
      label: `${s.name}: ${s.assortment}`,
      at: s.at,
      fill: typeColors[locationTypes.indexOf(s.locationType)] ?? "#9aa8b0",
      size: 2.6
    })),
    [stores, locationTypes]
  );
  const store = stores.find(s => s.id === selectedId);

  return (
    <>
      <PageIntro title="Einzelhandelsstruktur" text={config.retail.intro} />
      <section className="page">
      <RetailFilterBar value={filter} onChange={setFilter} assortments={assortments} locationTypes={locationTypes} districts={districts} />

      <div className="workspace is-balanced">
        <div className="workspace-map">
          <MapPanel
            webMapId={config.arcgis.webMaps.retailStructure}
            portalUrl={config.arcgis.portalUrl}
            ariaLabel="Karte der Einzelhandelsbetriebe"
            fallback={demo ? (
              <SchematicMap
                ariaLabel="Beispielkarte der Einzelhandelsbetriebe als Punkte, eingefärbt nach Standorttyp"
                outline={demo.outline}
                rivers={demo.rivers}
                features={features}
                selectedId={selectedId}
                onSelect={setSelectedId}
                legend={
                  <>
                    <strong>Standorttypen</strong>
                    {locationTypes.map((t, i) => (
                      <span key={t} className="legend-row"><LegendSymbol shape="circle" fill={typeColors[i] ?? "#9aa8b0"} />{t}</span>
                    ))}
                  </>
                }
              />
            ) : null}
          />
        </div>

        <aside className="workspace-side padded" aria-label="Kennzahlen zur Auswahl">
          <section className="side-block" aria-live="polite">
            <h2>Betriebe (Auswahl)</h2>
            <p className="kpi">{stores.length.toLocaleString("de-DE")}</p>
            {store ? (
              <dl className="store-info">
                <dt>Betrieb</dt><dd>{store.name}</dd>
                <dt>Sortiment</dt><dd>{store.assortment}</dd>
                <dt>Größenklasse</dt><dd>{store.sizeClass}</dd>
              </dl>
            ) : (
              <p className="muted small">Klicken Sie auf einen Betrieb in der Karte für weitere Informationen.</p>
            )}
          </section>

          {stores.length ? (
            <>
              <section className="side-block">
                <h2>Betriebe nach Sortiment</h2>
                <BarChart rows={shareBy(stores, "assortment", assortments)} />
              </section>
              <section className="side-block">
                <h2>Betriebe nach Standorttyp</h2>
                <DonutChart rows={shareBy(stores, "locationType", locationTypes, typeColors)} label="Betriebe nach Standorttyp" />
              </section>
            </>
          ) : (
            <div className="empty-state">Für diese Filterkombination gibt es keine Betriebe.</div>
          )}

          <section className="side-block">
            <h2>Entwicklung des Betriebsbestands <small>(Beispielwerte)</small></h2>
            <ColumnChart rows={demo?.development ?? []} label="Anzahl Betriebe je Erhebungsjahr, Beispielwerte" />
          </section>
        </aside>
      </div>

      <Hint title="Hinweis">{config.retail.note} Angezeigt werden nur Größenklassen, keine exakten Verkaufsflächen einzelner Betriebe.</Hint>
      {config.isDemo ? <DemoNotice /> : null}
    </section>
    </>
  );
}
