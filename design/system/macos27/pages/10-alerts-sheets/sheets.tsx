import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Sheet } from "../../components/overlay.tsx";

export default function Sheets(): Markup {
  return (
    <Page title="Sheets" subtitle="macOS 27 · Figma page Sheets.">
      <Section
        title="Sheet"
        description="300 × 300, radius 16, white (Light) or #1E1E1E (Dark), shadow 0 / 54 and 1. The only content in Figma is the 24 pt text Content View."
        gap={12}
      >
        <Row columns={1} width={720}>
          <Variant title="Light and Dark" caption="Text black 85%; Dark text colour inferred.">
            <ModePair width={356} height={340} draw={(mode) => <Sheet mode={mode}><span class="text-2xl">Content View</span></Sheet>} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
