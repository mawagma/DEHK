import { Link } from "react-router-dom";
import type { IconName } from "../../config/types";
import { Icon } from "./Icon";

type Props = { icon: IconName; title: string; text: string; to: string };

export function TopicCard({ icon, title, text, to }: Props) {
  return (
    <Link className="topic-card" to={to}>
      <span className="topic-icon"><Icon name={icon} size={30} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="topic-link" aria-hidden="true">→</span>
    </Link>
  );
}
