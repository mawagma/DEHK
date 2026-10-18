import { useId } from "react";
import type { Pt } from "../../demo/geometry";

export type AddressOption = { label: string; at: Pt };

type Props = {
  /** Wählbare Adressen. Demo: feste Beispieladressen. Reale WebMap: Treffer des ArcGIS-Geocoders (offen, siehe CONTENT_TODO.md). */
  options: AddressOption[];
  value: string;
  /** Meldet die gewählte Adresse (oder null beim Zurücksetzen); die Seite schlägt die Rasterzelle nach. */
  onChange: (address: AddressOption | null) => void;
};

/** „Wie ist meine Adresse versorgt?“ – Auswahl einer Adresse, das Ergebnis zeigt die Seite wie eine Hexagon-Auswahl. */
export function AddressCheck({ options, value, onChange }: Props) {
  const id = useId();
  if (!options.length) return null;
  return (
    <section className="side-block address-check">
      <h2><label htmlFor={id}>Wie ist meine Adresse versorgt?</label></h2>
      <select id={id} value={value} onChange={e => onChange(options.find(o => o.label === e.target.value) ?? null)}>
        <option value="">Beispieladresse wählen …</option>
        {options.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
      </select>
      <p className="muted small">Demo: Auswahl aus Beispieladressen. Die freie Adresssuche folgt mit der ArcGIS-Anbindung.</p>
    </section>
  );
}
