import type { Markup } from "@design/jsx/jsx-runtime";
import { raw } from "@design/jsx/jsx-runtime";

// Line glyphs standing in for SF Symbols, which a browser cannot draw. 16 x 16 grid, drawn with the
// current text colour. Add a glyph here when a mock-up needs one.
const GLYPHS = {
  "chevron.right": '<path d="M6 3l5 5-5 5"/>',
  "chevron.left": '<path d="M10 3L5 8l5 5"/>',
  "chevron.down": '<path d="M3 6l5 5 5-5"/>',
  "chevron.up": '<path d="M3 10l5-5 5 5"/>',
  "chevron.up.chevron.down": '<path d="M4.5 6.2L8 2.7l3.5 3.5M4.5 9.8L8 13.3l3.5-3.5"/>',
  "check": '<path d="M3 8.5l3.5 3.5L13 4.5"/>',
  "minus": '<path d="M3.5 8h9"/>',
  "plus": '<path d="M8 3.5v9M3.5 8h9"/>',
  "xmark": '<path d="M4 4l8 8M12 4l-8 8"/>',
  "magnifyingglass": '<circle cx="7" cy="7" r="4.5"/><path d="M10.4 10.4L14 14"/>',
  "sidebar.left": '<rect x="1.8" y="3" width="12.4" height="10" rx="2.2"/><path d="M6 3v10"/>',
  "square.dashed": '<rect x="2.5" y="2.5" width="11" height="11" rx="2.2" stroke-dasharray="2 1.6"/>',
  "square": '<rect x="2.5" y="2.5" width="11" height="11" rx="2.2"/>',
  "circle": '<circle cx="8" cy="8" r="5.5"/>',
  "folder": '<path d="M2 4.5a1.5 1.5 0 011.5-1.5h2.8l1.5 1.6h4.7A1.5 1.5 0 0114 6.1v5.4a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 11.5z"/>',
  "doc": '<path d="M4 2h5l3 3v8.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-11A.5.5 0 014 2z"/><path d="M9 2v3h3"/>',
  "house": '<path d="M2.5 8L8 3l5.5 5M4 7v6h8V7"/>',
  "star": '<path d="M8 2.2l1.7 3.5 3.8.5-2.8 2.7.7 3.8L8 10.9l-3.4 1.8.7-3.8L2.5 6.2l3.8-.5z"/>',
  "ellipsis": '<circle cx="3.5" cy="8" r="1" fill="currentColor"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="12.5" cy="8" r="1" fill="currentColor"/>',
  "share": '<path d="M8 10V2.5M5.2 5.2L8 2.5l2.8 2.7M4.5 7H3.5v6.5h9V7h-1"/>',
  "trash": '<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 9h6l.5-9"/>',
  "clock": '<circle cx="8" cy="8" r="5.5"/><path d="M8 4.8V8l2.2 1.4"/>',
  "tag": '<path d="M2.5 8.2V3.5a1 1 0 011-1h4.7l5.3 5.3-5.2 5.2z"/><circle cx="5.6" cy="5.6" r=".8" fill="currentColor"/>',
  "arrow.up": '<path d="M8 13V3M4 7l4-4 4 4"/>',
  "arrow.down": '<path d="M8 3v10M4 9l4 4 4-4"/>',
  "play": '<path d="M5 3l8 5-8 5z" fill="currentColor"/>',
  "bell": '<path d="M4 11V7.5a4 4 0 018 0V11l1 1H3zM6.8 13.5a1.4 1.4 0 002.4 0"/>',
  "gear": '<circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v2M8 12.2v2M1.8 8h2M12.2 8h2M3.6 3.6L5 5M11 11l1.4 1.4M12.4 3.6L11 5M5 11l-1.4 1.4"/>',
  "person": '<circle cx="8" cy="5.5" r="2.6"/><path d="M3 13.5c.6-2.6 2.5-4 5-4s4.4 1.4 5 4"/>',
  "photo": '<rect x="2" y="3" width="12" height="10" rx="1.5"/><circle cx="5.6" cy="6.2" r="1"/><path d="M2.5 12l3.5-3.5 3 3 2-2 3 2.5"/>',
  "paintbrush": '<path d="M13 2.5l-5.5 6M6.5 9.5c-1.6 0-2.5 1-2.5 2.5-.5.8-1.2 1-2 1 1.8 1.6 5.5 1.2 5.5-2z"/>',
  "wifi": '<path d="M1.8 6.2a8.5 8.5 0 0112.4 0M4.2 8.8a5.2 5.2 0 017.6 0M6.6 11.2a2 2 0 012.8 0"/><circle cx="8" cy="13.2" r=".7" fill="currentColor"/>',
  "switch.2": '<rect x="1.8" y="3" width="12.4" height="4.2" rx="2.1"/><circle cx="5" cy="5.1" r="1" fill="currentColor"/><rect x="1.8" y="8.8" width="12.4" height="4.2" rx="2.1"/><circle cx="11" cy="10.9" r="1" fill="currentColor"/>',
  "apple": '<path fill="currentColor" stroke="none" d="M11.2 8.4c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.5-2.3.5s-1.2-.5-2-.5C4.9 4.9 3.6 6 3.6 8.2c0 1.3.5 2.7 1.1 3.6.5.8 1.1 1.5 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5 1.3-.7 1.8-1.5c.6-.8.8-1.6.8-1.7-.1 0-1.9-.7-2-2.7zM9.6 3.4c.4-.5.7-1.2.6-1.9-.6 0-1.4.4-1.8 1-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.8-.9z"/>',
  "xmark.circle.fill": '<circle cx="8" cy="8" r="6.2" fill="currentColor" stroke="none"/><path d="M5.9 5.9l4.2 4.2M10.1 5.9l-4.2 4.2" stroke="#ffffff"/>',
  "info.circle": '<circle cx="8" cy="8" r="6"/><path d="M8 7.3v3.5"/><circle cx="8" cy="5.2" r=".5" fill="currentColor"/>',
  "ellipsis.circle": '<circle cx="8" cy="8" r="6"/><circle cx="5.3" cy="8" r=".6" fill="currentColor"/><circle cx="8" cy="8" r=".6" fill="currentColor"/><circle cx="10.7" cy="8" r=".6" fill="currentColor"/>',
  "slider": '<path d="M2.5 5h11M2.5 11h11"/><circle cx="6" cy="5" r="1.6" fill="currentColor"/><circle cx="10.5" cy="11" r="1.6" fill="currentColor"/>',
} as const;

export type IconName = keyof typeof GLYPHS;

export function Icon(props: { name: IconName; size?: number; weight?: number; class?: string }): Markup {
  const size = props.size ?? 16;
  return (
    <svg
      class={props.class}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width={props.weight ?? 1.4}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {raw(GLYPHS[props.name])}
    </svg>
  );
}
