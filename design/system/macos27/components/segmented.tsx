import type { Markup } from "@design/jsx/jsx-runtime";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Segmented control from figma/reference/macos27/specs/03-controls/Segmented-Controls__*.json.
// The control is 24 px high, radius 6, fill black 8% over black 2%. Segments are 56 x 20 with radius 6
// and a 2 px inset; labels are SF Pro Medium 13 pt. A 1 x 14 separator (black 25%) sits between two
// segments that neither touch the selected nor the pressed one.
//   unselected   idle: no fill, label black 85%; clicked: fill black 16%; disabled: label black 25%
//   selected     active: accent #0088FF over black 3% (clicked: black 15%, disabled: 45% opacity), label white
//                inactive: black 10% / 19% / 5%, label black 85% (25% disabled)
// Dark values are inferred: white in place of black.
export type SegmentState = "idle" | "clicked" | "disabled";

const BASE = (mode: Mode, alpha: number) => `rgb(${mode === "light" ? "0 0 0" : "255 255 255"} / ${alpha})`;

function Segment(props: { mode: Mode; selected: boolean; state: SegmentState; active: boolean; label: string }): Markup {
  const ui = UI[props.mode];
  const disabled = props.state === "disabled";
  const clicked = props.state === "clicked";
  let background = "transparent";
  let color = disabled ? BASE(props.mode, 0.25) : BASE(props.mode, 0.85);
  let opacity = "";
  if (props.selected && props.active) {
    const overlay = clicked ? 0.15 : 0.0314;
    background = `linear-gradient(rgb(0 0 0 / ${overlay}),rgb(0 0 0 / ${overlay})),${ui.accent}`;
    color = disabled ? "rgb(255 255 255 / 0.5)" : "#ffffff";
    if (disabled) opacity = "opacity:0.45;";
  } else if (props.selected) {
    background = BASE(props.mode, disabled ? 0.05 : clicked ? 0.19 : 0.1);
  } else if (clicked) {
    background = BASE(props.mode, 0.16);
  }
  return (
    <div
      class="flex h-5 w-14 items-center justify-center rounded-[6px] text-[13px] leading-5 font-medium"
      style={`background:${background};color:${color};${opacity}`}
    >
      {props.label}
    </div>
  );
}

/// `selected` and `pressed` are segment indexes. Disabled disables the whole control.
export function SegmentedControl(props: {
  mode: Mode;
  count?: number;
  selected?: number;
  pressed?: number;
  disabled?: boolean;
  active?: boolean;
  /// false for a control with no selection (Selectable = False).
  selectable?: boolean;
}): Markup {
  const count = props.count ?? 3;
  const items = Array.from({ length: count }, (_, index) => index);
  const selected = props.selectable === false ? -1 : props.selected ?? 0;
  return (
    <div class="flex h-6 items-center rounded-[6px] p-0.5" style={`background:${BASE(props.mode, 0.08)}`}>
      {items.map((index) => {
        const touching = (other: number | undefined) => other !== undefined && (other === index || other === index - 1);
        const showSeparator = index > 0 && !touching(selected) && !touching(props.pressed);
        return (
          <>
            {index > 0
              ? <span class="h-[14px] w-px" style={`background:${showSeparator ? BASE(props.mode, 0.25) : "transparent"}`} />
              : null}
            <Segment
              mode={props.mode}
              selected={index === selected}
              state={props.disabled ? "disabled" : props.pressed === index ? "clicked" : "idle"}
              active={props.active ?? true}
              label="Label"
            />
          </>
        );
      })}
    </div>
  );
}
