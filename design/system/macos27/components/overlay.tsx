import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Glass } from "./glass.tsx";
import { DockIcon } from "./dock.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Alerts, popovers, tooltips, sheets and dialogs from figma/reference/macos27/specs/06-overlays/.
//   alert     260 wide, Liquid Glass, radius 34; 16 px side and 20 px top padding; a 64 px app icon (6 px in);
//             title SF Pro Bold 13 pt; description Regular 11 pt; 14 px between blocks; buttons are 28 px capsules,
//             or 32 px and 110 wide when two sit side by side
//   buttons   Primary #0088FF with a white label; Secondary #E6E6E6 with black 85%; Destructive #F52F32 at 23%
//             with a #F52F32 label. Figma's Dark buttons keep the Light colours; the Dark secondary is inferred.
//   popover   200 x 200 glass, radius 20, an arrow (cartouche) 46 x 10.5 on one edge
//   tooltip   11 pt Medium #1A1A1A on #ECECEC at 88%, 6 px by 3 px padding, 49 x 18 for "Tooltip"
//   sheet     300 x 300, radius 16, white (Light) or #1E1E1E (Dark), shadow 0 / 54
//   dialog    390 x 318 (Small) or 1000 x 448 (Large), radius 16, white; the Small button row is 56 px
export type AlertButtonType = "primary" | "secondary" | "destructive" | "plain";

export function AlertButton(props: { mode: Mode; type: AlertButtonType; width: number; height?: number; label?: string }): Markup {
  const ui = UI[props.mode];
  const look = {
    primary: { background: "#0088ff", color: "#ffffff" },
    secondary: { background: props.mode === "light" ? "#e6e6e6" : ui.fillStrong, color: ui.label },
    destructive: { background: "rgb(245 47 50 / 0.23)", color: "#f52f32" },
    plain: { background: "transparent", color: ui.label },
  }[props.type];
  return (
    <div
      class="flex items-center justify-center rounded-full text-[13px] leading-4 font-medium"
      style={`width:${props.width}px;height:${props.height ?? 28}px;background:${look.background};color:${look.color}`}
    >
      {props.label ?? "Label"}
    </div>
  );
}

export const ALERT_TITLE = "Save this message as a draft?";
export const ALERT_BODY = "This message has not been sent and contains unsaved changes. You can save it as a draft to work on later.";

/// Figma's 216 and 152 px heights have no icon (Show Icon = False); with the 64 px icon and 14 px gap an alert is 78 px taller.
export function Alert(props: { mode: Mode; layout: "stacked" | "side-by-side"; buttons?: AlertButtonType[]; icon?: boolean }): Markup {
  const ui = UI[props.mode];
  const stacked = props.layout === "stacked";
  const buttons = props.buttons ?? (stacked ? ["primary", "plain", "secondary"] : ["secondary", "primary"]);
  const height = (stacked ? 216 : 152) + (props.icon ? 78 : 0);
  return (
    <Glass width={260} height={height} radius={34} mode={props.mode} size="panel">
      <div class="flex size-full flex-col px-4 pt-5" style={`gap:14px;color:${ui.label}`}>
        {props.icon ? <div class="flex h-16 items-center pl-[6px]"><DockIcon index={5} /></div> : null}
        <div class="px-[6px]">
          <p class="text-[13px] leading-4 font-bold">{ALERT_TITLE}</p>
          <p class="mt-2.5 text-[11px] leading-[14px]">{ALERT_BODY}</p>
        </div>
        <div class={stacked ? "flex flex-col gap-1.5" : "flex gap-2"}>
          {buttons.map((type) => <AlertButton mode={props.mode} type={type} width={stacked ? 228 : 110} height={stacked ? 28 : 32} />)}
        </div>
      </div>
    </Glass>
  );
}

const TIP = { light: "rgb(236 236 236 / 0.88)", dark: "rgb(51 51 51 / 0.88)" };
export function Tooltip(props: { mode: Mode; text?: string }): Markup {
  return (
    <div
      class="rounded-[5px] px-[6px] py-[3px] text-[11px] leading-[13px] font-medium"
      style={`background:${TIP[props.mode]};color:${props.mode === "light" ? "#1a1a1a" : "#f5f5f5"};backdrop-filter:blur(20px);box-shadow:0 2px 8px rgb(0 0 0 / 0.2),0 0 1px rgb(0 0 0 / 0.3)`}
    >
      {props.text ?? "Tooltip"}
    </div>
  );
}

export type Edge =
  | "top-leading" | "top-center" | "top-trailing"
  | "bottom-leading" | "bottom-center" | "bottom-trailing"
  | "leading-top" | "leading-middle" | "leading-bottom"
  | "trailing-top" | "trailing-middle" | "trailing-bottom";

/// A 200 x 200 popover inside a 240 x 240 frame, with its 46 x 10.5 arrow on `edge`. Corner arrows are placed
/// 11 px from the corner (Figma's arrow there is a corner-hugging shape of 39 px; the plain triangle is an approximation).
export function Popover(props: { mode: Mode; edge: Edge; children?: Child }): Markup {
  const [side, at] = props.edge.split("-") as ["top" | "bottom" | "leading" | "trailing", string];
  const horizontal = side === "top" || side === "bottom";
  const fill = props.mode === "light" ? "rgb(255 255 255 / 0.88)" : "rgb(48 48 48 / 0.85)";
  // Offset of the arrow centre along the edge.
  const centre = at === "center" || at === "middle" ? 100 : at === "leading" || at === "top" ? 34 : 166;
  const arrow = horizontal
    ? `left:${centre - 23}px;${side === "top" ? "top:-10.5px" : "bottom:-10.5px"};width:46px;height:10.5px;transform:${side === "bottom" ? "scaleY(-1)" : "none"}`
    : `top:${centre - 23}px;${side === "leading" ? "left:-10.5px" : "right:-10.5px"};width:10.5px;height:46px;transform:${side === "trailing" ? "scaleX(-1)" : "none"}`;
  const path = horizontal ? "M0 10.5C8 10.5 14 0 23 0S38 10.5 46 10.5Z" : "M10.5 0C10.5 8 0 14 0 23s10.5 15 10.5 23Z";
  return (
    <div class="relative flex size-[240px] items-center justify-center">
      <div class="relative size-[200px]">
        <Glass width={200} height={200} radius={20} mode={props.mode} size="panel">{props.children ?? <span />}</Glass>
        <svg class="absolute" style={arrow} viewBox={horizontal ? "0 0 46 10.5" : "0 0 10.5 46"} aria-hidden="true">
          <path d={path} fill={fill} />
        </svg>
      </div>
    </div>
  );
}

export function Sheet(props: { mode: Mode; children?: Child; width?: number; height?: number }): Markup {
  const ui = UI[props.mode];
  return (
    <div
      class="flex items-center justify-center rounded-2xl"
      style={`width:${props.width ?? 300}px;height:${props.height ?? 300}px;background:${ui.window};color:${ui.label};box-shadow:0 18px 54px rgb(0 0 0 / ${props.mode === "light" ? 0.3 : 0.57}),0 0 1px rgb(0 0 0 / 0.8)`}
    >
      {props.children}
    </div>
  );
}
