import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { AppIcon } from "../../components/system.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";
import { Surface } from "../../components/surface.tsx";

export default function AppIcons(): Markup {
  return (
    <Page title="App icons" subtitle="Source: figma/reference/ios27/specs/07-system/System__App-Icon-*.json and App-Icons___*.json. Icon artwork in Figma is bitmap; these are placeholders.">
      <Section title="App icon" description="iPhone: 64 pt icon with a 12 pt name 5 pt below it; badge 34 x 24. iPad: 68 pt icons. Corner radius is 26 % of the side." gap={10}>
        <Row columns={4} width={200}>
          {(["light", "dark"] as const).flatMap((mode) =>
            [["Icon", false], ["Icon with badge", true]].map(([title, badge]) => (
              <Variant title={`${title}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Show App Name=True, Show Badge=${badge}`}>
                <Wallpaper mode={mode} width={200} height={140}><div style="color:#fff"><AppIcon index={3} name="App Name" badge={Boolean(badge)} /></div></Wallpaper>
              </Variant>
            ))
          )}
        </Row>
      </Section>
      <Section title="Icon grid" description="The 256 pt construction grid: a 66.56 pt corner radius on the square, with three concentric circles of 205, 128 and 51 pt." gap={10}>
        <Row columns={1} width={300}>
          <Variant title="Grid" caption="_Icon Grid">
            <Surface mode="light" width={300} height={300} class="grid place-items-center">
              <div class="relative size-[256px]" style="border-radius:66.56px;box-shadow:inset 0 0 0 1px #ff3b30">
                {[205, 128, 51].map((d) => <span class="absolute rounded-full" style={`left:${(256 - d) / 2}px;top:${(256 - d) / 2}px;width:${d}px;height:${d}px;box-shadow:inset 0 0 0 1px #007aff`} />)}
                <span class="absolute left-1/2 top-0 h-full w-px" style="background:#007aff" /><span class="absolute left-0 top-1/2 h-px w-full" style="background:#007aff" />
              </div>
            </Surface>
          </Variant>
        </Row>
      </Section>
      <Section title="Sizes" description="A 2 x 6 sample of icon colours at 64 pt." gap={10}>
        <Row columns={1} width={560}>
          <Variant title="Samples">
            <Wallpaper mode="light" width={560} height={110}><div class="flex gap-4 text-white">{[0, 1, 2, 3, 4, 5].map((i) => <AppIcon index={i} />)}</div></Wallpaper>
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
