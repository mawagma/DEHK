export type CenterCategory =
  | "Hauptzentrum"
  | "Stadtteilzentrum"
  | "Nahversorgungszentrum"
  | "Perspektivisches Nahversorgungszentrum"
  | "Sonderstandort";

export type Center = {
  id: string;
  name: string;
  category: CenterCategory;
  status?: "bestehend" | "perspektivisch";
  shortText: string;
  stores?: number;
  salesAreaM2?: number;
  structure?: Array<{ label: string; value: number }>;
};

export const wiesbadenConfig = {
  municipality: "Wiesbaden",
  title: "Digitales Einzelhandelskonzept",
  conceptStatus: "Konzeptfassung 2026",
  dataStatus: "Einzelhandelserhebung 2025",

  // Die Platzhalter durch öffentliche ArcGIS-Online-WebMap-Item-IDs ersetzen.
  arcgis: {
    portalUrl: import.meta.env.VITE_ARCGIS_PORTAL_URL || "https://www.arcgis.com",
    overviewWebMapId: "YOUR_OVERVIEW_WEBMAP_ID",
    centersWebMapId: "YOUR_CENTERS_WEBMAP_ID",
    centersLayerTitle: "Zentren und Standorte"
  },

  overviewMetrics: [
    { value: "1.606", label: "Einzelhandelsbetriebe", meta: "Erhebung 2025" },
    { value: "9 + 1", label: "Zentrale Versorgungsbereiche", meta: "bestehend + perspektivisch" },
    { value: "2025", label: "Datenstand Einzelhandel", meta: "statische Momentaufnahme" }
  ],

  centers: [
    {
      id: "innenstadt",
      name: "Einkaufsinnenstadt",
      category: "Hauptzentrum",
      status: "bestehend",
      shortText: "Hauptzentrum mit gesamtstädtischer und regionaler Versorgungsfunktion.",
      stores: 498,
      salesAreaM2: 96995,
      structure: [
        { label: "Kurzfristiger Bedarf", value: 19 },
        { label: "Mittelfristiger Bedarf", value: 52 },
        { label: "Langfristiger Bedarf", value: 29 }
      ]
    },
    {
      id: "biebrich",
      name: "Biebrich",
      category: "Stadtteilzentrum",
      status: "bestehend",
      shortText: "Versorgungsfunktion im Wesentlichen für das südliche Stadtgebiet, insbesondere Biebrich und Schierstein.",
      stores: 67,
      salesAreaM2: 6095,
      structure: [
        { label: "Kurzfristiger Bedarf", value: 67 },
        { label: "Mittelfristiger Bedarf", value: 18 },
        { label: "Langfristiger Bedarf", value: 16 }
      ]
    },
    { id: "dotzheim", name: "Dotzheim", category: "Nahversorgungszentrum", status: "bestehend", shortText: "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf." },
    { id: "sonnenberg", name: "Sonnenberg", category: "Nahversorgungszentrum", status: "bestehend", shortText: "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf." },
    { id: "bierstadt", name: "Bierstadt", category: "Nahversorgungszentrum", status: "bestehend", shortText: "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf." },
    { id: "erbenheim", name: "Erbenheim", category: "Nahversorgungszentrum", status: "bestehend", shortText: "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf." },
    { id: "mainz-kostheim", name: "Mainz-Kostheim", category: "Nahversorgungszentrum", status: "bestehend", shortText: "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf." },
    { id: "mainz-kastel", name: "Mainz-Kastel", category: "Nahversorgungszentrum", status: "bestehend", shortText: "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf." },
    { id: "schierstein", name: "Schierstein", category: "Nahversorgungszentrum", status: "bestehend", shortText: "Nahversorgungszentrum mit Schwerpunkt im kurzfristigen Bedarf." },
    { id: "schelmengraben", name: "Schelmengraben", category: "Perspektivisches Nahversorgungszentrum", status: "perspektivisch", shortText: "Perspektivisches Nahversorgungszentrum; in der Anwendung klar als perspektivisch zu kennzeichnen." },
    { id: "aeppelallee", name: "Äppelallee / Hagenauer Straße", category: "Sonderstandort", status: "bestehend", shortText: "Sonderstandort mit überwiegend großflächigem Fachmarkteinzelhandel." },
    { id: "borsigstrasse", name: "Borsigstraße / Ostring", category: "Sonderstandort", status: "bestehend", shortText: "Sonderstandort mit überwiegend großflächigem Fachmarkteinzelhandel." },
    { id: "boelckestrasse", name: "Boelckestraße / Otto-Suhr-Ring", category: "Sonderstandort", status: "bestehend", shortText: "Sonderstandort mit überwiegend großflächigem Fachmarkteinzelhandel." }
  ] satisfies Center[]
} as const;
