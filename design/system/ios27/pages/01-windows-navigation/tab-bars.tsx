import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { TabBarPhone, type TabKind } from "../../components/tab-bar.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

const KINDS: { kind: TabKind; title: string; description: string }[] = [
  { kind: "default", title: "Default", description: "One glass bar, 62 pt tall, 360 wide. Tabs share the width; the selected tab sits in a capsule." },
  { kind: "search", title: "Search Role", description: "The bar shortens and a separate 54 pt glass circle holds search." },
  { kind: "prominent", title: "Prominent Tab", description: "As Search Role, with the selected tab filled in the tint colour." },
];

/// `minimized` is passed by the sibling page; the layout is the same.
export function tabBarSections(minimized: boolean): Markup[] {
  const height = minimized ? 100 : 130;
  return KINDS.map(({ kind, title, description }) => (
    <Section title={title} description={description} gap={10}>
      {([2, 3, 4, 5] as const).map((tabs) => (
        <Row columns={2} width={402}>
          <Variant title={`${tabs} tabs, Light`} caption={`Minimized=${minimized ? "True" : "False"}, Tabs=${tabs}, Type=${title}`}>
            <Wallpaper mode="light" width={402} height={height} band={20}><TabBarPhone mode="light" tabs={tabs} kind={kind} minimized={minimized} /></Wallpaper>
          </Variant>
          <Variant title={`${tabs} tabs, Dark`} caption={`Minimized=${minimized ? "True" : "False"}, Tabs=${tabs}, Type=${title}`}>
            <Wallpaper mode="dark" width={402} height={height} band={20}><TabBarPhone mode="dark" tabs={tabs} kind={kind} minimized={minimized} /></Wallpaper>
          </Variant>
        </Row>
      ))}
    </Section>
  ));
}

export default function TabBars(): Markup {
  return (
    <Page title="Tab bars" subtitle="iPhone tab bar, expanded. Source: figma/reference/ios27/specs/01-navigation/Tab-Bars__Tab-Bar---iPhone.json">
      {tabBarSections(false)}
    </Page>
  );
}
