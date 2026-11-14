import type { Markup } from "@design/jsx/jsx-runtime";

// Chrome cannot draw SF Symbols, so the symbols the mock-ups need are drawn as outline SVG on a
// 24 unit grid. They stand in for the real glyphs; sizes come from the Figma specs.
const STROKE = {
  "chevron-right": "M9 5l7 7-7 7",
  "chevron-left": "M15 5l-7 7 7 7",
  "chevron-down": "M5 9l7 7 7-7",
  "chevron-up": "M5 15l7-7 7 7",
  "chevron-up-down": "M7 9l5-5 5 5M7 15l5 5 5-5",
  "plus": "M12 5v14M5 12h14",
  "minus": "M5 12h14",
  "xmark": "M6 6l12 12M18 6L6 18",
  "checkmark": "M5 12.5l4.5 4.5L19 7",
  "search": "M15.5 15.5l5 5M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z",
  "share": "M12 3v12M8 7l4-4 4 4M8 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2",
  "sidebar": "M5.5 4.5h13a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17V7a2.5 2.5 0 0 1 2.5-2.5zM9.5 4.5v15",
  "star": "M12 3l2.8 6 6.6.8-4.9 4.5 1.3 6.5L12 17.5 6.2 20.8l1.3-6.5L2.6 9.8 9.2 9z",
  "heart": "M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z",
  "house": "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z",
  "person": "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 20c0-4 3.5-6 8-6s8 2 8 6",
  "bell": "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  "trash": "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  "pencil": "M4 20l1-5L16 4l4 4L9 19z",
  "folder": "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  "doc": "M6 3h8l5 5v13H6zM14 3v5h5",
  "mic": "M15 6a3 3 0 0 0-6 0v5a3 3 0 0 0 6 0zM5 11a7 7 0 0 0 14 0M12 18v3",
  "camera": "M3 8h4l2-3h6l2 3h4v12H3zM15.5 13.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z",
  "arrow-up": "M12 20V5M6 11l6-6 6 6",
  "arrow-down": "M12 4v15M6 13l6 6 6-6",
  "arrow-left": "M20 12H5M11 6l-6 6 6 6",
  "arrow-right": "M4 12h15M13 6l6 6-6 6",
  "compose": "M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6M17 3l4 4-9 9H8v-4z",
  "list": "M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01",
  "grid": "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  "globe": "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  "clock": "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5l3 2",
  "lock": "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  "phone": "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z",
  "mail": "M3 6h18v12H3zM3 7l9 7 9-7",
  "bookmark": "M6 3h12v18l-6-5-6 5z",
  "slider": "M4 8h16M4 16h16M9 5v6M15 13v6",
  "text-size": "M3 19l5-13 5 13M5 14h6M15 19l3-8 3 8M16 17h4",
  "copy": "M9 9h11v11H9zM5 15V5h10",
  "play": "M7 4l13 8-13 8z",
  "bolt": "M13 3L5 13h6l-1 8 8-10h-6z",
  "airplane": "M3 13l8-2V5l2-2 2 2v6l8 2v2l-8-1v4l2 2v1l-4-1-4 1v-1l2-2v-4l-8 1z",
} as const;

// Filled stand-ins that Figma uses as placeholder tab and toolbar symbols.
const FILL = {
  "diamond": "M12 2.5l9.5 9.5-9.5 9.5L2.5 12z",
  "circle-fill": "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  "triangle-fill": "M12 3l10 18H2z",
  "seal-fill": "M12 2l2.4 2.2 3.2-.4 1.1 3.1 3 1.2-.6 3.2L23 14l-2.2 2.4.2 3.2-3.2.5-1.6 2.8-3-1.4-3 1.4-1.6-2.8-3.2-.5.2-3.2L1 14l2.8-2.7-.6-3.2 3-1.2 1.1-3.1 3.2.4z",
  "square-fill": "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z",
  "star-fill": "M12 3l2.8 6 6.6.8-4.9 4.5 1.3 6.5L12 17.5 6.2 20.8l1.3-6.5L2.6 9.8 9.2 9z",
  "heart-fill": "M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z",
  "house-fill": "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z",
  "person-fill": "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21c0-4 3.5-7 8-7s8 3 8 7z",
  "ellipsis": "M6 12m-1.8 0a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0M12 12m-1.8 0a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0M18 12m-1.8 0a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0",
} as const;

export type IconName = keyof typeof STROKE | keyof typeof FILL;

/// A symbol on a 24 unit grid. `size` is the box in px, `weight` the stroke width in grid units.
export function Icon(props: { name: IconName; size?: number; color?: string; weight?: number }): Markup {
  const size = props.size ?? 22;
  const filled = props.name in FILL;
  const d = filled ? FILL[props.name as keyof typeof FILL] : STROKE[props.name as keyof typeof STROKE];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? props.color ?? "currentColor" : "none"}
      stroke={filled ? "none" : props.color ?? "currentColor"}
      stroke-width={props.weight ?? 2}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
