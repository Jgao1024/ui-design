import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";

// iPadOS window parts, figma/reference/ios27/specs/01-navigation/Windows__*.json.
//   Window controls: a 41 x 22 capsule, three 6 pt dots 4.5 apart. Active: #FF5F57, #FEBC2F, #27C840.
//   Inactive: 60 % label dots on a #747480 8 % capsule with a #EBEBEB hairline.
//   Resize grabber: a 32 x 32 box with a 3.5 pt arc, 19.9 pt when floating, 12 pt when full screen.
//   Window: 720 x 400, radius 34, shadow 0 30 140 black 30 %.

export function WindowControls(props: { mode: Mode; active: boolean }): Markup {
  const t = tone(props.mode);
  const dots = props.active ? ["#ff5f57", "#febc2f", "#27c840"] : [t.label2, t.label2, t.label2];
  const dark = props.mode === "dark";
  const inactive = `background:${dark ? "rgb(118 118 128 / 0.24)" : "rgb(116 116 128 / 0.08)"};box-shadow:0 0 0 0.5px ${dark ? "#e6e6e6" : "#ebebeb"}`;
  return (
    <div class="flex h-[22px] w-[41px] items-center justify-center gap-[4.5px] rounded-full" style={props.active ? "" : inactive}>
      {dots.map((color) => <span class="size-1.5 rounded-full" style={`background:${color}`} />)}
    </div>
  );
}

export function ResizeGrabber(props: { mode: Mode; floating: boolean }): Markup {
  const size = props.floating ? 19.91 : 12;
  const offset = props.floating ? 5 : 14;
  const color = props.mode === "dark" ? "#fff" : "#000";
  return (
    <div class="relative size-8">
      <svg class="absolute" style={`left:${offset}px;top:${offset}px`} width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} stroke-width="3.5" stroke-linecap="round">
        <path d="M18 3v3a12 12 0 0 1-12 12H3" transform="translate(-1 -1)" />
      </svg>
    </div>
  );
}

export function WindowFrame(props: { mode: Mode; width?: number; height?: number; active?: boolean; children?: Child }): Markup {
  const t = tone(props.mode);
  const active = props.active ?? true;
  return (
    <div
      class="relative overflow-hidden"
      style={`width:${props.width ?? 720}px;height:${props.height ?? 400}px;border-radius:34px;background:${t.bg};box-shadow:0 30px 140px rgb(0 0 0 / 0.3)`}
    >
      {props.children}
      <div class="absolute left-4 top-3.5"><WindowControls mode={props.mode} active={active} /></div>
      <div class="absolute bottom-0 right-0"><ResizeGrabber mode={props.mode} floating /></div>
    </div>
  );
}
