import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { tabBarSections } from "./tab-bars.tsx";

export default function TabBarsMinimized(): Markup {
  return (
    <Page title="Tab bars, minimized" subtitle="iPhone tab bar after scrolling: 40 pt tall, symbols only. Source: figma/reference/ios27/specs/01-navigation/Tab-Bars__Tab-Bar---iPhone.json (Minimized=True)">
      {tabBarSections(true)}
    </Page>
  );
}
