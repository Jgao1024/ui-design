import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon, type IconName } from "./icon.tsx";
import { GlassControl } from "./liquid-glass.tsx";
import { Switch } from "./switch.tsx";
import { textCss } from "./text.tsx";

// Sidebar parts, figma/reference/ios27/specs/01-navigation/Sidebars__*.json.
//   Row: 320 x 44, left padding 10 / 30 / 50 for indent 0 / 1 / 2, right padding 8, gap 8.
//   Selection: a capsule, #EDEDED Light / #E0E0E0 Dark (linear dodge, so it lightens the material).
//   Title: 17/22 -0.43. Detail: 17/22 weight 510. Section heading: 17/22, 60 % label.
//   Edit button: 21 pt circle. Selectable 1.5 ring #BFBFBF / #404040, Selected #0088FF / #0091FF,
//   Delete #FF383C / #FF4245. Search field: 44 pt capsule, fill #787880 at 16 % Light, 32 % Dark.

export type RowState = "default" | "selected" | "disabled" | "disclosable";
export type Trailing = "none" | "detail" | "disclosure" | "checkmark" | "info" | "symbol" | "toggle";

export function EditButton(props: { mode: Mode; type: "selectable" | "selected" | "delete" }): Markup {
  const t = tone(props.mode);
  if (props.type === "selectable") {
    return <div class="size-[21px] rounded-full" style={`box-shadow:inset 0 0 0 1.5px ${props.mode === "dark" ? "#404040" : "#bfbfbf"}`} />;
  }
  const dark = props.mode === "dark";
  const fill = props.type === "selected" ? t.blue : t.red;
  return (
    <div class="grid size-[21px] place-items-center rounded-full text-white" style={`background:${fill}`}>
      <Icon name={props.type === "selected" ? "checkmark" : "minus"} size={13} weight={3} color={dark ? "#fff" : "#fff"} />
    </div>
  );
}

export function SidebarRow(props: {
  mode: Mode;
  title: string;
  detail?: string;
  icon?: IconName;
  image?: "symbol" | "bitmap" | "collection" | "hidden";
  state?: RowState;
  indent?: 0 | 1 | 2;
  trailing?: Trailing;
  edit?: "selectable" | "selected" | "delete";
}): Markup {
  const t = tone(props.mode);
  const state = props.state ?? "default";
  const indent = props.indent ?? 0;
  const trailing = props.trailing ?? (state === "disclosable" ? "disclosure" : props.detail ? "detail" : "none");
  const left = [10, 30, 50][indent];
  const selected = state === "selected";
  return (
    <div
      class="relative flex h-11 w-[320px] items-center gap-2"
      style={`padding-left:${left}px;padding-right:8px;opacity:${state === "disabled" ? 0.5 : 1}`}
    >
      {selected && (
        <div class="absolute inset-0 rounded-full" style={`background:${props.mode === "dark" ? "#e0e0e0" : "#ededed"};opacity:${props.mode === "dark" ? 0.18 : 1}`} />
      )}
      {props.edit && <div class="relative"><EditButton mode={props.mode} type={props.edit} /></div>}
      {(props.image ?? (props.icon ? "symbol" : "hidden")) === "symbol" && props.icon && (
        <div class="relative flex w-[34px] justify-center" style={`color:${t.blue}`}>
          <Icon name={props.icon} size={22} />
        </div>
      )}
      {props.image === "bitmap" && (
        <div class="relative size-7 rounded-md" style="background:linear-gradient(135deg,#7ec8ff,#ff9ad5)" />
      )}
      {props.image === "collection" && (
        <div class="relative flex h-7 w-[34px]">
          <div class="size-7 rounded-md" style="background:linear-gradient(135deg,#ffd45e,#ff8a7a)" />
          <div class="-ml-5 size-7 rounded-md" style={`background:linear-gradient(135deg,#7ec8ff,#b79cff);box-shadow:0 0 0 2px ${props.mode === "dark" ? "#2c2e34" : "#dce0e6"}`} />
        </div>
      )}
      <span class="relative flex-1 truncate" style={`${textCss("body")};color:${t.label}`}>{props.title}</span>
      <div class="relative flex items-center gap-2" style={`color:${t.label2}`}>
        {(trailing === "detail" || trailing === "disclosure" || trailing === "checkmark" || trailing === "info") && props.detail && (
          <span style={textCss("body", { weight: 510 })}>{props.detail}</span>
        )}
        {trailing === "disclosure" && <Icon name="chevron-down" size={14} weight={2.6} />}
        {trailing === "checkmark" && <span style={`color:${t.blue}`}><Icon name="checkmark" size={18} weight={2.6} /></span>}
        {trailing === "info" && <span style={`color:${t.blue}`}><Icon name="clock" size={18} weight={2} /></span>}
        {trailing === "symbol" && <Icon name="star" size={18} />}
        {trailing === "toggle" && <div class="scale-[0.78] origin-right"><Switch mode={props.mode} on /></div>}
      </div>
    </div>
  );
}

export function SectionHeader(props: { mode: Mode; title?: string; detail?: string; width?: number }): Markup {
  const t = tone(props.mode);
  return (
    <div class="flex h-[54px] items-end justify-between px-3 pb-[11px]" style={`width:${props.width ?? 260}px`}>
      <span style={`${textCss("body")};color:${t.label2}`}>{props.title ?? "Section Heading"}</span>
      {props.detail && <span style={`${textCss("body", { weight: 510 })};color:${t.label2}`}>{props.detail}</span>}
    </div>
  );
}

export function SearchField(props: { mode: Mode; state: "placeholder" | "typing" | "value"; width?: number; term?: string }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const text = props.state === "placeholder" ? "Search" : props.term ?? "Mountains";
  return (
    <div
      class="flex h-11 items-center gap-2 rounded-full px-[11px]"
      style={`width:${props.width ?? 200}px;background:${dark ? "rgb(120 120 128 / 0.32)" : "rgb(120 120 128 / 0.16)"}`}
    >
      <span style={`color:${dark ? "#8a8a8a" : "#727272"}`}><Icon name="search" size={17} weight={2.2} /></span>
      <span class="flex-1 truncate" style={`${textCss("body")};color:${props.state === "placeholder" ? t.label2 : t.label}`}>{text}</span>
      {props.state === "typing" && <span class="h-5 w-0.5" style={`background:${t.blue}`} />}
      <span style={`color:${dark ? "#8a8a8a" : "#727272"}`}><Icon name="mic" size={17} weight={2} /></span>
    </div>
  );
}

/// The translucent sidebar material (figma BG: background blur over a #DAE6F2 luminosity layer).
/// `active` is the focused window; inactive is lighter.
export function SidebarMaterial(props: { mode: Mode; active: boolean; width: number; height: number; children?: Child }): Markup {
  const dark = props.mode === "dark";
  const bg = dark ? (props.active ? "rgb(44 46 52 / 0.92)" : "rgb(34 35 40 / 0.94)") : props.active ? "rgb(220 224 230 / 0.92)" : "rgb(238 240 243 / 0.95)";
  return (
    <div class="relative overflow-hidden" style={`width:${props.width}px;height:${props.height}px;background:${bg}`}>
      {props.children}
    </div>
  );
}

/// A sample list of rows for the sidebar mock-ups: a search field, then sections of rows.
export function SidebarItems(props: { mode: Mode; search?: boolean }): Markup {
  const m = props.mode;
  return (
    <div class="flex flex-col">
      {props.search && <div class="px-2.5 pb-2"><SearchField mode={m} state="placeholder" width={280} /></div>}
      <SidebarRow mode={m} title="Library" icon="house" />
      <SidebarRow mode={m} title="Favorites" icon="star" state="selected" />
      <SidebarRow mode={m} title="Recents" icon="clock" />
      <SectionHeader mode={m} title="Collections" width={300} />
      <SidebarRow mode={m} title="Travel" icon="folder" state="disclosable" detail="12" />
      <SidebarRow mode={m} title="Japan" indent={1} />
      <SidebarRow mode={m} title="Kyoto" indent={2} />
    </div>
  );
}

/// A full sidebar column, 320 x 802: top buttons, search field, then the rows. `floating` is the
/// sidebar inside a floating window (10 pt top inset); otherwise the docked one (32 pt).
export function SidebarColumn(props: { mode: Mode; floating: boolean; active?: boolean }): Markup {
  const top = props.floating ? 10 : 32;
  const m = props.mode;
  return (
    <SidebarMaterial mode={m} active={props.active ?? true} width={320} height={802}>
      <div class="absolute flex w-full items-center justify-between px-2.5" style={`top:${top}px`}>
        <GlassControl mode={m} width={60} height={44}>
          <div class="grid size-full place-items-center" style={`${textCss("body", { weight: 510 })};color:${m === "dark" ? "#f5f5f5" : "#262626"}`}>Edit</div>
        </GlassControl>
        <div class="flex gap-3">
          <GlassControl mode={m} width={44} height={44}><div class="grid size-full place-items-center" style={`color:${m === "dark" ? "#f5f5f5" : "#262626"}`}><Icon name="compose" size={20} /></div></GlassControl>
          <GlassControl mode={m} width={44} height={44}><div class="grid size-full place-items-center" style={`color:${m === "dark" ? "#f5f5f5" : "#262626"}`}><Icon name="sidebar" size={20} /></div></GlassControl>
        </div>
      </div>
      <div class="absolute w-full px-2.5" style={`top:${top + 54}px`}>
        <SearchField mode={m} state="placeholder" width={300} />
      </div>
      <div class="absolute w-full" style={`top:${top + 112}px`}>
        <SidebarRow mode={m} title="Title" detail="Detail" />
        <SidebarRow mode={m} title="Title" detail="Detail" />
        <SidebarRow mode={m} title="Title" detail="Detail" />
        <SectionHeader mode={m} title="Section Heading" detail="Detail" width={300} />
        <SidebarRow mode={m} title="Title" detail="Detail" />
        <SidebarRow mode={m} title="Title" detail="Detail" state="selected" />
        <SidebarRow mode={m} title="Title" detail="Detail" />
        <SectionHeader mode={m} title="Section Heading" detail="Detail" width={300} />
        <SidebarRow mode={m} title="Title" detail="Detail" />
        <SidebarRow mode={m} title="Title" detail="Detail" />
        <SidebarRow mode={m} title="Title" detail="Detail" />
      </div>
    </SidebarMaterial>
  );
}
