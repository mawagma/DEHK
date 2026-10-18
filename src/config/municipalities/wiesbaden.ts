import type { MunicipalityConfig } from "../types";

const nvzText = "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf.";
const sonderText = "Sonderstandort mit überwiegend großflächigem Fachmarkteinzelhandel. Kein zentraler Versorgungsbereich.";

// Referenzkommune. Werte aus dem Prototyp/Gutachten 2026; vor Veröffentlichung fachlich freigeben.
export const wiesbadenConfig: MunicipalityConfig = {
  id: "wiesbaden",
  municipality: "Wiesbaden",
  title: "Digitales Einzelhandelskonzept",
  conceptStatus: "Konzeptfassung 2026",
  dataStatus: "Einzelhandelserhebung 2025",
  isDemo: true,
  modules: { zentren: true, nahversorgung: true, einzelhandelsstruktur: true, "einzelhandel-steuern": true },

  contact: {
    email: "info@gma.biz",
    imprintUrl: "https://gma.biz/impressum/",
    privacyUrl: "https://gma.biz/datenschutz/"
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
      { value: "1.606", label: "Einzelhandelsbetriebe", meta: "Erhebung 2025" },
      { value: "9 + 1", label: "Zentrale Versorgungsbereiche", meta: "bestehend + perspektivisch" },
      { value: "3", label: "Sonderstandorte", meta: "kein zentraler Versorgungsbereich" }
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
      structure: [
        { label: "Kurzfristiger Bedarf", value: 19 },
        { label: "Mittelfristiger Bedarf", value: 52 },
        { label: "Langfristiger Bedarf", value: 29 }
      ]
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
      structure: [
        { label: "Kurzfristiger Bedarf", value: 67 },
        { label: "Mittelfristiger Bedarf", value: 18 },
        { label: "Langfristiger Bedarf", value: 16 }
      ]
    },
    { id: "dotzheim", name: "Dotzheim", categoryId: "nvz", status: "bestehend", shortText: nvzText },
    { id: "sonnenberg", name: "Sonnenberg", categoryId: "nvz", status: "bestehend", shortText: nvzText },
    { id: "bierstadt", name: "Bierstadt", categoryId: "nvz", status: "bestehend", shortText: nvzText },
    { id: "erbenheim", name: "Erbenheim", categoryId: "nvz", status: "bestehend", shortText: nvzText },
    { id: "mainz-kostheim", name: "Mainz-Kostheim", categoryId: "nvz", status: "bestehend", shortText: nvzText },
    { id: "mainz-kastel", name: "Mainz-Kastel", categoryId: "nvz", status: "bestehend", shortText: nvzText },
    { id: "schierstein", name: "Schierstein", categoryId: "nvz", status: "bestehend", shortText: nvzText },
    {
      id: "schelmengraben",
      name: "Schelmengraben",
      categoryId: "nvz",
      status: "perspektivisch",
      shortText: "Perspektivisches Nahversorgungszentrum. Die Entwicklung ist im Konzept vorgesehen, aber noch nicht umgesetzt."
    },
    { id: "aeppelallee", name: "Äppelallee / Hagenauer Straße", categoryId: "sst", status: "bestehend", shortText: sonderText },
    { id: "borsigstrasse", name: "Borsigstraße / Ostring", categoryId: "sst", status: "bestehend", shortText: sonderText },
    { id: "boelckestrasse", name: "Boelckestraße / Otto-Suhr-Ring", categoryId: "sst", status: "bestehend", shortText: sonderText }
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
      "Der Versorgungsgrad ist ein fachlich vorbereiteter Index aus fußläufiger Erreichbarkeit und Angebotsstruktur relevanter Lebensmittelmärkte ab 400 m² Verkaufsfläche. Die Karte stellt keine vollständige Bewertung der Nahversorgung dar."
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
    note: "Die Darstellung basiert auf dem zuletzt verfügbaren Erhebungsstand. Ein Klick auf einen Betrieb in der Karte zeigt weitere Informationen."
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
    examples: [
      {
        id: "bekleidung",
        title: "Bekleidungsgeschäft im Hauptzentrum",
        where: "Hauptzentrum (zentraler Versorgungsbereich)",
        what: "Bekleidung – zentrenrelevant",
        size: "kleinflächig bis großflächig",
        assessment: "Zentrenrelevante Sortimente sollen vorrangig im Hauptzentrum angesiedelt werden. Das Vorhaben entspricht damit grundsätzlich der Zielrichtung des Konzepts."
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
        assessment: "Großflächiger Einzelhandel mit nicht zentrenrelevantem Kernsortiment ist an Sonderstandorten vorgesehen. Zentrenrelevante Randsortimente sollen begrenzt werden."
      }
    ],
    assortmentGroups: [
      {
        id: "nahversorgung",
        label: "Nahversorgungs- und zentrenrelevant",
        description: "Sortimente des täglichen Bedarfs.",
        items: ["Nahrungs- und Genussmittel", "Getränke", "Drogeriewaren", "Apothekenwaren", "Schnittblumen", "Zeitungen, Zeitschriften"]
      },
      {
        id: "zentren",
        label: "Zentrenrelevant",
        description: "Sortimente, die Zentren prägen und Besucher anziehen.",
        items: ["Bekleidung", "Schuhe, Lederwaren", "Bücher", "Spielwaren", "Sportartikel", "Unterhaltungselektronik", "Uhren, Schmuck", "Haushaltswaren, Glas, Porzellan", "Optik, Hörgeräte"]
      },
      {
        id: "nicht-zentren",
        label: "Nicht zentrenrelevant",
        description: "Sortimente, die typischerweise großflächig und autoorientiert angeboten werden.",
        items: ["Möbel", "Baumarktartikel", "Gartenbedarf, Pflanzen", "Bodenbeläge, Teppiche", "Kfz-Zubehör", "Leuchten", "Zoologischer Bedarf (großteilig)"]
      }
    ],
    faqs: [
      { question: "Ist das Einzelhandelskonzept rechtsverbindlich?", answer: "Das Konzept ist eine städtebauliche Leitlinie. Verbindlich wird es über die Bauleitplanung. Der Beschlussstand ist vor Veröffentlichung zu prüfen." },
      { question: "Ersetzt diese Seite eine Prüfung im Einzelfall?", answer: "Nein. Die Beispiele erklären die Systematik des Konzepts und sind keine Einzelfallprüfung oder Genehmigungsaussage." }
    ]
  }
};
