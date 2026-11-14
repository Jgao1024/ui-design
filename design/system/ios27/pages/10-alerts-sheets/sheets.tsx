import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { SheetPhone } from "../../components/overlays.tsx";
import { ContentRows } from "../../components/chrome.tsx";

export default function Sheets(): Markup {
  return (
    <Page title="Sheets" subtitle="Source: figma/reference/ios27/specs/06-overlays/Sheets__*.json">
      <Section title="Sheet, iPhone" description="Medium detent: 390 x 459 inset 6 pt from the sides, rounded on all corners. Large detent: 402 x 812 starting 62 pt from the top. Overlay black at 20 %, grabber 36 x 4." gap={10}>
        {(["medium", "large"] as const).map((detent) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${detent === "medium" ? "Medium" : "Large"}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Detent=${detent === "medium" ? "Medium" : "Large"}, Show Grabber, Show Dimming Layer`}>
                <SheetPhone mode={mode} detent={detent}><ContentRows mode={mode} rows={4} top={72} /></SheetPhone>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
