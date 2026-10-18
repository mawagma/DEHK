import type { Pt } from "./geometry";

export type DemoCenter = { id: string; at: Pt; shape: Pt[] };

export type DemoStore = {
  id: string;
  name: string;
  at: Pt;
  assortment: string;
  locationType: string;
  district: string;
  /** Nur Größenklasse – keine exakte Verkaufsfläche (Datenschutzprinzip PUBLIC). */
  sizeClass: string;
  /** Zentrum/Standort, in dessen Abgrenzung der Betrieb liegt (falls zutreffend). */
  centerId?: string;
};

/** Vorbereitete Entwicklungstabelle (real: von GMA geliefert): Betriebe je Jahr × Warengruppe × Standorttyp. */
export type DemoDevelopmentRow = { year: string; assortment: string; locationType: string; count: number };

export type DemoMarket = { id: string; name: string; at: Pt; typeId: string };
export type DemoHex = { id: string; classId: string; points: Pt[] };

export type DemoData = {
  outline: Pt[];
  rivers: Pt[][];
  centers: DemoCenter[];
  stores: DemoStore[];
  markets: DemoMarket[];
  hexes: DemoHex[];
  developmentTable: DemoDevelopmentRow[];
};
