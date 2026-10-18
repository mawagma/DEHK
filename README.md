# GMA Digitales Einzelhandelskonzept – PUBLIC Web-App

React + TypeScript + Vite. Karten über das ArcGIS Maps SDK; solange keine WebMap-IDs eingetragen sind, zeigt jede Seite eine **schematische Beispielkarte mit Beispieldaten**.

## Seiten
| Route | Inhalt |
|---|---|
| `#/` | Überblick: Zentrenkarte, Kennzahlen, Themenkacheln |
| `#/zentren` | Zentren & Standorte: Karte + Liste (70/30), Profil (30/70), Auswahl in der URL (`?zentrum=…&ansicht=profil`) |
| `#/nahversorgung` | Versorgungsgrad als Hexagone, Lebensmittelmärkte, Legende |
| `#/einzelhandelsstruktur` | Betriebe als Punkte, Filter Sortiment/Standorttyp/Raum, Kennzahl und Diagramme |
| `#/einzelhandel-steuern` | Grundprinzipien, Steuerungslogik, Sortimentsliste mit Suche, Beispiele, FAQ |

Routing per `HashRouter`: funktioniert auf jedem statischen Hosting ohne Server-Rewrite und unter beliebigen Unterpfaden.

## Starten
```bash
npm install
npm run dev      # Entwicklung
npm test         # Tests (Vitest)
npm run build    # Produktionsbuild nach dist/
```

## Neue Kommune
1. `src/config/municipalities/<kommune>.ts` als `MunicipalityConfig` anlegen (Typen in `src/config/types.ts`).
2. In `src/config/index.ts` eintragen; Auswahl beim Build über `VITE_MUNICIPALITY=<id>`.
3. Module über `modules` ein-/ausschalten.

## ArcGIS anbinden
In der Kommunen-Konfiguration unter `arcgis` eintragen:
- `webMaps.overview`, `webMaps.centers`, `webMaps.supply`, `webMaps.retailStructure` – Item-IDs **öffentlich freigegebener** WebMaps
- `centersLayerId` – Layer-ID des Zentrenlayers in der Zentren-WebMap (für Kartenklick, Hervorhebung, Zoom)
- `centerIdField` – Attributfeld mit der Zentren-ID (Standard `CENTER_ID`), Werte müssen den `id`s in `centers` entsprechen

Optional `.env`: `VITE_ARCGIS_PORTAL_URL` für ein Enterprise-Portal.

Noch nicht umgesetzt für echte ArcGIS-Daten: Filter der Einzelhandelsstruktur als Layer-Abfrage (Statistics Query) und Klick auf Märkte/Betriebe in der echten Karte. Beides braucht die realen Layer und Feldnamen.

## Beispieldaten
`src/demo/` erzeugt eine schematische Stadtkarte, 1.606 erfundene Betriebe, Märkte und Hexagone. Sie dienen nur der Gestaltung und Interaktion und sind in der Oberfläche als Beispiel gekennzeichnet. Keine fachliche Aussage.

## Datenprinzip
- Fachliche Berechnungen erfolgen vorgelagert durch GMA.
- PUBLIC erhält ausschließlich freigegebene Layer/Views; keine exakten Verkaufsflächen oder Umsätze einzelner Betriebe.
- Wiesbaden-Werte und -Texte vor Veröffentlichung fachlich freigeben.
