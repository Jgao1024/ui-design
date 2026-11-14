import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Alert, AlertButton } from "../../components/overlay.tsx";
import type { AlertButtonType } from "../../components/overlay.tsx";

const TYPES: { type: AlertButtonType; title: string; caption: string }[] = [
  { type: "primary", title: "Primary", caption: "Fill #0088FF, label white." },
  { type: "secondary", title: "Secondary", caption: "Fill #E6E6E6, label black 85%." },
  { type: "destructive", title: "Destructive", caption: "Fill #F52F32 at 23%, label #F52F32." },
];

export default function Alerts(): Markup {
  return (
    <Page title="Alerts" subtitle="macOS 27 · Figma page Alerts. 260 px Liquid Glass panels; Dark button colours are inferred.">
      <Section
        title="Alert"
        description="Radius 34, 16 px side and 20 px top padding. A bold 13 pt title, an 11 pt description, then buttons. Texts are Figma's. The optional icon is a stand-in for Figma's image."
        gap={12}
      >
        <Row columns={2} width={568}>
          <Variant title="Stacked" caption="Three 228 × 28 buttons, 6 px apart: Primary, plain, Secondary. 260 × 216.">
            <ModePair width={276} height={256} draw={(mode) => <Alert mode={mode} layout="stacked" />} />
          </Variant>
          <Variant title="Side by side" caption="Two 110 × 32 buttons, 8 px apart. 260 × 152.">
            <ModePair width={276} height={256} draw={(mode) => <Alert mode={mode} layout="side-by-side" />} />
          </Variant>
        </Row>
        <Row columns={2} width={568}>
          <Variant title="Stacked · With icon" caption="Show Icon = True: a 64 px icon above the title, 78 px taller (inferred: 294).">
            <ModePair width={276} height={334} draw={(mode) => <Alert mode={mode} layout="stacked" icon />} />
          </Variant>
          <Variant title="Side by side · With icon" caption="230 px high (inferred).">
            <ModePair width={276} height={334} draw={(mode) => <Alert mode={mode} layout="side-by-side" icon />} />
          </Variant>
        </Row>
      </Section>
      <Section title="Alert buttons" description="160 × 28 capsules, SF Pro Medium 13 pt." gap={12}>
        <Row columns={3} width={360}>
          {TYPES.map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <ModePair width={176} height={56} draw={(mode) => <AlertButton mode={mode} type={item.type} width={160} />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
