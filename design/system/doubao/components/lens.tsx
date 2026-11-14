import { type Child, type Markup, raw } from "@design/jsx/jsx-runtime";
import type { Mode } from "../theme.ts";
import { deflateSync } from "node:zlib";

// A real lens, ported from VII-Cae/hyalite--liquid-glass (MIT) so the result matches its
// edge-lab: a rounded-rect SDF, a bevel cross-section (circle / squircle / lip), Snell's law for
// the lateral shift, a Fresnel rim + a tight specular line baked into the map's blue channel, and
// optional RGB dispersion.
//
// Everything is computed here, at build time, and baked into one PNG data URL: the built page
// carries no JavaScript. Chromium is the only engine that honours `backdrop-filter: url(#…)`;
// Safari and Firefox drop that declaration and keep the plain blur declared next to it.

export type LensShape = "circle" | "squircle" | "lip";

const IOR = 1.5; // the value hyalite uses
const SHARP = 44; // exponent of the tight specular line
const GLOW = 0.4 / 1.76; // the wide Fresnel glow, as a share of `rim`
const ABSORB = 0.5 / 0.46; // Fresnel transmission loss, as a share of `shade`

const HC = (t: number) => Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t))); // quarter circle
const HS = (t: number) => Math.pow(Math.max(0, 1 - Math.pow(1 - t, 4)), 0.25); // squircle

function heightFn(shape: LensShape): (t: number) => number {
  if (shape === "squircle") return HS;
  if (shape === "circle") return HC;
  // A raised rim over a shallow dip: zero in value and slope at both ends, so it meets the slab.
  return (t) => HC(t) + 0.3 * Math.pow(Math.sin(Math.PI * t), 2) * Math.cos(Math.PI * t);
}

/// Unpolarised Fresnel reflectance: 0.04 head-on, → 1 at grazing incidence.
function fresnel(angle: number): number {
  const a = Math.abs(angle);
  if (a < 1e-4) return 0.04;
  const st = Math.sin(a) / IOR;
  if (st >= 1) return 1;
  const b = Math.asin(st);
  const rs = Math.sin(a - b) / Math.sin(a + b);
  const rp = Math.tan(a - b) / Math.tan(a + b);
  return Math.min(1, (rs * rs + rp * rp) / 2);
}

export type LensProfile = {
  shape: LensShape;
  bevel: number;
  thickness: number;
  /// Lateral shift in px, normalised so the outermost sample is 1.
  offsets: number[];
  /// Surface tilt at each sample, radians.
  alphas: number[];
  /// Signed edge profile: < 0 darkens, > 0 adds light. −1…1.
  edge: number[];
  max: number;
};

const SAMPLES = 64;

/// The 1-D cross-section of the bevel: how far a ray bends `d` px inside the rim, and how bright
/// that part of the edge should be.
export function lensProfile(
  shape: LensShape,
  bevel: number,
  thickness: number,
  options: { slope?: number; rim?: number; shade?: number; edgeWidth?: number } = {},
): LensProfile {
  const { slope = 2.7, rim = 1.2, shade = 0.5, edgeWidth = 8 } = options;
  const H = heightFn(shape);
  const step = bevel / SAMPLES;

  // Displacement table, built from the inner edge outward. Above `slope` the field folds: the same
  // backdrop shows up twice, which is where the liquid swirls come from.
  const raw: number[] = new Array(SAMPLES + 1).fill(0);
  const alphas: number[] = new Array(SAMPLES + 1).fill(0);
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const e = 1e-3;
    const x1 = Math.min(1, t + e);
    const x0 = Math.max(0, t - e);
    const alpha = Math.atan((H(x1) - H(x0)) / (x1 - x0));
    const beta = Math.sign(alpha) * Math.asin(Math.min(1, Math.sin(Math.abs(alpha)) / IOR));
    raw[i] = (thickness + bevel * H(t)) * Math.tan(alpha - beta);
    alphas[i] = alpha;
  }
  const table: number[] = new Array(SAMPLES + 1).fill(0);
  table[SAMPLES] = 0;
  for (let i = SAMPLES - 1; i >= 0; i--) {
    table[i] = Math.min(raw[i], table[i + 1] + slope * step);
  }
  const max = Math.max(...table.map(Math.abs), 1e-6);

  const edge: number[] = new Array(SAMPLES + 1).fill(0);
  for (let i = 0; i <= SAMPLES; i++) {
    const d = i * step;
    const gain = Math.max(0.02, 1 + (table[Math.min(SAMPLES, i + 1)] - table[i]) / step);
    const gainSrgb = Math.pow(gain, 1 / 2.2);
    const window = Math.exp((-2.5 * d) / edgeWidth);
    const tilt = Math.max(0, Math.sin(alphas[i])); // only an outward-facing slope catches the light
    const fresnelLoss = fresnel(alphas[i]);
    const value = fresnelLoss * rim * GLOW + Math.pow(tilt, SHARP) * rim -
      (1 - gainSrgb) * shade - fresnelLoss * shade * ABSORB;
    // The light half is what the glass sends back; it reads as a hairline, not a painted ring, so
    // it is scaled down before it is baked in.
    edge[i] = Math.max(-1, Math.min(1, value * window * (value > 0 ? 0.45 : 0.85)));
  }
  return { shape, bevel, thickness, offsets: table, alphas, edge, max };
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

function toDataUrl(rgb: Uint8Array, width: number, height: number): string {
  const stride = width * 3 + 1;
  const raw = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) raw.set(rgb.subarray(y * width * 3, (y + 1) * width * 3), y * stride + 1);
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: RGB
  const parts = [
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", new Uint8Array(deflateSync(raw, { level: 9 }))),
    pngChunk("IEND", new Uint8Array(0)),
  ];
  const png = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    png.set(part, offset);
    offset += part.length;
  }
  let binary = "";
  for (let i = 0; i < png.length; i += 8192) binary += String.fromCharCode(...png.subarray(i, i + 8192));
  return `data:image/png;base64,${btoa(binary)}`;
}

function roundedRectDistance(x: number, y: number, w: number, h: number, r: number): number {
  const qx = Math.abs(x - w / 2) - (w / 2 - r);
  const qy = Math.abs(y - h / 2) - (h / 2 - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

const cache = new Map<string, string>();

/// R = shift X, G = shift Y (128 = none), B = the signed edge profile (128 = neutral).
function displacementMap(width: number, height: number, radius: number, profile: LensProfile): string {
  const key = [width, height, radius, profile.shape, profile.bevel, profile.thickness, profile.max.toFixed(3)].join(":");
  const hit = cache.get(key);
  if (hit) return hit;

  const bevel = Math.max(1, Math.min(profile.bevel, Math.floor(Math.min(width, height) / 2) - 1));
  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const depth = -roundedRectDistance(px, py, width, height, radius);
      let ux = 0;
      let uy = 0;
      let amount = 0;
      let shade = 0;
      if (depth > 1.5 && depth < bevel) {
        const e = 1;
        const gx = roundedRectDistance(px + e, py, width, height, radius) - roundedRectDistance(px - e, py, width, height, radius);
        const gy = roundedRectDistance(px, py + e, width, height, radius) - roundedRectDistance(px, py - e, width, height, radius);
        const length = Math.hypot(gx, gy) || 1;
        ux = gx / length;
        uy = gy / length;
        const index = Math.min(SAMPLES, Math.round((depth / bevel) * SAMPLES));
        amount = profile.offsets[index] / profile.max;
        shade = profile.edge[index];
      }
      const i = (y * width + x) * 3;
      rgb[i] = Math.round(128 + ux * amount * 127);
      rgb[i + 1] = Math.round(128 + uy * amount * 127);
      rgb[i + 2] = Math.round(128 + shade * 127);
    }
  }
  const url = toDataUrl(rgb, width, height);
  cache.set(key, url);
  return url;
}

let instance = 0;
const IDENTITY_ALPHA = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1";
const CHANNEL = {
  R: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  G: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  B: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
} as const;

/// The filter graph: blur → one displacement pass per colour channel → the edge profile on top.
function filterMarkup(id: string, url: string, scale: number, options: { blur: number; dispersion: number }): string {
  const parts: string[] = [
    `<feImage preserveAspectRatio="none" result="map" href="${url}" xlink:href="${url}"/>`,
    `<feGaussianBlur in="SourceGraphic" stdDeviation="${options.blur}" result="softA"/>`,
    // Pin alpha: the backdrop handed to a reference filter stops at the box, and the dispersion
    // pass sums three premultiplied images — exact only for opaque pixels.
    `<feColorMatrix in="softA" type="matrix" values="${IDENTITY_ALPHA}" result="soft"/>`,
  ];
  if (options.dispersion > 0) {
    const offset = 2 * options.dispersion;
    for (const channel of ["R", "G", "B"] as const) {
      const shift = channel === "R" ? scale - offset : channel === "B" ? scale + offset : scale;
      parts.push(
        `<feDisplacementMap in="soft" in2="map" scale="${shift.toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="d${channel}"/>`,
        `<feColorMatrix in="d${channel}" type="matrix" values="${CHANNEL[channel]}" result="c${channel}"/>`,
      );
    }
    parts.push(
      `<feComposite in="cR" in2="cG" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="cRG"/>`,
      `<feComposite in="cRG" in2="cB" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="glass"/>`,
    );
  } else {
    parts.push(`<feDisplacementMap in="soft" in2="map" scale="${scale.toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="glass"/>`);
  }
  // Dark half of the edge: multiply, never subtract (an already dark backdrop must not go negative).
  parts.push(
    `<feColorMatrix in="map" type="matrix" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 0 1" result="edgeRGB"/>`,
    `<feComponentTransfer in="edgeRGB" result="shadeLayer"><feFuncR type="table" tableValues="0 1 1"/><feFuncG type="table" tableValues="0 1 1"/><feFuncB type="table" tableValues="0 1 1"/></feComponentTransfer>`,
    `<feBlend in="glass" in2="shadeLayer" mode="multiply" result="shaded"/>`,
    // Bright half: the light the glass sends back, added over the shaded backdrop.
    `<feColorMatrix in="map" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 1 0 0" result="litA"/>`,
    `<feComponentTransfer in="litA" result="litHalf"><feFuncA type="table" tableValues="0 0 1"/></feComponentTransfer>`,
    `<feComposite in="litHalf" in2="shaded" operator="over"/>`,
  );
  return parts.join("");
}

/// Glass that actually bends its backdrop. Same box as `GlassSurface`, plus the lens.
export function LensGlass(props: {
  mode: Mode;
  width: number;
  height: number;
  radius: number;
  kind: "button" | "bar";
  fill?: string;
  floating?: boolean;
  bevel?: number;
  thickness?: number;
  shape?: LensShape;
  slope?: number;
  blur?: number;
  dispersion?: number;
  class?: string;
  style?: string;
  children?: Child;
}): Markup {
  // Ratios tuned against hyalite's own card: a 200 pt card gets a 30 pt bevel over a 48 pt slab.
  const short = Math.min(props.width, props.height);
  const bevel = props.bevel ?? Math.min(36, Math.round(short * 0.3));
  const thickness = props.thickness ?? Math.min(56, Math.round(short * 0.48));
  const shape = props.shape ?? "squircle";
  const profile = lensProfile(shape, bevel, thickness, { slope: props.slope ?? 2.7 });
  const url = displacementMap(props.width, props.height, props.radius, profile);
  const id = `lens-${++instance}`;
  const dark = props.mode === "dark";
  // feDisplacementMap shift = (channel/255 − ½) · scale; the map normalises the bend to 127, so
  // `2 · max` maps the outermost pixel to exactly max px of shift.
  const scale = 2 * profile.max;
  const tint = props.fill ?? (dark ? "rgb(20 22 28 / 0.28)" : "rgb(255 255 255 / 0.26)");
  const shadow = props.floating
    ? "0 8px 28px rgb(0 0 0 / 0.12),0 1px 3px rgb(0 0 0 / 0.06)"
    : "0 3px 8px rgb(0 0 0 / 0.04),0 1px 2px rgb(0 0 0 / 0.03)";
  return (
    <div
      class={`relative ${props.class ?? ""}`}
      style={`width:${props.width}px;height:${props.height}px;border-radius:${props.radius}px;background:${tint};backdrop-filter:blur(12px) saturate(1.6);backdrop-filter:url(#${id}) blur(1.5px) saturate(1.7);box-shadow:${shadow},0 0 0 0.5px ${
        dark ? "rgb(255 255 255 / 0.16)" : "rgb(0 0 0 / 0.06)"
      };${props.style ?? ""}`}
    >
      <svg aria-hidden="true" width="0" height="0" class="absolute">
        <filter
          id={id}
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          x="-0.25"
          y="-0.25"
          width="1.5"
          height="1.5"
          color-interpolation-filters="sRGB"
        >
          {raw(filterMarkup(id, url, scale, { blur: props.blur ?? 1, dispersion: props.dispersion ?? 1.2 }))}
        </filter>
      </svg>
      {props.children}
    </div>
  );
}
