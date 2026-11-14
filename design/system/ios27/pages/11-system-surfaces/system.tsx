import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ControlTile, Dock, HomeIndicatorBar, QuickActions } from "../../components/system.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";
import { Surface } from "../../components/surface.tsx";

const MODES = ["light", "dark"] as const;
const name = (m: "light" | "dark") => (m === "light" ? "Light" : "Dark");

export default function System(): Markup {
  return (
    <Page title="System" subtitle="Home screen, control center and system parts. Source: figma/reference/ios27/specs/07-system/System__*.json and System___*.json">
      <Section title="Home indicator" description="iPhone portrait: 144 x 5 in a 402 x 34 strip. iPhone landscape: 226 x 5. iPad: 273 x 5.5." gap={10}>
        <Row columns={3} width={402}>
          {[["iPhone, portrait", 144, 34], ["iPhone, landscape", 226, 21], ["iPad, portrait", 273, 21]].map(([title, w, h]) => (
            <Variant title={String(title)} caption={`Device, Orientation`}>
              <Surface mode="light" level={2} width={402} class="flex justify-center"><HomeIndicatorBar mode="light" width={402} height={Number(h)} w={Number(w)} /></Surface>
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Controls" description="Control Center tiles: 1 x 1 is a 70 pt circle, 2 x 1 is 155 x 70, 2 x 2 is 155 x 155. On tiles take the tint." gap={10}>
        {MODES.map((mode) => (
          <Row columns={4} width={240}>
            {[[1, 1, false], [1, 1, true], [2, 1, false], [2, 2, true]].map(([w, h, on]) => (
              <Variant title={`${w} x ${h}, ${on ? "on" : "off"}, ${name(mode)}`} caption={`On=${on}`}>
                <Wallpaper mode={mode} width={240} height={h === 2 ? 220 : 120}><ControlTile mode={mode} w={w as 1 | 2} h={h as 1 | 2} on={Boolean(on)} /></Wallpaper>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
      <Section title="Home Screen Quick Actions" description="A 250 wide glass menu with 42 pt action rows: 26 pt side padding, 14 pt between symbol and label. Destructive is red." gap={10}>
        <Row columns={2} width={300}>
          {MODES.map((mode) => (
            <Variant title={`Actions, ${name(mode)}`} caption="_HSQA - Actions">
              <Wallpaper mode={mode} width={300} height={260}><QuickActions mode={mode} /></Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Dock, iPad" description="740 x 107 on the dock material (radius 38), 19.5 pt padding and gaps, 68 pt icons." gap={10}>
        {MODES.map((mode) => (
          <Row columns={1} width={800}>
            <Variant title={`Dock, ${name(mode)}`} caption="_Dock - iPad, _Dock Material">
              <Wallpaper mode={mode} width={800} height={170}><Dock mode={mode} icons={6} /></Wallpaper>
            </Variant>
          </Row>
        ))}
      </Section>
    </Page>
  );
}
