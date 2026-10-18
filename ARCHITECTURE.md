# Technische Architektur V1

## PUBLIC
React-Web-App → ArcGIS Maps SDK for JavaScript → ArcGIS Online WebMaps / Feature Services.

## Trennung der Zuständigkeiten
**ArcGIS Online**
- Geometrien
- kartografische Symbolisierung
- Layerreihenfolge
- freigegebene räumliche Attribute

**Frontend**
- Navigation
- Layout
- responsive Verhalten
- Zentrenprofil
- UI-Zustände und Filter
- redaktionelle Inhalte

**Fachliche Vorbereitung**
- Zentrenabgrenzungen
- Kennzahlen
- Indexwerte
- Sortimentszuordnungen
- fachliche Texte / Einordnungen

## Wiederverwendung
Neue Kommune:
1. neue kommunale Konfiguration
2. neue WebMap-/Layer-IDs
3. neue freigegebene Inhalte
4. optional kommunale Akzentfarbe / Logo

Komponenten bleiben gleich.

## Seiten
- `/` Überblick
- `/zentren` Zentren & Standorte
- `/nahversorgung` Nahversorgung
- `/einzelhandelsstruktur` Einzelhandelsstruktur
- `/einzelhandel-steuern` Einzelhandel steuern

## Code-Struktur
- `src/config/` – Typen (`types.ts`), aktive Kommune (`index.ts`), Kommunen-Dateien
- `src/demo/` – schematische Beispielkarte und Beispieldaten (nur solange keine WebMap-ID gesetzt ist)
- `src/components/maps/` – `MapPanel` wählt `ArcGISMap` (echte WebMap) oder `SchematicMap` (Beispiel)
- `src/lib/retailFilter.ts` – ein Filterzustand → Karte, Kennzahl, Diagramme
- `src/pages/` – je Modul eine Seite

## Zustände
- Zentrenauswahl: ein Zustand in der URL (`?zentrum=…&ansicht=profil`), von Karte und Liste gemeinsam genutzt.
- Einzelhandelsstruktur: ein `RetailFilter`-Zustand; Klick auf einen Betrieb ändert die Filter nicht.
