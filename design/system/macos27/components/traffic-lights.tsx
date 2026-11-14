import type { Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../theme.ts";

// Close, Minimize, Zoom (Windows__Window-Controls-Standard.json, Window-Controls-Utility.json):
// 14 px lights 9 px apart for windows, 10 px lights 7 px apart for utility panels.
// Active windows use the colours below; inactive ones are flat grey.
const ACTIVE = {
  light: [
    ["#fa9891", "#e5483f", "#c40000"],
    ["#ffda66", "#f2a413", "#9e0a00"],
    ["#ade392", "#33ab2e", "#005600"],
  ],
  dark: [
    ["#f06e6a", "#c9423a", "#991f00"],
    ["#ffcd30", "#d9930f", "#4d2e0f"],
    ["#58c73b", "#2f9a22", "#113300"],
  ],
} as const;

export function TrafficLights(props: { mode: Mode; active: boolean; size?: 14 | 10 }): Markup {
  const size = props.size ?? 14;
  const gap = size === 14 ? 9 : 7;
  const lights = props.active
    ? ACTIVE[props.mode].map(([top, bottom, rim]) =>
      `background:linear-gradient(${top},${bottom});box-shadow:0 0 0 0.5px ${rim}66,inset 0 0.5px 0.5px rgb(255 255 255 / 0.5)`
    )
    : [0, 1, 2].map(() =>
      props.mode === "light"
        ? "background:rgb(108 118 128 / 0.15);box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 0.2)"
        : "background:#3a3a3a;box-shadow:inset 0 -1.25px 0.5px -1px #999,inset 0 1.25px 0.5px -1px #8c8c8c"
    );
  return (
    <div class="flex" style={`gap:${gap}px`}>
      {lights.map((style) => <div class="rounded-full" style={`width:${size}px;height:${size}px;${style}`} />)}
    </div>
  );
}
