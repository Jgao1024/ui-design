import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { GlassSurface } from "./glass.tsx";
import { LensGlass } from "./lens.tsx";
import { Icon, type IconName } from "./icons.tsx";

// Parts every Doubao screen shares. Positions are in pt on the 393 x 852 iPhone 15 Pro screen,
// measured from design/.ref/doubao/device/<mode>/*.png (pixels / 3):
//   top buttons: 44 pt glass circles at x 12 and 337, y 59; the ≡ ✎ pair is a 96 x 44 capsule
//   chips: 37 tall at y 700, 8 apart; input bar: 369 x 56 at x 12, y 750
//   keyboard: from y 524, keys 32.4 x 42 with 6.4 gaps, rows centred on y 598, 652, 706, 759

export const SCREEN = { width: 393, height: 852 } as const;

/// Places a part at (x, y) in screen points.
export function At(props: { x?: number; y: number; right?: number; center?: boolean; children?: Child }): Markup {
  const place = props.center
    ? "left:0;right:0;display:flex;justify-content:center"
    : props.right !== undefined ? `right:${props.right}px` : `left:${props.x ?? 0}px`;
  return <div class="absolute" style={`top:${props.y}px;${place}`}>{props.children}</div>;
}

export function StatusBar(props: { mode: Mode; color?: string }): Markup {
  const c = props.color ?? tone(props.mode).label;
  return (
    <div class="pointer-events-none absolute inset-x-0 top-0 z-50 h-[54px]" style={`color:${c}`}>
      <span class="absolute left-[48px] top-[18px] w-12 text-center" style="font-size:17px;line-height:22px;font-weight:600">9:41</span>
      <div class="absolute right-[32px] top-[23px] flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c} aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke={c} stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <path d="M1.2 4.2a10 10 0 0 1 14.6 0M3.7 6.9a6.4 6.4 0 0 1 9.6 0" /><circle cx="8.5" cy="10" r="1.2" fill={c} stroke="none" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.8" stroke={c} stroke-opacity="0.4" />
          <rect x="2" y="2" width="19" height="9" rx="2.5" fill={c} />
          <path d="M24 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill={c} fill-opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

/// The phone screen: background, content, and the status bar on top. `bare` drops the rounded
/// frame and status bar, for a page drawn behind another one (the sidebar pushes it aside).
export function Screen(props: { mode: Mode; bg?: string; statusColor?: string; bare?: boolean; children?: Child }): Markup {
  const t = tone(props.mode);
  if (props.bare) {
    return <div class="relative overflow-hidden" style={`width:${SCREEN.width}px;height:${SCREEN.height}px;background:${props.bg ?? t.bg};color:${t.label}`}>{props.children}</div>;
  }
  return (
    <div class="relative overflow-hidden rounded-[55px]" style={`width:${SCREEN.width}px;height:${SCREEN.height}px;background:${props.bg ?? t.bg};color:${t.label}${props.mode === "light" ? ";box-shadow:0 0 0 1px #e5e5e5" : ""}`}>
      {props.children}
      <StatusBar mode={props.mode} color={props.statusColor} />
    </div>
  );
}

export function RoundButton(props: { mode: Mode; icon: IconName; size?: number; color?: string; fill?: string; iconSize?: number; glass?: "flat" | "lens" }): Markup {
  const size = props.size ?? 44;
  const Glass = props.glass === "lens" ? LensGlass : GlassSurface;
  return (
    <Glass mode={props.mode} width={size} height={size} radius={size / 2} kind="button" fill={props.fill} class="grid place-items-center" style={`color:${props.color ?? tone(props.mode).label}`}>
      <Icon name={props.icon} size={props.iconSize ?? 24} weight={2} />
    </Glass>
  );
}

/// ≡ and ✎ in one glass capsule, the top-left control on chat screens.
export function PairButton(props: { mode: Mode }): Markup {
  return (
    <GlassSurface mode={props.mode} width={96} height={44} radius={22} kind="button" class="flex items-center justify-around px-2" style={`color:${tone(props.mode).label}`}>
      <Icon name="menu" size={24} /><Icon name="compose" size={23} weight={2} />
    </GlassSurface>
  );
}

function Speaker(props: { mode: Mode; on?: boolean }): Markup {
  return props.on
    ? <RoundButton mode={props.mode} icon="speaker-fill" color={tone(props.mode).speaker} />
    : <RoundButton mode={props.mode} icon="speaker-mute" />;
}

/// Home: ≡, the title, and the auto-read speaker.
export function HomeTopBar(props: { mode: Mode; speakerOn?: boolean; glass?: "flat" | "lens" }): Markup {
  return (
    <>
      <At x={12} y={59}><RoundButton mode={props.mode} icon="menu" glass={props.glass} /></At>
      <span class="absolute inset-x-0 top-[70px] text-center" style="font-size:17px;line-height:22px;font-weight:600">豆包</span>
      <At x={337} y={59}><Speaker mode={props.mode} on={props.speakerOn} /></At>
    </>
  );
}

/// A conversation: the ≡ ✎ pair, the title with its AI notice, and the speaker.
export function ChatTopBar(props: { mode: Mode; title: string; speakerOn?: boolean }): Markup {
  const t = tone(props.mode);
  return (
    <>
      <At x={12} y={58}><PairButton mode={props.mode} /></At>
      <div class="absolute inset-x-0 top-[62px] flex flex-col items-center">
        <span class="flex items-center" style="font-size:15px;line-height:20px;font-weight:600">{props.title}<span class="ml-0.5" style={`color:${t.faint}`}><Icon name="chevron-right" size={11} weight={2.6} /></span></span>
        <span style={`font-size:10px;line-height:14px;color:${t.label3}`}>AI 生成可能有误 注意核实</span>
      </div>
      <At x={337} y={58}><Speaker mode={props.mode} on={props.speakerOn} /></At>
    </>
  );
}

export type ChipSpec = { icon: IconName; label: string; more?: boolean };

export const HOME_CHIPS: ChipSpec[] = [
  { icon: "bubble", label: "对话", more: true },
  { icon: "folder", label: "选择项目", more: true },
  { icon: "mic-text", label: "录音转写" },
  { icon: "phone", label: "打电话" },
];

export function Chip(props: { mode: Mode } & ChipSpec): Markup {
  const t = tone(props.mode);
  return (
    <div class="flex h-[37px] shrink-0 items-center gap-[5px] rounded-[10px] pl-3 pr-2.5" style={`background:${t.bg};box-shadow:inset 0 0 0 1px ${t.rim};color:${t.label};font-size:15px`}>
      <Icon name={props.icon} size={16} weight={1.7} />
      <span>{props.label}</span>
      {props.more && <span class="-ml-1"><Icon name="chevron" size={12} weight={2.4} color={t.faint} /></span>}
    </div>
  );
}

/// The row of shortcuts above the input bar. `offset` scrolls it left, as on screens where the
/// first chips have scrolled away.
export function ChipRow(props: { mode: Mode; chips?: ChipSpec[]; top?: number; offset?: number }): Markup {
  return (
    <div class="absolute flex gap-2" style={`left:${12 - (props.offset ?? 0)}px;top:${props.top ?? 700}px`}>
      {(props.chips ?? HOME_CHIPS).map((c) => <Chip mode={props.mode} {...c} />)}
    </div>
  );
}

/// The message bar. `default`: placeholder; `close`: the plus panel is open; `hold`: voice mode
/// ("按住说话"); `focused`: the keyboard is up; `text`: something typed, with the send button.
export function InputBar(props: { mode: Mode; top?: number; variant?: "default" | "close" | "hold" | "focused" | "text"; text?: string; bare?: boolean; glass?: "flat" | "lens"; fill?: string }): Markup {
  const t = tone(props.mode);
  const Glass = props.glass === "lens" ? LensGlass : GlassSurface;
  const v = props.variant ?? "default";
  const caret = <span class="inline-block h-[22px] w-[2px] align-middle" style={`background:${t.blue}`} />;
  const row = (
    <>
      {v !== "text" && <Icon name="camera" size={25} weight={2} />}
      {v === "hold" && <span class="flex-1 text-center" style="font-size:17px;font-weight:600">按住说话</span>}
      {(v === "default" || v === "close") && <span class="ml-[10px] flex-1" style={`color:${t.label3};font-size:17px`}>发消息或按住说话...</span>}
      {v === "focused" && <span class="ml-[10px] flex flex-1 items-center" style={`color:${t.label3};font-size:17px`}>{caret}发消息...</span>}
      {v === "text" && <span class="flex flex-1 items-center gap-1" style="font-size:17px">{props.text}{caret}</span>}
      {v === "hold" && <Icon name="keypad" size={26} weight={1.9} />}
      {v !== "hold" && v !== "text" && <Icon name="voice" size={26} weight={1.9} />}
      {v !== "text" && <span class="ml-[18px]"><Icon name={v === "close" ? "x-circle" : "plus-circle"} size={26} weight={1.9} /></span>}
      {v === "text" && <span class="grid size-6 place-items-center rounded-full text-white" style={`background:${t.blue}`}><Icon name="arrow-up" size={15} weight={2.6} /></span>}
    </>
  );
  return (
    <div class="absolute left-3" style={`top:${props.top ?? 750}px`}>
      {props.bare
        ? <div class="flex h-14 w-[369px] items-center pl-4 pr-[16px]" style={`color:${t.label}`}>{row}</div>
        : <Glass mode={props.mode} width={369} height={56} radius={20} kind="bar" fill={props.fill} class="flex items-center pl-4 pr-[16px]" style={`color:${t.label}`}>{row}</Glass>}
    </div>
  );
}

/// A glass toast under the top bar, e.g. "未识别到文字".
export function Toast(props: { mode: Mode; text: string; warning?: boolean }): Markup {
  const t = tone(props.mode);
  const width = props.text.length * 15 + (props.warning ? 58 : 34);
  return (
    <At center y={131}>
      <GlassSurface mode={props.mode} width={width} height={53} radius={16} kind="button" floating fill={props.mode === "dark" ? "rgb(56 56 56 / 0.92)" : undefined} class="flex items-center justify-center gap-2" style="font-size:15px">
        {props.warning && <Icon name="warning-fill" size={19} color={t.warning} />}
        {props.text}
      </GlassSurface>
    </At>
  );
}

/// The user's avatar, de-identified: a neutral placeholder instead of the real photo.
export function UserAvatar(props: { size: number }): Markup {
  return (
    <div class="grid place-items-center overflow-hidden rounded-full" style={`width:${props.size}px;height:${props.size}px;background:linear-gradient(160deg,#c9d6e8,#8ea3bf)`}>
      <svg width={props.size * 0.7} height={props.size * 0.7} viewBox="0 0 24 24" fill="#ffffff" fill-opacity="0.9" aria-hidden="true">
        <circle cx="12" cy="9" r="4.5" /><path d="M3.5 23c0-5 3.8-8 8.5-8s8.5 3 8.5 8z" />
      </svg>
    </div>
  );
}

/// Doubao's own avatar (the 主对话 pin and the 豆包形象 row): a placeholder for the character art.
export function DoubaoAvatar(props: { size: number }): Markup {
  return (
    <div class="relative overflow-hidden rounded-full" style={`width:${props.size}px;height:${props.size}px;background:linear-gradient(180deg,#dfe9ff,#f7f1ff)`}>
      <div class="absolute rounded-full" style={`left:22%;top:12%;width:56%;height:56%;background:#3a3f55`} />
      <div class="absolute rounded-full" style={`left:28%;top:26%;width:44%;height:46%;background:#ffe3d3`} />
      <div class="absolute rounded-t-full" style={`left:14%;top:70%;width:72%;height:40%;background:#f4f6fb`} />
    </div>
  );
}

/// A conversation in the sidebar or the search list: a speech bubble in a tinted ring.
export function ChatDot(props: { mode: Mode; hue: "yellow" | "pink" }): Markup {
  const ring = props.hue === "yellow" ? "#f2c94c" : "#f2a7c9";
  const dark = props.mode === "dark";
  return (
    <div class="grid size-7 place-items-center rounded-full" style={`background:${dark ? "#1a1a1a" : `${ring}22`};box-shadow:inset 0 0 0 1.5px ${dark ? `${ring}66` : `${ring}aa`}`}>
      <span style={`color:${dark ? "#ffffff" : "#bebebf"}`}><Icon name="bubble" size={14} weight={2} /></span>
    </div>
  );
}

/// The system keyboard (Simplified Chinese pinyin, iOS 27 floating style) from y 524.
/// `send`: the return key turns blue with an arrow; `search`: blue with a magnifier.
export function Keyboard(props: { mode: Mode; ret: "disabled" | "send" | "search" }): Markup {
  const t = tone(props.mode);
  const key = `background:${t.key};box-shadow:${t.keyShadow};border-radius:8px;color:${t.label}`;
  const letters = (row: string, left: number, top: number) =>
    [...row].map((ch, i) => (
      <div class="absolute grid h-[42px] w-[32.4px] place-items-center" style={`left:${left + i * 38.8}px;top:${top}px;${key};font-size:23px`}>{ch}</div>
    ));
  const ret = props.ret === "disabled"
    ? { bg: props.mode === "dark" ? "#797979" : "#c4c6cc", fg: props.mode === "dark" ? "#a0a0a0" : "#ffffff" }
    : { bg: t.blue, fg: "#ffffff" };
  return (
    <div class="absolute inset-x-0 bottom-0 h-[328px] rounded-[30px]" style={`top:524px;background:${t.keyboard}`}>
      <div class="absolute flex items-center" style={`left:20px;top:25px;font-size:18px;color:${t.label}`}>
        {["我", "是", "你", "好", "那", "不", "现在", "可以"].map((w, i) => <span class="absolute whitespace-nowrap" style={`left:${[0, 41, 82, 123, 164, 205, 254, 311][i]}px`}>{w}</span>)}
      </div>
      <span class="absolute grid h-7 w-10 place-items-center" style={`left:352px;top:24px;background:${t.keyboard};color:${t.label}`}><Icon name="chevron-down" size={18} weight={2} /></span>
      {letters("qwertyuiop", 7, 53)}
      {letters("asdfghjkl", 26.4, 107)}
      {letters("zxcvbnm", 66, 161)}
      <div class="absolute grid h-[42px] w-[45px] place-items-center" style={`left:7px;top:161px;${key}`}><Icon name="shift" size={20} weight={1.8} /></div>
      <div class="absolute grid h-[42px] w-[45px] place-items-center" style={`left:342px;top:161px;${key}`}><Icon name="delete" size={22} weight={1.8} /></div>
      <div class="absolute grid h-[42px] w-[90px] place-items-center" style={`left:7px;top:214px;${key};font-size:16px`}>123</div>
      <div class="absolute h-[42px] w-[187px]" style={`left:103px;top:214px;${key}`}><span class="absolute bottom-0.5 right-2" style={`font-size:10px;color:${t.label3}`}>拼</span></div>
      <div class="absolute grid h-[42px] w-[91px] place-items-center rounded-[8px]" style={`left:296px;top:214px;background:${ret.bg};color:${ret.fg}`}><Icon name={props.ret === "search" ? "search" : "arrow-up"} size={21} weight={2.2} /></div>
      <span class="absolute" style={`left:29px;top:274px;color:${t.label}`}><Icon name="globe" size={28} weight={1.6} /></span>
      <span class="absolute" style={`left:336px;top:274px;color:${t.label}`}><Icon name="mic" size={28} weight={1.6} /></span>
    </div>
  );
}
