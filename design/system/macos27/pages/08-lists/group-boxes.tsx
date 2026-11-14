import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { UI } from "../../theme.ts";

export default function GroupBoxes(): Markup {
  return (
    <Page title="Group Boxes" subtitle="macOS 27 · Figma page Group Boxes.">
      <Section
        title="Group box"
        description="200 × 200, radius 12, fill black 3% at 50% opacity, so the box is barely darker than the window. Dark is inferred: white 3%."
        gap={12}
      >
        <Row columns={1} width={800}>
          <Variant title="Group Box" caption="Figma's box is empty; content is up to the app.">
            <SurfacePair
              width={400}
              height={248}
              draw={(mode) => (
                <div
                  class="size-[200px] rounded-xl"
                  style={`background:${mode === "light" ? "rgb(0 0 0 / 0.03)" : "rgb(255 255 255 / 0.03)"};opacity:0.5;box-shadow:inset 0 0 0 1px ${UI[mode].separator}`}
                />
              )}
            />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
