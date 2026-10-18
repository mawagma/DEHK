// Explizite, kommunenunabhängige Konfigurationstypen. Jede Kommune ist eine Instanz von MunicipalityConfig.

export type ModuleId = "zentren" | "nahversorgung" | "einzelhandelsstruktur" | "einzelhandel-steuern";

export type SymbolShape = "square" | "triangle" | "circle" | "diamond";

export type Metric = { value: string; label: string; meta?: string };

export type ShareRow = { label: string; value: number; color?: string };

export type ArcGISConfig = {
  portalUrl: string;
  /** WebMap-Item-IDs je Modul. Platzhalter beginnen mit "YOUR_" und schalten die Beispielkarte ein. */
  webMaps: {
    overview: string;
    centers: string;
    supply: string;
    retailStructure: string;
  };
  /** Layer-ID des Zentrenlayers innerhalb der Zentren-WebMap (für Kartenklick und Zoom). */
  centersLayerId?: string;
  /** Attributfeld, das die Zentren-ID enthält und zu CenterConfig.id passt. */
  centerIdField: string;
};

export type CenterCategoryConfig = {
  id: string;
  label: string;
  /** Überschrift der Gruppe in der Liste, z. B. "Nahversorgungszentren". */
  groupLabel: string;
  /** Zentraler Versorgungsbereich? Sonderstandorte sind es nicht. */
  isCentralSupplyArea: boolean;
  symbol: SymbolShape;
  color: string;
};

export type CenterConfig = {
  id: string;
  name: string;
  categoryId: string;
  status: "bestehend" | "perspektivisch";
  shortText: string;
  stores?: number;
  salesAreaM2?: number;
  structure?: ShareRow[];
  structureCaption?: string;
};

export type SupplyClassConfig = { id: string; label: string; color: string };
export type MarketTypeConfig = { id: string; label: string; color: string };

export type SteeringPrinciple = { title: string; text: string; icon: IconName };
export type SteeringStep = { question: string; title: string; text: string };
export type SteeringExample = { id: string; title: string; where: string; what: string; size: string; assessment: string };
export type AssortmentGroup = { id: string; label: string; description: string; items: string[] };
export type Faq = { question: string; answer: string };

export type IconName = "pin" | "cart" | "chart" | "document" | "building" | "leaf" | "info" | "mail";

/** Stadtbild für Seitenköpfe. Lizenzangaben werden auf der Seite angezeigt (Pflicht bei CC-Lizenzen). */
export type HeroImage = {
  src: string;
  /** Horizontale Bildposition (CSS), damit das Motiv neben der blauen Fläche sichtbar bleibt. */
  focusX?: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
};

export type MunicipalityConfig = {
  id: string;
  municipality: string;
  title: string;
  conceptStatus: string;
  dataStatus: string;
  /** Inhalte sind Beispiel-/Prototypdaten und noch nicht fachlich freigegeben. */
  isDemo: boolean;
  heroImage?: HeroImage;
  modules: Record<ModuleId, boolean>;
  contact: { email: string; imprintUrl: string; privacyUrl: string; conceptUrl?: string };
  arcgis: ArcGISConfig;
  overview: { headline: string; intro: string; metrics: Metric[] };
  centerCategories: CenterCategoryConfig[];
  centers: CenterConfig[];
  supply: { intro: string; classes: SupplyClassConfig[]; marketTypes: MarketTypeConfig[]; methodNote: string };
  retail: { intro: string; assortments: string[]; locationTypes: string[]; districts: string[]; note: string };
  steering: {
    intro: string;
    principles: SteeringPrinciple[];
    steps: SteeringStep[];
    examples: SteeringExample[];
    assortmentGroups: AssortmentGroup[];
    faqs: Faq[];
  };
};
