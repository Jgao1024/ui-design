import type { Child, Markup } from "@design/jsx/jsx-runtime";

// Liquid Glass, drawn for the browser. Layer numbers come from the Figma specs
// (figma/reference/<kit>/specs/08-tokens/Materials__Liquid-Glass-*.json):
//   Light: fill #FFFFFF 70% + #BFBFBF 10%, rim #DBDBDB, shadow 0 8 48 black 25%
//   Dark:  fill #1A1A1A,                   rim #A6A6A6, shadow 0 8 48 black 45%
//   inner shadows: #E6E6E6 (0,40,blur 30,spread -40) and #282828/#1A1A1A (0,±40,blur 10,spread -40)
// Figma's GLASS effect has no parameters, so refraction (displacement at the edge), blur
// and saturation are tuned by eye. Chrome only: backdrop-filter with an SVG filter.

const RIM = { light: "#dbdbdb", dark: "#a6a6a6" } as const;
const SHADOW_ALPHA = { light: 0.25, dark: 0.45 } as const;
const TINT = { light: "rgb(255 255 255 / 0.32)", dark: "rgb(26 26 26 / 0.42)" } as const;
const SHADE = { light: "#282828", dark: "#1a1a1a" } as const;

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

export function Glass(props: {
  width: number;
  height: number;
  /// Corner radius in px. Figma: 34 for Regular Medium/Large, 23 for Clear, 1000 for capsules.
  radius?: number;
  mode: "light" | "dark";
  /// Vertical drop-shadow offset: 8 on iOS, 18 on macOS.
  lift?: number;
  /// How far the rim bends the backdrop, in px.
  refraction?: number;
  /// Overrides for a platform's own variants (Regular, Clear, Small). Each defaults to the
  /// look above. `fill` is a CSS background value; `ring` draws the 0.5px outline;
  /// `blur` is the backdrop blur in px.
  fill?: string;
  rim?: string;
  ring?: boolean;
  shadowAlpha?: number;
  shadowBlur?: number;
  blur?: number;
  class?: string;
  children?: Child;
}): Markup {
  const id = `glass-${++instance}`;
  const radius = Math.min(props.radius ?? 34, props.width / 2, props.height / 2);
  const lift = props.lift ?? 8;
  const rim = props.rim ?? RIM[props.mode];
  const shade = SHADE[props.mode];
  const edge = Math.max(8, Math.min(radius, props.width / 2, props.height / 2));
  const outer = [
    `0 ${lift}px ${props.shadowBlur ?? 48}px rgb(0 0 0 / ${props.shadowAlpha ?? SHADOW_ALPHA[props.mode]})`,
    ...(props.ring === false ? [] : [`0 0 0 0.5px ${rim}`]),
    `1.25px 0 0 -0.75px ${rim}`,
    `-1.25px 0 0 -0.75px ${rim}`,
  ].join(",");
  const inner = [
    "inset 0 40px 30px -40px #e6e6e6",
    `inset 0 -40px 10px -40px ${shade}`,
    `inset 0 40px 10px -40px ${shade}`,
  ].join(",");
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
            scale={props.refraction ?? 24}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        class="absolute inset-0"
        style={`border-radius:${radius}px;background:${
          props.fill ?? TINT[props.mode]
        };backdrop-filter:blur(${props.blur ?? 3}px) url(#${id}) saturate(1.8);box-shadow:${inner}`}
      />
      <div class="relative size-full" style={`border-radius:${radius}px`}>{props.children}</div>
    </div>
  );
}
