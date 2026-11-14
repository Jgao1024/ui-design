import type { Markup } from "@design/jsx/jsx-runtime";
import { Icon } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Stepper from figma/reference/macos27/specs/03-controls/Steppers__*.json: 20 x 24, radius 6. Two
// halves of 20 x 12 (fill black 8%, 16% when pressed, 4% disabled), a 14 x 1 separator (black 12%, 6%
// disabled) and 12 pt up and down chevrons (black 85%, 25% disabled). Dark values are inferred: white.
export type StepperState = "default" | "up" | "down" | "disabled";

const base = (mode: Mode) => (mode === "light" ? "0 0 0" : "255 255 255");

export function Stepper(props: { mode: Mode; state?: StepperState }): Markup {
  const state = props.state ?? "default";
  const disabled = state === "disabled";
  const half = (pressed: boolean) => `rgb(${base(props.mode)} / ${disabled ? 0.04 : pressed ? 0.16 : 0.08})`;
  const ink = `rgb(${base(props.mode)} / ${disabled ? 0.25 : 0.85})`;
  return (
    <div class="relative h-6 w-5 overflow-hidden rounded-[6px]" style={`color:${ink}`}>
      <div class="absolute inset-x-0 top-0 h-3" style={`background:${half(state === "up")}`} />
      <div class="absolute inset-x-0 bottom-0 h-3" style={`background:${half(state === "down")}`} />
      <span class="absolute top-[11.5px] left-[3px] h-px w-[14px]" style={`background:rgb(${base(props.mode)} / ${disabled ? 0.06 : 0.12})`} />
      <span class="absolute top-0 left-0 flex h-3 w-5 items-center justify-center"><Icon name="chevron.up" size={9} weight={2.2} /></span>
      <span class="absolute bottom-0 left-0 flex h-3 w-5 items-center justify-center"><Icon name="chevron.down" size={9} weight={2.2} /></span>
    </div>
  );
}

/// A stand-in text field for the stepper layouts (Figma uses a Text Field instance; see the text-fields page).
export function FieldStub(props: { mode: Mode; width: number; disabled?: boolean }): Markup {
  const ui = UI[props.mode];
  return (
    <div
      class="flex h-6 items-center rounded-[6px] px-2 text-[13px] leading-4"
      style={`width:${props.width}px;background:${ui.window};box-shadow:inset 0 0 0 1px ${ui.separator};color:${props.disabled ? ui.disabled : ui.label}`}
    >
      Value
    </div>
  );
}
