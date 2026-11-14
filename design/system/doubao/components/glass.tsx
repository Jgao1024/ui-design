import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../theme.ts";

// Doubao's Liquid Glass buttons and input bar, measured pixel by pixel from
// design/.ref/doubao/device/<mode>/01-home.png (3 px = 1 pt). Over a flat background there is
// nothing to refract, so the material shows only as its edge:
//   Dark:  fill #1F1F1F. A bright rim on the top and bottom only (button #48, input #65, about
//          1 pt), fading to the fill over 3 pt. The left and right edges have no rim.
//   Light: fill #FFFFFF. A thin grey rim whose darkness changes with the angle (LIGHT_RIM below);
//          a soft shadow below, #FC right under the edge and gone after 7 pt.
// Dark rim: an inset shadow offset vertically is thickest at the top and bottom and thins to
// nothing at the sides, which is the shape of the dark rim.

export function GlassSurface(props: {
  mode: Mode;
  width: number;
  height: number;
  radius: number;
  /// The input bar's dark rim is about twice as bright as the round buttons'.
  kind: "button" | "bar";
  /// A different tint, e.g. the lighter grey of the sidebar's search button in Dark (#404040).
  fill?: string;
  /// Floating panels (toasts, menus) cast a larger shadow than buttons in Light.
  floating?: boolean;
  class?: string;
  style?: string;
  children?: Child;
}): Markup {
  // Dark rim: three stacked 1/3 pt white layers reproduce the three device pixels of the rim
  // (input #65 #50 #40, button #48 #3E #30 over the #1F fill), then a glow that fades over 3 pt.
  const [a1, a2, a3] = props.kind === "bar" ? [0.12, 0.084, 0.147] : [0.052, 0.067, 0.076];
  const edge = (y: number) =>
    `inset 0 ${0.34 * y}px 0 rgb(255 255 255 / ${a1}),inset 0 ${0.67 * y}px 0 rgb(255 255 255 / ${a2}),` +
    `inset 0 ${y}px 0 rgb(255 255 255 / ${a3}),inset 0 ${4 * y}px 4px -2px rgb(255 255 255 / 0.05)`;
  // Translucent fills with a backdrop blur, so content scrolled under the glass shows through.
  // Over the home screen's flat background they come out at the measured #1F1F1F and #FFFFFF.
  const blur = "backdrop-filter:blur(12px) saturate(1.6)";
  const shadow = props.floating ? "0 8px 28px rgb(0 0 0 / 0.08),0 1px 3px rgb(0 0 0 / 0.04)" : "0 3px 8px rgb(0 0 0 / 0.02),0 1px 2px rgb(0 0 0 / 0.02)";
  const look = props.mode === "dark"
    ? `background:${props.fill ?? "rgb(42 42 42 / 0.74)"};${blur};box-shadow:${edge(1)},${edge(-1)}`
    : `background:${props.fill ?? "rgb(255 255 255 / 0.72)"};${blur};box-shadow:${shadow}`;
  return (
    <div
      class={`relative ${props.class ?? ""}`}
      style={`width:${props.width}px;height:${props.height}px;border-radius:${props.radius}px;${look};${props.style ?? ""}`}
    >
      {props.mode === "light" && <span class="pointer-events-none absolute inset-0" style={LIGHT_RIM} />}
      {props.children}
    </div>
  );
}

// Light rim: a 2 device pixel ring whose darkness follows the angle around the shape, read off
// the round button (0deg = top): #F5 at the top, #EB at 30, #DC at 60, #B1-#D8 at the sides,
// #C7 at 120 (the darkest, below the sides), #E1-#E8 at 150 and #F6 at the bottom.
const LIGHT_RIM_STOPS = [[0, 0.04], [30, 0.08], [60, 0.2], [90, 0.25], [120, 0.22], [150, 0.1], [180, 0.035]] as const;
const LIGHT_RIM = [
  "border-radius:inherit;padding:0.67px",
  `background:conic-gradient(${
    [...LIGHT_RIM_STOPS, ...LIGHT_RIM_STOPS.slice(0, -1).reverse().map(([deg, a]) => [360 - deg, a] as const)]
      .map(([deg, a]) => `rgb(0 0 0 / ${a}) ${deg}deg`).join(",")
  })`,
  "-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)",
  "-webkit-mask-composite:xor;mask-composite:exclude",
].join(";");
