import type { HeroImage } from "../../config/types";

/** Bildnachweis nach CC-Lizenz: Urheber, Quelle, Lizenz. Ohne credit kein Nachweis. */
export function ImageCredit({ image, className }: { image: HeroImage; className?: string }) {
  const c = image.credit;
  if (!c) return null;
  return (
    <small className={className}>
      Foto: <a href={c.sourceUrl} target="_blank" rel="noreferrer">{c.author}, Wikimedia Commons</a>,{" "}
      <a href={c.licenseUrl} target="_blank" rel="noreferrer">{c.license}</a>
    </small>
  );
}
