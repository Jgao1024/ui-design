import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { At, Desktop, Scaled } from "../../components/desktop.tsx";
import { Window } from "../../components/window.tsx";
import { Alert, Sheet } from "../../components/overlay.tsx";
import { Button } from "../../components/button.tsx";
import { UtilityPanel } from "../../components/utility-panel.tsx";
import { UI } from "../../theme.ts";
import type { Mode } from "../../theme.ts";

const SCALE = 0.38;

function Pair(props: { draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => <Scaled scale={SCALE}><Desktop mode={mode}>{props.draw(mode)}</Desktop></Scaled>)}
    </div>
  );
}

function Case(props: { title: string; caption: string; draw: (mode: Mode) => Child }): Markup {
  return (
    <Row columns={1} width={1168}>
      <Variant title={props.title} caption={props.caption}><Pair draw={props.draw} /></Variant>
    </Row>
  );
}

function SaveButtons(props: { mode: Mode }): Markup {
  return (
    <div class="flex h-14 items-center justify-end gap-2 px-4" style={`box-shadow:inset 0 1px 0 ${UI[props.mode].separator}`}>
      <Button mode={props.mode} />
      <Button mode={props.mode} style="prominent" />
    </div>
  );
}

export default function ExamplesDialogs(): Markup {
  return (
    <Page title="Examples · Alerts and Dialogs" subtitle="macOS 27 · Figma page Examples. Whole desktops at 38%.">
      <Section title="Alerts" description="The 260 × 152 side-by-side alert at (626, 421); and over a 900 × 600 window at (306, 196), where the alert is placed at the centre of the window (inferred)." gap={12}>
        <Case
          title="Alert · Side by side"
          caption="Alert alone on the desktop."
          draw={(mode) => <At x={626} y={421}><Alert mode={mode} layout="side-by-side" /></At>}
        />
        <Case
          title="Alert · Side by side · Window modal"
          caption="Window behind the alert."
          draw={(mode) => (
            <>
              <At x={306} y={196}><Window mode={mode} width={900} height={600} type="default" title="Title" /></At>
              <At x={626} y={422}><Alert mode={mode} layout="side-by-side" /></At>
            </>
          )}
        />
      </Section>
      <Section
        title="Save dialogs"
        description="A window at (306, 196). Small: a 390 × 318 sheet hangs from the top of the window (position inferred). Large: the window is the 1000 × 448 split-view dialog's shape drawn at the 900 × 600 window size (inferred)."
        gap={12}
      >
        <Case
          title="Dialog Save · Small"
          caption="Content area and a 56 px button row; buttons are the default Button."
          draw={(mode) => (
            <>
              <At x={306} y={196}><Window mode={mode} width={900} height={600} type="default" title="Title" /></At>
              <At x={561} y={226}>
                <Sheet mode={mode} width={390} height={318}>
                  <div class="flex size-full flex-col justify-end"><SaveButtons mode={mode} /></div>
                </Sheet>
              </At>
            </>
          )}
        />
        <Case
          title="Dialog Save · Large"
          caption="Window with a 210 px leading pane."
          draw={(mode) => <At x={306} y={196}><Window mode={mode} width={900} height={600} type="default" title="Title" sidebar /></At>}
        />
      </Section>
      <Section title="Utility window" description="The 300 × 300 utility panel at (606, 347)." gap={12}>
        <Case title="Utility window" caption="Panel with the colour tab bar." draw={(mode) => <At x={606} y={347}><UtilityPanel mode={mode} active /></At>} />
      </Section>
    </Page>
  );
}
