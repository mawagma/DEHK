import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function PageIntro({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="page-intro">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {children}
    </div>
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
