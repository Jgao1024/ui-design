import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Surface } from "../../components/surface.tsx";
import { textCss } from "../../components/text.tsx";
import { Icon } from "../../components/icon.tsx";
import { type Mode, tone } from "../../theme.ts";

function Field(props: { mode: Mode; state: "placeholder" | "focused" | "typing" | "value" }): Markup {
  const t = tone(props.mode);
  const text = props.state === "placeholder" || props.state === "focused" ? "Placeholder" : props.state === "typing" ? "Hello wor" : "Hello world";
  return (
    <div class="flex h-[52px] w-[402px] items-center px-4" style={`background:${t.groupedRow};${textCss("body")};color:${props.state === "placeholder" || props.state === "focused" ? t.label3 : t.label}`}>
      {props.state === "focused" && <span class="mr-0.5 h-6 w-0.5" style={`background:${t.blue}`} />}
      <span class="flex-1">{text}</span>
      {props.state === "typing" && <span class="mr-3 h-6 w-0.5" style={`background:${t.blue}`} />}
      {props.state === "typing" && <span style={`color:${t.label3}`}><Icon name="xmark" size={18} /></span>}
    </div>
  );
}

export default function TextFields(): Markup {
  return (
    <Page title="Text fields" subtitle="Source: figma/reference/ios27/specs/04-input/Text-Fields__Text-Field.json">
      <Section title="Text field" description="402 x 52 row with 16 pt side padding and 17/22 text. States: placeholder, focused (caret at the start), typing (caret and clear button), value entered." gap={10}>
        {(["placeholder", "focused", "typing", "value"] as const).map((state) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${state[0].toUpperCase() + state.slice(1)}, ${mode === "light" ? "Light" : "Dark"}`} caption={`State=${state === "value" ? "Value Entered" : state[0].toUpperCase() + state.slice(1)}`}>
                <Surface mode={mode} level="grouped" width={402} height={92} radius={0} class="grid place-items-center"><Field mode={mode} state={state} /></Surface>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
