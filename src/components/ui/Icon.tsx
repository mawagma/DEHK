import type { IconName } from "../../config/types";

const paths: Record<IconName, string> = {
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  cart: "M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.4-1.1L21 8H6.3M9.5 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  chart: "M5 20V12m5 8V7m5 13v-9m5 9V4",
  document: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  building: "M4 21V9l8-5 8 5v12M9 21v-6h6v6M8 11h.01M12 11h.01M16 11h.01",
  leaf: "M5 19C5 10 11 5 20 4c0 9-5 15-14 15Zm0 0 7-7",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-11v6m0-9h.01",
  mail: "M4 6h16v12H4zm0 0 8 7 8-7"
};

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
