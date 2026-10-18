import { useMemo, useState } from "react";
import type { MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import { BarChart, DonutChart } from "../components/charts/Charts";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap, type MapFeature } from "../components/maps/SchematicMap";
import { Icon } from "../components/ui/Icon";
import { AddressCheck, type AddressOption } from "../components/supply/AddressCheck";
import { SupplyInsights } from "../components/supply/SupplyInsights";
import { DemoNotice, PageIntro } from "../components/ui/Notes";
import { toggle } from "../lib/retailFilter";
import { DEFAULT_MIN_POPULATION, hexAt, populationByClass, populationLabel, wellSuppliedShare } from "../lib/supply";

const ADDRESS_ID = "adresse";

export function SupplyPage({ config }: { config: MunicipalityConfig }) {
  const demo = getDemoData(config);
  const { classes, marketTypes, wellSuppliedClassIds } = config.supply;
  const minPop = config.supply.minPopulation ?? DEFAULT_MIN_POPULATION;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Leere Liste = alle Markttypen sichtbar.
  const [types, setTypes] = useState<string[]>([]);
  const [address, setAddress] = useState<AddressOption | null>(null);

  const markets = useMemo(() => (demo?.markets ?? []).filter(m => !types.length || types.includes(m.typeId)), [demo, types]);

  const features = useMemo<MapFeature[]>(() => {
    if (!demo) return [];
    const classColor = new Map(classes.map(c => [c.id, c.color]));
    const typeColor = new Map(marketTypes.map(t => [t.id, t.color]));
    return [
      ...demo.hexes.map(h => ({ id: h.id, label: `Versorgungsgrad: ${classes.find(c => c.id === h.classId)?.label}`, points: h.points, fill: classColor.get(h.classId) ?? "#ccc" })),
      ...markets.map(m => ({ id: m.id, label: `${m.name} (${marketTypes.find(t => t.id === m.typeId)?.label})`, at: m.at, fill: typeColor.get(m.typeId) ?? "#333", size: 4.5, focusable: true })),
      // Adressmarker teilt die ID der Zelle, damit er über der hervorgehobenen Zelle liegt.
      ...(address ? [{ id: ADDRESS_ID, label: `Adresse: ${address.label}`, at: address.at, fill: "#f19433", shape: "diamond" as const, size: 7, clickable: false, selectId: selectedId ?? undefined }] : [])
    ];
  }, [demo, classes, marketTypes, markets, address, selectedId]);

  const shares = useMemo(
    () => (demo ? populationByClass(demo.hexes, classes).map(r => ({ label: r.label, color: r.color, value: r.pop })) : []),
    [demo, classes]
  );
  const wellShare = demo && wellSuppliedClassIds?.length ? wellSuppliedShare(demo.hexes, wellSuppliedClassIds) : null;

  function chooseAddress(a: AddressOption | null) {
    setAddress(a);
    setSelectedId(a && demo ? hexAt(demo.hexes, a.at)?.id ?? null : null);
  }
  function selectOnMap(id: string) {
    setAddress(null);
    setSelectedId(id);
  }

  const market = demo?.markets.find(m => m.id === selectedId);
  const hex = demo?.hexes.find(h => h.id === selectedId);
  const hexClass = classes.find(c => c.id === hex?.classId)?.label;

  return (
    <>
      <PageIntro image={config.pageImages?.nahversorgung} title="Nahversorgung" text={config.supply.intro} />
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
                onSelect={selectOnMap}
                focus={address ? [address.at] : null}
                className="is-supply"
              />
            ) : null}
          />
        </div>

        <aside className="workspace-side padded" aria-label="Legende und Informationen zur Nahversorgung">
          {demo ? <AddressCheck options={demo.exampleAddresses} value={address?.label ?? ""} onChange={chooseAddress} /> : null}

          <section className="side-block" aria-live="polite">
            <h2>{address ? "Ergebnis für die Adresse" : "Ausgewählter Bereich"}</h2>
            {market ? (
              <div className="selection-card">
                <span className="metric-icon"><Icon name="cart" /></span>
                <div>
                  <strong>{market.name}</strong>
                  <span>{marketTypes.find(t => t.id === market.typeId)?.label}</span>
                </div>
              </div>
            ) : hex ? (
              <dl className="store-info">
                {address ? <><dt>Adresse</dt><dd>{address.label}</dd></> : null}
                <dt>Versorgungsgrad</dt><dd>{hexClass}</dd>
                <dt>Einwohner</dt><dd>{populationLabel(hex.pop, minPop)}</dd>
                <dt>Nächster Markt</dt><dd>in ca. {hex.nearestMarketM.toLocaleString("de-DE")} m</dd>
                <dt>Im Fußweg</dt><dd>{hex.marketsInWalk === 1 ? "1 Markt" : `${hex.marketsInWalk} Märkte`}</dd>
              </dl>
            ) : address ? (
              <p className="muted">Für diese Adresse liegt keine Rasterzelle vor (außerhalb des Stadtgebiets).</p>
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
            <h2>Lebensmittelmärkte <small>– anklicken zum Filtern</small></h2>
            <ul className="legend-list">
              {marketTypes.map(t => {
                const on = types.includes(t.id);
                const n = demo?.markets.filter(m => m.typeId === t.id).length ?? 0;
                return (
                  <li key={t.id}>
                    <button type="button" className={`legend-button has-symbol${on ? " is-selected" : ""}`} aria-pressed={on} onClick={() => setTypes(toggle(types, t.id))}>
                      <LegendSymbol shape="circle" fill={t.color} /><span>{t.label}</span><strong>{n}</strong>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {demo ? (
            <section className="side-block">
              <h2>Stadtweit</h2>
              {wellShare !== null ? <p className="kpi-sentence"><strong>{wellShare} %</strong> der Einwohner sind hoch oder sehr hoch versorgt.</p> : null}
              <p className="muted small">Anteil der Einwohner nach Versorgungsgrad (Beispielwerte)</p>
              <DonutChart rows={shares} label="Anteil der Einwohner nach Versorgungsgrad" />
            </section>
          ) : null}
        </aside>
      </div>

      {demo?.districtSupply.length ? (
        <section className="card" aria-labelledby="district-supply">
          <h2 id="district-supply" className="card-heading">Gut versorgte Einwohner nach Stadtbezirk <small>(Demo-Werte)</small></h2>
          <BarChart rows={[...demo.districtSupply].sort((a, b) => b.wellSuppliedPct - a.wellSuppliedPct).map(d => ({ label: d.district, value: d.wellSuppliedPct }))} />
          <p className="muted small">Anteil der Einwohner mit hohem oder sehr hohem Versorgungsgrad, von GMA vorbereitet.</p>
        </section>
      ) : null}

      <SupplyInsights config={config} />
      {config.isDemo ? <DemoNotice /> : null}
    </section>
    </>
  );
}
