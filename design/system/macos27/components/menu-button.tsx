import type { Markup } from "@design/jsx/jsx-runtime";
import { Icon } from "./icons.tsx";
import { borderedLook } from "./button.tsx";
import type { ButtonState } from "./button.tsx";
import type { Mode } from "../theme.ts";

// Pop-up, pull-down and disclosure buttons from figma/reference/macos27/specs/03-controls/
// Pop-up-and-Pull-down-Buttons__*.json and Disclosure-Controls__*.json. They share the Bordered fill
// (black 8% / 16% / 4%) and label colours. Labels are SF Pro Medium 13 pt; indicators are SF Pro Bold.
//   pop-up with label   100 x 24, radius 6, 12 px left padding, label then a 24 px double chevron
//   pop-up, no label    24 x 24 circle with the double chevron
//   pull-down           100 x 24, radius 6, label then a 24 px chevron
//   disclosure          24 x 24, radius 6, chevron down (closed) or up (disclosed)
export type MenuButtonKind = "pop-up" | "pop-up-icon" | "pull-down";

export function MenuButton(props: { mode: Mode; kind: MenuButtonKind; state?: ButtonState; label?: string }): Markup {
  const look = borderedLook(props.mode, props.state ?? "idle");
  const icon = props.kind === "pull-down" ? "chevron.down" : "chevron.up.chevron.down";
  if (props.kind === "pop-up-icon") {
    return (
      <div class="flex size-6 items-center justify-center rounded-full" style={`background:${look.background};color:${look.color}`}>
        <Icon name={icon} size={11} weight={1.8} />
      </div>
    );
  }
  return (
    <div class="flex h-6 w-[100px] items-center rounded-[6px] pl-3" style={`background:${look.background};color:${look.color}`}>
      <span class="w-14 text-[13px] leading-4 font-medium">{props.label ?? "Label"}</span>
      <span class="flex size-6 items-center justify-center"><Icon name={icon} size={props.kind === "pull-down" ? 12 : 11} weight={1.8} /></span>
    </div>
  );
}

export function DisclosureButton(props: { mode: Mode; state?: ButtonState; disclosed?: boolean }): Markup {
  const look = borderedLook(props.mode, props.state ?? "idle");
  return (
    <div class="flex size-6 items-center justify-center rounded-[6px]" style={`background:${look.background};color:${look.color}`}>
      <Icon name={props.disclosed ? "chevron.up" : "chevron.down"} size={12} weight={2} />
    </div>
  );
}
