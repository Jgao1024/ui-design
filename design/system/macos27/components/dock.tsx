import type { Markup } from "@design/jsx/jsx-runtime";
import { Glass } from "./glass.tsx";
import type { Mode } from "../theme.ts";

// Dock from figma/reference/macos27/specs/02-bars/Menu-Bar-and-Dock__Dock.json and Dock-Icon.json.
// The Dock is 1152 x 55 with radius 15; icons are 36 x 36 with a 9 px gap, 8 px from the top and
// sides. A running app has a 4 px dot (#707070) 3 px below its icon. App icons are bitmaps in
// Figma, so a tinted rounded square stands in for each one.
export const DOCK_WIDTH = 1152;
const DOT = "#707070";

/// A stand-in app icon: a 36 px rounded square, tinted by `index`. The tint is a stand-in value, not Figma data.
export function DockIcon(props: { index: number; dot?: boolean }): Markup {
  const hue = (props.index * 47) % 360;
  return (
    <div class="flex flex-col items-center" style="width:36px;height:47px;gap:3px">
      <div
        class="size-9 rounded-[8px]"
        style={`background:linear-gradient(160deg,hsl(${hue} 80% 68%),hsl(${(hue + 30) % 360} 70% 46%));box-shadow:inset 0 0 0 1px rgb(255 255 255 / 0.25)`}
      />
      <span class="size-1 rounded-full" style={`background:${props.dot ? DOT : "transparent"}`} />
    </div>
  );
}

/// 23 app icons, a divider, then Folder and Trash, as in Figma's template.
export function Dock(props: { mode: Mode }): Markup {
  const apps = Array.from({ length: 23 }, (_, index) => index);
  const divider = props.mode === "light" ? "rgb(0 0 0 / 0.2)" : "rgb(255 255 255 / 0.25)";
  return (
    <Glass width={DOCK_WIDTH} height={55} radius={15} mode={props.mode} size="small">
      <div class="flex items-start" style="gap:9px;padding:8px 8px 0">
        {apps.map((index) => <DockIcon index={index} dot={index === 0 || index === 2 || index === 4} />)}
        <div class="flex h-9 w-[11px] items-center justify-center"><span class="h-9 w-px" style={`background:${divider}`} /></div>
        <DockIcon index={23} />
        <DockIcon index={24} />
      </div>
    </Glass>
  );
}
