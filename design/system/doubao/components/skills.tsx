import type { Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Screen } from "./chrome.tsx";
import { Icon } from "./icons.tsx";

// 插件 · 技能, measured from 12-skills:
//   tabs centred on x 167 / 225, y 81; search and ⊕ centred on x 318 / 363
//   filter chips 36 tall at y 115, the selected one #0D131E / #DBF1FD with blue text
//   rows 100 pt apart from y 200: 56 pt logo at x 16, text at x 88, a 52 x 34 "连接" button
// Logos are simplified stand-ins for each service's mark; the names are kept.

type Plugin = { name: string; desc: string; users: string; logo: () => Markup };

const PLUGINS: Plugin[] = [
  { name: "飞书企业号", desc: "绑定后即可完成飞书工作任务", users: "18.7 万人在用", logo: () => <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M6 20c6 1 12-2 17-8l5 3c-4 8-13 12-22 9z" fill="#3370ff" /><path d="M10 8h9c2 0 4 2 5 4l-6 7c-3-4-6-8-8-11z" fill="#00d6b9" /><path d="M23 12c2-2 5-3 7-2-1 3-3 6-6 8z" fill="#133c9a" /></svg> },
  { name: "企业微信", desc: "通过企业微信 CLI 使用企业微信...", users: "77.9 万人在用", logo: () => <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M17 7c-7 0-12 4.5-12 10 0 3 1.5 5.6 4 7.4L8 28l4.5-2.2c1.4.4 3 .7 4.5.7 7 0 12-4.5 12-10S24 7 17 7z" stroke="#2f7bff" stroke-width="2.6" /><circle cx="26" cy="25" r="2.3" fill="#ffc300" /><circle cx="30" cy="22" r="2.3" fill="#ff5a3c" /><circle cx="27" cy="29" r="2.3" fill="#10c45c" /><circle cx="31" cy="27" r="2.3" fill="#2f7bff" /></svg> },
  { name: "钉钉", desc: "通过钉钉 CLI 使用钉钉相关能力", users: "64.7 万人在用", logo: () => <div class="grid size-full place-items-center rounded-full" style="background:linear-gradient(160deg,#3d9bff,#0a6cff)"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M5 5c5 2 12 3 16 4-1 3-3 5-6 6l3 1-7 6 2-5-4-1 3-2C9 12 6 9 5 5z" fill="#fff" /></svg></div> },
  { name: "Notion", desc: "连接 Notion 进行查找资料、整理...", users: "9.4 万人在用", logo: () => <div class="grid size-[30px] place-items-center rounded-[6px] bg-white" style="box-shadow:inset 0 0 0 2.4px #000;font:700 20px/1 Georgia,serif;color:#000">N</div> },
  { name: "百度网盘", desc: "搜索、上传、下载和移动网盘文...", users: "22.5 万人在用", logo: () => <svg width="38" height="30" viewBox="0 0 38 30" fill="none" stroke-width="4.5" aria-hidden="true"><circle cx="12" cy="17" r="7" stroke="#2f8bff" /><circle cx="19" cy="10" r="7" stroke="#ff4f8b" /><circle cx="26" cy="17" r="7" stroke="#26c6f0" /></svg> },
  { name: "即梦", desc: "即梦官方一站式 AI 创作插件，支...", users: "28.7 万人在用", logo: () => <div class="grid size-full place-items-center rounded-full" style="background:#111"><svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><path d="M4 22L27 6 17 26l-2-8z" fill="url(#jm)" /><defs><linearGradient id="jm" x1="0" x2="1"><stop offset="0" stop-color="#00e0ff" /><stop offset="1" stop-color="#2a5bff" /></linearGradient></defs></svg></div> },
  { name: "即梦短剧创作", desc: "一句话生成短剧分镜和画面", users: "6.1 万人在用", logo: () => <div class="grid size-full place-items-center rounded-full" style="background:#111"><svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><path d="M4 22L27 6 17 26l-2-8z" fill="#2a8bff" /></svg></div> },
];

const FILTERS = ["精选", "办公管理", "金融", "营销增长", "电商", "Pro"];

export function SkillsScreen(props: { mode: Mode; bare?: boolean }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  return (
    <Screen mode={props.mode} bare={props.bare}>
      <span class="absolute left-[18px] top-[69px]"><Icon name="menu" size={24} /></span>
      <div class="absolute top-[70px] flex gap-[26px]" style="left:150px;font-size:17px;line-height:22px">
        <span class="relative font-semibold">插件<span class="absolute -bottom-[5px] left-0 h-[2px] w-full rounded-full" style={`background:${t.label}`} /></span>
        <span style={`color:${t.label3}`}>技能</span>
      </div>
      <span class="absolute left-[306px] top-[69px]"><Icon name="search" size={24} weight={2} /></span>
      <span class="absolute left-[351px] top-[69px]"><Icon name="plus-circle" size={24} weight={1.9} /></span>
      <div class="absolute left-4 top-[115px] flex gap-2" style="font-size:15px">
        {FILTERS.map((f, i) => (
          <div class="grid h-9 shrink-0 place-items-center rounded-[10px] px-3" style={i === 0 ? `background:${dark ? "#0d131e" : "#dbf1fd"};color:${t.blue}` : `box-shadow:inset 0 0 0 1px ${dark ? "#1e1e1e" : "#e6e6e6"}`}>{f}</div>
        ))}
      </div>
      <span class="absolute left-4 top-[173px]" style={`font-size:17px;line-height:22px;color:${t.label2}`}>大家都在用</span>
      {PLUGINS.map((p, i) => (
        <div class="absolute left-4 w-[361px]" style={`top:${222 + i * 100}px`}>
          <div class="grid size-14 place-items-center overflow-hidden rounded-full bg-white" style={dark ? "" : "box-shadow:inset 0 0 0 1px #eeeeee"}>{p.logo()}</div>
          <span class="absolute left-[72px] -top-[1px]" style="font-size:17px;line-height:22px">{p.name}</span>
          <span class="absolute left-[72px] top-[27px] w-[215px] truncate" style={`font-size:14px;color:${t.label3}`}>{p.desc}</span>
          <span class="absolute left-[72px] top-[50px]" style={`font-size:14px;color:${t.label3}`}>{p.users}</span>
          <div class="absolute left-[309px] top-[11px] grid h-[34px] w-[52px] place-items-center rounded-[8px]" style={`box-shadow:inset 0 0 0 1px ${dark ? "#262626" : "#eeeeee"};font-size:14px;font-weight:500`}>连接</div>
        </div>
      ))}
    </Screen>
  );
}
