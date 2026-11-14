import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { type Mode, tone } from "../theme.ts";
import { ContentRows, HomeIndicator, Screen, ToolbarButton } from "./chrome.tsx";
import { SegmentedControl, Slider } from "./controls.tsx";
import { IphoneKeyboard } from "./keyboard.tsx";
import { ListGroup, ListRow } from "./lists.tsx";
import { Switch } from "./switch.tsx";
import { ActionSheetPanel, AlertPanel, type MenuItem, MenuPanel } from "./overlays.tsx";
import { TabBarPhone } from "./tab-bar.tsx";
import { AppIcon, ControlTile, HomeWidget, LockWidget, NotificationBanner } from "./system.tsx";
import { GlassControl } from "./liquid-glass.tsx";
import { textCss } from "./text.tsx";
import { Icon } from "./icon.tsx";

// Whole-screen compositions of the parts above on a 402 x 874 iPhone screen (figma Examples page).

const WALL = {
  light: "linear-gradient(160deg,#7ec8ff,#b79cff 55%,#ff9ad5)",
  dark: "linear-gradient(160deg,#0b1e4a,#2a1262 55%,#5a1148)",
};

function Wall(props: { mode: Mode; children?: Child }): Markup {
  return <div class="absolute inset-0" style={`background:${WALL[props.mode]}`}>{props.children}</div>;
}

export function HomeScreen(props: { mode: Mode }): Markup {
  const names = ["Photos", "Mail", "Notes", "Maps", "Music", "Clock", "Weather", "Files", "Books", "Health", "Wallet", "Tips"];
  return (
    <Screen mode={props.mode} height={874}>
      <Wall mode={props.mode} />
      <div class="absolute left-[19px] top-[78px] flex gap-4"><HomeWidget size="small" hue={4} /><HomeWidget size="small" hue={3} /></div>
      <div class="absolute left-[24px] top-[270px] grid grid-cols-4 gap-x-[22px] gap-y-5 text-white">
        {names.map((n, i) => <AppIcon size={64} index={i} name={n} />)}
      </div>
      <div class="absolute bottom-[132px] left-1/2 -translate-x-1/2 flex gap-2">{[0, 1, 2].map((i) => <span class="size-2 rounded-full bg-white" style={`opacity:${i === 0 ? 1 : 0.4}`} />)}</div>
      <div class="absolute bottom-[34px] left-4 text-white"><GlassControl mode={props.mode} width={370} height={92} radius={38}><div class="flex size-full items-center justify-around px-3">{[0, 1, 2, 3].map((i) => <AppIcon size={64} index={i} />)}</div></GlassControl></div>
      <div class="absolute bottom-0 left-0"><HomeIndicator mode="dark" /></div>
    </Screen>
  );
}

export function LockScreen(props: { mode: Mode }): Markup {
  return (
    <Screen mode={props.mode} height={874}>
      <Wall mode={props.mode} />
      <div class="absolute inset-x-0 top-[100px] flex flex-col items-center text-white"><span style="font-size:17px;line-height:22px;font-weight:510">Wednesday, April 1</span><span style="font-size:96px;line-height:100px;font-weight:700">9:41</span></div>
      <div class="absolute left-8 top-[314px] flex gap-3.5"><LockWidget mode={props.mode} kind="circular" /><LockWidget mode={props.mode} kind="circular" /><LockWidget mode={props.mode} kind="circular" /></div>
      <div class="absolute left-2 top-[600px]"><NotificationBanner mode={props.mode} stack={2} /></div>
      <div class="absolute bottom-[56px] left-12"><GlassControl mode={props.mode} width={58} height={58}><div class="grid size-full place-items-center" style="color:#fff"><Icon name="bolt" size={24} /></div></GlassControl></div>
      <div class="absolute bottom-[56px] right-12"><GlassControl mode={props.mode} width={58} height={58}><div class="grid size-full place-items-center" style="color:#fff"><Icon name="camera" size={24} /></div></GlassControl></div>
      <div class="absolute bottom-0 left-0"><HomeIndicator mode="dark" /></div>
    </Screen>
  );
}

export function ControlCenter(props: { mode: Mode }): Markup {
  return (
    <Screen mode={props.mode} height={874}>
      <Wall mode={props.mode} />
      <div class="absolute left-4 top-[90px] grid grid-cols-2 gap-4"><ControlTile mode={props.mode} w={2} h={2} on /><div class="flex flex-col gap-4"><ControlTile mode={props.mode} w={2} h={1} /><ControlTile mode={props.mode} w={2} h={1} on /></div><ControlTile mode={props.mode} w={2} h={1} /><ControlTile mode={props.mode} w={2} h={1} /></div>
    </Screen>
  );
}

export function SettingsScreen(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <Screen mode={props.mode} height={874} grouped>
      <div class="absolute inset-x-0 top-[62px] flex h-11 items-center justify-between px-4"><ToolbarButton mode={props.mode} symbol="chevron-left" /><ToolbarButton mode={props.mode} symbol="ellipsis" /></div>
      <div class="absolute left-4 top-[116px]" style={`${textCss("large-title", { emphasized: true })};color:${t.label}`}>Settings</div>
      <div class="absolute left-4 top-[180px]">
        <ListGroup mode={props.mode} width={370}>
          <ListRow mode={props.mode} width={370} title="Wi-Fi" trailing="drill-in" detail="Home" />
          <ListRow mode={props.mode} width={370} title="Bluetooth" trailing="drill-in" detail="On" />
          <ListRow mode={props.mode} width={370} title="Airplane Mode" trailing="toggle" last />
        </ListGroup>
      </div>
      <div class="absolute left-4 top-[372px]">
        <ListGroup mode={props.mode} width={370}>
          <ListRow mode={props.mode} width={370} title="Notifications" trailing="drill-in" image subtitle="Banners, sounds" />
          <ListRow mode={props.mode} width={370} title="Sounds" trailing="drill-in" />
          <ListRow mode={props.mode} width={370} title="Focus" trailing="drill-in" last />
        </ListGroup>
      </div>
      <ContentRows mode={props.mode} rows={3} top={580} />
      <TabBarPhone mode={props.mode} tabs={4} />
      <div class="absolute bottom-0 left-0"><HomeIndicator mode={props.mode} /></div>
    </Screen>
  );
}

export function OverlayScreen(props: { mode: Mode; kind: "alert" | "action-sheet" | "menu" }): Markup {
  const items: MenuItem[] = [{ label: "Copy", icon: "copy" }, { label: "Share", icon: "share" }, { separator: true } as MenuItem, { label: "Delete", icon: "trash", destructive: true }];
  return (
    <Screen mode={props.mode} height={874} grouped>
      <div class="absolute inset-x-0 top-[62px] flex h-11 items-center justify-between px-4"><ToolbarButton mode={props.mode} symbol="chevron-left" /><ToolbarButton mode={props.mode} symbol="ellipsis" /></div>
      <ContentRows mode={props.mode} rows={9} top={140} />
      <div class="absolute inset-0" style={`background:rgb(0 0 0 / ${props.kind === "menu" ? 0.1 : 0.2})`} />
      {props.kind === "alert" && <div class="absolute left-[51px] top-[300px]"><AlertPanel mode={props.mode} layout="side" /></div>}
      {props.kind === "action-sheet" && <div class="absolute bottom-[40px] left-[51px]"><ActionSheetPanel mode={props.mode} /></div>}
      {props.kind === "menu" && <div class="absolute right-4 top-[116px]"><MenuPanel mode={props.mode} items={items} /></div>}
    </Screen>
  );
}

export function InputScreen(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  return (
    <Screen mode={props.mode} height={874} grouped>
      <div class="absolute inset-x-0 top-[62px] flex h-11 items-center justify-between px-4"><ToolbarButton mode={props.mode} symbol="xmark" /><ToolbarButton mode={props.mode} symbol="checkmark" prominent /></div>
      <div class="absolute left-4 top-[124px]" style={`${textCss("title-1", { emphasized: true })};color:${t.label}`}>New Item</div>
      <div class="absolute left-4 top-[180px]">
        <ListGroup mode={props.mode} width={370}>
          <div class="flex h-[52px] items-center px-4" style={`${textCss("body")};color:${t.label}`}>Hello world<span class="ml-0.5 h-6 w-0.5" style={`background:${t.blue}`} /></div>
        </ListGroup>
      </div>
      <div class="absolute left-4 top-[256px] flex flex-col gap-5">
        <SegmentedControl mode={props.mode} options={["Day", "Week", "Month"]} selected={1} width={370} />
        <div class="flex items-center justify-between rounded-[26px] px-4 py-3" style={`width:370px;background:${t.groupedRow};${textCss("body")}`}><span>Reminder</span><Switch mode={props.mode} on /></div>
        <div class="rounded-[26px] px-1" style={`width:370px;background:${t.groupedRow}`}><Slider mode={props.mode} value={60} width={338} /></div>
      </div>
      <div class="absolute bottom-0 left-0"><IphoneKeyboard mode={props.mode} type="lower" /></div>
    </Screen>
  );
}
