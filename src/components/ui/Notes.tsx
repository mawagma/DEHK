import type { CSSProperties, ReactNode } from "react";
import type { HeroImage } from "../../config/types";
import { ImageCredit } from "./ImageCredit";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

/** Absolute URL: relative Pfade in CSS-Variablen würden relativ zum Stylesheet aufgelöst. */
export const cssImage = (src: string) => `url("${new URL(src, document.baseURI).href}")`;

/** Seitenkopf: Foto mit GMA-Blauverlauf, Brotkrumen, Titel. */
export function PageIntro({ title, text, image, children }: { title: string; text: string; image?: HeroImage; children?: ReactNode }) {
  const style = image ? ({ "--hero-image": cssImage(image.src), "--hero-focus": image.focusX ?? "70%" } as CSSProperties) : undefined;
  return (
    <header className={image ? "page-hero has-image" : "page-hero"} style={style}>
      <div className="page-hero-inner">
        <nav className="crumbs" aria-label="Brotkrumen">
          <Link to="/">Überblick</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
      {image ? <ImageCredit image={image} className="image-credit" /> : null}
    </header>
  );
}

/** Hinweisbox mit Info-Symbol (Methodik, Datenstand, Beispielcharakter). */
export function Hint({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="hint">
      <Icon name="info" size={20} />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function DemoNotice() {
  return (
    <p className="demo-note">
      <Icon name="info" size={16} />
      <span><b>Prototyp mit Beispieldaten.</b> Karten, Einzelbetriebe und einzelne Diagramme sind schematisch und werden durch freigegebene ArcGIS-Daten ersetzt.</span>
    </p>
  );
}
