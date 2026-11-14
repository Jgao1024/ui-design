import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Backdrop } from "./backdrop.tsx";
import { Dock } from "./dock.tsx";
import { MenuBar } from "./menu-bar.tsx";
import type { Mode } from "../theme.ts";

// A desktop from figma/reference/macos27/specs/00-examples/: 1512 x 993, the menu bar 45 px high across the top,
// the 1152 x 55 Dock at (180, 934). `children` are placed on it with `At`.
export const DESKTOP = { width: 1512, height: 993 } as const;

export function Desktop(props: { mode: Mode; children?: Child }): Markup {
  return (
    <div class="relative" style={`width:${DESKTOP.width}px;height:${DESKTOP.height}px`}>
      <Backdrop mode={props.mode} width={DESKTOP.width} height={DESKTOP.height}>{null}</Backdrop>
      <div class="absolute top-0 left-0"><MenuBar mode={props.mode} width={DESKTOP.width} /></div>
      <div class="absolute" style="left:180px;top:934px"><Dock mode={props.mode} /></div>
      {props.children}
    </div>
  );
}

/// Places `children` at (x, y) on a desktop.
export function At(props: { x: number; y: number; children: Child }): Markup {
  return <div class="absolute" style={`left:${props.x}px;top:${props.y}px`}>{props.children}</div>;
}

/// A desktop drawn at `scale`, so two fit side by side on a page.
export function Scaled(props: { scale: number; children: Child }): Markup {
  return (
    <div class="overflow-hidden rounded-[5px]" style={`width:${DESKTOP.width * props.scale}px;height:${DESKTOP.height * props.scale}px`}>
      <div style={`width:${DESKTOP.width}px;height:${DESKTOP.height}px;transform:scale(${props.scale});transform-origin:0 0`}>{props.children}</div>
    </div>
  );
}
