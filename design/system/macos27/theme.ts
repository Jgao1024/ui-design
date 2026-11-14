// Mock-up colours for macos27, taken from figma/reference/macos27/tokens/colors.json when a page needs
// them. build.ts expands this into `--color-*` variables for macos27 pages only.
export const COLOR = {
  // Tint of the Primary Liquid Glass control (Materials__Liquid-Glass---Small.json, "Tint").
  accent: "#0088ff",
  // Swatch of the Color Wells sample (Color-Wells__Mode=Light-State=Idle.json).
  green: "#34c759",
} as const;

// Sample wallpapers the glass mock-ups sit on. Figma has no wallpaper, so these are drawn here:
// coloured blobs plus fine lines, so that blur, refraction and tint are all visible.
export const WALLPAPER = {
  light: { base: "#e9ecf5", blobs: ["#ff7a59", "#ffc83d", "#3ec4a8", "#4a7dff"], lines: "rgb(0 0 0 / 0.35)" },
  dark: { base: "#14161f", blobs: ["#d9482b", "#c99a1c", "#1f8f78", "#2f55d4"], lines: "rgb(255 255 255 / 0.4)" },
} as const;

// Label, fill and surface colours of the system UI (figma/reference/macos27/tokens/colors.json and the
// Window BG, Sidebars, Toolbars and Buttons specs). Mock-ups pick a palette by mode.
export const UI = {
  light: {
    window: "#ffffff",
    label: "rgb(0 0 0 / 0.85)",
    secondary: "rgb(0 0 0 / 0.5)",
    tertiary: "rgb(0 0 0 / 0.25)",
    separator: "rgb(0 0 0 / 0.12)",
    fill: "rgb(0 0 0 / 0.07)",
    fillStrong: "rgb(0 0 0 / 0.16)",
    disabled: "#bfbfbf",
    accent: "#0088ff",
    red: "#ff383c",
    selected: "#e6e6e6",
    shadow: "0 18px 54px rgb(0 0 0 / 0.3),0 0 1px rgb(0 0 0 / 0.8)",
    shadowInactive: "0 7px 21px rgb(0 0 0 / 0.2),0 0 1px rgb(0 0 0 / 0.8)",
  },
  dark: {
    window: "#1e1e1e",
    label: "rgb(255 255 255 / 0.85)",
    secondary: "rgb(255 255 255 / 0.55)",
    tertiary: "rgb(255 255 255 / 0.25)",
    separator: "rgb(255 255 255 / 0.15)",
    fill: "rgb(255 255 255 / 0.07)",
    fillStrong: "rgb(255 255 255 / 0.16)",
    disabled: "#404040",
    accent: "#0091ff",
    red: "#ff4245",
    selected: "#141414",
    shadow: "0 18px 54px rgb(0 0 0 / 0.57),0 0 0 1px rgb(255 255 255 / 0.2),0 0 1px rgb(0 0 0 / 0.8)",
    shadowInactive: "0 7px 21px rgb(0 0 0 / 0.35),0 0 0 1px rgb(255 255 255 / 0.2),0 0 1px rgb(0 0 0 / 0.8)",
  },
} as const;

export type Mode = "light" | "dark";
