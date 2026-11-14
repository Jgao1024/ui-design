import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Icon } from "./icons.tsx";
import type { IconName } from "./icons.tsx";
import { TrafficLights } from "./traffic-lights.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Sidebar parts from figma/reference/macos27/specs/01-navigation/Sidebars__*.json.
// Row heights: Large 36, Medium 32, Small 24. Selection pill: radius 8. A level indents by 12 px.
// Section headers: 25 / 22 / 19 high, 18 / 17 / 15 more above when not the first section.
export type SidebarSize = "small" | "medium" | "large";
export type ItemState = "idle" | "selected" | "disabled";

export const SIDEBAR_BG = {
  light: { active: "rgb(218 230 242 / 0.92)", inactive: "rgb(237 244 250 / 0.97)" },
  dark: { active: "rgb(40 42 48 / 0.92)", inactive: "rgb(34 35 39 / 0.97)" },
} as const;
const SELECTION = {
  light: { active: "#f2f2f2", inactive: "#fbfbfb" },
  dark: { active: "#0d0d0d", inactive: "#070707" },
} as const;
const ROW = { large: 36, medium: 32, small: 24 } as const;
const TEXT = { large: 15, medium: 13, small: 12 } as const;
const GLYPH = { large: 18, medium: 16, small: 14 } as const;
const HEADER = { large: [25, 18, 13], medium: [22, 17, 12], small: [19, 15, 11] } as const;

export function Disclosure(props: { mode: Mode; expanded: boolean }): Markup {
  return (
    <span class="flex w-3 justify-center" style={`color:${UI[props.mode].tertiary}`}>
      <Icon name={props.expanded ? "chevron.down" : "chevron.right"} size={10} weight={1.8} />
    </span>
  );
}

/// An image-style leading icon: a rounded tile (Sidebars___Leading.json, Icon=Image).
export function ImageIcon(props: { size: number }): Markup {
  return (
    <span
      class="inline-block rounded-[4px]"
      style={`width:${props.size}px;height:${props.size}px;background:linear-gradient(135deg,#ffb36b,#ff5e8a 55%,#7a6bff)`}
    />
  );
}

export function SidebarItem(props: {
  mode: Mode;
  active?: boolean;
  size: SidebarSize;
  state?: ItemState;
  level?: number;
  width?: number;
  icon?: IconName | "image";
  label?: string;
  detail?: string;
  /// Show a disclosure triangle; true is expanded.
  disclosure?: boolean;
}): Markup {
  const active = props.active ?? true;
  const state = props.state ?? "idle";
  const palette = UI[props.mode];
  const height = ROW[props.size];
  const color = state === "disabled" ? palette.disabled : palette.label;
  const symbol = state === "disabled" ? palette.disabled : active ? palette.accent : palette.secondary;
  const fill = state === "selected" ? `background:${SELECTION[props.mode][active ? "active" : "inactive"]};` : "";
  return (
    <div
      class="flex items-center rounded-lg pr-2"
      style={`width:${props.width ?? 224}px;height:${height}px;padding-left:${6 + (props.level ?? 0) * 12}px;${fill}color:${color}`}
    >
      <span class="w-3 shrink-0">
        {props.disclosure === undefined ? null : <Disclosure mode={props.mode} expanded={props.disclosure} />}
      </span>
      <span class="mr-2 ml-1 flex shrink-0 justify-center" style={`width:${GLYPH[props.size] + 4}px;color:${symbol}`}>
        {props.icon === "image" ? <ImageIcon size={GLYPH[props.size] - 2} /> : <Icon name={props.icon ?? "folder"} size={GLYPH[props.size]} />}
      </span>
      <span class="flex-1 truncate font-medium" style={`font-size:${TEXT[props.size]}px;line-height:${TEXT[props.size] + 4}px`}>
        {props.label ?? "Label"}
      </span>
      {props.detail ? <span class="text-xs" style={`color:${state === "disabled" ? palette.disabled : palette.secondary}`}>{props.detail}</span> : null}
    </div>
  );
}

export function SectionHeader(props: {
  mode: Mode;
  size: SidebarSize;
  first?: boolean;
  active?: boolean;
  width?: number;
  title?: string;
  detail?: string;
  expanded?: boolean;
}): Markup {
  const [height, extra, text] = HEADER[props.size];
  const palette = UI[props.mode];
  const color = props.active === false ? palette.tertiary : palette.secondary;
  return (
    <div
      class="flex items-end justify-between pr-2 pl-[22px] font-semibold"
      style={`width:${props.width ?? 224}px;height:${height + (props.first === false ? extra : 0)}px;color:${color};font-size:${text}px;line-height:${height - 2}px`}
    >
      <span>{props.title ?? "Section Title"}</span>
      <span class="flex items-center gap-2 font-medium">
        {props.detail ? <span>{props.detail}</span> : null}
        <Icon name={props.expanded === false ? "chevron.right" : "chevron.down"} size={10} weight={1.8} />
      </span>
    </div>
  );
}

/// Sidebar pane: stoplights row (52 px) and items. `children` are the rows.
export function Sidebar(props: { mode: Mode; active?: boolean; width?: number; height: number; children: Child }): Markup {
  const active = props.active ?? true;
  return (
    <div
      class="relative overflow-hidden rounded-[16px]"
      style={`width:${props.width ?? 240}px;height:${props.height}px;background:${SIDEBAR_BG[props.mode][active ? "active" : "inactive"]};box-shadow:${
        active ? UI[props.mode].shadow : UI[props.mode].shadowInactive
      }`}
    >
      <div class="absolute" style={"top:19px;left:18px"}><TrafficLights mode={props.mode} active={active} /></div>
      <div class="absolute inset-x-2 top-[52px] bottom-0">{props.children}</div>
    </div>
  );
}

/// A flat tile in the sidebar colour of a mode, for showing rows outside a window.
export function SidebarTile(props: { mode: Mode; active?: boolean; width: number; height: number; children?: Child }): Markup {
  const colour = SIDEBAR_BG[props.mode][props.active === false ? "inactive" : "active"];
  return (
    <div
      class="flex flex-col justify-center rounded-[5px] px-3"
      style={`width:${props.width}px;height:${props.height}px;background:linear-gradient(${colour},${colour}),${UI[props.mode].window};box-shadow:inset 0 0 0 1px ${UI[props.mode].separator}`}
    >
      {props.children}
    </div>
  );
}
