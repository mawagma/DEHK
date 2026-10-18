import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import { CenterList } from "../components/centers/CenterList";
import { CenterProfile } from "../components/centers/CenterProfile";
import { categoryOf, centerFeatures } from "../components/centers/centerFeatures";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap } from "../components/maps/SchematicMap";
import { DemoNotice, PageIntro } from "../components/ui/Notes";

export function CentersPage({ config }: { config: MunicipalityConfig }) {
  // Ein gemeinsamer Auswahlzustand für Karte und Liste – in der URL, damit Zurück/Teilen funktioniert.
  const [params, setParams] = useSearchParams();
  const selected = config.centers.find(c => c.id === params.get("zentrum")) ?? null;
  const profileOpen = !!selected && params.get("ansicht") === "profil";
  const demo = getDemoData(config);
  const features = useMemo(() => (demo ? centerFeatures(config, demo, true) : []), [config, demo]);
  const focus = selected ? demo?.centers.find(c => c.id === selected.id)?.shape ?? null : null;

  const select = (id: string) => setParams({ zentrum: id }, { replace: true });
  const openProfile = () => selected && setParams({ zentrum: selected.id, ansicht: "profil" });
  const back = () => selected && setParams({ zentrum: selected.id });

  const legend = (
    <>
      <strong>Zentren und Standorte</strong>
      {config.centerCategories.map(c => (
        <span key={c.id} className="legend-row"><LegendSymbol shape={c.symbol} fill={c.color} />{c.label}</span>
      ))}
    </>
  );

  return (
    <section className="page">
      <PageIntro title="Zentren & Standorte" text="Zentren im Stadtgebiet über Karte oder Liste erkunden und Profile mit weiteren Informationen aufrufen." />

      <div className={profileOpen ? "workspace is-profile" : "workspace"}>
        <div className="workspace-map">
          <MapPanel
            webMapId={config.arcgis.webMaps.centers}
            portalUrl={config.arcgis.portalUrl}
            ariaLabel={profileOpen && selected ? `Karte ${selected.name}` : "Karte der Zentren und Standorte"}
            selection={{ layerId: config.arcgis.centersLayerId, idField: config.arcgis.centerIdField, selectedId: selected?.id, onSelect: select }}
            fallback={demo ? (
              <SchematicMap
                ariaLabel="Beispielkarte der Zentren und Standorte"
                outline={demo.outline}
                rivers={demo.rivers}
                features={features}
                selectedId={selected?.id}
                onSelect={select}
                focus={focus}
                legend={profileOpen ? undefined : legend}
              />
            ) : null}
          />
        </div>

        <aside className="workspace-side" aria-label={profileOpen ? "Zentrenprofil" : "Zentrenliste"}>
          {profileOpen && selected ? (
            <CenterProfile center={selected} category={categoryOf(config, selected.categoryId)} onBack={back} />
          ) : (
            <>
              <div className="panel-heading">
                <h2>Zentrenliste</h2>
                <p>Ein Zentrum in der Liste oder Karte auswählen und das Profil öffnen.</p>
              </div>
              <CenterList config={config} selectedId={selected?.id} onSelect={select} />
              <div className="sticky-action">
                <button className="primary-button full-width" type="button" onClick={() => openProfile()} disabled={!selected}>
                  {selected ? `${selected.name} ansehen →` : "Zentrum auswählen"}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {config.isDemo ? <DemoNotice /> : null}
    </section>
  );
}
