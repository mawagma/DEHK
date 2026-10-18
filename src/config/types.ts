// Explizite, kommunenunabhängige Konfigurationstypen. Jede Kommune ist eine Instanz von MunicipalityConfig.

export type ModuleId = "zentren" | "nahversorgung" | "einzelhandelsstruktur" | "einzelhandel-steuern" | "ueber-das-konzept";

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
  /** Lage, Ausdehnung, Erreichbarkeit */
  location?: string;
  /** Einzugsbereich / Versorgungsfunktion */
  supplyFunction?: string;
  /** Vorbereiteter Anteil an allen Betrieben der Stadt (%) */
  shareOfCityStoresPct?: number;
  /** Leerstehende Ladenlokale */
  vacancies?: number;
  /** Magnetbetriebe als Betriebstyp, ohne Flächen */
  anchors?: string[];
  strengths?: string[];
  weaknesses?: string[];
  /** Entwicklungsziel, neutral (z. B. "Sichern", "Stärken") – keine Ampel */
  goal?: { label: string; text: string };
  recommendations?: string[];
  /** Betriebe je Erhebungsjahr, nur bei vergleichbarer Abgrenzung */
  development?: ShareRow[];
  image?: HeroImage;
  /** Nur perspektivische Zentren: Voraussetzungen, Zeithorizont */
  prospectNote?: string;
};

export type SupplyClassConfig = { id: string; label: string; color: string };
export type MarketTypeConfig = { id: string; label: string; color: string };

export type SteeringPrinciple = { title: string; text: string; icon: IconName };
export type SteeringStep = { question: string; title: string; text: string };
export type SteeringExample = { id: string; title: string; where: string; what: string; size: string; assessment: string; /** Verlinkung auf ein Zentrenprofil */ centerId?: string };
export type AssortmentItem = string | {
  name: string; synonyms?: string[]; note?: string;
  /** Warengruppe der Einzelhandelsstruktur (retail.assortments) für den Link „Wo gibt es das heute?“ */
  retailGroup?: string;
};
export type AssortmentGroup = { id: string; label: string; description: string; items: AssortmentItem[] };
export type SteeringGuideline = { id: string; title: string; text: string; appliesTo: string };
/** Matrix Standort × Sortiment mit neutralen Textlabels (keine Ampel). cells[zeile][spalte] */
export type SteeringMatrix = { rows: string[]; cols: string[]; cells: string[][] };
export type Faq = { question: string; answer: string };

export type IconName = "pin" | "cart" | "chart" | "document" | "building" | "leaf" | "info" | "mail";

/** Bild für Seitenköpfe/Kacheln. Bei CC-Lizenzen ist der Nachweis Pflicht und wird angezeigt. */
export type HeroImage = {
  src: string;
  /** Kleinere Variante für Kacheln. */
  cardSrc?: string;
  /** Horizontale Bildposition (CSS), damit das Motiv sichtbar bleibt. */
  focusX?: string;
  credit?: { author: string; sourceUrl: string; license: string; licenseUrl: string };
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
  /** Bild je Themenseite (Seitenkopf und Kachel auf der Startseite). */
  pageImages?: Partial<Record<ModuleId, HeroImage>>;
  /** "ueber-das-konzept" ist optional; fehlt der Schalter, ist die Seite aktiv, sobald `about` gepflegt ist. */
  modules: Record<Exclude<ModuleId, "ueber-das-konzept">, boolean> & { "ueber-das-konzept"?: boolean };
  /** Beschlussstand, z. B. "[Platzhalter] Entwurf, Beschluss geplant für …" */
  decisionStatus?: string;
  contact: {
    email: string; imprintUrl: string; privacyUrl: string; conceptUrl?: string;
    person?: { name: string; role: string; email?: string; phone?: string };
  };
  about?: {
    intro: string;
    process: string[];
    method: { title: string; text: string }[];
    dataSources: { label: string; status: string }[];
    downloads: { label: string; url: string }[];
  };
  glossary?: { term: string; definition: string }[];
  arcgis: ArcGISConfig;
  overview: { headline: string; intro: string; metrics: Metric[]; keyMessages?: string[]; whatsNew?: string[] };
  centerCategories: CenterCategoryConfig[];
  centers: CenterConfig[];
  supply: {
    intro: string; classes: SupplyClassConfig[]; marketTypes: MarketTypeConfig[]; methodNote: string;
    keyMessages?: string[];
    gaps?: { area: string; text: string }[];
    /** Lebensmittelhandwerk, Wochenmärkte … */
    complementary?: string;
  };
  retail: {
    intro: string; assortments: string[]; locationTypes: string[]; districts: string[]; note: string;
    /** Warengruppe -> Bedarfsstufe (kurz-/mittel-/langfristig) */
    needLevelByAssortment?: Record<string, string>;
    keyMessages?: string[];
    storeDefinition?: string;
  };
  steering: {
    intro: string;
    principles: SteeringPrinciple[];
    steps: SteeringStep[];
    examples: SteeringExample[];
    assortmentGroups: AssortmentGroup[];
    faqs: Faq[];
    /** Ansiedlungsleitsätze */
    guidelines?: SteeringGuideline[];
    matrix?: SteeringMatrix;
    procedure?: { title: string; text: string }[];
  };
};
