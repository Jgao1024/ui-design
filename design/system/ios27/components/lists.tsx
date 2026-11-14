import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { Icon } from "./icon.tsx";
import { PopUpButton, Stepper } from "./controls.tsx";
import { Switch } from "./switch.tsx";
import { textCss } from "./text.tsx";

// Lists, figma/reference/ios27/specs/05-collections/Lists__*.json.
//   Row: 300 wide, 52 tall (68 with a 60 x 52 / 76 x 68 image), 16 pt side padding, 17/22 title, 1 pt
//   separator #E6E6E6 inset 16. Section title 17/22 semibold at 60 % label. Header types: Extra Prominent
//   (48), Prominent (45), Nested (42). Index bar: 30 wide, 12/16 weight 510 letters in the tint.

export type TrailingKind = "none" | "detail" | "drill-in" | "checkmark" | "symbol" | "info" | "button" | "stepper" | "pop-up" | "toggle";

export function ListRow(props: {
  mode: Mode;
  title: string;
  subtitle?: string;
  image?: boolean;
  trailing?: TrailingKind;
  detail?: string;
  edit?: "delete" | "selectable" | "selected";
  grabber?: boolean;
  width?: number;
  last?: boolean;
  destructive?: boolean;
  action?: boolean;
  disabled?: boolean;
}): Markup {
  const t = tone(props.mode);
  const tall = props.image;
  const height = tall ? 68 : 52;
  const trailing = props.trailing ?? "none";
  const color = props.action ? (props.disabled ? "#aeaeb2" : props.destructive ? t.red : t.blue) : t.label;
  return (
    <div class="relative flex items-center px-4" style={`width:${props.width ?? 300}px;height:${height}px;background:${t.groupedRow}`}>
      {props.edit && (
        <div class="mr-4 grid size-[22px] place-items-center rounded-full text-white" style={`background:${props.edit === "delete" ? t.red : props.edit === "selected" ? t.blue : "transparent"};box-shadow:${props.edit === "selectable" ? `inset 0 0 0 1.5px ${t.label3}` : "none"}`}>
          {props.edit !== "selectable" && <Icon name={props.edit === "delete" ? "minus" : "checkmark"} size={14} weight={3} />}
        </div>
      )}
      {props.image && <div class="mr-2 h-[52px] w-[52px] shrink-0 rounded-md" style="background:linear-gradient(135deg,#7ec8ff,#ff9ad5);height:52px" />}
      <div class="flex min-w-0 flex-1 flex-col" style={`color:${color}`}>
        <span class="truncate" style={textCss("body")}>{props.title}</span>
        {props.subtitle && <span class="truncate" style={`${textCss("subheadline")};color:${t.label2}`}>{props.subtitle}</span>}
      </div>
      <div class="flex items-center gap-2.5" style={`color:${t.label2};${textCss("body")}`}>
        {(trailing === "detail" || trailing === "drill-in") && <span>{props.detail ?? "Detail"}</span>}
        {trailing === "drill-in" && <span style={`color:${t.label3}`}><Icon name="chevron-right" size={16} weight={2.6} /></span>}
        {trailing === "checkmark" && <span style={`color:${t.blue}`}><Icon name="checkmark" size={20} weight={2.6} /></span>}
        {trailing === "symbol" && <Icon name="star" size={20} />}
        {trailing === "info" && <span style={`color:${t.blue}`}><Icon name="clock" size={20} /></span>}
        {trailing === "button" && <span style={`color:${t.blue}`}>Button</span>}
        {trailing === "stepper" && <Stepper mode={props.mode} />}
        {trailing === "pop-up" && <><span>Pop-up</span><Icon name="chevron-up-down" size={14} weight={2.6} /></>}
        {trailing === "toggle" && <div class="origin-right scale-[0.78]"><Switch mode={props.mode} on /></div>}
      </div>
      {props.grabber && <span class="ml-3" style={`color:${t.label3}`}><Icon name="list" size={20} /></span>}
      {!props.last && <div class="absolute bottom-0 right-0 h-px" style={`left:16px;background:${t.separator}`} />}
    </div>
  );
}

export function ListGroup(props: { mode: Mode; children?: Child; width?: number }): Markup {
  const t = tone(props.mode);
  return (
    <div class="overflow-hidden" style={`width:${props.width ?? 300}px;border-radius:26px;background:${t.groupedRow}`}>{props.children}</div>
  );
}

export function SectionTitle(props: { mode: Mode; text: string; width?: number }): Markup {
  return (
    <div class="flex h-[39px] items-end px-4 pb-[9px]" style={`width:${props.width ?? 300}px;${textCss("body", { emphasized: true })};color:${tone(props.mode).label2}`}>{props.text}</div>
  );
}

export function ListHeader(props: { mode: Mode; type: "extra-prominent" | "prominent" | "nested"; width?: number }): Markup {
  const t = tone(props.mode);
  const style = props.type === "extra-prominent" ? textCss("title-3", { emphasized: true }) : props.type === "prominent" ? textCss("headline") : textCss("footnote");
  const height = props.type === "extra-prominent" ? 48 : props.type === "prominent" ? 45 : 42;
  return (
    <div class="flex items-center justify-between px-4" style={`width:${props.width ?? 402}px;height:${height}px;color:${props.type === "nested" ? t.label2 : t.label}`}>
      <div class="flex flex-col"><span style={style}>Header</span></div>
      {props.type !== "nested" && <span style={`${textCss("body")};color:${t.blue}`}>Button</span>}
    </div>
  );
}

export function SwipeRow(props: { mode: Mode; actions: { label?: string; icon: "trash" | "star" | "share" | "ellipsis"; color: string }[] }): Markup {
  const t = tone(props.mode);
  return (
    <div class="flex h-[52px] w-[300px] overflow-hidden" style={`background:${t.groupedRow}`}>
      <div class="flex flex-1 items-center px-4" style={`${textCss("body")};color:${t.label}`}>Swipe me</div>
      {props.actions.map((a) => (
        <div class="flex w-[60px] flex-col items-center justify-center gap-px text-white" style={`background:${a.color}`}>
          <Icon name={a.icon} size={18} />
          {a.label && <span style="font-size:13px;line-height:15px">{a.label}</span>}
        </div>
      ))}
    </div>
  );
}

export function IndexBar(props: { mode: Mode; height?: number }): Markup {
  const t = tone(props.mode);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");
  return (
    <div class="flex w-[30px] flex-col items-center justify-between py-8" style={`height:${props.height ?? 700}px;background:${t.bg};color:${t.blue};font-size:12px;line-height:16px;font-weight:510`}>
      {letters.map((l) => <span>{l}</span>)}
    </div>
  );
}
