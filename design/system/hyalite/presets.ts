// Glass parameter sets for the component labs (pages/03-ios, pages/04-macos).
// A set is hyalite's engine options plus three fill values per mode:
//   tone    grey level of the fill, 0–255     fill    fill alpha, 0–1     shadow  drop shadow alpha, 0–1
// The panel's "定为标准" button copies the current Light + Dark sets as JSON; paste it into
// STANDARD below and rebuild to make it every page's starting point.

export type Shape = "circle" | "squircle" | "lip";

export type GlassParams = {
  shape: Shape;
  bevel: number;
  thickness: number;
  slope: number;
  shade: number;
  rim: number;
  edgeW: number;
  sat: number;
  edge: number;
  blur: number;
  dispersion: number;
  light: number;
  smooth: number;
  tone: number;
  fill: number;
  shadow: number;
};

export type ModeParams = { light: GlassParams; dark: GlassParams };
export type Preset = { id: string; label: string; note: string } & ModeParams;

// hyalite v0.5.0 DEFAULTS: a narrow bevel over a thick slab with a folding slope.
const HYALITE = {
  shape: "squircle",
  bevel: 37,
  thickness: 59,
  slope: 2.7,
  shade: 0.46,
  rim: 1.76,
  edgeW: 8,
  sat: 0.86,
  edge: 0.32,
  blur: 1,
  dispersion: 1.6,
  light: -140,
  smooth: 1,
} as const;

function both(light: GlassParams, dark: Partial<GlassParams> = {}): ModeParams {
  return { light, dark: { ...light, ...dark } };
}

export const PRESETS: Preset[] = [
  {
    id: "hyalite",
    label: "原版",
    note: "hyalite 作者调的默认档：边缘折叠出液态漩涡，色散明显。最耗性能。",
    ...both({ ...HYALITE, tone: 255, fill: 0.3, shadow: 0.08 }, { tone: 24, fill: 0.35, shadow: 0.3 }),
  },
  {
    id: "clear",
    label: "清透",
    note: "接近 Apple Clear：不折叠、几乎不模糊、填充很淡，只在边缘弯。图标颜色不随底色变，所以浅色模式放在黑底、深色模式放在白底时会看不清。",
    ...both(
      { ...HYALITE, bevel: 22, thickness: 36, slope: 0.95, shade: 0.3, rim: 1.3, edgeW: 6, sat: 1, edge: 0.45, blur: 0.5, dispersion: 0.6, tone: 255, fill: 0.12, shadow: 0.06 },
      { tone: 0, fill: 0.12, shadow: 0.25 },
    ),
  },
  {
    id: "regular",
    label: "常规",
    note: "接近 Apple Regular：中等模糊加明显填充，文字在任何底上都读得清，边缘弯得克制。带色散和抗锯齿二次位移，实测 84 个玻璃同时动只有 15 fps。",
    ...both(
      { ...HYALITE, bevel: 18, thickness: 40, slope: 0.9, shade: 0.28, rim: 1.2, edgeW: 6, sat: 1, edge: 0.5, blur: 5, dispersion: 0.5, tone: 255, fill: 0.6, shadow: 0.1 },
      { tone: 26, fill: 0.65, shadow: 0.35, rim: 0.9, edge: 0.35 },
    ),
  },
  {
    id: "thick",
    label: "厚玻璃",
    note: "lip 剖面加厚：外沿凸起、内侧下凹，多一组明暗带，像一块倒角很深的玻璃砖。",
    ...both(
      { ...HYALITE, shape: "lip", bevel: 24, thickness: 60, slope: 1.6, shade: 0.5, rim: 1.8, edgeW: 10, sat: 0.8, edge: 0.4, blur: 1.5, dispersion: 1.4, tone: 255, fill: 0.22, shadow: 0.1 },
      { tone: 20, fill: 0.3, shadow: 0.35 },
    ),
  },
  {
    id: "fast",
    label: "性能档",
    note: "常规档关掉色散和抗锯齿二次位移：肉眼和常规几乎一样，实测 84 个玻璃同时动 60 fps。",
    ...both(
      { ...HYALITE, bevel: 18, thickness: 40, slope: 0.9, shade: 0.28, rim: 1.2, edgeW: 6, sat: 1, edge: 0.5, blur: 5, dispersion: 0, smooth: 0, tone: 255, fill: 0.6, shadow: 0.1 },
      { tone: 26, fill: 0.65, shadow: 0.35, rim: 0.9, edge: 0.35 },
    ),
  },
];

/// The agreed standard, chosen 2026-11-14 after trying every preset on both lab pages: the
/// "常规" values, written out so that retuning a preset never moves the standard. One set for both
/// platforms; the labs' "回到标准" button returns to it.
const GLASS_STANDARD: ModeParams = {
  light: {
    shape: "squircle", bevel: 18, thickness: 40, slope: 0.9, shade: 0.28, rim: 1.2, edgeW: 6, sat: 1, edge: 0.5,
    blur: 5, dispersion: 0.5, light: -140, smooth: 1, tone: 255, fill: 0.6, shadow: 0.1,
  },
  dark: {
    shape: "squircle", bevel: 18, thickness: 40, slope: 0.9, shade: 0.28, rim: 0.9, edgeW: 6, sat: 1, edge: 0.35,
    blur: 5, dispersion: 0.5, light: -140, smooth: 1, tone: 26, fill: 0.65, shadow: 0.35,
  },
};

export const STANDARD: { ios: ModeParams; macos: ModeParams } = { ios: GLASS_STANDARD, macos: GLASS_STANDARD };
