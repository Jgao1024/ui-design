import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ProgressBar, Spinner } from "../../components/controls.tsx";
import { Surface } from "../../components/surface.tsx";
import { textCss } from "../../components/text.tsx";
import { tone } from "../../theme.ts";

export default function ProgressIndicators(): Markup {
  return (
    <Page title="Progress indicators" subtitle="Source: figma/reference/ios27/specs/03-controls/Progress-Indicators__*.json">
      <Section title="Determinate linear" description="402 x 44: a 17 pt label above a 370 x 4 track. Values 0 to 100 % in steps of 10." gap={10}>
        {[[0, 10, 20, 30], [40, 50, 60, 70], [80, 90, 100]].map((values) => (
          <Row columns={4} width={402}>
            {values.flatMap((value) =>
              (["light", "dark"] as const).map((mode) => (
                <Variant title={`${value} %, ${mode === "light" ? "Light" : "Dark"}`} caption={`Value=${value}%`}>
                  <Surface mode={mode} level="grouped" width={402}><ProgressBar mode={mode} value={value} /></Surface>
                </Variant>
              ))
            )}
          </Row>
        ))}
      </Section>
      <Section title="Indeterminate circular (spinner)" description="Eight bars fading round: 14 (Small), 20 (Regular) and 35 pt (Large), with an optional 17 pt label at 60 %." gap={10}>
        {[["Small", 14, 4], ["Regular", 20, 8], ["Large", 35, 8]].map(([name, size, gap]) => (
          <Row columns={2} width={240}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${name}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Size=${name}`}>
                <Surface mode={mode} level="grouped" width={240} height={80} class="grid place-items-center">
                  <div class="flex items-center" style={`gap:${gap}px;${textCss("body")};color:${tone(mode).label2}`}>
                    <Spinner mode={mode} size={Number(size)} />
                    <span>Status...</span>
                  </div>
                </Surface>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
