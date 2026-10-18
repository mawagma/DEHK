import { Link } from "react-router-dom";
import type { IconName } from "../../config/types";
import { Icon } from "./Icon";

type Props = { icon: IconName; title: string; text: string; to: string; image?: string };

export function TopicCard({ icon, title, text, to, image }: Props) {
  return (
    <Link className="topic-card" to={to}>
      {image ? <img className="topic-image" src={image} alt="" loading="lazy" width="760" height="423" /> : null}
      <div className="topic-body">
        <span className="topic-icon"><Icon name={icon} size={22} /></span>
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="topic-link">Entdecken <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
