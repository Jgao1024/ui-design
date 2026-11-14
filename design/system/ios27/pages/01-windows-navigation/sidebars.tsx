import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { SidebarColumn } from "../../components/sidebar.tsx";

export default function Sidebars(): Markup {
  return (
    <Page title="Sidebars" subtitle="iPadOS sidebar column. Source: figma/reference/ios27/specs/01-navigation/Sidebars__Sidebar.json and Sidebars__BG.json">
      <Section
        title="Sidebar"
        description="320 x 802 on the translucent sidebar material. Docked has a 32 pt top inset, floating window 10 pt; both have 10 pt side insets. Active and inactive windows differ in the material only."
        gap={10}
      >
        <Row columns={4} width={320}>
          <Variant title="Light, docked" caption="Floating Window=False, Active=True"><SidebarColumn mode="light" floating={false} /></Variant>
          <Variant title="Light, floating" caption="Floating Window=True, Active=True"><SidebarColumn mode="light" floating /></Variant>
          <Variant title="Dark, docked" caption="Floating Window=False, Active=True"><SidebarColumn mode="dark" floating={false} /></Variant>
          <Variant title="Dark, floating" caption="Floating Window=True, Active=True"><SidebarColumn mode="dark" floating /></Variant>
        </Row>
        <Row columns={4} width={320}>
          <Variant title="Light, inactive" caption="Active=False"><SidebarColumn mode="light" floating={false} active={false} /></Variant>
          <Variant title="Dark, inactive" caption="Active=False"><SidebarColumn mode="dark" floating={false} active={false} /></Variant>
        </Row>
      </Section>
    </Page>
  );
}
