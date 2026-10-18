import { Link, useSearchParams } from "react-router-dom";
import type { MunicipalityConfig } from "../config/types";
import { aboutEnabled } from "../lib/about";
import { AssortmentSearch, ExampleSwitcher, GuidelineList, MatrixTable, ProcedureSteps, SteeringFlow } from "../components/steering/Steering";
import { GlossaryTerm } from "../components/ui/GlossaryTerm";
import { Icon } from "../components/ui/Icon";
import { Hint, PageIntro } from "../components/ui/Notes";

/** Kapitel erscheinen nur, wenn Inhalte gepflegt sind. Auswahl steht in der URL (?kapitel=…). */
function chapters(config: MunicipalityConfig) {
  const s = config.steering;
  return [
    { id: "grundprinzipien", label: "Grundprinzipien", show: true },
    { id: "leitsaetze", label: "Ansiedlungsleitsätze", show: !!s.guidelines?.length },
    { id: "steuerungslogik", label: "Steuerungslogik", show: true },
    { id: "matrix", label: "Standort × Sortiment", show: !!s.matrix },
    { id: "sortimentsliste", label: "Sortimentsliste", show: true },
    { id: "beispiele", label: "Beispiele aus der Praxis", show: s.examples.length > 0 },
    { id: "fragen", label: "Häufige Fragen", show: s.faqs.length > 0 },
    { id: "verfahren", label: "Verfahren", show: !!s.procedure?.length }
  ].filter(c => c.show);
}

export function SteeringPage({ config }: { config: MunicipalityConfig }) {
  const [params, setParams] = useSearchParams();
  const list = chapters(config);
  const active = list.find(c => c.id === params.get("kapitel"))?.id ?? list[0].id;
  const s = config.steering;
  const centerName = (id: string) => config.centers.find(c => c.id === id)?.name;

  return (
    <>
      <PageIntro image={config.pageImages?.["einzelhandel-steuern"]} title="Einzelhandel steuern" text={s.intro} />
      <section className="page">

      <div className="steering-layout">
        <nav className="side-nav" aria-label="Kapitel">
          {list.map(sec => (
            <button key={sec.id} type="button" aria-current={active === sec.id ? "true" : undefined} onClick={() => setParams({ kapitel: sec.id }, { replace: true })}>
              {sec.label}
            </button>
          ))}
        </nav>

        <div className="steering-content">
          {active === "grundprinzipien" ? (
            <>
              <h2>Grundprinzipien der Einzelhandelssteuerung</h2>
              <p className="lead">
                Das Einzelhandelskonzept verfolgt das Ziel, eine ausgewogene und zukunftsfähige Einzelhandelsentwicklung zu unterstützen –
                mit lebendigen Zentren, einer flächendeckenden Nahversorgung und einer städtebaulich verträglichen Standortentwicklung.
              </p>
              <div className="principle-grid">
                {s.principles.map(p => (
                  <article key={p.title} className="card principle">
                    <span className="principle-icon"><Icon name={p.icon} size={34} /></span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </article>
                ))}
              </div>
            </>
          ) : null}

          {active === "leitsaetze" && s.guidelines ? (
            <>
              <h2>Ansiedlungsleitsätze</h2>
              <p className="lead">Die Leitsätze legen fest, welche Vorhaben an welchen Standorten vorgesehen sind.</p>
              <GuidelineList guidelines={s.guidelines} />
            </>
          ) : null}

          {active === "steuerungslogik" ? (
            <>
              <h2>So funktioniert die Steuerung</h2>
              <p className="lead">Jedes Vorhaben wird anhand von vier Fragen eingeordnet.</p>
              <SteeringFlow steps={s.steps} />
            </>
          ) : null}

          {active === "matrix" && s.matrix ? (
            <>
              <h2>Standort × Sortiment</h2>
              <p className="lead">
                Welche <GlossaryTerm config={config} term="Zentrenrelevantes Sortiment">Sortimentsgruppen</GlossaryTerm> sind an welchem Standorttyp vorgesehen?
              </p>
              <MatrixTable matrix={s.matrix} />
              <Hint title="Keine Einzelfallprüfung">Die Übersicht vereinfacht die Leitsätze. Ob ein konkretes Vorhaben möglich ist, klärt das Verfahren.</Hint>
            </>
          ) : null}

          {active === "sortimentsliste" ? (
            <>
              <h2>Sortimentsliste</h2>
              <p className="lead">Welche Sortimente sind zentrenrelevant, nahversorgungsrelevant oder nicht zentrenrelevant? Die Suche findet auch gängige Begriffe wie „Handy“ oder „E-Bike“.</p>
              <AssortmentSearch groups={s.assortmentGroups} retailLinks={config.modules.einzelhandelsstruktur} />
            </>
          ) : null}

          {active === "beispiele" ? (
            <>
              <h2>Beispiele aus der Praxis</h2>
              <p className="lead">Typische Situationen zeigen, wie die Grundsätze des Konzepts zusammenwirken.</p>
              <ExampleSwitcher examples={s.examples} centerName={config.modules.zentren ? centerName : undefined} />
            </>
          ) : null}

          {active === "fragen" ? (
            <>
              <h2>Häufige Fragen</h2>
              <div className="faq">
                {s.faqs.map(f => (
                  <details key={f.question}>
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </>
          ) : null}

          {active === "verfahren" && s.procedure ? (
            <>
              <h2>Verfahren</h2>
              <p className="lead">So läuft die Abstimmung eines Einzelhandelsvorhabens mit der Stadt ab.</p>
              <ProcedureSteps steps={s.procedure} config={config} />
            </>
          ) : null}

          <Hint title="Vollständiges Konzept">
            Diese Seite fasst die Steuerungslogik vereinfacht zusammen. Maßgeblich ist das vollständige Einzelhandelskonzept ({config.conceptStatus}).
            {config.contact.conceptUrl ? <> <a href={config.contact.conceptUrl}>Zum Konzept (PDF) →</a></> : null}
            {aboutEnabled(config) ? <> <Link to="/ueber-das-konzept">Über das Konzept →</Link></> : null}
          </Hint>
          {config.isDemo ? <p className="muted small">Texte, Beispiele und Sortimentsliste sind Beispielinhalte und noch nicht fachlich freigegeben.</p> : null}
        </div>
      </div>
    </section>
    </>
  );
}
