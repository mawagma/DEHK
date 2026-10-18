import type { MunicipalityConfig } from "../config/types";
import type { DemoData } from "./types";
import { buildWiesbadenDemo } from "./wiesbadenDemo";

const builders: Record<string, (config: MunicipalityConfig) => DemoData> = {
  wiesbaden: buildWiesbadenDemo
};
const cache = new Map<string, DemoData>();

/** Beispieldaten der Kommune oder null, wenn keine hinterlegt sind. */
export function getDemoData(config: MunicipalityConfig): DemoData | null {
  const build = builders[config.id];
  if (!build) return null;
  if (!cache.has(config.id)) cache.set(config.id, build(config));
  return cache.get(config.id)!;
}

export const isPlaceholderId = (id?: string) => !id || id.startsWith("YOUR_");
