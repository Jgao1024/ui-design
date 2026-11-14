import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { ImageWell } from "../../components/well.tsx";

export default function ImageWells(): Markup {
  return (
    <Page title="Image Wells" subtitle="macOS 27 · Figma page Image Wells. The image is a bitmap in Figma; a photo symbol stands in.">
      <Section title="Image well" description="30 × 30, radius 3, black 2% fill. The 24 × 24 image sits 3 px in. The outline is inferred." gap={12}>
        <Row columns={3} width={360}>
          <Variant title="Enabled" caption="Enabled = True.">
            <SurfacePair width={176} height={56} draw={(mode) => <ImageWell mode={mode} />} />
          </Variant>
          <Variant title="Disabled" caption="Whole well at 50% opacity.">
            <SurfacePair width={176} height={56} draw={(mode) => <ImageWell mode={mode} disabled />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
