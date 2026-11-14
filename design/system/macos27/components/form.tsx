import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Forms from figma/reference/macos27/specs/04-input/Forms__*.json: a 400 px wide group, radius 12, black 3%,
// 10 px side padding; rows are 42 px high with a black 5% separator and 16 px between leading and trailing
// parts. Title is 13 pt, subtitle 11 pt (black 50%), the trailing label black 50%.
export function Form(props: { mode: Mode; rows: Child[] }): Markup {
  const ui = UI[props.mode];
  const base = props.mode === "light" ? "0 0 0" : "255 255 255";
  return (
    <div class="rounded-xl px-[10px]" style={`width:400px;background:rgb(${base} / 0.03);color:${ui.label}`}>
      {props.rows.map((row, index) => (
        <div
          class="flex h-[42px] items-center justify-between gap-4"
          style={index < props.rows.length - 1 ? `box-shadow:inset 0 -1px 0 rgb(${base} / 0.05)` : ""}
        >
          {row}
        </div>
      ))}
    </div>
  );
}

export function Title(props: { mode: Mode; title?: string; subtitle?: boolean }): Markup {
  return (
    <div>
      <p class="text-[13px] leading-4 font-medium">{props.title ?? "Title"}</p>
      {props.subtitle ? <p class="text-[11px] leading-[14px] font-medium" style={`color:${UI[props.mode].secondary}`}>Subtitle</p> : null}
    </div>
  );
}

export function Mute(props: { mode: Mode; children: Child }): Markup {
  return <span class="flex items-center gap-2 text-[13px] leading-4 font-medium" style={`color:${UI[props.mode].secondary}`}>{props.children}</span>;
}

