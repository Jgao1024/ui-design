import type { Markup } from "@design/jsx/jsx-runtime";
import { Wallpaper } from "./wallpaper.tsx";

// Scroll Edge Effect, figma/reference/ios27/specs/08-tokens/Materials__Scroll-Edge-Effect---*.json.
//   Soft: progressive background blur (radius 10) under a gradient mask, black to clear over 200.
//   Hard: a 200 pt bar. Light: white 85%, Dark: black 55%, background blur 6, a 0.67 hairline on
//         the inner edge (black 5% Light, black 10% Dark).
// The Figma component is 200 x 200, so the mock-up is a 200 x 300 scrolling page with the effect
// at one edge and the page continuing below it.

const ROWS = 7;
const DOTS = ["#ff8a7a", "#ffd45e", "#5ee0a0"] as const;

function Rows(props: { mode: "light" | "dark" }): Markup {
  const bar = props.mode === "light" ? "rgb(255 255 255 / 0.9)" : "rgb(255 255 255 / 0.55)";
  return (
    <div class="absolute inset-0 flex flex-col justify-between px-4 py-3">
      {Array.from({ length: ROWS }, (_, index) => (
        <div class="flex items-center gap-3">
          <div class="size-7 rounded-full" style={`background:${DOTS[index % DOTS.length]}`} />
          <div class="flex flex-col gap-1.5">
            <div class="h-2 w-24 rounded-full" style={`background:${bar}`} />
            <div class="h-2 w-16 rounded-full" style={`background:${bar}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScrollEdge(props: { kind: "soft" | "hard"; edge: "top" | "bottom"; mode: "light" | "dark" }): Markup {
  const top = props.edge === "top";
  const place = top ? "top:0" : "bottom:0";
  let layer: string;
  if (props.kind === "soft") {
    const mask = `linear-gradient(to ${top ? "bottom" : "top"},rgb(0 0 0 / ${top ? 1 : 0.9}),transparent)`;
    layer = `${place};backdrop-filter:blur(10px);-webkit-mask-image:${mask};mask-image:${mask}`;
  } else {
    const light = props.mode === "light";
    const fill = light ? "rgb(255 255 255 / 0.85)" : "rgb(0 0 0 / 0.55)";
    const hairline = light ? "rgb(0 0 0 / 0.05)" : "rgb(0 0 0 / 0.1)";
    const side = top ? "bottom" : "top";
    layer = `${place};background:${fill};backdrop-filter:blur(6px);border-${side}:0.67px solid ${hairline}`;
  }
  return (
    <Wallpaper mode={props.mode} width={200} height={300} band={10}>
      <Rows mode={props.mode} />
      <div class="absolute inset-x-0" style={`height:200px;${layer}`} />
    </Wallpaper>
  );
}
