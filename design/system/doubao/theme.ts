// Doubao (com.bot.doubao 15.6.0) mock-up colours, sampled from the device screenshots in
// design/.ref/doubao/device/<mode>/*.png (iPhone 15 Pro, 393 x 852 pt @3x).
// Self-contained: nothing here is shared with the ios27 kit.

// build.ts expands COLOR into `--color-*` variables; the mock-ups read TONE through tone(mode).
export const COLOR = {} as const;

export type Mode = "light" | "dark";

const TONE = {
  light: {
    bg: "#ffffff",
    label: "#000000",
    label2: "#6e6e6e", // secondary text, unselected tabs
    label3: "#a6a6a6", // placeholder, hints, timestamps
    faint: "#c8c8c8", // chip chevrons
    card: "#f7f7f7", // answer cards, plus tiles, profile groups, search field
    card2: "#ffffff", // cards inside cards
    selected: "#f2f2f2", // pressed or selected row
    sheet: "#ffffff",
    divider: "#eeeeee",
    rim: "#e5e5e5", // outlined chips and buttons
    track: "#f5f5f5",
    trackRim: "#efefef",
    thumb: "#ffffff",
    thumbShadow: "0 2px 6px rgb(0 0 0 / 0.08)",
    behind: "rgb(0 0 0 / 0.14)", // the page pushed aside by the sidebar
    dim: "rgb(0 0 0 / 0.3)", // under a sheet
    toast: "#ffffff",
    keyboard: "#e2e3e8",
    key: "#ffffff",
    keyShadow: "0 1px 0 rgb(0 0 0 / 0.25)",
    accentTint: "#e1f0ff", // selected filter chip
  },
  dark: {
    bg: "#000000",
    label: "#ffffff",
    label2: "#a8a8a8",
    label3: "#7f7f7f",
    faint: "#5a5a5a",
    card: "#252525",
    card2: "#1a1a1a",
    selected: "#323232",
    sheet: "#202020",
    divider: "#2e2e2e",
    rim: "#262626",
    track: "#141414",
    trackRim: "#1a1a1a",
    thumb: "#383838",
    thumbShadow: "none",
    behind: "rgb(255 255 255 / 0.145)",
    dim: "rgb(0 0 0 / 0.4)",
    toast: "#383838",
    keyboard: "#202020",
    key: "#444444",
    keyShadow: "none",
    accentTint: "#0d1a2e",
  },
} as const;

/// Colours that are the same in both modes.
export const SHARED = {
  blue: "#007aff", // keyboard send key, links, selected tabs
  bubble: "#00b8ff", // the user's chat bubble
  speaker: "#00cfff", // auto-read on
  warning: "#ff9500",
  red: "#ff3b30",
} as const;

export function tone(mode: Mode) {
  return { ...TONE[mode], ...SHARED };
}
