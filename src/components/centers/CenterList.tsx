import type { MunicipalityConfig } from "../../config/types";
import { LegendSymbol } from "../maps/SchematicMap";

type Props = {
  config: MunicipalityConfig;
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

export function CenterList({ config, selectedId, onSelect }: Props) {
  return (
    <div className="center-list">
      {config.centerCategories.map(cat => {
        const centers = config.centers.filter(c => c.categoryId === cat.id);
        if (!centers.length) return null;
        return (
          <section key={cat.id} aria-labelledby={`group-${cat.id}`}>
            <h3 id={`group-${cat.id}`}>
              <LegendSymbol shape={cat.symbol} fill={cat.color} />
              {cat.groupLabel} <span className="count">({centers.length})</span>
            </h3>
            <ul>
              {centers.map(center => (
                <li key={center.id}>
                  <button
                    type="button"
                    className={selectedId === center.id ? "center-row is-selected" : "center-row"}
                    aria-pressed={selectedId === center.id}
                    onClick={() => onSelect(center.id)}
                  >
                    <span>{center.name}</span>
                    {center.status === "perspektivisch" ? <small className="chip">perspektivisch</small> : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
