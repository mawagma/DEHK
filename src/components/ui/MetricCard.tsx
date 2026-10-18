type Props = {
  value: string;
  label: string;
  meta?: string;
};

export function MetricCard({ value, label, meta }: Props) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
      {meta ? <small>{meta}</small> : null}
    </article>
  );
}
