import type { Markup } from "@design/jsx/jsx-runtime";
import { TrafficLights } from "./traffic-lights.tsx";
import { Glass } from "./glass.tsx";
import { Icon } from "./icons.tsx";
import type { IconName } from "./icons.tsx";
import { UI } from "../theme.ts";
import type { Mode } from "../theme.ts";

// Utility panel (Windows__Utility-Panel.json): 300 x 300, radius 15, shadow 0 5 20 black 30%, a 65 px
// header ending in a #3C3C43 12% rule. Tab bar (Toolbars__Utility-Panel-Tab-Bar.json): five 44 x 30 tabs, radius 6.
export const TABS: [string, IconName][] = [
  ["Color Wheel", "circle"],
  ["Sliders", "slider"],
  ["Swatches", "square"],
  ["Images", "photo"],
  ["Crayons", "paintbrush"],
];

function Tab(props: { mode: Mode; icon: IconName; selected: boolean }): Markup {
  const inner = <Icon name={props.icon} size={16} />;
  return props.selected
    ? (
      <Glass width={44} height={30} radius={6} mode={props.mode} size="small">
        <div class="flex size-full items-center justify-center" style={`color:${UI[props.mode].label}`}>{inner}</div>
      </Glass>
    )
    : <div class="flex h-[30px] w-11 items-center justify-center" style={`color:${UI[props.mode].secondary}`}>{inner}</div>;
}

export function TabBar(props: { mode: Mode; selected: number }): Markup {
  return (
    <div class="flex">
      {TABS.map(([, icon], index) => <Tab mode={props.mode} icon={icon} selected={index === props.selected} />)}
    </div>
  );
}

export function UtilityPanel(props: { mode: Mode; active: boolean }): Markup {
  const palette = UI[props.mode];
  const shadow = props.active ? "0 5px 20px rgb(0 0 0 / 0.3)" : "0 3px 10px rgb(0 0 0 / 0.2)";
  return (
    <div class="relative" style={`width:300px;height:300px;border-radius:15px;background:${palette.window};box-shadow:${shadow},0 0 0 0.5px rgb(0 0 0 / 0.4)`}>
      <div class="absolute" style="left:12px;top:11px"><TrafficLights mode={props.mode} active={props.active} size={10} /></div>
      <p class="absolute inset-x-0 top-2 text-center text-[13px] leading-4 font-semibold" style={`color:${props.active ? palette.label : palette.tertiary}`}>Title</p>
      <div class="absolute inset-x-0 top-0 flex items-end justify-center pb-[5px]" style="height:65px">
        <TabBar mode={props.mode} selected={0} />
      </div>
      <div class="absolute inset-x-0 h-px" style={`top:65px;background:rgb(60 60 67 / 0.12)`} />
    </div>
  );
}

