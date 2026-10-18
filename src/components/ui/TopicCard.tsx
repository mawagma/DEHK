import { Link } from "react-router-dom";

type Props = {
  eyebrow: string;
  title: string;
  text: string;
  to?: string;
  disabled?: boolean;
};

export function TopicCard({ eyebrow, title, text, to = "#", disabled }: Props) {
  const body = (
    <>
      <span className="topic-icon" aria-hidden="true">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="topic-link">{disabled ? "Folgt in V2" : "Entdecken →"}</span>
    </>
  );

  return disabled ? (
    <div className="topic-card is-disabled">{body}</div>
  ) : (
    <Link className="topic-card" to={to}>{body}</Link>
  );
}
