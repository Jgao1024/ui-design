import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Glass } from "../../components/glass.tsx";
import { Menu, menuHeight } from "../../components/menu.tsx";
import type { MenuEntry } from "../../components/menu.tsx";

const HEADERS: { title: string; caption: string; inset: boolean }[] = [
  { title: "Inset = True", caption: "Text 20 px in.", inset: true },
  { title: "Inset = False", caption: "Text at the item edge.", inset: false },
];

function Panel(props: { entries: MenuEntry[]; width?: number }): Markup {
  return (
    <ModePair
      width={276}
      height={menuHeight(props.entries) + 24}
      draw={(mode) => <Menu mode={mode} entries={props.entries} width={props.width ?? 244} />}
    />
  );
}

export default function MenusParts(): Markup {
  return (
    <Page title="Menus · Parts" subtitle="macOS 27 · Figma page Menus. Headers, separators and the glass background.">
      <Section title="Headers" description="25 px high, 13 pt Bold #727272. The default text is Header." gap={12}>
        <Row columns={2} width={568}>
          {HEADERS.map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <Panel entries={[{ kind: "header", title: "Header", inset: item.inset }, { kind: "item", label: "Label" }]} />
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Separators" description="11 px high with a 1 px #E6E6E6 line that runs about 1.3 px past each side." gap={12}>
        <Row columns={2} width={568}>
          <Variant title="Separator" caption="Between two items.">
            <Panel entries={[{ kind: "item", label: "Label" }, { kind: "separator" }, { kind: "item", label: "Label" }]} />
          </Variant>
        </Row>
      </Section>
      <Section
        title="Shortcuts"
        description="Up to five modifiers (control, option, shift, command, fn) then a letter, each 12 px wide. They are #BFBFBF at rest and white on a Hover + Key row."
        gap={12}
      >
        <Row columns={2} width={568}>
          <Variant title="Hover + Key = False" caption="Shortcuts #BFBFBF.">
            <Panel entries={[{ kind: "item", label: "Label", shortcut: "⌃⌥⇧⌘A" }]} />
          </Variant>
          <Variant title="Hover + Key = True" caption="Shortcuts white.">
            <Panel entries={[{ kind: "item", label: "Label", shortcut: "⌃⌥⇧⌘A", state: "key" }]} />
          </Variant>
        </Row>
      </Section>
      <Section
        title="Background"
        description="120 × 120 glass, radius 12. Light: #D9D9D9 at 55% (luminosity) over #D9D9D9 at 40%, with a 48 blur shadow. Dark: #404040 at 80% (luminosity) and white 20% (overlay). Drawn with the panel Glass."
        gap={12}
      >
        <Row columns={1} width={568}>
          <Variant title="Menu Background" caption="Light and Dark.">
            <ModePair
              width={276}
              height={152}
              draw={(mode) => (
                <Glass width={120} height={120} radius={12} mode={mode} size="panel"><span /></Glass>
              )}
            />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
