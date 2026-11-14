import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";

// A hyalite glass surface. The page driver attaches every `.hl-glass` to the engine, which writes
// `--hyalite` (the backdrop filter) and `--hyalite-edge` (the CSS rim) onto the element. Until then,
// and in browsers without SVG backdrop filters, the plain blur fallback shows.
//
// Fill and shadow come from per-mode variables the panels control:
//   --hl-tone-<mode>    grey level of the fill, 0–255 (255 = white)
//   --hl-fill-<mode>    fill alpha, 0–1
//   --hl-shadow-<mode>  drop shadow alpha, 0–1
// The fallbacks are the Doubao home values: Light white 0.5; Dark white 0.12, which over black is
// the #1F1F1F measured on the device.

export const GLASS_CSS = `
.hl-glass{backdrop-filter:var(--hyalite,blur(3px));-webkit-backdrop-filter:var(--hyalite,blur(3px))}
.hl-glass[data-mode=light]{
  background:rgb(var(--hl-tone-light,255) var(--hl-tone-light,255) var(--hl-tone-light,255) / var(--hl-fill-light,.5));
  box-shadow:var(--hyalite-edge,none),0 4px 14px rgb(0 0 0 / var(--hl-shadow-light,.06))}
.hl-glass[data-mode=dark]{
  background:rgb(var(--hl-tone-dark,255) var(--hl-tone-dark,255) var(--hl-tone-dark,255) / var(--hl-fill-dark,.12));
  box-shadow:var(--hyalite-edge,none),0 4px 14px rgb(0 0 0 / var(--hl-shadow-dark,.3))}
`;

export function Glass(props: {
  mode: Mode;
  width: number;
  height: number;
  radius: number;
  /// A tinted glass (e.g. a prominent button): replaces the fill, keeps the lens and the rim.
  tint?: string;
  class?: string;
  style?: string;
  children?: Child;
}): Markup {
  return (
    <div
      class={`hl-glass relative ${props.class ?? ""}`}
      data-mode={props.mode}
      style={`width:${props.width}px;height:${props.height}px;border-radius:${props.radius}px;${props.tint ? `background:${props.tint};` : ""}${props.style ?? ""}`}
    >
      {props.children}
    </div>
  );
}
