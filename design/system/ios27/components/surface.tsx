import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";

/// A mock-up backdrop in one mode: the system background with the label colour as text colour.
/// `level` picks the background: 1 primary, 2 secondary, 3 tertiary, "grouped" for list screens.
export function Surface(props: {
  mode: Mode;
  width?: number;
  height?: number;
  level?: 1 | 2 | 3 | "grouped";
  radius?: number;
  class?: string;
  children?: Child;
}): Markup {
  const t = tone(props.mode);
  const bg = props.level === "grouped" ? t.grouped : props.level === 2 ? t.bg2 : props.level === 3 ? t.bg3 : t.bg;
  const size = `${props.width ? `width:${props.width}px;` : ""}${props.height ? `height:${props.height}px;` : ""}`;
  return (
    <div
      class={`relative overflow-hidden ${props.class ?? ""}`}
      style={`${size}background:${bg};color:${t.label};border-radius:${props.radius ?? 20}px${props.mode === "light" ? ";box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 0.12)" : ""}`}
    >
      {props.children}
    </div>
  );
}
