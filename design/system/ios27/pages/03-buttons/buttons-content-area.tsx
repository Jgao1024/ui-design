import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { type ButtonSize, ContentButton, type FlatStyle } from "../../components/buttons.tsx";
import { Surface } from "../../components/surface.tsx";
import { type Mode } from "../../theme.ts";

const MODES: Mode[] = ["light", "dark"];
const name = (mode: Mode) => (mode === "light" ? "Light" : "Dark");
const SIZES: ButtonSize[] = ["small", "medium", "large"];
const CONTENT = [["title", "Title only"], ["icon", "Icon only"], ["both", "Title and icon"]] as const;
const STYLES: [FlatStyle, string, string][] = [
  ["bordered", "Bordered", "Capsule filled #767680 at 12 %, tint label."],
  ["prominent", "Bordered, prominent", "Capsule filled with the tint, white label."],
  ["borderless", "Borderless", "Label only."],
];
const STATES = [
  { title: "Enabled", enabled: true, destructive: false },
  { title: "Disabled", enabled: false, destructive: false },
  { title: "Destructive", enabled: true, destructive: true },
  { title: "Destructive, disabled", enabled: false, destructive: true },
];

export default function ButtonsContentArea(): Markup {
  return (
    <Page title="Buttons in content" subtitle="Flat buttons for content areas. Source: figma/reference/ios27/specs/03-controls/Buttons__Button---Content-Area.json">
      {STYLES.map(([style, title, description]) => (
        <Section title={title} description={`${description} Small 28, Medium 34, Large 50 pt tall.`} gap={10}>
          {CONTENT.flatMap(([content, contentName]) =>
            MODES.map((mode) => (
              <Row columns={4} width={200}>
                {STATES.map((state) => (
                  <Variant title={`${contentName}, ${state.title}`} caption={`${name(mode)}, Style=${title}, Is Enabled=${state.enabled}, Destructive=${state.destructive}. Small, Medium, Large`}>
                    <Surface mode={mode} level={2} width={200} class="flex flex-col items-center gap-3 py-4">
                      {SIZES.map((size) => (
                        <ContentButton mode={mode} size={size} style={style} content={content} enabled={state.enabled} destructive={state.destructive} />
                      ))}
                    </Surface>
                  </Variant>
                ))}
              </Row>
            ))
          )}
        </Section>
      ))}
    </Page>
  );
}
