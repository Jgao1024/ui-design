import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { WALLPAPER } from "../theme.ts";

/// A square of sample wallpaper that a glass mock-up sits on. Its centre holds `children`.
export function Backdrop(props: {
  mode: "light" | "dark";
  width: number;
  height: number;
  class?: string;
  children?: Child;
}): Markup {
  const paper = WALLPAPER[props.mode];
  const [a, b, c, d] = paper.blobs;
  const background = [
    `radial-gradient(circle at 18% 22%,${a} 0,transparent 46%)`,
    `radial-gradient(circle at 82% 18%,${b} 0,transparent 42%)`,
    `radial-gradient(circle at 24% 86%,${c} 0,transparent 48%)`,
    `radial-gradient(circle at 84% 82%,${d} 0,transparent 46%)`,
    `repeating-linear-gradient(0deg,${paper.lines} 0 1px,transparent 1px 12px)`,
    paper.base,
  ].join(",");
  return (
    <div
      class={`relative flex items-center justify-center overflow-hidden rounded-[5px] ${props.class ?? ""}`}
      style={`width:${props.width}px;height:${props.height}px;background:${background}`}
    >
      {props.children}
    </div>
  );
}
