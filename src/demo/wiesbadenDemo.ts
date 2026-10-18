// BEISPIELDATEN – schematische Karte und erfundene Einzelbetriebe für den Prototyp.
// Ersetzen durch öffentliche ArcGIS-Daten, sobald WebMap-IDs vorliegen. Keine fachliche Aussage.
import type { MunicipalityConfig } from "../config/types";
import { distance, hexagon, pointInPolygon, seededRandom, type Pt } from "./geometry";
import type { DemoData, DemoDevelopmentRow, DemoHex, DemoStore } from "./types";

const outline: Pt[] = [
  [120, 250], [150, 170], [220, 118], [300, 80], [380, 58], [455, 70], [525, 96], [592, 140], [640, 200],
  [662, 272], [648, 335], [690, 405], [655, 455], [565, 470], [470, 462], [380, 448], [300, 438], [222, 424],
  [160, 388], [112, 322]
];
const river: Pt[] = [[0, 478], [140, 436], [230, 446], [320, 462], [420, 474], [520, 486], [620, 482], [700, 438], [800, 420]];
const tributary: Pt[] = [[700, 438], [760, 395], [800, 380]];

const centerPos: Record<string, { at: Pt; r: number }> = {
  innenstadt: { at: [400, 250], r: 36 },
  biebrich: { at: [372, 412], r: 20 },
  dotzheim: { at: [290, 268], r: 13 },
  sonnenberg: { at: [470, 160], r: 12 },
  bierstadt: { at: [522, 248], r: 12 },
  erbenheim: { at: [580, 330], r: 12 },
  "mainz-kastel": { at: [505, 440], r: 12 },
  "mainz-kostheim": { at: [585, 440], r: 12 },
  schierstein: { at: [250, 398], r: 13 },
  schelmengraben: { at: [218, 308], r: 11 },
  aeppelallee: { at: [318, 392], r: 16 },
  borsigstrasse: { at: [452, 392], r: 16 },
  boelckestrasse: { at: [412, 352], r: 14 }
};

const districtAnchors: Array<[string, Pt]> = [
  ["Mitte", [400, 250]], ["Nord", [430, 120]], ["Ost", [565, 262]], ["Süd", [380, 420]], ["West", [245, 330]], ["AKK", [545, 448]]
];

// Sortimentsgewichte je Standorttyp (Reihenfolge wie config.retail.assortments).
const assortmentWeights: Record<string, number[]> = {
  Hauptzentrum: [14, 14, 32, 12, 10, 3, 15],
  Stadtteilzentrum: [28, 22, 18, 10, 8, 4, 10],
  Nahversorgungszentrum: [40, 24, 8, 8, 6, 4, 10],
  Sonderstandort: [10, 6, 10, 14, 28, 24, 8],
  "Sonstige Lage": [30, 16, 10, 10, 12, 10, 12]
};

const storeCounts: Record<string, number> = { hz: 498, stz: 67, nvz: 25, sst: 30 };
const TOTAL_STORES = 1606;

export function buildWiesbadenDemo(config: MunicipalityConfig): DemoData {
  const rand = seededRandom(2025);
  const pick = <T,>(items: T[], weights?: number[]) => {
    const w = weights ?? items.map(() => 1);
    let roll = rand() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < items.length; i++) if ((roll -= w[i]) < 0) return items[i];
    return items[items.length - 1];
  };
  const gauss = (at: Pt, sigma: number): Pt => {
    const r = Math.sqrt(-2 * Math.log(1 - rand())) * sigma;
    const a = rand() * Math.PI * 2;
    return [at[0] + r * Math.cos(a), at[1] + r * Math.sin(a)];
  };
  const randomInside = (): Pt => {
    for (;;) {
      const p: Pt = [100 + rand() * 600, 55 + rand() * 420];
      if (pointInPolygon(p, outline)) return p;
    }
  };
  const districtOf = (p: Pt) => districtAnchors.reduce((best, d) => (distance(p, d[1]) < distance(p, best[1]) ? d : best))[0];
  const categoryLabel = (id: string) => config.centerCategories.find(c => c.id === id)?.label ?? "Sonstige Lage";

  const centers = config.centers.flatMap(c => {
    const pos = centerPos[c.id];
    if (!pos) return [];
    const shape = Array.from({ length: 10 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 10;
      const r = pos.r * (0.78 + rand() * 0.4);
      return [pos.at[0] + r * Math.cos(a), pos.at[1] + r * Math.sin(a)] as Pt;
    });
    return [{ id: c.id, at: pos.at, shape }];
  });

  const stores: DemoStore[] = [];
  const addStore = (at: Pt, locationType: string, centerId?: string) => {
    const n = stores.length + 1;
    const big = locationType === "Sonderstandort" ? 3 : 1;
    stores.push({
      id: `S${n}`,
      name: `Beispielbetrieb ${String(n).padStart(4, "0")}`,
      at,
      locationType,
      district: districtOf(at),
      assortment: pick(config.retail.assortments, assortmentWeights[locationType]),
      sizeClass: pick(["unter 400 m²", "400 bis 800 m²", "über 800 m²"], [10, 3 * big, 1.5 * big]),
      centerId
    });
  };

  for (const c of config.centers) {
    const pos = centerPos[c.id];
    if (!pos || c.status === "perspektivisch") continue;
    const type = categoryLabel(c.categoryId);
    // Profilzahl aus der Konfiguration, sonst Standardwert je Kategorie
    for (let i = 0; i < (c.stores ?? storeCounts[c.categoryId] ?? 0); i++) addStore(gauss(pos.at, pos.r * 0.45), type, c.id);
  }
  while (stores.length < TOTAL_STORES) addStore(randomInside(), "Sonstige Lage");

  const markets = [
    ...centers.flatMap(c => Array.from({ length: c.id === "innenstadt" ? 4 : 2 }, () => gauss(c.at, 8))),
    ...Array.from({ length: 26 }, randomInside)
  ].map((at, i) => ({
    id: `M${i + 1}`,
    name: `Beispielmarkt ${i + 1}`,
    at,
    typeId: pick(config.supply.marketTypes.map(t => t.id), [5, 5, 2, 1])
  }));

  // Hexagon-Klassen sind hier nur simuliert; real liefert GMA fertige Indexwerte.
  const r = 13;
  const hexes: DemoHex[] = [];
  const M_PER_UNIT = 25; // Beispielkarte: 1 Karteneinheit ≈ 25 m
  const WALK = 1000 / M_PER_UNIT;
  for (let row = 0; row * r * 1.5 < 480; row++) {
    for (let col = 0; col * r * Math.sqrt(3) < 760; col++) {
      const at: Pt = [60 + col * r * Math.sqrt(3) + (row % 2) * r * (Math.sqrt(3) / 2), 50 + row * r * 1.5];
      if (!pointInPolygon(at, outline)) continue;
      const nearest = Math.min(...markets.map(m => distance(at, m.at)));
      const d = nearest * (0.85 + rand() * 0.3);
      const classId = rand() < 0.02 ? "0" : d < 28 ? "1" : d < 48 ? "2" : d < 72 ? "3" : d < 100 ? "4" : "5";
      // Einwohner: dichter nahe der Zentren, dünner am Rand (Demo)
      const nearCenter = Math.min(...centers.map(c => distance(at, c.at)));
      const pop = Math.max(0, Math.round((900 * Math.exp(-nearCenter / 70) + 40 + rand() * 120) / 5) * 5);
      hexes.push({
        id: `H${hexes.length + 1}`, classId, points: hexagon(at, r), pop,
        nearestMarketM: Math.round((nearest * M_PER_UNIT * 1.3) / 10) * 10, // Fußweg ≈ Luftlinie × 1,3
        marketsInWalk: markets.filter(m => distance(at, m.at) <= WALK).length,
        district: districtOf(at)
      });
    }
  }

  const exampleAddresses = [
    { label: "Marktplatz (Mitte)", at: [402, 252] as Pt },
    { label: "Rathausstraße (Biebrich)", at: [372, 414] as Pt },
    { label: "Wiesbadener Straße (Dotzheim)", at: [286, 270] as Pt },
    { label: "Danziger Straße (Sonnenberg)", at: [470, 150] as Pt },
    { label: "Am Hafen (Schierstein)", at: [252, 404] as Pt },
    { label: "Nordwestlicher Stadtrand", at: [175, 215] as Pt },
    { label: "Östlicher Siedlungsrand", at: [630, 250] as Pt }
  ];

  const districtSupply = districtAnchors.map(([district]) => {
    const inD = hexes.filter(h => h.district === district);
    const pop = inD.reduce((n, h) => n + h.pop, 0) || 1;
    const good = inD.filter(h => h.classId === "1" || h.classId === "2").reduce((n, h) => n + h.pop, 0);
    return { district, wellSuppliedPct: Math.round((good / pop) * 100) };
  });

  // Entwicklung: 2025 = aktueller Bestand; frühere Jahre über feste Demo-Faktoren je Warengruppe.
  const pastFactor: Record<string, number> = {
    "Nahrungs- und Genussmittel": 1.03, "Gesundheit, Körperpflege": 1.0, "Bekleidung, Schuhe": 1.2, "Elektrowaren, Medien": 1.16,
    "Haus, Einrichtung, Möbel": 1.06, "Bau, Garten, Heimtier": 0.97, "Sonstige Sortimente": 1.09
  };
  const developmentTable: DemoDevelopmentRow[] = [];
  for (const assortment of config.retail.assortments) {
    for (const locationType of config.retail.locationTypes) {
      const now = stores.filter(st => st.assortment === assortment && st.locationType === locationType).length;
      const f = pastFactor[assortment] ?? 1.05;
      developmentTable.push(
        { year: "2015", assortment, locationType, count: Math.round(now * f) },
        { year: "2020", assortment, locationType, count: Math.round(now * (1 + (f - 1) / 2)) },
        { year: "2025", assortment, locationType, count: now }
      );
    }
  }

  return {
    outline,
    rivers: [river, tributary],
    centers,
    stores,
    markets,
    hexes,
    developmentTable,
    exampleAddresses,
    districtSupply
  };
}
