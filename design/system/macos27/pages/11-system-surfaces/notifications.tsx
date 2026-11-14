import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Notification } from "../../components/system-surface.tsx";

export default function Notifications(): Markup {
  return (
    <Page title="Notifications" subtitle="macOS 27 · Figma page Notifications. 344 × 77 Liquid Glass banners.">
      <Section
        title="Banner"
        description="Radius 20, 10 px side and 12 px top padding. The 32 px app icon is a stand-in for Figma's image. Title is 13 pt Bold; the message below it is 13 pt Medium; texts are the Figma defaults, Title and Message."
        gap={12}
      >
        <Row columns={2} width={568}>
          <Variant title="Stack = False" caption="A single banner, 344 × 77.">
            <ModePair width={276} height={136} draw={(mode) => <div style="transform:scale(0.78);flex:none"><Notification mode={mode} /></div>} />
          </Variant>
          <Variant title="Stack = True" caption="A second banner shows 8 px below the first, inset 16 px on each side.">
            <ModePair width={276} height={136} draw={(mode) => <div style="transform:scale(0.78);flex:none"><Notification mode={mode} stack /></div>} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
