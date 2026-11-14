// Colours and fonts are defined once here. build.ts expands COLOR into `--color-*`
// variables, so `text-ink`, `border-rule` and `bg-paper` come from this file.
// Mock-up colours (system label, fill, tint) are added per platform from
// figma/reference/<kit>/tokens/colors.json when a page needs them.

export const COLOR = {
  // Page chrome: the light sheet the mock-ups sit on.
  ink: "#1d1d1f",
  dim: "#6e6e73",
  rule: "#d2d2d7",
  paper: "#fefefe",
} as const;

// SF Pro resolves through -apple-system in Chrome on macOS.
export const FONT_SANS = '-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro",system-ui,sans-serif';
export const FONT_MONO = '"SF Mono",ui-monospace,Menlo,monospace';
