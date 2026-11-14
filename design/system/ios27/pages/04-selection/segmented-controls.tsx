import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { SegmentedControl } from "../../components/controls.tsx";
import { Surface } from "../../components/surface.tsx";

export default function SegmentedControls(): Markup {
  return (
    <Page title="Segmented controls" subtitle="Source: figma/reference/ios27/specs/03-controls/Segmented-Controls__*.json">
      <Section title="Segmented control" description="A capsule filled #767680 at 12 %. Small 32 pt, Large 50 pt tall; 370 pt wide in Figma. The selected option is a white capsule with a soft shadow. Disabled is 50 % opacity." gap={10}>
        {(["small", "large"] as const).map((size) =>
          [2, 3].map((count) => (
            <Row columns={2} width={420}>
              {(["light", "dark"] as const).map((mode) => (
                <Variant title={`${size === "small" ? "Small" : "Large"}, ${count} options, ${mode === "light" ? "Light" : "Dark"}`} caption={`Size=${size === "small" ? "Small" : "Large"}, Is Enabled=True, then False`}>
                  <Surface mode={mode} level="grouped" width={420} class="flex flex-col gap-4 px-6 py-5">
                    <SegmentedControl mode={mode} size={size} options={["One", "Two", "Three"].slice(0, count)} selected={0} />
                    <SegmentedControl mode={mode} size={size} options={["One", "Two", "Three"].slice(0, count)} selected={count - 1} enabled={false} />
                  </Surface>
                </Variant>
              ))}
            </Row>
          ))
        )}
      </Section>
    </Page>
  );
}
