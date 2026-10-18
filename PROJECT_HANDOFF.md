# GMA Digitales Einzelhandelskonzept
## Vollständige Projektübergabe für Claude Code

Stand: Oktober 2026

---

## 0. Zweck dieses Dokuments

Dieses Dokument ist die vollständige fachlich-funktionale und technische Übergabe für die Weiterentwicklung des Projekts in Claude Code.

Bitte dieses Dokument zuerst vollständig lesen, anschließend den vorhandenen Codebestand untersuchen und erst danach Änderungen vornehmen.

Wichtig: Das Projekt ist **kein allgemeines GIS-Portal** und soll auch nicht zu einem solchen werden. Es ist ein **hochwertiges, wiederverwendbares digitales Informationsprodukt der GMA**, das kommunale Einzelhandelskonzepte verständlich, kartengestützt und modern aufbereitet.

---

# 1. Produktidee

Die GMA erstellt klassische kommunale Einzelhandelskonzepte bislang vorwiegend als umfangreiche PDF-Gutachten. Das digitale Einzelhandelskonzept soll als **zusätzlich buchbares digitales Produkt** zu diesen Gutachten angeboten werden.

Das Produkt verfolgt zwei Ziele:

1. **PUBLIC:** Ein modernes, verständliches digitales Informationsangebot für Öffentlichkeit, Politik, Unternehmen und Verwaltung.
2. **INTERN:** Perspektivisch eine geschützte Fachanwendung für kommunale Planer, insbesondere für eine grobe standortbezogene Anwendung der Aussagen des Einzelhandelskonzepts.

Die PUBLIC-Anwendung ist aktuell der Entwicklungsfokus.

Das Produkt soll für sehr unterschiedliche Kommunen funktionieren – von Städten mit ca. 15.000 Einwohnern bis zu Großstädten. Deshalb darf die Anwendung nicht auf Wiesbaden fest programmiert werden.

Wiesbaden dient aktuell als Referenz- und Beispieldatensatz.

---

# 2. Verbindliche technische Leitentscheidung

## PUBLIC

Die öffentliche Anwendung wird **nicht** primär mit ArcGIS Experience Builder gebaut.

Stattdessen:

**Custom responsive Web-App + ArcGIS Online als Geo-Backend**

Zielarchitektur:

```text
GMA PUBLIC Web-App
React + TypeScript
        │
        ├── Navigation, Layout, Design, Profile, Filter, Charts
        │
        └── ArcGIS Maps SDK for JavaScript
                  │
                  ├── ArcGIS Online WebMaps
                  └── ArcGIS Feature Services / Hosted Views
```

ArcGIS Online ist die zentrale Plattform für Geodaten und Kartenkonfiguration.

Die Web-App ist die eigentliche Benutzeroberfläche.

## INTERN

Der interne Bereich ist zunächst **nicht Bestandteil des PUBLIC-Repositories**.

Als erste technische Option bleibt eine separate geschützte ArcGIS-/Experience-Builder-Lösung möglich. Später kann INTERN bei Bedarf in denselben Web-Stack integriert werden.

---

# 3. Wichtigstes Architekturprinzip

## Die Web-App führt möglichst keine fachlichen Berechnungen durch.

Die fachliche Arbeit geschieht vorgelagert durch die GMA.

Beispiele:

- Zentrenabgrenzungen sind fertig.
- Nahversorgungsindex ist fertig berechnet.
- Hexagone besitzen fertige Werte und Klassen.
- Sortimentszuordnungen sind fertig.
- Vergleichsdaten sind fertig.
- fachliche Texte und Bewertungen sind redaktionell freigegeben.
- eventuelle Regeln für einen internen Standort-Check werden vorgelagert fachlich definiert.

Die Anwendung:

- visualisiert,
- filtert,
- selektiert,
- verknüpft vorbereitete Informationen,
- zeigt vorbereitete Kennzahlen und Texte an.

Sie soll **keine fachliche Analyse-Engine** werden.

---

# 4. Produktcharakter und UX

Das Produkt soll sich eher wie ein **modernes Datenprodukt / digitales Stadtentwicklungsprodukt** anfühlen als wie ein klassisches Geoportal.

Die Gestaltung wurde bewusst in Richtung „modernes Datenprodukt“ entschieden.

Charakter:

- professionell,
- ruhig,
- hochwertig,
- datenorientiert,
- klar strukturiert,
- visuell stärker als ein Standard-GIS,
- wenig technische GIS-Anmutung,
- GMA-Marke deutlich erkennbar.

Desktop ist primär.

PUBLIC muss zusätzlich sinnvoll auf Tablet und Smartphone funktionieren.

---

# 5. GMA Designrichtung

Als visuelle Referenz gelten:

- das bereitgestellte GMA-Logo,
- die Website `gma.biz`,
- die bereits erstellten Mockups dieses Projekts.

Grundfarbwelt im aktuellen Code:

```text
GMA Blau:        #006da8
GMA Blau dunkel: #005783
GMA Dunkelgrau:  #34444e
Hintergrund:     #f4f7f9
Linien:          #dde5e9
Weiß:            #ffffff
Hellblau:        #e8f4fa
```

Diese Werte sind Arbeitswerte, keine verbindliche offizielle CD-Dokumentation.

Designprinzipien:

- viel Weißraum,
- klare Sans-Serif-Typografie,
- dunkelgraue Überschriften,
- GMA-Blau primär für Interaktion, Links, Auswahl und Akzente,
- helle Karten,
- dezente Rahmen,
- keine verspielten Effekte,
- keine unnötigen Schatten,
- übersichtliche Cards,
- Karten und Datenvisualisierung gleichwertig behandeln,
- keine „ArcGIS Standard App“-Optik.

Logo im aktuellen Projekt:

`public/gma-logo.jpg`

Keine Fontdateien mitliefern oder einbetten, solange keine lizenzierte GMA-Schrift definiert wurde.

---

# 6. Informationsarchitektur PUBLIC

Die öffentliche Anwendung besitzt fünf Hauptbereiche:

```text
Überblick
Zentren & Standorte
Nahversorgung
Einzelhandelsstruktur
Einzelhandel steuern
```

Die Hauptnavigation ist horizontal.

Ein dezenter Einstieg „Interner Bereich“ kann später zu einer separaten geschützten Anwendung führen.

---

# 7. Seite 1 – Überblick

## Aufgabe

Die Startseite ist **mehr als eine reine Navigation**, soll aber auch nicht das vollständige Gutachten abbilden.

Sie ist eine digitale Zusammenfassung und ein Einstieg in die wichtigsten Themen.

## Grundstruktur

1. Header / Hauptnavigation
2. kombinierter Einstieg mit Titel, kurzer Einführung, 3–4 Kennzahlen und sichtbarer Zentrenkarte
3. interaktive vereinfachte Zentrenkarte
4. kompakte Themenkacheln
5. Datenstand / Quellen / Impressum

## Aktuell gewünschte UX

Die Karte soll bereits im ersten sichtbaren Bereich zumindest teilweise sichtbar sein.

Kennzahlen: ca. 3–4.

Die Zentrenkarte darf interaktiv sein, zeigt aber nur reduzierte Informationen.

Vollständige Zentrenprofile gehören auf die Seite „Zentren & Standorte“.

Themeneinstiege:

- Nahversorgung
- Einzelhandelsstruktur
- Einzelhandel steuern

Die Zentren brauchen keine eigene zusätzliche Themenkachel, da die Karte bereits der Einstieg ist.

---

# 8. Seite 2 – Zentren & Standorte

Diese Seite ist ein Kernmodul.

## Ausgangszustand

```text
70 % Karte | 30 % Zentrenliste
```

Die Auswahl ist möglich über:

- Karte
- gruppierte Zentrenliste

Die Liste ist nach Kategorien gegliedert.

## Nach Auswahl / Profilansicht

```text
30 % Karte | 70 % Zentrenprofil
```

Anders als in der früher erwogenen Experience-Builder-Variante soll in der Custom-Web-App **derselbe Kartenzustand grundsätzlich weiterverwendet werden**.

Die Karte zoomt auf das gewählte Zentrum.

Das Profil öffnet sich dynamisch.

## Zentrenprofil

Geplante Inhalte:

- Zentrenname
- Kategorie
- Versorgungsfunktion / Kurzbeschreibung
- 2–3 zentrale aggregierte Kennzahlen
- maximal 1–2 Diagramme
- kompakte Standortinformation
- Handlungsempfehlungen erst nachrangig / später

Die Karte im Profil soll weniger komplex sein als eine vollständige Betriebsanalyse.

Detaillierte Betriebsanalysen gehören zur Einzelhandelsstruktur.

## PUBLIC und INTERN

Grundstruktur identisch.

INTERN könnte später zusätzliche Informationen ergänzen, ohne ein komplett anderes Zentrenprofil zu benötigen.

---

# 9. Seite 3 – Nahversorgung

## Zentrale Nutzerfrage

Wie gut sind unterschiedliche Bereiche der Stadt fußläufig mit relevanten Lebensmittelmärkten versorgt?

## Grundlayout

Kartenzentriert.

Ca.:

```text
70 % Karte | 30 % Information
```

Die Karte bleibt auch bei einer Auswahl dominant.

## Ausgangszustand

Gesamtstadt.

## Hauptvisualisierung

**Hexagonbasierter Versorgungsindex**

Der Index ist ein fertig vorbereiteter Datensatz.

Die Website berechnet ihn nicht.

Festgelegt:

- kombiniertes Versorgungskonzept,
- fußläufige Erreichbarkeit + Angebotsstruktur,
- mittleres Raster,
- relevante Lebensmittelmärkte zunächst ab 400 m² Verkaufsfläche.

Die fachliche Berechnung erfolgt außerhalb der Website.

## Darstellung

- Hexagon-Layer mit fertiger Versorgungsklasse
- Lebensmittelmärkte als Punkte
- direkte Darstellung der Versorgungsklassen
- klare Legende
- keine umfangreiche Ortsbezirksstatistik

Bei Klick auf Markt:

- Name
- Betriebstyp
- Betreiberlogo, sofern rechtlich/fachlich freigegeben

Ortsbezirkskennzahlen sind nachrangig.

Ausführliche fachliche Bewertungen sind zunächst zurückgestellt.

---

# 10. Seite 4 – Einzelhandelsstruktur

## Zentrale Nutzerfrage

Wo befindet sich der Einzelhandel, welche Sortimente prägen ihn und wie verteilt sich der Bestand räumlich?

## Kartendarstellung

**Einzelbetriebe als Punkte.**

Keine Heatmap als primäre Darstellung.

## Filter PUBLIC

Alle drei wurden verbindlich festgelegt:

- Sortiment
- Standorttyp
- räumlicher Bereich

Filter müssen kombinierbar sein.

## Kennzahlen / Diagramme

Im Mittelpunkt:

- Anzahl der Betriebe
- Verteilung nach Sortimenten
- Entwicklung des Betriebsbestands

Nicht im Mittelpunkt:

- detaillierte Verkaufsflächenanalyse

Verkaufsflächen können höchstens als vorbereitete Größenklassen verwendet werden.

## Betriebsauskunft PUBLIC

Bei Auswahl eines Betriebs:

- Name
- Sortiment
- Verkaufsflächengrößenklasse, sofern öffentlich freigegeben

Keine exakte betriebsbezogene Verkaufsfläche.

Kein betriebsbezogener Umsatz.

## Interaktionsprinzip

Karte, KPI und Sortimentsdiagramm sollen dieselbe gefilterte Teilmenge verwenden.

Ein Klick auf einen einzelnen Betrieb darf die übergeordneten Filter nicht unbeabsichtigt ändern.

Zoom der Karte soll Kennzahlen nicht automatisch verändern, solange kein expliziter „sichtbaren Ausschnitt auswerten“-Modus vorgesehen ist.

PUBLIC und INTERN nutzen grundsätzlich dieselbe Basisansicht.

---

# 11. Seite 5 – Einzelhandel steuern

Diese Seite ist bewusst **keine GIS-Analyseansicht**.

Keine eigene Karte.

Keine öffentliche Standortauskunft.

Kein öffentlicher Standort-Check.

## Ziel

Die Steuerungslogik des Einzelhandelskonzepts verständlich und visuell erklären.

Leitstruktur:

```text
WO?
↓
WAS?
↓
WIE GROSS?
↓
WELCHE GRUNDSÄTZE GELTEN?
```

## Inhalte

- visuelle Grundlogik
- vorbereitete Beispielsituationen
- klassische Sortimentsübersicht
- Suchfunktion in der Sortimentsliste
- erläuternde Texte
- Verweis auf vollständiges Konzept

## Beispiele

Vorgesehen sind z. B.:

- Bekleidungsgeschäft im Hauptzentrum
- Lebensmittelmarkt in wohnortnaher Lage
- Möbelmarkt am Sonderstandort

Die Beispiele erklären die Systematik.

Sie sind **keine reale Einzelfallprüfung**.

Keine einfache grün/rot-Ampellogik verwenden, die Zulässigkeit suggeriert.

---

# 12. INTERN – Standort-Check (spätere separate Anwendung)

Nicht Kern des aktuellen PUBLIC-Repositories, aber für die Produktvision wichtig.

## Grundlogik

Schritt 1:
- Adresse / Standort wählen
- Standorttyp und räumliche Zuordnung anzeigen
- allgemeine Grundsätze anzeigen

Schritt 2:
- Kernsortiment
- Verkaufsfläche bzw. vordefinierte Größenklasse
- vorbereitete fachliche Einordnung anzeigen

Ergebnis:

- kompakte Ersteinschätzung
- kurze Begründung
- ggf. weiterer Prüfbedarf
- Quellenverweis

Der Check ist **keine bauplanungsrechtliche Genehmigungsprüfung**.

Kein PDF-Export im MVP.

Komplexe fachliche Regeln sollen vorgelagert strukturiert vorbereitet werden.

---

# 13. PUBLIC / INTERN Datenschutz- und Datenprinzip

Sehr wichtig:

PUBLIC und INTERN dürfen nicht lediglich über Frontend-Ausblendung getrennt werden.

Öffentliche Feature Services / Hosted Views dürfen ausschließlich Informationen enthalten, die tatsächlich öffentlich abrufbar sein dürfen.

PUBLIC soll insbesondere nicht veröffentlichen:

- exakte Verkaufsflächen einzelner Betriebe, sofern nicht ausdrücklich freigegeben
- betriebsbezogene Umsätze
- vertrauliche interne Attribute
- gefilterte Auswertungen, die unbeabsichtigt sensible Einzelinformationen rekonstruierbar machen

Öffentlich grundsätzlich denkbar, sofern projektbezogen freigegeben:

- Betriebsname
- Branche / Kernsortiment
- Standort
- Größenklasse
- freigegebene aggregierte Kennzahlen

ArcGIS PUBLIC Views und interne Master-Layer sauber trennen.

---

# 14. Rollen der Systeme

## ArcGIS Online

Soll primär enthalten:

- Geometrien
- Feature Services
- öffentliche Hosted Views
- WebMaps
- Symbolisierung
- Layerreihenfolge
- Basemaps
- ggf. grundlegende Pop-ups

## Frontend

Soll enthalten:

- Navigation
- Seitenlayout
- GMA-Design
- responsive Verhalten
- Auswahlzustände
- UI-Filter
- Profilansichten
- Diagramme
- Text-/Content-Komponenten
- Verknüpfung fertiger Daten

## GMA-Fachprozess vorgelagert

Soll liefern:

- finale Zentrenabgrenzungen
- finale freigegebene Kennzahlen
- fertige Nahversorgungshexagone
- Sortimentszuordnungen
- Entwicklungstabellen
- redaktionelle Texte
- fachlich freigegebene Beispiele / Regeln

---

# 15. Vorgeschlagene ArcGIS-Datenstruktur

Die Namen sind Empfehlungen und dürfen an reale Datenstrukturen angepasst werden.

## Zentren

Beispielattribute:

```text
CENTER_ID
NAME
CATEGORY
STATUS
SHORT_TEXT
```

Optional:

```text
PROFILE_ID
NUMBER_STORES
```

Aggregierte Profilkennzahlen können auch aus separaten Tabellen / Content-Dateien kommen.

## Einzelhandelsbetriebe PUBLIC

```text
STORE_ID
NAME_PUBLIC
ASSORTMENT
LOCATION_TYPE
DISTRICT
SIZE_CLASS
```

## Lebensmittelmärkte PUBLIC

```text
MARKET_ID
NAME_PUBLIC
MARKET_TYPE
LOGO_KEY
```

## Nahversorgungshexagone

```text
HEX_ID
INDEX_VALUE
SUPPLY_CLASS
```

## Optionale Tabellen

```text
center_statistics_public
retail_development_public
```

---

# 16. WebMaps statt Kartendesign im React-Code

Kartographie soll möglichst in ArcGIS Online gepflegt werden.

Beispiele:

```text
GMA_<KOMMUNE>_Overview_PUBLIC
GMA_<KOMMUNE>_Centers_PUBLIC
GMA_<KOMMUNE>_Supply_PUBLIC
GMA_<KOMMUNE>_RetailStructure_PUBLIC
```

Frontend soll möglichst über Item-ID laden.

Vorteil:

GMA-GIS-Mitarbeiter können Layerreihenfolge, Symbolisierung und Beschriftungen ändern, ohne einen neuen Frontend-Deploy auszulösen.

Frontend soll kartografische Styles nur dann überschreiben, wenn es dafür einen klaren Produktgrund gibt.

---

# 17. Kommunale Konfiguration / Multi-Tenant-Prinzip

Wiesbaden darf nicht hart verdrahtet werden.

Ziel:

```text
src/config/municipalities/
  wiesbaden.ts
  kommune-b.ts
  kommune-c.ts
```

Pro Kommune sollten konfigurierbar sein:

- Stadtname
- Anwendungstitel
- Konzeptstand
- Datenstand
- WebMap-IDs
- ggf. Layer-IDs
- Kennzahlen
- Introtexte
- Zentreninhalte
- optionale kommunale Akzentfarbe
- kommunales Logo
- aktivierte Module
- Sortimentsliste / Steuerungsbeispiele

Langfristiges Ziel:
Ein neues digitales Einzelhandelskonzept soll möglichst durch **neue Konfiguration + neue ArcGIS-Daten** erzeugt werden, nicht durch einen Fork der gesamten Anwendung.

---

# 18. Aktueller Codebestand

Aktuelles Repository / ZIP:

`GMA_Retail_WebTemplate_V1`

Technischer Stand:

- React
- TypeScript
- Vite
- React Router
- `@arcgis/core`
- eigenes CSS-Designsystem

Versionen im aktuellen `package.json`:

```json
{
  "@arcgis/core": "^4.33.0",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.8.2",
  "typescript": "^5.9.2",
  "vite": "^7.1.3"
}
```

**Nicht ohne konkreten Grund pauschal alle Dependencies upgraden.**
Erst aktuellen Code lauffähig machen / testen, dann gezielt entscheiden.

---

# 19. Aktuelle Projektstruktur

```text
GMA_Retail_WebTemplate_V1/
│
├── public/
│   └── gma-logo.jpg
│
├── src/
│   ├── components/
│   │   ├── centers/
│   │   │   ├── CenterList.tsx
│   │   │   └── CenterProfile.tsx
│   │   ├── layout/
│   │   │   └── AppHeader.tsx
│   │   ├── maps/
│   │   │   └── ArcGISMap.tsx
│   │   └── ui/
│   │       ├── MetricCard.tsx
│   │       └── TopicCard.tsx
│   │
│   ├── config/
│   │   └── municipalities/
│   │       └── wiesbaden.ts
│   │
│   ├── pages/
│   │   ├── OverviewPage.tsx
│   │   └── CentersPage.tsx
│   │
│   ├── styles/
│   │   └── gma-theme.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── preview/
│   └── index.html
│
├── README.md
├── ARCHITECTURE.md
├── package.json
├── vite.config.ts
└── tsconfig...
```

---

# 20. Bereits implementierter Funktionsumfang

## Überblick

Implementiert:

- GMA Header
- Navigation
- Hero / Intro
- KPI-Cards
- ArcGIS-WebMap-Container
- Platzhalterdarstellung, solange keine echte WebMap-ID gesetzt ist
- Themenkacheln
- responsive Basis

## Zentren & Standorte

Implementiert:

- 70/30 Übersicht
- gruppierte Zentrenliste
- Zentrumsauswahl per Liste
- Profil öffnen
- Wechsel auf 30/70
- datengetriebene Profilvorlage
- Profil zurück zur Übersicht
- Kennzahlenkarten
- einfaches Balkendiagramm
- responsive Basis

Noch nicht implementiert:

- echte Auswahl durch Klick in der ArcGIS-Karte
- Zoom auf gewähltes Zentrum
- Synchronisierung Karte ↔ Liste
- vollständige Profildaten aller Zentren
- echte WebMap-IDs

---

# 21. ArcGISMap.tsx – aktuelles Verhalten

`src/components/maps/ArcGISMap.tsx`

Aktuell:

- lädt eine WebMap über `@arcgis/core/WebMap`
- erstellt `MapView`
- akzeptiert `webMapId`
- akzeptiert `portalUrl`
- wenn Item-ID mit `YOUR_` beginnt, wird automatisch ein schematischer Fallback angezeigt
- MapView wird beim Unmount sauber zerstört

Nächste sinnvolle Erweiterung:

```text
Map click
→ view.hitTest()
→ nur Treffer aus Zentrenlayer beachten
→ CENTER_ID lesen
→ an Parent-Komponente melden
→ selected Center State aktualisieren
→ ggf. view.goTo(feature.geometry)
```

Wichtig:
Die Auswahl aus Karte und Liste soll **denselben React State** verwenden.

Nicht zwei parallele Auswahlmodelle bauen.

---

# 22. Aktuelle Wiesbaden-Konfiguration

Datei:

`src/config/municipalities/wiesbaden.ts`

Aktuell enthalten:

```text
overviewWebMapId: "YOUR_OVERVIEW_WEBMAP_ID"
centersWebMapId: "YOUR_CENTERS_WEBMAP_ID"
```

Diese IDs müssen später durch öffentliche ArcGIS Online Item IDs ersetzt werden.

Die Konfiguration enthält außerdem exemplarische Zentrenprofile.

---

# 23. Wiesbaden – fachlicher Referenzstand

Wiesbaden dient nur als Referenzkommune.

Aktueller zugrunde liegender Gutachtenstand:

- Fortschreibung Einzelhandelskonzept 2026
- Einzelhandelserhebung 2025
- nicht automatisch davon ausgehen, dass alle Empfehlungen formal beschlossen sind

Wichtiger Hinweis:
Der tatsächliche Beschlussstatus muss vor einer öffentlichen Produktivveröffentlichung geprüft und redaktionell korrekt dargestellt werden.

## Gesamtbestand

Beispieldaten aus dem Gutachten:

- 1.606 Einzelhandelsbetriebe
- rund 485.870 m² Gesamtverkaufsfläche
- rund 2.090,6 Mio. € geschätzter Umsatz

Die PUBLIC-Web-App muss nicht alle diese Werte verwenden.

## Zentrenstruktur

Zentrale Versorgungsbereiche:

- Hauptzentrum Einkaufsinnenstadt
- Stadtteilzentrum Biebrich
- 7 Nahversorgungszentren:
  - Dotzheim
  - Sonnenberg
  - Bierstadt
  - Erbenheim
  - Mainz-Kostheim
  - Mainz-Kastel
  - Schierstein
- perspektivisches Nahversorgungszentrum Schelmengraben

Zusätzlich drei Sonderstandorte:

- Äppelallee / Hagenauer Straße
- Borsigstraße / Ostring
- Boelckestraße / Otto-Suhr-Ring

Wichtig:
**Sonderstandorte sind keine zentralen Versorgungsbereiche und dürfen nicht einfach als „Zentren“ mitgezählt werden.**

## Einkaufsinnenstadt

Im aktuellen Prototyp:

```text
Betriebe: 498
Verkaufsfläche: 96.995 m²
Struktur Verkaufsfläche:
- kurzfristiger Bedarf 19 %
- mittelfristiger Bedarf 52 %
- langfristiger Bedarf 29 %
```

## Stadtteilzentrum Biebrich

Im aktuellen Prototyp:

```text
Betriebe: 67
Verkaufsfläche: 6.095 m²
Struktur Verkaufsfläche:
- kurzfristiger Bedarf ca. 67 %
- mittelfristiger Bedarf ca. 18 %
- langfristiger Bedarf ca. 16 %
```

Versorgungsfunktion:
vor allem südliches Stadtgebiet, insbesondere Biebrich und Schierstein.

Hinweis:
67 Betriebe / 6.095 m² beziehen sich auf das **abgegrenzte Stadtteilzentrum Biebrich**, nicht auf den gesamten Ortsbezirk.

---

# 24. Datenqualität / QA

Vor Produktivbetrieb ist ein QA-Schritt zwingend.

Im Wiesbaden-PDF wurden bereits redaktionelle Copy-Paste-Probleme in einzelnen Zentrenprofilen beobachtet.

Deshalb:

- Inhalte nicht blind automatisiert aus dem PDF übernehmen.
- Geodaten und Profiltexte gegeneinander prüfen.
- Datenstand je Kennzahl sauber dokumentieren.
- Zentrenabgrenzungen mit dem final freigegebenen Konzeptstand abgleichen.
- perspektivische Zentren eindeutig kennzeichnen.
- Vergleichsdaten nur verwenden, wenn räumlich/methodisch vergleichbar.

---

# 25. Content- und Datenquellen sauber trennen

Nicht alle Inhalte gehören in ArcGIS.

Empfohlene Trennung:

## ArcGIS
- räumliche Geometrien
- räumliche IDs
- filterbare Attribute
- WebMaps
- Symbologie

## Kommunale Frontend-Konfiguration
- Seitentitel
- Introtexte
- statische Startseiten-KPIs
- redaktionelle Profiltexte
- erklärende Beispiele
- Navigationskonfiguration
- Feature Flags

## ggf. später CMS / JSON
- längere redaktionelle Inhalte
- Sortimentslisten
- Beispieltexte

Für V1 reicht TypeScript/JSON-Konfiguration.

Kein CMS einführen, bevor ein konkreter Wartungsbedarf dafür besteht.

---

# 26. Hosting

PUBLIC ist eine statische Client-Web-App.

Mögliche Hosts:

- bestehender GMA-Webserver
- statischer Cloudhost
- kommunaler Webserver
- CDN

Beispiele für spätere URLs:

```text
einzelhandel.gma.biz/wiesbaden
```

oder

```text
einzelhandel.<kommune>.de
```

Hosting ist aktuell noch nicht verbindlich festgelegt.

Die App darf deshalb keine hosterspezifischen Annahmen einbauen.

Vite `base` / Routing bei Unterpfaden beachten.

---

# 27. Router / Deployment beachten

Aktuell wird `BrowserRouter` verwendet.

Wenn später auf einem statischen Hosting ohne Server-Rewrite deployed wird, kann das direkte Öffnen von `/zentren` zu einem 404 führen.

Vor Deployment eine der folgenden Lösungen bewusst wählen:

1. Server-Rewrite auf `index.html`
2. HashRouter
3. statische Host-Konfiguration mit SPA fallback

Nicht unbemerkt erst kurz vor Go-Live behandeln.

---

# 28. Barrierefreiheit / Responsive

PUBLIC soll gut bedienbar sein.

Beachten:

- semantische Buttons und Links
- Tastaturbedienbarkeit
- klare Focus States
- sinnvolle ARIA Labels
- ausreichend große Touch Targets
- Text nicht nur über Farbe codieren
- responsive Layouts ab ca. 320 px
- keine horizontal unbedienbaren Kerninhalte
- Karten auf Mobile mit sinnvoller Höhe
- Profilansichten untereinander statt winziger Spalten

Desktop bleibt primär, Mobile PUBLIC muss jedoch ernsthaft funktionieren.

---

# 29. Performance-Prinzipien

Nicht unnötig alle ArcGIS-Daten in den Browser laden.

Für große Layer:

- serverseitige Filter / Definition Expressions prüfen
- ArcGIS Query API sinnvoll nutzen
- LayerView für sichtbare/geladene Features verwenden
- keine redundanten parallelen Queries
- MapViews wiederverwenden, wo sinnvoll
- WebMaps lazy laden
- schwere Seitenmodule lazy importieren
- Charts erst laden, wenn Seite geöffnet wird

Noch keine premature optimization.

Zuerst reale Layergrößen testen.

---

# 30. Was Claude Code NICHT tun soll

Bitte folgende Dinge vermeiden:

- nicht zurück zu einer reinen Experience-Builder-PUBLIC-App wechseln
- nicht die Anwendung in ein allgemeines GIS-Portal verwandeln
- keine komplexen fachlichen Berechnungen in React implementieren
- keine künstliche Live-Datenlogik erfinden
- keine sensiblen Daten nur per CSS/Frontend verstecken
- nicht Wiesbaden hart im UI verteilen
- nicht jede Seite als technische Sonderlösung bauen
- nicht unnötig Backend/Database/Auth für PUBLIC einführen
- nicht Next.js nur aus Gewohnheit migrieren
- nicht das bestehende GMA-Design durch generische Tailwind-/Admin-Dashboard-Optik ersetzen
- nicht blind alle Dependencies upgraden
- keine exakten betrieblichen Verkaufsflächen/Turnover öffentlich zeigen, solange nicht ausdrücklich freigegeben
- keine Ampellogik einsetzen, die rechtliche Zulässigkeit suggeriert
- keine Sonderstandorte als Zentren zählen

---

# 31. Priorisierte nächste Entwicklungsschritte

## PRIORITÄT 1 – bestehenden V1-Code stabilisieren

- `npm install`
- `npm run build`
- vorhandene TypeScript-/Buildfehler beheben
- Design nicht unnötig verändern

## PRIORITÄT 2 – ArcGIS Zentrenintegration

`ArcGISMap` erweitern:

- optionaler Callback `onFeatureSelect`
- Ziel-Layer anhand Titel oder besser konfigurierbarer Layer-ID identifizieren
- `view.hitTest`
- `CENTER_ID`
- React Selection State
- `view.goTo`
- Listenauswahl → Karte hervorheben / zoomen
- Kartenwahl → Liste selektieren

Ziel:
**ein gemeinsamer Selection State.**

## PRIORITÄT 3 – kommunale Config abstrahieren

Den Typ nicht mehr aus `typeof wiesbadenConfig` ableiten.

Besser:

```text
MunicipalityConfig
CenterConfig
ArcGISConfig
OverviewConfig
```

als explizite Types / Interfaces definieren.

Wiesbaden soll eine Instanz davon sein.

## PRIORITÄT 4 – Seiten 3–5 implementieren

In dieser Reihenfolge:

1. Nahversorgung
2. Einzelhandelsstruktur
3. Einzelhandel steuern

## PRIORITÄT 5 – Hosting / Deployment

Erst wenn die Kernmodule funktionieren.

---

# 32. Geplante Komponenten für nächste Ausbaustufe

Bestehende Komponenten beibehalten und ergänzen:

```text
components/
  layout/
    AppHeader
    AppFooter
    PageIntro

  maps/
    ArcGISMap
    MapLegend
    SelectedFeaturePanel

  ui/
    MetricCard
    TopicCard
    InfoCard
    EmptyState
    LoadingState

  centers/
    CenterList
    CenterProfile

  supply/
    SupplyLegend
    MarketInfo

  retail/
    RetailFilterBar
    StoreInfo
    AssortmentChart
    DevelopmentChart

  steering/
    SteeringFlow
    ExampleSwitcher
    AssortmentSearch
```

Keine riesigen Komponenten mit mehreren hundert Zeilen bauen, wenn sinnvoll teilbar.

---

# 33. Geplante Routen

Aktuell:

```text
/
 /zentren
```

Später:

```text
/
 /zentren
 /nahversorgung
 /einzelhandelsstruktur
 /einzelhandel-steuern
```

INTERN nicht in PUBLIC-Routing aufnehmen, solange separate Anwendung.

---

# 34. Seite Nahversorgung – technische Implementierungsvorgabe

Ziel:

- eigene WebMap-ID aus Config
- Map nimmt ca. 70 %
- Informationspanel ca. 30 %
- fertiger Hexagonlayer
- Marktstandorte
- Legende
- Markt anklickbar
- Info: Name, Betriebstyp, optional Logo

Keine Laufzeitberechnung von Isochronen.

Keine Runtime-Erzeugung des Versorgungsindex.

Keine großen Statistik-Dashboards nach Ortsbezirk.

---

# 35. Seite Einzelhandelsstruktur – technische Implementierungsvorgabe

Benötigt:

- WebMap / Store Layer
- drei Filter:
  - Sortiment
  - Standorttyp
  - Raum
- KPI Anzahl Betriebe
- Sortimentsdiagramm
- Entwicklung, falls vorbereitete vergleichbare Daten vorliegen
- Betriebsauswahl

Architektur:

Ein zentraler Filter-State.

Nicht:

```text
Map filter state
Chart filter state
KPI filter state
```

getrennt pflegen.

Sondern:

```text
RetailFilterState
→ Query / Layer Filter
→ result set / statistics
→ Map + KPI + Chart
```

Je nach Datenmenge darf das Ergebnis über ArcGIS Statistics Queries statt clientseitigem Voll-Download erzeugt werden.

---

# 36. Seite Einzelhandel steuern – technische Implementierungsvorgabe

Keine ArcGIS-Abhängigkeit erzwingen.

UI-Module:

- `SteeringFlow`
- `ExampleSwitcher`
- `AssortmentSearch`

Die Inhalte kommen aus kommunaler Konfiguration / Content-Datei.

Sortimentsliste nach drei Kategorien:

- zentrenrelevant
- nahversorgungs- und zentrenrelevant
- nicht zentrenrelevant

Die konkreten Kategorien / Bezeichnungen müssen pro Konzept konfigurierbar bleiben.

---

# 37. ArcGIS IDs / Konfiguration

Aktuell Platzhalter:

```ts
overviewWebMapId: "YOUR_OVERVIEW_WEBMAP_ID",
centersWebMapId: "YOUR_CENTERS_WEBMAP_ID",
```

Neue Module später:

```ts
supplyWebMapId
retailStructureWebMapId
```

Optional zusätzlich:

```ts
centersLayerId
storesLayerId
marketsLayerId
hexagonsLayerId
```

Bevorzugt stabile IDs statt alleiniger Suche nach Layer-Titel, sobald reale ArcGIS-Struktur bekannt ist.

---

# 38. Fehler- und Ladezustände

Alle datenabhängigen UI-Komponenten brauchen:

- loading
- empty
- error

Beispiel:

```text
WebMap lädt
WebMap nicht erreichbar
Layer fehlt
CENTER_ID fehlt
keine Profildaten vorhanden
Filter liefert 0 Betriebe
```

Keine weißen leeren Flächen ohne Erklärung.

---

# 39. Logging

PUBLIC benötigt in V1 keine komplexe Telemetrie.

Während Entwicklung:

- `console.error` bei technischen Fehlern okay
- keine vertraulichen ArcGIS-Response-Inhalte loggen
- später optional zentrales Error Monitoring

Kein Tracking einführen, bevor Datenschutz / Analytics abgestimmt sind.

---

# 40. Tests

Mindestens vor produktiver Nutzung:

## Unit/Component

- CenterList selection
- CenterProfile rendering
- Filter state
- config validation

## Integration

- ArcGIS WebMap load
- Kartenklick → center selection
- Listenklick → Karte
- 70/30 → 30/70
- Back state
- Mobile layout

## fachliche Abnahme

Separat durch GMA:

- Werte
- Kategorien
- Zentrenstatus
- Texte
- Freigaben

Technische Tests ersetzen keine fachliche Abnahme.

---

# 41. Referenz für Claude Code: gewünschter Arbeitsstil

Bei Änderungen:

1. zuerst vorhandene Implementierung lesen
2. kleinsten sinnvollen Änderungsscope wählen
3. bestehende Architektur respektieren
4. wiederverwendbar statt Wiesbaden-spezifisch implementieren
5. keine fachlichen Annahmen erfinden
6. bei fehlenden ArcGIS-Feldnamen konfigurierbare Abstraktion bauen
7. Designrichtung erhalten
8. Build/Test nach Änderungen ausführen
9. in der Antwort kurz dokumentieren:
   - geändert
   - warum
   - offene Punkte
   - wie testen

Bei Unsicherheit über eine fachliche Aussage:
**nicht raten.**
Platzhalter / TODO verwenden und fachliche Freigabe anfordern.

---

# 42. Empfohlener initialer Claude-Code-Auftrag

Nach dem Einchecken dieses Dokuments in das Repository kann Claude Code mit folgendem Auftrag gestartet werden:

```text
Lies zuerst CLAUDE.md und PROJECT_HANDOFF.md vollständig und inspiziere anschließend den bestehenden Code.

Ziel ist die Weiterentwicklung des bestehenden GMA Digitales-Einzelhandelskonzept-Webtemplates, nicht ein Neuaufbau.

Arbeite zunächst nur an der bestehenden V1:
1. Installiere Dependencies und führe einen Build aus.
2. Behebe nur tatsächliche Build-/TypeScript-Probleme.
3. Refaktoriere die kommunale Konfiguration auf explizite wiederverwendbare Types.
4. Erweitere ArcGISMap so, dass optional ein Zentren-Feature aus einem konfigurierten Layer per hitTest ausgewählt werden kann und CENTER_ID an CentersPage zurückgegeben wird.
5. Sorge dafür, dass Listen- und Kartenauswahl denselben React-State nutzen.
6. Bei Listenauswahl soll die Karte – sofern ArcGIS aktiv ist – auf das gewählte Feature zoomen.
7. Erhalte die bestehende 70/30 → 30/70-UX und das GMA-Design.
8. Verwende weiterhin den vorhandenen Karten-Fallback, wenn noch keine echte WebMap-ID konfiguriert ist.
9. Keine neuen fachlichen Berechnungen implementieren.
10. Nach Abschluss Build ausführen und Änderungen dokumentieren.

Wenn für die echte ArcGIS-Verknüpfung konkrete Layer-IDs oder Feldnamen fehlen, baue die Schnittstelle konfigurierbar und dokumentiere exakt, welche Werte später geliefert werden müssen. Erfinde keine produktiven IDs.
```

---

# 43. Produktdefinition in einem Satz

**Das GMA Digitale Einzelhandelskonzept ist eine wiederverwendbare, responsive Web-App, die fachlich fertig vorbereitete kommunale Einzelhandelsdaten und ArcGIS-Karten in einem hochwertigen GMA-Datenprodukt für Öffentlichkeit und später Fachverwaltung zugänglich macht.**

---

# 44. Definition of Done für PUBLIC V1

PUBLIC V1 ist konzeptionell fertig, wenn:

- Überblick funktionsfähig
- Zentren & Standorte funktionsfähig
- Nahversorgung funktionsfähig
- Einzelhandelsstruktur funktionsfähig
- Einzelhandel steuern funktionsfähig
- reale öffentliche ArcGIS-WebMaps angebunden
- Datenfreigaben geprüft
- Wiesbaden nur Konfiguration, kein Hardcoding
- Responsive geprüft
- Accessibility-Basics umgesetzt
- Build / Deployment reproduzierbar
- kommunale Anpassung dokumentiert
- fachliche Inhalte separat freigegeben

Der interne Standort-Check ist **nicht Voraussetzung** für PUBLIC V1.

---

# 45. Dateien im aktuellen Projekt, die zuerst gelesen werden sollen

In dieser Reihenfolge:

```text
CLAUDE.md
PROJECT_HANDOFF.md
README.md
ARCHITECTURE.md
package.json
src/config/municipalities/wiesbaden.ts
src/App.tsx
src/pages/OverviewPage.tsx
src/pages/CentersPage.tsx
src/components/maps/ArcGISMap.tsx
src/components/centers/CenterList.tsx
src/components/centers/CenterProfile.tsx
src/styles/gma-theme.css
```

Danach erst Änderungen vornehmen.
