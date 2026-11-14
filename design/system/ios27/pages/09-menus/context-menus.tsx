import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { type MenuItem, MenuPanel } from "../../components/overlays.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";
import { tone } from "../../theme.ts";

const ITEMS: MenuItem[] = [{ label: "Copy", icon: "copy" }, { label: "Share", icon: "share" }, { separator: true } as MenuItem, { label: "Delete", icon: "trash", destructive: true }];

export default function ContextMenus(): Markup {
  return (
    <Page title="Context menus" subtitle="Source: figma/reference/ios27/specs/06-overlays/Contextual-Menus__*.json">
      <Section title="Vertical" description="A content preview (351 x 161, radius 30, shadow 0 0 32 at 20 %) with the menu below it, on the trailing or leading side. The screen behind is dimmed." gap={10}>
        {(["trailing", "leading"] as const).map((side) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${side === "trailing" ? "Trailing" : "Leading"}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Alignment=Vertical, Side=${side === "trailing" ? "Trailing" : "Leading"}`}>
                <Wallpaper mode={mode} width={402} height={470}>
                  <div class="absolute inset-0" style="background:rgb(0 0 0 / 0.2)" />
                  <div class={`absolute top-8 flex flex-col gap-2.5 ${side === "trailing" ? "right-6 items-end" : "left-6 items-start"}`}>
                    <div class="h-[161px] w-[351px] rounded-[30px]" style={`background:${tone(mode).bg};box-shadow:0 0 32px rgb(0 0 0 / 0.2)`} />
                    <MenuPanel mode={mode} items={ITEMS} />
                  </div>
                </Wallpaper>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
      <Section title="Horizontal (iPad only)" description="The menu sits beside the preview instead of below it." gap={10}>
        <Row columns={2} width={640}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={`Trailing, ${mode === "light" ? "Light" : "Dark"}`} caption="Alignment=Horizontal, Side=Trailing">
              <Wallpaper mode={mode} width={640} height={300}>
                <div class="absolute inset-0" style="background:rgb(0 0 0 / 0.2)" />
                <div class="absolute left-6 top-8 flex gap-4">
                  <div class="h-[161px] w-[351px] rounded-[30px]" style={`background:${tone(mode).bg};box-shadow:0 0 32px rgb(0 0 0 / 0.2)`} />
                  <MenuPanel mode={mode} items={ITEMS} width={250} />
                </div>
              </Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
