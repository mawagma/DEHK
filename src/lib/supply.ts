import type { SupplyClassConfig } from "../config/types";
import { pointInPolygon, type Pt } from "../demo/geometry";
import type { DemoHex } from "../demo/types";

export const DEFAULT_MIN_POPULATION = 10;

/** Einwohner je Versorgungsklasse (Summe der gelieferten Zellwerte) mit Anteil. */
export function populationByClass(hexes: DemoHex[], classes: SupplyClassConfig[]) {
  const total = hexes.reduce((n, h) => n + h.pop, 0) || 1;
  return classes.map(c => {
    const pop = hexes.filter(h => h.classId === c.id).reduce((n, h) => n + h.pop, 0);
    return { label: c.label, color: c.color, pop, pct: Math.round((pop / total) * 100) };
  });
}

/** Anteil der Einwohner in den angegebenen Klassen (gerundet). */
export function wellSuppliedShare(hexes: DemoHex[], classIds: string[]) {
  const total = hexes.reduce((n, h) => n + h.pop, 0);
  if (!total) return 0;
  const good = hexes.filter(h => classIds.includes(h.classId)).reduce((n, h) => n + h.pop, 0);
  return Math.round((good / total) * 100);
}

/** Einwohner gerundet auf 10; unter der Schwelle nicht ausweisen. */
export const populationLabel = (pop: number, min = DEFAULT_MIN_POPULATION) =>
  pop < min ? `weniger als ${min}` : `ca. ${(Math.round(pop / 10) * 10).toLocaleString("de-DE")}`;

/** Rasterzelle an einem Punkt (Nachschlagen, keine Berechnung). */
export const hexAt = (hexes: DemoHex[], at: Pt) => hexes.find(h => pointInPolygon(at, h.points));
