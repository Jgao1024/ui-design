import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { TabBarDuo } from "../../components/tab-bar.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

export default function TabBarsDuo(): Markup {
  return (
    <Page title="Tab bars, iPhone Duo" subtitle="The upright tab bar of iPhone Duo, 48 pt wide. Source: figma/reference/ios27/specs/01-navigation/Tab-Bars__Tab-Bar---iPhone-Duo.json">
      {[false, true].map((search) => (
        <Section title={search ? "With search" : "Tabs only"} description={search ? "The search button is a separate 48 pt glass circle 12 pt below the bar." : "Glass bar 48 pt wide; tabs overlap by 7.3 pt."} gap={10}>
          <Row columns={8} width={120}>
            {([2, 3, 4, 5] as const).flatMap((tabs) =>
              (["light", "dark"] as const).map((mode) => (
                <Variant title={`${tabs} tabs, ${mode === "light" ? "Light" : "Dark"}`} caption={`Tabs=${tabs}`}>
                  <Wallpaper mode={mode} width={120} height={search ? 340 : 280} band={40}><TabBarDuo mode={mode} tabs={tabs} search={search} /></Wallpaper>
                </Variant>
              ))
            )}
          </Row>
        </Section>
      ))}
    </Page>
  );
}
