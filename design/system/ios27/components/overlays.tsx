import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon, type IconName } from "./icon.tsx";
import { RegularGlass } from "./liquid-glass.tsx";
import { textCss } from "./text.tsx";

// Overlays, figma/reference/ios27/specs/06-overlays and 03-controls/Activity-Views__*.json.
//   Alert: 300 wide Regular glass, 14 pt padding; title and message in a 272 wide block; buttons 48 tall
//   capsules, 8 apart, label 17/22 semibold. Roles: Default = tint fill with white label, None / Cancel =
//   #787880 at 16 % with a label in the tint or black, Destructive = red label.
//   Action sheet: 300 x 296 Regular glass, radius 34, three 272 x 48 actions.
//   Menu: 238 wide Regular glass, 40 pt items (190 wide, 6 pt padding), control group 56 tall.
//   Edit menu: 232 x 44 capsule. Sheet iPhone: Medium 390 x 459 inset 6, Large 402 x 812 from y 62.

const ink = (mode: Mode) => tone(mode).label;

type Role = "default" | "none" | "cancel" | "destructive";

export function ActionButton(props: { mode: Mode; role: Role; label?: string; width?: number }): Markup {
  const t = tone(props.mode);
  const fill = props.role === "default" ? t.blue : props.mode === "dark" ? "rgb(120 120 128 / 0.32)" : "rgb(120 120 128 / 0.16)";
  const color = props.role === "default" ? "#fff" : props.role === "destructive" ? t.red : props.role === "cancel" ? t.blue : t.label;
  return (
    <div class="grid h-12 place-items-center rounded-full" style={`width:${props.width ?? 272}px;background:${fill};color:${color};${textCss("body", { emphasized: true })}`}>
      {props.label ?? "Action"}
    </div>
  );
}

export function AlertPanel(props: { mode: Mode; layout: "side" | "stacked"; field?: boolean; message?: boolean }): Markup {
  const t = tone(props.mode);
  const showMessage = props.message ?? true;
  const height = 14 + (showMessage ? 108 : 64) + (props.field ? 123 : 0) + (props.layout === "side" ? 48 : 160) + 14;
  return (
    <RegularGlass mode={props.mode} width={300} height={height}>
      <div class="flex flex-col p-3.5" style={`color:${t.label}`}>
        <div class="flex flex-col gap-2.5 px-2 pb-6 pt-2 text-center" style="width:272px">
          <span style={textCss("body", { emphasized: true })}>A Short Title Is Best</span>
          {showMessage && <span style={textCss("body")}>A message should be a short, complete sentence.</span>}
        </div>
        {props.field && (
          <div class="mb-[19px] flex h-[104px] w-[272px] flex-col justify-center gap-2.5 rounded-[26px] px-4" style={`background:${t.fill4}`}>
            <span style={`${textCss("body")};color:${t.label3}`}>Text</span>
            <span style={`${textCss("body")};color:${t.label3}`}>Password</span>
          </div>
        )}
        {props.layout === "side" ? (
          <div class="flex gap-2"><ActionButton mode={props.mode} role="none" width={132} label="Cancel" /><ActionButton mode={props.mode} role="default" width={132} /></div>
        ) : (
          <div class="flex flex-col gap-2"><ActionButton mode={props.mode} role="default" /><ActionButton mode={props.mode} role="destructive" label="Destructive" /><ActionButton mode={props.mode} role="cancel" label="Cancel" /></div>
        )}
      </div>
    </RegularGlass>
  );
}

export function ActionSheetPanel(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <RegularGlass mode={props.mode} width={300} height={296}>
      <div class="flex flex-col p-3.5" style={`color:${t.label}`}>
        <div class="flex flex-col gap-2.5 px-2 pb-6 pt-2 text-center" style="width:272px">
          <span style={textCss("body", { emphasized: true })}>A Short Title Is Best</span>
          <span style={textCss("body")}>A message should be a short, complete sentence.</span>
        </div>
        <div class="flex flex-col gap-2"><ActionButton mode={props.mode} role="default" /><ActionButton mode={props.mode} role="none" /><ActionButton mode={props.mode} role="destructive" label="Delete" /></div>
      </div>
    </RegularGlass>
  );
}

export type MenuItem = { label: string; icon?: IconName; shortcut?: string; destructive?: boolean; disabled?: boolean; check?: boolean; sub?: boolean; separator?: boolean };

export function MenuPanel(props: { mode: Mode; items: MenuItem[]; control?: boolean; width?: number }): Markup {
  const t = tone(props.mode);
  const height = 20 + (props.control ? 56 : 0) + props.items.length * 40 + 32;
  return (
    <RegularGlass mode={props.mode} width={props.width ?? 238} height={height}>
      <div class="flex flex-col py-2.5" style={`color:${t.label}`}>
        {props.control && (
          <div class="flex h-14 items-center gap-1.5 px-2.5">
            {(["copy", "share", "trash"] as IconName[]).map((icon) => <div class="grid h-full flex-1 place-items-center rounded-[20px]" style={`background:${t.fill4}`}><Icon name={icon} size={22} /></div>)}
          </div>
        )}
        <div class="flex flex-col px-4 py-4">
          {props.items.map((item) => item.separator
            ? <div class="my-1.5 h-px" style={`background:${t.separator}`} />
            : (
              <div class="flex h-10 items-center gap-1.5 px-1.5" style={`opacity:${item.disabled ? 0.4 : 1};color:${item.destructive ? t.red : t.label};${textCss("body")}`}>
                <span class="w-6">{item.check && <Icon name="checkmark" size={16} weight={2.6} />}</span>
                <span class="flex-1">{item.label}</span>
                {item.shortcut && <span style={`color:${t.label2}`}>{item.shortcut}</span>}
                {item.sub && <Icon name="chevron-right" size={14} weight={2.6} />}
                {item.icon && <Icon name={item.icon} size={20} />}
              </div>
            ))}
        </div>
      </div>
    </RegularGlass>
  );
}

export function EditMenu(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <RegularGlass mode={props.mode} width={232} height={44} radius={22}>
      <div class="flex h-full items-center gap-4 px-5" style={`${textCss("subheadline", { emphasized: true })};color:${t.label}`}>
        <span>Cut</span><span>Copy</span><span>Paste</span>
        <span class="ml-auto grid size-9 place-items-center rounded-full" style={`background:${props.mode === "dark" ? "#2c2c2e" : "#ededed"}`}><Icon name="chevron-right" size={14} weight={3} /></span>
      </div>
    </RegularGlass>
  );
}

export function SheetPhone(props: { mode: Mode; detent: "medium" | "large"; children?: Child }): Markup {
  const t = tone(props.mode);
  const large = props.detent === "large";
  return (
    <div class="relative h-[874px] w-[402px] overflow-hidden" style={`border-radius:48px;background:${props.mode === "dark" ? "#1c1c1e" : "#f2f2f7"}`}>
      <div class="absolute inset-0" style="background:rgb(0 0 0 / 0.2)" />
      <div class="absolute overflow-hidden" style={`left:${large ? 0 : 6}px;width:${large ? 402 : 390}px;top:${large ? 62 : 409}px;height:${large ? 812 : 459}px;border-radius:${large ? "38px 38px 0 0" : "38px"};background:${t.bg};box-shadow:0 15px 75px rgb(0 0 0 / 0.18)`}>
        <div class="mx-auto mt-1.5 h-1 w-9 rounded-full" style={`background:${t.label4}`} />
        <div class="flex h-[54px] items-center justify-between px-4" style={`${textCss("headline", { emphasized: true })}`}>
          <span class="grid size-[44px] place-items-center rounded-full" style={`background:${t.fill4}`}><Icon name="xmark" size={18} /></span>
          <span>Title</span>
          <span class="grid size-[44px] place-items-center rounded-full" style={`background:${t.blue};color:#fff`}><Icon name="checkmark" size={18} weight={2.6} /></span>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export function Popover(props: { mode: Mode; arrow: "top" | "bottom" | "left" | "right"; width?: number; height?: number }): Markup {
  const t = tone(props.mode);
  const w = props.width ?? 320;
  const h = props.height ?? 220;
  const pos = {
    top: `left:${w / 2 - 12}px;top:-11px;width:24px;height:12px;clip-path:polygon(50% 0,0 100%,100% 100%)`,
    bottom: `left:${w / 2 - 12}px;bottom:-11px;width:24px;height:12px;clip-path:polygon(0 0,100% 0,50% 100%)`,
    left: `top:${h / 2 - 12}px;left:-11px;width:12px;height:24px;clip-path:polygon(0 50%,100% 0,100% 100%)`,
    right: `top:${h / 2 - 12}px;right:-11px;width:12px;height:24px;clip-path:polygon(0 0,100% 50%,0 100%)`,
  }[props.arrow];
  const fill = props.mode === "dark" ? "rgb(40 40 42 / 0.96)" : "rgb(255 255 255 / 0.96)";
  return (
    <div class="relative" style={`width:${w}px;height:${h}px`}>
      <div class="absolute inset-0 rounded-[26px] p-4" style={`background:${fill};box-shadow:0 8px 48px rgb(0 0 0 / 0.25);color:${t.label}`}>
        <div style={textCss("headline", { emphasized: true })}>Title</div>
        <div class="mt-2" style={`${textCss("body")};color:${t.label2}`}>Popover content goes here.</div>
      </div>
      <div class="absolute" style={`${pos};background:${fill}`} />
    </div>
  );
}
