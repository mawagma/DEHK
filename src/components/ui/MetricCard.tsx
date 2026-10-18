import { useEffect, useState } from "react";
import type { IconName } from "../../config/types";
import { Icon } from "./Icon";

type Props = { value: string; label: string; meta?: string; icon?: IconName };

/** Zählt deutsch formatierte Ganzzahlen ("1.606") einmal hoch; anderes bleibt statisch. */
function useCountUp(value: string) {
  const target = /^\d{1,3}(\.\d{3})*$|^\d+$/.test(value) ? Number(value.replace(/\./g, "")) : null;
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = useState(target === null || reduce ? target : 0);
  useEffect(() => {
    if (target === null || reduce) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(t) {
      const k = Math.min(1, (t - start) / 900);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, reduce]);
  return n === null ? value : n.toLocaleString("de-DE");
}

export function MetricCard({ value, label, meta, icon }: Props) {
  const shown = useCountUp(value);
  return (
    <article className="metric-card">
      {icon ? <span className="metric-icon"><Icon name={icon} /></span> : null}
      <div>
        {/* Screenreader lesen den Endwert, die Animation ist nur visuell */}
        <strong><span aria-hidden="true">{shown}</span><span className="sr-only">{value}</span></strong>
        <span>{label}</span>
        {meta ? <small>{meta}</small> : null}
      </div>
    </article>
  );
}
