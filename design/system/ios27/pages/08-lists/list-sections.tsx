import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { IndexBar, ListGroup, ListHeader, ListRow, SectionTitle, SwipeRow } from "../../components/lists.tsx";
import { Surface } from "../../components/surface.tsx";
import { tone } from "../../theme.ts";

const MODES = ["light", "dark"] as const;
const name = (mode: "light" | "dark") => (mode === "light" ? "Light" : "Dark");

export default function ListSections(): Markup {
  return (
    <Page title="List headers, swipe actions and index" subtitle="Source: figma/reference/ios27/specs/05-collections/Lists__*.json">
      <Section title="Headers" description="402 wide with 16 pt padding: Extra Prominent 48 tall, Prominent 45, Nested 42. A section title is 17/22 semibold at 60 % label." gap={10}>
        {(["extra-prominent", "prominent", "nested"] as const).map((type) => (
          <Row columns={2} width={402}>
            {MODES.map((mode) => (
              <Variant title={`${type === "extra-prominent" ? "Extra Prominent" : type === "prominent" ? "Prominent" : "Nested"}, ${name(mode)}`} caption={`Type=${type === "extra-prominent" ? "Extra Prominent" : type === "prominent" ? "Prominent" : "Nested"}`}>
                <Surface mode={mode} level="grouped" width={402} radius={0}><ListHeader mode={mode} type={type} /></Surface>
              </Variant>
            ))}
          </Row>
        ))}
        <Row columns={2} width={402}>
          {MODES.map((mode) => (
            <Variant title={`Section title, ${name(mode)}`} caption="Section Title">
              <Surface mode={mode} level="grouped" width={402} radius={0} class="px-0"><SectionTitle mode={mode} text="A" width={402} /></Surface>
            </Variant>
          ))}
        </Row>
      </Section>

      <Section title="Swipe actions" description="Actions behind a row: symbol only (60 x 44), symbol and label (84 x 44), or symbol over label (60 x 68)." gap={10}>
        <Row columns={2} width={340}>
          {MODES.map((mode) => {
            const t = tone(mode);
            return (
              <Variant title={`Swipe actions, ${name(mode)}`} caption="Symbol and Label; Symbol only">
                <Surface mode={mode} level="grouped" width={340} class="flex flex-col items-center gap-4 py-5">
                  <SwipeRow mode={mode} actions={[{ icon: "star", color: t.orange, label: "Flag" }, { icon: "trash", color: t.red, label: "Delete" }]} />
                  <SwipeRow mode={mode} actions={[{ icon: "share", color: t.blue }, { icon: "trash", color: t.red }]} />
                </Surface>
              </Variant>
            );
          })}
        </Row>
      </Section>

      <Section title="Index bar" description="A 30 wide strip of 12/16 letters in the tint, 700 tall on iPad." gap={10}>
        <Row columns={4} width={120}>
          {MODES.map((mode) => (
            <Variant title={`Index bar, ${name(mode)}`} caption="Device=iPad">
              <Surface mode={mode} level="grouped" width={120} class="flex justify-center"><IndexBar mode={mode} /></Surface>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
