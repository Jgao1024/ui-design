import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { EditMenu, type MenuItem, MenuPanel } from "../../components/overlays.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

const ITEMS: MenuItem[] = [
  { label: "Action", icon: "star" },
  { label: "Action", icon: "share" },
  { label: "Selected", check: true },
  { separator: true } as MenuItem,
  { label: "Submenu", sub: true },
  { label: "Disabled", disabled: true },
  { label: "Delete", icon: "trash", destructive: true },
];
const SHORTCUTS: MenuItem[] = [
  { label: "Copy", shortcut: "⌘C" },
  { label: "Paste", shortcut: "⌘V" },
  { label: "Select All", shortcut: "⌘A" },
];

export default function Menus(): Markup {
  return (
    <Page title="Menus" subtitle="Source: figma/reference/ios27/specs/06-overlays/Menus__*.json">
      <Section title="Menu" description="238 wide Regular Medium glass. Optional 56 pt control group on top; items 40 pt tall with a checkmark column, label, shortcut, submenu chevron or trailing symbol. Disabled is dimmed, destructive is red." gap={10}>
        <Row columns={2} width={300}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={`With control group, ${mode === "light" ? "Light" : "Dark"}`} caption="Menu: Control Group + Menu Items; States Default, Destructive, Disabled">
              <Wallpaper mode={mode} width={300} height={470}><MenuPanel mode={mode} items={ITEMS} control /></Wallpaper>
            </Variant>
          ))}
        </Row>
        <Row columns={2} width={300}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={`With shortcuts, ${mode === "light" ? "Light" : "Dark"}`} caption="Show Shortcut=True">
              <Wallpaper mode={mode} width={300} height={260}><MenuPanel mode={mode} items={SHORTCUTS} /></Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Edit menu" description="232 x 44 capsule of text actions with a 36 pt chevron button for more." gap={10}>
        <Row columns={2} width={300}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={mode === "light" ? "Light" : "Dark"} caption="Edit Menu">
              <Wallpaper mode={mode} width={300} height={120}><EditMenu mode={mode} /></Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
