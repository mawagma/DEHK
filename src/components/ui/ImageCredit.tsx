import type { HeroImage } from "../../config/types";

/** Bildnachweis nach CC-Lizenz: Urheber, Quelle, Lizenz. */
export function ImageCredit({ image, className }: { image: HeroImage; className?: string }) {
  return (
    <small className={className}>
      Foto: <a href={image.sourceUrl} target="_blank" rel="noreferrer">{image.author}, Wikimedia Commons</a>,{" "}
      <a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.license}</a>
    </small>
  );
}
