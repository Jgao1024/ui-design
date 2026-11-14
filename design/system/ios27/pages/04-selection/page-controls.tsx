import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { PageControl } from "../../components/controls.tsx";
import { Surface } from "../../components/surface.tsx";

export default function PageControls(): Markup {
  return (
    <Page title="Page controls" subtitle="Source: figma/reference/ios27/specs/03-controls/Page-Controls__*.json">
      <Section title="Page control" description="8 pt dots 8 apart in a 24 pt capsule with 12 pt side padding. The active dot is the label colour, the others #3C3C43 at 30 %. From 8 pages the outer dots shrink to 6 and 4." gap={10}>
        {[[2, "1-6"], [4, "1-6"], [6, "1-6"], [7, "7"], [8, "8+"], [10, "8+"]].map(([count, group]) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${count} pages, ${mode === "light" ? "Light" : "Dark"}`} caption={`Pages=${group}`}>
                <Surface mode={mode} level="grouped" width={402} height={44} class="grid place-items-center">
                  <PageControl mode={mode} count={Number(count)} selected={Math.min(2, Number(count) - 1)} />
                </Surface>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
