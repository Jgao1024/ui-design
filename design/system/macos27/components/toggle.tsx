import type { Markup } from "@design/jsx/jsx-runtime";
import { Glass } from "./glass.tsx";
import { Icon } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Checkboxes, radio buttons and switches from figma/reference/macos27/specs/03-controls/Toggles__*.json.
//   checkbox      16 x 16, radius 5.5, then a 3 px gap and the label (SF Pro Medium 13 pt)
//   radio button  16 x 16 circle; the dot is 4.8 px, the mixed dash 6.5 x 2
//   off fill      black 10% idle, 19% clicked, 5% disabled; label black 85% (25% disabled)
//   on fill       accent (#0088FF) with a white glyph; disabled halves the glyph to white 50%
//   inactive      an inactive window turns the on fill grey (black 10%) and the glyph black 70% (Light)
// Dark fills are inferred: the same alphas on white. Figma stores the on fill inside an instance.
export type ToggleState = "idle" | "clicked" | "disabled";
export type Selection = "off" | "on" | "mixed";

const INDEX: Record<ToggleState, number> = { idle: 0, clicked: 1, disabled: 2 };
const OFF_ALPHA = [0.1, 0.19, 0.05];

function offFill(mode: Mode, state: ToggleState): string {
  const base = mode === "light" ? "0 0 0" : "255 255 255";
  return `rgb(${base} / ${OFF_ALPHA[INDEX[state]]})`;
}

function Mark(props: { kind: "radio" | "checkbox"; selection: Selection; ink: string }): Markup {
  if (props.selection === "mixed") return <span class="h-0.5 w-[6.5px] rounded-full" style={`background:${props.ink}`} />;
  if (props.kind === "radio") return <span class="size-[4.8px] rounded-full" style={`background:${props.ink}`} />;
  return <span style={`color:${props.ink}`}><Icon name="check" size={12} weight={2.4} /></span>;
}

function Box(props: { mode: Mode; kind: "radio" | "checkbox"; selection: Selection; state: ToggleState; active: boolean }): Markup {
  const ui = UI[props.mode];
  const on = props.selection !== "off";
  const disabled = props.state === "disabled";
  let background = offFill(props.mode, props.state);
  let ink = "#ffffff";
  let filter = "";
  if (on && props.active) {
    background = ui.accent;
    if (disabled) ink = "rgb(255 255 255 / 0.5)";
    if (disabled) background = `color-mix(in srgb,${ui.accent} 50%,transparent)`;
    if (props.state === "clicked") filter = "filter:brightness(0.9);";
  } else if (on) {
    background = offFill(props.mode, "idle");
    ink = props.mode === "light" ? "rgb(0 0 0 / 0.7)" : "#ffffff";
    if (disabled) ink = props.mode === "light" ? "rgb(0 0 0 / 0.22)" : "rgb(255 255 255 / 0.22)";
  }
  return (
    <span
      class={`flex size-4 items-center justify-center ${props.kind === "radio" ? "rounded-full" : "rounded-[5.5px]"}`}
      style={`background:${background};${filter}`}
    >
      {on ? <Mark kind={props.kind} selection={props.selection} ink={ink} /> : null}
    </span>
  );
}

function Labelled(props: { mode: Mode; state: ToggleState; label?: string; children: Markup }): Markup {
  const ui = UI[props.mode];
  const color = props.state === "disabled"
    ? (props.mode === "light" ? "rgb(0 0 0 / 0.25)" : "rgb(255 255 255 / 0.25)")
    : ui.label;
  return (
    <div class="flex items-center gap-[3px]">
      {props.children}
      <span class="text-[13px] leading-4 font-medium" style={`color:${color}`}>{props.label ?? "Label"}</span>
    </div>
  );
}

export function Checkbox(props: { mode: Mode; selection?: Selection; state?: ToggleState; active?: boolean; label?: string }): Markup {
  const state = props.state ?? "idle";
  return (
    <Labelled mode={props.mode} state={state} label={props.label}>
      <Box mode={props.mode} kind="checkbox" selection={props.selection ?? "off"} state={state} active={props.active ?? true} />
    </Labelled>
  );
}

export function RadioButton(props: { mode: Mode; selection?: Selection; state?: ToggleState; active?: boolean; label?: string }): Markup {
  const state = props.state ?? "idle";
  return (
    <Labelled mode={props.mode} state={state} label={props.label}>
      <Box mode={props.mode} kind="radio" selection={props.selection ?? "off"} state={state} active={props.active ?? true} />
    </Labelled>
  );
}

// Switch sizes: track width x height, knob width x height, inset (Toggles__Size=*.json).
export type SwitchSize = "mini" | "small" | "medium" | "large" | "xl";
const SWITCH: Record<SwitchSize, { w: number; h: number; kw: number; kh: number; pad: number }> = {
  mini: { w: 36, h: 16, kw: 21, kh: 13, pad: 1.5 },
  small: { w: 44, h: 20, kw: 26, kh: 16, pad: 2 },
  medium: { w: 54, h: 24, kw: 32, kh: 20, pad: 2 },
  large: { w: 64, h: 28, kw: 38, kh: 24, pad: 2 },
  xl: { w: 80, h: 36, kw: 47, kh: 30, pad: 3 },
};
// Clicked: the knob becomes a Liquid Glass pill about 23% larger (Toggles___Knob-Clicked is 58 x 38 for XL's 47 x 30).
const GROW = 1.23;

export function Switch(props: { mode: Mode; size?: SwitchSize; on?: boolean; state?: ToggleState }): Markup {
  const size = SWITCH[props.size ?? "medium"];
  const state = props.state ?? "idle";
  const ui = UI[props.mode];
  const track = props.on
    ? (state === "disabled" ? `color-mix(in srgb,${ui.accent} 50%,transparent)` : ui.accent)
    : offFill(props.mode, state);
  const clicked = state === "clicked";
  const kw = clicked ? Math.round(size.kw * GROW) : size.kw;
  const kh = clicked ? Math.round(size.kh * GROW) : size.kh;
  const left = props.on ? size.w - size.pad - size.kw : size.pad;
  const knobLeft = left + (size.kw - kw) / 2;
  const knobTop = (size.h - kh) / 2;
  return (
    <div class="relative rounded-full" style={`width:${size.w}px;height:${size.h}px;background:${track}`}>
      <div class="absolute" style={`left:${knobLeft}px;top:${knobTop}px`}>
        {clicked
          ? <Glass width={kw} height={kh} radius={1000} mode={props.mode} size="small"><span /></Glass>
          : (
            <div
              class="rounded-full bg-white"
              style={`width:${kw}px;height:${kh}px;box-shadow:0 3px 8px rgb(0 0 0 / 0.15),0 0 1px rgb(0 0 0 / 0.3);${
                state === "disabled" ? "opacity:0.7" : ""
              }`}
            />
          )}
      </div>
    </div>
  );
}
