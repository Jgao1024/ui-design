import type { Markup } from "@design/jsx/jsx-runtime";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Progress indicators and scrollbars from figma/reference/macos27/specs/03-controls/Progress-Indicators__*.json
// and Scrollbar__*.json.
//   linear       100 wide, 6 px (Small) or 10 px (Medium); unfilled black 85% at 10% with a black 7% outline;
//                the fill is the accent, or black 85% at 17% when the window is inactive
//   circular     16 px (Small) or 32 px (Large); a ring 5 px thick
//   spinner      eight 2 x 5 (Small) or 4 x 10 (Large) ticks fading from 100% to 15%, the group at 55%
//   scrollbar    12 px wide track, a 6 px thumb black 50%, 3 px inset
// Dark values are inferred: white in place of black.
const base = (mode: Mode) => (mode === "light" ? "0 0 0" : "255 255 255");

export function LinearProgress(props: {
  mode: Mode;
  size: "small" | "medium";
  /// 0 to 1. Leave out for the indeterminate bar.
  value?: number;
  active?: boolean;
}): Markup {
  const height = props.size === "small" ? 6 : 10;
  const fill = props.active === false ? `rgb(${base(props.mode)} / ${0.85 * 0.17})` : UI[props.mode].accent;
  const indeterminate = props.value === undefined;
  const left = indeterminate ? 26 : 0;
  const width = indeterminate ? 48 : Math.max(height, (props.value ?? 0) * 100);
  return (
    <div
      class="relative rounded-full"
      style={`width:100px;height:${height}px;background:rgb(${base(props.mode)} / ${0.85 * 0.1});box-shadow:inset 0 0 0 0.5px rgb(${base(props.mode)} / 0.07)`}
    >
      <div class="absolute top-0 rounded-full" style={`left:${left}px;width:${width}px;height:${height}px;background:${fill}`} />
    </div>
  );
}

export function CircularProgress(props: { mode: Mode; size: "small" | "large"; value: number; active?: boolean }): Markup {
  const px = props.size === "small" ? 16 : 32;
  const ring = 5;
  const fill = props.active === false ? `rgb(${base(props.mode)} / ${0.85 * 0.17})` : UI[props.mode].accent;
  const mask = `radial-gradient(farthest-side,transparent calc(100% - ${ring}px),#000 calc(100% - ${ring}px))`;
  return (
    <div
      class="relative rounded-full"
      style={`width:${px}px;height:${px}px;background:rgb(${base(props.mode)} / ${0.85 * 0.1});-webkit-mask:${mask};mask:${mask}`}
    >
      <div class="size-full" style={`background:conic-gradient(${fill} ${props.value * 360}deg,transparent 0)`} />
    </div>
  );
}

export function Spinner(props: { mode: Mode; size: "small" | "large" }): Markup {
  const px = props.size === "small" ? 16 : 32;
  const tick = props.size === "small" ? { w: 2, h: 5 } : { w: 4, h: 10 };
  const opacities = [1, 0.15, 0.27, 0.39, 0.51, 0.63, 0.75, 0.87];
  return (
    <div class="relative" style={`width:${px}px;height:${px}px;opacity:0.55`}>
      {opacities.map((opacity, index) => (
        <span
          class="absolute rounded-[1.5px]"
          style={`left:${(px - tick.w) / 2}px;top:0;width:${tick.w}px;height:${tick.h}px;background:rgb(${base(props.mode)} / 0.85);opacity:${opacity};transform-origin:${tick.w / 2}px ${px / 2}px;transform:rotate(${index * 45}deg)`}
        />
      ))}
    </div>
  );
}

/// Vertical scrollbar: `pageHeight` is the content height as a multiple of the view (2, 4 or 8);
/// `position` is 0 (top) to 1 (bottom).
export function Scrollbar(props: { mode: Mode; horizontal?: boolean; pages: number; position: number }): Markup {
  const track = 58;
  const thumb = track / props.pages;
  const offset = 3 + (track - thumb) * props.position;
  const style = props.horizontal
    ? `width:${thumb}px;height:6px;left:${offset}px;top:3px`
    : `width:6px;height:${thumb}px;left:3px;top:${offset}px`;
  return (
    <div class="relative" style={props.horizontal ? "width:64px;height:12px" : "width:12px;height:64px"}>
      <span class="absolute rounded-full" style={`${style};background:rgb(${base(props.mode)} / 0.5)`} />
    </div>
  );
}
