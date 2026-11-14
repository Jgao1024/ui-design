import type { Markup } from "@design/jsx/jsx-runtime";

// Glyphs traced from the Doubao screenshots, on a 24 unit grid. STROKE is drawn with
// `currentColor` lines, FILL as solid shapes.
const STROKE = {
  menu: "M2.5 7h19M2.5 17h19",
  "speaker-mute": "M10.5 5L6.5 9H4v6h2.5l4 4zM15 9.5a3.5 3.5 0 0 1 .8 4.3M4 4l16 16",
  bubble: "M12 4.5c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-1.1 0-2.1-.2-3-.5L4.5 19.5l1.2-3.3C4.3 14.9 3.5 13.3 3.5 11.5c0-3.9 3.8-7 8.5-7z",
  folder: "M3.5 7.5a2 2 0 0 1 2-2h3.8l2 2h7.2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM3.5 10.5h17",
  "mic-text": "M8 3.5a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0v-4a3 3 0 0 1 3-3zM3 10.5a5 5 0 0 0 10 0M8 15.5V20M16 7.5h5M16 11.5h5M16 15.5h3",
  phone: "M6.5 3.5h2.8l1.6 4.2-2.1 1.4a10.5 10.5 0 0 0 6.1 6.1l1.4-2.1 4.2 1.6v2.8a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z",
  camera: "M3.5 9a3 3 0 0 1 3-3h1.3l1.4-2h5.6l1.4 2h1.3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3zM15.5 12.8a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z",
  voice: "M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0zM11.5 9.3a3.5 3.5 0 0 1 0 5.4M14.5 7a7 7 0 0 1 0 10",
  "plus-circle": "M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0zM12 7.5v9M7.5 12h9",
  "x-circle": "M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0zM8.8 8.8l6.4 6.4M15.2 8.8l-6.4 6.4",
  keypad: "M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0zM8.5 9h.01M12 9h.01M15.5 9h.01M8.5 12h.01M12 12h.01M15.5 12h.01M9 15.5h6",
  chevron: "M9.5 5.5c2.3 4 2.3 9 0 13",
  "chevron-right": "M9 5l7 7-7 7",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-up": "M6 15l6-6 6 6",
  "chevron-up-down": "M8 9.5l4-4 4 4M8 14.5l4 4 4-4",
  compose: "M11 4.5H7a3 3 0 0 0-3 3v9.5a3 3 0 0 0 3 3h9.5a3 3 0 0 0 3-3V13M17.5 3.5l3 3-8.5 8.5H9v-3z",
  search: "M16 16l4.5 4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5.2l3.3 2",
  layers: "M12 3.5l8.5 5-8.5 5-8.5-5zM3.5 13l8.5 5 8.5-5",
  bag: "M5 7.5h14l-1 12.5H6zM8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5",
  scan: "M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5M7 12h10",
  bell: "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4",
  gear: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM10.3 3h3.4l.6 2.6 1.7 1 2.6-.8 1.7 2.9-2 1.9v1.9l2 1.9-1.7 2.9-2.6-.8-1.7 1-.6 2.6h-3.4l-.6-2.6-1.7-1-2.6.8-1.7-2.9 2-1.9v-1.9l-2-1.9 1.7-2.9 2.6.8 1.7-1z",
  plus: "M12 5v14M5 12h14",
  xmark: "M6 6l12 12M18 6L6 18",
  check: "M5 12.5l4.5 4.5L19 7",
  "arrow-up": "M12 19.5V5M6 11l6-6 6 6",
  "arrow-down": "M12 4.5V19M6 13l6 6 6-6",
  "arrow-up-right": "M7 17L17 7M9 7h8v8",
  pin: "M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11zM14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z",
  globe: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  mic: "M15 6a3 3 0 0 0-6 0v5.5a3 3 0 0 0 6 0zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3",
  "mic-gear": "M12.5 6a3 3 0 0 0-6 0v5.5a3 3 0 0 0 6 0zM3 11.5a6.5 6.5 0 0 0 9.5 5.8M9.5 18v3M18 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 10.5v.8M18 16.7v.8M15 14h.8M20.2 14h.8",
  translate: "M3.5 5h9M8 3v2M10.5 5c-.8 3.5-3.4 6.3-7 7.5M5.5 7.5c1.2 2 3 3.6 5 4.5M13 21l4-9.5 4 9.5M14.3 18h5.4",
  shift: "M12 4.5l7.5 8H15v7H9v-7H4.5z",
  delete: "M8.5 5.5H20a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H8.5L2.5 12zM11.5 9.5l5 5M16.5 9.5l-5 5",
  "thumb-up": "M7.5 10.5v9h-3v-9zM7.5 10.5L11 3.5c1.7 0 2.7 1.3 2.4 3l-.6 3h5.4a2 2 0 0 1 2 2.4l-1.3 6a2 2 0 0 1-2 1.6H7.5",
  "thumb-down": "M7.5 13.5v-9h-3v9zM7.5 13.5L11 20.5c1.7 0 2.7-1.3 2.4-3l-.6-3h5.4a2 2 0 0 0 2-2.4l-1.3-6a2 2 0 0 0-2-1.6H7.5",
  copy: "M9 9h10.5v10.5H9zM5 15V4.5h10.5",
  download: "M12 4v11M7 10.5l5 5 5-5M5 20h14",
  expand: "M14 4.5h5.5V10M10 19.5H4.5V14M19.5 4.5L14 10M4.5 19.5L10 14",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
  "model": "M12 3.5a4 4 0 0 1 4 4v1.2a4 4 0 0 1 3.5 6.3 4 4 0 0 1-5.7 4.6A4 4 0 0 1 7 18.4 4 4 0 0 1 4.5 12 4 4 0 0 1 8 6a4 4 0 0 1 4-2.5zM12 9v6M9 12h6",
  "work-task": "M4.5 4.5h10l5 5v10h-15zM9 13.5l2.2 2.2 4.3-4.7",
  "flash-off": "M13 3L6 13h5l-1 8 7-10h-5zM4 4l16 16",
  "photo": "M4.5 5.5h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zM3.5 15.5l5-4.5 4 3.5 2.5-2 5.5 4.5M16.5 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z",
  "flip": "M4.5 10a7.5 7.5 0 0 1 13.4-3.6M19.5 14a7.5 7.5 0 0 1-13.4 3.6M18.5 3.5v3.5H15M5.5 20.5V17H9",
  "phone-mute": "M6.5 3.5h2.8l1.6 4.2-2.1 1.4a10.5 10.5 0 0 0 6.1 6.1l1.4-2.1 4.2 1.6v2.8a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2zM3.5 3.5l17 17",
  "video-off": "M3.5 7.5h10a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 2 15V9a1.5 1.5 0 0 1 1.5-1.5zM15 10.5l5.5-3v9l-5.5-3M3 4l16 16",
  captions: "M3.5 6.5h12v9h-6l-3.5 3v-3H3.5zM6.5 10h6M6.5 12.5h4M16.5 16.5l2 2 3.5-4",
  paperclip: "M16.5 7.5l-7 7a2 2 0 0 0 2.8 2.8l7.4-7.4a4 4 0 0 0-5.7-5.7l-7.6 7.6a6 6 0 0 0 8.5 8.5L21 14",
  waveform: "M4 10v4M8 7v10M12 9.5v5M16 5.5v13M20 10v4",
  record: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
} as const;

const FILL = {
  ellipsis: "M6 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM12 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM18 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z",
  "camera-fill": "M3 9a3 3 0 0 1 3-3h1.5l1.5-2.2h6L16.5 6H18a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM12 16.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6z",
  "photo-fill": "M5 3.5h14A1.5 1.5 0 0 1 20.5 5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5zM6 18h12l-4-5.5-3 4-2-2.5zM9 10a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 9 10z",
  "phone-fill": "M6.5 3h2.8l1.7 4.4-2.2 1.5a10.5 10.5 0 0 0 6.3 6.3l1.5-2.2 4.4 1.7v2.8a2.3 2.3 0 0 1-2.5 2.3A16.5 16.5 0 0 1 4.2 5.5 2.3 2.3 0 0 1 6.5 3z",
  "speaker-fill": "M11 4.5L6.5 8.5H3.5v7h3l4.5 4z",
  "warning-fill": "M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM10.8 7h2.4l-.3 7.5h-1.8zM12 18.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z",
  "check-fill": "M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM7.5 12.3l3 3 6-6.3",
  "grid-fill": "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  "x-fill": "M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19z",
  dot: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
} as const;

export type IconName = keyof typeof STROKE | keyof typeof FILL;

export function Icon(props: { name: IconName; size: number; weight?: number; color?: string }): Markup {
  const color = props.color ?? "currentColor";
  if (props.name in FILL) {
    return (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill={color} fill-rule="evenodd" aria-hidden="true">
        <path d={FILL[props.name as keyof typeof FILL]} />
        {props.name === "speaker-fill" && <path d="M14.5 9a4 4 0 0 1 0 6M17.3 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" />}
      </svg>
    );
  }
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width={props.weight ?? 2} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d={STROKE[props.name as keyof typeof STROKE]} />
      {props.name === "voice" && <circle cx="8.3" cy="12" r="1.3" fill={color} stroke="none" />}
      {props.name === "record" && <circle cx="12" cy="12" r="4" fill={color} stroke="none" />}
    </svg>
  );
}
