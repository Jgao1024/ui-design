import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { At, Screen } from "./chrome.tsx";
import { GlassSurface } from "./glass.tsx";
import { Icon, type IconName } from "./icons.tsx";

// 打电话 (a voice call with Doubao), measured from 20-call (Dark only):
//   ··· at x 18, a 114 x 36 "选择情景" glass pill at x 139, y 63, captions toggle at x 351
//   a blurred warm grey orb (#4D4140 at the centre) centred on (196, 349), about 200 across
//   "你可以开始说话" on y 668; four 76 pt buttons from x 16, 22 apart, at y 714: the microphone
//   is white, the others #191919; "内容由 AI 生成" on y 810
// Light was not captured; it is drawn by swapping the surfaces.

const BUTTONS: { icon: IconName; color?: string }[] = [
  { icon: "mic" },
  { icon: "phone-mute" },
  { icon: "video-off" },
  { icon: "xmark", color: "#ff3b30" },
];

export function Call(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <Screen mode={props.mode}>
      <span class="absolute left-[18px] top-[69px]"><Icon name="ellipsis" size={24} /></span>
      <At x={139} y={63}>
        <GlassSurface mode={props.mode} width={114} height={36} radius={18} kind="button" fill={dark ? "rgb(25 25 25 / 0.95)" : undefined} class="flex items-center justify-center gap-[6px]" style="font-size:15px">
          <Icon name="grid-fill" size={16} />选择情景
        </GlassSurface>
      </At>
      <span class="absolute left-[351px] top-[69px]"><Icon name="captions" size={24} weight={1.8} /></span>
      <span class="absolute left-[38px] top-[176px] size-[6px] rounded-full" style={`background:${t.label}`} />
      <div class="absolute left-[96px] top-[249px] size-[200px] rounded-full" style={`background:radial-gradient(circle at 50% 50%,${dark ? "#4d4140,#3a2e33 45%,#251d22 70%,rgb(0 0 0 / 0)" : "#d8ccc9,#e4dadd 45%,#f0eaec 70%,rgb(255 255 255 / 0)"} 100%);filter:blur(6px)`} />
      <div class="absolute inset-x-0 top-[624px] flex justify-center gap-[6px]">{[0, 1, 2].map(() => <span class="size-[11px] rounded-full" style={`background:${t.label}`} />)}</div>
      <span class="absolute inset-x-0 top-[657px] text-center" style="font-size:16px">你可以开始说话</span>
      <div class="absolute left-4 top-[714px] flex gap-[22px]">
        {BUTTONS.map((b, i) => {
          const first = i === 0;
          const bg = first ? (dark ? "#ffffff" : "#000000") : (dark ? "#191919" : "#f2f2f2");
          const fg = b.color ?? (first ? (dark ? "#000000" : "#ffffff") : t.label);
          return <div class="grid size-[76px] place-items-center rounded-full" style={`background:${bg};color:${fg}`}><Icon name={b.icon} size={28} weight={2.2} /></div>;
        })}
      </div>
      <span class="absolute inset-x-0 top-[803px] text-center" style={`font-size:11px;color:${t.label3}`}>内容由 AI 生成</span>
    </Screen>
  );
}
