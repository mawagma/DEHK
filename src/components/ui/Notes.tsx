import type { CSSProperties, ReactNode } from "react";
import type { HeroImage } from "../../config/types";
import { ImageCredit } from "./ImageCredit";
import { Icon } from "./Icon";

/** Seitenkopf im GMA-Stil: blaue Fläche mit schräger Kante. */
export function PageIntro({ title, text, image, children }: { title: string; text: string; image?: HeroImage; children?: ReactNode }) {
  // Absolute URL: relative Pfade in CSS-Variablen würden relativ zum Stylesheet aufgelöst.
  const style = image ? ({ "--hero-image": `url("${new URL(image.src, document.baseURI).href}")`, "--hero-focus": image.focusX ?? "50%" } as CSSProperties) : undefined;
  return (
    <header className={image ? "page-hero has-image" : "page-hero"} style={style}>
      <div className="page-hero-panel">
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
    <Hint title="Prototyp mit Beispieldaten">
      Karten, Einzelbetriebe und einzelne Diagramme sind schematische Beispiele. Sie werden durch freigegebene ArcGIS-Daten ersetzt.
    </Hint>
  );
}
