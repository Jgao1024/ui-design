import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../../doubao/theme.ts";
import { At, ChipRow, SCREEN, StatusBar } from "../../doubao/components/chrome.tsx";
import { Icon, type IconName } from "../../doubao/components/icons.tsx";
import { Glass } from "./glass.tsx";

// The Doubao home screen (a new chat) with hyalite glass. Geometry is the doubao kit's, measured
// from design/.ref/doubao/device/<mode>/01-home.png; only the glass is new:
//   top buttons: 44 pt circles at x 12 and 337, y 59; input bar: 369 x 56, radius 20, at x 12, y 750
//   greeting 22 bold centred on y 289; segment 245 x 49 at x 74, y 323, thumb 120 x 44
// The screen is `.hl-screen`, so the panel's background buttons can put something behind the glass.

function RoundButton(props: { mode: Mode; icon: IconName }): Markup {
  return (
    <Glass mode={props.mode} width={44} height={44} radius={22} class="grid place-items-center" style={`color:${tone(props.mode).label}`}>
      <Icon name={props.icon} size={24} weight={2} />
    </Glass>
  );
}

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

function InputBar(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <At x={12} y={750}>
      <Glass mode={props.mode} width={369} height={56} radius={20} class="flex items-center pl-4 pr-[16px]" style={`color:${t.label}`}>
        <Icon name="camera" size={25} weight={2} />
        <span class="ml-[10px] flex-1" style={`color:${t.label3};font-size:17px`}>发消息或按住说话...</span>
        <Icon name="voice" size={26} weight={1.9} />
        <span class="ml-[18px]"><Icon name="plus-circle" size={26} weight={1.9} /></span>
      </Glass>
    </At>
  );
}

export function HomeScreen(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <div
      class="hl-screen relative overflow-hidden rounded-[55px] bg-cover bg-center"
      data-mode={props.mode}
      style={`width:${SCREEN.width}px;height:${SCREEN.height}px;background-color:${t.bg};color:${t.label}${props.mode === "light" ? ";box-shadow:0 0 0 1px #e5e5e5" : ""}`}
    >
      <At x={12} y={59}><RoundButton mode={props.mode} icon="menu" /></At>
      <span class="absolute inset-x-0 top-[70px] text-center" style="font-size:17px;line-height:22px;font-weight:600">豆包</span>
      <At x={337} y={59}><RoundButton mode={props.mode} icon="speaker-mute" /></At>
      <Greeting mode={props.mode} />
      <ChipRow mode={props.mode} />
      <InputBar mode={props.mode} />
      <StatusBar mode={props.mode} />
    </div>
  );
}
