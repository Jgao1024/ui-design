import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { ColumnHeader, GroupTitle, Table, TableRow } from "../../components/table.tsx";
import type { Mode } from "../../theme.ts";

const COLUMNS = [150, 110, 110, 110];
const WIDTH = 480;

function Pair(props: { draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => <Table mode={mode} width={WIDTH}>{props.draw(mode)}</Table>)}
    </div>
  );
}

export default function OutlineViews(): Markup {
  return (
    <Page title="Lists and Tables · Outline" subtitle="macOS 27 · Figma page Lists and Tables. Hierarchical rows and group titles.">
      <Section
        title="Levels"
        description="Each level indents the disclosure chevron, icon and label by 15 px (levels 0 to 4). The chevron is 9 px wide; Expanded = True points down."
        gap={12}
      >
        <Row columns={1} width={1000}>
          <Variant title="Level 0 to 4" caption="Chevron at 16 px + 15 px per level, then an 18 px icon.">
            <Pair
              draw={(mode) => (
                <>
                  <TableRow mode={mode} columns={COLUMNS} level={0} disclosure="open" />
                  <TableRow mode={mode} columns={COLUMNS} level={1} disclosure="open" />
                  <TableRow mode={mode} columns={COLUMNS} level={2} disclosure="open" />
                  <TableRow mode={mode} columns={COLUMNS} level={3} disclosure="closed" />
                  <TableRow mode={mode} columns={COLUMNS} level={4} icon={false} />
                </>
              )}
            />
          </Variant>
        </Row>
      </Section>
      <Section title="Selected rows" description="Selected + Active is #0165E2 with a white chevron, icon and text; Selected + Inactive is black 14% with normal text." gap={12}>
        <Row columns={1} width={1000}>
          <Variant title="Active and inactive" caption="Level 1 rows.">
            <Pair
              draw={(mode) => (
                <>
                  <TableRow mode={mode} columns={COLUMNS} level={1} disclosure="open" kind="selected" />
                  <TableRow mode={mode} columns={COLUMNS} level={1} disclosure="closed" kind="inactive" />
                  <TableRow mode={mode} columns={COLUMNS} level={1} disclosure="closed" kind="alternating" />
                </>
              )}
            />
          </Variant>
        </Row>
      </Section>
      <Section title="Outline view" description="Header, rows and a group title: 45 px high, 11 pt Semibold black 50%, 50 px in." gap={12}>
        <Row columns={1} width={1000}>
          <Variant title="With a group title" caption="Default text is Group Title.">
            <Pair
              draw={(mode) => (
                <>
                  <ColumnHeader mode={mode} columns={COLUMNS} sorted={0} order="ascending" />
                  <TableRow mode={mode} columns={COLUMNS} disclosure="open" />
                  <TableRow mode={mode} columns={COLUMNS} level={1} kind="alternating" />
                  <TableRow mode={mode} columns={COLUMNS} level={1} kind="selected" />
                  <GroupTitle mode={mode} width={WIDTH} />
                  <TableRow mode={mode} columns={COLUMNS} disclosure="closed" />
                  <TableRow mode={mode} columns={COLUMNS} kind="alternating" disclosure="closed" />
                </>
              )}
            />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
