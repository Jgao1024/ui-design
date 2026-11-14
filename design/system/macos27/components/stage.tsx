import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Backdrop } from "./backdrop.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

export const MODES: Mode[] = ["light", "dark"];

/// Light and Dark wallpaper tiles side by side, 8 px apart. `draw` receives the mode.
export function ModePair(props: { width: number; height: number; draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => (
        <Backdrop mode={mode} width={props.width} height={props.height}>{props.draw(mode)}</Backdrop>
      ))}
    </div>
  );
}

/// A plain surface in the window colour of a mode, for controls that sit on a window.
export function Surface(props: { mode: Mode; width: number; height: number; class?: string; children?: Child }): Markup {
  return (
    <div
      class={`relative flex items-center justify-center rounded-[5px] ${props.class ?? ""}`}
      style={`width:${props.width}px;height:${props.height}px;background:${UI[props.mode].window};box-shadow:inset 0 0 0 1px ${
        UI[props.mode].separator
      }`}
    >
      {props.children}
    </div>
  );
}

/// Light and Dark surfaces side by side.
export function SurfacePair(props: { width: number; height: number; draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => <Surface mode={mode} width={props.width} height={props.height}>{props.draw(mode)}</Surface>)}
    </div>
  );
}
