import type { Markup } from "@design/jsx/jsx-runtime";
import { Glass } from "./glass.tsx";
import { Icon } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Menus from figma/reference/macos27/specs/06-overlays/Menus__*.json.
//   menu        244 wide, radius 12, 12 px side and 5 px top and bottom padding, a Liquid Glass panel
//   item        24 px high, 13 pt Medium, label #1A1A1A; a checkmark (10 pt Bold) sits at 6 px and the label
//               starts at 24 px when the menu has a selection, otherwise at 0 px; shortcuts are right aligned
//   hover       fill #E6E6E6, radius 8, 7 px wider than the item on each side
//   hover + key fill #0069F9, white text and shortcuts
//   disabled    label and shortcuts #BFBFBF
//   header      25 px, 13 pt Bold #727272, 20 px in when inset
//   separator   11 px with a 1 px #E6E6E6 line
// Figma's Dark menu items still carry the Light colours; the Dark item colours and the Dark hover fill are
// inferred. The page stretches the 160 px item of Figma to the 220 px row of the menu.
export type MenuState = "idle" | "hover" | "key" | "disabled";
export type MenuEntry =
  | { kind: "item"; label?: string; shortcut?: string; state?: MenuState; checked?: boolean; submenu?: boolean; selection?: boolean; symbol?: boolean }
  | { kind: "separator" }
  | { kind: "header"; title?: string; inset?: boolean };

const HEIGHT = { item: 24, separator: 11, header: 25 } as const;

export function menuHeight(entries: MenuEntry[]): number {
  return 10 + entries.reduce((sum, entry) => sum + HEIGHT[entry.kind], 0);
}

function colors(mode: Mode, state: MenuState) {
  const ui = UI[mode];
  const ink = mode === "light" ? "#1a1a1a" : "#f5f5f5";
  if (state === "key") return { label: "#ffffff", shortcut: "#ffffff", fill: "#0069f9" };
  if (state === "disabled") return { label: mode === "light" ? "#bfbfbf" : "#555555", shortcut: mode === "light" ? "#bfbfbf" : "#555555", fill: "transparent" };
  return {
    label: ink,
    shortcut: mode === "light" ? "#bfbfbf" : "rgb(255 255 255 / 0.5)",
    fill: state === "hover" ? (mode === "light" ? "#e6e6e6" : ui.fillStrong) : "transparent",
  };
}

export function MenuItem(props: Extract<MenuEntry, { kind: "item" }> & { mode: Mode }): Markup {
  const state = props.state ?? "idle";
  const look = colors(props.mode, state);
  return (
    <div class="relative flex h-6 items-center text-[13px] leading-6 font-medium" style={`color:${look.label}`}>
      <span class="absolute inset-y-0 rounded-[8px]" style={`left:-7px;right:-7px;background:${look.fill}`} />
      {props.selection || props.checked
        ? <span class="relative flex w-6 justify-center">{props.checked ? <Icon name="check" size={11} weight={2.4} /> : null}</span>
        : null}
      <span class="relative flex-1">{props.label ?? "Label"}</span>
      {props.submenu
        ? <span class="relative mr-1"><Icon name="chevron.right" size={11} weight={2.4} /></span>
        : props.shortcut
        ? <span class="relative" style={`color:${look.shortcut}`}>{props.shortcut}</span>
        : null}
    </div>
  );
}

export function Menu(props: { mode: Mode; entries: MenuEntry[]; width?: number }): Markup {
  const ui = UI[props.mode];
  const width = props.width ?? 244;
  return (
    <Glass width={width} height={menuHeight(props.entries)} radius={12} mode={props.mode} size="panel">
      <div class="size-full px-3 py-[5px]">
        {props.entries.map((entry) => {
          if (entry.kind === "separator") {
            return (
              <div class="flex h-[11px] items-center">
                <span class="h-px w-full" style={`background:${props.mode === "light" ? "#e6e6e6" : ui.separator}`} />
              </div>
            );
          }
          if (entry.kind === "header") {
            return (
              <div class="flex h-[25px] items-end pb-[1px] text-[13px] leading-4 font-bold" style={`color:#727272;padding-left:${entry.inset === false ? 0 : 20}px`}>
                {entry.title ?? "Header"}
              </div>
            );
          }
          return <MenuItem mode={props.mode} {...entry} />;
        })}
      </div>
    </Glass>
  );
}
