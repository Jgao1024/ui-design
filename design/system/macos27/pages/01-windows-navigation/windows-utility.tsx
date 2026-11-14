import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair, SurfacePair } from "../../components/stage.tsx";
import { TABS, TabBar, UtilityPanel } from "../../components/utility-panel.tsx";

export default function WindowsUtility(): Markup {
  return (
    <Page title="Utility Panel" subtitle="macOS 27 · Figma page Windows, Utility Panel">
      <Section title="Utility panel" description="300 × 300, radius 15. The header holds 10 px window controls, the title and a tab bar." gap={12}>
        <Row columns={1} width={668}>
          <Variant title="Active">
            <ModePair width={330} height={350} draw={(mode) => <UtilityPanel mode={mode} active />} />
          </Variant>
        </Row>
        <Row columns={1} width={668}>
          <Variant title="Inactive">
            <ModePair width={330} height={350} draw={(mode) => <UtilityPanel mode={mode} active={false} />} />
          </Variant>
        </Row>
      </Section>

      <Section title="Tab bar" description="Five tabs, 44 × 30, radius 6. The selected tab sits on small Liquid Glass." gap={12}>
        <Row columns={2} width={468}>
          {[0, 4].map((index) => (
            <Variant title={`${TABS[index][0]} selected`}>
              <SurfacePair width={230} height={50} draw={(mode) => <TabBar mode={mode} selected={index} />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
