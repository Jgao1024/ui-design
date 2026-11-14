import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { EmptyState } from "../../components/system.tsx";

export default function EmptyStates(): Markup {
  return (
    <Page title="Empty states" subtitle="Source: figma/reference/ios27/specs/03-controls/Empty-States__Empty-States.json">
      <Section title="Empty state" description="Centred content with 16 pt gaps and a glass button 330 wide, 36 pt from the sides. Types: title and subtitle, symbol in a circle, large symbol." gap={10}>
        {(["title", "circle", "large"] as const).map((type) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${type === "title" ? "Title and Subtitle" : type === "circle" ? "Symbol in Circle" : "Large Symbol"}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Type=${type === "title" ? "Title and Subtitle" : type === "circle" ? "Symbol in Circle" : "Large Symbol"}`}>
                <div class="overflow-hidden rounded-[24px]"><EmptyState mode={mode} type={type} /></div>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
