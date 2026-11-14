import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Battery, StatusBar, Wifi } from "../../components/chrome.tsx";
import { Surface } from "../../components/surface.tsx";
import { textCss } from "../../components/text.tsx";
import { type Mode, tone } from "../../theme.ts";

const MODES: Mode[] = ["light", "dark"];
const name = (mode: Mode) => (mode === "light" ? "Light" : "Dark");

/// The iPad status bar with the menu bar: 1210 x 32, time and date on the left, menus, Wi-Fi and battery on the right.
function PadBar(props: { mode: Mode; fullScreen?: boolean; expanded?: boolean }): Markup {
  const t = tone(props.mode);
  const color = t.label;
  return (
    <Surface mode={props.mode} width={1210} height={32} radius={0} level={2}>
      <div class="absolute left-4 top-2 flex h-4 items-center gap-2" style={`${textCss("footnote", { weight: 510 })};font-size:14px;line-height:16px`}>
        {props.fullScreen
          ? <div class="flex gap-3"><span class="size-3 rounded-full" style="background:#ff5f57" /><span class="size-3 rounded-full" style="background:#febc2f" /><span class="size-3 rounded-full" style="background:#27c840" /></div>
          : <><span>9:41</span><span>AM</span><span class="ml-1">Wed Apr 1</span></>}
      </div>
      <div class="absolute left-[148px] top-0 flex h-8 items-center" style="font-size:14px;line-height:16px">
        {["Menu", "File", "Edit", "View"].map((menu, index) => (
          <span
            class="grid h-8 place-items-center rounded-full px-2.5"
            style={`font-weight:${index === 0 ? 700 : 510};${props.expanded && index === 1 ? `background:${t.fill3};box-shadow:0 2px 16px rgb(0 0 0 / 0.08)` : ""}`}
          >
            {menu}
          </span>
        ))}
      </div>
      <div class="absolute right-4 top-2 flex h-4 items-center gap-1.5" style={`color:${color}`}>
        <Wifi color={color} />
        <Battery color={color} />
      </div>
    </Surface>
  );
}

export default function StatusBars(): Markup {
  return (
    <Page title="Status bars and menu bar" subtitle="Source: figma/reference/ios27/specs/02-bars/Status-Bars-and-Menu-Bars__*.json">
      <Section title="Status bar, iPhone" description="402 x 62. Time 17 pt semibold in the left half, Dynamic Island in the middle, signal, Wi-Fi and battery in the right half. iPhone 18 Pro has a narrower island (95) and 8 pt side margins; 17 Pro uses 125 and none." gap={10}>
        <Row columns={4} width={402}>
          {(["17-pro", "18-pro"] as const).flatMap((model) =>
            MODES.map((mode) => (
              <Variant title={`${model === "17-pro" ? "iPhone 17 Pro" : "iPhone 18 Pro"}, ${name(mode)}`} caption={`iPhone=${model === "17-pro" ? "iPhone 17 Pro" : "iPhone 18 Pro and 18 Pro Max"}`}>
                <Surface mode={mode} width={402} height={62} radius={20}><StatusBar mode={mode} model={model} /></Surface>
              </Variant>
            ))
          )}
        </Row>
      </Section>

      <Section title="Status bar, iPad and menu bar" description="1210 x 32 with 16 pt side padding. Time, AM/PM and date on the left (14/16, weight 510), then the menus, then Wi-Fi and battery. Full screen replaces the time with the window controls; an expanded menu is highlighted in a capsule." gap={10}>
        {[
          ["Windowed", false, false],
          ["Menu expanded", false, true],
          ["Full screen", true, false],
          ["Full screen, menu expanded", true, true],
        ].map(([title, full, expanded]) => (
          <Row columns={1} width={1210}>
            <Variant title={String(title)} caption={`Full Screen=${full}, Menu Expanded=${expanded}`}>
              <div class="flex flex-col gap-3">
                <PadBar mode="light" fullScreen={Boolean(full)} expanded={Boolean(expanded)} />
                <PadBar mode="dark" fullScreen={Boolean(full)} expanded={Boolean(expanded)} />
              </div>
            </Variant>
          </Row>
        ))}
      </Section>
    </Page>
  );
}
