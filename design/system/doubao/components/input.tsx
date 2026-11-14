import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { At, ChipRow, HomeTopBar, InputBar, Screen } from "./chrome.tsx";
import { GlassSurface } from "./glass.tsx";
import { HomeScreen } from "./home.tsx";
import { Icon, type IconName } from "./icons.tsx";

// Input states, measured from 03-plus, 04-voice, 05-photo and 08-project-sheet:
//   plus panel: chips move to y 434, the bar to y 466; four 86 x 86 tiles at y 538, 8 apart
//   hold to talk: a blue glow rises from the bottom; samples down the middle (y 650 to 850):
//     Dark #04182B #0952A6 #086EEC #0C73F4 #1581F6, Light #D8ECFE #5EA7F9 #1276F5 #0C74F5 #1481F7,
//     and cyan at the bottom corners (#2CA6FB)
//   project sheet: a 368 wide glass card from y 599 (Dark) or 619 (Light) to 805 that holds the
//     input row; the selected project row is #323232 / #F2F2F2
//   camera: black in both modes, viewfinder #101010 from y 137 to 661

const TILES: { icon: IconName; label: string }[] = [
  { icon: "camera-fill", label: "相机" },
  { icon: "photo-fill", label: "相册" },
  { icon: "paperclip", label: "文件" },
  { icon: "phone-fill", label: "打电话" },
];

/// 03: the ⊕ panel. The photo library has no permission, so it offers the camera instead.
export function PlusPanel(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <Screen mode={props.mode}>
      <HomeTopBar mode={props.mode} />
      <ChipRow mode={props.mode} top={434} />
      <InputBar mode={props.mode} variant="close" top={466} />
      <div class="absolute left-3 top-[538px] flex gap-2">
        {TILES.map((tile) => (
          <div class="flex h-[86px] w-[86px] flex-col items-center rounded-[14px] pt-[22px]" style={`background:${t.card}`}>
            <Icon name={tile.icon} size={24} />
            <span class="mt-[8px]" style={`font-size:13px;color:${t.label2}`}>{tile.label}</span>
          </div>
        ))}
      </div>
      <span class="absolute inset-x-0 top-[651px] text-center" style={`font-size:14px;color:${t.label2}`}>相册暂无可访问照片，可拍照发送图片</span>
      <At center y={682}><div class="grid h-[34px] w-[69px] place-items-center rounded-[10px]" style={`background:${t.card};font-size:14px;font-weight:500`}>去拍照</div></At>
    </Screen>
  );
}

const GLOW = {
  dark: "#1581f6 0%,#0c73f4 20%,#086eec 40%,#0952a6 60%,#04182b 79%,rgb(0 0 0 / 0) 90%",
  light: "#1481f7 0%,#0c74f5 20%,#1276f5 40%,#5ea7f9 60%,#d8ecfe 79%,rgb(255 255 255 / 0) 90%",
};

/// 04: holding the input bar to talk. The bar and chips give way to a glow, a hint and a level meter.
export function VoiceHold(props: { mode: Mode }): Markup {
  const bars = Array.from({ length: 68 }, (_, i) => 3 + ((i * 7) % 5) * 0.6);
  return (
    <HomeScreen mode={props.mode} chips={false} input="none">
      <div class="absolute inset-x-0 bottom-0 h-[252px]" style={`background:radial-gradient(60% 55% at 0% 100%,rgb(44 166 251 / 0.85),rgb(44 166 251 / 0) 100%),radial-gradient(60% 55% at 100% 100%,rgb(44 166 251 / 0.85),rgb(44 166 251 / 0) 100%),radial-gradient(120% 100% at 50% 100%,${GLOW[props.mode]})`} />
      <span class="absolute inset-x-0 top-[713px] text-center text-white" style="font-size:13px;opacity:0.85">松手发送，上移取消</span>
      <div class="absolute left-[60px] top-[772px] flex h-3 w-[272px] items-center justify-between">
        {bars.map((h) => <span class="w-[1.5px] rounded-full bg-white" style={`height:${h}px;opacity:0.9`} />)}
      </div>
    </HomeScreen>
  );
}

/// 08: choosing a project. The sheet grows out of the input bar; Dark was captured in voice mode.
export function ProjectSheet(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const top = dark ? 599 : 619;
  return (
    <Screen mode={props.mode}>
      <HomeTopBar mode={props.mode} />
      <div class="absolute left-3" style={`top:${top}px`}>
        <GlassSurface mode={props.mode} width={368} height={805 - top} radius={22} kind="bar" floating fill={dark ? "rgb(32 32 32 / 0.96)" : "rgb(255 255 255 / 0.96)"} />
      </div>
      <div class="absolute left-[178px] h-[4px] w-9 rounded-full" style={`top:${top + 9}px;background:${dark ? "#4a4a4a" : "#dcdcdc"}`} />
      <span class="absolute left-[28px]" style={`top:${top + 23}px;font-size:13px;color:${t.label3}`}>选择项目</span>
      <span class="absolute left-[346px] grid size-5 place-items-center rounded-full" style={`top:${top + 22}px;background:${dark ? "#3a3a3a" : "#f0f0f0"};color:${dark ? "#8a8a8a" : "#8a8a8a"}`}><Icon name="xmark" size={11} weight={2.6} /></span>
      <div class="absolute left-[22px] flex h-10 w-[348px] items-center gap-[10px] rounded-[10px] px-3" style={`top:${top + 53}px;background:${t.selected};font-size:16px`}>
        <Icon name="folder" size={18} weight={1.8} />acp-web
      </div>
      <div class="absolute left-[34px] flex items-center gap-[10px]" style={`top:${dark ? 714 : 732}px;font-size:16px`}>
        <Icon name="plus" size={18} weight={2} />创建新项目
      </div>
      <InputBar mode={props.mode} variant={dark ? "hold" : "default"} top={750} bare />
    </Screen>
  );
}

/// 05: 豆包 AI 相机. Black in both modes; the tip under the viewfinder changes every time.
export function Camera(props: { mode: Mode; tip: string }): Markup {
  const corner = (rot: number, x: number, y: number) => (
    <svg class="absolute" style={`left:${x}px;top:${y}px;transform:rotate(${rot}deg)`} width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2" aria-hidden="true">
      <path d="M1 48V17A16 16 0 0 1 17 1h31" />
    </svg>
  );
  return (
    <Screen mode={props.mode} bg="#000000" statusColor="#ffffff">
      <span class="absolute left-[18px] top-[69px] text-white"><Icon name="xmark" size={24} weight={2} /></span>
      <span class="absolute inset-x-0 top-[68px] text-center text-white" style="font-size:20px;line-height:26px;font-weight:700">豆包 AI 相机</span>
      <span class="absolute left-[351px] top-[69px] text-white"><Icon name="flash-off" size={24} weight={1.8} /></span>
      <div class="absolute inset-x-0 top-[137px] h-[524px]" style="background:#101010">
        {corner(0, 40, 104)}{corner(90, 306, 104)}{corner(270, 40, 372)}{corner(180, 306, 372)}
        <div class="absolute left-[112px] top-[478px] flex items-center gap-[15px] text-white" style="font-size:13px;font-weight:600">
          <span class="w-7 text-center opacity-80">0.5</span>
          <span class="grid size-7 place-items-center rounded-full" style="background:#0b0b0b;color:#ffd60a">1x</span>
          <span class="w-7 text-center opacity-80">2</span>
          <span class="w-7 text-center opacity-80">3</span>
        </div>
      </div>
      <span class="absolute inset-x-0 top-[677px] text-center" style="font-size:14px;color:#ff8f9f">{props.tip}</span>
      <div class="absolute left-[28px] top-[721px] grid size-[50px] place-items-center rounded-[14px] text-white" style="background:#191919"><Icon name="photo" size={24} weight={1.8} /></div>
      <div class="absolute left-[158px] top-[713px] grid size-[76px] place-items-center rounded-full" style="box-shadow:inset 0 0 0 4px #fff"><div class="size-[62px] rounded-full bg-white" /></div>
      <div class="absolute left-[315px] top-[721px] grid size-[50px] place-items-center rounded-[14px] text-white" style="background:#191919"><Icon name="flip" size={24} weight={1.8} /></div>
      <span class="absolute left-[186px] top-[806px] text-white opacity-80"><Icon name="chevron-up" size={20} weight={2} /></span>
    </Screen>
  );
}
