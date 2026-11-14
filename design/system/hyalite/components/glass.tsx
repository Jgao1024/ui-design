import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";

// A hyalite glass surface. client/home.js attaches every `.hl-glass` to the engine, which writes
// `--hyalite` (the backdrop filter) and `--hyalite-edge` (the CSS rim) onto the element. Until then,
// and in browsers without SVG backdrop filters, the plain blur fallback shows.
//
// The fill is white at an alpha the panel controls (`--hl-fill-light` / `--hl-fill-dark`):
//   Light: over the white home screen any white fill reads #FFFFFF, as on the device; the grey
//          rim comes from the engine's edge shading (`shade`), not from a drawn ring.
//   Dark:  white at 0.12 over black is #1F1F1F, the fill measured on the device.

export const GLASS_CSS = `
.hl-glass{backdrop-filter:var(--hyalite,blur(3px));-webkit-backdrop-filter:var(--hyalite,blur(3px))}
.hl-glass[data-mode=light]{background:rgb(255 255 255 / var(--hl-fill-light,.5));
  box-shadow:var(--hyalite-edge,none),0 3px 10px rgb(0 0 0 / .06)}
.hl-glass[data-mode=dark]{background:rgb(255 255 255 / var(--hl-fill-dark,.12));
  box-shadow:var(--hyalite-edge,none),0 8px 24px rgb(0 0 0 / .3)}
`;

export function Glass(props: {
  mode: Mode;
  width: number;
  height: number;
  radius: number;
  class?: string;
  style?: string;
  children?: Child;
}): Markup {
  return (
    <div
      class={`hl-glass relative ${props.class ?? ""}`}
      data-mode={props.mode}
      style={`width:${props.width}px;height:${props.height}px;border-radius:${props.radius}px;${props.style ?? ""}`}
    >
      {props.children}
    </div>
  );
}
