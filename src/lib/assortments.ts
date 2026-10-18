import type { AssortmentItem } from "../config/types";

/** Sortimentseinträge dürfen als Text oder als Objekt mit Synonymen vorliegen. */
export const itemName = (i: AssortmentItem) => (typeof i === "string" ? i : i.name);
export const itemSynonyms = (i: AssortmentItem) => (typeof i === "string" ? [] : i.synonyms ?? []);
