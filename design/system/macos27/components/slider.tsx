import type { Markup } from "@design/jsx/jsx-runtime";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Sliders and dials from figma/reference/macos27/specs/03-controls/Sliders-and-Dials__*.json.
//   slider   100 x 24; the groove is 4 px high (black 85% at 10% opacity, 19% clicked, 6% disabled) and runs
//            3 px past each end; ticks are 2 x 2 dots (black 85% at 25%, 10% disabled) 16 px from the top;
//            the knob is a white 20 x 16 pill with a 0.5 px drop shadow. The filled part is 4 px high.
//   dial     24 x 24 circle (black 8%, 16% clicked, 6% disabled) with a 2 x 6 indicator at the top
//            (black 85%, 25% disabled)
// Figma keeps the filled colour inside an instance. It is the accent while the window is active; the grey
// used for an inactive window and the Dark alphas are inferred.
export type SliderState = "idle" | "clicked" | "disabled";
const base = (mode: Mode) => (mode === "light" ? "0 0 0" : "255 255 255");

export function Slider(props: {
  mode: Mode;
  /// 0 to 1.
  value: number;
  state?: SliderState;
  active?: boolean;
  ticks?: boolean;
  /// The fill grows from the middle instead of the left end.
  centerBiased?: boolean;
  width?: number;
}): Markup {
  const ui = UI[props.mode];
  const state = props.state ?? "idle";
  const width = props.width ?? 100;
  const x = props.value * width;
  const mid = width / 2;
  const from = props.centerBiased ? Math.min(mid, x) : 0;
  const to = props.centerBiased ? Math.max(mid, x) : x;
  const groove = state === "idle" ? 0.1 : state === "clicked" ? 0.19 : 0.06;
  const fill = props.active === false ? `rgb(${base(props.mode)} / 0.3)` : ui.accent;
  const ticks = [0, 1, 2, 3, 4].map((index) => (index * width) / 4);
  return (
    <div class="relative h-6" style={`width:${width}px`}>
      <div
        class="absolute top-[10px] h-1 rounded-full"
        style={`left:-2px;width:${width + 4}px;background:rgb(${base(props.mode)} / ${0.85 * groove})`}
      />
      <div
        class="absolute top-[10px] h-1 rounded-full"
        style={`left:${from}px;width:${to - from}px;background:${fill};${state === "disabled" ? "opacity:0.4" : ""}`}
      />
      {props.ticks
        ? ticks.map((tick, index) => (
          <span
            class="absolute rounded-full"
            style={`left:${tick - 1}px;top:${props.centerBiased && index === 2 ? 15 : 16}px;width:2px;height:${
              props.centerBiased && index === 2 ? 4 : 2
            }px;background:rgb(${base(props.mode)} / ${props.centerBiased && index === 2 ? 0.85 : state === "disabled" ? 0.085 : 0.21})`}
          />
        ))
        : null}
      <div
        class="absolute top-1 h-4 w-5 rounded-full bg-white"
        style={`left:${x - 10}px;box-shadow:0 0.5px 6px rgb(0 0 0 / 0.15),0 0 0 0.5px rgb(0 0 0 / 0.08);${state === "disabled" ? "opacity:0.7" : ""}`}
      />
    </div>
  );
}

export function Dial(props: { mode: Mode; state?: SliderState; /// degrees clockwise from the top
  angle?: number }): Markup {
  const state = props.state ?? "idle";
  const bg = state === "idle" ? 0.08 : state === "clicked" ? 0.16 : 0.06;
  return (
    <div class="relative size-6 rounded-full" style={`background:rgb(${base(props.mode)} / ${bg});transform:rotate(${props.angle ?? 0}deg)`}>
      <span
        class="absolute top-[3px] left-[11px] h-1.5 w-0.5 rounded-full"
        style={`background:rgb(${base(props.mode)} / ${state === "disabled" ? 0.25 : 0.85})`}
      />
    </div>
  );
}
