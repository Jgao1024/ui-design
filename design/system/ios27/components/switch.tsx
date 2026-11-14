import type { Markup } from "@design/jsx/jsx-runtime";
import { Glass } from "@design/components/glass.tsx";
import { type Mode, tone } from "../theme.ts";

/// Toggle - Switch, figma specs 03-controls/Toggles__Toggle---Switch.json: a 64 x 28 track, a
/// 38 x 24 white knob 2 pt in from the edge. Pressed swaps the knob for a 58 x 38 glass lens that
/// overhangs the track by 8 and 5 pt. Disabled is 50 % opacity.
export function Switch(props: { mode: Mode; on: boolean; pressed?: boolean; enabled?: boolean }): Markup {
  const t = tone(props.mode);
  const enabled = props.enabled ?? true;
  const track = props.on ? t.green : "rgb(60 60 67 / 0.3)";
  const trackDark = props.on ? t.green : "rgb(235 235 245 / 0.3)";
  const knobX = props.on ? 24 : 2;
  return (
    <div class="relative h-7 w-16" style={`opacity:${enabled ? 1 : 0.5}`}>
      <div class="absolute inset-0 rounded-full" style={`background:${props.mode === "dark" ? trackDark : track}`} />
      {props.pressed
        ? (
          <div class="absolute" style={`left:${props.on ? 14 : -8}px;top:-5px`}>
            <Glass mode={props.mode} width={58} height={38} radius={19} fill="rgb(255 255 255 / 0.55)" blur={2} refraction={10} shadowBlur={12} shadowAlpha={0.12} />
          </div>
        )
        : (
          <div
            class="absolute top-0.5 h-6 w-[38px] rounded-full bg-white"
            style={`left:${knobX}px;box-shadow:0 2px 6px rgb(0 0 0 / 0.15)`}
          />
        )}
    </div>
  );
}
