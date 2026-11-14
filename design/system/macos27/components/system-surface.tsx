import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { raw } from "@design/jsx/jsx-runtime";
import { Glass } from "./glass.tsx";
import { DockIcon } from "./dock.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Notifications and pointers from figma/reference/macos27/specs/07-system/.
//   notification  344 x 77, Liquid Glass radius 20; 10 px side and 12 px top padding; a 40 px column holds the
//                 32 px app icon (4 px in, 10.5 px down); the title and message column is 232 px wide, 8 px away;
//                 a 32 px column on the right. Stacked: a second banner 8 px below, inset 16 px each side.
//   pointer       28 x 28 vector with a white outline and a black fill (the paths come straight from Figma)
export function Notification(props: { mode: Mode; stack?: boolean; title?: string; message?: string }): Markup {
  const ui = UI[props.mode];
  const stack = props.stack ?? false;
  return (
    <div class="relative" style={`width:344px;height:${stack ? 85 : 77}px`}>
      {stack
        ? (
          <div
            class="absolute rounded-[20px]"
            style={`left:16px;top:17px;width:312px;height:68px;background:${props.mode === "light" ? "rgb(255 255 255 / 0.4)" : "rgb(40 40 40 / 0.5)"};backdrop-filter:blur(16px);box-shadow:inset 0 0 0 1px rgb(255 255 255 / 0.25)`}
          />
        )
        : null}
      <div class="absolute top-0 left-0">
        <Glass width={344} height={77} radius={20} mode={props.mode} size="panel">
          <div class="flex size-full items-start gap-2 px-[10px] pt-3" style={`color:${ui.label}`}>
            <div class="flex w-10 justify-center pt-[10.5px]"><span class="block scale-[0.89] origin-top"><DockIcon index={6} /></span></div>
            <div class="w-[232px]">
              <p class="text-[13px] leading-4 font-bold">{props.title ?? "Title"}</p>
              <p class="text-[13px] leading-4 font-medium" style={`color:${ui.secondary}`}>{props.message ?? "Message"}</p>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}

export function PointerGlyph(props: { x: number; y: number; svg: string; scale?: number }): Markup {
  const size = 28 * (props.scale ?? 1);
  return (
    <svg width={size} height={size} viewBox={`${props.x} ${props.y} 28 28`} fill="none" aria-hidden="true">
      {raw(props.svg)}
    </svg>
  );
}

/// A product bezel stand-in: Figma's bezel is a photographic bitmap, 1930 x 1270 around a 1512 x 993 screen at (209, 138).
export function Bezel(props: { width: number; color: "silver" | "space-gray"; children?: Child }): Markup {
  const scale = props.width / 1930;
  const body = props.color === "silver" ? "linear-gradient(160deg,#e3e4e6,#b9bbbf)" : "linear-gradient(160deg,#4a4b4e,#2b2c2e)";
  return (
    <div class="relative" style={`width:${props.width}px;height:${1270 * scale}px;border-radius:${56 * scale}px;background:${body};box-shadow:0 ${8 * scale}px ${24 * scale}px rgb(0 0 0 / 0.35)`}>
      <div
        class="absolute overflow-hidden"
        style={`left:${209 * scale}px;top:${138 * scale}px;width:${1512 * scale}px;height:${993 * scale}px;background:#050505;border-radius:${10 * scale}px`}
      >
        {props.children}
        <span class="absolute left-1/2 top-0 -translate-x-1/2 bg-black" style={`width:${200 * scale}px;height:${34 * scale}px;border-radius:0 0 ${10 * scale}px ${10 * scale}px`} />
      </div>
    </div>
  );
}
