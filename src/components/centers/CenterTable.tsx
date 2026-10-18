import { useState } from "react";
import type { CenterConfig, MunicipalityConfig } from "../../config/types";
import { isCentral, MAX_COMPARE, sortCenters, sumOf, type CenterSortKey, type SortDir } from "../../lib/centers";

type Props = {
  config: MunicipalityConfig;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onOpen: (id: string) => void;
};

const fmt = (n?: number, unit = "") => (n === undefined ? "–" : `${n.toLocaleString("de-DE")}${unit}`);
const columns: { key: CenterSortKey; label: string; num?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "category", label: "Kategorie" },
  { key: "stores", label: "Betriebe", num: true },
  { key: "salesAreaM2", label: "Verkaufsfläche", num: true }
];

/** Tabelle der zentralen Versorgungsbereiche (sortierbar, mit Summe) und darunter die Sonderstandorte – nicht mitsummiert. */
export function CenterTable({ config, compareIds, onToggleCompare, onOpen }: Props) {
  const [sort, setSort] = useState<{ key: CenterSortKey; dir: SortDir }>({ key: "stores", dir: "desc" });
  const label = (id: string) => config.centerCategories.find(c => c.id === id)?.label ?? id;
  const zvb = sortCenters(config.centers.filter(c => isCentral(config, c)), sort.key, sort.dir, label);
  const special = sortCenters(config.centers.filter(c => !isCentral(config, c)), sort.key, sort.dir, label);
  const full = compareIds.length >= MAX_COMPARE;

  const toggleSort = (key: CenterSortKey) =>
    setSort(s => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : key === "name" || key === "category" ? "asc" : "desc" }));

  const row = (c: CenterConfig, comparable: boolean) => (
    <tr key={c.id}>
      <td>
        <button type="button" className="table-link" onClick={() => onOpen(c.id)}>{c.name}</button>
        {c.status === "perspektivisch" ? <span className="chip is-warning small-chip">perspektivisch</span> : null}
      </td>
      <td>{label(c.categoryId)}</td>
      <td className="num">{fmt(c.stores)}</td>
      <td className="num">{fmt(c.salesAreaM2, " m²")}</td>
      <td className="num">
        {comparable ? (
          <input
            type="checkbox"
            aria-label={`${c.name} vergleichen`}
            checked={compareIds.includes(c.id)}
            disabled={full && !compareIds.includes(c.id)}
            onChange={() => onToggleCompare(c.id)}
          />
        ) : null}
      </td>
    </tr>
  );

  return (
    <section className="center-table" aria-labelledby="table-title">
      <div className="section-row">
        <h2 id="table-title">Alle Standorte im Überblick</h2>
        <p className="muted small">Bis zu {MAX_COMPARE} zentrale Versorgungsbereiche zum Vergleich auswählen.</p>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <caption className="sr-only">Zentrale Versorgungsbereiche und Sonderstandorte mit Betrieben und Verkaufsfläche</caption>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col" className={col.num ? "num" : undefined}
                  aria-sort={sort.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                  <button type="button" className="sort-button" onClick={() => toggleSort(col.key)}>
                    {col.label} <span aria-hidden="true">{sort.key === col.key ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}</span>
                  </button>
                </th>
              ))}
              <th scope="col" className="num">Vergleich</th>
            </tr>
          </thead>
          <tbody>
            <tr className="group-row"><th colSpan={5} scope="rowgroup">Zentrale Versorgungsbereiche</th></tr>
            {zvb.map(c => row(c, true))}
            <tr className="sum-row">
              <td colSpan={2}>Summe zentrale Versorgungsbereiche</td>
              <td className="num">{fmt(sumOf(zvb, "stores"))}</td>
              <td className="num">{fmt(sumOf(zvb, "salesAreaM2"), " m²")}</td>
              <td />
            </tr>
          </tbody>
          {special.length ? (
            <tbody>
              <tr className="group-row"><th colSpan={5} scope="rowgroup">Sonderstandorte – kein zentraler Versorgungsbereich, nicht in der Summe</th></tr>
              {special.map(c => row(c, false))}
            </tbody>
          ) : null}
        </table>
      </div>
    </section>
  );
}
