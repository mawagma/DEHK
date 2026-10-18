import { EMPTY_FILTER, isFilterActive, toggle, type RetailFilter } from "../../lib/retailFilter";

type Props = {
  value: RetailFilter;
  onChange: (next: RetailFilter) => void;
  assortments: string[];
  locationTypes: string[];
  districts: string[];
};

/** Mehrfachauswahl als aufklappbare Checkbox-Liste (native <details>, tastaturbedienbar). */
function MultiSelect({ label, all, options, selected, onChange }: { label: string; all: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const summary = !selected.length ? all : selected.length === 1 ? selected[0] : `${selected.length} ausgewählt`;
  return (
    <div className="filter-field">
      <span className="filter-label" id={`lbl-${label}`}>{label}</span>
      <details className="multi-select">
        <summary aria-labelledby={`lbl-${label}`} aria-describedby={`sum-${label}`}><span id={`sum-${label}`}>{summary}</span></summary>
        <fieldset>
          <legend className="sr-only">{label}</legend>
          {options.map(o => (
            <label key={o}>
              <input type="checkbox" checked={selected.includes(o)} onChange={() => onChange(toggle(selected, o))} />
              {o}
            </label>
          ))}
        </fieldset>
      </details>
    </div>
  );
}

export function RetailFilterBar({ value, onChange, assortments, locationTypes, districts }: Props) {
  return (
    <form className="filter-bar" onSubmit={e => e.preventDefault()} aria-label="Filter für den Betriebsbestand">
      <MultiSelect label="Sortiment" all="Alle Sortimente" options={assortments} selected={value.assortments} onChange={assortments => onChange({ ...value, assortments })} />
      <label className="filter-field">
        <span className="filter-label">Standorttyp</span>
        <select value={value.locationType} onChange={e => onChange({ ...value, locationType: e.target.value })}>
          <option value="">Alle Standorttypen</option>
          {locationTypes.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
      <MultiSelect label="Raum" all="Gesamtstadt" options={districts} selected={value.districts} onChange={districts => onChange({ ...value, districts })} />
      <button type="button" className="text-button" onClick={() => onChange(EMPTY_FILTER)} disabled={!isFilterActive(value)}>
        Alle zurücksetzen
      </button>
    </form>
  );
}

/** Aktive Filter als entfernbare Chips. */
export function ActiveFilters({ value, onChange, centerName }: { value: RetailFilter; onChange: (f: RetailFilter) => void; centerName?: string }) {
  if (!isFilterActive(value)) return null;
  const chips = [
    ...value.assortments.map(a => ({ key: `s-${a}`, text: a, remove: () => onChange({ ...value, assortments: toggle(value.assortments, a) }) })),
    ...(value.locationType ? [{ key: "l", text: value.locationType, remove: () => onChange({ ...value, locationType: "" }) }] : []),
    ...value.districts.map(d => ({ key: `r-${d}`, text: `Raum: ${d}`, remove: () => onChange({ ...value, districts: toggle(value.districts, d) }) })),
    ...(value.centerId ? [{ key: "z", text: `Bereich: ${centerName ?? value.centerId}`, remove: () => onChange({ ...value, centerId: "" }) }] : [])
  ];
  return (
    <ul className="filter-chips" aria-label="Aktive Filter">
      {chips.map(c => (
        <li key={c.key}>
          <span>{c.text}</span>
          <button type="button" aria-label={`Filter „${c.text}“ entfernen`} onClick={c.remove}>×</button>
        </li>
      ))}
      <li className="chip-reset"><button type="button" className="text-button" onClick={() => onChange(EMPTY_FILTER)}>Alle zurücksetzen</button></li>
    </ul>
  );
}
