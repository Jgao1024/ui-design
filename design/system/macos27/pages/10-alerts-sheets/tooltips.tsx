import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Tooltip } from "../../components/overlay.tsx";

export default function Tooltips(): Markup {
  return (
    <Page title="Tooltips" subtitle="macOS 27 · Figma page Tooltips.">
      <Section
        title="Tooltip"
        description="11 pt Medium text with 6 px side and 3 px top padding: 49 × 18 for Tooltip. The material is #ECECEC at 88% over a #333333 burn layer with a 60 blur, and a drop shadow. Dark is inferred."
        gap={12}
      >
        <Row columns={1} width={720}>
          <Variant title="Light and Dark" caption="Default text: Tooltip.">
            <ModePair width={176} height={72} draw={(mode) => <Tooltip mode={mode} />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
