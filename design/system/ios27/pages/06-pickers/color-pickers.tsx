import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ColorPickerSheet } from "../../components/pickers.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

export default function ColorPickers(): Markup {
  return (
    <Page title="Color pickers" subtitle="Source: figma/reference/ios27/specs/03-controls/Color-Pickers__*.json">
      <Section title="Color picker, iPhone" description="A 386 x 599 sheet over a dimmed screen (overlay black at 20 %). Toolbar, segmented control, 354 x 296 colour grid, opacity meter and swatches." gap={10}>
        <Row columns={2} width={402}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={mode === "light" ? "Light" : "Dark"}>
              <Wallpaper mode={mode} width={402} height={650}><div class="mt-6"><ColorPickerSheet mode={mode} /></div></Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
