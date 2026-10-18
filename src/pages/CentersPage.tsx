import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { MunicipalityConfig } from "../config/types";
import { getDemoData } from "../demo";
import { CenterCompare } from "../components/centers/CenterCompare";
import { CenterList } from "../components/centers/CenterList";
import { CenterTable } from "../components/centers/CenterTable";
import { CenterProfile } from "../components/centers/CenterProfile";
import { categoryOf, centerFeatures } from "../components/centers/centerFeatures";
import { MapPanel } from "../components/maps/MapPanel";
import { LegendSymbol, SchematicMap } from "../components/maps/SchematicMap";
import { DemoNotice, PageIntro } from "../components/ui/Notes";
import { MAX_COMPARE, parseCompare } from "../lib/centers";

export function CentersPage({ config }: { config: MunicipalityConfig }) {
  // Ein gemeinsamer Auswahlzustand für Karte und Liste – in der URL, damit Zurück/Teilen funktioniert.
  const [params, setParams] = useSearchParams();
  const selected = config.centers.find(c => c.id === params.get("zentrum")) ?? null;
  const profileOpen = !!selected && params.get("ansicht") === "profil";
  const demo = getDemoData(config);
  const features = useMemo(() => (demo ? centerFeatures(config, demo, true) : []), [config, demo]);
  const focus = selected ? demo?.centers.find(c => c.id === selected.id)?.shape ?? null : null;

  const compare = parseCompare(params.get("vergleich"), config);
  const compareIds = compare.map(c => c.id);

  // Parameter zusammenführen, damit Auswahl und Vergleich sich nicht gegenseitig löschen
  const update = (patch: Record<string, string | null>, replace = false) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace });
  };
  const select = (id: string) => update({ zentrum: id }, true);
  const openProfile = (id = selected?.id) => id && update({ zentrum: id, ansicht: "profil" });
  const back = () => update({ ansicht: null });
  const setCompare = (ids: string[]) => update({ vergleich: ids.length ? ids.join(",") : null }, true);
  const toggleCompare = (id: string) =>
    setCompare(compareIds.includes(id) ? compareIds.filter(x => x !== id) : [...compareIds, id].slice(0, MAX_COMPARE));

  const legend = (
    <>
      <strong>Zentren und Standorte</strong>
      {config.centerCategories.map(c => (
        <span key={c.id} className="legend-row"><LegendSymbol shape={c.symbol} fill={c.color} />{c.label}</span>
      ))}
    </>
  );

  return (
    <>
      <PageIntro image={config.pageImages?.zentren} title="Zentren & Standorte" text="Zentren im Stadtgebiet über Karte oder Liste erkunden und Profile mit weiteren Informationen aufrufen." />
      <section className="page">

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
            <CenterProfile
              config={config}
              center={selected}
              category={categoryOf(config, selected.categoryId)}
              onBack={back}
              onCompare={() => toggleCompare(selected.id)}
              compared={compareIds.includes(selected.id)}
            />
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

      <CenterCompare config={config} centers={compare} onRemove={toggleCompare} onClear={() => setCompare([])} />
      {compare.length === 1 ? <p className="demo-note">„{compare[0].name}“ ist zum Vergleich vorgemerkt. Wählen Sie ein weiteres Zentrum.</p> : null}

      <CenterTable config={config} compareIds={compareIds} onToggleCompare={toggleCompare} onOpen={id => openProfile(id)} />

      {config.isDemo ? <DemoNotice /> : null}
    </section>
    </>
  );
}
