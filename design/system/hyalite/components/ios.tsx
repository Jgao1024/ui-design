import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";
import { Icon, type IconName } from "../../ios27/components/icon.tsx";
import { Glass } from "./glass.tsx";

// iOS 27 controls drawn with hyalite glass. Geometry is the ios27 kit's, from the Figma specs
// (figma/reference/ios27/specs, as recorded in design/system/ios27/components/*.tsx):
//   glass symbol button 44 / 50; text buttons Medium 34 tall (12 / 8 padding), Large 50 (20 / 16)
//   toolbar 402 x 54, 44 pt buttons, button group 88 x 44 for two symbols
//   tab bar 62 tall, tabs 54, labels 10 / 590; with Search Role 290 wide + a 54 search circle 12 away
//   segmented 32 tall, fill #767680 12 %, 2 pt inset; switch 64 x 28, knob 38 x 24;
//   pressed knob (switch, slider, segment) is a 58 x 38 glass lens
//   menu 238 wide, 40 pt items; alert 300 wide, radius 34, 14 pt padding, 48 pt buttons
// Flat parts (tracks, fills) are drawn flat, as on iOS; only the glass layers are hyalite.

const BLUE = "#0088ff";
const label = (mode: Mode) => (mode === "light" ? "#000000" : "#ffffff");
const secondary = (mode: Mode) => (mode === "light" ? "rgb(60 60 67 / 0.6)" : "rgb(235 235 245 / 0.6)");
const trackFill = (mode: Mode) => (mode === "light" ? "rgb(118 118 128 / 0.12)" : "rgb(118 118 128 / 0.24)");

function Row(props: { gap?: number; children: Child }): Markup {
  return <div class="flex items-center" style={`gap:${props.gap ?? 12}px`}>{props.children}</div>;
}

export function SymbolButton(props: { mode: Mode; icon: IconName; size?: 44 | 50 }): Markup {
  const size = props.size ?? 44;
  return (
    <Glass mode={props.mode} width={size} height={size} radius={size / 2} class="grid place-items-center" style={`color:${label(props.mode)}`}>
      <Icon name={props.icon} size={size === 50 ? 24 : 22} weight={2} />
    </Glass>
  );
}

export function TextButton(props: { mode: Mode; text: string; width: number; size: "medium" | "large"; prominent?: boolean }): Markup {
  const h = props.size === "large" ? 50 : 34;
  return (
    <Glass
      mode={props.mode}
      width={props.width}
      height={h}
      radius={h / 2}
      tint={props.prominent ? "rgb(0 136 255 / 0.92)" : undefined}
      class="grid place-items-center"
      style={`color:${props.prominent ? "#fff" : label(props.mode)};font-size:${props.size === "large" ? 17 : 15}px;font-weight:510`}
    >
      {props.text}
    </Glass>
  );
}

export function Buttons(props: { mode: Mode }): Markup {
  return (
    <div class="flex flex-col items-center gap-4">
      <Row>
        <SymbolButton mode={props.mode} icon="chevron-left" />
        <SymbolButton mode={props.mode} icon="plus" size={50} />
        <TextButton mode={props.mode} text="Label" width={70} size="medium" />
      </Row>
      <Row>
        <TextButton mode={props.mode} text="Continue" width={120} size="large" />
        <TextButton mode={props.mode} text="完成" width={96} size="large" prominent />
      </Row>
    </div>
  );
}

export function Toolbar(props: { mode: Mode }): Markup {
  return (
    <div class="relative h-[54px] w-[402px]">
      <div class="absolute left-4 top-[5px]"><SymbolButton mode={props.mode} icon="chevron-left" /></div>
      <span class="absolute inset-x-0 top-[16px] text-center" style={`font-size:17px;line-height:22px;font-weight:590;color:${label(props.mode)}`}>标题</span>
      <div class="absolute right-4 top-[5px]">
        <Glass mode={props.mode} width={88} height={44} radius={22} class="flex items-center justify-around px-1" style={`color:${label(props.mode)}`}>
          <Icon name="share" size={21} weight={2} /><Icon name="ellipsis" size={21} weight={2} />
        </Glass>
      </div>
    </div>
  );
}

const TABS: { icon: IconName; text: string }[] = [
  { icon: "house-fill", text: "首页" },
  { icon: "heart", text: "收藏" },
  { icon: "bell", text: "通知" },
  { icon: "person", text: "我的" },
];

export function TabBar(props: { mode: Mode }): Markup {
  const dark = props.mode === "dark";
  return (
    <Row>
      <Glass mode={props.mode} width={290} height={62} radius={31} class="flex items-center px-1">
        {TABS.map((t, i) => (
          <div
            class="flex h-[54px] flex-1 flex-col items-center justify-center gap-[2px] rounded-full"
            style={`color:${i === 0 ? BLUE : label(props.mode)};${i === 0 ? `background:${dark ? "rgb(255 255 255 / 0.1)" : "rgb(0 0 0 / 0.06)"}` : ""}`}
          >
            <Icon name={t.icon} size={22} weight={1.8} />
            <span style="font-size:10px;line-height:12px;font-weight:590">{t.text}</span>
          </div>
        ))}
      </Glass>
      <Glass mode={props.mode} width={54} height={54} radius={27} class="grid place-items-center" style={`color:${label(props.mode)}`}>
        <Icon name="search" size={22} weight={2} />
      </Glass>
    </Row>
  );
}

function Segments(props: { mode: Mode; pressed?: boolean }): Markup {
  const dark = props.mode === "dark";
  const items = ["日", "周", "月"];
  return (
    <div class="relative flex h-8 w-[300px] items-center rounded-full p-[2px]" style={`background:${trackFill(props.mode)}`}>
      {items.map((t, i) => (
        <div class="relative grid h-7 flex-1 place-items-center" style={`font-size:13.3px;font-weight:${i === 1 ? 590 : 510};color:${label(props.mode)}`}>
          {i === 1 && !props.pressed && <div class="absolute inset-0 rounded-full" style={`background:${dark ? "#636366" : "#fff"};box-shadow:0 2px 20px rgb(0 0 0 / 0.06)`} />}
          <span class="relative">{t}</span>
        </div>
      ))}
      {props.pressed && <div class="absolute left-[95px] top-[-5px]"><Glass mode={props.mode} width={110} height={42} radius={21} /></div>}
    </div>
  );
}

export function SegmentedControl(props: { mode: Mode }): Markup {
  return <div class="flex flex-col items-center gap-6"><Segments mode={props.mode} /><Segments mode={props.mode} pressed /></div>;
}

function SwitchTrack(props: { mode: Mode; on: boolean; pressed?: boolean }): Markup {
  const off = props.mode === "light" ? "rgb(120 120 128 / 0.16)" : "rgb(120 120 128 / 0.32)";
  return (
    <div class="relative h-7 w-16 rounded-full" style={`background:${props.on ? "#34c759" : off}`}>
      {props.pressed
        ? <div class="absolute left-[14px] top-[-5px]"><Glass mode={props.mode} width={58} height={38} radius={19} /></div>
        : <div class="absolute top-[2px] h-6 w-[38px] rounded-full bg-white" style={`left:${props.on ? 24 : 2}px;box-shadow:0 3px 8px rgb(0 0 0 / 0.15)`} />}
    </div>
  );
}

export function Switches(props: { mode: Mode }): Markup {
  return <Row gap={36}><SwitchTrack mode={props.mode} on={false} /><SwitchTrack mode={props.mode} on /><SwitchTrack mode={props.mode} on pressed /></Row>;
}

function SliderRow(props: { mode: Mode; pressed?: boolean }): Markup {
  const groove = props.mode === "light" ? "rgb(120 120 120 / 0.2)" : "rgb(120 120 128 / 0.36)";
  return (
    <div class="relative h-[38px] w-[340px]">
      <div class="absolute inset-x-0 top-4 h-[6px] rounded-full" style={`background:${groove}`} />
      <div class="absolute left-0 top-4 h-[6px] w-[204px] rounded-full" style={`background:${BLUE}`} />
      {props.pressed
        ? <div class="absolute left-[175px] top-0"><Glass mode={props.mode} width={58} height={38} radius={19} /></div>
        : <div class="absolute left-[185px] top-[7px] h-6 w-[38px] rounded-full bg-white" style="box-shadow:0 6px 13px rgb(0 0 0 / 0.12)" />}
    </div>
  );
}

export function Sliders(props: { mode: Mode }): Markup {
  return <div class="flex flex-col gap-4"><SliderRow mode={props.mode} /><SliderRow mode={props.mode} pressed /></div>;
}

export function SearchAndInput(props: { mode: Mode }): Markup {
  const c = label(props.mode), dim = secondary(props.mode);
  return (
    <div class="flex flex-col items-center gap-5">
      <Glass mode={props.mode} width={360} height={48} radius={24} class="flex items-center gap-2 px-4" style={`color:${dim};font-size:17px`}>
        <Icon name="search" size={20} weight={2} /><span class="flex-1">搜索</span><Icon name="mic" size={20} weight={2} />
      </Glass>
      <Row gap={8}>
        <Glass mode={props.mode} width={44} height={44} radius={22} class="grid place-items-center" style={`color:${c}`}><Icon name="plus" size={22} weight={2} /></Glass>
        <Glass mode={props.mode} width={300} height={44} radius={22} class="flex items-center px-4" style={`color:${dim};font-size:17px`}>
          <span class="flex-1">发消息</span><Icon name="mic" size={20} weight={2} />
        </Glass>
      </Row>
    </div>
  );
}

const MENU: ({ icon: IconName; text: string; red?: boolean } | "divider")[] = [
  { icon: "copy", text: "拷贝" },
  { icon: "share", text: "共享" },
  { icon: "pencil", text: "重命名" },
  "divider",
  { icon: "trash", text: "删除", red: true },
];

export function Menu(props: { mode: Mode }): Markup {
  const divider = props.mode === "light" ? "rgb(0 0 0 / 0.1)" : "rgb(255 255 255 / 0.12)";
  return (
    <Glass mode={props.mode} width={238} height={197} radius={34} class="flex flex-col px-6 py-[14px]">
      {MENU.map((row) =>
        row === "divider"
          ? <div class="my-[4px] h-px" style={`background:${divider}`} />
          : (
            <div class="flex h-10 items-center justify-between" style={`font-size:17px;color:${row.red ? "#ff383c" : label(props.mode)}`}>
              <span>{row.text}</span><Icon name={row.icon} size={19} weight={1.8} />
            </div>
          )
      )}
    </Glass>
  );
}

export function Alert(props: { mode: Mode }): Markup {
  const c = label(props.mode);
  return (
    <Glass mode={props.mode} width={300} height={172} radius={34} class="flex flex-col p-[14px]">
      <div class="px-[14px] pt-[10px] text-center">
        <div style={`font-size:17px;line-height:22px;font-weight:600;color:${c}`}>删除这张照片？</div>
        <div class="mt-1" style={`font-size:15px;line-height:20px;color:${c}`}>删除后会移到“最近删除”，30 天后彻底删除。</div>
      </div>
      <div class="mt-auto flex gap-2" style="font-size:17px;line-height:22px;font-weight:600">
        <div class="grid h-12 flex-1 place-items-center rounded-full" style={`background:rgb(120 120 128 / 0.16);color:${c}`}>取消</div>
        <div class="grid h-12 flex-1 place-items-center rounded-full text-white" style={`background:${BLUE}`}>删除</div>
      </div>
    </Glass>
  );
}

export function Sheet(props: { mode: Mode }): Markup {
  const c = label(props.mode), dim = secondary(props.mode);
  const divider = props.mode === "light" ? "rgb(0 0 0 / 0.1)" : "rgb(255 255 255 / 0.12)";
  return (
    <div class="absolute inset-x-[6px] bottom-[6px]">
      <Glass mode={props.mode} width={408} height={250} radius={38} class="flex flex-col px-5">
        <div class="mx-auto mt-[6px] h-[5px] w-9 rounded-full" style={`background:${dim}`} />
        <div class="mt-3 text-center" style={`font-size:17px;line-height:22px;font-weight:600;color:${c}`}>显示选项</div>
        {["按日期排序", "按名称排序", "显示隐藏的项目"].map((t, i) => (
          <div class="flex h-[52px] items-center justify-between" style={`font-size:17px;color:${c};${i > 0 ? `border-top:1px solid ${divider}` : "margin-top:12px"}`}>
            {t}{i === 0 && <span style={`color:${BLUE}`}><Icon name="checkmark" size={18} weight={2.2} /></span>}
          </div>
        ))}
      </Glass>
    </div>
  );
}

/// The matrix sample: a symbol button, a text button and a search capsule.
export function Sample(props: { mode: Mode }): Markup {
  return (
    <div class="flex flex-col items-center gap-3">
      <Row gap={8}>
        <SymbolButton mode={props.mode} icon="plus" />
        <TextButton mode={props.mode} text="按钮" width={88} size="medium" />
      </Row>
      <Glass mode={props.mode} width={150} height={40} radius={20} class="flex items-center gap-2 px-3" style={`color:${secondary(props.mode)};font-size:15px`}>
        <Icon name="search" size={17} weight={2} /><span>搜索</span>
      </Glass>
    </div>
  );
}
