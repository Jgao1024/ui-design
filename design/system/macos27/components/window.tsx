import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { TrafficLights } from "./traffic-lights.tsx";
import { Icon } from "./icons.tsx";
import { ToolbarButton, ToolbarGroup, ToolbarSearch } from "./toolbar.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Window shell from Windows__Window-BG.json (radius 16, shadow 0 18 54 when active, 0 7 21 when inactive)
// and Windows__Windows---Composed.json (title bar 30, unified toolbar 52, compact toolbar 40,
// expanded: title bar 31 + toolbar 44, sidebar 240).
export type WindowType = "default" | "unified" | "compact" | "expanded";

const SIDEBAR_BG = {
  light: "rgb(218 230 242 / 0.92)",
  dark: "rgb(40 42 48 / 0.92)",
} as const;

/// Window title: optional symbol, title text. Titles are 13 pt semibold.
export function WindowTitle(props: { mode: Mode; title: string; symbol?: boolean; active?: boolean }): Markup {
  const color = props.active === false ? UI[props.mode].tertiary : UI[props.mode].label;
  return (
    <div class="flex items-center gap-1.5" style={`color:${color}`}>
      {props.symbol ? <Icon name="doc" size={15} /> : null}
      <span class="text-[13px] leading-4 font-semibold">{props.title}</span>
    </div>
  );
}

function Toolbar(props: { mode: Mode; active: boolean; type: WindowType; title: string | null; sidebar: boolean; inlineLights: boolean }): Markup {
  const { mode, active, type } = props;
  const size = type === "compact" ? "medium" : "xl";
  const common = { mode, size, disabled: !active } as const;
  const title = props.title === null ? null : <WindowTitle mode={mode} title={props.title} active={active} />;
  const left = props.sidebar ? null : (
    <ToolbarGroup {...common} icons={["square.dashed", "square.dashed", "square.dashed", "square.dashed"]} selected={2} />
  );
  const right = (
    <div class="flex items-center gap-2">
      <ToolbarGroup {...common} icons={["square.dashed", "square.dashed", "square.dashed"]} />
      <ToolbarButton {...common} />
      <ToolbarSearch {...common} width={size === "medium" ? 110 : 130} />
    </div>
  );
  return (
    <div class="flex size-full items-center justify-between pr-3" style={`padding-left:${props.inlineLights ? 84 : 12}px`}>
      <div class="flex items-center gap-3">{left}{title}</div>
      {right}
    </div>
  );
}

export function Window(props: {
  mode: Mode;
  active?: boolean;
  width: number;
  height: number;
  type?: WindowType;
  /// Title text, or null for a window without title.
  title?: string | null;
  /// Show the 240 px sidebar pane. Its content is `sidebar`.
  sidebar?: Child | boolean;
  children?: Child;
}): Markup {
  const active = props.active ?? true;
  const type = props.type ?? "default";
  const title = props.title === undefined ? "Title" : props.title;
  const palette = UI[props.mode];
  const hasSidebar = Boolean(props.sidebar);
  const lights = <TrafficLights mode={props.mode} active={active} />;
  const sidebarWidth = 240;
  // Toolbar height by window type; the title bar of the default and expanded types is above it.
  const bar = { default: 30, unified: 52, compact: 40, expanded: 31 }[type];
  const toolbar = type === "expanded" ? 44 : 0;
  const lightsLeft = type === "compact" ? 14 : 18;
  return (
    <div
      class="relative overflow-hidden"
      style={`width:${props.width}px;height:${props.height}px;border-radius:16px;background:${palette.window};box-shadow:${
        active ? palette.shadow : palette.shadowInactive
      }`}
    >
      {hasSidebar
        ? (
          <div
            class="absolute inset-y-0 left-0"
            style={`width:${sidebarWidth}px;background:${SIDEBAR_BG[props.mode]};backdrop-filter:blur(40px) saturate(1.4)`}
          >
            {typeof props.sidebar === "boolean" ? null : props.sidebar}
          </div>
        )
        : null}
      <div class="absolute inset-y-0 right-0" style={`left:${hasSidebar ? sidebarWidth : 0}px`}>
        <div class="relative" style={`height:${bar}px`}>
          {type === "default" || type === "expanded"
            ? (
              <div class="flex size-full items-center justify-center">
                {title === null ? null : <WindowTitle mode={props.mode} title={title} active={active} />}
              </div>
            )
            : <Toolbar mode={props.mode} active={active} type={type} title={title} sidebar={hasSidebar} inlineLights={!hasSidebar} />}
        </div>
        {toolbar
          ? (
            <div style={`height:${toolbar}px`}>
              <Toolbar mode={props.mode} active={active} type={type} title={null} sidebar={hasSidebar} inlineLights={false} />
            </div>
          )
          : null}
        <div class="absolute inset-x-0 bottom-0" style={`top:${bar + toolbar}px`}>
          <div class="h-px w-full" style={`background:${palette.separator}`} />
          {props.children}
        </div>
      </div>
      <div class="absolute" style={`top:${type === "compact" ? 13 : type === "unified" ? 19 : 8}px;left:${lightsLeft}px`}>
        {lights}
      </div>
    </div>
  );
}
