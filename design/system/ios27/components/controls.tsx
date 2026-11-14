import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon } from "./icon.tsx";
import { textCss } from "./text.tsx";

// Controls drawn flat (not glass), figma/reference/ios27/specs/03-controls.
//   Segmented control: 370 x 32 (Small) or 50 (Large) capsule, fill #767680 at 12 %, 2 pt inset,
//   4 pt between segments. Option: selected is a white capsule with shadow 0 2 20 at 6 %; label
//   13.3/18, weight 590 selected, 510 not. Disabled is 50 % opacity.
//   Stepper: 92 x 32, two 46 x 32 halves with fill #767680 at 12 %, a 1 x 24 separator at 30 %.

export function SegmentedControl(props: {
  mode: Mode;
  options: string[];
  selected: number;
  size?: "small" | "large";
  enabled?: boolean;
  width?: number;
}): Markup {
  const t = tone(props.mode);
  const large = props.size === "large";
  const height = large ? 50 : 32;
  return (
    <div
      class="flex items-stretch gap-1 rounded-full p-0.5"
      style={`width:${props.width ?? 370}px;height:${height}px;background:${t.fill3};opacity:${props.enabled === false ? 0.5 : 1}`}
    >
      {props.options.map((option, index) => {
        const selected = index === props.selected;
        return (
          <div
            class="grid flex-1 place-items-center rounded-full"
            style={`${textCss("footnote", { weight: selected ? 590 : 510 })};font-size:${large ? 15 : 13.333}px;color:${t.label};${selected ? `background:${props.mode === "dark" ? "#636366" : "#fff"};box-shadow:0 2px 20px rgb(0 0 0 / 0.06)` : ""}`}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
}

export function Stepper(props: { mode: Mode; pressed?: "minus" | "plus"; disabled?: "minus" | "plus" | "both" }): Markup {
  const t = tone(props.mode);
  const half = (side: "minus" | "plus") => {
    const disabled = props.disabled === "both" || props.disabled === side;
    const pressed = props.pressed === side;
    return (
      <div
        class="grid h-8 w-[46px] place-items-center"
        style={`background:${disabled ? t.fill4 : pressed ? (props.mode === "dark" ? "rgb(118 118 128 / 0.4)" : "rgb(116 116 128 / 0.2)") : t.fill3};color:${disabled ? t.label3 : t.label}`}
      >
        <Icon name={side} size={17} weight={2.6} />
      </div>
    );
  };
  return (
    <div class="relative flex h-8 w-[92px] overflow-hidden rounded-lg">
      {half("minus")}
      {half("plus")}
      <div class="absolute left-[46px] top-1 h-6 w-px rounded-full" style={`background:${t.label3}`} />
    </div>
  );
}

// Slider, figma Sliders__*.json: row 368 wide, track 6 tall (#787878 at 20 %), fill in the tint,
// knob 38 x 24 white (shadow 0 6 13 at 12 %), pressed knob is a 58 x 38 glass lens, ticks 4 x 4 at 18 %.
export function Slider(props: {
  mode: Mode;
  value: number;
  pressed?: boolean;
  disabled?: boolean;
  ticks?: boolean;
  symbols?: boolean;
  width?: number;
}): Markup {
  const t = tone(props.mode);
  const track = props.symbols ? 282 : (props.width ?? 368);
  const x = (track - 38) * (props.value / 100);
  return (
    <div class="flex h-[50px] items-center gap-3" style={`width:${props.width ?? 368}px;opacity:${props.disabled ? 0.5 : 1};color:${t.label2}`}>
      {props.symbols && <span class="w-6"><Icon name="minus" size={22} /></span>}
      <div class="relative h-6" style={`width:${track}px`}>
        <div class="absolute inset-x-0 top-[9px] h-1.5 rounded-[3px]" style={`background:${props.mode === "dark" ? "rgb(120 120 128 / 0.36)" : "rgb(120 120 128 / 0.2)"}`} />
        <div class="absolute left-0 top-[9px] h-1.5 rounded-[3px]" style={`width:${x + 19}px;background:${t.blue}`} />
        {props.ticks && [0, 1, 2, 3, 4].map((i) => (
          <span class="absolute top-5 size-1 rounded-full" style={`left:${i * ((track - 4) / 4)}px;background:${t.label4}`} />
        ))}
        {props.pressed
          ? <div class="absolute -top-[7px] h-10 w-[60px] rounded-full" style={`left:${x - 11}px;background:rgb(255 255 255 / 0.55);backdrop-filter:blur(4px);box-shadow:inset 0 0 0 0.5px #ccc,0 2px 10px rgb(0 0 0 / 0.12)`} />
          : <div class="absolute top-0 h-6 w-[38px] rounded-full bg-white" style={`left:${x}px;box-shadow:0 6px 13px rgb(0 0 0 / 0.12),0 0.5px 4px rgb(0 0 0 / 0.12)`} />}
      </div>
      {props.symbols && <span class="w-6"><Icon name="plus" size={22} /></span>}
    </div>
  );
}

// Page control: 8 pt dots 8 apart in a 24 pt capsule with 12 / 8 padding. Overflow shrinks the end dots to 6 and 4.
export function PageControl(props: { mode: Mode; count: number; selected: number }): Markup {
  const t = tone(props.mode);
  const overflow = props.count > 7;
  const sizeOf = (i: number) => {
    if (!overflow) return 8;
    const edge = Math.min(i, props.count - 1 - i);
    return edge === 0 ? 4 : edge === 1 ? 6 : 8;
  };
  return (
    <div class="flex h-6 items-center gap-2 rounded-full px-3">
      {Array.from({ length: props.count }, (_, i) => (
        <span class="grid size-2 place-items-center">
          <span class="rounded-full" style={`width:${sizeOf(i)}px;height:${sizeOf(i)}px;background:${i === props.selected ? t.label : t.label3}`} />
        </span>
      ))}
    </div>
  );
}

export function Spinner(props: { mode: Mode; size: number }): Markup {
  const t = tone(props.mode);
  const bar = props.size * 0.37;
  const w = props.size * 0.14;
  return (
    <div class="relative" style={`width:${props.size}px;height:${props.size}px`}>
      {Array.from({ length: 8 }, (_, i) => (
        <span
          class="absolute left-1/2 top-0 rounded"
          style={`width:${w}px;height:${bar}px;margin-left:${-w / 2}px;background:${t.label2};opacity:${1 - i * 0.12 - 0.12};transform-origin:50% ${props.size / 2}px;transform:rotate(${i * 45}deg)`}
        />
      ))}
    </div>
  );
}

// Linear progress: a 370 x 4 track (#787878 at 20 %) under a 17 pt label.
export function ProgressBar(props: { mode: Mode; value: number; label?: boolean; width?: number }): Markup {
  const t = tone(props.mode);
  return (
    <div class="flex flex-col gap-[3px] px-4 py-5" style={`width:${(props.width ?? 370) + 32}px`}>
      {props.label !== false && <span style={`${textCss("body")};color:${t.label}`}>Loading...</span>}
      <div class="h-1 w-full overflow-hidden rounded-full" style={`background:${props.mode === "dark" ? "rgb(120 120 128 / 0.36)" : "rgb(120 120 128 / 0.2)"}`}>
        <div class="h-full rounded-full" style={`width:${props.value}%;background:${t.blue}`} />
      </div>
    </div>
  );
}

// Pop-up button: a 18 pt label in the tint and an up-down chevron, 44 pt tall.
export function PopUpButton(props: { mode: Mode; enabled?: boolean; label?: string }): Markup {
  const t = tone(props.mode);
  const color = props.enabled === false ? t.label3 : t.blue;
  return (
    <div class="flex h-11 items-center gap-[3px]" style={`color:${color};font-size:18px;line-height:18px;font-weight:590`}>
      <span>{props.label ?? "Label"}</span>
      <Icon name="chevron-up-down" size={16} weight={2.6} />
    </div>
  );
}
