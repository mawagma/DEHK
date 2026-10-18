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

## V1-Seiten
- `/` Überblick
- `/zentren` Zentren & Standorte

Weitere Module folgen auf demselben Grundgerüst.
