import type { IconName } from "../../config/types";
import { Icon } from "./Icon";

type Props = { value: string; label: string; meta?: string; icon?: IconName };

export function MetricCard({ value, label, meta, icon }: Props) {
  return (
    <article className="metric-card">
      {icon ? <span className="metric-icon"><Icon name={icon} /></span> : null}
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {meta ? <small>{meta}</small> : null}
      </div>
    </article>
  );
}
