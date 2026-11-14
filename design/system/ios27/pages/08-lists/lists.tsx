import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ListGroup, ListRow, type TrailingKind } from "../../components/lists.tsx";
import { Surface } from "../../components/surface.tsx";

const TRAILING: [TrailingKind, string][] = [
  ["detail", "Detail"], ["drill-in", "Drill-in"], ["checkmark", "Checkmark"], ["symbol", "Symbol"], ["info", "Info"],
  ["button", "Button"], ["stepper", "Stepper"], ["pop-up", "Pop-up"], ["toggle", "Toggle"],
];
const MODES = ["light", "dark"] as const;

export default function Lists(): Markup {
  return (
    <Page title="Lists" subtitle="Rows in a grouped list. Source: figma/reference/ios27/specs/05-collections/Lists__*.json">
      <Section title="Row" description="300 wide, 52 pt tall; 68 pt with an image. 17/22 title, optional 15/20 subtitle, 16 pt side padding, 1 pt separator inset 16." gap={10}>
        <Row columns={2} width={340}>
          {MODES.map((mode) => (
            <Variant title={`Regular and tall, ${mode === "light" ? "Light" : "Dark"}`} caption="Height=Regular, Tall; Show Subtitle, Show Image">
              <Surface mode={mode} level="grouped" width={340} class="grid place-items-center py-5">
                <ListGroup mode={mode}>
                  <ListRow mode={mode} title="Title" />
                  <ListRow mode={mode} title="Title" subtitle="Subtitle" />
                  <ListRow mode={mode} title="Title" image />
                  <ListRow mode={mode} title="Title" subtitle="Subtitle" image last />
                </ListGroup>
              </Surface>
            </Variant>
          ))}
        </Row>
      </Section>

      <Section title="Trailing accessories" description="Detail text, drill-in chevron, checkmark, symbol, info, button, stepper, pop-up and toggle." gap={10}>
        <Row columns={2} width={340}>
          {MODES.map((mode) => (
            <Variant title={`Trailing, ${mode === "light" ? "Light" : "Dark"}`} caption="_Trailing: Show Drill-in, Checkmark, Symbol, Info; Type=Button, Stepper, Pop-up, Toggle">
              <Surface mode={mode} level="grouped" width={340} class="grid place-items-center py-5">
                <ListGroup mode={mode}>
                  {TRAILING.map(([kind, name], i) => <ListRow mode={mode} title={name} trailing={kind} last={i === TRAILING.length - 1} />)}
                </ListGroup>
              </Surface>
            </Variant>
          ))}
        </Row>
      </Section>

      <Section title="Editing" description="A 22 pt edit button on the leading edge (delete, selectable, selected) and a grabber on the trailing edge." gap={10}>
        <Row columns={2} width={340}>
          {MODES.map((mode) => (
            <Variant title={`Edit, ${mode === "light" ? "Light" : "Dark"}`} caption="Show Edit Button, Show Grabber">
              <Surface mode={mode} level="grouped" width={340} class="grid place-items-center py-5">
                <ListGroup mode={mode}>
                  <ListRow mode={mode} title="Title" edit="delete" grabber />
                  <ListRow mode={mode} title="Title" edit="selectable" grabber />
                  <ListRow mode={mode} title="Title" edit="selected" grabber last />
                </ListGroup>
              </Surface>
            </Variant>
          ))}
        </Row>
      </Section>

      <Section title="Button rows" description="A row whose title is the action: default in the tint, disabled #AEAEB2, destructive red." gap={10}>
        <Row columns={2} width={340}>
          {MODES.map((mode) => (
            <Variant title={`Row - Button, ${mode === "light" ? "Light" : "Dark"}`} caption="Value=Default, Disabled, Destructive">
              <Surface mode={mode} level="grouped" width={340} class="grid place-items-center py-5">
                <ListGroup mode={mode}>
                  <ListRow mode={mode} title="Action" action />
                  <ListRow mode={mode} title="Action" action disabled />
                  <ListRow mode={mode} title="Action" action destructive last />
                </ListGroup>
              </Surface>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
