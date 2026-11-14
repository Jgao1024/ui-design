import type { Markup } from "@design/jsx/jsx-runtime";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Push buttons from figma/reference/macos27/specs/03-controls/Buttons__Active=*-Context=*-State=*-Style=*.json
// (Light). A button is 67 x 24, radius 6, label SF Pro Medium 13 pt. Each style draws a fill and a label:
//   Bordered      fill black 8% / 16% / 4%             label black 85%, disabled 25%
//   Tinted        fill accent 20% / 28% / 12%          label accent, disabled 40%
//   Destructive   fill red 20% / 28% / 10%             label red, disabled 40%
//   Prominent     fill accent / darker / accent 40%    label white, disabled 50%
//   Borderless    no fill                               label accent, clicked darker, disabled 50%
// Figma builds the Tinted, Destructive and Prominent fills from blend-mode layers; they are drawn here as
// plain alpha fills. Active = False (inactive window) turns every style except Borderless into Bordered.
// Dark values are not in the Figma data except the label colours; the Dark fill alphas are inferred.
export type ButtonStyle = "bordered" | "tinted" | "destructive" | "prominent" | "prominent-destructive" | "borderless";
export type ButtonState = "idle" | "clicked" | "disabled";

const STATES: ButtonState[] = ["idle", "clicked", "disabled"];
const pick = <T,>(state: ButtonState, values: [T, T, T]): T => values[STATES.indexOf(state)];

/// `rgb(r g b / a)` from a hex colour.
function alpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16} ${(n >> 8) & 255} ${n & 255} / ${a})`;
}

type Look = { background: string; color: string; opacity?: number; filter?: string };

/// The Bordered fill and label of a state; pop-up, pull-down and disclosure buttons use the same values.
export function borderedLook(mode: Mode, state: ButtonState): { background: string; color: string } {
  const base = mode === "light" ? "0 0 0" : "255 255 255";
  const fill = mode === "light" ? pick(state, [0.08, 0.16, 0.04]) : pick(state, [0.12, 0.19, 0.06]);
  return { background: `rgb(${base} / ${fill})`, color: `rgb(${base} / ${pick(state, [0.85, 0.85, 0.25])})` };
}

function look(mode: Mode, style: ButtonStyle, state: ButtonState, active: boolean): Look {
  const ui = UI[mode];
  const bordered: Look = borderedLook(mode, state);
  if (!active && style !== "borderless") return bordered;
  switch (style) {
    case "bordered":
      return bordered;
    case "tinted":
      return {
        background: alpha(ui.accent, pick(state, [0.2, 0.28, 0.12])),
        color: ui.accent,
        opacity: pick(state, [1, 1, 0.4]),
      };
    case "destructive":
      return {
        background: alpha(ui.red, pick(state, [0.2, 0.28, 0.1])),
        color: ui.red,
        opacity: pick(state, [1, 1, 0.4]),
      };
    case "prominent":
    case "prominent-destructive": {
      const tint = style === "prominent" ? ui.accent : ui.red;
      return {
        background: state === "disabled" ? alpha(tint, 0.4) : tint,
        color: state === "disabled" ? "rgb(255 255 255 / 0.5)" : "#ffffff",
        filter: state === "clicked" ? "brightness(0.9)" : undefined,
      };
    }
    case "borderless":
      return {
        background: "transparent",
        color: state === "clicked" ? `color-mix(in srgb,${ui.accent} 82%,black)` : ui.accent,
        opacity: pick(state, [1, 1, 0.5]),
      };
  }
}

export function Button(props: {
  mode: Mode;
  style?: ButtonStyle;
  state?: ButtonState;
  /// false for a window that is not key.
  active?: boolean;
  /// A toggle button that is on: the label turns accent and a blue tint is laid over the fill.
  on?: boolean;
  label?: string;
}): Markup {
  const state = props.state ?? "idle";
  const active = props.active ?? true;
  const view = props.on
    ? onLook(props.mode, state)
    : look(props.mode, props.style ?? "bordered", state, active);
  return (
    <div
      class="flex h-6 w-[67px] items-center justify-center rounded-[6px] text-[13px] leading-4 font-medium"
      style={`background:${view.background};color:${view.color};${view.opacity !== undefined ? `opacity:${view.opacity};` : ""}${
        view.filter ? `filter:${view.filter}` : ""
      }`}
    >
      {props.label ?? "Label"}
    </div>
  );
}

/// Buttons___Toggle, On = True (Light): label accent, #0078F0 tint at 6% / 16% / 2% over the bordered fill, label 30% when disabled.
function onLook(mode: Mode, state: ButtonState): Look {
  const ui = UI[mode];
  const bordered = look(mode, "bordered", state, true);
  const tint = alpha("#0078f0", pick(state, [0.06, 0.16, 0.02]));
  return {
    background: `linear-gradient(${tint},${tint}),${bordered.background}`,
    color: ui.accent,
    opacity: pick(state, [1, 1, 0.3]),
  };
}
