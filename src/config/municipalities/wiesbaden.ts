import type { CenterConfig, MunicipalityConfig } from "../types";

// Referenzkommune. Werte aus dem Prototyp/Gutachten 2026; vor Veröffentlichung fachlich freigeben.
// Konvention: Texte mit "[Platzhalter]" und Zahlen mit "Demo-Wert" sind erfunden und werden von GMA ersetzt.

const P = "[Platzhalter] ";

const bedarf = (kurz: number, mittel: number, lang: number) => [
  { label: "Kurzfristiger Bedarf", value: kurz },
  { label: "Mittelfristiger Bedarf", value: mittel },
  { label: "Langfristiger Bedarf", value: lang }
];

/** Nahversorgungszentrum mit typischen Profilfeldern; Zahlen sind Demo-Werte. */
function nvz(id: string, name: string, d: {
  stores: number; area: number; share: number; vacancies: number; anchors: string[];
  location: string; fn: string; strengths: string[]; weaknesses: string[]; goal: [string, string]; recs: string[]; mix: [number, number, number];
}): CenterConfig {
  return {
    id, name, categoryId: "nvz", status: "bestehend",
    shortText: `${P}Nahversorgungszentrum ${name}: ${d.fn}`,
    // TODO fachlich: Demo-Werte Betriebe, Verkaufsfläche, Anteil, Leerstand
    stores: d.stores, salesAreaM2: d.area, shareOfCityStoresPct: d.share, vacancies: d.vacancies,
    structureCaption: "Anteil an der Verkaufsfläche (Demo-Wert)", structure: bedarf(...d.mix),
    location: P + d.location, supplyFunction: P + d.fn, anchors: d.anchors,
    strengths: d.strengths.map(s => P + s), weaknesses: d.weaknesses.map(s => P + s),
    goal: { label: d.goal[0], text: P + d.goal[1] }, recommendations: d.recs.map(s => P + s)
  };
}

/** Sonderstandort: schlankes Profil (Ausrichtung, Steuerungsziel). Kein zentraler Versorgungsbereich. */
function sst(id: string, name: string, d: { stores: number; area: number; anchors: string[]; orientation: string; goal: [string, string] }): CenterConfig {
  return {
    id, name, categoryId: "sst", status: "bestehend",
    shortText: `${P}${d.orientation}`,
    stores: d.stores, salesAreaM2: d.area, // TODO fachlich: Demo-Werte
    anchors: d.anchors, goal: { label: d.goal[0], text: P + d.goal[1] }
  };
}

export const wiesbadenConfig: MunicipalityConfig = {
  id: "wiesbaden",
  municipality: "Wiesbaden",
  title: "Digitales Einzelhandelskonzept",
  conceptStatus: "Konzeptfassung 2026",
  dataStatus: "Einzelhandelserhebung 2025",
  // TODO fachlich: tatsächlichen Beschlussstand eintragen
  decisionStatus: `${P}Entwurf – Beschluss durch die Stadtverordnetenversammlung geplant`,
  isDemo: true,
  heroImage: {
    src: "./images/wiesbaden-neroberg.webp",
    focusX: "46%",
    credit: {
      author: "Martin Kraft",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:MK_36878-82_Wiesbaden_vom_Neroberg.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
    }
  },
  // Fotos von gma.biz (Nutzungsrechte geklärt)
  pageImages: {
    zentren: { src: "./images/gma/zentren.webp", cardSrc: "./images/gma/zentren-card.webp" },
    nahversorgung: { src: "./images/gma/nahversorgung.webp", cardSrc: "./images/gma/nahversorgung-card.webp" },
    einzelhandelsstruktur: { src: "./images/gma/einzelhandelsstruktur.webp", cardSrc: "./images/gma/einzelhandelsstruktur-card.webp" },
    "einzelhandel-steuern": { src: "./images/gma/einzelhandel-steuern.webp", cardSrc: "./images/gma/einzelhandel-steuern-card.webp" }
  },
  modules: { zentren: true, nahversorgung: true, einzelhandelsstruktur: true, "einzelhandel-steuern": true, "ueber-das-konzept": true },

  contact: {
    email: "info@gma.biz",
    imprintUrl: "https://gma.biz/impressum/",
    privacyUrl: "https://gma.biz/datenschutz/",
    // TODO fachlich: Ansprechpartner bei Stadt bzw. GMA
    person: { name: `${P}Name Ansprechpartner/in`, role: `${P}Stadtplanungsamt, Abteilung Stadtentwicklung`, email: "info@gma.biz" }
  },

  arcgis: {
    portalUrl: import.meta.env.VITE_ARCGIS_PORTAL_URL || "https://www.arcgis.com",
    // Platzhalter durch öffentliche ArcGIS-Online-WebMap-Item-IDs ersetzen.
    webMaps: {
      overview: "YOUR_OVERVIEW_WEBMAP_ID",
      centers: "YOUR_CENTERS_WEBMAP_ID",
      supply: "YOUR_SUPPLY_WEBMAP_ID",
      retailStructure: "YOUR_RETAILSTRUCTURE_WEBMAP_ID"
    },
    centersLayerId: undefined,
    centerIdField: "CENTER_ID"
  },

  overview: {
    headline: "Einzelhandel für starke Zentren",
    intro:
      "Das Digitale Einzelhandelskonzept zeigt, wo und wie sich der Einzelhandel in der Stadt entwickelt – für lebendige Zentren, eine gute Nahversorgung und eine nachhaltige Stadtentwicklung.",
    metrics: [
      { value: "1.606", label: "Einzelhandelsbetriebe", meta: "Erhebung 2025 · −4 % seit 2015 (Demo-Wert)" }, // TODO fachlich: Trend
      { value: "485.870 m²", label: "Verkaufsfläche gesamt", meta: "Erhebung 2025" },
      { value: "1,7 m²", label: "Verkaufsfläche je Einwohner", meta: "Demo-Wert · Bund: 1,5 m²" }, // TODO fachlich
      { value: "112", label: "Einzelhandelszentralität", meta: "Demo-Wert · über 100 = Kaufkraftzufluss" } // TODO fachlich
    ],
    keyMessages: [
      `${P}Die Einkaufsinnenstadt bleibt der wichtigste Einzelhandelsstandort mit gesamtstädtischer und regionaler Ausstrahlung.`,
      `${P}Die Nahversorgung ist in den meisten Stadtteilen gut; einzelne Randbereiche sind fußläufig unterversorgt.`,
      `${P}Neue großflächige Vorhaben mit zentrenrelevanten Sortimenten sollen auf die zentralen Versorgungsbereiche gelenkt werden.`
    ],
    whatsNew: [
      `${P}Schelmengraben als perspektivisches Nahversorgungszentrum aufgenommen.`,
      `${P}Abgrenzung des Stadtteilzentrums Biebrich angepasst.`,
      `${P}Sortimentsliste aktualisiert (u. a. Fahrräder und E-Bikes neu eingeordnet).`,
      `${P}Nahversorgung erstmals als flächendeckender Versorgungsindex dargestellt.`
    ]
  },

  centerCategories: [
    { id: "hz", label: "Hauptzentrum", groupLabel: "Hauptzentrum", isCentralSupplyArea: true, symbol: "square", color: "#005783" },
    { id: "stz", label: "Stadtteilzentrum", groupLabel: "Stadtteilzentrum", isCentralSupplyArea: true, symbol: "triangle", color: "#006da8" },
    { id: "nvz", label: "Nahversorgungszentrum", groupLabel: "Nahversorgungszentren", isCentralSupplyArea: true, symbol: "circle", color: "#2a9d8f" },
    { id: "sst", label: "Sonderstandort", groupLabel: "Sonderstandorte", isCentralSupplyArea: false, symbol: "diamond", color: "#e08a2c" }
  ],

  centers: [
    {
      id: "innenstadt",
      name: "Einkaufsinnenstadt",
      categoryId: "hz",
      status: "bestehend",
      shortText: "Hauptzentrum mit gesamtstädtischer und regionaler Versorgungsfunktion.",
      stores: 498,
      salesAreaM2: 96995,
      structureCaption: "Anteil an der Verkaufsfläche",
      structure: bedarf(19, 52, 29),
      shareOfCityStoresPct: 31, // TODO fachlich: Demo-Wert
      vacancies: 34, // TODO fachlich: Demo-Wert
      location: `${P}Historische Innenstadt zwischen Wilhelmstraße, Kirchgasse und Langgasse; sehr gut mit Bus erreichbar, mehrere Parkhäuser.`,
      supplyFunction: `${P}Gesamtstädtische und regionale Versorgung, insbesondere mit Gütern des mittel- und langfristigen Bedarfs.`,
      anchors: ["Warenhaus", "Textilkaufhaus", "Elektronikfachmarkt", "Buchkaufhaus"],
      strengths: [`${P}Dichter, vielfältiger Besatz`, `${P}Hohe Aufenthaltsqualität in der Fußgängerzone`, `${P}Starke Gastronomie`],
      weaknesses: [`${P}Steigender Leerstand in Nebenlagen`, `${P}Filialisierung in den Hauptlagen`],
      goal: { label: "Stärken", text: `${P}Rolle als regionaler Einkaufs- und Erlebnisort sichern und weiterentwickeln.` },
      recommendations: [`${P}Leerstandsmanagement für Nebenlagen`, `${P}Ansiedlung zentrenrelevanter Magnetbetriebe vorrangig hier`, `${P}Aufenthaltsqualität und Erreichbarkeit verbessern`],
      development: [{ label: "2015", value: 521 }, { label: "2020", value: 507 }, { label: "2025", value: 498 }] // TODO fachlich: Demo-Werte 2015/2020
    },
    {
      id: "biebrich",
      name: "Biebrich",
      categoryId: "stz",
      status: "bestehend",
      shortText:
        "Versorgungsfunktion im Wesentlichen für das südliche Stadtgebiet, insbesondere Biebrich und Schierstein. Kennzahlen beziehen sich auf das abgegrenzte Stadtteilzentrum, nicht auf den Ortsbezirk.",
      stores: 67,
      salesAreaM2: 6095,
      structureCaption: "Anteil an der Verkaufsfläche",
      structure: bedarf(67, 18, 16),
      shareOfCityStoresPct: 4.2, // TODO fachlich: Demo-Wert
      vacancies: 6, // TODO fachlich: Demo-Wert
      location: `${P}Entlang der Rathausstraße und um den Biebricher Marktplatz; Bushaltestellen im Zentrum, nahe Rheinufer.`,
      supplyFunction: "Versorgung im Wesentlichen für das südliche Stadtgebiet, insbesondere Biebrich und Schierstein.",
      anchors: ["Supermarkt", "Lebensmitteldiscounter", "Drogeriemarkt"],
      strengths: [`${P}Gute Nahversorgung mit mehreren Lebensmittelmärkten`, `${P}Kurze Wege im kompakten Zentrum`],
      weaknesses: [`${P}Geringes Angebot im mittelfristigen Bedarf`, `${P}Einzelne Leerstände in Randlagen`],
      goal: { label: "Sichern", text: `${P}Versorgungsfunktion für den Wiesbadener Süden sichern und Angebot im mittelfristigen Bedarf ergänzen.` },
      recommendations: [`${P}Ergänzende Fachgeschäfte im mittelfristigen Bedarf ansiedeln`, `${P}Marktplatz als Aufenthaltsort stärken`],
      development: [{ label: "2015", value: 72 }, { label: "2020", value: 70 }, { label: "2025", value: 67 }] // TODO fachlich: Demo-Werte 2015/2020
    },
    nvz("dotzheim", "Dotzheim", {
      stores: 31, area: 7400, share: 1.9, vacancies: 3, anchors: ["Supermarkt", "Lebensmitteldiscounter", "Drogeriemarkt"],
      location: "Alter Ortskern um die Wiesbadener Straße, gut mit Bus erreichbar.",
      fn: "Versorgt Dotzheim und angrenzende Wohngebiete im Westen mit Gütern des täglichen Bedarfs.",
      strengths: ["Vollständiger Nahversorgungsbesatz", "Wochenmarkt ergänzt das Angebot"], weaknesses: ["Wenig Parkraum im Ortskern"],
      goal: ["Sichern", "Nahversorgung im westlichen Stadtgebiet dauerhaft sichern."], recs: ["Lebensmittelmärkte am Standort halten und modernisieren"], mix: [72, 18, 10]
    }),
    nvz("sonnenberg", "Sonnenberg", {
      stores: 19, area: 3100, share: 1.2, vacancies: 2, anchors: ["Supermarkt", "Bäckerei"],
      location: "Kleines Zentrum an der Danziger Straße in Hanglage.",
      fn: "Wohnortnahe Versorgung für Sonnenberg und Rambach.",
      strengths: ["Inhabergeführte Fachgeschäfte", "Hohe Kundenbindung"], weaknesses: ["Kein Lebensmitteldiscounter", "Topografie erschwert den Fußweg"],
      goal: ["Qualifizieren", "Angebot behutsam ergänzen, ohne den Ortskern zu überformen."], recs: ["Erweiterung des Supermarkts prüfen", "Barrierearme Wegeverbindungen"], mix: [78, 15, 7]
    }),
    nvz("bierstadt", "Bierstadt", {
      stores: 24, area: 5200, share: 1.5, vacancies: 4, anchors: ["Supermarkt", "Lebensmitteldiscounter"],
      location: "Ortskern Bierstadt an der Poststraße, Busanbindung Richtung Innenstadt.",
      fn: "Versorgung für Bierstadt und die östlichen Wohngebiete.",
      strengths: ["Gute Mischung aus Lebensmitteln und Dienstleistungen"], weaknesses: ["Kleine Ladeneinheiten, wenig Entwicklungsflächen"],
      goal: ["Stärken", "Funktion als Nahversorgungszentrum im Osten stärken."], recs: ["Flächenpotenziale im Ortskern sichern", "Drogerieangebot ergänzen"], mix: [70, 20, 10]
    }),
    nvz("erbenheim", "Erbenheim", {
      stores: 22, area: 6100, share: 1.4, vacancies: 2, anchors: ["Lebensmitteldiscounter", "Getränkemarkt"],
      location: "Zentrum an der Berliner Straße, nahe S-Bahn-Haltepunkt.",
      fn: "Versorgung für Erbenheim und das Gewerbegebiet-nahe Wohnen im Südosten.",
      strengths: ["Gute Erreichbarkeit mit Bahn und Auto"], weaknesses: ["Konkurrenz durch nahe Fachmarktlagen", "Wenig Aufenthaltsqualität"],
      goal: ["Qualifizieren", "Aufenthaltsqualität verbessern und Nahversorger halten."], recs: ["Platzgestaltung im Zentrum", "Ansiedlung eines Vollsortimenters prüfen"], mix: [74, 16, 10]
    }),
    nvz("mainz-kostheim", "Mainz-Kostheim", {
      stores: 27, area: 6600, share: 1.7, vacancies: 3, anchors: ["Supermarkt", "Lebensmitteldiscounter", "Drogeriemarkt"],
      location: "Hauptstraße im Ortskern Kostheim, nahe Mainufer.",
      fn: "Versorgung für Kostheim mit Gütern des täglichen Bedarfs.",
      strengths: ["Kompakter Ortskern mit kurzen Wegen"], weaknesses: ["Verkehrsbelastung auf der Hauptstraße"],
      goal: ["Sichern", "Nahversorgung in Kostheim sichern."], recs: ["Verkehrsberuhigung im Ortskern prüfen"], mix: [71, 19, 10]
    }),
    nvz("mainz-kastel", "Mainz-Kastel", {
      stores: 29, area: 7000, share: 1.8, vacancies: 5, anchors: ["Supermarkt", "Lebensmitteldiscounter"],
      location: "Um die Eleonorenstraße, gute Anbindung an Bahnhof Mainz-Kastel.",
      fn: "Versorgung für Kastel und neue Wohnquartiere am Rheinufer.",
      strengths: ["Wachsende Einwohnerzahl im Umfeld"], weaknesses: ["Mehrere Leerstände", "Kaufkraftabfluss nach Mainz"],
      goal: ["Stärken", "Angebot an die wachsende Einwohnerzahl anpassen."], recs: ["Leerstände gezielt nachnutzen", "Fußwege zu neuen Quartieren verbessern"], mix: [69, 21, 10]
    }),
    nvz("schierstein", "Schierstein", {
      stores: 21, area: 4300, share: 1.3, vacancies: 2, anchors: ["Supermarkt", "Bäckerei", "Apotheke"],
      location: "Historischer Ortskern nahe Schiersteiner Hafen.",
      fn: "Versorgung für Schierstein; ergänzt das Stadtteilzentrum Biebrich.",
      strengths: ["Attraktiver Ortskern am Hafen", "Gastronomie belebt das Zentrum"], weaknesses: ["Kein Drogeriemarkt"],
      goal: ["Sichern", "Kleinteiligen Ortskern und Nahversorgung erhalten."], recs: ["Drogerieangebot ergänzen"], mix: [76, 16, 8]
    }),
    {
      id: "schelmengraben",
      name: "Schelmengraben",
      categoryId: "nvz",
      status: "perspektivisch",
      shortText: "Perspektivisches Nahversorgungszentrum. Die Entwicklung ist im Konzept vorgesehen, aber noch nicht umgesetzt.",
      location: `${P}Zentraler Bereich der Großwohnsiedlung Schelmengraben.`,
      supplyFunction: `${P}Künftige wohnortnahe Versorgung für rund 6.000 Einwohnerinnen und Einwohner im Westen.`,
      goal: { label: "Entwickeln", text: `${P}Zentrum mit Lebensmittelmarkt und ergänzenden Angeboten entwickeln.` },
      prospectNote: `${P}Voraussetzung ist die Ansiedlung eines Lebensmittelmarkts im Zuge der Quartiersentwicklung; Zeithorizont etwa 2028–2030.`,
      recommendations: [`${P}Fläche für einen Lebensmittelmarkt planungsrechtlich sichern`]
    },
    sst("aeppelallee", "Äppelallee / Hagenauer Straße", {
      stores: 24, area: 48000, anchors: ["Möbelhaus", "Baumarkt", "Elektronikfachmarkt"],
      orientation: "Fachmarktstandort mit großflächigen Anbietern für Möbel, Bau- und Gartenbedarf.",
      goal: ["Bestand sichern", "Nicht zentrenrelevante Angebote bündeln; zentrenrelevante Randsortimente begrenzen."]
    }),
    sst("borsigstrasse", "Borsigstraße / Ostring", {
      stores: 15, area: 31000, anchors: ["Baumarkt", "Gartencenter"],
      orientation: "Gewerblich geprägter Standort mit Bau- und Gartenmärkten.",
      goal: ["Bestand sichern", "Keine Erweiterung um zentrenrelevante Sortimente."]
    }),
    sst("boelckestrasse", "Boelckestraße / Otto-Suhr-Ring", {
      stores: 11, area: 22000, anchors: ["Möbelmarkt", "Zoofachmarkt"],
      orientation: "Kleinerer Fachmarktstandort für Einrichtung und Heimtierbedarf.",
      goal: ["Begrenzen", "Bestand erhalten, keine weitere Ausdehnung."]
    })
  ],

  supply: {
    intro: "Wie gut ist die fußläufige Versorgung mit Lebensmitteln in den einzelnen Bereichen der Stadt?",
    classes: [
      { id: "1", label: "Sehr hoch", color: "#1d5f94" },
      { id: "2", label: "Hoch", color: "#4c9f8f" },
      { id: "3", label: "Mittel", color: "#e7cf5a" },
      { id: "4", label: "Gering", color: "#ee9a48" },
      { id: "5", label: "Sehr gering", color: "#cf5a3e" },
      { id: "0", label: "Keine ausreichende Datenlage", color: "#c5ced3" }
    ],
    marketTypes: [
      { id: "supermarkt", label: "Supermarkt", color: "#2a9d8f" },
      { id: "discounter", label: "Discounter", color: "#e08a2c" },
      { id: "grosser-supermarkt", label: "Großer Supermarkt", color: "#006da8" },
      { id: "sb-warenhaus", label: "SB-Warenhaus", color: "#7a4fa3" }
    ],
    methodNote:
      "Der Versorgungsgrad ist ein fachlich vorbereiteter Index aus fußläufiger Erreichbarkeit und Angebotsstruktur relevanter Lebensmittelmärkte ab 400 m² Verkaufsfläche. Die Karte stellt keine vollständige Bewertung der Nahversorgung dar.",
    keyMessages: [
      `${P}Der überwiegende Teil der Einwohnerinnen und Einwohner erreicht einen Lebensmittelmarkt zu Fuß.`,
      `${P}Die Versorgung ist in den Zentren am dichtesten und nimmt zu den Stadträndern ab.`,
      `${P}Lücken bestehen vor allem in Randlagen mit geringer Einwohnerdichte.`
    ],
    gaps: [
      { area: `${P}Nordwestlicher Stadtrand`, text: `${P}Kein Lebensmittelmarkt in fußläufiger Entfernung; Versorgung überwiegend mit dem Auto.` },
      { area: `${P}Östliche Siedlungsränder`, text: `${P}Nur kleinere Märkte unter 400 m²; Angebot eingeschränkt.` },
      { area: `${P}Neubauquartiere am Rhein`, text: `${P}Einwohnerzuwachs übersteigt das bestehende Angebot.` }
    ],
    complementary: `${P}Bäckereien, Metzgereien, Hofläden und sieben Wochenmärkte ergänzen die Nahversorgung, sind im Index aber nicht berücksichtigt.`
  },

  retail: {
    intro: "Betriebsbestand nach Sortiment, Standorttyp und Raum erkunden.",
    assortments: [
      "Nahrungs- und Genussmittel",
      "Gesundheit, Körperpflege",
      "Bekleidung, Schuhe",
      "Elektrowaren, Medien",
      "Haus, Einrichtung, Möbel",
      "Bau, Garten, Heimtier",
      "Sonstige Sortimente"
    ],
    locationTypes: ["Hauptzentrum", "Stadtteilzentrum", "Nahversorgungszentrum", "Sonderstandort", "Sonstige Lage"],
    districts: ["Mitte", "Nord", "Ost", "Süd", "West", "AKK"],
    note: "Die Darstellung basiert auf dem zuletzt verfügbaren Erhebungsstand. Ein Klick auf einen Betrieb in der Karte zeigt weitere Informationen.",
    // TODO fachlich: Zuordnung Warengruppe -> Bedarfsstufe bestätigen
    needLevelByAssortment: {
      "Nahrungs- und Genussmittel": "Kurzfristiger Bedarf",
      "Gesundheit, Körperpflege": "Kurzfristiger Bedarf",
      "Bekleidung, Schuhe": "Mittelfristiger Bedarf",
      "Sonstige Sortimente": "Mittelfristiger Bedarf",
      "Elektrowaren, Medien": "Langfristiger Bedarf",
      "Haus, Einrichtung, Möbel": "Langfristiger Bedarf",
      "Bau, Garten, Heimtier": "Langfristiger Bedarf"
    },
    keyMessages: [
      `${P}Rund ein Drittel aller Betriebe liegt in der Einkaufsinnenstadt.`,
      `${P}Nahrungs- und Genussmittel sind die häufigste Warengruppe.`,
      `${P}Die Zahl der Betriebe ist seit 2015 leicht zurückgegangen.`
    ],
    storeDefinition: `${P}Erfasst sind alle Ladengeschäfte des Einzelhandels im engeren Sinne mit Verkaufsfläche, einschließlich Lebensmittelhandwerk; ohne Kfz-, Brennstoff- und Online-Handel.`
  },

  steering: {
    intro: "Ziele, Grundsätze und Beispiele aus dem Einzelhandelskonzept – verständlich erklärt.",
    principles: [
      { icon: "building", title: "Zentren stärken", text: "Die zentralen Versorgungsbereiche als attraktive Einkaufs- und Aufenthaltsorte sichern und weiterentwickeln." },
      { icon: "cart", title: "Nahversorgung sichern", text: "Eine möglichst wohnortnahe Versorgung mit Gütern des täglichen Bedarfs gewährleisten." },
      { icon: "leaf", title: "Städtebaulich verträgliche Entwicklung", text: "Einzelhandelsvorhaben an den Zielen des Konzepts ausrichten und unerwünschte Entwicklungen vermeiden." },
      { icon: "document", title: "Transparente Entscheidungen", text: "Eine nachvollziehbare, einheitliche Bewertung von Vorhaben auf Grundlage des Konzepts ermöglichen." }
    ],
    steps: [
      { question: "Wo?", title: "Standort", text: "In welcher Standortkategorie liegt das Vorhaben – in einem zentralen Versorgungsbereich, an einem Sonderstandort oder in einer sonstigen Lage?" },
      { question: "Was?", title: "Sortiment", text: "Ist das Kernsortiment zentrenrelevant, nahversorgungs- und zentrenrelevant oder nicht zentrenrelevant?" },
      { question: "Wie groß?", title: "Größenordnung", text: "Welche Verkaufsfläche ist geplant und passt die Dimensionierung zur Versorgungsfunktion des Standorts?" },
      { question: "Welche Grundsätze?", title: "Steuerungsgrundsätze", text: "Aus Standort, Sortiment und Größe ergibt sich, welche Grundsätze des Konzepts für das Vorhaben maßgeblich sind." }
    ],
    // TODO fachlich: Leitsätze aus dem Konzept übernehmen
    guidelines: [
      { id: "l1", title: "Zentrenrelevanter Einzelhandel in die Zentren", text: `${P}Einzelhandel mit zentrenrelevantem Kernsortiment soll nur in zentralen Versorgungsbereichen angesiedelt werden.`, appliesTo: "Zentrenrelevante Sortimente" },
      { id: "l2", title: "Nahversorgung wohnortnah", text: `${P}Lebensmittelmärkte sollen vorrangig in zentralen Versorgungsbereichen und ergänzend in integrierten Wohnlagen entstehen.`, appliesTo: "Nahversorgungsrelevante Sortimente" },
      { id: "l3", title: "Großflächiges nicht Zentrenrelevantes an Sonderstandorte", text: `${P}Großflächiger Einzelhandel mit nicht zentrenrelevantem Kernsortiment soll an den Sonderstandorten gebündelt werden.`, appliesTo: "Nicht zentrenrelevante Sortimente" },
      { id: "l4", title: "Randsortimente begrenzen", text: `${P}Zentrenrelevante Randsortimente außerhalb der Zentren sollen auf einen kleinen Anteil der Verkaufsfläche begrenzt werden.`, appliesTo: "Randsortimente" },
      { id: "l5", title: "Bestandsschutz ohne Ausweitung", text: `${P}Bestehende Betriebe außerhalb der Zentren genießen Bestandsschutz; Erweiterungen werden im Einzelfall geprüft.`, appliesTo: "Bestandsbetriebe" }
    ],
    // TODO fachlich: Matrix bestätigen. Neutrale Labels, keine Zulässigkeitsaussage.
    matrix: {
      rows: ["Hauptzentrum", "Stadtteilzentrum", "Nahversorgungszentrum", "Sonderstandort", "Sonstige integrierte Lage", "Nicht integrierte Lage"],
      cols: ["Nahversorgungsrelevant", "Zentrenrelevant", "Nicht zentrenrelevant"],
      cells: [
        ["vorrangig", "vorrangig", "unter Bedingungen"],
        ["vorrangig", "vorrangig", "unter Bedingungen"],
        ["vorrangig", "unter Bedingungen", "unter Bedingungen"],
        ["nicht vorgesehen", "nicht vorgesehen", "vorrangig"],
        ["unter Bedingungen", "nicht vorgesehen", "unter Bedingungen"],
        ["nicht vorgesehen", "nicht vorgesehen", "unter Bedingungen"]
      ]
    },
    examples: [
      {
        id: "bekleidung",
        title: "Bekleidungsgeschäft im Hauptzentrum",
        where: "Hauptzentrum (zentraler Versorgungsbereich)",
        what: "Bekleidung – zentrenrelevant",
        size: "kleinflächig bis großflächig",
        assessment: "Zentrenrelevante Sortimente sollen vorrangig im Hauptzentrum angesiedelt werden. Das Vorhaben entspricht damit grundsätzlich der Zielrichtung des Konzepts.",
        centerId: "innenstadt"
      },
      {
        id: "lebensmittel",
        title: "Lebensmittelmarkt in wohnortnaher Lage",
        where: "Wohnortnahe, städtebaulich integrierte Lage",
        what: "Nahrungs- und Genussmittel – nahversorgungsrelevant",
        size: "abhängig von der Versorgungsfunktion",
        assessment: "Nahversorgungsbetriebe können auch außerhalb zentraler Versorgungsbereiche der wohnortnahen Versorgung dienen. Maßgeblich sind u. a. Lage, Dimensionierung und Auswirkungen auf bestehende Zentren."
      },
      {
        id: "moebel",
        title: "Möbelmarkt am Sonderstandort",
        where: "Sonderstandort (kein zentraler Versorgungsbereich)",
        what: "Möbel – nicht zentrenrelevant",
        size: "großflächig",
        assessment: "Großflächiger Einzelhandel mit nicht zentrenrelevantem Kernsortiment ist an Sonderstandorten vorgesehen. Zentrenrelevante Randsortimente sollen begrenzt werden.",
        centerId: "aeppelallee"
      },
      {
        id: "drogerie",
        title: "Drogeriemarkt im Nahversorgungszentrum",
        where: "Nahversorgungszentrum (zentraler Versorgungsbereich)",
        what: "Drogeriewaren – nahversorgungsrelevant",
        size: "bis zur Größenordnung der Versorgungsfunktion",
        assessment: `${P}Drogeriewaren gehören zur Nahversorgung. Im Nahversorgungszentrum passt ein Drogeriemarkt zur Versorgungsfunktion, sofern seine Größe auf den Stadtteil ausgerichtet ist.`,
        centerId: "dotzheim"
      },
      {
        id: "fahrrad",
        title: "Fahrradfachgeschäft im Stadtteilzentrum",
        where: "Stadtteilzentrum (zentraler Versorgungsbereich)",
        what: "Fahrräder, E-Bikes – nicht zentrenrelevant",
        size: "kleinflächig",
        assessment: `${P}Nicht zentrenrelevante Sortimente sind auch in Zentren möglich und können sie beleben. Ein kleinflächiges Fachgeschäft ergänzt das Angebot im Stadtteilzentrum.`,
        centerId: "biebrich"
      },
      {
        id: "elektro",
        title: "Elektronikfachmarkt am Sonderstandort",
        where: "Sonderstandort (kein zentraler Versorgungsbereich)",
        what: "Unterhaltungselektronik – zentrenrelevant",
        size: "großflächig",
        assessment: `${P}Zentrenrelevante Kernsortimente sollen nicht an Sonderstandorten angesiedelt werden. Für ein solches Vorhaben wäre ein zentraler Versorgungsbereich der vorgesehene Standort.`,
        centerId: "borsigstrasse"
      }
    ],
    // TODO fachlich: vollständige Sortimentsliste ("Wiesbadener Liste") übernehmen
    assortmentGroups: [
      {
        id: "nahversorgung",
        label: "Nahversorgungs- und zentrenrelevant",
        description: "Sortimente des täglichen Bedarfs.",
        items: [
          { name: "Nahrungs- und Genussmittel", retailGroup: "Nahrungs- und Genussmittel", synonyms: ["Lebensmittel", "Supermarkt", "Backwaren", "Bäcker", "Metzger"] },
          { name: "Getränke", retailGroup: "Nahrungs- und Genussmittel", synonyms: ["Getränkemarkt", "Wein", "Bier"] },
          { name: "Drogeriewaren", retailGroup: "Gesundheit, Körperpflege", synonyms: ["Kosmetik", "Körperpflege", "Waschmittel"] },
          { name: "Apothekenwaren", retailGroup: "Gesundheit, Körperpflege", synonyms: ["Medikamente", "Apotheke"] },
          { name: "Schnittblumen", retailGroup: "Bau, Garten, Heimtier", synonyms: ["Blumen", "Floristik"] },
          { name: "Zeitungen, Zeitschriften", retailGroup: "Elektrowaren, Medien", synonyms: ["Presse", "Kiosk"] },
          { name: "Tabakwaren", retailGroup: "Nahrungs- und Genussmittel", synonyms: ["Zigaretten", "Tabak"] },
          { name: "Reformwaren", retailGroup: "Nahrungs- und Genussmittel", synonyms: ["Bio", "Naturkost"] }
        ]
      },
      {
        id: "zentren",
        label: "Zentrenrelevant",
        description: "Sortimente, die Zentren prägen und Besucher anziehen.",
        items: [
          { name: "Bekleidung", retailGroup: "Bekleidung, Schuhe", synonyms: ["Mode", "Kleidung", "Textilien"] },
          { name: "Schuhe", retailGroup: "Bekleidung, Schuhe", synonyms: ["Sneaker", "Stiefel"] },
          { name: "Lederwaren, Taschen", retailGroup: "Bekleidung, Schuhe", synonyms: ["Koffer", "Handtaschen"] },
          { name: "Bücher", retailGroup: "Elektrowaren, Medien", synonyms: ["Buchhandlung"] },
          { name: "Schreibwaren, Bürobedarf", retailGroup: "Sonstige Sortimente", synonyms: ["Papier", "Büroartikel", "Schulbedarf"] },
          { name: "Spielwaren", retailGroup: "Sonstige Sortimente", synonyms: ["Spielzeug", "Spiele"] },
          { name: "Sportartikel", retailGroup: "Sonstige Sortimente", synonyms: ["Sportbekleidung", "Sportschuhe"] },
          { name: "Unterhaltungselektronik", retailGroup: "Elektrowaren, Medien", synonyms: ["TV", "Fernseher", "Hi-Fi", "Spielkonsole"] },
          { name: "Telekommunikation", retailGroup: "Elektrowaren, Medien", synonyms: ["Handy", "Smartphone", "Mobilfunk"] },
          { name: "Computer und Zubehör", retailGroup: "Elektrowaren, Medien", synonyms: ["Laptop", "PC", "Tablet", "Drucker"] },
          { name: "Foto", retailGroup: "Elektrowaren, Medien", synonyms: ["Kamera", "Fotozubehör"] },
          { name: "Optik, Hörgeräte", retailGroup: "Gesundheit, Körperpflege", synonyms: ["Brillen", "Kontaktlinsen", "Akustiker"] },
          { name: "Uhren, Schmuck", retailGroup: "Sonstige Sortimente", synonyms: ["Juwelier", "Goldschmied"] },
          { name: "Haushaltswaren", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Küchenzubehör", "Kochgeschirr", "Besteck"] },
          { name: "Glas, Porzellan, Keramik", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Geschirr", "Vasen"] },
          { name: "Heimtextilien", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Gardinen", "Bettwäsche", "Handtücher", "Kissen"] },
          { name: "Kurzwaren, Handarbeit", retailGroup: "Sonstige Sortimente", synonyms: ["Wolle", "Stoffe", "Nähzubehör"] },
          { name: "Musikinstrumente", retailGroup: "Sonstige Sortimente", synonyms: ["Noten", "Gitarre"] },
          { name: "Babyartikel", retailGroup: "Sonstige Sortimente", synonyms: ["Kinderwagen", "Babyausstattung"] },
          { name: "Parfümerie", retailGroup: "Gesundheit, Körperpflege", synonyms: ["Parfum", "Duft"] },
          { name: "Sanitätswaren", retailGroup: "Gesundheit, Körperpflege", synonyms: ["Sanitätshaus", "Orthopädie"] },
          { name: "Geschenkartikel", retailGroup: "Sonstige Sortimente", synonyms: ["Deko", "Souvenirs"] },
          { name: "Kunst, Bilderrahmen", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Galerie", "Bilder"] }
        ]
      },
      {
        id: "nicht-zentren",
        label: "Nicht zentrenrelevant",
        description: "Sortimente, die typischerweise großflächig und autoorientiert angeboten werden.",
        items: [
          { name: "Möbel", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Sofa", "Küchenmöbel", "Schrank", "Büromöbel"] },
          { name: "Matratzen, Bettwaren", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Bett", "Lattenrost", "Bettdecke"] },
          { name: "Baumarktartikel", retailGroup: "Bau, Garten, Heimtier", synonyms: ["Werkzeug", "Heimwerker", "Farben", "Tapeten"] },
          { name: "Gartenbedarf, Pflanzen", retailGroup: "Bau, Garten, Heimtier", synonyms: ["Gartencenter", "Gartenmöbel", "Erde"] },
          { name: "Bodenbeläge, Teppiche", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Parkett", "Laminat"] },
          { name: "Leuchten", retailGroup: "Haus, Einrichtung, Möbel", synonyms: ["Lampen", "Beleuchtung"] },
          { name: "Kfz-Zubehör", retailGroup: "Sonstige Sortimente", synonyms: ["Autozubehör", "Reifen"] },
          { name: "Fahrräder", retailGroup: "Sonstige Sortimente", synonyms: ["Fahrrad", "E-Bike", "Pedelec"] },
          { name: "Zoologischer Bedarf", retailGroup: "Bau, Garten, Heimtier", synonyms: ["Tierfutter", "Heimtier", "Zoo"] },
          { name: "Elektrogroßgeräte", retailGroup: "Elektrowaren, Medien", synonyms: ["Waschmaschine", "Kühlschrank", "Weiße Ware", "Herd"] },
          { name: "Campingartikel", retailGroup: "Sonstige Sortimente", synonyms: ["Zelt", "Wohnwagenzubehör"] },
          { name: "Sanitär, Fliesen", retailGroup: "Bau, Garten, Heimtier", synonyms: ["Badausstattung", "Badmöbel"] },
          { name: "Baustoffe, Holz", retailGroup: "Bau, Garten, Heimtier", synonyms: ["Holzhandel", "Zement"] }
        ]
      }
    ],
    faqs: [
      { question: "Ist das Einzelhandelskonzept rechtsverbindlich?", answer: "Das Konzept ist eine städtebauliche Leitlinie. Verbindlich wird es über die Bauleitplanung. Der Beschlussstand ist vor Veröffentlichung zu prüfen." },
      { question: "Ersetzt diese Seite eine Prüfung im Einzelfall?", answer: "Nein. Die Beispiele erklären die Systematik des Konzepts und sind keine Einzelfallprüfung oder Genehmigungsaussage." },
      { question: "Was ist ein zentraler Versorgungsbereich?", answer: `${P}Ein räumlich abgegrenzter Bereich, dem aufgrund vorhandener Einzelhandelsnutzungen eine Versorgungsfunktion über den unmittelbaren Nahbereich hinaus zukommt.` },
      { question: "Warum sind Sonderstandorte keine Zentren?", answer: `${P}Sonderstandorte bündeln großflächigen, meist autoorientierten Fachmarkthandel. Ihnen fehlt die Nutzungsmischung und Versorgungsfunktion eines Zentrums.` },
      { question: "Ab wann gilt ein Betrieb als großflächig?", answer: `${P}Nach der Rechtsprechung ab etwa 800 m² Verkaufsfläche. Großflächige Vorhaben unterliegen besonderen Regeln.` },
      { question: "Darf ein Lebensmittelmarkt außerhalb der Zentren entstehen?", answer: `${P}Ja, unter Bedingungen: wenn er der wohnortnahen Versorgung dient und die Zentren nicht beeinträchtigt.` },
      { question: "Wie oft wird das Konzept aktualisiert?", answer: `${P}In der Regel alle fünf bis zehn Jahre oder bei wesentlichen Veränderungen im Einzelhandel.` }
    ],
    procedure: [
      { title: "Frühzeitig Kontakt aufnehmen", text: `${P}Vorhabenträger wenden sich mit einer kurzen Beschreibung an das Stadtplanungsamt.` },
      { title: "Einordnung nach dem Konzept", text: `${P}Die Verwaltung ordnet Standort, Sortiment und Größe nach den Leitsätzen ein.` },
      { title: "Gutachterliche Prüfung", text: `${P}Bei großflächigen Vorhaben kann eine Auswirkungsanalyse erforderlich sein.` },
      { title: "Planungsrechtliche Umsetzung", text: `${P}Die Entscheidung erfolgt im Bauleitplan- oder Genehmigungsverfahren.` }
    ]
  },

  // TODO fachlich: Texte, Datenquellen und Downloads liefern
  about: {
    intro: `${P}Das Einzelhandelskonzept ist die Grundlage der Stadt für die räumliche Steuerung des Einzelhandels. Diese Seite zeigt Anlass, Vorgehen und Datengrundlagen.`,
    process: [
      `${P}Auftrag durch die Stadt (2024)`,
      `${P}Vollerhebung des Einzelhandels (2025)`,
      `${P}Analyse und Entwurf der Steuerungsregeln`,
      `${P}Beteiligung von Politik, Handel und Öffentlichkeit`,
      `${P}Beschluss und Veröffentlichung`
    ],
    method: [
      { title: "Bestandserhebung", text: `${P}Flächendeckende Begehung aller Einzelhandelsbetriebe mit Erfassung von Sortiment und Verkaufsfläche.` },
      { title: "Zentrenabgrenzung", text: `${P}Abgrenzung der zentralen Versorgungsbereiche nach funktionalen und städtebaulichen Kriterien.` },
      { title: "Nahversorgungsindex", text: `${P}Kombination aus fußläufiger Erreichbarkeit und Angebot relevanter Lebensmittelmärkte ab 400 m² in einem Hexagonraster.` }
    ],
    dataSources: [
      { label: "Einzelhandelserhebung", status: "Stand 2025" },
      { label: "Einwohnerdaten", status: `${P}Stand 31.12.2024` },
      { label: "Kaufkraftkennziffern", status: `${P}Stand 2025` },
      { label: "Geodaten / Kartengrundlage", status: `${P}ArcGIS Online, folgt` }
    ],
    downloads: [
      { label: "Einzelhandelskonzept (PDF) – folgt", url: "#" },
      { label: "Sortimentsliste (PDF) – folgt", url: "#" },
      { label: "Karte der zentralen Versorgungsbereiche (PDF) – folgt", url: "#" }
    ]
  },

  // TODO fachlich: Definitionen prüfen
  glossary: [
    { term: "Zentraler Versorgungsbereich (ZVB)", definition: `${P}Räumlich abgegrenzter Bereich mit Versorgungsfunktion über den Nahbereich hinaus; rechtlich geschützt.` },
    { term: "Sonderstandort", definition: `${P}Standort für großflächigen Einzelhandel mit überwiegend nicht zentrenrelevanten Sortimenten; kein zentraler Versorgungsbereich.` },
    { term: "Zentrenrelevantes Sortiment", definition: `${P}Sortiment, das Zentren prägt und Besucherfrequenz erzeugt, etwa Bekleidung oder Bücher.` },
    { term: "Nahversorgungsrelevantes Sortiment", definition: `${P}Sortiment des täglichen Bedarfs, etwa Lebensmittel und Drogeriewaren.` },
    { term: "Verkaufsfläche", definition: `${P}Teil der Geschäftsfläche, auf dem Waren angeboten werden und der Kundschaft zugänglich ist.` },
    { term: "Großflächigkeit", definition: `${P}Einzelhandelsbetriebe ab etwa 800 m² Verkaufsfläche; besondere planungsrechtliche Regeln.` },
    { term: "Kaufkraft", definition: `${P}Für den Einzelhandel verfügbares Einkommen der Bevölkerung.` },
    { term: "Zentralität", definition: `${P}Verhältnis von Einzelhandelsumsatz zu örtlicher Kaufkraft; über 100 bedeutet Kaufkraftzufluss.` },
    { term: "Bedarfsstufen", definition: `${P}Einteilung in kurz-, mittel- und langfristigen Bedarf nach Kaufhäufigkeit.` },
    { term: "Randsortiment", definition: `${P}Ergänzendes Sortiment neben dem Kernsortiment eines Betriebs.` },
    { term: "Integrierte Lage", definition: `${P}Standort im Siedlungszusammenhang, mit Wohnbebauung im Umfeld und zu Fuß erreichbar.` },
    { term: "Nahversorgungsindex", definition: `${P}Fertig berechneter Wert je Rasterzelle, der Erreichbarkeit und Angebot von Lebensmittelmärkten zusammenfasst.` }
  ]
};
