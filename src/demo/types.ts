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
};

export type DemoMarket = { id: string; name: string; at: Pt; typeId: string };
export type DemoHex = { id: string; classId: string; points: Pt[] };

export type DemoData = {
  outline: Pt[];
  rivers: Pt[][];
  centers: DemoCenter[];
  stores: DemoStore[];
  markets: DemoMarket[];
  hexes: DemoHex[];
  development: Array<{ label: string; value: number }>;
};
