import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { ChatDot, DoubaoAvatar, Keyboard, RoundButton, Screen, UserAvatar } from "./chrome.tsx";
import { GlassSurface } from "./glass.tsx";
import { Icon, type IconName } from "./icons.tsx";

// The sidebar and what opens from it, measured from 02-sidebar, 24-sidebar-selected,
// 13-account-switch and 25-search:
//   panel 326 wide; the page it covers slides right by 326 under a #252525 / #DBDBDB veil
//   title 22 bold at x 28; 48 pt glass search at x 266, y 57 (Dark tint #404040)
//   menu rows every 40 pt from y 107, icons at x 22, text at x 60; rule at y 351
//   置顶 / 最近 headers at y 367 / 447; conversation rows every 40 pt from y 475
//   bottom bar from y 745: 44 pt avatar at x 16, icons centred on x 203, 248, 292
// Conversation titles are de-identified: the user's own chats are replaced with neutral ones.

export type Recent = { title: string; hue: "yellow" | "pink"; time?: string };

export const RECENTS: Recent[] = [
  { title: "开启录音转写", hue: "yellow", time: "1 分钟前" },
  { title: "开启录音转写", hue: "yellow", time: "13 分钟前" },
  { title: "开启录音转写", hue: "pink", time: "11/1" },
  { title: "回复问候", hue: "yellow", time: "10/31" },
  { title: "周末亲子活动推荐", hue: "yellow", time: "10/31" },
  { title: "学习机功能对比", hue: "pink", time: "10/22" },
  { title: "电子书阅读器使用技巧", hue: "yellow", time: "10/18" },
  { title: "五人家庭短途游规划", hue: "pink", time: "10/16" },
];

const MENU: { icon: IconName; label: string }[] = [
  { icon: "bubble", label: "新对话" },
  { icon: "compose", label: "新工作任务" },
  { icon: "clock", label: "定时任务" },
  { icon: "layers", label: "插件 · 技能" },
  { icon: "bag", label: "豆包购物" },
];

function Header(props: { mode: Mode; label: string; top: number }): Markup {
  const t = tone(props.mode);
  return (
    <div class="absolute left-[27px] flex w-[272px] items-center justify-between" style={`top:${props.top}px;font-size:13px;color:${t.label3}`}>
      {props.label}<Icon name="ellipsis" size={18} />
    </div>
  );
}

/// The sidebar over `behind`, the page it pushes aside. `selected` highlights a menu row
/// ("plugins") or the first conversation ("recent"); `recents` are the rows to list.
export function Sidebar(props: { mode: Mode; behind: Markup; recents: Recent[]; selected?: "plugins" | "recent"; overlay?: Child }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <Screen mode={props.mode}>
      <div class="absolute top-0 left-[326px]">{props.behind}</div>
      <div class="absolute inset-y-0 left-[326px] right-0" style={`background:${t.behind}`} />
      <div class="absolute inset-y-0 left-0 w-[326px]" style={`background:${t.bg}`}>
        <span class="absolute left-[28px] top-[66px]" style="font-size:22px;line-height:30px;font-weight:700">豆包</span>
        <div class="absolute left-[266px] top-[57px]"><RoundButton mode={props.mode} icon="search" size={48} fill={dark ? "rgb(64 64 64 / 0.95)" : undefined} /></div>
        {props.selected === "plugins" && <div class="absolute left-3 top-[227px] h-10 w-[302px] rounded-[12px]" style={`background:${dark ? "#1a1a1a" : t.selected}`} />}
        {MENU.map((row, i) => (
          <div class="absolute left-[22px] flex h-10 items-center gap-[16px]" style={`top:${107 + i * 40}px;font-size:17px`}>
            <Icon name={row.icon} size={24} weight={1.9} />{row.label}
          </div>
        ))}
        <span class="absolute left-[60px] top-[316px]" style={`font-size:16px;color:${t.label3}`}>查看全部</span>
        <div class="absolute left-4 top-[351px] h-px w-[294px]" style={`background:${dark ? "#151515" : t.divider}`} />
        <Header mode={props.mode} label="置顶" top={366} />
        <div class="absolute left-6 top-[401px] flex items-center gap-[8px]" style="font-size:17px"><DoubaoAvatar size={28} />主对话</div>
        <Header mode={props.mode} label="最近" top={446} />
        {props.selected === "recent" && <div class="absolute left-1 top-[475px] h-10 w-[296px] rounded-[12px]" style={`background:${t.card}`} />}
        {props.recents.map((r, i) => (
          <div class="absolute left-6 flex h-10 w-[280px] items-center gap-[8px] overflow-hidden whitespace-nowrap" style={`top:${475 + i * 40}px;font-size:17px`}>
            <ChatDot mode={props.mode} hue={r.hue} />{r.title}
          </div>
        ))}
        <div class="absolute left-[93px] top-[684px]">
          <GlassSurface mode={props.mode} width={140} height={40} radius={20} kind="button" floating fill={dark ? "rgb(78 78 78 / 0.92)" : undefined} class="flex items-center justify-center gap-[6px]" style="font-size:16px">
            <DoubaoAvatar size={24} />回到主对话
          </GlassSurface>
        </div>
        <div class="absolute inset-x-0 bottom-0 top-[737px]" style={`background:${t.bg}`}>
          <div class="absolute left-4 top-[18px]"><UserAvatar size={44} /></div>
          <span class="absolute left-[68px] top-[29px] flex items-center" style="font-size:17px">Jgao<span style={`color:${dark ? t.label : t.faint}`}><Icon name="chevron-right" size={13} weight={2.6} /></span></span>
          {(["scan", "bell", "gear"] as const).map((icon, i) => <span class="absolute top-[28px]" style={`left:${191 + i * 45}px`}><Icon name={icon} size={24} weight={1.8} /></span>)}
        </div>
      </div>
      {props.overlay}
    </Screen>
  );
}

/// 13: the account switcher sheet over the sidebar.
export function AccountSheet(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <>
      <div class="absolute inset-0" style={`background:${t.dim}`} />
      <div class="absolute inset-x-0 bottom-0 top-[644px] rounded-t-[28px]" style={`background:${dark ? "#252525" : "#f7f7f7"}`}>
        <div class="absolute left-[178px] top-[13px] h-[5px] w-9 rounded-full" style={`background:${dark ? "#4a4a4a" : "#d4d4d4"}`} />
        <div class="absolute left-4 top-[30px] h-[142px] w-[360px] rounded-[16px]" style={`background:${dark ? "#383838" : "#ffffff"}`}>
          <div class="absolute left-4 top-[14px]"><UserAvatar size={44} /></div>
          <span class="absolute left-[76px] top-[25px]" style="font-size:17px">Jgao</span>
          <span class="absolute left-[321px] top-[24px]"><Icon name="check-fill" size={24} color={dark ? "#ffffff" : "#000000"} /></span>
          <svg class="absolute left-[324px] top-[27px]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dark ? "#383838" : "#ffffff"} stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12.5l4 4 8-8.5" /></svg>
          <div class="absolute left-4 right-0 top-[72px] h-px" style={`background:${dark ? "#444444" : t.divider}`} />
          <div class="absolute left-4 top-[88px] grid size-10 place-items-center rounded-full" style={`background:${dark ? "#4a4a4a" : "#f2f2f2"};color:${t.label3}`}><Icon name="plus" size={18} weight={1.8} /></div>
          <span class="absolute left-[76px] top-[97px]" style="font-size:17px">添加账号</span>
        </div>
      </div>
    </>
  );
}

const FILTERS = ["全部", "消息", "对话", "云盘"];

/// 25: search, opened from the sidebar's magnifier.
export function Search(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <Screen mode={props.mode}>
      <div class="absolute left-4 top-[65px] flex h-12 w-[320px] items-center gap-2 rounded-full pl-[14px]" style={`background:${t.card};color:${t.label3};font-size:17px`}>
        <Icon name="search" size={20} weight={1.8} /><span class="h-[22px] w-[2px]" style={`background:${t.blue}`} />搜索
      </div>
      <span class="absolute left-[348px] top-[78px]" style="font-size:17px">取消</span>
      <div class="absolute left-4 top-[125px] flex gap-2" style="font-size:15px">
        {FILTERS.map((f, i) => (
          <div class="grid h-9 place-items-center rounded-[10px] px-3" style={i === 0 ? `background:${t.accentTint};color:${t.blue}` : `box-shadow:inset 0 0 0 1px ${t.rim}`}>{f}</div>
        ))}
      </div>
      <div class="absolute inset-x-0 top-[173px] h-2" style={`background:${t.card}`} />
      <span class="absolute left-4 top-[196px]" style={`font-size:13px;color:${t.label2}`}>最近对话</span>
      {RECENTS.map((r, i) => (
        <div class="absolute left-4 flex h-10 w-[361px] items-center gap-3" style={`top:${219 + i * 40}px;font-size:17px`}>
          <ChatDot mode={props.mode} hue={r.hue} /><span class="flex-1">{r.title}</span><span style={`font-size:13px;color:${t.label3}`}>{r.time}</span>
        </div>
      ))}
      <Keyboard mode={props.mode} ret="search" />
    </Screen>
  );
}
