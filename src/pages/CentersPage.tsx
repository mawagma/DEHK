import { useMemo, useState } from "react";
import { ArcGISMap } from "../components/maps/ArcGISMap";
import { CenterList } from "../components/centers/CenterList";
import { CenterProfile } from "../components/centers/CenterProfile";
import type { Center, wiesbadenConfig } from "../config/municipalities/wiesbaden";

type Config = typeof wiesbadenConfig;
type Props = { config: Config };

export function CentersPage({ config }: Props) {
  const [selected, setSelected] = useState<Center | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const selectedId = selected?.id;
  const subtitle = useMemo(
    () => selected ? `${selected.category} · ${selected.name}` : "Gesamtstädtische Übersicht",
    [selected]
  );

  function selectCenter(center: Center) {
    setSelected(center);
  }

  function openProfile() {
    if (selected) setProfileOpen(true);
  }

  return (
    <section className="centers-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Zentren- und Standortstruktur</span>
          <h1>Zentren &amp; Standorte</h1>
          <p>{profileOpen ? subtitle : "Zentren über Karte oder Liste erkunden und anschließend das Profil öffnen."}</p>
        </div>
        {!profileOpen && selected ? (
          <button className="primary-button" type="button" onClick={openProfile}>
            {selected.name} ansehen →
          </button>
        ) : null}
      </div>

      <div className={profileOpen ? "centers-workspace is-profile" : "centers-workspace"}>
        <div className="centers-map-pane">
          <ArcGISMap
            webMapId={config.arcgis.centersWebMapId}
            portalUrl={config.arcgis.portalUrl}
            ariaLabel={profileOpen && selected ? `Standortkarte ${selected.name}` : "Zentrenübersicht"}
            compact={profileOpen}
          />
        </div>

        <aside className="centers-side-pane">
          {profileOpen && selected ? (
            <CenterProfile center={selected} onBack={() => setProfileOpen(false)} />
          ) : (
            <>
              <div className="panel-heading">
                <span className="eyebrow">Auswahl</span>
                <h2>Zentren und Standorte</h2>
                <p>Ein Zentrum auswählen und anschließend das Profil öffnen.</p>
              </div>

              <CenterList centers={config.centers} selectedId={selectedId} onSelect={selectCenter} />

              <div className="sticky-action">
                <button className="primary-button full-width" type="button" onClick={openProfile} disabled={!selected}>
                  {selected ? `${selected.name} ansehen →` : "Zentrum auswählen"}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="prototype-note">
        <strong>V1-Prototyp:</strong> Die 70/30-Ansicht wechselt beim Öffnen des Profils auf 30/70.
        Sobald eine öffentliche ArcGIS-WebMap-ID eingetragen ist, wird der Platzhalter durch die echte WebMap ersetzt.
      </div>
    </section>
  );
}
