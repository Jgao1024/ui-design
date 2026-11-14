import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { SearchField } from "../../components/text-field.tsx";
import type { FieldState } from "../../components/text-field.tsx";

const STATES: { state: FieldState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Magnifier black 85%, clear button black 50%." },
  { state: "focused", title: "Focused", caption: "Focus ring and accent cursor after the text." },
  { state: "disabled", title: "Disabled", caption: "Fill at 50%; Figma keeps the symbol colours, the dimming is inferred." },
];

export default function SearchFields(): Markup {
  return (
    <Page title="Search Fields" subtitle="macOS 27 · Figma page Search Fields. 120 × 24 capsule; magnifier at 8 px, text at 26 px, clear button at 96 px.">
      <Section title="With text" description="Text = True: the text is the Figma default, Search, and the clear button shows." gap={12}>
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <SurfacePair width={176} height={56} draw={(mode) => <SearchField mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Empty" description="Text = False: Figma exports only the magnifier; no placeholder is drawn." gap={12}>
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title}>
              <SurfacePair width={176} height={56} draw={(mode) => <SearchField mode={mode} state={item.state} text={false} />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
