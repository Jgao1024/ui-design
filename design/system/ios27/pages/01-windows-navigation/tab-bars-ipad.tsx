import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { TabBarPad } from "../../components/tab-bar.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

export default function TabBarsIpad(): Markup {
  return (
    <Page title="Tab bars, iPad" subtitle="iPad top tab bar. Source: figma/reference/ios27/specs/01-navigation/Tab-Bars__Tab-Bar---iPad.json and the _Tab Bar Button - iPad components">
      <Section title="Tab bar" description="A 44 pt glass capsule. Tabs are 36 pt tall with 15/20 labels. The sidebar and search buttons are 54 x 36 and optional." gap={10}>
        {[
          { title: "Tabs only", sidebar: false, search: false },
          { title: "With sidebar button", sidebar: true, search: false },
          { title: "With sidebar and search", sidebar: true, search: true },
        ].map((config) => (
          <Row columns={2} width={640}>
            <Variant title={`${config.title}, Light`} caption={`Show Sidebar=${config.sidebar}, Show Search=${config.search}`}>
              <Wallpaper mode="light" width={640} height={110} band={30}><TabBarPad mode="light" sidebar={config.sidebar} search={config.search} /></Wallpaper>
            </Variant>
            <Variant title={`${config.title}, Dark`} caption={`Show Sidebar=${config.sidebar}, Show Search=${config.search}`}>
              <Wallpaper mode="dark" width={640} height={110} band={30}><TabBarPad mode="dark" sidebar={config.sidebar} search={config.search} /></Wallpaper>
            </Variant>
          </Row>
        ))}
      </Section>
      <Section title="Selection" description="Each tab selected in turn. Selected: capsule fill #EDEDED Light, #121212 Dark." gap={10}>
        {[0, 2, 4].map((selected) => (
          <Row columns={2} width={640}>
            <Variant title={`Tab ${selected + 1} selected, Light`}>
              <Wallpaper mode="light" width={640} height={110} band={30}><TabBarPad mode="light" selected={selected} sidebar search /></Wallpaper>
            </Variant>
            <Variant title={`Tab ${selected + 1} selected, Dark`}>
              <Wallpaper mode="dark" width={640} height={110} band={30}><TabBarPad mode="dark" selected={selected} sidebar search /></Wallpaper>
            </Variant>
          </Row>
        ))}
      </Section>
    </Page>
  );
}
