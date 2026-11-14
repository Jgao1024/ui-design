import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { ChatTopBar, type ChipSpec, ChipRow, InputBar, Screen } from "./chrome.tsx";
import { GlassSurface } from "./glass.tsx";
import { Icon } from "./icons.tsx";

// 录音转写 in a conversation, measured from 15, 17, 19, 21 and 22-transcribe-*:
//   the user's bubble 134 x 46 at x 247, y 127 (#00B8FF); Doubao's reply bubbles are #252525
//   the live card: 368 x 195 at x 12, y 185, a 1 pt #252525 rim, header on y 205, divider y 225,
//     a 336 x 44 button at y 321
//   the result: a "录音已结束" card at y 110 and Doubao's message card (#252525 / #F7F7F7) from
//     y 215 with an inner minutes card at y 415 and a document preview (#E0E0E0 / #FFFFFF)
// The place name is de-identified ("某某小区").

const PLACE = "某某小区";

export const RECORDING_CHIPS: ChipSpec[] = [
  { icon: "bubble", label: "对话", more: true },
  { icon: "folder", label: "选择项目", more: true },
  { icon: "waveform", label: "正在录音" },
  { icon: "phone", label: "打电话" },
];
const AFTER_CHIPS: ChipSpec[] = [
  { icon: "bubble", label: "对话", more: true },
  { icon: "folder", label: "选择项目", more: true },
  { icon: "mic-text", label: "录音转写" },
  { icon: "phone", label: "打电话" },
  { icon: "sparkle", label: "AI 创作" },
  { icon: "compose", label: "帮我写作" },
];

function UserBubble(): Markup {
  return <div class="absolute left-[247px] top-[127px] grid h-[46px] w-[134px] place-items-center rounded-[20px] text-white" style="background:#00b8ff;font-size:16px">开启录音转写</div>;
}

function Conversation(props: { mode: Mode; title: string; chips: ChipSpec[]; chipsOffset?: number; bare?: boolean; children?: Child }): Markup {
  return (
    <Screen mode={props.mode} bare={props.bare}>
      {props.children}
      <ChatTopBar mode={props.mode} title={props.title} />
      <ChipRow mode={props.mode} chips={props.chips} offset={props.chipsOffset} />
      <InputBar mode={props.mode} />
    </Screen>
  );
}

/// 15: just asked; Doubao answers that it is starting.
export function TranscribeStart(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <Conversation mode={props.mode} title="豆包" chips={RECORDING_CHIPS}>
      <UserBubble />
      <div class="absolute left-3 top-[185px] flex h-12 items-center gap-3 rounded-[18px] px-4" style={`background:${t.card};font-size:16px`}>
        正在开启录音转写
        <span class="flex gap-[5px]">{[0.35, 0.6, 1].map((o) => <span class="size-[6px] rounded-full" style={`background:${t.label};opacity:${o}`} />)}</span>
      </div>
    </Conversation>
  );
}

function LiveCard(props: { mode: Mode; time: string; live: boolean; text: string; button: string }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <div class="absolute left-3 top-[185px] h-[195px] w-[368px] rounded-[14px]" style={`box-shadow:inset 0 0 0 1px ${dark ? "#252525" : "#ededed"}`}>
      <div class="absolute left-4 top-[12px] flex items-center gap-[4px]" style={`font-size:12px;color:${t.label3}`}><span style="color:#2f7bff"><Icon name="mic" size={13} weight={2.4} /></span>录音转写</div>
      <div class="absolute right-4 top-[11px] flex items-center gap-[6px]" style="font-size:13px">{props.time}{props.live && <Icon name="waveform" size={14} weight={2} />}</div>
      <div class="absolute inset-x-0 top-[40px] h-px" style={`background:${dark ? "#191919" : "#f2f2f2"}`} />
      <span class="absolute left-4 top-[76px]" style={`font-size:15px;color:${props.live ? t.label : t.label3}`}>{props.text}</span>
      <div class="absolute left-4 top-[136px] grid h-11 w-[336px] place-items-center rounded-[8px]" style={`background:${t.card};font-size:16px;color:${props.live ? t.red : t.faint}`}>{props.button}</div>
    </div>
  );
}

/// 17: recording, the speech is being recognised.
export function TranscribeRecognizing(props: { mode: Mode }): Markup {
  return (
    <Conversation mode={props.mode} title="开启录音转写" chips={RECORDING_CHIPS}>
      <UserBubble />
      <LiveCard mode={props.mode} time="00:09" live text="正在识别..." button="结束录音转写" />
    </Conversation>
  );
}

/// 19: recording ended, minutes being written.
export function TranscribeSummarizing(props: { mode: Mode }): Markup {
  return (
    <Conversation mode={props.mode} title="开启录音转写" chips={AFTER_CHIPS.slice(0, 4)}>
      <UserBubble />
      <LiveCard mode={props.mode} time="00:10" live={false} text="正在理解录音内容，提取重点信息..." button="录音纪要生成中" />
    </Conversation>
  );
}

/// 22: the minutes are ready. `bare` draws it behind the sidebar.
export function TranscribeResult(props: { mode: Mode; bare?: boolean; children?: Child }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <Conversation mode={props.mode} title="开启录音转写" chips={AFTER_CHIPS} chipsOffset={171} bare={props.bare}>
      <div class="absolute left-3 top-[110px] h-[92px] w-[368px] rounded-[14px]" style={`background:${dark ? "#000000" : "#ffffff"};box-shadow:inset 0 0 0 1px ${dark ? "#252525" : "#ededed"}`}>
        <div class="absolute left-4 top-[14px] flex items-center gap-[4px]" style={`font-size:12px;color:${t.label3}`}><span style="color:#2f7bff"><Icon name="mic" size={13} weight={2.4} /></span>录音转写</div>
        <span class="absolute right-4 top-[13px]" style="font-size:13px">00:10</span>
        <span class="absolute left-4 top-[56px]" style="font-size:15px">录音已结束</span>
      </div>
      <div class="absolute left-3 top-[215px] h-[480px] w-[368px] rounded-[16px]" style={`background:${t.card}`}>
        <span class="absolute left-4 top-[14px] border-l-2 pl-[6px]" style={`font-size:13px;line-height:16px;color:${t.label3};border-color:${t.faint}`}>录音转写</span>
        <p class="absolute left-4 right-4 top-[42px]" style="font-size:17px;line-height:25px">我已为你整理录音纪要，你可以点击查看内容，或者直接提问。</p>
        <p class="absolute left-4 right-4 top-[110px]" style="font-size:17px;line-height:25.5px">时长: 10 秒<br />时间: 11/14 20:40-20:40 (GMT +8)<br />地点: {PLACE}</p>
        <div class="absolute left-4 top-[200px] h-[272px] w-[336px] rounded-[14px]" style={`background:${dark ? "#1a1a1a" : "#ffffff"};box-shadow:inset 0 0 0 1px ${dark ? "#2e2e2e" : "#ededed"}`}>
          <div class="absolute left-[14px] top-[18px] flex items-center gap-[8px]" style="font-size:16px">
            <span class="grid size-5 place-items-center rounded-[5px]" style="background:#e5f7ec"><span class="size-[9px] rounded-full" style="box-shadow:0 0 0 2px #19b25b" /></span>
            智能纪要：新录音 2026年11月14日
          </div>
          <div class="absolute left-4 top-[49px] h-[170px] w-[304px] rounded-[6px]" style={`background:${dark ? "#e0e0e0" : "#ffffff"};box-shadow:${dark ? "none" : "0 0 0 1px #ededed,0 2px 8px rgb(0 0 0 / 0.04)"};color:#000`}>
            <div class="absolute left-3 top-[10px] flex gap-[22px]" style="font-size:12px">
              <span class="relative" style="color:#3a6fe0">纪要<span class="absolute -bottom-[6px] left-0 h-[2px] w-full" style="background:#3a6fe0" /></span>
              <span style="color:#666">原始记录</span>
            </div>
            <div class="absolute inset-x-3 top-[34px] h-px" style="background:#d0d0d0" />
            <span class="absolute left-3 top-[58px]" style="font-size:11px">未能生成纪要，可查看原始记录</span>
          </div>
          <span class="absolute left-4 top-[233px]" style="font-size:13px">你可管理</span>
          <div class="absolute right-4 top-[233px] flex gap-[14px]"><Icon name="copy" size={16} weight={1.8} /><Icon name="download" size={16} weight={1.8} /><Icon name="expand" size={16} weight={1.8} /></div>
        </div>
      </div>
      {props.children}
    </Conversation>
  );
}

/// 21: the result with the feedback toast over the top bar.
export function TranscribeRate(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <TranscribeResult mode={props.mode}>
      <div class="absolute left-3 top-[58px] z-10">
        <GlassSurface mode={props.mode} width={368} height={72} radius={24} kind="bar" floating fill={dark ? "rgb(37 38 38 / 0.97)" : "rgb(255 255 255 / 0.97)"} class="flex items-center pl-4 pr-3" style="font-size:16px">
          <span class="grid size-9 place-items-center rounded-full" style={`background:#f2c94c33;box-shadow:inset 0 0 0 2px #f2c94c;color:${t.label}`}><Icon name="bubble" size={18} weight={2} /></span>
          <span class="ml-[10px] flex-1">是否满意本次通话?</span>
          {(["thumb-up", "thumb-down"] as const).map((icon) => <span class="ml-3 grid size-9 place-items-center rounded-full" style={`background:${dark ? "#3b3c3c" : "#f2f2f2"}`}><Icon name={icon} size={18} weight={1.8} /></span>)}
        </GlassSurface>
      </div>
    </TranscribeResult>
  );
}
