import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon } from "./icon.tsx";
import { GlassControl } from "./liquid-glass.tsx";

// Buttons, figma/reference/ios27/specs/03-controls/Buttons__*.json.
//   Glass text button: Small 28 tall (padding 10 / 5, 15 pt label), Medium 34 (12 / 8), Large 50 (20 / 16),
//   labels weight 510. Glass symbol button: 50 x 50. Prominent fills with the tint, label white.
//   Content-area buttons: Small 28, Medium 34, Large 50 tall, capsule. Bordered: fill #767680 at 12 %,
//   tint label. Bordered prominent: tint fill, white label. Borderless: tint label only.
//   Disabled label: #3C3C43 at 30 % (Light); Destructive uses red.

export type ButtonSize = "small" | "medium" | "large";
const HEIGHT: Record<ButtonSize, number> = { small: 28, medium: 34, large: 50 };
const PAD: Record<ButtonSize, number> = { small: 10, medium: 12, large: 20 };
const FONT: Record<ButtonSize, number> = { small: 15, medium: 17, large: 17 };

const textWidth = (label: string, size: ButtonSize) => Math.round(label.length * 9 * (FONT[size] / 17));

export function GlassButton(props: {
  mode: Mode;
  size?: ButtonSize;
  label?: string;
  symbol?: "play" | "plus" | "share" | "ellipsis" | "star";
  prominent?: boolean;
  destructive?: boolean;
  enabled?: boolean;
}): Markup {
  const t = tone(props.mode);
  const size = props.size ?? "large";
  const enabled = props.enabled ?? true;
  const tint = props.prominent ? (props.destructive ? t.red : t.blue) : undefined;
  const base = props.mode === "dark" ? "#f5f5f5" : "#262626";
  const color = props.prominent ? "#fff" : props.destructive ? t.red : base;
  const symbolOnly = props.symbol && !props.label;
  const width = symbolOnly ? 50 : textWidth(props.label ?? "Label", size) + 2 * PAD[size];
  const height = symbolOnly ? 50 : HEIGHT[size];
  return (
    <div style={`opacity:${enabled ? 1 : 0.5}`}>
      <GlassControl mode={props.mode} width={width} height={height} tint={tint}>
        <div class="grid size-full place-items-center" style={`color:${color};font-size:${FONT[size]}px;font-weight:510;line-height:18px`}>
          {symbolOnly ? <Icon name={props.symbol!} size={24} /> : props.label ?? "Label"}
        </div>
      </GlassControl>
    </div>
  );
}

export type FlatStyle = "bordered" | "prominent" | "borderless";

export function ContentButton(props: {
  mode: Mode;
  size: ButtonSize;
  style: FlatStyle;
  content: "title" | "icon" | "both";
  enabled?: boolean;
  destructive?: boolean;
}): Markup {
  const t = tone(props.mode);
  const enabled = props.enabled ?? true;
  const height = HEIGHT[props.size];
  const tint = props.destructive ? t.red : t.blue;
  const filled = props.style === "prominent";
  const color = !enabled ? t.label3 : filled ? "#fff" : tint;
  const fill = props.style === "borderless" ? "transparent" : filled ? (enabled ? tint : t.fill3) : t.fill3;
  const large = props.size === "large";
  const font = large ? 17 : 15;
  const padding = props.content === "icon" ? 0 : large ? 20 : props.size === "medium" ? 14 : 10;
  return (
    <div
      class="flex items-center justify-center gap-1 rounded-full"
      style={`height:${height}px;min-width:${props.content === "icon" ? height : 0}px;padding:0 ${padding}px;background:${fill};color:${color};font-size:${font}px;line-height:${large ? 22 : 20}px;letter-spacing:${large ? -0.43 : -0.23}px`}
    >
      {props.content !== "title" && <Icon name="play" size={large ? 17 : 15} />}
      {props.content !== "icon" && <span>Play</span>}
    </div>
  );
}
