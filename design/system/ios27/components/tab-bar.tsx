import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon, type IconName } from "./icon.tsx";
import { GlassControl } from "./liquid-glass.tsx";

// Tab bars, figma/reference/ios27/specs/01-navigation/Tab-Bars__*.json.
//   iPhone, expanded: bar 62 tall, tab 54 tall (symbol box 56 x 28, label 10/12 weight 590), the
//   selection capsule is 4 wider than the tab. Default fills 360 of the 402 screen; Search Role and
//   Prominent Tab shorten the bar (4 and 5 tabs: 290) and add a 54 pt search circle 12 pt away.
//   iPhone, minimized: bar 40 tall, symbols only, search circle 40.
//   iPad: a 44 tall top bar, tabs 36 tall with 15/20 weight 510 labels, sidebar and search buttons 54 x 36.
//   Selection fill: #EDEDED Light, #121212 Dark. Unselected: #1A1A1A / #F5F5F5.

export const TAB_SYMBOLS: IconName[] = ["diamond", "circle-fill", "triangle-fill", "seal-fill", "square-fill"];
export type TabKind = "default" | "search" | "prominent";

const FRAME_WIDTH: Record<number, number> = { 2: 120, 3: 236, 4: 282, 5: 282 };

function Tab(props: { mode: Mode; index: number; selected: boolean; width: number; height: number; label: boolean; prominent: boolean }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const color = props.selected ? (props.prominent ? "#fff" : t.blue) : dark ? "#f5f5f5" : "#1a1a1a";
  const selection = props.prominent ? t.blue : dark ? "#121212" : "#ededed";
  return (
    <div class="relative flex flex-col items-center justify-center" style={`width:${props.width}px;height:${props.height}px;color:${color}`}>
      {props.selected && <div class="absolute rounded-full" style={`left:-2px;right:-2px;top:0;bottom:0;background:${selection}`} />}
      <div class="relative flex h-7 items-center justify-center"><Icon name={TAB_SYMBOLS[props.index]} size={props.label ? 24 : 22} /></div>
      {props.label && <span class="relative" style="font-size:10px;line-height:12px;font-weight:590">Tab {props.index + 1}</span>}
    </div>
  );
}

/// An iPhone tab bar on a 402 pt wide screen strip. The caller supplies the backdrop.
export function TabBarPhone(props: {
  mode: Mode;
  tabs: 2 | 3 | 4 | 5;
  kind?: TabKind;
  minimized?: boolean;
  selected?: number;
}): Markup {
  const kind = props.kind ?? "default";
  const min = props.minimized ?? false;
  const n = props.tabs;
  const barHeight = min ? 40 : 62;
  const side = min ? 32 : 21;
  const frame = kind === "default" ? (min ? 338 : 352) : min ? 298 : FRAME_WIDTH[n];
  const barWidth = kind === "default" ? frame + (min ? 0 : 8) : frame + (min ? 0 : 8);
  const tabWidth = (frame + (min ? 5.5 : 8) * (n - 1)) / n;
  const searchSize = min ? 40 : 54;
  return (
    <div class="absolute bottom-6 flex items-center" style={`left:${side}px;gap:${min ? 8 : 12}px`}>
      <GlassControl mode={props.mode} width={barWidth} height={barHeight}>
        <div class="flex h-full items-center" style={`padding:0 ${min ? 0 : 4}px`}>
          {Array.from({ length: n }, (_, index) => (
            <div style={`margin-left:${index === 0 ? 0 : min ? -5.5 : -8}px`}><Tab
              mode={props.mode}
              index={index}
              selected={index === (props.selected ?? 0)}
              width={tabWidth}
              height={min ? 40 : 54}
              label={!min}
              prominent={kind === "prominent" && index === (props.selected ?? 0)}
            /></div>
          ))}
        </div>
      </GlassControl>
      {kind !== "default" && (
        <GlassControl mode={props.mode} width={searchSize} height={searchSize}>
          <div class="grid size-full place-items-center" style={`color:${props.mode === "dark" ? "#f5f5f5" : "#1a1a1a"}`}>
            <Icon name="search" size={min ? 20 : 24} />
          </div>
        </GlassControl>
      )}
    </div>
  );
}

/// iPad top tab bar: optional sidebar button, tabs with text labels, optional search button.
export function TabBarPad(props: { mode: Mode; sidebar?: boolean; search?: boolean; tabs?: number; selected?: number }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const ink = dark ? "#f5f5f5" : "#1a1a1a";
  const n = props.tabs ?? 5;
  const widths = [74, 75, 75, 76, 75];
  const width = (props.sidebar ? 54 : 0) + widths.slice(0, n).reduce((a, b) => a + b, 0) + (props.search ? 54 : 0) + 8;
  return (
    <GlassControl mode={props.mode} width={width} height={44}>
      <div class="flex h-full items-center px-1" style={`color:${ink}`}>
        {props.sidebar && <div class="grid h-9 w-[54px] place-items-center"><Icon name="sidebar" size={22} /></div>}
        {Array.from({ length: n }, (_, index) => {
          const selected = index === (props.selected ?? 0);
          return (
            <div
              class="grid h-9 place-items-center rounded-full"
              style={`width:${widths[index]}px;font-size:15px;line-height:20px;font-weight:510;letter-spacing:-0.23px;${selected ? `background:${dark ? "#121212" : "#ededed"};color:${t.blue}` : ""}`}
            >
              Tab {index + 1}
            </div>
          );
        })}
        {props.search && <div class="grid h-9 w-[54px] place-items-center"><Icon name="search" size={20} /></div>}
      </div>
    </GlassControl>
  );
}

/// iPhone Duo: the tab bar stands upright, 48 pt wide, beside the fold.
export function TabBarDuo(props: { mode: Mode; tabs: 2 | 3 | 4 | 5; search?: boolean; selected?: number }): Markup {
  const dark = props.mode === "dark";
  const t = tone(props.mode);
  const n = props.tabs;
  return (
    <div class="flex flex-col items-center gap-3">
      <GlassControl mode={props.mode} width={48} height={48 * n - 7.333 * (n - 1) + 4}>
        <div class="flex h-full flex-col items-center py-0.5" style={`color:${dark ? "#f5f5f5" : "#1a1a1a"}`}>
          {Array.from({ length: n }, (_, index) => {
            const selected = index === (props.selected ?? 0);
            return (
              <div class="relative grid h-12 w-12 place-items-center" style={`margin-top:${index === 0 ? 0 : -7.333}px;${selected ? `color:${t.blue}` : ""}`}>
                {selected && <div class="absolute rounded-full" style={`inset:0 2px;background:${dark ? "#121212" : "#ededed"}`} />}
                <span class="relative"><Icon name={TAB_SYMBOLS[index]} size={22} /></span>
              </div>
            );
          })}
        </div>
      </GlassControl>
      {props.search && (
        <GlassControl mode={props.mode} width={48} height={48}>
          <div class="grid size-full place-items-center" style={`color:${dark ? "#f5f5f5" : "#1a1a1a"}`}><Icon name="search" size={22} /></div>
        </GlassControl>
      )}
    </div>
  );
}
