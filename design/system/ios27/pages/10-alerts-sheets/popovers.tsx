import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Popover } from "../../components/overlays.tsx";
import { Surface } from "../../components/surface.tsx";

export default function Popovers(): Markup {
  return (
    <Page title="Popovers" subtitle="iPad only. Source: figma/reference/ios27/specs/06-overlays/Popovers__Popovers--iPad-Only-.json">
      <Section title="Popover" description="A rounded panel (radius 26, shadow 0 8 48 at 25 %) with a 24 x 12 arrow pointing at its anchor. The arrow can sit on any of the four edges." gap={10}>
        {(["top", "bottom", "left", "right"] as const).map((arrow) => (
          <Row columns={2} width={400}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`Arrow ${arrow}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Arrow edge: ${arrow}`}>
                <Surface mode={mode} level={2} width={400} height={300} class="grid place-items-center"><Popover mode={mode} arrow={arrow} /></Surface>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
