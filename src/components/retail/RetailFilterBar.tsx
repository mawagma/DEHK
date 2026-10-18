import { EMPTY_FILTER, type RetailFilter } from "../../lib/retailFilter";

type Field = { key: keyof RetailFilter; label: string; all: string; options: string[] };

type Props = {
  value: RetailFilter;
  onChange: (next: RetailFilter) => void;
  assortments: string[];
  locationTypes: string[];
  districts: string[];
};

export function RetailFilterBar({ value, onChange, assortments, locationTypes, districts }: Props) {
  const fields: Field[] = [
    { key: "assortment", label: "Sortiment", all: "Alle Sortimente", options: assortments },
    { key: "locationType", label: "Standorttyp", all: "Alle Standorttypen", options: locationTypes },
    { key: "district", label: "Raum", all: "Gesamtstadt", options: districts }
  ];
  const active = Object.values(value).some(Boolean);

  return (
    <form className="filter-bar" onSubmit={e => e.preventDefault()} aria-label="Filter für den Betriebsbestand">
      {fields.map(f => (
        <label key={f.key}>
          <span>{f.label}</span>
          <select value={value[f.key]} onChange={e => onChange({ ...value, [f.key]: e.target.value })}>
            <option value="">{f.all}</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      ))}
      <button type="button" className="text-button" onClick={() => onChange(EMPTY_FILTER)} disabled={!active}>
        Filter zurücksetzen
      </button>
    </form>
  );
}
