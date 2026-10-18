import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { SymbolShape } from "../../config/types";
import { bbox, toPath, type Pt } from "../../demo/geometry";

export type MapFeature = {
  id: string;
  label: string;
  fill: string;
  /** Fläche (Polygon) oder Punktsymbol. */
  points?: Pt[];
  at?: Pt;
  shape?: SymbolShape;
  size?: number;
  dashed?: boolean;
  /** Per Tastatur erreichbar. Für sehr viele Objekte (Betriebe, Hexagone) aus. */
  focusable?: boolean;
  clickable?: boolean;
  /** ID, die bei Auswahl gemeldet und für die Hervorhebung verglichen wird (Standard: id). */
  selectId?: string;
};

type Props = {
  ariaLabel: string;
  outline: Pt[];
  rivers: Pt[][];
  features: MapFeature[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Bei Änderung zoomt die Karte auf diese Punkte. */
  focus?: Pt[] | null;
  legend?: ReactNode;
  className?: string;
};

const W = 800;
const H = 520;
type View = { x: number; y: number; w: number };
const HOME: View = { x: 0, y: 0, w: W };

export function SchematicMap({ ariaLabel, outline, rivers, features, selectedId, onSelect, focus, legend, className }: Props) {
  const [view, setView] = useState<View>(HOME);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ x: number; y: number; view: View; moved: boolean } | null>(null);
  const focusKey = focus ? focus.map(p => p.join(",")).join(";") : "";

  useEffect(() => {
    if (!focus?.length) { setView(HOME); return; }
    const b = bbox(focus);
    const w = Math.max((b.maxX - b.minX) * 6, (b.maxY - b.minY) * 6 * (W / H), 260);
    setView({ x: (b.minX + b.maxX) / 2 - w / 2, y: (b.minY + b.maxY) / 2 - (w * H) / W / 2, w });
    // focusKey bildet den Inhalt von focus stabil ab, damit neue Array-Instanzen nicht neu zoomen
  }, [focusKey]);

  const zoom = (factor: number) =>
    setView(v => {
      const w = Math.min(W * 1.2, Math.max(60, v.w * factor));
      const h = (w * H) / W;
      return { x: v.x + v.w / 2 - w / 2, y: v.y + (v.w * H) / W / 2 - h / 2, w };
    });

  const scale = view.w / W;

  function onPointerDown(e: PointerEvent<SVGSVGElement>) {
    drag.current = { x: e.clientX, y: e.clientY, view, moved: false };
  }
  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    const d = drag.current;
    if (!d || !svgRef.current) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) svgRef.current.setPointerCapture(e.pointerId);
    d.moved = true;
    const k = d.view.w / svgRef.current.clientWidth;
    setView({ ...d.view, x: d.view.x - dx * k, y: d.view.y - dy * k });
  }
  function onPointerUp() {
    // Klick nach einer Verschiebung nicht als Auswahl werten
    setTimeout(() => (drag.current = null));
  }

  function select(id: string) {
    if (drag.current?.moved) return;
    onSelect?.(id);
  }
  function onKey(e: KeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(id);
    }
  }

  const sid = (f: MapFeature) => f.selectId ?? f.id;
  const areas = features.filter(f => f.points);
  const markers = features.filter(f => f.at);
  const ordered = [...areas, ...markers].sort((a, b) => Number(sid(a) === selectedId) - Number(sid(b) === selectedId));

  return (
    <div className={`schematic-map ${className ?? ""}`}>
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${(view.w * H) / W}`}
        role="group"
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <rect x={-W} y={-H} width={W * 3} height={H * 3} className="map-ground" />
        <path d={toPath(outline)} className="map-outline" style={{ strokeWidth: 2 * scale }} />
        {rivers.map((r, i) => (
          <path key={i} d={toPath(r, false)} className="map-river" style={{ strokeWidth: (i ? 10 : 18) }} />
        ))}
        {ordered.map(f => {
          const selected = sid(f) === selectedId;
          const interactive = f.clickable !== false && !!onSelect;
          const common = {
            className: `map-feature${selected ? " is-selected" : ""}${interactive ? " is-interactive" : ""}`,
            onClick: interactive ? () => select(sid(f)) : undefined,
            ...(f.focusable && interactive
              ? { tabIndex: 0, role: "button", "aria-label": f.label, "aria-pressed": selected, onKeyDown: (e: KeyboardEvent) => onKey(e, sid(f)) }
              : {})
          };
          if (f.points) {
            return (
              <path key={f.id} d={toPath(f.points)} fill={f.fill} {...common}
                style={{ strokeWidth: (selected ? 3 : 0.8) * scale, strokeDasharray: f.dashed ? `${4 * scale} ${3 * scale}` : undefined }}>
                <title>{f.label}</title>
              </path>
            );
          }
          return (
            <g key={f.id} {...common}>
              <title>{f.label}</title>
              <Symbol at={f.at!} shape={f.shape ?? "circle"} size={(f.size ?? 8) * scale * (selected ? 1.5 : 1)} fill={f.fill}
                strokeWidth={(selected ? 2.5 : 1.2) * scale} dashed={f.dashed} />
            </g>
          );
        })}
      </svg>

      <div className="map-controls">
        <button type="button" onClick={() => zoom(0.7)} aria-label="Hineinzoomen">+</button>
        <button type="button" onClick={() => zoom(1 / 0.7)} aria-label="Herauszoomen">−</button>
        <button type="button" onClick={() => setView(HOME)} aria-label="Gesamtansicht">⌂</button>
      </div>
      <span className="map-badge">Beispielkarte – schematisch</span>
      {legend ? <div className="map-legend">{legend}</div> : null}
    </div>
  );
}

export function Symbol({ at: [x, y], shape, size, fill, strokeWidth = 1.2, dashed }: {
  at: Pt; shape: SymbolShape; size: number; fill: string; strokeWidth?: number; dashed?: boolean;
}) {
  const s = size;
  const props = { fill, className: "map-symbol", style: { strokeWidth, strokeDasharray: dashed ? `${s / 3} ${s / 4}` : undefined } };
  if (shape === "square") return <rect x={x - s * 0.85} y={y - s * 0.85} width={s * 1.7} height={s * 1.7} rx={s * 0.15} {...props} />;
  if (shape === "triangle") return <polygon points={`${x},${y - s * 1.1} ${x + s},${y + s * 0.75} ${x - s},${y + s * 0.75}`} {...props} />;
  if (shape === "diamond") return <polygon points={`${x},${y - s * 1.1} ${x + s * 1.1},${y} ${x},${y + s * 1.1} ${x - s * 1.1},${y}`} {...props} />;
  return <circle cx={x} cy={y} r={s} {...props} />;
}

/** Kleines Legendensymbol außerhalb der Karte. */
export function LegendSymbol({ shape, fill, dashed }: { shape: SymbolShape; fill: string; dashed?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true" className="legend-symbol">
      <Symbol at={[0, 0]} shape={shape} size={5.5} fill={fill} strokeWidth={1.2} dashed={dashed} />
    </svg>
  );
}
