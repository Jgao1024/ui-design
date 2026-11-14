// Mock-up colours for ios27, taken from figma/reference/ios27/tokens/colors.json. build.ts expands
// COLOR into `--color-*` variables for ios27 pages only; pages read the per-mode sets below
// through `tone(mode)` because Light and Dark are drawn side by side on one page.
export const COLOR = {} as const;

export type Mode = "light" | "dark";

// System colours (Colors page swatches: Light red #FF383C, Dark red #FF4245, blue #0088FF / #0091FF).
export const ACCENT = {
  light: {
    red: "#ff383c",
    orange: "#ff8d28",
    yellow: "#ffcc00",
    green: "#34c759",
    mint: "#00c8b3",
    teal: "#00c3d0",
    cyan: "#00c0e8",
    blue: "#0088ff",
    indigo: "#6155f5",
    purple: "#cb30e0",
    pink: "#ff2d55",
    brown: "#ac7f5e",
    gray: "#8e8e93",
  },
  dark: {
    red: "#ff4245",
    orange: "#ff9230",
    yellow: "#ffd600",
    green: "#30d158",
    mint: "#00dac3",
    teal: "#00d2e0",
    cyan: "#3cd3fe",
    blue: "#0091ff",
    indigo: "#6d7cff",
    purple: "#db34f2",
    pink: "#ff375f",
    brown: "#b78a66",
    gray: "#8e8e93",
  },
} as const;

// Labels, fills, separators and backgrounds. Labels: #3C3C43 / #EBEBF5 at 60, 30, 18 %.
// Fills: #787880 (Light 20/16/12/8 %) and #767680 (Dark 36/32/24/18 %).
const NEUTRAL = {
  light: {
    label: "#000000",
    label2: "rgb(60 60 67 / 0.6)",
    label3: "rgb(60 60 67 / 0.3)",
    label4: "rgb(60 60 67 / 0.18)",
    fill: "rgb(120 120 128 / 0.2)",
    fill2: "rgb(120 120 128 / 0.16)",
    fill3: "rgb(118 118 128 / 0.12)",
    fill4: "rgb(116 116 128 / 0.08)",
    separator: "#e6e6e6",
    bg: "#ffffff",
    bg2: "#f2f2f7",
    bg3: "#ffffff",
    grouped: "#f2f2f7",
    groupedRow: "#ffffff",
    onGlass: "#262626",
  },
  dark: {
    label: "#ffffff",
    label2: "rgb(235 235 245 / 0.6)",
    label3: "rgb(235 235 245 / 0.3)",
    label4: "rgb(235 235 245 / 0.18)",
    fill: "rgb(120 120 128 / 0.36)",
    fill2: "rgb(120 120 128 / 0.32)",
    fill3: "rgb(118 118 128 / 0.24)",
    fill4: "rgb(118 118 128 / 0.18)",
    separator: "#38383a",
    bg: "#000000",
    bg2: "#1c1c1e",
    bg3: "#2c2c2e",
    grouped: "#000000",
    groupedRow: "#1c1c1e",
    onGlass: "#f5f5f5",
  },
} as const;

/// Everything a mock-up needs in one mode: neutrals plus the system colours (`blue`, `red`, ...).
export function tone(mode: Mode) {
  return { ...NEUTRAL[mode], ...ACCENT[mode] };
}
