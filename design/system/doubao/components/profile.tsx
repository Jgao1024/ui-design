import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { At, DoubaoAvatar, RoundButton, Screen, UserAvatar } from "./chrome.tsx";
import { GlassSurface } from "./glass.tsx";
import { Icon, type IconName } from "./icons.tsx";

// The profile page, measured from 11-profile:
//   background Light #F7F7F7 with white groups, Dark black with #252525 groups
//   110 pt avatar centred on x 196 from y 119; name on y 260; "豆包账号管理" 141 x 44 at y 315
//   groups at x 16, 360 wide, radius 16, 56 pt rows from y 375, 503 and 799
//   row icons: 32 pt rounded squares at x 32, labels at x 80

type Row = { label: string; detail?: string; icon: IconName | "avatar" | "aa"; tint: string };

const GROUPS: Row[][] = [
  [
    { label: "订阅豆包", detail: "享更多额度", icon: "sparkle", tint: "linear-gradient(160deg,#a8a8a8,#6e6e6e)" },
    { label: "订阅与额度管理", icon: "clock", tint: "#3d8bff" },
  ],
  [
    { label: "豆包形象", icon: "avatar", tint: "transparent" },
    { label: "声音", icon: "speaker-fill", tint: "#9f77ff" },
    { label: "字号与背景", icon: "aa", tint: "#8e8e93" },
    { label: "记忆", detail: "已开启", icon: "record", tint: "#42a9ff" },
    { label: "通知设置", icon: "bell", tint: "#9163ff" },
  ],
  [{ label: "开启新话题", icon: "bubble", tint: "#41a9ff" }],
];
const GROUP_TOP = [375, 503, 799];

function RowIcon(props: { row: Row }): Markup {
  if (props.row.icon === "avatar") return <DoubaoAvatar size={32} />;
  return (
    <div class="grid size-8 place-items-center rounded-[9px] text-white" style={`background:${props.row.tint}`}>
      {props.row.icon === "aa" ? <span style="font-size:13px;font-weight:700">AA</span> : <Icon name={props.row.icon} size={18} weight={2.2} />}
    </div>
  );
}

export function Profile(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <Screen mode={props.mode} bg={dark ? "#000000" : "#f7f7f7"}>
      <At x={12} y={59}><RoundButton mode={props.mode} icon="menu" /></At>
      <At x={337} y={59}><RoundButton mode={props.mode} icon="ellipsis" /></At>
      <At center y={119}><UserAvatar size={110} /></At>
      <span class="absolute inset-x-0 top-[247px] flex items-center justify-center" style="font-size:20px;line-height:26px;font-weight:600">Jgao<span style={`color:${dark ? t.label : t.faint}`}><Icon name="chevron-right" size={16} weight={2.6} /></span></span>
      <span class="absolute inset-x-0 top-[280px] text-center" style={`font-size:13px;color:${t.label3}`}>豆包号: Jgao</span>
      <At center y={315}>
        <GlassSurface mode={props.mode} width={141} height={44} radius={22} kind="button" fill={dark ? "rgb(37 37 37 / 0.96)" : undefined} class="grid place-items-center" style="font-size:16px;font-weight:500">豆包账号管理</GlassSurface>
      </At>
      {GROUPS.map((rows, g) => (
        <div class="absolute left-4 w-[360px] overflow-hidden rounded-[16px]" style={`top:${GROUP_TOP[g]}px;background:${dark ? "#252525" : "#ffffff"}`}>
          {rows.map((row, i) => (
            <div class="relative flex h-14 items-center pl-4 pr-[14px]" style="font-size:17px">
              <RowIcon row={row} />
              <span class="ml-4 flex-1">{row.label}</span>
              {row.detail && <span class="mr-1" style={`font-size:15px;color:${t.label3}`}>{row.detail}</span>}
              <span style={`color:${t.faint}`}><Icon name="chevron-right" size={14} weight={2.2} /></span>
              {i < rows.length - 1 && <div class="absolute bottom-0 left-16 right-0 h-px" style={`background:${dark ? "#2e2e2e" : "#f2f2f2"}`} />}
            </div>
          ))}
        </div>
      ))}
    </Screen>
  );
}
