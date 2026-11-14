import type { Child, Markup } from "@design/jsx/jsx-runtime";

// Liquid Glass for macOS 27, drawn for the browser. Layer numbers come from
// figma/reference/macos27/specs/08-tokens/Materials__Liquid-Glass---{Small,Medium,Large}.json:
//   panel (Medium, Large; 160 x 160, radius 34)
//     Light: fill #FFFFFF 70% + #BFBFBF 10%, rim #DBDBDB, shadow 0 18 48 black 25%
//     Dark:  fill #1A1A1A,                   rim #A6A6A6, shadow 0 18 48 black 45%
//   small (48 x 48 capsule)
//     Light: rim #E8E8E8 / #D0D0D0, shadow 0 8 15 black 2%, inner glow #E6E6E6
//     Dark:  rim #A6A6A6,           shadow 0 8 15 black 4%, inner glow #E6E6E6
//     Primary: tint #0088FF over a 94% white backing
// Figma's GLASS effect has no parameters, so blur, refraction at the rim, saturation and the
// specular highlight are tuned by eye. Chrome only: backdrop-filter with an SVG filter.
// This is macOS' own copy; the iOS kit has its own.

type Mode = "light" | "dark";

const RIM: Record<"small" | "panel", Record<Mode, string>> = {
  panel: { light: "#dbdbdb", dark: "#a6a6a6" },
  small: { light: "#e8e8e8", dark: "#a6a6a6" },
};
const SHADOW: Record<"small" | "panel", Record<Mode, string>> = {
  panel: { light: "0 18px 48px rgb(0 0 0 / 0.25)", dark: "0 18px 48px rgb(0 0 0 / 0.45)" },
  small: { light: "0 8px 15px rgb(0 0 0 / 0.02)", dark: "0 8px 15px rgb(0 0 0 / 0.04)" },
};
const TINT: Record<Mode, string> = { light: "rgb(255 255 255 / 0.26)", dark: "rgb(26 26 26 / 0.38)" };
const SHADE: Record<Mode, string> = { light: "#282828", dark: "#1a1a1a" };
const REFRACTION = { panel: 64, small: 14 } as const;

let instance = 0;

/// Displacement map: R and G are 128 (no shift) in the middle and ramp to 255/0 over the
/// outer `edge` pixels, so only the rim of the glass bends what is behind it.
function displacementMap(width: number, height: number, edge: number): string {
  const ex = Math.min(edge / width, 0.5);
  const ey = Math.min(edge / height, 0.5);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<defs>` +
    `<linearGradient id="x" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="rgb(255,0,0)"/>` +
    `<stop offset="${ex}" stop-color="rgb(128,0,0)"/><stop offset="${1 - ex}" stop-color="rgb(128,0,0)"/>` +
    `<stop offset="1" stop-color="rgb(0,0,0)"/></linearGradient>` +
    `<linearGradient id="y" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="rgb(0,255,0)"/>` +
    `<stop offset="${ey}" stop-color="rgb(0,128,0)"/><stop offset="${1 - ey}" stop-color="rgb(0,128,0)"/>` +
    `<stop offset="1" stop-color="rgb(0,0,0)"/></linearGradient></defs>` +
    `<rect width="100%" height="100%" fill="#000"/>` +
    `<rect width="100%" height="100%" fill="url(#x)" style="mix-blend-mode:screen"/>` +
    `<rect width="100%" height="100%" fill="url(#y)" style="mix-blend-mode:screen"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const RIM_MASK = "linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)";

export function Glass(props: {
  width: number;
  height: number;
  /// Corner radius in px. Figma: 34 for Medium and Large, 1000 for the Small capsule.
  radius?: number;
  mode: Mode;
  /// `panel` for Medium and Large, `small` for the 48 px controls.
  size?: "small" | "panel";
  /// Primary tint, e.g. COLOR.accent. The glass keeps its highlights and refraction over it.
  tint?: string;
  class?: string;
  children?: Child;
}): Markup {
  const id = `glass-${++instance}`;
  const size = props.size ?? "panel";
  const radius = Math.min(props.radius ?? 34, props.width / 2, props.height / 2);
  const rim = RIM[size][props.mode];
  const shade = SHADE[props.mode];
  const edge = Math.max(8, Math.min(radius, props.width / 2, props.height / 2));
  const outer = [
    SHADOW[size][props.mode],
    `0 0 0 0.5px ${rim}`,
    `1.25px 0 0 -0.75px ${rim}`,
    `-1.25px 0 0 -0.75px ${rim}`,
  ].join(",");
  const inner = [
    ...(size === "small" ? ["inset 0 40px 30px -40px #e6e6e6"] : []),
    `inset 0 -40px 10px -40px ${shade}`,
    `inset 0 40px 10px -40px ${shade}`,
  ].join(",");
  const background = props.tint ? `${props.tint}e6` : TINT[props.mode];
  const highlight = props.mode === "light" ? "rgb(255 255 255 / 0.95)" : "rgb(255 255 255 / 0.7)";
  const rimGradient =
    `linear-gradient(135deg,${highlight} 0,transparent 28%,transparent 62%,${highlight} 100%)`;
  return (
    <div
      class={`relative ${props.class ?? ""}`}
      style={`width:${props.width}px;height:${props.height}px;border-radius:${radius}px;box-shadow:${outer}`}
    >
      <svg aria-hidden="true" width="0" height="0" class="absolute">
        <filter
          id={id}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={props.width}
          height={props.height}
          color-interpolation-filters="sRGB"
        >
          <feImage
            href={displacementMap(props.width, props.height, edge)}
            x="0"
            y="0"
            width={props.width}
            height={props.height}
            preserveAspectRatio="none"
            result="map"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={REFRACTION[size]}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        class="absolute inset-0"
        style={`border-radius:${radius}px;background:${background};backdrop-filter:blur(0.75px) url(#${id}) saturate(1.6);box-shadow:${inner}`}
      />
      <div
        class="absolute inset-0 box-border"
        style={`border-radius:${radius}px;padding:1.5px;background:${rimGradient};-webkit-mask:${RIM_MASK};-webkit-mask-composite:xor;mask:${RIM_MASK};mask-composite:exclude`}
      />
      <div class="relative size-full" style={`border-radius:${radius}px`}>{props.children}</div>
    </div>
  );
}
