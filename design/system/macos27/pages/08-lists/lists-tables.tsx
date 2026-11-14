import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { MODES } from "../../components/stage.tsx";
import { ColumnHeader, Table, TableRow } from "../../components/table.tsx";
import type { Mode } from "../../theme.ts";

// Column widths: Figma's table is 180 + 3 x 140; the page narrows the columns so that Light and Dark fit side by side.
const COLUMNS = [150, 110, 110, 110];
const WIDTH = 480;

function Pair(props: { draw: (mode: Mode) => Child }): Markup {
  return (
    <div class="flex gap-2">
      {MODES.map((mode) => <Table mode={mode} width={WIDTH}>{props.draw(mode)}</Table>)}
    </div>
  );
}

export default function ListsTables(): Markup {
  return (
    <Page title="Lists and Tables" subtitle="macOS 27 · Figma page Lists and Tables. 20 px rows; the page narrows the columns to 150 + 3 × 110.">
      <Section
        title="Row backgrounds"
        description="A selection is inset 10 px each side with radius 8. Active is #0165E2 with white text; Inactive is black 14%; alternating rows are black 5%. Dark values are inferred."
        gap={12}
      >
        <Row columns={1} width={1000}>
          <Variant title="Default · Alternating · Selected · Inactive" caption="First column black 85%, the others black 50%.">
            <Pair
              draw={(mode) => (
                <>
                  <TableRow mode={mode} columns={COLUMNS} />
                  <TableRow mode={mode} columns={COLUMNS} kind="alternating" />
                  <TableRow mode={mode} columns={COLUMNS} />
                  <TableRow mode={mode} columns={COLUMNS} kind="selected" />
                  <TableRow mode={mode} columns={COLUMNS} kind="inactive" />
                  <TableRow mode={mode} columns={COLUMNS} />
                </>
              )}
            />
          </Variant>
        </Row>
      </Section>
      <Section
        title="Column headers"
        description="28 px high; 11 pt labels. The sorted column is Bold black 85% with a 9 pt chevron: up for ascending, down for descending. Other columns have a black 10% rule on the left."
        gap={12}
      >
        <Row columns={1} width={1000}>
          <Variant title="Ascending" caption="First column sorted.">
            <Pair draw={(mode) => <ColumnHeader mode={mode} columns={COLUMNS} sorted={0} order="ascending" />} />
          </Variant>
        </Row>
        <Row columns={1} width={1000}>
          <Variant title="Descending" caption="Second column sorted.">
            <Pair draw={(mode) => <ColumnHeader mode={mode} columns={COLUMNS} sorted={1} order="descending" />} />
          </Variant>
        </Row>
        <Row columns={1} width={1000}>
          <Variant title="Not sorted" caption="All labels Medium black 50%.">
            <Pair draw={(mode) => <ColumnHeader mode={mode} columns={COLUMNS} />} />
          </Variant>
        </Row>
      </Section>
      <Section title="Table" description="Header and rows together, as in a window." gap={12}>
        <Row columns={1} width={1000}>
          <Variant title="Table with a selection" caption="Folder icons stand in for Figma's images.">
            <Pair
              draw={(mode) => (
                <>
                  <ColumnHeader mode={mode} columns={COLUMNS} sorted={0} order="ascending" />
                  <TableRow mode={mode} columns={COLUMNS} />
                  <TableRow mode={mode} columns={COLUMNS} kind="alternating" />
                  <TableRow mode={mode} columns={COLUMNS} kind="selected" />
                  <TableRow mode={mode} columns={COLUMNS} kind="alternating" />
                  <TableRow mode={mode} columns={COLUMNS} />
                  <TableRow mode={mode} columns={COLUMNS} kind="alternating" />
                </>
              )}
            />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
