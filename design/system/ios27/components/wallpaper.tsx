import type { Child, Markup } from "@design/jsx/jsx-runtime";

// A wallpaper to put glass on: blobs and a striped band give the rim something to bend.
// The colours are decoration for the demo, not Figma values.
const PALETTE = {
  light: {
    base: "linear-gradient(135deg,#7ec8ff,#b79cff 55%,#ff9ad5)",
    blobs: ["#ff8a7a", "#ffd45e", "#5ee0a0"],
    stripe: "rgb(0 0 0 / 0.22)",
  },
  dark: {
    base: "linear-gradient(135deg,#0b1e4a,#2a1262 55%,#5a1148)",
    blobs: ["#c8483a", "#b88f1c", "#1f9a6a"],
    stripe: "rgb(255 255 255 / 0.28)",
  },
} as const;

/// A rounded wallpaper panel. `band` is the top of the striped band, in % of the height.
/// Children are centred on top of it.
export function Wallpaper(props: {
  mode: "light" | "dark";
  width: number;
  height: number;
  band?: number;
  children?: Child;
}): Markup {
  const p = PALETTE[props.mode];
  const [a, b, c] = p.blobs;
  const background = [
    `linear-gradient(${p.stripe} 0 0) 0 ${props.band ?? 30}%/100% 34px no-repeat`,
    `radial-gradient(circle at 18% 22%,${a} 0 16%,transparent 16.5%)`,
    `radial-gradient(circle at 84% 78%,${b} 0 14%,transparent 14.5%)`,
    `radial-gradient(circle at 78% 18%,${c} 0 9%,transparent 9.5%)`,
    p.base,
  ].join(",");
  return (
    <div
      class="relative overflow-hidden rounded-[20px]"
      style={`width:${props.width}px;height:${props.height}px;background:${background}`}
    >
      <div class="absolute inset-0 grid place-items-center">{props.children}</div>
    </div>
  );
}
