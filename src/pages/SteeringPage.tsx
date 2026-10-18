import { useState } from "react";
import type { MunicipalityConfig } from "../config/types";
import { AssortmentSearch, ExampleSwitcher, SteeringFlow } from "../components/steering/Steering";
import { Icon } from "../components/ui/Icon";
import { Hint, PageIntro } from "../components/ui/Notes";

const sections = [
  { id: "grundprinzipien", label: "Grundprinzipien" },
  { id: "steuerungslogik", label: "Steuerungslogik" },
  { id: "sortimentsliste", label: "Sortimentsliste" },
  { id: "beispiele", label: "Beispiele aus der Praxis" },
  { id: "fragen", label: "Häufige Fragen" }
] as const;
type SectionId = (typeof sections)[number]["id"];

export function SteeringPage({ config }: { config: MunicipalityConfig }) {
  const [active, setActive] = useState<SectionId>("grundprinzipien");
  const s = config.steering;

  return (
    <>
      <PageIntro image={config.pageImages?.["einzelhandel-steuern"]} title="Einzelhandel steuern" text={s.intro} />
      <section className="page">

      <div className="steering-layout">
        <nav className="side-nav" aria-label="Kapitel">
          {sections.map(sec => (
            <button key={sec.id} type="button" aria-current={active === sec.id ? "true" : undefined} onClick={() => setActive(sec.id)}>
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

          {active === "steuerungslogik" ? (
            <>
              <h2>So funktioniert die Steuerung</h2>
              <p className="lead">Jedes Vorhaben wird anhand von vier Fragen eingeordnet.</p>
              <SteeringFlow steps={s.steps} />
            </>
          ) : null}

          {active === "sortimentsliste" ? (
            <>
              <h2>Sortimentsliste</h2>
              <p className="lead">Welche Sortimente sind zentrenrelevant, nahversorgungsrelevant oder nicht zentrenrelevant?</p>
              <AssortmentSearch groups={s.assortmentGroups} />
            </>
          ) : null}

          {active === "beispiele" ? (
            <>
              <h2>Beispiele aus der Praxis</h2>
              <p className="lead">Typische Situationen zeigen, wie die Grundsätze des Konzepts zusammenwirken.</p>
              <ExampleSwitcher examples={s.examples} />
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

          <Hint title="Vollständiges Konzept">
            Diese Seite fasst die Steuerungslogik vereinfacht zusammen. Maßgeblich ist das vollständige Einzelhandelskonzept ({config.conceptStatus}).
            {config.contact.conceptUrl ? <> <a href={config.contact.conceptUrl}>Zum Konzept (PDF) →</a></> : null}
          </Hint>
          {config.isDemo ? <p className="muted small">Texte, Beispiele und Sortimentsliste sind Beispielinhalte und noch nicht fachlich freigegeben.</p> : null}
        </div>
      </div>
    </section>
    </>
  );
}
