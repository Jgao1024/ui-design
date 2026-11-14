import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon } from "./icon.tsx";
import { GlassControl } from "./liquid-glass.tsx";
import { SearchCapsule } from "./chrome.tsx";
import { textCss } from "./text.tsx";

// Keyboards, figma/reference/ios27/specs/04-input/Keyboards__*.json.
//   iPhone keyboard 402 x 332: 24 pt suggestion bar slot, keys 205 pt (4 rows of 43, 11 apart, 6.67 side
//   padding, 6 between keys, radius 8.5), then a 78 pt row with the emoji and mic buttons.
//   URL and Web keyboards are 307 (no suggestion bar). Number pad 402 x 308: 4 rows of 48, keys 125 x 47.
//   Key fill: #FFFFFF at 67 % Light, #EDEDED at 17 % Dark. Letters 22 pt.

export type KeyboardType = "lower" | "upper" | "numeric" | "punctuation" | "email" | "web" | "url" | "number-pad";

function Key(props: { mode: Mode; width: number; children?: Child; fill?: boolean; size?: number; prominent?: boolean; label?: string }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const fill = props.prominent ? t.blue : props.fill === false ? "transparent" : dark ? "rgb(237 237 237 / 0.17)" : "rgb(255 255 255 / 0.67)";
  const color = props.prominent ? "#fff" : t.label;
  return (
    <div
      class="grid h-[43px] shrink-0 place-items-center rounded-[8.5px]"
      style={`width:${props.width}px;background:${fill};color:${color};font-size:${props.size ?? 22}px;line-height:26px;box-shadow:${props.fill === false || dark ? "none" : "0 1px 0 rgb(0 0 0 / 0.18)"}`}
    >
      {props.children}
    </div>
  );
}

const LAYOUTS: Record<string, string[]> = {
  lower: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
  upper: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
  numeric: ["1234567890", "-/:;()$&@\"", ".,?!'"],
  punctuation: ["[]{}#%^*+=", "_\\|~<>€£¥•", ".,?!'"],
};

export function IphoneKeyboard(props: { mode: Mode; type: KeyboardType; suggestions?: boolean }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const letters = props.type === "email" ? "lower" : props.type === "web" || props.type === "url" ? "lower" : props.type;
  const rows = LAYOUTS[letters as string];
  const letter = (c: string) => <Key mode={props.mode} width={33.5}>{c}</Key>;
  const alpha = letters === "lower" || letters === "upper";
  const web = props.type === "web" || props.type === "url";
  const height = web ? 307 : 332;
  const bar = !web && props.suggestions !== false;
  return (
    <div class="relative w-[402px] overflow-hidden" style={`height:${height}px;background:${dark ? "rgb(28 28 30 / 0.94)" : "rgb(213 216 222 / 0.94)"};color:${t.label}`}>
      {bar && (
        <div class="flex h-[25px] items-center justify-center gap-1.5 pt-0.5" style={`margin-top:24px;${textCss("callout")}`}>
          {props.type === "email" ? <><span>me@example.com</span></> : <><span>The</span><span style={`color:${t.label3}`}>|</span><span>I</span><span style={`color:${t.label3}`}>|</span><span>Hello</span></>}
        </div>
      )}
      <div class="flex flex-col gap-[11px] px-[6.67px]" style={`margin-top:${web ? 24 : 0}px`}>
        <div class="flex justify-between">{rows[0].split("").map(letter)}</div>
        <div class="flex justify-center gap-1.5">{rows[1].split("").map(letter)}</div>
        <div class="flex justify-between">
          <Key mode={props.mode} width={45} size={20}>{alpha ? <Icon name="arrow-up" size={20} weight={props.type === "upper" ? 2.6 : 2} /> : "#+="}</Key>
          <div class="flex gap-1.5">{rows[2].split("").map(letter)}</div>
          <Key mode={props.mode} width={45} size={20}><Icon name="arrow-left" size={22} /></Key>
        </div>
        <div class="flex gap-1.5">
          <Key mode={props.mode} width={props.type === "numeric" || props.type === "punctuation" ? 44 : 44} size={16}>{alpha || web || props.type === "email" ? "123" : "ABC"}</Key>
          <Key mode={props.mode} width={web ? 118 : props.type === "email" ? 130 : 205} />
          {props.type === "email" && <><Key mode={props.mode} width={34}>@</Key><Key mode={props.mode} width={34}>.</Key></>}
          {web && <><Key mode={props.mode} width={34}>.</Key><Key mode={props.mode} width={34}>/</Key><Key mode={props.mode} width={44} size={16}>.com</Key></>}
          <Key mode={props.mode} width={web ? 66 : props.type === "email" ? 66 : 82} size={16} prominent={props.type === "email" || web}>{web ? "go" : "return"}</Key>
        </div>
      </div>
      {!web && (
        <div class="absolute inset-x-0 bottom-0 flex h-[78px] items-start justify-between px-8 pt-[23px]" style={`color:${t.label}`}>
          <span style="font-size:26px;line-height:29px">☺</span>
          <Icon name="mic" size={26} weight={1.8} />
        </div>
      )}
    </div>
  );
}

export function NumberPad(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const letters = ["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"];
  const fill = dark ? "rgb(237 237 237 / 0.17)" : "rgb(255 255 255 / 0.67)";
  const key = (n: string, sub?: string) => (
    <div class="flex h-[47px] w-[125px] flex-col items-center justify-center rounded-[8.5px]" style={`background:${fill};color:${t.label}`}>
      <span style="font-size:23px;line-height:28px">{n}</span>
      {sub && <span style="font-size:13px;line-height:15px;font-weight:556;letter-spacing:2px">{sub}</span>}
    </div>
  );
  return (
    <div class="flex h-[308px] w-[402px] flex-col items-center gap-[7px] pt-6" style={`background:${dark ? "rgb(28 28 30 / 0.94)" : "rgb(213 216 222 / 0.94)"}`}>
      {[0, 3, 6].map((start) => (
        <div class="flex gap-1.5">{[1, 2, 3].map((i) => key(String(start + i), letters[start + i - 1]))}</div>
      ))}
      <div class="flex gap-1.5">
        <div class="h-[47px] w-[125px]" />
        {key("0")}
        <div class="grid h-[47px] w-[125px] place-items-center" style={`color:${t.label}`}><Icon name="arrow-left" size={24} /></div>
      </div>
    </div>
  );
}

export function IpadKeyboard(props: { mode: Mode; upper?: boolean }): Markup {
  const t = tone(props.mode);
  const dark = props.mode === "dark";
  const rows = props.upper
    ? ["~!@#$%^&*()_+", "QWERTYUIOP{}|", "ASDFGHJKL:\"", "ZXCVBNM<>?"]
    : ["`1234567890-=", "qwertyuiop[]\\", "asdfghjkl;'", "zxcvbnm,./"];
  const fill = dark ? "rgb(237 237 237 / 0.17)" : "rgb(255 255 255 / 0.67)";
  const k = (w: number, text: Child, size = 20) => (
    <div class="grid h-[60px] place-items-center rounded-[8.5px]" style={`width:${w}px;background:${fill};font-size:${size}px;color:${t.label}`}>{text}</div>
  );
  return (
    <div class="flex w-[1210px] flex-col items-center gap-2.5 px-3 py-3" style={`background:${dark ? "rgb(28 28 30 / 0.94)" : "rgb(213 216 222 / 0.94)"}`}>
      <div class="flex gap-2">{rows[0].split("").map((c) => k(72, c))}{k(110, <Icon name="arrow-left" size={22} />)}</div>
      <div class="flex gap-2">{k(110, "tab", 16)}{rows[1].split("").map((c) => k(72, c))}</div>
      <div class="flex gap-2">{k(130, "caps", 16)}{rows[2].split("").map((c) => k(72, c))}{k(130, "return", 16)}</div>
      <div class="flex gap-2">{k(160, <Icon name="arrow-up" size={22} />)}{rows[3].split("").map((c) => k(72, c))}{k(160, <Icon name="arrow-up" size={22} />)}</div>
      <div class="flex gap-2">{k(72, "☺")}{k(72, ".?123", 16)}{k(72, <Icon name="mic" size={22} />)}{k(420, "")}{k(72, ".?123", 16)}{k(72, "⌨", 20)}</div>
    </div>
  );
}

/// Accessory bars above the keyboard, iPhone (Find, Find and Replace, Search, URL, Web Form, Toolbar).
export function AccessoryBar(props: { mode: Mode; type: "find" | "replace" | "search" | "url" | "form" | "toolbar" }): Markup {
  const t = tone(props.mode);
  const ink = props.mode === "dark" ? "#f5f5f5" : "#262626";
  const field = (width: number, text: string, icon?: boolean) => (
    <GlassControl mode={props.mode} width={width} height={48}>
      <div class="flex h-full items-center gap-1.5 px-3.5" style={`color:${ink};${textCss("body", { weight: 510 })}`}>
        {icon && <Icon name="search" size={19} />}<span style={`color:${t.label2}`}>{text}</span>
      </div>
    </GlassControl>
  );
  const done = <GlassControl mode={props.mode} width={48} height={48}><div class="grid size-full place-items-center" style={`color:${ink}`}><Icon name="checkmark" size={22} /></div></GlassControl>;
  switch (props.type) {
    case "search":
      return <div class="flex w-[402px] items-center gap-2 px-2">{field(330, "Search", true)}{done}</div>;
    case "url":
      return <div class="flex w-[402px] items-center gap-2 px-2">{field(330, "example.com")}{done}</div>;
    case "find":
      return (
        <div class="flex h-[50px] w-[402px] items-center gap-2.5 px-[11px]">
          <GlassControl mode={props.mode} width={320} height={50}><div class="flex h-full items-center gap-2 px-3" style={`color:${ink};${textCss("body", { weight: 510 })}`}><Icon name="search" size={19} />Find<span class="flex-1" /><Icon name="chevron-up" size={18} /><Icon name="chevron-down" size={18} /></div></GlassControl>
          <GlassControl mode={props.mode} width={50} height={50}><div class="grid size-full place-items-center" style={`color:${ink};${textCss("body", { weight: 510 })}`}>Done</div></GlassControl>
        </div>
      );
    case "replace":
      return (
        <div class="flex w-[402px] flex-col gap-2.5 px-3 py-2.5">
          <GlassControl mode={props.mode} width={378} height={101} radius={26}>
            <div class="flex flex-col gap-2.5 px-3 py-2.5" style={`color:${ink};${textCss("body", { weight: 510 })}`}>
              <div class="flex h-9 items-center gap-2"><Icon name="search" size={19} />Find</div>
              <div class="flex h-9 items-center gap-2"><Icon name="pencil" size={19} />Replace</div>
            </div>
          </GlassControl>
        </div>
      );
    case "form":
      return (
        <div class="flex w-[402px] flex-col items-center gap-2.5 px-[11px]">
          <GlassControl mode={props.mode} width={96} height={28}><div class="grid size-full place-items-center" style={`color:${ink};font-size:15px;font-weight:510`}>AutoFill</div></GlassControl>
          {field(380, "Password")}
        </div>
      );
    default:
      return (
        <div class="flex w-[402px] justify-between px-3">
          <GlassControl mode={props.mode} width={168} height={48}><div class="flex h-full items-center justify-around px-[18px]" style={`color:${ink}`}><Icon name="list" size={22} /><Icon name="text-size" size={22} /><Icon name="camera" size={22} /></div></GlassControl>
          <GlassControl mode={props.mode} width={72} height={48}><div class="grid size-full place-items-center" style={`color:${ink}`}><Icon name="xmark" size={22} /></div></GlassControl>
        </div>
      );
  }
}
