import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";
import { Icon, type IconName } from "../../macos27/components/icons.tsx";
import { TrafficLights } from "../../macos27/components/traffic-lights.tsx";
import { Glass } from "./glass.tsx";
import { Stage } from "./lab.tsx";

// macOS 27 controls drawn with hyalite glass. Geometry is the macos27 kit's, from the Figma specs
// (figma/reference/macos27/specs, as recorded in design/system/macos27/components/*.tsx):
//   window radius 16, shadow 0 18 54; toolbar parts are glass capsules 36 high (XL), symbols
//   #1A1A1A / #F5F5F5; push button 67 x 24, radius 6, 13 pt Medium; segmented 24 high, radius 6
//   search field 120 x 24 capsule; menu 244 wide, radius 12, 24 pt items, key row #0069F9
//   switch (medium) 54 x 24, knob 32 x 20, clicked knob a glass pill 23 % larger
//   slider groove 4 high, knob 20 x 16; popover 200 x 200, radius 20; alert 260 wide, radius 34
// The sidebar of a macOS 27 window floats as glass inside the window, 8 pt in from its edge.

const ACCENT = "#0088ff";
const ink = (mode: Mode) => (mode === "light" ? "#1a1a1a" : "#f5f5f5");
const dim = (mode: Mode) => (mode === "light" ? "rgb(0 0 0 / 0.5)" : "rgb(255 255 255 / 0.55)");
const fill = (mode: Mode, a: number) => (mode === "light" ? `rgb(0 0 0 / ${a})` : `rgb(255 255 255 / ${a})`);
const TEXT = "font-size:13px;line-height:16px;font-weight:500";

function Row(props: { gap?: number; children: Child }): Markup {
  return <div class="flex items-center" style={`gap:${props.gap ?? 10}px`}>{props.children}</div>;
}

function ToolbarButton(props: { mode: Mode; icon: IconName }): Markup {
  return (
    <Glass mode={props.mode} width={36} height={36} radius={18} class="grid place-items-center" style={`color:${ink(props.mode)}`}>
      <Icon name={props.icon} size={16} />
    </Glass>
  );
}

function ToolbarSegmented(props: { mode: Mode; icons: IconName[] }): Markup {
  return (
    <Glass mode={props.mode} width={props.icons.length * 36 + 4} height={36} radius={18} class="flex items-center px-[2px]" style={`color:${ink(props.mode)}`}>
      {props.icons.map((icon, i) => (
        <div class="grid h-8 w-9 place-items-center rounded-full" style={i === 0 ? `background:${fill(props.mode, 0.08)}` : ""}><Icon name={icon} size={15} /></div>
      ))}
    </Glass>
  );
}

function ToolbarSearch(props: { mode: Mode; width: number }): Markup {
  return (
    <Glass mode={props.mode} width={props.width} height={36} radius={18} class="flex items-center gap-[6px] px-3" style={`color:${dim(props.mode)};${TEXT}`}>
      <Icon name="magnifyingglass" size={14} /><span>搜索</span>
    </Glass>
  );
}

const SIDEBAR: { icon: IconName; text: string }[] = [
  { icon: "house", text: "最近项目" },
  { icon: "folder", text: "文稿" },
  { icon: "star", text: "收藏" },
  { icon: "tag", text: "标签" },
];

/// A window: the content is a stage of its own (it follows the panel's backdrop), with the glass
/// sidebar floating over it and glass toolbar items on top.
export function WindowWithSidebar(props: { mode: Mode }): Markup {
  const shadow = props.mode === "light" ? "0 18px 54px rgb(0 0 0 / 0.3),0 0 0 0.5px rgb(0 0 0 / 0.2)" : "0 18px 54px rgb(0 0 0 / 0.6),0 0 0 0.5px rgb(255 255 255 / 0.2)";
  return (
    <Stage mode={props.mode} width={440} height={300} bg="photo" radius={16} style={`box-shadow:${shadow}`}>
      <div class="absolute left-2 top-2">
        <Glass mode={props.mode} width={170} height={284} radius={16} class="px-2 pt-[14px]" style={`color:${ink(props.mode)};${TEXT}`}>
          <div class="pl-[10px]"><TrafficLights mode={props.mode} active /></div>
          <div class="mt-[18px] flex flex-col gap-[2px]">
            {SIDEBAR.map((r, i) => (
              <div class="flex h-8 items-center gap-2 rounded-[8px] px-[10px]" style={i === 0 ? `background:${fill(props.mode, 0.08)}` : ""}>
                <span style={`color:${ACCENT}`}><Icon name={r.icon} size={15} /></span>{r.text}
              </div>
            ))}
          </div>
        </Glass>
      </div>
      <span class="absolute left-[196px] top-[16px]" style={`${TEXT};font-weight:700;color:${ink(props.mode)}`}>文稿</span>
      <div class="absolute right-2 top-2 flex gap-2">
        <ToolbarSegmented mode={props.mode} icons={["square", "slider"]} />
        <ToolbarSearch mode={props.mode} width={120} />
      </div>
    </Stage>
  );
}

function PushButton(props: { mode: Mode; text: string; prominent?: boolean }): Markup {
  return (
    <Glass
      mode={props.mode}
      width={67}
      height={24}
      radius={6}
      tint={props.prominent ? "rgb(0 136 255 / 0.92)" : undefined}
      class="grid place-items-center"
      style={`color:${props.prominent ? "#fff" : ink(props.mode)};${TEXT}`}
    >
      {props.text}
    </Glass>
  );
}

export function Buttons(props: { mode: Mode }): Markup {
  return (
    <div class="flex flex-col items-center gap-5">
      <Row>
        <ToolbarButton mode={props.mode} icon="sidebar.left" />
        <ToolbarButton mode={props.mode} icon="plus" />
        <Glass mode={props.mode} width={72} height={36} radius={18} class="grid place-items-center" style={`color:${ink(props.mode)};${TEXT}`}>共享</Glass>
      </Row>
      <Row><PushButton mode={props.mode} text="取消" /><PushButton mode={props.mode} text="好" prominent /></Row>
    </div>
  );
}

export function Segmented(props: { mode: Mode }): Markup {
  return (
    <div class="flex flex-col items-center gap-5">
      <ToolbarSegmented mode={props.mode} icons={["square", "slider", "doc"]} />
      <div class="flex h-6 items-center rounded-[6px] p-[2px]" style={`background:${fill(props.mode, 0.08)};color:${ink(props.mode)};${TEXT}`}>
        {["日", "周", "月"].map((t, i) => (
          <div class="grid h-5 w-14 place-items-center rounded-[6px]" style={i === 0 ? `background:${ACCENT};color:#fff` : ""}>{t}</div>
        ))}
      </div>
    </div>
  );
}

export function Fields(props: { mode: Mode }): Markup {
  return (
    <div class="flex flex-col items-center gap-5">
      <ToolbarSearch mode={props.mode} width={220} />
      <div class="flex h-6 w-[220px] items-center rounded-[6px] px-2" style={`background:${props.mode === "light" ? "#fff" : "#1e1e1e"};box-shadow:0 0 0 0.5px ${fill(props.mode, 0.12)};color:${dim(props.mode)};${TEXT}`}>文本框（实色，非玻璃）</div>
    </div>
  );
}

type MenuRow = { text: string; key?: string; more?: boolean; hover?: boolean } | "separator";
const MENU: MenuRow[] = [
  { text: "新建窗口", key: "⌘N" },
  { text: "打开…", key: "⌘O" },
  { text: "最近使用", more: true, hover: true },
  "separator",
  { text: "关闭窗口", key: "⌘W" },
  { text: "存储…", key: "⌘S" },
];

export function Menu(props: { mode: Mode }): Markup {
  return (
    <Glass mode={props.mode} width={244} height={150} radius={12} class="flex flex-col px-[5px] py-[5px]" style={`color:${ink(props.mode)};${TEXT}`}>
      {MENU.map((row) =>
        row === "separator"
          ? <div class="mx-[7px] my-[5px] h-px" style={`background:${fill(props.mode, 0.1)}`} />
          : (
            <div class="flex h-6 items-center justify-between rounded-[8px] px-[7px]" style={row.hover ? "background:#0069f9;color:#fff" : ""}>
              <span>{row.text}</span>
              {row.key && <span style={row.hover ? "" : `color:${dim(props.mode)}`}>{row.key}</span>}
              {row.more && <Icon name="chevron.right" size={11} weight={1.8} />}
            </div>
          )
      )}
    </Glass>
  );
}

function SwitchTrack(props: { mode: Mode; on: boolean; clicked?: boolean }): Markup {
  const left = props.on ? 54 - 2 - 32 : 2;
  return (
    <div class="relative h-6 w-[54px] rounded-full" style={`background:${props.on ? ACCENT : fill(props.mode, 0.1)}`}>
      {props.clicked
        ? <div class="absolute" style={`left:${left - 3.5}px;top:-0.5px`}><Glass mode={props.mode} width={39} height={25} radius={12.5} /></div>
        : <div class="absolute top-[2px] h-5 w-8 rounded-full bg-white" style={`left:${left}px;box-shadow:0 3px 8px rgb(0 0 0 / 0.15),0 0 1px rgb(0 0 0 / 0.3)`} />}
    </div>
  );
}

export function Toggles(props: { mode: Mode }): Markup {
  return (
    <Row gap={28}>
      <SwitchTrack mode={props.mode} on={false} />
      <SwitchTrack mode={props.mode} on />
      <SwitchTrack mode={props.mode} on clicked />
      <div class="flex items-center gap-[3px]" style={`color:${ink(props.mode)};${TEXT}`}>
        <div class="grid size-4 place-items-center rounded-[5.5px] text-white" style={`background:${ACCENT}`}><Icon name="check" size={11} weight={2.2} /></div>复选框
      </div>
    </Row>
  );
}

function SliderRow(props: { mode: Mode; clicked?: boolean }): Markup {
  return (
    <div class="relative h-6 w-[240px]">
      <div class="absolute inset-x-0 top-[10px] h-1 rounded-full" style={`background:${fill(props.mode, 0.1)}`} />
      <div class="absolute left-0 top-[10px] h-1 w-[140px] rounded-full" style={`background:${ACCENT}`} />
      {props.clicked
        ? <div class="absolute left-[124px] top-[-1px]"><Glass mode={props.mode} width={32} height={26} radius={13} /></div>
        : <div class="absolute left-[130px] top-1 h-4 w-5 rounded-full bg-white" style="box-shadow:0 0.5px 2px rgb(0 0 0 / 0.35)" />}
    </div>
  );
}

export function SliderRows(props: { mode: Mode }): Markup {
  return <div class="flex flex-col gap-4"><SliderRow mode={props.mode} /><SliderRow mode={props.mode} clicked /></div>;
}

export function Popover(props: { mode: Mode }): Markup {
  return (
    <Glass mode={props.mode} width={200} height={200} radius={20} class="flex flex-col gap-3 p-4" style={`color:${ink(props.mode)};${TEXT}`}>
      <span style="font-weight:700">显示</span>
      {["显示路径栏", "显示状态栏", "显示预览"].map((t, i) => (
        <div class="flex items-center justify-between">{t}<SwitchTrack mode={props.mode} on={i !== 1} /></div>
      ))}
      <span style={`color:${dim(props.mode)};font-size:11px`}>图标大小</span>
      <div class="relative h-1 rounded-full" style={`background:${fill(props.mode, 0.1)}`}><div class="h-1 w-1/2 rounded-full" style={`background:${ACCENT}`} /></div>
    </Glass>
  );
}

export function Alert(props: { mode: Mode }): Markup {
  return (
    <Glass mode={props.mode} width={260} height={238} radius={34} class="flex flex-col items-center px-4 pb-4 pt-5 text-center" style={`color:${ink(props.mode)}`}>
      <div class="size-16 rounded-[14px]" style="background:linear-gradient(160deg,#5ac8fa,#007aff)" />
      <div class="mt-[14px]" style="font-size:13px;line-height:16px;font-weight:700">要存储对“未命名”所做的更改吗？</div>
      <div class="mt-1" style="font-size:11px;line-height:14px">如果不存储，你的更改将会丢失。</div>
      <div class="mt-auto flex w-full gap-2" style={TEXT}>
        <div class="grid h-8 flex-1 place-items-center rounded-full" style={`background:${fill(props.mode, 0.1)}`}>不存储</div>
        <div class="grid h-8 flex-1 place-items-center rounded-full text-white" style={`background:${ACCENT}`}>存储</div>
      </div>
    </Glass>
  );
}

/// The matrix sample: a toolbar button, a segmented capsule and a search capsule.
export function Sample(props: { mode: Mode }): Markup {
  return (
    <div class="flex flex-col items-center gap-3">
      <Row gap={8}><ToolbarButton mode={props.mode} icon="plus" /><ToolbarSegmented mode={props.mode} icons={["square", "slider"]} /></Row>
      <ToolbarSearch mode={props.mode} width={150} />
    </div>
  );
}
