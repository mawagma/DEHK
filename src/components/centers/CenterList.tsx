import type { Center } from "../../config/municipalities/wiesbaden";

type Props = {
  centers: readonly Center[];
  selectedId?: string;
  onSelect: (center: Center) => void;
};

export function CenterList({ centers, selectedId, onSelect }: Props) {
  const groups = Array.from(new Set(centers.map(c => c.category)));

  return (
    <div className="center-list">
      {groups.map(category => (
        <section key={category}>
          <h3>{category}</h3>
          {centers.filter(c => c.category === category).map(center => (
            <button
              key={center.id}
              type="button"
              className={selectedId === center.id ? "center-row is-selected" : "center-row"}
              onClick={() => onSelect(center)}
            >
              <span>{center.name}</span>
              {center.status === "perspektivisch" ? <small>perspektivisch</small> : null}
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}
