import { Link } from "react-router-dom";
import type { MunicipalityConfig } from "../../config/types";
import { aboutEnabled } from "../../lib/about";
import { GlossaryTerm } from "../ui/GlossaryTerm";
import { Icon } from "../ui/Icon";

/** Kernaussagen, Versorgungslücken, ergänzende Angebote und Erklärung des Index (statisch, keine Berechnung). */
export function SupplyInsights({ config }: { config: MunicipalityConfig }) {
  const s = config.supply;
  return (
    <>
      {s.keyMessages?.length || s.gaps?.length ? (
        <div className="insight-grid">
          {s.keyMessages?.length ? (
            <section className="card insight" aria-labelledby="supply-key">
              <h2 id="supply-key">Kernaussagen</h2>
              <ul className="accent-list">{s.keyMessages.map(k => <li key={k}>{k}</li>)}</ul>
            </section>
          ) : null}
          {s.gaps?.length ? (
            <section className="card insight" aria-labelledby="supply-gaps">
              <h2 id="supply-gaps">Versorgungslücken</h2>
              <dl className="gap-list">
                {s.gaps.map(g => <div key={g.area}><dt>{g.area}</dt><dd>{g.text}</dd></div>)}
              </dl>
            </section>
          ) : null}
        </div>
      ) : null}

      <section className="method card" aria-labelledby="method-title">
        <h2 id="method-title">So entsteht der <GlossaryTerm config={config} term="Nahversorgungsindex">Versorgungsgrad</GlossaryTerm></h2>
        <div className="formula" role="img" aria-label="Fußläufige Erreichbarkeit plus Angebot der Lebensmittelmärkte ergibt den Versorgungsgrad je Rasterzelle">
          <div className="formula-box"><Icon name="pin" /><b>Erreichbarkeit</b><span>Fußweg zum nächsten Lebensmittelmarkt</span></div>
          <span className="formula-op" aria-hidden="true">+</span>
          <div className="formula-box"><Icon name="cart" /><b>Angebot</b><span>Art und Zahl der Märkte ab 400 m²</span></div>
          <span className="formula-op" aria-hidden="true">=</span>
          <div className="formula-box is-result"><Icon name="chart" /><b>Versorgungsgrad</b><span>Index je Rasterzelle, von GMA berechnet</span></div>
        </div>
        <p>{s.methodNote}</p>
        {aboutEnabled(config) ? <Link className="text-link" to="/ueber-das-konzept?abschnitt=methodik">Mehr zur Methodik <span aria-hidden="true">→</span></Link> : null}
      </section>

      {s.complementary ? (
        <p className="demo-note"><Icon name="info" size={16} /><span><b>Ergänzende Angebote:</b> {s.complementary}</span></p>
      ) : null}
    </>
  );
}
