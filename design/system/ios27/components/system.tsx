import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon, type IconName } from "./icon.tsx";
import { ClearGlass, RegularGlass } from "./liquid-glass.tsx";
import { GlassControl } from "./liquid-glass.tsx";
import { GlassButton } from "./buttons.tsx";
import { textCss } from "./text.tsx";

// System surfaces, figma/reference/ios27/specs/07-system and 03-controls.
//   Notification banner: 386 x 63 Clear glass, radius 24, icon 38, 14 / 12 padding; stacked banners peek 8 below.
//   Expanded: 370 x 370 radius 26, header 66, menu 250 x 104. Face ID: 402 x 190, bezel 151 x 151 radius 40.
//   Widgets: small 164.67 sq, medium 349.67 x 164.33, large 349.67 x 365, radius 28. Lock screen: circular 72,
//   rectangular 162 x 72, inline 327 x 26. App icon: 64 pt, radius 26 % of the side; badge 34 x 24.
//   Dock (iPad): 740 x 107, 19.5 padding, 68 pt icons. Dock material 300 x 103 radius 38.

const HUES = [["#ff8a7a", "#ff383c"], ["#ffd45e", "#ff8d28"], ["#5ee0a0", "#34c759"], ["#7ec8ff", "#0088ff"], ["#b79cff", "#6155f5"], ["#ff9ad5", "#ff2d55"]];

export function AppIcon(props: { size?: number; index?: number; name?: string; badge?: boolean; icon?: IconName }): Markup {
  const size = props.size ?? 64;
  const [a, b] = HUES[(props.index ?? 0) % HUES.length];
  return (
    <div class="relative flex flex-col items-center gap-[5px]" style={`width:${size}px`}>
      <div class="grid place-items-center text-white" style={`width:${size}px;height:${size}px;border-radius:${size * 0.26}px;background:linear-gradient(160deg,${a},${b})`}>
        <Icon name={props.icon ?? "star-fill"} size={size * 0.5} />
      </div>
      {props.badge && <div class="absolute -right-3 -top-3 grid h-6 w-[34px] place-items-center rounded-full text-white" style="background:#ff383c;font-size:15px;font-weight:590">3</div>}
      {props.name && <span style="font-size:12px;line-height:14px;font-weight:510;color:inherit">{props.name}</span>}
    </div>
  );
}

export function NotificationBanner(props: { mode: Mode; stack?: 1 | 2 | 3 }): Markup {
  const t = tone(props.mode);
  const stack = props.stack ?? 1;
  return (
    <div class="relative" style={`width:386px;height:${63 + (stack - 1) * 8}px`}>
      {stack > 2 && <div class="absolute top-[8px] h-[63px] rounded-[24px]" style={`left:20px;right:20px;top:16px;background:${t.fill2};backdrop-filter:blur(10px)`} />}
      {stack > 1 && <div class="absolute h-[63px] rounded-[24px]" style={`left:10px;right:10px;top:8px;background:${t.fill};backdrop-filter:blur(10px)`} />}
      <div class="absolute left-0 top-0">
        <ClearGlass width={386} height={63} />
        <div class="absolute inset-0 flex items-center gap-3 px-3.5" style={`color:${t.label}`}>
          <AppIcon size={38} />
          <div class="flex flex-col"><span style={textCss("subheadline", { emphasized: true })}>Title</span><span style={textCss("subheadline")}>Message text goes here</span></div>
          <span class="ml-auto self-start pt-3" style={`${textCss("caption-1")};color:${t.label2}`}>now</span>
        </div>
      </div>
    </div>
  );
}

export function NotificationExpanded(props: { mode: Mode; menu?: boolean }): Markup {
  const t = tone(props.mode);
  return (
    <div class="relative flex flex-col items-center gap-3">
      <div class="overflow-hidden rounded-[26px]" style={`width:370px;height:370px;background:${t.bg};box-shadow:0 8px 48px rgb(0 0 0 / 0.2);color:${t.label}`}>
        <div class="flex h-[66px] items-center gap-3 px-3.5">
          <AppIcon size={38} />
          <div class="flex flex-col"><span style={textCss("subheadline", { emphasized: true })}>Title</span><span style={textCss("subheadline")}>Message text goes here</span></div>
        </div>
        <div class="h-[304px]" style="background:rgb(0 136 255 / 0.5)" />
      </div>
      {props.menu !== false && (
        <ClearGlassPanel mode={props.mode}>
          <div class="flex flex-col gap-5 px-[26px] py-5" style={`${textCss("body")};color:${t.label}`}>
            <div class="flex items-center gap-3.5"><Icon name="bell" size={20} /><span>Mute for 1 Hour</span></div>
            <div class="flex items-center gap-3.5"><Icon name="xmark" size={20} /><span>View Settings</span></div>
          </div>
        </ClearGlassPanel>
      )}
    </div>
  );
}

function ClearGlassPanel(props: { mode: Mode; children?: Child }): Markup {
  return <RegularGlass mode={props.mode} width={250} height={104} radius={26}>{props.children}</RegularGlass>;
}

export function HomeWidget(props: { size: "small" | "medium" | "large"; hue?: number }): Markup {
  const w = props.size === "small" ? 164.67 : 349.67;
  const h = props.size === "large" ? 365 : props.size === "small" ? 164.67 : 164.33;
  const [a, b] = HUES[props.hue ?? 4];
  return (
    <div class="relative overflow-hidden text-white" style={`width:${w}px;height:${h}px;border-radius:28px;background:linear-gradient(160deg,${a},${b})`}>
      <div class="absolute inset-[18px] flex flex-col justify-between">
        <span style={textCss("headline", { emphasized: true })}>Widget</span>
        <span style="font-size:34px;line-height:41px;font-weight:700">72°</span>
      </div>
    </div>
  );
}

export function LockWidget(props: { mode: Mode; kind: "circular" | "rectangular" | "inline" | "clock" }): Markup {
  const dark = props.mode === "dark";
  const bg = dark ? "rgb(255 255 255 / 0.22)" : "rgb(0 0 0 / 0.2)";
  const color = "#fff";
  if (props.kind === "inline") return <div class="flex h-[26px] w-[327px] items-center gap-1.5 px-1" style={`color:${color};${textCss("body", { weight: 510 })}`}><Icon name="clock" size={16} />Next alarm 7:00 AM</div>;
  if (props.kind === "rectangular") return <div class="flex h-[72px] w-[162px] flex-col justify-center gap-0.5 rounded-[20px] px-3" style={`background:${bg};color:${color}`}><span style={textCss("footnote", { emphasized: true })}>Title</span><span style="font-size:20px;line-height:24px;font-weight:700">24 min</span><span style={textCss("caption-1")}>Detail</span></div>;
  return (
    <div class="grid size-[72px] place-items-center rounded-full" style={`background:${bg};color:${color}`}>
      {props.kind === "clock" ? <span style="font-size:15px;font-weight:590">9:41</span> : <Icon name="star" size={28} />}
    </div>
  );
}

export function FaceIdPanel(props: { mode: Mode; state: "authenticating" | "success" }): Markup {
  const green = "#87fa89";
  return (
    <div class="relative grid h-[190px] w-[402px] place-items-center" style="background:rgb(128 128 128 / 0.25)">
      <div class="grid size-[151px] place-items-center rounded-[40px] bg-black" style="box-shadow:0 12px 74px rgb(0 0 0 / 0.22)">
        {props.state === "success"
          ? <div class="grid size-[70px] place-items-center rounded-full" style={`box-shadow:inset 0 0 0 4.5px ${green};color:${green}`}><Icon name="checkmark" size={38} weight={2.4} /></div>
          : (
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke={green} stroke-width="4.5" stroke-linecap="round">
              <path d="M10 22v-6a6 6 0 0 1 6-6h6M48 10h6a6 6 0 0 1 6 6v6M60 48v6a6 6 0 0 1-6 6h-6M22 60h-6a6 6 0 0 1-6-6v-6M26 28v6M44 28v6M35 30v8h-3M26 46c5 5 13 5 18 0" />
            </svg>
          )}
      </div>
    </div>
  );
}

export function EmptyState(props: { mode: Mode; type: "title" | "circle" | "large"; height?: number }): Markup {
  const t = tone(props.mode);
  return (
    <div class="relative flex w-[402px] flex-col items-center justify-center gap-4 px-9 text-center" style={`height:${props.height ?? 420}px;background:${t.bg};color:${t.label}`}>
      {props.type === "large" && <span style={`color:${t.label3}`}><Icon name="folder" size={96} weight={1.2} /></span>}
      {props.type === "circle" && <span class="grid size-24 place-items-center rounded-full" style={`background:${t.fill3};color:${t.label3}`}><Icon name="folder" size={44} weight={1.6} /></span>}
      <div class="flex flex-col gap-1">
        <span style={textCss("title-2", { emphasized: true })}>No Items</span>
        <span style={`${textCss("body")};color:${t.label2}`}>Items you add will appear here.</span>
      </div>
      <GlassButton mode={props.mode} size="large" label="Add Item" />
    </div>
  );
}

export function ControlTile(props: { mode: Mode; w: 1 | 2; h: 1 | 2; on?: boolean }): Markup {
  const t = tone(props.mode);
  const width = props.w === 1 ? 70 : 155;
  const height = props.h === 1 ? 70 : 155;
  return (
    <GlassControl mode={props.mode} width={width} height={height} radius={props.h === 2 ? 38 : 1000} tint={props.on ? t.blue : undefined}>
      <div class="flex size-full items-center gap-2 px-3.5" style={`color:${props.on ? "#fff" : props.mode === "dark" ? "#f5f5f5" : "#262626"};justify-content:${props.w === 1 ? "center" : "flex-start"}`}>
        <span class="grid size-10 place-items-center rounded-full" style={`background:${props.on ? "rgb(255 255 255 / 0.25)" : "rgb(128 128 128 / 0.25)"}`}><Icon name="airplane" size={20} /></span>
        {props.w === 2 && <div class="flex flex-col"><span style={textCss("footnote", { emphasized: true })}>Title</span><span style={textCss("caption-1")}>{props.on ? "On" : "Off"}</span></div>}
      </div>
    </GlassControl>
  );
}

export function Dock(props: { mode: Mode; icons?: number }): Markup {
  const n = props.icons ?? 6;
  const width = n * 68 + (n - 1) * 19.5 + 39;
  return (
    <GlassControl mode={props.mode} width={width} height={107} radius={38}>
      <div class="flex size-full items-center gap-[19.5px] px-[19.5px]" style="color:#fff">
        {Array.from({ length: n }, (_, i) => <AppIcon size={68} index={i} />)}
      </div>
    </GlassControl>
  );
}

export function QuickActions(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <RegularGlass mode={props.mode} width={250} height={190} radius={34}>
      <div class="flex flex-col py-2" style={`color:${t.label}`}>
        {[["Action", "star", false], ["Action", "share", false], ["Delete", "trash", true]].map(([label, icon, bad]) => (
          <div class="flex h-[42px] items-center gap-3.5 px-[26px]" style={`${textCss("body")};color:${bad ? t.red : t.label}`}><Icon name={icon as IconName} size={20} /><span>{label}</span></div>
        ))}
      </div>
    </RegularGlass>
  );
}

export function HomeIndicatorBar(props: { mode: Mode; width: number; height?: number; w: number; h?: number }): Markup {
  return (
    <div class="relative" style={`width:${props.width}px;height:${props.height ?? 34}px`}>
      <div class="absolute rounded-full" style={`left:${(props.width - props.w) / 2}px;bottom:8px;width:${props.w}px;height:${props.h ?? 5}px;background:${props.mode === "dark" ? "#fff" : "#000"}`} />
    </div>
  );
}
