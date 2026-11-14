import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon, type IconName } from "./icon.tsx";
import { GlassControl } from "./liquid-glass.tsx";
import { textCss } from "./text.tsx";

// System chrome shared by the iPhone mock-ups. Numbers from figma/reference/ios27/specs/02-bars:
//   Status bar: 402 x 62; Dynamic Island 125 x 37 at x 138, y 14; time 17 pt weight 590 in the left
//   138 pt, signal, Wi-Fi and battery in the right 138 pt.
//   Toolbar top: 402 x 54, 16 pt side padding, 44 pt glass buttons. Large Title style is 125 tall.
//   Toolbar bottom: 402 x 84, 28 pt side padding, 48 pt glass buttons.
//   Toolbar button: Symbol 44 x 44. Text and Prominent 73 x 44 for "Label"; button group 160 x 44.

function ink(mode: Mode): string {
  return mode === "dark" ? "#f5f5f5" : "#262626";
}

export function Battery(props: { color: string }): Markup {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="22" height="12" rx="3.8" stroke={props.color} stroke-opacity="0.4" />
      <rect x="2" y="2" width="19" height="9" rx="2.5" fill={props.color} />
      <path d="M24 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill={props.color} fill-opacity="0.5" />
    </svg>
  );
}

export function Signal(props: { color: string }): Markup {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill={props.color} aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}

export function Wifi(props: { color: string }): Markup {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke={props.color} stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
      <path d="M1.2 4.2a10 10 0 0 1 14.6 0M3.7 6.9a6.4 6.4 0 0 1 9.6 0" />
      <circle cx="8.5" cy="10" r="1.2" fill={props.color} stroke="none" />
    </svg>
  );
}

export function StatusBar(props: { mode: Mode; island?: boolean; time?: string; model?: "17-pro" | "18-pro" }): Markup {
  const color = props.mode === "dark" ? "#fff" : "#000";
  const wide = props.model !== "18-pro"; // iPhone 17 Pro: island 125 wide, halves 138; iPhone 18: island 95, halves 145.5 with 8 pt margins
  const half = wide ? 138 : 145.5;
  const margin = wide ? 0 : 8;
  const island = wide ? 125 : 95;
  return (
    <div class="relative h-[62px] w-[402px]" style={`color:${color}`}>
      <div class="absolute top-[26px] flex h-[13px] items-center justify-center" style={`left:${margin}px;width:${half}px;font-size:17px;font-weight:590`}>
        <span style="line-height:20px">{props.time ?? "9:41"}</span>
      </div>
      {(props.island ?? true) && <div class="absolute top-3.5 h-[37px] rounded-full bg-black" style={`left:${(402 - island) / 2}px;width:${island}px`} />}
      <div class="absolute top-[25px] flex h-[15px] items-center justify-center gap-2" style={`right:${margin}px;width:${half}px`}>
        <Signal color={color} />
        <Wifi color={color} />
        <Battery color={color} />
      </div>
    </div>
  );
}

export function HomeIndicator(props: { mode: Mode }): Markup {
  return (
    <div class="grid h-[34px] w-[402px] place-items-end">
      <div class="mb-2 h-[5px] w-[144px] rounded-full" style={`background:${props.mode === "dark" ? "#fff" : "#000"}`} />
    </div>
  );
}

/// A round (44) or capsule glass button for bars.
export function ToolbarButton(props: {
  mode: Mode;
  symbol?: IconName;
  label?: string;
  prominent?: boolean;
  size?: 44 | 48;
  disabled?: boolean;
  destructive?: boolean;
}): Markup {
  const t = tone(props.mode);
  const size = props.size ?? 44;
  const width = props.label ? (props.size === 48 ? 81 : 73) : size;
  const color = props.prominent ? "#fff" : props.destructive ? t.red : ink(props.mode);
  const tint = props.prominent ? (props.destructive ? t.red : t.blue) : undefined;
  return (
    <div style={`opacity:${props.disabled ? 0.4 : 1}`}>
      <GlassControl mode={props.mode} width={width} height={size} tint={tint}>
        <div class="grid size-full place-items-center" style={`color:${color};${props.label ? textCss("body", { weight: 510 }) : ""}`}>
          {props.label ?? <Icon name={props.symbol ?? "ellipsis"} size={size === 48 ? 24 : 22} />}
        </div>
      </GlassControl>
    </div>
  );
}

export function ButtonGroup(props: { mode: Mode; symbols: IconName[]; size?: 44 | 48 }): Markup {
  const size = props.size ?? 44;
  const width = props.symbols.length * 40 + (props.symbols.length - 1) * 0 + 12 + (props.symbols.length > 2 ? 0 : 0);
  return (
    <GlassControl mode={props.mode} width={width} height={size}>
      <div class="flex h-full items-center justify-around px-1.5" style={`color:${ink(props.mode)}`}>
        {props.symbols.map((symbol) => <Icon name={symbol} size={size === 48 ? 24 : 22} />)}
      </div>
    </GlassControl>
  );
}

export function SearchCapsule(props: { mode: Mode; state: "placeholder" | "typing" | "value"; width?: number; size?: 44 | 48 }): Markup {
  const t = tone(props.mode);
  const size = props.size ?? 44;
  const text = props.state === "placeholder" ? "Search" : "Mountains";
  return (
    <GlassControl mode={props.mode} width={props.width ?? 190} height={size}>
      <div class="flex h-full items-center gap-1 pl-[11px] pr-2.5" style={`color:${ink(props.mode)}`}>
        <Icon name="search" size={19} />
        <span class="flex-1 truncate pl-1.5" style={`${textCss("body", { weight: 510 })};color:${props.state === "placeholder" ? t.label2 : ink(props.mode)}`}>{text}</span>
        {props.state === "typing" && <span class="mr-1 h-5 w-0.5" style={`background:${t.blue}`} />}
        <span style="color:#8a8a8a"><Icon name="mic" size={18} /></span>
      </div>
    </GlassControl>
  );
}

/// An iPhone screen 402 wide with the system background. `children` fills below the status bar.
export function Screen(props: { mode: Mode; height: number; island?: boolean; grouped?: boolean; radius?: number; children?: Child }): Markup {
  const t = tone(props.mode);
  return (
    <div class="relative overflow-hidden" style={`width:402px;height:${props.height}px;border-radius:${props.radius ?? 48}px;background:${props.grouped ? t.grouped : t.bg};color:${t.label}${props.mode === "light" ? ";box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 0.12)" : ""}`}>
      {props.children}
      <div class="absolute left-0 top-0"><StatusBar mode={props.mode} island={props.island} /></div>
    </div>
  );
}

/// Page dots in a glass capsule: 8 pt dots 8 apart, 24 / 20 padding; the selected dot is solid.
export function PageDots(props: { mode: Mode; count: number; selected: number; height?: number }): Markup {
  const t = tone(props.mode);
  const width = props.count * 8 + (props.count - 1) * 8 + 40;
  return (
    <GlassControl mode={props.mode} width={width} height={props.height ?? 48}>
      <div class="flex size-full items-center justify-center gap-2">
        {Array.from({ length: props.count }, (_, i) => (
          <span class="size-2 rounded-full" style={`background:${i === props.selected ? ink(props.mode) : t.label3}`} />
        ))}
      </div>
    </GlassControl>
  );
}

/// Placeholder scrolling content to put bars on: rows with a coloured dot and two bars.
export function ContentRows(props: { mode: Mode; rows: number; top?: number }): Markup {
  const t = tone(props.mode);
  const dots = [t.red, t.orange, t.green, t.blue, t.purple];
  return (
    <div class="absolute inset-x-0 flex flex-col gap-4 px-5" style={`top:${props.top ?? 0}px`}>
      {Array.from({ length: props.rows }, (_, i) => (
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl" style={`background:${dots[i % dots.length]}`} />
          <div class="flex flex-col gap-2">
            <div class="h-2.5 w-44 rounded-full" style={`background:${t.fill}`} />
            <div class="h-2.5 w-28 rounded-full" style={`background:${t.fill2}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
