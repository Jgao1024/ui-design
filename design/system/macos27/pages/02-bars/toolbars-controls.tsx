import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair, SurfacePair } from "../../components/stage.tsx";
import { Glass } from "../../components/glass.tsx";
import { Icon } from "../../components/icons.tsx";
import type { IconName } from "../../components/icons.tsx";
import { ToolbarPopUp, ToolbarPullDown, ToolbarSearch, ToolbarSegmented } from "../../components/toolbar.tsx";
import type { SearchState, ToolbarSize } from "../../components/toolbar.tsx";
import { UI } from "../../theme.ts";
import type { Mode } from "../../theme.ts";

const HEIGHT: Record<ToolbarSize, number> = { medium: 56, xl: 72 };

function Tile(props: { title: string; caption: string; size: ToolbarSize; width?: number; draw: (mode: Mode) => Child }): Markup {
  return (
    <Variant title={props.title} caption={props.caption}>
      <ModePair width={props.width ?? 280} height={HEIGHT[props.size]} draw={(mode) => <div class="flex items-center gap-2">{props.draw(mode)}</div>} />
    </Variant>
  );
}

function Menus(props: { size: ToolbarSize }): Markup {
  const size = props.size;
  return (
    <>
    <Row columns={2} width={568}>
      <Tile
        title="Pop-up button · Idle"
        caption={`Label and an up-down indicator. ${size === "xl" ? 63 : 57} px with the default label.`}
        size={size}
        draw={(mode) => <ToolbarPopUp mode={mode} size={size} label="Label" />}
      />
      <Tile
        title="Pop-up button · Disabled"
        caption="Label and indicator use the disabled symbol colour."
        size={size}
        draw={(mode) => <ToolbarPopUp mode={mode} size={size} label="Label" disabled />}
      />
    </Row>
    <Row columns={2} width={568}>
      <Tile
        title="Pull-down button · Idle"
        caption={`Symbol and a down indicator. ${size === "xl" ? 50 : 39} px.`}
        size={size}
        draw={(mode) => <ToolbarPullDown mode={mode} size={size} icon="share" />}
      />
      <Tile
        title="Pull-down button · Disabled"
        caption="Symbol and indicator dim."
        size={size}
        draw={(mode) => <ToolbarPullDown mode={mode} size={size} icon="share" disabled />}
      />
    </Row>
    </>
  );
}

function Segmented(props: { size: ToolbarSize }): Markup {
  const size = props.size;
  const labels = ["Label", "Label", "Label"];
  return (
    <Row columns={2} width={568}>
      <Tile
        title="Idle"
        caption={`${size === "xl" ? 145 : 121} px wide with three items. Item widths are inferred: equal shares of the capsule.`}
        size={size}
        draw={(mode) => <ToolbarSegmented mode={mode} size={size} labels={labels} />}
      />
      <Tile
        title="Selected"
        caption="The selected item gets a pill: #E6E6E6 (Light) or #141414 (Dark)."
        size={size}
        draw={(mode) => <ToolbarSegmented mode={mode} size={size} labels={labels} selected={1} />}
      />
    </Row>
  );
}

const SEARCH_STATES: { state: SearchState; disabled?: boolean; title: string; caption: string }[] = [
  { state: "placeholder", title: "Placeholder", caption: "Magnifier and \"Search\" in the secondary colour." },
  { state: "value", title: "Value", caption: "Magnifier and the entered text." },
  { state: "typing", title: "Typing", caption: "Accent caret, focus ring." },
  { state: "focused", title: "Focused", caption: "Empty field with caret and focus ring." },
  { state: "placeholder", disabled: true, title: "Placeholder + Disabled", caption: "Everything #BFBFBF (Light) or #404040 (Dark)." },
  { state: "value", disabled: true, title: "Value + Disabled", caption: "Same dim colour for the text." },
];

function Searches(props: { size: ToolbarSize }): Markup {
  const size = props.size;
  const cell = (index: number) => {
    const item = SEARCH_STATES[index];
    return (
      <Tile
        title={item.title}
        caption={item.caption}
        size={size}
        width={160}
        draw={(mode) => <ToolbarSearch mode={mode} size={size} state={item.state} disabled={item.disabled} />}
      />
    );
  };
  return (
    <>
      <Row columns={3} width={328}>{cell(0)}{cell(1)}{cell(2)}</Row>
      <Row columns={3} width={328}>{cell(3)}{cell(4)}{cell(5)}</Row>
    </>
  );
}

const TABS: IconName[] = ["circle", "slider", "square", "photo", "paintbrush"];

function TabBar(props: { mode: Mode; selected?: number }): Markup {
  return (
    <div class="flex">
      {TABS.map((icon, index) => (
        <div class="relative flex h-[30px] w-[44px] items-center justify-center" style={`color:${UI[props.mode].label}`}>
          {props.selected === index
            ? <div class="absolute inset-0"><Glass width={44} height={30} radius={6} mode={props.mode} size="small"><span /></Glass></div>
            : null}
          <span class="relative"><Icon name={icon} size={18} /></span>
        </div>
      ))}
    </div>
  );
}

export default function ToolbarsControls(): Markup {
  return (
    <Page title="Toolbars · Controls" subtitle="macOS 27 · Figma page Toolbars. Pop-up, pull-down, segmented, search and utility tab bar.">
      <Section title="Pop-up and pull-down · XL" description="36 px glass capsules. Both share the button symbol colours." gap={12}>
        <Menus size="xl" />
      </Section>
      <Section title="Pop-up and pull-down · Medium" description="24 px glass capsules for compact toolbars." gap={12}>
        <Menus size="medium" />
      </Section>
      <Section title="Segmented Control · XL" description="Items sit in a glass capsule with 4 px padding." gap={12}>
        <Segmented size="xl" />
      </Section>
      <Section title="Segmented Control · Medium" description="Same control with 2 px padding." gap={12}>
        <Segmented size="medium" />
      </Section>
      <Section
        title="Search · XL"
        description="130 × 36 capsule with a 16 px magnifier. Active = False has the same layout. The focus ring is inferred (accent, 3 px, 40%); Figma has no ring data."
        gap={12}
      >
        <Searches size="xl" />
      </Section>
      <Section title="Search · Medium" description="130 × 24 capsule." gap={12}>
        <Searches size="medium" />
      </Section>
      <Section
        title="Utility Panel Tab Bar"
        description="Five 44 × 30 tabs with 24 px images. The selected tab sits on a small glass pill, radius 6. Symbols are stand-ins for Figma's images."
        gap={12}
      >
        <Row columns={2} width={568}>
          <Variant title="First tab selected" caption="Tab bar is 220 × 30.">
            <SurfacePair width={280} height={56} draw={(mode) => <TabBar mode={mode} selected={0} />} />
          </Variant>
          <Variant title="Fourth tab selected" caption="Only one tab is selected.">
            <SurfacePair width={280} height={56} draw={(mode) => <TabBar mode={mode} selected={3} />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
