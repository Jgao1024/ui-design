import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Menu, menuHeight } from "../../components/menu.tsx";
import type { MenuEntry } from "../../components/menu.tsx";

const MIXED: MenuEntry[] = [
  { kind: "item", label: "Label", shortcut: "⌘A" },
  { kind: "item", label: "Label", shortcut: "⇧⌘A", state: "hover" },
  { kind: "item", label: "Label" },
  { kind: "item", label: "Label", state: "disabled", shortcut: "⌥⌘A" },
  { kind: "separator" },
  { kind: "header", title: "Header", inset: false },
  { kind: "item", label: "Label" },
  { kind: "item", label: "Label", submenu: true },
  { kind: "separator" },
  { kind: "item", label: "Label", shortcut: "⌃⌘A", state: "key" },
  { kind: "item", label: "Label", submenu: true },
];

const SELECTION: MenuEntry[] = [
  { kind: "header", title: "Header" },
  { kind: "item", label: "Label", checked: true, selection: true },
  { kind: "item", label: "Label", state: "hover", selection: true },
  { kind: "item", label: "Label", selection: true },
  { kind: "separator" },
  { kind: "item", label: "Label", submenu: true, state: "key", selection: true },
];

export default function Menus(): Markup {
  return (
    <Page title="Menus" subtitle="macOS 27 · Figma page Menus. A 244 px Liquid Glass panel of 24 px items; Dark item colours are inferred.">
      <Section
        title="Menu"
        description="Radius 12, 12 px side and 5 px top and bottom padding. Items are 24 px, separators 11 px, headers 25 px. The hover item is #E6E6E6; the item under the keyboard or pointer with Key is #0069F9 with white text."
        gap={12}
      >
        <Row columns={1} width={1000}>
          <Variant title="Items, header, separators, shortcuts" caption="Texts are the Figma defaults: Label, Header; shortcuts show modifier glyphs and A.">
            <ModePair width={400} height={menuHeight(MIXED) + 40} draw={(mode) => <Menu mode={mode} entries={MIXED} />} />
          </Variant>
        </Row>
        <Row columns={1} width={1000}>
          <Variant title="Menu that has a selection" caption="Items shift 24 px to make room for the checkmark; the header is inset 20 px.">
            <ModePair width={400} height={menuHeight(SELECTION) + 40} draw={(mode) => <Menu mode={mode} entries={SELECTION} />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
