# Inhalte, die GMA noch liefern muss

Alle Felder liegen in `src/config/municipalities/wiesbaden.ts` (Typen: `src/config/types.ts`), sofern nicht anders angegeben.
Platzhaltertexte beginnen mit `[Platzhalter]`, erfundene Zahlen sind im Code mit `Demo-Wert` / `TODO fachlich` markiert.
Solange `isDemo: true` gilt, zeigt die Seite den Hinweis „Prototyp mit Beispieldaten“.

| Bereich | Feld | Was GMA liefern muss |
|---|---|---|
| Allgemein | `decisionStatus` | Tatsächlicher Beschlussstand des Konzepts |
| Allgemein | `contact.person` | Name, Funktion, E-Mail/Telefon der Ansprechperson |
| Überblick | `overview.keyMessages` | 3 freigegebene Kernaussagen |
| Überblick | `overview.whatsNew` | 3–5 Änderungen gegenüber dem Vorgängerkonzept |
| Zentren | `centers[].location`, `supplyFunction` | Lage/Erreichbarkeit und Versorgungsfunktion je Standort |
| Zentren | `centers[].stores`, `salesAreaM2` | Werte für alle Nahversorgungszentren und Sonderstandorte (Innenstadt und Biebrich sind aus dem Gutachten) |
| Zentren | `centers[].shareOfCityStoresPct`, `vacancies` | Anteil an allen Betrieben, Leerstand je Standort |
| Zentren | `centers[].structure` | Bedarfsstufen je Nahversorgungszentrum |
| Zentren | `centers[].anchors`, `strengths`, `weaknesses` | Magnetbetriebe (nur Betriebstyp), Stärken, Schwächen |
| Zentren | `centers[].goal`, `recommendations` | Entwicklungsziel (neutral) und Empfehlungen |
| Zentren | `centers[].development` | Betriebe je Erhebungsjahr, nur bei vergleichbarer Abgrenzung |
| Zentren | `centers[schelmengraben].prospectNote` | Voraussetzungen und Zeithorizont |
| Nahversorgung | `supply.keyMessages`, `supply.gaps`, `supply.complementary` | Kernaussagen, Versorgungslücken, ergänzende Angebote |
| Struktur | `retail.needLevelByAssortment` | Zuordnung Warengruppe → Bedarfsstufe bestätigen |
| Struktur | `retail.keyMessages`, `retail.storeDefinition` | Kernaussagen, Definition „Einzelhandelsbetrieb“ |
| Steuern | `steering.guidelines` | Ansiedlungsleitsätze aus dem Konzept |
| Steuern | `steering.matrix` | Matrix Standort × Sortiment (neutrale Labels) bestätigen |
| Steuern | `steering.examples` (neue 3 Beispiele) | Fachliche Einordnung prüfen |
| Steuern | `steering.assortmentGroups` | Vollständige Sortimentsliste mit Synonymen |
| Steuern | `steering.faqs`, `steering.procedure` | Antworten und Verfahrensschritte |
| Über das Konzept | `about.*` | Anlass, Prozess, Methodik, Datenquellen mit Stand, Downloads (URLs) |
| Glossar | `glossary` | Definitionen prüfen |
| Demo-Daten | `src/demo/` | Werden komplett durch ArcGIS-Daten ersetzt (Geometrien, Betriebe, Märkte, Hexagone, Entwicklung) |
| Struktur | `retail.minCount` | Schwelle für kleine Fallzahlen bestätigen (Standard 3) |
| Struktur | Entwicklungstabelle (heute `src/demo/`) | Betriebe je Erhebungsjahr × Warengruppe × Standorttyp als Tabelle/Layer |
| Struktur | Zuordnung Betrieb → Zentrum (heute `src/demo/`) | Attribut im öffentlichen Betriebslayer, z. B. `CENTER_ID` |
