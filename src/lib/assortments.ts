import type { AssortmentGroup, AssortmentItem } from "../config/types";

/** Sortimentseinträge dürfen als Text oder als Objekt mit Synonymen vorliegen. */
export const itemName = (i: AssortmentItem) => (typeof i === "string" ? i : i.name);
export const itemSynonyms = (i: AssortmentItem) => (typeof i === "string" ? [] : i.synonyms ?? []);
export const itemRetailGroup = (i: AssortmentItem) => (typeof i === "string" ? undefined : i.retailGroup);

export type AssortmentHit = { item: AssortmentItem; name: string; viaSynonym?: string };

/** Sucht in Namen und Synonymen (ohne Groß-/Kleinschreibung). Ohne Suchbegriff: alle Einträge. */
export function searchAssortments(groups: AssortmentGroup[], query: string) {
  const q = query.trim().toLowerCase();
  return groups.map(g => ({
    group: g,
    hits: g.items.flatMap<AssortmentHit>(item => {
      const name = itemName(item);
      if (!q || name.toLowerCase().includes(q)) return [{ item, name }];
      const syn = itemSynonyms(item).find(s => s.toLowerCase().includes(q));
      return syn ? [{ item, name, viaSynonym: syn }] : [];
    })
  }));
}
