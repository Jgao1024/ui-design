import type { Markup } from "@design/jsx/jsx-runtime";
import { Icon } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Wells from figma/reference/macos27/specs/03-controls/Color-Wells__*.json and Image-Wells__*.json.
//   color well        48 x 24 capsule; a 42 x 18 swatch (#34C759 in Figma's sample) with a black 10% outline, 3 px in.
//                     Figma's Selected state has the swatch at 50% and a black 8% fill; Disabled has the same fill
//                     and a full swatch. The Idle fill sits inside an instance that is not exported.
//   colour picker     28 px circle button with a rainbow rim holding an 18 px colour dot
//   image well        30 x 30, radius 3, black 2% fill, the 24 x 24 image 3 px in; disabled is 50% opaque
// Dark values are inferred: white in place of black.
export type WellState = "idle" | "selected" | "disabled";
const base = (mode: Mode) => (mode === "light" ? "0 0 0" : "255 255 255");

export function ColorWell(props: { mode: Mode; state?: WellState }): Markup {
  const state = props.state ?? "idle";
  return (
    <div class="flex h-6 w-12 items-center justify-center rounded-full" style={`background:rgb(${base(props.mode)} / 0.08)`}>
      <span
        class="h-[18px] w-[42px] rounded-full"
        style={`background:#34c759;box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 0.1);${state === "selected" ? "opacity:0.5" : ""}`}
      />
    </div>
  );
}

export function ColorPickerButton(props: { mode: Mode; selected?: boolean }): Markup {
  const rim = "conic-gradient(#ff3b30,#ff9500,#ffcc00,#34c759,#00c7be,#0a84ff,#af52de,#ff2d55,#ff3b30)";
  return (
    <div class="relative flex size-7 items-center justify-center rounded-full" style={`background:${rim}`}>
      <span class="absolute rounded-full" style={`inset:2px;background:${UI[props.mode].window}`} />
      <span
        class="relative size-[18px] rounded-full"
        style={`background:#ff0000;${props.selected ? `box-shadow:0 0 0 1.5px ${UI[props.mode].window},0 0 0 3px ${UI[props.mode].accent}` : ""}`}
      />
    </div>
  );
}

export function ImageWell(props: { mode: Mode; disabled?: boolean }): Markup {
  const ui = UI[props.mode];
  return (
    <div
      class="flex size-[30px] items-center justify-center rounded-[3px]"
      style={`background:rgb(${base(props.mode)} / 0.02);box-shadow:inset 0 0 0 0.5px rgb(${base(props.mode)} / 0.15);color:${ui.secondary};${
        props.disabled ? "opacity:0.5" : ""
      }`}
    >
      <Icon name="photo" size={20} />
    </div>
  );
}
