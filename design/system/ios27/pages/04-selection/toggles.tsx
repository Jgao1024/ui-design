import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Switch } from "../../components/switch.tsx";
import { Surface } from "../../components/surface.tsx";

export default function Toggles(): Markup {
  return (
    <Page title="Toggles" subtitle="Switch. Source: figma/reference/ios27/specs/03-controls/Toggles__Toggle---Switch.json">
      {(["light", "dark"] as const).map((mode) => (
        <Section title={mode === "light" ? "Light" : "Dark"} description="64 x 28 track, 38 x 24 white knob. On is green #34C759. Pressed shows the glass lens knob, 58 x 38. Disabled is 50 % opacity. Figma has no Dark set; the Dark off track uses #EBEBF5 at 30 %." gap={10}>
          {[true, false].map((enabled) => (
            <Row columns={4} width={200}>
              {[false, true].flatMap((on) =>
                [false, true].map((pressed) => (
                  <Variant title={`${on ? "On" : "Off"}, ${pressed ? "pressed" : "idle"}`} caption={`Is On=${on}, State=${pressed ? "Pressed" : "Idle"}, Is Enabled=${enabled}`}>
                    <Surface mode={mode} level="grouped" width={200} height={80} class="grid place-items-center">
                      <Switch mode={mode} on={on} pressed={pressed} enabled={enabled} />
                    </Surface>
                  </Variant>
                ))
              )}
            </Row>
          ))}
        </Section>
      ))}
    </Page>
  );
}
