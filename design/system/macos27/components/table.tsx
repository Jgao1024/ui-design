import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Icon } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Lists and tables from figma/reference/macos27/specs/05-collections/Lists-and-Tables__*.json.
//   row            20 px high; a selection or alternating background is inset 10 px each side, radius 8
//   selected       active #0165E2 with white text; inactive black 14% with the normal text
//   alternating    black 5%
//   text           13 pt Medium; the first column black 85%, the others black 50%, 8 px in
//   first column   chevron 9 px wide at 16 px (+15 px per outline level), an 18 px icon, then the label
//   column header  28 px high; labels 11 pt: Medium black 50%, the sorted column Bold black 85% with a 9 pt sort
//                  chevron; every column but the first has a black 10% rule on its left edge
//   group title    45 px high, 11 pt Semibold black 50%, 50 px in
// Dark values are inferred: white in place of black; the selected blue is the same.
export const SELECTED_ACTIVE = "#0165e2";
export type RowKind = "default" | "alternating" | "selected" | "inactive";

const base = (mode: Mode) => (mode === "light" ? "0 0 0" : "255 255 255");

export function TableRow(props: {
  mode: Mode;
  kind?: RowKind;
  /// Column widths; the first holds the icon and label.
  columns: number[];
  labels?: string[];
  level?: number;
  /// "open", "closed" or none.
  disclosure?: "open" | "closed";
  icon?: boolean;
}): Markup {
  const kind = props.kind ?? "default";
  const ui = UI[props.mode];
  const total = props.columns.reduce((sum, width) => sum + width, 0);
  const selected = kind === "selected";
  const background = selected
    ? SELECTED_ACTIVE
    : kind === "inactive"
    ? `rgb(${base(props.mode)} / 0.14)`
    : kind === "alternating"
    ? `rgb(${base(props.mode)} / 0.05)`
    : "transparent";
  const first = selected ? "#ffffff" : ui.label;
  const rest = selected ? "#ffffff" : ui.secondary;
  const level = props.level ?? 0;
  return (
    <div class="relative flex h-5 text-[13px] leading-5 font-medium" style={`width:${total}px`}>
      <span class="absolute inset-y-0 rounded-[8px]" style={`left:10px;right:10px;background:${background}`} />
      <div class="relative flex items-center" style={`width:${props.columns[0]}px;color:${first};padding-left:${16 + level * 15}px`}>
        <span class="flex w-[9px] justify-center">
          {props.disclosure
            ? <Icon name={props.disclosure === "open" ? "chevron.down" : "chevron.right"} size={9} weight={2.2} />
            : null}
        </span>
        {props.icon === false ? null : (
          <span class="mx-1 ml-[4px] flex size-[18px] items-center justify-center" style={selected ? "" : `color:${ui.accent}`}>
            <Icon name="folder" size={14} weight={1.2} />
          </span>
        )}
        <span class="ml-1">{props.labels?.[0] ?? "Label"}</span>
      </div>
      {props.columns.slice(1).map((width, index) => (
        <div class="relative pl-2" style={`width:${width}px;color:${rest}`}>{props.labels?.[index + 1] ?? "Label"}</div>
      ))}
    </div>
  );
}

export function ColumnHeader(props: {
  mode: Mode;
  columns: number[];
  /// Index of the sorted column, if any.
  sorted?: number;
  order?: "ascending" | "descending";
}): Markup {
  const ui = UI[props.mode];
  return (
    <div class="flex h-7 items-center" style={`width:${props.columns.reduce((sum, width) => sum + width, 0)}px`}>
      {props.columns.map((width, index) => {
        const sorted = props.sorted === index;
        return (
          <div
            class="flex h-[19px] items-center text-[11px] leading-[19px]"
            style={`width:${width}px;padding-left:${index === 0 ? 50 : 8}px;color:${sorted ? ui.label : ui.secondary};font-weight:${sorted ? 700 : 500};${
              index > 0 ? `box-shadow:inset 1px 0 0 rgb(${base(props.mode)} / 0.1)` : ""
            }`}
          >
            Label
            {sorted
              ? (
                <span class="ml-1" style={`color:${ui.secondary}`}>
                  <Icon name={props.order === "descending" ? "chevron.down" : "chevron.up"} size={9} weight={2.2} />
                </span>
              )
              : null}
          </div>
        );
      })}
    </div>
  );
}

export function GroupTitle(props: { mode: Mode; width: number; title?: string }): Markup {
  return (
    <div class="flex h-[45px] items-end pb-[7px] pl-[50px] text-[11px] leading-[14px] font-semibold" style={`width:${props.width}px;color:${UI[props.mode].secondary}`}>
      {props.title ?? "Group Title"}
    </div>
  );
}

/// A table on the window colour with the given rows.
export function Table(props: { mode: Mode; width: number; children: Child }): Markup {
  return (
    <div class="overflow-hidden rounded-[5px] py-1" style={`width:${props.width}px;background:${UI[props.mode].window};box-shadow:inset 0 0 0 1px ${UI[props.mode].separator}`}>
      {props.children}
    </div>
  );
}
