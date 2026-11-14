import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { At, Desktop, Scaled } from "../../components/desktop.tsx";
import { Window } from "../../components/window.tsx";
import { Form, Mute, Title } from "../../components/form.tsx";
import { Menu } from "../../components/menu.tsx";
import type { MenuEntry } from "../../components/menu.tsx";
import { Notification, PointerGlyph } from "../../components/system-surface.tsx";
import { POINTERS } from "../../components/pointers-data.ts";
import { ColumnHeader, Table, TableRow } from "../../components/table.tsx";
import { Switch } from "../../components/toggle.tsx";
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

const MENU: MenuEntry[] = [
  { kind: "item", label: "Label", shortcut: "⌘A" },
  { kind: "item", label: "Label" },
  { kind: "separator" },
  { kind: "item", label: "Label", state: "key", shortcut: "⇧⌘A" },
  { kind: "item", label: "Label", submenu: true },
  { kind: "separator" },
  { kind: "item", label: "Label" },
  { kind: "item", label: "Label", state: "disabled" },
];

const COLUMNS = [420, 260, 260, 260];

export default function ExamplesContent(): Markup {
  const pointer = POINTERS.find((item) => item.slug === "default")!;
  return (
    <Page title="Examples · Content" subtitle="macOS 27 · Figma page Examples. Whole desktops at 38%: a form, a list, an open menu and notifications.">
      <Section title="Form" description="A 750 × 600 window at (381, 197) holding a form group." gap={12}>
        <Case
          title="Form"
          caption="Rows of title and trailing control."
          draw={(mode) => (
            <At x={381} y={197}>
              <Window mode={mode} width={750} height={600} type="default" title="Title">
                <div class="p-6">
                  <Form
                    mode={mode}
                    rows={[
                      [<Title mode={mode} subtitle />, <Mute mode={mode}>Label</Mute>],
                      [<Title mode={mode} />, <Switch mode={mode} size="mini" on />],
                      [<Title mode={mode} />, <Mute mode={mode}>Label</Mute>],
                      [<Title mode={mode} />, <Switch mode={mode} size="mini" />],
                    ]}
                  />
                </div>
              </Window>
            </At>
          )}
        />
      </Section>
      <Section title="List" description="A 1200 × 600 window at (156, 196) with a table. Column widths are the page's own." gap={12}>
        <Case
          title="List"
          caption="Header, alternating rows and a selected row."
          draw={(mode) => (
            <At x={156} y={196}>
              <Window mode={mode} width={1200} height={600} type="default" title="Title">
                <div class="pt-2">
                  <Table mode={mode} width={1200}>
                    <ColumnHeader mode={mode} columns={COLUMNS} sorted={0} order="ascending" />
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                      <TableRow mode={mode} columns={COLUMNS} kind={index === 3 ? "selected" : index % 2 ? "alternating" : "default"} />
                    ))}
                  </Table>
                </div>
              </Window>
            </At>
          )}
        />
      </Section>
      <Section title="Menu bar" description="A menu opens under the menu bar at (186, 35); the pointer sits at (494, 272)." gap={12}>
        <Case
          title="Menubar"
          caption="Menu 260 wide; the pointer is the default arrow."
          draw={(mode) => (
            <>
              <At x={186} y={35}><Menu mode={mode} entries={MENU} width={260} /></At>
              <At x={494} y={272}><PointerGlyph x={pointer.x} y={pointer.y} svg={pointer.svg} /></At>
            </>
          )}
        />
      </Section>
      <Section title="Notifications" description="A column of banners in the top-right corner, 376 px wide from x = 1136." gap={12}>
        <Case
          title="Notifications"
          caption="A single banner, a second banner and a stack."
          draw={(mode) => (
            <At x={1152} y={53}>
              <div class="flex flex-col gap-2">
                <Notification mode={mode} />
                <Notification mode={mode} />
                <Notification mode={mode} stack />
              </div>
            </At>
          )}
        />
      </Section>
    </Page>
  );
}
