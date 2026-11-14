import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { ChipRow, HomeTopBar, InputBar, Keyboard, Screen, Toast } from "./chrome.tsx";
import { GlassSurface } from "./glass.tsx";
import { Icon, type IconName } from "./icons.tsx";

// The home screen (a new chat) and its states. Measured from 01-home, 06-home-keyboard,
// 07-toast-no-text, 09-toast-autoread, 14-skill-create and 23-mode-menu:
//   greeting 22 bold centred on y 289; segment 245 x 49 at x 74, y 323, thumb 120 x 44
//   with the keyboard up the input bar moves to y 456 and the greeting and chips go away
//   mode menu: a 238 x 220 glass card at x 13, y 472, rows on y 502, 542, 602, 662

function Greeting(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <>
      <span class="absolute inset-x-0 top-[274px] text-center" style="font-size:22px;line-height:30px;font-weight:700">有什么我能帮你的吗?</span>
      <div class="absolute left-[74px] top-[323px] flex h-[49px] w-[245px] items-center rounded-full px-[3px]" style={`background:${t.track};box-shadow:0 0 0 1px ${t.trackRim}`}>
        <div class="grid h-11 w-[120px] place-items-center rounded-full" style={`background:${t.thumb};box-shadow:${t.thumbShadow};color:${t.label};font-size:17px`}>对话</div>
        <div class="grid h-11 flex-1 place-items-center" style={`color:${t.label2};font-size:17px`}>工作</div>
      </div>
    </>
  );
}

/// The home screen. Every part can be switched off or moved for the states below.
export function HomeScreen(props: {
  mode: Mode;
  greeting?: boolean;
  chips?: boolean;
  chipsTop?: number;
  input?: "default" | "close" | "hold" | "focused" | "text" | "none";
  inputTop?: number;
  text?: string;
  speakerOn?: boolean;
  toast?: { text: string; warning?: boolean };
  bare?: boolean;
  children?: Child;
}): Markup {
  const input = props.input ?? "default";
  return (
    <Screen mode={props.mode} bare={props.bare}>
      <HomeTopBar mode={props.mode} speakerOn={props.speakerOn} glass={props.glass} />
      {(props.greeting ?? true) && <Greeting mode={props.mode} />}
      {(props.chips ?? true) && <ChipRow mode={props.mode} top={props.chipsTop} />}
      {input !== "none" && <InputBar mode={props.mode} variant={input} top={props.inputTop} text={props.text} glass={props.glass} />}
      {props.children}
      {props.toast && <Toast mode={props.mode} text={props.toast.text} warning={props.toast.warning} />}
    </Screen>
  );
}

/// 06: the input bar is focused and the keyboard is up. iOS shows its paste suggestions in a
/// faint row above the bar.
export function HomeKeyboard(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <HomeScreen mode={props.mode} greeting={false} chips={false} input="focused" inputTop={456}>
      <div class="absolute left-[48px] top-[421px] flex gap-[18px]" style={`font-size:8px;color:${t.label3}`}>
        <span>粘贴</span><span>自动填充</span><span>粘贴并发送</span><span>换行</span>
      </div>
      <Keyboard mode={props.mode} ret="disabled" />
    </HomeScreen>
  );
}

/// 14: "帮我创建技能：" typed from the skills page, ready to send.
export function SkillCreate(props: { mode: Mode }): Markup {
  return (
    <HomeScreen mode={props.mode} greeting={false} chips={false} input="text" inputTop={456} text="帮我创建技能：">
      <Keyboard mode={props.mode} ret="send" />
    </HomeScreen>
  );
}

type MenuRow = { icon: IconName; label: string; detail?: string; detailIcon?: IconName; check?: boolean };
const MODE_MENU: (MenuRow | "divider")[] = [
  { icon: "bubble", label: "对话", check: true },
  { icon: "work-task", label: "工作任务" },
  "divider",
  { icon: "model", label: "模型", detail: "快速", detailIcon: "chevron-up-down" },
  "divider",
  { icon: "sparkle", label: "豆包订阅", detail: "立即升级", detailIcon: "arrow-up-right" },
];

/// 23: the menu that opens from the "对话 ›" chip.
export function ModeMenu(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <HomeScreen mode={props.mode}>
      <div class="absolute left-[13px] top-[472px]">
        <GlassSurface mode={props.mode} width={238} height={220} radius={24} kind="bar" floating fill={props.mode === "dark" ? "rgb(37 37 37 / 0.94)" : "rgb(255 255 255 / 0.94)"} class="flex flex-col px-[22px] pt-[16px]">
          {MODE_MENU.map((row) =>
            row === "divider"
              ? <div class="my-[9px] h-px" style={`background:${t.divider}`} />
              : (
                <div class="flex h-[40px] items-center gap-[10px]" style="font-size:16px">
                  <Icon name={row.icon} size={18} weight={1.8} />
                  <span class="flex-1">{row.label}</span>
                  {row.check && <Icon name="check" size={18} weight={2} />}
                  {row.detail && <span class="flex items-center gap-1" style={`color:${t.label3};font-size:15px`}>{row.detail}<Icon name={row.detailIcon!} size={13} weight={2} /></span>}
                </div>
              )
          )}
        </GlassSurface>
      </div>
    </HomeScreen>
  );
}
