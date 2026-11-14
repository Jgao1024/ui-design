import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { SidebarItem, SidebarTile } from "../../components/sidebar.tsx";
import type { ItemState, SidebarSize } from "../../components/sidebar.tsx";
import type { Mode } from "../../theme.ts";

const ROW = { large: 36, medium: 32, small: 24 } as const;

/// Light and Dark sidebar tiles side by side, each 250 px wide.
function Pair(props: { height: number; active?: boolean; draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => (
        <SidebarTile mode={mode} active={props.active} width={250} height={props.height}>{props.draw(mode)}</SidebarTile>
      ))}
    </div>
  );
}

function Item(props: { size: SidebarSize; state: ItemState; title: string; caption?: string; active?: boolean }): Markup {
  return (
    <Variant title={props.title} caption={props.caption}>
      <Pair
        height={ROW[props.size] + 16}
        active={props.active}
        draw={(mode) => <SidebarItem mode={mode} active={props.active} size={props.size} state={props.state} icon="folder" label="Label" detail="Detail" />}
      />
    </Variant>
  );
}

function States(props: { size: SidebarSize }): Markup {
  return (
    <>
      <Row columns={2} width={508}>
        <Item size={props.size} state="idle" title="Idle" />
        <Item size={props.size} state="selected" title="Selected" caption="Pill #F2F2F2 (Light), #0D0D0D (Dark)." />
      </Row>
      <Row columns={2} width={508}>
        <Item size={props.size} state="disabled" title="Disabled" />
        <Item size={props.size} state="selected" active={false} title="Selected · inactive window" caption="Pill #FBFBFB (Light), #070707 (Dark)." />
      </Row>
    </>
  );
}

export default function SidebarItems(): Markup {
  return (
    <Page title="Sidebar Items" subtitle="macOS 27 · Figma page Sidebars, Item, _Leading, _Detail, _Selection">
      <Section title="Large" description="Row height 36, label 15 pt." gap={12}><States size="large" /></Section>
      <Section title="Medium" description="Row height 32, label 13 pt." gap={12}><States size="medium" /></Section>
      <Section title="Small" description="Row height 24, label 12 pt." gap={12}><States size="small" /></Section>

      <Section title="Levels and disclosure" description="Each level indents a row by 12 px (Level 0 to 4). The disclosure triangle opens or closes children." gap={12}>
        <Row columns={2} width={508}>
          <Variant title="Level 0 to 4" caption="Medium rows.">
            <Pair
              height={5 * 32 + 16}
              draw={(mode) => (
                <>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <SidebarItem mode={mode} size="medium" level={level} icon="folder" label={`Level ${level}`} disclosure={level < 4} />
                  ))}
                </>
              )}
            />
          </Variant>
          <Variant title="Disclosure" caption="Expanded and collapsed.">
            <Pair
              height={2 * 32 + 16}
              draw={(mode) => (
                <>
                  <SidebarItem mode={mode} size="medium" icon="folder" label="Expanded" disclosure />
                  <SidebarItem mode={mode} size="medium" icon="folder" label="Collapsed" disclosure={false} />
                </>
              )}
            />
          </Variant>
        </Row>
      </Section>

      <Section title="Leading icon" description="A symbol (tinted with the accent colour) or an image." gap={12}>
        <Row columns={2} width={508}>
          <Variant title="Symbol">
            <Pair height={64} draw={(mode) => <SidebarItem mode={mode} size="medium" icon="star" label="Label" />} />
          </Variant>
          <Variant title="Image">
            <Pair height={64} draw={(mode) => <SidebarItem mode={mode} size="medium" icon="image" label="Label" />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
