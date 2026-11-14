import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Glass } from "./glass.tsx";
import { Icon } from "./icons.tsx";
import type { IconName } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Toolbar parts from figma/reference/macos27/specs/02-bars/Toolbars__*.json. Medium is 24 px high
// (compact toolbars), XL is 36 px high (unified and expanded toolbars). Each part is a Liquid Glass
// capsule. Symbols are #1A1A1A (Light) or #F5F5F5 (Dark); disabled symbols #BFBFBF or #404040.
export type ToolbarSize = "medium" | "xl";
const HEIGHT = { medium: 24, xl: 36 } as const;
const GLYPH = { medium: 14, xl: 18 } as const;
const INK = { light: "#1a1a1a", dark: "#f5f5f5" } as const;
const OFF = { light: "#bfbfbf", dark: "#404040" } as const;

type Common = { mode: Mode; size: ToolbarSize; disabled?: boolean };

function ink(props: Common): string {
  return props.disabled ? OFF[props.mode] : INK[props.mode];
}

/// A capsule of the given width holding `children`, centred.
export function Capsule(props: { mode: Mode; size: ToolbarSize; width: number; color: string; children: Child }): Markup {
  const height = HEIGHT[props.size];
  return (
    <Glass width={props.width} height={height} radius={1000} mode={props.mode} size="small">
      <div class="flex size-full items-center justify-center" style={`color:${props.color}`}>{props.children}</div>
    </Glass>
  );
}

export function ToolbarButton(props: Common & { icon?: IconName }): Markup {
  return (
    <Capsule mode={props.mode} size={props.size} width={HEIGHT[props.size]} color={ink(props)}>
      <Icon name={props.icon ?? "square.dashed"} size={GLYPH[props.size]} />
    </Capsule>
  );
}

// Toolbars___Separator.json: a 3 px wide cell holding a 1 px line, 16 px (Medium) or 20 px (XL) high.
const SEPARATOR = 3;
export function Separator(props: { mode: Mode; size: ToolbarSize }): Markup {
  const color = props.mode === "light" ? "#d9d9d9" : "#262626";
  return (
    <div class="flex items-center justify-center" style={`width:${SEPARATOR}px`}>
      <span style={`width:1px;height:${props.size === "medium" ? 16 : 20}px;background:${color}`} />
    </div>
  );
}

/// One segment of a group: a pill, filled when selected.
function Segment(props: Common & { icon: IconName; selected?: boolean }): Markup {
  const height = props.size === "medium" ? 20 : 28;
  const width = props.size === "medium" ? 24 : 32;
  const fill = props.selected ? `background:${UI[props.mode].selected};` : "";
  return (
    <div
      class="flex items-center justify-center rounded-full"
      style={`width:${width}px;height:${height}px;${fill}color:${ink(props)}`}
    >
      <Icon name={props.icon} size={props.size === "medium" ? 13 : 17} />
    </div>
  );
}

/// Several buttons in one capsule. `selected` is the index of the selected button.
export function ToolbarGroup(props: Common & { icons: IconName[]; selected?: number; separated?: boolean }): Markup {
  const pad = props.size === "medium" ? 2 : 4;
  const segment = props.size === "medium" ? 24 : 32;
  const dividers = props.separated ? props.icons.length - 1 : 0;
  const width = pad * 2 + segment * props.icons.length + SEPARATOR * dividers;
  return (
    <Glass width={width} height={HEIGHT[props.size]} radius={1000} mode={props.mode} size="small">
      <div class="flex size-full items-center" style={`padding:0 ${pad}px`}>
        {props.icons.map((icon, index) => (
          <>
            {props.separated && index > 0 ? <Separator mode={props.mode} size={props.size} /> : null}
            <Segment mode={props.mode} size={props.size} disabled={props.disabled} icon={icon} selected={props.selected === index} />
          </>
        ))}
      </div>
    </Glass>
  );
}

// "Label" is 35 px wide in Figma (7 px per letter).
const TEXT = 7;
/// Pop-up button: a label and the up-down chevron.
export function ToolbarPopUp(props: Common & { label: string }): Markup {
  const pad = props.size === "medium" ? 6 : 8;
  const indicator = props.size === "medium" ? 8 : 10;
  const width = pad * 2 + props.label.length * TEXT + 2 + indicator;
  return (
    <Capsule mode={props.mode} size={props.size} width={width} color={ink(props)}>
      <div class="flex items-center gap-0.5">
        <span class="text-[13px] leading-[22px] font-medium">{props.label}</span>
        <Icon name="chevron.up.chevron.down" size={props.size === "medium" ? 8 : 10} weight={1.8} />
      </div>
    </Capsule>
  );
}

/// Pull-down button: a symbol and a chevron.
export function ToolbarPullDown(props: Common & { icon?: IconName }): Markup {
  const width = props.size === "medium" ? 39 : 50;
  return (
    <Capsule mode={props.mode} size={props.size} width={width} color={ink(props)}>
      <div class="flex items-center gap-1">
        <Icon name={props.icon ?? "square.dashed"} size={GLYPH[props.size] - 1} />
        <Icon name="chevron.down" size={props.size === "medium" ? 8 : 10} weight={1.8} />
      </div>
    </Capsule>
  );
}

export type SearchState = "placeholder" | "value" | "typing" | "focused";
/// Search capsule. Placeholder and value text are the Figma defaults ("Search", "Value").
export function ToolbarSearch(props: Common & { state?: SearchState; width?: number }): Markup {
  const state = props.state ?? "placeholder";
  const width = props.width ?? 130;
  const muted = props.disabled ? OFF[props.mode] : state === "placeholder" ? UI[props.mode].secondary : INK[props.mode];
  const text = state === "placeholder" ? "Search" : state === "value" ? "Value" : state === "typing" ? "Typing" : "";
  const ring = state === "focused" || state === "typing" ? `box-shadow:0 0 0 3px ${UI[props.mode].accent}66` : "";
  return (
    <div class="rounded-full" style={ring}>
      <Glass width={width} height={HEIGHT[props.size]} radius={1000} mode={props.mode} size="small">
        <div class="flex size-full items-center gap-1.5 px-2" style={`color:${muted}`}>
          <Icon name="magnifyingglass" size={13} />
          <span class="text-[13px] leading-4 font-medium">{text}</span>
          {state === "typing" || state === "focused"
            ? <span class="h-[14px] w-px" style={`background:${UI[props.mode].accent}`} />
            : null}
        </div>
      </Glass>
    </div>
  );
}

/// Segmented control inside a toolbar: icons in a capsule, one selected.
export function ToolbarSegmented(props: Common & { labels: string[]; selected?: number; width?: number }): Markup {
  const pad = props.size === "medium" ? 2 : 4;
  // Figma's default Segmented Control is 121 px (Medium) or 145 px (XL) wide.
  const width = props.width ?? (props.size === "medium" ? 121 : 145);
  const cell = (width - pad * 2) / props.labels.length;
  const height = props.size === "medium" ? 20 : 28;
  return (
    <Glass width={width} height={HEIGHT[props.size]} radius={1000} mode={props.mode} size="small">
      <div class="flex size-full items-center" style={`padding:0 ${pad}px`}>
        {props.labels.map((label, index) => (
          <div
            class="flex items-center justify-center rounded-full text-[13px] leading-4 font-medium"
            style={`width:${cell}px;height:${height}px;color:${ink(props)};${
              props.selected === index ? `background:${UI[props.mode].selected}` : ""
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </Glass>
  );
}
