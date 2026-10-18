import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { MunicipalityConfig } from "../config/types";
import { glossarySlug } from "../lib/about";
import { Icon } from "../components/ui/Icon";
import { Hint, PageIntro } from "../components/ui/Notes";

export function AboutPage({ config }: { config: MunicipalityConfig }) {
  const [params] = useSearchParams();
  const target = params.get("begriff") ?? params.get("abschnitt");
  const a = config.about;
  const person = config.contact.person;
  const glossary = [...(config.glossary ?? [])].sort((x, y) => x.term.localeCompare(y.term, "de"));

  // Sprungziel aus der URL (#-Adressen erlauben keine normalen Anker). Ein Frame später,
  // weil App beim Seitenwechsel nach dem Effekt dieser Seite nach oben scrollt.
  useEffect(() => {
    if (!target) return;
    const frame = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <>
      <PageIntro title="Über das Konzept" text="Anlass, Vorgehen, Datengrundlagen und Begriffe des Einzelhandelskonzepts." />
      <section className="page about-page">
        {a ? (
          <section className="about-block" aria-labelledby="anlass">
            <h2 id="anlass">Anlass und Prozess</h2>
            <p className="lead">{a.intro}</p>
            <ol className="process-list">{a.process.map(p => <li key={p}>{p}</li>)}</ol>
          </section>
        ) : null}

        {config.decisionStatus ? (
          <Hint title="Beschlussstand">{config.decisionStatus}</Hint>
        ) : null}

        {a?.method.length ? (
          <section className="about-block" aria-labelledby="methodik">
            <h2 id="methodik">Methodik</h2>
            <div className="principle-grid">
              {a.method.map(m => (
                <article key={m.title} className="card principle">
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {a?.dataSources.length ? (
          <section className="about-block" aria-labelledby="daten">
            <h2 id="daten">Datenstand</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th scope="col">Datenquelle</th><th scope="col">Stand</th></tr></thead>
                <tbody>{a.dataSources.map(d => <tr key={d.label}><td>{d.label}</td><td>{d.status}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        ) : null}

        {glossary.length ? (
          <section className="about-block" id="glossar" aria-labelledby="glossar-title">
            <h2 id="glossar-title">Glossar</h2>
            <dl className="glossary">
              {glossary.map(g => (
                <div key={g.term} id={glossarySlug(g.term)} className={target === glossarySlug(g.term) ? "is-target" : undefined}>
                  <dt>{g.term}</dt>
                  <dd>{g.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <div className="about-columns">
          {a?.downloads.length ? (
            <section className="about-block card" id="downloads" aria-labelledby="downloads-title">
              <h2 id="downloads-title">Downloads</h2>
              <ul className="download-list">
                {a.downloads.map(d => (
                  <li key={d.label}>
                    <Icon name="document" size={20} />
                    {d.url && d.url !== "#" ? <a href={d.url}>{d.label}</a> : <span aria-disabled="true" className="muted">{d.label}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="about-block card" id="kontakt" aria-labelledby="kontakt-title">
            <h2 id="kontakt-title">Ansprechpartner</h2>
            {person ? (
              <address className="person">
                <strong>{person.name}</strong>
                <span>{person.role}</span>
                {person.email ? <a href={`mailto:${person.email}`}>{person.email}</a> : null}
                {person.phone ? <a href={`tel:${person.phone.replace(/\s/g, "")}`}>{person.phone}</a> : null}
              </address>
            ) : (
              <p><a href={`mailto:${config.contact.email}`}>{config.contact.email}</a></p>
            )}
          </section>
        </div>

        {!a && !glossary.length ? <div className="empty-state">Für diese Kommune sind noch keine Informationen zum Konzept hinterlegt.</div> : null}
      </section>
    </>
  );
}
