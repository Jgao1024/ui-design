import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Menu, menuHeight } from "../../components/menu.tsx";
import type { MenuEntry, MenuState } from "../../components/menu.tsx";

const STATES: { state: MenuState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Label #1A1A1A, shortcuts #BFBFBF." },
  { state: "hover", title: "Hover", caption: "Fill #E6E6E6, radius 8." },
  { state: "key", title: "Hover + Key", caption: "Fill #0069F9, label and shortcuts white." },
  { state: "disabled", title: "Disabled", caption: "Label and shortcuts #BFBFBF." },
];

function Cell(props: { title: string; caption: string; entries: MenuEntry[] }): Markup {
  return (
    <Variant title={props.title} caption={props.caption}>
      <ModePair
        width={276}
        height={menuHeight(props.entries) + 24}
        draw={(mode) => <Menu mode={mode} entries={props.entries} width={260} />}
      />
    </Variant>
  );
}

function Kind(props: { submenu: boolean; checked: boolean }): Markup {
  const entry = (state: MenuState): MenuEntry[] => [
    { kind: "item", label: "Label", state, submenu: props.submenu, checked: props.checked, selection: props.checked, shortcut: props.submenu ? undefined : "⌥⇧⌘A" },
  ];
  return (
    <>
      <Row columns={2} width={568}>
        {STATES.slice(0, 2).map((item) => <Cell title={item.title} caption={item.caption} entries={entry(item.state)} />)}
      </Row>
      <Row columns={2} width={568}>
        {STATES.slice(2).map((item) => <Cell title={item.title} caption={item.caption} entries={entry(item.state)} />)}
      </Row>
    </>
  );
}

export default function MenusItems(): Markup {
  return (
    <Page title="Menus · Items" subtitle="macOS 27 · Figma page Menus, Menu Items. State, Type and Menu has Selection.">
      <Section title="Action" description="Menu has Selection = False. Shortcuts: control, option, shift, command and a letter, right aligned." gap={12}>
        <Kind submenu={false} checked={false} />
      </Section>
      <Section title="Action · With selection" description="Menu has Selection = True: a 10 pt Bold checkmark at 6 px and the label at 24 px." gap={12}>
        <Kind submenu={false} checked />
      </Section>
      <Section title="Submenu" description="A 13 pt Bold chevron closes the row instead of shortcuts." gap={12}>
        <Kind submenu checked={false} />
      </Section>
    </Page>
  );
}
