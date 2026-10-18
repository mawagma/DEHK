# GMA Digitales Einzelhandelskonzept – Web Template V1

Dieser Prototyp ist der technische Startpunkt für die PUBLIC-Webanwendung.

## Enthalten
- React + TypeScript + Vite
- GMA-Designsystem als CSS-Variablen und wiederverwendbare Komponenten
- Seite `Überblick`
- Seite `Zentren & Standorte`
- echte 70/30 → 30/70-Layoutinteraktion für das Zentrenprofil
- kommunale Konfigurationsdatei für Wiesbaden
- ArcGIS-WebMap-Komponente mit Fallback-Platzhalter
- responsive Desktop-/Tablet-/Mobile-Layouts

## Starten
1. Node.js 20+ installieren.
2. Im Projektordner:
   ```bash
   npm install
   npm run dev
   ```
3. Die im Terminal ausgegebene lokale URL öffnen.

## ArcGIS anbinden
Öffne:
`src/config/municipalities/wiesbaden.ts`

Ersetze:
- `YOUR_OVERVIEW_WEBMAP_ID`
- `YOUR_CENTERS_WEBMAP_ID`

durch die Item-IDs der **öffentlich freigegebenen** WebMaps in ArcGIS Online.

Die Komponente `src/components/maps/ArcGISMap.tsx` lädt dann automatisch die jeweilige WebMap über `@arcgis/core`.

### Portal
Standard ist `https://www.arcgis.com`.
Für eine Enterprise-Portal-URL kann `VITE_ARCGIS_PORTAL_URL` in einer `.env` gesetzt werden.

## Wichtig zur Datenlogik
- Fachliche Berechnungen erfolgen vorgelagert.
- PUBLIC erhält ausschließlich freigegebene Layer/Views.
- Das Frontend visualisiert und filtert fertige Daten.
- Die in V1 hinterlegten Wiesbaden-Werte dienen dem Prototyp. Vor Veröffentlichung fachlich/freigabeseitig prüfen.

## Nächste Integrationsstufe
Für echte Auswahl direkt aus der ArcGIS-Karte:
1. Layer in der WebMap eindeutig benennen.
2. In `ArcGISMap` `view.on("click")` + `view.hitTest()` ergänzen.
3. Treffer des Zentrenlayers anhand `CENTER_ID` an `CentersPage` zurückgeben.
4. denselben State für Liste und Karte verwenden.

Im V1-Prototyp ist die Listenwahl bereits vollständig funktionsfähig und bewusst die zuverlässige Baseline.
