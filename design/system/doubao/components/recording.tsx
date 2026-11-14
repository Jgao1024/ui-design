import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Screen, UserAvatar } from "./chrome.tsx";
import { GlassSurface } from "./glass.tsx";
import { Icon } from "./icons.tsx";

// The recorder, measured from 16-transcribe-recording and 18-transcribe-detail:
//   tools centred on x 219 and 263, y 81; a 84 x 44 glass pill (··· ◉) at x 297, y 59
//   title 22 bold at x 20, y 124; meta line 13 pt on y 168; tabs on y 216 with a rule at y 239
//   level meter on y 722 from x 10 to 383; time at x 36, pause bars centred on x 196, "结束" 72 x 34
//   detail: a map header to y 260 (#19222F / #FAFBF7) under a panel with a 24 pt top radius
// The place name is de-identified and the map is a plain stand-in.

const PLACE = "某某小区";

function ToolPill(props: { mode: Mode }): Markup {
  return (
    <div class="absolute left-[297px] top-[59px]">
      <GlassSurface mode={props.mode} width={84} height={44} radius={22} kind="button" class="flex items-center justify-around px-2">
        <Icon name="ellipsis" size={22} /><Icon name="record" size={22} weight={2} />
      </GlassSurface>
    </div>
  );
}

function Meta(props: { mode: Mode; first: string; top: number; left: number }): Markup {
  const t = tone(props.mode);
  return (
    <div class="absolute flex items-center gap-[14px]" style={`left:${props.left}px;top:${props.top}px;font-size:13px;color:${t.label2}`}>
      <span class="flex items-center gap-[3px]"><Icon name="clock" size={12} weight={2} />{props.first}</span>
      <span class="flex items-center gap-[2px]"><Icon name="pin" size={12} weight={2} />{PLACE}<Icon name="chevron-down" size={12} weight={2} /></span>
    </div>
  );
}

/// 16: recording. Light was captured right at the start (00:00, a flat meter).
export function Recording(props: { mode: Mode; title: string; date: string; time: string; level: number }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const bars = Array.from({ length: 93 }, (_, i) => 6 + props.level * (((i * 37) % 11) / 10) * 10);
  return (
    <Screen mode={props.mode}>
      <span class="absolute left-[207px] top-[69px]"><Icon name="translate" size={24} weight={1.8} /></span>
      <span class="absolute left-[251px] top-[69px]"><Icon name="mic-gear" size={24} weight={1.8} /></span>
      <ToolPill mode={props.mode} />
      <span class="absolute left-5 top-[122px]" style="font-size:22px;line-height:30px;font-weight:700">{props.title}</span>
      <Meta mode={props.mode} first={props.date} top={160} left={20} />
      <div class="absolute left-5 top-[205px] flex gap-[27px]" style="font-size:16px;line-height:22px">
        <span class="relative font-semibold">文字记录<span class="absolute -bottom-[10px] left-0 h-[2px] w-full" style={`background:${t.label}`} /></span>
        <span style={`color:${t.label2}`}>实时总结</span>
      </div>
      <div class="absolute left-5 right-5 top-[239px] h-px" style={`background:${dark ? "#0a0a0a" : "#f6f6f6"}`} />
      <div class="absolute left-[10px] top-[710px] flex h-6 w-[373px] items-center justify-between">
        {bars.map((h) => <span class="w-[2px] rounded-full" style={`height:${h}px;background:${dark ? "#8a8a8a" : "#555555"}`} />)}
      </div>
      <span class="absolute left-9 top-[773px]" style="font-size:15px">{props.time}</span>
      <div class="absolute left-[181px] top-[766px] flex gap-[8px]"><span class="h-[34px] w-[11px] rounded-[5px]" style={`background:${t.label}`} /><span class="h-[34px] w-[11px] rounded-[5px]" style={`background:${t.label}`} /></div>
      <div class="absolute left-[295px] top-[766px] grid h-[34px] w-[72px] place-items-center rounded-full" style={`background:${t.card};font-size:15px`}>结束</div>
    </Screen>
  );
}

/// 18: a recording's detail page. Nothing was said, so the transcript is empty.
export function RecordingDetail(props: { mode: Mode; title: string; length: string }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const road = dark ? "#2a3546" : "#e3e5e0";
  return (
    <Screen mode={props.mode} bg={dark ? "#19222f" : "#fafbf7"}>
      <svg class="absolute inset-x-0 top-0" width="393" height="270" viewBox="0 0 393 270" fill="none" stroke={road} stroke-linecap="round" aria-hidden="true">
        <path d="M-10 70C60 60 120 80 180 60S300 20 410 40" stroke-width="5" />
        <path d="M150 -10C170 60 160 120 210 170S300 230 330 280" stroke-width="4" />
        <path d="M-10 160C70 150 110 180 170 150" stroke-width="3" />
        <path d="M250 100C290 120 340 110 400 130" stroke-width="3" />
        <path d="M60 0C70 50 40 100 60 160" stroke-width="2" />
      </svg>
      <div class="absolute left-[181px] top-[107px] rounded-full" style="box-shadow:0 0 0 2px #fff,0 2px 6px rgb(0 0 0 / 0.3)"><UserAvatar size={30} /></div>
      <ToolPill mode={props.mode} />
      <span class="absolute left-6 top-[168px]" style="font-size:22px;line-height:30px;font-weight:700">{props.title}</span>
      <Meta mode={props.mode} first={props.length} top={209} left={24} />
      <div class="absolute inset-x-0 bottom-0 top-[248px] rounded-t-[24px]" style={`background:${dark ? "#1a1a1a" : "#ffffff"}`}>
        <span class="absolute inset-x-0 top-[285px] text-center" style={`font-size:14px;color:${t.label3}`}>未识别到文字内容</span>
      </div>
    </Screen>
  );
}
