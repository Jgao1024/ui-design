import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Icon } from "./icons.tsx";
import type { Mode } from "../theme.ts";

// Menu bar parts from figma/reference/macos27/specs/02-bars/Menu-Bar-and-Dock___Menu-Bar-*.json and
// Menu-Bar-and-Dock__Menu-Bar.json. The bar is 45 px high (notch Macs); parts are 24 px high and
// start 10 px from the top and sides. Text is #000000 85% (Light) or #FFFFFF (Dark), 13 pt.
// A selected part gets a pill 8 px wider and 1 px taller than the part: black or white 8%, blur 60.
const INK: Record<Mode, string> = { light: "rgb(0 0 0 / 0.85)", dark: "#ffffff" };
const PILL: Record<Mode, string> = { light: "rgb(0 0 0 / 0.08)", dark: "rgb(255 255 255 / 0.08)" };

/// A menu bar part of a fixed width, centred content, with the selection pill when `selected`.
function Part(props: { mode: Mode; width: number; height?: number; selected?: boolean; children: Child }): Markup {
  return (
    <div class="relative flex items-center justify-center" style={`width:${props.width}px;height:${props.height ?? 24}px;color:${INK[props.mode]}`}>
      {props.selected
        ? (
          <span
            class="absolute rounded-full"
            style={`inset:-0.5px -4px;background:${PILL[props.mode]};backdrop-filter:blur(30px)`}
          />
        )
        : null}
      <span class="relative flex items-center">{props.children}</span>
    </div>
  );
}

export function AppleMenu(props: { mode: Mode; selected?: boolean }): Markup {
  return <Part mode={props.mode} width={33} selected={props.selected}><Icon name="apple" size={17} /></Part>;
}

/// The bold app name. Figma: SF Pro Heavy 13 pt, text "App Name".
export function AppName(props: { mode: Mode; selected?: boolean; label?: string }): Markup {
  return (
    <Part mode={props.mode} width={90} selected={props.selected}>
      <span class="text-[13px] leading-4" style="font-weight:860">{props.label ?? "App Name"}</span>
    </Part>
  );
}

/// A menu title. Figma: SF Pro Semibold 13 pt, text "Item".
export function MenuItem(props: { mode: Mode; selected?: boolean; label?: string }): Markup {
  return (
    <Part mode={props.mode} width={47} selected={props.selected}>
      <span class="text-[13px] leading-4 font-semibold">{props.label ?? "Item"}</span>
    </Part>
  );
}

/// The full bar: Apple menu, app name and menu items on the left; Wi-Fi, Spotlight, Control Center,
/// date and time on the right. Figma's trailing parts: 34.5, 34, 31 and 135 px wide.
export function MenuBar(props: { mode: Mode; width: number; selected?: number }): Markup {
  const items = [0, 1, 2, 3, 4, 5];
  return (
    <div class="flex items-start justify-between px-[10px] pt-[10px]" style={`width:${props.width}px;height:45px`}>
      <div class="flex">
        <AppleMenu mode={props.mode} selected={props.selected === 0} />
        <AppName mode={props.mode} selected={props.selected === 1} />
        {items.map((index) => <MenuItem mode={props.mode} selected={props.selected === index + 2} />)}
      </div>
      <div class="flex h-6 items-center" style={`color:${INK[props.mode]}`}>
        <Part mode={props.mode} width={34.5} height={20}><Icon name="wifi" size={16} /></Part>
        <Part mode={props.mode} width={34}><Icon name="magnifyingglass" size={15} /></Part>
        <Part mode={props.mode} width={31}><Icon name="switch.2" size={16} /></Part>
        <Part mode={props.mode} width={135} height={16}>
          <span class="text-[13px] leading-4 font-medium">Wed Apr 1  9:41 AM</span>
        </Part>
      </div>
    </div>
  );
}
