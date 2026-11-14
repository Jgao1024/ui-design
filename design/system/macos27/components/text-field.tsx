import type { Markup } from "@design/jsx/jsx-runtime";
import { Icon } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Text field and combo box from figma/reference/macos27/specs/04-input/Text-Fields__*.json and
// 03-controls/Combo-Boxes__*.json.
//   text field   120 x 24, radius 6, text SF Pro Medium 13 pt 8 px in. Fill white (Light) or #1E1E1E (Dark);
//                disabled: the fill at 50%. Dark has a white 4% outline. Focused: a focus ring and a 2 x 18
//                accent cursor. Figma's Light border is a multiply layer without a value; it is drawn as a
//                black 12% hairline plus a faint shadow.
//   combo box    100 x 24: the field and a 24 x 20 button (radius 4.5, black 8% / 16% / 4%) 2 px from the right,
//                holding a bold 11 pt down chevron
export type FieldState = "idle" | "focused" | "disabled";

const base = (mode: Mode) => (mode === "light" ? "0 0 0" : "255 255 255");

function fieldStyle(mode: Mode, state: FieldState): string {
  const ui = UI[mode];
  const fill = mode === "light" ? "255 255 255" : "30 30 30";
  const alpha = state === "disabled" ? 0.5 : 1;
  const edge = mode === "light"
    ? "inset 0 0 0 0.5px rgb(0 0 0 / 0.14),0 0.5px 1.5px rgb(0 0 0 / 0.1)"
    : "inset 0 0 0 1px rgb(255 255 255 / 0.04)";
  const ring = state === "focused" ? `,0 0 0 3px color-mix(in srgb,${ui.accent} 50%,transparent)` : "";
  return `background:rgb(${fill} / ${alpha});box-shadow:${edge}${ring}`;
}

export function TextField(props: { mode: Mode; state?: FieldState; width?: number; text?: string; cursor?: boolean }): Markup {
  const state = props.state ?? "idle";
  const ui = UI[props.mode];
  const text = props.text ?? "Value";
  return (
    <div
      class="flex h-6 items-center rounded-[6px] px-2 text-[13px] leading-4 font-medium"
      style={`width:${props.width ?? 120}px;${fieldStyle(props.mode, state)};color:${ui.label}`}
    >
      {text}
      {props.cursor ?? state === "focused" ? <span class="h-[18px] w-0.5 rounded-full" style={`background:${ui.accent}`} /> : null}
    </div>
  );
}

export type ComboState = "idle" | "field-clicked" | "button-clicked" | "disabled";

export function ComboBox(props: { mode: Mode; state?: ComboState }): Markup {
  const state = props.state ?? "idle";
  const fieldState: FieldState = state === "disabled" ? "disabled" : state === "field-clicked" ? "focused" : "idle";
  const button = state === "button-clicked" ? 0.16 : state === "disabled" ? 0.04 : 0.08;
  const ink = state === "disabled" ? `rgb(${base(props.mode)} / 0.25)` : `rgb(${base(props.mode)} / 0.85)`;
  return (
    <div class="relative" style="width:100px;height:24px">
      <TextField mode={props.mode} state={fieldState} width={100} text="Value" />
      <div
        class="absolute top-0.5 right-0.5 flex h-5 w-6 items-center justify-center rounded-[4.5px]"
        style={`background:rgb(${base(props.mode)} / ${button});color:${ink}`}
      >
        <Icon name="chevron.down" size={11} weight={2.2} />
      </div>
    </div>
  );
}

/// Search field (Search-Fields__*.json): 120 x 24 capsule. Magnifier at 8 px, "Search" at 26 px, a clear button
/// (black 50%) at 96 px once there is text. Fill and focus ring are the text field's.
export function SearchField(props: { mode: Mode; state?: FieldState; text?: boolean; width?: number }): Markup {
  const state = props.state ?? "idle";
  const ui = UI[props.mode];
  const text = props.text ?? true;
  const disabled = state === "disabled";
  return (
    <div
      class="flex h-6 items-center rounded-full pr-2 pl-2 text-[13px] leading-4 font-medium"
      style={`width:${props.width ?? 120}px;${fieldStyle(props.mode, state)};color:${ui.label}`}
    >
      <span class="mr-[2px] flex w-4 justify-center" style={`opacity:${disabled ? 0.5 : 1}`}><Icon name="magnifyingglass" size={13} weight={1.6} /></span>
      {text ? <span class="flex-1" style={`opacity:${disabled ? 0.5 : 1}`}>Search</span> : <span class="flex-1" />}
      {state === "focused" && text ? <span class="-ml-[26px] h-[18px] w-0.5 rounded-full" style={`background:${ui.accent};margin-right:24px`} /> : null}
      {text ? <span style={`color:${ui.secondary}`}><Icon name="xmark.circle.fill" size={14} /></span> : null}
    </div>
  );
}
