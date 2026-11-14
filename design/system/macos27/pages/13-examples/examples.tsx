import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { At, Desktop, Scaled } from "../../components/desktop.tsx";
import { Window } from "../../components/window.tsx";
import type { WindowType } from "../../components/window.tsx";
import type { Mode } from "../../theme.ts";

const SCALE = 0.38;

function Pair(props: { draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => <Scaled scale={SCALE}><Desktop mode={mode}>{props.draw(mode)}</Desktop></Scaled>)}
    </div>
  );
}

function Example(props: { title: string; caption: string; type: WindowType; title_?: string; sidebar?: boolean }): Markup {
  return (
    <Row columns={1} width={1168}>
      <Variant title={props.title} caption={props.caption}>
        <Pair
          draw={(mode) => (
            <At x={200} y={120}>
              <Window mode={mode} width={900} height={600} type={props.type} title={props.title_ ?? "Title"} sidebar={props.sidebar} />
            </At>
          )}
        />
      </Variant>
    </Row>
  );
}

export default function Examples(): Markup {
  return (
    <Page title="Examples · Windows" subtitle="macOS 27 · Figma page Examples. Whole desktops, 1512 × 993, drawn at 38%: wallpaper, menu bar, Dock and a 900 × 600 window at (200, 120).">
      <Section title="Window types on the desktop" description="The same window in four types. Window shapes and toolbars are the ones from the Windows pages; content is empty as in Figma." gap={12}>
        <Example
          title="Default with Titlebar and Sidebar"
          caption="30 px title bar, 240 px sidebar."
          type="default"
          sidebar
        />
        <Example title="Expanded Toolbar + Title" caption="31 px title bar and a 44 px toolbar row." type="expanded" />
        <Example title="Unified Compact Toolbar + Title" caption="One 40 px row for lights, title and 24 px toolbar parts." type="compact" />
        <Example title="Unified Toolbar + Title" caption="One 52 px row with XL toolbar parts." type="unified" />
      </Section>
    </Page>
  );
}
