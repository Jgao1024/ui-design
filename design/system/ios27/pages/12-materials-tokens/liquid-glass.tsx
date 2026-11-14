import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ClearGlass, RegularGlass, SmallGlass } from "../../components/liquid-glass.tsx";
import { ScrollEdge } from "../../components/scroll-edge.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

export default function LiquidGlass(): Markup {
  return (
    <Page
      title="Liquid Glass"
      subtitle="iOS 27 Materials. Source: figma/reference/ios27/specs/08-tokens/Materials__*.json"
    >
      <Section
        title="Regular - Medium and Large"
        description="Both share every Figma number. 160 x 160, radius 34, drop shadow 0 8 48 (25% Light, 45% Dark), rim #DBDBDB Light and #A6A6A6 Dark."
        gap={10}
      >
        <Row columns={4} width={240}>
          <Variant title="Medium, Light" caption="Mode=Light">
            <Wallpaper mode="light" width={240} height={240}><RegularGlass mode="light" /></Wallpaper>
          </Variant>
          <Variant title="Medium, Dark" caption="Mode=Dark">
            <Wallpaper mode="dark" width={240} height={240}><RegularGlass mode="dark" /></Wallpaper>
          </Variant>
          <Variant title="Large, Light" caption="Mode=Light">
            <Wallpaper mode="light" width={240} height={240}><RegularGlass mode="light" /></Wallpaper>
          </Variant>
          <Variant title="Large, Dark" caption="Mode=Dark">
            <Wallpaper mode="dark" width={240} height={240}><RegularGlass mode="dark" /></Wallpaper>
          </Variant>
        </Row>
      </Section>

      <Section
        title="Regular - Small"
        description="A 48 pt circle. Inactive is a flat fill with a hairline rim. Active is glass. Active + Prominent is glass over a #0088FF tint."
        gap={10}
      >
        {(["light", "dark"] as const).map((mode) => (
          <Row columns={3} width={240}>
            <Variant title={`${mode === "light" ? "Light" : "Dark"}, inactive`} caption="Active=False, Prominent=False or True (same fill)">
              <Wallpaper mode={mode} width={240} height={96} band={32}><SmallGlass mode={mode} active={false} prominent={false} /></Wallpaper>
            </Variant>
            <Variant title={`${mode === "light" ? "Light" : "Dark"}, active`} caption="Active=True, Prominent=False">
              <Wallpaper mode={mode} width={240} height={96} band={32}><SmallGlass mode={mode} active={true} prominent={false} /></Wallpaper>
            </Variant>
            <Variant title={`${mode === "light" ? "Light" : "Dark"}, active prominent`} caption="Active=True, Prominent=True">
              <Wallpaper mode={mode} width={240} height={96} band={32}><SmallGlass mode={mode} active={true} prominent={true} /></Wallpaper>
            </Variant>
          </Row>
        ))}
      </Section>

      <Section
        title="Clear"
        description="160 x 160, radius 23. One set of numbers for both modes: no tint, rim #CCCCCC, shadow 0 8 15 at 2%."
        gap={10}
      >
        <Row columns={2} width={240}>
          <Variant title="On light wallpaper">
            <Wallpaper mode="light" width={240} height={240}><ClearGlass /></Wallpaper>
          </Variant>
          <Variant title="On dark wallpaper">
            <Wallpaper mode="dark" width={240} height={240}><ClearGlass /></Wallpaper>
          </Variant>
        </Row>
      </Section>

      <Section
        title="Scroll Edge Effect - Soft"
        description="Progressive background blur (radius 10) under a gradient mask, 200 pt deep. One set of numbers for both modes."
        gap={10}
      >
        <Row columns={4} width={200}>
          <Variant title="Top, Light" caption="Edge=Top">
            <ScrollEdge kind="soft" edge="top" mode="light" />
          </Variant>
          <Variant title="Top, Dark" caption="Edge=Top">
            <ScrollEdge kind="soft" edge="top" mode="dark" />
          </Variant>
          <Variant title="Bottom, Light" caption="Edge=Bottom">
            <ScrollEdge kind="soft" edge="bottom" mode="light" />
          </Variant>
          <Variant title="Bottom, Dark" caption="Edge=Bottom">
            <ScrollEdge kind="soft" edge="bottom" mode="dark" />
          </Variant>
        </Row>
      </Section>

      <Section
        title="Scroll Edge Effect - Hard"
        description="A 200 pt bar with background blur 6. Light: white 85%. Dark: black 55%. Hairline 0.67 on the inner edge."
        gap={10}
      >
        <Row columns={4} width={200}>
          <Variant title="Top, Light" caption="Mode=Light, Edge=Top">
            <ScrollEdge kind="hard" edge="top" mode="light" />
          </Variant>
          <Variant title="Top, Dark" caption="Mode=Dark, Edge=Top">
            <ScrollEdge kind="hard" edge="top" mode="dark" />
          </Variant>
          <Variant title="Bottom, Light" caption="Mode=Light, Edge=Bottom">
            <ScrollEdge kind="hard" edge="bottom" mode="light" />
          </Variant>
          <Variant title="Bottom, Dark" caption="Mode=Dark, Edge=Bottom">
            <ScrollEdge kind="hard" edge="bottom" mode="dark" />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
