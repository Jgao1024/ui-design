import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { Backdrop } from "../../components/backdrop.tsx";
import { Bezel } from "../../components/system-surface.tsx";

export default function Bezels(): Markup {
  return (
    <Page title="Product Bezels" subtitle="macOS 27 · Figma page Product Bezels. MacBook Pro with a Liquid Retina XDR display.">
      <Section
        title="MacBook Pro bezels"
        description="Figma's bezel is a photograph: 1930 × 1270 around a 1512 × 993 screen, in Silver and Space Gray. The bitmap is not drawn here; the shapes below keep its proportions and screen position."
        gap={12}
      >
        <Row columns={2} width={568}>
          <Variant title="Silver" caption="Screen 1512 × 993, offset 209 and 138 in the bezel.">
            <Backdrop mode="light" width={560} height={400}><Bezel width={440} color="silver" /></Backdrop>
          </Variant>
          <Variant title="Space Gray" caption="Same geometry, dark body.">
            <Backdrop mode="dark" width={560} height={400}><Bezel width={440} color="space-gray" /></Backdrop>
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
