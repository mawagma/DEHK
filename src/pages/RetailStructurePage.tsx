import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import {
  countBy, countByNeedLevel, crossTable, DEFAULT_MIN_COUNT, developmentSeries, filterFromParams, filterStores,
  filterToParams, isFilterActive, maskCount, maskedLabel, toCsv, toggle, type RetailFilter
} from "../lib/retailFilter";
import { DonutChart } from "../components/charts/Charts";
import { BarChart } from "../components/charts/Charts";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap, type MapFeature } from "../components/maps/SchematicMap";
import { RetailAnalysis, toChartRows } from "../components/retail/RetailAnalysis";
import { ActiveFilters, RetailFilterBar } from "../components/retail/RetailFilterBar";
import { DemoNotice, Hint, PageIntro } from "../components/ui/Notes";

const typeColors = ["#005783", "#006da8", "#2a9d8f", "#e08a2c", "#9aa8b0"];
const sizeClasses = ["unter 400 m²", "400 bis 800 m²", "über 800 m²"];
type Rect = { x: number; y: number; w: number; h: number };

export function RetailStructurePage({ config }: { config: MunicipalityConfig }) {
  const demo = getDemoData(config);
  const { assortments, locationTypes, districts } = config.retail;
  const min = config.retail.minCount ?? DEFAULT_MIN_COUNT;

  // Ein Filterzustand – in der URL, damit Zurück/Teilen funktionieren.
  const [params, setParams] = useSearchParams();
  const filter = useMemo(() => filterFromParams(params), [params]);
  const setFilter = (f: RetailFilter) => setParams(filterToParams(f), { replace: true });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Optional: nur den sichtbaren Kartenausschnitt auswerten (ändert Kennzahlen nur, wenn ausdrücklich eingeschaltet).
  const [extentOnly, setExtentOnly] = useState(false);
  const [extent, setExtent] = useState<Rect | null>(null);

  const all = demo?.stores ?? [];
  const stores = useMemo(() => filterStores(all, filter), [all, filter]);
  const evaluated = useMemo(
    () => (extentOnly && extent ? stores.filter(s => s.at[0] >= extent.x && s.at[0] <= extent.x + extent.w && s.at[1] >= extent.y && s.at[1] <= extent.y + extent.h) : stores),
    [stores, extentOnly, extent]
  );
  const active = isFilterActive(filter) || (extentOnly && !!extent);
  const ref = (rows: ReturnType<typeof countBy>) => (active ? rows : undefined);

  const features = useMemo<MapFeature[]>(
    () => stores.map(s => ({ id: s.id, label: `${s.name}: ${s.assortment}`, at: s.at, fill: typeColors[locationTypes.indexOf(s.locationType)] ?? "#9aa8b0", size: 2.6 })),
    [stores, locationTypes]
  );
  const store = stores.find(s => s.id === selectedId);
  const centerName = config.centers.find(c => c.id === filter.centerId)?.name;

  const byAssortment = countBy(evaluated, "assortment", assortments);
  const byType = countBy(evaluated, "locationType", locationTypes);
  const bySize = countBy(evaluated, "sizeClass", sizeClasses);
  const mapping = config.retail.needLevelByAssortment;
  const byNeed = mapping ? countByNeedLevel(evaluated, mapping) : undefined;
  const cross = { rows: locationTypes, cols: assortments, values: crossTable(evaluated, locationTypes, assortments, "locationType", "assortment") };
  const development = demo ? developmentSeries(demo.developmentTable, filter) : null;
  const total = evaluated.length;
  const kpi = maskCount(total, min);

  function exportCsv() {
    const masked = (n: number) => maskCount(n, min) ?? maskedLabel(min);
    const sel = [
      ["Sortiment", filter.assortments.join(" | ") || "alle"], ["Standorttyp", filter.locationType || "alle"],
      ["Raum", filter.districts.join(" | ") || "Gesamtstadt"], ["Bereich", centerName ?? "–"],
      ["Nur sichtbarer Kartenausschnitt", extentOnly ? "ja" : "nein"], ["Betriebe", masked(total)], ["Datenstand", config.dataStatus]
    ];
    const csv = toCsv([
      { title: "Auswahl", header: ["Merkmal", "Wert"], rows: sel },
      { title: "Betriebe nach Warengruppe", header: ["Warengruppe", "Anzahl", "Anteil %"], rows: byAssortment.map(r => [r.label, masked(r.count), r.pct]) },
      { title: "Betriebe nach Standorttyp", header: ["Standorttyp", "Anzahl", "Anteil %"], rows: byType.map(r => [r.label, masked(r.count), r.pct]) },
      ...(total >= min ? [
        { title: "Größenklassen", header: ["Größenklasse", "Anzahl", "Anteil %"], rows: bySize.map(r => [r.label, masked(r.count), r.pct]) },
        { title: "Kreuztabelle Standorttyp × Warengruppe", header: ["Standorttyp", ...assortments], rows: cross.rows.map((r, i) => [r, ...cross.values[i].map(masked)]) }
      ] : [])
    ]);
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `einzelhandelsstruktur-${config.id}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageIntro image={config.pageImages?.einzelhandelsstruktur} title="Einzelhandelsstruktur" text={config.retail.intro} />
      <section className="page">
      <RetailFilterBar value={filter} onChange={setFilter} assortments={assortments} locationTypes={locationTypes} districts={districts} />

      <div className="filter-tools">
        <ActiveFilters value={filter} onChange={setFilter} centerName={centerName} />
        <div className="filter-actions">
          {demo ? (
            <label className="switch">
              <input type="checkbox" checked={extentOnly} onChange={e => setExtentOnly(e.target.checked)} />
              Nur sichtbaren Kartenausschnitt auswerten
            </label>
          ) : null}
          <button type="button" className="back-button" onClick={exportCsv}>Auswertung als CSV</button>
        </div>
      </div>

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
                onViewChange={setExtent}
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
            <h2>Betriebe (Auswahl{extentOnly ? ", Kartenausschnitt" : ""})</h2>
            <p className="kpi">{kpi === null ? maskedLabel(min) : kpi.toLocaleString("de-DE")}</p>
            {active && all.length ? <p className="muted small">von {all.length.toLocaleString("de-DE")} Betrieben in der Gesamtstadt</p> : null}
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

          {total ? (
            <>
              <section className="side-block">
                <h2>Betriebe nach Warengruppe <small>– Balken anklicken zum Filtern</small></h2>
                <BarChart
                  rows={toChartRows(byAssortment, min, ref(countBy(all, "assortment", assortments)))}
                  referenceLabel="Gesamtstadt"
                  onSelect={a => setFilter({ ...filter, assortments: toggle(filter.assortments, a) })}
                  selected={filter.assortments}
                />
              </section>
              <section className="side-block">
                <h2>Betriebe nach Standorttyp</h2>
                <DonutChart
                  rows={toChartRows(byType, min, undefined, l => typeColors[locationTypes.indexOf(l)]).map(r => ({ ...r, value: r.display ? 0 : r.count ?? 0 }))}
                  label="Betriebe nach Standorttyp"
                  onSelect={t => setFilter({ ...filter, locationType: filter.locationType === t ? "" : t })}
                  selected={filter.locationType ? [filter.locationType] : []}
                />
              </section>
            </>
          ) : (
            <div className="empty-state">Für diese Auswahl gibt es keine Betriebe.</div>
          )}
        </aside>
      </div>

      {total ? (
        <RetailAnalysis
          total={total}
          min={min}
          sizeRows={toChartRows(bySize, min, ref(countBy(all, "sizeClass", sizeClasses)))}
          needRows={byNeed && mapping ? toChartRows(byNeed, min, ref(countByNeedLevel(all, mapping))) : undefined}
          development={development}
          cross={cross}
          referenceLabel="Gesamtstadt"
        />
      ) : null}

      {config.retail.keyMessages?.length ? (
        <section className="card insight" aria-labelledby="retail-key">
          <h2 id="retail-key">Kernaussagen</h2>
          <ul className="accent-list">{config.retail.keyMessages.map(k => <li key={k}>{k}</li>)}</ul>
        </section>
      ) : null}

      <Hint title="Hinweis">
        {config.retail.note} Angezeigt werden nur Größenklassen, keine exakten Verkaufsflächen einzelner Betriebe. Werte unter {min} Betrieben werden nicht ausgewiesen.
        {config.retail.storeDefinition ? <><br />{config.retail.storeDefinition}</> : null}
      </Hint>
      {config.isDemo ? <DemoNotice /> : null}
    </section>
    </>
  );
}
