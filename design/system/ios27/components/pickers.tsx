import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon } from "./icon.tsx";
import { SegmentedControl, Slider } from "./controls.tsx";
import { textCss } from "./text.tsx";

// Date and time pickers, figma specs 04-input/Date-and-Time-Pickers__*.json.
//   Collapsed: a 34 pt date capsule (112) and time capsule (86), fill #767680 at 12 %, 6 pt apart.
//   Inline / Compact: 370 x 377 (compact has radius 13 on a material): header 40, weekday row and
//   five week rows in 338 x 325, then a 52 pt time row.
// Color picker, 03-controls/Color-Pickers__Color-Picker---iPhone.json: 386 x 599 sheet, toolbar 49,
//   segmented control 44, colour grid 354 x 296 radius 10, opacity meter 95, swatches 95.

export function DateChips(props: { mode: Mode; selected?: "date" | "time" | null }): Markup {
  const t = tone(props.mode);
  const chip = (text: string, width: number, active: boolean) => (
    <div class="flex h-[34px] items-center justify-center rounded-full px-[11px]" style={`width:${width}px;background:${t.fill3};color:${active ? t.blue : t.label};${textCss("body")}`}>
      {text}
    </div>
  );
  return (
    <div class="flex gap-1.5">
      {chip("Apr 1, 2026", 112, props.selected === "date")}
      {chip("9:41 AM", 86, props.selected === "time")}
    </div>
  );
}

export type DayState = "default" | "current" | "selected" | "current-selected" | "null";

function Day(props: { mode: Mode; n: number; state: DayState }): Markup {
  const t = tone(props.mode);
  const selected = props.state === "selected" || props.state === "current-selected";
  const color = selected ? "#fff" : props.state === "current" ? t.blue : t.label;
  return (
    <div class="grid h-[46px] w-[48px] place-items-center">
      {props.state !== "null" && (
        <div class="grid size-[42px] place-items-center rounded-full" style={`background:${selected ? t.blue : "transparent"};color:${color};font-size:20px;line-height:24px;font-weight:${selected || props.state === "current" ? 590 : 400};letter-spacing:-0.45px`}>
          {props.n}
        </div>
      )}
    </div>
  );
}

export function Calendar(props: { mode: Mode; selected?: number; today?: number }): Markup {
  const t = tone(props.mode);
  const first = 3; // April 2026 starts on a Wednesday
  const days = 30;
  const cells = Array.from({ length: 35 }, (_, i) => i - first + 1);
  return (
    <div class="w-[338px]" style={`color:${t.label}`}>
      <div class="flex h-10 items-center justify-between pl-2 pr-1.5">
        <div class="flex items-center gap-1.5" style={`${textCss("body", { emphasized: true })}`}>April 2026 <span style={`color:${t.blue}`}><Icon name="chevron-right" size={14} weight={3} /></span></div>
        <div class="flex gap-6" style={`color:${t.blue}`}><Icon name="chevron-left" size={20} weight={2.6} /><Icon name="chevron-right" size={20} weight={2.6} /></div>
      </div>
      <div class="grid grid-cols-7 pt-2" style={`${textCss("footnote", { emphasized: true })};color:${t.label2}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => <span class="text-center">{d}</span>)}
      </div>
      <div class="grid grid-cols-7 pt-1">
        {cells.map((n) => {
          const valid = n >= 1 && n <= days;
          const isToday = n === (props.today ?? 1);
          const isSelected = n === (props.selected ?? 15);
          const state: DayState = !valid ? "null" : isToday && isSelected ? "current-selected" : isSelected ? "selected" : isToday ? "current" : "default";
          return <Day mode={props.mode} n={n} state={state} />;
        })}
      </div>
    </div>
  );
}

export function TimeRow(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <div class="flex h-[52px] w-[338px] items-center justify-between" style={`border-top:1px solid rgb(0 0 0 / 0.12);${textCss("body")};color:${t.label}`}>
      <span>Time</span>
      <span class="rounded-md px-3 py-1" style={`background:${t.fill3}`}>9:41 AM</span>
    </div>
  );
}

export function DatePicker(props: { mode: Mode; style: "inline" | "compact" }): Markup {
  const t = tone(props.mode);
  const compact = props.style === "compact";
  return (
    <div class="flex h-[377px] w-[370px] flex-col items-center" style={`background:${compact ? (props.mode === "dark" ? "rgb(44 44 46 / 0.9)" : "rgb(255 255 255 / 0.9)") : t.bg};border-radius:${compact ? 13 : 0}px;padding:0 16px;${compact ? "box-shadow:0 8px 40px rgb(0 0 0 / 0.2)" : ""}`}>
      <Calendar mode={props.mode} />
      <TimeRow mode={props.mode} />
    </div>
  );
}

const GRID_HUES = [0, 20, 40, 60, 90, 130, 170, 200, 230, 270, 300, 330];
export function ColorGrid(): Markup {
  // 10 columns of colour with 12 rows from light to dark, and a grey ramp as the first column.
  const cols = 10;
  const rows = 12;
  return (
    <div class="grid h-[296px] w-[354px] overflow-hidden rounded-[10px]" style={`grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr)`}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const color = c === 0 ? `hsl(0 0% ${100 - (r / (rows - 1)) * 100}%)` : `hsl(${GRID_HUES[(c - 1) * 1 + (r % 2 === 0 ? 0 : 0)] ?? c * 36} ${70 + (r < 6 ? 30 : 0)}% ${90 - r * 6.5}%)`;
        return <span style={`background:${color}`} />;
      })}
    </div>
  );
}

export function ColorPickerSheet(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <div class="relative h-[599px] w-[386px] overflow-hidden rounded-[30px] px-4 pt-1" style={`background:${props.mode === "dark" ? "#1c1c1e" : "#f2f2f7"};color:${t.label};box-shadow:0 8px 48px rgb(0 0 0 / 0.25)`}>
      <div class="flex h-[49px] items-center justify-between">
        <span style={`${textCss("headline", { emphasized: true })}`}>Colors</span>
        <span class="grid size-7 place-items-center rounded-full" style={`background:${t.fill3}`}><Icon name="xmark" size={14} weight={3} /></span>
      </div>
      <div class="pb-3"><SegmentedControl mode={props.mode} options={["Grid", "Spectrum", "Sliders"]} selected={0} width={354} /></div>
      <ColorGrid />
      <div class="flex flex-col gap-1 pt-[15px]" style={`border-top:1px solid ${props.mode === "dark" ? "#38383a" : "#c6c6c8"};margin-top:0`}>
        <span style={`${textCss("footnote")};color:${t.label2}`}>OPACITY</span>
        <Slider mode={props.mode} value={100} width={354} />
      </div>
      <div class="flex items-center gap-[30px] pt-5">
        {[t.red, t.orange, t.yellow, t.green, t.blue, t.purple].map((color) => <span class="size-8 rounded-full" style={`background:${color}`} />)}
      </div>
    </div>
  );
}
