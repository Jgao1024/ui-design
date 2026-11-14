import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { PopUpButton } from "../../components/controls.tsx";
import { Surface } from "../../components/surface.tsx";

export default function PopUpButtons(): Markup {
  return (
    <Page title="Pop-up buttons" subtitle="Source: figma/reference/ios27/specs/03-controls/Pop-up-Buttons__Popup-Button.json">
      <Section title="Pop-up button" description="A tinted 18 pt semibold label with an up-down chevron, 44 pt tall. Disabled is #3C3C43 at 30 %." gap={10}>
        <Row columns={4} width={200}>
          {(["light", "dark"] as const).flatMap((mode) =>
            [true, false].map((enabled) => (
              <Variant title={`${mode === "light" ? "Light" : "Dark"}, ${enabled ? "enabled" : "disabled"}`} caption={`Is Enabled=${enabled}`}>
                <Surface mode={mode} level={2} width={200} height={80} class="grid place-items-center">
                  <PopUpButton mode={mode} enabled={enabled} />
                </Surface>
              </Variant>
            ))
          )}
        </Row>
      </Section>
    </Page>
  );
}
