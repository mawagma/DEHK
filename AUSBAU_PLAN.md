# Ausbauauftrag: Inhalte und Auswertungen erweitern

Stand: Oktober 2026 · Ergänzt `PROJECT_HANDOFF.md` und `CLAUDE.md` (beide gelten weiter und gehen bei Konflikten vor).

## Ziel

Die bestehende Version **ausbauen, nicht neu bauen**. Seiten, Komponenten, Design, Hash-Routing, Demo-Mechanik und Tests bleiben erhalten und werden ergänzt.

Fehlende Fachinhalte werden **mit Platzhaltern und Demodaten** integriert, damit Struktur und Auswertungen sichtbar und präsentierbar sind. Echte Werte liefert GMA später über dieselben Konfigurationsfelder nach.

## Arbeitsregeln

1. Erst `CLAUDE.md`, `PROJECT_HANDOFF.md` und diesen Auftrag lesen, dann den Code.
2. In Phasen arbeiten (unten). Nach jeder Phase: `npm run build`, `npm test`, `npm run build:pages`, kurz dokumentieren (geändert / warum / offen / wie testen), committen.
3. Neue Inhalte gehören in die Kommunen-Konfiguration (`src/config/types.ts` + `src/config/municipalities/wiesbaden.ts`), neue Demo-Geodaten und Demo-Attribute in `src/demo/`. Nichts Wiesbaden-Spezifisches in Seiten oder Komponenten.
4. **Alle neuen Config-Felder optional.** Fehlt ein Feld, wird der Block ausgeblendet oder zeigt einen dezenten Leerzustand – nie eine leere Fläche.
5. **Platzhalter kennzeichnen:** Platzhaltertexte beginnen mit `[Platzhalter]` bzw. tragen im Code `// TODO fachlich: …`. Erfundene Zahlen nur in `src/demo/` oder als klar markierte Demo-Werte; bei `isDemo: true` bleibt der Hinweis „Beispieldaten“ sichtbar.
6. **Keine Fachberechnungen im Frontend.** Zählen, Summieren und Anteile des gefilterten Bestands sind erlaubt (gibt es schon). Indizes, Distanzen, Einwohner je Zelle, Entwicklungswerte kommen als fertige Attribute/Tabellen (in der Demo: in `src/demo/` erzeugt).
7. **Datenschutz PUBLIC:** keine exakte Verkaufsfläche und kein Umsatz je Betrieb; Verkaufsfläche nur aggregiert.
8. **Keine Ampellogik** (grün/rot), die Zulässigkeit suggeriert.
9. **Sonderstandorte nie als Zentren zählen** – auch nicht in neuen Rankings, Vergleichen oder Summen.
10. Bestehende Komponenten wiederverwenden (`MetricCard`, `BarChart`, `DonutChart`, `ColumnChart`, `Hint`, `PageIntro`, `SchematicMap`, `MapPanel`). Keine neuen Abhängigkeiten ohne klaren Grund; Diagramme weiter mit eigenen leichten Komponenten.
11. Barrierefreiheit wie bisher: semantische Buttons, Fokuszustände, ARIA-Labels, Diagramme mit Textalternative, mobil ab 320 px bedienbar.
12. Für jede neue Logik in `src/lib/` mindestens einen kleinen Vitest-Test.

---

## Phase 1 – Konfiguration und Inhalte erweitern (Platzhalter)

### 1.1 Typen erweitern (`src/config/types.ts`)

`CenterConfig` – zusätzlich, alle optional:

```ts
location?: string;            // Lage, Ausdehnung, Erreichbarkeit
supplyFunction?: string;      // Einzugsbereich / Versorgungsfunktion
shareOfCityStoresPct?: number;
vacancies?: number;           // Leerstehende Ladenlokale
anchors?: string[];           // Magnetbetriebe als Betriebstyp, ohne Flächen
strengths?: string[];
weaknesses?: string[];
goal?: { label: string; text: string };   // z. B. "Sichern", "Stärken", "Qualifizieren" – neutral, keine Ampel
recommendations?: string[];
development?: ShareRow[];     // Betriebe je Erhebungsjahr, nur wenn Abgrenzung vergleichbar
image?: HeroImage;
prospectNote?: string;        // nur perspektivische Zentren: Voraussetzungen, Zeithorizont
```

`MunicipalityConfig` – zusätzlich, optional:

```ts
decisionStatus?: string;                    // z. B. "[Platzhalter] Entwurf, Beschluss geplant für …"
overview.keyMessages?: string[];            // 3 Kernaussagen
overview.whatsNew?: string[];               // 3–5 Änderungen ggü. Vorgängerkonzept
about?: {
  intro: string; process: string[]; method: { title: string; text: string }[];
  dataSources: { label: string; status: string }[];
  downloads: { label: string; url: string }[];
};
glossary?: { term: string; definition: string }[];
contact.person?: { name: string; role: string; email?: string; phone?: string };
retail.needLevelByAssortment?: Record<string, string>;   // Warengruppe -> kurz-/mittel-/langfristig
retail.keyMessages?: string[];
retail.storeDefinition?: string;
supply.keyMessages?: string[];
supply.gaps?: { area: string; text: string }[];
supply.complementary?: string;              // Lebensmittelhandwerk, Wochenmärkte …
steering.guidelines?: { id: string; title: string; text: string; appliesTo: string }[];  // Ansiedlungsleitsätze
steering.matrix?: { rows: string[]; cols: string[]; cells: string[][] };  // neutrale Labels, z. B. "vorrangig", "unter Bedingungen", "nicht vorgesehen"
steering.procedure?: { title: string; text: string }[];
AssortmentGroup.items -> zusätzlich Objektform { name: string; synonyms?: string[]; note?: string } (string weiterhin erlaubt)
SteeringExample.centerId?: string;          // Verlinkung auf Zentrenprofil
```

`ModuleId` / Navigation: neue Route `/ueber-das-konzept` (nicht in der Hauptnavigation, sondern im Footer und als Link aus Hinweisblöcken), per `modules` abschaltbar.

### 1.2 Wiesbaden-Konfiguration füllen

- Alle 13 Standorte mit Profilfeldern füllen (Platzhaltertexte, plausible Demo-Zahlen). Die 7 Nahversorgungszentren und 3 Sonderstandorte bekommen **unterschiedliche** Texte, nicht mehr einen gemeinsamen Satz.
- Sortimentsliste auf ca. 40–50 Einträge mit Synonymen erweitern (z. B. Fahrräder ← „Fahrrad, E-Bike“; Telekommunikation ← „Handy, Smartphone“; Zoologischer Bedarf ← „Tierfutter“; Matratzen, Bettwaren).
- 5 Ansiedlungsleitsätze, Matrix Standort × Sortiment, 6 Beispiele, 7 FAQs, 4 Verfahrensschritte, ca. 12 Glossarbegriffe (ZVB, Sonderstandort, zentrenrelevant, nahversorgungsrelevant, Verkaufsfläche, großflächig/800 m², Kaufkraft, Zentralität, Bedarfsstufen, Randsortiment, integrierte Lage, Nahversorgungsindex).
- `decisionStatus`, `contact.person`, `about`, Downloads als Platzhalter (`url: "#"` mit Hinweis „folgt“).
- Config-Test (`src/test/config.test.ts`) erweitern: IDs eindeutig, `steering.examples[].centerId` existiert, Matrix rechteckig, keine Sonderstandorte in ZVB-Zählungen.

---

## Phase 2 – Seiteninhalte ausbauen

### Überblick
- 4 statt 3 Kennzahlen: Betriebe, Verkaufsfläche gesamt, Verkaufsfläche je Einwohner, Einzelhandelszentralität (Demo-Werte, `meta` = Datenstand). Kleiner Trendhinweis im `meta`, z. B. „−4 % seit 2015“ (vorbereiteter Wert).
- Block „Kernaussagen“ (3 Punkte) unter dem Hero.
- Block „Was ist neu?“ (kompakt, 3–5 Punkte) mit Link auf „Über das Konzept“.
- `decisionStatus` im Hero-Eyebrow bzw. direkt darunter.

### Zentren & Standorte
- `CenterProfile` als Steckbrief ausbauen: Lage, Versorgungsfunktion, 3–4 Kennzahlen (Betriebe, Verkaufsfläche, Anteil Gesamtstadt, Leerstand), Bedarfsstufen-Diagramm (gibt es), Magnetbetriebe als Chips, Stärken/Schwächen zweispaltig, Entwicklungsziel als neutrales Badge + Satz, Empfehlungen als Liste, optional Bild.
- Perspektivische Zentren: `prospectNote` deutlich anzeigen.
- Sonderstandorte: eigenes, schlankeres Profil (Ausrichtung, Steuerungsziel), weiterhin Chip „Kein zentraler Versorgungsbereich“.
- Button im Profil „Betriebe in diesem Bereich ansehen →“ – öffnet Einzelhandelsstruktur mit gesetztem Filter (siehe Phase 3, Filter in URL).
- Unter der Zentrenliste: kompakte, sortierbare Tabelle der ZVB (Name, Kategorie, Betriebe, Verkaufsfläche). Sonderstandorte als eigene Gruppe darunter, nicht mitsummiert.
- **Zentrenvergleich:** 2–3 Zentren auswählbar, Kennzahlen und Bedarfsstufen nebeneinander. Zustand in der URL (`?vergleich=innenstadt,biebrich`).

### Nahversorgung
- Kernaussagen, „Versorgungslücken“ (2–3 Bereiche mit Text) und Hinweis zu ergänzenden Angeboten im Seitenpanel bzw. unter der Karte.
- Methodik verständlich: kleine Erklärgrafik „Erreichbarkeit + Angebot = Index“ (statisches SVG/CSS), Link auf „Über das Konzept“.

### Einzelhandel steuern
- Neues Kapitel „Ansiedlungsleitsätze“ (nach Grundprinzipien) und „Verfahren“ (am Ende, mit Ansprechpartner).
- Matrix Standort × Sortiment als Tabelle mit neutralen Textlabels und Legende; Hinweis „keine Einzelfallprüfung“.
- Sortimentssuche über Namen **und** Synonyme; Treffer zeigen, über welches Synonym gefunden wurde. Test dafür.
- Bei einem Sortimentstreffer: Link „Wo gibt es das heute?“ → Einzelhandelsstruktur mit passendem Sortimentsfilter (über Mapping Sortiment → Warengruppe; fehlt das Mapping, Link ausblenden).
- Beispiele mit `centerId` verlinken auf das Zentrenprofil.
- Kapitelwahl in der URL (`?kapitel=sortimentsliste`), damit Links aus anderen Seiten direkt springen.

### Neue Seite „Über das Konzept“
- Anlass/Prozess, Beschlussstand, Methodik & Datenstand je Datenquelle, Glossar (alphabetisch, mit Anker), Downloads, Ansprechpartner.
- Glossarbegriffe auf anderen Seiten dezent verlinken (z. B. „zentraler Versorgungsbereich“ im Zentrenprofil) – einfache Komponente `GlossaryTerm`, kein automatisches Text-Parsing.
- Footer um Links „Über das Konzept“, „Glossar“, „Konzept (PDF)“ ergänzen.

---

## Phase 3 – Auswertungen Einzelhandelsstruktur

Ein Filterzustand bleibt die einzige Quelle für Karte, Kennzahlen und Diagramme (wie heute).

1. **Filter in der URL** (`?sortiment=…&lage=…&raum=…`), analog zur Zentrenseite; Zurück/Teilen funktionieren.
2. **Mehrfachauswahl** für Sortiment und Raum (UI: Checkbox-Dropdown oder Chips); `RetailFilter` auf Arrays umstellen, `filterStores` + Tests anpassen.
3. **Aktive Filter als Chips** mit „×“ und „Alle zurücksetzen“.
4. **Absolut + Prozent** in allen Diagrammen („212 · 13 %“).
5. **Referenz Gesamtstadt:** `BarChart` optional um eine zweite, graue Referenzreihe erweitern; nur anzeigen, wenn ein Filter aktiv ist.
6. **Klick auf Balken setzt Filter** (Balken als Button, tastaturbedienbar).
7. **Größenklassen-Diagramm** (Feld `sizeClass` existiert).
8. **Bedarfsstufen-Diagramm** über `retail.needLevelByAssortment`.
9. **Kreuztabelle Standorttyp × Warengruppe** (Anzahl, Zellen dezent eingefärbt) als aufklappbarer Block unter der Karte.
10. **Gefilterte Entwicklung:** Demo-Tabelle Betriebe je Erhebungsjahr × Warengruppe × Standorttyp in `src/demo/` erzeugen; `ColumnChart` zeigt die Reihe zur aktuellen Auswahl. Bei Raumfilter ohne vorbereitete Daten: Hinweis statt Zahl.
11. **Kleine Fallzahlen unterdrücken:** zentrale Funktion in `src/lib/` (Schwelle in der Config, Standard 3). Unter der Schwelle „weniger als 3“ und keine Größenklassen-/Kreuztabellenwerte. Test dafür.
12. **Export** der aktuellen aggregierten Auswertung als CSV (nur Zählungen/Anteile, keine Einzelbetriebe).
13. Optional, zuletzt: Schalter „sichtbaren Kartenausschnitt auswerten“ (im Handoff vorgesehen). Wenn mit `SchematicMap` zu aufwendig: Schnittstelle vorbereiten und als offen dokumentieren.

---

## Phase 4 – Auswertungen Nahversorgung

1. **Demo-Attribute je Hexagon** in `src/demo/`: `pop` (Einwohner), `nearestMarketM` (Distanz zum nächsten Markt), `marketsInWalk` (Märkte im Fußweg). Diese Werte gelten als „von GMA geliefert“ – die Seite rechnet sie nicht.
2. **Stadtweite Auswertung auf Einwohner umstellen:** „Anteil der Einwohner nach Versorgungsgrad“ statt Anteil der Rasterzellen; Kennzahl „x % der Einwohner hoch oder sehr hoch versorgt“.
3. **Hexagon-Auswahl:** Klasse, Einwohner (gerundet, ab Schwelle), nächster Markt in ca. x m, Märkte im Fußweg.
4. **Marktfilter nach Betriebstyp** (Legende klickbar), mit Anzahl je Typ.
5. **Adresssuche „Wie ist meine Adresse versorgt?“:** Komponente mit klarer Schnittstelle. Mit echter WebMap: ArcGIS-Geocoder → Hexagon am Punkt abfragen. In der Demo: Auswahl aus 5–8 Beispieladressen mit festen Punkten, Ergebnis wie Hexagon-Auswahl + Markierung in der Karte.
6. Optional schlank: Rangliste Ortsbezirke nach Einwohneranteil gut versorgt (vorbereitete Demo-Tabelle), kein Dashboard.

---

## Nicht Teil dieses Auftrags

- Echte ArcGIS-IDs, echte Fachwerte, interner Standort-Check, CMS, Tracking, Dependency-Upgrades, Redesign.

## Definition of Done

- Alle Phasen gebaut, Build und Tests grün, `docs/` neu gebaut.
- Jede Seite zeigt mit Demodaten vollständige Inhalte; jeder Platzhalter ist als solcher erkennbar.
- Eine Liste aller Platzhalter/TODO-Felder (Datei, Feld, was GMA liefern muss) als `CONTENT_TODO.md` im Repo.

---

## Umsetzungsstand

### Phase 1 – erledigt
- **Geändert:** `src/config/types.ts` um alle optionalen Felder aus 1.1 erweitert (Zentrenprofil, Kernaussagen, „Was ist neu“, Über das Konzept, Glossar, Ansprechperson, Leitsätze, Matrix, Verfahren, Sortimente mit Synonymen, `centerId` in Beispielen). Modul `ueber-das-konzept` ist optional schaltbar. `src/config/municipalities/wiesbaden.ts` mit Platzhaltern gefüllt (13 Standortprofile mit eigenen Texten, 44 Sortimente mit Synonymen, 5 Leitsätze, Matrix, 6 Beispiele, 7 FAQ, 4 Verfahrensschritte, 12 Glossarbegriffe). `src/lib/assortments.ts` für Sortimente als Text oder Objekt. Demo-Betriebe je Zentrum folgen jetzt den Profilzahlen.
- **Warum:** Struktur für Phase 2–4; GMA ersetzt später nur Werte.
- **Offen:** Anzeige der neuen Felder folgt in Phase 2. Liste der Platzhalter: `CONTENT_TODO.md`.
- **Wie testen:** `npm test` (Config-Tests: IDs eindeutig, Beispiel-Verlinkungen gültig, Matrix rechteckig, Sonderstandorte keine ZVB, unterschiedliche Texte).

### Phase 2 – erledigt
- **Geändert:**
  - Überblick: 4 Kennzahlen (Betriebe, Verkaufsfläche gesamt, VK je Einwohner, Zentralität; Trend im `meta`), Beschlussstand im Einstieg, Block „Kernaussagen“, Block „Was ist neu?“ mit Link auf „Über das Konzept“.
  - Zentren: Steckbrief (`CenterProfile`) mit Lage, Versorgungsfunktion, 4 Kennzahlen, Bedarfsstufen, Magnetbetrieben, Stärken/Schwächen, neutralem Entwicklungsziel, Empfehlungen, Entwicklung; Hinweis bei perspektivischen Zentren; schlankes Profil für Sonderstandorte; Button „Betriebe in diesem Bereich ansehen“ (`/einzelhandelsstruktur?zentrum=…`, wird in Phase 3 ausgewertet). Sortierbare Tabelle aller Standorte (`CenterTable`): ZVB mit Summe, Sonderstandorte getrennt und nicht summiert. Zentrenvergleich (`CenterCompare`) mit 2–3 ZVB über `?vergleich=a,b`.
  - Nahversorgung: Kernaussagen, Versorgungslücken, ergänzende Angebote, Erklärgrafik „Erreichbarkeit + Angebot = Versorgungsgrad“ (`SupplyInsights`).
  - Steuern: Kapitel „Ansiedlungsleitsätze“, „Standort × Sortiment“ (Matrix mit neutralen Labels + Legende + Hinweis), „Verfahren“ mit Ansprechperson; Kapitel in der URL (`?kapitel=`); Sortimentssuche über Namen und Synonyme mit Anzeige „gefunden über …“ und Link „Wo gibt es das heute?“ (`?sortiment=…`, Mapping über `retailGroup`); Beispiele verlinken aufs Zentrenprofil.
  - Neue Seite „Über das Konzept“ (`/ueber-das-konzept`): Anlass/Prozess, Beschlussstand, Methodik, Datenstand, Glossar mit Sprungziel (`?begriff=`), Downloads, Ansprechperson. `GlossaryTerm` für dezente Begriffslinks. Footer: „Über das Konzept“, „Glossar“, „Konzept (PDF)“.
  - Neue Logik in `src/lib/` (`centers.ts`, `assortments.ts`, `about.ts`) mit Tests.
- **Offen:** Filter aus der URL (`?zentrum=`, `?sortiment=`) wertet die Einzelhandelsstruktur erst in Phase 3 aus.
- **Wie testen:** `npm test` (37 Tests); im Browser z. B. `#/zentren?vergleich=innenstadt,biebrich`, `#/einzelhandel-steuern?kapitel=sortimentsliste` (Suche „E-Bike“), `#/ueber-das-konzept?begriff=grossflaechigkeit`.
